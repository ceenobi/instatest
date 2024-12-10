import { useNavigate } from "react-router-dom";

export default function Error404() {
  const navigate = useNavigate();
  const redirect = () => {
    navigate(-1);
  };
  return (
    <div className="max-w-[1200px] mx-auto py-6">
      <div className="flex max-w-[600px] mx-auto items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="my-4 text-xl font-semibold">404</h1>
          <h1 className="text-2xl font-bold text-center">
            The page you are looking for does not exist
          </h1>
          <button className="mt-4 btn btn-accent text-white" onClick={redirect}>
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
