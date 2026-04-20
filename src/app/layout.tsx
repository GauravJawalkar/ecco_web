import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/Navigation/Navbar";
import Provider from "@/components/ReactQuery/Provider";
import { getSessionUser } from "@/helpers/getSessionUser";
import { refreshSession } from "@/actions/refreshSession";
import UserStoreInitializer from "@/components/ReactQuery/UserStoreInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ecomm_Web",
  description: "Made with ❤ by gaurav jawalkar",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  let user: Record<string, any> | null = null;

  const session = await getSessionUser();

  if (session.status === "ok") {
    user = session.user;
  } else if (session.status === "refresh_needed") {
    // Server Action — can actually set cookies unlike a plain helper
    const refreshed = await refreshSession(session.userId);
    if (refreshed.status === "ok") {
      user = refreshed.user;
    }
  }
  // session.status === "logged_out" → user stays null → UserStoreInitializer clears localStorage

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-900/80 dark:selection:text-emerald-50`}>
        <UserStoreInitializer user={user} />
        <Provider>
          <div className="bg-white text-[#1a1a1a] dark:bg-[#1a1a1a] dark:text-[#ededed] min-h-screen h-auto">
            <div className="max-w-[85rem] mx-auto">
              <Navbar />
              {children}
              <Toaster position="top-center" reverseOrder={false} />
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}