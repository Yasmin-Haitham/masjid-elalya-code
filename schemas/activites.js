const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    Name: {type: String },
    Description:{type: String},
    Price:{type: String}
})
module.exports = mongoose.model("activites", schema);