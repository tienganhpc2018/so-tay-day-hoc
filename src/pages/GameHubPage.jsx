import React, { useState } from 'react';
import { 
  BookOpen, 
  PenTool, 
  Heart, 
  Image as ImageIcon, 
  Search, 
  Filter, 
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
  Calendar
} from 'lucide-react';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export const GameHubPage = () => {
  const [activeTab, setActiveTab] = useState('class_stories');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Memory Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('class_stories');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('Thầy Nguyễn Văn Hải (Giáo Viên VIP)');

  const tabs = [
    { id: 'class_stories', label: '📖 Chuyện của lớp', desc: 'Nhật ký & kỷ niệm đẹp tuổi học trò THCS' },
    { id: 'memoirs', label: '✍️ Lưu bút', desc: 'Góc lưu bút chia tay & lời chúc thầy trò' },
    { id: 'youth', label: '🌸 Tuổi học trò', desc: 'Tâm sự & bài viết tuổi hồng THCS' },
    { id: 'photos', label: '🖼️ Ảnh hoạt động', desc: 'Thư viện hình ảnh sự kiện & ngoại khóa' }
  ];

  const sampleMemories = [
    {
      id: 1,
      category: 'class_stories',
      categoryLabel: 'CHUYỆN CỦA LỚP',
      title: 'Kỷ niệm buổi tổng kết năm học sôi nổi của tập thể Lớp 8A5',
      summary: 'Những nụ cười, giọt nước mắt chia tay năm học cũ và niềm tự hào của cả tập thể lớp cùng thầy cô chủ nhiệm.',
      content: 'Một năm học nữa lại trôi qua với biết bao kỷ niệm vui buồn của tập thể 8A5. Những giờ học Tiếng Anh sôi nổi, những chuyến picnic dã ngoại và buổi tiệc chia tay thật nhiều cảm xúc...',
      author: 'Thầy Nguyễn Văn Hải',
      authorTitle: 'Giáo viên Tiếng Anh VIP',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
      date: '12/05/2026',
      rating: 5.0,
      views: 192,
      likes: 48,
      price: 'Miễn phí'
    },
    {
      id: 2,
      category: 'memoirs',
      categoryLabel: 'LƯU BÚT',
      title: 'Lưu bút chia tay ra trường thân thương của các bạn học sinh Khối 9',
      summary: 'Trang lưu bút viết vội trước ngày thi vào 10, gửi gắm tình cảm thân thương gửi tới thầy cô và bạn bè.',
      content: 'Mai này rời xa mái trường THCS thân yêu, chúng em sẽ nhớ lắm những bài giảng Tiếng Anh hăng say của thầy Hải, nhớ khoảng sân trường rợp bóng cây...',
      author: 'Cô Phí Thảo',
      authorTitle: 'Giáo viên Tiêu biểu',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
      date: '10/05/2026',
      rating: 4.9,
      views: 137,
      likes: 35,
      price: 'Miễn phí'
    },
    {
      id: 3,
      category: 'youth',
      categoryLabel: 'TUỔI HỌC TRÒ',
      title: 'Góc tuổi hồng: Những ước mơ bay cao dưới mái trường THCS',
      summary: 'Những dòng tâm sự trong sáng về tình bạn, ước mơ hoài bão của lứa tuổi học trò hồn nhiên.',
      content: 'Tuổi học trò là khoảng thời gian đẹp nhất trong đời mỗi người. Những buổi trực tuần rộn rã tiếng cười, những bài kiểm tra trắc nghiệm đầy kịch tính...',
      author: 'Thầy Hiền Phan',
      authorTitle: 'Chuyên gia Học liệu',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
      date: '08/05/2026',
      rating: 4.9,
      views: 148,
      likes: 29,
      price: 'Miễn phí'
    },
    {
      id: 4,
      category: 'photos',
      categoryLabel: 'ẢNH HOẠT ĐỘNG',
      title: 'Hình ảnh Hội Khỏe Phù Đổng & Ngoại Khóa Tiếng Anh Rực Rỡ',
      summary: 'Bộ sưu tập hình ảnh ghi lại các khoảnh khắc thi đấu thể thao & câu lạc bộ Tiếng Anh năng động.',
      content: 'Các môn thi kéo co, bóng chuyền và hội thảo giao lưu Tiếng Anh đã mang lại bầu không khí vô cùng bùng nổ trên toàn sân trường...',
      author: 'Nguyễn Huy',
      authorTitle: 'Đối tác Bạc GD',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
      date: '05/05/2026',
      rating: 4.8,
      views: 215,
      likes: 62,
      price: 'Miễn phí'
    }
  ];

  const featuredAuthors = [
    { name: 'Thầy Nguyễn Văn Hải', title: 'Giáo viên VIP', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop', count: '18 SP', rating: '5.0 ★' },
    { name: 'Cô Phí Thảo', title: 'Giáo viên Tiêu biểu', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop', count: '12 SP', rating: '4.9 ★' },
    { name: 'Thầy Hiền Phan', title: 'Chuyên gia học liệu', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop', count: '9 SP', rating: '4.9 ★' },
    { name: 'Nguyễn Huy', title: 'Đối tác Bạc GD', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop', count: '15 SP', rating: '4.8 ★' }
  ];

  const filteredMemories = sampleMemories.filter((item) => {
    if (activeTab && item.category !== activeTab) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    try { soundFX.playFanfare(); } catch (e) {}
    confetti({ particleCount: 120, spread: 80 });
    alert('🎉 Đã đăng thành công bài kỷ niệm lên Sân Trường!');
    setNewTitle(''); setNewContent(''); setShowCreateModal(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* HERO BANNER MATCHING USER REQUEST */}
      <PageHeroBanner
        title="Sân Trường Kỷ Niệm 🏫"
        subtitle="Nơi lưu giữ những ký ức đẹp, lưu bút chia tay, kỷ niệm vui buồn tuổi học trò THCS & góc hoạt động hình ảnh học tập sôi nổi của thầy trò!"
        badge="🌸 SÂN TRƯỜNG KỶ NIỆM • KÝ ỨC THẦY TRÒ THCS"
        bgImage="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop"
        showVipBadge={true}
      />

      {/* 4 MAIN CONTENT TABS UNDER HERO BANNER */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-2 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                try { soundFX.playClick(); } catch (e) {}
                setActiveTab(tab.id);
              }}
              className={`p-3.5 rounded-2xl text-left transition-all relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/30 scale-102 border border-brand-400/50'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 hover:text-white border border-slate-800'
              }`}
            >
              <div className="font-black text-sm flex items-center justify-between">
                <span>{tab.label}</span>
                {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              </div>
              <p className={`text-[11px] mt-1 font-bold line-clamp-1 ${isActive ? 'text-slate-200' : 'text-slate-400'}`}>
                {tab.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* TOP FILTERS BAR & SEARCH MATCHING SCREENSHOT 1 100% */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          
          <div className="sm:col-span-8 flex flex-wrap items-center gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs font-black px-3.5 py-2.5 rounded-2xl border border-slate-800 focus:outline-none"
            >
              <option value="all">📌 TẤT CẢ MÔN HỌC</option>
              <option value="english">🇬🇧 Tiếng Anh</option>
              <option value="literature">📖 Ngữ Văn</option>
              <option value="math">📐 Toán Học</option>
              <option value="skills">🌟 Kỹ Năng Sống</option>
            </select>

            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs font-black px-3.5 py-2.5 rounded-2xl border border-slate-800 focus:outline-none"
            >
              <option value="all">🏫 TẤT CẢ CẤP HỌC & LỚP</option>
              <option value="6">🎓 Khối Lớp 6</option>
              <option value="7">🎓 Khối Lớp 7</option>
              <option value="8">🎓 Khối Lớp 8</option>
              <option value="9">🎓 Khối Lớp 9</option>
            </select>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5 hover:scale-105 transition-all ml-auto sm:ml-0"
            >
              <Plus className="w-4 h-4" /> Viết Kỷ Niệm Mới
            </button>
          </div>

          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm kỷ niệm, lưu bút trên sân trường..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 text-xs font-bold text-slate-200 border border-slate-800 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT MATCHING SCREENSHOT 1 100% */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: MEMORIES / CARDS GRID (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredMemories.map((item) => (
              <div 
                key={item.id}
                onClick={() => setActiveArticle(item)}
                className="group rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-brand-500/60 transition-all cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* CARD IMAGE & BADGE */}
                  <div className="h-48 relative overflow-hidden bg-slate-950">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                    
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-brand-400 font-black text-[10px] uppercase tracking-wider">
                      {item.categoryLabel}
                    </span>

                    <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-emerald-500/90 text-slate-950 font-black text-[10px]">
                      {item.price}
                    </span>
                  </div>

                  {/* CARD CONTENT */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-black text-slate-100 group-hover:text-brand-300 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-bold line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                {/* CARD FOOTER */}
                <div className="p-5 pt-0 border-t border-slate-800/50 mt-3 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <img src={item.authorAvatar} alt={item.author} className="w-6 h-6 rounded-full object-cover border border-slate-700" />
                    <span className="font-extrabold text-slate-300 truncate max-w-[120px]">{item.author}</span>
                  </div>

                  <div className="flex items-center gap-3 font-bold text-[11px]">
                    <span className="text-amber-400 flex items-center gap-1">★ {item.rating}</span>
                    <span className="flex items-center gap-1 text-slate-500"><Eye className="w-3.5 h-3.5" /> {item.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR MATCHING SCREENSHOT 1 100% */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 👑 TÁC GIẢ NỔI BẬT MATCHING SCREENSHOT 1 */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Crown className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider">
                👑 TÁC GIẢ NỔI BẬT
              </h3>
            </div>

            <div className="space-y-3">
              {featuredAuthors.map((author, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-3">
                    <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full object-cover border-2 border-amber-400/50" />
                    <div>
                      <div className="font-black text-xs text-slate-100 flex items-center gap-1">
                        {author.name}
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold text-[9px]">VIP</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-400">{author.title}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-amber-400">{author.count}</div>
                    <div className="text-[10px] font-bold text-emerald-400">{author.rating}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🔥 ĐANG HOT MATCHING SCREENSHOT 1 */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Flame className="w-5 h-5 text-rose-500" />
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider">
                🔥 ĐANG HOT
              </h3>
            </div>

            <div className="space-y-3">
              {sampleMemories.slice(0, 3).map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setActiveArticle(item)}
                  className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 hover:border-brand-500/50 transition-all cursor-pointer"
                >
                  <img src={item.thumbnail} alt={item.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-200 line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-extrabold text-emerald-400">
                      {item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ARTICLE READER MODAL */}
      {activeArticle && (
        <div className="fixed top-20 left-0 right-0 bottom-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-start justify-center p-4 pt-4 overflow-y-auto">
          <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-3xl w-full border border-slate-800 overflow-hidden shadow-2xl space-y-0 relative animate-fadeIn max-h-[82vh] flex flex-col">
            <div className="p-6 pb-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-brand-600 text-white font-black text-[10px] uppercase">
                  {activeArticle.categoryLabel}
                </span>
                <h2 className="text-xl font-black text-white mt-1">{activeArticle.title}</h2>
              </div>
              <button 
                onClick={() => setActiveArticle(null)}
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
              <div className="h-64 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img src={activeArticle.thumbnail} alt={activeArticle.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 border-y border-slate-800 py-3">
                <div className="flex items-center gap-2">
                  <img src={activeArticle.authorAvatar} alt={activeArticle.author} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <div className="font-black text-slate-200">{activeArticle.author}</div>
                    <div className="text-[10px] text-slate-400">{activeArticle.authorTitle}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{activeArticle.date}</div>
                  <div className="text-amber-400 font-bold">★ {activeArticle.rating}</div>
                </div>
              </div>

              <div className="text-sm text-slate-200 font-medium leading-relaxed whitespace-pre-line">
                {activeArticle.content}
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setActiveArticle(null)}
                className="px-6 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MEMORY MODAL */}
      {showCreateModal && (
        <div className="fixed top-20 left-0 right-0 bottom-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-start justify-center p-4 pt-4 overflow-y-auto">
          <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-xl w-full border border-slate-800 p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <PenTool className="w-5 h-5 text-brand-400" /> Viết Kỷ Niệm / Lưu Bút Mới
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Tiêu đề bài viết / kỷ niệm:</label>
                <input 
                  type="text"
                  placeholder="Nhập tiêu đề kỷ niệm..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Chọn danh mục kỷ niệm:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none"
                >
                  <option value="class_stories">📖 Chuyện của lớp</option>
                  <option value="memoirs">✍️ Lưu bút</option>
                  <option value="youth">🌸 Tuổi học trò</option>
                  <option value="photos">🖼️ Ảnh hoạt động</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Nội dung câu chuyện / lưu bút:</label>
                <textarea
                  rows={5}
                  placeholder="Viết cảm xúc, lời nhắn nhủ, kỷ niệm vui buồn..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">
                  Hủy
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-black text-xs shadow-lg">
                  Đăng Kỷ Niệm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
