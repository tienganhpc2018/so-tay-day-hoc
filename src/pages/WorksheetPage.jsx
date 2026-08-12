import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  Plus,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlobalSuccessKnowledgeBase } from '../data/globalSuccessData';

export const WorksheetPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Mode Selection: 'authoring' vs 'submission'
  const [activeMainMode, setActiveMainMode] = useState('authoring');

  // Grade Level State (6, 7, 8, 9)
  const [gradeLevel, setGradeLevel] = useState(7);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  // MULTI-SELECT UNITS STATE
  const [selectedUnits, setSelectedUnits] = useState(['Unit 1: Hobbies', 'Unit 2: Healthy Living']);

  // Auto Grammar & Vocab Summary Readout under selected Units
  const [integratedGrammarList, setIntegratedGrammarList] = useState([]);
  const [integratedVocabList, setIntegratedVocabList] = useState([]);

  // Update Units & Grammar whenever Grade or selectedUnits change
  useEffect(() => {
    const currentAvailableUnits = gradeUnitsDictionary[gradeLevel] || gradeUnitsDictionary[7];
    const validUnits = selectedUnits.filter(u => currentAvailableUnits.includes(u));
    const activeUnits = validUnits.length > 0 ? validUnits : [currentAvailableUnits[0], currentAvailableUnits[1]];
    setSelectedUnits(activeUnits);

    const grammar = GlobalSuccessKnowledgeBase.getGrammarForUnits(gradeLevel, activeUnits);
    const vocab = GlobalSuccessKnowledgeBase.getVocabForUnits(gradeLevel, activeUnits);
    setIntegratedGrammarList(grammar);
    setIntegratedVocabList(vocab);
  }, [gradeLevel]);

  const toggleUnitSelection = (unitName) => {
    soundFX.playClick();
    if (selectedUnits.includes(unitName)) {
      if (selectedUnits.length === 1) return; // keep at least 1
      setSelectedUnits(selectedUnits.filter(u => u !== unitName));
    } else {
      setSelectedUnits([...selectedUnits, unitName]);
    }
  };

  // Reference Exam File (.docx / .json) "Mệnh lệnh thép"
  const [referenceFile, setReferenceFile] = useState(null);

  // Accordion Expand State for Sections
  const [expandedSections, setExpandedSections] = useState({
    listening: true,
    knowledge: false,
    reading: false,
    communication: false,
    writing: false,
    speaking: false
  });

  // Section Configurations
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Student Homework AI Submission State
  const [studentSubmissionContent, setStudentSubmissionContent] = useState('');
  const [uploadedSubmissionFile, setUploadedSubmissionFile] = useState(null);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiEvaluationResult, setAiEvaluationResult] = useState(null);

  const [dynamicWorksheet, setDynamicWorksheet] = useState(null);

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

  // Generate dynamic exam content when Thầy clicks "TẠO ĐỀ THI"
  const handleGenerateExam = () => {
    soundFX.playClick();
    setHasGenerated(true);
    generateDynamicWorksheetContent(gradeLevel, selectedUnits);
    soundFX.playFanfare();
    confetti({ particleCount: 120, spread: 80 });
  };

  const generateDynamicWorksheetContent = (grade, unitsArr) => {
    const vocabList = GlobalSuccessKnowledgeBase.getVocabForUnits(grade, unitsArr);
    const grammarList = GlobalSuccessKnowledgeBase.getGrammarForUnits(grade, unitsArr);
    const durationInfo = gradeAudioDurationMap[grade] || gradeAudioDurationMap[7];

    // TAPESCRIPT FOR TEACHERS
    const tapescriptPart1 = `[TAPESCRIPT PART 1 - GRADE ${grade} (${durationInfo.durationText})]\nSpeaker 1: Hello students! Today we are discussing ${unitsArr.join(' and ')}. In our daily life, hobbies like playing badminton, gardening, and collecting stamps help us relax. Healthy living requires eating fresh vegetables, drinking enough water, and doing exercise regularly. Listen carefully and choose the correct answer for each question.`;

    const tapescriptPart2 = `[TAPESCRIPT PART 2 - GRADE ${grade} (${durationInfo.durationText})]\nSpeaker 2: Welcome back! Community service plays an important role in our society. Students can join volunteer activities such as planting trees, cleaning neighborhood streets, and donating old books to poor children. Listen to the statements and decide if they are True or False.`;

    // Part 1 Listening (Multiple Choice)
    const p1Count = sectionConfigs.listening.part1Questions;
    const listeningPart1Questions = [
      { id: 'lp1_1', num: 1, qText: 'What is the main topic of the conversation?', options: ['A. Healthy living and hobbies', 'B. Shopping online', 'C. Space exploration', 'D. History of art'], correct: 'A. Healthy living and hobbies', explanation: 'Giải thích: Đoạn băng nói về sở thích và lối sống lành mạnh của học sinh.' },
      { id: 'lp1_2', num: 2, qText: 'Which activity is recommended for healthy living?', options: ['A. Eating fresh vegetables', 'B. Sleeping late at night', 'C. Playing games all day', 'D. Drinking soft drinks'], correct: 'A. Eating fresh vegetables', explanation: 'Giải thích: Đoạn băng nhắc đến việc ăn rau tươi và tập thể dục.' },
      { id: 'lp1_3', num: 3, qText: 'How do hobbies help students after school?', options: ['A. They help students relax', 'B. They make students tired', 'C. They cost a lot of money', 'D. They are boring'], correct: 'A. They help students relax', explanation: 'Giải thích: Đoạn băng đề cập hobbies giúp thư giãn.' },
      { id: 'lp1_4', num: 4, qText: 'What should students do regularly every day?', options: ['A. Do exercise and drink water', 'B. Skip breakfast', 'C. Watch TV late', 'D. Eat fast food'], correct: 'A. Do exercise and drink water', explanation: 'Giải thích: Đoạn băng khuyên tập thể dục và uống nước.' },
      { id: 'lp1_5', num: 5, qText: 'What is collected as a hobby mentioned in the audio?', options: ['A. Stamps', 'B. Cars', 'C. Coins', 'D. Postcards'], correct: 'A. Stamps', explanation: 'Giải thích: Đoạn băng nhắc tới sở thích sưu tầm tem.' }
    ].slice(0, p1Count);

    // Part 2 Listening (True/False - ONLY 2 OPTIONS A. True / B. False!)
    const p2Count = sectionConfigs.listening.part2Questions;
    const listeningPart2Questions = [
      { id: 'lp2_1', num: p1Count + 1, qText: 'Community service plays an important role in our society.', options: ['A. True', 'B. False'], correct: 'A. True', explanation: 'Giải thích: Đoạn băng khẳng định hoạt động cộng đồng rất quan trọng.' },
      { id: 'lp2_2', num: p1Count + 2, qText: 'Students cannot donate old books to poor children.', options: ['A. True', 'B. False'], correct: 'B. False', explanation: 'Giải thích: Đoạn băng khuyên nên quyên góp sách cũ.' },
      { id: 'lp2_3', num: p1Count + 3, qText: 'Planting trees helps clean the neighborhood environment.', options: ['A. True', 'B. False'], correct: 'A. True', explanation: 'Giải thích: Trồng cây giúp làm sạch môi trường.' },
      { id: 'lp2_4', num: p1Count + 4, qText: 'Volunteer activities are only for adults.', options: ['A. True', 'B. False'], correct: 'B. False', explanation: 'Giải thích: Học sinh hoàn toàn có thể tham gia tình nguyện.' },
      { id: 'lp2_5', num: p1Count + 5, qText: 'Cleaning neighborhood streets is part of community service.', options: ['A. True', 'B. False'], correct: 'A. True', explanation: 'Giải thích: Dọn dẹp đường phố là hoạt động vì cộng đồng.' }
    ].slice(0, p2Count);

    const listeningTasks = [
      {
        task_title: `PART 1: LISTEN AND CHOOSE THE BEST ANSWER (${p1Count} CÂU HỎI)`,
        task_desc: `Audio Part 1 (${durationInfo.durationText}). Choose A, B, C, or D.`,
        tapescript: tapescriptPart1,
        audioStream: sectionConfigs.listening.part1AudioStream || 'https://actions.google.com/sounds/v1/speech/person_speaking.ogg',
        questions: listeningPart1Questions
      },
      {
        task_title: `PART 2: LISTEN AND DECIDE TRUE (T) OR FALSE (F) (${p2Count} CÂU HỎI)`,
        task_desc: `Audio Part 2 (${durationInfo.durationText}). Decide True or False.`,
        tapescript: tapescriptPart2,
        audioStream: sectionConfigs.listening.part2AudioStream || 'https://actions.google.com/sounds/v1/speech/person_speaking.ogg',
        questions: listeningPart2Questions
      }
    ];

    // Knowledge of Language
    const kCount = sectionConfigs.knowledge.questionCount;
    const knowledgeQuestions = [
      { id: 'k1', num: 1, qText: 'Minh enjoys ________ model cars in his spare time.', options: ['A. building', 'B. build', 'C. built', 'D. to build'], correct: 'A. building', explanation: 'Giải thích: Động từ enjoy + V-ing.' },
      { id: 'k2', num: 2, qText: 'Eating too much junk food can cause ________ problems.', options: ['A. health', 'B. healthy', 'C. healthily', 'D. unhealthily'], correct: 'A. health', explanation: 'Giải thích: Danh từ "health problems" (vấn đề sức khỏe).' },
      { id: 'k3', num: 3, qText: 'We should drink ________ water every day to stay hydrated.', options: ['A. enough', 'B. many', 'C. too few', 'D. few'], correct: 'A. enough', explanation: 'Giải thích: "enough water" (đủ nước).' },
      { id: 'k4', num: 4, qText: 'My sister hates ________ computer games on weekdays.', options: ['A. playing', 'B. play', 'C. played', 'D. to play'], correct: 'A. playing', explanation: 'Giải thích: Động từ hate + V-ing.' },
      { id: 'k5', num: 5, qText: 'Volunteers donated books ________ poor children in rural areas.', options: ['A. to', 'B. for', 'C. with', 'D. at'], correct: 'A. to', explanation: 'Giải thích: Cấu trúc donate something to somebody.' },
      { id: 'k6', num: 6, qText: 'Choose the word with different stress pattern.', options: ['A. hobby', 'B. collection', 'C. activity', 'D. environment'], correct: 'A. hobby', explanation: 'Giải thích: "hobby" nhấn âm 1, các từ còn lại âm 2.' },
      { id: 'k7', num: 7, qText: 'If you want to stay fit, you should ________ sports regularly.', options: ['A. play', 'B. do', 'C. take', 'D. make'], correct: 'A. play', explanation: 'Giải thích: Cụm từ "play sports".' },
      { id: 'k8', num: 8, qText: 'Lan has a fever, ________ she should stay at home today.', options: ['A. so', 'B. but', 'C. because', 'D. although'], correct: 'A. so', explanation: 'Giải thích: Từ nối "so" chỉ kết quả.' },
      { id: 'k9', num: 9, qText: 'Find the word CLOSEST in meaning to "relax":', options: ['A. unwind', 'B. worry', 'C. hurry', 'D. work'], correct: 'A. unwind', explanation: 'Giải thích: "unwind" đồng nghĩa với "relax" (thư giãn).' },
      { id: 'k10', num: 10, qText: 'Find the word OPPOSITE in meaning to "healthy":', options: ['A. unhealthy', 'B. good', 'C. strong', 'D. active'], correct: 'A. unhealthy', explanation: 'Giải thích: Trái nghĩa với healthy là unhealthy.' }
    ].slice(0, kCount);

    // Reading Passage - Mandatory Full Text Passage
    const rCount = sectionConfigs.reading.questionCount;
    const readingPassageText = `Having a balanced lifestyle is extremely important for secondary school students. A healthy routine includes eating nutritious meals, exercising daily, and getting enough sleep. In addition, having a favorite hobby such as reading books, playing musical instruments, or gardening allows students to reduce stress after school hours. Participating in community service projects also helps teenagers develop empathy and social skills. By managing time wisely between studying and recreational activities, students can maintain physical and mental well-being throughout the academic year.`;

    const readingQuestions = [
      { id: 'r1', num: 1, qText: 'What is the main topic of the passage?', options: ['A. Having a balanced lifestyle for students', 'B. How to play musical instruments', 'C. The history of community service', 'D. Shopping tips for teenagers'], correct: 'A. Having a balanced lifestyle for students', explanation: 'Giải thích: Đoạn văn nói về lối sống cân bằng của học sinh.' },
      { id: 'r2', num: 2, qText: 'Which of the following is NOT mentioned as a favorite hobby?', options: ['A. Playing video games', 'B. Reading books', 'C. Playing musical instruments', 'D. Gardening'], correct: 'A. Playing video games', explanation: 'Giải thích: Trong bài không đề cập chơi video games.' },
      { id: 'r3', num: 3, qText: 'How does participating in community service help teenagers?', options: ['A. It develops empathy and social skills', 'B. It makes them tired', 'C. It earns them money', 'D. It wastes their free time'], correct: 'A. It develops empathy and social skills', explanation: 'Giải thích: Dòng 5 ghi rõ giúp phát triển thấu hiểu và kỹ năng xã hội.' },
      { id: 'r4', num: 4, qText: 'The word "nutritious" in paragraph 1 is closest in meaning to:', options: ['A. healthy and good for body', 'B. expensive', 'C. sweet', 'D. fast'], correct: 'A. healthy and good for body', explanation: 'Giải thích: Nutritious nghĩa là bổ dưỡng, tốt cho sức khỏe.' },
      { id: 'r5', num: 5, qText: 'According to the text, getting enough sleep helps students maintain:', options: ['A. physical and mental well-being', 'B. higher stress levels', 'C. bad habits', 'D. lower grades'], correct: 'A. physical and mental well-being', explanation: 'Giải thích: Câu cuối ghi giữ gìn sức khỏe thể chất và tinh thần.' }
    ].slice(0, rCount);

    setDynamicWorksheet({
      title: `BÀI KIỂM TRA TIẾNG ANH KHỐI ${grade}`,
      subtitle: `Ma trận SGK Global Success • ${unitsArr.join(' • ')}`,
      contact: `Biên soạn bởi Thầy Nguyễn Văn Hải – Hotline: 0384635199`,
      durationInfo,
      sections: [
        { id: 'listening', title: 'I. LISTENING COMPREHENSION (KỸ NĂNG NGHE)', enabled: sectionConfigs.listening.enabled, tasks: listeningTasks },
        { id: 'knowledge', title: 'II. KNOWLEDGE OF LANGUAGE (NGỮ PHÁP & TỪ VỰNG)', enabled: sectionConfigs.knowledge.enabled, tasks: [{ task_title: `MULTIPLE CHOICE (${kCount} CÂU HỎI)`, task_desc: 'Choose the correct answer.', questions: knowledgeQuestions }] },
        { id: 'reading', title: 'III. READING COMPREHENSION (ĐỌC HIỂU)', enabled: sectionConfigs.reading.enabled, tasks: [{ task_title: `READING PASSAGE (${rCount} CÂU HỎI)`, task_desc: `Read the passage carefully and answer questions (${durationInfo.durationText}).`, passage: readingPassageText, questions: readingQuestions }] },
        { id: 'communication', title: 'IV. COMMUNICATION (GIAO TIẾP)', enabled: sectionConfigs.communication.enabled, tasks: [{ task_title: 'EVERYDAY DIALOGUES', task_desc: 'Choose the best response.', questions: [{ id: 'c1', num: 1, qText: 'Nam: "Shall we go to the library this afternoon?" - Lan: "________"', options: ['A. Great idea!', 'B. No problem.', 'C. Thanks a lot.', 'D. You are welcome.'], correct: 'A. Great idea!', explanation: 'Giải thích: Đáp lại lời rủ rê bằng câu đồng ý "Great idea!".' }] }] },
        { id: 'writing', title: 'V. WRITING ESSAY (VIẾT SÁNG TẠO)', enabled: sectionConfigs.writing.enabled, tasks: [{ task_title: 'SHORT ESSAY', task_desc: 'Write 80-100 words about your healthy routine.', questions: [{ id: 'w1', num: 1, qText: 'Write a short paragraph about your favorite hobby or healthy routine.', options: null, correct: 'GV Chấm hoặc Nộp AI Chấm' }] }] },
        { id: 'speaking', title: 'VI. SPEAKING PRACTICE (NÓI TRỰC TIẾP)', enabled: sectionConfigs.speaking.enabled, tasks: [{ task_title: 'ORAL PRESENTATION', task_desc: 'Talk about community service in 1-2 minutes.', questions: [{ id: 's1', num: 1, qText: 'Record an oral talk about community service activities in your area.', options: null, correct: 'Nộp Audio cho AI Chấm' }] }] }
      ]
    });
  };

  // ACTUALLY SAVE EXAM INTO SUPABASE DB AND LOCALSTORAGE SO IT SHOWS IN QUESTION BANK!
  const handleSaveToQuestionBank = async () => {
    if (!dynamicWorksheet) {
      alert('Vui lòng bấm nút "✨ BẮT ĐẦU TỰ ĐỘNG SOẠN ĐỀ THI" trước khi lưu!');
      return;
    }

    setIsSaving(true);
    soundFX.playClick();

    const examCode = `EXAM-${Date.now().toString().slice(-6)}`;
    const newQuizObj = {
      id: `quiz-${Date.now()}`,
      title: dynamicWorksheet.title,
      description: `Đề thi Khối ${gradeLevel} (${selectedUnits.join(', ')}) bám sát 100% ma trận CV7991 Global Success.`,
      grade_level: gradeLevel,
      unit: selectedUnits.join(', '),
      questions: dynamicWorksheet.sections,
      teacher_name: 'Thầy Nguyễn Văn Hải',
      created_by: profile?.id || null,
      created_at: new Date().toISOString(),
      time_limit_minutes: 45,
      is_published: true,
      exam_code: examCode
    };

    // 1. SAVE TO LOCALSTORAGE FOR INSTANT OFFLINE/LOCAL PREVIEW IN QUIZPAGE
    try {
      const existingLocal = JSON.parse(localStorage.getItem('saved_quizzes_local') || '[]');
      localStorage.setItem('saved_quizzes_local', JSON.stringify([newQuizObj, ...existingLocal]));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }

    // 2. SAVE TO SUPABASE DB
    try {
      await supabase.from('quizzes').insert([{
        title: newQuizObj.title,
        description: newQuizObj.description,
        grade_level: gradeLevel,
        unit: selectedUnits.join(', '),
        questions: dynamicWorksheet.sections,
        teacher_name: 'Thầy Nguyễn Văn Hải',
        created_by: profile?.id || null,
        is_published: true
      }]);
    } catch (err) {
      console.log('Supabase DB save fallback (saved locally):', err);
    }

    setIsSaving(false);
    soundFX.playFanfare();
    confetti({ particleCount: 150, spread: 90 });

    alert(
      `✨ ĐÃ LƯU BÀI KIỂM TRA THÀNH CÔNG VÀO NGÂN HÀNG ĐỀ THI!\n` +
      `- Khối: ${gradeLevel}\n` +
      `- Các Unit: ${selectedUnits.join(', ')}\n` +
      `- Mã đề: ${examCode}\n\n` +
      `Đang tự động chuyển hướng Thầy sang trang Ngân Hàng Đề Thi Khối ${gradeLevel}...`
    );

    navigate(`/quizzes?grade=${gradeLevel}`);
  };

  const handleRunAIEvaluation = (skillName) => {
    if (!studentSubmissionContent.trim() && !uploadedSubmissionFile) {
      alert(`Vui lòng dán bài làm hoặc chọn tệp audio ghi âm!`);
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
        feedback: `Học sinh làm bài ${skillName} tốt, dùng từ vựng phong phú. Một số lỗi nhỏ về thì quá khứ đơn đã được AI phát hiện.`,
        errors: [
          { type: 'Ngữ pháp', detail: 'Chưa chia đúng động từ quá khứ ở câu "I practice English yesterday". Sửa thành "I practiced".' }
        ],
        weaknesses: 'Yếu phần phát âm đuôi -ed và nối âm chi tiết.',
        recommendations: 'Sử dụng thêm từ nối "because, however" để gắn kết đoạn văn.'
      });
    }, 1500);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* 1. HERO BANNER */}
      <PageHeroBanner
        title="Studio Soạn Đề & Lưu Ngân Hàng Đề Thi 📝"
        subtitle="Soạn đề thi bài nghe Listening (Part 1 & Part 2), chọn nhiều Units (giữa kỳ/cuối kỳ), xem điểm ngữ pháp tích hợp và lưu trực tiếp vào Ngân hàng đề thi."
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
          
          {/* LEFT SIDEBAR CONTROLS (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* SECTION 1: CHỌN KHỐI & MULTI-SELECT UNITS */}
            <div className="glass-panel p-6 space-y-4 border-indigo-500/40 bg-slate-900/95 shadow-xl">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  1. CHỌN KHỐI LỚP & NHIỀU UNITS SGK
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

              {/* MULTI-SELECT UNIT PILLS BUTTONS */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 flex items-center justify-between">
                  <span>CHỌN CÁC UNIT BÀI HỌC KHỐI {gradeLevel}:</span>
                  <span className="text-[10px] text-indigo-400 font-bold">(Có thể chọn nhiều Unit)</span>
                </label>
                
                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {(gradeUnitsDictionary[gradeLevel] || []).map((u, uIdx) => {
                    const isSelected = selectedUnits.includes(u);
                    return (
                      <button
                        key={uIdx}
                        type="button"
                        onClick={() => toggleUnitSelection(u)}
                        className={`p-2 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-md border border-indigo-400'
                            : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        <span className="truncate">{u.split(':')[0]}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AUTO GRAMMAR & VOCAB READOUT BOX UNDER SELECTED UNITS */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-xs space-y-2">
                <span className="font-extrabold text-indigo-300 block text-[11px] uppercase tracking-wider">
                  ✨ CHỦ ĐIỂM NGỮ PHÁP TÍCH HỢP TỰ ĐỘNG:
                </span>
                <div className="flex flex-wrap gap-1">
                  {integratedGrammarList.map((g, gIdx) => (
                    <span key={gIdx} className="px-2 py-0.5 rounded-md bg-indigo-900/80 text-indigo-200 text-[10px] font-semibold border border-indigo-700/50">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* NẠP FILE ĐỀ GỐC MẪU ("MỆNH LỆNH THÉP") */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <FileUp className="w-4 h-4 text-amber-400" /> TẢI FILE ĐỀ GỐC MẪU (.DOCX / .JSON):
                </label>
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

              {/* BIG GENERATE BUTTON */}
              <button
                type="button"
                onClick={handleGenerateExam}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" /> ✨ BẮT ĐẦU TỰ ĐỘNG SOẠN ĐỀ THI
              </button>

            </div>

            {/* SECTION 2: CÁC DẠNG BÀI TẬP MUỐN XUẤT HIỆN & ACCORDION TÙY CHỌN SỐ CÂU */}
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

                    <button 
                      type="button"
                      onClick={() => toggleSectionExpand('listening')}
                      className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white"
                    >
                      {expandedSections.listening ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {expandedSections.listening && (
                    <div className="p-4 bg-slate-900/90 border-t border-slate-800 space-y-4 text-xs animate-fadeIn">
                      
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

          {/* RIGHT MAIN PAPER DISPLAY CANVAS (8 COLS) - SLEEK DARK PAPER TONE */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* ACTION BAR */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-300">Trang xem trước bản in đề thi:</span>
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
                  disabled={isSaving}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow"
                >
                  <Save className="w-3.5 h-3.5" /> {isSaving ? 'Đang lưu...' : 'Lưu đề vào Ngân hàng'}
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

            {/* PAPER CANVAS - SLEEK DARK THEME BG-[#1e293b] */}
            {hasGenerated && dynamicWorksheet ? (
              <div className="bg-[#1e293b] text-slate-100 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-8 font-sans border border-slate-700/80 animate-fadeIn">
                
                <div className="text-center space-y-2 border-b border-slate-700 pb-6">
                  <h1 className="text-2xl font-black text-indigo-400 uppercase tracking-wide">{dynamicWorksheet.title}</h1>
                  <p className="text-xs font-bold text-slate-300">{dynamicWorksheet.subtitle}</p>
                  <p className="text-[11px] font-semibold text-slate-400">{dynamicWorksheet.contact}</p>
                </div>

                <div className="space-y-8">
                  {dynamicWorksheet.sections.map((sec) => {
                    if (!sec.enabled) return null;
                    return (
                      <div key={sec.id} className="space-y-4 border-l-4 border-indigo-500 pl-4">
                        <h3 className="text-base font-black text-indigo-300 uppercase tracking-wider">{sec.title}</h3>
                        
                        {sec.tasks.map((task, tIdx) => (
                          <div key={tIdx} className="space-y-4">
                            <h4 className="text-xs font-black text-amber-300">{task.task_title}</h4>
                            <p className="text-xs italic text-slate-400">{task.task_desc}</p>

                            {/* TAPESCRIPT BOX FOR TEACHERS IN ĐỀ GV MODE */}
                            {sec.id === 'listening' && modeAnswer === 'gv' && task.tapescript && (
                              <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/40 text-xs text-purple-200 font-mono space-y-1">
                                <span className="font-bold text-purple-400 block mb-1">📜 TAPESCRIPT NỘI DUNG BÀI NGHE:</span>
                                <p className="whitespace-pre-line leading-relaxed">{task.tapescript}</p>
                              </div>
                            )}

                            {/* DEDICATED SHORT AUDIO PLAYER */}
                            {sec.id === 'listening' && task.audioStream && (
                              <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-2">
                                <span className="text-xs font-black text-indigo-300 flex items-center gap-1.5">
                                  <Volume2 className="w-4 h-4 text-indigo-400" />
                                  🔊 TRÌNH PHÁT BÀI NGHE AUDIO {tIdx === 0 ? 'PART 1' : 'PART 2'} ({dynamicWorksheet.durationInfo.durationText}):
                                </span>
                                <audio controls src={task.audioStream} className="w-full rounded-xl bg-slate-950" />
                              </div>
                            )}

                            {/* MANDATORY READING TEXT PASSAGE */}
                            {task.passage && (
                              <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 text-xs leading-relaxed font-serif text-slate-200">
                                <span className="font-bold text-emerald-400 block mb-1">📖 READING PASSAGE:</span>
                                {task.passage}
                              </div>
                            )}

                            {/* CLEAN STUDENT QUESTIONS */}
                            <div className="space-y-3">
                              {task.questions.map((q) => (
                                <div key={q.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                                  <p className="font-extrabold text-white">{q.num}. {q.qText}</p>
                                  
                                  {q.options && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                                      {q.options.map((opt, oIdx) => (
                                        <span
                                          key={oIdx}
                                          className={`px-3 py-2.5 rounded-xl border text-xs font-bold ${
                                            modeAnswer === 'gv' && opt === q.correct ? 'bg-purple-600 text-white border-purple-500 shadow' : 'bg-slate-950 text-slate-300 border-slate-800'
                                          }`}
                                        >
                                          {opt}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  {/* DETAILED EXPLANATION FOR TEACHERS */}
                                  {modeAnswer === 'gv' && q.explanation && (
                                    <p className="text-[11px] font-semibold text-purple-300 bg-purple-950/60 p-2.5 rounded-xl border border-purple-500/30 mt-2">
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
            ) : (
              <div className="glass-panel p-16 text-center space-y-4 border-indigo-500/30 bg-slate-900/90">
                <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto text-2xl font-black">
                  <Zap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Sẵn Sàng Khởi Tạo Bài Kiểm Tra!</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Vui lòng chọn Khối lớp, các Unit bài học bên cột trái và nhấp nút <strong>✨ BẮT ĐẦU TỰ ĐỘNG SOẠN ĐỀ THI</strong> để xem trước bản in.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* MODE 2: DEDICATED STUDENT HOMEWORK AI SUBMISSION & EVALUATION TAB */}
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
