import { verifyLoginLink } from "@/api";
import { Alert, DataSpinner } from "@/components";
import { useAuthStore } from "@/hooks";
import { handleError } from "@/utils";
import { useEffect, useState } from "react";
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
          await checkAuth();
        }
      } catch (error) {
        handleError(setError, error);
      } finally {
        setLoading(false);
      }
    };
    verify();
  });
  return (
    <div className="max-w-[300px] mx-auto mt-6">
      {error && <Alert error={error} />}
      {loading && (
        <div className="mt-4 text-center">
          <DataSpinner />
        </div>
      )}
    </div>
  );
}
