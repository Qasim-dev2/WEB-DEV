$(function () {
	const $status = $("#status");
	const $output = $("#output");
	const apiBaseUrl = "https://usmanlive.com/wp-json/api/stories";

	function setStatus(message, isError) {
		$status.text("Status: " + message);
		$status.css("color", isError ? "#d73a49" : "#0f5132");
	}

	function prettyPrint(data) {
		try {
			return JSON.stringify(data, null, 2);
		} catch (error) {
			return String(data);
		}
	}

	function escapeHtml(value) {
		return String(value)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\"/g, "&quot;")
			.replace(/'/g, "&#39;");
	}

	function renderStory(story) {
		if (!story || typeof story !== "object") {
			$output.text(prettyPrint(story));
			return;
		}

		const title = story.title || story.name || story.heading || "Untitled story";
		const content = story.content || story.body || story.description || "No content provided.";
		const id = story.id || $("#storyId").val().trim() || "?";

		$output.html([
			'<div class="stories-grid">',
			'  <article class="story-card">',
			'    <div class="story-meta">Story #' + escapeHtml(id) + '</div>',
			'    <h3>' + escapeHtml(title) + '</h3>',
			'    <p>' + escapeHtml(content) + '</p>',
			'  </article>',
			'</div>'
		].join("\n"));
	}

	function loadStoryById() {
		const storyId = $("#storyId").val().trim();
		if (!storyId) {
			setStatus("Please enter a story ID.", true);
			$output.text("Story ID is required.");
			return;
		}

		const apiUrl = apiBaseUrl + "/" + encodeURIComponent(storyId);
		setStatus("Loading story from " + apiUrl + " ...", false);
		$output.text("Loading...");

		$.ajax({
			url: apiUrl,
			method: "GET",
			dataType: "json",
			timeout: 15000,
			success: function (response, textStatus, xhr) {
				setStatus("GET success | HTTP " + xhr.status + " " + xhr.statusText, false);
				renderStory(response);
			},
			error: function (xhr, textStatus, errorThrown) {
				setStatus("GET failed | " + (xhr.status || "no-status") + " " + (xhr.statusText || ""), true);
				$output.text(prettyPrint({
					textStatus: textStatus,
					errorThrown: errorThrown,
					status: xhr.status,
					statusText: xhr.statusText,
					responseText: xhr.responseText
				}));
			}
		});
	}

	function deleteStoryById() {
		const storyId = $("#storyId").val().trim();
		if (!storyId) {
			setStatus("Please enter a story ID.", true);
			$output.text("Story ID is required.");
			return;
		}

		const apiUrl = apiBaseUrl + "/" + encodeURIComponent(storyId);
		setStatus("Deleting story at " + apiUrl + " ...", false);
		$output.text("Deleting...");

		$.ajax({
			url: apiUrl,
			method: "DELETE",
			dataType: "json",
			timeout: 15000,
			success: function (response, textStatus, xhr) {
				setStatus("DELETE success | HTTP " + xhr.status + " " + xhr.statusText, false);
				$output.text(prettyPrint(response));
			},
			error: function (xhr, textStatus, errorThrown) {
				setStatus("DELETE failed | " + (xhr.status || "no-status") + " " + (xhr.statusText || ""), true);
				$output.text(prettyPrint({
					textStatus: textStatus,
					errorThrown: errorThrown,
					status: xhr.status,
					statusText: xhr.statusText,
					responseText: xhr.responseText
				}));
			}
		});
	}

	$("#btnFetchStory").on("click", loadStoryById);
	$("#btnDeleteStory").on("click", deleteStoryById);
	$("#storyId").on("keydown", function (event) {
		if (event.key === "Enter") {
			loadStoryById();
		}
	});
	$("#btnClear").on("click", function () {
		setStatus("waiting for request...", false);
		$output.text("Response will appear here...");
	});

	loadStoryById();
});
