import React from 'react'

const DocumentPlaceholder = React.memo(({ children }) => (
  <div className="document">
    {children || (
      <>
        <div className="header linear-animation" />
        <div className="line-short linear-animation" />
        <div className="line-short linear-animation" />
        <div className="line-short linear-animation" />
        <div className="spacer" />
        <div className="line linear-animation" />
        <div className="line linear-animation" />
        <div className="line linear-animation" />
        <div className="line linear-animation" />
        <div className="line linear-animation" />
        <div className="line linear-animation" />
        <div className="line linear-animation" />
        <div className="line linear-animation" />
        <div className="line linear-animation" />
        <div className="pagination linear-animation" />
      </>
    )}
  </div>
))

export default DocumentPlaceholder
