
const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const signup = async (req, res, next) => {
    
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
}

const login = async (req, res, next) => {try {
 
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
}

const logout = async(req, res, next) => {
    req.session.destroy(err => {
        if (err) {
          return res.status(500).send("Error logging out");
        }
        res.send('Logged out successfully!');
      });
}

const isloggedin = async(req, res, next) => {
    if (req.session && req.session.user) {
      res.json({ isLoggedIn: true, user: req.session.user });
    } else {
      res.json({ isLoggedIn: false });
    }
  }


const addjournal = async (req, res, next) => {
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
}

const getjournal = async (req, res, next) => {
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
}

const deleteJournalEntry = async (req, res, next) => {
  try {
      const { username, entryId } = req.params;

      const user = await User.findOne({ username });
      if (!user) {
          return res.status(404).send({ message: 'User not found' });
      }

      const journalIndex = user.journalEntries.findIndex(entry => entry._id.toString() === entryId);

      if (journalIndex !== -1) {
          user.journalEntries.splice(journalIndex, 1);
          await user.save();
          res.status(200).send({ message: 'Journal entry removed successfully' });
      } else {
          res.status(404).send({ message: 'Journal entry not found' });
      }
  } catch (error) {
      console.error('Error removing journal entry:', error);
      res.status(500).send({ message: 'Error removing journal entry', error: error.message });
  }
};


const updateAbout = async (req, res, next) => {
    try {
        const { username } = req.params;
        const { title, journey, whatIDo, contactInfo } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.aboutTitle = title || user.aboutTitle;
        user.aboutJourney = journey || user.aboutJourney;
        user.aboutWhatIDo = whatIDo || user.aboutWhatIDo;
        user.aboutContactInfo = contactInfo || user.aboutContactInfo;

        await user.save();
        res.status(200).json({ message: 'About information updated successfully' });

    } catch (error) {
        console.error('Error updating about information:', error);
        res.status(500).json({ message: 'Error updating about information', error: error.message });
    }
};


const getAbout = async (req, res, next) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }, 'aboutTitle aboutJourney aboutWhatIDo aboutContactInfo');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const aboutData = {
            title: user.aboutTitle,
            journey: user.aboutJourney,
            whatIDo: user.aboutWhatIDo,
            contactInfo: user.aboutContactInfo,
        };

        res.json(aboutData);
    } catch (error) {
        console.error('Error fetching about information:', error);
        res.status(500).json({ message: 'Error fetching about information', error: error.message });
    }
};



exports.signup = signup;
exports.login = login;
exports.logout = logout;
exports.isloggedin = isloggedin;
exports.addjournal = addjournal;
exports.getjournal = getjournal;
exports.deleteJournalEntry = deleteJournalEntry;
exports.updateAbout = updateAbout;
exports.getAbout = getAbout;
