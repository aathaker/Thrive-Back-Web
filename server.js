require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const User = require('./models/User');
const Plant = require('./models/Plant');

const authRoutes = require('./routes/auth-routes');
const plantRoutes = require('./routes/plant-garden-routes');
const userRoutes = require('./routes/user-routes');

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

app.use('/', authRoutes);
app.use('/', plantRoutes);
app.use('/', userRoutes);


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

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

