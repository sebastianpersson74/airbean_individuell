import { Router } from 'express';
import { validateAuthBody } from '../middlewares/validators.js';
import { getUser, registerUser } from '../services/users.js';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', validateAuthBody, async (req, res, next) => {
    try {
        const { username, password, role } = req.body;

        const userRole = role === 'admin' ? 'admin' : 'user';

        const result = await registerUser({
            username,
            password,
            role: userRole,
            userId: `${userRole}-${uuid().substring(0, 5)}`
        });

        if (result) {
            res.status(201).json({
                success: true,
                message: 'New user registered successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Registration unsuccessful'
            });
        }
    } catch (error) {
        next(error);
    }
});

router.post('/login', validateAuthBody, async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await getUser(username);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'No user found'
            });
        }

        if (user.password !== password) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect username and/or password'
            });
        }

        const token = jwt.sign(
            {
                userId: user.userId,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            message: 'User logged in successfully',
            token
        });
    } catch (error) {
        next(error);
    }
});

router.get('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'User "logged out" on client side. Just remove the token.'
    });
});

export default router;
