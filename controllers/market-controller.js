const User = require("../models/User");
const bcrypt = require("bcryptjs");

const Marketplace = require("../models/Marketplace");

const addItem = async (req, res, next) => {
    try {
        console.log("someer in adder");
        let currentUser = req.body.theUser;
        let currentItem = req.body.itemname;
        let currentPrice = Number(req.body.price);
        let currentCategory = req.body.category;
        // console.log("here in adder");
        // const { username, iName, itemPrice, itemCategory } = req.body;
        console.log("lass checker " + currentUser+ " " + currentItem+currentPrice+currentCategory);
        console.log(typeof currentPrice);

        // const user = await Marketplace.findOne({ userId });
        // if (!user) {
        //     return res.status(404).send({ message: 'User not found' });
        // } 

        let itemPresent = await Marketplace.findOne({userName: currentUser, itemName: currentItem});
        if(!itemPresent){
            console.log("manga");
            let theItem = new Marketplace({userName: currentUser, itemName: currentItem, price: currentPrice, category: currentCategory});
            theItem.save();
            // res.send("message: Item added to the Maeketplace");
            // res.status(201).send({ message: 'Item added to marketplace' });
        }
        // res.send("Item added successfully");
        res.status(201).send({ message: 'Item added to market' });
        // else{
        //     console.log("ken fcked up");
        //     res.send("message: Item already exists on the Maeketplace");
        // }

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