import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import "./Styles/AddComment.scss";

const AddComment = ({ buttonValue, addComments, replyingTo }) => {
  const replyingToUser = replyingTo ? `@${replyingTo}, ` : "";
  const [comment, setComment] = useState("");
  let { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();

  // const clickHandler = () => {
  //   //console.log("state", state);

  // if (comment === "" || comment === " ") return;

  // const newComment = {
  //   id: Math.floor(Math.random() * 100) + 5,
  //   content: replyingToUser + comment,
  //   createdAt: new Date(),
  //   score: 0,
  //   username: "juliusomo",
  //   currentUser: true,
  //   replies: [],
  // };

  // addComments(newComment);
  // setComment("");
  // };
  const clickHandler = () => {
    if (comment === "" || comment === " ") return;

    const newComment = {
      content: replyingToUser + comment,
      forum_id: state.forum.id,
    };

    addComments(newComment);
    setComment("");
  };

  // console.log("expireDate", state?.currentDocument);

  return (
    <div className="add-comment">
      <div className="profile-pic default-image"></div>
      <textarea
        className="comment-input"
        placeholder="نظر خود را بنویسید..."
        value={replyingToUser + comment}
        onChange={(e) => {
          setComment(
            e.target.value.replace(replyingTo ? `@${replyingTo}, ` : "", "")
          );
        }}
      />
      <div className="send-btn-container">
        <div className="profile-pic"></div>
        <button
          className="add-btn"
          onClick={clickHandler}
          disabled={
            new Date(state?.currentDocument?.expire_date) < new Date()
              ? true
              : false
          }
          style={{
            backgroundColor:
              new Date(state?.currentDocument?.expire_date) < new Date() &&
              "lightgray",
          }}
        >
          {buttonValue}
        </button>
      </div>
    </div>
  );
};

export default AddComment;
