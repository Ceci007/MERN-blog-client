import React from 'react'
import { Link } from 'react-router-dom';
import { getDay } from '../common/date';

const MinimalBlogCard = ({ blog, index }) => {
  let {title, blog_id: id, 
    author: {personal_info: { fullname, username, profile_img }},
    publishedAt } = blog;

  return (
    <Link to={`/blog/${id}`} className="flex gap-5 mb-8">
      <h2 className="blog-index">{index < 10 ? "0" + (index + 1) : (index + 1)}</h2>
      <div>
        <div className="flex items-center gap-2 mb-7">
          <img 
            src={profile_img}
            alt={fullname}
            className="w-6 h-6 rounded-full"
          />
          <p className="line-clamp-1">{fullname} @{username}</p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>
        <h1 className="blog-title">{title}</h1>
      </div>
    </Link> 
  )
}

export default MinimalBlogCard; 