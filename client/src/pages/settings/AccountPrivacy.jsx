import { toggleAccountPrivacy } from "@/api/user";
import { Alert } from "@/components";
import { useAuthStore } from "@/hooks";
import { handleError } from "@/utils";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";

export default function AccountPrivacy() {
  const [toggle, setToggle] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken, user, setUser } = useAuthStore();
  const { data } = user || {};

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  const toggleAccount = useCallback(async () => {
    try {
      const res = await toggleAccountPrivacy(accessToken);
      if (res.status === 200) {
        toast.success(res.data.message);
        setUser((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            isPublic: !prev.data.isPublic,
          },
        }));
      }
    } catch (error) {
      handleError(setError, error);
    }
  }, [accessToken, setUser]);

  useEffect(() => {
    if (toggle) {
      toggleAccount();
    }
  }, [toggle, toggleAccount]);

  return (
    <>
      <Helmet>
        <title>Toggle Privacy status</title>
        <meta name="description" content="Account privacy" />
      </Helmet>
      <div className="mt-5 py-5 px-4 md:px-8  max-w-[400px] xl:max-w-[700px] mx-auto">
        <h1 className="text-2xl font-bold mb-4">Account privacy</h1>
        {error && <Alert error={error} classname="my-4" />}
        <div className="border-2 border-zinc-200 rounded-lg p-3">
          <p className="text-md font-semibold">Private account</p>
          <span className="text-sm mt-4">
            When your account is public, your profile and posts can be seen by
            anyone, on or off Instapics. When your account is private, only the
            followers you approve can see what you share, including your photos
            or hashtag, and your followers and following lists. Certain info on
            your profile, like your profile picture and username, is visible to
            everyone on Instapics.
          </span>
        </div>
        <div className="mt-4 flex gap-4 items-center justify-end">
          <span className="text-black font-semibold">Toggle status: {data?.isPublic ? "Public" : "Private"}</span>
          <input
            type="checkbox"
            value={toggle}
            onChange={handleToggle}
            className="toggle"
            defaultChecked={data?.isPublic}
          />
        </div>
      </div>
    </>
  );
}
