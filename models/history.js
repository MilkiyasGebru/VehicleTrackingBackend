const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const HistorySchema = new Schema({

    vehicleId :{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Vehicles"
    },

    locations : [{
            lat:{
                type: Number,
                required : true
            },
            lng:{
                type:Number,
                required : true
            }
        }]

    })
const HistoryPath = mongoose.model("History",HistorySchema);
module.exports = HistoryPath

