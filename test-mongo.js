const mongoose = require('mongoose');
const uri = "mongodb+srv://varunkumarp5678_db_user:varun123@cluster0.4ifucvf.mongodb.net/mediconnect?retryWrites=true&w=majority";

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("SUCCESS: Connected to MongoDB Atlas");
    process.exit(0);
  })
  .catch(err => {
    console.error("ERROR: Failed to connect");
    console.error(err);
    process.exit(1);
  });
