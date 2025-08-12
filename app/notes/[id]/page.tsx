import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NoteDetails from './NoteDetails.client';
import { fetchNoteById } from '@/lib/api';


interface NotesPageProps {
  params: Promise<{ id: string }>;
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