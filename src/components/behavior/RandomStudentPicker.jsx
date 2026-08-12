import React, { useState } from 'react';
import { Sparkles, Dices, Award, Volume2 } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Modal } from '../common/Modal';

export const RandomStudentPicker = ({ isOpen, onClose, students, onRewardWinner }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayCandidate, setDisplayCandidate] = useState(null);

  const startSpin = () => {
    if (!students || students.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setSelectedStudent(null);

    let counter = 0;
    const totalTicks = 25;
    const interval = setInterval(() => {
      soundFX.playTick();
      const randomIndex = Math.floor(Math.random() * students.length);
      setDisplayCandidate(students[randomIndex]);
      counter++;

      if (counter >= totalTicks) {
        clearInterval(interval);
        const winner = students[Math.floor(Math.random() * students.length)];
        setSelectedStudent(winner);
        setIsSpinning(false);
        soundFX.playFanfare();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      }
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gọi Tên Ngẫu Nhiên Trong Giờ Học 🎲" maxWidth="max-w-md">
      <div className="py-6 text-center space-y-6">
        <p className="text-xs text-slate-400">
          Công cụ tạo không khí sôi nổi trong giờ Tiếng Anh THCS
        </p>

        {/* Spinning display frame */}
        <div className="w-full h-44 glass-panel border-amber-500/40 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-indigo-500/10 animate-pulse" />

          {isSpinning ? (
            <div className="relative z-10 space-y-2 animate-bounce">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Đang quay số...</span>
              <h3 className="text-3xl font-black text-white">{displayCandidate?.full_name}</h3>
            </div>
          ) : selectedStudent ? (
            <div className="relative z-10 space-y-2 animate-fadeIn">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                🎉 Học Sinh Được Chọn!
              </span>
              <h2 className="text-3xl font-black text-amber-300">{selectedStudent.full_name}</h2>
              <p className="text-xs text-slate-300">Mã HS: {selectedStudent.student_code || '8A5'}</p>
            </div>
          ) : (
            <div className="relative z-10 space-y-2 text-slate-400">
              <Dices className="w-12 h-12 mx-auto text-brand-400 animate-spin" style={{ animationDuration: '6s' }} />
              <p className="text-sm font-semibold">Nhấn nút bên dưới để quay ngẫu nhiên</p>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="space-y-3">
          <button
            onClick={startSpin}
            disabled={isSpinning || !students.length}
            className="w-full glass-button-accent py-3 text-base font-extrabold text-slate-950"
          >
            <Dices className="w-5 h-5" />
            {isSpinning ? 'Đang Gọi Tên...' : 'Quay Số Ngẫu Nhiên'}
          </button>

          {selectedStudent && (
            <button
              onClick={() => {
                soundFX.playCorrect();
                onRewardWinner(selectedStudent);
              }}
              className="w-full glass-button-primary py-2.5 text-sm"
            >
              <Award className="w-4 h-4" />
              Thưởng 2 Sao Cho {selectedStudent.full_name}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
