import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  get_document_forum,
  get_forum_messages,
  add_forum_messages,
  delete_forum_messages,
  update_forum_messages,
  add_comment,
} from "../_redux/workDeskCrud";
import { actions } from "../_redux/workDeskRedux";
import "./Styles/App.scss";
import Comment from "./Comment";
import AddComment from "./AddComment";
import { useHistory } from "react-router-dom";
import { errorNotification } from "./functions";

export default () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [comments, updateComments] = useState([]);
  const [deleteModalState, setDeleteModalState] = useState(false);
  let history = useHistory();
  let { state } = useSelector(
    (state) => ({
      state: state.workDeskReducer,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      state.currentDocument &&
      state.currentDocument.is_forum_available == 1
    ) {
      get_document_forum(state.currentDocument.id).then((res) => {
        dispatch(actions.handle_variables("forum", res.data[0]));
        get_forum_messages(res.data[0].id).then((c) => {
          //console.log("res", c);
          dispatch(actions.handle_variables("forumMessages", c.data));
          //console.log("messages", c.data);
          if (c.data.length > 0) {
            updateComments(c.data);
          }
        });
      });
    }
  }, [state.currentDocument]);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
    deleteModalState
      ? document.body.classList.add("overflow--hidden")
      : document.body.classList.remove("overflow--hidden");
  }, [comments, deleteModalState]);

  // update score
  let updateScore = (score, id, type) => {
    let updatedComments = [...comments];

    if (type === "comment") {
      updatedComments.forEach((data) => {
        if (data.id === id) {
          data.score = score;
        }
      });
    } else if (type === "reply") {
      updatedComments.forEach((comment) => {
        comment.replies.forEach((data) => {
          if (data.id === id) {
            data.score = score;
          }
        });
      });
    }
    updateComments(updatedComments);
  };

  // add comments
  let addComments = (newComment) => {
    //let updatedComments = [...comments, newComment];
    add_forum_messages(newComment)
      .then((res) => {
        //console.log("res 66666666666666666666666666666", res);
        get_forum_messages(state.forum.id).then((c) => {
          //console.log("res", c);
          dispatch(actions.handle_variables("forumMessages", c.data));
          //console.log("messages", c.data);
          if (c.data.length > 0) {
            updateComments(c.data);
          }
        });
      })
      .catch((err) => {
        //console.log("err", err);
      });
  };

  // add replies
  let updateReplies = (replies, id) => {
    //console.log("replies", replies);
    //console.log("id", id);
    let index = replies.length - 1;
    const data = replies[index];
    add_forum_messages(data).then((res) => {
      //console.log("res", res);
      get_forum_messages(state.forum.id).then((c) => {
        //console.log("res", c);
        dispatch(actions.handle_variables("forumMessages", c.data));
        //console.log("messages", c.data);
        if (c.data.length > 0) {
          updateComments(c.data);
        }
      });
    });
  };

  let editComment = (content, id, type) => {
    const data = {
      content: content,
      message_id: id,
    };
    update_forum_messages(id, data).then((res) => {
      //console.log("res 66666666666666666666666666666", res);
      get_forum_messages(state.forum.id).then((c) => {
        //console.log("res", c);
        dispatch(actions.handle_variables("forumMessages", c.data));
        //console.log("messages", c.data);
        if (c.data.length > 0) {
          updateComments(c.data);
        }
      });
    });

    let updatedComments = [...comments];

    if (type === "comment") {
      updatedComments.forEach((data) => {
        if (data.id === id) {
          data.content = content;
        }
      });
    } else if (type === "reply") {
      updatedComments.forEach((comment) => {
        comment.replies.forEach((data) => {
          if (data.id === id) {
            data.content = content;
          }
        });
      });
    }

    updateComments(updatedComments);
  };

  // delete comment
  let commentDelete = (id, type, parentComment) => {
    let updatedComments = [...comments];
    let updatedReplies = [];

    if (type === "comment") {
      delete_forum_messages(id).then((res) => {
        //console.log("res", res);
        get_forum_messages(state.forum.id).then((c) => {
          //console.log("res", c);
          dispatch(actions.handle_variables("forumMessages", c.data));
          //console.log("messages", c.data);
          if (c.data.length > 0) {
            updateComments(c.data);
          }
        });
      });
      //updatedComments = updatedComments.filter((data) => data.id !== id);
    } else if (type === "reply") {
      comments.forEach((comment) => {
        if (comment.id === parentComment) {
          delete_forum_messages(id).then((res) => {
            //console.log("res", res);
            get_forum_messages(state.forum.id).then((c) => {
              //console.log("res", c);
              dispatch(actions.handle_variables("forumMessages", c.data));
              //console.log("messages", c.data);
              if (c.data.length > 0) {
                updateComments(c.data);
              }
            });
          });

          // updatedReplies = comment.replies.filter((data) => data.id !== id);
          // comment.replies = updatedReplies;
        }
      });
    }

    updateComments(updatedComments);
  };

  const addDocumentComment = async () => {
    const data = {
      document_id: state.currentDocument.id,
    };
    //console.log(state.currentDocument.id);

    const res = await add_comment(data);
    if (res.data.status == false) {
      errorNotification("شما قبلا برای این مستند نظر ثبت کرده اید");
    } else {
      history.push(
        "details/" +
          res.data.app_uid +
          "/1" +
          "&sid=" +
          localStorage.getItem("session_id")
      );
    }

    // history.push(`/details/${rest.data.app_uid}/1`);
  };

  return (
    <>
      <div style={{ marginTop: 50 }} className="row">
        <div className="col-sm-3">
          <span
            style={{ color: "#3276b1", marginLeft: 6, fontWeight: "bolder" }}
          >
            عنوان سازمان
          </span>
          {state.currentDocument && state.currentDocument.organization_title}
        </div>
        <div className="col-sm-3">
          <span
            style={{ color: "#3276b1", marginLeft: 6, fontWeight: "bolder" }}
          >
            شماره کمیته
          </span>
          {state.currentDocument && state.currentDocument.tc_title}
        </div>
        <div className="col-sm-3">
          <span
            style={{ color: "#3276b1", marginLeft: 6, fontWeight: "bolder" }}
          >
            عنوان کمیته
          </span>
          {state.currentDocument && state.currentDocument.tc_fa_title}
        </div>
        <div className="col-sm-3">
          <span
            style={{ color: "#3276b1", marginLeft: 6, fontWeight: "bolder" }}
          >
            عنوان پیشنهاد
          </span>
          {state.currentDocument && state.currentDocument.category_title}
        </div>
      </div>
      <div style={{ marginTop: 10 }} className="row">
        <div className="col-sm-12">
          <p>{state.currentDocument && state.currentDocument.description}</p>
        </div>
      </div>
      <div style={{ marginTop: 10 }} className="row">
        <div
          className="col-sm-12"
          style={{ display: "flex", justifyContent: "end" }}
        >
          {state.currentDocument &&
          state.currentDocument.is_comment_available == 1 ? (
            <button
              disabled={
                new Date(state.currentDocument.expire_date) < new Date()
              }
              style={{ marginLeft: 10 }}
              onClick={() => addDocumentComment()}
              className="btn btn-primary"
            >
              {state.currentDocument.document_type_id == 2
                ? "ثبت کامنت"
                : "ثبت پاسخ سوالات"}
            </button>
          ) : null}

          <a
            disabled={new Date(state.currentDocument.expire_date) < new Date()}
            href={
              state.currentDocument && `${state.currentDocument.path}`
            }
            className="btn btn-success"
            target="_blank"
            download
          >
            دانلود مستندات
          </a>
        </div>
      </div>
      {comments.length > 0
        ? comments.map((comment) => (
            <Comment
              key={comment.id}
              commentData={comment}
              updateScore={updateScore}
              updateReplies={updateReplies}
              editComment={editComment}
              commentDelete={commentDelete}
              setDeleteModalState={setDeleteModalState}
            />
          ))
        : null}
      {state.currentDocument.is_forum_available == 1 ? (
        <AddComment buttonValue={"ثبت"} addComments={addComments} />
      ) : null}
    </>
  );
};
