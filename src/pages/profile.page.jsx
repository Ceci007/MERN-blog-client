import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import AboutUser from '../components/about.component';
import { filterPaginationData } from '../common/filter-pagination-data';
import InPageNavigation from '../components/inpage-navigation.component';
import BlogPostCard from '../components/blog-post.component';
import NoDataMessage from '../components/nodata.component';
import LoadMoreDataButton from '../components/load-more.component';
import PageNotFound from './404.page';

export const profileDataStructure = {
  personal_info: {
    fullname: "",
    username: "",
    profile_img: "",
    bio: ""
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  social_links: {},
  joinedAt: ""
}

const ProfilePage = () => {
  let { id: profileId } = useParams();
  const [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);
  const { userAuth: { username }} = useContext(UserContext)
  const [blogs, setBlogs] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState("");

  const { personal_info: { fullname, username: profile_username, profile_img, bio },
  account_info: {total_posts, total_reads}, social_links, joinedAt} = profile;

  const fetchUserProfile = () => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { username: profileId })
    .then(({ data: user }) => {
      if(user !== null) {
        setProfile(user);
      }
      setProfileLoaded(profileId);
      getBlogs({ user_id: user._id })
      setLoading(false);
    })
    .catch(err => {
      console.log(err);
      setLoading(false);
    })
  }

  const getBlogs = ({ page = 1, user_id }) => {
    user_id = user_id == undefined ? blogs.user_id : user_id;

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
      author: user_id,
      page
    })
    .then(async ({ data }) => {
      let formatedData = await filterPaginationData({
        state: blogs,
        data: data.blogs,
        page,
        countRoute: "/search-blogs-count",
        data_to_send: { author: user_id }
      })

      formatedData.user_id = user_id;
      setBlogs(formatedData);
    })
  }

  useEffect(() => {
    if(profileId !== profileLoaded) {
      setBlogs(null);
    }

    if(blogs === null) {
      resetStates();
      fetchUserProfile();
    }
  }, [profileId, blogs]);

  const resetStates = () => {
    setProfile(profileDataStructure);
    setProfileLoaded("");
    setLoading(true);
  }

  return (
    <AnimationWrapper>
      {
        loading ? <Loader /> :
          profile_username.length > 0 ?
            <section className="flex-row-reverse items-start h-cover md:flex gap-5 min-[1100px]:gap-12">
              <div className="flex flex-col gap-5 max-md:items-center min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
                <img src={profile_img} alt={profile_username} className="w-48 h-48 rounded-full bg-grey md:w-32 md:h-32" />
                <h1 className="!text-2xl font-medium">@{profile_username}</h1>
                <p className="h-6 !text-xl capitalize">{fullname}</p>
                <p>{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads</p>
                <div className="flex gap-4 mt-2">
                  {
                    profileId == username ?
                    <Link to="/settings/edit-profile" className="rounded-md btn-light">Edit profile</Link> :
                    null
                  }
                </div>
                <AboutUser bio={bio} social_links={social_links} 
                joinedAt={joinedAt} className="max-md:hidden" />
              </div>
              <div className="w-full max-md:mt-12">
              <InPageNavigation routes={["Blogs Published", "About User"]} defaultHidden={["About User"]}>
                <>
                  {
                    blogs === null ? 
                    <Loader /> : 
                    blogs.results.length ?
                      blogs.results.map((blog, i) => {
                        return <AnimationWrapper transition={{ duration: 1, delay: i*.1 }} key={i}>
                          <BlogPostCard content={blog} author={blog.author.personal_info} />
                        </AnimationWrapper>
                      }) :
                    <NoDataMessage message="No blogs published" />
                  }
                  <LoadMoreDataButton state={blogs} fetchDataFunc={getBlogs} />
                </>
                <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} />
              </InPageNavigation>
              </div>
            </section> :
            <PageNotFound />
      }
    </AnimationWrapper>
  )
}

export default ProfilePage;