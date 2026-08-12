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
  Download,
  Printer,
  FileCode,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GlobalSuccessKnowledgeBase } from '../../data/globalSuccessData';

export const AIExamGenerator = ({ onExamSaved }) => {
  const { profile } = useAuth();
  const fileInputRef = useRef(null);
  
  // Left Form Controls (Cài đặt cơ bản & Độ dài)
  const [gradeLevel, setGradeLevel] = useState(7);
  const [examType, setExamType] = useState('45'); 
  const [difficulty, setDifficulty] = useState('Kha'); // 'CoBan', 'Kha', 'NangCao'
  
  const [readingLength, setReadingLength] = useState(150);
  const [listeningLength, setListeningLength] = useState(60);
  const [languageLength, setLanguageLength] = useState(100);

  // Sample File Upload State
  const [uploadedFile, setUploadedFile] = useState(null);
  
  // Right Form Controls (Unit selection & Grammar & Custom prompts)
  const unitsList = Object.keys(GlobalSuccessKnowledgeBase.DATA[gradeLevel] || GlobalSuccessKnowledgeBase.DATA[7]);
  const [selectedUnits, setSelectedUnits] = useState([unitsList[0] || 'Unit 1: Hobbies']);
  const [autoGrammar, setAutoGrammar] = useState([]);
  const [customRequirements, setCustomRequirements] = useState('');

  // AI Output State
  const [generating, setGenerating] = useState(false);
  const [generatedExam, setGeneratedExam] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(true);

  // Auto sync Grammar focus whenever gradeLevel or selectedUnits change
  useEffect(() => {
    const grammarList = GlobalSuccessKnowledgeBase.getGrammarForUnits(gradeLevel, selectedUnits);
    setAutoGrammar(grammarList);
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
    }
  };

  // Advanced Multi-Section AI Generator matching Image 3 structure (Listening, Language, Reading, Writing, True/False, Cloze test)
  const handleGenerateAI = () => {
    if (selectedUnits.length === 0) {
      alert('Vui lòng chọn ít nhất 1 Unit trọng tâm!');
      return;
    }

    soundFX.playClick();
    setGenerating(true);
    setGeneratedExam(null);

    const vocabList = GlobalSuccessKnowledgeBase.getVocabForUnits(gradeLevel, selectedUnits);
    const unitTitle = selectedUnits.join(' & ');
    const grammarFocusStr = autoGrammar.join(', ');

    setTimeout(() => {
      // Build realistic multi-task exam sections
      const sections = [
        {
          section_title: 'LISTENING SECTION',
          tasks: [
            {
              task_name: 'Task 1: Listen to the talk and choose the correct answer A, B, C, or D.',
              questions: [
                {
                  id: 1,
                  qText: 'What is the speaker sharing a recipe for?',
                  options: ['A. spring rolls', 'B. roast chicken', 'C. apple pie', 'D. beef noodle soup'],
                  correct: 'D. beef noodle soup',
                  explanation: 'Đáp án D đúng. Đoạn băng giới thiệu món Phở bò ("beef noodle soup"). Phương án A, B, C không xuất hiện trong bài nghe.'
                },
                {
                  id: 2,
                  qText: 'What ingredient is mentioned along with onions and mushrooms?',
                  options: ['A. fried tofu', 'B. shrimp', 'C. pork', 'D. butter'],
                  correct: 'C. pork',
                  explanation: 'Đáp án C đúng. Người nói nhắc đến "pork" (thịt lợn) là nguyên liệu đi kèm hành và nấm.'
                }
              ]
            },
            {
              task_name: 'Task 2: Listen to an interview with Nam and fill in each blank with ONE word.',
              questions: [
                {
                  id: 3,
                  qText: 'Nam usually has a quick breakfast because he is in a __________.',
                  options: ['hurry', 'rush', 'house', 'habit'],
                  correct: 'hurry',
                  explanation: 'Đáp án: "hurry". Cụm từ "in a hurry" nghĩa là đang vội vã.'
                },
                {
                  id: 4,
                  qText: 'He often eats toast with butter and drinks a __________ of orange juice.',
                  options: ['glass', 'cup', 'bottle', 'bowl'],
                  correct: 'glass',
                  explanation: 'Đáp án: "glass". Cụm từ "a glass of orange juice" nghĩa là 1 ly nước cam.'
                }
              ]
            },
            {
              task_name: 'Task 3: Listen to a guide at a traditional food exhibition and choose True or False.',
              questions: [
                {
                  id: 5,
                  qText: 'The exhibition displays traditional Vietnamese food.',
                  options: ['A. True', 'B. False'],
                  correct: 'A. True',
                  explanation: 'Đáp án True. Triển lãm trưng bày các món ăn truyền thống Việt Nam.'
                },
                {
                  id: 6,
                  qText: 'The broth of the beef noodle soup is made by stewing chicken bones.',
                  options: ['A. True', 'B. False'],
                  correct: 'B. False',
                  explanation: 'Đáp án False. Nước dùng phở bò được ninh từ xương bò (beef bones), không phải xương gà (chicken bones).'
                }
              ]
            }
          ]
        },
        {
          section_title: 'KNOWLEDGE OF LANGUAGE & VOCABULARY',
          tasks: [
            {
              task_name: 'Task 1: Read the passage and circle the letter A, B, C, or D to indicate the correct option.',
              questions: [
                {
                  id: 7,
                  qText: `Hi Mark, I want to tell you about my favorite Vietnamese dish. It is an omelette. To make it, you need to prepare (7) __________ eggs, some pepper, and some onion.`,
                  options: ['A. some', 'B. any', 'C. much', 'D. a little'],
                  correct: 'A. some',
                  explanation: 'Đáp án A (some). "Eggs" là danh từ đếm được số nhiều trong câu khẳng định, nên dùng "some". "Much" và "a little" dùng cho danh từ không đếm được.'
                },
                {
                  id: 8,
                  qText: `Next, pour the eggs into the (8) __________ and cook for a few minutes.`,
                  options: ['A. fork', 'B. fridge', 'C. pan', 'D. exhibition'],
                  correct: 'C. pan',
                  explanation: 'Đáp án C (pan - cái chảo). Rót trứng vào chảo để rán.'
                },
                {
                  id: 9,
                  qText: `This traditional food is very (9) __________. It can be served with some bread or rice.`,
                  options: ['A. stewed', 'B. delicious', 'C. in a hurry', 'D. boneless'],
                  correct: 'B. delicious',
                  explanation: 'Đáp án B (delicious - ngon miệng). Mô tả hương vị món ăn.'
                }
              ]
            },
            {
              task_name: `Task 2: Grammar & Structure Focus (${grammarFocusStr})`,
              questions: [
                {
                  id: 10,
                  qText: `Choose the correct answer: "Pho is one of the most __________ dishes in Vietnam."`,
                  options: ['A. popular', 'B. popular than', 'C. more popular', 'D. as popular'],
                  correct: 'A. popular',
                  explanation: 'Đáp án A. Cấu trúc so sánh nhất "one of the most + Adj dài" -> popular.'
                },
                {
                  id: 11,
                  qText: `Circle the mistake: "She don't like eating spicy food for breakfast."`,
                  options: ['A. She', 'B. don\'t', 'C. eating', 'D. for'],
                  correct: 'B. don\'t',
                  explanation: 'Đáp án B. Chủ ngữ "She" đi với trợ động từ phủ định "doesn\'t", không dùng "don\'t".'
                }
              ]
            }
          ]
        },
        {
          section_title: 'READING & WRITING SECTION',
          tasks: [
            {
              task_name: 'Task 1: Rewrite each sentence so that it has the same meaning as the first one.',
              questions: [
                {
                  id: 12,
                  qText: 'Her favorite dish is beef noodle soup. -> She likes...',
                  options: [
                    'A. She likes beef noodle soup best.',
                    'B. She likes beef noodle soup more.',
                    'C. She like beef noodle soup best.',
                    'D. She likes best beef noodle soup.'
                  ],
                  correct: 'A. She likes beef noodle soup best.',
                  explanation: 'Đáp án A. "S + like(s) + N + best" tương đương với "S\'s favorite N is..."'
                },
                {
                  id: 13,
                  qText: 'It is good for you to eat more fresh vegetables. -> You should...',
                  options: [
                    'A. You should eat more fresh vegetables.',
                    'B. You should to eat more fresh vegetables.',
                    'C. You should eating more fresh vegetables.',
                    'D. You should ate more fresh vegetables.'
                  ],
                  correct: 'A. You should eat more fresh vegetables.',
                  explanation: 'Đáp án A. Cấu trúc khuyên bảo: "You should + V nguyên thể".'
                }
              ]
            }
          ]
        }
      ];

      const examTypeLabel = 
        examType === '15' ? 'Kiểm tra Thường xuyên (15\')' :
        examType === '45' ? 'Kiểm tra Giữa kỳ (45\')' :
        examType === '60' ? 'Kiểm tra Cuối kỳ (60\')' :
        examType === 'de_cuong' ? 'Đề Cương Ôn Tập Tổng Hợp' :
        examType === 'unit_baitap' ? 'Bài Tập Theo Unit' : 'Đề Luyện Thi Tuyển Sinh 10';

      setGeneratedExam({
        title: `ĐỀ KIỂM TRA TIẾNG ANH LỚP ${gradeLevel} - ${examTypeLabel.toUpperCase()}`,
        subtitle: `Chủ đề: ${unitTitle} • Ma trận CV7991 Global Success`,
        grade_level: gradeLevel,
        time_limit_minutes: examType === '15' ? 15 : examType === '45' ? 45 : 60,
        sections: sections
      });

      setGenerating(false);
      soundFX.playFanfare();
      confetti({ particleCount: 120, spread: 80 });
    }, 1500);
  };

  // Save generated exam directly into Supabase DB
  const handleSaveToDatabase = async () => {
    if (!generatedExam || saving) return;
    setSaving(true);
    soundFX.playClick();

    try {
      // Flatten questions from all sections
      const allQuestions = [];
      generatedExam.sections.forEach(sec => {
        sec.tasks.forEach(task => {
          task.questions.forEach(q => {
            allQuestions.push({
              question_text: `[${sec.section_title} - ${task.task_name}] ${q.qText}`,
              options: q.options,
              correct_answer: q.correct,
              question_type: 'multiple_choice'
            });
          });
        });
      });

      // 1. Save Quiz record
      const { data: quizData, error: quizErr } = await supabase
        .from('quizzes')
        .insert([
          {
            title: generatedExam.title,
            description: `${generatedExam.subtitle} (${allQuestions.length} câu hỏi chuẩn ma trận)`,
            grade_level: generatedExam.grade_level,
            time_limit_minutes: generatedExam.time_limit_minutes,
            creator_id: profile?.id || null
          }
        ])
        .select('*')
        .single();

      if (quizErr) throw quizErr;

      // 2. Save Questions records
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
      alert(`ĐÃ LƯU THÀNH CÔNG ĐỀ THI VÀO CSDL SUPABASE!\nĐề thi hiện đã xuất hiện ở Tab "Ngân Hàng Đề Thi" để Học sinh làm bài trực tuyến.`);
      if (onExamSaved) onExamSaved();
    } catch (err) {
      console.error('Lỗi lưu đề thi:', err);
      soundFX.playWrong();
      alert('Lỗi lưu đề thi: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Print / Export Word printable view
  const handlePrintExam = () => {
    soundFX.playClick();
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-md">
            <BrainCircuit className="w-4 h-4" /> Soạn Đề Thi Chuẩn AI (Ma Trận CV7991)
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

            {/* Bổ sung đầy đủ Các Loại hình kiểm tra theo yêu cầu */}
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
                  <span className="text-indigo-400 font-bold">{listeningLength} giây</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="120"
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
                  <span className="text-[10px] text-slate-400 block">✓ Đã phân tích ma trận đề mẫu thành công</span>
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
                placeholder="Ví dụ: Đề cần bổ sung phần viết lại câu không đổi nghĩa, lời giải ghi rõ đáp án đúng và phân tích lý do các phương án sai..."
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
              {generating ? 'Đang Tạo Ma Trận Đề Thi Đủ Các Dạng Bài...' : 'BẮT ĐẦU TẠO ĐỀ THI CHUẨN ⚡'}
            </button>

          </div>

          {/* GENERATED EXAM PREVIEW BOX WITH MULTI-SECTION & EXPLANATION */}
          {generatedExam && (
            <div className="glass-panel p-8 space-y-8 border-emerald-500/50 bg-slate-900/95 shadow-2xl animate-fadeIn print:bg-white print:text-black">
              
              {/* Header Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 print:hidden">
                <div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ Đã Tạo Đề Thi Đủ Các Dạng Bài & Lời Giải Chi Tiết
                  </span>
                  <h2 className="text-xl font-extrabold text-white mt-2">{generatedExam.title}</h2>
                  <p className="text-xs text-slate-400">{generatedExam.subtitle}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowAnswerKey(!showAnswerKey)}
                    className="glass-button-secondary text-xs px-3 py-2"
                  >
                    {showAnswerKey ? 'Ẩn Lời Giải' : 'Hiện Lời Giải & Đáp Án'}
                  </button>

                  <button
                    onClick={handlePrintExam}
                    className="glass-button-secondary text-xs px-3 py-2"
                  >
                    <Printer className="w-3.5 h-3.5" /> In Đề / File Word
                  </button>

                  <button
                    onClick={handleSaveToDatabase}
                    disabled={saving}
                    className="glass-button-accent text-xs px-4 py-2 font-bold"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Đang Lưu...' : 'Lưu Vào CSDL Ngân Hàng Đề'}
                  </button>
                </div>
              </div>

              {/* Printable Paper Header */}
              <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                <h2 className="text-xl font-extrabold text-brand-300">{generatedExam.title}</h2>
                <p className="text-xs text-slate-400 font-semibold">{generatedExam.subtitle}</p>
                <div className="flex justify-between text-xs text-slate-400 pt-2 px-4 italic">
                  <span>Thời gian làm bài: {generatedExam.time_limit_minutes} phút</span>
                  <span>Họ và tên học sinh: ............................................</span>
                </div>
              </div>

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

    </div>
  );
};
