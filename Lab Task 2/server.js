// Require the Express.js framework
const express = require('express');

// Create an Express application instance
const app = express();

// Set EJS as the view engine for rendering templates
app.set('view engine', 'ejs');

// Serve static files (CSS, JS, images) from the 'public' folder
app.use(express.static('public'));

// GET route for the homepage - renders homepage.ejs
app.get('/', (req, res) => {
    res.render('homepage');
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
