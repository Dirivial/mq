import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import GoBackButton from "./GoBackButton";
import { library, icon } from '@fortawesome/fontawesome-svg-core'
import { faCamera, faQuestion } from '@fortawesome/free-solid-svg-icons'
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHippo } from "@fortawesome/free-solid-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faClipboardQuestion } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";





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
        <div className="flex dropdown">
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


  return (
    <div className="flex w-32 flex-col bg-base-100 items-center">
      <div className="flex prose text-center pt-5">
        <h2 className="">
          Arkino
        </h2>
      </div>
      <div className="flex h-2/3 flex-col justify-center">
        <FontAwesomeIcon className="h-8 mb-20" icon={faHouse} />
        <FontAwesomeIcon className="h-8 mb-20" icon={faClipboardQuestion} />
        <FontAwesomeIcon className="h-8 mb-20" icon={faGear} />
      </div>
      <div className="flex h-3/5 flex-col justify-end">
        <div className="flex justify-bottom">
          <FontAwesomeIcon className="h-8 mb-10" icon={faArrowRightFromBracket} style={{ color: "#ff0000" }} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
