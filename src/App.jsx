import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserAuthForm from "./pages/userAuthForm.page";
import { lookInSession } from "./common/session";
import Navbar from "./components/navbar.component";
import HomePage from "./pages/home.page";
import Editor from "./pages/editor.page";
import SearchPage from "./pages/search.page";
import ProfilePage from "./pages/profile.page";
import BlogPage from "./pages/blog.page";
import SideNavbar from "./components/sidenavbar.component";
import ChangePassword from "./pages/change-password.page";
import EditProfile from "./pages/edit-profile.page";
import Notifications from "./pages/notifications.page";
import ManageBlogs from "./pages/manage-blogs.page";
import PageNotFound from "./pages/404.page";

export const UserContext = createContext({});

function App() {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    let userInSession = lookInSession("user");

    userInSession ? setUserAuth(JSON.parse(userInSession)) 
    : setUserAuth({ access_token: null });
  }, [])

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ userAuth, setUserAuth }}>
        <Routes>
          <Route path="/editor" element={<Editor />} /> 
          <Route path="/editor/:blog_id" element={<Editor />} />
          <Route path="/" element={<Navbar />}>
            <Route index element={<HomePage />} /> 
            <Route path="dashboard" element={<SideNavbar />}>
              <Route path="blogs" element={<ManageBlogs />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
            <Route path="settings" element={<SideNavbar />}>
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
            <Route path="sign-in" element={<UserAuthForm type="sign-in" />} />
            <Route path="sign-up" element={<UserAuthForm type="sign-up" />} />
            <Route path="search/:query" element={<SearchPage />} />
            <Route path="user/:id" element={<ProfilePage />} />
            <Route path="blog/:blog_id" element={<BlogPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;