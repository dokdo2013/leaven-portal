import axios from "axios";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

const fetcher = async (args: readonly [string, string]): Promise<any[]> => {
  const result = await axios.get(`/api/videos?${args[1]}`);

  return result.data;
};

const fetcherInfinite = async (args: string): Promise<any[]> => {
  console.log(args);

  const result = await axios.get(`/api${args}`);

  return result.data;
};

// type : all, review, clip
// bj_id : all, bj_id
// page : 1, 2, 3, ...
// per_page : 60, 120, 180, ...
// keyword : string
// sort : reg_date, view_cnt
// sort_type : asc, desc
// start_date : string
// end_date : string

export interface VideoParams {
  type?: string;
  bj_id?: string;
  page?: number;
  per_page?: number;
  keyword?: string;
  sort?: string;
  sort_type?: string;
  start_date?: string;
  end_date?: string;
}

export const useGetVideos = ({
  type = "all",
  bj_id = "all",
  page = 1,
  per_page = 60,
  keyword = "",
  sort = "reg_date",
  sort_type = "desc",
  start_date = "",
  end_date = "",
}) => {
  const query = `type=${type}&bj_id=${bj_id}&page=${page}&per_page=${per_page}&keyword=${keyword}&sort=${sort}&sort_type=${sort_type}&start_date=${start_date}&end_date=${end_date}`;

  let option = {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  };

  const result = useSWR(["/videos", query], fetcher, option);

  return result;
};

// swr infinite scroll
const getKey = (
  pageIndex: number,
  previousPageData: any,
  perPage: number,
  query: string
) => {
  if (previousPageData && !previousPageData.length) return null; // reached the end
  return `/videos?page=${pageIndex + 1}&per_page=${perPage}&${query}`; // SWR key
};

export const useGetVideosInfinite = ({
  type = "all",
  bj_id = "all",
  per_page = 60,
  keyword = "",
  sort = "reg_date",
  sort_type = "desc",
  start_date = "",
  end_date = "",
}) => {
  const query = `type=${type}&bj_id=${bj_id}&keyword=${keyword}&sort=${sort}&sort_type=${sort_type}&start_date=${start_date}&end_date=${end_date}`;

  let option = {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  };

  const result = useSWRInfinite(
    (pageIndex, previousPageData) =>
      getKey(pageIndex, previousPageData, per_page, query),
    fetcherInfinite,
    option
  );
  // const result = useSWRInfinite(["/videos", query], fetcher, option);

  return result;
};
