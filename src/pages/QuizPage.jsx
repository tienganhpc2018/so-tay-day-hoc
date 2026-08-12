import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { QuizCard } from '../components/quiz/QuizCard';
import { QuizTakeModal } from '../components/quiz/QuizTakeModal';
import { AIExamGenerator } from '../components/quiz/AIExamGenerator';
import { CardSkeleton } from '../components/common/Skeleton';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { soundFX } from '../utils/soundEffects';
import { HelpCircle, Sparkles, BrainCircuit, BookOpen, Plus, Zap } from 'lucide-react';

export const QuizPage = () => {
  const { profile, isTeacher } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const gradeParam = searchParams.get('grade');

  const [activeTab, setActiveTab] = useState('bank');
  const [selectedGrade, setSelectedGrade] = useState(gradeParam ? parseInt(gradeParam, 10) : 7);
  const [quizzes, setQuizzes] = useState([]);
  const [resultsMap, setResultsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);

  useEffect(() => {
    if (gradeParam) {
      const g = parseInt(gradeParam, 10);
      if ([6, 7, 8, 9].includes(g)) {
        setSelectedGrade(g);
      }
    }
  }, [gradeParam]);

  useEffect(() => {
    fetchQuizzesAndResults();
  }, [selectedGrade, profile]);

  const fetchQuizzesAndResults = async () => {
    setLoading(true);
    try {
      // 1. READ SAVED LOCALSTORAGE EXAMS CREATED IN WORKSHEETPAGE
      const localExams = JSON.parse(localStorage.getItem('saved_quizzes_local') || '[]');
      const filteredLocal = localExams.filter(q => q.grade_level === selectedGrade);

      // 2. READ SUPABASE EXAMS DB
      let dbQuizzes = [];
      try {
        const { data: qData, error: qError } = await supabase
          .from('quizzes')
          .select('*')
          .eq('grade_level', selectedGrade)
          .order('created_at', { ascending: false });

        if (!qError && qData) {
          dbQuizzes = qData;
        }
      } catch (e) {
        console.log('Supabase read error (using local storage):', e);
      }

      // Merge Local & Supabase Quizzes (Deduplicate by ID or Title)
      const allQuizzes = [...filteredLocal, ...dbQuizzes];
      const uniqueQuizzes = Array.from(new Map(allQuizzes.map(item => [item.id || item.title, item])).values());

      setQuizzes(uniqueQuizzes);

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
    } fontFinally: {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* HERO BANNER WITH AI SCHOOL BACKGROUND IMAGE */}
      <PageHeroBanner
        title={`Ngân Hàng Đề Thi Khối ${selectedGrade} ⚡`}
        subtitle={`Liệt kê duy nhất nội dung đề thi Khối ${selectedGrade} bám sát ma trận CV7991 Global Success. Tự động sinh đề AI hoặc nạp file mẫu JSON.`}
        badge={`NGÂN HÀNG ĐỀ THI • KHỐI LỚP ${selectedGrade}`}
        bgImage="/images/hero_school_bg.jpg"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {isTeacher && (
              <button
                onClick={() => {
                  soundFX.playClick();
                  setActiveTab(activeTab === 'generator' ? 'bank' : 'generator');
                }}
                className="glass-button-accent text-xs px-4 py-2.5"
              >
                <Zap className="w-4 h-4" />
                {activeTab === 'generator' ? 'Xem Ngân Hàng Đề' : 'Soạn Đề Thi Chuẩn AI ⚡'}
              </button>
            )}

            <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
              {[6, 7, 8, 9].map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedGrade(g);
                    setSearchParams({ grade: g.toString() });
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    selectedGrade === g
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Khối {g}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* Main Content Area */}
      {activeTab === 'generator' && isTeacher ? (
        <AIExamGenerator onExamSaved={() => {
          fetchQuizzesAndResults();
          setActiveTab('bank');
        }} />
      ) : (
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : quizzes.length === 0 ? (
            <div className="glass-panel p-12 text-center text-slate-400 space-y-4">
              <HelpCircle className="w-12 h-12 text-slate-600 mx-auto" />
              <div>
                <p className="font-extrabold text-white text-base">Chưa có bài kiểm tra nào trong Khối {selectedGrade}.</p>
                <p className="text-xs text-slate-400 mt-1">Giáo viên có thể nhấp nút "Soạn Đề Thi Chuẩn AI ⚡" hoặc tạo đề tại menu Kiểm tra & Đánh giá để nạp bài ngay!</p>
              </div>

              {isTeacher && (
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setActiveTab('generator');
                  }}
                  className="glass-button-primary text-xs px-5 py-2.5 mx-auto"
                >
                  <BrainCircuit className="w-4 h-4" /> Soạn Đề Thi Khối {selectedGrade} Bằng AI
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  result={resultsMap[quiz.id]}
                  onStart={() => {
                    soundFX.playClick();
                    setActiveQuiz(quiz);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quiz Modal */}
      {activeQuiz && (
        <QuizTakeModal
          quiz={activeQuiz}
          onClose={() => setActiveQuiz(null)}
          onSubmitted={() => {
            fetchQuizzesAndResults();
          }}
        />
      )}

    </div>
  );
};
