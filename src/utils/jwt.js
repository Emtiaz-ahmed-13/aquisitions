import logger from '#config/logger.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ||  'your_jwt_secret_key';

const JWT_EXPIRES_IN = '1h'; 

export const jwttoken={
    sign:(payload) =>{
        try {
            return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        } catch (error) {
            logger.error('JWT signing failed:', error);
            throw new Error('Token signing failed');
        }
    },

    verify:(token)=>{
        try {
            return jwt.verify(token, JWT_SECRET);

            
        } catch (error) {
            logger.error('JWT verification failed:', error);
            throw new Error('Invalid token');
        }
    }
    }
