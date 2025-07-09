import { useContext } from "react";
import { UserContext } from "../App";
import { Link, Navigate } from "react-router-dom";
import InputBox from '../components/input.component';
import googleIcon from "../imgs/google.png"
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios"; 
import { storeInSession } from "../common/session";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  let { userAuth: { access_token }, setUserAuth } = useContext(UserContext);

  const userAuthThroughServer = (serverRoute, formData) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
    .then(({data}) => {
      storeInSession("user", JSON.stringify(data));
      setUserAuth(data);
    }).catch(({response}) => {
      toast.error(response.data.error);
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let serverRoute = type == "sign-in" ? "/sign-in" : "/sign-up";

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    let form = new FormData(formElement);
    let formData = {}; 
    
    for(let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { fullname, email, password } = formData;

    if(fullname?.length < 3) {
      return toast.error("Full Name must be at least 3 letters long");
    }
  
    if(!email.length) {
      return toast.error("Enter valid email");
    }
  
    if(!emailRegex.test(email)) {
      return toast.error("Email is invalid");
    }
  
    if(!passwordRegex.test(password)) {
      return toast.error("Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters");
    }

    userAuthThroughServer(serverRoute, formData);
  }

  const handleGoogleAuth = (e) => {
    e.preventDefault();

    authWithGoogle().then((user) => {
      let serverRoute = "/google-auth";
      let formData = {
        access_token: user.accessToken
      }

      userAuthThroughServer(serverRoute, formData);
    }).catch((err) => {
      toast.error("trouble login through Google");
      return console.log(err);
    })
  }

  return (
   <>
    {
      access_token ? <Navigate to="/" /> :
      <AnimationWrapper keyValue={type}>
      <section className="flex items-center justify-center h-cover">
      <Toaster />
      <form id="formElement" className="w-[80%] max-w-[400px]">
        <h1 className="mb-24 text-4xl text-center capitalize font-gelasio">{type == "sign-in" ? "Welcome back" : "Join us today"}</h1>
        {type != "sign-in" ? 
          <InputBox 
            name="fullname"
            type="text"
            placeholder="Full Name"
            icon="fi-br-user"
          /> : ""}

          <InputBox 
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-br-envelope"
          />
          <InputBox 
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-br-key"
          />
          <button 
            className="btn-dark center mt-14"
            type="submit"  
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>

          <div className="relative flex items-center w-full gap-2 my-10 font-bold text-black uppercase opacity-30">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button className="flex items-center justify-center btn-dark gap-4 w-[90%] center"
            onClick={handleGoogleAuth}
          >
            <img src={googleIcon} alt="google icon" className="w-5" />
            continue with google
          </button>

          {
            type == "sign-in" ?
            <div className="flex items-center justify-center mt-6">
              <p className="text-xl text-center text-dark-grey">Don't have an account?</p>
              <Link to="/sign-up" className="ml-1 text-xl text-black underline">
                Join us today
              </Link>
            </div> : 
            <div className="flex items-center justify-center mt-6">
            <p className="text-xl text-center text-dark-grey">Already a member?</p>
            <Link to="/sign-in" className="ml-1 text-xl text-black underline">
              Sign In here
            </Link>
          </div>
          }
      </form>
    </section>
    </AnimationWrapper>
    }
   </>
  )
}

export default UserAuthForm;