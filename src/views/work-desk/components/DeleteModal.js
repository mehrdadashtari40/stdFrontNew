import "./Styles/DeleteModal.scss";

const DeleteModal = ({ setDeleting, deleteComment, setDeleteModalState }) => {
  const cancelDelete = () => {
    setDeleting(false);
    setDeleteModalState(false);
  };

  const deleteBtnClick = () => {
    deleteComment();
    setDeleteModalState(false);
  };

  return (
    <div className="delete-confirmation-wrapper">
      <div className="delete-container">
        <div className="title">حذف نظر</div>
        <div className="confirmation-message">
          آیا از حذف این نظر اطمینان دارید؟
        </div>
        <div className="btn-container">
          <button className="cancel-btn" onClick={cancelDelete}>
            بازگشت
          </button>
          <button className="delete-btn" onClick={deleteBtnClick}>
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
