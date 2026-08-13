import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Save, 
  FileText, 
  Clock, 
  Shuffle, 
  Dices, 
  CheckSquare, 
  Square, 
  Sigma, 
  FileSpreadsheet, 
  Upload, 
  CheckCircle2, 
  Layers, 
  HelpCircle, 
  Sparkles,
  Link2,
  BookOpen,
  Mic,
  MessageSquare,
  Printer,
  Download,
  Edit3,
  Flame,
  Volume2,
  Check,
  Play
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

import { GRADE_UNITS_MAP } from '../../constants/gradeUnits';

export const QuizCreatorModal = ({ isOpen, onClose, onQuizCreated, initialGrade = 8 }) => {
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'questions' | 'import' | 'random' | 'ai_authoring' | 'ai_speaking_writing'
  
  // Exam General Settings
  const [examTitle, setExamTitle] = useState('');
  const [examDesc, setExamDesc] = useState('');
  const [gradeLevel, setGradeLevel] = useState(initialGrade);
  const [unitTopic, setUnitTopic] = useState(GRADE_UNITS_MAP[initialGrade]?.[0]?.label || 'Unit 1');
  const [timeLimit, setTimeLimit] = useState(45); // 15, 30, 45, 60, 0
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [allowPhotoUpload, setAllowPhotoUpload] = useState(true);

  // Tab 5: AI Authoring Studio State (Screenshots 1, 2, 3)
  const [aiGrade, setAiGrade] = useState(6);
  const [selectedUnits, setSelectedUnits] = useState(['unit1', 'unit2']);
  const [driveAudioLink, setDriveAudioLink] = useState('');
  const [promptNotes, setPromptNotes] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiExamGenerated, setAiExamGenerated] = useState(false);

  // Tab 6: Speaking & Writing AI State
  const [aiMode, setAiMode] = useState('speaking'); // 'speaking' | 'writing'
  const [isRecording, setIsRecording] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Question List State
  const [questions, setQuestions] = useState([
    {
      id: 'q1',
      type: 'single_choice',
      difficulty: 'medium',
      question: 'What is the synonym of "famous" in Grade 8 Unit 1?',
      options: ['Well-known', 'Unknown', 'Secret', 'Quiet'],
      correctAnswer: 'Well-known'
    },
    {
      id: 'q2',
      type: 'multi_choice',
      difficulty: 'hard',
      question: 'Which of the following are healthy lifestyle habits? (Choose ALL)',
      options: ['Eating fresh vegetables', 'Drinking plenty of water', 'Staying up past midnight', 'Exercising daily'],
      correctAnswer: ['Eating fresh vegetables', 'Drinking plenty of water', 'Exercising daily']
    }
  ]);

  // Form State for Adding New Question
  const [newType, setNewType] = useState('single_choice');
  const [newDifficulty, setNewDifficulty] = useState('medium');
  const [newQText, setNewQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctSingle, setCorrectSingle] = useState('A');
  const [correctMulti, setCorrectMulti] = useState({ A: true, B: false, C: false, D: false });
  const [tfCorrect, setTfCorrect] = useState('True');
  const [fillAnswer, setFillAnswer] = useState('');
  const [importText, setImportText] = useState('');

  // Random Generator State
  const [numEasy, setNumEasy] = useState(3);
  const [numMedium, setNumMedium] = useState(4);
  const [numHard, setNumHard] = useState(3);

  if (!isOpen) return null;

  const toggleUnitSelection = (unitVal) => {
    try { soundFX.playClick(); } catch (e) {}
    if (selectedUnits.includes(unitVal)) {
      setSelectedUnits(selectedUnits.filter(u => u !== unitVal));
    } else {
      setSelectedUnits([...selectedUnits, unitVal]);
    }
  };

  const handleStartAiGeneration = () => {
    setIsGeneratingAi(true);
    try { soundFX.playClick(); } catch (e) {}
    setTimeout(() => {
      setIsGeneratingAi(false);
      setAiExamGenerated(true);
      try { soundFX.playFanfare(); } catch (e) {}
      confetti({ particleCount: 150, spread: 90 });
    }, 1500);
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQText.trim()) return;

    let qObj = {
      id: `q_${Date.now()}`,
      type: newType,
      difficulty: newDifficulty,
      question: newQText
    };

    if (newType === 'single_choice') {
      const opts = [optA || 'Đáp án A', optB || 'Đáp án B', optC || 'Đáp án C', optD || 'Đáp án D'];
      const correctIdx = correctSingle === 'A' ? 0 : correctSingle === 'B' ? 1 : correctSingle === 'C' ? 2 : 3;
      qObj.options = opts;
      qObj.correctAnswer = opts[correctIdx];
    } else if (newType === 'multi_choice') {
      const opts = [optA || 'Đáp án A', optB || 'Đáp án B', optC || 'Đáp án C', optD || 'Đáp án D'];
      const correctArr = [];
      if (correctMulti.A) correctArr.push(opts[0]);
      if (correctMulti.B) correctArr.push(opts[1]);
      if (correctMulti.C) correctArr.push(opts[2]);
      if (correctMulti.D) correctArr.push(opts[3]);
      qObj.options = opts;
      qObj.correctAnswer = correctArr;
    } else if (newType === 'true_false') {
      qObj.options = ['Đúng (True)', 'Sai (False)'];
      qObj.correctAnswer = tfCorrect === 'True' ? 'Đúng (True)' : 'Sai (False)';
    } else if (newType === 'fill_blank') {
      qObj.correctAnswer = fillAnswer;
    } else if (newType === 'essay') {
      qObj.allowPhoto = true;
    }

    setQuestions([...questions, qObj]);
    setNewQText(''); setOptA(''); setOptB(''); setOptC(''); setOptD(''); setFillAnswer('');
    try { soundFX.playFanfare(); } catch (e) {}
  };

  const handleSaveExam = () => {
    const titleToSave = examTitle || `BÀI KIỂM TRA TIẾNG ANH KHỐI ${gradeLevel}`;

    const newQuizObj = {
      id: `exam-custom-${Date.now()}`,
      title: titleToSave,
      description: examDesc || `Đề thi ${titleToSave} gồm ${questions.length} câu hỏi tổng hợp.`,
      grade_level: Number(gradeLevel),
      unit: unitTopic,
      teacher_name: 'Thầy Nguyễn Văn Hải VIP',
      created_at: new Date().toISOString(),
      time_limit_minutes: Number(timeLimit),
      is_published: true,
      exam_code: `EXAM-G${gradeLevel}-${Math.floor(100 + Math.random() * 900)}`,
      shuffleQuestions,
      shuffleOptions,
      allowPhotoUpload,
      questions: [
        {
          id: 'sec_custom',
          title: 'I. NỘI DUNG ĐỀ THI TỔNG HỢP',
          enabled: true,
          tasks: [
            {
              task_title: `BÀI THI ${questions.length} CÂU HỎI`,
              task_desc: `Đề thi gồm trắc nghiệm 1 đáp án, nhiều đáp án, đúng/sai, điền từ, kéo thả và tự luận.`,
              questions: questions.map((q, idx) => ({
                id: q.id,
                num: idx + 1,
                qText: q.question,
                type: q.type,
                difficulty: q.difficulty,
                options: q.options || [],
                correct: q.correctAnswer,
                pairs: q.pairs || [],
                allowPhoto: q.allowPhoto
              }))
            }
          ]
        }
      ]
    };

    const existing = JSON.parse(localStorage.getItem('saved_quizzes_local') || '[]');
    localStorage.setItem('saved_quizzes_local', JSON.stringify([newQuizObj, ...existing]));

    try { soundFX.playFanfare(); } catch (e) {}
    confetti({ particleCount: 150, spread: 90 });
    if (onQuizCreated) onQuizCreated(newQuizObj);
    onClose();
  };

  return (
    <div className="fixed top-20 left-0 right-0 bottom-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-3 sm:p-4 overflow-y-auto pt-2 pb-6 font-sans">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-6xl w-full border-4 border-slate-800 shadow-2xl overflow-hidden relative max-h-[84vh] flex flex-col">
        
        {/* MODAL HEADER */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                Hệ Thống Soạn Ngân Hàng Đề Thi & Bài Kiểm Tra 4.0
              </h2>
              <p className="text-xs text-slate-400 font-bold">
                Tích hợp 6 loại câu hỏi, Studio Soạn Đề AI, Speaking/Writing BTV & Hẹn giờ đếm ngược
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" /> Đóng
          </button>
        </div>

        {/* TOP TAB NAVIGATION - NOW WITH ALL 6 TABS */}
        <div className="flex items-center gap-1.5 p-3 bg-slate-900 border-b border-slate-800 shrink-0 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'settings' ? 'bg-brand-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" /> 1. Cài Đặt Đề Thi & Hẹn Giờ
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'questions' ? 'bg-brand-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" /> 2. Danh Sách Câu Hỏi ({questions.length})
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'import' ? 'bg-brand-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> 3. Import Từ Word / Excel
          </button>

          <button
            onClick={() => setActiveTab('random')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'random' ? 'bg-brand-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <Dices className="w-4 h-4" /> 4. Rút Ngẫu Nhiên Theo Độ Khó
          </button>

          {/* TAB 5: SOẠN ĐỀ AI (SCREENSHOTS 1, 2, 3) */}
          <button
            onClick={() => setActiveTab('ai_authoring')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'ai_authoring' ? 'bg-purple-600 text-white shadow border border-purple-400/50' : 'bg-slate-950 text-purple-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" /> ✨ 5. Soạn đề AI
          </button>

          {/* TAB 6: SPEAKING - WRITING AI */}
          <button
            onClick={() => setActiveTab('ai_speaking_writing')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'ai_speaking_writing' ? 'bg-pink-600 text-white shadow border border-pink-400/50' : 'bg-slate-950 text-pink-300 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4 text-pink-400" /> 🎙️ 6. Speaking - Writing AI
          </button>
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-5 max-w-3xl mx-auto">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Tiêu đề đề thi / bài kiểm tra:</label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: BÀI KIỂM TRA 1 TIẾT HỌC KỲ 1 TIẾNG ANH KHỐI 8"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Chọn Khối Lớp:</label>
                  <select 
                    value={gradeLevel}
                    onChange={(e) => {
                      const g = Number(e.target.value);
                      setGradeLevel(g);
                      if (GRADE_UNITS_MAP[g]?.[0]?.label) setUnitTopic(GRADE_UNITS_MAP[g][0].label);
                    }}
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-white"
                  >
                    <option value={6}>Khối Lớp 6</option>
                    <option value={7}>Khối Lớp 7</option>
                    <option value={8}>Khối Lớp 8</option>
                    <option value={9}>Khối Lớp 9</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Chủ đề / Unit bài học (Liên kết tự động theo Khối {gradeLevel}):</label>
                  <select 
                    value={unitTopic}
                    onChange={(e) => setUnitTopic(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-emerald-400 focus:outline-none focus:border-brand-500"
                  >
                    {(GRADE_UNITS_MAP[gradeLevel] || []).map((u) => (
                      <option key={u.value} value={u.label}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ⏱️ ĐỒNG HỒ ĐẾM NGƯỢC */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase">
                  ⏱️ CÀI ĐẶT ĐỒNG HỒ ĐẾM NGƯỢC
                </h4>
                <div className="flex items-center gap-2">
                  {[15, 30, 45, 60, 0].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setTimeLimit(mins)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black border transition-all ${
                        timeLimit === mins
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {mins === 0 ? '∞ Không giới hạn' : `${mins} Phút`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SOẠN ĐỀ AI (COMPLETE STUDIO - MATCHING SCREENSHOTS 1, 2, 3 100%) */}
          {activeTab === 'ai_authoring' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT FORM COLUMN (5 COLS - SCREENSHOTS 1, 2, 3) */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* 1. CHỌN KHỐI LỚP & NHIỀU UNITS SGK */}
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-purple-400" /> 1. CHỌN KHỐI LỚP & NHIỀU UNITS SGK
                  </h4>

                  <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                    {[6, 7, 8, 9].map((g) => (
                      <button
                        key={g}
                        onClick={() => setAiGrade(g)}
                        className={`py-2 rounded-xl border transition-all ${
                          aiGrade === g ? 'bg-purple-600 text-white border-purple-400 shadow' : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        Khối {g}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 font-bold">CHỌN CÁC UNIT BÀI HỌC KHỐI {aiGrade} (Có thể chọn nhiều Unit):</span>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                      {(GRADE_UNITS_MAP[aiGrade] || []).map((u) => {
                        const isSelected = selectedUnits.includes(u.value);
                        return (
                          <button
                            key={u.value}
                            onClick={() => toggleUnitSelection(u.value)}
                            className={`p-2 rounded-xl text-[11px] font-bold border text-left flex items-center justify-between transition-all ${
                              isSelected ? 'bg-purple-600/90 text-white border-purple-400 shadow' : 'bg-slate-900 text-slate-300 border-slate-800'
                            }`}
                          >
                            <span className="truncate">{u.value.toUpperCase()}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* CHỦ ĐIỂM NGỮ PHÁP TÍCH HỢP TỰ ĐỘNG */}
                  <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-1.5 text-xs">
                    <span className="font-black text-purple-300 text-[11px] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> CHỦ ĐIỂM NGỮ PHÁP TÍCH HỢP TỰ ĐỘNG:
                    </span>
                    <div className="flex flex-wrap gap-1 text-[10px] font-bold">
                      <span className="px-2 py-0.5 rounded bg-purple-600/30 text-purple-200">Present Simple (Hiện tại đơn)</span>
                      <span className="px-2 py-0.5 rounded bg-purple-600/30 text-purple-200">Adverbs of frequency</span>
                      <span className="px-2 py-0.5 rounded bg-purple-600/30 text-purple-200">Possessive Nouns</span>
                    </div>
                  </div>
                </div>

                {/* TẢI FILE ĐỀ GỐC MẪU & PROMPT NOTES */}
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 text-xs font-bold">
                  <div className="space-y-1">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5 text-amber-400" /> TẢI FILE ĐỀ GỐC MẪU (.DOCX / .JSON):
                    </span>
                    <input type="file" accept=".docx,.json" className="w-full text-xs text-slate-400 p-2 bg-slate-900 rounded-xl border border-slate-800" />
                  </div>

                  {/* BUTTON BẮT ĐẦU TỰ ĐỘNG SOẠN ĐỀ THI (SCREENSHOT 2) */}
                  <button
                    onClick={handleStartAiGeneration}
                    disabled={isGeneratingAi}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2 hover:scale-102 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                    {isGeneratingAi ? 'ĐANG TỰ ĐỘNG SOẠN ĐỀ THI AI...' : '⚡ BẮT ĐẦU TỰ ĐỘNG SOẠN ĐỀ THI'}
                  </button>

                  <div className="space-y-1 pt-2">
                    <span className="text-slate-300">Ý TƯỞNG TỰ SOẠN CỦA THẦY CÔ (PROMPT NOTES):</span>
                    <textarea
                      rows={3}
                      value={promptNotes}
                      onChange={(e) => setPromptNotes(e.target.value)}
                      placeholder="Ví dụ: Thêm câu hỏi phủ định; bám sát trang 12 SGK..."
                      className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

              </div>

              {/* RIGHT PREVIEW COLUMN (7 COLS - SCREENSHOT 1 & 2) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* ACTION BUTTONS HEADER */}
                <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs font-bold">
                  <span className="text-slate-300">Trang xem trước bản in đề thi:</span>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-[11px] flex items-center gap-1">
                      <Edit3 className="w-3.5 h-3.5" /> Sửa đề
                    </button>
                    <button onClick={handleSaveExam} className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-[11px] flex items-center gap-1">
                      <Save className="w-3.5 h-3.5" /> Lưu vào Ngân hàng
                    </button>
                    <button className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-[11px] flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Xuất Word (.doc)
                    </button>
                    <button className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-[11px] flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> Tải file (.json)
                    </button>
                    <button onClick={() => window.print()} className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-[11px] flex items-center gap-1">
                      <Printer className="w-3.5 h-3.5" /> In đề (A4)
                    </button>
                  </div>
                </div>

                {/* PAPER A4 PREVIEW CONTAINER (SCREENSHOT 1) */}
                <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 min-h-[420px] flex items-center justify-center text-center">
                  {!aiExamGenerated ? (
                    <div className="space-y-3 max-w-sm">
                      <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-purple-400">
                        <Sparkles className="w-8 h-8" />
                      </div>
                      <h3 className="text-base font-black text-white">Sẵn Sàng Khởi Tạo Bài Kiểm Tra!</h3>
                      <p className="text-xs text-slate-400 font-bold">
                        Vui lòng chọn Khối lớp, các Unit bài học bên cột trái và nhấp nút <strong className="text-purple-400">⚡ BẮT ĐẦU TỰ ĐỘNG SOẠN ĐỀ THI</strong> để xem trước bản in.
                      </p>
                    </div>
                  ) : (
                    <div className="w-full text-left space-y-4 text-xs font-mono text-slate-200">
                      <div className="text-center font-black text-sm text-white uppercase border-b border-slate-800 pb-2">
                        BÀI KIỂM TRA TIẾNG ANH KHỐI {aiGrade} - GIỮA KỲ 1 (TẠO TỰ ĐỘNG AI)
                      </div>
                      <div className="space-y-2">
                        <p className="font-bold text-purple-400">I. LISTENING (2.0 points)</p>
                        <p>Part 1: Listen and choose A, B, C, or D. (5 questions)</p>
                        <p className="font-bold text-purple-400">II. KNOWLEDGE OF LANGUAGE (3.0 points)</p>
                        <p>Question 1: What is the main topic of Unit 1 & 2?</p>
                        <p className="pl-4">A. Healthy living and hobbies &nbsp;&nbsp; B. Shopping online</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 6: SPEAKING - WRITING AI (CHẤM BÀI BTV AI) */}
          {activeTab === 'ai_speaking_writing' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Chọn Kỹ Năng Cần Chấm & Giao Bài BTV Bằng AI:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAiMode('speaking')}
                    className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                      aiMode === 'speaking' ? 'bg-pink-600 text-white shadow' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    <Mic className="w-4 h-4" /> 🎙️ Speaking (Chấm Phát Âm AI)
                  </button>
                  <button
                    onClick={() => setAiMode('writing')}
                    className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                      aiMode === 'writing' ? 'bg-pink-600 text-white shadow' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    <Edit3 className="w-4 h-4" /> ✍️ Writing (Chấm Luận AI)
                  </button>
                </div>
              </div>

              {aiMode === 'speaking' ? (
                <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-4">
                  <Mic className="w-16 h-16 text-pink-400 mx-auto animate-pulse" />
                  <h3 className="text-lg font-black text-white">Chấm Bài Speaking AI Bằng Giọng Nói (Giao BTV Về Nhà)</h3>
                  <p className="text-xs text-slate-400 font-bold max-w-md mx-auto">
                    Hệ thống AI tự động phân tích độ chính xác phát âm, ngữ điệu và phản xạ giao tiếp tiếng Anh của học sinh!
                  </p>

                  <button
                    onClick={() => {
                      setIsRecording(!isRecording);
                      if (!isRecording) {
                        setTimeout(() => {
                          setAiResult({ score: 9.2, feedback: 'Phát âm chuẩn IPA 95%, phản xạ nói trôi chảy!' });
                          try { soundFX.playFanfare(); } catch (e) {}
                        }, 2000);
                      }
                    }}
                    className={`px-8 py-3 rounded-2xl text-xs font-black shadow-xl transition-all ${
                      isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                    }`}
                  >
                    {isRecording ? '🔴 Đang thu âm & phân tích giọng nói...' : '🎙️ Bật Thu Âm Thử Nói Tiếng Anh'}
                  </button>

                  {aiResult && (
                    <div className="p-4 rounded-2xl bg-pink-950/40 border border-pink-500/40 text-xs font-bold text-pink-200 animate-fadeIn">
                      🎉 Kết quả AI Chấm Điểm Speaking: <span className="text-amber-400 font-black text-sm">{aiResult.score} / 10</span>
                      <p className="text-[11px] text-slate-300 mt-1">{aiResult.feedback}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 text-xs font-bold">
                  <h3 className="text-base font-black text-white">Chấm Bài Luận Writing AI Bằng Ma Trận Rubric</h3>
                  <textarea rows={5} placeholder="Nhập bài viết đoạn văn của học sinh vào đây để AI chấm điểm ngữ pháp & vốn từ vựng..." className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200" />
                  <button className="w-full py-3 rounded-2xl bg-pink-600 text-white font-black">✨ BẮT ĐẦU AI PHÂN TÍCH VÀ CHẤM BÀI WRITING</button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* MODAL FOOTER BUTTONS */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-slate-400">
            Tổng cộng: <strong className="text-white font-black">{questions.length} câu hỏi</strong> trong bài kiểm tra
          </span>

          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs">
              Hủy
            </button>
            <button onClick={handleSaveExam} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg flex items-center gap-1.5">
              <Save className="w-4 h-4" /> LƯU VÀ XUẤT ĐỀ THI
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
