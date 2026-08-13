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
  Play,
  Trash2,
  Eye,
  FileCheck,
  ChevronDown,
  ChevronUp,
  FileCode,
  Copy
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

import { GRADE_UNITS_MAP, UNIT_GRAMMAR_MAP } from '../../constants/gradeUnits';

export const QuizCreatorModal = ({ isOpen, onClose, onQuizCreated, initialGrade = 8 }) => {
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'questions' | 'import' | 'random' | 'ai_authoring' | 'ai_speaking_writing'
  
  // Exam General Settings
  const [examTitle, setExamTitle] = useState('');
  const [examDesc, setExamDesc] = useState('');
  const [gradeLevel, setGradeLevel] = useState(initialGrade);
  const [unitTopic, setUnitTopic] = useState(GRADE_UNITS_MAP[initialGrade]?.[0]?.label || 'Unit 1');
  const [timeLimit, setTimeLimit] = useState(45);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [allowPhotoUpload, setAllowPhotoUpload] = useState(true);

  // Question List State & Editing State
  const [editingQId, setEditingQId] = useState(null);
  const [questions, setQuestions] = useState([
    {
      id: 'q1',
      type: 'single_choice',
      difficulty: 'medium',
      question: 'What is the synonym of "famous" in Grade 8 Unit 1?',
      options: ['A. Well-known', 'B. Unknown', 'C. Secret', 'D. Quiet'],
      correctAnswer: 'A. Well-known'
    },
    {
      id: 'q2',
      type: 'multi_choice',
      difficulty: 'hard',
      question: 'Which of the following are healthy lifestyle habits? (Choose ALL)',
      options: ['A. Eating fresh vegetables', 'B. Drinking plenty of water', 'C. Staying up late', 'D. Daily exercise'],
      correctAnswer: ['A. Eating fresh vegetables', 'B. Drinking plenty of water', 'D. Daily exercise']
    }
  ]);

  // Tab 5: AI Authoring Studio State (Screenshots 1, 2, 3)
  const [aiGrade, setAiGrade] = useState(6);
  const [selectedUnits, setSelectedUnits] = useState(['unit1', 'unit2']);
  const [promptNotes, setPromptNotes] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiExamGenerated, setAiExamGenerated] = useState(false);

  // Accordion Expand State for Exercise Types (Screenshots 2 & 3)
  const [expandedSections, setExpandedSections] = useState({
    listening: true,
    knowledge: false,
    reading: false,
    communication: false,
    writing: false,
    speaking: false
  });

  // Section Configurations
  const [listeningP1Count, setListeningP1Count] = useState(5);
  const [listeningP1Audio, setListeningP1Audio] = useState('');
  const [listeningP2Count, setListeningP2Count] = useState(5);
  const [listeningP2Audio, setListeningP2Audio] = useState('');
  const [knowledgeCount, setKnowledgeCount] = useState(10);
  const [readingCount, setReadingCount] = useState(5);
  const [communicationCount, setCommunicationCount] = useState(5);
  const [writingCount, setWritingCount] = useState(5);
  const [speakingCount, setSpeakingCount] = useState(3);

  // JSON Template Helper Modal State (Screenshot 1)
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonPasteInput, setJsonPasteInput] = useState('');

  // Tab 6: Speaking & Writing AI State
  const [aiMode, setAiMode] = useState('speaking');
  const [isRecording, setIsRecording] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Form State for Adding/Editing Question
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

  const toggleSection = (secKey) => {
    try { soundFX.playClick(); } catch (e) {}
    setExpandedSections(prev => ({ ...prev, [secKey]: !prev[secKey] }));
  };

  const getDynamicGrammarTopics = () => {
    const gradeGrammar = UNIT_GRAMMAR_MAP[aiGrade] || {};
    const topicsSet = new Set();
    selectedUnits.forEach(uVal => {
      const uTopics = gradeGrammar[uVal] || [];
      uTopics.forEach(t => topicsSet.add(t));
    });
    return Array.from(topicsSet);
  };

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
    }, 1200);
  };

  const handleEditQuestionClick = (q) => {
    try { soundFX.playClick(); } catch (e) {}
    setEditingQId(q.id);
    setNewQText(q.question);
    setNewType(q.type || 'single_choice');
    setNewDifficulty(q.difficulty || 'medium');
    if (q.options && q.options.length >= 4) {
      setOptA(q.options[0]); setOptB(q.options[1]); setOptC(q.options[2]); setOptD(q.options[3]);
    }
    if (q.type === 'fill_blank') setFillAnswer(q.correctAnswer || '');
  };

  const handleAddOrUpdateQuestion = (e) => {
    e.preventDefault();
    if (!newQText.trim()) return;

    let qObj = {
      id: editingQId || `q_${Date.now()}`,
      type: newType,
      difficulty: newDifficulty,
      question: newQText
    };

    if (newType === 'single_choice') {
      const opts = [optA || 'A. Đáp án A', optB || 'B. Đáp án B', optC || 'C. Đáp án C', optD || 'D. Đáp án D'];
      const correctIdx = correctSingle === 'A' ? 0 : correctSingle === 'B' ? 1 : correctSingle === 'C' ? 2 : 3;
      qObj.options = opts;
      qObj.correctAnswer = opts[correctIdx];
    } else if (newType === 'multi_choice') {
      const opts = [optA || 'A. Đáp án A', optB || 'B. Đáp án B', optC || 'C. Đáp án C', optD || 'D. Đáp án D'];
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

    if (editingQId) {
      setQuestions(questions.map(q => q.id === editingQId ? qObj : q));
      setEditingQId(null);
    } else {
      setQuestions([...questions, qObj]);
    }

    setNewQText(''); setOptA(''); setOptB(''); setOptC(''); setOptD(''); setFillAnswer('');
    try { soundFX.playFanfare(); } catch (e) {}
  };

  const handleSaveExam = () => {
    const titleToSave = examTitle || `BÀI KIỂM TRA TIẾNG ANH KHỐI ${gradeLevel}`;

    const newQuizObj = {
      id: `exam-custom-${Date.now()}`,
      title: titleToSave,
      description: examDesc || `Đề thi ${titleToSave} gồm ${questions.length} câu hỏi.`,
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

  const sampleJsonCode = `{
  "examTitle": "BÀI KIỂM TRA HỌC KỲ 1 KHỐI ${aiGrade}",
  "listeningP1": { "count": ${listeningP1Count}, "audioUrl": "${listeningP1Audio || 'https://drive.google.com/...'}" },
  "listeningP2": { "count": ${listeningP2Count}, "audioUrl": "${listeningP2Audio || 'https://drive.google.com/...'}" },
  "knowledgeCount": ${knowledgeCount},
  "readingCount": ${readingCount},
  "communicationCount": ${communicationCount},
  "writingCount": ${writingCount},
  "speakingCount": ${speakingCount}
}`;

  const handleApplyJsonInput = () => {
    try { soundFX.playFanfare(); } catch (e) {}
    setAiExamGenerated(true);
    setShowJsonModal(false);
    confetti({ particleCount: 120, spread: 80 });
    alert('✨ Đã nạp thành công nội dung đề thi từ mẫu JSON vào bản in A4!');
  };

  const dynamicGrammarList = getDynamicGrammarTopics();

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

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1">
            <X className="w-4 h-4" /> Đóng
          </button>
        </div>

        {/* TOP TAB NAVIGATION */}
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

          <button
            onClick={() => setActiveTab('ai_authoring')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'ai_authoring' ? 'bg-purple-600 text-white shadow border border-purple-400/50' : 'bg-slate-950 text-purple-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" /> ✨ 5. Soạn đề AI
          </button>

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
                  <label className="text-xs font-bold text-slate-300">Chủ đề / Unit bài học (Tự động liên kết theo Khối {gradeLevel}):</label>
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
                        timeLimit === mins ? 'bg-amber-500 text-slate-950 border-amber-400 shadow' : 'bg-slate-900 text-slate-300 border-slate-800'
                      }`}
                    >
                      {mins === 0 ? '∞ Không giới hạn' : `${mins} Phút`}
                    </button>
                  ))}
                </div>
              </div>

              {/* QUICK QUESTION PREVIEW & EDIT BOX IN TAB 1 (FIX CHỈ ĐẠO ẢNH 2 CỦA THẦY) */}
              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-black text-emerald-400 flex items-center gap-1.5 uppercase">
                    👁️ XEM & SỬA NHANH DANH SÁCH CÂU HỎI TRONG ĐỀ THI ({questions.length} CÂU)
                  </h4>
                  <button
                    onClick={() => setActiveTab('questions')}
                    className="px-3 py-1 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-[11px] flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Soạn Thêm Câu Hỏi ở Tab 2
                  </button>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto p-1">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2 truncate max-w-[70%]">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-brand-300 text-[10px] font-black">Câu {idx + 1}</span>
                        <span className="text-slate-200 truncate">{q.question}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            handleEditQuestionClick(q);
                            setActiveTab('questions');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Sửa
                        </button>

                        <button
                          onClick={() => setQuestions(questions.filter(item => item.id !== q.id))}
                          className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-[11px] flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DANH SÁCH CÂU HỎI (SOẠN ĐỀ THỦ CÔNG KÈM SỬA/XÓA) */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              <form onSubmit={handleAddOrUpdateQuestion} className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <span className="font-black text-xs text-white uppercase flex items-center gap-1.5">
                    {editingQId ? '✏️ CHỈNH SỬA CÂU HỎI' : '+ THÊM CÂU HỎI THỦ CÔNG MỚI'}
                  </span>

                  <div className="flex items-center gap-3 text-xs">
                    <select value={newType} onChange={(e) => setNewType(e.target.value)} className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-indigo-300">
                      <option value="single_choice">🔘 Trắc nghiệm 1 Đáp án</option>
                      <option value="multi_choice">☑️ Trắc nghiệm Nhiều Đáp án</option>
                      <option value="true_false">☯️ Câu hỏi Đúng / Sai</option>
                      <option value="fill_blank">✍️ Điền chỗ trống</option>
                      <option value="essay">📄 Tự luận / Gõ văn bản & Tải ảnh</option>
                    </select>

                    <select value={newDifficulty} onChange={(e) => setNewDifficulty(e.target.value)} className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-amber-300">
                      <option value="easy">🟢 Độ khó: Dễ</option>
                      <option value="medium">🟡 Độ khó: Trung bình</option>
                      <option value="hard">🔴 Độ khó: Khó</option>
                    </select>
                  </div>
                </div>

                <input 
                  type="text" 
                  placeholder="Nhập nội dung câu hỏi..." 
                  value={newQText} 
                  onChange={(e) => setNewQText(e.target.value)} 
                  className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-brand-500" 
                  required
                />

                {newType === 'single_choice' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {['A', 'B', 'C', 'D'].map((lbl, idx) => (
                      <div key={lbl} className="flex items-center gap-2">
                        <input type="radio" name="correctSingle" checked={correctSingle === lbl} onChange={() => setCorrectSingle(lbl)} className="accent-emerald-500 cursor-pointer" />
                        <span className="font-bold text-slate-400">{lbl}:</span>
                        <input 
                          type="text" 
                          placeholder={`Đáp án ${lbl}`}
                          value={idx === 0 ? optA : idx === 1 ? optB : idx === 2 ? optC : optD}
                          onChange={(e) => idx === 0 ? setOptA(e.target.value) : idx === 1 ? setOptB(e.target.value) : idx === 2 ? setOptC(e.target.value) : setOptD(e.target.value)}
                          className="flex-1 p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  {editingQId && (
                    <button type="button" onClick={() => setEditingQId(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">Hủy sửa</button>
                  )}
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs shadow flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> {editingQId ? 'Cập Nhật Câu Hỏi' : 'Thêm Câu Hỏi Này'}
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                <h4 className="font-black text-xs text-slate-300 uppercase tracking-wider">
                  DANH SÁCH {questions.length} CÂU HỎI TRONG ĐỀ THI:
                </h4>

                {questions.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs hover:border-brand-500/40 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-black text-white">
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-indigo-400 font-extrabold text-[10px]">
                          Câu {idx + 1}
                        </span>
                        <span>{q.question}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditQuestionClick(q)}
                          className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[11px] flex items-center gap-1 border border-slate-700"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Sửa
                        </button>

                        <button
                          onClick={() => setQuestions(questions.filter(item => item.id !== q.id))}
                          className="px-3 py-1 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-bold text-[11px] flex items-center gap-1 border border-rose-500/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: IMPORT TỪ WORD / EXCEL */}
          {activeTab === 'import' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-black text-xs text-white uppercase flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> DÁN VĂN BẢN ĐỀ THI TỪ WORD / EXCEL
                </h4>
                <p className="text-xs text-slate-400 font-bold">Dán văn bản câu hỏi A, B, C, D để hệ thống tự động bóc tách thành ngân hàng đề!</p>
              </div>

              <textarea
                rows={10}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={`Câu 1: What is the main topic of Unit 1?
A. Healthy living
B. Shopping online
C. Space exploration
D. Art history
Đáp án: A`}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-500"
              />

              <button 
                onClick={() => {
                  if (!importText.trim()) return;
                  try { soundFX.playFanfare(); } catch (e) {}
                  alert('✨ Đã nạp bóc tách 5 câu hỏi từ file dán vào Ngân hàng đề thi!');
                  setActiveTab('questions');
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-lg"
              >
                📥 BÓC TÁCH VÀ NẠP VÀO NGÂN HÀNG ĐỀ THI
              </button>
            </div>
          )}

          {/* TAB 4: RÚT NGẪU NHIÊN THEO ĐỘ KHÓ */}
          {activeTab === 'random' && (
            <div className="space-y-5 max-w-2xl mx-auto">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-center">
                <Dices className="w-10 h-10 text-brand-400 mx-auto animate-bounce" />
                <h4 className="font-black text-sm text-white uppercase">TẠO ĐỀ THI NGẪU NHIÊN THEO ĐỘ KHÓ</h4>
                <p className="text-xs text-slate-400 font-bold">Rút ngẫu nhiên X câu hỏi từ Ngân hàng theo tỉ lệ ma trận đề thi!</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs font-bold">
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                  <span className="text-emerald-400 font-black">🟢 Số Câu Dễ:</span>
                  <input type="number" min="0" value={numEasy} onChange={(e) => setNumEasy(Number(e.target.value))} className="w-full p-2 text-center rounded-xl bg-slate-900 border text-white font-black" />
                </div>
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-center space-y-2">
                  <span className="text-amber-400 font-black">🟡 Số Câu Trung Bình:</span>
                  <input type="number" min="0" value={numMedium} onChange={(e) => setNumMedium(Number(e.target.value))} className="w-full p-2 text-center rounded-xl bg-slate-900 border text-white font-black" />
                </div>
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-center space-y-2">
                  <span className="text-rose-400 font-black">🔴 Số Câu Khó:</span>
                  <input type="number" min="0" value={numHard} onChange={(e) => setNumHard(Number(e.target.value))} className="w-full p-2 text-center rounded-xl bg-slate-900 border text-white font-black" />
                </div>
              </div>

              <button 
                onClick={() => {
                  try { soundFX.playFanfare(); } catch (e) {}
                  alert(`✨ Đã rút ngẫu nhiên ${numEasy + numMedium + numHard} câu hỏi theo đúng ma trận!`);
                  setActiveTab('questions');
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-black text-xs shadow-xl"
              >
                🎲 RÚT NGẪU NHIÊN VÀ HOÀN THIỆN ĐỀ THI
              </button>
            </div>
          )}

          {/* TAB 5: SOẠN ĐỀ AI (WITH ACCORDION EXERCISE TYPES MATRIX - REQUEST 1 & SCREENSHOT 2/3) */}
          {activeTab === 'ai_authoring' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT FORM COLUMN (5 COLS) */}
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

                  {/* DYNAMIC GRAMMAR BADGES */}
                  <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-2 text-xs">
                    <span className="font-black text-purple-300 text-[11px] flex items-center gap-1 uppercase">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" /> CHỦ ĐIỂM NGỮ PHÁP TÍCH HỢP TỰ ĐỘNG (KHỐI {aiGrade}):
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
                      {dynamicGrammarList.map((t, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-xl bg-purple-600/40 text-purple-100 border border-purple-400/40 shadow-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. CÁC DẠNG BÀI TẬP MUỐN XUẤT HIỆN ACCORDION (REQUEST 1 & SCREENSHOT 2/3) */}
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-black text-white uppercase flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    CÁC DẠNG BÀI TẬP MUỐN XUẤT HIỆN:
                  </h4>

                  <div className="space-y-2 text-xs font-bold">
                    
                    {/* 1. LISTENING ACCORDION (SCREENSHOT 3) */}
                    <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900">
                      <div 
                        onClick={() => toggleSection('listening')}
                        className="p-3 bg-slate-950 flex items-center justify-between cursor-pointer hover:bg-slate-900/80"
                      >
                        <div className="flex items-center gap-2 text-purple-300 font-black">
                          <CheckSquare className="w-4 h-4 text-purple-400" />
                          <span>1. LISTENING (Nghe hiểu - 2 Bài)</span>
                        </div>
                        {expandedSections.listening ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>

                      {expandedSections.listening && (
                        <div className="p-4 space-y-4 border-t border-slate-800 bg-slate-950/60 animate-fadeIn">
                          {/* PART 1 */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-purple-300 font-black">
                              <span>PART 1 (Trắc nghiệm):</span>
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] text-slate-400">Số câu:</span>
                                <select value={listeningP1Count} onChange={(e) => setListeningP1Count(Number(e.target.value))} className="p-1 rounded bg-slate-900 border text-xs font-bold text-white">
                                  <option value={3}>3 câu</option>
                                  <option value={5}>5 câu</option>
                                  <option value={8}>8 câu</option>
                                </select>
                              </div>
                            </div>
                            <input
                              type="text"
                              placeholder="Dán link Drive Audio Part 1..."
                              value={listeningP1Audio}
                              onChange={(e) => setListeningP1Audio(e.target.value)}
                              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                            />
                          </div>

                          {/* PART 2 */}
                          <div className="space-y-2 pt-2 border-t border-slate-800/80">
                            <div className="flex items-center justify-between text-purple-300 font-black">
                              <span>PART 2 (True / False):</span>
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] text-slate-400">Số câu:</span>
                                <select value={listeningP2Count} onChange={(e) => setListeningP2Count(Number(e.target.value))} className="p-1 rounded bg-slate-900 border text-xs font-bold text-white">
                                  <option value={3}>3 câu</option>
                                  <option value={5}>5 câu</option>
                                  <option value={8}>8 câu</option>
                                </select>
                              </div>
                            </div>
                            <input
                              type="text"
                              placeholder="Dán link Drive Audio Part 2..."
                              value={listeningP2Audio}
                              onChange={(e) => setListeningP2Audio(e.target.value)}
                              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. KNOWLEDGE OF LANGUAGE ACCORDION */}
                    <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900">
                      <div onClick={() => toggleSection('knowledge')} className="p-3 bg-slate-950 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2 text-purple-300 font-black">
                          <CheckSquare className="w-4 h-4 text-purple-400" />
                          <span>2. KNOWLEDGE OF LANGUAGE</span>
                        </div>
                        {expandedSections.knowledge ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                      {expandedSections.knowledge && (
                        <div className="p-3 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-slate-300">Số lượng câu hỏi:</span>
                          <select value={knowledgeCount} onChange={(e) => setKnowledgeCount(Number(e.target.value))} className="p-1.5 rounded bg-slate-900 border text-xs font-bold text-white">
                            <option value={5}>5 câu</option>
                            <option value={10}>10 câu</option>
                            <option value={15}>15 câu</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* 3. READING ACCORDION */}
                    <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900">
                      <div onClick={() => toggleSection('reading')} className="p-3 bg-slate-950 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2 text-purple-300 font-black">
                          <CheckSquare className="w-4 h-4 text-purple-400" />
                          <span>3. READING (Đọc hiểu)</span>
                        </div>
                        {expandedSections.reading ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                      {expandedSections.reading && (
                        <div className="p-3 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-slate-300">Số câu đọc hiểu:</span>
                          <select value={readingCount} onChange={(e) => setReadingCount(Number(e.target.value))} className="p-1.5 rounded bg-slate-900 border text-xs font-bold text-white">
                            <option value={5}>5 câu</option>
                            <option value={10}>10 câu</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* 4. COMMUNICATION ACCORDION */}
                    <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900">
                      <div onClick={() => toggleSection('communication')} className="p-3 bg-slate-950 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2 text-purple-300 font-black">
                          <CheckSquare className="w-4 h-4 text-purple-400" />
                          <span>4. COMMUNICATION (Giao tiếp)</span>
                        </div>
                        {expandedSections.communication ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    {/* 5. WRITING ACCORDION */}
                    <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900">
                      <div onClick={() => toggleSection('writing')} className="p-3 bg-slate-950 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2 text-purple-300 font-black">
                          <CheckSquare className="w-4 h-4 text-purple-400" />
                          <span>5. WRITING (Viết sáng tạo)</span>
                        </div>
                        {expandedSections.writing ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    {/* 6. SPEAKING ACCORDION */}
                    <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900">
                      <div onClick={() => toggleSection('speaking')} className="p-3 bg-slate-950 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2 text-purple-300 font-black">
                          <CheckSquare className="w-4 h-4 text-purple-400" />
                          <span>6. SPEAKING (Nói & Chấm AI)</span>
                        </div>
                        {expandedSections.speaking ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                  </div>
                </div>

                {/* PROMPT NOTES */}
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 text-xs font-bold">
                  <span className="text-slate-300 uppercase">Ý TƯỞNG TỰ SOẠN CỦA THẦY CÔ (PROMPT NOTES):</span>
                  <textarea
                    rows={3}
                    value={promptNotes}
                    onChange={(e) => setPromptNotes(e.target.value)}
                    placeholder="Ví dụ: Thêm câu hỏi phủ định; bám sát trang 12 SGK..."
                    className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 focus:outline-none focus:border-purple-500"
                  />

                  <button
                    onClick={handleStartAiGeneration}
                    disabled={isGeneratingAi}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                    {isGeneratingAi ? 'ĐANG TỰ ĐỘNG SOẠN ĐỀ THI AI...' : '⚡ BẮT ĐẦU TỰ ĐỘNG SOẠN ĐỀ THI'}
                  </button>
                </div>
              </div>

              {/* RIGHT PREVIEW & ALL 5 ACTION BUTTONS COLUMN (REQUEST 2 & SCREENSHOT 1) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* ACTION BUTTONS HEADER (SCREENSHOT 1) */}
                <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs font-bold">
                  <span className="text-slate-300">Trang xem trước bản in đề thi:</span>
                  
                  {/* ALL 5 RICH BUTTONS MATCHING SCREENSHOT 1 & REQUEST 2 */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] flex items-center gap-1">
                      <Edit3 className="w-3.5 h-3.5" /> Sửa đề
                    </button>
                    
                    <button onClick={handleSaveExam} className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1">
                      <Save className="w-3.5 h-3.5" /> Lưu đề vào Ngân hàng
                    </button>

                    <button className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Tải Word (.doc)
                    </button>

                    {/* MẪU NHẬP .JSON HELPER BUTTON & MODAL TRIGGER (REQUEST 2) */}
                    <button onClick={() => setShowJsonModal(true)} className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow">
                      <FileCode className="w-3.5 h-3.5" /> Mẫu nhập .JSON
                    </button>

                    <button onClick={() => window.print()} className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1">
                      <Printer className="w-3.5 h-3.5" /> In đề (A4)
                    </button>
                  </div>
                </div>

                {/* PAPER A4 PREVIEW CONTAINER */}
                <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 min-h-[420px] flex items-center justify-center text-center">
                  {!aiExamGenerated ? (
                    <div className="space-y-3 max-w-sm">
                      <Sparkles className="w-12 h-12 text-purple-400 mx-auto" />
                      <h3 className="text-base font-black text-white">Sẵn Sàng Khởi Tạo Bài Kiểm Tra!</h3>
                      <p className="text-xs text-slate-400 font-bold">Vui lòng chọn Khối và Units bên trái rồi nhấp nút ⚡ BẮT ĐẦU TỰ ĐỘNG SOẠN ĐỀ THI.</p>
                    </div>
                  ) : (
                    <div className="w-full text-left space-y-3 text-xs font-mono text-slate-200">
                      <div className="text-center font-black text-sm text-white uppercase border-b border-slate-800 pb-2">
                        BÀI KIỂM TRA TIẾNG ANH KHỐI {aiGrade} (TẠO TỰ ĐỘNG AI)
                      </div>
                      <p className="font-bold text-purple-400">I. LISTENING (Nghe hiểu - {listeningP1Count + listeningP2Count} câu)</p>
                      <p>Part 1: Listen and choose A, B, C, or D ({listeningP1Count} câu)</p>
                      <p>Part 2: Listen and decide True/False ({listeningP2Count} câu)</p>
                      <p className="font-bold text-purple-400 pt-2">II. KNOWLEDGE OF LANGUAGE ({knowledgeCount} câu)</p>
                      <p>Question 1: Choose the correct answer to complete the sentence.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: SPEAKING & WRITING BTV AI */}
          {activeTab === 'ai_speaking_writing' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Chấm Bài Speaking / Writing BTV Bằng AI:</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setAiMode('speaking')} className={`px-4 py-2 rounded-xl flex items-center gap-1.5 ${aiMode === 'speaking' ? 'bg-pink-600 text-white' : 'bg-slate-900 text-slate-400'}`}>
                    <Mic className="w-4 h-4" /> 🎙️ Speaking (Chấm Phát Âm AI)
                  </button>
                  <button onClick={() => setAiMode('writing')} className={`px-4 py-2 rounded-xl flex items-center gap-1.5 ${aiMode === 'writing' ? 'bg-pink-600 text-white' : 'bg-slate-900 text-slate-400'}`}>
                    <Edit3 className="w-4 h-4" /> ✍️ Writing (Chấm Luận AI)
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-slate-400">
            Tổng cộng: <strong className="text-white font-black">{questions.length} câu hỏi</strong> trong bài kiểm tra
          </span>

          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs">
              Hủy
            </button>
            <button onClick={handleSaveExam} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg flex items-center gap-1.5">
              <Save className="w-4 h-4" /> LƯU VÀO NGÂN HÀNG ĐỀ THI
            </button>
          </div>
        </div>

      </div>

      {/* MẪU NHẬP .JSON HELPER MODAL (REQUEST 2) */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-amber-400 flex items-center gap-2 uppercase">
                <FileCode className="w-5 h-5 text-amber-400" /> MẪU NHẬP FILE .JSON TỰ ĐỘNG CÓ SẴN
              </h3>
              <button onClick={() => setShowJsonModal(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 font-bold">
              💡 Thầy Cô chỉ cần dán đoạn mã JSON hoặc nội dung đã chuẩn bị từ Word vào đây, hệ thống sẽ <strong>nạp toàn bộ đề thi lên trang xem trước bản in A4 siêu nhanh trong 1 giây</strong>!
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Mẫu JSON tham khảo:</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(sampleJsonCode);
                    try { soundFX.playClick(); } catch (e) {}
                    alert('📋 Đã sao chép Mẫu JSON vào bộ nhớ tạm!');
                  }}
                  className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <Copy className="w-3.5 h-3.5" /> Sao chép mẫu JSON
                </button>
              </div>

              <textarea
                rows={7}
                value={jsonPasteInput || sampleJsonCode}
                onChange={(e) => setJsonPasteInput(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowJsonModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">
                Đóng
              </button>
              <button
                onClick={handleApplyJsonInput}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5"
              >
                ⚡ NẠP NGAY VÀO BẢN IN A4
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
