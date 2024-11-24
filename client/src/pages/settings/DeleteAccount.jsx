import { ActionButton, Modal } from "@/components";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

export default function DeleteAccount() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const redirect = () => {
    navigate(-1);
  };

  return (
    <>
      <Helmet>
        <title>Warning! Delete account</title>
        <meta name="description" content="Delete your account" />
      </Helmet>
      <div className="py-5 px-4 md:px-8 max-w-[600px] mx-auto">
        <h1 className="text-2xl font-bold mb-4">Delete account</h1>
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
            className="btn bg-red-600 btn-sm text-white"
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
            classname="w-full btn-sm btn-secondary mt-4"
          />
        </div>
      </Modal>
    </>
  );
}
