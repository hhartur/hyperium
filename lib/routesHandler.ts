// lib/routeHandlers.ts
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
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (response.ok) {
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