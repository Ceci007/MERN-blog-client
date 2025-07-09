import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import { Outlet, Navigate, NavLink } from "react-router-dom";

const SideNavbar = () => {
  let { userAuth: { access_token, new_notification_available }} = useContext(UserContext);

  let page = location.pathname.split("/")[2];

  let [pageState, setPageState] = useState(page.replace("-", " "));
  let [showSidenav, setShowSidenav] = useState(false);
  let activeTabLine = useRef();
  let sidebarIconTab = useRef();
  let pageStateTab = useRef();

  const changePageState = (e) => {
    let { offsetWidth, offsetLeft } = e.target;

    activeTabLine.current.style.width = offsetWidth + "px";
    activeTabLine.current.style.left = offsetLeft + "px";

    if(e.target == sidebarIconTab.current) {
      setShowSidenav(true);
    } else {
      setShowSidenav(false);
    }
  }

  useEffect(() => {
    setShowSidenav(false);
    pageStateTab.current.click();
  }, [pageState]) 

  return (
   <>
     {
      access_token === null ? <Navigate to="/sign-in" /> :
        <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">
          <div className="sticky top-[80px] z-30">
            <div className="flex py-1 overflow-x-auto bg-white border-b md:hidden border-grey flex-nowrap">
              <button onClick={changePageState} ref={sidebarIconTab} className="p-5 capitalize">
                <i className="pointer-events-none fi fi-br-bars-staggered" />
              </button>
              <button onClick={changePageState} ref={pageStateTab} className="p-5 capitalize">
                {pageState}
              </button>
              <hr ref={activeTabLine} className="absolute bottom-0 duration-500" /> 
            </div>
            <div className={"min-w-[250px] h-[calc(100vh - 80px - 60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100% + 80px)] max-md:px-16 max-md:-ml-7 duration-500 " + (!showSidenav ? "max-md:opacity-0 max-md:pointer-events-none": "opacity-100 pointer-events-auto")}>
              <h1 className="!text-xl text-dark-grey mb-3">Dashboard</h1>
              <hr className="mb-8 mr-6 -ml-6 border-grey" />
              <NavLink 
                to="/dashboard/blogs" 
                onClick={(e) => setPageState(e.target.innerText)}
                className="sidebar-link"
              >
                <i className="fi fi-br-document" />
                Blogs
              </NavLink>

              <NavLink 
                to="/dashboard/notifications" 
                onClick={(e) => setPageState(e.target.innerText)}
                className="sidebar-link"
              >
                <div className="relative">
                  { 
                    new_notification_available ?
                    <span className="absolute top-0 right-0 z-10 w-2 h-2 rounded-full bg-red" /> : null
                  }
                  <i className="fi fi-br-bell" />
                </div>
                Notifications
              </NavLink>

              <NavLink 
                to="/editor" 
                onClick={(e) => setPageState(e.target.innerText)}
                className="sidebar-link"
              >
                <i className="fi fi-br-edit" />
                Write
              </NavLink>

              <h1 className="!text-xl text-dark-grey mb-3 mt-20">Settings</h1>
              <hr className="mb-8 mr-6 -ml-6 border-grey" />

              <NavLink 
                to="/settings/edit-profile" 
                onClick={(e) => setPageState(e.target.innerText)}
                className="sidebar-link"
              >
                <i className="fi fi-br-user" />
                Edit Profile
              </NavLink>

              <NavLink 
                to="/settings/change-password" 
                onClick={(e) => setPageState(e.target.innerText)}
                className="sidebar-link"
              >
                <i className="fi fi-br-lock" />
                Change Password
              </NavLink>
            </div>
          </div>
          <div className="w-full mt-5 max-md:-mt-8">
            <Outlet />
          </div>
        </section>
    }
   </>
  )
}

export default SideNavbar;