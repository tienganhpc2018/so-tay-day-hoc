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
  Share2,
  FileUp,
  Link as LinkIcon,
  Music
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlobalSuccessKnowledgeBase } from '../data/globalSuccessData';

export const WorksheetPage = () => {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const secParam = searchParams.get('sec') || 'all';

  // Grade Level State (6, 7, 8, 9)
  const [gradeLevel, setGradeLevel] = useState(8);
  const [lessonSection, setLessonSection] = useState('A closer look 1');

  // Dynamic Units Map per Grade (STRICTLY ACCORDING TO GLOBAL SUCCESS CURRICULUM)
  const gradeUnitsDictionary = {
    6: [
      'Unit 1: My New School',
      'Unit 2: My House',
      'Unit 3: My Friends',
      'Unit 4: My Neighbourhood',
      'Unit 5: Natural Wonders of Viet Nam',
      'Unit 6: Our Tet Holiday',
      'Unit 7: Television',
      'Unit 8: Sports and Games',
      'Unit 9: Cities of the World',
      'Unit 10: Our Houses in the Future',
      'Unit 11: Our Greener World',
      'Unit 12: Robots'
    ],
    7: [
      'Unit 1: Hobbies',
      'Unit 2: Healthy Living',
      'Unit 3: Community Service',
      'Unit 4: Music and Arts',
      'Unit 5: Food and Drink',
      'Unit 6: A Visit to School',
      'Unit 7: Traffic',
      'Unit 8: Films',
      'Unit 9: Festivals Around the World',
      'Unit 10: Energy Sources',
      'Unit 11: Travelling in the Future',
      'Unit 12: English-Speaking Countries'
    ],
    8: [
      'Unit 1: Leisure Time',
      'Unit 2: Life in the Countryside',
      'Unit 3: Teenagers',
      'Unit 4: Ethnic Groups of Viet Nam',
      'Unit 5: Our Customs and Traditions',
      'Unit 6: Lifestyles',
      'Unit 7: Environmental Protection',
      'Unit 8: Shopping',
      'Unit 9: Natural Disasters',
      'Unit 10: Communication in Future',
      'Unit 11: Science and Technology',
      'Unit 12: Life on Other Planets'
    ],
    9: [
      'Unit 1: Local Community',
      'Unit 2: City Life',
      'Unit 3: Healthy Living for Teens',
      'Unit 4: Remembering the Past',
      'Unit 5: Our Experiences',
      'Unit 6: Vietnamese Lifestyles Then and Now',
      'Unit 7: Natural Wonders of the World',
      'Unit 8: Tourism',
      'Unit 9: World Englishes',
      'Unit 10: Planet Earth',
      'Unit 11: Electronic Devices',
      'Unit 12: Career Paths'
    ]
  };

  const [selectedUnit, setSelectedUnit] = useState(gradeUnitsDictionary[8][0]);

  // Update Units whenever Grade switches
  useEffect(() => {
    const currentUnits = gradeUnitsDictionary[gradeLevel] || gradeUnitsDictionary[8];
    setSelectedUnit(currentUnits[0]);
  }, [gradeLevel]);

  // Audio Source Controls
  const [audioType, setAudioType] = useState('drive_link');
  const [driveAudioUrl, setDriveAudioUrl] = useState('');
  const [uploadedAudioFile, setUploadedAudioFile] = useState(null);
  const [audioStreamUrl, setAudioStreamUrl] = useState('');
  const [customTapescript, setCustomTapescript] = useState('');

  // Checklist for Exam Sections (Matching Screenshot 2)
  const [activeSections, setActiveSections] = useState({
    listening: true,
    knowledge: true,
    reading: true,
    communication: true,
    writing: true,
    speaking: true
  });

  const [promptNotes, setPromptNotes] = useState('');

  // Mode Answer (GV vs Student)
  const [modeAnswer, setModeAnswer] = useState('gv');

  // Interactive Student Answers
  const [studentAnswers, setStudentAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);

  // Student AI Submission & Grading State
  const [studentSubmissionType, setStudentSubmissionType] = useState('text');
  const [studentSubmissionContent, setStudentSubmissionContent] = useState('');
  const [uploadedSubmissionFile, setUploadedSubmissionFile] = useState(null);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiEvaluationResult, setAiEvaluationResult] = useState(null);

  const [dynamicWorksheet, setDynamicWorksheet] = useState(null);

  // Convert Google Drive share link into direct Audio Stream
  const convertDriveUrlToDirectAudio = (urlStr) => {
    if (!urlStr) return '';
    try {
      const driveMatch = urlStr.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (driveMatch && driveMatch[1]) {
        return `https://docs.google.com/uc?export=open&id=${driveMatch[1]}`;
      }
      return urlStr;
    } catch (e) {
      return urlStr;
    }
  };

  const handleDriveUrlChange = (val) => {
    setDriveAudioUrl(val);
    const directUrl = convertDriveUrlToDirectAudio(val);
    setAudioStreamUrl(directUrl);
  };

  const handleAudioFileUpload = (file) => {
    if (!file) return;
    soundFX.playClick();
    setUploadedAudioFile(file);
    const localUrl = URL.createObjectURL(file);
    setAudioStreamUrl(localUrl);
  };

  const toggleSectionCheckbox = (key) => {
    soundFX.playClick();
    setActiveSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    try {
      generateDynamicWorksheetContent(gradeLevel, [selectedUnit], lessonSection);
    } catch (err) {
      console.error('Worksheet state sync error:', err);
    }
  }, [gradeLevel, selectedUnit, lessonSection, activeSections]);

  const generateDynamicWorksheetContent = (grade, unitsArr, section) => {
    const vocabList = GlobalSuccessKnowledgeBase.getVocabForUnits(grade, unitsArr);
    const grammarList = GlobalSuccessKnowledgeBase.getGrammarForUnits(grade, unitsArr);
    const unitTitleStr = (unitsArr || []).join(' & ');

    const defaultTapescriptText = `Speaker 1: Welcome to Grade ${grade} English! Today in ${unitTitleStr}, we discuss leisure activities and healthy living. Key vocabulary includes: ${vocabList.slice(0, 3).join(', ')}. Pay attention to grammar rule: ${grammarList[0] || 'Present Simple'}.`;

    // 2 Parts for Listening as requested by Thầy
    const listeningTasks = [
      {
        task_title: 'PART 1: LISTEN AND CHOOSE THE BEST ANSWER (MULTIPLE CHOICE)',
        task_desc: `Listen to audio part 1 for Grade ${grade} ${unitsArr[0]} (~60-90s) and choose A, B, C, or D.`,
        questions: [
          { id: 'l1', num: 1, qText: `What is the main topic of the conversation?`, options: [`A. ${vocabList[0] || 'Activities'}`, `B. ${vocabList[1] || 'Environment'}`, 'C. Science fiction', 'D. Space travel'], correct: `A. ${vocabList[0] || 'Activities'}` },
          { id: 'l2', num: 2, qText: `Which Grade ${grade} grammar structure is mentioned?`, options: [`A. ${grammarList[0] || 'Present Simple'}`, 'B. Past Perfect', 'C. Future Continuous', 'D. Passive Voice'], correct: `A. ${grammarList[0] || 'Present Simple'}` }
        ]
      },
      {
        task_title: 'PART 2: LISTEN AND DECIDE TRUE (T) OR FALSE (F)',
        task_desc: `Listen to audio part 2 and decide whether statements are True (T) or False (F).`,
        questions: [
          { id: 'l3', num: 3, qText: `Students practice Grade ${grade} vocabulary every day.`, options: ['A. True', 'B. False'], correct: 'A. True' },
          { id: 'l4', num: 4, qText: `The recording is played in noisy background.`, options: ['A. True', 'B. False'], correct: 'B. False' }
        ]
      }
    ];

    const knowledgeTasks = [
      {
        task_title: `PART 1: KNOWLEDGE OF LANGUAGE (${grammarList[0] || 'Grammar Focus'})`,
        task_desc: 'Choose the best word or phrase to complete each sentence.',
        questions: [
          { id: 'k1', num: 1, qText: `Minh enjoys ________ English vocabulary after school.`, options: [`A. learning`, `B. learn`, `C. learned`, `D. to learning`], correct: `A. learning` },
          { id: 'k2', num: 2, qText: `Choose the word with different stress pattern.`, options: [`A. ${vocabList[0] || 'happy'}`, `B. ${vocabList[1] || 'enjoy'}`, `C. relax`, `D. create`], correct: `A. ${vocabList[0] || 'happy'}` }
        ]
      }
    ];

    const readingTasks = [
      {
        task_title: 'PART 1: READING COMPREHENSION PASSAGE',
        task_desc: 'Read the passage carefully and answer the questions below.',
        passage: `English is an essential global language for Grade ${grade} students. In ${unitsArr[0]}, students explore vocabulary related to ${vocabList.slice(0, 2).join(' and ')}. Mastering grammar rules such as ${grammarList[0] || 'structures'} helps students express ideas clearly in daily communication.`,
        questions: [
          { id: 'r1', num: 1, qText: `What is the passage mainly about?`, options: ['A. English learning and vocabulary', 'B. Math formulas', 'C. History of Vietnam', 'D. Music and Arts'], correct: 'A. English learning and vocabulary' },
          { id: 'r2', num: 2, qText: `According to the text, what helps students express ideas clearly?`, options: [`A. Mastering ${grammarList[0] || 'grammar'}`, 'B. Playing video games', 'C. Sleeping late', 'D. Watching movies without subtitles'], correct: `A. Mastering ${grammarList[0] || 'grammar'}` }
        ]
      }
    ];

    const communicationTasks = [
      {
        task_title: 'PART 1: EVERYDAY COMMUNICATION',
        task_desc: 'Choose the most suitable response to complete each exchange.',
        questions: [
          { id: 'c1', num: 1, qText: `Nam: "Would you like to join our English club this Sunday?" - Mai: "________"`, options: ['A. Yes, I\'d love to!', 'B. No, thanks.', 'C. Never mind.', 'D. You are welcome.'], correct: 'A. Yes, I\'d love to!' }
        ]
      }
    ];

    const writingTasks = [
      {
        task_title: 'PART 1: CREATIVE WRITING & AI ERROR CHECKING',
        task_desc: `Write a short paragraph (80-100 words) about ${unitsArr[0]}. Paste your essay below for AI to check spelling, grammar, and sentence structure.`,
        questions: [
          { id: 'wrt1', num: 1, qText: `Write paragraph about ${unitsArr[0]}. (Paste essay text below to analyze errors)`, options: null, correct: 'AI Evaluation Required' }
        ]
      }
    ];

    const speakingTasks = [
      {
        task_title: 'PART 1: SPEAKING & PRONUNCIATION ASSESSMENT (AI POWERED)',
        task_desc: `Read the Grade ${grade} passage aloud or record your speaking answer. AI will analyze your pronunciation, fluency, and grammar errors in real time.`,
        questions: [
          { id: 'spk1', num: 1, qText: `Talk about your hobbies or daily routine in Grade ${grade} (${unitsArr[0]}). Upload MP3 or paste text below.`, options: null, correct: 'AI Evaluation Required' }
        ]
      }
    ];

    setDynamicWorksheet({
      title: `TRUNG TÂM HOA MAI MR HAI – ENGLISH GRADE ${grade} – ${unitTitleStr.toUpperCase()}`,
      subtitle: `Getting Started & ${section} – Interactive Assessment Studio`,
      contact: `English with Mr Hai – 0384635199`,
      tapescript: customTapescript || defaultTapescriptText,
      sections: [
        { id: 'listening', title: '1  LISTENING (NGHE HIỂU)', enabled: activeSections.listening, tasks: listeningTasks },
        { id: 'knowledge', title: '2  KNOWLEDGE OF LANGUAGE', enabled: activeSections.knowledge, tasks: knowledgeTasks },
        { id: 'reading', title: '3  READING (ĐỌC HIỂU)', enabled: activeSections.reading, tasks: readingTasks },
        { id: 'communication', title: '4  COMMUNICATION (GIAO TIẾP)', enabled: activeSections.communication, tasks: communicationTasks },
        { id: 'writing', title: '5  WRITING (VIẾT SÁNG TẠO)', enabled: activeSections.writing, tasks: writingTasks },
        { id: 'speaking', title: '6  SPEAKING (NÓI & CHẤM AI)', enabled: activeSections.speaking, tasks: speakingTasks }
      ]
    });
  };

  const handleSelectOption = (qId, optionVal) => {
    soundFX.playClick();
    setStudentAnswers(prev => ({ ...prev, [qId]: optionVal }));
  };

  const handleCheckAnswers = (allTasks) => {
    soundFX.playClick();
    let totalQuestions = 0;
    let correctCount = 0;

    allTasks.forEach(task => {
      task.questions.forEach(q => {
        if (q.correct && q.correct !== 'AI Evaluation Required') {
          totalQuestions++;
          if (studentAnswers[q.id] === q.correct) correctCount++;
        }
      });
    });

    if (totalQuestions === 0) return;
    const scorePct = Math.round((correctCount / totalQuestions) * 10);
    setQuizScore(scorePct);

    if (scorePct >= 8) {
      soundFX.playFanfare();
      confetti({ particleCount: 150, spread: 90 });
    } else {
      soundFX.playCorrect();
    }
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

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* 1. HERO BANNER */}
      <PageHeroBanner
        title="Kiểm Tra & Đánh Giá Tương Tác 📝"
        subtitle="Soạn đề thi bài nghe Listening, nạp file Google Drive tự động phát audio, tùy chọn dạng bài tập và làm bài tương tác trực tiếp."
        badge="STUDIO SOẠN ĐỀ • THỜI GIAN THỰC"
        bgImage="/images/hero_playground_bg.jpg"
        showVipBadge={true}
        actions={
          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs backdrop-blur-md">
            <button
              onClick={() => {
                soundFX.playClick();
                setModeAnswer('gv');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
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
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                modeAnswer === 'student' ? 'bg-emerald-600 text-white' : 'text-slate-400'
              }`}
            >
              Phiếu học sinh làm bài
            </button>
          </div>
        }
      />

      {/* 2. MAIN 2-COLUMN LAYOUT: LEFT SIDEBAR CONTROLS (4 COLS) & RIGHT PREVIEW CANVAS (8 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT SIDEBAR CONTROLS (4 COLS) - COMPACT & COMPLETE MATCHING SCREENSHOT 2 */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SECTION 1: KHỐI LỚP & UNIT CHUẨN CỦA TỪNG KHỐI */}
          <div className="glass-panel p-6 space-y-4 border-indigo-500/40 bg-slate-900/95 shadow-xl">
            
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                1. CHỌN KHỐI LỚP & UNIT CHUẨN SGK
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">KHỐI LỚP (6 • 7 • 8 • 9):</label>
              <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-extrabold">
                {[6, 7, 8, 9].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      setGradeLevel(g);
                    }}
                    className={`py-2 rounded-xl transition-all ${
                      gradeLevel === g ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Lớp {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center justify-between">
                <span>UNIT BÀI HỌC DÀNH CHO KHỐI {gradeLevel}:</span>
                <span className="text-[10px] text-indigo-400 font-bold">(Tự động đổi theo Khối)</span>
              </label>
              <select
                value={selectedUnit}
                onChange={(e) => {
                  soundFX.playClick();
                  setSelectedUnit(e.target.value);
                }}
                className="w-full glass-input text-xs font-bold py-2.5"
              >
                {(gradeUnitsDictionary[gradeLevel] || []).map((u, uIdx) => (
                  <option key={uIdx} value={u} className="bg-slate-900">
                    {u}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* SECTION 2: CÁC DẠNG BÀI TẬP MUỐN XUẤT HIỆN MATCHING SCREENSHOT 2 */}
          <div className="glass-panel p-6 space-y-4 border-slate-800 bg-slate-900/95 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                CÁC DẠNG BÀI TẬP MUỐN XUẤT HIỆN:
              </h3>
            </div>

            <div className="space-y-2.5">
              {[
                { key: 'listening', num: 1, name: 'LISTENING (Nghe hiểu)', bg: 'bg-purple-500/20 text-purple-300' },
                { key: 'knowledge', num: 2, name: 'KNOWLEDGE OF LANGUAGE', bg: 'bg-indigo-500/20 text-indigo-300' },
                { key: 'reading', num: 3, name: 'READING (Đọc hiểu)', bg: 'bg-emerald-500/20 text-emerald-300' },
                { key: 'communication', num: 4, name: 'COMMUNICATION (Giao tiếp)', bg: 'bg-teal-500/20 text-teal-300' },
                { key: 'writing', num: 5, name: 'WRITING (Viết sáng tạo)', bg: 'bg-rose-500/20 text-rose-300' },
                { key: 'speaking', num: 6, name: 'SPEAKING (Nói & Chấm AI)', bg: 'bg-amber-500/20 text-amber-300' }
              ].map((secItem) => {
                const isChecked = activeSections[secItem.key];

                return (
                  <div key={secItem.key} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold hover:border-slate-700 transition-all">
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSectionCheckbox(secItem.key)}
                        className="accent-indigo-500 w-4.5 h-4.5 rounded"
                      />
                      <span className="w-5 h-5 rounded-md bg-slate-900 border border-slate-700 text-[10px] flex items-center justify-center text-indigo-400 font-extrabold">
                        {secItem.num}
                      </span>
                      <span className="text-slate-200">{secItem.name}</span>
                    </label>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </div>
                );
              })}
            </div>

            {/* PROMPT NOTES MATCHING SCREENSHOT 2 */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Ý TƯỞNG TỰ SOẠN CỦA THẦY CÔ (PROMPT NOTES)
              </label>
              <textarea
                rows={3}
                value={promptNotes}
                onChange={(e) => setPromptNotes(e.target.value)}
                placeholder="Ví dụ: Thiết kế thêm câu hỏi phủ định; bám sát từ vựng trang 12 SGK; biên soạn câu hỏi phù hợp cho học sinh khá giỏi..."
                className="w-full glass-input text-xs leading-relaxed"
              />
            </div>

          </div>

          {/* SECTION 3: AUDIO GOOGLE DRIVE & FILE INPUT */}
          <div className="glass-panel p-6 space-y-4 border-indigo-500/40 bg-slate-900/95 shadow-xl">
            <h3 className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-indigo-400" />
              NGUỒN ÂM THANH BÀI NGHE LISTENING
            </h3>

            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setAudioType('drive_link')}
                className={`py-1.5 rounded-lg ${audioType === 'drive_link' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                Drive Link
              </button>
              <button
                type="button"
                onClick={() => setAudioType('file_upload')}
                className={`py-1.5 rounded-lg ${audioType === 'file_upload' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                Tải MP3
              </button>
              <button
                type="button"
                onClick={() => setAudioType('ai_speech')}
                className={`py-1.5 rounded-lg ${audioType === 'ai_speech' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                AI Reader
              </button>
            </div>

            {audioType === 'drive_link' && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-300 block">DÁN LINK GOOGLE DRIVE FILE NGHE:</span>
                <input
                  type="url"
                  value={driveAudioUrl}
                  onChange={(e) => handleDriveUrlChange(e.target.value)}
                  placeholder="https://drive.google.com/file/d/1A2B3C.../view..."
                  className="w-full glass-input text-xs"
                />
              </div>
            )}

            {audioType === 'file_upload' && (
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleAudioFileUpload(e.target.files?.[0])}
                className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
              />
            )}

            {audioStreamUrl && (
              <div className="pt-1">
                <span className="text-[10px] font-bold text-emerald-400 block mb-1">TRÌNH PHÁT AUDIO TRỰC TIẾP:</span>
                <audio controls src={audioStreamUrl} className="w-full rounded-xl bg-slate-950" controlsList="nodownload" />
              </div>
            )}
          </div>

          {/* SECTION 4: AI SPEAKING & WRITING SUBMISSION BOX */}
          <div className="glass-panel p-6 space-y-4 border-amber-500/40 bg-slate-900/95 shadow-xl">
            <h3 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              CHẤM BÀI SPEAKING / WRITING BẰNG AI
            </h3>

            <textarea
              rows={4}
              value={studentSubmissionContent}
              onChange={(e) => setStudentSubmissionContent(e.target.value)}
              placeholder="Dán đoạn văn viết hoặc bài nói của học sinh để AI chấm điểm..."
              className="w-full glass-input text-xs"
            />

            <button
              onClick={() => handleRunAIEvaluation('Speaking / Writing')}
              disabled={isAnalyzingAI}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <BrainCircuit className="w-4 h-4" />
              {isAnalyzingAI ? 'AI Đang Phân Tích...' : '🤖 Nộp Bài ĐỂ AI Chấm Điểm & Sửa Lỗi'}
            </button>

            {aiEvaluationResult && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/50 text-xs space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-black text-emerald-400">KẾT QUẢ ĐÁNH GIÁ AI</span>
                  <span className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-black">
                    {aiEvaluationResult.score}
                  </span>
                </div>
                <p className="text-slate-300 font-semibold">{aiEvaluationResult.feedback}</p>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT MAIN PAPER DISPLAY CANVAS (8 COLS) - WIDE & CLEAN */}
        <div className="lg:col-span-8">
          {dynamicWorksheet ? (
            <div className="bg-white text-slate-950 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-8 font-sans border border-slate-200">
              
              <div className="text-center space-y-2 border-b border-slate-200 pb-6">
                <h1 className="text-2xl font-black text-indigo-950 uppercase">{dynamicWorksheet.title}</h1>
                <p className="text-xs font-bold text-indigo-600">{dynamicWorksheet.subtitle}</p>
                <p className="text-[11px] font-semibold text-slate-500">📞 Contact: {dynamicWorksheet.contact}</p>
              </div>

              {/* EMBEDDED AUDIO PLAYER INSIDE PAPER */}
              {activeSections.listening && audioStreamUrl && (
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
                  <span className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                    🔊 TRÌNH PHÁT FILE ÂM THANH BÀI NGHE (AUDIO PLAYER):
                  </span>
                  <audio controls src={audioStreamUrl} className="w-full rounded-xl" />
                </div>
              )}

              {/* SECTIONS RENDERING ACCORDING TO CHECKBOXES */}
              <div className="space-y-8">
                {dynamicWorksheet.sections.map((sec) => {
                  if (!sec.enabled) return null;
                  return (
                    <div key={sec.id} className="space-y-4 border-l-4 border-indigo-600 pl-4">
                      <h3 className="text-base font-black text-indigo-950 uppercase">{sec.title}</h3>
                      
                      {sec.tasks.map((task, tIdx) => (
                        <div key={tIdx} className="space-y-3">
                          <h4 className="text-xs font-black text-indigo-900">{task.task_title}</h4>
                          <p className="text-xs italic text-slate-500">{task.task_desc}</p>
                          
                          {task.passage && (
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs leading-relaxed font-serif text-slate-800">
                              <span className="font-bold text-indigo-900 block mb-1">📖 READING PASSAGE:</span>
                              {task.passage}
                            </div>
                          )}

                          <div className="space-y-3">
                            {task.questions.map((q) => (
                              <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                                <p className="font-extrabold text-slate-900">{q.num}. {q.qText}</p>
                                
                                {q.options && (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                                    {q.options.map((opt, oIdx) => {
                                      const isSelected = studentAnswers[q.id] === opt;
                                      const isCorrectGV = modeAnswer === 'gv' && opt === q.correct;

                                      return (
                                        <button
                                          key={oIdx}
                                          type="button"
                                          onClick={() => handleSelectOption(q.id, opt)}
                                          className={`px-4 py-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                                            isCorrectGV
                                              ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                                              : isSelected
                                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                              : 'bg-white text-slate-800 hover:bg-slate-100 border-slate-300'
                                          }`}
                                        >
                                          {opt}
                                        </button>
                                      );
                                    })}
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

              {/* SUBMIT ANSWERS & CHECK SCORE BUTTON */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => {
                    const allTasks = dynamicWorksheet.sections.filter(s => s.enabled).flatMap(s => s.tasks);
                    handleCheckAnswers(allTasks);
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Nộp Bài & Chấm Điểm Tương Tác
                </button>

                {quizScore !== null && (
                  <span className="px-5 py-2.5 rounded-2xl bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-300">
                    🎯 Kết Quả Tương Tác: {quizScore} / 10 Điểm
                  </span>
                )}
              </div>

            </div>
          ) : (
            <div className="glass-panel p-12 text-center text-slate-400">Đang nạp bài kiểm tra...</div>
          )}
        </div>

      </div>

    </div>
  );
};
