import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import { filterPaginationData } from "../common/filter-pagination-data";
import { Toaster } from "react-hot-toast";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";
import ManagePublishedBlogCard from "../components/manage-blogcard.component";

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState(null);
  const [drafts, setDrafts] = useState(null);
  const [query, setQuery] = useState("");

  let { userAuth: { access_token }} = useContext(UserContext);

  const getBlogs = ({ page, draft, deletedDocCount = 0 }) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/user-written-blogs", {
      page, draft, query, deletedDocCount
    }, {
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    })
    .then(async ({ data }) => {
      let formatedData = await filterPaginationData({
        state: draft ? drafts : blogs,
        data: data.blogs, 
        page,
        user: access_token,
        countRoute: "/user-written-blogs-count",
        data_to_send: { draft, query }
      });

      if(draft) {
        setDrafts(formatedData);
      } else {
        setBlogs(formatedData);
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  useEffect(() => {
    if(access_token) {
      if(blogs == null) {
        getBlogs({ page: 1, draft: false });
      }

      if(drafts == null) {
        getBlogs({ page: 1, draft: true });
      }
    }
  }, [access_token, blogs, drafts, query]);

  const handleSearch = (e) => {
    let searchQuery = e.target.value; 

    setQuery(searchQuery);

    if(e.keyCode == 13 && searchQuery.length > 0) {
      setBlogs(null);
      setDrafts(null);
    }
  }

  const handleChange = (e) => {
    if(!e.target.value.length) {
      setQuery("");
      setBlogs(null);
      setDrafts(null);
    }
  }

  return (
    <>
      <h1 className="max-md:hidden">Manage Bolgs</h1>
      <Toaster />
      <div className="relative mb-10 max-md:mt-5 md:mt-8">
        <input 
          type="search"
          className="w-full p-4 pl-12 pr-6 rounded-full bg-grey placeholder:text-dark-grey"
          placeholder="Search Blogs"
          onChange={handleChange}
          onKeyDown={handleSearch}
        />
        <i className="fi fi-br-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 !text-xl text-dark-grey"/>
      </div>
      <InPageNavigation routes={["Published Blogs", "Drafts"]}>
        {
          blogs == null ? <Loader /> :
          blogs.results.length > 0 ?
          <>
            {
              blogs.results.map((blog, i) => {
                return <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                  <ManagePublishedBlogCard blog={blog} />
                </AnimationWrapper>
              })
            }
          </>
          : <NoDataMessage message="No published blogs found" />
        }
        
        <h1>This is drafts blogs</h1>
      </InPageNavigation>
    </>
  )
}

export default ManageBlogs;