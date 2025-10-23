import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ReactComponent as IconPlus } from "./Assets/images/icon-plus.svg";
import { ReactComponent as IconMinus } from "./Assets/images/icon-minus.svg";
import { add_forum_message_score } from "../_redux/workDeskCrud";
import { actions } from "../_redux/workDeskRedux";

const CommentVotes = ({
  vote,
  setVoted,
  score,
  setScore,
  updateScore,
  commentData,
}) => {
  let { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();

  // up vote and down vote
  let upVote = () => {
    if (vote === false) {
      const data = {
        score: 1,
        message_id: commentData.id,
      };
      // add_forum_message_score(data).then((res) => {
      let n = score + 1;
      setScore(n);
      updateScore(n, commentData.id, "reply");
      setVoted(true);
      // });
    }
  };

  let downVote = () => {
    if (vote === true) {
      const data = {
        score: -1,
        message_id: commentData.id,
      };

      // add_forum_message_score(data).then((res) => {
      let n = score - 1;
      setScore(n);
      updateScore(n, commentData.id, "reply");
      setVoted(false);
      // });
    }
  };

  return (
    <div className="comment--votes">
      <button className="plus-btn" onClick={upVote} aria-label="plus-btn">
        <IconPlus />
      </button>
      <div className="votes-counter">{commentData.score}</div>
      <button className="minus-btn" onClick={downVote} aria-label="minus-btn">
        <IconMinus />
      </button>
    </div>
  );
};

export default CommentVotes;
