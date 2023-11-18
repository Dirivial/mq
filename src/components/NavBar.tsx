import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';

const Navbar = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const currentPage = String(router.pathname).split('/')[1];

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      try {
        await router.push('/');
      } catch (navError) {
        console.error('Error during navigation:', navError);
      }
    } catch (signOutError) {
      console.error('Error during sign out:', signOutError);
    }
  };

  const UserIndicator = () => {
    if (sessionData) {
      return (
        <div className="dropdown dropdown-end">
          <div className="avatar indicator">
            <span className="indicator-item indicator-start badge badge-primary text-xs font-bold">
              {String(sessionData.user.email).split('@')[0]?.toUpperCase()}
            </span>
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <img alt="User Avatar" src="/avatar.png" />
            </label>
          </div>
          
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-neutral rounded-box w-52">
            <li><a onClick={void handleSignOut}>Logga ut</a></li>
          </ul>
        </div>
      );
    } else {
      return (
        <div className="flex avatar indicator">
          <div className="flex w-10 h-10 rounded-full ">
            <img alt="No login" src="/qmark.png" />
          </div>
        </div>
      );
    }
  };

  // Helper function to determine if a route is active
  return (
    <div className="navbar bg-base-100 pt-4">
      <div className="navbar-start">
        <div className="dropdown ">
        <label tabIndex={0} className="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
        </label>
        {sessionData && (
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-neutral rounded-box w-52">
          <li><a>Settings</a></li>
        </ul>)}
      </div>

      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">{currentPage === "" ? "Startsida" : currentPage}</a>
      </div>
      <div className="flex navbar-end pr-2">
        <UserIndicator/>
      </div>
    </div>
  )
};

export default Navbar;
