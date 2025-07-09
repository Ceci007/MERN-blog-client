import React from 'react'

const LoadMoreDataButton = ({ state, fetchDataFunc, aditionalParam }) => {
  if(state !== null && state.totalDocs > state.results.length) {
    return (
      <button
        className="flex items-center gap-2 p-2 px-3 rounded-md text-dark-grey hover:bg-grey/30"
        onClick={() => fetchDataFunc({ ...aditionalParam, page: state.page + 1})}
      >
        Load More
      </button>
    )
  }
}

export default LoadMoreDataButton;