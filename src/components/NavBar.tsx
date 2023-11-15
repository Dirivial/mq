import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';

const Navbar = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const currentPage = String(router.pathname).split('/')[1];

  const UserIndicator = () => {
    if (sessionData) {
      return (
        <div className="dropdown dropdown-end ">
          <div className="avatar indicator">
            <span className="indicator-item badge badge-primary">{String(sessionData.user.email).split('@')[0]}</span>
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <img alt="User Avatar" src="/avatar.png" />
            </label>
          </div>
          
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-neutral rounded-box w-52">
            <li><a>Logga ut</a></li>
          </ul>
        </div>
      );
    } else {
      return (
        <div className="flex avatar indicator">
          <span className="flex indicator-item badge badge-error">Utloggad</span>
          <div className="flex w-10 h-10 rounded-full">
            <img alt="No login" src="/noavatar.png" />
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
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-neutral rounded-box w-52">
          <li><a>Settings</a></li>
        </ul>
      </div>

      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">{currentPage === "/" ? "Start" : currentPage}</a>
      </div>
      <div className="flex navbar-end pr-10">
        <UserIndicator/>
      </div>
    </div>
  )
};

export default Navbar;
