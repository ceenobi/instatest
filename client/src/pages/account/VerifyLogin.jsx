import { verifyLoginLink } from "@/api";
import { Alert, DataSpinner } from "@/components";
import { useAuthStore } from "@/hooks";
import { handleError } from "@/utils";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";

export default function VerifyLogin() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAccessToken, checkAuth } = useAuthStore();
  const from = location.state?.from || "/";

  useEffect(() => {
    const verify = async () => {
      setLoading(true);
      try {
        const res = await verifyLoginLink(userId, token);
        if (res.status === 200) {
          setAccessToken(res.data.accessToken);
          toast.success(res.data.message);
          navigate(from, { replace: true });
          setLoading(false);
          await checkAuth();
        }
      } catch (error) {
        handleError(setError, error);
      }
    };
    verify();
  }, [userId, token, setAccessToken, navigate, from, checkAuth]);

  return (
    <>
      <Helmet>
        <title>Verify Login Link</title>
        <meta name="description" content="Get access to Instashot" />
      </Helmet>
      <div className="max-w-[300px] mx-auto mt-6">
        {error && <Alert error={error} />}
        {loading && (
          <div className="mt-4 text-center">
            <DataSpinner />
          </div>
        )}
      </div>
    </>
  );
}
