import { Search as SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { searchUsers } from "@/api/user";
import { useAuthStore } from "@/hooks";
import { handleError } from "@/utils";
import { Link } from "react-router-dom";

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken } = useAuthStore();
  const drawerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
        setUsers([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchTerm.trim()) {
        setLoading(true);
        try {
          const res = await searchUsers(searchTerm, accessToken);
          setUsers(res.data.users);
        } catch (error) {
          handleError(setError, error);
        } finally {
          setLoading(false);
        }
      } else {
        setUsers([]);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm, accessToken]);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <>
      <SearchIcon size={28} onClick={handleOpen} className={`cursor-pointer ${isOpen ? "text-accent" : ""}`} />
      <div
        className={`drawer fixed top-0 left-[80px] ${
          isOpen ? "drawer-open" : ""
        } z-20`}
      >
        <input
          type="checkbox"
          className="drawer-toggle"
          checked={isOpen}
          onChange={() => setIsOpen(!isOpen)}
        />
        <div className="drawer-side">
          <label
            className="drawer-overlay"
            onClick={() => setIsOpen(false)}
          ></label>
          <div
            ref={drawerRef}
            className="menu w-80 h-screen bg-base-200 text-base-content p-4"
          >
            <div className="mb-4">
              <input
                type="search"
                ref={inputRef}
                placeholder="Search users"
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="overflow-y-auto">
              {error && (
                <div className="alert alert-error">
                  <p>{error.message}</p>
                </div>
              )}

              {loading ? (
                <div className="flex justify-center">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : (
                <>
                  {users.length > 0
                    ? users.map((user) => (
                        <Link
                          key={user._id}
                          to={`/${user.username}`}
                          onClick={() => {
                            setIsOpen(false);
                            setSearchTerm("");
                            setUsers([]);
                          }}
                          className="flex items-center gap-3 mb-4 p-2 hover:bg-base-300 rounded-lg"
                        >
                          <div className="avatar placeholder">
                            <div className="w-10 rounded-full border-2">
                              {user.profilePicture ? (
                                <img
                                  src={user.profilePicture}
                                  alt={user.username}
                                  loading="lazy"
                                />
                              ) : (
                                <span className="text-xl">
                                  {user.username.charAt(0)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-start">
                            <h3 className="font-medium">{user.username}</h3>
                            <p className="text-sm text-gray-500">
                              {user.fullname}
                            </p>
                          </div>
                        </Link>
                      ))
                    : searchTerm && (
                        <p className="text-center text-gray-500">
                          No users found
                        </p>
                      )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
