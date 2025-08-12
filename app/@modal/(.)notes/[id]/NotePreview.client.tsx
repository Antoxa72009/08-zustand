"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import { type Note } from "@/types/note";
import css from "./NotePreview.module.css";
import Modal from "@/components/Modal/Modal";
import { useRouter } from "next/navigation";

interface NotePreviewProps {
  id: string;
}

const NotePreview = ({ id }: NotePreviewProps) => {
  const router = useRouter();
  const { data: note, isLoading, error } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error instanceof Error ? error.message : "Unknown error"}</p>;
  if (!note) return <p>Note not found.</p>;

  return (
    <Modal onClose={() => router.back()}>
      <div className={css.container}>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
        <p><strong>Tag:</strong> {note.tag}</p>
        <p><strong>Created at:</strong> {new Date(note.createdAt).toLocaleString()}</p>
        <button onClick={() => router.back()} className={css.closeButton}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default NotePreview;