import { signInViaEmail } from "@/api";
import { ActionButton, Alert, FormInput } from "@/components";
import { handleError, inputFields } from "@/utils";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [error, SetError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const fields = ["email"];

  const onFormSubmit = async (data) => {
    try {
      const res = await signInViaEmail(data);
      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      handleError(SetError, error);
      //handleError((message) => toast.error(message), error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Let&apos;s gegt you signed in</title>
        <meta name="description" content="Get access to Instashot" />
      </Helmet>
      <div className="max-w-[300px] mx-auto">
        <div className="my-6 text-center">
          <h1 className="font-bold">Trouble logging in? </h1>
          <p className="text-sm">
            Enter your email, and we&apos;ll send you a link to get back into
            your account.
          </p>
        </div>
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
              />
            ))}
          <ActionButton
            text="Send login link"
            type="submit"
            loading={isSubmitting}
            classname="w-full btn-sm btn-secondary"
          />
          <div className="my-6 flex items-center justify-center gap-4">
            <div className="w-[100px] border-[1px]" />
            <span className="text-sm font-semibold">OR</span>
            <div className="w-[100px] border-[1px]" />
          </div>
        </form>
        <div className="flex justify-center items-center">
          <Link to="/auth/signup" className="text-sm font-semibold">
            Create new account
          </Link>
        </div>
      </div>
    </>
  );
}
