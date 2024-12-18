import { useContext, useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "@/store";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } =
    useContext(NotificationContext);
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead([notification._id]);
    }

    switch (notification.type) {
      case "like":
      case "comment":
        navigate(`/comments/${notification.post._id}`);
        break;
      case "follow":
        navigate(`/profile/${notification.sender.username}`);
        break;
      case "story_view":
        navigate(
          `/stories/${notification.sender.username}/${notification.story._id}`
        );
        break;
      default:
        break;
    }
    setIsOpen(false);
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "follow":
        return "started following you";
      case "story_view":
        return "viewed your story";
      default:
        return "";
    }
  };

  return (
    <>
      {/* <button
        className={`relative p-2 hover:bg-base-200 rounded-full transition-colors duration-200 ${
          isOpen ? "bg-base-200" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell size={24} className={isOpen ? "text-accent" : ""} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2 bg-accent rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      <div
        className={`drawer fixed top-0 md:left-[80px] z-40 ${
          isOpen ? "drawer-open" : ""
        }`}
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
            className="menu w-80 h-screen bg-base-200 text-base-content px-4"
          >
            <div className="overflow-y-auto p-4">
              <div className="sticky top-0 bg-base-100 p-4 border-b border-base-200 z-10">
                <h3 className="text-lg font-semibold">Notifications</h3>
              </div>
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-base-content/60">
                  <Bell size={48} className="mb-4 opacity-50" />
                  <p className="text-center">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 
                        ${
                          !notification.read
                            ? "bg-base-200"
                            : "hover:bg-base-200"
                        } hover:bg-slate-200`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        handleNotificationClick(notification)
                      }
                    >
                      <img
                        src={notification.sender.profilePicture}
                        alt={notification.sender.username}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0 text-start">
                        <p className="text-sm">
                          <span className="font-semibold">
                            {notification.sender.username}
                          </span>{" "}
                          {getNotificationText(notification)}
                        </p>
                        <p className="text-xs text-base-content/60 mt-1">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div> */}
      <div className="relative">
        <button
          className={`relative p-2 hover:bg-base-200 rounded-full transition-colors duration-200 focus:outline-none ${
            isOpen ? "bg-base-200" : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Notifications"
        >
          <Bell size={24} className={isOpen ? "text-accent" : ""} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2 bg-accent rounded-full">
              {unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div
            className={`fixed inset-0 bg-opacity-50 z-40  transition-opacity duration-300 ease-in-out
              ${ isOpen ? "bg-opacity-50 z-40" : "bg-opacity-0 pointer-events-none -z-10"}`}
            aria-hidden="true"
          >
            <div
              ref={drawerRef}
              className={`fixed left-0 top-0 md:left-[80px] h-full w-80 bg-base-200 text-base-content shadow-xl overflow-hidden z-50 transition-transform duration-300 ease-in-out ${
                isOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="sticky top-0 bg-base-100 p-4 border-b border-base-200 z-10">
                <h3 className="text-lg font-semibold">Notifications</h3>
              </div>

              <div className="overflow-y-auto h-[calc(100vh-64px)] p-4">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-base-content/60">
                    <Bell size={48} className="mb-4 opacity-50" />
                    <p className="text-center">No notifications yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 
                        ${
                          !notification.read
                            ? "bg-base-200"
                            : "hover:bg-base-200"
                        } hover:bg-slate-200`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          handleNotificationClick(notification)
                        }
                      >
                        <img
                          src={notification.sender.profilePicture}
                          alt={notification.sender.username}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0 text-start">
                          <p className="text-sm">
                            <span className="font-semibold">
                              {notification.sender.username}
                            </span>{" "}
                            {getNotificationText(notification)}
                          </p>
                          <p className="text-xs text-base-content/60 mt-1">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              {
                                addSuffix: true,
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
