import bcrypt from "bcrypt";
import { createServerClient } from "@/lib/database";
import { NextRequest } from "next/server";
import { permission } from "process";

export async function POST(req: NextRequest) {
    try {
        const { email, username, password, password2 } = await req.json();

        // Validação de campos obrigatórios
        if (!email || !password || !password2 || !username) {
            return Response.json(
                { message: "All fields are required" , 
                 status: 400 }
            );
        }

        // Validação de senhas
        if (password !== password2) {
            return Response.json(
                { message: "Passwords do not match" , 
                 status: 400 }
            );
        }

        // Validação de senha forte (opcional)
        if (password.length < 6) {
            return Response.json(
                { message: "Password must be at least 6 characters" , 
                 status: 400 }
            );
        }

        const supabase = createServerClient();

        // Verificar se email já existe
        const { data: existingUsers, error: checkError } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .limit(1);

        if (checkError) {
            console.error('Database check error:', checkError);
            return Response.json(
                { message: "Database error" , 
                 status: 500 }
            );
        }

        // Se usuário já existe
        if (existingUsers && existingUsers.length > 0) {
            return Response.json(
                { message: "Email already exists" , 
                 status: 409 } // 409 = Conflict
            );
        }

        // Criar novo usuário
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
                email: email,
                username: username,
                password: hashedPassword,
                permission: 0
            })
            .select('email, username')
            .single();

        if (insertError) {
            console.error('Insert error:', insertError);
            return Response.json(
                { message: "Failed to create user" , 
                 status: 500 }
            );
        }

        // Sucesso
        return Response.json({
            message: "User created successfully!",
            user: newUser
        ,  status: 201 }); // 201 = Created

    } catch (error) {
        console.error('Registration error:', error);
        return Response.json(
            { message: "Internal server error" , 
             status: 500 }
        );
    }
}