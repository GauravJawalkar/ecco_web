import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/Navigation/Navbar";
import Provider from "@/components/ReactQuery/Provider";
import SessionInitializer from "@/helpers/SessionInitializer";
import { BottomNav } from "@/components/Navigation/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ecomm_Web",
  description: "Made with ❤ by gaurav jawalkar",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-900/80 dark:selection:text-emerald-50`}>
        <SessionInitializer />
        <Provider>
          <div className="bg-white text-[#1a1a1a] dark:bg-[#1a1a1a] dark:text-[#ededed] min-h-screen h-auto">
            <div className="max-w-[85rem] mx-auto">
              <Navbar />
              {children}
              <BottomNav />
              <Toaster position="top-center" reverseOrder={false} />
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}