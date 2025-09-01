"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { handleLogin } from "@/lib/routesHandler"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await handleLogin(e, email, password, router)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <main className="login-page-container">
                <div className="login-panel">
                    <a onClick={()=>router.push("/")} className="close-btn" aria-label="Fechar">
                        <i className="fa-solid fa-xmark"></i>
                    </a>
                    
                    <a onClick={()=>router.push("/")} className="panel-logo">
                        <picture>
                            <source srcSet="/logo-mobile-dark.png" media="(prefers-color-scheme: dark)" />
                            <img src="/logo-mobile-light.png" alt="Hyperium Logo" />
                        </picture>
                    </a>

                    <form id="login-form" className="active" onSubmit={handleSubmit}>
                        <div className="form-header">
                            <h2>Entrar</h2>
                            <p>para continuar na Hyperium</p>
                        </div>
                        <div className="input-group">
                            <input 
                                type="email" 
                                id="login-email" 
                                className="input-field" 
                                placeholder=" " 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                            <label htmlFor="login-email" className="input-label">Email</label>
                        </div>
                        <div className="input-group">
                            <input 
                                type="password" 
                                id="login-password" 
                                className="input-field" 
                                placeholder=" " 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                            <label htmlFor="login-password" className="input-label">Senha</label>
                        </div>
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={isLoading}
                            
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                        <p className="form-switch">
                            Não tem uma conta? <a onClick={()=>router.push("/register")} id="switch-to-signup">Crie uma.</a>
                        </p>
                    </form>
                </div>
            </main>

            
        </>
    )
}