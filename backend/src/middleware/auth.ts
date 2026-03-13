import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your_fallback_secret';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    // Debug log for authentication issues
    if (!JWT_SECRET || JWT_SECRET === 'your_fallback_secret') {
        console.warn('WARNING: JWT_SECRET is using fallback or missing!');
    }

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, (JWT_SECRET as string), (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Token is invalid or expired' });
            }

            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Authorization header is missing' });
    }
};
