import api from "./api";

const fetcher = (url: string) => api.get(url).then(res => {
    return res.data
  }).catch(error => {
    console.error("Fetcher error:", error);
    throw error;
  });
  
export default fetcher