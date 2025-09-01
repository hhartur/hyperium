import { FormEvent } from "react";
import { toast } from "react-toastify";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function handleLogin(
  e: FormEvent, 
  email: string, 
  password: string, 
  router: AppRouterInstance
) {
  e.preventDefault();

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (data.status == 200) {
      toast.success(data.message);
      localStorage.setItem("token", data.token)
      router.push("/");
    } else {
      toast.error(data.message || "Erro no login");
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro de conexão");
  }
}

export async function handleRegister(
  e: FormEvent, 
  email: string, 
  username: string,
  password: string, 
  password2: string,
  router: AppRouterInstance
) {
  e.preventDefault();
  
  if (password !== password2) {
    toast.error("Senhas não coincidem");
    return;
  }

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password, password2 })
    });

    const data = await response.json();
    
    if (data.status == 200 || data.status == 201) {
      toast.success(data.message);
      router.push("/login");
    } else {
      toast.error(data.message || "Erro no cadastro");
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro de conexão");
  }
}

export async function GetGames() {
  try {
    const response = await fetch("/api/get-games", {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.err || "Failed to fetch games");
    }

    const data = await response.json();
    return data.games; 
  } catch (err) {
    console.error("Error fetching games:", err);
    return null; 
  }
}