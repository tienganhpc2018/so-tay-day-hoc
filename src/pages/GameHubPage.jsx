import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Gamepad2, 
  Upload, 
  Crown, 
  Flame, 
  Star, 
  User, 
  MessageCircle, 
  Eye, 
  Plus, 
  CheckCircle2, 
  X, 
  Sparkles,
  Share2,
  Calendar,
  Play,
  RotateCcw,
  Trophy,
  ShieldCheck,
  Heart,
  FileArchive,
  Maximize2,
  Award,
  Swords,
  Timer,
  Check,
  Zap,
  ShoppingBag,
  BookOpen,
  PenTool,
  Image as ImageIcon
} from 'lucide-react';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { XpShopModal } from '../components/gamification/XpShopModal';

export const GameHubPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = searchParams.get('tab') || 'class_stories';

  // 5 MAIN TABS FOR SÂN TRƯỜNG TƯƠNG TÁC & GAMIFICATION HTML5:
  // Tab 1: 'class_stories' (📖 Chuyện của lớp)
  // Tab 2: 'memoirs' (✍️ Lưu bút)
  // Tab 3: 'youth' (🌸 Tuổi học trò)
  // Tab 4: 'photos' (🖼️ Ảnh hoạt động)
  // Tab 5: 'gamification' (🎮 Gamification HTML5)
  const [activeTab, setActiveTab] = useState(activeTabParam);

  useEffect(() => {
    if (activeTabParam) {
      setActiveTab(activeTabParam);
    }
  }, [activeTabParam]);

  // Sub-Tab inside Tab 5 'gamification': 'mini_games' | 'embedded' | 'pvp'
  const [activeGameSubTab, setActiveGameSubTab] = useState('mini_games');

  // ARTICLES / MEMORIES LIST FOR TABS 1-4
  const [memoriesList, setMemoriesList] = useState([
    {
      id: 1,
      category: 'class_stories',
      categoryLabel: 'CHUYỆN CỦA LỚP',
      title: 'Kỷ niệm buổi tổng kết năm học sôi nổi của tập thể Lớp 8A5',
      summary: 'Những nụ cười, giọt nước mắt chia tay năm học cũ và niềm tự hào của cả tập thể lớp cùng thầy cô chủ nhiệm.',
      content: 'Một năm học nữa lại trôi qua với biết bao kỷ niệm vui buồn của tập thể 8A5. Những giờ học Tiếng Anh sôi nổi, những chuyến picnic dã ngoại và buổi tiệc chia tay thật nhiều cảm xúc...',
      author: 'Thầy Nguyễn Văn Hải',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
      date: '12/05/2026',
      likes: 48
    },
    {
      id: 2,
      category: 'memoirs',
      categoryLabel: 'LƯU BÚT',
      title: 'Lưu bút chia tay ra trường thân thương của các bạn học sinh Khối 9',
      summary: 'Trang lưu bút viết vội trước ngày thi vào 10, gửi gắm tình cảm thân thương gửi tới thầy cô và bạn bè.',
      content: 'Mai này rời xa mái trường THCS thân yêu, chúng em sẽ nhớ lắm những bài giảng Tiếng Anh hăng say của thầy Hải, nhớ khoảng sân trường rợp bóng cây...',
      author: 'Cô Phí Thảo',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
      date: '10/05/2026',
      likes: 35
    },
    {
      id: 3,
      category: 'photos',
      categoryLabel: 'ẢNH HOẠT ĐỘNG',
      title: 'Album hình ảnh hoạt động ngoại khóa & dự án Tiếng Anh THCS',
      summary: 'Thư viện hình ảnh sắc nét lưu giữ những khoảnh khắc đẹp trong các giờ học dự án STEM Tiếng Anh.',
      content: 'Hình ảnh ghi lại các hoạt động nhóm, làm mô hình kiềng 3 chân và trình bày bài nói Speaking sôi nổi của học sinh...',
      author: 'Ban Văn Thể Lớp',
      authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
      date: '08/05/2026',
      likes: 62
    }
  ]);

  const [activeReaderMemory, setActiveReaderMemory] = useState(null);
  const [showCreateMemoryModal, setShowCreateMemoryModal] = useState(false);
  const [newMemTitle, setNewMemTitle] = useState('');
  const [newMemCategory, setNewMemCategory] = useState('class_stories');
  const [newMemContent, setNewMemContent] = useState('');

  // GAMIFICATION & GAME STATE (TAB 5)
  // Mini-Game 1: Flip Cards
  const [flipCards, setFlipCards] = useState([
    { id: 1, word: 'Hospitable', mean: 'Hiếu khách', flipped: false, matched: false },
    { id: 2, word: 'Leisure time', mean: 'Thời gian rảnh', flipped: false, matched: false },
    { id: 3, word: 'Craft', mean: 'Đồ thủ công', flipped: false, matched: false },
    { id: 4, word: 'Countryside', mean: 'Nông thôn', flipped: false, matched: false }
  ]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [flipScore, setFlipScore] = useState(0);
  const [gameTimerSeconds, setGameTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Mini-Game 2: Lucky Wheel
  const [wheelAngle, setWheelAngle] = useState(0);
  const [wheelResult, setWheelResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // External Games (Wordwall, Quizizz, Kahoot)
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

  const [activePlayGame, setActivePlayGame] = useState(null);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [showXpShopModal, setShowXpShopModal] = useState(false);
  const [showAddGameModal, setShowAddGameModal] = useState(false);

  const [newGameTitle, setNewGameTitle] = useState('');
  const [newGamePlatform, setNewGamePlatform] = useState('Wordwall Embed');
  const [newGameEmbedUrl, setNewGameEmbedUrl] = useState('');

  // PVP State
  const [pvpOpponent, setPvpOpponent] = useState('Trần Thuỳ Dương');
  const [pvpWagerXp, setPvpWagerXp] = useState(100);

  // Leaderboard
  const leaderboardList = [
    { rank: 1, name: 'Phạm Thanh Tú', score: 1000, time: '35 giây', xp: 2450, badge: '🥇 Top 1 Champion' },
    { rank: 2, name: 'Trần Thuỳ Dương', score: 980, time: '42 giây', xp: 2100, badge: '🥈 Thần Đồng Từ Vựng' },
    { rank: 3, name: 'Vũ Mai Phương', score: 950, time: '48 giây', xp: 1850, badge: '🥉 Chuyên Gia Trắc Nghiệm' }
  ];

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setGameTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Flip Card Logic
  const handleCardClick = (card) => {
    if (card.matched || card.flipped || isSpinning) return;
    soundFX.playClick();
    if (!isTimerRunning) setIsTimerRunning(true);

    const updated = flipCards.map(c => c.id === card.id ? { ...c, flipped: true } : c);
    setFlipCards(updated);

    if (!selectedCard) {
      setSelectedCard(card);
    } else {
      if (
        (selectedCard.word === 'Hospitable' && card.mean === 'Hiếu khách') ||
        (selectedCard.word === 'Leisure time' && card.mean === 'Thời gian rảnh') ||
        (selectedCard.word === 'Craft' && card.mean === 'Đồ thủ công') ||
        (selectedCard.word === 'Countryside' && card.mean === 'Nông thôn')
      ) {
        soundFX.playFanfare();
        setFlipScore(prev => prev + 250);
        setFlipCards(updated.map(c => (c.id === card.id || c.id === selectedCard.id) ? { ...c, matched: true } : c));
        setSelectedCard(null);

        if (updated.filter(c => c.matched).length + 2 === flipCards.length) {
          setIsTimerRunning(false);
          confetti({ particleCount: 150, spread: 90 });
          alert(`🎉 XUẤT SẮC! BẠN ĐÃ HOÀN THÀNH GAME VỚI ${flipScore + 250} ĐIỂM TRONG ${gameTimerSeconds} GIÂY!`);
        }
      } else {
        setTimeout(() => {
          setFlipCards(updated.map(c => (c.id === card.id || c.id === selectedCard.id) ? { ...c, flipped: false } : c));
          setSelectedCard(null);
        }, 800);
      }
    }
  };

  // Spin Wheel Logic
  const handleSpinWheel = () => {
    if (isSpinning) return;
    soundFX.playClick();
    setIsSpinning(true);
    setWheelResult(null);

    const randomDegrees = 1440 + Math.floor(Math.random() * 360);
    setWheelAngle(wheelAngle + randomDegrees);

    setTimeout(() => {
      setIsSpinning(false);
      const prizes = ['+200 XP', '+500 XP Bonus', 'Thẻ Khung Rồng Vàng', '+100 Điểm Thưởng'];
      const prize = prizes[Math.floor(Math.random() * prizes.length)];
      setWheelResult(prize);
      try { soundFX.playFanfare(); } catch (err) {}
      confetti({ particleCount: 120, spread: 80 });
    }, 3000);
  };

  // Create New Memory Article (Tabs 1-4)
  const handleCreateMemory = (e) => {
    e.preventDefault();
    if (!newMemTitle.trim()) return;

    soundFX.playClick();
    const newMem = {
      id: Date.now(),
      category: newMemCategory,
      categoryLabel: newMemCategory.toUpperCase(),
      title: newMemTitle,
      summary: newMemContent.slice(0, 100) + '...',
      content: newMemContent,
      author: 'Thầy Nguyễn Văn Hải',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
      date: 'Hôm nay',
      likes: 0
    };

    setMemoriesList([newMem, ...memoriesList]);
    setNewMemTitle(''); setNewMemContent('');
    setShowCreateMemoryModal(false);
    try { soundFX.playFanfare(); } catch (err) {}
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* 1. HERO BANNER */}
      <PageHeroBanner
        title="Sân Trường Tương Tác & Gamification HTML5 🏫🎮"
        subtitle="Góc Kỷ niệm, Lưu bút tuổi học trò, Ảnh hoạt động và Kho trò chơi giáo dục Gamification HTML5 4.0."
        badge="SÂN TRƯỜNG TƯƠNG TÁC & GAMIFICATION 4.0"
        bgImage="/images/hero_game_bg.jpg"
      />

      {/* 2. 5 MAIN NAVIGATION TABS (RESTORED ALL 4 ORIGINAL SÂN TRƯỜNG TABS + TAB 5 GAMIFICATION HTML5 - DIRECTIVE) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl text-xs font-black">
        
        <button
          onClick={() => {
            soundFX.playClick();
            setActiveTab('class_stories');
            setSearchParams({ tab: 'class_stories' });
          }}
          className={`p-3 rounded-2xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'class_stories'
              ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg border border-brand-500/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <BookOpen className="w-4 h-4 text-brand-400 shrink-0" />
          <span className="truncate">📖 Chuyện của lớp</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setActiveTab('memoirs');
            setSearchParams({ tab: 'memoirs' });
          }}
          className={`p-3 rounded-2xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'memoirs'
              ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg border border-brand-500/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <PenTool className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate">✍️ Lưu bút</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setActiveTab('youth');
            setSearchParams({ tab: 'youth' });
          }}
          className={`p-3 rounded-2xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'youth'
              ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg border border-brand-500/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="truncate">🌸 Tuổi học trò</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setActiveTab('photos');
            setSearchParams({ tab: 'photos' });
          }}
          className={`p-3 rounded-2xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'photos'
              ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg border border-brand-500/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="truncate">🖼️ Ảnh hoạt động</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setActiveTab('gamification');
            setSearchParams({ tab: 'gamification' });
          }}
          className={`p-3 rounded-2xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'gamification'
              ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white shadow-lg border border-amber-400/60 animate-pulse'
              : 'text-amber-300 hover:text-white hover:bg-slate-900 border border-amber-500/30'
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-amber-300 shrink-0" />
          <span className="truncate">🎮 Gamification HTML5</span>
        </button>

      </div>

      {/* CONTENT FOR TABS 1-4: SÂN TRƯỜNG TƯƠNG TÁC ARTICLES & MEMORIES */}
      {activeTab !== 'gamification' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between flex-wrap gap-4 shadow-xl">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                DANH MỤC: {activeTab === 'class_stories' ? '📖 CHUYỆN CỦA LỚP' : activeTab === 'memoirs' ? '✍️ LƯU BÚT' : activeTab === 'youth' ? '🌸 TUỔI HỌC TRÒ' : '🖼️ ẢNH HOẠT ĐỘNG'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Những câu chuyện, lưu bút thân thương và hình ảnh kỷ niệm học trò THCS.</p>
            </div>

            <button
              onClick={() => setShowCreateMemoryModal(true)}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> + Đăng Kỷ Niệm / Lưu Bút Mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {memoriesList.filter(m => activeTab === 'photos' ? m.category === 'photos' : true).map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group">
                <div>
                  <div className="h-48 bg-slate-950 overflow-hidden relative">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-indigo-600 text-white font-black text-[10px]">
                      {item.categoryLabel}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="text-[10px] text-slate-400 font-extrabold">{item.date}</div>
                    <h3 className="text-base font-extrabold text-white group-hover:text-indigo-400 line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-3">{item.summary}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-3">
                  <span className="text-xs text-slate-300 font-semibold">{item.author}</span>
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setActiveReaderMemory(item);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Eye className="w-3.5 h-3.5" /> Đọc bài
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENT FOR TAB 5: GAMIFICATION HTML5 4.0 */}
      {activeTab === 'gamification' && (
        <div className="space-y-6">
          
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

          {/* SUB-TABS INSIDE TAB 5 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 rounded-3xl bg-slate-950 border border-slate-800 text-xs font-black">
            <button
              onClick={() => setActiveGameSubTab('mini_games')}
              className={`p-3 rounded-2xl transition-all flex items-center justify-center gap-2 ${
                activeGameSubTab === 'mini_games' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-emerald-400" /> 1. THƯ VIỆN GAME TÍCH HỢP
            </button>

            <button
              onClick={() => setActiveGameSubTab('embedded')}
              className={`p-3 rounded-2xl transition-all flex items-center justify-center gap-2 ${
                activeGameSubTab === 'embedded' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Share2 className="w-4 h-4 text-purple-400" /> 2. GAME IFRAME / HTML5 ZIP
            </button>

            <button
              onClick={() => setActiveGameSubTab('pvp')}
              className={`p-3 rounded-2xl transition-all flex items-center justify-center gap-2 ${
                activeGameSubTab === 'pvp' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Swords className="w-4 h-4 text-amber-400" /> 3. THÁCH ĐẤU PVP 1V1
            </button>
          </div>

          {/* SUB-TAB 1: MINI-GAMES */}
          {activeGameSubTab === 'mini_games' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      🎯 TRÒ CHƠI LẬT THẺ NỐI TỪ VỰNG (VOCAB FLIP GAME)
                    </h3>
                    <p className="text-xs text-slate-400 font-bold mt-0.5">Lật thẻ tiếng Anh và khớp đúng nghĩa Tiếng Việt tương ứng.</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-black">
                    <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400" /> {flipScore} Điểm
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center gap-1 font-mono">
                      <Timer className="w-4 h-4 text-indigo-400" /> {gameTimerSeconds}s
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {flipCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(card)}
                      className={`h-32 rounded-2xl border-2 transition-all duration-300 font-black text-sm p-3 flex items-center justify-center text-center shadow-lg ${
                        card.matched
                          ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 scale-95'
                          : card.flipped
                          ? 'bg-gradient-to-r from-brand-600 to-indigo-600 border-brand-400 text-white shadow-brand-500/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-brand-500/50 hover:text-white'
                      }`}
                    >
                      {card.flipped || card.matched ? card.word : '❓ Lật Thẻ'}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setFlipCards(flipCards.map(c => ({ ...c, flipped: false, matched: false })));
                      setFlipScore(0); setGameTimerSeconds(0); setIsTimerRunning(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" /> Chơi Lại Từ Đầu
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl text-center flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center justify-center gap-2">
                    🎡 VÒNG QUAY MAY MẮN NHẬN XP
                  </h3>
                  <p className="text-xs text-slate-400 font-bold mt-1">Quay vòng quay hàng ngày để cơ hội nhận điểm thưởng XP!</p>
                </div>

                <div className="my-4 flex items-center justify-center">
                  <div
                    className="w-40 h-40 rounded-full border-4 border-amber-400 bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-600 flex items-center justify-center text-white font-black shadow-2xl transition-transform duration-[3000ms] ease-out"
                    style={{ transform: `rotate(${wheelAngle}deg)` }}
                  >
                    🎁 WHEEL
                  </div>
                </div>

                {wheelResult && (
                  <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-300 font-black text-xs animate-bounce">
                    🎉 PHẦN THƯỞNG: {wheelResult}!
                  </div>
                )}

                <button
                  onClick={handleSpinWheel}
                  disabled={isSpinning}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> {isSpinning ? 'Đang Quay...' : 'QUAY NGAY HÔM NAY'}
                </button>
              </div>
            </div>
          )}

          {/* SUB-TAB 2: EMBEDDED */}
          {activeGameSubTab === 'embedded' && (
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

          {/* SUB-TAB 3: PVP */}
          {activeGameSubTab === 'pvp' && (
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

      {/* EMBEDDED GAME PLAY MODAL */}
      {activePlayGame && (
        <div className="fixed top-16 inset-x-0 bottom-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-start justify-center p-4 pt-4 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-indigo-500/60 rounded-3xl max-w-5xl w-full p-6 space-y-4 shadow-2xl animate-fadeIn max-h-[86vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <div>
                <span className="text-[10px] text-amber-400 font-black uppercase">
                  {isPracticeMode ? '🎮 CHẾ ĐỘ REPLAY LUYỆN TẬP (KHÔNG TÍNH ĐIỂM)' : '🎯 CHẾ ĐỘ THI ĐẤU TÍNH ĐIỂM TỰ ĐỘNG'}
                </span>
                <h3 className="text-base font-black text-white">{activePlayGame.title}</h3>
              </div>
              <button onClick={() => setActivePlayGame(null)} className="p-2 rounded-xl bg-slate-800 text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative min-h-[450px]">
              <iframe
                src={activePlayGame.embedUrl}
                title={activePlayGame.title}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                className="w-full h-full min-h-[480px] border-0"
              />
            </div>

            <div className="flex items-center justify-between pt-2 shrink-0 text-xs font-bold">
              <span className="text-slate-400">🛡️ Môi trường Sandbox cô lập an toàn.</span>
              <button
                onClick={() => {
                  soundFX.playClick();
                  try { soundFX.playFanfare(); } catch (err) {}
                  confetti({ particleCount: 120, spread: 80 });
                  alert('🎉 ĐÃ ĐỒNG BỘ ĐIỂM SỐ GAME VỀ DATABASE THÀNH CÔNG!');
                  setActivePlayGame(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-black shadow"
              >
                ✓ Hoàn Thành & Nạp Điểm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MEMORY MODAL FOR TABS 1-4 */}
      {showCreateMemoryModal && (
        <div className="fixed top-20 inset-x-0 bottom-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-6 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs font-bold">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white uppercase">ĐĂNG BÀI KỶ NIỆM / LƯU BÚT MỚI</h3>
              <button onClick={() => setShowCreateMemoryModal(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMemory} className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1">TIÊU ĐỀ *</label>
                <input
                  type="text"
                  placeholder="Nhập tiêu đề kỷ niệm..."
                  value={newMemTitle}
                  onChange={(e) => setNewMemTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">DANH MỤC *</label>
                <select
                  value={newMemCategory}
                  onChange={(e) => setNewMemCategory(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="class_stories">📖 Chuyện của lớp</option>
                  <option value="memoirs">✍️ Lưu bút</option>
                  <option value="youth">🌸 Tuổi học trò</option>
                  <option value="photos">🖼️ Ảnh hoạt động</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">NỘI DUNG *</label>
                <textarea
                  placeholder="Viết kỷ niệm hoặc lưu bút..."
                  value={newMemContent}
                  onChange={(e) => setNewMemContent(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white min-h-[100px]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCreateMemoryModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-black">
                  Đăng Bài Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* READER MEMORY MODAL */}
      {activeReaderMemory && (
        <div className="fixed top-20 inset-x-0 bottom-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-4 overflow-y-auto">
          <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-2xl w-full border border-slate-800 p-6 space-y-4 shadow-2xl max-h-[82vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase">
                {activeReaderMemory.categoryLabel}
              </span>
              <button onClick={() => setActiveReaderMemory(null)} className="p-1 rounded-lg bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-lg font-black text-white">{activeReaderMemory.title}</h2>
            <div className="h-56 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img src={activeReaderMemory.thumbnail} alt={activeReaderMemory.title} className="w-full h-full object-cover" />
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans">{activeReaderMemory.content}</p>
            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 font-bold">
              Tác giả: <strong className="text-white">{activeReaderMemory.author}</strong>
            </div>
          </div>
        </div>
      )}

      {/* XP SHOP MODAL */}
      <XpShopModal isOpen={showXpShopModal} onClose={() => setShowXpShopModal(false)} />

    </div>
  );
};
