const User = require("../models/User");
const bcrypt = require("bcryptjs");

const Marketplace = require("../models/Marketplace");
const { Query } = require("mongoose");

const addItem = async (req, res, next) => {
    try {
        let currentUser = req.body.theUser;
        let currentItem = req.body.itemname;
        let currentPrice = Number(req.body.price);
        let currentCategory = req.body.category;
        let cuurentStatus = req.body.status;

        let itemPresent = await Marketplace.findOne({userName: currentUser, itemName: currentItem});
        if(!itemPresent){
            let theItem = new Marketplace({userName: currentUser, itemName: currentItem, price: currentPrice, category: currentCategory,
            status: cuurentStatus});
            await theItem.save();
        }
        
        res.status(201).send({ message: 'Item added to market' });

    } catch (error) {
        res.status(500).send({ message: 'Error adding item to marketplace', error: error.message });
    }
}

const getItems = async (req, res, next) => {
    const { search, category, price} = req.query;

    let query = {};
    
    // Search query
    if (search) {
        query.$or = [
            { itemName: new RegExp(search, 'i') }
        ];
    }

    if (category) query.category = category;

    try {
        const items = await Marketplace.find(query).exec();
        res.json(items);
        // console.log(items);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching plants from garden', error: error.message });
    }
}

async function addItemToUserPurchases(givenUsername, givenId){
    try {
        let filter = { username: givenUsername };
        let option = { upsert: true };
        let update = {
            $push: {
                purchases: givenId
            },
        };
        //using update one to update the user purchase
        // console.log("here assda");
        let result = await User.updateOne(filter, update, option);
    }
    catch{
        console.log(err);
    }
}

async function updateStatus(givenId){
    try {
        let filter = { _id: givenId };
        let updateDocument = {
            $set: {
                status: "SOLD",
            },
        };
        //using update one to update the item status
        const result = await Marketplace.updateOne(filter, updateDocument);
    }
    catch{
        console.log(err);
    }
}

const purchaseItemUser = async (req, res, next) => {
    try{
        const {username, marketId} = req.params;
        const result = await Marketplace.findOne({_id : marketId});
        if(result.status == "SALE"){
            updateStatus(marketId),
            addItemToUserPurchases(username, marketId);
            res.status(201).send({ message: 'Item purchased' });
        }
        else{
            res.status(201).send({ message: 'Item already sold' });
        }
    }
    catch(error){
        res.status(500).send({ message: 'Error purchasing the item', error: error.message });
    }
}

const getUserPurchases = async (req, res, next) => {
    try{
        const {username} = req.params;
        const response = await User.findOne({username: username});
        let theId = response.purchases;
        let finArr = [];
        for(let i=0; i<theId.length; i++){
            const newResponse = await Marketplace.findOne({_id: theId[i]});
            finArr.push(newResponse);
        }

        res.json(finArr);
        //res.status(201).send({ message: 'Item here to market' });
    }
    catch(error){

    }
}

exports.addItem = addItem;
exports.getItems = getItems;
exports.purchaseItemUser = purchaseItemUser;
exports.getUserPurchases = getUserPurchases;