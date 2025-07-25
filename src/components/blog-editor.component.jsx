import { useContext, useEffect } from "react";
import { ThemeContext, UserContext } from "../App";
import { EditorContext } from "../pages/editor.page";
import { Link, useNavigate, useParams } from "react-router-dom";
import lightLogo from "../imgs/logo-light.png";
import darkLogo from "../imgs/logo-dark.png";
import AnimationWrapper from "../common/page-animation";
import darkDefaultBanner from "../imgs/blog-banner-dark.png";
import lightDefaultBanner from "../imgs/blog-banner-light.png"; 
import { uploadImage } from "../common/aws";
import { Toaster, toast } from "react-hot-toast";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component"; 
import axios from "axios";

const BlogEditor = () => {
  let navigate = useNavigate();
  let { blog, blog: { title, banner, content, tags, desc }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);
  let { userAuth: { access_token } } = useContext(UserContext);
  let { theme } = useContext(ThemeContext);
  let { blog_id } = useParams();

  useEffect(() => {
    if(!textEditor.isReady) {
      setTextEditor(new EditorJS({
        holderId: "textEditor",
        data: Array.isArray(content) ? content[0] : content,
        tools: tools,
        placeholder: "Let's write an awesome story"
      }));
    }
  }, [])
  
  const handleBannerUpload = (e) => {
    let img = e.target.files[0]; 
    
    if(img) {
      let loadingToast = toast.loading("Uploading image...");

      uploadImage(img).then((url) => {
        if(url) {
          toast.dismiss(loadingToast);
          toast.success("Image uploaded successfully!");

          setBlog({ ...blog, banner: url });
        }
      }).catch((err) => {
        toast.dismiss(loadingToast);
        return toast.error(err);
      })
    }
  }

  const handleTitleKeyDown = (e) => {
    if(e.keyCode === 13) {
      e.preventDefault();
    }
  }

  const handleTitleChange = (e) => {
    let input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, title: input.value });
  }

  const handlePublishEvent = () => {
    if(!banner.length) {
      return toast.error("Upload a blog banner to publish it");
    }

    if(!title.length) {
      return toast.error("Write blog title to publish it");
    }

    if(textEditor.isReady) {
      textEditor.save().then(data => {
        if(data.blocks.length) {
          setBlog({ ...blog, content: data });
          setEditorState("publish");
        } else {
          return toast.error("Write something in your blog to publish it");
        }
      }).catch((err) => {
        return toast.error(err.message);
      })
    }
  }

  const handleSaveDraft = (e) => {
    if(e.target.className.includes("disable")) {
      return;
    }

    if(!title.length) {
      return toast.error("Write blog title before saving it as a draft");
    }

    let loadingToast = toast.loading("Saving draft...");

    e.target.classList.add("disable");

    if(textEditor.isReady) {
      textEditor.save().then(content => {
        let blogObj = {
          title, banner, desc, content, tags, draft: true
        }
        
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", { ...blogObj, id: blog_id }, {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        })
        .then(() => {
          e.target.classList.remove("disable");
          toast.dismiss(loadingToast);
          toast.success("Saved in drafts ✅");
    
          setTimeout(() => {
            navigate("/dashboard/blogs?tab=draft"); 
          }, 1000);
        })
        .catch(({ response }) => {
          e.target.classList.remove("disable");
          toast.dismiss(loadingToast);
    
          return toast.error(response.data.error);
        })
      })
    }
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={theme == "light" ? darkLogo : lightLogo} alt="logo" />
        </Link>
        <p className="w-full text-black max-md:hidden line-clamp-1">
          { title.length ? title : "New Blog" }
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark"
            onClick={handlePublishEvent}
          >
            Publish
          </button>
          <button className="btn-light"
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
        </div>
      </nav>
      <Toaster />

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative transition-opacity duration-500 bg-white border-4 aspect-video hover:opacity-60 border-grey">
              <label htmlFor="uploadBanner">
                <img 
                  src={banner ? banner : (theme == "light" ? lightDefaultBanner : darkDefaultBanner)}
                  className="z-20"
                />
                <input 
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              defaultValue={title}
              placeholder="Blog Title"
              className="w-full h-20 mt-10 !text-4xl font-medium leading-tight outline-none resize-none placeholder:opacity-40 bg-white"
              onKeyDown={handleTitleKeyDown} 
              onChange={handleTitleChange}
            >
              
            </textarea>
            <hr className="w-full my-5 opacity-10" />

            <div id="textEditor" className="font-gelasio">

            </div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  )
}

export default BlogEditor;