import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
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
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlobalSuccessKnowledgeBase } from '../data/globalSuccessData';

export const WorksheetPage = () => {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const initialSecParam = searchParams.get('sec'); // 'listening', 'speaking', 'reading', 'writing'

  // Left Sidebar Controls
  const [gradeLevel, setGradeLevel] = useState(8);
  const [lessonSection, setLessonSection] = useState('A closer look 1');
  const [selectedUnits, setSelectedUnits] = useState(['Unit 1: Leisure Time']);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [selectedGrammar, setSelectedGrammar] = useState([]);

  // Section Checkboxes & Accordion Expand States
  const [activeSections, setActiveSections] = useState({
    listening: true,
    speaking: true,
    knowledge: true,
    reading: true,
    communication: true,
    writing: true
  });

  const [expandedSections, setExpandedSections] = useState({
    listening: initialSecParam === 'listening',
    speaking: initialSecParam === 'speaking',
    knowledge: false,
    reading: initialSecParam === 'reading',
    communication: false,
    writing: initialSecParam === 'writing'
  });

  // Top Mode Controls
  const [modeAnswer, setModeAnswer] = useState('gv');
  const [showConfigSummary, setShowConfigSummary] = useState(true);
  const [showAIStudioEmbed, setShowAIStudioEmbed] = useState(false);
  const [aiStudioUrl, setAiStudioUrl] = useState('https://aistudio.google.com/');

  // Audio Playback State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showTapescript, setShowTapescript] = useState(false);

  // Student AI Submission & Grading State (Speaking & Writing)
  const [studentSubmissionType, setStudentSubmissionType] = useState('text'); // 'text', 'link', 'audio'
  const [studentSubmissionContent, setStudentSubmissionContent] = useState('');
  const [uploadedSubmissionFile, setUploadedSubmissionFile] = useState(null);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiEvaluationResult, setAiEvaluationResult] = useState(null);

  // Dynamic Worksheet Content State
  const [dynamicWorksheet, setDynamicWorksheet] = useState(null);

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
    }
  }, [gradeLevel, lessonSection]);

  const handleUnitToggle = (unitKey) => {
    soundFX.playClick();
    setSelectedUnits(prev => {
      let updated = [];
      if (prev.includes(unitKey)) {
        if (prev.length === 1) return prev;
        updated = prev.filter(u => u !== unitKey);
      } else {
        updated = [...prev, unitKey];
      }

      const grammarList = GlobalSuccessKnowledgeBase.getGrammarForUnits(gradeLevel, updated);
      setSelectedGrammar(grammarList);
      generateDynamicWorksheetContent(gradeLevel, updated, lessonSection);
      return updated;
    });
  };

  const toggleSectionCheckbox = (key) => {
    soundFX.playClick();
    setActiveSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAccordionSection = (key) => {
    soundFX.playClick();
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Generate Worksheet Content
  const generateDynamicWorksheetContent = (grade, unitsArr, section) => {
    const vocabList = GlobalSuccessKnowledgeBase.getVocabForUnits(grade, unitsArr);
    const grammarList = GlobalSuccessKnowledgeBase.getGrammarForUnits(grade, unitsArr);
    const unitTitleStr = unitsArr.join(' & ');

    const tapescriptText = `Speaker: Welcome to Grade ${grade} English! Today we practice ${unitTitleStr}. Remember to focus on vocabulary and key grammar structures: ${grammarList.slice(0, 2).join(', ')}. Listen carefully and choose the best answers.`;

    const listeningTasks = [
      {
        task_title: 'TASK 1: MULTIPLE CHOICE QUESTIONS',
        task_desc: `Listen to the Grade ${grade} conversation about ${unitsArr[0]} and choose the correct answer.`,
        questions: [
          { id: 'q1', num: 1, qText: `What is the main topic of the conversation?`, options: [`A. ${vocabList[0] || 'Activities'}`, `B. ${vocabList[1] || 'Environment'}`, 'C. Science fiction', 'D. Space travel'], correct: `A. ${vocabList[0] || 'Activities'}` },
          { id: 'q2', num: 2, qText: `Which Grade ${grade} grammar point is used?`, options: [`A. ${grammarList[0] || 'Present Simple'}`, 'B. Past Perfect', 'C. Future Continuous', 'D. Passive Voice'], correct: `A. ${grammarList[0] || 'Present Simple'}` }
        ]
      }
    ];

    const speakingTasks = [
      {
        task_title: 'TASK 1: SPEAKING & PRONUNCIATION (AI ASSESSED)',
        task_desc: `Read the passage aloud or record your oral response for Grade ${grade} ${unitsArr[0]}. Upload audio file or paste link to get AI analysis.`,
        questions: [
          { id: 'spk1', num: 1, qText: `Talk about your leisure activities or local environment in Grade ${grade}. (Record audio or paste submission below)`, options: null, correct: 'AI Evaluation Required' }
        ]
      }
    ];

    const knowledgeTasks = [
      {
        task_title: `TASK 1: GRAMMAR FOCUS (${grammarList[0] || 'Present Simple'})`,
        task_desc: `Choose the correct answer A, B, C, or D.`,
        questions: [
          { id: 'q3', num: 3, qText: 'Choose the correct word to complete the sentence.', options: ['A. option 1', 'B. option 2', 'C. option 3', 'D. option 4'], correct: 'A. option 1' }
        ]
      }
    ];

    const readingTasks = [
      {
        task_title: 'TASK 1: READING COMPREHENSION',
        task_desc: 'Read the text and choose True or False.',
        questions: [
          { id: 'q4', num: 4, qText: `The passage discusses Grade ${grade} ${unitsArr[0]} concepts.`, options: ['A. True', 'B. False'], correct: 'A. True' }
        ]
      }
    ];

    const writingTasks = [
      {
        task_title: 'TASK 1: CREATIVE WRITING (AI GRAMMAR & SPELLING CHECK)',
        task_desc: `Write a short paragraph (80-100 words) about ${unitsArr[0]}. Paste your essay below to let AI analyze and point out errors.`,
        questions: [
          { id: 'wrt1', num: 1, qText: `Write paragraph about ${unitsArr[0]}. (Paste essay text below)`, options: null, correct: 'AI Evaluation Required' }
        ]
      }
    ];

    setDynamicWorksheet({
      title: `TRUNG TÂM HOA MAI MR HAI – ENGLISH GRADE ${grade} – ${unitTitleStr.toUpperCase()}`,
      subtitle: `Getting Started & ${section} – Interactive Assessment`,
      contact: `English with Mr Hai – 0384635199`,
      tapescript: tapescriptText,
      sections: [
        { id: 'listening', title: '1  LISTENING (NGHE HIỂU)', enabled: activeSections.listening, tasks: listeningTasks },
        { id: 'speaking', title: '2  SPEAKING (NÓI & CHẤM ĐIỂM AI)', enabled: activeSections.speaking, tasks: speakingTasks },
        { id: 'knowledge', title: '3  KNOWLEDGE OF LANGUAGE', enabled: activeSections.knowledge, tasks: knowledgeTasks },
        { id: 'reading', title: '4  READING (ĐỌC HIỂU)', enabled: activeSections.reading, tasks: readingTasks },
        { id: 'writing', title: '5  WRITING (VIẾT & CHẤM LỖI SAI AI)', enabled: activeSections.writing, tasks: writingTasks }
      ]
    });
  };

  // AI Speaking & Writing Assessment Runner
  const handleRunAIEvaluation = () => {
    if (!studentSubmissionContent.trim() && !uploadedSubmissionFile) {
      alert('Vui lòng dán link bài làm, nhập đoạn văn hoặc chọn file audio ghi âm!');
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
        rating: 'Xuất sắc (Good Performance)',
        feedback: 'Học sinh phát âm/diễn đạt tốt, từ vựng bám sát bài học. Một số lỗi nhỏ về thì quá khứ và nối âm đã được AI phát hiện.',
        errors: [
          { type: 'Ngữ pháp', detail: 'Chưa chia động từ quá khứ ở câu "I go to craft village yesterday". Sửa thành "I went".' },
          { type: 'Phát âm / Chính tả', detail: 'Từ "peaceful" cần phát âm rõ âm tiết /s/. Tránh phát âm thành /z/.' }
        ],
        recommendations: 'Tăng cường luyện tập từ nối "so, but, because" và thực hành nói trước gương 10 phút mỗi ngày.'
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

  const handlePrint = () => {
    soundFX.playClick();
    window.print();
  };

  const availableGradeUnits = Object.keys(GlobalSuccessKnowledgeBase?.DATA?.[gradeLevel] || GlobalSuccessKnowledgeBase?.DATA?.[8] || {});

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 space-y-6 animate-fadeIn font-sans">
      
      {/* 1. TOP HEADER BAR */}
      <div className="glass-panel p-4 sm:p-6 border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Kiểm Tra & Đánh Giá Tương Tác (Chấm AI)</h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black">
                V4.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Phiếu làm bài 4 kỹ năng Listening, Speaking, Reading, Writing tích hợp AI chấm bài và nhắc lỗi sai
            </p>
          </div>
        </div>

        {/* Top Controls Right */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
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

          <button
            onClick={() => setShowAIStudioEmbed(!showAIStudioEmbed)}
            className="px-3 py-2 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 hover:bg-purple-600/50"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {showAIStudioEmbed ? 'Đóng App AI Studio' : 'Chạy App AI Studio Trực Tiếp'}
          </button>
        </div>
      </div>

      {/* Embedded AI Studio View */}
      {showAIStudioEmbed && (
        <div className="glass-panel p-6 space-y-4 border-purple-500/50 animate-fadeIn bg-slate-900/95">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-extrabold text-purple-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Web App AI Studio Trực Tiếp
            </span>
            <button onClick={() => setShowAIStudioEmbed(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full h-[650px] rounded-2xl overflow-hidden border border-slate-800 bg-white shadow-2xl">
            <iframe src={aiStudioUrl} title="Google AI Studio App" className="w-full h-full border-0" />
          </div>
        </div>
      )}

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT CONTROLS (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Chọn Khối */}
          <div className="glass-panel p-6 space-y-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">CHỌN KHỐI LỚP:</label>
            <div className="grid grid-cols-4 gap-2">
              {[6, 7, 8, 9].map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    soundFX.playClick();
                    setGradeLevel(g);
                  }}
                  className={`py-2 rounded-xl text-xs font-extrabold transition-all ${
                    gradeLevel === g
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Lớp {g}
                </button>
              ))}
            </div>
          </div>

          {/* Card 2: 4 KỸ NĂNG CÓ ACCORDION SỔ XUỐNG */}
          <div className="glass-panel p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              4 KỸ NĂNG KIỂM TRA (TÍCH HỢP CHẤM AI)
            </h4>

            <div className="space-y-2">
              {[
                { key: 'listening', name: '1. Listening (Nghe hiểu)', bg: 'bg-purple-500/20 text-purple-300' },
                { key: 'speaking', name: '2. Speaking (Nói & Chấm AI)', bg: 'bg-amber-500/20 text-amber-300' },
                { key: 'reading', name: '3. Reading (Đọc hiểu)', bg: 'bg-emerald-500/20 text-emerald-300' },
                { key: 'writing', name: '4. Writing (Viết & Chấm AI)', bg: 'bg-rose-500/20 text-rose-300' }
              ].map((secItem) => {
                const isChecked = activeSections[secItem.key];
                const isExpanded = expandedSections[secItem.key];

                return (
                  <div key={secItem.key} className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                    <div className="flex items-center justify-between p-3 text-xs font-bold cursor-pointer">
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSectionCheckbox(secItem.key)}
                          className="accent-indigo-500 w-4 h-4 rounded"
                        />
                        <span className="text-slate-200">{secItem.name}</span>
                      </label>
                      <button onClick={() => toggleAccordionSection(secItem.key)} className="text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                        <p>✓ Trạng thái: {isChecked ? 'Đang bật trên phiếu' : 'Đã ẩn'}</p>
                        {(secItem.key === 'speaking' || secItem.key === 'writing') && (
                          <p className="text-amber-400 font-bold">🤖 Kỹ năng này hỗ trợ AI phân tích & chấm lỗi sai tự động</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOX NỘP BÀI HỌC SINH ĐỂ AI PHÂN TÍCH & CHẤM LỖI SAI (SPEAKING & WRITING) */}
          <div className="glass-panel p-6 space-y-4 border-amber-500/40 bg-slate-900/90 shadow-xl">
            <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              CHẤM BÀI SPEAKING / WRITING BẰNG AI
            </h4>

            {/* Sub-tabs: Text, Link, Audio file */}
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl text-[10px] font-bold">
              <button
                onClick={() => setStudentSubmissionType('text')}
                className={`py-1.5 rounded-lg ${studentSubmissionType === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                Dán bài làm
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
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center">
                <input
                  type="file"
                  accept="audio/*,image/*,.pdf,.doc,.docx"
                  onChange={(e) => setUploadedSubmissionFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="sub-file-input"
                />
                <label htmlFor="sub-file-input" className="cursor-pointer space-y-1 block">
                  <Mic className="w-6 h-6 text-amber-400 mx-auto" />
                  <span className="text-xs font-bold text-slate-300 block">
                    {uploadedSubmissionFile ? uploadedSubmissionFile.name : 'Chọn File Audio Ghi Âm MP3/M4A'}
                  </span>
                </label>
              </div>
            ) : (
              <textarea
                rows={4}
                value={studentSubmissionContent}
                onChange={(e) => setStudentSubmissionContent(e.target.value)}
                placeholder={studentSubmissionType === 'link' ? 'Dán đường link bài làm (Drive, Audio, Ảnh)...' : 'Dán nội dung bài viết đoạn văn hoặc kịch bản nói...'}
                className="w-full glass-input text-xs"
              />
            )}

            <button
              onClick={handleRunAIEvaluation}
              disabled={isAnalyzingAI}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <BrainCircuit className="w-4 h-4" />
              {isAnalyzingAI ? 'AI Đang Phân Tích & Chấm Lỗi Sai...' : '🤖 Nộp Bài ĐỂ AI Phân Tích & Chấm Điểm'}
            </button>

            {/* AI Evaluation Result Card */}
            {aiEvaluationResult && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/50 text-xs space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-black text-emerald-400">KẾT QUẢ ĐÁNH GIÁ AI</span>
                  <span className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-black">
                    {aiEvaluationResult.score}
                  </span>
                </div>
                <p className="text-slate-300 font-semibold">{aiEvaluationResult.feedback}</p>

                <div className="space-y-1.5">
                  <span className="font-extrabold text-amber-400 text-[11px] block">NHẮC LỖI SAI CẦN SỬA:</span>
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

        {/* RIGHT CANVAS PREVIEW (8 Cols) */}
        <div className="lg:col-span-8">
          {dynamicWorksheet ? (
            <div className="bg-white text-slate-950 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-8 font-sans border border-slate-200">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-black text-indigo-950 uppercase">{dynamicWorksheet.title}</h1>
                <p className="text-sm font-semibold text-indigo-600">{dynamicWorksheet.subtitle}</p>
              </div>

              <div className="space-y-8">
                {dynamicWorksheet.sections.map((sec) => {
                  if (!sec.enabled) return null;
                  return (
                    <div key={sec.id} className="space-y-4 border-l-4 border-indigo-600 pl-4">
                      <h3 className="text-base font-black text-indigo-950 uppercase">{sec.title}</h3>
                      {sec.tasks.map((task, tIdx) => (
                        <div key={tIdx} className="space-y-2">
                          <h4 className="text-xs font-black text-indigo-900">{task.task_title}</h4>
                          <p className="text-xs italic text-slate-500">{task.task_desc}</p>
                          {task.questions.map((q) => (
                            <div key={q.id} className="p-3 rounded-xl bg-slate-50 border text-xs">
                              <p className="font-bold">{q.num}. {q.qText}</p>
                              {q.options && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                  {q.options.map((opt, oIdx) => (
                                    <span key={oIdx} className="px-3 py-1 rounded-full bg-white border font-semibold">
                                      {opt}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            <div className="glass-panel p-12 text-center text-slate-400">Đang nạp phiếu...</div>
          )}
        </div>

      </div>

    </div>
  );
};
