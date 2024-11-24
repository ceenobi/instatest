export default function Modal({ id, title, children, isOpen, onClose }) {
  return (
    <dialog id={id} className="modal" open={isOpen}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-sm" onClick={onClose}>Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
