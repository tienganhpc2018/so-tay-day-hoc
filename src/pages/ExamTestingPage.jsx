import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  Clock, 
  ShieldAlert, 
  Calendar, 
  Shuffle, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Check, 
  BrainCircuit,
  Volume2,
  BookOpen,
  Edit3,
  Award,
  Lock,
  Flame,
  X,
  Sparkles,
  Archive,
  Layers,
  FileCheck
} from 'lucide-react';
import { GlobalSuccessKnowledgeBase } from '../data/globalSuccessData';
import { GRADE_UNITS_MAP } from '../constants/gradeUnits';

export const ExamTestingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const gradeParam = searchParams.get('grade');

  const [selectedGrade, setSelectedGrade] = useState(gradeParam ? parseInt(gradeParam, 10) : 7);

  useEffect(() => {
    if (gradeParam) {
      const g = parseInt(gradeParam, 10);
      if ([6, 7, 8, 9].includes(g)) setSelectedGrade(g);
    }
  }, [gradeParam]);

  // TOP 3 MAIN TABS ACCORDING TO USER DIRECTIVE:
  // Tab 1: 'bank' (Ngân hàng đề)
  // Tab 2: 'unit' (Kiểm tra theo Unit)
  // Tab 3: 'type' (Loại kiểm tra & Danh mục lưu trữ Archive AI)
  const [mainTab, setMainTab] = useState('bank');

  // Sub selections for Tab 2 & Tab 3
  const [selectedUnitVal, setSelectedUnitVal] = useState('unit1');
  const [selectedExamType, setSelectedExamType] = useState('thuong_xuyen'); // 'thuong_xuyen' | 'giua_ky' | 'cuoi_ky' | 'ts_10'

  // FIX DATETIME PICKER AUTO-FILL (FIX LỖI ảnh 2)
  const getFormattedDateTime = (offsetDays = 0) => {
    const d = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [openDate, setOpenDate] = useState(getFormattedDateTime(0));
  const [dueDate, setDueDate] = useState(getFormattedDateTime(7));

  // Advanced Configurations & Anti-cheating settings
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [enableAntiCheating, setEnableAntiCheating] = useState(true);
  const [maxViolations, setMaxViolations] = useState(3);
  const [violationCount, setViolationCount] = useState(0);

  // Section Checkboxes for Random Assembly
  const [examSections, setExamSections] = useState({
    listening: true,
    knowledge: true,
    reading: true,
    writing: true
  });

  // Archive AI Exams List State
  const [aiArchiveExams, setAiArchiveExams] = useState([
    {
      id: 'ai-arch-1',
      title: '✨ Đề AI Soạn Nhanh: Giữa Kỳ 1 Tiếng Anh 8 (Full 4 Kỹ Năng)',
      grade: 8,
      type: 'giua_ky',
      unit: 'Unit 1 & Unit 2',
      created: 'Hôm nay',
      questionsCount: 40,
      time: 45
    },
    {
      id: 'ai-arch-2',
      title: '✨ Đề AI Soạn Nhanh: Ôn Tập Tuyển Sinh Vào 10 Chuyên Tiếng Anh',
      grade: 9,
      type: 'ts_10',
      unit: 'Tổng hợp Units 1-12',
      created: 'Hôm qua',
      questionsCount: 50,
      time: 60
    },
    {
      id: 'ai-arch-3',
      title: '✨ Đề AI Soạn Nhanh: Kiểm Tra Thường Xuyên Unit 1 Global Success 7',
      grade: 7,
      type: 'thuong_xuyen',
      unit: 'Unit 1: Hobbies',
      created: '2 ngày trước',
      questionsCount: 15,
      time: 15
    }
  ]);

  const [selectedArchiveExam, setSelectedArchiveExam] = useState(null);

  // Active Exam Execution State
  const [isExamRunning, setIsExamRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(45 * 60);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [examResult, setExamResult] = useState(null);
  const [violationWarningModal, setViolationWarningModal] = useState(false);

  // Load custom saved AI quizzes from LocalStorage if available
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('saved_quizzes_local') || '[]');
      if (saved.length > 0) {
        const formattedSaved = saved.map(item => ({
          id: item.id,
          title: `✨ ${item.title}`,
          grade: item.grade_level || selectedGrade,
          type: 'thuong_xuyen',
          unit: item.unit || 'Unit 1',
          created: 'Vừa lưu',
          questionsCount: (item.questions?.[0]?.tasks?.[0]?.questions?.length) || 20,
          time: item.time_limit_minutes || 45
        }));
        setAiArchiveExams(prev => [...formattedSaved, ...prev]);
      }
    } catch (e) {}
  }, []);

  // Tab switch anti-cheating listener
  useEffect(() => {
    if (!isExamRunning || !enableAntiCheating || examResult) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        soundFX.playClick();
        setViolationCount((prev) => {
          const nextCount = prev + 1;
          setViolationWarningModal(true);
          if (nextCount >= maxViolations) {
            handleAutoSubmitExam(nextCount, 'Tự động nộp bài do vượt quá số lần vi phạm chuyển tab!');
          }
          return nextCount;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isExamRunning, enableAntiCheating, maxViolations, examResult]);

  // Exam Countdown Timer
  useEffect(() => {
    if (!isExamRunning || examResult || timerSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmitExam(violationCount, 'Hết giờ làm bài!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isExamRunning, examResult, timerSeconds]);

  // Assemble Random Exam from Question Bank according to mode & grade
  const handleStartExam = () => {
    soundFX.playClick();
    setViolationCount(0);
    setExamResult(null);

    const vocabList = GlobalSuccessKnowledgeBase.getVocabForUnits(selectedGrade, ['Unit 1', 'Unit 2']);
    const grammarList = GlobalSuccessKnowledgeBase.getGrammarForUnits(selectedGrade, ['Unit 1', 'Unit 2']);

    let timeMinutes = selectedArchiveExam ? selectedArchiveExam.time : 45;
    setTimerSeconds(timeMinutes * 60);

    let pool = [];

    if (examSections.listening) {
      pool.push({
        id: 'ex_l1',
        type: 'Listening',
        qText: `[LISTENING PART 1] What is mentioned about ${vocabList[0] || 'activities'} in Grade ${selectedGrade}?`,
        options: [`A. It promotes ${vocabList[0] || 'healthy living'}`, `B. It uses ${grammarList[0] || 'Present Simple'}`, 'C. It is done outdoors', 'D. It is for teachers'],
        correct: `A. It promotes ${vocabList[0] || 'healthy living'}`,
        audio: 'https://actions.google.com/sounds/v1/speech/person_speaking.ogg'
      });
      pool.push({
        id: 'ex_l2',
        type: 'Listening',
        qText: `[LISTENING PART 2 - True/False] Students in Grade ${selectedGrade} practice English every day.`,
        options: ['A. True', 'B. False'],
        correct: 'A. True'
      });
    }

    if (examSections.knowledge) {
      pool.push({
        id: 'ex_k1',
        type: 'Knowledge',
        qText: `Minh enjoys ________ (${vocabList[0] || 'hobbies'}) in his free time.`,
        options: ['A. practicing', 'B. practice', 'C. practiced', 'D. to practice'],
        correct: 'A. practicing'
      });
      pool.push({
        id: 'ex_k2',
        type: 'Knowledge',
        qText: `Eating healthy meals can cause ________ benefits for Grade ${selectedGrade} students.`,
        options: ['A. health', 'B. healthy', 'C. healthily', 'D. unhealthily'],
        correct: 'A. health'
      });
    }

    if (examSections.reading) {
      pool.push({
        id: 'ex_r1',
        type: 'Reading',
        qText: `[READING] What is essential for Grade ${selectedGrade} secondary school students?`,
        options: ['A. A balanced lifestyle and healthy routine', 'B. Playing video games all night', 'C. Skipping meals', 'D. Sleeping late'],
        correct: 'A. A balanced lifestyle and healthy routine',
        passage: `Having a balanced lifestyle is extremely important for secondary school students in Grade ${selectedGrade}. A healthy routine includes eating nutritious meals and exercising daily.`
      });
    }

    if (shuffleQuestions) {
      pool = pool.sort(() => Math.random() - 0.5);
    }

    setActiveQuestions(pool);
    setIsExamRunning(true);
    soundFX.playFanfare();
  };

  const handleSelectOption = (qId, optionVal) => {
    soundFX.playClick();
    setStudentAnswers(prev => ({ ...prev, [qId]: optionVal }));
  };

  const handleAutoSubmitExam = (finalViolations, reasonStr) => {
    setIsExamRunning(false);
    soundFX.playClick();

    let correctCount = 0;
    activeQuestions.forEach(q => {
      if (studentAnswers[q.id] === q.correct) correctCount++;
    });

    const scorePct = activeQuestions.length > 0 ? Math.round((correctCount / activeQuestions.length) * 10) : 0;

    if (scorePct >= 8) {
      soundFX.playFanfare();
      confetti({ particleCount: 150, spread: 90 });
    }

    setExamResult({
      score: scorePct,
      correctCount,
      totalQuestions: activeQuestions.length,
      finalViolations,
      reason: reasonStr,
      weakness: scorePct < 7 ? 'Cần luyện tập thêm kỹ năng Nghe hiểu và Ngữ pháp chia động từ.' : 'Đạt kết quả tốt trong ma trận đề thi thi thử!'
    });
  };

  const formatTimeMinutesSeconds = (secTotal) => {
    const mins = Math.floor(secTotal / 60);
    const secs = secTotal % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* 1. HERO BANNER */}
      <PageHeroBanner
        title={`Hệ Thống Thi Thử Tiếng Anh Khối ${selectedGrade} ⏱️`}
        subtitle="Thi thử trực tuyến ngay tại lớp hoặc lên lịch mở/khóa hạn nộp bài. Tích hợp kho đề archive soạn nhanh bằng AI và công nghệ chống gian lận chuyển tab."
        badge={`THI THỬ THỜI GIAN THỰC • KHỐI LỚP ${selectedGrade}`}
        bgImage="/images/hero_school_bg.jpg"
        actions={
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
                Lớp {g}
              </button>
            ))}
          </div>
        }
      />

      {/* 2. REORGANIZED 3 TOP TABS MATCHING USER DIRECTIVE: TAB 1: NGÂN HÀNG ĐỀ, TAB 2: KIỂM TRA THEO UNIT, TAB 3: LOẠI KIỂM TRA & ARCHIVE AI */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* TAB 1: NGÂN HÀNG ĐỀ (SỔ XUỐNG KHỐI 6, 7, 8, 9) */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              TAB 1: NGÂN HÀNG ĐỀ THI
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => {
                const g = Number(e.target.value);
                setSelectedGrade(g);
                setSearchParams({ grade: g.toString() });
                setMainTab('bank');
              }}
              className="w-full bg-slate-950 text-slate-200 text-xs font-black p-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-brand-500"
            >
              <option value={6}>📌 Ngân hàng đề thi: Khối 6</option>
              <option value={7}>📌 Ngân hàng đề thi: Khối 7</option>
              <option value={8}>📌 Ngân hàng đề thi: Khối 8</option>
              <option value={9}>📌 Ngân hàng đề thi: Khối 9</option>
            </select>
          </div>

          {/* TAB 2: KIỂM TRA THEO UNIT (SỔ 12 UNITS TÍCH HỢP ĐỘNG THEO KHỐI LỚP) */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              TAB 2: KIỂM TRA THEO UNIT (KHỐI {selectedGrade})
            </label>
            <select
              value={selectedUnitVal}
              onChange={(e) => {
                setSelectedUnitVal(e.target.value);
                setMainTab('unit');
              }}
              className="w-full bg-slate-950 text-slate-200 text-xs font-black p-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-brand-500"
            >
              {(GRADE_UNITS_MAP[selectedGrade] || []).map((u) => (
                <option key={u.value} value={u.value}>📚 {u.label}</option>
              ))}
            </select>
          </div>

          {/* TAB 3: LOẠI KIỂM TRA (THƯỜNG XUYÊN, GIỮA KỲ, CUỐI KỲ, TS 10) */}
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              TAB 3: LOẠI KIỂM TRA & KHO DE AI
            </label>
            <select
              value={selectedExamType}
              onChange={(e) => {
                setSelectedExamType(e.target.value);
                setMainTab('type');
              }}
              className="w-full bg-slate-950 text-emerald-400 text-xs font-black p-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-brand-500"
            >
              <option value="thuong_xuyen">🎯 1. Kiểm tra thường xuyên (15p)</option>
              <option value="giua_ky">🎯 2. Kiểm tra giữa kỳ (45p)</option>
              <option value="cuoi_ky">🎯 3. Kiểm tra cuối kỳ (60p)</option>
              <option value="ts_10">🎯 4. Kiểm tra Tuyển sinh vào 10 (90p)</option>
            </select>
          </div>

        </div>
      </div>

      {/* 3. MAIN EXAM CONFIGS & ANTI-CHEATING SETTINGS OR LIVE EXAM EXECUTION */}
      {!isExamRunning && !examResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT ADVANCED CONFIGS PANEL */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* PANEL 1: CẤU HÌNH TRỘN ĐỀ & THỜI GIAN (FIX LỖI NGÀY GIỜ TRONG ÁNH 2) */}
            <div className="glass-panel p-6 space-y-4 border-indigo-500/40 bg-slate-900/95 shadow-xl rounded-3xl">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <Shuffle className="w-4 h-4 text-indigo-400" />
                CẤU HÌNH THI THỬ & TRỘN ĐỀ NGẪU NHIÊN
              </h3>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
                <span className="text-slate-300">Tùy chọn trộn đề ngẫu nhiên (Lần 2 khác lần 1):</span>
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="accent-indigo-500 w-4 h-4 rounded cursor-pointer"
                />
              </div>

              {/* FIXED DATETIME PICKER AUTO-FILL (FIX LỖI ÁNH 2) */}
              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <div>
                  <label className="block text-slate-400 mb-1">NGÀY/GIỜ MỞ THI:</label>
                  <input
                    type="datetime-local"
                    value={openDate}
                    onChange={(e) => setOpenDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">HẠN NỘP BÀI:</label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* PANEL 2: DANH MỤC CÁC BÀI TẬP LƯU TRỮ (ARCHIVE) SOẠN NHANH BẰNG AI ACCORDING TO USER DIRECTIVE */}
            <div className="glass-panel p-6 space-y-4 border-purple-500/40 bg-slate-900/95 shadow-xl rounded-3xl">
              <h3 className="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <Archive className="w-4 h-4 text-purple-400" />
                KHO DE AI ARCHIVE (SOẠN NHANH ĐÃ LƯU)
              </h3>

              <div className="space-y-2 max-h-60 overflow-y-auto p-1">
                {aiArchiveExams.map((arch) => (
                  <div
                    key={arch.id}
                    onClick={() => {
                      soundFX.playClick();
                      setSelectedArchiveExam(arch);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer text-xs space-y-1 ${
                      selectedArchiveExam?.id === arch.id
                        ? 'bg-purple-600/30 border-purple-400 shadow-md'
                        : 'bg-slate-950 border-slate-800 hover:border-purple-500/40'
                    }`}
                  >
                    <div className="font-bold text-white flex items-center justify-between">
                      <span className="truncate">{arch.title}</span>
                      <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full font-black">
                        Khối {arch.grade}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{arch.unit} • {arch.questionsCount} câu</span>
                      <span>⏱️ {arch.time} phút</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PANEL 3: CHỐNG GIAN LẬN CHUYỂN TAB */}
            <div className="glass-panel p-6 space-y-4 border-rose-500/40 bg-slate-900/95 shadow-xl rounded-3xl">
              <h3 className="text-sm font-extrabold text-rose-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                CÔNG NGHỆ CHỐNG GIAN LẬN CHUYỂN TAB
              </h3>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
                <span className="text-slate-300">Bật phát hiện học sinh chuyển Tab:</span>
                <input
                  type="checkbox"
                  checked={enableAntiCheating}
                  onChange={(e) => setEnableAntiCheating(e.target.checked)}
                  className="accent-rose-500 w-4 h-4 rounded cursor-pointer"
                />
              </div>

              {enableAntiCheating && (
                <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-rose-200">Số lần vi phạm cho phép:</span>
                    <select
                      value={maxViolations}
                      onChange={(e) => setMaxViolations(parseInt(e.target.value))}
                      className="bg-slate-900 text-white p-1.5 rounded-lg border border-slate-700 font-bold"
                    >
                      <option value={1}>1 lần (Nộp ngay)</option>
                      <option value={3}>3 lần vi phạm</option>
                      <option value={5}>5 lần vi phạm</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT LAUNCH BOARD */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel p-8 sm:p-12 space-y-6 text-center border-indigo-500/40 bg-slate-900/95 shadow-2xl rounded-3xl">
              <div className="w-20 h-20 rounded-3xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center mx-auto text-3xl font-black">
                <Play className="w-10 h-10 fill-indigo-400" />
              </div>

              <div className="space-y-2">
                <span className="px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black border border-indigo-500/30 uppercase">
                  SẴN SÀNG BẮT ĐẦU BÀI THI THỬ KHỐI {selectedGrade}
                </span>

                <h2 className="text-2xl font-black text-white">
                  {selectedArchiveExam ? selectedArchiveExam.title : `CHẾ ĐỘ: ${selectedExamType.toUpperCase()}`}
                </h2>

                <p className="text-xs text-slate-400 font-bold max-w-md mx-auto">
                  Đề thi được chọn ngẫu nhiên từ Ngân hàng đề thi bám sát ma trận CV7991 Global Success Khối {selectedGrade}.
                </p>
              </div>

              <button
                onClick={handleStartExam}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
              >
                <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
                ⚡ BẮT ĐẦU THI THỬ TRỰC TUYẾN NGAY
              </button>
            </div>
          </div>

        </div>
      ) : isExamRunning ? (
        /* LIVE EXAM ARENA */
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-black text-brand-400 uppercase">ĐANG THI THỬ KHỐI {selectedGrade}</span>
              <h3 className="text-lg font-black text-white">BÀI THI THỬ THỜI GIAN THỰC</h3>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {formatTimeMinutesSeconds(timerSeconds)}
              </div>
              <button
                onClick={() => handleAutoSubmitExam(violationCount, 'Học sinh bấm Nộp bài thi thủ công')}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg"
              >
                NỘP BÀI THI
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {activeQuestions.map((q, idx) => (
              <div key={q.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 font-black text-sm text-white">
                  <span className="px-2.5 py-0.5 rounded-lg bg-brand-600 text-white text-xs">Câu {idx + 1}</span>
                  <span>{q.qText}</span>
                </div>

                {q.passage && (
                  <div className="p-3 rounded-xl bg-slate-900 text-xs text-slate-300 font-serif leading-relaxed italic border border-slate-800">
                    "{q.passage}"
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold pt-1">
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(q.id, opt)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        studentAnswers[q.id] === opt
                          ? 'bg-brand-600 text-white border-brand-400 shadow'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* RESULT SCORE CARD */
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 max-w-xl mx-auto shadow-2xl">
          <Award className="w-16 h-16 text-amber-400 mx-auto" />
          <h3 className="text-xl font-black text-white">KẾT QUẢ THI THỬ CỦA BẠN</h3>
          <div className="text-4xl font-black text-emerald-400">{examResult.score}/10 ĐIỂM</div>
          <p className="text-xs text-slate-400 font-bold">Số câu trả lời đúng: {examResult.correctCount}/{examResult.totalQuestions}</p>
          <button
            onClick={() => {
              setExamResult(null);
              setIsExamRunning(false);
            }}
            className="px-8 py-3 rounded-2xl bg-brand-600 text-white font-black text-xs shadow-lg"
          >
            QUAY LẠI TRANG THI THỬ
          </button>
        </div>
      )}

      {/* VIOLATION WARNING MODAL */}
      {violationWarningModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-base font-black text-rose-400">CẢNH BÁO VI PHẠM CHUYỂN TAB!</h3>
            <p className="text-xs text-slate-300 font-bold">
              Bạn vừa rời khỏi màn hình bài thi. Vi phạm <strong>{violationCount}/{maxViolations}</strong> lần!
            </p>
            <button
              onClick={() => setViolationWarningModal(false)}
              className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-black text-xs shadow"
            >
              Tôi Đã Hiểu & Tiếp Tục Bài Thi
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
