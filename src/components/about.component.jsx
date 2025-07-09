import React from 'react'
import { Link } from 'react-router-dom';
import { getFullDay } from '../common/date';

const AboutUser = ({ className, bio, social_links, joinedAt }) => {
  return (
    <div className={"md:w-[90%] md:mt-7 " + className}>
      <p className="!text-xl leading-7">{bio.length > 0 ? bio : "Nothing to read here"}</p>
      <div className="flex flex-wrap items-center gap-2 my-7 text-dark-grey">
        {Object.keys(social_links).map((key) => {
          let link = social_links[key];

          return link ? <Link to={link} key={key} target="_blank" className="flex items-center px-3 py-1 rounded-md bg-grey hover:text-black"><i className={"!text-xl mr-1 fi " + (key !== "website" ? "fi-brands-" + key : "fi-br-globe")} /> {key}</Link> : null
        })}
      </div>
      <p className="!text-xl leading-7 text-dark-grey">Joined on {getFullDay(joinedAt)}</p>
    </div>
  )
}

export default AboutUser;