import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { useEffect } from 'react';
import { api } from "~/utils/api";
import Navbar from "~/components/NavBar";
import { AuthContext } from "~/components/authContext";


import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'night');
  }, []);

  return (
    <SessionProvider session={session}>
      <AuthContext.Provider value={{ session }}>
        <Navbar />
        <Component {...pageProps} />
      </AuthContext.Provider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
