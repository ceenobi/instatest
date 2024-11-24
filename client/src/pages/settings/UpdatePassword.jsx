import { updateUserPassword } from "@/api/user";
import { ActionButton, Alert, FormInput } from "@/components";
import { useAuthStore } from "@/hooks";
import { handleError, inputFields } from "@/utils";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function UpdatePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);
  const { logout, accessToken } = useAuthStore();
  const fields = ["password", "newPassword", "confirmPassword"];

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setError("New password and Confirm password do not match");
      return;
    }
    try {
      const res = await updateUserPassword(data, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message);
        logout();
      }
    } catch (error) {
      handleError(setError, error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Update password</title>
        <meta name="description" content="Update password" />
      </Helmet>
      <div className="mt-5 py-5 px-4 max-w-[400px] xl:max-w-[450px] mx-auto">
        <h1 className="text-2xl font-bold mb-8 px-3">Update password</h1>
        {error && <Alert error={error} classname="my-4" />}
        <form
          className="w-[85vw] md:w-[400px] p-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          {inputFields
            .filter((item) => fields.includes(item.name))
            .map(({ type, id, name, placeholder, validate }) => (
              <FormInput
                type={type}
                id={id}
                name={name}
                register={register}
                placeholder={
                  placeholder === "Password" ? "Current password" : placeholder
                }
                key={id}
                errors={errors}
                validate={validate}
                isVisible={isVisible}
                setIsVisible={setIsVisible}
              />
            ))}
          <ActionButton
            text="Update password"
            type="submit"
            loading={isSubmitting}
            classname="mt-4 w-full btn-sm btn-secondary"
          />
        </form>
      </div>
    </>
  );
}
