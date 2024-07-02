const detailbook = require('../model/detailbook');
const {mongooseToObject} = require('../../util/mongo');
const {multiple} = require('../../util/mongo');
const readbook = require('../model/readbook');


class DetailsController{
    show(req, res, next){
        const a = req.params.slug
        const readbooks = readbook(a);

        Promise.all([detailbook.findOne({slug : req.params.slug}),readbooks.find({})])
            .then(([book,reads]) => res.render('detail',{
                book : mongooseToObject(book),
                reads : multiple(reads),
                showHeaderFooter:true,}))
            .catch(next)
        
    }
    reader(req, res, next){
        const a = req.params.slug
        const readbooks = readbook(a);
        Promise.all([readbooks.findOne({ slug: req.params.id }).sort({ slug: 1 }),
                    detailbook.findOne({slug : req.params.slug})])
        
        .then(([read,book]) => res.render('read',{
            book : mongooseToObject(book),
            showHeaderFooter:true,
            read: mongooseToObject(read),

        }))
        .catch(next)
    }
   
}

module.exports = new DetailsController