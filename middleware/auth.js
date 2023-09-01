import jwt from 'jsonwebtoken'

export function verifyToken(req, res, next) {
    // console.log(req.headers['authorization'])
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
            return res.status(401).json({ message: 'Không tìm thấy token' });
    }
    
    try {
        // Giải mã token và kiểm tra tính hợp lệ
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        next();
    } catch (err) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
    
}