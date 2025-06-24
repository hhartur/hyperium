import { NextRequest } from "next/server";
import { pool } from "@/lib/database";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest){
    const {email, password} = await req.json()
    
    if (!email || !password){
        return Response.json({status: 400, message: "Missing email or password"})
    }

    if(pool){
        const resultUser = await pool.query("SELECT * FROM users WHERE email = $1", [email])
        if (resultUser.rowCount && resultUser.rowCount > 0){
            const user = resultUser.rows[0]

            const isEqual = await bcrypt.compare(password, user.password)
            if(isEqual){
                return Response.json({status: 200, message: "Login successful!"})
            }else{
                return Response.json({status: 401, message: "Invalid password"})
            }
        }else{
            return Response.json({status: 404, message: "User not found"})
        }
    } else{
        return Response.json({status: 500, message: "Internal server error"})
    }
}