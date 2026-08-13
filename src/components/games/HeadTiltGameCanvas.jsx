import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Plus, 
  BookOpen, 
  FileJson, 
  Save, 
  Play, 
  RotateCw, 
  Home, 
  Star, 
  Clock, 
  Sliders, 
  Keyboard, 
  HelpCircle, 
  X,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

export const HeadTiltGameCanvas = ({ onClose }) => {
  // Game Setup States matching Screenshot 1
  const [cameraActive, setCameraActive] = useState(false);
  const [timePerQuestion, setTimePerQuestion] = useState(15);
  const [tiltSensitivity, setTiltSensitivity] = useState(25);
  
  // Question Bank State
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: 'What is the correct English word for "Sân trường"?',
      optA: 'Schoolyard',
      optB: 'Laboratory',
      correctOpt: 'A'
    },
    {
      id: 2,
      question: 'Choose the correct form: She _____ reading books in her free time.',
      optA: 'enjoys',
      optB: 'enjoying',
      correctOpt: 'A'
    },
    {
      id: 3,
      question: 'Which word means "Thợ thủ công"?',
      optA: 'Volunteer',
      optB: 'Craftsman',
      correctOpt: 'B'
    }
  ]);

  // Question Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [qText, setQText] = useState('');
  const [optAInput, setOptAInput] = useState('');
  const [optBInput, setOptBInput] = useState('');
  const [correctInput, setCorrectInput] = useState('A');

  // Game Flow States (setup, playing, result)
  const [gameState, setGameState] = useState('setup'); // 'setup' | 'playing' | 'result'
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scoreStars, setScoreStars] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [tiltDirection, setTiltDirection] = useState(null); // 'LEFT' | 'RIGHT' | null

  // Timer Effect during play
  useEffect(() => {
    let timer = null;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (gameState === 'playing' && timeLeft === 0) {
      handleChooseAnswer('TIMEOUT');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Keyboard shortcut support (← or A for Left, → or D for Right)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setTiltDirection('LEFT');
        handleChooseAnswer('A');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setTiltDirection('RIGHT');
        handleChooseAnswer('B');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentIdx]);

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!qText.trim() || !optAInput.trim() || !optBInput.trim()) return;
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        question: qText,
        optA: optAInput,
        optB: optBInput,
        correctOpt: correctInput
      }
    ]);
    setQText(''); setOptAInput(''); setOptBInput('');
    setShowAddForm(false);
    try { soundFX.playFanfare(); } catch (e) {}
  };

  const handleStartGame = () => {
    if (questions.length === 0) {
      alert('Vui lòng thêm ít nhất 1 câu hỏi để bắt đầu Vẹo Cổ!');
      return;
    }
    try { soundFX.playFanfare(); } catch (e) {}
    setGameState('playing');
    setCurrentIdx(0);
    setScoreStars(0);
    setCorrectCount(0);
    setTimeLeft(timePerQuestion);
  };

  const handleChooseAnswer = (chosenOpt) => {
    const currentQ = questions[currentIdx];
    const isCorrect = chosenOpt === currentQ.correctOpt;

    if (isCorrect) {
      try { soundFX.playFanfare(); } catch (e) {}
      setCorrectCount((prev) => prev + 1);
      setScoreStars((prev) => prev + 1);
    } else {
      try { soundFX.playClick(); } catch (e) {}
    }

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setTimeLeft(timePerQuestion);
      setTiltDirection(null);
    } else {
      setGameState('result');
      confetti({ particleCount: 150, spread: 80 });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      
      {/* 1. SETUP CANVAS MATCHING SCREENSHOT 1 */}
      {gameState === 'setup' && (
        <div className="bg-[#f0f4f8] text-slate-900 rounded-3xl max-w-5xl w-full border-4 border-slate-800 shadow-2xl overflow-hidden relative font-sans max-h-[92vh] flex flex-col">
          
          {/* HEADER MATCHING SCREENSHOT 1 */}
          <div className="p-4 bg-[#fefce8] border-b-2 border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🦒</span>
              <div>
                <h2 className="text-2xl font-black text-rose-500 tracking-tight flex items-center gap-2">
                  VẸO CỔ
                </h2>
                <p className="text-xs text-slate-700 font-extrabold">
                  🤪 Nghiêng đầu sang trái/phải để chọn đáp án! 🤪
                </p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center gap-1 border border-slate-400"
            >
              <X className="w-5 h-5" /> Đóng
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
            
            {/* BOX 1: CAMERA & NHẬN DIỆN KHUÔN MẶT */}
            <div className="p-4 rounded-2xl bg-white border-2 border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                📷 Camera & Nhận Diện Khuôn Mặt
              </h3>

              <div className="h-44 w-full rounded-2xl bg-[#262626] border-2 border-dashed border-slate-600 flex flex-col items-center justify-center space-y-3 text-white">
                <span className="text-3xl">🤳</span>
                <span className="text-xs font-bold text-slate-300">Bấm bật camera để bắt đầu!</span>
                <button
                  onClick={() => setCameraActive(!cameraActive)}
                  className={`px-6 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all ${
                    cameraActive
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-[#4ade80] hover:bg-[#22c55e] text-slate-950'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  {cameraActive ? 'Tắt Camera' : '📷 Bật Camera'}
                </button>
              </div>
            </div>

            {/* MIDDLE ROW: 2 COLUMNS MATCHING SCREENSHOT 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* LEFT COLUMN: SETTINGS */}
              <div className="space-y-4">
                
                {/* ⏱️ THỜI GIAN MỖI CÂU */}
                <div className="p-4 rounded-2xl bg-white border-2 border-slate-800 shadow-sm space-y-2">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1 uppercase">
                    ⏱️ Thời Gian Mỗi Câu
                  </h4>
                  <div className="flex items-center gap-2">
                    {[10, 15, 20, 30, 0].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTimePerQuestion(t)}
                        className={`flex-1 py-2 rounded-xl text-xs font-black border-2 transition-all ${
                          timePerQuestion === t
                            ? 'bg-[#84cc16] text-slate-950 border-slate-800 shadow'
                            : 'bg-white text-slate-800 border-slate-300 hover:border-slate-800'
                        }`}
                      >
                        {t === 0 ? '∞' : `${t}s`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 🎚️ ĐỘ NHẠY NGHIÊNG ĐẦU */}
                <div className="p-4 rounded-2xl bg-white border-2 border-slate-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-1 uppercase">
                      🎚️ Độ Nhạy Nghiêng Đầu
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#84cc16] text-slate-950 font-black text-xs border border-slate-800">
                      {tiltSensitivity}°
                    </span>
                  </div>

                  <input 
                    type="range" 
                    min="15" 
                    max="40" 
                    value={tiltSensitivity}
                    onChange={(e) => setTiltSensitivity(Number(e.target.value))}
                    className="w-full accent-[#84cc16] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Nhạy hơn (15°)</span>
                    <span>Chắc chắn (40°)</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#fefce8] border border-amber-300 text-[11px] text-amber-900 font-bold leading-tight">
                    💡 <strong>Khuyến nghị: 20°-30°</strong> — Đã có calibrate nên không cần quá cao. Đây là góc TƯƠNG ĐỐI so với tư thế ngồi tự nhiên!
                  </div>
                </div>

                {/* ⌨️ PHÍM TẮT DỰ PHÒNG */}
                <div className="p-3 rounded-2xl bg-white border-2 border-slate-800 shadow-sm text-xs font-bold space-y-1">
                  <span className="text-slate-700 flex items-center gap-1">⌨️ <strong>Phím Tắt Dự Phòng:</strong></span>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span>◀️ <strong>Trái:</strong> <code className="bg-slate-100 px-2 py-0.5 rounded border border-slate-400">←</code> hoặc <code className="bg-slate-100 px-2 py-0.5 rounded border border-slate-400">A</code></span>
                    <span><strong>Phải ▶️:</strong> <code className="bg-slate-100 px-2 py-0.5 rounded border border-slate-400">→</code> hoặc <code className="bg-slate-100 px-2 py-0.5 rounded border border-slate-400">D</code></span>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: QUESTION BANK MATCHING SCREENSHOT 1 */}
              <div className="p-4 rounded-2xl bg-white border-2 border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 uppercase">📝 Câu Hỏi</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#84cc16] text-slate-950 font-black text-[10px]">
                        {questions.length} câu
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button onClick={() => setShowAddForm(true)} className="px-2.5 py-1 rounded-lg bg-[#84cc16] hover:bg-[#65a30d] text-slate-950 font-black text-xs border border-slate-800 shadow">
                        + Thêm
                      </button>
                      <button onClick={() => alert('Đã mở ngân hàng câu hỏi!')} className="px-2.5 py-1 rounded-lg bg-[#eab308] hover:bg-[#ca8a04] text-slate-950 font-black text-xs border border-slate-800 shadow">
                        📚 Ngân hàng
                      </button>
                    </div>
                  </div>

                  {showAddForm ? (
                    <form onSubmit={handleAddQuestion} className="space-y-2 bg-[#fefce8] p-3 rounded-xl border border-amber-300">
                      <input type="text" placeholder="Nội dung câu hỏi nghiêng đầu..." value={qText} onChange={(e) => setQText(e.target.value)} className="w-full p-2 rounded-lg border text-xs bg-white" required />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Đáp án A (Nghiêng Trái)" value={optAInput} onChange={(e) => setOptAInput(e.target.value)} className="p-2 rounded-lg border text-xs bg-white" required />
                        <input type="text" placeholder="Đáp án B (Nghiêng Phải)" value={optBInput} onChange={(e) => setOptBInput(e.target.value)} className="p-2 rounded-lg border text-xs bg-white" required />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-bold">Đáp án đúng:</label>
                        <select value={correctInput} onChange={(e) => setCorrectInput(e.target.value)} className="p-1 rounded border font-bold text-xs bg-white">
                          <option value="A">A (Nghiêng Trái)</option>
                          <option value="B">B (Nghiêng Phải)</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <button type="submit" className="flex-1 py-1.5 rounded-lg bg-[#84cc16] text-slate-950 font-black text-xs">Lưu câu hỏi</button>
                        <button type="button" onClick={() => setShowAddForm(false)} className="py-1.5 px-3 rounded-lg bg-slate-300 text-slate-800 font-bold text-xs">Hủy</button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {questions.map((q, idx) => (
                        <div key={q.id} className="p-2.5 rounded-xl bg-[#fefce8] border border-amber-300 text-xs space-y-1">
                          <div className="font-black text-slate-900">Câu {idx + 1}: {q.question}</div>
                          <div className="flex justify-between text-[11px] font-bold text-slate-700">
                            <span className={q.correctOpt === 'A' ? 'text-emerald-600 font-black' : ''}>A (Trái): {q.optA}</span>
                            <span className={q.correctOpt === 'B' ? 'text-emerald-600 font-black' : ''}>B (Phải): {q.optB}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* BOTTOM MAIN START BUTTON MATCHING SCREENSHOT 1 */}
          <div className="p-4 bg-[#f0f4f8] border-t-2 border-slate-800 shrink-0">
            <button
              onClick={handleStartGame}
              className="w-full py-4 rounded-2xl bg-[#6ee7b7] hover:bg-[#34d399] text-slate-950 font-black text-xl shadow-xl border-2 border-slate-800 flex items-center justify-center gap-2 transition-all transform hover:scale-101"
            >
              🦒 BẮT ĐẦU VẸO CỔ!
            </button>
          </div>

        </div>
      )}

      {/* 2. PLAY ARENA MATCHING SCREENSHOT 2 */}
      {gameState === 'playing' && (
        <div className="bg-[#1e1b4b] text-white rounded-3xl max-w-5xl w-full border-4 border-indigo-500 shadow-2xl overflow-hidden relative font-sans max-h-[92vh] flex flex-col justify-between p-4 sm:p-6 space-y-6">
          
          {/* TOP ARENA BAR */}
          <div className="flex items-center justify-between border-b border-indigo-500/50 pb-4">
            <span className="px-4 py-1.5 rounded-2xl bg-amber-500/20 text-amber-300 font-black text-sm border border-amber-500/40 flex items-center gap-1.5">
              ⭐ {scoreStars}
            </span>
            <span className="text-sm font-black text-indigo-200">
              Câu {currentIdx + 1}/{questions.length}
            </span>
            <span className="px-4 py-1.5 rounded-2xl bg-emerald-500/20 text-emerald-300 font-black text-sm border border-emerald-500/40 flex items-center gap-1.5">
              ⏱️ {timeLeft}
            </span>
          </div>

          {/* QUESTION TEXT BANNER */}
          <div className="text-center py-4">
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-relaxed tracking-wide drop-shadow-lg">
              {questions[currentIdx]?.question}
            </h3>
          </div>

          {/* MAIN 3-COLUMN LAYOUT MATCHING SCREENSHOT 2 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch flex-1">
            
            {/* LEFT OPTION BOX (A - TRÁI) */}
            <div 
              onClick={() => handleChooseAnswer('A')}
              className={`md:col-span-5 rounded-3xl p-6 border-4 flex flex-col justify-between items-center text-center cursor-pointer transition-all ${
                tiltDirection === 'LEFT'
                  ? 'bg-rose-600/90 border-rose-400 scale-102 shadow-2xl'
                  : 'bg-[#2e1065]/70 border-purple-500/50 hover:bg-[#3b0764]'
              }`}
            >
              <div className="text-slate-300 font-black text-xs uppercase flex items-center gap-1">
                ◀️ TRÁI
              </div>
              <div className="my-auto py-6">
                <span className="px-6 py-4 rounded-2xl bg-rose-500/80 text-white font-black text-xl sm:text-2xl shadow-xl block border border-rose-300">
                  {questions[currentIdx]?.optA}
                </span>
              </div>
            </div>

            {/* CENTER WEBCAM / FACE PREVIEW */}
            <div className="md:col-span-2 rounded-2xl bg-black border-2 border-slate-700 flex flex-col items-center justify-center p-3 relative overflow-hidden min-h-[160px]">
              <span className="text-4xl animate-bounce">😳</span>
              <span className="text-[10px] text-slate-400 font-bold mt-2">Nghiêng đầu...</span>
            </div>

            {/* RIGHT OPTION BOX (B - PHẢI) */}
            <div 
              onClick={() => handleChooseAnswer('B')}
              className={`md:col-span-5 rounded-3xl p-6 border-4 flex flex-col justify-between items-center text-center cursor-pointer transition-all ${
                tiltDirection === 'RIGHT'
                  ? 'bg-blue-600/90 border-blue-400 scale-102 shadow-2xl'
                  : 'bg-[#1e293b]/70 border-blue-500/50 hover:bg-[#0f172a]'
              }`}
            >
              <div className="text-slate-300 font-black text-xs uppercase flex items-center gap-1">
                PHẢI ▶️
              </div>
              <div className="my-auto py-6">
                <span className="px-6 py-4 rounded-2xl bg-blue-600/80 text-white font-black text-xl sm:text-2xl shadow-xl block border border-blue-300">
                  {questions[currentIdx]?.optB}
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 3. END REPORT ARENA MATCHING SCREENSHOT 3 */}
      {gameState === 'result' && (
        <div className="bg-[#1e1b4b] text-white rounded-3xl max-w-md w-full border-4 border-indigo-500 shadow-2xl overflow-hidden relative font-sans animate-fadeIn">
          <div className="bg-[#4ade80] p-4 text-center border-b-4 border-slate-900">
            <span className="text-2xl">🦒</span>
            <h3 className="text-lg font-black text-slate-950 uppercase tracking-wide mt-1">
              BÁO CÁO TÌNH TRẠNG CỔ
            </h3>
          </div>

          <div className="p-8 text-center bg-[#fefce8] text-slate-900 space-y-6">
            <div className="flex justify-center gap-2 text-3xl">
              ⭐⭐⭐
            </div>

            <div className="text-3xl font-black text-emerald-600">
              {correctCount} / {questions.length} câu đúng
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                onClick={() => setGameState('setup')}
                className="py-3 px-4 rounded-2xl bg-[#4ade80] hover:bg-[#22c55e] text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 border-2 border-slate-900 shadow-md"
              >
                🔄 Chơi Lại
              </button>
              <button
                onClick={onClose}
                className="py-3 px-4 rounded-2xl bg-[#eab308] hover:bg-[#ca8a04] text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 border-2 border-slate-900 shadow-md"
              >
                🏠 Về Trang Chủ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
