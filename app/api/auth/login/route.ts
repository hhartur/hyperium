import { NextRequest } from "next/server";
import { createServerClient } from "@/lib/database";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SECRET_KEY = process.env.SECRET_KEY || 'key_super_secreta@';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json({ status: 400, message: "Missing email or password" });
  }

  const supabase = createServerClient();

  const { data: users, error } = await supabase
            .from('users')
            .select('username, email, password')
            .eq('email', email)
            .limit(1);

  if (users && users.length > 0) {
    const user = users[0];

    const isEqual = await bcrypt.compare(password, user.password);
    if (isEqual) {
      const token = jwt.sign({ username: user.username, email: user.email }, SECRET_KEY, {
        expiresIn: '7h'
      })

      return Response.json({ status: 200, message: "Login successful!", token: token });
    } else {
      return Response.json({ status: 401, message: "Invalid password" });
    }
  } else {
    return Response.json({ status: 404, message: "User not found" });
  }
}
