const mongoose =require("mongoose")
const Schema = mongoose.Schema;


// const vehicleSchema = new Schema({
//
//     CurrentLocation :{
//         type:"Point",
//         coordinates :[8.9806,38.7578]
//     },
//
//     PlateNumber:{
//         type:String,
//         required:true
//     },
//
//     Owner :{
//         type:Schema.Types.ObjectId,
//         required : true,
//         ref : "Users"
//     }
//
//
// })
const vehicleSchema = new Schema({
    CurrentLocation: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,

        }
    },
    PlateNumber: {
        type: String,
        required: true
    },
    Owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    GeoFence: [{
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    }],
    Engine : {
        type : Boolean,
        required : true
    }
});

vehicleSchema.index({ CurrentLocation: '2dsphere' });


const Vehicles = mongoose.model("Vehicles",vehicleSchema)
module.exports = Vehicles


//     [ {lat: 40.69273490217241,lng: -74.0615922861328}, {lat: 40.649313545557234, lng: -74.35170001318357},{lat: 40.44990338840387, lng: -74.3213252350688},
//     {lat: 39.713912601798675, lng: -74.00322741796873}, {lat: 40.47867518035537, lng: -73.40893573095701},{lat: 40.635832203289986, lng: -73.86298007299803}]
//
//
// css-12i7wg6-MuiPaper-root-MuiDrawer-paper {
//     color: rgba(0, 0, 0, 0.87);
//     -webkit-transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
//     transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
//     box-shadow: none;
//     overflow-y: auto;
//     display: -webkit-box;
//     display: -webkit-flex;
//     display: -ms-flexbox;
//     display: flex;
//     -webkit-flex-direction: column;
//     -ms-flex-direction: column;
//     flex-direction: column;
//     height: 100%;
//     -webkit-flex: 1 0 auto;
//     -ms-flex: 1 0 auto;
//     flex: 1 0 auto;
//     z-index: 1200;
//     -webkit-overflow-scrolling: touch;
//     position: fixed;
//     top: 0;
//     outline: 0;
//     left: 0;
//     border-right: 1px solid rgba(0, 0, 0, 0.12);
// }
//
// .css-1kgoj96-MuiDrawer-docked .MuiDrawer-paper {
//     width: 240px;
//     box-sizing: border-box;
// }