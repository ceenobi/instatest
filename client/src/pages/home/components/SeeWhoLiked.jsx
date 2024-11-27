import { useState } from "react";
import { seeWhoLiked } from "@/api/post";
import { Alert, Modal } from "@/components";
import { handleError } from "@/utils";
import { toast } from "sonner";
import { followUser, unfollowUser } from "@/api/user";

export default function SeeWhoLiked({
  post,
  accessToken,
  loggedInUser,
  setUser,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const toggleFollowUser = async (userId) => {
    try {
      setLoading(true);
      const res = await followUser(userId, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message);
        setUser((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            following: [...res.data.user.following, ...prev.data.following],
          },
        }));
      }
    } catch (error) {
      handleError(setError, error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUnfollowUser = async (userId) => {
    try {
      setLoading(true);
      const res = await unfollowUser(userId, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message);
        setUser((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            followers: [...res.data.user.followers, ...prev.data.followers],
          },
        }));
      }
    } catch (error) {
      handleError(setError, error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    fetchLikes();
  };

  return (
    <>
      <button
        className="px-4 md:px-0 mt-2 hover:opacity-50 transition-opacity outline-none focus:outline-none"
        onClick={handleOpen}
      >
        {post?.likes?.length} likes
      </button>
      <Modal title="Likes" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="mt-4 min-h-[200px] max-h-[400px] overflow-y-auto">
          {error && <Alert error={error} classname="my-4" />}
          {post?.likes?.length === 0 && (
            <div className="text-center">No likes yet</div>
          )}
          {loading ? (
            <div className="flex justify-center items-center h-[200px]">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between"
                >
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
                  <button
                    className="btn btn-sm"
                    disabled={user._id === loggedInUser._id}
                    onClick={() => {
                      if (user.followers.includes(loggedInUser._id)) {
                        toggleUnfollowUser(user._id, accessToken);
                      } else {
                        toggleFollowUser(user._id, accessToken);
                      }
                    }}
                  >
                    {loading
                      ? "Loading..."
                      : user.followers.includes(loggedInUser._id)
                      ? "Unfollow"
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
