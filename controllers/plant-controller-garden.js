
const { validationResult } = require("express-validator");
const Plant = require("../models/Plant");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const addplant = async (req, res, next) => {
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
}

const getplant = async (res, req, next) => {
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
}

const deleteplant = async (res,req,next) => {
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
}

const filterplant = async (req, res, next) => {
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
}

exports.addplant = addplant;
exports.getplant = getplant;
exports.deleteplant = deleteplant;
exports.filterplant = filterplant;