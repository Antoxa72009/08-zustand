import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NotePreview from './NotePreview.client';
import Modal from '@/components/Modal/Modal';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface NotePreviewPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NotePreviewPageProps): Promise<Metadata> {
  const { id } = await params;
  if (!id) notFound();

  const note = await fetchNoteById(id);
  const url = `https://yourdomain.com/notes/${id}`;

  return {
    title: note.title,
    description: note.content.slice(0, 160),
    openGraph: {
      title: note.title,
      description: note.content.slice(0, 160),
      url,
      images: [
        {
          url: 'https://yourdomain.com/og-image-note.png',
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
    },
  };
}

const NotePreviewPage = async ({ params }: NotePreviewPageProps) => {
  const { id } = await params;
  if (!id) notFound();

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