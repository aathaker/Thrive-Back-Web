const fs = require('fs');
const { MongoClient } = require('mongodb');
const path = require('path');

// Connection URI
const uri = 'mongodb+srv://Devs:oK6FCJzImYnrVOyQ@thrive-website.10yt2cw.mongodb.net/';

// MongoDB Client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Function to upload a file
async function uploadFile(filePath, collection) {
  try {
    const data = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    // Insert the file into the collection
    await collection.insertOne({
      name: fileName,
      data: data,
    });

    console.log(`${fileName} uploaded successfully.`);
  } catch (err) {
    console.error(`Error uploading ${filePath}: ${err}`);
  }
}

// Connect to MongoDB and upload files
async function uploadFiles() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('ThriveDataBase');
    const collection = database.collection('PlantImages'); // Replace with your actual collection name

    // Specify the directory where your JPG files are located
    const directoryPath = 'C:/Users/Lou/Documents/School/CSC 436/Thrive/Plant_Images';

    // Read the files in the directory
    const files = fs.readdirSync(directoryPath);

    // Upload each file
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      await uploadFile(filePath, collection);
    }
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the uploadFiles function
uploadFiles();