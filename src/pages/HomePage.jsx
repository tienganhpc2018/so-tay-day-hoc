import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFX } from '../utils/soundEffects';
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
  FileText
} from 'lucide-react';

export const HomePage = () => {
  const { profile } = useAuth();

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 font-sans animate-fadeIn">
      
      {/* 1. TOP HERO BANNER (CURVED CORNERS MATCHING SCREENSHOT 1) */}
      <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-brand-500/40 p-8 sm:p-12 shadow-2xl">
        {/* Decorative Background Artwork */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-400 via-indigo-500 to-transparent" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-brand-400" />
              SỔ TAY DẠY HỌC THCS • GLOBAL SUCCESS
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Chào mừng trở lại, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-indigo-200 to-amber-300">{profile?.full_name || 'Thầy/Cô'}</span>! 👋
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
              Khám phá nền tảng giáo dục thông minh với đầy đủ công cụ quản lý chuyên môn, trò chơi tương tác, ngân hàng đề thi bám sát ma trận CV7991 và thư viện tài liệu phong phú.
            </p>

            {/* Quick Links inside Hero Banner */}
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
          </div>

          {/* Right VIP Badge Button */}
          <div className="shrink-0">
            <div className="px-6 py-3.5 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 text-amber-300 font-black text-sm flex items-center gap-2.5 shadow-xl backdrop-blur-md animate-pulse">
              <Crown className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>👑 Đặc quyền VIP Giáo Viên</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. VIP BẢNG VÀNG CARDS (YELLOW BORDER MATCHING SCREENSHOT 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CARD 1: BẢNG VÀNG 01 - ĐỐI TÁC VÀNG GIÁO DỤC */}
        <div className="rounded-[28px] bg-slate-900/90 border-2 border-amber-400 p-6 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-300 font-black text-lg">
                👑
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-white">Nguyễn Thành Được</h3>
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px]">VIP</span>
                </div>
                <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">ĐỐI TÁC VÀNG GIÁO DỤC</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 text-xs font-black">
              BẢNG VÀNG 01
            </span>
          </div>

          {/* 4 Inner Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'Bộ 100 TRÒ CHƠI PowerPoint MIỄN PHÍ', tag: 'Miễn phí', color: 'text-emerald-400' },
              { title: 'BỘ 155 SLIDE PPT CÁC LOẠI MIỄN PHÍ', tag: 'Miễn phí', color: 'text-emerald-400' },
              { title: 'Bộ 65 slide PowerPoint nhiều chủ đề cực hay...', tag: 'Miễn phí', color: 'text-emerald-400' },
              { title: 'BỘ 30 SLIDE POWERPOINT ĐẸP - Nhiều mẫu đ...', tag: 'Miễn phí', color: 'text-emerald-400' }
            ].map((sub, sIdx) => (
              <div key={sIdx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 hover:border-amber-400/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 text-amber-400">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-extrabold text-slate-200 truncate">{sub.title}</h4>
                  <span className={`text-[10px] font-bold ${sub.color}`}>{sub.tag}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Card Footer Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-slate-400 italic">★ Quảng cáo đối tác VIP nổi bật</span>
            <button className="px-5 py-2 rounded-xl bg-slate-950 text-white font-extrabold text-xs border border-slate-700 flex items-center gap-2 hover:bg-slate-800">
              <span>🎥 Đăng ký vị trí VIP</span>
            </button>
          </div>

          <div className="absolute -bottom-3 -left-3">
            <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs shadow-lg">
              ✨ Hiển thị thương hiệu của bạn tại đây!
            </span>
          </div>
        </div>

        {/* CARD 2: BẢNG VÀNG 02 - GIÁO TRÌNH STEM ĐỀ CỬ VIP */}
        <div className="rounded-[28px] bg-slate-900/90 border-2 border-amber-400 p-6 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 font-black text-lg">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-white">Học liệu STEM trọn gói</h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px]">HOT</span>
                </div>
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">GIÁO TRÌNH STEM ĐỀ CỬ VIP</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 text-xs font-black">
              BẢNG VÀNG 02
            </span>
          </div>

          {/* 4 Inner Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'GIÁO ÁN 7(NLS+AI) - BÀI 4', price: '50.000đ' },
              { title: 'GIÁO ÁN 7(NLS+AI) - BÀI 3', price: '50.000đ' },
              { title: 'GIÁO ÁN 7(NLS+AI) - BÀI 2', price: '50.000đ' },
              { title: 'GIÁO ÁN 7(NLS+AI) - BÀI 1', price: '50.000đ' }
            ].map((sub, sIdx) => (
              <div key={sIdx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 hover:border-emerald-400/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 text-emerald-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-extrabold text-slate-200 truncate">{sub.title}</h4>
                  <span className="text-[11px] font-extrabold text-rose-400">{sub.price}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Card Footer Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-slate-400 italic">★ Quảng cáo sản phẩm VIP nổi bật</span>
            <button className="px-5 py-2 rounded-xl bg-slate-950 text-white font-extrabold text-xs border border-slate-700 flex items-center gap-2 hover:bg-slate-800">
              <span>🎥 Đăng ký vị trí VIP</span>
            </button>
          </div>

          <div className="absolute -bottom-3 -left-3">
            <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-black text-xs shadow-lg">
              ✨ Hiển thị sản phẩm của bạn tại đây!
            </span>
          </div>
        </div>

      </div>

      {/* 3. BẢNG TIN TRƯỜNG HỌC MỚI NHẤT (MATCHING SCREENSHOT 2) */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xl font-black text-white flex items-center gap-2 border-l-4 border-indigo-500 pl-3">
            <Newspaper className="w-6 h-6 text-indigo-400" />
            Bảng tin Trường học mới nhất 📰
          </h2>

          <Link to="/materials" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2 Big News Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* News 1 */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-all group shadow-xl">
            <div className="h-44 bg-gradient-to-r from-amber-600 via-indigo-900 to-slate-900 flex items-center justify-center relative p-6">
              <span className="text-2xl font-black text-white tracking-widest text-center uppercase">
                LÀM ĐẠI VIỆT
              </span>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-extrabold border border-indigo-500/30">
                  TIN TỨC
                </span>
                <span className="text-slate-400">28/8/2026</span>
              </div>
              <h3 className="text-base font-extrabold text-white group-hover:text-brand-300">
                Mẹo - hướng dẫn mẹo phần Viết bài KS năng lực TA cho giáo viên
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                Bài hướng dẫn mẹo khảo sát năng lực Tiếng Anh cho giáo viên phần Viết bám sát chương trình THCS.
              </p>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-2 border-t border-slate-800">
                <span>Tác giả: Nguyễn Thành Được</span>
                <span className="text-indigo-400 group-hover:underline">Đọc tiếp →</span>
              </div>
            </div>
          </div>

          {/* News 2 */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-all group shadow-xl">
            <div className="h-44 bg-gradient-to-r from-red-600 via-amber-700 to-slate-900 flex items-center justify-center relative p-6">
              <span className="text-2xl font-black text-white tracking-widest text-center uppercase">
                MỪNG KHAI TRƯƠNG X2 ĐIỂM
              </span>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 font-extrabold border border-rose-500/30">
                  THÔNG BÁO
                </span>
                <span className="text-slate-400">26/8/2026</span>
              </div>
              <h3 className="text-base font-extrabold text-white group-hover:text-brand-300">
                Mừng ngày khai trương - tặng X2 điểm số
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                Mừng ngày khai trương - tặng X2 điểm số cho 100% thành viên tham gia làm bài kiểm tra tích điểm Sao.
              </p>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-2 border-t border-slate-800">
                <span>Tác giả: Nguyễn Thành Được</span>
                <span className="text-indigo-400 group-hover:underline">Đọc tiếp →</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. THƯ VIỆN HỌC LIỆU MỚI NHẤT & HỘI CHỢ SẢN PHẨM NỔI BẬT (MATCHING SCREENSHOT 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        
        {/* LEFT COLUMN: Thư viện Học liệu mới nhất */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-black text-white flex items-center gap-2 border-l-4 border-brand-500 pl-3">
              <BookOpen className="w-5 h-5 text-brand-400" />
              Thư viện Học liệu mới nhất
            </h3>
            <Link to="/materials" className="text-xs font-bold text-brand-400 hover:underline">
              Xem tất cả →
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { title: 'GIÁO ÁN 7(NLS+AI) - BÀI 4', sub: 'Ngữ Văn • Lớp 7', price: '50.000đ', downloads: '0 tải' },
              { title: 'GIÁO ÁN 7(NLS+AI) - BÀI 3', sub: 'Ngữ Văn • Lớp 7', price: '50.000đ', downloads: '3 tải' },
              { title: 'GIÁO ÁN 7(NLS+AI) - BÀI 2', sub: 'Ngữ Văn • Lớp 7', price: '50.000đ', downloads: '1 tải' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 hover:border-brand-500/50 transition-all">
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
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Hội chợ Sản phẩm nổi bật */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-black text-white flex items-center gap-2 border-l-4 border-rose-500 pl-3">
              <ShoppingBag className="w-5 h-5 text-rose-400" />
              Hội chợ Sản phẩm nổi bật
            </h3>
            <Link to="/games" className="text-xs font-bold text-rose-400 hover:underline">
              Xem tất cả →
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { title: 'VIDEO: VÒNG ĐỜI ẾCH', sub: 'video • Bởi Nguyễn Thị Mỹ Trang', price: '10.000đ' },
              { title: 'TRUYỆN TRANH TRINH THÁM: BỘ BA PHÁ SND', sub: 'ebooks • Bởi Nguyễn Thị Mỹ Trang', price: '10.000đ' },
              { title: 'Video Trái Đất kêu cứu Lớp 3', sub: 'video • Bởi Phí Thảo Nguyễn Thị', price: '20.000đ' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 hover:border-rose-500/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-rose-400 shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white">{item.title}</h4>
                    <span className="text-[11px] text-slate-400">{item.sub}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-rose-400 block">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
