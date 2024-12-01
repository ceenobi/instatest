export default function ActionButton({
  type,
  loading,
  text,
  classname,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={loading}
      {...rest}
      className={`btn rounded-none h-[42px] text-white border-0 ${classname}`}
    >
      {loading ? <span className="loading loading-spinner"></span> : text}
    </button>
  );
}
