const detailbook = require('../model/detailbook');
const {mongooseToObject} = require('../../util/mongo');
const {multiple} = require('../../util/mongo');
const readbook = require('../model/readbook');
const blogbooks = require('../model/blogbook');




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
    async add(req, res, next) {
        try {
            
            const slug = req.params.slug;
            const readbooks = readbook(slug)
            const formData = req.body;
    
            const existingChapter = await readbooks.findOne({ $or: [{ chapter: formData.chapter }, { Chap: formData.Chap }] });
    
            if (existingChapter) {
                return res.status(400).json({ type: 'error', message: 'Chương truyện đã tồn tại', a: 'Vui lòng quay lại trang trước' });
            }
    
                const newChapter = new readbooks(formData);
                await newChapter.save();
        
                const count = await readbooks.countDocuments();
        
                await blogbooks.findOneAndUpdate(
                    { slug: slug },
                    { 
                        $set: { 
                            Chapter: count, 
                            updatedAt: new Date() 
                        } 
                    }
                );
        
                await detailbook.findOneAndUpdate(
                    { slug: slug },
                    { 
                        $set: { 
                            Chapter : count ,
                            updateat : new Date,
                            latestChapter: formData.Chap, 
                            latestChapterTime: newChapter.createdAt, 
                        } 
                    }
                );
        
                
                res.redirect('back');
            } catch (error) {
                console.error('Lỗi khi thêm chương mới:', error);
                next(error);
            }
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
                readbooks.countDocuments()
                    .then(count => {
                        return blogbooks.findOneAndUpdate(
                            { slug: a },
                            { $set: { Chapter: count, updatedAt: new Date() } }
                        );
                    })
                    .then(() => {
                        res.redirect('back');
                    })
                    .catch(next);
            })
            .catch(next); 
    }
    
}

module.exports = new AddsController