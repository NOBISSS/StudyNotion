import axios from "axios";

export const axiosInstance = axios.create({
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
});

export const apiConnector = (method, url, bodyData, extraHeaders, params) => {
  let token = null;

  try {
    const storedToken = localStorage.getItem("accessToken");
    token = storedToken ? JSON.parse(storedToken) : null;
  } catch (error) {
    console.log("Token parse error:", error);
  }

  return axiosInstance({
    method,
    url,
    data: bodyData ?? null,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      ...extraHeaders,
    },
    withCredentials:true,
    params: params || null,
  });
};