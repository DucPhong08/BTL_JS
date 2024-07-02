const blogbooks = require('../model/blogbook');
const {multiple} = require('../../util/mongo');
const detailbooks = require('../model/detailbook');
const {mongooseToObject} = require('../../util/mongo');



class SitesController{
    index(req, res, next){
        // res.render('home');
        blogbooks.find({})
        .then(book => res.render('home',{
            book : multiple(book),
            showHeaderFooter:true

        }))

        .catch(next);
    };
    read(req, res, next){
        res.send('Đọc Truyện thôi');
    };
    postsss(req, res, next){
        // res.render('home');
        res.render('post/posts',{
            showHeaderFooter:false
        })
    };
    list(req, res, next){
        // res.json(req.body)
        const formData = req.body;
        formData.img = `https://gamek.mediacdn.vn/133514250583805952/2020/6/27/photo-1-15932423645331291558158.jpg`
        const books = new detailbooks(formData);
        const bookss = new blogbooks(formData);

        books.save()
        bookss.save()
        .then(() => res.redirect('/me/stored/book'))
    };
    edit(req, res, next){
        // res.render('home');
        detailbooks.findOne({slug :req.params.id})
            .then(book => res.render('post/edit',{
                book : mongooseToObject(book),
                showHeaderFooter:false

            }))

            .catch(next);
    };
    update(req, res, next) {
        const { id } = req.params;
        const updateData = req.body;
        
        Promise.all([
            blogbooks.updateOne({ slug: id }, updateData),
            detailbooks.updateOne({ slug: id }, updateData)
        ])
        .then(() => {
            res.redirect('/me/stored/book');
        })
        .catch(next);
    }
    destroy(req, res, next) {
        const { id } = req.params;
        
        Promise.all([
            blogbooks.delete({ slug: id }),
            detailbooks.delete({ slug: id })
        ])
        .then(() => {
            res.redirect('back');
        })
        .catch(next); 
    }
    restore(req, res, next) {
        const { id } = req.params;
        
        Promise.all([
            blogbooks.restore({ slug: id }),
            blogbooks.updateOne({ slug: id }, { deleted: false }),
            detailbooks.restore({ slug: id }),
            detailbooks.updateOne({ slug: id }, { deleted: false })
        ])
        .then(() => {
            res.redirect('back');
        })
        .catch(next); 
    }
    forceDestroy(req, res, next) {
        const { id } = req.params;
        
        Promise.all([
            blogbooks.deleteOne({ slug: id }),
            detailbooks.deleteOne({ slug: id })
        ])
        .then(() => {
            res.redirect('back');
        })
        .catch(next); 
    }
}

module.exports = new SitesController;