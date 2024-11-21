import { signInUser } from "@/api";
import { ActionButton, Alert, FormInput } from "@/components";
import { useAuthStore } from "@/hooks";
import { handleError, inputFields } from "@/utils";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { setAccessToken, checkAuth } = useAuthStore();

  const fields = ["username", "password"];

  const onFormSubmit = async (data) => {
    try {
      const res = await signInUser(data);
      if (res.status === 200) {
        setAccessToken(res.data.accessToken);
        toast.success(res.data.message);
        navigate(from, { replace: true });
        await checkAuth();
      }
    } catch (error) {
      handleError(setError, error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login to Instapics</title>
        <meta name="description" content="Get access to Instashot" />
      </Helmet>
      <div className="max-w-[300px] mx-auto">
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
          <ActionButton
            text="Log in"
            type="submit"
            loading={isSubmitting}
            classname="w-full btn-sm btn-secondary"
          />
          <div className="mt-6 flex justify-center items-center">
            <Link
              to="/account/forgot-password"
              className="text-sm font-semibold"
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
