"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter()

  return (
    <>
        <header className="main-header">
          <div className="header-left">
            <button className="hamburger-menu" aria-label="Abrir menu">
              <i className="fa-solid fa-bars"></i>
            </button>

            <a onClick={()=>router.push("/")} className="logo-container go-home-link">
              <picture>
                <source
                  srcSet="/logo-dark.png"
                  media="(prefers-color-scheme: dark)"
                />
                <img src="/logo-light.png" alt="Hyperium Logo" />
              </picture>
            </a>

            <nav className="main-nav">
              <ul>
                <li>
                  <a onClick={()=>router.push("/")} className="go-home-link">
                    Início
                  </a>
                </li>

                <li className="dropdown">
                  <a href="loja.html" className="dropbtn">
                    Loja <i className="fa-solid fa-chevron-down fa-xs"></i>
                  </a>

                  <div className="dropdown-menu-level1">
                    <div className="sub-dropdown">
                      <a href="#">
                        <i className="fa-solid fa-gamepad"></i> Plataformas{" "}
                        <i className="fa-solid fa-chevron-right fa-xs"></i>
                      </a>
                      <div className="dropdown-menu-level2">
                        <a href="#">PC</a>
                        <a href="#">Console</a>
                        <a href="#">Mobile</a>
                      </div>
                    </div>

                    <div className="sub-dropdown">
                      <a href="#">
                        <i className="fa-solid fa-tags"></i> Categorias{" "}
                        <i className="fa-solid fa-chevron-right fa-xs"></i>
                      </a>
                      <div className="dropdown-menu-level2">
                        <a href="#">Ação</a>
                        <a href="#">Aventura</a>
                        <a href="#">RPG</a>
                      </div>
                    </div>

                    <div className="sub-dropdown">
                      <a href="#">
                        <i className="fa-solid fa-fire"></i> Ofertas{" "}
                        <i className="fa-solid fa-chevron-right fa-xs"></i>
                      </a>
                      <div className="dropdown-menu-level2">
                        <a href="#">Promoções</a>
                        <a href="#">Grátis</a>
                        <a href="#">Abaixo de R$20</a>
                      </div>
                    </div>
                  </div>
                </li>

                <li>
                  <a href="#">Lançamentos</a>
                </li>
                <li>
                  <a href="vender.html">Vender</a>
                </li>
                <li>
                  <a href="suporte.html">Suporte</a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="header-right">
            <div className="search-container">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input type="text" placeholder="Buscar jogos..." />
            </div>

            <div className="header-actions">
              <button className="action-btn" aria-label="Pesquisar">
                <i className="fa-solid fa-search"></i>
              </button>
              <button className="action-btn" aria-label="Notificações">
                <i className="fa-solid fa-bell"></i>
              </button>
              <button className="action-btn" aria-label="Carrinho de compras">
                <i className="fa-solid fa-cart-shopping"></i>
              </button>
            </div>

            <a onClick={()=>router.push("/login")} className="auth-btn">
              Login
            </a>

            <div className="profile-dropdown hidden">
              <a href="" className="user-profile-desktop view-profile-link">
                <span id="desktop-username"></span>
                <div className="profile-pic">
                  <img src="/profile.png" alt="Foto de Perfil" />
                </div>
              </a>
              <div className="profile-dropdown-menu">
                <a href="" className="logout-link">
                  Sair
                </a>
              </div>
            </div>

            <a href="/login" className="mobile-auth-icon" aria-label="Login">
              <i className="fa-solid fa-user"></i>
            </a>

            <a
              href="#"
              className="user-profile-header-mobile view-profile-link hidden"
            >
              <div className="profile-pic">
                <img src="/profile.png" alt="Foto de Perfil" />
              </div>
            </a>
          </div>
        </header>
    </>
  );
}
