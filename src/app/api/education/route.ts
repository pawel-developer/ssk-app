import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: categories, error: catErr } = await supabase
    .from("education_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (catErr) return NextResponse.json({ error: catErr.message }, { status: 500 });

  const { data: subcategories, error: subErr } = await supabase
    .from("education_subcategories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (subErr) return NextResponse.json({ error: subErr.message }, { status: 500 });

  const { data: materials, error: matErr } = await supabase
    .from("education_materials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (matErr) return NextResponse.json({ error: matErr.message }, { status: 500 });

  const { data: videos, error: vidErr } = await supabase
    .from("education_videos")
    .select("*")
    .order("sort_order", { ascending: true });

  if (vidErr) return NextResponse.json({ error: vidErr.message }, { status: 500 });

  return NextResponse.json({ categories, subcategories, materials, videos });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { action } = body;

  switch (action) {
    case "create_category": {
      const { name, slug, description } = body;
      const { data: maxOrder } = await supabase
        .from("education_categories")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();
      const { data, error } = await supabase
        .from("education_categories")
        .insert({ name, slug, description, sort_order: (maxOrder?.sort_order ?? -1) + 1 })
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ category: data });
    }

    case "update_category": {
      const { id, name, slug, description, is_published } = body;
      const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (name !== undefined) updatePayload.name = name;
      if (slug !== undefined) updatePayload.slug = slug;
      if (description !== undefined) updatePayload.description = description;
      if (is_published !== undefined) updatePayload.is_published = is_published;
      const { error } = await supabase
        .from("education_categories")
        .update(updatePayload)
        .eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    case "delete_category": {
      const { id } = body;
      const { error } = await supabase.from("education_categories").delete().eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    case "create_subcategory": {
      const { category_id, name, slug, description } = body;
      const { data: maxOrder } = await supabase
        .from("education_subcategories")
        .select("sort_order")
        .eq("category_id", category_id)
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();
      const { data, error } = await supabase
        .from("education_subcategories")
        .insert({ category_id, name, slug, description, sort_order: (maxOrder?.sort_order ?? -1) + 1 })
        .select()
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ subcategory: data });
    }

    case "update_subcategory": {
      const { id, name, slug, description, is_published } = body;
      const updatePayload: Record<string, unknown> = {};
      if (name !== undefined) updatePayload.name = name;
      if (slug !== undefined) updatePayload.slug = slug;
      if (description !== undefined) updatePayload.description = description;
      if (is_published !== undefined) updatePayload.is_published = is_published;
      const { error } = await supabase
        .from("education_subcategories")
        .update(updatePayload)
        .eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    case "delete_subcategory": {
      const { id } = body;
      const { error } = await supabase.from("education_subcategories").delete().eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    case "create_material": {
      const { subcategory_id, title, description: desc, notes, author, tags, videos: vids } = body;
      const { data: maxOrder } = await supabase
        .from("education_materials")
        .select("sort_order")
        .eq("subcategory_id", subcategory_id)
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();

      const firstVideoId = vids?.[0]?.youtube_id;
      const thumbnail = firstVideoId ? `https://img.youtube.com/vi/${firstVideoId}/hqdefault.jpg` : null;

      const { data: material, error: matError } = await supabase
        .from("education_materials")
        .insert({
          subcategory_id,
          title,
          description: desc || null,
          notes: notes || null,
          author: author || null,
          tags: tags || [],
          thumbnail_url: thumbnail,
          sort_order: (maxOrder?.sort_order ?? -1) + 1,
        })
        .select()
        .single();

      if (matError) return NextResponse.json({ error: matError.message }, { status: 500 });

      if (vids && vids.length > 0) {
        const videoRows = vids.map((v: { title: string; youtube_url: string; youtube_id: string; duration?: string }, i: number) => ({
          material_id: material.id,
          title: v.title,
          youtube_url: v.youtube_url,
          youtube_id: v.youtube_id,
          duration: v.duration || null,
          sort_order: i,
        }));
        const { error: vidError } = await supabase.from("education_videos").insert(videoRows);
        if (vidError) return NextResponse.json({ error: vidError.message }, { status: 500 });
      }

      return NextResponse.json({ material });
    }

    case "update_material": {
      const { id, title, description: desc, notes, author, tags, videos: vids, is_published } = body;

      const firstVideoId = vids?.[0]?.youtube_id;

      const updatePayload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (title !== undefined) updatePayload.title = title;
      if (desc !== undefined) updatePayload.description = desc || null;
      if (notes !== undefined) updatePayload.notes = notes || null;
      if (author !== undefined) updatePayload.author = author || null;
      if (tags !== undefined) updatePayload.tags = tags || [];
      if (is_published !== undefined) updatePayload.is_published = is_published;
      if (firstVideoId) {
        updatePayload.thumbnail_url = `https://img.youtube.com/vi/${firstVideoId}/hqdefault.jpg`;
      }

      const { error: matError } = await supabase
        .from("education_materials")
        .update(updatePayload)
        .eq("id", id);

      if (matError) return NextResponse.json({ error: matError.message }, { status: 500 });

      if (vids) {
        await supabase.from("education_videos").delete().eq("material_id", id);
        if (vids.length > 0) {
          const videoRows = vids.map((v: { title: string; youtube_url: string; youtube_id: string; duration?: string }, i: number) => ({
            material_id: id,
            title: v.title,
            youtube_url: v.youtube_url,
            youtube_id: v.youtube_id,
            duration: v.duration || null,
            sort_order: i,
          }));
          const { error: vidError } = await supabase.from("education_videos").insert(videoRows);
          if (vidError) return NextResponse.json({ error: vidError.message }, { status: 500 });
        }
      }

      return NextResponse.json({ ok: true });
    }

    case "delete_material": {
      const { id } = body;
      const { error } = await supabase.from("education_materials").delete().eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    case "reorder_categories": {
      const { ordered_ids } = body;
      for (let i = 0; i < ordered_ids.length; i++) {
        await supabase.from("education_categories").update({ sort_order: i }).eq("id", ordered_ids[i]);
      }
      return NextResponse.json({ ok: true });
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
