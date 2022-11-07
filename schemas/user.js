const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    Name: { type: String},
    Username: { type: String,  unique: true, sparse:true },
    Password: { type: String },
    AdminFlag: { type: String },
    PhoneNumber: {type: String},
    Address: { type: String }
});

module.exports = mongoose.model("user", schema);