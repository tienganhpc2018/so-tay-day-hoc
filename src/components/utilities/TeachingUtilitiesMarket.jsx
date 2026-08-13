import React, { useState } from 'react';
import { 
  Gamepad2, 
  HelpCircle, 
  Users, 
  Globe, 
  Play, 
  Share2, 
  Plus, 
  Search, 
  Eye, 
  Download, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  Sparkles, 
  X,
  ExternalLink,
  BookOpen,
  Layers,
  Dices,
  Swords,
  Zap,
  Crown,
  ShoppingBag,
  Trophy,
  RotateCcw
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

import { FlashcardGame } from '../games/FlashcardGame';
import { MatchingPairsGame } from '../games/MatchingPairsGame';
import { WordScrambleGame } from '../games/WordScrambleGame';
import { IFrameGameViewer } from '../games/iFrameGameViewer';
import { TugOfWarGameCanvas } from '../games/TugOfWarGameCanvas';
import { HeadTiltGameCanvas } from '../games/HeadTiltGameCanvas';
import { LuckyWheelGameCanvas } from '../games/LuckyWheelGameCanvas';

import { XpShopModal } from '../gamification/XpShopModal';

export const TeachingUtilitiesMarket = () => {
  // Tab 'games' | 'interactive' | 'gamification' | 'questions' | 'classes' | 'community'
  const [activeTab, setActiveTab] = useState('games');
  const [activeGameSubTab, setActiveGameSubTab] = useState('flashcard');

  const [selectedGrade, setSelectedGrade] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Preview Modal for "Xem thử"
  const [previewItem, setPreviewItem] = useState(null);

  // Play Game State / Canvas Modal
  const [activePlayGame, setActivePlayGame] = useState(null);

  // GAMIFICATION HTML5 TAB STATES
  const [showXpShopModal, setShowXpShopModal] = useState(false);
  const [activeGamificationSubTab, setActiveGamificationSubTab] = useState('embedded');
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [showAddGameModal, setShowAddGameModal] = useState(false);

  const [newGameTitle, setNewGameTitle] = useState('');
  const [newGamePlatform, setNewGamePlatform] = useState('Wordwall Embed');
  const [newGameEmbedUrl, setNewGameEmbedUrl] = useState('');

  // PVP State
  const [pvpOpponent, setPvpOpponent] = useState('Trần Thuỳ Dương');
  const [pvpWagerXp, setPvpWagerXp] = useState(100);

  // External Games (Wordwall, Quizizz, Kahoot, HTML5 ZIP)
  const [externalGames, setExternalGames] = useState([
    {
      id: 'g1',
      title: 'Wordwall: Ôn Tập Từ Vựng Unit 1 Tiếng Anh 8',
      platform: 'Wordwall Embed',
      embedUrl: 'https://wordwall.net/embed/4c06cf84620f4c399580b06497f1f92e?themeId=1&templateId=5',
      attemptsLeft: 3,
      highScore: 980,
      likes: 54
    },
    {
      id: 'g2',
      title: 'Quizizz: Luyện Tập Trọng Âm & Ngữ Pháp Khối 9',
      platform: 'Quizizz Embed',
      embedUrl: 'https://quizizz.com/embed/quiz/6401928374921',
      attemptsLeft: 5,
      highScore: 1000,
      likes: 82
    }
  ]);

  // Leaderboard
  const leaderboardList = [
    { rank: 1, name: 'Phạm Thanh Tú', score: 1000, time: '35 giây', xp: 2450, badge: '🥇 Top 1 Champion' },
    { rank: 2, name: 'Trần Thuỳ Dương', score: 980, time: '42 giây', xp: 2100, badge: '🥈 Thần Đồng Từ Vựng' },
    { rank: 3, name: 'Vũ Mai Phương', score: 950, time: '48 giây', xp: 1850, badge: '🥉 Chuyên Gia Trắc Nghiệm' }
  ];

  // 6 MAIN TABS UNDER HERO BANNER (TAB 3 IS GAMIFICATION HTML5 - EXACTLY AS THẦY REQUESTED!)
  const tabs = [
    { id: 'games', label: 'Game vui học', icon: Gamepad2 },
    { id: 'interactive', label: 'Game tương tác', icon: Swords },
    { id: 'gamification', label: 'Gamification HTML5 ⚡', icon: Zap },
    { id: 'questions', label: 'Kho câu hỏi cá nhân', icon: HelpCircle },
    { id: 'classes', label: 'Danh sách lớp học', icon: Users },
    { id: 'community', label: 'Thư viện cộng đồng', icon: Globe }
  ];

  // 4 INTERACTIVE GAME SUB-TABS INSIDE "Game vui học"
  const gameSubTabs = [
    { id: 'flashcard', label: '1. Flashcard Từ Vựng', icon: BookOpen },
    { id: 'matching', label: '2. Trò Chơi Ghép Cặp', icon: Layers },
    { id: 'racing', label: '3. Đua Xe Từ Vựng (Word Scramble)', icon: Dices },
    { id: 'iframe', label: '4. iFrame Game Project', icon: ExternalLink }
  ];

  // 4 INTERACTIVE GAMES FOR TAB "Game tương tác"
  const [interactiveGames, setInteractiveGames] = useState([
    {
      id: 'g1',
      title: 'Vòng Quay May Mắn ETA',
      tag: 'INTERACTIVE GAME',
      plays: '232 lượt',
      badge: 'MIỄN PHÍ',
      description: 'Công cụ chọn ngẫu nhiên học sinh hoặc phần thưởng trên lớp học. Giao diện sinh động sắc nét.',
      img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop',
      type: 'lucky_wheel'
    },
    {
      id: 'g2',
      title: 'Kéo Co Tri Thức (Kiến Thức)',
      tag: 'INTERACTIVE GAME',
      plays: '180 lượt',
      badge: 'MIỄN PHÍ',
      description: 'Trò chơi trắc nghiệm đối kháng kéo co đầy kịch tính dành cho hai đội chơi trên lớp học Tiếng Anh.',
      img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop',
      type: 'tug_of_war'
    },
    {
      id: 'g3',
      title: 'Vẹo Cổ – Nghiêng Đầu Trả Lời',
      tag: 'INTERACTIVE GAME',
      plays: '35 lượt',
      badge: 'MIỄN PHÍ',
      description: 'Trò chơi trắc nghiệm camera độc đáo. Nghiêng đầu trái/phải để lựa chọn đáp án đúng.',
      img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop',
      type: 'head_tilt'
    }
  ]);

  // TAB 4: KHO CÂU HỎI CÁ NHÂN
  const personalQuestions = [
    { id: 1, title: 'Ngân hàng 150 câu hỏi Từ vựng Unit 1 - Unit 6 (Khối 8)', count: '150 câu', grade: 'Lớp 8' },
    { id: 2, title: 'Bộ câu hỏi Ngữ pháp Verbs of Liking + V-ing', count: '45 câu', grade: 'Lớp 7' },
    { id: 3, title: 'Đề thi trắc nghiệm giữa kỳ I Global Success Khối 9', count: '80 câu', grade: 'Lớp 9' }
  ];

  // TAB 5: DANH SÁCH LỚP HỌC
  const classRosters = [
    { id: 1, name: 'Lớp 8A5 - Tiếng Anh THCS', count: '38 học sinh', teacher: 'Thầy Nguyễn Văn Hải' },
    { id: 2, name: 'Lớp 7A2 - Tiếng Anh THCS', count: '40 học sinh', teacher: 'Thầy Nguyễn Văn Hải' },
    { id: 3, name: 'Lớp 9A1 - Ôn thi Vào 10', count: '35 học sinh', teacher: 'Thầy Nguyễn Văn Hải' }
  ];

  // TAB 6: THƯ VIỆN CÂU HỎI CỘNG ĐỒNG
  const communityQuestionSets = [
    {
      id: 'c1',
      grade: 6,
      gradeLabel: 'Lớp 6',
      uses: 56,
      title: 'Bộ câu hỏi kiểm tra từ vựng Tiếng Anh 6 - Global Success',
      author: 'Thầy Nguyễn Văn Hải',
      questionsCount: 25,
      date: '12/6/2026'
    }
  ];

  // Submit External Game
  const handleAddExternalGame = (e) => {
    e.preventDefault();
    if (!newGameTitle.trim()) return;

    soundFX.playClick();
    const newG = {
      id: `ext_${Date.now()}`,
      title: newGameTitle,
      platform: newGamePlatform,
      embedUrl: newGameEmbedUrl || 'https://wordwall.net/embed/4c06cf84620f4c399580b06497f1f92e',
      attemptsLeft: 3,
      highScore: 0,
      likes: 0
    };

    setExternalGames([newG, ...externalGames]);
    setNewGameTitle(''); setNewGameEmbedUrl('');
    setShowAddGameModal(false);
    try { soundFX.playFanfare(); } catch (err) {}
  };

  return (
    <div className="space-y-8 font-sans animate-fadeIn">
      
      {/* 1. HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
        <div className="h-64 sm:h-72 w-full relative">
          <img 
            src="/images/hero_school_bg.jpg" 
            alt="Sân Trường Tương Tác" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px]" />
          
          <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3 drop-shadow-md">
              Thư Mục Học Liệu & Tiện Ích Dạy Học 🎮⚡
            </h1>
            <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed drop-shadow">
              Bộ sưu tập các trò chơi giáo dục, Gamification HTML5, Kho câu hỏi cá nhân và danh sách lớp học.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-200 font-bold text-xs shadow">
                👤 Chào Thầy/Cô: <strong className="text-amber-400">onlineteaching.vh (Thành viên VIP)</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 6 MAIN TABS DIRECTLY BELOW HERO BANNER (TAB 3: GAMIFICATION HTML5 - DIRECTIVE) */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-slate-800 pb-4">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                try { soundFX.playClick(); } catch (e) {}
                setActiveTab(t.id);
              }}
              className={`px-4 sm:px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-lg shadow-orange-500/30 scale-105'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: GAME VUI HỌC */}
      {activeTab === 'games' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl">
            {gameSubTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeGameSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    try { soundFX.playClick(); } catch (e) {}
                    setActiveGameSubTab(tab.id);
                  }}
                  className={`p-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg border border-brand-500/50'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeGameSubTab === 'flashcard' && <FlashcardGame />}
          {activeGameSubTab === 'matching' && <MatchingPairsGame />}
          {activeGameSubTab === 'racing' && <WordScrambleGame />}
          {activeGameSubTab === 'iframe' && <IFrameGameViewer />}
        </div>
      )}

      {/* TAB 2: GAME TƯƠNG TÁC */}
      {activeTab === 'interactive' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {interactiveGames.map((game) => (
              <div key={game.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between hover:border-amber-500/50 transition-all">
                <div className="space-y-3">
                  <div className="h-40 rounded-2xl bg-slate-950 overflow-hidden relative border border-slate-800">
                    <img src={game.img} alt={game.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px]">
                      {game.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white">{game.title}</h3>
                  <p className="text-xs text-slate-400">{game.description}</p>
                </div>

                <button
                  onClick={() => {
                    soundFX.playClick();
                    setActivePlayGame(game);
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" /> Mở Game Tương Tác
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GAMIFICATION HTML5 ⚡ (RESTORED AS TAB #3 EXACTLY AS THẦY REQUESTED!) */}
      {activeTab === 'gamification' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* XP SHOP ACTION BAR */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-xl flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <span className="text-white font-black text-xs uppercase tracking-wider">CỬA HÀNG XP SHOP & BẢNG XẾP HẠNG THI ĐUA 4.0</span>
                <p className="text-[11px] text-slate-400 font-normal">Tích lũy XP đổi Khung Avatar VIP, Daily Streak và Thách đấu PVP 1v1.</p>
              </div>
            </div>

            <button
              onClick={() => {
                soundFX.playClick();
                setShowXpShopModal(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-xl flex items-center gap-2 animate-bounce"
            >
              <ShoppingBag className="w-4 h-4" /> 👑 Mở Cửa Hàng XP Shop & Cấp Độ
            </button>
          </div>

          {/* SUB-TABS INSIDE GAMIFICATION HTML5 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 rounded-3xl bg-slate-950 border border-slate-800 text-xs font-black">
            <button
              onClick={() => setActiveGamificationSubTab('embedded')}
              className={`p-3 rounded-2xl transition-all flex items-center justify-center gap-2 ${
                activeGamificationSubTab === 'embedded' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Share2 className="w-4 h-4 text-purple-400" /> 1. GAME IFRAME (WORDWALL, QUIZIZZ, HTML5 ZIP)
            </button>

            <button
              onClick={() => setActiveGamificationSubTab('pvp')}
              className={`p-3 rounded-2xl transition-all flex items-center justify-center gap-2 ${
                activeGamificationSubTab === 'pvp' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Swords className="w-4 h-4 text-amber-400" /> 2. THÁCH ĐẤU PVP 1V1 TRANH CƯỢC XP
            </button>
          </div>

          {/* SUB-TAB 1: EMBEDDED */}
          {activeGamificationSubTab === 'embedded' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between flex-wrap gap-4 shadow-xl">
                <div>
                  <h3 className="text-base font-black text-white">NHỦNG GAME IFRAME & HTML5 ZIP</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">Chạy game trong môi trường Sandbox an toàn, tự động lưu điểm số về Database.</p>
                </div>

                <button
                  onClick={() => setShowAddGameModal(true)}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> + Upload Game HTML5 ZIP / Nhúng URL
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {externalGames.map((game) => (
                  <div key={game.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-black">
                        {game.platform}
                      </span>
                      <h4 className="text-base font-black text-white leading-snug">{game.title}</h4>
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-400 pt-2">
                        <span>Lượt chơi còn lại: <strong className="text-amber-400">{game.attemptsLeft} lượt</strong></span>
                        <span>Kỷ lục: <strong className="text-emerald-400">{game.highScore}đ</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
                      <button
                        onClick={() => {
                          soundFX.playClick();
                          setIsPracticeMode(false);
                          setActivePlayGame(game);
                        }}
                        className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-4 h-4" /> Chơi Tính Điểm
                      </button>

                      <button
                        onClick={() => {
                          soundFX.playClick();
                          setIsPracticeMode(true);
                          setActivePlayGame(game);
                        }}
                        className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                      >
                        Replay Luyện Tập
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 2: PVP */}
          {activeGamificationSubTab === 'pvp' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl max-w-3xl mx-auto text-xs font-bold">
              <div className="text-center space-y-2 border-b border-slate-800 pb-4">
                <h3 className="text-lg font-black text-amber-400 flex items-center justify-center gap-2">
                  <Swords className="w-6 h-6" /> ĐẤU TRƯỜNG THÁCH ĐẤU PVP 1V1 TRANH CƯỢC XP
                </h3>
                <p className="text-slate-400 font-normal">Thách đấu 1v1 với bạn học trong lớp để tranh cược điểm kinh nghiệm XP!</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1">CHỌN ĐỐI THỦ TRONG LỚP:</label>
                  <select
                    value={pvpOpponent}
                    onChange={(e) => setPvpOpponent(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="Trần Thuỳ Dương">Trần Thuỳ Dương (Lớp 8A5)</option>
                    <option value="Vũ Mai Phương">Vũ Mai Phương (Lớp 7A2)</option>
                    <option value="Bùi Hoàng Hải">Bùi Hoàng Hải (Lớp 9A1)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">MỨC CƯỢC ĐIỂM XP THÁCH ĐẤU:</label>
                  <select
                    value={pvpWagerXp}
                    onChange={(e) => setPvpWagerXp(Number(e.target.value))}
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value={50}>50 XP</option>
                    <option value={100}>100 XP</option>
                    <option value={200}>200 XP</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFX.playClick();
                  try { soundFX.playFanfare(); } catch (err) {}
                  confetti({ particleCount: 150, spread: 90 });
                  alert(`⚔️ ĐÃ GỬI LỜI THÁCH ĐẤU 1V1 TỚI HỌC SINH ${pvpOpponent} VỚI MỨC CƯỢC ${pvpWagerXp} XP!`);
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2"
              >
                <Swords className="w-5 h-5" /> GỬI LỜI THÁCH ĐẤU PVP 1V1 NGAY
              </button>
            </div>
          )}

          {/* GAME LEADERBOARD TOP 5 */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" /> BẢNG XẾP HẠNG THI ĐUA TOP HỌC SINH ĐIỂM GAME CAO NHẤT
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Hạng</th>
                    <th className="p-3">Họ và Tên Học sinh</th>
                    <th className="p-3">Điểm Số Game</th>
                    <th className="p-3">Thời gian hoàn thành</th>
                    <th className="p-3">Danh hiệu Huy hiệu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {leaderboardList.map((lb) => (
                    <tr key={lb.rank} className="hover:bg-slate-950/50">
                      <td className="p-3 font-black text-amber-400">#{lb.rank}</td>
                      <td className="p-3 font-black text-white">{lb.name}</td>
                      <td className="p-3 text-emerald-400">{lb.score} điểm</td>
                      <td className="p-3 text-indigo-300 font-mono">{lb.time}</td>
                      <td className="p-3 text-purple-300">{lb.badge}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: KHO CÂU HỎI CÁ NHÂN */}
      {activeTab === 'questions' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-base font-black text-white">KHO CÂU HỎI CÁ NHÂN CỦA GIÁO VIÊN</h3>
            <p className="text-xs text-slate-400">Quản lý các bộ câu hỏi trắc nghiệm riêng tư dùng để nạp vào Game Kéo co & Nghiêng đầu.</p>
          </div>
        </div>
      )}

      {/* TAB 5: DANH SÁCH LỚP HỌC */}
      {activeTab === 'classes' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-base font-black text-white">DANH SÁCH LỚP HỌC & ĐIỂM DANH</h3>
            <p className="text-xs text-slate-400">Danh sách các lớp học THCS đang giảng dạy và theo dõi chuyên cần.</p>
          </div>
        </div>
      )}

      {/* TAB 6: THƯ VIỆN CỘNG ĐỒNG */}
      {activeTab === 'community' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-base font-black text-white">THƯ VIỆN CÂU HỎI CỘNG ĐỒNG (KHỐI 6, 7, 8, 9)</h3>
            <p className="text-xs text-slate-400">Chia sẻ và tham khảo ngân hàng đề trắc nghiệm Tiếng Anh THCS từ cộng đồng giáo viên.</p>
          </div>
        </div>
      )}

      {/* MODAL CANVASES FOR TAB INTERACTIVE */}
      {activePlayGame && (
        <div className="fixed top-16 inset-x-0 bottom-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-start justify-center p-4 pt-4 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-indigo-500/60 rounded-3xl max-w-5xl w-full p-6 space-y-4 shadow-2xl animate-fadeIn max-h-[86vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <h3 className="text-base font-black text-white">{activePlayGame.title}</h3>
              <button onClick={() => setActivePlayGame(null)} className="p-2 rounded-xl bg-slate-800 text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {activePlayGame.type === 'lucky_wheel' && <LuckyWheelGameCanvas onClose={() => setActivePlayGame(null)} />}
              {activePlayGame.type === 'tug_of_war' && <TugOfWarGameCanvas onClose={() => setActivePlayGame(null)} />}
              {activePlayGame.type === 'head_tilt' && <HeadTiltGameCanvas onClose={() => setActivePlayGame(null)} />}
              {activePlayGame.embedUrl && (
                <iframe
                  src={activePlayGame.embedUrl}
                  title={activePlayGame.title}
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  className="w-full h-full min-h-[480px] border-0"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD HTML5 ZIP MODAL */}
      {showAddGameModal && (
        <div className="fixed top-20 inset-x-0 bottom-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-6 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs font-bold">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white uppercase">UPLOAD GAME HTML5 ZIP / NHÚNG IFRAME</h3>
              <button onClick={() => setShowAddGameModal(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddExternalGame} className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1">TÊN TRÒ CHƠI GIÁO DỤC *</label>
                <input
                  type="text"
                  placeholder="Nhập tên trò chơi..."
                  value={newGameTitle}
                  onChange={(e) => setNewGameTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">LINK EMBED HOẶC TẢI TỆP .ZIP *</label>
                <input
                  type="url"
                  placeholder="https://wordwall.net/embed/..."
                  value={newGameEmbedUrl}
                  onChange={(e) => setNewGameEmbedUrl(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddGameModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-black">
                  + Nạp Game Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* XP SHOP MODAL */}
      <XpShopModal isOpen={showXpShopModal} onClose={() => setShowXpShopModal(false)} />

    </div>
  );
};
