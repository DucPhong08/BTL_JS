const detailbook = require('../model/detailbook');
const {mongooseToObject} = require('../../util/mongo');
const {multiple} = require('../../util/mongo');
const readbook = require('../model/readbook');
const blogbooks = require('../model/blogbook');
const comment = require('../model/comment')
const User = require('../model/login')


class DetailsController{
    show(req, res, next) {
        const a = req.params.slug;
        const readbooks = readbook(a);
    
        readbooks.aggregate([
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" }
                }
            }
        ])
        .then(result => {
            const totalViews = result.length > 0 ? result[0].totalViews : 0;
    
            detailbook.updateOne({slug: req.params.slug}, {views: totalViews}).exec();
            return Promise.all([
                detailbook.findOne({ slug: req.params.slug }),
                readbooks.find({}),
                readbooks.findOne().sort({ createdAt: -1 }),
                readbooks.countDocuments(),
                comment.find({storyId:req.params.slug }).sort({ createdAt: -1 })
            ])
            .then(([book, reads, newestReadbook, count,comment]) => {
                res.render('detail', {
                    book: mongooseToObject(book),
                    reads: multiple(reads),
                    newestReadbook: mongooseToObject(newestReadbook),
                    totalCount: count,
                    totalViews: totalViews,
                    comment :multiple(comment)  ,
                    showHeaderFooter: true
                });
            });
        })
        .catch(next);
    }
    
    

    
    reader(req, res, next){
        const a = req.params.slug   
        const readbooks = readbook(a);
        
        
        Promise.all([readbooks.findOne({ slug: req.params.id }).sort({ slug: 1 }),
            blogbooks.findOne({slug : req.params.slug})])
        
        .then(([read,book]) => res.render('read',{
            book : mongooseToObject(book),
            showHeaderFooter:true,
            read: mongooseToObject(read),

        }))
        .catch(next)
    }
    async csss(req, res)  {
        try {
            const userId = req.userId; 
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ type: 'error', message: 'Không tìm thấy người dùng' });
            }
    
            const books = user.books.map(book => ({
                bookId: book.bookId,
                readChapters: book.readChapters,
                lastReadChapterId : book.lastReadChapterId
            }));
    
            res.json({ type: 'success', books });
        } catch (error) {
            console.error(error);
            res.status(500).json({ type: 'error', message: 'Đã xảy ra lỗi' });
        }
    }
}

module.exports = new DetailsController