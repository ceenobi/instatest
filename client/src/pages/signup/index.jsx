import { signUpUser } from "@/api";
import { ActionButton, Alert, FormInput } from "@/components";
import { useAuthStore } from "@/hooks";
import { handleError, inputFields } from "@/utils";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Signup() {
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { setAccessToken } = useAuthStore();

  const fields = ["username", "email", "fullname", "password"];

  const onFormSubmit = async (data) => {
    try {
      const res = await signUpUser(data);
      if (res.status === 201) {
        setAccessToken(res.data.accessToken);
        toast.success(res.data.message);
        navigate(from, { replace: true });
      }
    } catch (error) {
      handleError(setError, error);
    }
  };
  return (
    <>
      <Helmet>
        <title>Sign up to Instapics</title>
        <meta name="description" content="Get access to Instapics" />
      </Helmet>
      <div className="max-w-[270px] mx-auto">
        <h1 className="text-center font-semibold">
          Sign up to see photos from your friends.
        </h1>
        {error && <Alert error={error} />}
        <form className="w-full p-3" onSubmit={handleSubmit(onFormSubmit)}>
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
                isVisible={isVisible}
                setIsVisible={setIsVisible}
              />
            ))}
          <p className="my-6 text-sm text-gray-600 text-center">
            By signing up, you agree to our Terms, Data Policy and Cookies
            Policy.
          </p>
          <ActionButton
            text="Sign up"
            type="submit"
            loading={isSubmitting}
            classname="w-full btn-sm btn-secondary"
          />
        </form>
      </div>
    </>
  );
}
