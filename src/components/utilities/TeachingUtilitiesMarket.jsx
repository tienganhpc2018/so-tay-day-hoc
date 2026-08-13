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
  Swords
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

import { FlashcardGame } from '../games/FlashcardGame';
import { MatchingPairsGame } from '../games/MatchingPairsGame';
import { WordScrambleGame } from '../games/WordScrambleGame';
import { IFrameGameViewer } from '../games/iFrameGameViewer';
import { TugOfWarGameCanvas } from '../games/TugOfWarGameCanvas';

export const TeachingUtilitiesMarket = () => {
  const [activeTab, setActiveTab] = useState('games');
  const [activeGameSubTab, setActiveGameSubTab] = useState('flashcard');

  const [selectedGrade, setSelectedGrade] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('most_used');

  // Preview Modal for "Xem thử"
  const [previewItem, setPreviewItem] = useState(null);

  // Play Game State / Canvas Modal
  const [activePlayGame, setActivePlayGame] = useState(null);

  // 5 MAIN TABS UNDER HERO BANNER
  const tabs = [
    { id: 'games', label: 'Game vui học', icon: Gamepad2 },
    { id: 'interactive', label: 'Game tương tác', icon: Swords },
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
      gameUrl: 'https://wordwall.net/embed/4f6d4d12c85b46e382d622a5ec2b5585?themeId=1&templateId=5&fontStackId=0'
    },
    {
      id: 'g2',
      title: 'Kéo Co Tri Thức (Kiến Thức)',
      tag: 'INTERACTIVE GAME',
      plays: '180 lượt',
      badge: 'MIỄN PHÍ',
      description: 'Trò chơi trắc nghiệm đối kháng kéo co đầy kịch tính dành cho hai đội chơi trên lớp học Tiếng Anh.',
      img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop',
      gameUrl: 'https://wordwall.net/embed/4f6d4d12c85b46e382d622a5ec2b5585?themeId=1&templateId=5&fontStackId=0'
    },
    {
      id: 'g3',
      title: 'Vẹo Cổ – Nghiêng Đầu Trả Lời',
      tag: 'INTERACTIVE GAME',
      plays: '35 lượt',
      badge: 'MIỄN PHÍ',
      description: 'Trò chơi trắc nghiệm camera độc đáo. Nghiêng đầu trái/phải để lựa chọn đáp án đúng.',
      img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop',
      gameUrl: 'https://wordwall.net/embed/4f6d4d12c85b46e382d622a5ec2b5585?themeId=1&templateId=5&fontStackId=0'
    },
    {
      id: 'g4',
      title: 'Chém Hoa Quả AI',
      tag: 'INTERACTIVE GAME',
      plays: '28 lượt',
      badge: 'MIỄN PHÍ',
      description: 'Sử dụng camera và cử chỉ tay (Hand Tracking) để chém các quả chứa đáp án Tiếng Anh đúng.',
      img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      gameUrl: 'https://wordwall.net/embed/4f6d4d12c85b46e382d622a5ec2b5585?themeId=1&templateId=5&fontStackId=0'
    }
  ]);

  // TAB 3: KHO CÂU HỎI CÁ NHÂN
  const personalQuestions = [
    { id: 1, title: 'Ngân hàng 150 câu hỏi Từ vựng Unit 1 - Unit 6 (Khối 8)', count: '150 câu', grade: 'Lớp 8' },
    { id: 2, title: 'Bộ câu hỏi Ngữ pháp Verbs of Liking + V-ing', count: '45 câu', grade: 'Lớp 7' },
    { id: 3, title: 'Đề thi trắc nghiệm giữa kỳ I Global Success Khối 9', count: '80 câu', grade: 'Lớp 9' }
  ];

  // TAB 4: DANH SÁCH LỚP HỌC
  const classRosters = [
    { id: 1, name: 'Lớp 8A5 - Tiếng Anh THCS', count: '38 học sinh', teacher: 'Thầy Nguyễn Văn Hải' },
    { id: 2, name: 'Lớp 7A2 - Tiếng Anh THCS', count: '40 học sinh', teacher: 'Thầy Nguyễn Văn Hải' },
    { id: 3, name: 'Lớp 9A1 - Ôn thi Vào 10', count: '35 học sinh', teacher: 'Thầy Nguyễn Văn Hải' }
  ];

  // TAB 5: THƯ VIỆN CÂU HỎI CỘNG ĐỒNG (CHỈ 4 LỚP: 6, 7, 8, 9)
  const communityQuestionSets = [
    {
      id: 'c1',
      grade: 6,
      gradeLabel: 'Lớp 6',
      uses: 56,
      title: 'Khoa học tự nhiên - Bộ câu hỏi trắc nghiệm Lớp 6',
      author: 'Ban Quản Trị Sân Trường',
      questionsCount: 10,
      date: '16/6/2026',
      sampleQuestions: [
        'Q1: What is the main theme of Unit 1 My New School?',
        'Q2: Choose the correct pronunciation of /s/ and /z/.'
      ]
    },
    {
      id: 'c2',
      grade: 6,
      gradeLabel: 'Lớp 6',
      uses: 46,
      title: 'Lịch sử - Lớp 6: Ma trận kiến thức trọng tâm',
      author: 'Ban Quản Trị Sân Trường',
      questionsCount: 10,
      date: '16/6/2026',
      sampleQuestions: [
        'Q1: Tìm từ khác loại trong nhóm các môn học.',
        'Q2: Hoàn thành câu với Thì Hiện tại đơn.'
      ]
    },
    {
      id: 'c3',
      grade: 6,
      gradeLabel: 'Lớp 6',
      uses: 45,
      title: 'Địa lý - Hệ Mặt Trời của chúng ta',
      author: 'Ban Quản Trị Sân Trường',
      questionsCount: 10,
      date: '16/6/2026',
      sampleQuestions: [
        'Q1: Mẹo nhớ các hành tinh trong Hệ Mặt Trời.',
        'Q2: Đọc đoạn văn và chọn đáp án Đúng/Sai.'
      ]
    },
    {
      id: 'c4',
      grade: 7,
      gradeLabel: 'Lớp 7',
      uses: 89,
      title: 'Trọn bộ 100 câu hỏi Từ vựng & Ngữ pháp Tiếng Anh 7',
      author: 'Thầy Nguyễn Văn Hải',
      questionsCount: 20,
      date: '15/6/2026',
      sampleQuestions: [
        'Q1: Community Service activities for grade 7 students.',
        'Q2: Healthy Living & Nutrition choice.'
      ]
    },
    {
      id: 'c5',
      grade: 8,
      gradeLabel: 'Lớp 8',
      uses: 124,
      title: 'Đề kiểm tra trắc nghiệm Unit 1 & Unit 2 Global Success 8',
      author: 'Thầy Nguyễn Văn Hải',
      questionsCount: 25,
      date: '14/6/2026',
      sampleQuestions: [
        'Q1: Verbs of liking followed by V-ing or To-infinitive.',
        'Q2: Comparative adverbs in Unit 2 Life in countryside.'
      ]
    },
    {
      id: 'c6',
      grade: 9,
      gradeLabel: 'Lớp 9',
      uses: 180,
      title: 'Bộ đề trắc nghiệm luyện thi Vào 10 môn Tiếng Anh',
      author: 'Thầy Nguyễn Văn Hải',
      questionsCount: 40,
      date: '12/6/2026',
      sampleQuestions: [
        'Q1: Phrasal verbs and Complex sentences in Grade 9.',
        'Q2: Error identification in grammar sentence structures.'
      ]
    }
  ];

  // Filter Community Sets by Grade (6, 7, 8, 9 only)
  const filteredCommunitySets = communityQuestionSets.filter((item) => {
    if (selectedGrade !== 'all' && Number(selectedGrade) !== item.grade) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.author.toLowerCase().includes(q);
    }
    return true;
  });

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
              Sân Trường Tương Tác 🎮
            </h1>
            <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed drop-shadow">
              Bộ sưu tập các trò chơi giáo dục công nghệ cao giúp giờ học sinh động và thú vị hơn. Giáo viên có thể quản lý câu hỏi riêng tư và đồng bộ trực tiếp vào game!
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-200 font-bold text-xs shadow">
                👤 Chào Thầy/Cô: <strong className="text-amber-400">onlineteaching.vh (Thành viên VIP)</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 5 MAIN TABS DIRECTLY BELOW HERO BANNER */}
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

      {/* TAB 1: GAME VUI HỌC (4 CHẾ ĐỘ GAME INTERACTIVE PLAYABLE) */}
      {activeTab === 'games' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* 4 SUB-TABS CHO 4 GAMES TƯƠNG TÁC */}
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
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg scale-102 border border-brand-500/50'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* ACTIVE PLAYABLE GAME CONTAINER */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
            {activeGameSubTab === 'flashcard' && <FlashcardGame />}
            {activeGameSubTab === 'matching' && <MatchingPairsGame />}
            {activeGameSubTab === 'racing' && <WordScrambleGame />}
            {activeGameSubTab === 'iframe' && <IFrameGameViewer />}
          </div>

        </div>
      )}

      {/* TAB 2: GAME TƯƠNG TÁC (CHỨA 4 GAME CARD VÒNG QUAY, KÉO CO, VẸO CỔ, CHÉM HOA QUẢ AI) */}
      {activeTab === 'interactive' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              🎁 Game tương tác đối kháng <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">4 trò chơi</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {interactiveGames.map((g) => (
              <div key={g.id} className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl hover:border-amber-400/50 transition-all flex flex-col justify-between group">
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    <img src={g.img} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase shadow">
                      {g.badge}
                    </span>
                    <button 
                      onClick={() => setActivePlayGame(g)}
                      className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-slate-900/90 text-amber-300 hover:bg-slate-800 font-extrabold text-xs shadow border border-amber-400/40"
                    >
                      ✏️ Sửa
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-slate-400 uppercase tracking-wider">{g.tag}</span>
                      <span className="font-bold text-amber-400">🔥 {g.plays}</span>
                    </div>
                    <h4 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors line-clamp-1">{g.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{g.description}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center gap-2">
                  <button 
                    onClick={() => {
                      try { soundFX.playClick(); } catch (e) {}
                      setActivePlayGame(g);
                    }}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-1.5 hover:brightness-110"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Chơi ngay
                  </button>
                  <button 
                    onClick={() => alert('Đã sao chép liên kết trò chơi!')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: KHO CÂU HỎI CÁ NHÂN */}
      {activeTab === 'questions' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white">📖 Ngân hàng câu hỏi cá nhân của Thầy</h3>
            <button onClick={() => alert('Tạo bộ câu hỏi mới!')} className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow">
              <Plus className="w-4 h-4" /> Tạo câu hỏi mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {personalQuestions.map((q) => (
              <div key={q.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-amber-400/50 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-extrabold text-white">{q.title}</h4>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>Số lượng: {q.count}</span>
                  <span className="px-2.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">{q.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DANH SÁCH LỚP HỌC */}
      {activeTab === 'classes' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white">👥 Quản lý danh sách lớp học THCS</h3>
            <button onClick={() => alert('Thêm lớp học mới!')} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-1.5 shadow">
              <Plus className="w-4 h-4" /> Thêm lớp mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classRosters.map((c) => (
              <div key={c.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-indigo-500/50 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-white">{c.name}</h4>
                <p className="text-xs text-slate-400">Giảng dạy: {c.teacher}</p>
                <div className="flex items-center justify-between text-xs text-indigo-300 pt-2 border-t border-slate-800 font-bold">
                  <span>Sĩ số: {c.count}</span>
                  <span className="hover:underline cursor-pointer">Xem danh sách →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: THƯ VIỆN CÂU HỎI CỘNG ĐỒNG (CHỈ CÓ 4 LỚP: 6, 7, 8, 9) */}
      {activeTab === 'community' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* HEADER & SUBTITLE */}
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              🌐 Thư viện câu hỏi cộng đồng
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Các bộ câu hỏi trắc nghiệm chất lượng do giáo viên chia sẻ. Thầy/Cô có thể lấy về máy để dùng ngay ạ!
            </p>
          </div>

          {/* SEARCH BAR & SORT */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="flex-1 flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo môn hoặc giáo viên..."
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-slate-950 text-slate-300 text-xs font-extrabold px-4 py-2.5 rounded-2xl border border-slate-800 focus:outline-none"
              >
                <option value="most_used">🔥 Sử dụng nhiều nhất</option>
                <option value="latest">🆕 Mới nhất</option>
              </select>

              <button 
                onClick={() => {}}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-orange-500/20"
              >
                Tìm kiếm
              </button>
            </div>
          </div>

          {/* GRADE FILTER TABS (CHỈ CÓ 4 LỚP: 6, 7, 8, 9) */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => setSelectedGrade('all')}
              className={`px-4 py-2 rounded-2xl font-black text-xs transition-all ${
                selectedGrade === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🌐 Tất cả khối lớp
            </button>

            {[6, 7, 8, 9].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g.toString())}
                className={`px-4 py-2 rounded-2xl font-black text-xs transition-all ${
                  selectedGrade.toString() === g.toString()
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                🎒 Lớp {g}
              </button>
            ))}
          </div>

          {/* CARDS GRID WITH 2 BUTTONS: XEM THỬ & SỬ DỤNG */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {filteredCommunitySets.map((item) => (
              <div key={item.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-orange-500/50 transition-all flex flex-col justify-between group shadow-xl">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[11px] border border-amber-500/40">
                      {item.gradeLabel}
                    </span>
                    <span className="text-slate-400 font-extrabold flex items-center gap-1">
                      📊 Lượt dùng: <strong className="text-amber-400">{item.uses}</strong>
                    </span>
                  </div>

                  <h4 className="text-base font-black text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h4>

                  <div className="space-y-1 text-xs text-slate-400 font-medium">
                    <p>Người chia sẻ: <strong className="text-slate-200">{item.author}</strong></p>
                    <p>Số câu hỏi: <strong className="text-slate-200">{item.questionsCount} câu</strong></p>
                    <p>Đăng ngày: <span className="text-slate-500">{item.date}</span></p>
                  </div>
                </div>

                {/* 2 BUTTONS: XEM THỬ & SỬ DỤNG */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="py-2.5 px-3 rounded-2xl bg-amber-100 text-slate-950 hover:bg-amber-200 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" /> Xem thử
                  </button>

                  <button
                    onClick={() => {
                      try { soundFX.playFanfare(); } catch (e) {}
                      confetti({ particleCount: 100, spread: 70 });
                      alert(`Đã lấy bộ câu hỏi "${item.title}" về tài khoản cá nhân của Thầy!`);
                    }}
                    className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs hover:brightness-110 flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Sử dụng
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* PREVIEW MODAL FOR "XEM THỬ" */}
      {previewItem && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 animate-fadeIn shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                👁️ Xem Thử: {previewItem.title}
              </h3>
              <button onClick={() => setPreviewItem(null)} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>👤 Người chia sẻ: <strong className="text-white">{previewItem.author}</strong></p>
              <p>📊 Số lượng: <strong className="text-amber-300">{previewItem.questionsCount} câu hỏi</strong></p>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400">Xem mẫu câu hỏi:</span>
                {previewItem.sampleQuestions?.map((sq, idx) => (
                  <p key={idx} className="text-slate-400 italic">• {sq}</p>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => setPreviewItem(null)}
                className="flex-1 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Đóng
              </button>
              <button 
                onClick={() => {
                  setPreviewItem(null);
                  try { soundFX.playFanfare(); } catch (e) {}
                  confetti({ particleCount: 100, spread: 70 });
                  alert(`Đã tải bộ câu hỏi "${previewItem.title}" về kho cá nhân!`);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs shadow"
              >
                📥 Sử dụng ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TUG OF WAR / GAME CANVAS MODAL MATCHING SCREENSHOT 3 */}
      {activePlayGame && (
        <TugOfWarGameCanvas onClose={() => setActivePlayGame(null)} />
      )}

    </div>
  );
};
