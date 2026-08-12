import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFX } from '../utils/soundEffects';
import { supabase } from '../lib/supabase';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { 
  Sparkles, 
  Crown, 
  BookOpen, 
  HelpCircle, 
  Gamepad2, 
  Award, 
  UserCheck, 
  Newspaper, 
  ShoppingBag, 
  ChevronRight, 
  Download, 
  ExternalLink,
  GraduationCap,
  MessageCircle,
  Video,
  FileText,
  Rocket
} from 'lucide-react';

export const HomePage = () => {
  const { profile } = useAuth();
  const authorName = profile?.full_name || 'Nguyễn Văn Hải';
  const currentDateStr = new Date().toLocaleDateString('vi-VN');

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchHomeArticles();
  }, []);

  const fetchHomeArticles = async () => {
    try {
      const { data } = await supabase
        .from('learning_materials')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (data && data.length > 0) {
        setArticles(data);
      }
    } catch (err) {
      console.error('Error fetching home articles:', err);
    }
  };

  const defaultArticles = [
    {
      id: 1,
      title: 'Mẹo & Từ Vựng Cốt Lõi Khối 6 • 7 • 8 • 9 Global Success',
      category: 'VOCABULARY',
      date: currentDateStr,
      description: 'Tổng hợp trọn bộ Từ vựng Word Bank kèm phát âm audio bám sát sách giáo khoa.',
      author: authorName
    },
    {
      id: 2,
      title: 'Chủ Điểm Ngữ Pháp Trọng Tâm 12 Units Tiếng Anh THCS',
      category: 'GRAMMAR',
      date: currentDateStr,
      description: 'Tổng hợp công thức, ví dụ loại trừ đáp án sai và ma trận ngữ pháp kiểm tra định kỳ.',
      author: authorName
    },
    {
      id: 3,
      title: 'Hướng Dẫn Thiết Kế Bài Giảng Điện Tử & iFrame Game Tương Tác',
      category: 'VOCABULARY',
      date: currentDateStr,
      description: 'Tích hợp các trò chơi ghép cặp, trắc nghiệm và flashcards vào tiết dạy trên lớp.',
      author: authorName
    },
    {
      id: 4,
      title: 'Ma Trận Đề Thi CV7991 Theo Định Hướng Năng Lực Học Sinh',
      category: 'GRAMMAR',
      date: currentDateStr,
      description: 'Phân tích ma trận đề thi 15 phút, 45 phút và học kỳ bám sát chương trình mới.',
      author: authorName
    },
    {
      id: 5,
      title: 'Tuyển Tập Infographic Kiến Thức Tiếng Anh THCS Trực Quan',
      category: 'VOCABULARY',
      date: currentDateStr,
      description: 'Hình ảnh Infographic tóm tắt ngữ pháp giúp học sinh dễ nhớ bài học.',
      author: authorName
    }
  ];

  const displayArticles = articles.length > 0 ? articles : defaultArticles;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 font-sans animate-fadeIn">
      
      {/* 1. TOP HERO BANNER WITH AI CLASSROOM BACKGROUND IMAGE */}
      <PageHeroBanner
        title={`Chào mừng trở lại, ${authorName}! 👋`}
        subtitle="Khám phá nền tảng giáo dục thông minh với đầy đủ công cụ quản lý chuyên môn, trò chơi tương tác, ngân hàng đề thi bám sát ma trận CV7991 và thư viện tài liệu phong phú."
        badge="SỔ TAY DẠY HỌC THCS • GLOBAL SUCCESS"
        bgImage="/images/hero_school_bg.jpg"
        showVipBadge={true}
        actions={
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/materials"
              onClick={() => soundFX.playClick()}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-lg shadow-brand-600/30 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Khám Phá Học Liệu
            </Link>
            <Link
              to="/quizzes"
              onClick={() => soundFX.playClick()}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs border border-slate-700 flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" /> Soạn Đề AI ⚡
            </Link>
          </div>
        }
      />

      {/* 2. VIP BẢNG VÀNG CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CARD 1: BẢNG VÀNG 01 - ĐỐI TÁC VÀNG GIÁO DỤC */}
        <div className="rounded-[28px] bg-slate-900/90 border-2 border-amber-400 p-6 space-y-6 shadow-xl relative flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-300 font-black text-lg">
                  👑
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-white">{authorName}</h3>
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">VIP</span>
                  </div>
                  <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">ĐỐI TÁC VÀNG GIÁO DỤC</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 text-xs font-black">
                BẢNG VÀNG 01
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Bộ 100 TRÒ CHƠI PowerPoint MIỄN PHÍ', tag: 'Miễn phí', color: 'text-emerald-400' },
                { title: 'BỘ 155 SLIDE PPT CÁC LOẠI MIỄN PHÍ', tag: 'Miễn phí', color: 'text-emerald-400' },
                { title: 'Bộ 65 slide PowerPoint nhiều chủ đề cực hay...', tag: 'Miễn phí', color: 'text-emerald-400' },
                { title: 'BỘ 30 SLIDE POWERPOINT ĐẸP - Nhiều mẫu đ...', tag: 'Miễn phí', color: 'text-emerald-400' }
              ].map((sub, sIdx) => (
                <Link key={sIdx} to="/materials" className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 hover:border-amber-400/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 text-amber-400">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-extrabold text-slate-200 truncate">{sub.title}</h4>
                    <span className={`text-[10px] font-bold ${sub.color}`}>{sub.tag}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs">
              ✨ Hiển thị thương hiệu của bạn tại đây!
            </span>
            <Link to="/materials" className="px-4 py-2 rounded-xl bg-slate-950 text-white font-extrabold text-xs border border-slate-700 hover:bg-slate-800">
              🎥 Đăng ký vị trí VIP
            </Link>
          </div>
        </div>

        {/* CARD 2: BẢNG VÀNG 02 - HỌC LIỆU INFOGRAPHIC */}
        <div className="rounded-[28px] bg-slate-900/90 border-2 border-amber-400 p-6 space-y-6 shadow-xl relative flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 font-black text-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-white">Học Liệu Infographic</h3>
                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px]">HOT</span>
                  </div>
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">GIÁO TRÌNH STEM & INFOGRAPHIC VIP</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 text-xs font-black">
                BẢNG VÀNG 02
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'INFOGRAPHIC TIẾNG ANH 7 - BÀI 4', price: '50.000đ' },
                { title: 'INFOGRAPHIC TIẾNG ANH 7 - BÀI 3', price: '50.000đ' },
                { title: 'INFOGRAPHIC TIẾNG ANH 7 - BÀI 2', price: '50.000đ' },
                { title: 'INFOGRAPHIC TIẾNG ANH 7 - BÀI 1', price: '50.000đ' }
              ].map((sub, sIdx) => (
                <Link key={sIdx} to="/materials" className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 hover:border-emerald-400/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 text-emerald-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-extrabold text-slate-200 truncate">{sub.title}</h4>
                    <span className="text-[11px] font-extrabold text-rose-400">{sub.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs">
              ✨ Hiển thị sản phẩm của bạn tại đây!
            </span>
            <Link to="/materials" className="px-4 py-2 rounded-xl bg-slate-950 text-white font-extrabold text-xs border border-slate-700 hover:bg-slate-800">
              🎥 Đăng ký vị trí VIP
            </Link>
          </div>
        </div>

      </div>

      {/* 3. HỌC LIỆU GLOBAL SUCCESS 📰 */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xl font-black text-white flex items-center gap-2 border-l-4 border-indigo-500 pl-3">
            <Newspaper className="w-6 h-6 text-indigo-400" />
            Học Liệu Global Success 📰
          </h2>

          <Link to="/materials" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            Xem tất cả (Menu Thư Mục Học Liệu) →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayArticles.map((art, aIdx) => (
            <Link 
              key={aIdx} 
              to="/materials" 
              className="rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 p-6 space-y-4 transition-all group shadow-xl backdrop-blur-sm block"
            >
              <div className="flex items-center justify-between text-xs">
                <span className={`px-3 py-1 rounded-full font-black text-[11px] border uppercase ${
                  art.category === 'GRAMMAR' 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                }`}>
                  {art.category || 'VOCABULARY'}
                </span>
                <span className="text-slate-400 font-semibold">{art.date || currentDateStr}</span>
              </div>

              <h3 className="text-base font-extrabold text-white group-hover:text-brand-300 line-clamp-2 leading-snug">
                {art.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {art.description || art.content || 'Bài viết hướng dẫn học liệu bám sát chương trình Tiếng Anh THCS Global Success.'}
              </p>

              <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-3 border-t border-slate-800/80">
                <span>Tác giả: {authorName}</span>
                <span className="text-indigo-400 group-hover:underline">Đọc tiếp →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. THƯ VIỆN HỌC LIỆU MỚI NHẤT & HỘI CHỢ PROJECT NỔI BẬT 🚀 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-black text-white flex items-center gap-2 border-l-4 border-brand-500 pl-3">
              <BookOpen className="w-5 h-5 text-brand-400" />
              Thư viện Học liệu mới nhất
            </h3>
            <Link to="/materials" className="text-xs font-bold text-brand-400 hover:underline">
              Xem tất cả (Menu Thư Mục Học Liệu) →
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { title: 'GIÁO ÁN TA 7(GLOBAL) - BÀI 4', sub: 'Tiếng Anh • Lớp 7', price: '50.000đ', downloads: '0 tải' },
              { title: 'GIÁO ÁN TA 7(GLOBAL) - BÀI 3', sub: 'Tiếng Anh • Lớp 7', price: '50.000đ', downloads: '3 tải' },
              { title: 'GIÁO ÁN TA 7(GLOBAL) - BÀI 2', sub: 'Tiếng Anh • Lớp 7', price: '50.000đ', downloads: '1 tải' }
            ].map((item, idx) => (
              <Link key={idx} to="/materials" className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 hover:border-brand-500/50 transition-all block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-brand-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white">{item.title}</h4>
                    <span className="text-[11px] text-slate-400">{item.sub}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-rose-400 block">{item.price}</span>
                  <span className="text-[10px] text-slate-400 font-medium">📥 {item.downloads}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-black text-white flex items-center gap-2 border-l-4 border-rose-500 pl-3">
              <Rocket className="w-5 h-5 text-rose-400" />
              Hội chợ Project nổi bật 🚀
            </h3>
            <Link to="/games" className="text-xs font-bold text-rose-400 hover:underline">
              Xem tất cả (Menu Sân Trường Tương Tác) →
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { title: 'PROJECT: VÒNG ĐỜI VÀ MÔI TRƯỜNG SỐNG', sub: 'Interactive Project • Bởi ' + authorName, price: '10.000đ' },
              { title: 'BỘ TRÒ CHƠI FLASHCARD TỪ VỰNG TIẾNG ANH', sub: 'Flashcard Game • Bởi ' + authorName, price: '10.000đ' },
              { title: 'TRÒ CHƠI GHÉP CẶP TỪ & HÌNH ẢNH GLOBAL SUCCESS', sub: 'Matching Game • Bởi ' + authorName, price: '20.000đ' }
            ].map((item, idx) => (
              <Link key={idx} to="/games" className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 hover:border-rose-500/50 transition-all block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-rose-400 shrink-0">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white">{item.title}</h4>
                    <span className="text-[11px] text-slate-400">{item.sub}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-rose-400 block">{item.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
