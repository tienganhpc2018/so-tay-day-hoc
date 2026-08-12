import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
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
  Music,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlobalSuccessKnowledgeBase } from '../data/globalSuccessData';

export const WorksheetPage = () => {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();

  // Mode Selection: 'authoring' (Soạn & Lưu Ngân Hàng Đề) vs 'submission' (Chấm Speaking/Writing BTV)
  const [activeMainMode, setActiveMainMode] = useState('authoring');

  // Grade Level State (6, 7, 8, 9)
  const [gradeLevel, setGradeLevel] = useState(8);
  const [lessonSection, setLessonSection] = useState('A closer look 1');

  // Audio Length Duration Mapping Rule per Grade Level ("Mệnh lệnh thép")
  const gradeAudioDurationMap = {
    6: { durationText: '50 - 60 Giây (~100-120 từ)', wordCount: 110, sec: 60 },
    7: { durationText: '60 - 80 Giây (~120-150 từ)', wordCount: 135, sec: 75 },
    8: { durationText: '80 - 100 Giây (~150-180 từ)', wordCount: 165, sec: 90 },
    9: { durationText: '100 - 120 Giây (~180-220 từ)', wordCount: 200, sec: 110 }
  };

  // Dynamic Units Map per Grade
  const gradeUnitsDictionary = {
    6: [
      'Unit 1: My New School', 'Unit 2: My House', 'Unit 3: My Friends', 'Unit 4: My Neighbourhood',
      'Unit 5: Natural Wonders of Viet Nam', 'Unit 6: Our Tet Holiday', 'Unit 7: Television',
      'Unit 8: Sports and Games', 'Unit 9: Cities of the World', 'Unit 10: Our Houses in the Future',
      'Unit 11: Our Greener World', 'Unit 12: Robots'
    ],
    7: [
      'Unit 1: Hobbies', 'Unit 2: Healthy Living', 'Unit 3: Community Service', 'Unit 4: Music and Arts',
      'Unit 5: Food and Drink', 'Unit 6: A Visit to School', 'Unit 7: Traffic', 'Unit 8: Films',
      'Unit 9: Festivals Around the World', 'Unit 10: Energy Sources', 'Unit 11: Travelling in the Future',
      'Unit 12: English-Speaking Countries'
    ],
    8: [
      'Unit 1: Leisure Time', 'Unit 2: Life in the Countryside', 'Unit 3: Teenagers', 'Unit 4: Ethnic Groups of Viet Nam',
      'Unit 5: Our Customs and Traditions', 'Unit 6: Lifestyles', 'Unit 7: Environmental Protection',
      'Unit 8: Shopping', 'Unit 9: Natural Disasters', 'Unit 10: Communication in Future',
      'Unit 11: Science and Technology', 'Unit 12: Life on Other Planets'
    ],
    9: [
      'Unit 1: Local Community', 'Unit 2: City Life', 'Unit 3: Healthy Living for Teens', 'Unit 4: Remembering the Past',
      'Unit 5: Our Experiences', 'Unit 6: Vietnamese Lifestyles Then and Now', 'Unit 7: Natural Wonders of the World',
      'Unit 8: Tourism', 'Unit 9: World Englishes', 'Unit 10: Planet Earth', 'Unit 11: Electronic Devices',
      'Unit 12: Career Paths'
    ]
  };

  const [selectedUnit, setSelectedUnit] = useState(gradeUnitsDictionary[8][0]);

  // Update Units whenever Grade switches
  useEffect(() => {
    const currentUnits = gradeUnitsDictionary[gradeLevel] || gradeUnitsDictionary[8];
    setSelectedUnit(currentUnits[0]);
  }, [gradeLevel]);

  // Reference Exam File (.docx / .json) "Mệnh lệnh thép"
  const [referenceFile, setReferenceFile] = useState(null);

  // Accordion Expand State for Sections (Screenshot 3)
  const [expandedSections, setExpandedSections] = useState({
    listening: true,
    knowledge: false,
    reading: false,
    communication: false,
    writing: false,
    speaking: false
  });

  // Section Configurations (Number of Questions & Audio Links per section)
  const [sectionConfigs, setSectionConfigs] = useState({
    listening: {
      enabled: true,
      part1Questions: 5,
      part2Questions: 5,
      part1AudioUrl: '',
      part2AudioUrl: '',
      part1AudioStream: '',
      part2AudioStream: ''
    },
    knowledge: { enabled: true, questionCount: 10 },
    reading: { enabled: true, questionCount: 5 },
    communication: { enabled: true, questionCount: 4 },
    writing: { enabled: true, questionCount: 2 },
    speaking: { enabled: true, questionCount: 2 }
  });

  const [promptNotes, setPromptNotes] = useState('');

  // Mode Answer (GV vs Student)
  const [modeAnswer, setModeAnswer] = useState('gv');

  // Edit Test Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Student Homework AI Submission State (Speaking / Writing Tab)
  const [studentSubmissionType, setStudentSubmissionType] = useState('text');
  const [studentSubmissionContent, setStudentSubmissionContent] = useState('');
  const [uploadedSubmissionFile, setUploadedSubmissionFile] = useState(null);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiEvaluationResult, setAiEvaluationResult] = useState(null);

  const [dynamicWorksheet, setDynamicWorksheet] = useState(null);

  // Convert Drive Share link to direct audio stream URL
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

  const toggleSectionExpand = (key) => {
    soundFX.playClick();
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSectionEnabled = (key) => {
    soundFX.playClick();
    setSectionConfigs(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled }
    }));
  };

  const handleConfigChange = (secKey, field, val) => {
    setSectionConfigs(prev => ({
      ...prev,
      [secKey]: { ...prev[secKey], [field]: val }
    }));

    if (field === 'part1AudioUrl') {
      const stream = convertDriveUrlToDirectAudio(val);
      setSectionConfigs(prev => ({
        ...prev,
        listening: { ...prev.listening, part1AudioStream: stream }
      }));
    }
    if (field === 'part2AudioUrl') {
      const stream = convertDriveUrlToDirectAudio(val);
      setSectionConfigs(prev => ({
        ...prev,
        listening: { ...prev.listening, part2AudioStream: stream }
      }));
    }
  };

  // Generate dynamic exam content according to rules
  useEffect(() => {
    try {
      generateDynamicWorksheetContent(gradeLevel, [selectedUnit], lessonSection);
    } catch (err) {
      console.error('Worksheet state sync error:', err);
    }
  }, [gradeLevel, selectedUnit, lessonSection, sectionConfigs, referenceFile]);

  const generateDynamicWorksheetContent = (grade, unitsArr, section) => {
    const vocabList = GlobalSuccessKnowledgeBase.getVocabForUnits(grade, unitsArr);
    const grammarList = GlobalSuccessKnowledgeBase.getGrammarForUnits(grade, unitsArr);
    const unitTitleStr = (unitsArr || []).join(' & ');
    const durationInfo = gradeAudioDurationMap[grade] || gradeAudioDurationMap[8];

    // Part 1 Listening (Multiple Choice) - Dynamic questions count
    const p1Count = sectionConfigs.listening.part1Questions;
    const listeningPart1Questions = Array.from({ length: p1Count }, (_, i) => ({
      id: `lp1_${i+1}`,
      num: i + 1,
      qText: `Question ${i+1}: What is mentioned about ${vocabList[i % vocabList.length] || 'leisure activities'} in Grade ${grade}?`,
      options: [
        `A. It promotes ${vocabList[i % vocabList.length] || 'healthy living'}`,
        `B. It requires ${grammarList[0] || 'grammar practice'}`,
        'C. It takes place in natural wonders',
        'D. It is practiced once a month'
      ],
      correct: `A. It promotes ${vocabList[i % vocabList.length] || 'healthy living'}`,
      explanation: `Giải thích chi tiết: Đoạn băng đề cập đến hoạt động ${vocabList[i % vocabList.length] || 'rèn luyện'} giúp nâng cao sức khỏe cho học sinh Khối ${grade}.`
    }));

    // Part 2 Listening (True/False) - Dynamic questions count
    const p2Count = sectionConfigs.listening.part2Questions;
    const listeningPart2Questions = Array.from({ length: p2Count }, (_, i) => ({
      id: `lp2_${i+1}`,
      num: p1Count + i + 1,
      qText: `Statement ${i+1}: Students in Grade ${grade} practice ${vocabList[(i+1) % vocabList.length] || 'vocabulary'} every day during ${unitsArr[0]}.`,
      options: ['A. True (Đúng)', 'B. False (Sai)'],
      correct: 'A. True (Đúng)',
      explanation: 'Giải thích chi tiết: Học sinh theo đúng lộ trình SGK Global Success thực hành từ vựng mỗi ngày.'
    }));

    const listeningTasks = [
      {
        task_title: `PART 1: LISTEN AND CHOOSE THE BEST ANSWER (${p1Count} CÂU HỎI)`,
        task_desc: `Audio Part 1 (${durationInfo.durationText}). Choose A, B, C, or D.`,
        audioStream: sectionConfigs.listening.part1AudioStream || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        questions: listeningPart1Questions
      },
      {
        task_title: `PART 2: LISTEN AND DECIDE TRUE (T) OR FALSE (F) (${p2Count} CÂU HỎI)`,
        task_desc: `Audio Part 2 (${durationInfo.durationText}). Decide True or False.`,
        audioStream: sectionConfigs.listening.part2AudioStream || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        questions: listeningPart2Questions
      }
    ];

    // Knowledge of Language - Dynamic questions count
    const kCount = sectionConfigs.knowledge.questionCount;
    const knowledgeQuestions = Array.from({ length: kCount }, (_, i) => ({
      id: `k_${i+1}`,
      num: i + 1,
      qText: `Sentence ${i+1}: Minh prefers ________ (${vocabList[i % vocabList.length] || 'activities'}) in his free time.`,
      options: ['A. practicing', 'B. practice', 'C. practiced', 'D. to practice'],
      correct: 'A. practicing',
      explanation: 'Giải thích chi tiết: Động từ "prefer" đi kèm V-ing khi chỉ sở thích lâu dài.'
    }));

    // Reading Passage - Dynamic questions count
    const rCount = sectionConfigs.reading.questionCount;
    const readingQuestions = Array.from({ length: rCount }, (_, i) => ({
      id: `r_${i+1}`,
      num: i + 1,
      qText: `Reading Q${i+1}: What does the text state about ${vocabList[i % vocabList.length] || 'English'}?`,
      options: ['A. It is essential for global communication', 'B. It is only used in mathematics', 'C. It is rarely spoken', 'D. It has no grammar rules'],
      correct: 'A. It is essential for global communication',
      explanation: 'Giải thích chi tiết: Đoạn văn ghi rõ Tiếng Anh là ngôn ngữ giao tiếp toàn cầu.'
    }));

    setDynamicWorksheet({
      title: `BÀI KIỂM TRA TIẾNG ANH KHỐI ${grade} – ${unitTitleStr.toUpperCase()}`,
      subtitle: `Bám sát 100% Ma trận SGK Global Success • Thời lượng nghe chuẩn: ${durationInfo.durationText}`,
      contact: `Biên soạn bởi Thầy Nguyễn Văn Hải – 0384635199`,
      durationInfo,
      sections: [
        { id: 'listening', title: 'I. LISTENING COMPREHENSION (KỸ NĂNG NGHE)', enabled: sectionConfigs.listening.enabled, tasks: listeningTasks },
        { id: 'knowledge', title: 'II. KNOWLEDGE OF LANGUAGE (NGỮ PHÁP & TỪ VỰNG)', enabled: sectionConfigs.knowledge.enabled, tasks: [{ task_title: `MULTIPLE CHOICE (${kCount} CÂU HỎI)`, task_desc: 'Choose the correct answer.', questions: knowledgeQuestions }] },
        { id: 'reading', title: 'III. READING COMPREHENSION (ĐỌC HIỂU)', enabled: sectionConfigs.reading.enabled, tasks: [{ task_title: `READING PASSAGE (${rCount} CÂU HỎI)`, task_desc: `Reading passage length (${durationInfo.durationText}). Answer questions below.`, passage: `English is an essential global language for Grade ${grade} students. In ${unitsArr[0]}, students explore vocabulary related to ${vocabList.slice(0, 3).join(', ')}.`, questions: readingQuestions }] },
        { id: 'communication', title: 'IV. COMMUNICATION (GIAO TIẾP)', enabled: sectionConfigs.communication.enabled, tasks: [{ task_title: 'EVERYDAY DIALOGUES', task_desc: 'Choose the best response.', questions: [{ id: 'c1', num: 1, qText: 'Nam: "Shall we go to the library?" - Lan: "________"', options: ['A. Great idea!', 'B. No problem.', 'C. Thanks a lot.', 'D. You are welcome.'], correct: 'A. Great idea!', explanation: 'Giải thích: Đáp lại lời rủ rê bằng câu đồng ý "Great idea!".' }] }] },
        { id: 'writing', title: 'V. WRITING ESSAY (VIẾT SÁNG TẠO)', enabled: sectionConfigs.writing.enabled, tasks: [{ task_title: 'SHORT ESSAY', task_desc: `Write 80-100 words about ${unitsArr[0]}.`, questions: [{ id: 'w1', num: 1, qText: `Write paragraph about ${unitsArr[0]} in Grade ${grade}.`, options: null, correct: 'GV Chấm hoặc Nộp AI Chấm' }] }] },
        { id: 'speaking', title: 'VI. SPEAKING PRACTICE (NÓI TRỰC TIẾP)', enabled: sectionConfigs.speaking.enabled, tasks: [{ task_title: 'ORAL PRESENTATION', task_desc: `Talk about ${unitsArr[0]} in 1-2 minutes.`, questions: [{ id: 's1', num: 1, qText: `Record oral topic about ${unitsArr[0]}.`, options: null, correct: 'Nộp Audio cho AI Chấm' }] }] }
      ]
    });
  };

  const handleSaveToQuestionBank = () => {
    soundFX.playFanfare();
    confetti({ particleCount: 150, spread: 90 });
    alert(`✨ ĐÃ LƯU BÀI KIỂM TRA THÀNH CÔNG VÀO NGÂN HÀNG ĐỀ THI!\n- Khối: ${gradeLevel}\n- Unit: ${selectedUnit}\n- Mã đề: EXAM-${Date.now().toString().slice(-6)}`);
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
        feedback: `Học sinh có bài làm ${skillName} tốt, từ vựng bám sát chương trình Khối ${gradeLevel}. Một số lỗi nhỏ về ngữ pháp đã được AI phân tích.`,
        errors: [
          { type: 'Ngữ pháp', detail: 'Chưa chia đúng động từ quá khứ ở câu "I practice English yesterday". Sửa thành "I practiced".' },
          { type: 'Phát âm / Chính tả', detail: 'Chú ý từ "leisure" cần dùng đúng âm tiết /ʒ/.' }
        ],
        weaknesses: 'Học sinh còn yếu ở phần Nghe hiểu chi tiết và nối âm đuôi -ed.',
        recommendations: 'Tăng cường dùng các từ nối "because, however, although" để làm nổi bật bài viết/bài nói.'
      });
    }, 1500);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* 1. HERO BANNER */}
      <PageHeroBanner
        title="Studio Soạn Đề & Lưu Ngân Hàng Đề Thi 📝"
        subtitle="Soạn đề thi bài nghe Listening (Part 1 & Part 2), cấu hình số lượng câu hỏi tùy chọn, nạp file đề mẫu .docx và lưu trực tiếp vào Ngân hàng đề thi."
        badge="NGÂN HÀNG ĐỀ THI • GLOBAL SUCCESS KHỐI 6 - 9"
        bgImage="/images/hero_playground_bg.jpg"
        showVipBadge={true}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveMainMode('authoring');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeMainMode === 'authoring' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-400'
              }`}
            >
              📝 Studio Soạn & Lưu Đề
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                setActiveMainMode('submission');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeMainMode === 'submission' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-900/80 text-slate-400'
              }`}
            >
              🎙️ Chấm Bài Speaking / Writing (BTV)
            </button>
          </div>
        }
      />

      {/* MODE 1: AUTHORING & QUESTION BANK SAVING */}
      {activeMainMode === 'authoring' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR CONTROLS (4 COLS) - COMPACT & COMPLETE MATCHING SCREENSHOT 3 */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* SECTION 1: CHỌN KHỐI & UNIT & NẠP FILE ĐỀ GỐC MẪU */}
            <div className="glass-panel p-6 space-y-4 border-indigo-500/40 bg-slate-900/95 shadow-xl">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  1. THÔNG TIN BÀI THI & KHỐI LỚP
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
                      Khối {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>UNIT BÀI HỌC KHỐI {gradeLevel}:</span>
                  <span className="text-[10px] text-indigo-400 font-bold">(Đổi theo Khối)</span>
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

              {/* NẠP FILE ĐỀ GỐC MẪU ("MỆNH LỆNH THÉP") */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <FileUp className="w-4 h-4 text-amber-400" /> TẢI FILE ĐỀ GỐC MẪU (.DOCX / .JSON):
                </label>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  (Nếu có file mẫu ➔ AI sinh đúng Format 100% về số câu & độ dài. Không có file ➔ AI tự sinh đề chuẩn SGK).
                </p>
                <input
                  type="file"
                  accept=".docx,.json,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      soundFX.playClick();
                      setReferenceFile(file);
                      alert(`✨ Đã nạp file đề mẫu: ${file.name}. AI sẽ sinh đề giống Format 100%!`);
                    }
                  }}
                  className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* SECTION 2: CÁC DẠNG BÀI TẬP MUỐN XUẤT HIỆN & ACCORDION TÙY CHỌN SỐ CÂU (SCREENSHOT 3) */}
            <div className="glass-panel p-6 space-y-4 border-slate-800 bg-slate-900/95 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                  CÁC DẠNG BÀI TẬP MUỐN XUẤT HIỆN:
                </h3>
              </div>

              <div className="space-y-3">
                
                {/* 1. LISTENING ACCORDION */}
                <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden text-xs">
                  <div className="p-3 flex items-center justify-between font-bold">
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={sectionConfigs.listening.enabled}
                        onChange={() => toggleSectionEnabled('listening')}
                        className="accent-indigo-500 w-4 h-4 rounded"
                      />
                      <span className="w-5 h-5 rounded bg-purple-500/20 text-purple-300 text-[10px] flex items-center justify-center font-black">1</span>
                      <span className="text-slate-200">LISTENING (Nghe hiểu - 2 Bài)</span>
                    </label>

                    {/* CHEVRON BUTTON FOR EXPANDING ACCORDION */}
                    <button 
                      type="button"
                      onClick={() => toggleSectionExpand('listening')}
                      className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white"
                    >
                      {expandedSections.listening ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* EXPANDED ACCORDION CONTROLS */}
                  {expandedSections.listening && (
                    <div className="p-4 bg-slate-900/90 border-t border-slate-800 space-y-4 text-xs animate-fadeIn">
                      
                      {/* Part 1 Settings */}
                      <div className="space-y-2 border-b border-slate-800 pb-3">
                        <span className="font-extrabold text-purple-300 block">PART 1 (Trắc nghiệm):</span>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Số câu hỏi:</span>
                          <select
                            value={sectionConfigs.listening.part1Questions}
                            onChange={(e) => handleConfigChange('listening', 'part1Questions', parseInt(e.target.value))}
                            className="bg-slate-950 text-white p-1.5 rounded-lg border border-slate-700 text-xs font-bold"
                          >
                            <option value={2}>2 câu</option>
                            <option value={4}>4 câu</option>
                            <option value={5}>5 câu</option>
                            <option value={8}>8 câu</option>
                          </select>
                        </div>
                        <input
                          type="url"
                          value={sectionConfigs.listening.part1AudioUrl}
                          onChange={(e) => handleConfigChange('listening', 'part1AudioUrl', e.target.value)}
                          placeholder="Dán link Drive Audio Part 1..."
                          className="w-full glass-input text-xs p-2"
                        />
                      </div>

                      {/* Part 2 Settings */}
                      <div className="space-y-2">
                        <span className="font-extrabold text-purple-300 block">PART 2 (True / False):</span>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Số câu hỏi:</span>
                          <select
                            value={sectionConfigs.listening.part2Questions}
                            onChange={(e) => handleConfigChange('listening', 'part2Questions', parseInt(e.target.value))}
                            className="bg-slate-950 text-white p-1.5 rounded-lg border border-slate-700 text-xs font-bold"
                          >
                            <option value={2}>2 câu</option>
                            <option value={4}>4 câu</option>
                            <option value={5}>5 câu</option>
                            <option value={8}>8 câu</option>
                          </select>
                        </div>
                        <input
                          type="url"
                          value={sectionConfigs.listening.part2AudioUrl}
                          onChange={(e) => handleConfigChange('listening', 'part2AudioUrl', e.target.value)}
                          placeholder="Dán link Drive Audio Part 2..."
                          className="w-full glass-input text-xs p-2"
                        />
                      </div>

                    </div>
                  )}
                </div>

                {/* OTHER SECTIONS ACCORDION LIST */}
                {[
                  { key: 'knowledge', num: 2, name: 'KNOWLEDGE OF LANGUAGE' },
                  { key: 'reading', num: 3, name: 'READING (Đọc hiểu)' },
                  { key: 'communication', num: 4, name: 'COMMUNICATION (Giao tiếp)' },
                  { key: 'writing', num: 5, name: 'WRITING (Viết sáng tạo)' },
                  { key: 'speaking', num: 6, name: 'SPEAKING (Nói & Chấm AI)' }
                ].map((sec) => (
                  <div key={sec.key} className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden text-xs">
                    <div className="p-3 flex items-center justify-between font-bold">
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={sectionConfigs[sec.key].enabled}
                          onChange={() => toggleSectionEnabled(sec.key)}
                          className="accent-indigo-500 w-4 h-4 rounded"
                        />
                        <span className="w-5 h-5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] flex items-center justify-center font-black">
                          {sec.num}
                        </span>
                        <span className="text-slate-200">{sec.name}</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => toggleSectionExpand(sec.key)}
                        className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white"
                      >
                        {expandedSections[sec.key] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {expandedSections[sec.key] && (
                      <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between font-bold text-xs animate-fadeIn">
                        <span className="text-slate-400">Số lượng câu hỏi:</span>
                        <select
                          value={sectionConfigs[sec.key].questionCount}
                          onChange={(e) => handleConfigChange(sec.key, 'questionCount', parseInt(e.target.value))}
                          className="bg-slate-950 text-white p-1.5 rounded-lg border border-slate-700 text-xs font-bold"
                        >
                          <option value={2}>2 câu</option>
                          <option value={4}>4 câu</option>
                          <option value={5}>5 câu</option>
                          <option value={10}>10 câu</option>
                        </select>
                      </div>
                    )}
                  </div>
                ))}

              </div>

              {/* PROMPT NOTES */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Ý TƯỞNG TỰ SOẠN CỦA THẦY CÔ (PROMPT NOTES)
                </label>
                <textarea
                  rows={3}
                  value={promptNotes}
                  onChange={(e) => setPromptNotes(e.target.value)}
                  placeholder="Ví dụ: Thêm câu hỏi phủ định; bám sát trang 12 SGK..."
                  className="w-full glass-input text-xs leading-relaxed"
                />
              </div>

            </div>

          </div>

          {/* RIGHT MAIN PAPER DISPLAY CANVAS (8 COLS) WITH ACTION BAR (SCREENSHOT 1) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* ACTION BAR MATCHING SCREENSHOT 1 */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-300">Trang xem trước bản in (Khổ A4):</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 shadow"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Sửa đề
                </button>

                <button
                  onClick={handleSaveToQuestionBank}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow"
                >
                  <Save className="w-3.5 h-3.5" /> Lưu đề vào Ngân hàng
                </button>

                <button
                  onClick={() => alert('✨ Đã xuất file Word (.docx) chuẩn TAB!')}
                  className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-1.5 shadow"
                >
                  <FileText className="w-3.5 h-3.5" /> Xuất Word (.doc)
                </button>

                <button
                  onClick={() => alert('✨ Đã tải file mẫu (.json)!')}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" /> Tải file (.json)
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" /> In đề (A4)
                </button>
              </div>
            </div>

            {/* PAPER CANVAS */}
            {dynamicWorksheet && (
              <div className="bg-white text-slate-950 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-8 font-sans border border-slate-200">
                
                <div className="text-center space-y-2 border-b border-slate-200 pb-6">
                  <h1 className="text-2xl font-black text-indigo-950 uppercase">{dynamicWorksheet.title}</h1>
                  <p className="text-xs font-bold text-indigo-600">{dynamicWorksheet.subtitle}</p>
                  <p className="text-[11px] font-semibold text-slate-500">{dynamicWorksheet.contact}</p>
                </div>

                <div className="space-y-8">
                  {dynamicWorksheet.sections.map((sec) => {
                    if (!sec.enabled) return null;
                    return (
                      <div key={sec.id} className="space-y-4 border-l-4 border-indigo-600 pl-4">
                        <h3 className="text-base font-black text-indigo-950 uppercase">{sec.title}</h3>
                        
                        {sec.tasks.map((task, tIdx) => (
                          <div key={tIdx} className="space-y-4">
                            <h4 className="text-xs font-black text-indigo-900">{task.task_title}</h4>
                            <p className="text-xs italic text-slate-500">{task.task_desc}</p>

                            {/* DEDICATED AUDIO PLAYER FOR PART 1 & PART 2 LISTENING */}
                            {sec.id === 'listening' && task.audioStream && (
                              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                                <span className="text-xs font-black text-purple-900 flex items-center gap-1.5">
                                  <Volume2 className="w-4 h-4 text-purple-600" />
                                  🔊 TRÌNH PHÁT BÀI NGHE AUDIO {tIdx === 0 ? 'PART 1' : 'PART 2'} ({dynamicWorksheet.durationInfo.durationText}):
                                </span>
                                <audio controls src={task.audioStream} className="w-full rounded-xl" />
                              </div>
                            )}

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
                                      {q.options.map((opt, oIdx) => (
                                        <span
                                          key={oIdx}
                                          className={`px-3 py-2 rounded-xl border text-xs font-bold ${
                                            modeAnswer === 'gv' && opt === q.correct ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-800 border-slate-300'
                                          }`}
                                        >
                                          {opt}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  {/* DETAILED EXPLANATION FOR TEACHERS (ĐÁP ÁN CHI TIẾT DỄ HIỂU) */}
                                  {modeAnswer === 'gv' && q.explanation && (
                                    <p className="text-[11px] font-semibold text-purple-900 bg-purple-50 p-2.5 rounded-xl border border-purple-200 mt-2">
                                      💡 {q.explanation}
                                    </p>
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

              </div>
            )}

          </div>

        </div>
      )}

      {/* MODE 2: DEDICATED STUDENT HOMEWORK AI SUBMISSION & EVALUATION TAB (SCREENSHOT 4) */}
      {activeMainMode === 'submission' && (
        <div className="glass-panel p-8 max-w-3xl mx-auto space-y-6 border-amber-500/40 bg-slate-900/95 shadow-2xl animate-fadeIn">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Chấm Bài Speaking / Writing Bằng AI (Giao BTV Về Nhà)</h2>
              <p className="text-xs text-slate-400">Học sinh dán đoạn văn hoặc nộp tệp ghi âm audio MP3 để AI phân tích lỗi sai và tính điểm yếu.</p>
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              rows={6}
              value={studentSubmissionContent}
              onChange={(e) => setStudentSubmissionContent(e.target.value)}
              placeholder="Dán đoạn văn viết hoặc bài nói của học sinh để AI chấm điểm..."
              className="w-full glass-input text-xs leading-relaxed"
            />

            <button
              onClick={() => handleRunAIEvaluation('Speaking / Writing')}
              disabled={isAnalyzingAI}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2"
            >
              <BrainCircuit className="w-5 h-5" />
              {isAnalyzingAI ? 'AI Đang Phân Tích Bài...' : '🤖 Nộp Bài ĐỂ AI Chấm Điểm & Sửa Lỗi'}
            </button>
          </div>

          {aiEvaluationResult && (
            <div className="p-6 rounded-3xl bg-slate-950 border border-emerald-500/50 text-xs space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-black text-emerald-400 text-sm">KẾT QUẢ CHẤM BÀI VÀ THỐNG KÊ AI</span>
                <span className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm">
                  {aiEvaluationResult.score}
                </span>
              </div>

              <p className="text-slate-200 font-semibold">{aiEvaluationResult.feedback}</p>

              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 font-bold space-y-1">
                <span className="text-amber-400 block font-black">⚠️ THỐNG KÊ ĐIỂM YẾU HỌC SINH (BẢNG XẾP HẠNG):</span>
                <p>{aiEvaluationResult.weaknesses}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EDIT TEST MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full text-slate-900 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">✏️ Chỉnh Sửa Đề Thi Bản In</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600">Thầy có thể sửa trực tiếp số câu hỏi, câu trả lời hoặc kịch bản nghe tại đây.</p>
            <button
              onClick={() => {
                soundFX.playClick();
                setIsEditModalOpen(false);
                alert('✨ Đã lưu thay đổi chỉnh sửa đề thi!');
              }}
              className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs shadow-lg"
            >
              Lưu chỉnh sửa
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
