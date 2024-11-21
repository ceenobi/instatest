import { verifyEmail } from "@/api";
import { Alert, DataSpinner } from "@/components";
import { useFetch } from "@/hooks";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

export default function VerifyEmail() {
  const { userId, token } = useParams();
  const { error, loading } = useFetch(verifyEmail, userId, token);

  return (
    <>
      <Helmet>
        <title>Verify account</title>
        <meta name="description" content="Verify account" />
      </Helmet>
      <div className="max-w-[300px] mx-auto mt-6">
        {error ? (
          <Alert error={error} />
        ) : loading ? (
          <div className="mt-4 text-center">
            <DataSpinner />
          </div>
        ) : (
          <p className="mt-4 text-center">Email verified successfully</p>
        )}
      </div>
    </>
  );
}
