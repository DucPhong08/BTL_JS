const detailRouter = require('./detail');
const siteRouter = require('./site');
const meRouter = require('./me');
const addRouter = require('./add');
const {checkAuth} = require('../app/middleware/auth'); 
// const a = require('../app/middleware/getClientIp')
function route(app){
    app.use(checkAuth);
    // app.use(a);
    app.use('/book',addRouter);
    app.use('/truyen',detailRouter);
    app.use('/me',meRouter);
    app.use('/',siteRouter);
    
}


module.exports = route;