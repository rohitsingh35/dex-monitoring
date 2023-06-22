
const Demo = require('../models/demo');

const getDemos = ()=>{
    return Demo.find();
}

const statsService = {
    getDemos
}

module.exports = statsService;