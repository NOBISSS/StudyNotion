import axios from "axios"
import { useSelector } from "react-redux";

export const axiosInstance = axios.create({
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
});

export const apiConnector=(method,url,bodyData,extraHeaders,params)=>{
  const token = JSON.parse(localStorage.getItem("token"));
  console.log(bodyData)
    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        data:bodyData ?? null,
        headers:{
          Authorization:token?`Bearer ${token}` : undefined,
          ...extraHeaders
        },
        params:params ? params : null
    })
}