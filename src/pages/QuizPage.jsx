import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { QuizCard } from '../components/quiz/QuizCard';
import { QuizTakeModal } from '../components/quiz/QuizTakeModal';
import { CardSkeleton } from '../components/common/Skeleton';
import { soundFX } from '../utils/soundEffects';
import { HelpCircle, Sparkles, Trophy } from 'lucide-react';

export const QuizPage = () => {
  const { profile } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState(8);
  const [quizzes, setQuizzes] = useState([]);
  const [resultsMap, setResultsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);

  useEffect(() => {
    fetchQuizzesAndResults();
  }, [selectedGrade, profile]);

  const fetchQuizzesAndResults = async () => {
    setLoading(true);
    try {
      // 1. Fetch quizzes for grade
      const { data: qData, error: qError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('grade_level', selectedGrade)
        .order('created_at', { ascending: false });

      if (qError) throw qError;
      setQuizzes(qData || []);

      // 2. Fetch student results if logged in
      if (profile?.id) {
        const { data: rData } = await supabase
          .from('student_quiz_results')
          .select('*')
          .eq('student_id', profile.id);

        const map = {};
        (rData || []).forEach(r => {
          map[r.quiz_id] = r;
        });
        setResultsMap(map);
      }
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 border-brand-500/30">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <HelpCircle className="w-7 h-7 text-brand-400" />
            Ngân Hàng Đề Thi & Bài Kiểm Tra Tiếng Anh
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Rèn luyện kỹ năng Trắc nghiệm, Điền từ, Sắp xếp câu và Đọc hiểu tích điểm Sao.
          </p>
        </div>

        {/* Grade Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {[6, 7, 8, 9].map((g) => (
            <button
              key={g}
              onClick={() => {
                soundFX.playClick();
                setSelectedGrade(g);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                selectedGrade === g
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Khối {g}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : quizzes.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-400 space-y-2">
          <HelpCircle className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="font-semibold">Chưa có bài kiểm tra nào trong Khối {selectedGrade}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((q) => (
            <QuizCard
              key={q.id}
              quiz={q}
              userResult={resultsMap[q.id]}
              onTakeQuiz={(quizToTake) => setActiveQuiz(quizToTake)}
            />
          ))}
        </div>
      )}

      {/* Take Quiz Modal */}
      <QuizTakeModal
        isOpen={!!activeQuiz}
        onClose={() => setActiveQuiz(null)}
        quiz={activeQuiz}
        onQuizSubmitted={fetchQuizzesAndResults}
      />

    </div>
  );
};
