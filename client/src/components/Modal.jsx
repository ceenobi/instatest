export default function Modal({
  id,
  title,
  children,
  isOpen,
  onClose,
  step,
  setStep,
  selectedImages,
  classname,
}) {
  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <dialog
      id={id}
      className={`modal modal-bottom sm:modal-middle ${
        isOpen ? "modal-open" : ""
      }`}
    >
      <div className={`modal-box ${classname}`}>
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <form method="dialog">
            {step && selectedImages.length > 0 && (
              <div className="flex gap-4">
                <button className="btn btn-sm" onClick={handlePrev}>
                  Prev
                </button>
                <button
                  className="btn btn-sm btn-neutral"
                  onClick={handleNext}
                  disabled={step === 2}
                >
                  Next
                </button>
              </div>
            )}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={onClose}
            >
              ✕
            </button>
          </form>
        </div>
      </div>
      <div className="modal-backdrop bg-zinc/80" onClick={onClose} />
    </dialog>
  );
}
