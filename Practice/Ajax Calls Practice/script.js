$(function () {
	const $status = $("#status");
	const $output = $("#output");

	function setStatus(message, isError) {
		$status.text("Status: " + message);
		$status.css("color", isError ? "#d73a49" : "#0f5132");
	}

	function prettyPrint(data) {
		try {
			return JSON.stringify(data, null, 2);
		} catch (e) {
			return String(data);
		}
	}

	function getResolvedEndpoint() {
		const endpoint = $("#endpoint").val().trim();
		const storyId = $("#storyId").val().trim();
		if (endpoint.includes(":id")) {
			return endpoint.replace(":id", storyId || "1");
		}
		return endpoint;
	}

	function getPayloadObject() {
		const raw = $("#payload").val().trim();
		if (!raw) {
			return null;
		}
		try {
			return JSON.parse(raw);
		} catch (err) {
			throw new Error("Payload is not valid JSON. Please fix it before POST/PUT.");
		}
	}

	function getHeaders() {
		const token = $("#authToken").val().trim();
		const authHeaderType = $("#authHeaderType").val();
		const headers = {};

		if (!token || authHeaderType === "none") {
			return headers;
		}

		if (authHeaderType === "bearer") {
			headers.Authorization = "Bearer " + token;
		}

		if (authHeaderType === "x-auth-token") {
			headers["x-auth-token"] = token;
		}

		return headers;
	}

	// This is the only function that actually sends the request.
	function sendRequest(method) {
		const baseUrl = $("#baseUrl").val().trim();
		const endpoint = getResolvedEndpoint();
		const contentType = $("#contentType").val();

		if (!baseUrl || !endpoint) {
			setStatus("Base URL and Endpoint are required.", true);
			return;
		}

		const finalUrl = baseUrl.replace(/\/$/, "") + (endpoint.startsWith("/") ? endpoint : "/" + endpoint);

		const options = {
			url: finalUrl,
			method: method,
			headers: getHeaders(),
			contentType: contentType,
			dataType: "json",
			timeout: 15000,
			success: function (response, textStatus, xhr) {
				setStatus(method + " success | HTTP " + xhr.status + " " + xhr.statusText, false);
				$output.text(prettyPrint(response));
			},
			error: function (xhr, textStatus, errorThrown) {
				setStatus(method + " failed | " + (xhr.status || "no-status") + " " + (xhr.statusText || ""), true);
				const errorPayload = {
					textStatus: textStatus,
					errorThrown: errorThrown,
					status: xhr.status,
					statusText: xhr.statusText,
					responseText: xhr.responseText
				};
				$output.text(prettyPrint(errorPayload));
			}
		};

		if (method === "POST" || method === "PUT") {
			try {
				const payloadObj = getPayloadObject();
				options.data = contentType === "application/json" ? JSON.stringify(payloadObj || {}) : payloadObj || {};
			} catch (err) {
				setStatus(err.message, true);
				$output.text("Fix payload JSON and try again.");
				return;
			}
		}

		setStatus("Sending " + method + " request to " + finalUrl + " ...", false);
		$output.text("Loading...");

		$.ajax(options);
	}

	$("#btnGet").on("click", function () {
		sendRequest("GET");
	});

	$("#btnPost").on("click", function () {
		sendRequest("POST");
	});

	$("#btnPut").on("click", function () {
		sendRequest("PUT");
	});

	$("#btnDelete").on("click", function () {
		sendRequest("DELETE");
	});

	$("#btnGeneric").on("click", function () {
		sendRequest($("#methodSelect").val());
	});

	// Helper for the special buttons so you do not need to type URLs each time.
	function setRequest(method, endpoint, payload, authHeaderType) {
		$("#methodSelect").val(method);
		$("#endpoint").val(endpoint);
		if (payload) {
			$("#payload").val(JSON.stringify(payload, null, 2));
		}
		if (authHeaderType) {
			$("#authHeaderType").val(authHeaderType);
		}
		sendRequest(method);
	}

	$("#btnStoriesList").on("click", function () {
		setRequest("GET", "/stories");
	});

	$("#btnStoryById").on("click", function () {
		setRequest("GET", "/stories/:id");
	});

	$("#btnStoryPost").on("click", function () {
		setRequest("POST", "/stories", {
			title: "New story from AJAX lab",
			content: "Created by jQuery $.ajax demo"
		});
	});

	$("#btnStoryPut").on("click", function () {
		setRequest("PUT", "/stories/:id", {
			title: "Updated story title",
			content: "Updated by jQuery $.ajax demo"
		});
	});

	$("#btnStoryDelete").on("click", function () {
		setRequest("DELETE", "/stories/:id");
	});

	$("#btnAuthRegister").on("click", function () {
		setRequest("POST", "/auth/register", {
			name: "Student Demo",
			email: "student.demo@example.com",
			password: "123456"
		}, "none");
	});

	$("#btnAuthLogin").on("click", function () {
		setRequest("POST", "/auth/login", {
			email: "student.demo@example.com",
			password: "123456"
		}, "none");
	});

	$("#btnAuthProtected").on("click", function () {
		setRequest("POST", "/auth/protected", null, "x-auth-token");
	});

	$("#btnClear").on("click", function () {
		setStatus("waiting for request...", false);
		$output.text("Response will appear here...");
	});
});
