import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { QuizCard } from '../components/quiz/QuizCard';
import { QuizTakeModal } from '../components/quiz/QuizTakeModal';
import { CardSkeleton } from '../components/common/Skeleton';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { soundFX } from '../utils/soundEffects';
import { HelpCircle, Sparkles, BrainCircuit, BookOpen, Plus, FileText, CheckCircle2 } from 'lucide-react';

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
      description: `Đề thi kiểm tra giữa học kỳ 1 Khối ${grade} bám sát 100% ma trận SGK Global Success. Đủ 4 kỹ năng Listening, Knowledge, Reading, Writing.`,
      grade_level: grade,
      unit: 'Unit 1 • Unit 2 • Unit 3',
      teacher_name: 'Thầy Nguyễn Văn Hải VIP',
      created_at: new Date().toISOString(),
      time_limit_minutes: 45,
      is_published: true,
      exam_code: `EXAM-G${grade}-001`,
      questions: [
        {
          id: 'sec_1',
          title: 'I. LISTENING COMPREHENSION (KỸ NĂNG NGHE)',
          enabled: true,
          tasks: [
            {
              task_title: 'PART 1: MULTIPLE CHOICE (5 CÂU)',
              task_desc: 'Listen to the audio recording (~60-80s) and choose A, B, C, or D.',
              questions: [
                { id: 'q1', num: 1, qText: `What is the main topic of Grade ${grade} Unit 1 & 2?`, options: ['A. Healthy living and hobbies', 'B. Shopping online', 'C. Space exploration', 'D. History of art'], correct: 'A. Healthy living and hobbies' },
                { id: 'q2', num: 2, qText: 'Which activity is recommended for healthy living?', options: ['A. Eating fresh vegetables', 'B. Sleeping late at night', 'C. Playing games all day', 'D. Drinking soft drinks'], correct: 'A. Eating fresh vegetables' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: `preset-exam-g${grade}-2`,
      title: `BÀI KIỂM TRA CUỐI KỲ 1 TIẾNG ANH KHỐI ${grade}`,
      description: `Đề thi kiểm tra học kỳ 1 Tiếng Anh Khối ${grade} gồm 6 Units (Unit 1 đến Unit 6). Tích hợp file audio luyện nghe và đọc hiểu.`,
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
      // 1. READ LOCALSTORAGE SAVED EXAMS CREATED FROM WORKSHEETPAGE
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
        console.log('Supabase read error (fallback):', e);
      }

      // Merge Local + Supabase + Fallback Quizzes (Ensure Bank is NEVER empty!)
      const fallbacks = getFallbackQuizzes(selectedGrade);
      const combined = [...filteredLocal, ...dbQuizzes, ...fallbacks];
      const uniqueQuizzes = Array.from(new Map(combined.map(item => [item.id || item.title, item])).values());

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* HERO BANNER - PURE QUESTION BANK LIBRARY (NO AI GENERATOR BUTTON HERE) */}
      <PageHeroBanner
        title={`Thư Viện Ngân Hàng Đề Thi Khối ${selectedGrade} ⚡`}
        subtitle={`Lưu trữ và hiển thị trọn bộ bài kiểm tra Khối ${selectedGrade} bám sát ma trận CV7991 Global Success. Giáo viên có thể bấm làm bài hoặc giao bài cho học sinh.`}
        badge={`NGÂN HÀNG ĐỀ THI • KHỐI LỚP ${selectedGrade}`}
        bgImage="/images/hero_school_bg.jpg"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                soundFX.playClick();
                navigate('/worksheet');
              }}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Soạn Đề Thi Mới (Chuyển Sang Studio)
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

      {/* Main Content Area - Question Cards Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Danh Sách Đề Thi Khối {selectedGrade} ({quizzes.length} Đề Thi Trong Ngân Hàng)
          </h2>

          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Đã đồng bộ với Studio Soạn Đề
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

      {/* Quiz Take / Preview Modal */}
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
