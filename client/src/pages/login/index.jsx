import { signInUser } from "@/api";
import { ActionButton, FormInput } from "@/components";
import { handleError, inputFields } from "@/utils";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);
  //const location = useLocation();
  //const from = location.state?.from || "/";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const fields = ["username", "password"];

  const onFormSubmit = async (data) => {
    try {
      const res = await signInUser(data);
      console.log(res);
    } catch (error) {
      //console.error(error);
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
        {error && (
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold">Error! {error}</span>
          </div>
        )}
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
