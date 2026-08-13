import React, { useState } from 'react';
import { X, Sparkles, Volume2, Award, RotateCcw } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

export const TetPickNameModal = ({ isOpen, onClose, students = [], onRewardWinner }) => {
  const [step, setStep] = useState(1); // 1: Cây Mai + Banner "Hái hoa dân chủ" | 2: Cây Mai + Lồng Đèn | 3: Hiện Tên HS trong Khung Hoa Mai
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openedLanternIds, setOpenedLanternIds] = useState([]);

  if (!isOpen) return null;

  // Filter present & available students
  const activeStudents = students.filter(s => s.status !== 'Absent_Perm' && s.status !== 'Absent_NoPerm');

  // Handle Clicking a Lantern
  const handlePickLantern = (lanternIdx) => {
    if (openedLanternIds.includes(lanternIdx)) return;
    soundFX.playClick();

    const winner = activeStudents[Math.floor(Math.random() * activeStudents.length)] || {
      full_name: 'Nguyễn Võ Hương Lan',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
    };

    setOpenedLanternIds(prev => [...prev, lanternIdx]);
    setSelectedStudent(winner);
    setStep(3);

    try { soundFX.playFanfare(); } catch (err) {}
    confetti({ particleCount: 160, spread: 90 });
  };

  return (
    <div className="fixed top-14 inset-x-0 bottom-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-start justify-center p-3 pt-3 overflow-y-auto font-sans">
      <div className="bg-gradient-to-b from-rose-500 via-pink-600 to-rose-700 border-4 border-amber-300 rounded-3xl max-w-5xl w-full p-6 space-y-4 shadow-2xl animate-fadeIn flex flex-col min-h-[90vh] text-slate-900 relative overflow-hidden">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white shadow-xl"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: BANNER "HÁI HOA DÂN CHỦ" & CÂY MAI VÀNG RỰC RỠ */}
        {step === 1 && (
          <div
            onClick={() => {
              soundFX.playClick();
              setStep(2);
            }}
            className="flex-1 flex flex-col items-center justify-between p-4 relative cursor-pointer group min-h-[520px]"
          >
            {/* HÁI HOA DÂN CHỦ BANNER */}
            <div className="z-20 mt-4 px-10 py-5 rounded-3xl bg-gradient-to-r from-red-700 via-rose-800 to-red-700 border-4 border-amber-300 shadow-2xl transform group-hover:scale-105 transition-transform text-center space-y-1">
              <h2 className="text-3xl sm:text-4xl font-black text-amber-300 font-serif tracking-widest drop-shadow-md">
                Hái hoa dân chủ 🌸
              </h2>
              <span className="text-xs text-amber-100 font-bold block animate-bounce">
                Bấm vào đây để hái lộc lồng đèn Cây Mai Vàng Tết 2026!
              </span>
            </div>

            {/* RELIABLE VECTOR ART CÂY MAI VÀNG (GUARANTEED NO BROKEN LINK ERROR) */}
            <div className="w-full max-w-2xl h-[420px] relative flex items-end justify-center my-auto">
              <svg viewBox="0 0 500 450" className="w-full h-full filter drop-shadow-2xl">
                {/* TRUNK & BRANCHES */}
                <path d="M 230 450 C 230 380, 210 320, 240 260 C 260 220, 220 180, 250 120" fill="none" stroke="#78350f" strokeWidth="24" strokeLinecap="round" />
                <path d="M 240 260 C 180 230, 140 190, 100 160" fill="none" stroke="#78350f" strokeWidth="14" strokeLinecap="round" />
                <path d="M 240 260 C 300 230, 360 190, 400 160" fill="none" stroke="#78350f" strokeWidth="14" strokeLinecap="round" />
                <path d="M 250 180 C 210 130, 160 100, 120 70" fill="none" stroke="#78350f" strokeWidth="10" strokeLinecap="round" />
                <path d="M 250 180 C 290 130, 340 100, 380 70" fill="none" stroke="#78350f" strokeWidth="10" strokeLinecap="round" />

                {/* YELLOW APRICOT BLOSSOMS CLUSTERS */}
                {[
                  { x: 250, y: 110, r: 45 }, { x: 210, y: 140, r: 40 }, { x: 290, y: 140, r: 40 },
                  { x: 140, y: 170, r: 50 }, { x: 360, y: 170, r: 50 }, { x: 100, y: 150, r: 35 },
                  { x: 400, y: 150, r: 35 }, { x: 120, y: 70, r: 40 }, { x: 380, y: 70, r: 40 },
                  { x: 250, y: 70, r: 45 }, { x: 190, y: 80, r: 38 }, { x: 310, y: 80, r: 38 },
                  { x: 170, y: 220, r: 45 }, { x: 330, y: 220, r: 45 }, { x: 250, y: 200, r: 50 }
                ].map((c, i) => (
                  <g key={`flower_${i}`}>
                    <circle cx={c.x} cy={c.y} r={c.r} fill="#facc15" opacity="0.9" />
                    <circle cx={c.x} cy={c.y} r={c.r * 0.75} fill="#fbbf24" />
                    <circle cx={c.x} cy={c.y} r={c.r * 0.3} fill="#ef4444" />
                  </g>
                ))}
              </svg>

              <div className="absolute inset-0 flex items-center justify-center z-20">
                <span className="px-6 py-3 rounded-full bg-amber-400 text-slate-950 font-black text-sm shadow-2xl animate-pulse border-2 border-white">
                  🌸 NHẤP CHỌN CÂY MAI ĐỂ HÁI LỘC TẾT
                </span>
              </div>
            </div>

          </div>
        )}

        {/* STEP 2: CÂY MAI VÀNG VỚI CÁC LỒNG ĐÈN ĐỎ LƠ LỬNG (MATCHING SCREENSHOT 3 FIX) */}
        {step === 2 && (
          <div className="flex-1 flex flex-col items-center justify-between p-4 relative min-h-[540px]">
            
            <div className="z-20 text-center space-y-1 bg-slate-950/80 p-3.5 rounded-2xl border-2 border-amber-400 backdrop-blur-md text-white">
              <h3 className="text-base font-black text-amber-300 uppercase tracking-wider flex items-center justify-center gap-2">
                🏮 NHẤP CHỌN LỒNG ĐÈN TRÊN CÂY MAI ĐỂ HÁI LỘC TẾT
              </h3>
              <p className="text-xs text-slate-200 font-bold">
                Mỗi lồng đèn chứa tên 1 học sinh may mắn nhận lộc đầu xuân!
              </p>
            </div>

            {/* GOLDEN APRICOT BLOSSOM TREE VECTOR (GUARANTEED NO BROKEN LINK ERROR) */}
            <div className="w-full max-w-2xl h-[440px] relative flex items-end justify-center my-auto">
              <svg viewBox="0 0 500 450" className="w-full h-full filter drop-shadow-2xl">
                {/* TRUNK & BRANCHES */}
                <path d="M 230 450 C 230 380, 210 320, 240 260 C 260 220, 220 180, 250 120" fill="none" stroke="#78350f" strokeWidth="24" strokeLinecap="round" />
                <path d="M 240 260 C 180 230, 140 190, 100 160" fill="none" stroke="#78350f" strokeWidth="14" strokeLinecap="round" />
                <path d="M 240 260 C 300 230, 360 190, 400 160" fill="none" stroke="#78350f" strokeWidth="14" strokeLinecap="round" />
                <path d="M 250 180 C 210 130, 160 100, 120 70" fill="none" stroke="#78350f" strokeWidth="10" strokeLinecap="round" />
                <path d="M 250 180 C 290 130, 340 100, 380 70" fill="none" stroke="#78350f" strokeWidth="10" strokeLinecap="round" />

                {/* YELLOW APRICOT BLOSSOMS CLUSTERS */}
                {[
                  { x: 250, y: 110, r: 45 }, { x: 210, y: 140, r: 40 }, { x: 290, y: 140, r: 40 },
                  { x: 140, y: 170, r: 50 }, { x: 360, y: 170, r: 50 }, { x: 100, y: 150, r: 35 },
                  { x: 400, y: 150, r: 35 }, { x: 120, y: 70, r: 40 }, { x: 380, y: 70, r: 40 },
                  { x: 250, y: 70, r: 45 }, { x: 190, y: 80, r: 38 }, { x: 310, y: 80, r: 38 },
                  { x: 170, y: 220, r: 45 }, { x: 330, y: 220, r: 45 }, { x: 250, y: 200, r: 50 }
                ].map((c, i) => (
                  <g key={`flower_${i}`}>
                    <circle cx={c.x} cy={c.y} r={c.r} fill="#facc15" opacity="0.95" />
                    <circle cx={c.x} cy={c.y} r={c.r * 0.75} fill="#fbbf24" />
                    <circle cx={c.x} cy={c.y} r={c.r * 0.3} fill="#ef4444" />
                  </g>
                ))}
              </svg>

              {/* 16 HANGING RED LANTERNS ON CÂY MAI VÀNG BRANCHES */}
              {Array.from({ length: 16 }).map((_, idx) => {
                const isOpened = openedLanternIds.includes(idx);
                const positions = [
                  { top: '15%', left: '48%' },
                  { top: '28%', left: '35%' },
                  { top: '28%', left: '60%' },
                  { top: '42%', left: '25%' },
                  { top: '42%', left: '48%' },
                  { top: '42%', left: '70%' },
                  { top: '55%', left: '18%' },
                  { top: '55%', left: '35%' },
                  { top: '55%', left: '62%' },
                  { top: '55%', left: '78%' },
                  { top: '70%', left: '22%' },
                  { top: '70%', left: '40%' },
                  { top: '70%', left: '58%' },
                  { top: '70%', left: '75%' },
                  { top: '80%', left: '32%' },
                  { top: '80%', left: '65%' }
                ];

                const pos = positions[idx % positions.length];

                return (
                  <button
                    key={`lantern_${idx}`}
                    onClick={() => handlePickLantern(idx)}
                    disabled={isOpened}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute p-2 rounded-full transition-all transform hover:scale-125 z-30 flex flex-col items-center ${
                      isOpened ? 'opacity-40 grayscale cursor-not-allowed' : 'animate-bounce cursor-pointer'
                    }`}
                  >
                    <div className="w-10 h-12 rounded-2xl bg-gradient-to-b from-red-600 via-rose-600 to-red-700 border-2 border-amber-300 shadow-2xl flex items-center justify-center text-amber-300 font-black text-xs">
                      🏮
                    </div>
                    <span className="text-[9px] font-black text-slate-950 bg-amber-300 px-1.5 py-0.5 rounded-full shadow -mt-1">
                      #{idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="z-20 flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-black text-xs shadow-lg"
              >
                Quay Lại Bảng Hái Hoa Dân Chủ
              </button>

              {openedLanternIds.length > 0 && (
                <button
                  onClick={() => setOpenedLanternIds([])}
                  className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-lg"
                >
                  🔄 Treo Lại Lồng Đèn Mới
                </button>
              )}
            </div>

          </div>
        )}

        {/* STEP 3: BIG NAME REVEAL INSIDE FESTIVE RED FLORAL CIRCULAR FRAME */}
        {step === 3 && selectedStudent && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 bg-gradient-to-b from-rose-950 via-red-900 to-slate-950 rounded-3xl border-4 border-amber-400 shadow-2xl animate-fadeIn text-center text-white relative z-30">
            
            <h2 className="text-3xl sm:text-4xl font-black text-amber-300 font-serif tracking-tight drop-shadow-lg">
              {selectedStudent.full_name}
            </h2>

            <div className="relative p-6 rounded-full bg-gradient-to-r from-red-600 to-rose-600 border-8 border-amber-400 shadow-2xl animate-bounce">
              <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-amber-300 bg-white">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.full_name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              {onRewardWinner && (
                <button
                  onClick={() => {
                    onRewardWinner(selectedStudent, 5);
                    setStep(2);
                  }}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-xs shadow-xl"
                >
                  + Thưởng Lộc 5 Điểm Nề Nếp
                </button>
              )}

              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-xl"
              >
                Đóng
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
