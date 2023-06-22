const routes = (app) => {
    // app.use('/demo' , require("./token"));
    app.use('/', require("./token") )
    // app.use('/token' , require("./token"));
}

module.exports = routes
