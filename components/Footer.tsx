"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Footer() {
    return (
    <>
        <footer className="site-footer">
          <div className="footer-main">
            <div className="footer-column about">
              <picture>
                <source
                  srcSet="logo-dark.png"
                  media="(prefers-color-scheme: dark)"
                />
                <img
                  src="logo-light.png"
                  alt="Hyperium Logo"
                  className="footer-logo"
                />
              </picture>
              <p>
                Hyperium é a sua dimensão definitiva para jogos digitais,
                oferecendo uma vasta biblioteca de títulos. Mergulhe em novas
                aventuras conosco!
              </p>
            </div>
            <div className="footer-column links">
              <h4>Navegação Rápida</h4>
              <ul>
                <li>
                  <a href="#" className="go-home-link">
                    Início
                  </a>
                </li>
                <li>
                  <a href="loja.html">Loja</a>
                </li>
                <li>
                  <a href="#">Lançamentos</a>
                </li>
                <li>
                  <a href="vender.html">Vender seu Jogo</a>
                </li>
                <li>
                  <a href="suporte.html">Suporte</a>
                </li>
              </ul>
            </div>
            <div className="footer-column links">
              <h4>Ajuda & Suporte</h4>
              <ul>
                <li>
                  <a href="#">Perguntas Frequentes (FAQ)</a>
                </li>
                <li>
                  <a href="#">Entre em Contato</a>
                </li>
                <li>
                  <a href="#">Política de Reembolso</a>
                </li>
                <li>
                  <a href="#">Termos de Serviço</a>
                </li>
                <li>
                  <a href="#">Política de Privacidade</a>
                </li>
              </ul>
            </div>
            <div className="footer-column newsletter">
              <h4>Fique por Dentro</h4>
              <form className="newsletter-form">
                <input type="email" placeholder="Seu e-mail" required />
                <button type="submit" aria-label="Inscrever-se">
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </form>
            </div>
            <div className="footer-column social">
              <h4>Siga-nos</h4>
              <div className="social-links">
                <a href="#" aria-label="Discord" title="Discord">
                  <i className="fa-brands fa-discord"></i>
                </a>
                <a href="#" aria-label="Twitter" title="Twitter">
                  <i className="fa-brands fa-twitter"></i>
                </a>
                <a href="#" aria-label="YouTube" title="YouTube">
                  <i className="fa-brands fa-youtube"></i>
                </a>
                <a href="#" aria-label="Twitch" title="Twitch">
                  <i className="fa-brands fa-twitch"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              © <span id="copyright-year"></span> Hyperium. Todos os direitos
              reservados.
            </p>
          </div>
        </footer>
    </>
  );
}
