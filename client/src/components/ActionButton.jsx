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
      loading={loading}
      disabled={loading}
      {...rest}
      className={`btn rounded-none  ${classname}`}
    >
      {loading ? <span className="loading loading-spinner"></span> : text}
    </button>
  );
}
