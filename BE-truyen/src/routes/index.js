const detailRouter = require('./detail');
const searchRouter = require('./search');
const siteRouter = require('./site');
const meRouter = require('./me');
const addRouter = require('./add');
function route(app){
    app.use('/book',addRouter);
    app.use('/truyen',detailRouter);
    app.use('/me',meRouter);
    app.use('/search',searchRouter);
    app.use('/', siteRouter);
    
}


module.exports = route;