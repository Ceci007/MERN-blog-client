import { useNavigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { EditorContext } from '../pages/editor.page';
import { UserContext } from '../App';
import { Toaster, toast } from 'react-hot-toast';
import AnimationWrapper from '../common/page-animation';
import Tag from './tag.component';
import axios from 'axios';

const PublishForm = () => {
  let characterLimit = 200;
  let tagLimit = 10;
  let { blog_id } = useParams();
  let navigate = useNavigate();
  let { blog, blog: { banner, title, content, tags, desc }, setBlog, setEditorState } = useContext(EditorContext);
  let { userAuth: { access_token }} = useContext(UserContext)

  const handleCloseEvent = () => {
    setEditorState("editor"); 
  }

  const handleBlogTitleChange = (e) => {
    let input = e.target;

    setBlog({ ...blog, title: input.value });
  }

  const handleBlogDescriptionChange = (e) => {
    let input = e.target;

    setBlog({ ...blog, desc: input.value });
  }

  const handleTitleKeyDown = (e) => {
    if(e.keyCode === 13) {
      e.preventDefault();
    }
  }

  const handleTagKeyDown = (e) => {
    if(e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();

      let tag = e.target.value;

      if(tags?.length < tagLimit) {
        if(!tags?.includes(tag) && tag?.length > 0) {
          setBlog({ ...blog, tags: [ ...tags, tag ] });
        }
      } else {
        toast.error(`you can add max ${tagLimit} tags`);
      }

      e.target.value = "";
    }
  }

  const publishBlog = (e) => {
    if(e.target.className.includes("disable")) {
      return;
    }

    if(!title?.length) {
      return toast.error("Write blog title before publishing");
    }

    if(!desc?.length || desc?.length > characterLimit) {
      return toast.error(`Write a description about your blog within ${characterLimit} characters to publish`);
    }

    if(!tags?.length) {
      return toast.error("Enter at least 1 tag to help us rank your blog post")
    }

    let loadingToast = toast.loading("Publishing...");

    e.target.classList.add("disable");

    let blogObj = {
      title, banner, desc, content, tags, draft: false
    }

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", { ...blogObj, id: blog_id }, {
      headers: {
        Authorization: `Bearer ${access_token}`
      } 
    })
    .then(() => {
      e.target.classList.remove("disable");
      toast.dismiss(loadingToast);
      toast.success("Your blog post was published successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    })
    .catch(({ response }) => {
      e.target.classList.remove("disable");
      toast.dismiss(loadingToast);

      return toast.error(response?.data?.error);
    })
  }

  return (
    <AnimationWrapper>
      <section className="grid items-center w-screen min-h-screen py-16 lg:grid-cols-2 lg:gap-4">
        <Toaster />
        <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handleCloseEvent}
        >
          <i className="fi fi-br-cross" />
        </button>
        <div className="max-w-[550px] center">
          <p className="mb-1 text-dark-grey">Preview</p>
          <div className="w-full mt-4 overflow-hidden rounded-lg aspect-video bg-grey">
            <img 
              src={banner}
              alt="blog banner"
            />
          </div>
          <h1 className="mt-2 text-4xl font-medium leading-tight line-clamp-2">{ title }</h1>
          <p className="mt-4 text-xl leading-7 font-gelasio line-clamp-2">{ desc }</p>
        </div>

        <div className="border-grey lg:border-1 lg:pl-8">
          <p className="mb-2 text-dark-grey mt-9">Blog Title</p>
          <input 
            type="text" 
            placeholder="Blog Title" 
            defaultValue={title}
            className="pl-4 input-box"
            onChange={handleBlogTitleChange} 
          />

          <p className="mb-2 text-dark-grey mt-9">Short description about your blog post</p>
          <textarea
            maxLength={characterLimit}
            defaultValue={desc}
            className="h-40 pl-4 leading-7 resize-none input-box"
            onChange={handleBlogDescriptionChange}
            onKeyDown={handleTitleKeyDown}
          >

          </textarea> 
          <p className="mt-1 text-sm text-right text-dark-grey">{characterLimit - desc?.length} characters left</p>
          <p className="mb-2 text-dark-grey mt-9">Topics - (Help is searching and ranking your blog post)</p>
          <div className="relative py-2 pb-4 pl-2 input-box">
            <input type="text" placeholder="Topic" 
              className="sticky top-0 left-0 pl-4 mb-3 bg-white input-box focus:bg-white"
              onKeyDown={handleTagKeyDown}
            />
            {tags.map((tag, i) => {
              return (
                <Tag tag={tag} tagIndex={i} key={i} />
              )
            })}
          </div>
          <p className="mt-1 mb-4 text-right text-dark-grey">{tagLimit - tags.length} tags left</p>
          <button className="px-8 btn-dark"
            onClick={publishBlog}
          >
            Publish
          </button>
        </div>
      </section>
    </AnimationWrapper>
  )
}

export default PublishForm;