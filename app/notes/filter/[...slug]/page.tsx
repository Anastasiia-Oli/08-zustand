import { NoteTag } from "@/types/note";
import Notes from "./Notes.client";
import { fetchNotes } from "@/lib/api";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;
  const tagCandidate = slug?.[0];

  const isValidTag =
    tagCandidate && tagCandidate !== "All" && tagCandidate !== "notes";
  const tag = isValidTag ? (tagCandidate as NoteTag) : undefined;

  const initialData = await fetchNotes("", 1, tag);
  return <Notes tag={tag} initialData={initialData} />;
}
