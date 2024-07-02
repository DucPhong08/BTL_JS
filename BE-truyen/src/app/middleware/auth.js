const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret';
// xác thực đăng nhập
const checkAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                res.locals.isAuthenticated = false;
            } else {
                res.locals.isAuthenticated = true;
                res.locals.username = decoded.name;
                res.locals.userID = decoded.userId;
            }
            next();
        });
    } else {
        res.locals.isAuthenticated = false;
        next();
    }
};

const authenticateTokenss = (req, res, next) => {
    const token = req.cookies.token; // Lấy token từ cookie

    if (!token) {
        return res.redirect('/');
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT Verify Error:', err);
            return res.status(403).json({ type: 'info', message: 'Token không hợp lệ' });
        }
        req.userId = decoded.userId; 
        console.log(req.userId);
        next();
    });
};


// xác thực các dữ liệu liên quan tài khoản
const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(400).json({ type: 'error', message: 'Bạn chưa đăng nhập' });
    }

    const token = authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(400).json({ type: 'error', message: 'Token không hợp lệ' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT Verify Error:', err);
            return res.status(403).json({ type: 'info', message: 'Bạn chưa đăng nhập ' });
        }
        req.userId = decoded.userId; 
        console.log(req.userId)
        next();
        
    });
};


const authenticateTokens = (req, res, next) => {
    const token = req.cookies.token; 
    console.log('Cookie Token:', token);

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error('JWT Verify Error:', err);
                return res.status(403).json({ type: 'info', message: 'vui lòng đăng nhập' });
            }
            req.userId = decoded.userId;
            console.log('Decoded userId:', req.userId);
            next();
        });
    } else {
        console.log('No token in cookies, proceeding without userId');
        next();
    }
};




module.exports = {checkAuth,authenticateToken,authenticateTokens,authenticateTokenss};