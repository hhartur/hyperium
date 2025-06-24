import "./globals.css";
import type { Metadata } from "next";
import { ToastContainer, Flip } from "react-toastify";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      </body>
    </html>
  );
}
