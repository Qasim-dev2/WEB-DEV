// ===================================
// EXAMPLE 1: DOM Selection & Manipulation
// ===================================

// DOM Selection Methods:
// getElementById() - selects element by ID
// querySelector() - selects first matching element using CSS selector
// querySelectorAll() - selects all matching elements

function changeText() {
    // Select element by ID
    const element = document.getElementById('demo-text');
    element.textContent = 'Text Changed by JavaScript!';
    element.style.color = 'green';
}

function changeStyle() {
    const element = document.getElementById('demo-text');
    element.style.fontSize = '24px';
    element.style.fontWeight = 'bold';
    element.style.backgroundColor = 'yellow';
}

function resetText() {
    const element = document.getElementById('demo-text');
    element.textContent = 'Original Text';
    element.style.color = '';
    element.style.fontSize = '';
    element.style.fontWeight = '';
    element.style.backgroundColor = '';
}

// ===================================
// EXAMPLE 2: Event Listeners
// ===================================

// Event Listeners are better than inline onclick because:
// 1. Separates HTML and JavaScript (clean code)
// 2. Can add multiple listeners to same element
// 3. Easy to remove listeners
// 4. Better control over event propagation

const clickBtn = document.getElementById('clickBtn');
const hoverBtn = document.getElementById('hoverBtn');
const output = document.getElementById('output');

// Click event
clickBtn.addEventListener('click', function() {
    output.textContent = 'Button was clicked! Time: ' + new Date().toLocaleTimeString();
    output.style.backgroundColor = '#c8e6c9';
});

// Mouse enter and leave events
hoverBtn.addEventListener('mouseenter', function() {
    output.textContent = 'Mouse entered the button!';
    output.style.backgroundColor = '#fff9c4';
});

hoverBtn.addEventListener('mouseleave', function() {
    output.textContent = 'Mouse left the button!';
    output.style.backgroundColor = '#ffccbc';
});

// ===================================
// EXAMPLE 3: Input Events
// ===================================

// 'input' event fires whenever the value changes
// 'keydown' fires when key is pressed
// 'keyup' fires when key is released

const textInput = document.getElementById('textInput');
const typedText = document.getElementById('typedText');
const keyPressed = document.getElementById('keyPressed');

textInput.addEventListener('input', function(event) {
    // event.target refers to the element that triggered the event
    typedText.textContent = event.target.value;
});

textInput.addEventListener('keydown', function(event) {
    // event.key contains the key that was pressed
    keyPressed.textContent = event.key;
});

// ===================================
// EXAMPLE 4: Mouse Events
// ===================================

const mouseBox = document.getElementById('mouseBox');
const mouseEvent = document.getElementById('mouseEvent');

mouseBox.addEventListener('click', function() {
    mouseEvent.textContent = 'Event: Click';
    mouseBox.style.backgroundColor = 'lightcoral';
});

mouseBox.addEventListener('dblclick', function() {
    mouseEvent.textContent = 'Event: Double Click';
    mouseBox.style.backgroundColor = 'lightgreen';
});

mouseBox.addEventListener('mouseenter', function() {
    mouseEvent.textContent = 'Event: Mouse Enter';
    mouseBox.style.transform = 'scale(1.1)';
    mouseBox.style.transition = 'transform 0.3s';
});

mouseBox.addEventListener('mouseleave', function() {
    mouseEvent.textContent = 'Event: Mouse Leave';
    mouseBox.style.transform = 'scale(1)';
    mouseBox.style.backgroundColor = 'lightblue';
});

// ===================================
// EXAMPLE 5: Creating & Removing Elements
// ===================================

const itemInput = document.getElementById('itemInput');
const addItemBtn = document.getElementById('addItemBtn');
const itemList = document.getElementById('itemList');

addItemBtn.addEventListener('click', function() {
    const itemText = itemInput.value.trim();
    
    if (itemText === '') {
        alert('Please enter an item name!');
        return;
    }
    
    // Create new elements
    const itemDiv = document.createElement('div');
    itemDiv.className = 'list-item';
    itemDiv.style.display = 'flex';
    itemDiv.style.justifyContent = 'space-between';
    itemDiv.style.alignItems = 'center';
    
    const textSpan = document.createElement('span');
    textSpan.textContent = itemText;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.backgroundColor = '#f44336';
    
    // Remove element when delete button is clicked
    deleteBtn.addEventListener('click', function() {
        itemDiv.remove(); // Removes the element from DOM
    });
    
    // Append elements to build structure
    itemDiv.appendChild(textSpan);
    itemDiv.appendChild(deleteBtn);
    itemList.appendChild(itemDiv);
    
    // Clear input
    itemInput.value = '';
});

// ===================================
// EXAMPLE 6: Event Delegation
// ===================================

// Event Delegation: Instead of adding listeners to each item,
// add ONE listener to the parent and check which child was clicked
// This is efficient for dynamic lists

const delegationList = document.getElementById('delegationList');
const addListItemBtn = document.getElementById('addListItem');

let itemCount = 3;

// Single event listener on parent handles all children
delegationList.addEventListener('click', function(event) {
    // event.target is the element that was actually clicked
    if (event.target.classList.contains('list-item')) {
        event.target.style.backgroundColor = '#4caf50';
        event.target.style.color = 'white';
        alert('You clicked: ' + event.target.textContent);
    }
});

addListItemBtn.addEventListener('click', function() {
    itemCount++;
    const newItem = document.createElement('li');
    newItem.className = 'list-item';
    newItem.textContent = 'Item ' + itemCount;
    delegationList.appendChild(newItem);
    // No need to add event listener - parent handles it!
});

// ===================================
// EXAMPLE 7: Form Events
// ===================================

const myForm = document.getElementById('myForm');
const formOutput = document.getElementById('formOutput');

myForm.addEventListener('submit', function(event) {
    // Prevent default form submission (page reload)
    event.preventDefault();
    
    // Get form values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    
    // Display the values
    formOutput.textContent = `Form Submitted! Username: ${username}, Email: ${email}`;
    formOutput.style.color = 'green';
    formOutput.style.fontWeight = 'bold';
    
    // Reset form
    myForm.reset();
});

// ===================================
// KEY CONCEPTS SUMMARY
// ===================================

/*
DOM (Document Object Model):
- Tree structure representing HTML document
- JavaScript can access and manipulate it
- Methods: getElementById, querySelector, createElement, etc.

EVENT HANDLING:
1. Inline handlers: onclick="function()" (not recommended)
2. Event listeners: element.addEventListener('event', function)

COMMON EVENTS:
- Mouse: click, dblclick, mouseenter, mouseleave, mousemove
- Keyboard: keydown, keyup, keypress
- Form: submit, change, input, focus, blur
- Window: load, resize, scroll

EVENT OBJECT:
- Automatically passed to event handler
- Contains info about the event
- Properties: target, type, key, preventDefault(), etc.

EVENT DELEGATION:
- Attach listener to parent instead of children
- More efficient for dynamic content
- Use event.target to identify clicked element
*/