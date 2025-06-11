
import authMiddleware from './authMiddleware.js';

export default function adminMiddleware(req, res, next) {
    authMiddleware(req, res, function () {
        if (req.user && req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ success: false, message: 'Admin access required' });
        }
    });
}
