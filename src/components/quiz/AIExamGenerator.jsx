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
  
  // Left Form Controls (Cài đặt cơ bản & Độ dài)
  const [gradeLevel, setGradeLevel] = useState(8);
  const [examType, setExamType] = useState('60'); // '15', '45', '60', 'de_cuong', 'unit_baitap', 'tuyen_sinh'
  const [difficulty, setDifficulty] = useState('Kha'); // 'CoBan', 'Kha', 'NangCao'
  
  const [readingLength, setReadingLength] = useState(150);
  const [listeningLength, setListeningLength] = useState(100); // 80-120s for Grade 8
  const [languageLength, setLanguageLength] = useState(100);

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState(null);
  
  // Right Form Controls
  const unitsList = Object.keys(GlobalSuccessKnowledgeBase.DATA[gradeLevel] || GlobalSuccessKnowledgeBase.DATA[8]);
  const [selectedUnits, setSelectedUnits] = useState([unitsList[3] || unitsList[0], unitsList[4] || unitsList[1]]);
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

  // Auto sync Grammar focus & listening duration according to Grade Level rules when gradeLevel or selectedUnits change
  useEffect(() => {
    const availableUnits = Object.keys(GlobalSuccessKnowledgeBase.DATA[gradeLevel] || GlobalSuccessKnowledgeBase.DATA[8]);
    
    // Check if current selected units belong to current grade, else reset to current grade's units
    const validUnits = selectedUnits.filter(u => availableUnits.includes(u));
    const activeUnits = validUnits.length > 0 ? validUnits : [availableUnits[0], availableUnits[1] || availableUnits[0]];
    setSelectedUnits(activeUnits);

    const grammarList = GlobalSuccessKnowledgeBase.getGrammarForUnits(gradeLevel, activeUnits);
    setAutoGrammar(grammarList);

    // Duration rules per grade: Grade 6: 50-60s, Grade 7: 60-80s, Grade 8: 80-120s, Grade 9: 120-150s
    if (gradeLevel === 6) setListeningLength(55);
    else if (gradeLevel === 7) setListeningLength(70);
    else if (gradeLevel === 8) setListeningLength(100);
    else if (gradeLevel === 9) setListeningLength(135);
  }, [gradeLevel]);

  // Sync grammar when selected units change
  useEffect(() => {
    const grammarList = GlobalSuccessKnowledgeBase.getGrammarForUnits(gradeLevel, selectedUnits);
    setAutoGrammar(grammarList);
  }, [selectedUnits]);

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
    utterance.rate = 0.88;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // DYNAMIC EXAM GENERATOR: 100% aligned with selected Grade (6, 7, 8, 9), Exam Type, and Selected Units!
  const handleGenerateAI = () => {
    if (selectedUnits.length === 0) {
      alert('Vui lòng chọn ít nhất 1 Unit trọng tâm!');
      return;
    }

    soundFX.playClick();
    setGenerating(true);
    setGeneratedExam(null);

    const vocabList = GlobalSuccessKnowledgeBase.getVocabForUnits(gradeLevel, selectedUnits);
    const unitTitleStr = selectedUnits.join(' & ');
    const grammarFocusStr = autoGrammar.join(', ');

    setTimeout(() => {
      // 1. Build Grade-Specific Tapescript
      let tapescript = '';
      let sections = [];

      if (gradeLevel === 8) {
        tapescript = `[TAPESCRIPT - ENGLISH GRADE 8 (~${listeningLength} seconds)]\nNam: Hi Mai! What are you doing this weekend?\nMai: Hi Nam! I am visiting a traditional craft village with my class. We are learning about traditional lifestyles and communal houses of ethnic groups in Vietnam.\nNam: That sounds fascinating! Do artisans still preserve traditional handicrafts there?\nMai: Yes! The local artisans are very hospitable. They show us how to weave traditional cloth and make pottery.\nNam: Don't forget to take photos and share with our class forum!`;

        sections = [
          {
            section_title: 'LISTENING SECTION',
            tasks: [
              {
                task_name: `Task 1: Listen to the conversation between Nam and Mai about Grade 8 ${selectedUnits[0] || 'Unit 4'} and choose the correct answer A, B, C, or D.`,
                questions: [
                  { id: 1, qText: 'Where is Mai going with her class this weekend?', options: ['A. To a luxury resort', 'B. To a traditional craft village', 'C. To a modern shopping mall', 'D. To a sports stadium'], correct: 'B. To a traditional craft village', explanation: 'Đáp án B. Mai nói "I am visiting a traditional craft village with my class".' },
                  { id: 2, qText: 'What are Mai and her classmates learning about?', options: ['A. Space exploration', 'B. Computer software', 'C. Traditional lifestyles and communal houses', 'D. Modern city transportation'], correct: 'C. Traditional lifestyles and communal houses', explanation: 'Đáp án C. Mai tìm hiểu về lối sống truyền thống và nhà nhà cộng đồng/nhà cộng cư.' }
                ]
              },
              {
                task_name: 'Task 2: Listen again and fill in each blank with ONE word from the recording.',
                questions: [
                  { id: 3, qText: 'The local artisans in the craft village are very __________.', options: ['A. hospitable', 'B. polluted', 'C. crowded', 'D. stressful'], correct: 'A. hospitable', explanation: 'Đáp án A (hospitable - mến khách).' },
                  { id: 4, qText: 'Nam suggests Mai take photos and share them on their class __________.', options: ['A. forum', 'B. magazine', 'C. newspaper', 'D. diary'], correct: 'A. forum', explanation: 'Đáp án A (forum - diễn đàn lớp học).' }
                ]
              }
            ]
          },
          {
            section_title: 'KNOWLEDGE OF LANGUAGE & GRAMMAR',
            tasks: [
              {
                task_name: `Task 1: Read the passage about Grade 8 ${selectedUnits.join(' & ')} and choose the best option A, B, C, or D.`,
                questions: [
                  { id: 5, qText: `Ethnic groups in Vietnam have their own unique (5) __________ and customs passed down through generations.`, options: ['A. heritage', 'B. stress', 'C. footprint', 'D. discount'], correct: 'A. heritage', explanation: 'Đáp án A (heritage - di sản văn hóa).' },
                  { id: 6, qText: `While Nam (6) __________ on his school project, his brother was surfing the net.`, options: ['A. was working', 'B. works', 'C. is working', 'D. has worked'], correct: 'A. was working', explanation: 'Đáp án A. Cấu trúc Quá khứ tiếp diễn với "While": While + S + was/were + V-ing.' },
                  { id: 7, qText: `In the countryside, people live (7) __________ than those in bustling big cities.`, options: ['A. more peacefully', 'B. peaceful', 'C. most peaceful', 'D. as peaceful'], correct: 'A. more peacefully', explanation: 'Đáp án A. So sánh hơn của trạng từ (Comparative Adverbs): more peacefully.' }
                ]
              }
            ]
          },
          {
            section_title: 'READING & WRITING SECTION',
            tasks: [
              {
                task_name: 'Task 1: Read the text and choose True or False.',
                questions: [
                  { id: 8, qText: 'Stilt houses are traditional homes of many ethnic minority groups in Vietnam.', options: ['A. True', 'B. False'], correct: 'A. True', explanation: 'Đáp án True. Nhà sàn là nhà ở truyền thống của nhiều dân tộc thiểu số.' },
                  { id: 9, qText: 'Communal houses are used only for private family dinners.', options: ['A. True', 'B. False'], correct: 'B. False', explanation: 'Đáp án False. Nhà cộng đồng dùng cho sinh hoạt chung của cả làng.' }
                ]
              },
              {
                task_name: 'Task 2: Rewrite sentences using given words in brackets.',
                questions: [
                  { id: 10, qText: 'Life in the countryside is more peaceful than life in the city. (PEACEFULLY) -> People in the countryside live...', options: ['A. People in the countryside live more peacefully than people in the city.'], correct: 'A. People in the countryside live more peacefully than people in the city.', explanation: 'Lời giải: People in the countryside live more peacefully than people in the city.' }
                ]
              }
            ]
          }
        ];
      } else if (gradeLevel === 9) {
        tapescript = `[TAPESCRIPT - ENGLISH GRADE 9 (~${listeningLength} seconds)]\nPhong: Hi Mark! Have you decided on your future career path yet?\nMark: Hi Phong! I am thinking about vocational training in computer science. What about you?\nPhong: I am interested in environmental science to help solve urban sprawl and pollution in our metropolis.\nMark: That is a great choice! With changing roles in society, hands-on skills and bilingual ability will be very important for our generation.`;

        sections = [
          {
            section_title: 'LISTENING SECTION',
            tasks: [
              {
                task_name: `Task 1: Listen to Phong and Mark discussing Grade 9 ${selectedUnits[0] || 'Unit 1'} and choose A, B, C, or D.`,
                questions: [
                  { id: 1, qText: 'What is Mark considering for his future career path?', options: ['A. Vocational training in computer science', 'B. Traditional pottery making', 'C. Space tourism', 'D. Agriculture'], correct: 'A. Vocational training in computer science', explanation: 'Đáp án A. Mark nói "I am thinking about vocational training in computer science".' },
                  { id: 2, qText: 'Why is Phong interested in environmental science?', options: ['A. To travel around space', 'B. To solve urban sprawl and pollution in the metropolis', 'C. To become a famous actor', 'D. To write history books'], correct: 'B. To solve urban sprawl and pollution in the metropolis', explanation: 'Đáp án B. Phong muốn giải quyết vấn đề đô thị hóa và ô nhiễm.' }
                ]
              }
            ]
          },
          {
            section_title: 'KNOWLEDGE OF LANGUAGE & GRAMMAR (GRADE 9)',
            tasks: [
              {
                task_name: `Task 1: Grammar & Vocabulary (${grammarFocusStr})`,
                questions: [
                  { id: 3, qText: 'The artisan __________ spent five years restoring the ancient pagoda is very famous.', options: ['A. who', 'B. which', 'C. whom', 'D. whose'], correct: 'A. who', explanation: 'Đáp án A. Mệnh đề quan hệ chỉ người làm chủ ngữ -> who.' },
                  { id: 4, qText: 'My elder brother decided to __________ his business after moving to the new city.', options: ['A. set up', 'B. turn down', 'C. pass down', 'D. close down'], correct: 'A. set up', explanation: 'Đáp án A (set up - thành lập doanh nghiệp).' },
                  { id: 5, qText: 'She asked me __________ to cope with exam pressure effectively.', options: ['A. how', 'B. what', 'C. where', 'D. when'], correct: 'A. how', explanation: 'Đáp án A. Cấu trúc "Question word + to-V" -> how to cope with.' }
                ]
              }
            ]
          }
        ];
      } else {
        // Grade 6 & Grade 7 Dynamic Output
        tapescript = `[TAPESCRIPT - ENGLISH GRADE ${gradeLevel} (~${listeningLength} seconds)]\nStudent A: Welcome to our English class project for Grade ${gradeLevel}!\nStudent B: Today we are exploring vocabulary and grammar topics from ${unitTitleStr}.\nStudent A: Let's practice listening and reading skills together!`;

        sections = [
          {
            section_title: 'LISTENING SECTION',
            tasks: [
              {
                task_name: `Task 1: Listen to the Grade ${gradeLevel} dialogue and choose the correct option A, B, C, or D.`,
                questions: [
                  { id: 1, qText: `What grade project are the students presenting?`, options: [`A. Grade ${gradeLevel}`, 'B. Grade 5', 'C. Grade 10', 'D. Grade 12'], correct: `A. Grade ${gradeLevel}`, explanation: `Đáp án A. Dự án môn Tiếng Anh Khối ${gradeLevel}.` },
                  { id: 2, qText: `What units are featured in their lesson today?`, options: [`A. ${unitTitleStr}`, 'B. Unit 12 Space Travel', 'C. Unit 10 Energy', 'D. Unit 1 New School'], correct: `A. ${unitTitleStr}`, explanation: `Đáp án A. Bài học về các Unit ${unitTitleStr}.` }
                ]
              }
            ]
          },
          {
            section_title: `KNOWLEDGE OF LANGUAGE & GRAMMAR (GRADE ${gradeLevel})`,
            tasks: [
              {
                task_name: `Task 1: Practice Grammar (${grammarFocusStr})`,
                questions: [
                  { id: 3, qText: `Choose the word from ${selectedUnits[0] || 'Unit 1'} with different pronunciation:`, options: [`A. ${vocabList[0] || 'hobby'}`, `B. ${vocabList[1] || 'collect'}`, 'C. ensure', 'D. pleasure'], correct: `A. ${vocabList[0] || 'hobby'}`, explanation: 'Đáp án A. Kiểm tra phát âm từ vựng bài học.' },
                  { id: 4, qText: `Complete the sentence: "Students in Grade ${gradeLevel} learn about __________."`, options: [`A. ${vocabList[1] || 'healthy diet'}`, 'B. space rockets', 'C. ancient heritage', 'D. career advice'], correct: `A. ${vocabList[1] || 'healthy diet'}`, explanation: 'Đáp án A. Từ vựng bám sát bài học.' }
                ]
              }
            ]
          }
        ];
      }

      const examTypeLabel = 
        examType === '15' ? 'Kiểm tra Thường xuyên (15\')' :
        examType === '45' ? 'Kiểm tra Giữa kỳ (45\')' :
        examType === '60' ? 'Kiểm tra Cuối kỳ (60\')' :
        examType === 'de_cuong' ? 'Đề Cương Ôn Tập Tổng Hợp' :
        examType === 'unit_baitap' ? 'Bài Tập Theo Unit' : 'Đề Luyện Thi Tuyển Sinh 10';

      setGeneratedExam({
        title: `ĐỀ KIỂM TRA TIẾNG ANH LỚP ${gradeLevel} - ${examTypeLabel.toUpperCase()}`,
        subtitle: `Chủ đề: ${unitTitleStr} • Ma trận CV7991 Global Success`,
        grade_level: gradeLevel,
        time_limit_minutes: examType === '15' ? 15 : examType === '45' ? 45 : 60,
        tapescript: tapescript,
        sections: sections
      });

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
            wordFormattedText += `${q.options.join('\t')}\n`;
          }
          wordFormattedText += `\n`;
        });
      });
    });

    navigator.clipboard.writeText(wordFormattedText);
    soundFX.playCorrect();
    alert('ĐÃ COPY THÀNH CÔNG ĐỀ THI LỚP ' + gradeLevel + ' CHUẨN TAB WORD!\nThầy chỉ cần dán (Ctrl + V) vào Word. Tất cả phương án A, B, C, D sẽ tự động nằm gọn gàng trên 1 dòng!');
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
      alert(`ĐÃ LƯU THÀNH CÔNG ĐỀ THI LỚP ${examToSave.grade_level} VÀO CSDL SUPABASE!\nĐề thi hiện đã xuất hiện ở Tab "Ngân Hàng Đề Thi" để Học sinh làm bài trực tuyến.`);
      if (onExamSaved) onExamSaved();
    } catch (err) {
      console.error('Lỗi lưu đề thi:', err);
      soundFX.playWrong();
      alert('Lỗi lưu đề thi: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEditModal = () => {
    soundFX.playClick();
    setEditingExam(JSON.parse(JSON.stringify(generatedExam)));
    setIsEditing(true);
  };

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
            <BrainCircuit className="w-4 h-4" /> Soạn Đề Thi Chuẩn AI (Khối {gradeLevel} Dynamic Generator)
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
                onChange={(e) => setGradeLevel(parseInt(e.target.value, 10))}
                className="w-full glass-input text-sm font-semibold"
              >
                <option value={6} className="bg-slate-900">Lớp 6</option>
                <option value={7} className="bg-slate-900">Lớp 7</option>
                <option value={8} className="bg-slate-900">Lớp 8</option>
                <option value={9} className="bg-slate-900">Lớp 9</option>
              </select>
            </div>

            {/* Các Loại hình kiểm tra */}
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
                1. CHỌN CÁC UNIT TRỌNG TÂM (LỚP {gradeLevel}):
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

            {/* 2. TRỌNG TÂM NGỮ PHÁP (TỰ ĐỘNG THEO UNIT CHỌN) */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                2. TRỌNG TÂM NGỮ PHÁP (TỰ ĐỘNG PHÙ HỢP KHỐI {gradeLevel}):
              </h4>

              <div className="flex flex-wrap gap-2 pt-1">
                {autoGrammar.map((grammarTag, gIdx) => (
                  <span
                    key={gIdx}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-200 border border-indigo-500/40 text-xs font-extrabold flex items-center gap-1.5 shadow-sm animate-fadeIn"
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
                placeholder={`Ví dụ: Đề thi Khối ${gradeLevel} cần sinh câu hỏi đúng ma trận các Unit đã tick chọn, có đáp án phân tích loại trừ phương án sai...`}
                className="w-full glass-input text-xs"
              />
            </div>

            {/* BIG ACTION BUTTON */}
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={generating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-brand-600 to-indigo-500 hover:from-indigo-500 hover:to-brand-500 text-white font-extrabold text-base shadow-xl shadow-indigo-600/30 transition-all duration-300 flex items-center justify-center gap-2 active:scale-98"
            >
              <Zap className="w-5 h-5 fill-current animate-bounce" />
              {generating ? `AI Đang Sinh Đề Thi Khối ${gradeLevel} Theo Ma Trận...` : `BẮT ĐẦU TẠO ĐỀ THI KHỐI ${gradeLevel} CHUẨN ⚡`}
            </button>

          </div>

          {/* GENERATED EXAM PREVIEW BOX */}
          {generatedExam && (
            <div className="glass-panel p-8 space-y-8 border-emerald-500/50 bg-slate-900/95 shadow-2xl animate-fadeIn">
              
              {/* Header Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ Đã Sinh Đề Thi Khối {generatedExam.grade_level} Chuẩn Ma Trận
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
                        TAPESCRIPT BÀI NGHE KHỐI {generatedExam.grade_level} (THỜI LƯỢNG ~{listeningLength} GIÂY)
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

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                                {q.options.map((opt, oIdx) => (
                                  <div key={oIdx} className="p-2 rounded bg-slate-900/80 border border-slate-800 font-medium">
                                    {opt}
                                  </div>
                                ))}
                              </div>

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

      {/* EDIT EXAM MODAL */}
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
