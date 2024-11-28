export default function Comments() {
  return (
    <>
      <div className="my-2">
        <p className="text-sm" role="button">View all comments</p>
      </div>
      <div className="w-full relative">
        <textarea
          className="textarea textarea-xs rounded-none focus:outline-none border-0 border-b-2 border-gray-400 w-full"
          placeholder="Add a comment..."
        ></textarea>
        <button className="text-sm font-bold transition-opacity outline-none focus:outline-none absolute top-0 right-0 text-accent z-20">
          Post
        </button>
      </div>
    </>
  );
}
