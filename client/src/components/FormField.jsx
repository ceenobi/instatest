export function FormInput({
  type,
  id,
  name,
  label,
  placeholder,
  register,
  errors,
  isVisible,
  setIsVisible,
  validate,
}) {
  const toggleVisibility = () => setIsVisible((prev) => !prev);
  return (
    <div className="form-control mb-3 flex flex-col gap-2">
      {label && <label htmlFor={id} className="label-text">{label}</label>}
      <div className="relative">
        <input
          type={isVisible ? "text" : type}
          id={id}
          name={name}
          placeholder={placeholder}
          {...register(name, { validate })}
          className={`input input-bordered w-full border-[1.5px] p-2 text-sm ${
            errors[name] ? "focus:border-red-600" : ""
          } rounded-none`}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 right-2 text-gray-600 text-sm border-0 focus:outline-none font-semibold"
            onClick={toggleVisibility}
          >
            {isVisible ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {errors[name] && (
        <span className="text-xs text-red-600">{errors[name]?.message}</span>
      )}
    </div>
  );
}
