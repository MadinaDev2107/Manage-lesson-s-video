import axios from "axios";

export function apicall(url: string, method: string, user: unknown) {
  return axios({
    baseURL: "https://adding-videos.onrender.com",
    url,
    method,
    data: user,
  });
}
