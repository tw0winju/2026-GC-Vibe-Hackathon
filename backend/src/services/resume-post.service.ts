import { supabase } from "../config/supabase";

interface GetResumePostsParams {
  position?: string;
  sort?: "latest" | "like";
  page?: number;
  size?: number;
}

export class ResumePostService {
  static async getResumePosts(params: GetResumePostsParams) {
    const {
      position,
      sort = "latest",
      page = 1,
      size = 10,
    } = params;

    let query = supabase
      .from("ResumePost")
      .select(
        `
        id,
        title,
        description,
        thumbnail,
        like,
        position,
        created_at,
        user:User (
          user_id:id,
          nickname
        )
      `,
        { count: "exact" }
      );

    if (position) {
      query = query.eq("position", position);
    }

    if (sort === "like") {
      query = query.order("like", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const from = (page - 1) * size;
    const to = from + size - 1;

    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    return {
      posts: data,
      total: count,
      page,
    };
  }

  static async createResumePost(user_id: number, body: any) {
    const { data, error } = await supabase
      .from("ResumePost")
      .insert({
        user_id,
        title: body.title,
        description: body.description,
        file_url: body.file_url,
        thumbnail: body.thumbnail,
        position: body.position,
        like: 0,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  static async getResumePostDetail(post_id: number) {
    const { data, error } = await supabase
      .from("ResumePost")
      .select(
        `
        id,
        title,
        description,
        file_url,
        thumbnail,
        like,
        position,
        created_at,
        user:User (
          id,
          nickname,
          position
        ),
        comments:Comment (
          id,
          description,
          created_at,
          user:User (
            id,
            nickname
          )
        )
      `
      )
      .eq("id", post_id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  static async updateResumePost(
    post_id: number,
    user_id: number,
    body: any
  ) {
    const { data: post } = await supabase
      .from("ResumePost")
      .select("user_id")
      .eq("id", post_id)
      .single();

    if (!post || post.user_id !== user_id) {
      throw new Error("Forbidden");
    }

    const { data, error } = await supabase
      .from("ResumePost")
      .update(body)
      .eq("id", post_id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  static async deleteResumePost(post_id: number, user_id: number) {
    const { data: post } = await supabase
      .from("ResumePost")
      .select("user_id")
      .eq("id", post_id)
      .single();

    if (!post || post.user_id !== user_id) {
      throw new Error("Forbidden");
    }

    const { error } = await supabase
      .from("ResumePost")
      .delete()
      .eq("id", post_id);

    if (error) {
      throw error;
    }

    return {
      message: "ok",
    };
  }
}