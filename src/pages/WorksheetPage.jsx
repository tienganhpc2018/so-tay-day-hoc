import React, { useState, useEffect } from 'react';
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
  Award,
  Layers,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlobalSuccessKnowledgeBase } from '../data/globalSuccessData';

export const WorksheetPage = () => {
  const { profile } = useAuth();
  
  // Left Sidebar Controls
  const [gradeLevel, setGradeLevel] = useState(6);
  const [lessonSection, setLessonSection] = useState('A closer look 1');
  const [selectedUnits, setSelectedUnits] = useState(['Unit 1: My New School']);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [selectedGrammar, setSelectedGrammar] = useState([]);

  // Section Checkboxes & Accordion Expand States
  const [activeSections, setActiveSections] = useState({
    listening: true,
    knowledge: true,
    reading: true,
    communication: true,
    writing: true
  });

  const [expandedSections, setExpandedSections] = useState({
    listening: true,
    knowledge: false,
    reading: false,
    communication: false,
    writing: false
  });

  // Top Mode Controls
  const [modeAnswer, setModeAnswer] = useState('gv'); // 'gv' (Hiện đáp án màu tím) | 'student' (Phiếu học sinh)
  const [showConfigSummary, setShowConfigSummary] = useState(true);
  const [showAIStudioEmbed, setShowAIStudioEmbed] = useState(false);
  const [aiStudioUrl, setAiStudioUrl] = useState('https://aistudio.google.com/');

  // Audio Playback State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showTapescript, setShowTapescript] = useState(false);

  // Student Interactive Test Answers State
  const [studentAnswers, setStudentAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  // Generated Worksheet Dynamic Data State
  const [dynamicWorksheet, setDynamicWorksheet] = useState(null);

  // Auto sync Grammar checklist & re-generate dynamic worksheet whenever gradeLevel, selectedUnits, or lessonSection change
  useEffect(() => {
    try {
      const gradeUnitsMap = GlobalSuccessKnowledgeBase?.DATA?.[gradeLevel] || GlobalSuccessKnowledgeBase?.DATA?.[6];
      const availableUnitKeys = Object.keys(gradeUnitsMap);
      
      // Ensure selectedUnits belong to current grade
      const validUnits = selectedUnits.filter(u => availableUnitKeys.includes(u));
      const activeUnits = validUnits.length > 0 ? validUnits : [availableUnitKeys[0]];
      setSelectedUnits(activeUnits);

      const grammarList = GlobalSuccessKnowledgeBase.getGrammarForUnits(gradeLevel, activeUnits);
      setSelectedGrammar(grammarList);

      // Re-generate dynamic worksheet matching exact grade, units & section
      generateDynamicWorksheetContent(gradeLevel, activeUnits, lessonSection);
    } catch (err) {
      console.error('Worksheet state sync error:', err);
    }
  }, [gradeLevel, lessonSection]);

  // Sync when selectedUnits change
  const handleUnitToggle = (unitKey) => {
    soundFX.playClick();
    setSelectedUnits(prev => {
      let updated = [];
      if (prev.includes(unitKey)) {
        if (prev.length === 1) return prev; // Keep at least 1 unit
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

  // Generate 100% Dynamic Worksheet Content matching Grade (6, 7, 8, 9), Selected Units & Lesson Section
  const generateDynamicWorksheetContent = (grade, unitsArr, section) => {
    const vocabList = GlobalSuccessKnowledgeBase.getVocabForUnits(grade, unitsArr);
    const grammarList = GlobalSuccessKnowledgeBase.getGrammarForUnits(grade, unitsArr);
    const unitTitleStr = unitsArr.join(' & ');

    let tapescriptText = '';
    let listeningTasks = [];
    let knowledgeTasks = [];
    let readingTasks = [];
    let commTasks = [];
    let writingTasks = [];

    if (grade === 6) {
      tapescriptText = `Teacher: Welcome to Grade 6 English! Today we explore ${unitTitleStr}. Remember to bring your textbook, rubber, and calculator to class. Phong and Vy are discussing their new school activities. First, students must wear their neat uniform on Mondays. Second, keep your classroom clean and be friendly to your new classmates!`;

      listeningTasks = [
        {
          task_title: 'TASK 1: MULTIPLE CHOICE QUESTIONS',
          task_desc: `Listen to the conversation between Vy and Phong about Grade 6 ${unitsArr[0]}. Choose the correct answer A, B, C, or D.`,
          questions: [
            { id: 'q1', num: 1, qText: 'What are Phong and Vy talking about?', options: ['A. Their summer holiday activities', 'B. Their new English teacher', 'C. Their first day at school', 'D. Buying new toys at the shop'], correct: 'C. Their first day at school' },
            { id: 'q2', num: 2, qText: `Which school item is mentioned in ${unitsArr[0]}?`, options: [`A. ${vocabList[0] || 'calculator'}`, `B. ${vocabList[1] || 'compass'}`, 'C. computer mouse', 'D. sports car'], correct: `A. ${vocabList[0] || 'calculator'}` },
            { id: 'q3', num: 3, qText: 'What is Duy wearing today?', options: ['A. A blue jacket', 'B. A sports uniform', 'C. The new school uniform', 'D. Casual clothes and shoes'], correct: 'C. The new school uniform' }
          ]
        },
        {
          task_title: 'TASK 2: GAP FILL QUESTIONS',
          task_desc: 'Listen to the class rules explanation by the teacher. Fill in each blank with ONE suitable word from the audio.',
          questions: [
            { id: 'q4', num: 4, qText: 'Students must wear their neat school ________ on Mondays.', correct: 'uniform' },
            { id: 'q5', num: 5, qText: 'Be polite and ________ to your new classmates in school.', correct: 'friendly' }
          ]
        }
      ];

      knowledgeTasks = [
        {
          task_title: `TASK 1: GRAMMAR & VOCABULARY (${grammarList[0] || 'Present Simple'})`,
          task_desc: `Choose the correct answer A, B, C, or D for Grade 6 ${section}.`,
          questions: [
            { id: 'q6', num: 6, qText: 'My brother usually __________ his homework in the evening.', options: ['A. do', 'B. does', 'C. doing', 'D. is doing'], correct: 'B. does' },
            { id: 'q7', num: 7, qText: 'She __________ to school by bicycle every morning.', options: ['A. go', 'B. goes', 'C. is going', 'D. went'], correct: 'B. goes' }
          ]
        }
      ];

      readingTasks = [
        {
          task_title: 'TASK 1: PASSAGE COMPREHENSION',
          task_desc: 'Read the text about new school activities and choose True or False.',
          questions: [
            { id: 'q8', num: 8, qText: 'The new school has a big playground and modern equipment.', options: ['A. True', 'B. False'], correct: 'A. True' }
          ]
        }
      ];

      commTasks = [
        {
          task_title: 'TASK 1: REARRANGE CONVERSATION',
          task_desc: 'Order sentences A, B, C to complete the greeting.',
          questions: [
            { id: 'q9', num: 9, qText: 'A: Nice to meet you! / B: Nice to meet you too! / C: Hi, I am Nam.', options: ['A. C - A - B', 'B. A - B - C', 'C. B - C - A', 'D. C - B - A'], correct: 'A. C - A - B' }
          ]
        }
      ];

      writingTasks = [
        {
          task_title: 'TASK 1: SENTENCE REWRITING',
          task_desc: 'Rewrite sentence without changing original meaning.',
          questions: [
            { id: 'q10', num: 10, qText: 'My school has 20 classrooms. -> There are...', options: ['A. There are 20 classrooms in my school.'], correct: 'A. There are 20 classrooms in my school.' }
          ]
        }
      ];

    } else if (grade === 7) {
      tapescriptText = `Speaker: Welcome to Grade 7 English! Today we practice ${unitTitleStr}. In Unit 1 and Unit 2, we learn about healthy living, hobbies, and community service. Students often enjoy collecting models, gardening, and donating books to homeless children. Eating a healthy diet with fresh vegetables and drinking orange juice keeps us active!`;

      listeningTasks = [
        {
          task_title: 'TASK 1: MULTIPLE CHOICE QUESTIONS',
          task_desc: `Listen to the talk about Grade 7 ${unitsArr[0]}. Choose A, B, C, or D.`,
          questions: [
            { id: 'q1', num: 1, qText: 'What hobby is mentioned in the talk?', options: [`A. ${vocabList[0] || 'gardening'}`, 'B. playing video games', 'C. watching horror films', 'D. driving cars'], correct: `A. ${vocabList[0] || 'gardening'}` },
            { id: 'q2', num: 2, qText: 'What do students donate to homeless children in community service?', options: ['A. Plastic toys', 'B. Books and warm clothes', 'C. Old computer mice', 'D. Candy bars'], correct: 'B. Books and warm clothes' }
          ]
        }
      ];

      knowledgeTasks = [
        {
          task_title: `TASK 1: GRAMMAR FOCUS (${grammarList[0] || 'Verbs of liking + V-ing'})`,
          task_desc: `Choose the correct answer A, B, C, or D for Grade 7 ${section}.`,
          questions: [
            { id: 'q3', num: 3, qText: 'Nam fancies __________ dollhouses in his free time.', options: ['A. build', 'B. building', 'C. built', 'D. to build'], correct: 'B. building' },
            { id: 'q4', num: 4, qText: 'She has a sore throat, __________ she should drink warm tea.', options: ['A. and', 'B. or', 'C. so', 'D. but'], correct: 'C. so' }
          ]
        }
      ];

      readingTasks = [
        {
          task_title: 'TASK 1: READING COMPREHENSION',
          task_desc: 'Read about community service in Grade 7 and choose True or False.',
          questions: [
            { id: 'q5', num: 5, qText: 'Volunteers help elderly people and tutor homeless children.', options: ['A. True', 'B. False'], correct: 'A. True' }
          ]
        }
      ];

      commTasks = [
        {
          task_title: 'TASK 1: CONVERSATION ARRANGEMENT',
          task_desc: 'Choose correct order for giving health advice.',
          questions: [
            { id: 'q6', num: 6, qText: 'a. I have a bad sunburn. / b. You should wear a hat and suncream.', options: ['A. a - b', 'B. b - a'], correct: 'A. a - b' }
          ]
        }
      ];

      writingTasks = [
        {
          task_title: 'TASK 1: SENTENCE TRANSFORMATION',
          task_desc: 'Rewrite sentence using compound connectors.',
          questions: [
            { id: 'q7', num: 7, qText: 'He eats lots of junk food. He is gaining weight. (SO) ->', options: ['A. He eats lots of junk food, so he is gaining weight.'], correct: 'A. He eats lots of junk food, so he is gaining weight.' }
          ]
        }
      ];

    } else if (grade === 8) {
      tapescriptText = `Nam: Hi Mai! What are you doing this weekend?\nMai: Hi Nam! I am visiting a traditional craft village for Grade 8 ${unitTitleStr}. We are learning about communal houses, traditional handicrafts, and lifestyles of ethnic minority groups in Vietnam. Local artisans are very hospitable!`;

      listeningTasks = [
        {
          task_title: 'TASK 1: MULTIPLE CHOICE QUESTIONS',
          task_desc: `Listen to Mai and Nam discussing Grade 8 ${unitsArr[0]}. Choose A, B, C, or D.`,
          questions: [
            { id: 'q1', num: 1, qText: 'Where is Mai going this weekend?', options: ['A. To a craft village', 'B. To a seaside resort', 'C. To a computer lab', 'D. To a shopping mall'], correct: 'A. To a craft village' },
            { id: 'q2', num: 2, qText: `What Grade 8 vocabulary item is mentioned?`, options: [`A. ${vocabList[0] || 'communal house'}`, `B. ${vocabList[1] || 'artisan'}`, 'C. space shuttle', 'D. electric scooter'], correct: `A. ${vocabList[0] || 'communal house'}` }
          ]
        }
      ];

      knowledgeTasks = [
        {
          task_title: `TASK 1: GRAMMAR FOCUS (${grammarList[0] || 'Comparative Adverbs'})`,
          task_desc: `Choose correct option for Grade 8 ${section}.`,
          questions: [
            { id: 'q3', num: 3, qText: 'People in the countryside live __________ than those in big cities.', options: ['A. more peacefully', 'B. peaceful', 'C. most peaceful', 'D. as peaceful'], correct: 'A. more peacefully' },
            { id: 'q4', num: 4, qText: 'While Nam __________ his homework, his brother was surfing the net.', options: ['A. was doing', 'B. does', 'C. is doing', 'D. did'], correct: 'A. was doing' }
          ]
        }
      ];

      readingTasks = [
        {
          task_title: 'TASK 1: READING COMPREHENSION',
          task_desc: 'Read text about life in the countryside and choose True or False.',
          questions: [
            { id: 'q5', num: 5, qText: 'Farmers harvest crops using combine harvesters in vast paddy fields.', options: ['A. True', 'B. False'], correct: 'A. True' }
          ]
        }
      ];

      commTasks = [
        {
          task_title: 'TASK 1: COMMUNICATION ARRANGEMENT',
          task_desc: 'Order conversation about table manners.',
          questions: [
            { id: 'q6', num: 6, qText: 'a. You should pass dishes with both hands. / b. Thank you for telling me!', options: ['A. a - b', 'B. b - a'], correct: 'A. a - b' }
          ]
        }
      ];

      writingTasks = [
        {
          task_title: 'TASK 1: SENTENCE REWRITING',
          task_desc: 'Rewrite using Comparative Adverbs.',
          questions: [
            { id: 'q7', num: 7, qText: 'Nam drives more carefully than Lan. -> Lan drives...', options: ['A. Lan drives less carefully than Nam.'], correct: 'A. Lan drives less carefully than Nam.' }
          ]
        }
      ];

    } else {
      // Grade 9
      tapescriptText = `Phong: Hi Mark! Have you decided on your career path after Grade 9 graduation?\nMark: Hi Phong! I am considering vocational training in computer science. What about you?\nPhong: I am interested in local environment and preserving traditional handicrafts in our metropolis!`;

      listeningTasks = [
        {
          task_title: 'TASK 1: MULTIPLE CHOICE QUESTIONS',
          task_desc: `Listen to Mark and Phong discussing Grade 9 ${unitsArr[0]}. Choose A, B, C, or D.`,
          questions: [
            { id: 'q1', num: 1, qText: 'What career path is Mark considering?', options: ['A. Vocational training in computer science', 'B. Painting pottery', 'C. Space travel', 'D. Acting'], correct: 'A. Vocational training in computer science' },
            { id: 'q2', num: 2, qText: `Which Grade 9 term is featured in ${unitsArr[0]}?`, options: [`A. ${vocabList[0] || 'metropolis'}`, `B. ${vocabList[1] || 'phrasal verbs'}`, 'C. kindergarten', 'D. toy car'], correct: `A. ${vocabList[0] || 'metropolis'}` }
          ]
        }
      ];

      knowledgeTasks = [
        {
          task_title: `TASK 1: GRAMMAR FOCUS (${grammarList[0] || 'Phrasal Verbs & Reported Speech'})`,
          task_desc: `Choose correct option for Grade 9 ${section}.`,
          questions: [
            { id: 'q3', num: 3, qText: 'The artisan __________ restored the ancient lacquerware is very famous.', options: ['A. who', 'B. which', 'C. whom', 'D. whose'], correct: 'A. who' },
            { id: 'q4', num: 4, qText: 'They decided to __________ their business in the bustling city center.', options: ['A. set up', 'B. turn down', 'C. pass down', 'D. close down'], correct: 'A. set up' }
          ]
        }
      ];

      readingTasks = [
        {
          task_title: 'TASK 1: READING COMPREHENSION',
          task_desc: 'Read text about city life and choose True or False.',
          questions: [
            { id: 'q5', num: 5, qText: 'Urban sprawl and traffic jams are major problems in modern metropolises.', options: ['A. True', 'B. False'], correct: 'A. True' }
          ]
        }
      ];

      commTasks = [
        {
          task_title: 'TASK 1: COMMUNICATION PRACTICE',
          task_desc: 'Order conversation about coping with stress.',
          questions: [
            { id: 'q6', num: 6, qText: 'a. I am frustrated about exam pressure. / b. You should talk to a counselor.', options: ['A. a - b', 'B. b - a'], correct: 'A. a - b' }
          ]
        }
      ];

      writingTasks = [
        {
          task_title: 'TASK 1: SENTENCE REWRITING',
          task_desc: 'Rewrite using Phrasal Verbs or Relative Clauses.',
          questions: [
            { id: 'q7', num: 7, qText: 'This is the craft village. I visited it last year. -> This is the craft village...', options: ['A. This is the craft village which I visited last year.'], correct: 'A. This is the craft village which I visited last year.' }
          ]
        }
      ];
    }

    setDynamicWorksheet({
      title: `TRUNG TÂM HOA MAI MR HAI – ENGLISH GRADE ${grade} – ${unitTitleStr.toUpperCase()}`,
      subtitle: `Getting Started & ${section} – Vocabulary & Skills Practice`,
      contact: `English with Mr Hai – 0384635199`,
      tapescript: tapescriptText,
      sections: [
        { id: 'listening', title: '1  LISTENING SECTION', enabled: activeSections.listening, tasks: listeningTasks },
        { id: 'knowledge', title: '2  KNOWLEDGE OF LANGUAGE', enabled: activeSections.knowledge, tasks: knowledgeTasks },
        { id: 'reading', title: '3  READING (ĐỌC HIỂU)', enabled: activeSections.reading, tasks: readingTasks },
        { id: 'communication', title: '4  COMMUNICATION (GIAO TIẾP)', enabled: activeSections.communication, tasks: commTasks },
        { id: 'writing', title: '5  WRITING (VIẾT SÁNG TẠO)', enabled: activeSections.writing, tasks: writingTasks }
      ]
    });
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

  const handleStudentSelectOption = (qId, optionText) => {
    soundFX.playClick();
    setStudentAnswers(prev => ({ ...prev, [qId]: optionText }));
  };

  const handleSubmitStudentTest = () => {
    soundFX.playClick();
    if (!dynamicWorksheet) return;

    let total = 0;
    let correctCount = 0;

    dynamicWorksheet.sections.forEach(sec => {
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

  const handlePrint = () => {
    soundFX.playClick();
    window.print();
  };

  const handleCopyWordTab = () => {
    if (!dynamicWorksheet) return;
    soundFX.playClick();
    let text = `${dynamicWorksheet.title}\n${dynamicWorksheet.subtitle}\n${dynamicWorksheet.contact}\n\n`;

    dynamicWorksheet.sections.forEach(sec => {
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

  // Get available unit list for current grade
  const availableGradeUnits = Object.keys(GlobalSuccessKnowledgeBase?.DATA?.[gradeLevel] || GlobalSuccessKnowledgeBase?.DATA?.[6] || {});

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 space-y-6 animate-fadeIn">
      
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

      {/* Embedded AI Studio Explanation & Iframe View */}
      {showAIStudioEmbed && (
        <div className="glass-panel p-6 space-y-4 border-purple-500/50 animate-fadeIn bg-slate-900/95">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-extrabold text-purple-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Hướng Dẫn Nhúng & Chạy Web App Google AI Studio Của Thầy Trực Tiếp
              </span>
              <p className="text-xs text-slate-400 mt-1">
                "Nhúng" có nghĩa là đưa trực tiếp trang Web App AI Studio của Thầy vào khung hình dưới đây. Thầy chỉ cần dán đường link App AI Studio của Thầy, ứng dụng sẽ chạy 100% trực tiếp trên trang web này!
              </p>
            </div>

            <button onClick={() => setShowAIStudioEmbed(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={aiStudioUrl}
              onChange={(e) => setAiStudioUrl(e.target.value)}
              placeholder="Dán đường link Web App AI Studio của Thầy tại đây (ví dụ: https://aistudio.google.com/...)..."
              className="glass-input text-xs flex-1"
            />
            <button
              onClick={() => soundFX.playClick()}
              className="glass-button-accent text-xs px-4 py-2 font-bold"
            >
              Nạp Web App AI Studio
            </button>
          </div>

          <div className="w-full h-[650px] rounded-2xl overflow-hidden border border-slate-800 bg-white shadow-2xl">
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
        <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          Trang xem trước bản in (Chuẩn khổ giấy A4 dọc)
        </span>

        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <button 
            onClick={() => {
              soundFX.playClick();
              generateDynamicWorksheetContent(gradeLevel, selectedUnits, lessonSection);
            }} 
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/40 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sinh Đề Tương Tự Lớp {gradeLevel}
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
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">CHỌN KHỐI LỚP (TỰ ĐỘNG ĐỔI ĐỀ CÂU HỎI):</label>
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
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
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

            {/* Banner 12 Units Dropdown Selector (Có thể nhấp mở danh sách 12 Unit) */}
            <div className="relative">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setShowUnitDropdown(!showUnitDropdown);
                }}
                className="w-full p-3.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/40 flex items-center justify-between text-xs font-extrabold text-emerald-200 transition-all"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> TUYỂN TẬP 12 UNITS (LỚP {gradeLevel})
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-800 text-[10px] font-black">
                    {selectedUnits.length} UNIT{selectedUnits.length > 1 ? 'S' : ''}
                  </span>
                  {showUnitDropdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Multi-select Unit Dropdown Modal */}
              {showUnitDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 p-3 rounded-2xl bg-slate-900 border border-emerald-500/50 shadow-2xl z-30 space-y-2 max-h-64 overflow-y-auto animate-fadeIn">
                  <span className="text-[11px] font-bold text-slate-400 block border-b border-slate-800 pb-1.5">
                    Tick chọn các Unit bài học Khối {gradeLevel} cần ôn tập:
                  </span>
                  {availableGradeUnits.map((uKey, uIdx) => {
                    const isChecked = selectedUnits.includes(uKey);
                    return (
                      <button
                        key={uIdx}
                        onClick={() => handleUnitToggle(uKey)}
                        className={`w-full p-2.5 rounded-xl text-xs font-semibold text-left transition-all flex items-center justify-between ${
                          isChecked ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate mr-2">{uKey}</span>
                        {isChecked && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Card 2: Kiến Thức Trọng Tâm Ôn Tập */}
          <div className="glass-panel p-6 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-indigo-400" />
              KIẾN THỨC TRỌNG TÂM ÔN TẬP (LỚP {gradeLevel})
            </h4>
            <p className="text-[11px] text-slate-400">
              Tick chọn các điểm ngữ pháp/từ vựng cốt lõi của các Unit đã chọn để AI định hướng chính xác nhất
            </p>

            <div className="space-y-2 pt-2">
              {selectedGrammar.map((gItem, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer text-xs font-bold text-indigo-200 hover:bg-slate-800">
                  <input type="checkbox" defaultChecked className="accent-indigo-500 w-4 h-4 rounded" />
                  <span className="truncate">{gItem}</span>
                  <span className="ml-auto text-[10px] text-slate-400 shrink-0">LỚP {gradeLevel}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Card 3: Sinh Đề Tự Soạn & Dạng Bài (Có mũi tên sổ xuống mở rộng tùy chọn) */}
          <div className="glass-panel p-6 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                SINH ĐỀ TỰ SOẠN & DẠNG BÀI
              </h4>
              <p className="text-[11px] text-slate-400">Tích chọn và nhấp mũi tên để mở rộng tùy chọn dạng bài</p>
            </div>

            <div className="space-y-2">
              {[
                { key: 'listening', num: 1, name: 'LISTENING (Nghe hiểu)', bg: 'bg-purple-500/20 text-purple-300', desc: 'Bài nghe trắc nghiệm & điền từ' },
                { key: 'knowledge', num: 2, name: 'KNOWLEDGE OF LANGUAGE', bg: 'bg-indigo-500/20 text-indigo-300', desc: 'Từ vựng & Ngữ pháp trọng tâm' },
                { key: 'reading', num: 3, name: 'READING (Đọc hiểu)', bg: 'bg-emerald-500/20 text-emerald-300', desc: 'Đoạn văn đọc hiểu & Đúng/Sai' },
                { key: 'communication', num: 4, name: 'COMMUNICATION (Giao tiếp)', bg: 'bg-amber-500/20 text-amber-300', desc: 'Sắp xếp hội thoại giao tiếp' },
                { key: 'writing', num: 5, name: 'WRITING (Viết sáng tạo)', bg: 'bg-rose-500/20 text-rose-300', desc: 'Viết lại câu không đổi nghĩa' }
              ].map((item) => {
                const isChecked = activeSections[item.key];
                const isExpanded = expandedSections[item.key];

                return (
                  <div key={item.key} className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden transition-all">
                    
                    {/* Header Row with Checkbox & Chevron Expand Button */}
                    <div className="flex items-center justify-between p-3 text-xs font-bold cursor-pointer hover:bg-slate-800/60">
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSectionCheckbox(item.key)}
                          className="accent-indigo-500 w-4 h-4 rounded"
                        />
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-black ${item.bg}`}>
                          {item.num}
                        </span>
                        <span className="text-slate-200">{item.name}</span>
                      </label>

                      {/* Interactive Chevron Click */}
                      <button
                        type="button"
                        onClick={() => toggleAccordionSection(item.key)}
                        className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Accordion Expanded Details View */}
                    {isExpanded && (
                      <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-xs space-y-2 text-slate-300 animate-fadeIn">
                        <p className="italic text-[11px] text-slate-400"> Mô tả dạng bài: {item.desc}</p>
                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          <span>Trạng thái xuất hiện:</span>
                          <span className={isChecked ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {isChecked ? '✓ Đang xuất hiện trên phiếu' : '✕ Đã ẩn'}
                          </span>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT MAIN PREVIEW WORKSHEET CANVAS (A4 Paper View - 8 Cols) */}
        <div className="lg:col-span-8">
          
          {dynamicWorksheet ? (
            <div className="bg-white text-slate-950 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-8 font-sans border border-slate-200 print:shadow-none print:p-0 animate-fadeIn">
              
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
                  {dynamicWorksheet.title}
                </h1>
                <p className="text-sm font-semibold text-indigo-600">
                  {dynamicWorksheet.subtitle}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200">
                  📞 {dynamicWorksheet.contact}
                </div>
              </div>

              {/* Config Summary Pill Box */}
              {showConfigSummary && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-600 text-center space-y-1">
                  <div>⚙️ Cấu hình ôn tập: &nbsp; <strong>Lớp: Grade {gradeLevel}</strong> &nbsp;|&nbsp; <strong>Units chọn: {(selectedUnits || []).join(', ')}</strong> &nbsp;|&nbsp; <strong>Phần học: {lessonSection}</strong></div>
                  <div className="text-indigo-600">Chủ điểm đã chọn: {(selectedGrammar || []).join(', ')}</div>
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
                {dynamicWorksheet.sections.map((sec) => {
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
                            <span>KỊCH BẢN NGHE - TAPESCRIPT (LỚP {gradeLevel})</span>
                            <button onClick={() => handlePlayAudio(dynamicWorksheet.tapescript)} className="text-indigo-600 flex items-center gap-1 font-bold">
                              <Volume2 className="w-4 h-4" /> Bật Giọng Đọc Audio
                            </button>
                          </div>
                          <p className="italic text-slate-700 leading-relaxed">{dynamicWorksheet.tapescript}</p>
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
          ) : (
            <div className="glass-panel p-12 text-center text-slate-400 space-y-2">
              <RefreshCw className="w-8 h-8 text-indigo-400 mx-auto animate-spin" />
              <p className="text-sm font-bold text-white">Đang khởi tạo phiếu bài tập Lớp {gradeLevel}...</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
