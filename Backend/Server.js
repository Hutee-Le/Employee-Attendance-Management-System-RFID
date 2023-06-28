var express = require('express');
var bodyParser = require("body-parser");
const cors = require('cors');
const mongoose = require('mongoose');
var app = express();
require('dotenv/config')
app.use(cors());


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//connect Database
mongoose.connect((process.env.DB_CONNECTION), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
      w: 'majority'
    }
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB', err));

//import the Routes
const deviceRoute = require('./routes/devices');
app.use('/devices', deviceRoute);
const roomRoute = require('./routes/rooms');
app.use('/rooms', roomRoute);
const customerRoute = require('./routes/customers');
app.use('/customers', customerRoute);
const employeeRoute = require('./routes/employee');
app.use('/employees', employeeRoute)

//server
var server = app.listen(5555, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
    