const {multiple} = require('../../util/mongo');
const detailbooks = require('../model/detailbook');
const User = require('../model/login');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Comment = require('../model/comment');
const {mongooseToObject} = require('../../util/mongo');
const { Error } = require('mongoose');

// Định nghĩa JWT_SECRET ở đây
const JWT_SECRET = 'your_jwt_secret';
class AuthController{
    register(req, res) {
        const { name, username, password } = req.body;
        User.findOne({ username })
            .then(user => {
                if (user) {
                    return res.status(400).json({ type: 'error', message: 'Người dùng đã tồn tại' });
                }

                const newUser = new User({ name, username, password });
                return bcrypt.genSalt(10)
                    .then(salt => bcrypt.hash(password, salt))
                    .then(hash => {
                        newUser.password = hash;
                        return newUser.save();
                    })
                    .then(() => res.status(201).json({ type: 'success', message: 'Đăng ký thành công' }))
                    .catch((err) => res.status(500).json({ type: 'error', message: 'Lỗi server' }));
                    
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ type: 'error', message: 'Lỗi server' });
            });
    };
    login(req, res) {
        const { username, password,name } = req.body;
        User.findOne({ username })
            .then(user => {
                if (!user) {
                    return res.status(400).json({ type: 'error', message: 'Thông tin user không hợp lệ' });
                }
    
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (!isMatch) {
                            return res.status(400).json({ type: 'error', message: 'Thông tin pw không hợp lệ' });
                        }
    
                        const payload = { userId: user._id, username: user.username,name : user.name ,birthday : user.birthday,gender:user.gender};
                        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ type: 'error', message: 'Server error' });
                            }
                            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); 

                            // Lưu token vào cookie
                            return res.json({ type: 'success', message: 'Đăng nhập thành công', token });
                            // return res.render('partials/header', { 
                            //     message: 'Đăng nhập thành công', 
                            //     hien : true,
                                
                            // });
                        });
                    });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ type: 'error', message: 'Lỗi server' });
            });
    }
    logout(req, res)  {
        res.clearCookie('token', { path: '/' });
        res.json({ type: 'success', message: 'Logged out successfully' });
    };
    async follow(req, res)  {
        try {
            const story = await  detailbooks.findById(req.params.storyId);
            console.log(req.params.storyId)
            if (!story) {
                return res.status(404).json({ type:'error',message: 'Không tìm thấy truyện' });
            }
    
            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({ type:'error',message: 'Không tìm thấy tk' });
            }
    
            if (user.following.includes(req.params.storyId)) {
                return res.status(400).json({ type:'error',message: 'Truyện đã được theo dõi' });
            }
    
            // Thêm truyện vào danh sách theo dõi
            user.following.push(req.params.storyId);
            story.followersCount += 1; // Tăng số lượng lượt theo dõi
            await user.save();
            await story.save();
    
            res.json({ type:'success',message: 'Theo dõi truyện thành công' });
        } catch (err) {
            res.status(500).json({ type:'info',message: 'Bạn là tác  giả truyện ' });
        }
    };
    async unfollow(req, res) {
        try {
            const userId = req.userId;
            const storyId = req.params.storyId;
    
            await User.updateOne(
                { _id: userId },
                { $pull: { following: { $in: [storyId] } } }
            );
            await detailbooks.findByIdAndUpdate(storyId, { $inc: { followersCount: -1 } })
                .then(() => res.redirect('back'))
            
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    
    async storefollow(req, res) {
        try {
            const user = await User.findById(req.params.name); 
    
            if (!user) {
                return res.status(404).json({ type: 'error', message: 'Không tìm thấy người dùng' });
            }
            
            // Lấy danh sách truyện đã theo dõi của người dùng
            const followingBooks = await detailbooks.find({ _id: { $in: user.following } }).sort({ latestChapterTime: -1 });
            // const readnew = await a.findOne
    
            res.render('me/follow', { book: multiple(followingBooks),showHeaderFooter:true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ type: 'error', message: 'Đã xảy ra lỗi' });
        }
    }

    async likeStory(req, res) {
        try {
            const story = await detailbooks.findById(req.params.storyId);
            console.log(req.params.storyId);
            if (!story) {
                return res.status(404).json({ type: 'error', message: 'Không tìm thấy truyện' });
            }
    
            // Kiểm tra xem người dùng đã thích truyện này chưa
            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({ type: 'error', message: 'Không tìm thấy tài khoản' });
            }
    
            if (user.likedStories.includes(req.params.storyId)) {
                return res.status(400).json({ type: 'error', message: 'Truyện đã được thích' });
            }
    
            // Thêm truyện vào danh sách truyện đã thích của người dùng
            user.likedStories.push(req.params.storyId);
    
            // Tăng số lượng lượt thích của truyện lên 1
            story.likesCount += 1;
    
            await user.save();
            await story.save();
    
            res.json({ type: 'success', message: 'Thích truyện thành công' });
        } catch (err) {
            res.status(500).json({ type: 'error', message: 'Lỗi Server' });
        }
    }
   

  

    async comment(req, res, next) {
        try {
            const { content } = req.body;
            const storyId = req.params.aaaaaaaaa; 
            const userId = req.userId; 
        
            
            const user = await User.findById(userId);

            if (!user) {
                throw new Error('Không tìm thấy thông tin user');
            }
        
            const newComment = new Comment({
                content,
                storyId, 
                userId: user.name, 
                createdAt: new Date()
            });
        
            await newComment.save();
            await detailbooks.findOneAndUpdate({slug : storyId}, { $inc: { comment: 1 } })
            // Nếu cần gửi phản hồi JSON
            res.json({ type: 'success', message: 'Comment thành công' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ type: 'error', message: 'Lỗi máy chủ' });
        }
    }
    

    async storehistory(req, res) {
        try {
            const user = await User.findById(req.params.abc); 
    
            if (!user) {
                return res.status(404).json({ type: 'error', message: 'Không tìm thấy người dùng' });
            }   
            const bookIds = user.books.map(book => book.bookId);
            
            // Lấy danh sách truyện đã theo dõi của người dùng
            const historyBooks = await detailbooks.find({ slug: { $in: bookIds } });
            // const readnew = await a.findOne
    
            res.render('me/history', { book: multiple(historyBooks),showHeaderFooter:false });
        } catch (error) {
            console.error(error);
            res.status(500).json({ type: 'error', message: 'Đã xảy ra lỗi' });
        }
    }

    async unhistory(req, res) {
        try {
            const userId = req.userId;
            const bookIdToRemove = req.params.abcd;
    
            // Kiểm tra sự tồn tại của người dùng
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'Người dùng không tồn tại' });
            }
    
            // Sử dụng $pull để xóa một đối tượng từ mảng books
            await User.updateOne(
                { _id: userId },
                { $pull: { books: { bookId: bookIdToRemove } } },
                {new:true}
            );
    
            res.status(200).json({ message: 'Đã xóa sách thành công khỏi người dùng' });
        } catch (error) {
            console.error('Lỗi khi xóa sách từ người dùng:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa sách từ người dùng' });
        }
    }
    
        
    async personal(req, res) {
        try {
            const user = await User.findById(req.params.abcdef); 
    
            if (!user) {
               throw Error('Không tìm thấy người dùng');
            }   
            
            
    
            res.render('me/personal', { user: mongooseToObject(user),showHeaderFooter:true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ type: 'error', message: 'Đã xảy ra lỗi' });
        }
    } 


    async updateperson(req, res) {
        try {
            const user = await User.findById(req.params.gh); 
            const { names, birthday, gender } = req.body;
            if (!user) {
                throw Error('Không tìm thấy người dùng');
            }   
            user.name = names;
            user.birthday = birthday;
            user.gender = gender;
    
            await user.save();
            await detailbooks.updateMany(
                { slug: { $in: user.addbook } }, 
                { $set: { poster: names } }
            );
            const newToken = jwt.sign(
                { userId: user._id, username: user.username,name : user.name ,birthday : user.birthday,gender:user.gender},
                JWT_SECRET,
                { expiresIn: '1h' }
            );
    
            res.cookie('token', newToken, { httpOnly: true, secure: true });
            res.status(200).json({ type: 'success', message: 'Thông tin người dùng đã được cập nhật' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ type: 'error', message: 'Đã xảy ra lỗi' });
        }
    }
    

    
}
module.exports = new AuthController