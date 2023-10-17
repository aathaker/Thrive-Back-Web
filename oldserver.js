const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware (uncomment when you implement session management)
// app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

// Route to display plants
app.get('/plants', async (req, res) => {
    try {
        const plants = await axios.get('http://localhost:8080/api/plants');
        res.render('plants', { plants: plants.data });
    } catch (err) {
        res.status(500).send('Error fetching plants.');
    }
});

// Route to display marketplace items
app.get('/marketplace', async (req, res) => {
    const items = await axios.get('http://localhost:8080/api/marketplace');
res.render('marketplace', { items: items.data });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});


app.get('/', (req, res) => {
res.render('index');
});

app.get('/landing', (req, res) => {
    res.render('landing');
});


app.get('/add-listing', (req, res) => {
    res.render('add-listing');
});


app.post('/add-listing', async (req, res) => {
    const { name, description, price } = req.body;
    // Send data to the Java backend or directly to the database
    try {
        await axios.post('http://localhost:8080/api/marketplace', { name, description, price });
        res.redirect('/marketplace');
    } catch (error) {
        console.error('Error adding listing:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Registration route - GET
app.get('/register', (req, res) => {
    res.render('registration'); // Render the registration form
});

// Registration route - POST
app.post('/register', async (req, res) => {
    const {email, password } = req.body;
    try {
const response = await axios.post('http://localhost:8080/register', {
            email,
            password,
        });
        if (response.status === 200) {
            res.redirect('/index'); // Redirect after successful registration
        } else {
            res.status(500).send('Registration failed');
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error'); // Handle registration error
    }
});
