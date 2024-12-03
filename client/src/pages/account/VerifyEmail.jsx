import { verifyEmail } from "@/api";
import { Alert } from "@/components";
import { useAuthStore, useFetch } from "@/hooks";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function VerifyEmail() {
  const { userId, verificationToken } = useParams();
  const { error, loading, data } = useFetch(
    verifyEmail,
    userId,
    verificationToken
  );
  const { user, setUser } = useAuthStore();
  const { data: userData } = user || {};

  useEffect(() => {
    if (data?.success) {
      toast.success(data.message, { id: "verifyEmail" });
      setUser((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          isVerified: true,
        },
      }));
    }
  }, [
    data?.message,
    data?.success,
    data?.user,
    setUser,
    user,
    userData?.isVerified,
  ]);

  return (
    <>
      <Helmet>
        <title>Verify account</title>
        <meta name="description" content="Get verified on Instashot" />
      </Helmet>
      <div className="max-w-[300px] mx-auto mt-6">
        {error && <Alert error={error} />}
        {loading && (
          <div className="mt-4 text-center">
            <span className="loading loading-spinner loading-md bg-accent"></span>
          </div>
        )}
        {!error && !loading && data?.success ? (
          <p className="mt-4 text-center">{data.message}</p>
        ) : (
          <>
            {userData?.isVerified === true && !error && (
              <p className="mt-4 text-center">You are verified already</p>
            )}
          </>
        )}
      </div>
    </>
  );
}
