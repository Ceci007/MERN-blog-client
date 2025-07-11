import { useContext } from "react";
import { ThemeContext } from "../App";
import { Link } from "react-router-dom";
import lightPageNotFoundImage from "../imgs/404-light.png";
import darkPageNotFoundImage from "../imgs/404-dark.png";
import fullLogo from "../imgs/full-logo.png";

const PageNotFound = () => {
  let { theme } = useContext(ThemeContext); 

  return (
    <section className="relative flex flex-col items-center gap-20 p-10 text-center h-cover">
      <img 
        src={theme == "light" ? darkPageNotFoundImage : lightPageNotFoundImage}
        alt="page not found"
        className="object-cover border-2 rounded select-none border-grey w-72 aspect-square"
      />
      <h1 className="!text-4xl leading-7 font-gelasio">Page not found</h1>
      <p className="-mt-8 !text-xl leading-7 text-dark-grey">The page you are looking for does not exists. Head back to the <Link to="/" className="text-black underline">home page</Link></p>
    
      <div className="mt-auto">
        <img 
          src={fullLogo} 
          alt="logo"
          className={"block object-contain h-8 mx-auto select-none " + theme == "light" ? "invert-0" : theme == "dark" ? "invert" : ""}
        />
        <p className="mt-5 text-dark-grey">Read millions of stories around the world</p> 
      </div>
    </section>
  )
}

export default PageNotFound;