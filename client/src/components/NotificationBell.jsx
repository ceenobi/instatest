import { useContext, useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
// import { useClickOutside } from "@/hooks";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "@/store";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } =
    useContext(NotificationContext);
  // const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  // useClickOutside(dropdownRef, () => setIsOpen(false));

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

    // Navigate based on notification type
    switch (notification.type) {
      case "like":
      case "comment":
        navigate(`/p/${notification.post._id}`);
        break;
      case "follow":
        navigate(`/${notification.sender.username}`);
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

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <div className="relative">
      <button
        className={`relative p-2 hover:bg-base-200 rounded-full focus:outline-none ${
          isOpen ? "text-accent" : ""
        }`}
        onClick={handleOpen}
      >
        <Bell size={28} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-accent rounded-full">
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
            className="menu w-80 h-screen bg-base-200 text-base-content p-4"
            ref={drawerRef}
          >
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500">No notifications yet</p>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-base-200 ${
                      !notification.read ? "bg-base-200" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <img
                      src={notification.sender.profilePicture}
                      alt={notification.sender.username}
                      className="w-10 h-10 rounded-full object-cover"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">
                          {notification.sender.username}
                        </span>{" "}
                        {getNotificationText(notification)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
