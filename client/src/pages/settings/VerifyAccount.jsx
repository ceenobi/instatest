import { sendVerifyEmailLink } from "@/api";
import { ActionButton, Alert } from "@/components";
import { useAuthStore } from "@/hooks";
import { handleError } from "@/utils";
import { BadgeCheck } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";

export default function VerifyAccount() {
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore() || {};
  const { data } = user || {};

  const resendVerificationLink = async () => {
    setIsSubmitting(true);
    try {
      const res = await sendVerifyEmailLink(data._id);
      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      handleError(setError, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Check Verification Status</title>
        <meta name="description" content="Account verification" />
      </Helmet>
      <div className="py-5 px-4 md:px-8 max-w-[450px] mx-auto">
        <h1 className="text-2xl font-bold mb-2">Verify account</h1>
        <div className="flex gap-2 items-center">
          <p>
            <span className="font-semibold">Status</span>:{" "}
            {data?.isVerified ? "Verified" : "Not verified"}
          </p>
          <BadgeCheck className={data?.isVerified ? "text-accent" : ""} />
        </div>
        {error && <Alert error={error} classname="my-4" />}
        <div className="mt-2">
          {data?.isVerified ? (
            <>
              <p className="text-sm my-2">
                <span className="font-semibold">Note:</span> You have already
                verified your account
              </p>
              <img src="https://cdn-icons-png.flaticon.com/512/8861/8861416.png" />
            </>
          ) : (
            <>
              <p className="text-sm my-2">
                <span className="font-semibold">Note:</span> You have not
                verified your account. You will be able to post after
                verification.
              </p>
              <img src="https://w7.pngwing.com/pngs/310/164/png-transparent-cross-red-rejection-no-stop-warning-thumbnail.png" />
              <ActionButton
                text="Resend verification link"
                type="submit"
                loading={isSubmitting}
                classname="mt-4 w-full btn-sm btn-secondary"
                onClick={resendVerificationLink}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
