import { useState } from "react";
import { seeWhoLiked } from "@/api/post";
import { handleError, toggleFollowUser } from "@/utils";
import { useAuthStore } from "@/hooks";
import { Link } from "react-router-dom";
import { Alert, Modal } from "@/components";

export default function SeeWhoLiked({ post }) {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followText, setFollowText] = useState("");
  const [activeBtn, setActiveBtn] = useState(0);
  const [error, setError] = useState(null);
  const { accessToken, user, setUser } = useAuthStore();
  const { data } = user || {};
  const loggedInUser = data || {};

  const fetchLikes = async () => {
    try {
      setLoading(true);
      const res = await seeWhoLiked(post._id, accessToken);
      if (res.status === 200) {
        setUsers(res.data.users);
      }
    } catch (error) {
      handleError(setError, error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollowUserFn = async (userId) => {
    const res = await toggleFollowUser(
      userId,
      setFollowText,
      accessToken,
      setUser,
      setError
    );
    return res;
  };

  const handleClose = () => {
    setIsOpen(false);
    setUsers([]);
  };

  const handleOpen = () => {
    setIsOpen(true);
    fetchLikes();
  };

  return (
    <>
      <button
        className="font-semibold hover:opacity-50 transition-opacity outline-none focus:outline-none"
        onClick={handleOpen}
        title="See who liked this post"
      >
        {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
      </button>

      <Modal title="Likes" isOpen={isOpen} onClose={handleClose}>
        <div className="mt-4 min-h-[200px] max-h-[400px] overflow-y-auto">
          {error && <Alert error={error} classname="my-4" />}
          {!loading && !error && post?.likes?.length === 0 && (
            <div className="text-center flex justify-center min-h-[200px] items-center">
              <p className="text-lg font-semibold">No likes yet 😔 </p>
            </div>
          )}
          {loading ? (
            <div className="flex justify-center items-center h-[200px]">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user, index) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between"
                >
                  <Link to={`/profile/${user.username}`}>
                    <div className="flex items-center gap-2">
                      <div className="avatar">
                        <div className="w-[40px] rounded-full">
                          <img
                            src={
                              user?.profilePicture ||
                              "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            }
                            alt={user.username}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.fullname}</p>
                      </div>
                    </div>
                  </Link>
                  <button
                    className={`btn btn-sm w-[110px] focus:outline-none ${
                      loggedInUser.following.includes(user._id)
                        ? "btn-accent text-white"
                        : ""
                    }`}
                    disabled={user._id === loggedInUser._id}
                    onClick={() => {
                      toggleFollowUserFn(user._id);
                      setActiveBtn(index);
                    }}
                    title={
                      loggedInUser.following.includes(user._id)
                        ? "Unfollow"
                        : "Follow"
                    }
                  >
                    {loggedInUser.following.includes(user._id)
                      ? followText && activeBtn === index
                        ? followText
                        : "Following"
                      : followText && activeBtn === index
                      ? followText
                      : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
