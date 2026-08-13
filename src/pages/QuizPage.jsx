import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { QuizCard } from '../components/quiz/QuizCard';
import { QuizTakeModal } from '../components/quiz/QuizTakeModal';
import { QuizCreatorModal } from '../components/quiz/QuizCreatorModal';
import { CardSkeleton } from '../components/common/Skeleton';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { soundFX } from '../utils/soundEffects';
import { HelpCircle, Sparkles, BrainCircuit, BookOpen, Plus, FileText, CheckCircle2, Clock, Dices, FileSpreadsheet, Layers } from 'lucide-react';

export const QuizPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const gradeParam = searchParams.get('grade');

  const [selectedGrade, setSelectedGrade] = useState(gradeParam ? parseInt(gradeParam, 10) : 7);
  const [quizzes, setQuizzes] = useState([]);
  const [resultsMap, setResultsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [showCreatorModal, setShowCreatorModal] = useState(false);

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

  // PRE-BUILT FALLBACK EXAM CARDS FOR EACH GRADE (SO THE BANK IS NEVER EMPTY!)
  const getFallbackQuizzes = (grade) => [
    {
      id: `preset-exam-g${grade}-1`,
      title: `BÀI KIỂM TRA GIỮA KỲ 1 TIẾNG ANH KHỐI ${grade}`,
      description: `Đề thi giữa kỳ Khối ${grade} bám sát SGK Global Success. Gồm trắc nghiệm 1 đáp án, nhiều đáp án, đúng/sai, điền chỗ trống, kéo thả và tự luận.`,
      grade_level: grade,
      unit: 'Unit 1 • Unit 2 • Unit 3',
      teacher_name: 'Thầy Nguyễn Văn Hải VIP',
      created_at: new Date().toISOString(),
      time_limit_minutes: 45,
      is_published: true,
      exam_code: `EXAM-G${grade}-001`,
      shuffleQuestions: true,
      questions: [
        {
          id: 'sec_1',
          title: 'I. NỘI DUNG ĐỀ THI TỔNG HỢP',
          enabled: true,
          tasks: [
            {
              task_title: 'BÀI KIỂM TRA 4 KỸ NĂNG & ĐỘ HỌC LIỆU SỐ',
              task_desc: 'Học sinh làm bài thi trắc nghiệm và tự luận có hẹn giờ đếm ngược.',
              questions: [
                { id: 'q1', num: 1, type: 'single_choice', qText: `What is the main topic of Grade ${grade} Unit 1?`, options: ['A. Healthy living and hobbies', 'B. Shopping online', 'C. Space exploration', 'D. History of art'], correct: 'A. Healthy living and hobbies' },
                { id: 'q2', num: 2, type: 'multi_choice', qText: 'Which of the following are healthy lifestyle habits? (Choose ALL)', options: ['A. Eating fresh vegetables', 'B. Drinking plenty of water', 'C. Staying up late', 'D. Daily exercise'], correct: ['A. Eating fresh vegetables', 'B. Drinking plenty of water', 'D. Daily exercise'] },
                { id: 'q3', num: 3, type: 'true_false', qText: 'Present simple is used for daily routines.', options: ['Đúng (True)', 'Sai (False)'], correct: 'Đúng (True)' },
                { id: 'q4', num: 4, type: 'fill_blank', qText: 'She enjoys _____ (read) books in her free time.', correct: 'reading' },
                { id: 'q5', num: 5, type: 'essay', qText: 'Write a short paragraph (80-100 words) about your favorite hobby or upload a photo of your handwritten paper.', allowPhoto: true }
              ]
            }
          ]
        }
      ]
    },
    {
      id: `preset-exam-g${grade}-2`,
      title: `BÀI KIỂM TRA CUỐI KỲ 1 TIẾNG ANH KHỐI ${grade}`,
      description: `Đề thi kiểm tra học kỳ 1 Tiếng Anh Khối ${grade} gồm 6 Units (Unit 1 đến Unit 6). Hỗ trợ trộn đề và nộp bài tự động.`,
      grade_level: grade,
      unit: 'Unit 1 đến Unit 6',
      teacher_name: 'Thầy Nguyễn Văn Hải VIP',
      created_at: new Date().toISOString(),
      time_limit_minutes: 60,
      is_published: true,
      exam_code: `EXAM-G${grade}-002`,
      questions: []
    }
  ];

  const fetchQuizzesAndResults = async () => {
    setLoading(true);
    try {
      // 1. READ LOCALSTORAGE SAVED EXAMS
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
      } catch (err) {
        console.warn('Supabase quizzes fetch fallback:', err);
      }

      // Merge Local, DB and Fallbacks
      const fallbackList = getFallbackQuizzes(selectedGrade);
      const combined = [...filteredLocal, ...dbQuizzes, ...fallbackList];
      
      // Remove duplicates by ID
      const uniqueQuizzes = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
      setQuizzes(uniqueQuizzes);

      // 3. FETCH STUDENT RESULTS
      if (profile?.id) {
        try {
          const { data: rData } = await supabase
            .from('student_quiz_results')
            .select('*')
            .eq('student_id', profile.id);

          if (rData) {
            const rMap = {};
            rData.forEach(r => {
              rMap[r.quiz_id] = r;
            });
            setResultsMap(rMap);
          }
        } catch (e) {}
      }
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* Page Banner Header */}
      <PageHeroBanner
        title="Ngân Hàng Đề Thi & Bài Kiểm Tra 4.0 🎯"
        subtitle="Hệ thống quản lý đề thi thông minh gồm 6 dạng câu hỏi (Trắc nghiệm, Nhiều đáp án, Đúng/Sai, Điền từ, Kéo thả, Tự luận & Ảnh chụp bài làm), Trộn đề tự động & Hẹn giờ đếm ngược!"
        badge="NGÂN HÀNG ĐỀ THI • BÀI KIỂM TRA THCS 4.0"
        bgImage="/images/hero_school_bg.jpg"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                soundFX.playClick();
                setShowCreatorModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Soạn Đề Thi Mới 4.0
            </button>

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
                      ? 'bg-indigo-600 text-white shadow-md'
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

      {/* TOP FEATURE HIGHLIGHTS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-3xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>6 Loại Câu Hỏi Đa Dạng</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Hẹn Giờ Đếm Ngược Live</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <Dices className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Trộn Đề & Tùy Chọn Ma Trận</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <FileSpreadsheet className="w-4 h-4 text-purple-400 shrink-0" />
          <span>Import Từ Word / Excel</span>
        </div>
      </div>

      {/* Main Content Area - Question Cards Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Danh Sách Đề Thi Khối {selectedGrade} ({quizzes.length} Đề Thi Trong Ngân Hàng)
          </h2>

          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Đã hỗ trợ chấm tự luận & ảnh chụp bài làm
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
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

      {/* Quiz Creator Modal */}
      <QuizCreatorModal
        isOpen={showCreatorModal}
        onClose={() => setShowCreatorModal(false)}
        initialGrade={selectedGrade}
        onQuizCreated={() => {
          fetchQuizzesAndResults();
        }}
      />

      {/* Quiz Take Modal */}
      {activeQuiz && (
        <QuizTakeModal
          isOpen={!!activeQuiz}
          quiz={activeQuiz}
          onClose={() => setActiveQuiz(null)}
          onQuizSubmitted={() => {
            fetchQuizzesAndResults();
          }}
        />
      )}

    </div>
  );
};
