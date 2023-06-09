const express = require("express");
const morgan = require("morgan");
const sse = require('sse')
const mongoose = require('mongoose');
const Students = require('./models/student')
const Users = require('./models/users')
const {EventEmitter} = require('events');


// create express app
const app = express()
const cors = require('cors');
const Vehicles = require("./models/vehicle");
const Theft = require("./models/theft");
const HistoryPath = require("./models/history");
// app.use(cors());
app.use(express.json());
const eventEmitter = new EventEmitter();
const corsOptions = {
    origin: 'http://localhost:3000'
};
let db = ""
const dbURL = "mongodb+srv://milkiyas:milkiyas@nodetutorial.3zhvkjw.mongodb.net/node-tutorial?retryWrites=true&w=majority"
mongoose.connect(dbURL).then(function(result){
    //listen for requests
    console.log("I have connected to the database");
    const changeStream = Vehicles.watch()
    changeStream.on('change', (change) => {
        console.log('Database change:', change);

        // Emit an SSE event to all connected clients
        console.log("I am here ")
        eventEmitter.emit('database-change', change);

    });

    app.listen(3001);
    console.log("I am now listening")

}).catch(function (error) {
    console.log(error+" this is the error")
});

app.use(cors(corsOptions));

console.log("I am Listening for Requests")
app.use(express.urlencoded({extended:true}))

app.get('/updates',(req,res)=>{
    console.log("I am sending an Update")

    // const changeStream = Students.watch();
    // const client = new sse(req, res);
    // changeStream.on('change',()=>{
    //     Students.find().then((data)=>{
    //         console.log("here are all the datas " +data)
    //         data.map((student)=>{
    //             return JSON.stringify(student)
    //         })
    //
    //     })
    // })
    res.writeHead(200, {
        'Content-Type':'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    // Send SSE events to the client whenever a database change occurs
    const listener = async (change) => {
        console.log("The mongosse ID is "+change._id)
        const vehicles = await Vehicles.find()
        // console.log([students][0])
        // forEach
        // students[0].map((student)=>{
        //     console.log("The student is "+student)
        // })
        const eventData = {
            // studentID: "Miki",
            // studentName: "MIki",

            // array : [{name:"Abe",school:"AAiT"},{name:"Kide",school:"Work"}]
            array : vehicles
        };

        const event = {
            data: JSON.stringify(eventData),
            event: 'database-change'
        };

        res.write(`event: ${event.event}\n`);
        res.write(`data: ${event.data}\n\n`);
    };

    // Add SSE event listener to the eventEmitter
    eventEmitter.on('database-change', listener);

    // Handle client disconnection
    req.on('close', () => {
        eventEmitter.off('database-change', listener);
        console.log("I am Finished");
        res.end();
    });





    // // client.
    // console.log("The db is "+db)
    // db = client.db;
    // const collection = db.collection('Students');
    // const changeStream = collection.watch();
    // changeStream.on('change', () => {
    //     // Get all students from MongoDB collection
    //     collection.find().toArray((err, students) => {
    //         if (err) {
    //             console.error(err);
    //             return;
    //         }
    //
    //         // Send updated students data to all connected clients
    //         const data = JSON.stringify(students);
    //         client.send(data);
    //     });
    // });

})

app.get('/',(req,res)=>{

    console.log("Home endpoint")

    // console.log()
    Students.find().then((student)=>{
        // console.log("The students are "+student);
    })
    Students.find().then((data)=>{
        console.log(data)
        console.log("I have finished sending the update")
        return res.send(data)
    })

    // res.send({"name":"Kidus Gebru "});
})

app.post('/signIn',async (req, res) => {
    console.log(" I am here")
    const {name,password} = req.body;
    console.log(name + " "+ password)
    const user = await Users.findOne({name:name})

    if (!user){
        console.log("It is empty");
        return res.send({error:"The user does not exist"})
    }

    else if (user["password"] !== password){
        console.log("I am checking the password")
        return res.send({error:"The Password is not correct"})
    }

    else{
        console.log("I am returning the user")
        return res.send(user)
    }




})

app.post('/signUp',async (req,res)=>{

    const {name,password} = req.body
    console.log(name + " "+ password)
    const user = await Users.findOne({name:name});
    if (user ){

        console.log("The user Exists")
        return res.send({error:"user exits"})

    }
    else{
        console.log("I am going to create User")
         const newUser = await Users.create({name:name,password:password})
        return res.send(newUser)
    }

})

app.get('/location',async (req,res)=>{
        const myVehicle = await Vehicles.findById({_id:"647d7a005a2cedb1e7638611"})
        return res.send({myVehicle});

})

app.post('/updateLocation',async (req,res)=>{
    const {GeoFence,_id} = req.body;
    await Vehicles.findOneAndUpdate({_id:_id},{GeoFence:GeoFence})
    console.log("The GeoFence is "+GeoFence)
    res.send({data:"Finished"})
})

app.post('/updateEngine', async (req,res)=>{

    const {_id,Engine} = req.body;
    console.log("The id and the engine status are ",_id,"  ",Engine);
    await Vehicles.findOneAndUpdate({_id:_id}, {Engine:!Engine})
    res.send({data:"Finished"})
})

app.get('/vehicles',async (req,res)=>{
    console.log("Vehicles endPoint called")
    Vehicles.find().then((data)=>{
        return res.send(data)
        }
    )
})

app.get('/createV', async (req,res)=>{
    await Vehicles.create({
        CurrentLocation: {
            type: 'Point',
            coordinates: [40.712776, -74.005974]
        },
        PlateNumber: 'Milkiyas Gebremichael',
        Owner: '60a7cdd9c9a0d819a7e5e5b1',
        GeoFence: [
            { lat: 40.712776, lng: -74.005974 },
            { lat: 40.712776, lng: -74.005974 },
            { lat: 40.712776, lng: -74.005974 }
        ]
    })
})

app.post('/reportTheft', async(req,res)=>   {
    const today = new Date();

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(today);
    console.log("THeft has been reported")
    const {PlateNumber,Owner,TheftLocation} = req.body;
    const newTheft = await Theft.create({PlateNumber:PlateNumber,Owner:Owner,TheftLocation:TheftLocation,TheftDate:formattedDate})
    res.send({data:"Compelted"});
})

app.get('/theft', async (req,res)=>{
    console.log("Displaying thefts")
    // const {Owner} = req.body;
    // console.log("Owner is "+Owner)

    const allThefts = await Theft.find()
    res.send(allThefts)
})

app.post('/history',async (req,res)=>{
    const {VehicleId} = req.body;
    console.log("THe vehicle Id is "+VehicleId)
    const allHistory = await HistoryPath.find()
    const history = await HistoryPath.findOne({vehicleId:VehicleId})
    console.log("This is the history "+history);
    console.log("THis is the all history"+allHistory)
    res.send(history)
})

