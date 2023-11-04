const User = require("../models/User");

const Marketplace = require("../models/Marketplace");

const addItem = async (req, res, next) => {
    try {
        console.log("someer in adder");
        // console.log("here in adder");
        // const { username, iName, itemPrice, itemCategory } = req.body;

        // // const user = await Marketplace.findOne({ userId });
        // // if (!user) {
        // //     return res.status(404).send({ message: 'User not found' });
        // // }

        // // Check if the plant already exists or create a new one
        // const theUser = await User.findOne({ username });
        // let some = String(theUser._id);
        // console.log("jerer " + some);
        // let item = await Marketplace.findOne({ user: theUser._id, itemName: iName });
        // if (!item) {
        //     item = new Marketplace({ user: theUser._id, itemName: iName, price: itemPrice, category: itemCategory });
        //     await item.save();
        // }
        // res.status(201).send({ message: 'Item added to marketplace' });
    } catch (error) {
        res.status(500).send({ message: 'Error adding item to marketplace', error: error.message });
    }
}


exports.addItem = addItem;