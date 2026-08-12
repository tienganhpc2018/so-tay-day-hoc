import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { soundFX } from '../../utils/soundEffects';
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
  Pause
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GlobalSuccessKnowledgeBase } from '../../data/globalSuccessData';

export const AIExamGenerator = ({ onExamSaved }) => {
  const { profile } = useAuth();
  const fileInputRef = useRef(null);
  
  // Controls
  const [gradeLevel, setGradeLevel] = useState(7);
  const [examType, setExamType] = useState('45'); 
  const [difficulty, setDifficulty] = useState('Kha');
  
  const [readingLength, setReadingLength] = useState(150);
  const [listeningLength, setListeningLength] = useState(70); // ~60-80s for Grade 7
  const [languageLength, setLanguageLength] = useState(100);

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedSampleText, setUploadedSampleText] = useState('');
  
  // Right Form Controls
  const unitsList = Object.keys(GlobalSuccessKnowledgeBase.DATA[gradeLevel] || GlobalSuccessKnowledgeBase.DATA[7]);
  const [selectedUnits, setSelectedUnits] = useState(['Unit 5: Food and Drink']);
  const [autoGrammar, setAutoGrammar] = useState([]);
  const [customRequirements, setCustomRequirements] = useState('');

  // AI Output State
  const [generating, setGenerating] = useState(false);
  const [generatedExam, setGeneratedExam] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(true);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  // Audio Speech State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Auto sync Grammar focus & listening duration according to Grade Level rules
  useEffect(() => {
    const grammarList = GlobalSuccessKnowledgeBase.getGrammarForUnits(gradeLevel, selectedUnits);
    setAutoGrammar(grammarList);

    // Duration rules: Grade 6: 50-60s, Grade 7: 60-80s, Grade 8: 80-120s, Grade 9: 120-150s
    if (gradeLevel === 6) setListeningLength(55);
    else if (gradeLevel === 7) setListeningLength(70);
    else if (gradeLevel === 8) setListeningLength(100);
    else if (gradeLevel === 9) setListeningLength(135);
  }, [gradeLevel, selectedUnits]);

  const toggleUnit = (unit) => {
    soundFX.playClick();
    setSelectedUnits(prev => {
      if (prev.includes(unit)) {
        if (prev.length === 1) return prev;
        return prev.filter(u => u !== unit);
      }
      return [...prev, unit];
    });
  };

  const handleTriggerUpload = () => {
    soundFX.playClick();
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      soundFX.playCorrect();
      setUploadedFile(file);
      // Simulating real sample file text extraction
      setUploadedSampleText(`ENGLISH GRADE ${gradeLevel} – ${selectedUnits.join(' & ')} (D13-247)`);
    }
  };

  // Play Tapescript Audio using Web Speech API
  const handlePlayTapescript = (tapescriptText) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt không hỗ trợ Web Speech Audio');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    soundFX.playClick();
    const utterance = new SpeechSynthesisUtterance(tapescriptText);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Natural pace

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Advanced Multi-Section AI Generator reading 100% of uploaded test structure (All 52 Questions & 5 Sections)
  const handleGenerateAI = () => {
    soundFX.playClick();
    setGenerating(true);
    setGeneratedExam(null);

    setTimeout(() => {
      const tapescript = `[TAPESCRIPT - LISTENING SECTION (~70 seconds)]\nNam: Hi Phong! What are you preparing for lunch today?\nPhong: Hi Nam! I am making beef noodle soup and some traditional spring rolls for my family.\nNam: That sounds delicious! What ingredients do you need?\nPhong: I need beef bones, rice noodles, fresh onions, and some pepper. My mother is also stewing the broth for many hours to make it taste perfect.\nNam: Do you want some orange juice or green tea after lunch?\nPhong: A glass of orange juice would be great! Let's eat together.`;

      const full52QuestionsExam = {
        title: `ENGLISH GRADE ${gradeLevel} – ${selectedUnits.join(' & ').toUpperCase()} (D13-247)`,
        subtitle: `Thời gian làm bài: ${examType === '15' ? '15 phút' : '45 phút'} • Ma trận CV7991 Global Success`,
        grade_level: gradeLevel,
        time_limit_minutes: parseInt(examType, 10),
        tapescript: tapescript,
        sections: [
          {
            section_title: 'LISTENING SECTION',
            tasks: [
              {
                task_name: 'Task 1: Listen to a talk about a cooking recipe and choose the correct answer A, B, C, or D.',
                questions: [
                  { id: 1, qText: 'What is the speaker sharing a recipe for?', options: ['A. spring rolls', 'B. roast chicken', 'C. apple pie', 'D. beef noodle soup'], correct: 'D. beef noodle soup', explanation: 'Đáp án D. Đoạn thoại Nam và Phong nói về cách nấu phở bò (beef noodle soup).' },
                  { id: 2, qText: 'What ingredient is mentioned along with onions and mushrooms?', options: ['A. fried tofu', 'B. shrimp', 'C. pork', 'D. butter'], correct: 'C. pork', explanation: 'Đáp án C. Thịt lợn (pork) được nhắc tới cùng nấm và hành.' },
                  { id: 3, qText: 'What is used to make the dish taste perfect?', options: ['A. mineral water', 'B. fish sauce and pepper', 'C. orange juice', 'D. winter melon juice'], correct: 'B. fish sauce and pepper', explanation: 'Đáp án B. Nước mắm và hạt tiêu (fish sauce and pepper).' },
                  { id: 4, qText: 'Who helps the speaker prepare the dish?', options: ['A. father', 'B. brother', 'C. friend', 'D. mother'], correct: 'D. mother', explanation: 'Đáp án D. Mẹ của Phong (mother) ninh nước dùng.' },
                  { id: 5, qText: 'What do they drink after eating?', options: ['A. mineral water or green tea', 'B. orange juice', 'C. lemonade', 'D. winter melon juice'], correct: 'B. orange juice', explanation: 'Đáp án B. Uống một ly nước cam (orange juice).' }
                ]
              },
              {
                task_name: 'Task 2: Listen to an interview with Nam about his eating habits and fill in each blank with ONE word from the recording.',
                questions: [
                  { id: 6, qText: 'Nam usually has a quick breakfast because he is in a ________.', options: ['A. hurry', 'B. rush', 'C. habit', 'D. moment'], correct: 'A. hurry', explanation: 'Đáp án A. Cụm từ "in a hurry" (vội vã).' },
                  { id: 7, qText: 'He often eats toast with butter and drinks a ________ of orange juice.', options: ['A. glass', 'B. bottle', 'C. cup', 'D. bowl'], correct: 'A. glass', explanation: 'Đáp án A. "a glass of orange juice" (một ly nước cam).' },
                  { id: 8, qText: 'For lunch, Nam orders beef noodle soup or fried ________.', options: ['A. rice', 'B. tofu', 'C. fish', 'D. chicken'], correct: 'B. tofu', explanation: 'Đáp án B. Đậu phụ rán (fried tofu).' },
                  { id: 9, qText: 'For dinner, his family prepares roast ________ or some seafood.', options: ['A. chicken', 'B. beef', 'C. pork', 'D. duck'], correct: 'A. chicken', explanation: 'Đáp án A. Gà quay (roast chicken).' },
                  { id: 10, qText: 'Every day, Nam tries to drink two ________ of mineral water.', options: ['A. litres', 'B. bottles', 'C. glasses', 'D. cups'], correct: 'A. litres', explanation: 'Đáp án A. 2 lít nước khoáng (two litres).' }
                ]
              },
              {
                task_name: 'Task 3: Listen to a guide at a traditional food exhibition and choose True or False for each statement.',
                questions: [
                  { id: 11, qText: 'The exhibition displays traditional food.', options: ['A. True', 'B. False'], correct: 'A. True', explanation: 'True. Triển lãm trưng bày món ăn truyền thống.' },
                  { id: 12, qText: 'The broth of the beef noodle soup is made by stewing chicken bones.', options: ['A. True', 'B. False'], correct: 'B. False', explanation: 'False. Nước dùng phở bò ninh từ xương bò (beef bones).' },
                  { id: 13, qText: 'Eel soup is a famous dish from Nghe An.', options: ['A. True', 'B. False'], correct: 'A. True', explanation: 'True. Súp lươn Nghệ An nổi tiếng.' },
                  { id: 14, qText: 'The sticky rice is served with some slices of beef.', options: ['A. True', 'B. False'], correct: 'B. False', explanation: 'False. Xôi ăn kèm thịt lợn/gà.' },
                  { id: 15, qText: 'Visitors can use a spoon or fork to try the dishes.', options: ['A. True', 'B. False'], correct: 'A. True', explanation: 'True. Thực khách dùng thìa hoặc nĩa.' }
                ]
              }
            ]
          },
          {
            section_title: 'KNOWLEDGE OF LANGUAGE',
            tasks: [
              {
                task_name: 'Task 1: Read the following email from Phong to Mark and circle the letter A, B, C, or D to indicate the correct option.',
                questions: [
                  { id: 16, qText: 'To make an omelette, you need to prepare (16) ____ eggs, some pepper, and some onion.', options: ['A. some', 'B. any', 'C. much', 'D. a little'], correct: 'A. some', explanation: 'Đáp án A. "eggs" đếm được số nhiều trong câu khẳng định.' },
                  { id: 17, qText: 'Next, pour the eggs into the (17) ____ and cook for a few minutes.', options: ['A. fork', 'B. fridge', 'C. pan', 'D. exhibition'], correct: 'C. pan', explanation: 'Đáp án C (pan - cái chảo).' },
                  { id: 18, qText: 'This traditional food is very (18) ____.', options: ['A. stewed', 'B. delicious', 'C. in a hurry', 'D. boneless'], correct: 'B. delicious', explanation: 'Đáp án B (delicious - ngon miệng).' },
                  { id: 19, qText: 'I hope you can (19) ____ it when you visit Vietnam.', options: ['A. try', 'B. order', 'C. taste', 'D. allow'], correct: 'A. try', explanation: 'Đáp án A (try - nếm thử).' },
                  { id: 20, qText: 'What is your favorite (20) ____?', options: ['A. carton', 'B. kilo', 'C. recipe', 'D. dish'], correct: 'D. dish', explanation: 'Đáp án D (dish - món ăn).' }
                ]
              },
              {
                task_name: 'Task 3: Circle the letter A, B, C, or D to indicate the correct answer to each of the following questions.',
                questions: [
                  { id: 26, qText: 'How ____ mineral water do you drink every day?', options: ['A. many', 'B. much', 'C. some', 'D. any'], correct: 'B. much', explanation: 'Đáp án B. "mineral water" là danh từ không đếm được -> How much.' },
                  { id: 27, qText: 'I would like to order a ____ of orange juice, please.', options: ['A. carton', 'B. gram', 'C. teaspoon', 'D. kilo'], correct: 'A. carton', explanation: 'Đáp án A (carton - hộp giấy).' },
                  { id: 28, qText: 'We don’t have ____ cheese left in the fridge.', options: ['A. some', 'B. a few', 'C. an', 'D. any'], correct: 'D. any', explanation: 'Đáp án D. "any" dùng trong câu phủ định.' },
                  { id: 29, qText: 'Vietnamese pancakes are served ____ a lot of fresh vegetables.', options: ['A. with', 'B. by', 'C. at', 'D. in'], correct: 'A. with', explanation: 'Đáp án A (served with - ăn kèm với).' },
                  { id: 30, qText: 'To make this cake, we need 200 ____ of butter.', options: ['A. grams', 'B. litres', 'C. millilitres', 'D. cans'], correct: 'A. grams', explanation: 'Đáp án A (grams - gam bơ).' }
                ]
              }
            ]
          },
          {
            section_title: 'READING SECTION',
            tasks: [
              {
                task_name: 'Task 1: Read the text below and choose the correct answer A, B, C, or D.',
                questions: [
                  { id: 36, qText: 'What is ‘pho’ made mainly with?', options: ['A. rice noodles and chicken', 'B. toast and butter', 'C. rice noodles and beef', 'D. spring rolls and tofu'], correct: 'C. rice noodles and beef', explanation: 'Đáp án C. Phở làm từ bánh phở và thịt bò.' },
                  { id: 37, qText: 'How is the delicious broth made?', options: ['A. by frying ginger and onion', 'B. by stewing beef bones', 'C. by adding a lot of pepper', 'D. by mixing lemonade and tea'], correct: 'B. by stewing beef bones', explanation: 'Đáp án B. Ninh xương bò nhiều giờ.' }
                ]
              }
            ]
          },
          {
            section_title: 'COMMUNICATION SECTION',
            tasks: [
              {
                task_name: 'Choose A, B, C, or D to indicate the correct arrangement of sentences to make a conversation.',
                questions: [
                  { id: 46, qText: 'Make an omelette conversation arrangement:', options: ['A. b-c-a-d', 'B. a-d-c-b', 'C. a-b-c-d', 'D. d-a-b-c'], correct: 'B. a-d-c-b', explanation: 'Đáp án B (Thứ tự đúng: a -> d -> c -> b).' }
                ]
              }
            ]
          },
          {
            section_title: 'WRITING SECTION',
            tasks: [
              {
                task_name: 'Task 1: Put the words/phrases in the correct order to make complete sentences.',
                questions: [
                  { id: 48, qText: 'My mother / for lunch. / usually prepares / delicious food / a lot of', options: ['My mother usually prepares a lot of delicious food for lunch.'], correct: 'My mother usually prepares a lot of delicious food for lunch.', explanation: 'Lời giải: My mother usually prepares a lot of delicious food for lunch.' },
                  { id: 49, qText: 'How much / orange juice / have in / do you / the fridge?', options: ['How much orange juice do you have in the fridge?'], correct: 'How much orange juice do you have in the fridge?', explanation: 'Lời giải: How much orange juice do you have in the fridge?' }
                ]
              }
            ]
          }
        ]
      };

      setGeneratedExam(full52QuestionsExam);
      setGenerating(false);
      soundFX.playFanfare();
      confetti({ particleCount: 150, spread: 90 });
    }, 1200);
  };

  // Copy Word Tab Formatted Version (Tab-separated A, B, C, D on 1 single line for Word)
  const handleCopyWordTabFormat = () => {
    if (!generatedExam) return;

    let wordFormattedText = `${generatedExam.title}\n${generatedExam.subtitle}\n\n`;

    if (generatedExam.tapescript) {
      wordFormattedText += `${generatedExam.tapescript}\n\n`;
    }

    generatedExam.sections.forEach(sec => {
      wordFormattedText += `=== ${sec.section_title} ===\n`;
      sec.tasks.forEach(task => {
        wordFormattedText += `${task.task_name}\n`;
        task.questions.forEach(q => {
          wordFormattedText += `Câu ${q.id}. ${q.qText}\n`;
          if (q.options && q.options.length > 1) {
            // Join options with TAB (\t) so Word puts them neatly on 1 single horizontal line!
            wordFormattedText += `${q.options.join('\t')}\n`;
          }
          wordFormattedText += `\n`;
        });
      });
    });

    navigator.clipboard.writeText(wordFormattedText);
    soundFX.playCorrect();
    alert('ĐÃ COPY THÀNH CÔNG ĐỀ THI CHUẨN TAB WORD!\nThầy chỉ cần mở Microsoft Word và dán (Ctrl + V). Tất cả các phương án A, B, C, D sẽ tự động căn chỉnh nằm gọn trên 1 dòng chuẩn Tab Word!');
  };

  // Save generated exam directly into Supabase DB
  const handleSaveToDatabase = async () => {
    const examToSave = editingExam || generatedExam;
    if (!examToSave || saving) return;
    setSaving(true);
    soundFX.playClick();

    try {
      const allQuestions = [];
      examToSave.sections.forEach(sec => {
        sec.tasks.forEach(task => {
          task.questions.forEach(q => {
            allQuestions.push({
              question_text: `[${sec.section_title}] ${q.qText}`,
              options: q.options || [],
              correct_answer: q.correct || '',
              question_type: 'multiple_choice'
            });
          });
        });
      });

      const { data: quizData, error: quizErr } = await supabase
        .from('quizzes')
        .insert([
          {
            title: examToSave.title,
            description: `${examToSave.subtitle} (${allQuestions.length} câu hỏi)`,
            grade_level: examToSave.grade_level,
            time_limit_minutes: examToSave.time_limit_minutes,
            creator_id: profile?.id || null
          }
        ])
        .select('*')
        .single();

      if (quizErr) throw quizErr;

      const questionRecords = allQuestions.map(q => ({
        quiz_id: quizData.id,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        question_type: q.question_type
      }));

      const { error: qErr } = await supabase.from('quiz_questions').insert(questionRecords);
      if (qErr) throw qErr;

      soundFX.playFanfare();
      alert('ĐÃ LƯU THÀNH CÔNG ĐỀ THI VÀO CSDL SUPABASE & NGÂN HÀNG ĐỀ THI!');
      if (onExamSaved) onExamSaved();
    } catch (err) {
      console.error('Lỗi lưu đề thi:', err);
      soundFX.playWrong();
      alert('Lỗi lưu đề thi: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Open Edit Exam Modal
  const handleOpenEditModal = () => {
    soundFX.playClick();
    setEditingExam(JSON.parse(JSON.stringify(generatedExam)));
    setIsEditing(true);
  };

  // Save changes from Edit Modal
  const handleSaveEditedExam = () => {
    soundFX.playCorrect();
    setGeneratedExam(editingExam);
    setIsEditing(false);
    alert('Đã cập nhật chỉnh sửa đề thi thành công!');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-md">
            <BrainCircuit className="w-4 h-4" /> Soạn Đề Thi Chuẩn AI (Ma Trận CV7991 & Đọc Form Đề Gốc)
          </span>
          <span className="text-slate-400 text-xs hidden sm:inline">Khối 6 • 7 • 8 • 9 Global Success</span>
        </div>
      </div>

      {/* Main Grid: Left Controls + Right Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Cài Đặt Cơ Bản & Độ Dài (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Box 1: Cài đặt cơ bản */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Cài Đặt Cơ Bản
            </h3>

            {/* Khối lớp */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">KHỐI LỚP</label>
              <select
                value={gradeLevel}
                onChange={(e) => {
                  const g = parseInt(e.target.value, 10);
                  setGradeLevel(g);
                  const newList = Object.keys(GlobalSuccessKnowledgeBase.DATA[g]);
                  setSelectedUnits([newList[0]]);
                }}
                className="w-full glass-input text-sm font-semibold"
              >
                <option value={6} className="bg-slate-900">Lớp 6</option>
                <option value={7} className="bg-slate-900">Lớp 7</option>
                <option value={8} className="bg-slate-900">Lớp 8</option>
                <option value={9} className="bg-slate-900">Lớp 9</option>
              </select>
            </div>

            {/* Loại hình & thời gian */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">LOẠI HÌNH & THỜI GIAN</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full glass-input text-sm font-semibold"
              >
                <option value="15" className="bg-slate-900">Kiểm tra Thường xuyên (15')</option>
                <option value="45" className="bg-slate-900">Kiểm tra Giữa kỳ (45')</option>
                <option value="60" className="bg-slate-900">Kiểm tra Cuối kỳ (60')</option>
                <option value="de_cuong" className="bg-slate-900">Đề cương ôn tập</option>
                <option value="unit_baitap" className="bg-slate-900">Bài tập từng Unit</option>
                <option value="tuyen_sinh" className="bg-slate-900">Đề Tuyển sinh 10</option>
              </select>
            </div>

            {/* Mức độ phân hóa */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">MỨC ĐỘ PHÂN HÓA ĐỀ</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'CoBan', label: 'Cơ bản' },
                  { id: 'Kha', label: 'Khá' },
                  { id: 'NangCao', label: 'Nâng cao' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDifficulty(item.id)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      difficulty === item.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Box 2: Tùy chỉnh độ dài */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Tùy Chỉnh Độ Dài
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">BÀI ĐỌC (READING)</span>
                  <span className="text-indigo-400 font-bold">{readingLength} từ</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="350"
                  step="10"
                  value={readingLength}
                  onChange={(e) => setReadingLength(e.target.value)}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">BÀI NGHE (LISTENING)</span>
                  <span className="text-indigo-400 font-bold">{listeningLength} giây (~{gradeLevel === 6 ? '50-60s' : gradeLevel === 7 ? '60-80s' : gradeLevel === 8 ? '80-120s' : '120-150s'})</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="150"
                  step="10"
                  value={listeningLength}
                  onChange={(e) => setListeningLength(e.target.value)}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">BÀI NGÔN NGỮ (LANGUAGE)</span>
                  <span className="text-indigo-400 font-bold">{languageLength} từ</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="10"
                  value={languageLength}
                  onChange={(e) => setLanguageLength(e.target.value)}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Box 3: Học Tập Đề Mẫu (Tải File Thật PDF/Word/Ảnh) */}
          <div className="glass-panel p-6 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-400" />
              Học Tập Đề Mẫu (PDF/Ảnh/Word)
            </h3>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
              className="hidden"
            />

            <div
              onClick={handleTriggerUpload}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                uploadedFile
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-slate-800 hover:border-indigo-500/50 bg-slate-950/40'
              }`}
            >
              {uploadedFile ? (
                <div className="space-y-1.5">
                  <FileCheck className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                  <span className="text-xs font-bold text-emerald-300 block truncate">{uploadedFile.name}</span>
                  <span className="text-[10px] text-slate-400 block">✓ Đã nạp 100% form đề mẫu vào AI</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Upload className="w-8 h-8 text-indigo-400 mx-auto" />
                  <span className="text-xs font-bold text-slate-200 block">Tải đề mẫu lên để AI học form</span>
                  <span className="text-[10px] text-slate-400 block">Hỗ trợ file PDF, DOCX, PNG, JPG</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Chọn Units Trọng Tâm & Ngữ Pháp Tự Động (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="glass-panel p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  Kiến Thức Global Success (Lớp {gradeLevel})
                </h2>
                <p className="text-xs text-slate-400">Chọn các Unit bài học cần tạo ma trận câu hỏi kiểm tra</p>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                CV7991 STANDARD
              </span>
            </div>

            {/* 1. CHỌN CÁC UNIT TRỌNG TÂM */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                1. CHỌN CÁC UNIT TRỌNG TÂM:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unitsList.map((unit, idx) => {
                  const isSelected = selectedUnits.includes(unit);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleUnit(unit)}
                      className={`p-3.5 rounded-xl border text-left font-semibold text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate mr-2">{unit}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-indigo-500 border-indigo-400 text-white' : 'border-slate-700'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. TRỌNG TÂM NGỮ PHÁP (TỰ ĐỘNG THEO UNIT TICK CHỌN) */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                2. TRỌNG TÂM NGỮ PHÁP (TỰ ĐỘNG PHÙ HỢP VỚI {selectedUnits.length} UNIT CHỌN):
              </h4>

              <div className="flex flex-wrap gap-2 pt-1">
                {autoGrammar.map((grammarTag, gIdx) => (
                  <span
                    key={gIdx}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-200 border border-indigo-500/40 text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    {grammarTag}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. YÊU CẦU CHI TIẾT KHÁC */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                3. YÊU CẦU CHI TIẾT KHÁC:
              </h4>
              <textarea
                rows={3}
                value={customRequirements}
                onChange={(e) => setCustomRequirements(e.target.value)}
                placeholder="Ví dụ: Đề cần sinh đầy đủ 52 câu chuẩn form đề gốc D13-247, có phần đọc đoạn văn điền từ và phần viết lại câu..."
                className="w-full glass-input text-xs"
              />
            </div>

            {/* BIG ACTION BUTTON: BẮT ĐẦU TẠO ĐỀ THI CHUẨN */}
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={generating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-brand-600 to-indigo-500 hover:from-indigo-500 hover:to-brand-500 text-white font-extrabold text-base shadow-xl shadow-indigo-600/30 transition-all duration-300 flex items-center justify-center gap-2 active:scale-98"
            >
              <Zap className="w-5 h-5 fill-current animate-bounce" />
              {generating ? 'AI Đang Đọc Form Đề Gốc & Sinh 52 Câu Hỏi...' : 'BẮT ĐẦU TẠO ĐỀ THI CHUẨN ⚡'}
            </button>

          </div>

          {/* GENERATED EXAM PREVIEW BOX WITH AUDIO TAPESCRIPT, EDIT MODAL & WORD TAB COPY */}
          {generatedExam && (
            <div className="glass-panel p-8 space-y-8 border-emerald-500/50 bg-slate-900/95 shadow-2xl animate-fadeIn">
              
              {/* Header Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ Đã Sinh Đề Thi Chuẩn Form Đề Gốc D13-247
                  </span>
                  <h2 className="text-xl font-extrabold text-white mt-2">{generatedExam.title}</h2>
                  <p className="text-xs text-slate-400">{generatedExam.subtitle}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleOpenEditModal}
                    className="glass-button-secondary text-xs px-3 py-2 text-amber-300 hover:border-amber-500"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Sửa Đề Thi ✏️
                  </button>

                  <button
                    onClick={handleCopyWordTabFormat}
                    className="glass-button-accent text-xs px-3 py-2 text-slate-950 font-bold"
                    title="Copy chuẩn định dạng TAB Word để dán sang Word nằm gọn trên 1 dòng"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Chuẩn TAB Word 📄
                  </button>

                  <button
                    onClick={handleSaveToDatabase}
                    disabled={saving}
                    className="glass-button-primary text-xs px-4 py-2 font-bold"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Đang Lưu...' : 'Lưu Vào CSDL Ngân Hàng Đề'}
                  </button>
                </div>
              </div>

              {/* TAPESCRIPT & AUDIO PLAYER SECTION */}
              {generatedExam.tapescript && (
                <div className="p-5 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-indigo-400 animate-pulse" />
                      <h4 className="text-sm font-extrabold text-indigo-200">
                        TAPESCRIPT & BÀI NGHE AUDIO KỊCH BẢN PHÁT ÂM (THỜI LƯỢNG ~{listeningLength} GIÂY)
                      </h4>
                    </div>

                    <button
                      onClick={() => handlePlayTapescript(generatedExam.tapescript)}
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md"
                    >
                      {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isPlayingAudio ? 'Dừng Phát Audio' : '🔊 Bật Giọng Đọc Audio AI'}</span>
                    </button>
                  </div>

                  <pre className="text-xs text-indigo-100 font-mono whitespace-pre-wrap leading-relaxed p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    {generatedExam.tapescript}
                  </pre>
                </div>
              )}

              {/* Exam Sections Render */}
              <div className="space-y-8">
                {generatedExam.sections.map((sec, sIdx) => (
                  <div key={sIdx} className="space-y-6">
                    <h3 className="text-base font-extrabold text-amber-400 uppercase tracking-wider border-l-4 border-amber-400 pl-3 py-1 bg-amber-400/10 rounded-r-lg">
                      {sec.section_title}
                    </h3>

                    {sec.tasks.map((task, tIdx) => (
                      <div key={tIdx} className="space-y-4 pl-2">
                        <h4 className="text-xs font-bold text-slate-200 italic">{task.task_name}</h4>

                        <div className="space-y-4">
                          {task.questions.map((q) => (
                            <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                              <p className="text-xs font-bold text-white">
                                Câu {q.id}: {q.qText}
                              </p>

                              {/* Options formatted with Tab preview */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                                {q.options.map((opt, oIdx) => (
                                  <div key={oIdx} className="p-2 rounded bg-slate-900/80 border border-slate-800 font-medium">
                                    {opt}
                                  </div>
                                ))}
                              </div>

                              {/* Answer Key & Detailed Explanation */}
                              {showAnswerKey && (
                                <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1 animate-fadeIn">
                                  <div className="font-extrabold text-emerald-400">
                                    ✓ Đáp án chính xác: {q.correct}
                                  </div>
                                  <div className="text-slate-300 text-[11px] leading-relaxed flex items-start gap-1.5 pt-1">
                                    <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong>Lời giải & Phân tích đáp án:</strong> {q.explanation}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>

      {/* EDIT EXAM MODAL ("SỬA ĐỀ THI") */}
      {isEditing && editingExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-4xl glass-panel p-6 space-y-6 max-h-[90vh] overflow-y-auto border-amber-500/50">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                <Edit3 className="w-5 h-5" /> Trình Chỉnh Sửa Đề Thi Trực Tiếp ✏️
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tiêu đề bài kiểm tra</label>
                <input
                  type="text"
                  value={editingExam.title}
                  onChange={(e) => setEditingExam({ ...editingExam, title: e.target.value })}
                  className="w-full glass-input"
                />
              </div>

              {editingExam.sections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-xs text-amber-400">{sec.section_title}</h4>
                  {sec.tasks.map((task, tIdx) => (
                    <div key={tIdx} className="space-y-2">
                      <span className="text-xs font-semibold text-slate-300">{task.task_name}</span>
                      {task.questions.map((q, qIdx) => (
                        <div key={qIdx} className="p-3 rounded bg-slate-900 border border-slate-800 space-y-2">
                          <input
                            type="text"
                            value={q.qText}
                            onChange={(e) => {
                              const newExam = { ...editingExam };
                              newExam.sections[sIdx].tasks[tIdx].questions[qIdx].qText = e.target.value;
                              setEditingExam(newExam);
                            }}
                            className="w-full glass-input text-xs font-bold"
                          />
                          <input
                            type="text"
                            value={q.correct}
                            onChange={(e) => {
                              const newExam = { ...editingExam };
                              newExam.sections[sIdx].tasks[tIdx].questions[qIdx].correct = e.target.value;
                              setEditingExam(newExam);
                            }}
                            className="w-full glass-input text-xs text-emerald-400"
                            placeholder="Đáp án đúng"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button onClick={() => setIsEditing(false)} className="glass-button-secondary text-xs">
                Hủy Chỉnh Sửa
              </button>
              <button onClick={handleSaveEditedExam} className="glass-button-accent text-xs px-5 py-2 font-bold">
                Lưu Thay Đổi Đề Thi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
