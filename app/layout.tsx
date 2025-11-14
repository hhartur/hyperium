import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Header } from "@/components/layout/header";
import { Toaster } from "sonner";
import { CartProvider } from "@/components/providers/cart-provider";
import "@/i18n-client"; // Import i18n configuration

export const metadata: Metadata = {
  title: "Hyperium - Game Store",
  description: "The best place to buy and sell indie games",
};

// If this layout is inside [lang]/layout.tsx, params will be available
interface RootLayoutProps {
  children: React.ReactNode;
  params?: { lang?: string }; // optional for safety
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  const lang = params?.lang ?? "en"; // fallback to 'en' if missing

  return (
    <html lang={lang} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen bg-background">
                <Header />
                <main>{children}</main>
              </div>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
