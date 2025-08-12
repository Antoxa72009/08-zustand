import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NoteDetails from './NoteDetails.client';
import { fetchNoteById } from '@/lib/api';
import type { Metadata } from 'next';

interface NotesPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: NotesPageProps
): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);
  return {
    title: `${note.title} — NoteHub`,
    description: note.content?.slice(0, 150) || 'Note details in NoteHub.',
  };
}

export default async function NoteDetailsRoute({ params }: NotesPageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetails id={id} />
    </HydrationBoundary>
  );
}