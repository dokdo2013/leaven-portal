import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const { SUPABASE_URL, SUPABASE_KEY }: any = process.env;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// create table
//   public.video (
//     id bigint generated by default as identity,
//     bj_id character varying null,
//     type text null,
//     link text null,
//     title text null,
//     description text null,
//     view_count bigint null,
//     uploaded_at timestamp without time zone null,
//     created_at timestamp with time zone not null default now(),
//     thumbnail text null,
//     data json null,
//     constraint video_pkey primary key (id)
//   ) tablespace pg_default;

export interface Video {
  bj_id: string;
  type: string;
  link: string;
  title: string;
  description: string;
  view_count: number;
  uploaded_at: string;
  thumbnail: string;
  data: any;
}

const addVideo = async (video: Video[]) => {
  const { data, error } = await supabase.from("video").insert(video);

  if (error) {
    console.log(error);
    return;
  }

  return data;
};

const getVideos = async (
  type: string = "review",
  bj_id: string = "all",
  page: number = 1,
  per_page: number = 60
) => {
  let query = supabase
    .from("video")
    .select("*")
    .eq("type", type)
    .order("id")
    .range(page * per_page - per_page, page * per_page - 1);

  if (bj_id === "all") {
    const { data, error } = await query;

    if (error) {
      console.log(error);
      return;
    }

    return data;
  } else {
    query = query.eq("bj_id", bj_id);

    const { data, error } = await query;

    if (error) {
      console.log(error);
      return;
    }

    return data;
  }
};

export { addVideo, getVideos };
