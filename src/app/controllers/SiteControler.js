const blogbooks = require('../model/blogbook');
const { multiple } = require('../../util/mongo');
const { mongooseToObject } = require('../../util/mongo');
const detailbooks = require('../model/detailbook');
const ITEMS_PER_PAGE = 12;
const User = require('../model/login')

class SitesController {
    async index(req, res, next) {
        try {
            const page = req.query.page || 1;
            const options = {
                page: page,
                limit: ITEMS_PER_PAGE,
                sort: { updatedAt: -1 }
            };

            const result = await blogbooks.paginate({}, options);
            const totalPages = result.totalPages;
            const hasNextPage = result.hasNextPage;
            const hasPreviousPage = result.hasPrevPage;
            const nextPage = result.nextPage;
            const previousPage = result.prevPage;

            res.render('home', {
                books: multiple(result.docs),
                showHeaderFooter: true,
                hidden: true,
                currentPage: page,
                hasNextPage,
                hasPreviousPage,
                nextPage,
                previousPage,
                totalPages
            });
        } catch (error) {
            next(error);
        }
    }

    async rankfollow(req, res, next) {
        try {
            const page = req.query.page || 1;
            const options = {
                page: page,
                limit: ITEMS_PER_PAGE,
                sort: { followersCount: -1 }
            };

            const result = await detailbooks.paginate({}, options);
            const totalPages = result.totalPages;
            const hasNextPage = result.hasNextPage;
            const hasPreviousPage = result.hasPrevPage;
            const nextPage = result.nextPage;
            const previousPage = result.prevPage;

            res.render('rank', {
                books: multiple(result.docs),
                showHeaderFooter: true,
                hidden: true,
                currentPage: page,
                hasNextPage,
                hasPreviousPage,
                nextPage,
                previousPage,
                totalPages
            });
        } catch (error) {
            next(error);
        }
    }
    async rankread(req, res, next) {
        try {
            const page = req.query.page || 1;
            const options = {
                page: page,
                limit: ITEMS_PER_PAGE,
                sort: { views: -1 }
            };

            const result = await detailbooks.paginate({}, options);
            const totalPages = result.totalPages;
            const hasNextPage = result.hasNextPage;
            const hasPreviousPage = result.hasPrevPage;
            const nextPage = result.nextPage;
            const previousPage = result.prevPage;

            res.render('rank', {
                books: multiple(result.docs),
                showHeaderFooter: true,
                hidden: true,
                currentPage: page,
                hasNextPage,
                hasPreviousPage,
                nextPage,
                previousPage,
                totalPages
            });
        } catch (error) {
            next(error);
        }
    }

    async rankcomment(req, res, next) {
        try {
            const page = req.query.page || 1;
            const options = {
                page: page,
                limit: ITEMS_PER_PAGE,
                sort: { comment: -1 }
            };

            const result = await detailbooks.paginate({}, options);
            const totalPages = result.totalPages;
            const hasNextPage = result.hasNextPage;
            const hasPreviousPage = result.hasPrevPage;
            const nextPage = result.nextPage;
            const previousPage = result.prevPage;

            res.render('rank', {
                books: multiple(result.docs),
                showHeaderFooter: true,
                hidden: true,
                currentPage: page,
                hasNextPage,
                hasPreviousPage,
                nextPage,
                previousPage,
                totalPages
            });
        } catch (error) {
            next(error);
        }
    }
    async fullbook(req, res, next) {
        try {
            const page = req.query.page || 1;
            const options = {
                page: page,
                limit: ITEMS_PER_PAGE,
                query: { status: "Hoàn Thành" }
            };
            const query = { status: "Hoàn Thành" };

            const result = await detailbooks.paginate(query, options);
            const totalPages = result.totalPages;
            const hasNextPage = result.hasNextPage;
            const hasPreviousPage = result.hasPrevPage;
            const nextPage = result.nextPage;
            const previousPage = result.prevPage;

            res.render('Full', {
                books: multiple(result.docs),
                showHeaderFooter: true,
                hidden: true,
                currentPage: page,
                hasNextPage,
                hasPreviousPage,
                nextPage,
                previousPage,
                totalPages
            });
        } catch (error) {
            next(error);
        }
    }
    search(req, res, next) {
        const { search } = req.query;
        const page = req.query.page || 1;
       
    
        //  không có tham số tìm kiếm
        if (!search) {
            return res.render('search', {
                a: [],
                showHeaderFooter: true,
            });
        }
    
        // Tìm kiếm trong db
        const options = {
            page: page,
            limit: ITEMS_PER_PAGE,
        };
    
        detailbooks.paginate({
            $or: [
                { name: new RegExp(search, 'i') },
                { author: new RegExp(search, 'i') },
            ],
        }, options)
        .then(result => {
            res.render('search', {
                a: multiple(result.docs),
                showHeaderFooter: true,
                currentPage: page,
                hasNextPage: result.hasNextPage,
                hasPreviousPage: result.hasPrevPage,
                nextPage: result.nextPage,
                previousPage: result.prevPage,
                totalPages: result.totalPages,
            });
        })
        .catch(next);
    }
    
