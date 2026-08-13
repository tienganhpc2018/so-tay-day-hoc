import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Trophy, 
  X, 
  Sparkles, 
  Settings, 
  Users, 
  Clock, 
  Volume2, 
  VolumeX, 
  Award,
  Check,
  Zap
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

export const DuckRaceGameCanvas = ({ students = [], onClose, onRewardWinner }) => {
  // Filter present students (excluding absent students)
  const activeStudents = students.filter(s => s.status !== 'Absent_Perm' && s.status !== 'Absent_NoPerm');

  // Race Setup States
  const [numDucks, setNumDucks] = useState(activeStudents.length || 10);
  const [raceDuration, setRaceDuration] = useState(15); // in seconds
  const [timerText, setTimerText] = useState('00:00:15');
  const [useStudentNames, setUseStudentNames] = useState(true);
  const [isRacing, setIsRacing] = useState(false);
  const [raceFinished, setRaceFinished] = useState(false);
  const [rankings, setRankings] = useState([]);

  // 2 QUICK NUMBER SELECTOR ROWS (DIRECTIVE BY THẦY: "list 2 dãy số, nhấp chọn số là xong chứ không cần theo lớp đâu")
  const row1Numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const row2Numbers = [12, 15, 18, 20, 25, 30, 35, 40, 45, 50];

  // Canvas & Animation refs
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const duckPositionsRef = useRef([]);

  // Initialize Duck Racers
  useEffect(() => {
    resetRace();
  }, [numDucks, useStudentNames, students]);

  const resetRace = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsRacing(false);
    setRaceFinished(false);
    setRankings([]);

    const colors = ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316', '#a855f7', '#eab308'];

    const racers = Array.from({ length: numDucks }).map((_, idx) => {
      const st = useStudentNames ? activeStudents[idx] : null;
      return {
        id: st?.id || `duck-${idx + 1}`,
        name: st?.full_name || `Vịt Số ${idx + 1}`,
        code: st?.code || `${idx + 1}`,
        avatar: st?.avatar || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=200&auto=format&fit=crop',
        color: colors[idx % colors.length],
        x: 30,
        y: 50 + idx * 36,
        speed: 0,
        finishTime: null,
        rank: null
      };
    });

    duckPositionsRef.current = racers;
    drawCanvas();
  };

  // Canvas Renderer
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;

    // 1. Draw Water & Finish Line (Matching Screenshot 4)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, width, height);

    // Draw Water Waves
    ctx.strokeStyle = '#0369a1';
    ctx.lineWidth = 2;
    for (let y = 30; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(width * 0.25, y + 10, width * 0.75, y - 10, width, y);
      ctx.stroke();
    }

    // Finish Line Checkered Pattern
    const finishX = width - 100;
    const checkSize = 12;
    for (let y = 0; y < height; y += checkSize) {
      ctx.fillStyle = (Math.floor(y / checkSize) % 2 === 0) ? '#ffffff' : '#000000';
      ctx.fillRect(finishX, y, checkSize, checkSize);
      ctx.fillStyle = (Math.floor(y / checkSize) % 2 === 0) ? '#000000' : '#ffffff';
      ctx.fillRect(finishX + checkSize, y, checkSize, checkSize);
    }

    // 2. Draw Ducks
    duckPositionsRef.current.forEach((duck, idx) => {
      // Duck Body
      ctx.fillStyle = duck.color;
      ctx.beginPath();
      ctx.ellipse(duck.x, duck.y, 16, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Duck Head
      ctx.fillStyle = duck.color;
      ctx.beginPath();
      ctx.arc(duck.x + 12, duck.y - 8, 10, 0, Math.PI * 2);
      ctx.fill();

      // Duck Beak
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(duck.x + 20, duck.y - 6, 5, 0, Math.PI * 2);
      ctx.fill();

      // Duck Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(duck.x + 14, duck.y - 10, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(duck.x + 15, duck.y - 10, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Duck Number Badge
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(duck.x - 4, duck.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(duck.code || `${idx + 1}`, duck.x - 4, duck.y);

      // Duck Name Text Label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(duck.name, duck.x, duck.y - 20);
    });
  };

  // Start Race Engine
  const handleStartRace = () => {
    if (isRacing) return;
    soundFX.playClick();
    setIsRacing(true);
    setRaceFinished(false);
    setRankings([]);

    const canvas = canvasRef.current;
    const finishX = canvas.width - 100;
    const startTime = Date.now();
    const finishedList = [];

    const updateRace = () => {
      const elapsedSec = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, raceDuration - elapsedSec);

      // Update Digital Clock (00:00:15)
      const secStr = Math.floor(remaining).toString().padStart(2, '0');
      setTimerText(`00:00:${secStr}`);

      let allFinished = true;

      duckPositionsRef.current.forEach((duck) => {
        if (!duck.finishTime) {
          allFinished = false;
          // Random acceleration
          const randomSpeed = Math.random() * 2.9 + 1.1;
          duck.x += randomSpeed;

          if (duck.x >= finishX) {
            duck.x = finishX;
            duck.finishTime = ((Date.now() - startTime) / 1000).toFixed(2);
            finishedList.push({ ...duck, rank: finishedList.length + 1 });
            duck.rank = finishedList.length;
          }
        }
      });

      drawCanvas();

      if (allFinished || elapsedSec >= raceDuration) {
        setIsRacing(false);
        setRaceFinished(true);
        setRankings(finishedList);
        try { soundFX.playFanfare(); } catch (err) {}
        confetti({ particleCount: 180, spread: 90 });
      } else {
        animFrameRef.current = requestAnimationFrame(updateRace);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateRace);
  };

  return (
    <div className="fixed top-14 inset-x-0 bottom-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-start justify-center p-3 pt-3 overflow-y-auto font-sans">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-5xl w-full p-5 space-y-4 shadow-2xl animate-fadeIn flex flex-col max-h-[92vh]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-xl">
              🐤
            </div>
            <div>
              <h3 className="text-base font-black text-white">TRÒ CHƠI ĐUA VỊT DUCK RACE NÂNG CAO</h3>
              <span className="text-[11px] text-slate-400 font-bold">
                Chọn số lượng vịt tùy ý hoặc dùng danh sách sĩ số học sinh lớp
              </span>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2 ROWS QUICK NUMBER SELECTOR BAR (DIRECTIVE BY THẦY: "cho thầy list 2 dãy số, nhấp chọn số là xong chứ không cần theo lớp đâu") */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shrink-0 text-xs font-bold">
          <div className="flex items-center justify-between">
            <span className="text-amber-400 font-black uppercase flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> BẢNG CHỌN SỐ LƯỢNG VỊT ĐUA NHANH (2 DÃY SỐ):
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { soundFX.playClick(); setNumDucks(activeStudents.length || 10); setUseStudentNames(true); }}
                className={`px-3 py-1 rounded-xl text-[11px] font-black border transition-all ${
                  useStudentNames && numDucks === activeStudents.length
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-slate-900 text-slate-300 border-slate-700'
                }`}
              >
                🏫 Theo Sĩ Số Lớp ({activeStudents.length} HS)
              </button>
            </div>
          </div>

          {/* DÃY SỐ 1: SỐ NHỎ (1 TỚI 10) */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase">Dãy 1 (Số nhỏ 1 - 10 con):</span>
            <div className="flex flex-wrap gap-1.5">
              {row1Numbers.map((n) => (
                <button
                  key={`r1_${n}`}
                  onClick={() => {
                    soundFX.playClick();
                    setNumDucks(n);
                    setUseStudentNames(false);
                  }}
                  className={`w-9 h-9 rounded-xl font-black text-xs transition-all flex items-center justify-center shadow ${
                    numDucks === n && !useStudentNames
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white scale-110 border border-emerald-400 shadow-emerald-500/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* DÃY SỐ 2: SỐ LỚN (12 TỚI 50) */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase">Dãy 2 (Số lớn 12 - 50 con):</span>
            <div className="flex flex-wrap gap-1.5">
              {row2Numbers.map((n) => (
                <button
                  key={`r2_${n}`}
                  onClick={() => {
                    soundFX.playClick();
                    setNumDucks(n);
                    setUseStudentNames(false);
                  }}
                  className={`w-9 h-9 rounded-xl font-black text-xs transition-all flex items-center justify-center shadow ${
                    numDucks === n && !useStudentNames
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 scale-110 border border-amber-400 shadow-amber-500/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CLOCK & CONTROLS DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center shrink-0">
          
          {/* DIGITAL TIMER DISPLAY (00:00:15) */}
          <div className="md:col-span-6 bg-slate-950 border-2 border-emerald-500 rounded-2xl p-4 text-center space-y-1 shadow-inner">
            <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">ĐỒNG HỒ ĐẾM GIỜ BẮT ĐẦU ĐUA</div>
            <div className="text-4xl font-black text-white font-mono tracking-widest">{timerText}</div>
          </div>

          {/* DUCK COUNT & DURATION SETUP */}
          <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs font-bold">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">ĐANG CHỌN:</span>
              <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black">
                {numDucks} Con Vịt Đua {useStudentNames ? '(Theo Danh Sách Lớp)' : '(Số Thứ Tự)'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-300 shrink-0">CÀI THỜI GIAN ĐUA:</span>
              <select
                value={raceDuration}
                onChange={(e) => setRaceDuration(Number(e.target.value))}
                className="flex-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
              >
                <option value={10}>10 Giây</option>
                <option value={15}>15 Giây (Chuẩn)</option>
                <option value={30}>30 Giây</option>
                <option value={45}>45 Giây</option>
              </select>
            </div>
          </div>

        </div>

        {/* CANVAS ANIMATION TRACK */}
        <div className="flex-1 bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden relative min-h-[300px]">
          <canvas
            ref={canvasRef}
            width={900}
            height={Math.max(280, numDucks * 38 + 30)}
            className="w-full h-full block"
          />
        </div>

        {/* RACE CONTROLS & REWARD BUTTONS */}
        <div className="flex items-center justify-between shrink-0 pt-1 text-xs font-bold">
          <button
            onClick={resetRace}
            disabled={isRacing}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Đặt Lại Đường Đua
          </button>

          <button
            onClick={handleStartRace}
            disabled={isRacing}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-slate-950 font-black text-sm shadow-xl flex items-center gap-2 animate-bounce"
          >
            <Play className="w-5 h-5 fill-slate-950" /> {isRacing ? 'Đang Đua Sôi Nổi...' : 'BẮT ĐẦU ĐUA VỊT NGAY!'}
          </button>
        </div>

        {/* RANKINGS & LEADERBOARD TABLE */}
        {raceFinished && rankings.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/50 space-y-3 shrink-0 max-h-60 overflow-y-auto">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" /> BẢNG THỐNG KÊ VỊ THỨ VỀ ĐÍCH CỦA CÁC CHÚ VỊT
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {rankings.slice(0, 3).map((rk, idx) => (
                <div key={rk.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center ${
                      idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-white'
                    }`}>
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-white font-black text-xs">{rk.name}</div>
                      <div className="text-[10px] text-slate-400">{rk.finishTime}s</div>
                    </div>
                  </div>

                  {onRewardWinner && (
                    <button
                      onClick={() => onRewardWinner(rk, idx === 0 ? 5 : idx === 1 ? 3 : 2)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px]"
                    >
                      +Thưởng
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
