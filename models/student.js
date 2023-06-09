const mongoose =require("mongoose")
const Schema = mongoose.Schema;

const studentSchema = new Schema({


    name :{
        type : String,
        required : true
    },

    school : {

        type : String,
        required: true
    },

    body:{

        type : String,
        required : true
    }



},{timestamps:true})

const Students =    mongoose.model("Students",studentSchema)

module.exports = Students