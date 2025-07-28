import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const API_KEY = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const BASE_URL = "https://notehub-public.goit.study/api/notes";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  query: string,
  page: number,
  tag?: Exclude<NoteTag, "All">
): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = {
    page: page,
    perPage: 12,
  };

  if (tag && tag !== undefined) {
    params.tag = tag;
  }

  if (query && query.trim() !== "") {
    params.search = query;
  }

  console.log("Request params:", params);

  const response = await axios.get<FetchNotesResponse>(BASE_URL, {
    params,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return response.data;
}

export async function createNote(
  params: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> {
  const response = await axios.post<Note>(BASE_URL, params, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return response.data;
}

export async function deleteNote(id: number): Promise<Note> {
  const response = await axios.delete<Note>(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await axios.get<Note>(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return response.data;
}
