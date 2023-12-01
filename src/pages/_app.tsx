import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { useEffect } from 'react';
import { api } from "~/utils/api";
import Navbar from "~/components/layout/NavBar";
import { AuthContext } from "~/components/auth/authContext";
import Footer from "~/components/layout/Footer";


import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <SessionProvider session={session}>
      <AuthContext.Provider value={{ session }}>
        <div className="flex flex-col min-h-screen bg-base-200">
          <Navbar />
          <div className="flex flex-grow">
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
      </AuthContext.Provider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);