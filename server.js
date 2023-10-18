require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('./models/User');
const Plant = require('./models/Plant');

const app = express();
const PORT = 3001;

// Middleware
//app.use(cors());

app.use(cors({
    origin: 'http://localhost:3000', // frontend's origin
    credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Fetching plants with or without a search term
/* app.get('/api/plants', async (req, res) => {
    const searchTerm = req.query.search;
    let query = {};

    if (searchTerm) {
        query = {
            $or: [
                { name: new RegExp(searchTerm, 'i') },
                { scientificName: new RegExp(searchTerm, 'i') }
            ]
        };
    }

    try {
        const plants = await Plant.find(query);
        res.json(plants);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
        console.error(err);
    }
});
*/


app.get('/api/plants', async (req, res) => {
    const { search, difficulty, type, sunlight } = req.query;
    
    let query = {};
    
    // Search query
    if (search) {
        query.$or = [
            { name: new RegExp(search, 'i') },
            { scientificName: new RegExp(search, 'i') }
        ];
    }

    // Filters
    if (difficulty) query.difficulty = difficulty;
    if (type) query.type = type;
    if (sunlight) query.sunlight = sunlight;

    try {
        const plants = await Plant.find(query);
        res.json(plants);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
        console.error(err);
    }
});


// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = new User({ username, password });

    await user.save();
    res.json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Login attempt:', { username, password });

    if (!username || !password) {
      console.log('Login error: Username or password missing');
      return res.status(400).json({ message: 'Both username and password are required.' });
    }

    const user = await User.findOne({ username }).select('+password');  // Ensuring password field is selected

    if (!user) {
      console.log('Login error: User not found');
      return res.status(400).json({ message: 'User with provided username does not exist.' });
    }

    console.log('User found:', user.username);

    if (!user.password) {
      console.log('Login error: Password missing in DB for user', username);
      return res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }

    console.log('Attempting bcrypt comparison...');
    
    const isMatch = await bcrypt.compare(password, user.password);  // This checks the password

    console.log('Bcrypt comparison complete. Result:', isMatch);

    if (!isMatch) {
      console.log('Login error: Invalid password');
      return res.status(400).json({ message: 'Incorrect password provided.' });
    }

    req.session.user = user;
    res.json({ message: 'Logged in successfully!', user: { username: user.username } });

  } catch (error) {
    console.error('Unexpected error during login:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});




app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.send('Logged out successfully!');
  });
});




app.get('/is-logged-in', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ isLoggedIn: true, user: req.session.user });
  } else {
    res.json({ isLoggedIn: false });
  }
});

app.post('/user/:username/journal', async (req, res) => {
    try {
        const { username } = req.params;
        const { title, content } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        user.journalEntries.push({ title, content });
        await user.save();

        res.status(201).send({ message: 'Journal entry added' });
    } catch (error) {
        res.status(500).send({ message: 'Error adding journal entry', error: error.message });
    }
});


app.get('/user/:username/journal', async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.json(user.journalEntries);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching journal entries', error: error.message });
    }
});


app.post('/user/:username/garden', async (req, res) => {
    try {
        const { username } = req.params;
        const { plantName, plantType } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Check if the plant already exists or create a new one
        let plant = await Plant.findOne({ name: plantName, type: plantType });
        if (!plant) {
            plant = new Plant({ name: plantName, type: plantType });
            await plant.save();
        }

        // Push the plant's ObjectId to the user's garden
        if (!user.garden.includes(plant._id)) {
            user.garden.push(plant._id);
            await user.save();
        }

        res.status(201).send({ message: 'Plant added to garden' });
    } catch (error) {
        res.status(500).send({ message: 'Error adding plant to garden', error: error.message });
    }
});

app.get('/user/:username/garden', async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username }).populate('garden');
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.json(user.garden);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching plants from garden', error: error.message });
    }
});


// Route to remove a specific plant from the user's garden
app.delete('/user/:username/garden/:plantId', async (req, res) => {
    try {
        const { username, plantId } = req.params;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const plantIndex = user.garden.indexOf(plantId);
        if (plantIndex !== -1) {
            user.garden.splice(plantIndex, 1);
            await user.save();
            res.status(200).send({ message: 'Plant removed from garden successfully' });
        } else {
            res.status(404).send({ message: 'Plant not found in the user garden' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error removing plant from garden', error: error.message });
    }
});



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

