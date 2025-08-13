import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from "./Notes.client";
import { notFound } from 'next/navigation';
import type { NoteTag } from '@/types/note';
import type { Metadata } from 'next';

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

const isNoteTag = (tag: string): tag is NoteTag => {
  return ["Todo", "Work", "Personal", "Meeting", "Shopping"].includes(tag);
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

export async function generateMetadata({ params }: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const raw = slug?.[0] ?? 'All';
  const normalized = capitalize(raw);
  const url = `https://yourdomain.com/notes/filter/${raw}`;

  return {
    title: `${normalized} notes — NoteHub`,
    description: `Browse ${normalized} notes in NoteHub.`,
    openGraph: {
      title: `${normalized} notes — NoteHub`,
      description: `Browse ${normalized} notes in NoteHub.`,
      url,
      images: [
        {
          url: 'https://yourdomain.com/og-image.png',
          width: 1200,
          height: 630,
          alt: 'NoteHub',
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;

  if (!slug || slug.length !== 1) notFound();

  const raw = slug[0];
  const normalized = capitalize(raw);

  let tag: NoteTag | undefined = undefined;
  if (normalized !== 'All') {
    if (isNoteTag(normalized)) {
      tag = normalized;
    } else {
      notFound();
    }
  }

  const queryClient = new QueryClient();
  const initialData = await queryClient.fetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: "", tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialData={initialData} tag={tag || "All"} />
    </HydrationBoundary>
  );
}