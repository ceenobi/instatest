import { updateUserProfile } from "@/api/user";
import { ActionButton, Alert, FormInput, Modal } from "@/components";
import { handleError, inputFields } from "@/utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function UpdateProfile({ accessToken, setData, data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  useEffect(() => {
    if (data) {
      setValue("username", data.username);
      setValue("email", data.email);
      setValue("fullname", data.fullname);
      setValue("bio", data.bio);
    }
  }, [data, setValue]);

  const fields = ["username", "email", "fullname", "bio"];

  const onFormSubmit = async (data) => {
    try {
      const res = await updateUserProfile(data, accessToken);
      if (res.status === 200) {
        const updatedUser = res.data.user;
        setData((prev) => ({ ...prev, ...updatedUser }));
        setIsOpen(false);
        toast.success(res.data.message);
      }
    } catch (error) {
      handleError(setError, error);
    }
  };

  return (
    <>
      <button
        className="btn btn-accent btn-sm text-white"
        onClick={() => setIsOpen(true)}
      >
        Edit profile
      </button>
      <Modal
        title="Update profile information"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        {error && <Alert error={error} classname="my-4" />}
        <form className="mt-4" onSubmit={handleSubmit(onFormSubmit)}>
          {inputFields
            .filter((item) => fields.includes(item.name))
            .map(({ type, id, name, placeholder, validate }) => (
              <FormInput
                type={type}
                id={id}
                name={name}
                register={register}
                placeholder={placeholder}
                key={id}
                errors={errors}
                validate={validate}
              />
            ))}
          <ActionButton
            text="Update"
            type="submit"
            loading={isSubmitting}
            classname="w-full btn-sm btn-secondary"
          />
        </form>
      </Modal>
    </>
  );
}
