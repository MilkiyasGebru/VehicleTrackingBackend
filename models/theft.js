const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const TheftSchema = new Schema({

    TheftLocation : {
        lat:{
            type : Number,
            required : true
        },
        lng :{
            type:Number,
            required: true
        }
    },
    PlateNumber:{
        type: String,
        required: true
    },
    TheftDate:{
        type: String,
        required: true
    },
    Owner:{
        type : Schema.Types.ObjectId,
        required: true,
        ref : "Users"
    }

})

const Theft = mongoose.model("Thefts",TheftSchema)
module.exports = Theft


