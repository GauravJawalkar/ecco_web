import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/Navigation/Navbar";
import Provider from "@/components/ReactQuery/Provider";


const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ecomm_Web",
  description: "Made with ❤ by gaurav jawalkar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased `}>
        <Provider>
          <div className="bg-white text-[#1a1a1a] dark:bg-[#1a1a1a] dark:text-[#ededed] min-h-screen">
            <div className="max-w-[85rem] mx-auto ">
              <Navbar />
              {children}
              <Toaster
                position="top-center"
                reverseOrder={false}
              />
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}



// bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-700 via-[#1a1a1a] to-black