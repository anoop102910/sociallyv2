import useSWR from "swr";
import api from "@/lib/api";
import toast from "react-hot-toast";

export const tst = toast;


const fetcher = (url: string) =>
  api
    .get(url)
    .then(res => {
      return res.data;
    })
    .catch(error => {
      console.error("Fetcher error:", error);
      throw error;
    });

export const useData = (url: string) => {
  return useSWR(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    refreshInterval: 0,
  });
};
