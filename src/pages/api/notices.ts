import { getClient } from "@/services/database";
import { NextApiRequest, NextApiResponse } from "next";

// bj_id : all, bj_id
// page : 1, 2, 3, ...
// per_page : 60, 120, 180, ...
// keyword : string
// sort : reg_date
// sort_type : asc, desc
// start_date : string
// end_date : string

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    bj_id,
    page,
    per_page,
    keyword,
    sort, // reg_date
    sort_type, // asc, desc
    start_date,
    end_date,
  } = req.query;

  // validate query
  if (bj_id !== "all" && typeof bj_id !== "string") {
    res.status(400).json({ name: "Invalid bj_id" });
    return;
  }
  if (typeof page !== "string") {
    res.status(400).json({ name: "Invalid page" });
    return;
  }
  if (typeof per_page !== "string") {
    res.status(400).json({ name: "Invalid per_page" });
    return;
  }
  if (sort !== "reg_date") {
    res.status(400).json({ name: "Invalid sort" });
    return;
  }
  if (sort_type !== "asc" && sort_type !== "desc") {
    res.status(400).json({ name: "Invalid sort_type" });
    return;
  }

  // query
  const supabase = getClient();

  const pageNumber = parseInt(page as string);
  const perPageNumber = parseInt(per_page as string);
  // const sanitezedSort = sort === "reg_date" ? "uploaded_at" : "view_count";
  const sanitezedSort = "notice_at";

  const baseQuery = supabase
    .from("notice")
    .select("*")
    .order(sanitezedSort, { ascending: sort_type === "asc" })
    .range(
      pageNumber * perPageNumber - perPageNumber,
      pageNumber * perPageNumber - 1
    );

  let query = baseQuery;

  if (bj_id !== "all") {
    // bj_id는 comma로 구분된 string
    const bj_ids = bj_id.split(",");
    query = query.in("bj_id", bj_ids);
  }
  if (keyword !== "" && keyword !== undefined) {
    query = query.ilike("title", `%${keyword}%`);
  }
  if (start_date !== "" && start_date !== undefined) {
    query = query.gte("uploaded_at", start_date);
  }
  if (end_date !== "" && end_date !== undefined) {
    query = query.lte("uploaded_at", end_date);
  }

  const { data, error } = await query;

  if (error) {
    console.log(error);
    res.status(400).json({ name: "error occured while querying" });
    return;
  }

  res.status(200).json(data as any);
}
