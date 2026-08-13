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
  Zap,
  ArrowRight
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

export const DuckRaceGameCanvas = ({ students = [], onClose, onRewardWinner }) => {
  // Filter present students
  const activeStudents = students.filter(s => s.status !== 'Absent_Perm' && s.status !== 'Absent_NoPerm');

  // SCREEN MODE: 'setup' (Cài đặt trượt slider - Screenshot 1) or 'racing' (Vào đường đua chờ lệnh - Screenshot 1)
  const [screenMode, setScreenMode] = useState('setup');

  // Race Setup States (Matching Screenshot 1 100%)
  const [numDucks, setNumDucks] = useState(4); // Default range slider value (Screenshot 1 shows green bubble 4)
  const [raceDuration, setRaceDuration] = useState(12); // Default 12s matching Screenshot 1 (00:00:12)
  const [timerText, setTimerText] = useState('00:00:12');
  const [useStudentNames, setUseStudentNames] = useState(true);
  const [isRacing, setIsRacing] = useState(false);
  const [raceFinished, setRaceFinished] = useState(false);
  const [rankings, setRankings] = useState([]);

  // Canvas & Animation refs
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const duckPositionsRef = useRef([]);

  // Initialize Duck Racers
  useEffect(() => {
    resetRace();
  }, [numDucks, useStudentNames, students, screenMode]);

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
        y: 45 + idx * 36,
        speed: 0,
        finishTime: null,
        rank: null
      };
    });

    duckPositionsRef.current = racers;
    if (screenMode === 'racing') drawCanvas();
  };

  // Canvas Renderer
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;

    // 1. Draw Water & Finish Line
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, width, height);

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
      ctx.fillStyle = duck.color;
      ctx.beginPath();
      ctx.ellipse(duck.x, duck.y, 16, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = duck.color;
      ctx.beginPath();
      ctx.arc(duck.x + 12, duck.y - 8, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(duck.x + 20, duck.y - 6, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(duck.x + 14, duck.y - 10, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(duck.x + 15, duck.y - 10, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(duck.x - 4, duck.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(duck.code || `${idx + 1}`, duck.x - 4, duck.y);

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

      const secStr = Math.floor(remaining).toString().padStart(2, '0');
      setTimerText(`00:00:${secStr}`);

      let allFinished = true;

      duckPositionsRef.current.forEach((duck) => {
        if (!duck.finishTime) {
          allFinished = false;
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
      <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-5xl w-full p-6 space-y-4 shadow-2xl animate-fadeIn flex flex-col max-h-[92vh] text-white">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-xl">
              🐤
            </div>
            <div>
              <h3 className="text-base font-black text-white">TRÒ CHƠI ĐUA VỊT DUCK RACE (MATCHING SCREENSHOT 1)</h3>
              <span className="text-[11px] text-slate-400 font-bold">
                {screenMode === 'setup' ? 'Cài đặt số lượng vịt bằng thanh trượt & thời gian' : `Đang chọn ${numDucks} con vịt - Thời gian ${raceDuration}s`}
              </span>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SCREEN 1: RANGE SLIDER SETUP DASHBOARD (MATCHING SCREENSHOT 1 100%) */}
        {screenMode === 'setup' && (
          <div className="space-y-6 animate-fadeIn py-2">
            
            {/* DIGITAL TIMER SETUP (MATCHING SCREENSHOT 1 TOP DISPLAY 00:00:12) */}
            <div className="bg-slate-950 border-2 border-emerald-500 rounded-3xl p-6 text-center space-y-2 shadow-inner">
              <span className="text-xs text-emerald-400 font-black uppercase tracking-wider">ĐỒNG HỒ ĐẾM GIỜ ĐĂNG KÝ BẮT ĐẦU ĐUA</span>
              <div className="text-5xl font-black text-white font-mono tracking-widest">
                00:00:{raceDuration.toString().padStart(2, '0')}
              </div>
            </div>

            {/* KEYPAD & TIMER QUICK BUTTONS MATCHING SCREENSHOT 1 */}
            <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-black text-slate-400 uppercase">CHỌN THỜI GIAN NHANH (GIÂY):</span>
              <div className="grid grid-cols-6 gap-2 text-xs font-black">
                {[5, 6, 7, 8, 9, 10, 12, 15, 20, 30, 45, 60].map((s) => (
                  <button
                    key={`time_${s}`}
                    onClick={() => { soundFX.playClick(); setRaceDuration(s); setTimerText(`00:00:${s.toString().padStart(2, '0')}`); }}
                    className={`p-3 rounded-xl border transition-all ${
                      raceDuration === s ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg' : 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>

            {/* RANGE SLIDER 1 TO 100 DUCKS WITH GREEN NUMBER BUBBLE (MATCHING SCREENSHOT 1 100%) */}
            <div className="p-6 rounded-3xl bg-slate-950 border-2 border-amber-400/60 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4" /> KÉO THANH TRƯỢT CHỌN SỐ LƯỢNG VỊT ĐUA (1 TỚI 100 CON):
                </span>

                <button
                  type="button"
                  onClick={() => setUseStudentNames(!useStudentNames)}
                  className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-bold text-xs"
                >
                  {useStudentNames ? 'Tên Học Sinh' : 'Số Thứ Tự'}
                </button>
              </div>

              {/* SLIDER CONTAINER WITH GREEN NUMBER BUBBLE (SCREENSHOT 1) */}
              <div className="relative pt-6 pb-2 px-2">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={numDucks}
                  onChange={(e) => {
                    soundFX.playClick();
                    setNumDucks(Number(e.target.value));
                  }}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />

                {/* GREEN NUMBER BUBBLE INDICATOR MATCHING SCREENSHOT 1 */}
                <div
                  className="absolute -top-3 w-10 h-10 rounded-full bg-emerald-500 border-2 border-white text-slate-950 font-black text-sm flex items-center justify-center shadow-2xl transition-all pointer-events-none transform -translate-x-1/2"
                  style={{ left: `${((numDucks - 1) / 99) * 94 + 3}%` }}
                >
                  {numDucks}
                </div>
              </div>

              <div className="flex justify-between text-[11px] font-bold text-slate-400 px-1">
                <span>1 Con</span>
                <span>50 Con</span>
                <span>100 Con</span>
              </div>
            </div>

            {/* GREEN "SET" CONFIRMATION BUTTON MATCHING SCREENSHOT 1 */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setScreenMode('racing');
                }}
                className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base shadow-2xl flex items-center justify-center gap-2 animate-bounce"
              >
                <Check className="w-6 h-6 stroke-[3]" /> SET (XÁC NHẬN VÀO ĐƯỜNG ĐUA)
              </button>
            </div>

          </div>
        )}

        {/* SCREEN 2: FULL SCREEN CLEAN TRACK & RACE ENGINE */}
        {screenMode === 'racing' && (
          <div className="space-y-4 flex-1 flex flex-col animate-fadeIn">
            
            <div className="flex items-center justify-between bg-slate-950 border-2 border-emerald-500 rounded-2xl p-4 shadow-inner shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-emerald-400 uppercase">ĐỒNG HỒ ĐẾM GIỜ BẮT ĐẦU ĐUA:</span>
                <span className="text-3xl font-black text-white font-mono tracking-widest">{timerText}</span>
              </div>

              <button
                onClick={() => setScreenMode('setup')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5"
              >
                <Settings className="w-4 h-4" /> Đổi Cài Đặt
              </button>
            </div>

            <div className="flex-1 bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden relative min-h-[360px]">
              <canvas
                ref={canvasRef}
                width={900}
                height={Math.max(340, numDucks * 38 + 30)}
                className="w-full h-full block"
              />
            </div>

            <div className="flex items-center justify-between shrink-0 pt-1 text-xs font-bold">
              <button
                onClick={resetRace}
                disabled={isRacing}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Đặt Lại Vạch Xuất Phát
              </button>

              <button
                onClick={handleStartRace}
                disabled={isRacing}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-slate-950 font-black text-sm shadow-xl flex items-center gap-2 animate-bounce"
              >
                <Play className="w-5 h-5 fill-slate-950" /> {isRacing ? 'Đang Đua Sôi Nổi...' : 'BẮT ĐẦU ĐUA VỊT NGAY!'}
              </button>
            </div>

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
        )}

      </div>
    </div>
  );
};
