import React from 'react'

const Img = ({ url, caption }) => {
  return (
    <div>
      <img 
        src={url}
        alt={caption}
      />
      {caption.length > 0 ? <p className="w-full my-3 !text-base text-center md:mb-12 text-dark-grey">{caption}</p> : null}
    </div>
  )
}

const Quote = ({ quote, caption }) => {
  return (
    <div className="p-3 pl-5 border-l-4 bg-purple/10 border-purple">
      <p className="!text-xl leading-10 md:!text-2xl">{quote}</p> {caption.length > 0 ? <p className="w-full text-purple !text-base">{caption}</p> : null}
    </div>
  )
}

const List = ({ style, items }) => {
  return (
    <>
      {
        items.length > 0 ?
        <ol className={`pl-5 ${style === "ordered" ? " list-decimal" : " list-disc"}`}>
          {items.map((item, i) => {
            return <li key={i} className="my-4" dangerouslySetInnerHTML={{ __html: item }}></li>
          })}
        </ol> : null
      }
    </>
  )
}

const BlogContent = ({block}) => {
  const { type, data } = block;

  if(type === "paragraph") {
    return <p dangerouslySetInnerHTML={{ __html: data.text}}></p>
  } 
  
  if(type === "header") {
    if(data.level === 3) {
      return <h3 className="!text-3xl font-bold" dangerouslySetInnerHTML={{ __html: data.text}}></h3>
    }

    return <h2 className="!text-4xl font-bold" dangerouslySetInnerHTML={{ __html: data.text}}></h2>
  }

  if(type === "image") {
    return <Img url={data.file.url} caption={data.caption || ""} />
  }

  if(type === "quote") {
    return <Quote quote={data.text} caption={data.caption || ""} />
  }

  if(type === "list") {
    return <List style={data.style} items={data.items} />
  }
  
  else {
    return <h1>This is a block</h1>
  }
}

export default BlogContent;