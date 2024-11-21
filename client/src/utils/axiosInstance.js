import axios from "axios";

const BASEURL = import.meta.env.VITE_BASE_URL;
const TIMEOUTMSG = "Waiting for too long...Aborted!";

const config = {
  baseURL: BASEURL,
  timeout: 20000,
  timeoutErrorMessage: TIMEOUTMSG,
  withCredentials: true,
};

const axiosInstance = axios.create(config);

export default axiosInstance;