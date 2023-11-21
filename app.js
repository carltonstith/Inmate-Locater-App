const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose  = require('mongoose');

// Routes which should handle requests
const inmateRoutes = require('./api/routes/inmates');

// Connect to MongoDB
// process.env.MONGO_ATLAS_PW is a global variable set in nodemon.json => .env
mongoose.connect('mongodb+srv://cstith:'+process.env.MONGODB_PW+'@inmatelocatorapp.hx0xnwg.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });

// Middleware
app.use(morgan('dev')); // logs requests to the console
app.use(bodyParser.urlencoded({extended: false})); // false because we don't want to parse extended bodies
app.use(bodyParser.json()); // extract json data and make it readable

// CORS error handling
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // allow access to any client
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // allow these headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); // allow these methods
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
//app.use('/inmates', inmateRoutes);

// test route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Error handling
app.use((req, res, next) => {
    const error = new Error('Not found'); // create new error
    error.status = 404;
    next(error); // pass error to next middleware
});

app.use((error, req, res, next) => {
    res.status(error.status || 500); // set status code
    res.json({
        error: {
            message: error.message // return error message
        }
    });
}); // catch all errors

module.exports = app;