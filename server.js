require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const User = require('./models/User');
const Plant = require('./models/Plant');
const Marketplace = require('./models/Marketplace');

const authRoutes = require('./routes/auth-routes');
const plantRoutes = require('./routes/plant-garden-routes');
const userRoutes = require('./routes/user-routes');

const reminderRoutes = require('./routes/plant-reminder-routes');

const marketRoutes = require('./routes/market-routes');

const app = express();
const PORT = 3001;

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

app.use('/', reminderRoutes);

app.use('/', marketRoutes);


// Connect to MongoDB
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

