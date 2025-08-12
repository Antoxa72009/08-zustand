import axios from 'axios';
import type { Note, NoteTag } from '@/types/note'; 

const API_BASE_URL = 'https://notehub-public.goit.study/api';
const NOTES_ENDPOINT = '/notes';

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
console.log('VITE_NOTEHUB_TOKEN:', token);

if (!token) {
  console.error(
    "Помилка: NEXT_PUBLIC_NOTEHUB_TOKEN не встановлений. Будь ласка, переконайтеся, що ви додали його до файлу .env.local і перезапустили сервер розробки."
  );
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  },
});

export interface FetchNotesParams {
  page?: number;
  search?: string;
  perPage?: number;
  tag?: NoteTag; 
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface ErrorResponse {
  message: string;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = '',
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search) {
    params.search = search;
  }
  if (tag) { 
    params.tag = tag;
  }
  const response = await axiosInstance.get<FetchNotesResponse>(NOTES_ENDPOINT, { params });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axiosInstance.get<Note>(`${NOTES_ENDPOINT}/${id}`);
  return response.data;
};

export const createNote = async (note: {
  title: string;
  content: string;
  tag: NoteTag; 
}): Promise<Note> => {
  const response = await axiosInstance.post<Note>(NOTES_ENDPOINT, note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axiosInstance.delete<Note>(`${NOTES_ENDPOINT}/${id}`);
  return response.data;
};