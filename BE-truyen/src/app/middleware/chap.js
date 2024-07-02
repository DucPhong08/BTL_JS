const User = require('../model/login');
const detaibook  = require('../model/detailbook')
const updateReadingProgress = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return next();
        }

        const userId = req.userId;
        const { slug, id } = req.params;
        const chapterNumber = parseInt(id.split("-")[1]);
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ type: 'error', message: 'Không tìm thấy người dùng' });

        let bookIndex = user.books.findIndex(book => book.bookId === slug);
        
        // Nếu cuốn sách chưa tồn tại, thêm mới vào mảng books của người dùng
        if (bookIndex === -1) {
            const newBook = {
                bookId: slug,
                lastReadChapterId: chapterNumber,
                readChapters: [chapterNumber]
            };
            user.books.push(newBook);
            bookIndex = user.books.length - 1;
        } else {
            // Cuốn sách đã tồn tại, cập nhật thông tin
            user.books[bookIndex].lastReadChapterId = chapterNumber;
            if (!user.books[bookIndex].readChapters.includes(chapterNumber)) {
                user.books[bookIndex].readChapters.push(chapterNumber);
            }
        }

        await user.save();
        await detaibook.findOneAndUpdate(
            { slug: slug },
            { $set: { lastReadChapterId: chapterNumber } }
        );
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: 'error', message: 'Đã xảy ra lỗi' });
    }
};



module.exports = {updateReadingProgress};
