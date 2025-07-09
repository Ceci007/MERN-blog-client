import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png"; 
import UserNavigationPanel from "./user-navigation.component";
import axios from "axios";

const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const { userAuth, userAuth: { access_token, profile_img, new_notification_available },
  setUserAuth} = useContext(UserContext);
  const [userNavPanel, setUserNavPanel] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    if(access_token) {
      axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/new-notification", {
        headers: {
          "Authorization": `Bearer ${access_token}`
        }
      })
      .then(({ data }) => {
        setUserAuth({ ...userAuth, ...data});
      })
      .catch(err => {
        console.log(err);
      })
    }
  }, [access_token])

  const handleUserNavPanel = () => {
    setUserNavPanel(currentVal => !currentVal);
  }

  const handleSearch = (e) => {
    let query = e.target.value;

    if(e.keyCode === 13 && query.length) {
      navigate(`/search/${query}`); 
    }
  }

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 300);
  }

  return (
    <>
      <nav className="z-50 navbar">
      <Link to="/" className="flex-none w-10 h-10 cursor-pointer"> 
        <img src={logo} alt="logo" className="flex-none w-full" />
      </Link> 

      <div className={"absolute left-0 w-full bg-white top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " + (searchBoxVisibility ? "show" : "hide")}>
        <input 
          type="text"
          placeholder="Search"
          className="w-full p-4 pl-6 md:w-auto bg-grey pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
          onKeyDown={handleSearch}
        />
        <i className="fi fi-br-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey" /> 
      </div>
      <div className="flex items-center gap-3 ml-auto md:gap-6">
        <button 
          className="flex items-center justify-center w-12 h-12 rounded-full md:hidden bg-grey"
          onClick={() => setSearchBoxVisibility(currentVal => !currentVal)}
        >
          <i className="text-xl fi fi-br-search" />
        </button>
        <Link to="/editor" className="hidden gap-2 md:flex link">
          <i className="fi fi-br-edit" />
          <p>Write</p>
        </Link> 
        {
          access_token ?
          <>
            <Link to="/dashboard/notifications">
              <button className="relative w-12 h-12 rounded-full bg-grey hover:bg-black/10">
                <i className="block mt-1 text-xl fi fi-br-bell" /> 
                {
                  new_notification_available ?
                  <span className="absolute z-10 w-2 h-2 rounded-full bg-red top-[13px] right-[13px]" /> :
                  null
                }
                
              </button>
            </Link>
            <div className="relative" onClick={handleUserNavPanel} onBlur={handleBlur}>
              <button className="w-12 h-12 mt-1">
                <img src={profile_img} alt={profile_img} className="object-cover w-full h-full rounded-full" />
              </button>
              { 
                userNavPanel ?
                <UserNavigationPanel /> : null  
              }
            </div>
          </>
          : 
          <>
            <Link className="py-2 btn-dark" to="/sign-in">
              Sign In
            </Link>
            <Link className="hidden py-2 btn-light md:block" to="/sign-up">
              Sign Up
            </Link>
          </>
        } 
      </div>
    </nav>
    <Outlet />
    </>
  )
}

export default Navbar;