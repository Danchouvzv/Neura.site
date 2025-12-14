import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import QuestionsPage from './QuestionsPage';
import QuestionDetailPage from './QuestionDetailPage';
import NewQuestionPage from './NewQuestionPage';

const QAPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-neura-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neura-pink border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<QuestionsPage />}
      />
      <Route
        path="/new"
        element={
          isAuthenticated ? (
            <NewQuestionPage />
          ) : (
            <Navigate to="/qa" replace />
          )
        }
      />
      <Route
        path="/:id"
        element={<QuestionDetailPage />}
      />
    </Routes>
  );
};

export default QAPage;

