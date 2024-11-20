import { ActionButton, FormInput } from "@/components";
import { inputFields } from "@/utils";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const fields = ["email"];

  const onFormSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="max-w-[300px] mx-auto">
      <div className="my-6 text-center">
        <h1 className="font-bold">Trouble logging in? </h1>
        <p className="text-sm">
          Enter your email, and we&apos;ll send you a link to get back into your
          account.
        </p>
      </div>
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
  );
}
