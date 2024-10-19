import { db } from "@/lib/db"
import { NextResponse } from "next/server";
import { hash } from 'bcrypt';
import * as z from 'zod';

// Define a schema for input validation
const userSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
  })

export async function POST(req: Request) {
    try{
        const body = await req.json();
        const {email, username, password} = userSchema.parse(body);

        // Check if email is exist
        const existingUserByEmail = await db.users.findUnique({
            where: {
                email: email
            }
        });
        if(existingUserByEmail) {
            return NextResponse.json({user: null, message: "User with this Email already exist"}, {status: 409});
        }

        // Check if username is exist
        const existingUserByUsername = await db.users.findUnique({
            where: {
                username: username
            }
        });
        if(existingUserByUsername) {
            return NextResponse.json({user: null, message: "User with this username already exist"}, {status: 409});
        }
        
        const hashedPassword = await hash(password, 10);
        const newUser = await db.users.create({
            data: {
                email,
                username,
                password: hashedPassword
            }
        });
        const { password: newUserPassword, ...rest } = newUser;

        return NextResponse.json({user: rest, message: "User created successfully"}, {status: 201});
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong"}, {status: 500});
    }
}