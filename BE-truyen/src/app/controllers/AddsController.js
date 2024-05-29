const detailbook = require('../model/detailbook');
const {mongooseToObject} = require('../../util/mongo');
const {multiple} = require('../../util/mongo');
const readbook = require('../model/readbook');



class AddsController{
    
    show(req, res, next) {
        const a = req.params.slug;
        const readbooks = readbook(a);
        Promise.all([readbooks.find({}),detailbook.findOne({slug : a})])
        
        
            .then(([chap,book]) => {
                res.render('me/sorted-uplist-book', {
                    chap: multiple(chap),
                    book : mongooseToObject(book),
                    showHeaderFooter: false
                });
            })
            .catch(next);
    }
    fang(req, res, next){
        // res.render('home');
        detailbook.findOne({slug : req.params.slug})
        .then(book => res.render('post/addlist',{
            book : mongooseToObject(book),
            showHeaderFooter:false

        }))

        .catch(next);
    };
    add(req, res, next){
        const a = req.params.slug;
        const readbooks = readbook(a);
        const formData = req.body;
        const adds = new readbooks(formData);

        adds.save()
            .then(() => res.redirect('back'))
            .catch(next)
    }
    edit(req, res, next){
        const a = req.params.slug;
        const readbooks = readbook(a);
        Promise.all([readbooks.findOne({slug : req.params.id}),detailbook.findOne({slug : a})])
        
        
            .then(([chap,book]) => {
                res.render('post/editchap', {
                    chap: mongooseToObject(chap),
                    book : mongooseToObject(book),
                    showHeaderFooter: false
                });
            })
            .catch(next);
    };
    update(req, res, next) {
        const { id } = req.params;
        const updateData = req.body;
        const a = req.params.slug;
        const readbooks = readbook(a);
        
        readbooks.updateOne({ slug: id }, updateData)
        
        .then(() => {
            res.redirect('back');
        })
        .catch(next);
    }
    destroy(req, res, next) {
        const { id } = req.params;
        const a = req.params.slug;
        const readbooks = readbook(a);
        
        readbooks.deleteOne({ slug: id })
            .then(() => {
                res.redirect('back');
            })
            .catch(next); 
    }
    
}

module.exports = new AddsController