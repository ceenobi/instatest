import { verifyEmail } from "@/api";
import { Alert } from "@/components";
import { useAuthStore, useFetch } from "@/hooks";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function VerifyEmail() {
  const { userId, verificationToken } = useParams();
  const { error, loading, data } = useFetch(
    verifyEmail,
    userId,
    verificationToken
  );
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const { data: userData } = user || {};

  useEffect(() => {
    if (userData?.isVerified) {
      toast.success("You are verified already");
      navigate(from, { replace: true });
    }
  }, [from, navigate, userData?.isVerified]);

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
        {!error && !loading && data?.success && (
          <p className="mt-4 text-center">{data.message}</p>
        )}
      </div>
    </>
  );
}
