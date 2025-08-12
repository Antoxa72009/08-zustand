import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NotePreview from './NotePreview.client';
import Modal from '@/components/Modal/Modal';
import { notFound } from 'next/navigation';

interface NotePreviewPageProps {
  params: Promise<{ id: string }>;
}

const NotePreviewPage = async ({ params }: NotePreviewPageProps) => {
  const { id } = await params;
  if (!id) {
    notFound();
  }
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <Modal>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotePreview id={id} />
      </HydrationBoundary>
    </Modal>
  );
};

export default NotePreviewPage;