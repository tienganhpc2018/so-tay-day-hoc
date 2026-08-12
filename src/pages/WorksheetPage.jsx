import React, { useState, useEffect, useRef } from 'react';
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
  FileSpreadsheet,
  Settings,
  ChevronDown,
  ExternalLink,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlobalSuccessKnowledgeBase } from '../data/globalSuccessData';

export const WorksheetPage = () => {
  const { profile } = useAuth();
  
  // Left Sidebar Controls
  const [gradeLevel, setGradeLevel] = useState(6);
  const [lessonSection, setLessonSection] = useState('A closer look 1');
  const [selectedUnits, setSelectedUnits] = useState(['Unit 1: My New School']);
  const [selectedGrammar, setSelectedGrammar] = useState([
    'The present simple',
    'Adverbs of frequency'
  ]);

  // Section Checkboxes (1 Listening, 2 Knowledge, 3 Reading, 4 Communication, 5 Writing)
  const [activeSections, setActiveSections] = useState({
    listening: true,
    knowledge: true,
    reading: true,
    communication: true,
    writing: true
  });

  // Top Mode Controls
  const [modeAnswer, setModeAnswer] = useState('gv'); // 'gv' (Hiện đáp án) | 'student' (Phiếu học sinh)
  const [showConfigSummary, setShowConfigSummary] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAIStudioEmbed, setShowAIStudioEmbed] = useState(false);
  const [aiStudioUrl, setAiStudioUrl] = useState('https://aistudio.google.com/');

  // Audio Playback
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showTapescript, setShowTapescript] = useState(false);

  // Student Interactive Test Answers State
  const [studentAnswers, setStudentAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  // Update grammar checklist dynamically when gradeLevel or selectedUnits change
  useEffect(() => {
    const availableUnits = Object.keys(GlobalSuccessKnowledgeBase.DATA[gradeLevel] || GlobalSuccessKnowledgeBase.DATA[6]);
    const validUnits = selectedUnits.filter(u => availableUnits.includes(u));
    const activeUnits = validUnits.length > 0 ? validUnits : [availableUnits[0]];
    setSelectedUnits(activeUnits);

    const grammarList = GlobalSuccessKnowledgeBase.getGrammarForUnits(gradeLevel, activeUnits);
    setSelectedGrammar(grammarList);
  }, [gradeLevel]);

  const toggleSectionCheckbox = (key) => {
    soundFX.playClick();
    setActiveSections(prev => ({ ...prev, [key]: !prev[key] }));
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
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Worksheet Mock Data Structure matching Screenshots 1, 2, 3, 4, 5
  const worksheetData = {
    title: `TRUNG TÂM HOA MAI MR HAI – ENGLISH GRADE ${gradeLevel} – ${selectedUnits.join(' & ').toUpperCase()}`,
    subtitle: `Getting Started & A Closer Look – Vocabulary & Skills Practice`,
    contact: `English with Mr Hai – 0384635199`,
    tapescript: `Teacher: Good morning class! Welcome to Grade ${gradeLevel}. Let me tell you some class rules. First, you must wear your neat uniform on Mondays. Second, please bring your dictionary to our English class. Third, do your homework carefully before coming. Fourth, remember to keep our classroom clean. Finally, be friendly to your new classmates. Let's study hard!`,
    sections: [
      {
        id: 'listening',
        title: '1  LISTENING SECTION',
        enabled: activeSections.listening,
        tasks: [
          {
            task_title: 'TASK 1: MULTIPLE CHOICE QUESTIONS',
            task_desc: 'Listen to the conversation between Vy and Phong about their first day at school. Choose the correct answer A, B, C, or D.',
            questions: [
              {
                id: 'q1',
                num: 1,
                qText: 'What are Phong and Vy talking about?',
                options: [
                  'A. Their summer holiday activities',
                  'B. Their new English teacher',
                  'C. Their first day at school',
                  'D. Buying new toys at the shop'
                ],
                correct: 'C. Their first day at school'
              },
              {
                id: 'q2',
                num: 2,
                qText: 'How does Vy describe her school bag?',
                options: [
                  'A. It is very light',
                  'B. It is quite heavy',
                  'C. It has a blue color',
                  'D. It is small and old'
                ],
                correct: 'B. It is quite heavy'
              },
              {
                id: 'q3',
                num: 3,
                qText: 'What is Duy wearing today?',
                options: [
                  'A. A blue jacket',
                  'B. A sports uniform',
                  'C. The new school uniform',
                  'D. Casual clothes and shoes'
                ],
                correct: 'C. The new school uniform'
              },
              {
                id: 'q4',
                num: 4,
                qText: 'How does Duy look in his uniform?',
                options: [
                  'A. Very smart',
                  'B. Extremely tired',
                  'C. Quite tall',
                  'D. A bit funny'
                ],
                correct: 'A. Very smart'
              },
              {
                id: 'q5',
                num: 5,
                qText: 'How are they going to school today?',
                options: [
                  'A. By school bus',
                  'B. On foot (walking)',
                  'C. By bicycle',
                  'D. Driven by parents'
                ],
                correct: 'B. On foot (walking)'
              }
            ]
          },
          {
            task_title: 'TASK 2: GAP FILL QUESTIONS',
            task_desc: 'Listen to the class rules explanation by the teacher. Fill in each blank with ONE suitable word from the audio.',
            questions: [
              { id: 'q6', num: 6, qText: 'Students must wear their neat school ________ on Mondays.', correct: 'uniform' },
              { id: 'q7', num: 7, qText: 'Remember to bring your ________ to the English lessons.', correct: 'dictionary' },
              { id: 'q8', num: 8, qText: 'You must complete your ________ carefully before the class.', correct: 'homework' },
              { id: 'q9', num: 9, qText: 'Always try to keep the ________ tidy and clean.', correct: 'classroom' },
              { id: 'q10', num: 10, qText: 'Be polite and ________ to your new classmates in school.', correct: 'friendly' }
            ]
          }
        ]
      },
      {
        id: 'knowledge',
        title: '2  KNOWLEDGE OF LANGUAGE',
        enabled: activeSections.knowledge,
        tasks: [
          {
            task_title: 'TASK 1: GRAMMAR & VOCABULARY PRACTICE',
            task_desc: 'Choose the best answer A, B, C, or D to complete each sentence.',
            questions: [
              {
                id: 'q11',
                num: 11,
                qText: 'My brother usually __________ his homework in the evening.',
                options: ['A. do', 'B. does', 'C. doing', 'D. is doing'],
                correct: 'B. does'
              },
              {
                id: 'q12',
                num: 12,
                qText: 'They __________ playing football in the school playground now.',
                options: ['A. is', 'B. am', 'C. are', 'D. be'],
                correct: 'C. are'
              }
            ]
          }
        ]
      },
      {
        id: 'reading',
        title: '3  READING (ĐỌC HIỂU)',
        enabled: activeSections.reading,
        tasks: [
          {
            task_title: 'TASK 1: PASSAGE COMPREHENSION',
            task_desc: 'Read the passage about new school activities and choose True or False.',
            questions: [
              {
                id: 'q13',
                num: 13,
                qText: 'The new school has a big library with thousands of books.',
                options: ['A. True', 'B. False'],
                correct: 'A. True'
              }
            ]
          }
        ]
      },
      {
        id: 'communication',
        title: '4  COMMUNICATION (GIAO TIẾP)',
        enabled: activeSections.communication,
        tasks: [
          {
            task_title: 'TASK 1: REARRANGE CONVERSATION',
            task_desc: 'Choose A, B, C, or D to order the sentences correctly.',
            questions: [
              {
                id: 'q14',
                num: 14,
                qText: 'A: Nice to meet you! / B: Nice to meet you too! / C: Hi, I am Nam.',
                options: ['A. C - A - B', 'B. A - B - C', 'C. B - C - A', 'D. C - B - A'],
                correct: 'A. C - A - B'
              }
            ]
          }
        ]
      },
      {
        id: 'writing',
        title: '5  WRITING (VIẾT SÁNG TẠO)',
        enabled: activeSections.writing,
        tasks: [
          {
            task_title: 'TASK 1: SENTENCE REWRITING',
            task_desc: 'Rewrite each sentence without changing its original meaning.',
            questions: [
              {
                id: 'q15',
                num: 15,
                qText: 'My school has 20 classrooms. -> There are...',
                options: ['A. There are 20 classrooms in my school.'],
                correct: 'A. There are 20 classrooms in my school.'
              }
            ]
          }
        ]
      }
    ]
  };

  // Student answer selection handler
  const handleStudentSelectOption = (qId, optionText) => {
    soundFX.playClick();
    setStudentAnswers(prev => ({ ...prev, [qId]: optionText }));
  };

  // Grade student test online
  const handleSubmitStudentTest = () => {
    soundFX.playClick();
    let total = 0;
    let correctCount = 0;

    worksheetData.sections.forEach(sec => {
      if (!sec.enabled) return;
      sec.tasks.forEach(t => {
        t.questions.forEach(q => {
          total++;
          const studentAns = studentAnswers[q.id] || '';
          if (studentAns.toLowerCase().trim() === q.correct.toLowerCase().trim()) {
            correctCount++;
          }
        });
      });
    });

    const calculatedScore = total > 0 ? ((correctCount / total) * 10).toFixed(1) : 0;
    setScoreResult({ score: calculatedScore, correctCount, total });
    setTestSubmitted(true);

    soundFX.playFanfare();
    confetti({ particleCount: 150, spread: 90 });
  };

  // Print worksheet
  const handlePrint = () => {
    soundFX.playClick();
    window.print();
  };

  // Copy Word Tab Formatted
  const handleCopyWordTab = () => {
    soundFX.playClick();
    let text = `${worksheetData.title}\n${worksheetData.subtitle}\n${worksheetData.contact}\n\n`;

    worksheetData.sections.forEach(sec => {
      if (!sec.enabled) return;
      text += `=== ${sec.title} ===\n`;
      sec.tasks.forEach(t => {
        text += `${t.task_title}\n${t.task_desc}\n`;
        t.questions.forEach(q => {
          text += `Câu ${q.num}. ${q.qText}\n`;
          if (q.options) {
            text += `${q.options.join('\t')}\n`;
          }
          text += `\n`;
        });
      });
    });

    navigator.clipboard.writeText(text);
    soundFX.playCorrect();
    alert('ĐÃ COPY WORKSHEET CHUẨN TAB WORD!\nDán sang Word (Ctrl + V) để các đáp án tự động nằm gọn trên 1 dòng.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 space-y-6">
      
      {/* 1. TOP HEADER BAR (Trung Tâm Hoa Mai Mr Hai - Worksheet Maker V4.0) */}
      <div className="glass-panel p-4 sm:p-6 border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Brand Left */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Trung Tâm Hoa Mai Mr Hai - Worksheet Maker</h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black">
                V4.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Thiết kế Worksheet tiếng Anh THCS chuẩn hóa từ ảnh chụp SGK hoặc ngân hàng chủ điểm ôn tập
            </p>
          </div>
        </div>

        {/* Top Controls Right */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Toggle Mode Đáp Án */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-bold px-2">ĐÁP ÁN:</span>
            <button
              onClick={() => {
                soundFX.playClick();
                setModeAnswer('gv');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                modeAnswer === 'gv'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
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
                modeAnswer === 'student'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Phiếu học sinh
            </button>
          </div>

          {/* Toggle Hiển Thị Thông Số */}
          <button
            onClick={() => setShowConfigSummary(!showConfigSummary)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
          >
            HIỂN THỊ: {showConfigSummary ? 'Hiện thông số' : 'Ẩn thông số'}
          </button>

          {/* Button Nhúng App AI Studio */}
          <button
            onClick={() => setShowAIStudioEmbed(!showAIStudioEmbed)}
            className="px-3 py-2 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 hover:bg-purple-600/50"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {showAIStudioEmbed ? 'Đóng App AI Studio' : 'Chạy App AI Studio Trực Tiếp'}
          </button>
        </div>

      </div>

      {/* Optional Embedded AI Studio Iframe View */}
      {showAIStudioEmbed && (
        <div className="glass-panel p-4 space-y-3 border-purple-500/50 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Đang Chạy App AI Studio Của Thầy Trực Tiếp Trên Website
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={aiStudioUrl}
                onChange={(e) => setAiStudioUrl(e.target.value)}
                placeholder="Dán đường link Web App AI Studio của Thầy tại đây..."
                className="glass-input text-xs w-72"
              />
              <button onClick={() => setShowAIStudioEmbed(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="w-full h-[600px] rounded-xl overflow-hidden border border-slate-800 bg-white">
            <iframe
              src={aiStudioUrl}
              title="Google AI Studio App"
              className="w-full h-full border-0"
              allow="microphone; camera; clipboard-write; autoplay"
            />
          </div>
        </div>
      )}

      {/* 2. TOP CANVAS ACTION RIBBON */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-slate-800">
        <span className="text-xs font-bold text-slate-400">
          Trang xem trước bản in (Chuẩn khổ giấy A4 dọc)
        </span>

        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <button onClick={() => soundFX.playClick()} className="px-3.5 py-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/40 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Tạo đề tương tự
          </button>

          <button onClick={handleCopyWordTab} className="px-3.5 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/40 flex items-center gap-1.5">
            <Copy className="w-3.5 h-3.5" /> Xuất Word (.doc) / TAB
          </button>

          <button onClick={handlePrint} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-1.5">
            <Printer className="w-4 h-4" /> In đề (A4)
          </button>
        </div>
      </div>

      {/* 3. MAIN CONTENT: LEFT SIDEBAR CONTROLS + RIGHT WORKSHEET CANVAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT SIDEBAR CONTROLS (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Khối Lớp & Phần Học */}
          <div className="glass-panel p-6 space-y-4">
            <div>
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

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">CHỌN PHẦN HỌC (LESSON SECTION):</label>
              <select
                value={lessonSection}
                onChange={(e) => setLessonSection(e.target.value)}
                className="w-full glass-input text-xs font-bold"
              >
                <option value="A closer look 1" className="bg-slate-900">A closer look 1</option>
                <option value="A closer look 2" className="bg-slate-900">A closer look 2</option>
                <option value="Getting started" className="bg-slate-900">Getting started</option>
                <option value="Skills 1" className="bg-slate-900">Skills 1</option>
                <option value="Skills 2" className="bg-slate-900">Skills 2</option>
                <option value="Looking back" className="bg-slate-900">Looking back</option>
              </select>
            </div>

            {/* Banner 12 Units Green */}
            <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-between text-xs font-extrabold text-emerald-200">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> TUYỂN TẬP 12 UNITS
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-800 text-[10px]">1 UNIT</span>
            </div>
          </div>

          {/* Card 2: Kiến Thức Trọng Tâm Ôn Tập */}
          <div className="glass-panel p-6 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              KIẾN THỨC TRỌNG TÂM ÔN TẬP
            </h4>
            <p className="text-[11px] text-slate-400">
              Tick chọn các điểm ngữ pháp/từ vựng cốt lõi của các Unit đã chọn để AI định hướng chính xác nhất
            </p>

            <div className="space-y-2 pt-2">
              {selectedGrammar.map((gItem, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer text-xs font-bold text-indigo-200 hover:bg-slate-800">
                  <input type="checkbox" defaultChecked className="accent-indigo-500 w-4 h-4 rounded" />
                  <span>{gItem}</span>
                  <span className="ml-auto text-[10px] text-slate-400">UNIT 1</span>
                </label>
              ))}
            </div>
          </div>

          {/* Card 3: Sinh Đề Tự Soạn & Dạng Bài (Checkbox List 1->5) */}
          <div className="glass-panel p-6 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                SINH ĐỀ TỰ SOẠN & DẠNG BÀI
              </h4>
              <p className="text-[11px] text-slate-400">Tích chọn các phần và dạng bài muốn xuất hiện trên phiếu bài tập</p>
            </div>

            <div className="space-y-2">
              {[
                { key: 'listening', num: 1, name: 'LISTENING (Nghe hiểu)', bg: 'bg-purple-500/20 text-purple-300' },
                { key: 'knowledge', num: 2, name: 'KNOWLEDGE OF LANGUAGE', bg: 'bg-indigo-500/20 text-indigo-300' },
                { key: 'reading', num: 3, name: 'READING (Đọc hiểu)', bg: 'bg-emerald-500/20 text-emerald-300' },
                { key: 'communication', num: 4, name: 'COMMUNICATION (Giao tiếp)', bg: 'bg-amber-500/20 text-amber-300' },
                { key: 'writing', num: 5, name: 'WRITING (Viết sáng tạo)', bg: 'bg-rose-500/20 text-rose-300' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeSections[item.key]}
                      onChange={() => toggleSectionCheckbox(item.key)}
                      className="accent-indigo-500 w-4 h-4 rounded"
                    />
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-black ${item.bg}`}>
                      {item.num}
                    </span>
                    <span className="text-slate-200">{item.name}</span>
                  </label>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT MAIN PREVIEW WORKSHEET CANVAS (A4 Paper View - 8 Cols) */}
        <div className="lg:col-span-8">
          
          <div className="bg-white text-slate-950 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-8 font-sans border border-slate-200 print:shadow-none print:p-0">
            
            {/* Header Branding & Student Info Box */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b-2 border-indigo-100 pb-6">
              
              {/* Brand Logo & Name Left */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-white shadow-md">
                  <Star className="w-7 h-7 fill-current" />
                </div>
                <div>
                  <span className="text-[11px] font-black tracking-widest text-amber-600 uppercase block">TRUNG TÂM HOA MAI</span>
                  <h2 className="text-2xl font-black text-indigo-950 tracking-tight">MR HAI ENGLISH</h2>
                </div>
              </div>

              {/* Student Info Box Right */}
              <div className="p-4 rounded-2xl border-2 border-indigo-100 bg-indigo-50/50 text-xs space-y-1.5 font-bold text-slate-600 min-w-[220px]">
                <div className="flex justify-between"><span>NAME:</span> <span className="border-b border-slate-400 w-32 inline-block"></span></div>
                <div className="flex justify-between"><span>CLASS:</span> <span className="border-b border-slate-400 w-32 inline-block"></span></div>
                <div className="flex justify-between"><span>DATE:</span> <span>____ / ____ / 2026</span></div>
              </div>

            </div>

            {/* Big Worksheet Title & Subtitle */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-black text-indigo-950 uppercase tracking-tight">
                {worksheetData.title}
              </h1>
              <p className="text-sm font-semibold text-indigo-600">
                {worksheetData.subtitle}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200">
                📞 {worksheetData.contact}
              </div>
            </div>

            {/* Config Summary Pill Box */}
            {showConfigSummary && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-600 text-center space-y-1">
                <div>⚙️ Cấu hình ôn tập: &nbsp; <strong>Lớp: Grade {gradeLevel}</strong> &nbsp;|&nbsp; <strong>Units chọn: {selectedUnits.join(', ')}</strong> &nbsp;|&nbsp; <strong>Phần học: {lessonSection}</strong></div>
                <div className="text-indigo-600">Chủ điểm đã chọn: {selectedGrammar.join(', ')}</div>
              </div>
            )}

            {/* Mode Indicator Banner */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-950 text-white text-xs font-bold">
              <span>Đang ở chế độ: {modeAnswer === 'gv' ? '🔒 Đề Giáo Viên (Hiển thị đáp án màu tím)' : '✏️ Phiếu Học Sinh (Làm bài chấm điểm trực tuyến)'}</span>
              {modeAnswer === 'student' && testSubmitted && scoreResult && (
                <span className="px-3 py-1 rounded-lg bg-emerald-500 text-white font-black animate-bounce">
                  Điểm số: {scoreResult.score}/10 ({scoreResult.correctCount}/{scoreResult.total} câu đúng)
                </span>
              )}
            </div>

            {/* SECTIONS & TASKS RENDER */}
            <div className="space-y-8">
              {worksheetData.sections.map((sec) => {
                if (!sec.enabled) return null;
                return (
                  <div key={sec.id} className="space-y-6 border-l-4 border-indigo-600 pl-4">
                    
                    {/* Section Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-black text-indigo-950 uppercase tracking-wide">
                        {sec.title}
                      </h3>

                      {sec.id === 'listening' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowTapescript(!showTapescript)}
                            className="px-3 py-1 rounded-xl bg-indigo-100 text-indigo-700 text-xs font-bold hover:bg-indigo-200"
                          >
                            {showTapescript ? 'Ẩn kịch bản nghe' : '🔊 Âm kịch bản nghe'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Listening Tapescript Preview */}
                    {sec.id === 'listening' && showTapescript && (
                      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs space-y-2">
                        <div className="flex items-center justify-between font-bold text-indigo-900">
                          <span>KỊCH BẢN NGHE - TAPESCRIPT</span>
                          <button onClick={() => handlePlayAudio(worksheetData.tapescript)} className="text-indigo-600 flex items-center gap-1">
                            <Volume2 className="w-4 h-4" /> Bật Audio
                          </button>
                        </div>
                        <p className="italic text-slate-700 leading-relaxed">{worksheetData.tapescript}</p>
                      </div>
                    )}

                    {/* Tasks Render */}
                    {sec.tasks.map((task, tIdx) => (
                      <div key={tIdx} className="space-y-4">
                        <div>
                          <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider">{task.task_title}</h4>
                          <p className="text-xs italic text-slate-500">{task.task_desc}</p>
                        </div>

                        {/* Questions List */}
                        <div className="space-y-4">
                          {task.questions.map((q) => (
                            <div key={q.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2">
                              <p className="text-xs font-bold text-slate-900">
                                {q.num}. {q.qText}
                              </p>

                              {/* Multiple Choice Options Render (Pill style matching Screenshot 4) */}
                              {q.options ? (
                                <div className="flex flex-wrap gap-2 text-xs pt-1">
                                  {q.options.map((opt, oIdx) => {
                                    const isCorrect = opt.trim().toLowerCase() === q.correct.trim().toLowerCase();
                                    const isSelectedByStudent = studentAnswers[q.id] === opt;

                                    return (
                                      <button
                                        key={oIdx}
                                        type="button"
                                        disabled={modeAnswer === 'gv'}
                                        onClick={() => handleStudentSelectOption(q.id, opt)}
                                        className={`px-4 py-2 rounded-full font-bold transition-all border ${
                                          modeAnswer === 'gv' && isCorrect
                                            ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-105' // Matching purple pill in Screenshot 4!
                                            : modeAnswer === 'student' && isSelectedByStudent
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400'
                                        }`}
                                      >
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : (
                                /* Fill in the blank option */
                                <div className="flex items-center gap-2 pt-1 text-xs">
                                  <span className="font-bold text-slate-600">Đáp án:</span>
                                  {modeAnswer === 'gv' ? (
                                    <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-700 border border-purple-300 font-extrabold italic">
                                      {q.correct}
                                    </span>
                                  ) : (
                                    <input
                                      type="text"
                                      value={studentAnswers[q.id] || ''}
                                      onChange={(e) => setStudentAnswers({ ...studentAnswers, [q.id]: e.target.value })}
                                      placeholder="Nhập câu trả lời..."
                                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold w-48"
                                    />
                                  )}
                                </div>
                              )}

                            </div>
                          ))}
                        </div>

                      </div>
                    ))}

                  </div>
                );
              })}
            </div>

            {/* Student Submit Button */}
            {modeAnswer === 'student' && !testSubmitted && (
              <button
                onClick={handleSubmitStudentTest}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" /> NỘP BÀI KIỂM TRA TRỰC TUYẾN
              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
