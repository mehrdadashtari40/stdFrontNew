import { ReactComponent as IconReply } from "./Assets/images/icon-reply.svg";
import { ReactComponent as IconDelete } from "./Assets/images/icon-delete.svg";
import { ReactComponent as IconEdit } from "./Assets/images/icon-edit.svg";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
const CommentBtn = ({
  commentData,
  setReplying,
  setDeleting,
  setDeleteModalState,
  setEditing,
}) => {
  // adding reply

  // //console.log(setReplying, setDeleting, se)

  let { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();
  let counter = false;
  const showAddComment = () => {
    counter ? setReplying(false) : setReplying(true);
    counter = true;
  };

  // delete comment
  const showDeleteModal = () => {
    setDeleting(true);
    setDeleteModalState(true);
  };

  // edit comment
  const showEditComment = () => {
    setEditing(true);
  };

  return (
    <div className="comment--btn">
      <button
        className={`reply-btn ${
          !commentData.currentUser ? "" : "display--none"
        }`}
        onClick={showAddComment}
      >
        <IconReply /> پاسخ
      </button>
      {commentData.user_id === state.userId ? (
        <>
          <button
            className={`delete-btn ${
              commentData.currentUser ? "" : "display--none"
            }`}
            onClick={showDeleteModal}
          >
            <IconDelete /> حذف
          </button>
          <button
            className={`edit-btn ${
              commentData.currentUser ? "" : "display--none"
            }`}
            onClick={showEditComment}
          >
            <IconEdit /> ویرایش
          </button>
        </>
      ) : null}
    </div>
  );
};

export default CommentBtn;
