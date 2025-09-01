// Arquivo: app/layout.tsx (VERSÃO ATUALIZADA)

import Header from "@/components/Header";
import "./globals.css";
import type { Metadata } from "next";
import { ToastContainer, Flip } from "react-toastify";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext"; // 1. IMPORTE O PROVIDER

export const metadata: Metadata = {
  title: "Hyperium - Seu Mercado de Jogos",
  description: "Compre e venda jogos com segurança",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        <CartProvider> {/* 2. ENVOLVA OS COMPONENTES COM O PROVIDER */}
          <Header />
          {children}
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick={true}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
            theme="dark"
            transition={Flip}
            closeButton={false}
          />
        </CartProvider>
      </body>
    </html>
  );
}