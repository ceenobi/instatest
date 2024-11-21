import { ActionButton, FormInput } from "@/components";
import { inputFields } from "@/utils";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";

export default function Signup() {
  const [isVisible, setIsVisible] = useState(false);
  //const location = useLocation();
  //const from = location.state?.from || "/";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const fields = ["username", "email", "fullname", "password"];

  const onFormSubmit = (data) => {
    console.log(data);
  };
  return (
    <>
      <Helmet>
        <title>Sign up to Instapics</title>
        <meta name="description" content="Get access to Instashot" />
      </Helmet>
      <div className="max-w-[270px] mx-auto">
        <h1 className="text-center font-semibold">
          Sign up to see photos from your friends.
        </h1>
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
