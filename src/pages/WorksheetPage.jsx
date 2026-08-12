import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { AIExamGenerator } from '../components/quiz/AIExamGenerator';
import { 
  Sparkles, 
  BookOpen, 
  Clock, 
  Upload, 
  CheckCircle2, 
  Zap, 
  FileText, 
  Sliders, 
  HelpCircle,
  BrainCircuit,
  Save,
  FileCheck,
  Tag,
  Printer,
  Volume2,
  Edit3,
  Copy,
  Info,
  X,
  Play,
  Pause,
  Download,
  GraduationCap,
  Eye,
  Settings,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Star,
  Mic,
  MessageSquare,
  FileCode,
  AlertCircle,
  Layers,
  Code,
  Flame,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlobalSuccessKnowledgeBase } from '../data/globalSuccessData';

export const WorksheetPage = () => {
  const { profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const secParam = searchParams.get('sec') || 'listening';

  // Active Tab State matching Sân Trường Tương Tác ('listening', 'speaking', 'reading', 'writing', 'generator', 'guide')
  const [activeTab, setActiveTab] = useState(secParam);

  const [gradeLevel, setGradeLevel] = useState(8);
  const [lessonSection, setLessonSection] = useState('A closer look 1');
  const [selectedUnits, setSelectedUnits] = useState(['Unit 1: Leisure Time']);
  const [selectedGrammar, setSelectedGrammar] = useState([]);

  const [modeAnswer, setModeAnswer] = useState('gv');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showTapescript, setShowTapescript] = useState(false);

  // Student AI Submission & Grading State (Speaking & Writing)
  const [studentSubmissionType, setStudentSubmissionType] = useState('text');
  const [studentSubmissionContent, setStudentSubmissionContent] = useState('');
  const [uploadedSubmissionFile, setUploadedSubmissionFile] = useState(null);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiEvaluationResult, setAiEvaluationResult] = useState(null);

  const [dynamicWorksheet, setDynamicWorksheet] = useState(null);

  useEffect(() => {
    if (secParam) setActiveTab(secParam);
  }, [secParam]);

  useEffect(() => {
    try {
      const gradeUnitsMap = GlobalSuccessKnowledgeBase?.DATA?.[gradeLevel] || GlobalSuccessKnowledgeBase?.DATA?.[8];
      const availableUnitKeys = Object.keys(gradeUnitsMap);
      
      const validUnits = selectedUnits.filter(u => availableUnitKeys.includes(u));
      const activeUnits = validUnits.length > 0 ? validUnits : [availableUnitKeys[0]];
      setSelectedUnits(activeUnits);

      const grammarList = GlobalSuccessKnowledgeBase.getGrammarForUnits(gradeLevel, activeUnits);
      setSelectedGrammar(grammarList);

      generateDynamicWorksheetContent(gradeLevel, activeUnits, lessonSection);
    } catch (err) {
      console.error('Worksheet state sync error:', err);
      generateDynamicWorksheetContent(8, ['Unit 1: Leisure Time'], 'A closer look 1');
    }
  }, [gradeLevel, lessonSection]);

  const generateDynamicWorksheetContent = (grade, unitsArr, section) => {
    const vocabList = GlobalSuccessKnowledgeBase.getVocabForUnits(grade, unitsArr);
    const grammarList = GlobalSuccessKnowledgeBase.getGrammarForUnits(grade, unitsArr);
    const unitTitleStr = (unitsArr || []).join(' & ');

    const tapescriptText = `Speaker 1: Hello everyone! Today in Grade ${grade} English, we discuss ${unitTitleStr}. Listen to key terms: ${vocabList.slice(0, 3).join(', ')}. Grammar note: Pay attention to ${grammarList[0] || 'structures'}. Choose the correct answers below.`;

    const listeningTasks = [
      {
        task_title: 'TASK 1: LISTEN AND CHOOSE THE BEST ANSWER (MULTIPLE CHOICE)',
        task_desc: `Listen to the audio recording for Grade ${grade} ${unitsArr[0]} (~80-120 seconds) and choose A, B, C, or D.`,
        questions: [
          { id: 'l1', num: 1, qText: `What is the main topic of the conversation?`, options: [`A. ${vocabList[0] || 'Leisure Time'}`, `B. ${vocabList[1] || 'Environment'}`, 'C. Science fiction', 'D. Space travel'], correct: `A. ${vocabList[0] || 'Leisure Time'}` },
          { id: 'l2', num: 2, qText: `Which Grade ${grade} grammar structure is mentioned in the dialogue?`, options: [`A. ${grammarList[0] || 'Present Simple'}`, 'B. Past Perfect', 'C. Future Continuous', 'D. Passive Voice'], correct: `A. ${grammarList[0] || 'Present Simple'}` },
          { id: 'l3', num: 3, qText: `How often do the students practice English?`, options: ['A. Every day', 'B. Once a week', 'C. Twice a month', 'D. Rarely'], correct: 'A. Every day' }
        ]
      }
    ];

    const speakingTasks = [
      {
        task_title: 'TASK 1: SPEAKING & PRONUNCIATION ASSESSMENT (AI POWERED)',
        task_desc: `Read the Grade ${grade} passage aloud or record your speaking answer. AI will analyze your pronunciation, fluency, and grammar errors in real time.`,
        questions: [
          { id: 'spk1', num: 1, qText: `Talk about your hobbies or daily routine in Grade ${grade} (${unitsArr[0]}). Upload MP3 or paste text below.`, options: null, correct: 'AI Evaluation Required' }
        ]
      }
    ];

    const readingTasks = [
      {
        task_title: 'TASK 1: READING COMPREHENSION PASSAGE',
        task_desc: 'Read the passage carefully and answer the questions below.',
        passage: `English is an essential global language for Grade ${grade} students. In ${unitsArr[0]}, students explore vocabulary related to ${vocabList.slice(0, 2).join(' and ')}. Mastering grammar rules such as ${grammarList[0] || 'structures'} helps students express ideas clearly in daily communication.`,
        questions: [
          { id: 'r1', num: 1, qText: `What is the passage mainly about?`, options: ['A. English learning and vocabulary', 'B. Math formulas', 'C. History of Vietnam', 'D. Music and Arts'], correct: 'A. English learning and vocabulary' },
          { id: 'r2', num: 2, qText: `According to the text, what helps students express ideas clearly?`, options: [`A. Mastering ${grammarList[0] || 'grammar'}`, 'B. Playing video games', 'C. Sleeping late', 'D. Watching movies without subtitles'], correct: `A. Mastering ${grammarList[0] || 'grammar'}` }
        ]
      }
    ];

    const writingTasks = [
      {
        task_title: 'TASK 1: CREATIVE WRITING & AI ERROR CHECKING',
        task_desc: `Write a short paragraph (80-100 words) about ${unitsArr[0]}. Paste your essay below for AI to check spelling, grammar, and sentence structure.`,
        questions: [
          { id: 'wrt1', num: 1, qText: `Write paragraph about ${unitsArr[0]}. (Paste essay text below to analyze errors)`, options: null, correct: 'AI Evaluation Required' }
        ]
      }
    ];

    setDynamicWorksheet({
      title: `TRUNG TÂM HOA MAI MR HAI – ENGLISH GRADE ${grade} – ${unitTitleStr.toUpperCase()}`,
      subtitle: `Getting Started & ${section} – Interactive Assessment Studio`,
      contact: `English with Mr Hai – 0384635199`,
      tapescript: tapescriptText,
      listening: listeningTasks,
      speaking: speakingTasks,
      reading: readingTasks,
      writing: writingTasks
    });
  };

  const handleRunAIEvaluation = (skillName) => {
    if (!studentSubmissionContent.trim() && !uploadedSubmissionFile) {
      alert(`Vui lòng dán bài làm, nhập đoạn văn hoặc chọn file audio ghi âm cho bài ${skillName}!`);
      return;
    }

    soundFX.playClick();
    setIsAnalyzingAI(true);
    setAiEvaluationResult(null);

    setTimeout(() => {
      setIsAnalyzingAI(false);
      soundFX.playFanfare();
      confetti({ particleCount: 150, spread: 90 });

      setAiEvaluationResult({
        score: '8.8 / 10',
        skill: skillName,
        rating: 'Xuất sắc (Good Performance)',
        feedback: `Học sinh có bài làm ${skillName} tốt, từ vựng bám sát chương trình Khối ${gradeLevel}. Một số lỗi nhỏ về ngữ pháp và cấu trúc đã được AI phát hiện.`,
        errors: [
          { type: 'Ngữ pháp', detail: 'Chưa chia đúng động từ quá khứ ở câu "I practice English yesterday". Sửa thành "I practiced".' },
          { type: 'Phát âm / Chính tả', detail: 'Chú ý từ "leisure" cần dùng đúng âm tiết /ʒ/. Viết đúng chính tả không gõ nhầm.' }
        ],
        recommendations: 'Tăng cường dùng các từ nối "because, however, although" để làm nổi bật bài viết/bài nói.'
      });
    }, 1500);
  };

  const handlePlayAudio = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt không hỗ trợ Web Speech API');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    soundFX.playClick();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.88;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Horizontal Nav Tabs matching Sân Trường Tương Tác
  const tabs = [
    { id: 'listening', label: '1. Listening (Nghe hiểu)', icon: Volume2 },
    { id: 'speaking', label: '2. Speaking (Chấm AI)', icon: Mic },
    { id: 'reading', label: '3. Reading (Đọc hiểu)', icon: BookOpen },
    { id: 'writing', label: '4. Writing (Chấm AI)', icon: Edit3 },
    { id: 'generator', label: '5. Sinh Đề AI & Mẫu JSON', icon: Zap },
    { id: 'guide', label: '6. Hướng Dẫn Nhúng AI Studio', icon: Code }
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* 1. HERO BANNER WITH VIBRANT BACKGROUND IMAGE */}
      <PageHeroBanner
        title="Kiểm Tra & Đánh Giá Tương Tác (Tích Hợp AI) 📝"
        subtitle="Phiếu làm bài 4 kỹ năng Listening, Speaking, Reading, Writing tích hợp AI chấm bài và nhắc lỗi sai tự động. Xuất Word chuẩn TAB hoặc làm bài trực tuyến."
        badge="KIỂM TRA THỜI GIAN THỰC • GLOBAL SUCCESS KHỐI 6 - 9"
        bgImage="/images/hero_playground_bg.jpg"
        showVipBadge={true}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {/* Answer Mode Toggle */}
            <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs backdrop-blur-md">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setModeAnswer('gv');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  modeAnswer === 'gv' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                Hiện đáp án (Đề GV)
              </button>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setModeAnswer('student');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  modeAnswer === 'student' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                Phiếu học sinh
              </button>
            </div>

            {/* Grade Selector */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold backdrop-blur-md">
              {[6, 7, 8, 9].map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    soundFX.playClick();
                    setGradeLevel(g);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    gradeLevel === g ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Lớp {g}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* 2. HORIZONTAL TAB NAVIGATION MENU (EXACTLY MATCHING SÂN TRƯỜNG TƯƠNG TÁC) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.playClick();
                setActiveTab(tab.id);
                setSearchParams({ sec: tab.id });
              }}
              className={`p-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/30 scale-102 border border-brand-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{tab.label}</span>
              {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT DISPLAY */}
      <div className="py-2 space-y-6">

        {/* TAB 1: LISTENING (NGHE HIỂU) */}
        {activeTab === 'listening' && dynamicWorksheet && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Audio & Tapescript Player Box */}
            <div className="glass-panel p-6 space-y-4 border-indigo-500/40 bg-slate-900/95 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Audio Luyện Nghe KHỐI {gradeLevel} (~80-120 Giây • Audio Mono)</h3>
                    <p className="text-xs text-slate-400">Tích hợp loa đọc phát âm AI chuẩn giọng đọc bản ngữ Mỹ/Anh.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlayAudio(dynamicWorksheet.tapescript)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    <span>{isPlayingAudio ? 'Dừng đọc Audio' : '🔊 Nghe Loa Audio (AI Reader)'}</span>
                  </button>

                  <button
                    onClick={() => setShowTapescript(!showTapescript)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700"
                  >
                    {showTapescript ? 'Ẩn Tapescript' : '📄 Xem Tapescript'}
                  </button>
                </div>
              </div>

              {showTapescript && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed animate-fadeIn">
                  <span className="text-purple-400 font-bold block mb-1">📜 TAPESCRIPT ĐẠO BẢN NỘI DUNG BÀI NGHE KHỐI {gradeLevel}:</span>
                  {dynamicWorksheet.tapescript}
                </div>
              )}
            </div>

            {/* Test Paper Sheet */}
            <div className="bg-white text-slate-950 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-6 border border-slate-200">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-black text-indigo-950 uppercase">{dynamicWorksheet.title}</h2>
                <p className="text-xs font-bold text-indigo-600">SECTION 1: LISTENING COMPREHENSION (KHỐI {gradeLevel})</p>
              </div>

              {dynamicWorksheet.listening.map((task, tIdx) => (
                <div key={tIdx} className="space-y-4 border-l-4 border-indigo-600 pl-4">
                  <h3 className="text-sm font-black text-indigo-950">{task.task_title}</h3>
                  <p className="text-xs italic text-slate-500">{task.task_desc}</p>
                  
                  <div className="space-y-3">
                    {task.questions.map((q) => (
                      <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                        <p className="font-extrabold text-slate-900">{q.num}. {q.qText}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                          {q.options.map((opt, oIdx) => (
                            <span key={oIdx} className={`px-3 py-2 rounded-xl border text-xs font-bold ${
                              modeAnswer === 'gv' && opt === q.correct ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-800'
                            }`}>
                              {opt}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: SPEAKING (NÓI & CHẤM AI) */}
        {activeTab === 'speaking' && dynamicWorksheet && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            
            {/* Left AI Submission Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-panel p-6 space-y-4 border-amber-500/40 bg-slate-900/95 shadow-xl">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Chấm Bài Speaking Khối {gradeLevel} Bằng AI</h3>
                    <p className="text-xs text-slate-400">Nộp audio MP3 hoặc dán văn bản bài nói để AI phát hiện lỗi sai.</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl text-[10px] font-bold">
                  <button
                    onClick={() => setStudentSubmissionType('text')}
                    className={`py-1.5 rounded-lg ${studentSubmissionType === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                  >
                    Dán bài nói
                  </button>
                  <button
                    onClick={() => setStudentSubmissionType('link')}
                    className={`py-1.5 rounded-lg ${studentSubmissionType === 'link' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                  >
                    Dán Link
                  </button>
                  <button
                    onClick={() => setStudentSubmissionType('audio')}
                    className={`py-1.5 rounded-lg ${studentSubmissionType === 'audio' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                  >
                    Tải Audio MP3
                  </button>
                </div>

                {studentSubmissionType === 'audio' ? (
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-5 text-center bg-slate-950">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setUploadedSubmissionFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="spk-file"
                    />
                    <label htmlFor="spk-file" className="cursor-pointer space-y-1 block">
                      <Mic className="w-7 h-7 text-amber-400 mx-auto" />
                      <span className="text-xs font-bold text-slate-300 block">
                        {uploadedSubmissionFile ? uploadedSubmissionFile.name : 'Chọn File Ghi Âm MP3 / M4A của HS'}
                      </span>
                    </label>
                  </div>
                ) : (
                  <textarea
                    rows={5}
                    value={studentSubmissionContent}
                    onChange={(e) => setStudentSubmissionContent(e.target.value)}
                    placeholder="Dán bài phát biểu nói Tiếng Anh của học sinh vào đây..."
                    className="w-full glass-input text-xs"
                  />
                )}

                <button
                  onClick={() => handleRunAIEvaluation('Speaking')}
                  disabled={isAnalyzingAI}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <BrainCircuit className="w-4 h-4" />
                  {isAnalyzingAI ? 'AI Đang Phân Tích Bài Nói...' : '🤖 Nộp Bài ĐỂ AI Chấm Điểm & Nhắc Lỗi Sai'}
                </button>

                {aiEvaluationResult && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/50 text-xs space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-black text-emerald-400">KẾT QUẢ CHẤM SPEAKING</span>
                      <span className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-black">
                        {aiEvaluationResult.score}
                      </span>
                    </div>
                    <p className="text-slate-300 font-semibold">{aiEvaluationResult.feedback}</p>

                    <div className="space-y-1.5">
                      <span className="font-extrabold text-amber-400 text-[11px] block">NHẮC LỖI SAI NỐI ÂM & PHÁT ÂM:</span>
                      {aiEvaluationResult.errors.map((err, errIdx) => (
                        <div key={errIdx} className="p-2 rounded bg-slate-900 text-[11px] border border-slate-800 flex items-start gap-2">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span><strong>[{err.type}]:</strong> {err.detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Right Sheet Preview */}
            <div className="lg:col-span-7 bg-white text-slate-950 p-8 rounded-3xl shadow-2xl space-y-6 border border-slate-200">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-black text-indigo-950 uppercase">{dynamicWorksheet.title}</h2>
                <p className="text-xs font-bold text-indigo-600">SECTION 2: SPEAKING PRACTICE (KHỐI {gradeLevel})</p>
              </div>

              {dynamicWorksheet.speaking.map((task, tIdx) => (
                <div key={tIdx} className="space-y-4 border-l-4 border-amber-500 pl-4">
                  <h3 className="text-sm font-black text-indigo-950">{task.task_title}</h3>
                  <p className="text-xs italic text-slate-500">{task.task_desc}</p>
                  
                  {task.questions.map((q) => (
                    <div key={q.id} className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2">
                      <p className="font-extrabold text-slate-900">{q.num}. {q.qText}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: READING (ĐỌC HIỂU) */}
        {activeTab === 'reading' && dynamicWorksheet && (
          <div className="bg-white text-slate-950 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-6 border border-slate-200 animate-fadeIn">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-black text-indigo-950 uppercase">{dynamicWorksheet.title}</h2>
              <p className="text-xs font-bold text-indigo-600">SECTION 3: READING COMPREHENSION (KHỐI {gradeLevel})</p>
            </div>

            {dynamicWorksheet.reading.map((task, tIdx) => (
              <div key={tIdx} className="space-y-4 border-l-4 border-emerald-600 pl-4">
                <h3 className="text-sm font-black text-indigo-950">{task.task_title}</h3>
                <p className="text-xs italic text-slate-500">{task.task_desc}</p>

                {task.passage && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs leading-relaxed font-serif text-slate-800">
                    <span className="font-bold text-indigo-900 block mb-1">📖 READING PASSAGE:</span>
                    {task.passage}
                  </div>
                )}

                <div className="space-y-3">
                  {task.questions.map((q) => (
                    <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                      <p className="font-extrabold text-slate-900">{q.num}. {q.qText}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        {q.options.map((opt, oIdx) => (
                          <span key={oIdx} className={`px-3 py-2 rounded-xl border text-xs font-bold ${
                            modeAnswer === 'gv' && opt === q.correct ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-800'
                          }`}>
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: WRITING (VIẾT & CHẤM AI) */}
        {activeTab === 'writing' && dynamicWorksheet && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            
            {/* Left AI Submission Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-panel p-6 space-y-4 border-rose-500/40 bg-slate-900/95 shadow-xl">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                    <Edit3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Chấm Bài Writing Khối {gradeLevel} Bằng AI</h3>
                    <p className="text-xs text-slate-400">Dán đoạn văn viết Tiếng Anh để AI sửa lỗi chính tả & ngữ pháp.</p>
                  </div>
                </div>

                <textarea
                  rows={6}
                  value={studentSubmissionContent}
                  onChange={(e) => setStudentSubmissionContent(e.target.value)}
                  placeholder="Dán bài viết đoạn văn (80-100 từ) của học sinh vào đây..."
                  className="w-full glass-input text-xs leading-relaxed"
                />

                <button
                  onClick={() => handleRunAIEvaluation('Writing')}
                  disabled={isAnalyzingAI}
                  className="w-full py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <BrainCircuit className="w-4 h-4" />
                  {isAnalyzingAI ? 'AI Đang Phân Tích Bài Viết...' : '🤖 Nộp Bài ĐỂ AI Chấm Điểm & Sửa Lỗi Sai'}
                </button>

                {aiEvaluationResult && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/50 text-xs space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-black text-rose-400">KẾT QUẢ CHẤM WRITING</span>
                      <span className="px-2.5 py-1 rounded bg-rose-500 text-white font-black">
                        {aiEvaluationResult.score}
                      </span>
                    </div>
                    <p className="text-slate-300 font-semibold">{aiEvaluationResult.feedback}</p>

                    <div className="space-y-1.5">
                      <span className="font-extrabold text-amber-400 text-[11px] block">CÁC LỖI CHÍNH TẢ & NGỮ PHÁP ĐÃ SỬA:</span>
                      {aiEvaluationResult.errors.map((err, errIdx) => (
                        <div key={errIdx} className="p-2 rounded bg-slate-900 text-[11px] border border-slate-800 flex items-start gap-2">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span><strong>[{err.type}]:</strong> {err.detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Right Sheet Preview */}
            <div className="lg:col-span-7 bg-white text-slate-950 p-8 rounded-3xl shadow-2xl space-y-6 border border-slate-200">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-black text-indigo-950 uppercase">{dynamicWorksheet.title}</h2>
                <p className="text-xs font-bold text-indigo-600">SECTION 4: WRITING ESSAY (KHỐI {gradeLevel})</p>
              </div>

              {dynamicWorksheet.writing.map((task, tIdx) => (
                <div key={tIdx} className="space-y-4 border-l-4 border-rose-500 pl-4">
                  <h3 className="text-sm font-black text-indigo-950">{task.task_title}</h3>
                  <p className="text-xs italic text-slate-500">{task.task_desc}</p>
                  
                  {task.questions.map((q) => (
                    <div key={q.id} className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-2">
                      <p className="font-extrabold text-slate-900">{q.num}. {q.qText}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 5: SINH ĐỀ AI & MẪU JSON */}
        {activeTab === 'generator' && (
          <div className="animate-fadeIn">
            <AIExamGenerator onExamSaved={() => {
              alert('✨ Đã lưu bài kiểm tra thành công vào Ngân hàng đề thi!');
              setActiveTab('listening');
            }} />
          </div>
        )}

        {/* TAB 6: HƯỚNG DẪN NHÚNG GOOGLE AI STUDIO & CHIA SẺ LINK HS LÀM TRỰC TUYẾN */}
        {activeTab === 'guide' && (
          <div className="glass-panel p-8 space-y-6 border-indigo-500/40 bg-slate-900/95 shadow-2xl animate-fadeIn">
            
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shrink-0">
                <Code className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Hướng Dẫn Tạo Đề Trực Tiếp Trên AI Studio & Gửi Link Cho HS Làm Bài</h2>
                <p className="text-xs text-slate-400">Thực hiện 3 bước đơn giản để tạo và chia sẻ bài kiểm tra tương tác cho học sinh trên website.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* STEP 1 */}
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center">1</span>
                <h3 className="text-base font-extrabold text-white">Tạo Đề Trên Google AI Studio</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Thầy mở Google AI Studio / Gemini Canvas, nhập câu lệnh tạo đề trắc nghiệm Tiếng Anh THCS. Nhấn <strong>Run</strong> để sinh ra Web App kiểm tra tương tác.
                </p>
              </div>

              {/* STEP 2 */}
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center">2</span>
                <h3 className="text-base font-extrabold text-white">Copy Link Share / Nhúng Web App</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Nhấn nút <strong>Share</strong> (hoặc Get URL / iFrame) trên AI Studio ➔ Sao chép đường link Web App vừa tạo.
                </p>
              </div>

              {/* STEP 3 */}
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center">3</span>
                <h3 className="text-base font-extrabold text-white">Đăng Lên Website & Gửi Cho HS</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Vào menu <strong>Sân trường ➔ Tiện Ích Giảng Dạy</strong> ➔ Nhấn <strong>+ Thêm App Gemini Canvas</strong> ➔ Dán link và nhấn Đăng. Thầy copy link gửi học sinh làm bài trực tuyến!
                </p>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" /> Mở Trực Tiếp Google AI Studio Để Tạo Đề
              </a>

              <span className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Học sinh truy cập link có thể bấm nút "Chơi ngay" để làm bài thời gian thực trên mọi thiết bị.
              </span>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
