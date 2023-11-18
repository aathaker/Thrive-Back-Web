const User = require("../models/User");
const bcrypt = require("bcryptjs");

const Marketplace = require("../models/Marketplace");

const addItem = async (req, res, next) => {
    try {
        // console.log("someer in adder");
        let currentUser = req.body.theUser;
        let currentItem = req.body.itemname;
        let currentPrice = Number(req.body.price);
        let currentCategory = req.body.category;
        // console.log("here in adder");
        // const { username, iName, itemPrice, itemCategory } = req.body;
        // console.log("lass checker " + currentUser+ " " + currentItem+currentPrice+currentCategory);

        // const user = await Marketplace.findOne({ userId });
        // if (!user) {
        //     return res.status(404).send({ message: 'User not found' });
        // } 

        let itemPresent = await Marketplace.findOne({userName: currentUser, itemName: currentItem});
        if(!itemPresent){
            let theItem = new Marketplace({userName: currentUser, itemName: currentItem, price: currentPrice, category: currentCategory});
            await theItem.save();
            // res.send("message: Item added to the Maeketplace");
            // res.status(201).send({ message: 'Item added to marketplace' });
        }
        // res.send("Item added successfully");
        res.status(201).send({ message: 'Item added to market' });

    } catch (error) {
        res.status(500).send({ message: 'Error adding item to marketplace', error: error.message });
    }
}

const getItems = async (req, res, next) => {
    try {
        const items = await Marketplace.find({}).exec();
        res.json(items);
        // console.log(items);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching plants from garden', error: error.message });
    }
}


exports.addItem = addItem;
exports.getItems = getItems;