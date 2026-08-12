import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  ExternalLink, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  Code, 
  ShieldCheck, 
  X, 
  Play, 
  Share2, 
  ShoppingCart, 
  PhoneCall, 
  AlertTriangle,
  Gift,
  Flame,
  Gamepad2,
  Tv
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

export const TeachingUtilitiesMarket = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Active Selected Item for Product Detail Modal (Screenshot 1)
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Active Game Item for Playing Directly on Web (Screenshot 2)
  const [activePlayGame, setActivePlayGame] = useState(null);

  // 1. FREE INTERACTIVE GAMES MATCHING SCREENSHOT 2
  const [freeGames, setFreeGames] = useState([
    {
      id: 'fg1',
      title: 'Vòng Quay May Mắn ETA',
      tag: 'INTERACTIVE GAME',
      plays: 232,
      priceTag: 'MIỄN PHÍ',
      badgeColor: 'bg-emerald-500',
      description: 'Công cụ chọn ngẫu nhiên học sinh hoặc phần thưởng trên lớp học. Giao diện sinh động sắc nét.',
      thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop',
      gameUrl: 'https://wordwall.net/embed/4f6d4d12c85b46e382d622a5ec2b5585?themeId=1&templateId=5&fontStackId=0'
    },
    {
      id: 'fg2',
      title: 'Kéo Co Kiến Thức',
      tag: 'INTERACTIVE GAME',
      plays: 180,
      priceTag: 'MIỄN PHÍ',
      badgeColor: 'bg-emerald-500',
      description: 'Trò chơi trắc nghiệm đối kháng kéo co đầy kịch tính dành cho hai đội chơi trên lớp học Tiếng Anh.',
      thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop',
      gameUrl: 'https://wordwall.net/embed/4f6d4d12c85b46e382d622a5ec2b5585?themeId=1&templateId=5&fontStackId=0'
    },
    {
      id: 'fg3',
      title: 'Vẹo Cổ - Nghiêng Đầu Trả Lời',
      tag: 'INTERACTIVE GAME',
      plays: 34,
      priceTag: 'MIỄN PHÍ',
      badgeColor: 'bg-emerald-500',
      description: 'Trò chơi trắc nghiệm camera độc đáo. Nghiêng đầu trái/phải để lựa chọn đáp án đúng.',
      thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop',
      gameUrl: 'https://wordwall.net/embed/4f6d4d12c85b46e382d622a5ec2b5585?themeId=1&templateId=5&fontStackId=0'
    },
    {
      id: 'fg4',
      title: 'Chém Hoa Quả AI',
      tag: 'INTERACTIVE GAME',
      plays: 28,
      priceTag: 'MIỄN PHÍ',
      badgeColor: 'bg-emerald-500',
      description: 'Sử dụng camera và cử chỉ tay (Hand Tracking) để chém các quả chứa đáp án Tiếng Anh đúng.',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      gameUrl: 'https://wordwall.net/embed/4f6d4d12c85b46e382d622a5ec2b5585?themeId=1&templateId=5&fontStackId=0'
    }
  ]);

  // 2. TEACHING UTILITIES & APPS MATCHING SCREENSHOT 1
  const [utilities, setUtilities] = useState([
    {
      id: 'ut1',
      title: 'App tạo infographics siêu nhanh và đẹp từ Gemini Canvas',
      categoryTag: 'TIỆN ÍCH GIẢNG DẠY',
      author: 'Nguyễn Văn Hải',
      email: 'onlineteaching.vh@gmail.com',
      verified: true,
      rating: '5.0 / 5.0',
      reviews: 0,
      downloads: 1,
      price: '15.000 đ',
      phone: '0384635199',
      images: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&auto=format&fit=crop'
      ],
      description: 'Ứng dụng tự động chuyển văn bản thành sơ đồ tư duy Infographic rực rỡ sắc nét được tạo trực tiếp từ Gemini Canvas.',
      url: 'https://aistudio.google.com/'
    },
    {
      id: 'ut2',
      title: 'App hình học - Hình thang tương tác',
      categoryTag: 'TIỆN ÍCH GIẢNG DẠY',
      author: 'Nguyễn Văn Hải',
      email: 'onlineteaching.vh@gmail.com',
      verified: true,
      rating: '5.0 / 5.0',
      reviews: 4,
      downloads: 12,
      price: 'Miễn phí',
      phone: '0384635199',
      images: [
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop'
      ],
      description: 'Mô phỏng hình học tương tác giúp giáo viên trình chiếu bài giảng môn Công nghệ & Toán học.',
      url: 'https://aistudio.google.com/'
    },
    {
      id: 'ut3',
      title: 'Công nghệ 10 - Bài vẽ mặt cắt kỹ thuật',
      categoryTag: 'TIỆN ÍCH GIẢNG DẠY',
      author: 'Nguyễn Thị Mỹ Trang',
      email: 'mytrang.tech@gmail.com',
      verified: false,
      rating: '5.0 / 5.0',
      reviews: 0,
      downloads: 3,
      price: '5.000 đ',
      phone: '0384635199',
      images: [
        'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop'
      ],
      description: 'Mẫu bản vẽ kỹ thuật 3D mặt cắt tương tác trên trình duyệt.',
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
    const matchesCategory = activeCategory === 'Tất cả' || u.categoryTag === activeCategory;
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
      id: `custom-${Date.now()}`,
      title: newTitle,
      categoryTag: newCategory,
      author: 'Nguyễn Văn Hải',
      email: 'onlineteaching.vh@gmail.com',
      verified: true,
      rating: '5.0 / 5.0',
      reviews: 0,
      downloads: 1,
      price: newPrice,
      phone: '0384635199',
      images: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'
      ],
      description: 'Web App tương tác được nhúng trực tiếp từ Gemini Canvas / Google AI Studio.',
      url: newUrl
    };

    setUtilities([item, ...utilities]);
    soundFX.playFanfare();
    confetti({ particleCount: 120, spread: 80 });
    alert('✨ ĐÃ ĐĂNG APP GEMINI CANVAS THÀNH CÔNG LÊN HỆ THỐNG!');
    setNewTitle('');
    setNewUrl('');
    setIsAddModalOpen(false);
  };

  const handleShareLink = (title) => {
    soundFX.playClick();
    navigator.clipboard.writeText(window.location.href);
    alert(`🔗 Đã chép đường link chia sẻ cho: ${title}`);
  };

  return (
    <div className="space-y-10 font-sans animate-fadeIn">
      
      {/* SECTION 1: TRÒ CHƠI MIỄN PHÍ MATCHING SCREENSHOT 2 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Trò chơi Miễn phí 🎁
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  {freeGames.length} trò chơi
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Nhấp nút "Chơi ngay" màu xanh để mở trò chơi và chạy trực tiếp trên web!
              </p>
            </div>
          </div>
        </div>

        {/* GAME CARDS GRID MATCHING SCREENSHOT 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {freeGames.map((game) => (
            <div 
              key={game.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail Image Header */}
                <div className="relative h-44 overflow-hidden bg-slate-950">
                  <img 
                    src={game.thumbnail} 
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />

                  {/* Badge Miễn Phí Left */}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-[10px] uppercase shadow">
                    {game.priceTag}
                  </span>

                  {/* Badge Lượt Chơi Right */}
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-500/30 border border-amber-400/50 text-amber-300 font-extrabold text-[10px] flex items-center gap-1 backdrop-blur-md">
                    <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {game.plays} lượt
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider block">
                    {game.tag}
                  </span>

                  <h3 className="text-base font-extrabold text-white group-hover:text-brand-300 line-clamp-1">
                    {game.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {game.description}
                  </p>
                </div>
              </div>

              {/* ACTION FOOTER WITH BLUE "CHƠI NGAY" BUTTON MATCHING SCREENSHOT 2 */}
              <div className="p-5 pt-0 flex items-center gap-2 mt-2">
                <button
                  onClick={() => {
                    soundFX.playClick();
                    setActivePlayGame(game);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Chơi ngay</span>
                </button>

                <button
                  onClick={() => handleShareLink(game.title)}
                  className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all shrink-0"
                  title="Chia sẻ link trò chơi"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: CHỢ TIỆN ÍCH GIẢNG DẠY & APPS GEMINI CANVAS MATCHING SCREENSHOT 1 */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Code className="w-6 h-6 text-indigo-400" />
              Chợ Công Nghệ & Tiện Ích Giảng Dạy Gemini Canvas
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Đưa các Web App được sinh tự động từ Gemini Canvas / Google AI Studio lên trang web để học sinh & giáo viên dùng trực tiếp.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Thêm App Gemini Canvas
          </button>
        </div>

        {/* SEARCH BAR & CATEGORY PILLS */}
        <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm trò chơi, website, ứng dụng giáo dục..."
                className="w-full glass-input pl-11 text-xs py-2.5"
              />
            </div>

            <button
              onClick={() => soundFX.playClick()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shrink-0"
            >
              Tìm kiếm
            </button>
          </div>

          {/* CATEGORY PILLS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-extrabold scrollbar-none">
            <span className="text-slate-400 shrink-0">Thể loại:</span>
            {categoriesList.map((cat, cIdx) => (
              <button
                key={cIdx}
                onClick={() => {
                  soundFX.playClick();
                  setActiveCategory(cat);
                }}
                className={`px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* UTILITIES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUtilities.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 bg-slate-950 overflow-hidden">
                  <img 
                    src={item.images[0]} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />

                  <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow">
                    {item.categoryTag}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-extrabold text-white group-hover:text-indigo-400 line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      Tác giả: <strong className="text-slate-200">{item.author}</strong>
                      {item.verified && <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black flex items-center justify-center">V</span>}
                    </span>

                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      5.0
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">GIÁ SỞ HỮU</span>
                  <span className={`text-xs font-black ${item.price === 'Miễn phí' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {item.price}
                  </span>
                </div>

                <button
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedProduct(item);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 border border-slate-700"
                >
                  Chi tiết <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* MODAL 1: PRODUCT DETAIL & BUY & PLAY DIRECTLY MATCHING SCREENSHOT 1 */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full text-slate-900 overflow-hidden shadow-2xl space-y-0 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-black text-[10px] uppercase tracking-wider">
                  {selectedProduct.categoryTag}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">{selectedProduct.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Grid */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Left Carousel / Preview Screenshot */}
              <div className="md:col-span-7 space-y-4">
                <div className="rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 h-72 shadow-inner">
                  <img 
                    src={selectedProduct.images[0]} 
                    alt={selectedProduct.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex gap-2">
                  {selectedProduct.images.map((img, iIdx) => (
                    <div key={iIdx} className="w-16 h-12 rounded-xl overflow-hidden border border-slate-300 bg-slate-100">
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Right Product Purchase Sidebar Matching Screenshot 1 */}
              <div className="md:col-span-5 space-y-6">
                
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">GIÁ SỞ HỮU SẢN PHẨM</span>
                    <span className="text-2xl font-black text-slate-900">{selectedProduct.price}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-slate-200 pt-3">
                    <span className="flex items-center gap-1 text-amber-500 font-extrabold">
                      <Star className="w-4 h-4 fill-amber-400" /> {selectedProduct.rating}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      📥 Đã tải: {selectedProduct.downloads}
                    </span>
                  </div>

                  {/* Author Box Matching Screenshot 1 */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow">
                      {selectedProduct.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900 text-xs">{selectedProduct.author}</span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[9px]">VIP</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{selectedProduct.email}</span>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS MATCHING SCREENSHOT 1 */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      soundFX.playFanfare();
                      alert(`🎉 Cảm ơn Thầy! Bạn đã chọn mua bản quyền: ${selectedProduct.title}. Vui lòng liên hệ Hotline ${selectedProduct.phone} để kích hoạt mã.`);
                    }}
                    className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" /> Mua bản quyền sản phẩm
                  </button>

                  <a
                    href={`tel:${selectedProduct.phone}`}
                    className="w-full py-3.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <PhoneCall className="w-4 h-4 text-indigo-600" /> Liên hệ hỗ trợ: {selectedProduct.phone}
                  </a>

                  {/* BUTTON TO PLAY / RUN GEMINI CANVAS APP LIVE */}
                  <a
                    href={selectedProduct.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                  >
                    <Tv className="w-4 h-4 text-emerald-400" /> 🎮 CHẠY APP GEMINI CANVAS TRỰC TIẾP
                  </a>
                </div>

              </div>

            </div>

            {/* Modal Footer Bar Matching Screenshot 1 */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 font-semibold">ETA (Em Tự Học) - Chợ công nghệ & Phần mềm giáo dục số</span>
              <div className="flex items-center gap-2">
                <button onClick={() => alert('Đã gửi báo cáo vi phạm.')} className="px-3 py-1.5 rounded-full border border-rose-200 text-rose-600 font-bold hover:bg-rose-50 flex items-center gap-1 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5" /> Báo cáo vi phạm
                </button>
                <button onClick={() => handleShareLink(selectedProduct.title)} className="px-3 py-1.5 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 flex items-center gap-1 text-[11px]">
                  <Share2 className="w-3.5 h-3.5" /> Copy link chia sẻ
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: DIRECT LIVE GAME PLAYER WHEN CLICKING "CHƠI NGAY" MATCHING SCREENSHOT 2 */}
      {activePlayGame && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-5xl w-full text-white border border-slate-700 overflow-hidden shadow-2xl space-y-4 p-6 relative animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{activePlayGame.title}</h3>
                  <span className="text-xs text-slate-400 font-semibold">{activePlayGame.tag} • Đang chạy trực tiếp trên Web</span>
                </div>
              </div>

              <button 
                onClick={() => setActivePlayGame(null)}
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* LIVE IFRAME GAME CONTAINER */}
            <div className="w-full h-[600px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
              <iframe
                src={activePlayGame.gameUrl}
                title={activePlayGame.title}
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>

          </div>
        </div>
      )}

      {/* MODAL 3: FORM TO ADD NEW GEMINI CANVAS APP */}
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
                Cách đưa App từ Gemini Canvas lên trang:
              </p>
              <p>1. Mở Gemini Canvas / Google AI Studio ➔ Nhấn <strong>Share / Export Web App</strong>.</p>
              <p>2. Sao chép link URL Web App hoặc mã <code>iframe</code>.</p>
              <p>3. Dán link vào ô bên dưới ➔ Bấm Đăng để hiển thị thẻ có nút <strong>"Chơi ngay"</strong>!</p>
            </div>

            <form onSubmit={handleAddUtilitySubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 mb-1">TÊN ỨNG DỤNG / TIỆN ÍCH GIẢNG DẠY *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: App sơ đồ tư duy Tiếng Anh THCS từ Gemini Canvas..."
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
