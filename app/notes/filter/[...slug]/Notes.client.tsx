"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import css from "./NotesPage.module.css";
import NotesList from "@/components/NoteList/NoteList";
import { fetchNotes, type FetchNotesResponse } from "@/lib/api";
import type { Note, NoteTag } from '@/types/note';
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

interface NotesProps {
  initialData: FetchNotesResponse;
  tag?: string;
}

const isNoteTag = (tag: string): tag is NoteTag => {
  return ["Todo", "Work", "Personal", "Meeting", "Shopping"].includes(tag);
};

export default function Notes({ initialData, tag: initialTag }: NotesProps) {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 12;

  useEffect(() => {
    setSearch("");
    setPage(1);
  }, [initialTag]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 1000);

  const validatedTag = initialTag && isNoteTag(initialTag) ? initialTag : undefined;

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", page, search, initialTag],
    queryFn: () =>
      fetchNotes({
        page,
        perPage,
        search,
        tag: validatedTag,
      }),
    placeholderData: (previousData) => previousData ?? initialData,
  });

  const notes: Note[] = data?.notes ?? [];
  const totalPages: number = data?.totalPages ?? 1;

  useEffect(() => {
    if (isSuccess && !isLoading && notes.length === 0) {
      toast.error("No notes found for your request.");
    }
  }, [isSuccess, isLoading, notes.length]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>
      <Toaster position="top-center" />
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error...</p>}
      {notes.length > 0 && <NotesList notes={notes} />}
    </div>
  );
}