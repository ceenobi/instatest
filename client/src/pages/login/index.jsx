import { ActionButton, FormInput } from "@/components";
import { inputFields } from "@/utils";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  //const location = useLocation();
  //const from = location.state?.from || "/";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const fields = ["username", "password"];

  const onFormSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <Helmet>
        <title>Login to Instashot</title>
        <meta name="description" content="Get access to Instashot" />
      </Helmet>
      <div className="max-w-[300px] mx-auto">
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
            <Link to="/account/forgot-password" className="text-sm font-semibold">
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
