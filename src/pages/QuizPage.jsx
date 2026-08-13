import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { QuizCard } from '../components/quiz/QuizCard';
import { QuizTakeModal } from '../components/quiz/QuizTakeModal';
import { QuizCreatorModal } from '../components/quiz/QuizCreatorModal';
import { QuizAnalyticsDashboard } from '../components/quiz/QuizAnalyticsDashboard';
import { CardSkeleton } from '../components/common/Skeleton';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { soundFX } from '../utils/soundEffects';
import { 
  HelpCircle, 
  Sparkles, 
  BrainCircuit, 
  BookOpen, 
  Plus, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Dices, 
  FileSpreadsheet, 
  Layers,
  Search,
  Crown,
  Flame,
  BarChart3,
  Star,
  Award
} from 'lucide-react';

export const QuizPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const gradeParam = searchParams.get('grade');

  // Filter States
  const [selectedGrade, setSelectedGrade] = useState(gradeParam ? parseInt(gradeParam, 10) : 8);
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [quizzes, setQuizzes] = useState([]);
  const [resultsMap, setResultsMap] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

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
  }, [selectedGrade, selectedUnit, selectedSkill, profile]);

  // PRE-BUILT FALLBACK EXAM CARDS FOR EACH GRADE
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
      const localExams = JSON.parse(localStorage.getItem('saved_quizzes_local') || '[]');
      const filteredLocal = localExams.filter(q => q.grade_level === selectedGrade);

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
      } catch (err) {}

      const fallbackList = getFallbackQuizzes(selectedGrade);
      const combined = [...filteredLocal, ...dbQuizzes, ...fallbackList];
      const uniqueQuizzes = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
      setQuizzes(uniqueQuizzes);

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

  const topStudentsList = [
    { name: 'Phạm Thanh Tú', class: 'Lớp 8A5', stars: '180 ⭐', score: '9.8 Điểm TB', avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop' },
    { name: 'Trần Thuỳ Dương', class: 'Lớp 8A5', stars: '165 ⭐', score: '9.5 Điểm TB', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
    { name: 'Vũ Mai Phương', class: 'Lớp 7A2', stars: '150 ⭐', score: '9.2 Điểm TB', avatar: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=200&auto=format&fit=crop' },
    { name: 'Bùi Hoàng Hải', class: 'Lớp 9A1', stars: '140 ⭐', score: '9.0 Điểm TB', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' }
  ];

  const filteredQuizzes = quizzes.filter(q => {
    if (searchQuery && !q.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* PAGE HERO BANNER */}
      <PageHeroBanner
        title="Ngân Hàng Đề Thi & Bài Kiểm Tra 4.0 🎯"
        subtitle="Hệ thống quản lý đề thi thông minh gồm 6 dạng câu hỏi, Trộn đề tự động & Đồng hồ đếm ngược nộp bài tự động!"
        badge="NGÂN HÀNG ĐỀ THI • BÀI KIỂM TRA THCS 4.0"
        bgImage="/images/hero_school_bg.jpg"
        showVipBadge={true}
      />

      {/* TOP CONTROL / FILTER BAR REORGANIZED MATCHING SCREENSHOT 1 100% */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          
          {/* LEFT 5 DROPDOWNS & TABS MATCHING USER REQUEST */}
          <div className="lg:col-span-8 flex flex-wrap items-center gap-2">
            
            {/* TAB / DROPDOWN 1: NGÂN HÀNG ĐỀ THI (LỚP 6-9) */}
            <select
              value={selectedGrade}
              onChange={(e) => {
                const g = Number(e.target.value);
                setSelectedGrade(g);
                setSearchParams({ grade: g.toString() });
              }}
              className="bg-slate-950 text-slate-200 text-xs font-black px-3.5 py-2.5 rounded-2xl border border-slate-800 focus:outline-none"
            >
              <option value={6}>📌 Ngân hàng đề thi: Khối 6</option>
              <option value={7}>📌 Ngân hàng đề thi: Khối 7</option>
              <option value={8}>📌 Ngân hàng đề thi: Khối 8</option>
              <option value={9}>📌 Ngân hàng đề thi: Khối 9</option>
            </select>

            {/* TAB / DROPDOWN 2: LỰA CHỌN BÀI HỌC (UNIT 1-12) */}
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs font-black px-3.5 py-2.5 rounded-2xl border border-slate-800 focus:outline-none"
            >
              <option value="all">📚 Lựa chọn bài học: Tất cả Units</option>
              <option value="unit1">Unit 1: Hobbies / My new school</option>
              <option value="unit2">Unit 2: Healthy living / My home</option>
              <option value="unit3">Unit 3: Community service</option>
              <option value="unit4">Unit 4: Music and arts</option>
              <option value="unit5">Unit 5: Food and drink</option>
              <option value="unit6">Unit 6: Vietnamese lifestyle</option>
              <option value="unit7">Unit 7: Traffic and transport</option>
              <option value="unit8">Unit 8: Films and media</option>
              <option value="unit9">Unit 9: Festivals around the world</option>
              <option value="unit10">Unit 10: Energy sources</option>
              <option value="unit11">Unit 11: Traveling in the future</option>
              <option value="unit12">Unit 12: English speaking countries</option>
            </select>

            {/* TAB / DROPDOWN 3: KỸ NĂNG CẦN KIỂM TRA */}
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs font-black px-3.5 py-2.5 rounded-2xl border border-slate-800 focus:outline-none"
            >
              <option value="all">🎯 Kỹ năng cần kiểm tra: Tất cả 4 kỹ năng</option>
              <option value="listening">1. Listening (Nghe hiểu)</option>
              <option value="speaking">2. Speaking (Nói & Chấm AI)</option>
              <option value="reading">3. Reading (Đọc hiểu)</option>
              <option value="writing">4. Writing (Viết & Chấm AI)</option>
            </select>

            {/* TAB 4: NGÂN HÀNG ĐỀ THI (SOẠN ĐỀ THI MỚI) */}
            <button
              onClick={() => {
                soundFX.playClick();
                setShowCreatorModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5 hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" /> Ngân Hàng Đề Thi (Soạn Đề Mới)
            </button>

            {/* TAB 5: THỐNG KÊ BÁO CÁO (LINK TỚI DASHBOARD REQUISITE PAGE) */}
            <button
              onClick={() => {
                soundFX.playClick();
                setShowAnalyticsModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg flex items-center gap-1.5 hover:scale-105 transition-all"
            >
              <BarChart3 className="w-4 h-4" /> Thống Kê Báo Cáo
            </button>

          </div>

          {/* RIGHT SEARCH BOX */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm đề thi trong ngân hàng..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 text-xs font-bold text-slate-200 border border-slate-800 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT MATCHING SCREENSHOT 1 100% */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: QUIZ CARDS GRID (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              Danh Sách Đề Thi Khối {selectedGrade} ({filteredQuizzes.length} Đề Thi Trong Ngân Hàng)
            </h2>

            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Đã hỗ trợ chấm tự luận & ảnh chụp bài làm
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredQuizzes.map((quiz) => (
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

        {/* RIGHT COLUMN: SIDEBAR MATCHING SCREENSHOT 1 WITH "HỌC SINH NỔI BẬT" */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 👑 HỌC SINH NỔI BẬT (CHUYỂN ĐỔI THEO YÊU CẦU CỦA THẦY) */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Crown className="w-5 h-5 text-amber-400 animate-bounce" />
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider">
                👑 HỌC SINH NỔI BẬT
              </h3>
            </div>

            <div className="space-y-3">
              {topStudentsList.map((st, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between hover:border-amber-500/40 transition-all">
                  <div className="flex items-center gap-3">
                    <img src={st.avatar} alt={st.name} className="w-10 h-10 rounded-full object-cover border-2 border-amber-400" />
                    <div>
                      <div className="font-black text-xs text-slate-100 flex items-center gap-1">
                        {st.name}
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold text-[9px]">TOP {idx + 1}</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-400">{st.class}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-amber-400">{st.stars}</div>
                    <div className="text-[10px] font-bold text-emerald-400">{st.score}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🔥 ĐẮNG HOT */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Flame className="w-5 h-5 text-rose-500" />
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider">
                🔥 ĐỀ THI ĐANG HOT
              </h3>
            </div>

            <div className="space-y-3">
              {quizzes.slice(0, 3).map((quiz) => (
                <div 
                  key={quiz.id}
                  onClick={() => {
                    soundFX.playClick();
                    setActiveQuiz(quiz);
                  }}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between hover:border-brand-500/50 transition-all cursor-pointer"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-200 line-clamp-1">
                      {quiz.title}
                    </h4>
                    <span className="text-[10px] font-extrabold text-emerald-400">
                      {quiz.time_limit_minutes || 45} Phút • {quiz.exam_code}
                    </span>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-[10px] shrink-0">
                    Thi
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* QUIZ CREATOR MODAL */}
      <QuizCreatorModal
        isOpen={showCreatorModal}
        onClose={() => setShowCreatorModal(false)}
        initialGrade={selectedGrade}
        onQuizCreated={() => fetchQuizzesAndResults()}
      />

      {/* QUIZ ANALYTICS DASHBOARD MODAL (TAB 5 THỐNG KÊ BÁO CÁO LINK PAGE) */}
      <QuizAnalyticsDashboard
        isOpen={showAnalyticsModal}
        onClose={() => setShowAnalyticsModal(false)}
      />

      {/* QUIZ TAKE MODAL */}
      {activeQuiz && (
        <QuizTakeModal
          isOpen={!!activeQuiz}
          quiz={activeQuiz}
          onClose={() => setActiveQuiz(null)}
          onQuizSubmitted={() => fetchQuizzesAndResults()}
        />
      )}

    </div>
  );
};
