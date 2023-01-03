const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    Name: {type: String },
    Description:{type: String},
    PicURL:{type: String},
    BookURL:{type: String},
    ISBN:{type: String}
})
module.exports = mongoose.model("books", schema);