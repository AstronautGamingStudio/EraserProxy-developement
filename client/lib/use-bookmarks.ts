import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth-context";

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookmarks
  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      return;
    }

    const fetchBookmarks = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("bookmarks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;
        setBookmarks((data as Bookmark[]) || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch bookmarks");
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user]);

  // Add bookmark
  const addBookmark = async (url: string, title: string, description?: string) => {
    if (!user) {
      setError("You must be logged in to save bookmarks");
      return;
    }

    try {
      setError(null);
      const { data, error: insertError } = await supabase
        .from("bookmarks")
        .insert({
          user_id: user.id,
          url,
          title,
          description,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setBookmarks([data as Bookmark, ...bookmarks]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add bookmark";
      setError(message);
    }
  };

  // Remove bookmark
  const removeBookmark = async (id: string) => {
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      setBookmarks(bookmarks.filter((b) => b.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to remove bookmark";
      setError(message);
    }
  };

  // Check if URL is bookmarked
  const isBookmarked = (url: string) => {
    return bookmarks.some((b) => b.url === url);
  };

  return {
    bookmarks,
    loading,
    error,
    addBookmark,
    removeBookmark,
    isBookmarked,
  };
}
