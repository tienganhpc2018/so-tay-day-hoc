import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { soundFX } from '../utils/soundEffects';
import { supabase } from '../lib/supabase';
import { cmsStorage } from '../utils/cmsStorage';
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
  Rocket,
  Headphones,
  FileCheck
} from 'lucide-react';

export const HomePage = () => {
  const { profile } = useAuth();
  const authorName = profile?.full_name || 'Nguyễn Văn Hải';
  const currentDateStr = new Date().toLocaleDateString('vi-VN');

  const [categoryBlocks, setCategoryBlocks] = useState([]);

  useEffect(() => {
    fetchHomeArticles();
  }, []);

  const categoryConfigs = [
    { key: 'vocabulary', label: 'VOCABULARY', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', defaultTitle: 'Mẹo & Từ Vựng Cốt Lõi Khối 6 • 7 • 8 • 9 Global Success', defaultImg: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop' },
    { key: 'grammar', label: 'GRAMMAR', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', defaultTitle: 'Chủ Điểm Ngữ Pháp Trọng Tâm 12 Units Tiếng Anh THCS', defaultImg: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop' },
    { key: 'audio', label: 'AUDIO', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40', defaultTitle: 'Trọn Bộ Tapescript & File Audio Luyện Nghe Tiếng Anh THCS', defaultImg: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop' },
    { key: 'infographic', label: 'INFOGRAPHIC', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', defaultTitle: 'Tuyển Tập Infographic Kiến Thức Tiếng Anh THCS Trực Quan', defaultImg: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop' },
    { key: 'project', label: 'PROJECT', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40', defaultTitle: 'Hướng Dẫn Thiết Kế iFrame Game & Project Tương Tác', defaultImg: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop' },
    { key: 'worksheet', label: 'WORKSHEET', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', defaultTitle: 'Bộ Phiếu Bài Tập 4 Kỹ Năng Tích Hợp AI Chấm Điểm & Nhắc Lỗi', defaultImg: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=600&auto=format&fit=crop' }
  ];

  const fetchHomeArticles = () => {
    try {
      const cmsArticles = cmsStorage.getAllArticles() || [];

      const mappedBlocks = categoryConfigs.map(config => {
        const catArticles = cmsArticles.filter(a => (a.category || '').toLowerCase() === config.key);
        catArticles.sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0));

        const mainArticle = catArticles.length > 0 ? catArticles[0] : {
          id: `default-${config.key}`,
          title: config.defaultTitle,
          thumbnail: config.defaultImg,
          description: 'Bài viết hướng dẫn học liệu bám sát chương trình Tiếng Anh THCS Global Success.',
          author: authorName,
          categoryLabel: config.label,
          category: config.key
        };

        const previousArticles = catArticles.slice(1, 3);

        return {
          key: config.key,
          badgeLabel: config.label,
          badgeColor: config.color,
          mainArticle,
          previousArticles
        };
      });

      setCategoryBlocks(mappedBlocks);
    } catch (err) {
      console.error('Error fetching home articles:', err);
    }
  };

  // 6 BOXES WITH 6 DISTINCT CATEGORY BADGES: VOCABULARY, GRAMMAR, AUDIO, INFOGRAPHIC, PROJECT, WORKSHEET
  const defaultArticles = [
    {
      id: 1,
      title: 'Mẹo & Từ Vựng Cốt Lõi Khối 6 • 7 • 8 • 9 Global Success',
      category: 'VOCABULARY',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      date: currentDateStr,
      description: 'Tổng hợp trọn bộ Từ vựng Word Bank kèm phát âm audio bám sát sách giáo khoa.',
      author: authorName,
      link: '/materials?type=vocabulary'
    },
    {
      id: 2,
      title: 'Chủ Điểm Ngữ Pháp Trọng Tâm 12 Units Tiếng Anh THCS',
      category: 'GRAMMAR',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      date: currentDateStr,
      description: 'Tổng hợp công thức, ví dụ loại trừ đáp án sai và ma trận ngữ pháp kiểm tra định kỳ.',
      author: authorName,
      link: '/materials?type=grammar'
    },
    {
      id: 3,
      title: 'Trọn Bộ Tapescript & File Audio Luyện Nghe Tiếng Anh THCS',
      category: 'AUDIO',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      date: currentDateStr,
      description: 'File âm thanh chuẩn mono tích hợp icon cái loa cho từng phần nghe chuẩn thời lượng.',
      author: authorName,
      link: '/worksheet?sec=listening'
    },
    {
      id: 4,
      title: 'Tuyển Tập Infographic Kiến Thức Tiếng Anh THCS Trực Quan',
      category: 'INFOGRAPHIC',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      date: currentDateStr,
      description: 'Hình ảnh Infographic tóm tắt ngữ pháp giúp học sinh dễ nhớ bài học trực quan.',
      author: authorName,
      link: '/materials?type=infographic'
    },
    {
      id: 5,
      title: 'Hướng Dẫn Thiết Kế iFrame Game & Project Tương Tác',
      category: 'PROJECT',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      date: currentDateStr,
      description: 'Tích hợp các trò chơi ghép cặp, trắc nghiệm và flashcards vào tiết dạy trên lớp.',
      author: authorName,
      link: '/games'
    },
    {
      id: 6,
      title: 'Bộ Phiếu Bài Tập 4 Kỹ Năng Tích Hợp AI Chấm Điểm & Nhắc Lỗi',
      category: 'WORKSHEET',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      date: currentDateStr,
      description: 'Phiếu làm bài 4 kỹ năng Listening, Speaking, Reading, Writing có đáp án cho GV.',
      author: authorName,
      link: '/worksheet'
    }
  ];

  const displayArticles = articles.length >= 6 ? articles : defaultArticles;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 font-sans animate-fadeIn">
      
      {/* 1. TOP HERO BANNER WITH VIBRANT AI CLASSROOM BACKGROUND */}
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

        {/* 6 CATEGORY BOXES WITH REAL THUMBNAIL AND 2 PREVIOUS ARTICLES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryBlocks.map((block, bIdx) => (
            <div 
              key={bIdx} 
              className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 overflow-hidden transition-all group shadow-xl backdrop-blur-sm flex flex-col justify-between"
            >
              <div>
                {/* THUMBNAIL IMAGE FROM ORIGINAL ARTICLE */}
                <Link to={block.mainArticle.id && !block.mainArticle.id.toString().startsWith('default-') ? `/materials?id=${block.mainArticle.id}` : `/materials?type=${block.key}`} className="block relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={block.mainArticle.thumbnail || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop'}
                    alt={block.mainArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full font-black text-[11px] border uppercase shadow ${block.badgeColor}`}>
                    {block.badgeLabel}
                  </span>
                  <span className="absolute bottom-3 right-3 text-[10px] font-extrabold text-slate-200 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80">
                    📅 {block.mainArticle.createdAt ? new Date(block.mainArticle.createdAt).toLocaleDateString('vi-VN') : currentDateStr}
                  </span>
                </Link>

                <div className="p-5 space-y-3">
                  <Link to={block.mainArticle.id && !block.mainArticle.id.toString().startsWith('default-') ? `/materials?id=${block.mainArticle.id}` : `/materials?type=${block.key}`} className="block">
                    <h3 className="text-base font-extrabold text-white group-hover:text-brand-300 line-clamp-2 leading-snug">
                      {block.mainArticle.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {block.mainArticle.description || (block.mainArticle.content ? block.mainArticle.content.replace(/<[^>]*>?/gm, '').slice(0, 110) : 'Bài viết hướng dẫn học liệu bám sát chương trình Tiếng Anh THCS Global Success.')}
                  </p>

                  {/* 2 PREVIOUS ARTICLES BELOW MAIN ARTICLE */}
                  {block.previousArticles && block.previousArticles.length > 0 && (
                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <p className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">📚 Bài viết trước đó:</p>
                      {block.previousArticles.map((prev, pIdx) => (
                        <Link
                          key={pIdx}
                          to={`/materials?id=${prev.id}`}
                          className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-amber-300 transition-colors truncate"
                        >
                          <span className="text-indigo-400 text-xs shrink-0">📌</span>
                          <span className="truncate">{prev.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between text-xs font-bold text-slate-400 mt-auto">
                <span>Tác giả: {block.mainArticle.author || authorName}</span>
                <Link 
                  to={block.mainArticle.id && !block.mainArticle.id.toString().startsWith('default-') ? `/materials?id=${block.mainArticle.id}` : `/materials?type=${block.key}`} 
                  className="text-indigo-400 group-hover:underline flex items-center gap-1"
                >
                  Đọc tiếp →
                </Link>
              </div>
            </div>
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
