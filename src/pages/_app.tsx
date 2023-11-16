import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { useEffect } from 'react';
import { api } from "~/utils/api";
import Navbar from "~/components/NavBar";
import { AuthContext } from "~/components/authContext";
import Footer from "~/components/Footer";


import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'synthwave');
  }, []);

  return (
    <SessionProvider session={session}>
      <AuthContext.Provider value={{ session }}>
        <div className="flex flex-col h-screen">
          <Navbar />
          <div className="flex flex-1"> 
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
      </AuthContext.Provider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);