    category(req, res, next) {
        const { search } = req.query;
        const page = req.query.page || 1;
    
        if (!search) {
            return res.render('search', {
                a: [],
                showHeaderFooter: true,
            });
        }
    
        const options = {
            page: page,
            limit: ITEMS_PER_PAGE,
        };
    
        detailbooks.paginate({
            $or: [
                { category: new RegExp(search, 'i') },
            ],
        }, options)
        .then(result => {
            res.render('search', {
                a: multiple(result.docs),
                showHeaderFooter: true,
                currentPage: page,
                hasNextPage: result.hasNextPage,
                hasPreviousPage: result.hasPrevPage,
                nextPage: result.nextPage,
                previousPage: result.prevPage,
                totalPages: result.totalPages,
            });
        })
        .catch(next);
    }
    

    

    read(req, res, next){
        res.send('Đọc Truyện thôi');
    };
    postsss(req, res, next) {
        const userId = req.userId;
    
        User.findById(userId)
            .then(user => {
                if (!user) {
                    return res.status(404).json({ type: 'error', message: 'Không tìm thấy người dùng' });
                }
                
                
    
                // Xử lý kết quả trả về từ tìm kiếm người dùng (nếu cần)
                // Ví dụ: res.render('post/posts', { user, userIdFromDatabase, showHeaderFooter: false });
                res.render('post/posts', { showHeaderFooter: false , user : user});
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({ type: 'error', message: 'Đã xảy ra lỗi' });
            });
    }
    
    async  list(req, res, next) {
        try {
            const formData = req.body;
            const userId = req.userId;
    
            // Tạo một đối tượng truyện từ dữ liệu form và thông tin của người dùng
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ type:'error', message: 'Không tìm thấy tài khoản' });
            }
    
            // Thêm tên của người dùng vào đối tượng truyện
            formData.poster = user.name;
    
            // Lưu truyện vào cơ sở dữ liệu
            const book = new detailbooks(formData);
            const blogBook = new blogbooks(formData);
            await book.save();
            await blogBook.save();
    
            // Lưu truyện vào danh sách theo dõi của người dùng
            const storyId = book.slug; // Lấy _id của truyện
            if (!user.addbook.includes(storyId)) {
                user.addbook.push(storyId);
                await user.save();
            }
    
            res.redirect(`/me/stored/${user._id}/book`);
        } catch (error) {
            next(error);
        }
    }
    
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
        const updatedData = req.body;
        
        // Loại bỏ các trường thời gian nếu chúng có trong updatedData
        delete updatedData.createdAt;
        delete updatedData.updatedAt;
        Promise.all([
            blogbooks.updateOne({ slug: id }, updatedData, { timestamps: false }),
            detailbooks.updateOne({ slug: id }, updatedData, { timestamps: false })
        ])
        .then(() => {
            res.redirect(`/truyen/${id}`);
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
    async restore(req, res, next) {
        try {
            const { id } = req.params;
            
            await Promise.all([
                blogbooks.restore({ slug: id }),
                blogbooks.updateOne({ slug: id }, { $set: { deleted: false } }, { timestamps: false }),
                detailbooks.restore({ slug: id }),
                detailbooks.updateOne({ slug: id }, { $set: { deleted: false } }, { timestamps: false })
            ]);

            res.redirect('back');
        } catch (error) {
            next(error);
        }
    }
    async forceDestroy(req, res, next) {
        try {
            const { id } = req.params;

            await Promise.all([
                blogbooks.deleteOne({ slug: id }),
                detailbooks.deleteOne({ slug: id })
            ]);

            res.redirect('back');
        } catch (error) {
            next(error);
        }
    }   
    
}

module.exports = new SitesController;