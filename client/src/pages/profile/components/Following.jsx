import { getFollowing } from "@/api/user";
import { Alert, Modal } from "@/components";
import { useAuthStore, useFetch } from "@/hooks";
import { toggleFollowUser } from "@/utils";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Following({ userProfile, profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const [followText, setFollowText] = useState("");
  const [err, setError] = useState(null);
  const [activeBtn, setActiveBtn] = useState(0);
  const { accessToken, user, setUser } = useAuthStore();
  const { error, data, loading } = useFetch(getFollowing, profile, accessToken);
  const following = data?.following || [];
  const loggedInUser = user?.data || {};

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

  return (
    <>
      <h1
        className="hidden md:block text-lg"
        onClick={() => setIsOpen(true)}
        role="button"
      >
        <span className="font-bold">{userProfile?.following?.length}</span>{" "}
        following
      </h1>
      <div
        className="md:hidden text-center"
        onClick={() => setIsOpen(true)}
        role="button"
      >
        <p className="font-bold"> {userProfile?.following?.length}</p>
        <span className="text-neutral text-sm">following</span>
      </div>
      <Modal title="Following" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="mt-4 min-h-[200px] max-h-[400px] overflow-y-auto">
          {error || (err && <Alert error={err} classname="my-4" />)}
          {!loading && !error && following?.length === 0 && (
            <div className="text-center flex justify-center min-h-[200px] items-center">
              <p className="text-lg font-semibold">No following yet 😔 </p>
            </div>
          )}
          {loading ? (
            <div className="flex justify-center items-center h-[200px]">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : (
            <div className="space-y-4">
              {following
                .filter((user) => user._id !== loggedInUser._id)
                .map((user, index) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between"
                  >
                    <Link to={`/${user.username}`}>
                      <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                          <div className="w-[45px] rounded-full border-2">
                            {user?.profilePicture ? (
                              <img
                                src={user?.profilePicture}
                                alt={user?.username}
                              />
                            ) : (
                              <span className="text-3xl">
                                {user?.username?.charAt(0)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold">{user.username}</p>
                          <p className="text-sm text-gray-500">
                            {user.fullname}
                          </p>
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
