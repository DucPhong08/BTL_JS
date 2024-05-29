const {mongooseToObject} = require('../../util/mongo');
const {multiple} = require('../../util/mongo');
const detailbooks = require('../model/detailbook');
const blogbooks = require('../model/blogbook');


class MesController{
    storedBook(req, res, next){
        Promise.all([blogbooks.find({}), blogbooks.countDocumentsDeleted()])
            .then(([book , deletedCount]) =>{

                res.render('me/stored-book',{
                    showHeaderFooter:false,
                    book : multiple(book),
                    deletedCount,
                })
            })
            .catch(next)
        
    }
    // trash
    trashBook(req, res, next){
        blogbooks.findDeleted({})
        .then(book => res.render('me/trash-book',{
            showHeaderFooter:false,
            book : multiple(book),
        }))
        .catch(next)
    }
    
};

module.exports = new MesController;