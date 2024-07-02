const {multiple} = require('../../util/mongo');
const blogbooks = require('../model/blogbook');
const DetailBook = require('../model/detailbook');
const User = require('../model/login');
const {mongooseToObject} = require('../../util/mongo');



class MesController{
    async storedBooks(req, res, next) {
        try {
            const user = await User.findById(req.params.userId);
    
            if (!user) {
                throw new Error('Không tìm thấy thông tin user');
            }
    
            const storedBooks = await DetailBook.find({ slug: { $in: user.addbook } });
    
            const [ deletedCount] = await Promise.all([
                blogbooks.countDocumentsDeleted() // Đếm số lượng sách đã xóa
            ]);
    
            res.render('me/stored-book', {
                storedBooks :multiple(storedBooks) ,
                deletedCount,
                showHeaderFooter: false
            });
        } catch (error) {
            throw new Error('Không tìm thấy thông tin user');
        }
    }
    
    // trash
    
    async trashBook(req, res, next) {
        try {
            // Tìm người dùng bằng ID
            const user = await User.findById(req.userId);
    
            // Nếu không tìm thấy người dùng, trả về lỗi 404
            if (!user) {
                throw new Error('Không tìm thấy thông tin user');
            }
    
            // Tìm các sách đã xóa
            const deletedBooks = await blogbooks.findDeleted({});
            
            // Render trang với dữ liệu
            res.render('me/trash-book', {
                showHeaderFooter: false,
                book: multiple(deletedBooks),
                user :mongooseToObject(user)
            });
        } catch (error) {
            // Chuyển tiếp lỗi tới middleware tiếp theo
            next(error);
        }
    }
    
};

module.exports = new MesController;