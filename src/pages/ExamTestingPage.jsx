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
  X
} from 'lucide-react';
import { GlobalSuccessKnowledgeBase } from '../data/globalSuccessData';

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

  // 5 Exam Mode Tabs: 'quick' (10m), 'unit' (15-20m), 'min15' (15m), 'midterm' (45m), 'final' (60m)
  const [examMode, setExamMode] = useState('midterm');

  // Advanced Configurations & Anti-cheating settings
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [openDate, setOpenDate] = useState('');
  const [dueDate, setDueDate] = useState('');
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

  // Selected Units for 'unit' mode
  const [selectedUnits, setSelectedUnits] = useState(['Unit 1', 'Unit 2']);

  // Active Exam Execution State
  const [isExamRunning, setIsExamRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(45 * 60);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [examResult, setExamResult] = useState(null);
  const [violationWarningModal, setViolationWarningModal] = useState(false);

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

    let timeMinutes = 45;
    let questionTotal = 20;

    if (examMode === 'quick') { timeMinutes = 10; questionTotal = 10; }
    else if (examMode === 'min15') { timeMinutes = 15; questionTotal = 15; }
    else if (examMode === 'midterm') { timeMinutes = 45; questionTotal = 40; }
    else if (examMode === 'final') { timeMinutes = 60; questionTotal = 50; }

    setTimerSeconds(timeMinutes * 60);

    // Random Assembly Questions Pool
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
      
      {/* 1. HERO BANNER WITH SYSTEM THEME BACKDROP */}
      <PageHeroBanner
        title={`Hệ Thống Thi Thử Tiếng Anh Khối ${selectedGrade} ⏱️`}
        subtitle="Hệ thống thi thử ngẫu nhiên từ Ngân hàng đề thi, tự động trộn đề (lần 2 khác lần 1), lên lịch mở/đóng hạn nộp bài và tích hợp công nghệ chống gian lận chuyển tab."
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

      {/* 2. 5 SUB-TABS: KIỂM TRA NHANH, THEO UNIT, 15 PHÚT, GIỮA KỲ, CUỐI KỲ */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl text-xs font-black">
        {[
          { id: 'quick', label: '1. Kiểm tra nhanh (10p)', time: '10 phút' },
          { id: 'unit', label: '2. Kiểm tra theo Unit', time: '15-20 phút' },
          { id: 'min15', label: '3. Kiểm tra 15 phút', time: '15 phút' },
          { id: 'midterm', label: '4. Kiểm tra Giữa kỳ (45p)', time: '45 phút' },
          { id: 'final', label: '5. Kiểm tra Cuối kỳ (60p)', time: '60 phút' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundFX.playClick();
              setExamMode(tab.id);
            }}
            className={`p-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              examMode === tab.id
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg border border-brand-500/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. MAIN EXAM CONFIGS & ANTI-CHEATING SETTINGS OR LIVE EXAM EXECUTION */}
      {!isExamRunning && !examResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT ADVANCED CONFIGS PANEL */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* PANEL 1: CẤU HÌNH TRỘN ĐỀ & THỜI GIAN */}
            <div className="glass-panel p-6 space-y-4 border-indigo-500/40 bg-slate-900/95 shadow-xl">
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
                  className="accent-indigo-500 w-4 h-4 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <div>
                  <label className="block text-slate-400 mb-1">NGÀY/GIỜ MỞ THI:</label>
                  <input
                    type="datetime-local"
                    value={openDate}
                    onChange={(e) => setOpenDate(e.target.value)}
                    className="w-full glass-input p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">HẠN NỘP BÀI:</label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full glass-input p-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* PANEL 2: CHỐNG GIAN LẬN CHUYỂN TAB (ANTI-CHEATING LOCKOUT) */}
            <div className="glass-panel p-6 space-y-4 border-rose-500/40 bg-slate-900/95 shadow-xl">
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
                  className="accent-rose-500 w-4 h-4 rounded"
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
                  <p className="text-[11px] text-rose-300/80">
                    Nếu học sinh chuyển Tab quá số lần quy định, hệ thống sẽ tự động khóa và nộp bài thi ngay lập tức!
                  </p>
                </div>
              )}
            </div>

            {/* PANEL 3: TICK CHỌN DANH MỤC TRONG ĐỀ TỪ NGÂN HÀNG ĐỀ */}
            <div className="glass-panel p-6 space-y-4 border-slate-800 bg-slate-900/95 shadow-xl">
              <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-3">
                CÁC DANH MỤC TRONG ĐỀ TỪ NGÂN HÀNG ĐỀ:
              </h3>

              <div className="space-y-2 text-xs font-bold">
                {[
                  { key: 'listening', name: 'LISTENING (Nghe hiểu)' },
                  { key: 'knowledge', name: 'KNOWLEDGE OF LANGUAGE' },
                  { key: 'reading', name: 'READING (Đọc hiểu)' },
                  { key: 'writing', name: 'WRITING (Viết sáng tạo)' }
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                    <span className="text-slate-200">{item.name}</span>
                    <input
                      type="checkbox"
                      checked={examSections[item.key]}
                      onChange={() => setExamSections(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className="accent-indigo-500 w-4 h-4 rounded"
                    />
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT LAUNCH BOARD */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel p-8 sm:p-12 space-y-6 text-center border-indigo-500/40 bg-slate-900/95 shadow-2xl">
              <div className="w-20 h-20 rounded-3xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center mx-auto text-3xl font-black">
                <Play className="w-10 h-10 fill-indigo-400" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black uppercase">
                  SẮN SÀNG BẮT ĐẦU BÀI THI THỬ KHỐI {selectedGrade}
                </span>
                <h2 className="text-2xl font-black text-white">Chế Độ: {examMode.toUpperCase()}</h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Đề thi được rút ngẫu nhiên từ Ngân hàng đề thi bám sát ma trận CV7991 Global Success Khối {selectedGrade}.
                </p>
              </div>

              <button
                onClick={handleStartExam}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white font-black text-sm shadow-2xl flex items-center justify-center gap-2 mx-auto"
              >
                <Zap className="w-5 h-5 fill-white" /> 🚀 BẮT ĐẦU THI THỬ TRỰC TUYẾN NGAY
              </button>
            </div>
          </div>

        </div>
      ) : isExamRunning ? (
        
        /* LIVE INTERACTIVE EXAM CANVAS */
        <div className="space-y-6 animate-fadeIn">
          
          {/* TOP EXAM TIMER & ANTI-CHEATING STATUS BAR */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-2xl sticky top-24 z-40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-black text-xs">
                THI THỬ KHỐI {selectedGrade}
              </span>
              <span className="text-xs font-bold text-slate-300">
                Chủ đề: {examMode.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {enableAntiCheating && (
                <span className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                  violationCount > 0 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  <ShieldAlert className="w-4 h-4" /> Vi phạm chuyển Tab: {violationCount} / {maxViolations}
                </span>
              )}

              <div className="flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm shadow-lg">
                <Clock className="w-4 h-4 animate-spin" />
                <span>{formatTimeMinutesSeconds(timerSeconds)}</span>
              </div>
            </div>
          </div>

          {/* QUESTIONS LIST */}
          <div className="bg-[#1e293b] text-slate-100 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-8 border border-slate-700/80">
            <div className="space-y-6">
              {activeQuestions.map((q, qIdx) => (
                <div key={q.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded bg-indigo-600 text-white font-black">
                      Câu {qIdx + 1} ({q.type})
                    </span>
                  </div>

                  {q.audio && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1">
                        <Volume2 className="w-4 h-4" /> Audio Bài Nghe:
                      </span>
                      <audio controls src={q.audio} className="w-full" />
                    </div>
                  )}

                  {q.passage && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-serif text-slate-300 leading-relaxed">
                      {q.passage}
                    </div>
                  )}

                  <p className="font-extrabold text-sm text-white">{q.qText}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = studentAnswers[q.id] === opt;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(q.id, opt)}
                          className={`p-3.5 rounded-2xl border text-xs font-bold text-left transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg'
                              : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border-slate-800'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleAutoSubmitExam(violationCount, 'Học sinh hoàn thành và chủ động nộp bài thi!')}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" /> NỘP BÀI THI THỬ & XEM ĐIỂM SỐ
            </button>
          </div>

        </div>
      ) : (
        
        /* RESULT VIEW */
        <div className="glass-panel p-8 sm:p-12 max-w-2xl mx-auto space-y-6 text-center border-emerald-500/40 bg-slate-900/95 shadow-2xl animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto text-3xl font-black">
            🏆
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase">
              KẾT QUẢ THI THỬ TRỰC TUYẾN
            </span>
            <h2 className="text-3xl font-black text-white">{examResult.score} / 10 ĐIỂM</h2>
            <p className="text-xs text-slate-400 font-semibold">{examResult.reason}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 text-left">
            <div className="flex justify-between text-slate-300">
              <span>Số câu trả lời đúng:</span>
              <strong className="text-emerald-400 font-black">{examResult.correctCount} / {examResult.totalQuestions} câu</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Số lần vi phạm chuyển Tab:</span>
              <strong className="text-rose-400 font-black">{examResult.finalViolations} lần</strong>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              setExamResult(null);
            }}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg"
          >
            🔄 Thi Thử Bài Khác
          </button>
        </div>
      )}

      {/* VIOLATION WARNING MODAL */}
      {violationWarningModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl p-6 max-w-md w-full text-white border-2 border-rose-500 space-y-4 shadow-2xl animate-bounce">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <ShieldAlert className="w-8 h-8 text-rose-500 shrink-0" />
              <div>
                <h3 className="text-base font-black text-rose-400">⚠️ CẢNH BÁO GIAN LẬN CHUYỂN TAB</h3>
                <span className="text-xs text-slate-400">Hệ thống ghi nhận bạn vừa rời khỏi màn hình thi!</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              Số lần vi phạm: <strong className="text-rose-400">{violationCount} / {maxViolations} lần</strong>. Nếu vi phạm quá số lần cho phép, bài thi sẽ bị tự động khóa và nộp ngay lập tức!
            </p>

            <button
              onClick={() => setViolationWarningModal(false)}
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg"
            >
              Tôi Đã Hiểu - Tiếp Tục Làm Bài
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
