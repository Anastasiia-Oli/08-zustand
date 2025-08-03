import { NoteTag } from "@/types/note";
import Notes from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tagCandidate = slug?.[0];

  const isValidTag =
    tagCandidate && tagCandidate !== "All" && tagCandidate !== "notes";
  const tag = isValidTag ? tagCandidate : "All";

  return {
    title: `${tag} Notes`,
    description: `Manage your ${tag} notes`,
    openGraph: {
      title: `${tag} Notes`,
      description: `Browse ${tag} notes. Stay organized and access them when needed.`,
      url: `https://08-zustand-coral.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "Note Hub",
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;
  const tagCandidate = slug?.[0];

  const isValidTag =
    tagCandidate && tagCandidate !== "All" && tagCandidate !== "notes";
  const tag = isValidTag ? (tagCandidate as NoteTag) : undefined;

  console.log(tag);
  const initialData = await fetchNotes("", 1, tag);
  return <Notes tag={tag} initialData={initialData} />;
}
