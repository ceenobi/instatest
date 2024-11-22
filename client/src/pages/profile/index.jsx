import { getUser } from "@/api/user";
import { Alert, DataSpinner, Modal } from "@/components";
import { useFetch } from "@/hooks";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { profile } = useParams();
  const { error, loading, data } = useFetch(getUser, profile);

  return (
    <>
      <Helmet>
        <title>Your Instapics profile - </title>
        <meta name="description" content="Get access to Instashot" />
      </Helmet>
      <div className="py-8 px-4">
        {error && <Alert error={error} />}
        {loading ? (
          <DataSpinner />
        ) : (
          <div className="grid md:grid-cols-12 gap-8 max-w-[968px] mx-auto">
            <div className="md:col-span-4">
              <div
                className="avatar flex justify-center cursor-pointer"
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
              >
                <div className="w-[160px] h-[160px] rounded-full">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    title="change profile photo"
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-7">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold flex-1">{profile}</h1>
                <div className="flex items-center gap-4">
                  <button className="btn btn-accent btn-sm text-white">
                    Edit profile
                  </button>
                  <button className="btn btn-neutral btn-sm">
                    Edit profile
                  </button>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <h1 className="text-lg flex-1">
                  <span className="font-bold">4</span> posts
                </h1>
                <div className="flex items-center gap-4">
                  <h1 className="text-lg">
                    <span className="font-bold">4</span> followers
                  </h1>
                  <h1 className="text-lg">
                    <span className="font-bold">4</span> following
                  </h1>
                </div>
              </div>
              <h1 className="mt-3 text-lg font-bold">{data?.fullname}</h1>
              <p className="text-sm">
                {data?.bio ||
                  "Tech lover, web developer, arts lover. #RealMadrid White"}
              </p>
            </div>
          </div>
        )}
      </div>
      <Modal title="Change profile photo">
        <div className="my-6 flex flex-col justify-center items-center gap-4">
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
          />
        </div>
      </Modal>
    </>
  );
}
