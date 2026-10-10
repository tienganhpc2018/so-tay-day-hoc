import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Music, 
  Maximize2, 
  Crop, 
  Settings, 
  Trophy, 
  HelpCircle, 
  X, 
  ChevronRight, 
  Sparkles, 
  Zap, 
  Check, 
  Plus, 
  Search, 
  Image as ImageIcon, 
  Edit3, 
  Camera, 
  FastForward,
  CheckCircle2,
  FileText,
  Upload,
  ArrowLeft,
  Sparkle,
  Radio,
  Sliders
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { cmsStorage } from '../../utils/cmsStorage';

export const MarbleRaceGameCanvas = ({ onClose }) => {
  // --------------------------------------------------
  // 1. CLASS & STUDENT ROSTER STATE
  // --------------------------------------------------
  const defaultClasses = [
    { id: 'cls-6a', name: 'Lớp 6A', code: '6A', grade: 6 },
    { id: 'cls-8c', name: 'Lớp 8C 2026 - 2027', code: '8C', grade: 8 },
    { id: 'cls-8a1', name: 'Lớp 8A1', code: '8A1', grade: 8 },
    { id: 'cls-9a1', name: 'Lớp 9A1', code: '9A1', grade: 9 }
  ];

  const defaultStudentNames = [
    'Tạ Thị Ngọc Ánh', 'Vũ Gia Bảo', 'Lương Khánh Bích', 'Đàm Chí Bình',
    'Vũ Thị Ngọc Diễm', 'Ma Ngọc Diệp', 'Tạ Ngọc Diệp', 'Lý Đức Duy',
    'Giàng Thị Hạnh', 'Ma Hoàng Minh Hằng', 'Đặng Thị Ngọc Hân', 'Hoàng Kim Huệ',
    'Đặng Thu Hương', 'Tạ Duy Khánh', 'Hầu Đức Khiêm', 'Ma Triệu Đức Long',
    'Vi Thị Khánh Ly', 'Bế Duy Mạnh', 'Ma Trà My', 'Nguyễn Hà My',
    'Bàn Thị Linh Na', 'Hà Yến Nhi', 'Triệu Thị Hà Nhi', 'Hoàng Thúy Nhung',
    'Bàn Thị Thu Phương', 'Hoàng Lan Phương', 'Lô Quang Thái', 'Ma Thị Thu Thủy',
    'Lý Hồng Thương', 'Dương Thủy Tiên', 'Nguyễn Thị Tình', 'Đặng Thị Trang',
    'Đỗ Bảo Trâm', 'Đặng Mạnh Vĩ'
  ];

  const marbleColors = [
    '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', 
    '#ef4444', '#06b6d4', '#84cc16', '#d946ef', '#f97316'
  ];

  const [selectedClassName, setSelectedClassName] = useState('Lớp 8C 2026 - 2027');
  const [students, setStudents] = useState([]);
  const [groupPhotoUrl, setGroupPhotoUrl] = useState('/images/hero_school_bg.jpg');

  // Load / Initialize students
  useEffect(() => {
    const savedClassPhoto = localStorage.getItem(`marble_race_photo_${selectedClassName}`);
    if (savedClassPhoto) setGroupPhotoUrl(savedClassPhoto);

    const savedStudents = localStorage.getItem(`marble_race_students_${selectedClassName}`);
    if (savedStudents) {
      try {
        const parsed = JSON.parse(savedStudents);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStudents(parsed);
          return;
        }
      } catch (e) {}
    }

    // Default Seed
    const initialList = defaultStudentNames.map((name, idx) => {
      const parts = name.trim().split(' ');
      const shortName = parts.length > 2 ? `${parts[parts.length - 2]} ${parts[parts.length - 1]}` : name;
      return {
        id: `stu-${idx + 1}`,
        name,
        shortName,
        photoUrl: null,
        present: true,
        color: marbleColors[idx % marbleColors.length],
        calledCount: 0
      };
    });
    setStudents(initialList);
  }, [selectedClassName]);

  const saveStudentsState = (updatedList) => {
    setStudents(updatedList);
    try {
      localStorage.setItem(`marble_race_students_${selectedClassName}`, JSON.stringify(updatedList));
    } catch (e) {}
  };

  // --------------------------------------------------
  // 2. CROPPER MODAL STATE ("Lấy ảnh từng HS từ ảnh tập thể")
  // --------------------------------------------------
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropStudentIndex, setCropStudentIndex] = useState(0);
  const [cropSize, setCropSize] = useState(137); // circle crop size px
  const [cropZoom, setCropZoom] = useState(195); // zoom percent
  const [cropPos, setCropPos] = useState({ x: 180, y: 150 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const cropImageRef = useRef(null);

  const handleUploadGroupPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      soundFX.playClick();
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setGroupPhotoUrl(dataUrl);
        localStorage.setItem(`marble_race_photo_${selectedClassName}`, dataUrl);
        alert('✨ Đã tải lên ảnh tập thể lớp thành công!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSaveAndNext = () => {
    soundFX.playClick();
    if (!cropImageRef.current) return;

    // Render cropped circle onto temporary canvas
    const imgEl = cropImageRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');

    // Draw circular clip
    ctx.beginPath();
    ctx.arc(60, 60, 60, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Calculate crop ratio based on image natural size vs displayed size
    const scaleX = imgEl.naturalWidth / imgEl.clientWidth;
    const scaleY = imgEl.naturalHeight / imgEl.clientHeight;

    const sourceX = (cropPos.x - cropSize / 2) * scaleX;
    const sourceY = (cropPos.y - cropSize / 2) * scaleY;
    const sourceW = cropSize * scaleX;
    const sourceH = cropSize * scaleY;

    ctx.drawImage(imgEl, sourceX, sourceY, sourceW, sourceH, 0, 0, 120, 120);
    const croppedDataUrl = canvas.toDataURL('image/png');

    // Update current student photo
    const updated = [...students];
    if (updated[cropStudentIndex]) {
      updated[cropStudentIndex].photoUrl = croppedDataUrl;
      saveStudentsState(updated);
    }

    // Move to next student
    if (cropStudentIndex < students.length - 1) {
      setCropStudentIndex(prev => prev + 1);
    } else {
      setIsCropperOpen(false);
      soundFX.playFanfare();
      confetti({ particleCount: 100, spread: 70 });
      alert('✨ Đã hoàn thành cắt ảnh cho tất cả học sinh!');
    }
  };

  // --------------------------------------------------
  // 3. RACE SETUP CONFIGURATION STATE
  // --------------------------------------------------
  const [raceLength, setRaceLength] = useState('MEDIUM'); // SHORT (~20s), MEDIUM (~30s), LONG (~40s)
  const [usePhotos, setUsePhotos] = useState(true);
  const [restPreviousWinner, setRestPreviousWinner] = useState(true);
  const [questionModeEnabled, setQuestionModeEnabled] = useState(false);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');

  useEffect(() => {
    const list = cmsStorage.getAssignments();
    setAvailableQuizzes(list);
    if (list.length > 0) setSelectedQuizId(list[0].id);
  }, []);

  const countStudentsWithPhoto = students.filter(s => s.photoUrl).length;

  const handleToggleAttendance = (stuId) => {
    soundFX.playClick();
    const updated = students.map(s => s.id === stuId ? { ...s, present: !s.present } : s);
    saveStudentsState(updated);
  };

  const handleMarkAllPresent = () => {
    soundFX.playClick();
    const updated = students.map(s => ({ ...s, present: true }));
    saveStudentsState(updated);
  };

  // --------------------------------------------------
  // 4. GAME STATE MACHINE & PHYSICS ENGINE
  // --------------------------------------------------
  // Modes: 'SETUP' | 'RACING' | 'PAUSED' | 'FINISHED' | 'QUESTION'
  const [gameState, setGameState] = useState('SETUP');
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 1, 2, 3
  const [cameraMode, setCameraMode] = useState('lead'); // 'lead' vs 'top10'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const [raceTimeSeconds, setRaceTimeSeconds] = useState(0);
  const [winnerStudent, setWinnerStudent] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [finishedCount, setFinishedCount] = useState(0);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const raceStartTimeRef = useRef(0);
  const raceMarblesRef = useRef([]);
  const finishOrderRef = useRef([]);

  // Audio BGM loop element ref
  const bgmAudioRef = useRef(null);

  // Start Race Handler
  const handleStartRace = () => {
    const activeMarbles = students.filter(s => s.present);
    if (activeMarbles.length === 0) {
      alert('Vui lòng chọn ít nhất 1 học sinh có mặt để bắt đầu cuộc đua!');
      return;
    }

    soundFX.playClick();
    setWinnerStudent(null);
    setFinishedCount(0);
    setRaceTimeSeconds(0);
    finishOrderRef.current = [];

    // Initialize 2D Marbles for Canvas Physics Loop
    const canvasWidth = 640;
    const marbleRadius = 14;

    const marbles = activeMarbles.map((stu, i) => {
      // Staggered grid launch positions at top chamber (y: 20 to 90)
      const cols = 6;
      const row = Math.floor(i / cols);
      const col = i % cols;

      const x = 140 + col * 70 + (Math.random() * 10 - 5);
      const y = 30 + row * 32 + (Math.random() * 10 - 5);

      return {
        ...stu,
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 2 + 1,
        radius: marbleRadius,
        finished: false,
        finishTime: 0,
        stage: 1
      };
    });

    raceMarblesRef.current = marbles;
    setLeaderboard(marbles);
    setGameState('RACING');
    raceStartTimeRef.current = Date.now();

    try {
      soundFX.playFanfare();
    } catch (e) {}
  };

  // --------------------------------------------------
  // 5. 2D CANVAS PHYSICS LOOP (7 MANDATORY STAGES)
  // --------------------------------------------------
  useEffect(() => {
    if (gameState !== 'RACING' && gameState !== 'PAUSED') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const TRACK_WIDTH = 640;
    const TRACK_HEIGHT = 1100;
    const FINISH_LINE_Y = 960;

    // Stage Boundaries Y coordinates
    const STAGE_1_GATE_Y = 120;
    const STAGE_2_BUMPERS_Y = 300;
    const STAGE_3_PINBALL_Y = 480;
    const STAGE_4_WAITING_GATE_Y = 620;
    const STAGE_5_RAMPS_Y = 760;
    const STAGE_6_FUNNEL_Y = 900;

    // Gravity based on selected race length
    const gravityMap = { SHORT: 0.28, MEDIUM: 0.18, LONG: 0.11 };
    const gravity = gravityMap[raceLength] || 0.18;

    // Pinball Flippers rotation angle
    let flipperAngle = 0;
    let waitingGateOpen = false;

    const renderLoop = () => {
      if (gameState === 'PAUSED') return;

      const currentTime = (Date.now() - raceStartTimeRef.current) / 1000;
      setRaceTimeSeconds(Number(currentTime.toFixed(2)));

      // Open waiting gate after 8 seconds of race
      if (currentTime > 6) waitingGateOpen = true;

      // Update flipper angle
      flipperAngle += 0.05 * speedMultiplier;

      // Clear Canvas
      ctx.fillStyle = '#0f0b29';
      ctx.fillRect(0, 0, TRACK_WIDTH, TRACK_HEIGHT);

      // Draw Stage Background Stripes & Labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(0, 0, TRACK_WIDTH, STAGE_1_GATE_Y);
      ctx.fillRect(0, STAGE_2_BUMPERS_Y, TRACK_WIDTH, STAGE_3_PINBALL_Y - STAGE_2_BUMPERS_Y);
      ctx.fillRect(0, STAGE_4_WAITING_GATE_Y, TRACK_WIDTH, STAGE_5_RAMPS_Y - STAGE_4_WAITING_GATE_Y);

      // Draw Stage Section Titles
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillText('1. XUẤT PHÁT', 20, 30);
      ctx.fillText('2. VÙNG NẤM NẢY', 20, STAGE_1_GATE_Y + 30);
      ctx.fillText('3. CẦN GẠT PINBALL', 20, STAGE_2_BUMPERS_Y + 30);
      ctx.fillText('4. CỬA CHỜ', 20, STAGE_3_PINBALL_Y + 30);
      ctx.fillText('5. THANH BAY', 20, STAGE_4_WAITING_GATE_Y + 30);
      ctx.fillText('6. PHỄU CỔ CHAI', 20, STAGE_5_RAMPS_Y + 30);
      ctx.fillText('7. ĐÍCH 🏁', 20, FINISH_LINE_Y - 10);

      // --------------------------------------------------
      // STAGE 1: START GATE (y: 120)
      // --------------------------------------------------
      ctx.strokeStyle = currentTime > 1.5 ? '#10b981' : '#f43f5e';
      ctx.lineWidth = 6;
      if (currentTime <= 1.5) {
        ctx.beginPath();
        ctx.moveTo(40, STAGE_1_GATE_Y);
        ctx.lineTo(TRACK_WIDTH - 40, STAGE_1_GATE_Y);
        ctx.stroke();
      }

      // --------------------------------------------------
      // STAGE 2: BUMPER PEGS / NẤM NẢY (y: 160 to 300)
      // --------------------------------------------------
      const pegRows = 4;
      const pegCols = 7;
      const pegs = [];
      for (let r = 0; r < pegRows; r++) {
        for (let c = 0; c < pegCols; c++) {
          const px = 80 + c * 80 + (r % 2 === 1 ? 40 : 0);
          const py = 160 + r * 38;
          pegs.push({ x: px, y: py, r: 10 });

          ctx.beginPath();
          ctx.arc(px, py, 10, 0, Math.PI * 2);
          ctx.fillStyle = '#ec4899';
          ctx.fill();
          ctx.strokeStyle = '#f472b6';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // --------------------------------------------------
      // STAGE 3: PINBALL FLIPPERS / CẦN GẠT (y: 350 to 450)
      // --------------------------------------------------
      const flipperLeftX = 180;
      const flipperRightX = 460;
      const flipperY = 380;
      const flipperLen = 100;

      const fLeftX2 = flipperLeftX + Math.cos(flipperAngle) * flipperLen;
      const fLeftY2 = flipperY + Math.sin(flipperAngle) * 20;

      const fRightX2 = flipperRightX - Math.cos(flipperAngle) * flipperLen;
      const fRightY2 = flipperY - Math.sin(flipperAngle) * 20;

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(flipperLeftX, flipperY);
      ctx.lineTo(fLeftX2, fLeftY2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(flipperRightX, flipperY);
      ctx.lineTo(fRightX2, fRightY2);
      ctx.stroke();

      // --------------------------------------------------
      // STAGE 4: WAITING GATE / CỬA CHỜ (y: 500)
      // --------------------------------------------------
      ctx.strokeStyle = waitingGateOpen ? '#34d399' : '#fbbf24';
      ctx.lineWidth = 8;
      if (!waitingGateOpen) {
        ctx.beginPath();
        ctx.moveTo(60, STAGE_4_WAITING_GATE_Y);
        ctx.lineTo(TRACK_WIDTH - 60, STAGE_4_WAITING_GATE_Y);
        ctx.stroke();
      }

      // --------------------------------------------------
      // STAGE 5: SPEED RAMPS / THANH BAY (y: 650)
      // --------------------------------------------------
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 8;
      // Ramp 1 (Left to Right slope)
      ctx.beginPath();
      ctx.moveTo(40, 640);
      ctx.lineTo(360, 720);
      ctx.stroke();

      // Ramp 2 (Right to Left slope)
      ctx.beginPath();
      ctx.moveTo(600, 720);
      ctx.lineTo(280, 800);
      ctx.stroke();

      // --------------------------------------------------
      // STAGE 6: FUNNEL / PHỄU CỔ CHAI (y: 820 to 920)
      // --------------------------------------------------
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(40, STAGE_5_RAMPS_Y + 20);
      ctx.lineTo(260, FINISH_LINE_Y - 40);
      ctx.lineTo(260, FINISH_LINE_Y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(TRACK_WIDTH - 40, STAGE_5_RAMPS_Y + 20);
      ctx.lineTo(TRACK_WIDTH - 260, FINISH_LINE_Y - 40);
      ctx.lineTo(TRACK_WIDTH - 260, FINISH_LINE_Y);
      ctx.stroke();

      // --------------------------------------------------
      // STAGE 7: FINISH LINE / ĐÍCH (y: 960)
      // --------------------------------------------------
      const squareSize = 16;
      for (let x = 260; x < 380; x += squareSize) {
        const isBlack = (Math.floor(x / squareSize) % 2 === 0);
        ctx.fillStyle = isBlack ? '#ffffff' : '#000000';
        ctx.fillRect(x, FINISH_LINE_Y, squareSize, squareSize);
      }
      ctx.font = 'black 14px sans-serif';
      ctx.fillStyle = '#facc15';
      ctx.fillText('🏁 ĐÍCH', 390, FINISH_LINE_Y + 14);

      // Outer Boundaries Walls
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, TRACK_WIDTH - 8, FINISH_LINE_Y + 40);

      // --------------------------------------------------
      // PHYSICS UPDATE & MARBLE DRAWING LOOP
      // --------------------------------------------------
      const marbles = raceMarblesRef.current;

      for (let steps = 0; steps < speedMultiplier; steps++) {
        marbles.forEach((m) => {
          if (m.finished) return;

          // Apply Gravity & Friction
          m.vy += gravity;
          m.vx *= 0.99;
          m.vy *= 0.99;

          // Update position
          m.x += m.vx;
          m.y += m.vy;

          // Wall Collisions Left & Right
          if (m.x - m.radius < 12) {
            m.x = 12 + m.radius;
            m.vx = Math.abs(m.vx) * 0.7 + 1;
          }
          if (m.x + m.radius > TRACK_WIDTH - 12) {
            m.x = TRACK_WIDTH - 12 - m.radius;
            m.vx = -Math.abs(m.vx) * 0.7 - 1;
          }

          // Gate 1 Barrier
          if (currentTime <= 1.5 && m.y + m.radius >= STAGE_1_GATE_Y) {
            m.y = STAGE_1_GATE_Y - m.radius;
            m.vy = -Math.abs(m.vy) * 0.3;
          }

          // Bumper Peg Collisions
          pegs.forEach((peg) => {
            const dx = m.x - peg.x;
            const dy = m.y - peg.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < m.radius + peg.r) {
              const nx = dx / dist;
              const ny = dy / dist;
              const dot = m.vx * nx + m.vy * ny;
              m.vx = (m.vx - 2 * dot * nx) * 1.3 + (Math.random() - 0.5);
              m.vy = (m.vy - 2 * dot * ny) * 1.3 + (Math.random() - 0.5);
              m.x = peg.x + nx * (m.radius + peg.r + 1);
              m.y = peg.y + ny * (m.radius + peg.r + 1);
            }
          });

          // Waiting Gate Barrier
          if (!waitingGateOpen && m.y + m.radius >= STAGE_4_WAITING_GATE_Y && m.y < STAGE_4_WAITING_GATE_Y + 20) {
            m.y = STAGE_4_WAITING_GATE_Y - m.radius;
            m.vy = -Math.abs(m.vy) * 0.3;
          }

          // Funnel Walls Collisions
          if (m.y > STAGE_5_RAMPS_Y + 20 && m.y < FINISH_LINE_Y) {
            // Left funnel slope line
            const leftFunnelX = 40 + (m.y - (STAGE_5_RAMPS_Y + 20)) * (220 / 120);
            if (m.x - m.radius < leftFunnelX) {
              m.x = leftFunnelX + m.radius;
              m.vx = Math.abs(m.vx) * 0.8 + 1.5;
            }

            // Right funnel slope line
            const rightFunnelX = (TRACK_WIDTH - 40) - (m.y - (STAGE_5_RAMPS_Y + 20)) * (220 / 120);
            if (m.x + m.radius > rightFunnelX) {
              m.x = rightFunnelX - m.radius;
              m.vx = -Math.abs(m.vx) * 0.8 - 1.5;
            }
          }

          // Anti-Stuck Watchdog: if velocity gets stuck
          if (Math.abs(m.vx) < 0.2 && Math.abs(m.vy) < 0.2 && m.y < FINISH_LINE_Y) {
            m.vx += (Math.random() - 0.5) * 2;
            m.vy += Math.random() * 2 + 1;
          }

          // Finish Line Crossing Detection
          if (m.y >= FINISH_LINE_Y && !m.finished) {
            m.finished = true;
            m.finishTime = Number(currentTime.toFixed(2));
            finishOrderRef.current.push(m);
            setFinishedCount(finishOrderRef.current.length);

            // 1st Place Winner Detection
            if (finishOrderRef.current.length === 1) {
              setWinnerStudent(m);
              soundFX.playFanfare();
              confetti({ particleCount: 150, spread: 90 });
            }
          }
        });
      }

      // Draw Marbles on Canvas
      marbles.forEach((m) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);

        // Draw photo or colored ball
        if (usePhotos && m.photoUrl) {
          ctx.clip();
          const img = new Image();
          img.src = m.photoUrl;
          ctx.drawImage(img, m.x - m.radius, m.y - m.radius, m.radius * 2, m.radius * 2);
        } else {
          ctx.fillStyle = m.color || '#ec4899';
          ctx.fill();
        }

        ctx.restore();

        // Outer Ring Border
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.strokeStyle = m.finished ? '#facc15' : '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw Name Badge Floating Above Marble
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.textAlign = 'center';
        ctx.fillText(m.shortName || m.name, m.x, m.y - m.radius - 4);
        ctx.shadowBlur = 0;
      });

      // Update Live Leaderboard State
      const sortedLeaderboard = [...marbles].sort((a, b) => {
        if (a.finished && b.finished) return a.finishTime - b.finishTime;
        if (a.finished) return -1;
        if (b.finished) return 1;
        return b.y - a.y; // Higher Y = closer to finish line
      });
      setLeaderboard(sortedLeaderboard);

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, raceLength, speedMultiplier, usePhotos]);

  // --------------------------------------------------
  // 6. RENDER GAME MODAL & CANVAS UI
  // --------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 bg-[#0f0b29] text-white flex flex-col font-sans select-none overflow-hidden animate-fadeIn">
      
      {/* TOP NAV BAR */}
      <div className="h-14 px-6 bg-[#160d3d] border-b border-purple-900/60 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              Đua bi — {selectedClassName} 🏁
            </h2>
            <p className="text-[11px] text-purple-300 font-semibold">Bi lăn qua chướng ngại vật — viên nào về đích trước, em đó được gọi</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {gameState !== 'SETUP' && (
            <button
              onClick={() => {
                soundFX.playClick();
                setGameState('SETUP');
              }}
              className="px-4 py-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 font-extrabold text-xs flex items-center gap-1.5 border border-purple-700"
            >
              <RotateCcw className="w-4 h-4" /> Cấu hình cuộc đua
            </button>
          )}

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white flex items-center justify-center shadow"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ================================================== */}
      {/* MODE 1: SETUP SCREEN (THIẾT LẬP CUỘC ĐUA) */}
      {/* ================================================== */}
      {gameState === 'SETUP' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-6 animate-fadeIn">
          
          {/* TOP CLASS SELECTOR & PHOTO BUTTON BAR */}
          <div className="p-5 rounded-3xl bg-[#1a1148] border border-purple-800/80 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block">CHỌN LỚP HỌC:</label>
              <select
                value={selectedClassName}
                onChange={(e) => setSelectedClassName(e.target.value)}
                className="bg-purple-950 border border-purple-700 text-white font-black text-sm rounded-xl p-2.5 outline-none"
              >
                {defaultClasses.map(c => (
                  <option key={c.id} value={c.name}>{c.name} ({c.grade} khối)</option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-black text-xs cursor-pointer flex items-center gap-2 shadow">
                <Upload className="w-4 h-4" /> 📷 Thêm ảnh lớp
                <input type="file" accept="image/*" onChange={handleUploadGroupPhoto} className="hidden" />
              </label>

              <button
                onClick={() => {
                  soundFX.playClick();
                  setIsCropperOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-2 shadow"
              >
                <Crop className="w-4 h-4" /> ✂️ Lấy ảnh từng HS từ ảnh tập thể
              </button>
            </div>
          </div>

          {/* RACE LENGTH CARDS */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-purple-200 uppercase tracking-wider block">ĐỘ DÀI ĐƯỜNG ĐUA:</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'SHORT', title: 'Ngắn', time: '~20 giây' },
                { id: 'MEDIUM', title: 'Vừa', time: '~30 giây' },
                { id: 'LONG', title: 'Dài', time: '~40 giây' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    soundFX.playClick();
                    setRaceLength(opt.id);
                  }}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    raceLength === opt.id
                      ? 'bg-purple-600 text-white border-purple-400 shadow-xl ring-2 ring-purple-400'
                      : 'bg-[#1a1148] text-purple-300 border-purple-800/80 hover:bg-purple-900/50'
                  }`}
                >
                  <div className="text-base font-black">{opt.title}</div>
                  <div className="text-xs font-semibold text-purple-200">{opt.time}</div>
                </button>
              ))}
            </div>
          </div>

          {/* TOGGLE SWITCHES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#1a1148] border border-purple-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-white block">Dùng ảnh học sinh làm bi</span>
                <span className="text-[11px] text-purple-300 font-semibold">({countStudentsWithPhoto}/{students.length} em có ảnh)</span>
              </div>
              <input
                type="checkbox"
                checked={usePhotos}
                onChange={(e) => setUsePhotos(e.target.checked)}
                className="w-5 h-5 accent-purple-500 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#1a1148] border border-purple-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-white block">Cho bạn vừa được gọi nghỉ một lượt</span>
                <span className="text-[11px] text-purple-300 font-semibold">Tránh gọi lặp lại cùng 1 học sinh</span>
              </div>
              <input
                type="checkbox"
                checked={restPreviousWinner}
                onChange={(e) => setRestPreviousWinner(e.target.checked)}
                className="w-5 h-5 accent-purple-500 cursor-pointer"
              />
            </div>
          </div>

          {/* QUESTION BANK SELECTOR OPTION */}
          <div className="p-4 rounded-2xl bg-[#1a1148] border border-purple-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" /> Chế độ Đua + Mở câu hỏi Tiếng Anh
              </span>
              <input
                type="checkbox"
                checked={questionModeEnabled}
                onChange={(e) => setQuestionModeEnabled(e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>

            {questionModeEnabled && (
              <div className="pt-2 border-t border-purple-800/60 space-y-2">
                <label className="text-xs text-purple-300 font-bold block">CHỌN BỘ CÂU HỎI TỪ KHO LMS:</label>
                <select
                  value={selectedQuizId}
                  onChange={(e) => setSelectedQuizId(e.target.value)}
                  className="w-full bg-purple-950 border border-purple-700 text-white font-bold text-xs rounded-xl p-2.5"
                >
                  {availableQuizzes.map(q => (
                    <option key={q.id} value={q.id}>[{q.assignmentType || 'QUIZ'}] {q.title}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* ATTENDANCE BADGES LIST */}
          <div className="p-5 rounded-3xl bg-[#1a1148] border border-purple-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white uppercase tracking-wider">Điểm danh</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[11px]">
                  Có mặt {students.filter(s => s.present).length}/{students.length}
                </span>
              </div>
              <button
                onClick={handleMarkAllPresent}
                className="text-xs font-extrabold text-amber-400 hover:underline"
              >
                CÓ MẶT TẤT CẢ
              </button>
            </div>

            <p className="text-[11px] text-purple-300 font-semibold">Bấm vào tên em vắng để loại khỏi cuộc đua.</p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {students.map((stu) => (
                <button
                  key={stu.id}
                  onClick={() => handleToggleAttendance(stu.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                    stu.present
                      ? 'bg-purple-600 text-white border border-purple-400 shadow'
                      : 'bg-purple-950/60 text-purple-400 border border-purple-900 line-through opacity-60'
                  }`}
                >
                  {stu.name}
                </button>
              ))}
            </div>
          </div>

          {/* BOTTOM START BUTTON */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-purple-950 text-purple-300 hover:bg-purple-900 font-extrabold text-xs"
            >
              HUỶ
            </button>
            <button
              onClick={handleStartRace}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-2xl flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" /> 🟣 BẮT ĐẦU ĐUA
            </button>
          </div>

        </div>
      )}

      {/* ================================================== */}
      {/* MODE 2: LIVE RACE SCREEN (CANVAS 2D PHYSICS) */}
      {/* ================================================== */}
      {(gameState === 'RACING' || gameState === 'PAUSED' || gameState === 'FINISHED') && (
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* MAIN CANVAS VIEW (LEFT / CENTER) */}
          <div className="flex-1 bg-[#09061c] flex items-center justify-center p-4 relative overflow-hidden">
            
            {/* OVERLAY START BANNER */}
            {raceTimeSeconds < 2 && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none animate-bounce">
                <span className="text-6xl font-black text-amber-400 tracking-widest drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
                  XUẤT PHÁT!
                </span>
              </div>
            )}

            {/* TOP FLOATING RACE STATS BADGE */}
            <div className="absolute top-4 left-6 z-20 bg-purple-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-purple-700/60 flex items-center gap-3 text-xs font-black shadow-xl">
              <span className="text-amber-300 flex items-center gap-1">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" /> {students.filter(s => s.present).length} viên bi đã xuất phát!
              </span>
            </div>

            {/* THE 2D PHYSICS CANVAS */}
            <div className="rounded-3xl border-4 border-purple-800/80 shadow-2xl overflow-hidden bg-[#0f0b29]">
              <canvas
                ref={canvasRef}
                width={640}
                height={1020}
                className="max-h-[85vh] w-auto object-contain"
              />
            </div>

            {/* WINNER POPUP BANNER AT BOTTOM */}
            {winnerStudent && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 p-1 rounded-3xl shadow-2xl animate-fadeIn">
                <div className="bg-[#160d3d] px-6 py-3 rounded-[22px] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 bg-purple-900 flex items-center justify-center text-lg font-black text-white shrink-0 shadow">
                    {winnerStudent.photoUrl ? (
                      <img src={winnerStudent.photoUrl} alt={winnerStudent.name} className="w-full h-full object-cover" />
                    ) : (
                      winnerStudent.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-black text-amber-300 uppercase block">🏆 VỀ NHẤT!</span>
                    <span className="text-base font-black text-white">{winnerStudent.name}</span>
                  </div>
                  <button
                    onClick={() => setGameState('FINISHED')}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow ml-2"
                  >
                    Xem kết quả →
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR: TIMER, MINIMAP, LIVE LEADERBOARD, CONTROLS */}
          <div className="w-80 bg-[#140c38] border-l border-purple-900/60 p-4 flex flex-col justify-between space-y-4 shadow-2xl">
            
            {/* TOP TIMER & ARRIVED COUNTER */}
            <div className="space-y-3 border-b border-purple-800/60 pb-3">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-black text-amber-400 font-mono tracking-wider">
                  {raceTimeSeconds.toFixed(2)}s
                </div>
                <div className="px-3 py-1 rounded-full bg-purple-950 text-purple-200 border border-purple-700 font-black text-xs">
                  VỀ ĐÍCH {finishedCount}/{students.filter(s => s.present).length}
                </div>
              </div>

              {/* MINIMAP BAR */}
              <div className="h-4 bg-purple-950 rounded-full border border-purple-800 overflow-hidden relative">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500" style={{ width: `${Math.min(100, (finishedCount / (students.filter(s => s.present).length || 1)) * 100)}%` }} />
              </div>
            </div>

            {/* LIVE LEADERBOARD LIST */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <span className="text-xs font-extrabold text-purple-300 uppercase tracking-wider block mb-2">BẢNG XẾP HẠNG</span>
              {leaderboard.map((m, idx) => (
                <div
                  key={m.id}
                  className={`p-2 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                    idx === 0
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : idx === 1
                      ? 'bg-slate-300/20 text-slate-200 border border-slate-500/50'
                      : idx === 2
                      ? 'bg-amber-700/20 text-amber-400 border border-amber-800/50'
                      : 'bg-purple-950/60 text-purple-200 border border-purple-900/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 font-black text-slate-400 text-center">{idx + 1}</span>
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-purple-800 flex items-center justify-center text-[10px] font-black border border-purple-600">
                      {usePhotos && m.photoUrl ? (
                        <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        m.shortName?.charAt(0) || m.name?.charAt(0)
                      )}
                    </div>
                    <span className="truncate max-w-[110px]">{m.shortName || m.name}</span>
                  </div>

                  <span className="text-[11px] font-mono text-purple-300">
                    {m.finished ? `${m.finishTime}s` : ''}
                  </span>
                </div>
              ))}
            </div>

            {/* BOTTOM CONTROLS & SPEED MULTIPLIERS */}
            <div className="space-y-3 border-t border-purple-800/60 pt-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-purple-300">Tốc độ:</span>
                <div className="flex items-center gap-1 bg-purple-950 p-1 rounded-xl border border-purple-800">
                  {[1, 2, 3].map(sp => (
                    <button
                      key={sp}
                      onClick={() => setSpeedMultiplier(sp)}
                      className={`px-3 py-1 rounded-lg text-xs font-black ${speedMultiplier === sp ? 'bg-purple-600 text-white' : 'text-purple-400'}`}
                    >
                      x{sp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-purple-300">Camera:</span>
                <div className="flex items-center gap-1 bg-purple-950 p-1 rounded-xl border border-purple-800">
                  <button
                    onClick={() => setCameraMode('lead')}
                    className={`px-3 py-1 rounded-lg text-xs font-black ${cameraMode === 'lead' ? 'bg-indigo-600 text-white' : 'text-purple-400'}`}
                  >
                    Dẫn đầu
                  </button>
                  <button
                    onClick={() => setCameraMode('top10')}
                    className={`px-3 py-1 rounded-lg text-xs font-black ${cameraMode === 'top10' ? 'bg-indigo-600 text-white' : 'text-purple-400'}`}
                  >
                    Top 10
                  </button>
                </div>
              </div>

              <button
                onClick={() => setGameState('FINISHED')}
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg"
              >
                Kết thúc
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ================================================== */}
      {/* MODE 3: FINISHED RESULT SCREEN (KẾT QUẢ & CÂU HỎI) */}
      {/* ================================================== */}
      {gameState === 'FINISHED' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full space-y-6 animate-fadeIn">
          
          <div className="p-8 rounded-3xl bg-[#160d3d] border-2 border-amber-400 text-center space-y-4 shadow-2xl">
            <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
            <h2 className="text-2xl font-black text-amber-300">HỌC SINH VỀ NHẤT ĐƯỢC GỌI TÊN!</h2>

            {winnerStudent && (
              <div className="p-4 rounded-2xl bg-purple-950/80 border border-purple-700 max-w-sm mx-auto flex items-center gap-4 text-left">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 bg-purple-900 flex items-center justify-center text-2xl font-black text-white shrink-0">
                  {winnerStudent.photoUrl ? (
                    <img src={winnerStudent.photoUrl} alt={winnerStudent.name} className="w-full h-full object-cover" />
                  ) : (
                    winnerStudent.name.charAt(0)
                  )}
                </div>
                <div>
                  <span className="text-xs font-extrabold text-amber-300 uppercase block">🥇 VỀ NHẤT (Thành tích: {winnerStudent.finishTime}s)</span>
                  <span className="text-lg font-black text-white">{winnerStudent.name}</span>
                  <span className="text-xs text-purple-300 block">{selectedClassName}</span>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleStartRace}
                className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-lg flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Đua lại lượt mới
              </button>
              <button
                onClick={() => setGameState('SETUP')}
                className="px-6 py-3 rounded-2xl bg-purple-950 text-purple-200 hover:bg-purple-900 font-extrabold text-xs"
              >
                Về thiết lập
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-2xl bg-slate-800 text-white font-extrabold text-xs"
              >
                Quay lại Học liệu
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ================================================== */}
      {/* CROPPER MODAL ("Lấy ảnh từng HS từ ảnh tập thể") */}
      {/* ================================================== */}
      {isCropperOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col font-sans">
          
          {/* CROPPER TOP BAR */}
          <div className="p-4 bg-[#160d3d] border-b border-purple-800 flex items-center justify-between">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Crop className="w-5 h-5 text-indigo-400" /> Lấy ảnh từng học sinh từ ảnh tập thể
            </h3>
            <button onClick={() => setIsCropperOpen(false)} className="text-purple-300 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* WARNING BANNER MATCHING SCREENSHOT 2 */}
          <div className="bg-amber-500/20 border-b border-amber-500/40 p-3 px-6 text-xs text-amber-200 flex items-center gap-2 font-semibold">
            <span>⚠️ Vùng chọn chỉ có {cropSize}px nên ảnh cắt ra sẽ hơi mờ. Cách khắc phục: kéo thanh trượt cho vòng to hơn, hoặc bấm "Thêm ảnh để cắt" rồi chọn file ảnh GỐC từ máy...</span>
          </div>

          {/* CROPPER TOOLBAR */}
          <div className="p-4 bg-[#1a1148] border-b border-purple-800 flex flex-wrap items-center justify-between gap-4 text-xs font-bold">
            <div className="flex items-center gap-4">
              <span className="text-purple-300">Cỡ vòng chọn:</span>
              <input
                type="range"
                min={80}
                max={300}
                value={cropSize}
                onChange={(e) => setCropSize(parseInt(e.target.value))}
                className="w-36 accent-purple-500 cursor-pointer"
              />
              <span className="px-2 py-1 rounded bg-purple-950 text-amber-400 font-mono text-xs">{cropSize}px</span>

              <span className="px-3 py-1 rounded-full bg-purple-700 text-white font-black">
                {cropStudentIndex + 1}/{students.length}: {students[cropStudentIndex]?.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCropZoom(prev => Math.min(300, prev + 25))}
                className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-200 hover:bg-purple-900 border border-purple-700"
              >
                🔍 + ({cropZoom}%)
              </button>
              <button
                onClick={() => setCropZoom(prev => Math.max(100, prev - 25))}
                className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-200 hover:bg-purple-900 border border-purple-700"
              >
                🔍 -
              </button>
            </div>
          </div>

          {/* CROPPER CANVAS / IMAGE DISPLAY CANVAS */}
          <div className="flex-1 overflow-hidden relative bg-[#09061c] flex items-center justify-center p-4">
            <div className="relative max-w-full max-h-full overflow-hidden rounded-2xl border border-purple-800 shadow-2xl">
              <img
                ref={cropImageRef}
                src={groupPhotoUrl}
                alt="Group photo"
                style={{ transform: `scale(${cropZoom / 100})`, transformOrigin: 'center center' }}
                className="max-h-[65vh] w-auto object-contain pointer-events-none"
              />

              {/* DRAGGABLE CIRCLE CROP WINDOW */}
              <div
                onMouseDown={(e) => {
                  setIsDraggingCrop(true);
                  setDragStart({ x: e.clientX - cropPos.x, y: e.clientY - cropPos.y });
                }}
                onMouseMove={(e) => {
                  if (isDraggingCrop) {
                    setCropPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
                  }
                }}
                onMouseUp={() => setIsDraggingCrop(false)}
                style={{
                  width: `${cropSize}px`,
                  height: `${cropSize}px`,
                  left: `${cropPos.x - cropSize / 2}px`,
                  top: `${cropPos.y - cropSize / 2}px`
                }}
                className="absolute rounded-full border-4 border-amber-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] cursor-move flex items-center justify-center"
              >
                <span className="text-[10px] font-black text-amber-300 bg-black/60 px-2 py-0.5 rounded-full">
                  {students[cropStudentIndex]?.shortName}
                </span>
              </div>
            </div>
          </div>

          {/* BOTTOM CROPPER ACTION BAR */}
          <div className="p-4 bg-[#160d3d] border-t border-purple-800 flex items-center justify-between">
            <button
              onClick={() => setIsCropperOpen(false)}
              className="px-6 py-2.5 rounded-xl bg-purple-950 text-purple-300 font-extrabold text-xs"
            >
              Xong
            </button>
            <button
              onClick={handleCropSaveAndNext}
              className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-xl flex items-center gap-2"
            >
              Lưu & Chuyển HS tiếp theo →
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
