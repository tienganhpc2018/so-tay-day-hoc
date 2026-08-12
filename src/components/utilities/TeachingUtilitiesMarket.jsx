import React, { useState } from 'react';
import { Search, Plus, ExternalLink, Star, Sparkles, CheckCircle2, Code, ShieldCheck, X } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

export const TeachingUtilitiesMarket = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tiện ích giảng dạy');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Initial App / Utility Data matching Screenshot 2
  const [utilities, setUtilities] = useState([
    {
      id: 1,
      title: 'Công nghệ 10 - Bài vẽ hình khối 3D',
      author: 'Nguyễn Thị Mỹ Trang',
      verified: false,
      rating: 5.0,
      likes: 3,
      price: 'Miễn phí',
      category: 'Tiện ích giảng dạy',
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&auto=format&fit=crop',
      url: 'https://aistudio.google.com/'
    },
    {
      id: 2,
      title: 'App hình học - Hình thang tương tác',
      author: 'Nguyễn Văn Hải',
      verified: true,
      rating: 5.0,
      likes: 3,
      price: 'Miễn phí',
      category: 'Tiện ích giảng dạy',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop',
      url: 'https://aistudio.google.com/'
    },
    {
      id: 3,
      title: 'App tạo Infographics siêu nhanh và đẹp từ Gemini Canvas',
      author: 'Nguyễn Văn Hải',
      verified: true,
      rating: 5.0,
      likes: 1,
      price: '15.000 đ',
      category: 'Tiện ích giảng dạy',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      url: 'https://aistudio.google.com/'
    },
    {
      id: 4,
      title: 'Công nghệ 10 - Bài vẽ mặt cắt kỹ thuật',
      author: 'Nguyễn Thị Mỹ Trang',
      verified: false,
      rating: 5.0,
      likes: 0,
      price: '5.000 đ',
      category: 'Tiện ích giảng dạy',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop',
      url: 'https://aistudio.google.com/'
    },
    {
      id: 5,
      title: 'Game Ghép Từ Vựng Tiếng Anh Global Success 8',
      author: 'Nguyễn Văn Hải',
      verified: true,
      rating: 5.0,
      likes: 12,
      price: 'Miễn phí',
      category: 'Game tương tác',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop',
      url: 'https://aistudio.google.com/'
    },
    {
      id: 6,
      title: 'Hệ Thống Quản Lý Điểm Số & Sổ Nề Nếp Lớp Học',
      author: 'Nguyễn Văn Hải',
      verified: true,
      rating: 5.0,
      likes: 8,
      price: 'Miễn phí',
      category: 'Web/App quản lý',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
      url: 'https://aistudio.google.com/'
    }
  ]);

  // Form State for Adding New Gemini Canvas App
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('Tiện ích giảng dạy');
  const [newPrice, setNewPrice] = useState('Miễn phí');

  const categoriesList = ['Tất cả', 'Game tương tác', 'Web/App quản lý', 'Tiện ích giảng dạy', 'Khác'];

  const filteredUtilities = utilities.filter(u => {
    const matchesSearch = u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Tất cả' || u.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddUtilitySubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      alert('Vui lòng nhập Tiêu đề và Link nhúng Gemini Canvas / Web App!');
      return;
    }

    soundFX.playClick();
    const item = {
      id: Date.now(),
      title: newTitle,
      author: 'Nguyễn Văn Hải',
      verified: true,
      rating: 5.0,
      likes: 1,
      price: newPrice,
      category: newCategory,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      url: newUrl
    };

    setUtilities([item, ...utilities]);
    soundFX.playFanfare();
    confetti({ particleCount: 120, spread: 80 });
    alert('✨ ĐÃ THÊM TIỆN ÍCH GIẢNG DẠY TỪ GEMINI CANVAS THÀNH CÔNG!');
    setNewTitle('');
    setNewUrl('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. SEARCH BAR & FILTER CATEGORY PILLS MATCHING SCREENSHOT 2 */}
      <div className="bg-white p-4 rounded-3xl shadow-lg space-y-4 border border-slate-200">
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm trò chơi, website, ứng dụng giáo dục..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-11 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <button
            onClick={() => soundFX.playClick()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md shrink-0"
          >
            Tìm kiếm
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Thêm App Gemini Canvas
          </button>
        </div>

        {/* CATEGORY PILLS MATCHING SCREENSHOT 2 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-extrabold scrollbar-none">
          <span className="text-slate-500 shrink-0">Thể loại:</span>
          {categoriesList.map((cat, cIdx) => (
            <button
              key={cIdx}
              onClick={() => {
                soundFX.playClick();
                setActiveCategory(cat);
              }}
              className={`px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* 2. CARDS GRID MATCHING SCREENSHOT 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredUtilities.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Card Image Header */}
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />

                <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-slate-900/90 text-white text-[10px] font-black uppercase tracking-wider shadow">
                  {item.category}
                </span>
              </div>

              {/* Card Body Content */}
              <div className="p-5 space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1">
                    Tác giả: <strong className="text-slate-800">{item.author}</strong>
                    {item.verified && <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black flex items-center justify-center">V</span>}
                  </span>

                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {item.rating} ({item.likes})
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">GIÁ SỞ HỮU</span>
                <span className={`text-xs font-black ${item.price === 'Miễn phí' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {item.price}
                </span>
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Chi tiết <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        ))}
      </div>

      {/* 3. MODAL HƯỚNG DẪN & THÊM TIỆN ÍCH GIẢNG DẠY TỪ GEMINI CANVAS */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-slate-900 space-y-6 shadow-2xl relative animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-600" />
                Thêm Tiện Ích Giảng Dạy Từ Gemini Canvas
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Hướng dẫn đưa App từ Gemini Canvas / Google AI Studio lên:
              </p>
              <p>1. Mở Gemini Canvas / Google AI Studio và nhấn nút <strong>Share / Export Web App</strong>.</p>
              <p>2. Sao chép đường link URL hoặc mã nhúng <code>iframe</code> của ứng dụng.</p>
              <p>3. Dán link vào ô bên dưới để hiển thị trực tiếp lên Chợ Tiện Ích Giảng Dạy!</p>
            </div>

            <form onSubmit={handleAddUtilitySubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 mb-1">TÊN ỨNG DỤNG / TIỆN ÍCH GIẢNG DẠY *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: App tạo sơ đồ tư duy Tiếng Anh THCS từ Gemini Canvas..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">LINK GEMINI CANVAS / LINK WEB APP *</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://aistudio.google.com/... hoặc link web app của Thầy"
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">THỂ LOẠI</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="Tiện ích giảng dạy">Tiện ích giảng dạy</option>
                    <option value="Game tương tác">Game tương tác</option>
                    <option value="Web/App quản lý">Web/App quản lý</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">GIÁ SỞ HỮU</label>
                  <input
                    type="text"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="Miễn phí hoặc 15.000 đ..."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg"
              >
                ✨ ĐĂNG TIỆN ÍCH GIẢNG DẠY NÀY LÊN HỆ THỐNG
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
