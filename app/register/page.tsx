"use client"

import { useRouter } from "next/navigation"

export default function Register(){
    const router = useRouter()

    return(
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

                    {/* PAINEL DE CADASTRO */}
                    <form id="signup-form" className="active">
                        <div className="form-header">
                            <h2>Criar Conta</h2>
                            <p>É rápido e fácil!</p>
                        </div>
                        <div className="input-group">
                            <input type="text" id="signup-name" className="input-field" placeholder=" " required />
                            <label htmlFor="signup-name" className="input-label">Nome de Usuário</label>
                        </div>
                        <div className="input-group">
                            <input type="email" id="signup-email" className="input-field" placeholder=" " required />
                            <label htmlFor="signup-email" className="input-label">Email</label>
                        </div>
                        <div className="input-group">
                            <input type="password" id="signup-password" className="input-field" placeholder=" " required />
                            <label htmlFor="signup-password" className="input-label">Senha</label>
                        </div>
                        <div className="input-group">
                            <input type="password" id="signup-confirm-password" className="input-field" placeholder=" " required />
                            <label htmlFor="signup-confirm-password" className="input-label">Confirmar Senha</label>
                        </div>
                        <button type="submit" className="submit-btn">Criar Conta</button>
                        <p className="form-switch">
                            Já tem uma conta? <a onClick={()=>router.push("/login")}>Entrar.</a>
                        </p>
                    </form>
                </div>
            </main>
    )
}