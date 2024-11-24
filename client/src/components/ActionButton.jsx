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
      className={`btn rounded-none h-[38px] text-white ${classname}`}
    >
      {loading ? <span className="loading loading-spinner"></span> : text}
    </button>
  );
}
