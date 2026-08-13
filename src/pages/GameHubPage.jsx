import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  BookOpen, 
  PenTool, 
  Sparkles, 
  Image as ImageIcon, 
  Plus, 
  Eye, 
  X, 
  Heart, 
  Calendar 
} from 'lucide-react';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export const GameHubPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = searchParams.get('tab') || 'class_stories';

  // 4 MAIN TABS FOR SÂN TRƯỜNG TƯƠNG TÁC:
  // Tab 1: 'class_stories' (📖 Chuyện của lớp)
  // Tab 2: 'memoirs' (✍️ Lưu bút)
  // Tab 3: 'youth' (🌸 Tuổi học trò)
  // Tab 4: 'photos' (🖼️ Ảnh hoạt động)
  const [activeTab, setActiveTab] = useState(activeTabParam);

  useEffect(() => {
    if (activeTabParam) {
      setActiveTab(activeTabParam);
    }
  }, [activeTabParam]);

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
      category: 'class_stories',
      categoryLabel: 'CHUYỆN CỦA LỚP',
      title: 'Chuyện vui giờ học Tiếng Anh THCS Global Success cùng Thầy Hải',
      summary: 'Những tiết học sôi nổi, các trò chơi tương tác từ vựng và tràng pháo tay giòn giã của cả lớp.',
      content: 'Giờ học Tiếng Anh của Thầy Hải luôn tràn ngập tiếng cười với các mô hình kiềng 3 chân, game lật thẻ và vòng quay may mắn...',
      author: 'Phạm Thanh Tú',
      authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
      date: '11/05/2026',
      likes: 39
    },
    {
      id: 3,
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
      id: 4,
      category: 'memoirs',
      categoryLabel: 'LƯU BÚT',
      title: 'Lời chúc thân thương gửi tới Thầy Nguyễn Văn Hải & tập thể lớp',
      summary: 'Dòng lưu bút tri ân lòng nhiệt huyết của người thầy và tình bạn thắm thiết tuổi học trò.',
      content: 'Cảm ơn thầy Hải đã luôn đồng hành, truyền cảm hứng và giúp chúng em yêu thích môn Tiếng Anh mỗi ngày...',
      author: 'Bùi Hoàng Hải',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop',
      date: '09/05/2026',
      likes: 42
    },
    {
      id: 5,
      category: 'youth',
      categoryLabel: 'TUỔI HỌC TRÒ',
      title: 'Những ước mơ tuổi 14 và phương pháp tự học Tiếng Anh hiệu quả',
      summary: 'Bài viết chia sẻ tâm sự học trò tuổi 14 về ước mơ hoài bão và kinh nghiệm chinh phục các kỳ thi.',
      content: 'Tuổi 14 dưới mái trường THCS là khoảng thời gian đẹp nhất với bao hoài bão. Những giờ học Tiếng Anh bám sát SGK Global Success giúp em tự tin hơn...',
      author: 'Trần Thuỳ Dương',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop',
      date: '09/05/2026',
      likes: 52
    },
    {
      id: 6,
      category: 'youth',
      categoryLabel: 'TUỔI HỌC TRÒ',
      title: 'Tâm sự tuổi hoa niên dưới mái trường THCS thân yêu',
      summary: 'Góc suy ngẫm tuổi học trò & hành trình trưởng thành qua từng môn học và các hoạt động lớp.',
      content: 'Thời gian trôi nhanh như một chớp mắt, mỗi ngày đến trường là một ngày vui với biết bao kỷ niệm đẹp...',
      author: 'Vũ Mai Phương',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
      date: '08/05/2026',
      likes: 31
    },
    {
      id: 7,
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
        title="Sân Trường Tương Tác THCS 🏫"
        subtitle="Góc Kỷ niệm, Nhật ký lớp học, Lưu bút tuổi học trò và Album ảnh hoạt động ngoại khóa."
        badge="SÂN TRƯỜNG TƯƠNG TÁC"
        bgImage="/images/hero_game_bg.jpg"
      />

      {/* 2. 4 MAIN NAVIGATION TABS (RESTORED CLEAN 4 ORIGINAL SÂN TRƯỜNG TABS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-1.5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl text-xs font-black">
        
        <button
          onClick={() => {
            soundFX.playClick();
            setActiveTab('class_stories');
            setSearchParams({ tab: 'class_stories' });
          }}
          className={`p-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 ${
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
          className={`p-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 ${
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
          className={`p-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 ${
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
          className={`p-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'photos'
              ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg border border-brand-500/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="truncate">🖼️ Ảnh hoạt động</span>
        </button>

      </div>

      {/* CONTENT FOR TABS 1-4: SÂN TRƯỜNG TƯƠNG TÁC MEMORIES */}
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
          {memoriesList.filter(m => m.category === activeTab).map((item) => (
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

      {/* CREATE MEMORY MODAL */}
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

    </div>
  );
};
