import React, { useState, useEffect, useRef } from 'react';
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
  FileText
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

  // Question Management State (Screenshot 5)
  const [questions, setQuestions] = useState([
    { id: 1, text: 'Công thức hóa học của nước là gì?' },
    { id: 2, text: 'Tính x nếu x² = 4 ?' }
  ]);
  const [newQuestionInput, setNewQuestionInput] = useState('');
  const [showAddQuestion, setShowAddQuestion] = useState(false);

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

    // Random rotations + target slice
    const extraDegrees = Math.floor(Math.random() * 360) + 1440; // 4 full spins + random offset
    const newDegree = rotationDegree + extraDegrees;
    setRotationDegree(newDegree);

    setTimeout(() => {
      setIsSpinning(false);
      const normalizedDegree = (newDegree % 360 + 360) % 360;
      const sliceAngle = 360 / students.length;
      // Pointer is at top (270 degrees)
      const winningIndex = Math.floor((360 - (normalizedDegree % 360)) / sliceAngle) % students.length;
      const winner = students[winningIndex] || students[0];
      
      setWinnerName(winner);
      try { soundFX.playFanfare(); } catch (e) {}
      confetti({ particleCount: 150, spread: 90 });
    }, spinDuration * 1000);
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionInput.trim()) return;
    setQuestions([...questions, { id: Date.now(), text: newQuestionInput }]);
    setNewQuestionInput('');
    setShowAddQuestion(false);
    try { soundFX.playFanfare(); } catch (e) {}
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl max-w-7xl w-full border-4 border-slate-800 shadow-2xl overflow-hidden relative font-sans max-h-[94vh] flex flex-col">
        
        {/* HEADER */}
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

            {/* WINNER ANNOUNCEMENT MODAL */}
            {winnerName && (
              <div className="p-4 rounded-2xl bg-amber-100 border-2 border-amber-400 text-center space-y-1 animate-fadeIn">
                <span className="text-xs font-bold text-amber-800 uppercase">🎉 CHÚC MỪNG HỌC SINH ĐƯỢC GỌI TÊN:</span>
                <div className="text-xl font-black text-rose-600">{winnerName}</div>
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
              <button className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5">
                <Play className="w-4 h-4 fill-current" /> Tới Trò Chơi Trắc Nghiệm
              </button>
              <button className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5">
                <Download className="w-4 h-4" /> Tải về file HTML (Offline)
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

            {/* CHẾ ĐỘ TRẮC NGHIỆM */}
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

            {/* QUẢN LÝ CÂU HỎI MATCHING SCREENSHOT 5 */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 text-xs font-bold">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900">QUẢN LÝ CÂU HỎI ({questions.length})</span>
                <div className="flex items-center gap-1 text-[10px]">
                  <button onClick={() => alert('Import JSON')} className="px-2 py-1 rounded bg-slate-100 border">Import .json</button>
                  <button onClick={() => alert('Export JSON')} className="px-2 py-1 rounded bg-slate-100 border">Export .json</button>
                </div>
              </div>

              <button 
                onClick={() => setShowAddQuestion(true)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold flex items-center justify-center gap-1.5 shadow"
              >
                + Thêm Câu Hỏi Mới
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => alert('Công thức Toán/Hóa')} className="py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-[11px] shadow">
                  ∑ Công thức Toán / Hóa
                </button>
                <button onClick={() => alert('Tạo đề từ chữ')} className="py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[11px] shadow">
                  📄 Tạo Đề từ chữ (Text)
                </button>
              </div>

              {showAddQuestion ? (
                <form onSubmit={handleAddQuestion} className="p-3 bg-slate-50 rounded-xl border space-y-2">
                  <input 
                    type="text" 
                    placeholder="Nhập nội dung câu hỏi mới..." 
                    value={newQuestionInput} 
                    onChange={(e) => setNewQuestionInput(e.target.value)} 
                    className="w-full p-2 rounded-lg border text-xs bg-white" 
                    required
                  />
                  <div className="flex items-center gap-2">
                    <button type="submit" className="flex-1 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs">Lưu</button>
                    <button type="button" onClick={() => setShowAddQuestion(false)} className="py-1.5 px-3 rounded-lg bg-slate-200 text-slate-800 font-bold text-xs">Hủy</button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="p-2.5 rounded-xl bg-slate-50 border flex items-center justify-between text-xs">
                      <span className="truncate flex-1 pr-2">{idx + 1}. {q.text}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => alert('Sửa câu hỏi')} className="text-blue-600 hover:text-blue-800"><Edit3 className="w-3.5 h-3.5" /></button>
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
    </div>
  );
};
