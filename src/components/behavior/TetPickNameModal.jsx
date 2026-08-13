import React, { useState } from 'react';
import { X, Sparkles, Volume2, Award, RotateCcw } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

export const TetPickNameModal = ({ isOpen, onClose, students = [], onRewardWinner }) => {
  const [step, setStep] = useState(1); // 1: Cây Mai + Banner "Hái hoa dân chủ" (Ảnh 3) | 2: Cây Mai + Lồng Đèn (Ảnh 4) | 3: Hiện Tên HS trong Khung Hoa Mai (Ảnh 5)
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openedLanternIds, setOpenedLanternIds] = useState([]);

  if (!isOpen) return null;

  // Filter present & available students
  const activeStudents = students.filter(s => s.status !== 'Absent_Perm' && s.status !== 'Absent_NoPerm');

  // Handle Clicking a Lantern on the Apricot Blossom Tree (Screenshot 4 -> Screenshot 5)
  const handlePickLantern = (lanternIdx) => {
    if (openedLanternIds.includes(lanternIdx)) return;
    soundFX.playClick();

    const winner = activeStudents[Math.floor(Math.random() * activeStudents.length)] || {
      full_name: 'Nguyễn Võ Hương Lan',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
    };

    setOpenedLanternIds(prev => [...prev, lanternIdx]);
    setSelectedStudent(winner);
    setStep(3); // Step 3: Big Name Reveal in Red Floral Frame (Screenshot 5)

    try { soundFX.playFanfare(); } catch (err) {}
    confetti({ particleCount: 160, spread: 90 });
  };

  return (
    <div className="fixed top-14 inset-x-0 bottom-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-start justify-center p-3 pt-3 overflow-y-auto font-sans">
      <div className="bg-gradient-to-b from-pink-400 via-rose-400 to-pink-500 border-4 border-amber-300 rounded-3xl max-w-5xl w-full p-6 space-y-4 shadow-2xl animate-fadeIn flex flex-col max-h-[92vh] text-slate-900 relative overflow-hidden">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white shadow-xl"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: CÂY MAI VÀNG + BANNER "HÁI HOA DÂN CHỦ" (MATCHING SCREENSHOT 3 100%) */}
        {step === 1 && (
          <div
            onClick={() => {
              soundFX.playClick();
              setStep(2);
            }}
            className="flex-1 flex flex-col items-center justify-between p-6 relative cursor-pointer group min-h-[480px]"
          >
            {/* HÁI HOA DÂN CHỦ BANNER (SCREENSHOT 3) */}
            <div className="z-10 mt-6 px-10 py-5 rounded-3xl bg-gradient-to-r from-red-700 via-rose-800 to-red-700 border-4 border-amber-300 shadow-2xl transform group-hover:scale-105 transition-transform text-center space-y-1">
              <h2 className="text-3xl sm:text-4xl font-black text-amber-300 font-serif tracking-widest drop-shadow-md">
                Hái hoa dân chủ 🌸
              </h2>
              <span className="text-xs text-amber-100 font-bold block animate-bounce">
                Bấm vào đây hoặc cây mai để bắt đầu hái lộc Tết xuân 2026!
              </span>
            </div>

            {/* GOLDEN APRICOT BLOSSOM TREE BACKGROUND (CÂY MAI VÀNG SCREENSHOT 3) */}
            <div className="w-full max-w-lg h-80 relative flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1548625361-1851e39a3f2b?q=80&w=800&auto=format&fit=crop"
                alt="Cây Mai Vàng Tết"
                className="w-full h-full object-contain filter drop-shadow-2xl"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-6 py-3 rounded-full bg-amber-400 text-slate-950 font-black text-sm shadow-2xl animate-pulse">
                  🌸 NHẤP CHỌN ĐỂ HÁI LỘC TẾT
                </span>
              </div>
            </div>

          </div>
        )}

        {/* STEP 2: CÂY MAI VÀNG VỚI CÁC LỒNG ĐÈN ĐỎ HÁI LỘC (MATCHING SCREENSHOT 4 100%) */}
        {step === 2 && (
          <div className="flex-1 flex flex-col items-center justify-between p-4 relative min-h-[500px]">
            
            <div className="z-10 text-center space-y-1 bg-slate-950/70 p-3 rounded-2xl border border-amber-400/50 backdrop-blur-md text-white">
              <h3 className="text-base font-black text-amber-300 uppercase tracking-wider flex items-center justify-center gap-2">
                🏮 NHẤP CHỌN LỒNG ĐÈN TRÊN CÂY MAI ĐỂ HÁI LỘC TẾT
              </h3>
              <p className="text-xs text-slate-200">
                Mỗi lồng đèn chứa tên 1 học sinh may mắn nhận lộc đầu xuân!
              </p>
            </div>

            {/* APRICOT BLOSSOM TREE WITH HANGING RED LANTERNS (SCREENSHOT 4) */}
            <div className="w-full max-w-2xl h-[420px] relative flex items-center justify-center my-auto">
              <img
                src="https://images.unsplash.com/photo-1548625361-1851e39a3f2b?q=80&w=800&auto=format&fit=crop"
                alt="Cây Mai Vàng Tết"
                className="w-full h-full object-contain filter drop-shadow-2xl"
              />

              {/* 16 HANGING RED LANTERNS DISTRIBUTED ON BRANCHES (SCREENSHOT 4) */}
              {Array.from({ length: 16 }).map((_, idx) => {
                const isOpened = openedLanternIds.includes(idx);
                // Position coordinates matching Screenshot 4
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
                    className={`absolute p-2 rounded-full transition-all transform hover:scale-125 z-20 flex flex-col items-center ${
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

            <div className="z-10 flex items-center gap-3 pt-2">
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

        {/* STEP 3: BIG NAME REVEAL INSIDE FESTIVE RED FLORAL CIRCULAR FRAME (MATCHING SCREENSHOT 5 100%) */}
        {step === 3 && selectedStudent && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 bg-gradient-to-b from-rose-950 via-red-900 to-slate-950 rounded-3xl border-4 border-amber-400 shadow-2xl animate-fadeIn text-center text-white relative">
            
            {/* CALLIGRAPHY STUDENT NAME (SCREENSHOT 5) */}
            <h2 className="text-3xl sm:text-4xl font-black text-amber-300 font-serif tracking-tight drop-shadow-lg">
              {selectedStudent.full_name}
            </h2>

            {/* CIRCULAR RED FLORAL FRAME WITH ANIME/PIXAR AVATAR (MATCHING SCREENSHOT 5 100%) */}
            <div className="relative p-6 rounded-full bg-gradient-to-r from-red-600 to-rose-600 border-8 border-amber-400 shadow-2xl animate-bounce">
              <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-amber-300 bg-white">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.full_name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* ACTION BUTTONS (SCREENSHOT 5) */}
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
