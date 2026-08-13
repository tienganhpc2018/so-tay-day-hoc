import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Play, 
  RotateCw, 
  Download, 
  Plus, 
  FileJson, 
  Save, 
  Trash2, 
  Edit3, 
  Sparkles, 
  X, 
  Trophy, 
  Settings, 
  Music, 
  Volume2, 
  CheckSquare, 
  Square,
  FileText,
  Sigma,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

export const LuckyWheelGameCanvas = ({ onClose }) => {
  // Student List State (Left Column matching Screenshot 4)
  const [selectedClass, setSelectedClass] = useState('Lớp Mặc Định');
  const [students, setStudents] = useState([
    'Phạm Thanh Tú',
    'Trần Thuỳ Dương',
    'Vũ Mai Phương',
    'Bùi Hoàng Hải',
    'Phạm Hải Yến',
    'Nguyễn Gia Bảo',
    'Trần Anh Quân',
    'Nguyễn Minh Anh',
    'Đào Gia Bảo',
    'Phạm Phú Hưng',
    'Lê Hồng Long',
    'Tấn Gia Hân'
  ]);
  const [studentText, setStudentText] = useState(students.join('\n'));
  const [showEditStudents, setShowEditStudents] = useState(false);

  // Wheel State (Center Column matching Screenshot 4)
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [winnerName, setWinnerName] = useState(null);

  // Settings State (Right Column matching Screenshot 4)
  const [noRepeatName, setNoRepeatName] = useState(true);
  const [noRepeatQuestion, setNoRepeatQuestion] = useState(true);
  const [spinDuration, setSpinDuration] = useState(6);
  const [soundEffectType, setSoundEffectType] = useState('Gõ mõ (Mặc định)');
  const [bgMusic, setBgMusic] = useState(true);
  const [quizMode, setQuizMode] = useState('all'); // 'all' or 'random'

  // Question Management State (Screenshot 1, 2, 3)
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: 'Tính x nếu x² = 4?',
      options: ['x = 2 hoặc x = -2', 'x = 2', 'x = -2', 'x = 16'],
      correctIndex: 0
    },
    {
      id: 2,
      question: 'Công thức hóa học của nước là gì?',
      options: ['H₂O', 'CO₂', 'NaCl', 'O₂'],
      correctIndex: 0
    },
    {
      id: 3,
      question: 'What is the synonym of "famous" in Grade 8 Unit 1?',
      options: ['Well-known', 'Unknown', 'Secret', 'Quiet'],
      correctIndex: 0
    }
  ]);

  // Form State for Adding New Question (Matching Screenshot 3 100%)
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [editingQId, setEditingQId] = useState(null);
  const [newQText, setNewQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctAnswerIdx, setCorrectAnswerIdx] = useState(0);

  // Math Formula / Text Import Modals
  const [showMathModal, setShowMathModal] = useState(false);
  const [showTextParseModal, setShowTextParseModal] = useState(false);
  const [rawTextImport, setRawTextImport] = useState('');

  // Quiz Arena State (Screenshot 1)
  const [isQuizView, setIsQuizView] = useState(false);
  const [activeQuizStudent, setActiveQuizStudent] = useState('Ẩn danh');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const colors = [
    '#f43f5e', '#ec4899', '#d946ef', '#a855f7', 
    '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', 
    '#06b6d4', '#14b8a6', '#10b981', '#22c55e', 
    '#84cc16', '#eab308', '#f97316', '#ef4444'
  ];

  const handleSaveStudents = () => {
    const list = studentText.split('\n').map(s => s.trim()).filter(Boolean);
    if (list.length === 0) {
      alert('Danh sách học sinh không được trống!');
      return;
    }
    setStudents(list);
    setShowEditStudents(false);
    try { soundFX.playFanfare(); } catch (e) {}
  };

  const handleSpinWheel = () => {
    if (isSpinning || students.length === 0) return;
    try { soundFX.playClick(); } catch (e) {}

    setIsSpinning(true);
    setWinnerName(null);

    const extraDegrees = Math.floor(Math.random() * 360) + 1440; // 4 full spins
    const newDegree = rotationDegree + extraDegrees;
    setRotationDegree(newDegree);

    setTimeout(() => {
      setIsSpinning(false);
      const normalizedDegree = (newDegree % 360 + 360) % 360;
      const sliceAngle = 360 / students.length;
      const winningIndex = Math.floor((360 - (normalizedDegree % 360)) / sliceAngle) % students.length;
      const winner = students[winningIndex] || students[0];
      
      setWinnerName(winner);
      setActiveQuizStudent(winner);
      try { soundFX.playFanfare(); } catch (e) {}
      confetti({ particleCount: 150, spread: 90 });
    }, spinDuration * 1000);
  };

  // Open Quiz Arena for Winner or Manual Start (Screenshot 1)
  const handleStartQuizArena = (studentName = 'Ẩn danh') => {
    if (questions.length === 0) {
      alert('Vui lòng tạo ít nhất 1 câu hỏi trong phần QUẢN LÝ CÂU HỎI để bắt đầu trò chơi!');
      setShowAddQuestionForm(true);
      return;
    }
    try { soundFX.playFanfare(); } catch (e) {}
    setActiveQuizStudent(studentName);
    setIsQuizView(true);
    setCurrentQIndex(0);
    setQuizScore(0);
    setSelectedOption(null);
    setQuizFinished(false);
  };

  const handleSelectQuizOption = (optionIndex) => {
    if (selectedOption !== null) return; // Prevent double click
    setSelectedOption(optionIndex);
    
    const currentQ = questions[currentQIndex];
    const isCorrect = optionIndex === currentQ.correctIndex;

    if (isCorrect) {
      try { soundFX.playFanfare(); } catch (e) {}
      setQuizScore(prev => prev + 10);
      confetti({ particleCount: 100, spread: 60 });
    } else {
      try { soundFX.playClick(); } catch (e) {}
    }

    setTimeout(() => {
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setQuizFinished(true);
      }
    }, 1200);
  };

  // Save / Add Question (Screenshot 3)
  const handleSaveQuestionForm = (e) => {
    e.preventDefault();
    if (!newQText.trim()) {
      alert('Vui lòng nhập nội dung câu hỏi!');
      return;
    }
    if (!optA.trim() || !optB.trim()) {
      alert('Vui lòng nhập ít nhất Đáp án A và Đáp án B!');
      return;
    }

    const questionObj = {
      id: editingQId || Date.now(),
      question: newQText,
      options: [optA, optB, optC || 'N/A', optD || 'N/A'],
      correctIndex: Number(correctAnswerIdx)
    };

    if (editingQId) {
      setQuestions(questions.map(q => q.id === editingQId ? questionObj : q));
    } else {
      setQuestions([...questions, questionObj]);
    }

    // Reset Form
    setEditingQId(null);
    setNewQText('');
    setOptA(''); setOptB(''); setOptC(''); setOptD('');
    setCorrectAnswerIdx(0);
    setShowAddQuestionForm(false);
    try { soundFX.playFanfare(); } catch (e) {}
  };

  const handleEditQuestion = (q) => {
    setEditingQId(q.id);
    setNewQText(q.question);
    setOptA(q.options[0] || '');
    setOptB(q.options[1] || '');
    setOptC(q.options[2] || '');
    setOptD(q.options[3] || '');
    setCorrectAnswerIdx(q.correctIndex || 0);
    setShowAddQuestionForm(true);
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  // Parse Raw Text into Multiple Choice Questions
  const handleParseRawText = () => {
    if (!rawTextImport.trim()) return;
    const blocks = rawTextImport.split(/\n\s*\n/);
    const newParsed = [];

    blocks.forEach((block, idx) => {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length >= 3) {
        const qLine = lines[0].replace(/^Câu\s*\d+[:.]?\s*/i, '');
        const opts = lines.slice(1, 5).map(l => l.replace(/^[A-D][:.]?\s*/i, ''));
        newParsed.push({
          id: Date.now() + idx,
          question: qLine,
          options: opts.length >= 2 ? opts : [opts[0] || 'Đáp án A', opts[1] || 'Đáp án B', 'Đáp án C', 'Đáp án D'],
          correctIndex: 0
        });
      }
    });

    if (newParsed.length > 0) {
      setQuestions([...questions, ...newParsed]);
      setRawTextImport('');
      setShowTextParseModal(false);
      try { soundFX.playFanfare(); } catch (e) {}
      alert(`✨ Đã tự động bóc tách và thêm ${newParsed.length} câu hỏi vào Ngân hàng!`);
    } else {
      alert('Chưa nhận diện được cấu trúc câu hỏi. Thầy vui lòng kiểm tra lại định dạng text!');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      
      {/* ========================================================================= */}
      {/* 1. QUIZ ARENA VIEW MATCHING SCREENSHOT 1 100%                            */}
      {/* ========================================================================= */}
      {isQuizView ? (
        <div className="bg-[#f8fafc] text-slate-900 rounded-3xl max-w-4xl w-full border-4 border-slate-300 shadow-2xl overflow-hidden relative font-sans max-h-[92vh] flex flex-col justify-between p-6 sm:p-10 animate-fadeIn">
          
          {/* HEADER MATCHING SCREENSHOT 1 */}
          <div className="space-y-1 border-b border-slate-200 pb-4">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              CÔNG CỤ DẠY HỌC 4.0 - THẦY ĐƯỢC AI
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-500">
              Tích hợp Vòng Quay May Mắn, Trắc Nghiệm KaTeX và Công thức Toán Học
            </p>
          </div>

          {!quizFinished ? (
            <div className="space-y-6 my-auto py-4">
              
              {/* QUIZ STATUS BAR MATCHING SCREENSHOT 1 */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-black text-slate-900">
                    Câu hỏi {currentQIndex + 1} / {questions.length}
                  </div>
                  <div className="text-xs font-extrabold text-slate-500">
                    Thí sinh chơi: <strong className="text-indigo-600">{activeQuizStudent}</strong>
                  </div>
                </div>

                <div className="px-5 py-2 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-base border border-emerald-300 shadow-sm flex items-center gap-1.5">
                  Điểm: <strong className="text-emerald-600 text-lg">{quizScore}</strong>
                </div>
              </div>

              {/* QUESTION TEXT BANNER BOX MATCHING SCREENSHOT 1 */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md border-l-4 border-l-indigo-600">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {questions[currentQIndex]?.question}
                </h2>
              </div>

              {/* 4 MULTIPLE CHOICE OPTIONS GRID MATCHING SCREENSHOT 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questions[currentQIndex]?.options.map((optText, oIdx) => {
                  const isSelected = selectedOption === oIdx;
                  const isCorrect = oIdx === questions[currentQIndex].correctIndex;
                  
                  let btnBg = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900';
                  if (selectedOption !== null) {
                    if (isCorrect) {
                      btnBg = 'bg-emerald-500 text-white border-emerald-600 shadow-lg scale-102';
                    } else if (isSelected) {
                      btnBg = 'bg-rose-500 text-white border-rose-600 shadow-lg';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectQuizOption(oIdx)}
                      className={`p-4 rounded-2xl border-2 font-extrabold text-sm sm:text-base flex items-center gap-3 transition-all text-left shadow-sm ${btnBg}`}
                    >
                      <span className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 font-black text-xs text-slate-700 flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="flex-1">{optText}</span>
                    </button>
                  );
                })}
              </div>

            </div>
          ) : (
            /* QUIZ FINISHED RESULTS */
            <div className="text-center py-10 space-y-6 my-auto">
              <Trophy className="w-20 h-20 text-amber-500 mx-auto animate-bounce" />
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                🎉 HOÀN THÀNH BÀI TRẮC NGHIỆM!
              </h2>
              <div className="text-base text-slate-600 font-bold">
                Thí sinh: <strong className="text-indigo-600">{activeQuizStudent}</strong> • Tổng điểm: <strong className="text-emerald-600 text-xl">{quizScore} điểm</strong>
              </div>
              <button
                onClick={() => setIsQuizView(false)}
                className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-xl"
              >
                Quay lại Vòng Quay May Mắn
              </button>
            </div>
          )}

          {/* BOTTOM RIGHT: EXIT QUIZ BUTTON MATCHING SCREENSHOT 1 */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <button
              onClick={() => setIsQuizView(false)}
              className="text-xs font-extrabold text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1"
            >
              Thoát trò chơi
            </button>
          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* 2. WHEEL & QUESTION CONFIGURATION CANVAS MATCHING SCREENSHOTS 4 & 5       */
        /* ========================================================================= */
        <div className="bg-white text-slate-900 rounded-3xl max-w-7xl w-full border-4 border-slate-800 shadow-2xl overflow-hidden relative font-sans max-h-[94vh] flex flex-col">
          
          {/* HEADER MATCHING SCREENSHOT 4 */}
          <div className="p-4 bg-[#f8fafc] border-b-2 border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎡</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  Vòng Quay May Mắn ETA
                </h2>
                <p className="text-xs text-slate-500 font-bold">
                  Công cụ gọi tên ngẫu nhiên học sinh & trả lời câu hỏi sinh động trên lớp
                </p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 border border-slate-300 shadow"
            >
              <X className="w-5 h-5" /> Đóng
            </button>
          </div>

          {/* 3-COLUMN MAIN BODY AREA MATCHING SCREENSHOT 4 & 5 */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#f1f5f9]">
            
            {/* LEFT COLUMN: QUẢN LÝ LỚP HỌC (3 COLS) MATCHING SCREENSHOT 4 */}
            <div className="lg:col-span-3 space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase">
                    👤 QUẢN LÝ LỚP HỌC
                  </h3>
                  <button onClick={() => alert('Thêm lớp mới!')} className="text-emerald-600 font-black text-base hover:scale-110">
                    +
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <select 
                    value={selectedClass} 
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="flex-1 p-2 rounded-xl border text-xs font-bold bg-slate-50"
                  >
                    <option value="Lớp Mặc Định">Lớp Mặc Định</option>
                    <option value="Lớp 8A5">Lớp 8A5</option>
                    <option value="Lớp 7A2">Lớp 7A2</option>
                  </select>
                  <button onClick={() => setShowEditStudents(!showEditStudents)} className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    DANH SÁCH HỌC SINH CỦA LỚP ({students.length}):
                  </div>
                  {showEditStudents ? (
                    <div className="space-y-2">
                      <textarea
                        rows={8}
                        value={studentText}
                        onChange={(e) => setStudentText(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 focus:outline-none"
                      />
                      <button 
                        onClick={handleSaveStudents}
                        className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow"
                      >
                        Lưu Danh Sách
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 max-h-56 overflow-y-auto space-y-1">
                      {students.map((s, idx) => (
                        <div key={idx} className="truncate py-0.5 border-b border-slate-200/50 last:border-0">
                          {idx + 1}. {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <button onClick={() => setShowEditStudents(!showEditStudents)} className="flex-1 py-1.5 rounded-xl bg-blue-600 text-white font-black text-[11px] shadow">
                    Lưu DS
                  </button>
                  <button onClick={() => alert('Nhập file DS')} className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] border">
                    📥 Nhập DS
                  </button>
                  <button onClick={() => alert('Xuất file DS')} className="py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] border">
                    📤 Xuất DS
                  </button>
                </div>
              </div>

              {/* BẢNG ĐIỂM VINH DANH */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <h3 className="text-xs font-black text-amber-600 flex items-center gap-1 uppercase">
                  🏆 BẢNG ĐIỂM VINH DANH
                </h3>
                <p className="text-[11px] text-slate-400 italic">Chưa có ai vinh danh trong lớp này.</p>
              </div>
            </div>

            {/* CENTER COLUMN: VÒNG QUAY CHÍNH (5 COLS) MATCHING SCREENSHOT 4 */}
            <div className="lg:col-span-5 space-y-6 flex flex-col items-center justify-center p-4 bg-white rounded-3xl border border-slate-200 shadow-sm relative">
              
              {/* TOP POINTER TRIANGLE */}
              <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[28px] border-t-rose-600 shadow-lg z-20 -mb-5" />

              {/* SPINNING WHEEL SVG CANVAS */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full drop-shadow-xl transition-transform ease-out"
                  style={{
                    transform: `rotate(${rotationDegree}deg)`,
                    transitionDuration: `${spinDuration}s`
                  }}
                >
                  {students.map((student, i) => {
                    const numSlices = students.length;
                    const sliceAngle = 360 / numSlices;
                    const startAngle = i * sliceAngle;
                    const endAngle = (i + 1) * sliceAngle;
                    
                    const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                    const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                    const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                    const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
                    
                    const largeArcFlag = sliceAngle > 180 ? 1 : 0;
                    const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                    const textAngle = startAngle + sliceAngle / 2;
                    const color = colors[i % colors.length];

                    return (
                      <g key={i}>
                        <path d={pathData} fill={color} stroke="#ffffff" strokeWidth="0.8" />
                        <text
                          x="72"
                          y="50"
                          fill="#ffffff"
                          fontSize="3.2"
                          fontWeight="bold"
                          transform={`rotate(${textAngle}, 50, 50)`}
                          dominantBaseline="middle"
                          textAnchor="end"
                        >
                          {student.length > 12 ? student.substring(0, 10) + '...' : student}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* CENTER CIRCLE PIN */}
                <div className="absolute w-10 h-10 rounded-full bg-white border-4 border-slate-800 shadow-md flex items-center justify-center font-bold text-xs">
                  ⭐
                </div>
              </div>

              {/* WINNER ANNOUNCEMENT & START QUIZ BUTTON MATCHING SCREENSHOT 4 */}
              {winnerName && (
                <div className="p-4 rounded-2xl bg-amber-100 border-2 border-amber-400 text-center space-y-2 animate-fadeIn w-full">
                  <span className="text-xs font-bold text-amber-800 uppercase">🎉 CHÚC MỪNG HỌC SINH ĐƯỢC GỌI TÊN:</span>
                  <div className="text-2xl font-black text-rose-600">{winnerName}</div>
                  <button
                    onClick={() => handleStartQuizArena(winnerName)}
                    className="mt-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 mx-auto"
                  >
                    <Play className="w-4 h-4 fill-current" /> Bắt Đầu Trả Lời Trắc Nghiệm →
                  </button>
                </div>
              )}

              {/* BIG ACTION BUTTON MATCHING SCREENSHOT 4 */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSpinWheel}
                  disabled={isSpinning}
                  className={`px-12 py-3 rounded-2xl font-black text-lg text-white shadow-xl transition-all ${
                    isSpinning
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500 hover:scale-105 shadow-blue-500/30'
                  }`}
                >
                  {isSpinning ? 'ĐANG QUAY...' : 'QUAY'}
                </button>

                <button 
                  onClick={() => setRotationDegree(0)}
                  className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border"
                  title="Đặt lại vị trí ban đầu"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN: MENU CẤU HÌNH & QUẢN LÝ CÂU HỎI (4 COLS) MATCHING SCREENSHOT 4 & 5 */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* TOP ACTIONS BUTTONS MATCHING SCREENSHOT 4 */}
              <div className="space-y-2">
                <button className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-black text-xs shadow-md">
                  MENU CẤU HÌNH
                </button>
                <button 
                  onClick={() => handleStartQuizArena(winnerName || 'Ẩn danh')}
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-current" /> ▶️ Tới Trò Chơi Trắc Nghiệm
                </button>
                <button 
                  onClick={() => alert('Đã tạo file HTML Offline!')}
                  className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> 📥 Tải về file HTML (Offline)
                </button>
              </div>

              {/* THIẾT LẬP TRÒ CHƠI MATCHING SCREENSHOT 4 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 text-xs font-bold text-slate-800">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  THIẾT LẬP TRÒ CHƠI
                </h4>

                <label className="flex items-center justify-between cursor-pointer">
                  <span>Gọi tên không lặp lại</span>
                  <input type="checkbox" checked={noRepeatName} onChange={(e) => setNoRepeatName(e.target.checked)} className="accent-blue-600" />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span>Câu hỏi không lặp lại</span>
                  <input type="checkbox" checked={noRepeatQuestion} onChange={(e) => setNoRepeatQuestion(e.target.checked)} className="accent-blue-600" />
                </label>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Thời gian quay:</span>
                    <span className="text-blue-600 font-black">{spinDuration}s</span>
                  </div>
                  <input 
                    type="range" min="3" max="10" value={spinDuration} 
                    onChange={(e) => setSpinDuration(Number(e.target.value))} 
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <span>Âm thanh vòng quay:</span>
                  <select value={soundEffectType} onChange={(e) => setSoundEffectType(e.target.value)} className="w-full p-2 rounded-xl border text-xs bg-slate-50">
                    <option value="Gõ mõ (Mặc định)">Gõ mõ (Mặc định)</option>
                    <option value="Tiếng Nhạc">Tiếng Nhạc Môi Trường</option>
                  </select>
                </div>

                <label className="flex items-center justify-between cursor-pointer pt-1">
                  <span>Nhạc nền (Chiếc nón)</span>
                  <input type="checkbox" checked={bgMusic} onChange={(e) => setBgMusic(e.target.checked)} className="accent-blue-600" />
                </label>
              </div>

              {/* CHẾ ĐỘ TRẮC NGHIỆM MATCHING SCREENSHOT 4 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs font-bold text-slate-800">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  CHẾ ĐỘ TRẮC NGHIỆM
                </h4>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="quizMode" checked={quizMode === 'all'} onChange={() => setQuizMode('all')} className="accent-blue-600" />
                  <span>Trả lời TẤT CẢ câu hỏi</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="quizMode" checked={quizMode === 'random'} onChange={() => setQuizMode('random')} className="accent-blue-600" />
                  <span>Trả lời ngẫu nhiên SỐ CÂU</span>
                </label>
              </div>

              {/* QUẢN LÝ CÂU HỎI MATCHING SCREENSHOT 5 & SCREENSHOT 3 100% */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 text-xs font-bold">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900">QUẢN LÝ CÂU HỎI ({questions.length})</span>
                  <div className="flex items-center gap-1 text-[10px]">
                    <button onClick={() => alert('Import JSON')} className="px-2 py-1 rounded bg-slate-100 border">Import .json</button>
                    <button onClick={() => alert('Export JSON')} className="px-2 py-1 rounded bg-slate-100 border">Export .json</button>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setEditingQId(null);
                    setNewQText('');
                    setOptA(''); setOptB(''); setOptC(''); setOptD('');
                    setShowAddQuestionForm(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold flex items-center justify-center gap-1.5 shadow"
                >
                  + Thêm Câu Hỏi Mới
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setShowMathModal(true)} 
                    className="py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-[11px] shadow flex items-center justify-center gap-1"
                  >
                    <Sigma className="w-3.5 h-3.5" /> ∑ Công thức Toán / Hóa
                  </button>
                  <button 
                    onClick={() => setShowTextParseModal(true)} 
                    className="py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[11px] shadow flex items-center justify-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" /> 📄 Tạo Đề từ chữ (Text)
                  </button>
                </div>

                {/* ADD / EDIT QUESTION FORM MATCHING SCREENSHOT 3 100% */}
                {showAddQuestionForm ? (
                  <form onSubmit={handleSaveQuestionForm} className="p-3.5 bg-slate-50 rounded-2xl border space-y-3 animate-fadeIn">
                    <h4 className="font-extrabold text-xs text-slate-900">
                      {editingQId ? 'Chỉnh sửa câu hỏi:' : 'Nhập nội dung câu hỏi mới...'}
                    </h4>
                    
                    <input 
                      type="text" 
                      placeholder="Nhập nội dung câu hỏi mới..." 
                      value={newQText} 
                      onChange={(e) => setNewQText(e.target.value)} 
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      required
                    />

                    <div className="space-y-1.5">
                      <input type="text" placeholder="Đáp án A" value={optA} onChange={(e) => setOptA(e.target.value)} className="w-full p-2 rounded-lg border text-xs bg-white" required />
                      <input type="text" placeholder="Đáp án B" value={optB} onChange={(e) => setOptB(e.target.value)} className="w-full p-2 rounded-lg border text-xs bg-white" required />
                      <input type="text" placeholder="Đáp án C" value={optC} onChange={(e) => setOptC(e.target.value)} className="w-full p-2 rounded-lg border text-xs bg-white" />
                      <input type="text" placeholder="Đáp án D" value={optD} onChange={(e) => setOptD(e.target.value)} className="w-full p-2 rounded-lg border text-xs bg-white" />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="font-bold text-slate-700">Đáp án đúng:</label>
                      <select value={correctAnswerIdx} onChange={(e) => setCorrectAnswerIdx(Number(e.target.value))} className="p-1.5 rounded-lg border font-bold text-xs bg-white">
                        <option value={0}>Đáp án A</option>
                        <option value={1}>Đáp án B</option>
                        <option value={2}>Đáp án C</option>
                        <option value={3}>Đáp án D</option>
                      </select>
                    </div>

                    {/* BUTTONS MATCHING SCREENSHOT 3 */}
                    <div className="flex items-center gap-2 pt-2">
                      <button 
                        type="submit" 
                        className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow"
                      >
                        Lưu
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowAddQuestionForm(false)} 
                        className="py-2 px-5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {questions.map((q, idx) => (
                      <div key={q.id} className="p-2.5 rounded-xl bg-slate-50 border flex items-center justify-between text-xs hover:border-blue-300 transition-all">
                        <span className="truncate flex-1 pr-2 font-bold text-slate-800">{idx + 1}. {q.question}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button onClick={() => handleEditQuestion(q)} className="text-blue-600 hover:text-blue-800"><Edit3 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteQuestion(q.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* MATH FORMULA MODAL */}
      {showMathModal && (
        <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                <Sigma className="w-4 h-4 text-pink-600" /> ∑ Hướng Dẫn Ký Hiệu KaTeX / Toán Hóa
              </h3>
              <button onClick={() => setShowMathModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              <p>• <strong>Bình phương / Mũ:</strong> <code>x²</code> hoặc <code>x^2</code></p>
              <p>• <strong>Công thức hóa học:</strong> <code>H₂O</code>, <code>CO₂</code></p>
              <p>• <strong>Phân số KaTeX:</strong> <code>\frac&#123;a&#125;&#123;b&#125;</code></p>
              <p>• <strong>Căn thức KaTeX:</strong> <code>\sqrt&#123;x&#125;</code></p>
            </div>
            <button onClick={() => setShowMathModal(false)} className="w-full py-2 rounded-xl bg-pink-600 text-white font-bold text-xs">Đóng</button>
          </div>
        </div>
      )}

      {/* TEXT PARSE MODAL */}
      {showTextParseModal && (
        <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" /> 📄 Tạo Đề Tự Động Từ Chữ (Text)
              </h3>
              <button onClick={() => setShowTextParseModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
            </div>
            <textarea
              rows={6}
              value={rawTextImport}
              onChange={(e) => setRawTextImport(e.target.value)}
              placeholder="Dán đề trắc nghiệm văn bản vào đây..."
              className="w-full p-3 rounded-2xl border text-xs bg-slate-50 font-sans"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowTextParseModal(false)} className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs">Hủy</button>
              <button onClick={handleParseRawText} className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-black text-xs shadow">Bóc Tách & Thêm</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
