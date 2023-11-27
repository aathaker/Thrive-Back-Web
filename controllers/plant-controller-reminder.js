const User = require("../models/User");

const addreminder = async (req, res, next) => {
        
        try {
            const { username } = req.params;
            const { plant, content, date, interval } = req.body;
        
            if (!plant || !content || !date || !interval) {
            return res.status(400).json({ message: 'Title and content are required.' });
            }
        
            const user = await User.findOne({ username });
        
            if (!user) {
            return res.status(400).json({ message: 'User not found' });
            }
        
            const newreminder = { plant, content, date, interval};
        
            user.reminderEntries.push(newreminder);
        
            await user.save();
            res.status(201).json({ message: 'reminder added successfully!' });
        
        } catch (error) {
            console.error('reminder error:', error.message);
            res.status(500).json({ message: 'Server error' });
        }
    }

const getreminder = async (req, res, next) => {
        try {
            const { username } = req.params;
        
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }
        
            res.json(user.reminderEntries);
        } catch (error) {
            console.error('reminder error:', error.message);
            res.status(500).json({ message: 'Server error' });
        }
    }

const deletereminder = async (req, res, next) => {
        try {
            const { username, plant } = req.params;
        
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }
            print(plant)
            user.reminderEntries = user.reminderEntries.filter(entry => entry.plant !== plant);
            await user.save();
        
            res.status(200).json({ message: 'reminder deleted successfully!' });
        } catch (error) {
            console.error('reminder error:', error.message);
            res.status(500).json({ message: 'Server error' });
        }
    }

exports.addreminder = addreminder;
exports.getreminder = getreminder;
exports.deletereminder = deletereminder;