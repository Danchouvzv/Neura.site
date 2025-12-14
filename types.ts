export interface Team {
  id: string;
  number: string;
  name: string;
  location: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  website?: string;
  awards?: string[];
  logo?: string;
}

export interface SearchState {
  isLoading: boolean;
  error: string | null;
}

export interface Question {
  id: string;
  title: string;
  body: string;
  created_at: string;
  author_id: string;
  author_username?: string;
}

export interface Answer {
  id: string;
  question_id: string;
  body: string;
  created_at: string;
  author_id: string;
  author_username?: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
}