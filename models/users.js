const mongoose =require("mongoose")
const Schema = mongoose.Schema;

const userSchema = new Schema({


    name :{
        type : String,
        required : true,
        unique : true
    },

    password : {

        type : String,
        required: true
    },

    // phonenumber : {
    //     type: String,
    //     default : "No number given",
    //
    // },
    //
    // email : {
    //     type : String,
    //     default: "No Email has been given"
    // }



},{timestamps:true})

const Users =    mongoose.model("Users",userSchema)
module.exports = Users