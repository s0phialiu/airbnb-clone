const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'}, // ID of a user
    title: String,
    address: String,
    photos: [String], // Array of strings
    description: String,
    perks: [String],
    extraInfo: String,
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number,
    price: Number,
});

// Create place model
const PlaceModel = mongoose.model('Place', placeSchema)

module.exports = PlaceModel; // Now we can use our model