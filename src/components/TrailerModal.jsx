import Modal from "react-modal";
import "./../app.scss";

const TrailerModal = ({ isOpen, onRequestClose, videoKey }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <button className="close-button" onClick={onRequestClose}>
        &times;
      </button>
      <div className="iframe-container">
        <iframe
          data-testid="youtube-player"
          src={`https://www.youtube.com/embed/${videoKey}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video player"
        ></iframe>
      </div>
    </Modal>
  );
};

export default TrailerModal;
