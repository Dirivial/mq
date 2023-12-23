import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import GoBackButton from "./GoBackButton";

const Navbar = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const currentPage = String(router.pathname).split("/")[1];

  const handleSignOut = () => {
    void signOut({ callbackUrl: "/" });
  };

  const UserIndicator = () => {
    if (sessionData) {
      return (
        <div className="dropdown dropdown-end">
          <div className="avatar indicator">
            <span className="badge indicator-item badge-primary indicator-start text-xs font-bold">
              {String(sessionData.user.name)}
            </span>
            <label tabIndex={0} className="btn btn-circle btn-ghost">
              <img
                alt="User Avatar"
                src="https://raw.githubusercontent.com/Dirivial/mq/5646c8119aee483a4818dfdd260fa595d5dcf67b/public/Avatar.png"
              />
            </label>
          </div>

          <ul
            tabIndex={0}
            className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-neutral p-2 shadow"
          >
            <li className="text-white hover:text-white" onClick={handleSignOut}>
              <a>Logga ut</a>
            </li>
          </ul>
        </div>
      );
    } else {
      return (
        <div className="avatar indicator flex">
          <div className="flex h-10 w-10 rounded-full ">
            <img
              alt="No login"
              src="https://raw.githubusercontent.com/Dirivial/mq/main/public/qmark.png"
            />
          </div>
        </div>
      );
    }
  };

  // Helper function to determine if a route is active
  return (
    <div className="navbar z-10 bg-base-100 pt-4">
      <div className="navbar-start">
        {currentPage != "quizmaster" ? (
          <GoBackButton />
        ) : (
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-circle btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
            {sessionData && (
              <ul
                tabIndex={0}
                className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-neutral p-2 shadow"
              >
                <li>
                  <a>Settings</a>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">
          {currentPage === "" ? "Startsida" : currentPage}
        </a>
      </div>
      <div className="navbar-end flex pr-2">
        <UserIndicator />
      </div>
    </div>
  );
};

export default Navbar;
