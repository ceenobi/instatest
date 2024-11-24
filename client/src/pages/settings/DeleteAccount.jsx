import { deleteAccount } from "@/api/user";
import { ActionButton, Alert, Modal } from "@/components";
import { useAuthStore } from "@/hooks";
import { handleError } from "@/utils";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function DeleteAccount() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logout, accessToken } = useAuthStore();

  const navigate = useNavigate();
  const redirect = () => {
    navigate(-1);
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const res = await deleteAccount(accessToken);
      if (res.status === 200) {
        toast.success(res.data.message);
        logout()
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
        <title>Warning! Delete account</title>
        <meta name="description" content="Delete your account" />
      </Helmet>
      <div className="mt-5 py-5 px-4 md:px-8 max-w-[600px] mx-auto">
        <h1 className="text-2xl font-bold mb-4">Delete account</h1>
        {error && <Alert error={error} classname="my-4" />}
        <div className="border-2 border-zinc-200 rounded-lg p-3">
          <p>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </p>
        </div>
        <div className="flex justify-end gap-6 mt-4">
          <button className="btn bg-zinc-200 btn-sm" onClick={redirect}>
            Cancel
          </button>
          <button
            className="btn bg-red-600 btn-sm text-white border-0"
            onClick={() => setIsOpen(true)}
          >
            Delete
          </button>
        </div>
      </div>
      <Modal
        title="Delete account"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <p>Are you sure you want to delete your account?</p>
        <div className="flex justify-center gap-6 mt-4">
          <ActionButton
            text="Delete"
            type="button"
            loading={isSubmitting}
            classname="w-full btn-sm btn-secondary mt-4 bg-red-600"
            onClick={handleDelete}
          />
        </div>
      </Modal>
    </>
  );
}
