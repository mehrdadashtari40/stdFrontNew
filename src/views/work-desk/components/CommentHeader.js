import CommentBtn from "./CommentBtn";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
const CommentHeader = ({
  commentData,
  setReplying,
  setDeleting,
  setDeleteModalState,
  setEditing,
  time,
}) => {
  let { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );
 // console.log("commentData", commentData);
  return (
    <div className="comment--header">
      <div className={`profile-pic default-image`}></div>
      <div className="username">{commentData?.name}</div>
      {commentData.user_id === state.userId ? (
        <div className="you-tag">شما</div>
      ) : (
        ""
      )}
      <div className="comment-posted-time">{`${time} پیش`}</div>
      <CommentBtn
        commentData={commentData}
        setReplying={setReplying}
        setDeleting={setDeleting}
        setDeleteModalState={setDeleteModalState}
        setEditing={setEditing}
      />
    </div>
  );
};

export default CommentHeader;
