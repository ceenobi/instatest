import { useAuthStore, useFetch } from "@/hooks";
import { getAllPosts } from "@/api/post";
import { Alert, LazySpinner } from "@/components";
import Skeleton from "./components/Skeleton";
import { lazy, Suspense } from "react";

const Card = lazy(() => import("./components/Card"));

export default function Home() {
  const { accessToken } = useAuthStore();
  const { error, data, loading, setData } = useFetch(getAllPosts, accessToken);
  const posts = data?.posts || [];

  return (
    <div className="max-w-[1024px] mx-auto ">
      {error && <Alert error={error} classname="my-4" />}
      <div className="py-8 lg:flex justify-between w-full min-h-dvh">
        <div className="lg:w-[60%]">
          <div className="mb-6 px-4 flex gap-4 overscroll-auto">
            <div className="avatar">
              <div className="w-[50px] rounded-full border-2 border-accent">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <div className="avatar">
              <div className="w-[50px] rounded-full border-2 border-accent">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
          </div>
          <div className="md:max-w-[80%] lg:max-w-[400px] xl:max-w-[600px] mx-auto">
            {loading ? (
              <Skeleton />
            ) : (
              <Suspense fallback={<LazySpinner />}>
                {posts.length === 0 && (
                  <div className="text-center text-2xl font-bold">
                    No posts yet
                  </div>
                )}
                {posts.map((post) => (
                  <Card key={post._id} post={post} setData={setData} />
                ))}
              </Suspense>
            )}
          </div>
        </div>
        <div className="hidden lg:block min-w-[300px]">
          <div className="flex justify-between items-center">
            <p>Suggested for you</p>
            <button className="text-sm font-semibold">See all</button>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="avatar">
              <div className="w-[50px] rounded-full border-2 border-accent">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <button className="btn btn-sm">Follow</button>
          </div>
        </div>
      </div>
    </div>
  );
}
