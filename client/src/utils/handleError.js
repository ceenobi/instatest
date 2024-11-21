const handleError = (fn, error) => {
  console.error(error);
  if (error?.message === "Network Error") {
    return fn("Server is down, pls wait a bit and reload");
  }
  if (error?.response) {
    return fn(
      error.response.data?.message ||
        error.response.data?.error ||
        error?.message ||
        "An unexpected error occured"
    );
  }
};

export default handleError;
