const express = require('express');
const helmet = require("helmet");
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");
const Routes = require("./api/routes/Index")
require('dotenv').config();

app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({extended:true, limit:'5mb'}));
app.use(helmet());

const port = process.env.PORT || 8000;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, authSource: 'admin' },)
    .then(() => console.log('DB Connected'))
    .catch(error => {
        console.log('connection error', error.message);
    });


const demoRoutes = require('./api/routes/demo');

app.use(cors());
app.use(express.json());
Routes(app)

app.use('/', (req, res, next) => {
    res.status(304).send('Application Server is running');
});

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Route Not Found',
    });
});

app.listen(port, () => {
    console.log(`server running on port ${port}...`);
});
