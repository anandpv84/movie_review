const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
})

const admins = mongoose.model("admins",adminSchema)
module.exports = admins;
