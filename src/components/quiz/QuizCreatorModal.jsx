import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Save, 
  FileText, 
  Clock, 
  Shuffle, 
  Dices, 
  CheckSquare, 
  Square, 
  Sigma, 
  FileSpreadsheet, 
  Upload, 
  CheckCircle2, 
  Layers, 
  HelpCircle, 
  Sparkles,
  Link2,
  BookOpen
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

import { GRADE_UNITS_MAP } from '../../constants/gradeUnits';

export const QuizCreatorModal = ({ isOpen, onClose, onQuizCreated, initialGrade = 8 }) => {
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'questions' | 'import' | 'random'
  
  // Exam General Settings
  const [examTitle, setExamTitle] = useState('');
  const [examDesc, setExamDesc] = useState('');
  const [gradeLevel, setGradeLevel] = useState(initialGrade);
  const [unitTopic, setUnitTopic] = useState(GRADE_UNITS_MAP[initialGrade]?.[0]?.label || 'Unit 1');
  const [timeLimit, setTimeLimit] = useState(45); // 15, 30, 45, 60, 0
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [allowPhotoUpload, setAllowPhotoUpload] = useState(true);

  // Question List State
  const [questions, setQuestions] = useState([
    {
      id: 'q1',
      type: 'single_choice', // 'single_choice' | 'multi_choice' | 'true_false' | 'fill_blank' | 'matching' | 'essay'
      difficulty: 'medium', // 'easy' | 'medium' | 'hard'
      question: 'What is the synonym of "famous" in Grade 8 Unit 1?',
      options: ['Well-known', 'Unknown', 'Secret', 'Quiet'],
      correctAnswer: 'Well-known'
    },
    {
      id: 'q2',
      type: 'multi_choice',
      difficulty: 'hard',
      question: 'Which of the following are healthy lifestyle habits? (Choose ALL that apply)',
      options: ['Eating fresh vegetables', 'Drinking plenty of water', 'Staying up past midnight', 'Exercising daily'],
      correctAnswer: ['Eating fresh vegetables', 'Drinking plenty of water', 'Exercising daily']
    },
    {
      id: 'q3',
      type: 'true_false',
      difficulty: 'easy',
      question: 'The present simple tense is used for permanent facts and daily routines.',
      options: ['Đúng (True)', 'Sai (False)'],
      correctAnswer: 'Đúng (True)'
    },
    {
      id: 'q4',
      type: 'fill_blank',
      difficulty: 'medium',
      question: 'She enjoys _____ (read) books in her free time.',
      correctAnswer: 'reading'
    },
    {
      id: 'q5',
      type: 'matching',
      difficulty: 'medium',
      question: 'Nối từ tiếng Anh với nghĩa tiếng Việt tương ứng:',
      pairs: [
        { left: 'Volunteer', right: 'Tình nguyện viên' },
        { left: 'Craftsman', right: 'Thợ thủ công' },
        { left: 'Community', right: 'Cộng đồng' }
      ]
    },
    {
      id: 'q6',
      type: 'essay',
      difficulty: 'hard',
      question: 'Write a paragraph (80-100 words) about your favorite hobby or community service activity.',
      allowPhoto: true
    }
  ]);

  // Form State for Adding New Question
  const [newType, setNewType] = useState('single_choice');
  const [newDifficulty, setNewDifficulty] = useState('medium');
  const [newQText, setNewQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctSingle, setCorrectSingle] = useState('A');
  const [correctMulti, setCorrectMulti] = useState({ A: true, B: false, C: false, D: false });
  const [tfCorrect, setTfCorrect] = useState('True');
  const [fillAnswer, setFillAnswer] = useState('');

  // Import Text / File State
  const [importText, setImportText] = useState('');

  // Random Generator State
  const [numEasy, setNumEasy] = useState(3);
  const [numMedium, setNumMedium] = useState(4);
  const [numHard, setNumHard] = useState(3);

  if (!isOpen) return null;

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQText.trim()) return;

    let qObj = {
      id: `q_${Date.now()}`,
      type: newType,
      difficulty: newDifficulty,
      question: newQText
    };

    if (newType === 'single_choice') {
      const opts = [optA || 'Đáp án A', optB || 'Đáp án B', optC || 'Đáp án C', optD || 'Đáp án D'];
      const correctIdx = correctSingle === 'A' ? 0 : correctSingle === 'B' ? 1 : correctSingle === 'C' ? 2 : 3;
      qObj.options = opts;
      qObj.correctAnswer = opts[correctIdx];
    } else if (newType === 'multi_choice') {
      const opts = [optA || 'Đáp án A', optB || 'Đáp án B', optC || 'Đáp án C', optD || 'Đáp án D'];
      const correctArr = [];
      if (correctMulti.A) correctArr.push(opts[0]);
      if (correctMulti.B) correctArr.push(opts[1]);
      if (correctMulti.C) correctArr.push(opts[2]);
      if (correctMulti.D) correctArr.push(opts[3]);
      qObj.options = opts;
      qObj.correctAnswer = correctArr;
    } else if (newType === 'true_false') {
      qObj.options = ['Đúng (True)', 'Sai (False)'];
      qObj.correctAnswer = tfCorrect === 'True' ? 'Đúng (True)' : 'Sai (False)';
    } else if (newType === 'fill_blank') {
      qObj.correctAnswer = fillAnswer;
    } else if (newType === 'essay') {
      qObj.allowPhoto = true;
    }

    setQuestions([...questions, qObj]);
    setNewQText(''); setOptA(''); setOptB(''); setOptC(''); setOptD(''); setFillAnswer('');
    try { soundFX.playFanfare(); } catch (e) {}
  };

  const handleSaveExam = () => {
    if (!examTitle.trim()) {
      alert('Vui lòng nhập Tiêu đề đề thi!');
      return;
    }
    if (questions.length === 0) {
      alert('Vui lòng thêm ít nhất 1 câu hỏi vào đề thi!');
      return;
    }

    const newQuizObj = {
      id: `exam-custom-${Date.now()}`,
      title: examTitle,
      description: examDesc || `Đề thi ${examTitle} gồm ${questions.length} câu hỏi tổng hợp.`,
      grade_level: Number(gradeLevel),
      unit: unitTopic,
      teacher_name: 'Thầy Nguyễn Văn Hải VIP',
      created_at: new Date().toISOString(),
      time_limit_minutes: Number(timeLimit),
      is_published: true,
      exam_code: `EXAM-G${gradeLevel}-${Math.floor(100 + Math.random() * 900)}`,
      shuffleQuestions,
      shuffleOptions,
      allowPhotoUpload,
      questions: [
        {
          id: 'sec_custom',
          title: 'I. NỘI DUNG ĐỀ THI TỔNG HỢP',
          enabled: true,
          tasks: [
            {
              task_title: `BÀI THI ${questions.length} CÂU HỎI`,
              task_desc: `Đề thi gồm trắc nghiệm 1 đáp án, nhiều đáp án, đúng/sai, điền từ, kéo thả và tự luận.`,
              questions: questions.map((q, idx) => ({
                id: q.id,
                num: idx + 1,
                qText: q.question,
                type: q.type,
                difficulty: q.difficulty,
                options: q.options || [],
                correct: q.correctAnswer,
                pairs: q.pairs || [],
                allowPhoto: q.allowPhoto
              }))
            }
          ]
        }
      ]
    };

    // Save to LocalStorage
    const existing = JSON.parse(localStorage.getItem('saved_quizzes_local') || '[]');
    localStorage.setItem('saved_quizzes_local', JSON.stringify([newQuizObj, ...existing]));

    try { soundFX.playFanfare(); } catch (e) {}
    confetti({ particleCount: 150, spread: 90 });
    if (onQuizCreated) onQuizCreated(newQuizObj);
    onClose();
  };

  const handleImportParse = () => {
    if (!importText.trim()) return;
    const blocks = importText.split(/\n\s*\n/);
    const parsed = [];

    blocks.forEach((block, idx) => {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length >= 3) {
        const qLine = lines[0].replace(/^Câu\s*\d+[:.]?\s*/i, '');
        const opts = lines.slice(1, 5).map(l => l.replace(/^[A-D][:.]?\s*/i, ''));
        parsed.push({
          id: `imp_${Date.now()}_${idx}`,
          type: 'single_choice',
          difficulty: 'medium',
          question: qLine,
          options: opts.length >= 2 ? opts : [opts[0] || 'Đáp án A', opts[1] || 'Đáp án B', 'Đáp án C', 'Đáp án D'],
          correctAnswer: opts[0]
        });
      }
    });

    if (parsed.length > 0) {
      setQuestions([...questions, ...parsed]);
      setImportText('');
      setActiveTab('questions');
      try { soundFX.playFanfare(); } catch (e) {}
      alert(`✨ Đã nhập thành công ${parsed.length} câu hỏi từ Word/Excel!`);
    } else {
      alert('Chưa nhận diện được cấu trúc câu hỏi. Vui lòng kiểm tra lại định dạng text!');
    }
  };

  return (
    <div className="fixed top-20 left-0 right-0 bottom-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-start justify-center p-3 sm:p-4 overflow-y-auto pt-2 pb-6">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-5xl w-full border-4 border-slate-800 shadow-2xl overflow-hidden relative font-sans max-h-[84vh] flex flex-col">
        
        {/* MODAL HEADER */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                Hệ Thống Soạn Ngân Hàng Đề Thi & Bài Kiểm Tra 4.0
              </h2>
              <p className="text-xs text-slate-400 font-bold">
                Tích hợp 6 loại câu hỏi, Trộn đề ngẫu nhiên, Hẹn giờ đếm ngược & Tải ảnh bài tự luận
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" /> Đóng
          </button>
        </div>

        {/* TOP TAB NAVIGATION */}
        <div className="flex items-center gap-2 p-3 bg-slate-900 border-b border-slate-800 shrink-0 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'settings'
                ? 'bg-brand-600 text-white shadow'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" /> 1. Cài Đặt Đề Thi & Hẹn Giờ
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'questions'
                ? 'bg-brand-600 text-white shadow'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" /> 2. Danh Sách Câu Hỏi ({questions.length})
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'import'
                ? 'bg-brand-600 text-white shadow'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> 3. Import Từ Word / Excel
          </button>

          <button
            onClick={() => setActiveTab('random')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'random'
                ? 'bg-brand-600 text-white shadow'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <Dices className="w-4 h-4" /> 4. Rút Ngẫu Nhiên Theo Độ Khó
          </button>
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-5 max-w-3xl mx-auto">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Tiêu đề đề thi / bài kiểm tra:</label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: BÀI KIỂM TRA 1 TIẾT HỌC KỲ 1 TIẾNG ANH KHỐI 8"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Chọn Khối Lớp:</label>
                  <select 
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-white"
                  >
                    <option value={6}>Khối Lớp 6</option>
                    <option value={7}>Khối Lớp 7</option>
                    <option value={8}>Khối Lớp 8</option>
                    <option value={9}>Khối Lớp 9</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Chủ đề / Unit bài học (Tự động liên kết theo Khối {gradeLevel}):</label>
                  <select 
                    value={unitTopic}
                    onChange={(e) => setUnitTopic(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-emerald-400 focus:outline-none focus:border-brand-500"
                  >
                    {(GRADE_UNITS_MAP[gradeLevel] || []).map((u) => (
                      <option key={u.value} value={u.label}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ⏱️ ĐỒNG HỒ ĐẾM NGƯỢC */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase">
                  ⏱️ CÀI ĐẶT ĐỒNG HỒ ĐẾM NGƯỢC
                </h4>
                <div className="flex items-center gap-2">
                  {[15, 30, 45, 60, 0].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setTimeLimit(mins)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black border transition-all ${
                        timeLimit === mins
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {mins === 0 ? '∞ Không giới hạn' : `${mins} Phút`}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  💡 Khi học sinh làm bài, đồng hồ đếm ngược chạy trực tiếp trên đầu. Hết giờ hệ thống sẽ tự động nộp bài!
                </p>
              </div>

              {/* 🔀 TRỘN CÂU HỎI & ĐÁP ÁN */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs font-bold">
                <h4 className="text-xs font-black text-indigo-400 flex items-center gap-1.5 uppercase">
                  🔀 TRỘN CÂU HỎI & ĐÁP ÁN (TỰ ĐỘNG ĐẢO THỨ TỰ CHO TỪNG HỌC SINH)
                </h4>

                <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-900">
                  <span>Trộn thứ tự câu hỏi trong đề thi</span>
                  <input type="checkbox" checked={shuffleQuestions} onChange={(e) => setShuffleQuestions(e.target.checked)} className="accent-indigo-500 w-4 h-4" />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-900">
                  <span>Trộn thứ tự các đáp án A, B, C, D</span>
                  <input type="checkbox" checked={shuffleOptions} onChange={(e) => setShuffleOptions(e.target.checked)} className="accent-indigo-500 w-4 h-4" />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-900">
                  <span>Cho phép học sinh tải ảnh chụp bài làm tự luận thủ công</span>
                  <input type="checkbox" checked={allowPhotoUpload} onChange={(e) => setAllowPhotoUpload(e.target.checked)} className="accent-indigo-500 w-4 h-4" />
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: QUESTIONS LIST & ADD FORM */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              {/* FORM THÊM CÂU HỎI NÂNG CẤO (6 LOẠI CÂU HỎI) */}
              <form onSubmit={handleAddQuestion} className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <span className="font-black text-xs text-white uppercase flex items-center gap-1.5">
                    + THÊM CÂU HỎI MỚI VÀO NGÂN HÀNG
                  </span>

                  <div className="flex items-center gap-3 text-xs">
                    <select 
                      value={newType} 
                      onChange={(e) => setNewType(e.target.value)}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-indigo-300"
                    >
                      <option value="single_choice">🔘 Trắc nghiệm 1 Đáp án</option>
                      <option value="multi_choice">☑️ Trắc nghiệm Nhiều Đáp án</option>
                      <option value="true_false">☯️ Câu hỏi Đúng / Sai</option>
                      <option value="fill_blank">✍️ Điền chỗ trống</option>
                      <option value="matching">🔗 Kéo thả / Nối từ</option>
                      <option value="essay">📄 Tự luận / Gõ văn bản & Tải ảnh</option>
                    </select>

                    <select 
                      value={newDifficulty} 
                      onChange={(e) => setNewDifficulty(e.target.value)}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-amber-300"
                    >
                      <option value="easy">🟢 Độ khó: Dễ</option>
                      <option value="medium">🟡 Độ khó: Trung bình</option>
                      <option value="hard">🔴 Độ khó: Khó</option>
                    </select>
                  </div>
                </div>

                <input 
                  type="text" 
                  placeholder="Nhập nội dung câu hỏi..." 
                  value={newQText} 
                  onChange={(e) => setNewQText(e.target.value)} 
                  className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-brand-500" 
                  required
                />

                {/* DYNAMIC OPTIONS FOR DIFFERENT QUESTION TYPES */}
                {newType === 'single_choice' && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-400">NHẬP 4 PHƯƠNG ÁN & CHỌN 1 ĐÁP ÁN ĐÚNG:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {['A', 'B', 'C', 'D'].map((lbl, idx) => (
                        <div key={lbl} className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name="correctSingle" 
                            checked={correctSingle === lbl} 
                            onChange={() => setCorrectSingle(lbl)}
                            className="accent-emerald-500 cursor-pointer"
                          />
                          <span className="font-bold text-slate-400">{lbl}:</span>
                          <input 
                            type="text" 
                            placeholder={`Đáp án ${lbl}`}
                            value={idx === 0 ? optA : idx === 1 ? optB : idx === 2 ? optC : optD}
                            onChange={(e) => idx === 0 ? setOptA(e.target.value) : idx === 1 ? setOptB(e.target.value) : idx === 2 ? setOptC(e.target.value) : setOptD(e.target.value)}
                            className="flex-1 p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {newType === 'true_false' && (
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span>Đáp án đúng:</span>
                    <button type="button" onClick={() => setTfCorrect('True')} className={`px-4 py-2 rounded-xl border ${tfCorrect === 'True' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-900 text-slate-400'}`}>Đúng (True)</button>
                    <button type="button" onClick={() => setTfCorrect('False')} className={`px-4 py-2 rounded-xl border ${tfCorrect === 'False' ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-900 text-slate-400'}`}>Sai (False)</button>
                  </div>
                )}

                {newType === 'fill_blank' && (
                  <input 
                    type="text" 
                    placeholder="Nhập từ/cụm từ chính xác cần điền vào chỗ trống..." 
                    value={fillAnswer} 
                    onChange={(e) => setFillAnswer(e.target.value)} 
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-400" 
                  />
                )}

                <div className="flex justify-end pt-2">
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs shadow-lg flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Thêm Câu Hỏi Này
                  </button>
                </div>
              </form>

              {/* LIST OF ADDED QUESTIONS */}
              <div className="space-y-3">
                <h4 className="font-black text-xs text-slate-300 uppercase tracking-wider">
                  DANH SÁCH {questions.length} CÂU HỎI TRONG ĐỀ THI:
                </h4>

                {questions.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-black text-white">
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-indigo-400 font-extrabold text-[10px]">
                          Câu {idx + 1}
                        </span>
                        <span>{q.question}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-slate-900 text-amber-400 text-[10px] font-bold uppercase">
                          {q.type}
                        </span>
                        <button onClick={() => setQuestions(questions.filter(item => item.id !== q.id))} className="text-rose-500 hover:text-rose-400 font-bold text-[10px]">
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: IMPORT */}
          {activeTab === 'import' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-black text-xs text-white uppercase flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> DÁN VĂN BẢN ĐỀ THI TỪ WORD / EXCEL
                </h4>
                <p className="text-xs text-slate-400 font-bold">
                  Hệ thống tự động bóc tách từng câu hỏi, 4 phương án A, B, C, D và thêm vào ngân hàng đề!
                </p>
              </div>

              <textarea
                rows={10}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={`Câu 1: What is the main topic of Unit 1?
A. Healthy living
B. Shopping online
C. Space exploration
D. Art history
Đáp án: A`}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-500"
              />

              <button 
                onClick={handleImportParse}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-lg"
              >
                📥 BÓC TÁCH VÀ NHẬP VÀO NGÂN HÀNG ĐỀ THI
              </button>
            </div>
          )}

          {/* TAB 4: RANDOM GENERATOR */}
          {activeTab === 'random' && (
            <div className="space-y-5 max-w-2xl mx-auto">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-center">
                <Dices className="w-10 h-10 text-brand-400 mx-auto animate-bounce" />
                <h4 className="font-black text-sm text-white uppercase">
                  TẠO ĐỀ THI NGẪU NHIÊN THEO ĐỘ KHÓ (DỄ / TRUNG BÌNH / KHÓ)
                </h4>
                <p className="text-xs text-slate-400 font-bold">
                  Rút ngẫu nhiên X câu hỏi từ Ngân hàng câu hỏi theo tỉ lệ ma trận đề thi!
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs font-bold">
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                  <span className="text-emerald-400 font-black">🟢 Số Câu Dễ:</span>
                  <input type="number" min="0" value={numEasy} onChange={(e) => setNumEasy(Number(e.target.value))} className="w-full p-2 text-center rounded-xl bg-slate-900 border text-white font-black" />
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-center space-y-2">
                  <span className="text-amber-400 font-black">🟡 Số Câu Trung Bình:</span>
                  <input type="number" min="0" value={numMedium} onChange={(e) => setNumMedium(Number(e.target.value))} className="w-full p-2 text-center rounded-xl bg-slate-900 border text-white font-black" />
                </div>

                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-center space-y-2">
                  <span className="text-rose-400 font-black">🔴 Số Câu Khó:</span>
                  <input type="number" min="0" value={numHard} onChange={(e) => setNumHard(Number(e.target.value))} className="w-full p-2 text-center rounded-xl bg-slate-900 border text-white font-black" />
                </div>
              </div>

              <button 
                onClick={() => {
                  try { soundFX.playFanfare(); } catch (e) {}
                  alert(`✨ Đã tự động rút ngẫu nhiên ${numEasy + numMedium + numHard} câu hỏi theo đúng ma trận đề thi!`);
                  setActiveTab('questions');
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-black text-xs shadow-xl"
              >
                🎲 RÚT NGẪU NHIÊN VÀ HOÀN THIỆN ĐỀ THI
              </button>
            </div>
          )}

        </div>

        {/* MODAL FOOTER BUTTONS */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-slate-400">
            Tổng cộng: <strong className="text-white font-black">{questions.length} câu hỏi</strong> trong bài kiểm tra
          </span>

          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs">
              Hủy
            </button>
            <button onClick={handleSaveExam} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg flex items-center gap-1.5">
              <Save className="w-4 h-4" /> LƯU VÀ XUẤT ĐỀ THI
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
