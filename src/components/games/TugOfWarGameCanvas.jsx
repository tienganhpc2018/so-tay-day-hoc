import React, { useState } from 'react';
import { 
  Plus, 
  BookOpen, 
  FileJson, 
  Save, 
  Play, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Trophy, 
  Check, 
  X, 
  Sparkles, 
  Clock, 
  Users, 
  Zap, 
  HelpCircle,
  Music
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

export const TugOfWarGameCanvas = ({ onClose }) => {
  // Game Setup States
  const [gameMode, setGameMode] = useState('speed'); // 'speed' or 'long'
  const [blueTeamName, setBlueTeamName] = useState('Đội Xanh');
  const [redTeamName, setRedTeamName] = useState('Đội Đỏ');
  const [timePerQuestion, setTimePerQuestion] = useState(10); // 5, 10, 15, 20, 0 (infinite)
  const [selectedAvatarSet, setSelectedAvatarSet] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Question Bank State
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: 'What is the synonym of "famous" in Grade 8 Unit 1?',
      options: ['Well-known', 'Unknown', 'Secret', 'Quiet'],
      correctIndex: 0
    },
    {
      id: 2,
      question: 'She prefers _____ books in her leisure time.',
      options: ['reading', 'read', 'reads', 'to reading'],
      correctIndex: 0
    },
    {
      id: 3,
      question: 'Which word has a different stress pattern?',
      options: ['Activity', 'Community', 'Volunteer', 'Facility'],
      correctIndex: 2
    },
    {
      id: 4,
      question: 'People in the countryside live _____ than those in the city.',
      options: ['more peacefully', 'peaceful', 'most peaceful', 'peacefully'],
      correctIndex: 0
    },
    {
      id: 5,
      question: 'Harvest time is the _____ time of the year for farmers.',
      options: ['busiest', 'busy', 'busier', 'more busy'],
      correctIndex: 0
    }
  ]);

  // Form State to Add New Question
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctOpt, setCorrectOpt] = useState(0);

  // Play Mode State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [blueScore, setBlueScore] = useState(0);
  const [redScore, setRedScore] = useState(0);
  const [ropePosition, setRopePosition] = useState(50); // 50% is center
  const [winnerTeam, setWinnerTeam] = useState(null);

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !optA.trim() || !optB.trim()) {
      alert('Vui lòng điền câu hỏi và ít nhất 2 đáp án!');
      return;
    }
    const newQ = {
      id: Date.now(),
      question: newQuestionText,
      options: [optA, optB, optC || 'N/A', optD || 'N/A'],
      correctIndex: Number(correctOpt)
    };
    setQuestions([...questions, newQ]);
    setNewQuestionText('');
    setOptA(''); setOptB(''); setOptC(''); setOptD('');
    setShowAddForm(false);
    try { soundFX.playFanfare(); } catch (e) {}
  };

  const handleStartGame = () => {
    if (questions.length < 1) {
      alert('Vui lòng có ít nhất 1 câu hỏi để bắt đầu kéo co!');
      return;
    }
    try { soundFX.playFanfare(); } catch (e) {}
    setIsPlaying(true);
    setCurrentQIndex(0);
    setBlueScore(0);
    setRedScore(0);
    setRopePosition(50);
    setWinnerTeam(null);
  };

  const handleAnswer = (team, optionIdx) => {
    const currentQ = questions[currentQIndex];
    const isCorrect = optionIdx === currentQ.correctIndex;

    if (isCorrect) {
      try { soundFX.playFanfare(); } catch (e) {}
      if (team === 'blue') {
        const newScore = blueScore + 10;
        setBlueScore(newScore);
        const newPos = Math.max(10, ropePosition - 10);
        setRopePosition(newPos);
        if (newPos <= 15) {
          setWinnerTeam(blueTeamName);
          confetti({ particleCount: 200, spread: 100 });
        }
      } else {
        const newScore = redScore + 10;
        setRedScore(newScore);
        const newPos = Math.min(90, ropePosition + 10);
        setRopePosition(newPos);
        if (newPos >= 85) {
          setWinnerTeam(redTeamName);
          confetti({ particleCount: 200, spread: 100 });
        }
      }
    } else {
      try { soundFX.playClick(); } catch (e) {}
    }

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const avatarSets = [
    { id: 0, label: 'Đội Học Sinh 1', img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop' },
    { id: 1, label: 'Đội Học Sinh 2', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=400&auto=format&fit=crop' },
    { id: 2, label: 'Đội Thể Thao 3', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400&auto=format&fit=crop' },
    { id: 3, label: 'Đội Pixar 4', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop' }
  ];

  return (
    <div className="fixed top-20 left-0 right-0 bottom-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-start justify-center p-3 sm:p-4 overflow-y-auto pt-2 pb-6">
      <div className="bg-[#fffbeb] text-slate-900 rounded-3xl max-w-5xl w-full border-4 border-amber-300 shadow-2xl overflow-hidden relative font-sans max-h-[82vh] flex flex-col">
        
        {/* TOP HEADER MATCHING SCREENSHOT 3 */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 border-b border-amber-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-800 text-2xl shadow">
              🤼
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight flex items-center gap-2">
                Kéo Co Kiến Thức
              </h2>
              <p className="text-xs sm:text-sm text-amber-800 font-bold">
                🎮 Trò chơi trắc nghiệm đối kháng siêu vui 🎮
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold text-xs flex items-center gap-1 shadow"
          >
            <X className="w-5 h-5" /> Đóng
          </button>
        </div>

        {/* MAIN BODY AREA MATCHING SCREENSHOT 3 */}
        {!isPlaying ? (
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: GAME SETTINGS (7 COLS) MATCHING SCREENSHOT 3 */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* ⚡ CHẾ ĐỘ CHƠI */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-amber-200/80 shadow-md space-y-3">
                <h3 className="text-xs font-black text-orange-600 uppercase tracking-wider flex items-center gap-1.5">
                  ⚡ Chế Độ Chơi
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setGameMode('speed')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      gameMode === 'speed'
                        ? 'border-orange-500 bg-orange-50/80 text-orange-950 shadow-md ring-2 ring-orange-400/40'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-xl mb-1">🏎️</div>
                    <div className="font-extrabold text-sm text-slate-900">Thi Tốc Độ</div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">Ai nhanh hơn thì thắng!</div>
                  </button>

                  <button
                    onClick={() => setGameMode('long')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      gameMode === 'long'
                        ? 'border-orange-500 bg-orange-50/80 text-orange-950 shadow-md ring-2 ring-orange-400/40'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-xl mb-1">🏋️</div>
                    <div className="font-extrabold text-sm text-slate-900">Đua Đường Dài</div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">Cả 2 cùng trả lời, so điểm!</div>
                  </button>
                </div>
              </div>

              {/* 🏷️ ĐẶT TÊN ĐỘI */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-amber-200/80 shadow-md space-y-3">
                <h3 className="text-xs font-black text-orange-600 uppercase tracking-wider flex items-center gap-1.5">
                  🏷️ Đặt Tên Đội
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-blue-700 mb-1 flex items-center gap-1">
                      🔵 Đội Xanh
                    </label>
                    <input 
                      type="text" 
                      value={blueTeamName} 
                      onChange={(e) => setBlueTeamName(e.target.value)} 
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-rose-700 mb-1 flex items-center gap-1">
                      🔴 Đội Đỏ
                    </label>
                    <input 
                      type="text" 
                      value={redTeamName} 
                      onChange={(e) => setRedTeamName(e.target.value)} 
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-rose-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* ⏱️ THỜI GIAN MỖI CÂU */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-amber-200/80 shadow-md space-y-3">
                <h3 className="text-xs font-black text-orange-600 uppercase tracking-wider flex items-center gap-1.5">
                  ⏱️ Thời Gian Mỗi Câu
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  {[5, 10, 15, 20, 0].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimePerQuestion(t)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                        timePerQuestion === t
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {t === 0 ? '∞ Không giới hạn' : `${t}s`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 🖼️ ĐỔI ẢNH ĐỘI KÉO CO */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-amber-200/80 shadow-md space-y-3">
                <h3 className="text-xs font-black text-orange-600 uppercase tracking-wider flex items-center gap-1.5">
                  🖼️ Đổi Ảnh Đội Kéo Co
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {avatarSets.map((av) => (
                    <button
                      key={av.id}
                      onClick={() => setSelectedAvatarSet(av.id)}
                      className={`p-1.5 rounded-xl border-2 overflow-hidden transition-all ${
                        selectedAvatarSet === av.id
                          ? 'border-orange-500 ring-2 ring-orange-400'
                          : 'border-slate-200 hover:border-orange-300'
                      }`}
                    >
                      <img src={av.img} alt={av.label} className="w-full h-16 object-cover rounded-lg" />
                    </button>
                  ))}
                </div>
              </div>

              {/* ⌨️ PHÍM TẮT KHI CHƠI */}
              <div className="p-4 rounded-2xl bg-amber-100/60 border border-amber-300 text-xs text-amber-950 font-bold space-y-1">
                <p className="flex items-center gap-2">
                  ⌨️ <strong>Phím Tắt Khi Chơi:</strong>
                </p>
                <div className="flex items-center gap-4 text-[11px]">
                  <span>🔵 <strong>Đội Xanh:</strong> <code className="bg-white px-2 py-0.5 rounded shadow">1</code> <code className="bg-white px-2 py-0.5 rounded shadow">2</code> <code className="bg-white px-2 py-0.5 rounded shadow">3</code> <code className="bg-white px-2 py-0.5 rounded shadow">4</code></span>
                  <span>🔴 <strong>Đội Đỏ:</strong> <code className="bg-white px-2 py-0.5 rounded shadow">↑</code> <code className="bg-white px-2 py-0.5 rounded shadow">←</code> <code className="bg-white px-2 py-0.5 rounded shadow">↓</code> <code className="bg-white px-2 py-0.5 rounded shadow">→</code></span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: QUESTION BANK MANAGER (5 COLS) MATCHING SCREENSHOT 3 */}
            <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
              
              <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-amber-200/80 shadow-md space-y-4 flex-1">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900">📝 Ngân Hàng Câu Hỏi</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-xs">
                      {questions.length} câu
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setShowAddForm(true)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> + Thêm
                    </button>
                    <button 
                      onClick={() => alert('Đã mở kho câu hỏi mẫu!')}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow"
                    >
                      📚 Ngân hàng
                    </button>
                  </div>
                </div>

                {/* ADD QUESTION FORM MODAL */}
                {showAddForm ? (
                  <form onSubmit={handleAddQuestion} className="space-y-3 bg-amber-50/80 p-4 rounded-2xl border border-amber-300">
                    <h4 className="font-extrabold text-xs text-amber-950">Thêm câu hỏi trắc nghiệm kéo co mới:</h4>
                    <input 
                      type="text" 
                      placeholder="Nhập nội dung câu hỏi..." 
                      value={newQuestionText} 
                      onChange={(e) => setNewQuestionText(e.target.value)} 
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                      required
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="Đáp án A" value={optA} onChange={(e) => setOptA(e.target.value)} className="p-2 rounded-lg border text-xs bg-white" required />
                      <input type="text" placeholder="Đáp án B" value={optB} onChange={(e) => setOptB(e.target.value)} className="p-2 rounded-lg border text-xs bg-white" required />
                      <input type="text" placeholder="Đáp án C" value={optC} onChange={(e) => setOptC(e.target.value)} className="p-2 rounded-lg border text-xs bg-white" />
                      <input type="text" placeholder="Đáp án D" value={optD} onChange={(e) => setOptD(e.target.value)} className="p-2 rounded-lg border text-xs bg-white" />
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="font-bold text-slate-700">Đáp án đúng:</label>
                      <select value={correctOpt} onChange={(e) => setCorrectOpt(Number(e.target.value))} className="p-1.5 rounded-lg border font-bold text-xs bg-white">
                        <option value={0}>A</option>
                        <option value={1}>B</option>
                        <option value={2}>C</option>
                        <option value={3}>D</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <button type="submit" className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs">Lưu câu hỏi</button>
                      <button type="button" onClick={() => setShowAddForm(false)} className="py-2 px-3 rounded-xl bg-slate-300 text-slate-800 font-bold text-xs">Hủy</button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                    {questions.map((q, idx) => (
                      <div key={q.id} className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-xs space-y-1 hover:border-amber-400 transition-all">
                        <div className="font-black text-amber-950 flex items-center justify-between">
                          <span>Câu {idx + 1}: {q.question}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 font-medium pt-1">
                          {q.options.map((opt, oIdx) => (
                            <span key={oIdx} className={oIdx === q.correctIndex ? 'font-black text-emerald-600' : ''}>
                              {String.fromCharCode(65 + oIdx)}. {opt} {oIdx === q.correctIndex ? '✓' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* START GAME BUTTON MATCHING SCREENSHOT 3 */}
              <div className="pt-2">
                <button
                  onClick={handleStartGame}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-slate-950 font-black text-lg shadow-xl hover:brightness-110 flex items-center justify-center gap-2 transition-all transform hover:scale-102"
                >
                  🚀 BẮT ĐẦU KÉO CO
                </button>
              </div>

            </div>

          </div>
        ) : (
          /* PLAYING ARENA VIEW */
          <div className="p-6 space-y-8 flex-1 overflow-y-auto">
            {winnerTeam ? (
              <div className="text-center p-10 space-y-6 animate-fadeIn">
                <Trophy className="w-24 h-24 text-amber-500 mx-auto animate-bounce" />
                <h3 className="text-3xl font-black text-slate-900">
                  🎉 CHÚC MỪNG {winnerTeam.toUpperCase()} ĐÃ CHIẾN THẮNG KÉO CO! 🏆
                </h3>
                <button 
                  onClick={() => setIsPlaying(false)}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-sm shadow-xl"
                >
                  Chơi lại ván mới
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* ROPE VISUAL ANIMATION */}
                <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 relative overflow-hidden shadow-2xl border-2 border-amber-400">
                  <div className="flex items-center justify-between text-sm font-black">
                    <span className="text-blue-400 font-black text-lg">🔵 {blueTeamName}: {blueScore} điểm</span>
                    <span className="text-rose-400 font-black text-lg">🔴 {redTeamName}: {redScore} điểm</span>
                  </div>

                  {/* ROPE BAR */}
                  <div className="relative h-12 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700 flex items-center">
                    <div 
                      className="absolute top-0 bottom-0 w-8 bg-amber-400 shadow-lg rounded-full transition-all duration-300 flex items-center justify-center font-black text-slate-950 text-xs"
                      style={{ left: `${ropePosition}%` }}
                    >
                      🚩
                    </div>
                  </div>
                </div>

                {/* CURRENT QUESTION DISPLAY */}
                <div className="p-8 rounded-3xl bg-white border-2 border-amber-300 shadow-xl space-y-6">
                  <div className="text-xs font-black text-amber-800 uppercase tracking-wider">
                    Câu hỏi {currentQIndex + 1} / {questions.length}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 leading-snug">
                    {questions[currentQIndex]?.question}
                  </h3>

                  {/* OPTIONS FOR BLUE TEAM (KEYS 1,2,3,4) & RED TEAM */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {questions[currentQIndex]?.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <button
                          onClick={() => handleAnswer('blue', oIdx)}
                          className="flex-1 p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 hover:bg-blue-600 hover:text-white font-extrabold text-xs text-left transition-all shadow"
                        >
                          🔵 {String.fromCharCode(65 + oIdx)}. {opt}
                        </button>
                        <button
                          onClick={() => handleAnswer('red', oIdx)}
                          className="flex-1 p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 hover:bg-rose-600 hover:text-white font-extrabold text-xs text-left transition-all shadow"
                        >
                          🔴 {String.fromCharCode(65 + oIdx)}. {opt}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
