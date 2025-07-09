import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const NotificationCommentField = ({ _id, blog_author, index = undefined, replyingTo = undefined,
  setIsReplying, notification_id, notificationData
 }) => {
  let [comment, setComment] = useState("");

  let { _id: user_id } = blog_author;
  let { userAuth: { access_token }} = useContext(UserContext);
  let { notifications, notifications: { results }, setNotifications } = notificationData;

  const handleComment = () => {
    if(!comment?.length) {
      return toast.error("You must write something to leave a comment");
    }

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/add-comment", {
      _id, blog_author: user_id, comment, replying_to: replyingTo,
      notification_id
    }, {
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    })
    .then(({data}) => {
      setIsReplying(false);

      results[index].reply = { comment, _id: data._id }
      setNotifications({ ...notifications, results })
    })
    .catch(err => {
      console.log(err);
    })
  } 

  return (
    <>
      <Toaster />
      <textarea  
        value={comment} 
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a reply..."
        className="pl-5 resize-none input-box placeholder:text-dark-grey h-[150px] overflow-auto" 
      ></textarea>
      <button
        onClick={handleComment} 
        className="px-10 mt-5 btn-dark"
      >Reply</button>
    </>
  )
}

export default NotificationCommentField;