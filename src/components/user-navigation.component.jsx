import { useContext } from "react";
import { UserContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { removeFromSession } from "../common/session";

const UserNavigationPanel = () => {
  const navigate = useNavigate();
  const { userAuth: { username, access_token }, setUserAuth } = useContext(UserContext);

  const signOutUser = () => {
    removeFromSession("user");
    setUserAuth({ access_token: null });
    navigate("/sign-in");
  }

  return (
    <AnimationWrapper
      transition={{ duration: 0.2 }}
      className="absolute right-0 z-50"
    >
      <div className="absolute right-0 duration-200 bg-white border border-grey w-60">
        <Link to="/editor" className="flex gap-2 py-4 pl-8 link md:hidden">
          <i className="fi fi-br-edit" />
          <p>Write</p> 
        </Link>
        <Link to={`/user/${username}`} className="flex items-center gap-2 py-4 pl-8 link">
          <i className="fi fi-br-user" />
          <p>Profile</p>  
        </Link>
        <Link to="/dashboard/blogs" className="flex items-center gap-2 py-4 pl-8 link">
          <i className="fi fi-br-apps" />
          <p>Dashboard</p>
        </Link>
        <Link to="/settings/edit-profile" className="flex items-center gap-2 py-4 pl-8 link">
          <i className="fi fi-ss-settings" />
          <p>Settings</p>  
        </Link>
        <span className="absolute border-t border-grey w-[100%]" />
        <button className="w-full p-4 py-4 pl-8 text-left hover:bg-grey"
          onClick={signOutUser}
        >
          <h2 className="flex items-center gap-2 !text-base font-bold">
          <i className="text-xl fi fi-rr-exit" />
            Sign Out
          </h2>
          <p className="text-sm text-dark-grey">@{username}</p>
        </button>
      </div>
    </AnimationWrapper>
  )
}

export default UserNavigationPanel;