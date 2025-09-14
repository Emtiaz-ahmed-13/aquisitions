import { db } from "#config/database.js";
import logger from "#config/logger.js";
import { users } from "#models/user.model.js";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";


export const hashPassword=async(password)=>{
    try {
        return await bcrypt.hash(password,10);
    } catch (error) {
        logger.error(`Error in hashing password: ${error.message}`);
        throw new Error('Error in hashing password');
        
    }
}


export const createUser=async({name,email,password,role})=>{
    try {
        // Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.email,email)).limit(1);

        if(existingUser.length > 0){
            throw new Error('User with this email already exists');
        }

        // Hash the password
        const passwordHash = await hashPassword(password);
        
        // Insert new user (use passwordHash for the password field)
        const [newUser] = await db.insert(users).values({
            name,
            email,
            password: passwordHash, // Store hashed password in password field
            role: role || 'user'
        })
        .returning({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt
        });
        
        logger.info(`New user created: ${email}`);
        return newUser;
        
    } catch (error) {
        logger.error(`Error in creating user: ${error.message}`);
        // Re-throw the original error instead of masking it
        throw error;
    }
}
