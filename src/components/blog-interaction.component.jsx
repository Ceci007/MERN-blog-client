import { useContext, useEffect } from "react";
import { BlogContext } from '../pages/blog.page';
import { UserContext } from "../App";
import { Link } from 'react-router-dom';
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

const BlogInteraction = () => {
  let {blog, blog: {_id, title, blog_id, activity, activity: {total_likes, total_comments}, 
  author: {personal_info: {username: author_username}}}, setBlog, isLikedByUser, setIsLikedByUser,
  setCommentsWrapper} = useContext(BlogContext)

  const { userAuth: { username, access_token } } = useContext(UserContext);

  useEffect(() => {
    if(access_token) {
      axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/is-liked-by-user", { _id }, {
        headers: {
          "Authorization": `Bearer ${access_token}`
        }
      })
      .then(({ data: {result}}) => {
        setIsLikedByUser(Boolean(result));
      }) 
      .catch(err => {
        console.log(err);
      })
    }
  }, [])
  
  const handleLike = () => {
    if(access_token) {
      setIsLikedByUser(prevVal => !prevVal);

      if(!isLikedByUser) {
        total_likes = total_likes + 1 
      } else {
        if(total_likes > 0) {
          total_likes = total_likes - 1
        }
      }

      setBlog({ ...blog, activity: {...activity, total_likes}}); 

      axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", { _id, isLikedByUser }, {
        headers: {
          "Authorization": `Bearer ${access_token}`
        }
      })
      .then(({data}) => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      })
    } else {
      toast.error("Please loggin to like this blog post");
    }
  }

  return (
    <>
      <Toaster />
      <hr className="my-2 border-grey" />

      <div className="flex justify-between gap-6">
        <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={"flex items-center justify-center w-10 h-10 rounded-full " + (isLikedByUser ? "bg-[#ffa1ad]" : "bg-grey/80" )}
            >
              {isLikedByUser ? <i className="text-[#a50036] fi fi-ss-heart" /> : <i className="fi fi-bs-heart" />}
            </button>
            <p className="!text-xl text-dark-grey">{total_likes}</p>

            <button
              onClick={() => setCommentsWrapper(prevVal => !prevVal)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-grey/80" 
            >
              <i className="fi fi-br-comment-dots" />
            </button>
            <p className="!text-xl text-dark-grey">{total_comments}</p>
        </div>

        <div className="flex items-center gap-6">
          {
            username === author_username ? <Link to={`/editor/${blog_id}`} className="underline hover:text-purple">Edit</Link> : null
          }
          <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}>
            <i className="fi fi-brands-twitter !text-xl hover:text-twitter" />
          </Link>
        </div>
      </div>

      <hr className="my-2 border-grey" />
    </>
  )
}

export default BlogInteraction;