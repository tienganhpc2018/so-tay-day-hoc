import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { cmsStorage } from '../utils/cmsStorage';
import { ArticleEditorModal } from '../components/material/ArticleEditorModal';
import { 
  BookOpen, 
  BookMarked, 
  Brain, 
  Volume2, 
  Image as ImageIcon, 
  Gamepad2, 
  Edit3, 
  CheckCircle2, 
  Plus, 
  Eye, 
  Trash2, 
  Sparkles, 
  X,
  FileText,
  Download,
  Calendar,
  UserCheck
} from 'lucide-react';

export const MaterialPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTypeParam = searchParams.get('type') || 'vocabulary';

  const [activeCategory, setActiveCategory] = useState(activeTypeParam);
  const [selectedGrade, setSelectedGrade] = useState(8);
  const [articlesList, setArticlesList] = useState([]);

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  // Full Article Reader Modal State
  const [activeReaderArticle, setActiveReaderArticle] = useState(null);

  useEffect(() => {
    if (activeTypeParam) setActiveCategory(activeTypeParam);
  }, [activeTypeParam]);

  // Load articles for the active category
  useEffect(() => {
    loadArticles();
  }, [activeCategory, selectedGrade]);

  const loadArticles = () => {
    const categoryArticles = cmsStorage.getArticlesByCategory(activeCategory);
    // Filter by grade if applicable
    setArticlesList(categoryArticles);
  };

  const handleOpenAddModal = () => {
    soundFX.playClick();
    setEditingArticle(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (article) => {
    soundFX.playClick();
    setEditingArticle(article);
    setIsEditorOpen(true);
  };

  const handleDeleteArticle = (articleId, title) => {
    if (window.confirm(`Thầy có chắc chắn muốn xóa bài viết: "${title}"?`)) {
      soundFX.playClick();
      cmsStorage.deleteArticle(articleId);
      loadArticles();
      alert('✨ Đã xóa bài viết thành công!');
    }
  };

  // Convert Google Drive share link into direct Audio Stream
  const convertDriveUrlToDirectAudio = (urlStr) => {
    if (!urlStr) return '';
    try {
      const driveMatch = urlStr.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (driveMatch && driveMatch[1]) {
        return `https://docs.google.com/uc?export=open&id=${driveMatch[1]}`;
      }
      return urlStr;
    } catch (e) {
      return urlStr;
    }
  };

  // 6 DEDICATED SUB-PAGE CATEGORY TABS
  const subCategoryTabs = [
    { id: 'vocabulary', label: '1. Từ Vựng (Vocabulary)', icon: BookMarked, color: 'text-indigo-400' },
    { id: 'grammar', label: '2. Ngữ Pháp (Grammar)', icon: Brain, color: 'text-amber-400' },
    { id: 'audio', label: '3. Audio & Tapescript', icon: Volume2, color: 'text-purple-400' },
    { id: 'infographic', label: '4. Infographic Trực Quan', icon: ImageIcon, color: 'text-emerald-400' },
    { id: 'project', label: '5. iFrame Game & Project', icon: Gamepad2, color: 'text-rose-400' },
    { id: 'worksheet', label: '6. Phiếu Bài Tập 4 Kỹ Năng', icon: Edit3, color: 'text-teal-400' }
  ];

  const currentTabInfo = subCategoryTabs.find(t => t.id === activeCategory) || subCategoryTabs[0];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* 1. HERO BANNER */}
      <PageHeroBanner
        title="Thư Mục Học Liệu & Quản Lý Bài Viết Tự Tạo 📚"
        subtitle="Soạn mới, chỉnh sửa, đổi ảnh AI 3D Pixar và quản lý danh sách bài viết tự tạo theo từng danh mục bám sát 12 Units SGK Global Success."
        badge="STUDIO SOẠN BÀI • GLOBAL SUCCESS KHỐI 6 - 9"
        bgImage="/images/hero_library_bg.jpg"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> + Đăng Bài Viết Mới Món Này
            </button>

            <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
              {[6, 7, 8, 9].map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedGrade(g);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    selectedGrade === g
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Khối {g}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* 2. 6 SUB-PAGE CATEGORY TABS (LIÊN KẾT CHUẨN 100% VỚI CARD TRANG CHỦ) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl">
        {subCategoryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.playClick();
                if (tab.id === 'worksheet') {
                  navigate('/worksheet');
                } else if (tab.id === 'project') {
                  navigate('/games');
                } else {
                  setActiveCategory(tab.id);
                  setSearchParams({ type: tab.id });
                }
              }}
              className={`p-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg scale-102 border border-brand-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${tab.color}`} />
              <span className="truncate">{tab.label}</span>
              {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* 3. DYNAMIC ARTICLE LIST FOR THE CURRENT CATEGORY */}
      <div className="space-y-6">
        
        {/* CATEGORY HEADER BAR WITH ADD BUTTON */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Trang Con Danh Mục: {currentTabInfo.label}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Hiển thị danh sách các bài viết do Thầy tự biên soạn trong mục này ({articlesList.length} bài viết).
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> + Thêm Bài Viết Cho Mục {activeCategory.toUpperCase()}
          </button>
        </div>

        {/* ARTICLES CARDS GRID */}
        {articlesList.length === 0 ? (
          <div className="glass-panel p-12 text-center text-slate-400 space-y-4">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <div>
              <p className="font-extrabold text-white text-base">Chưa có bài viết nào trong danh mục {currentTabInfo.label}.</p>
              <p className="text-xs text-slate-400 mt-1">Thầy nhấp nút "+ Thêm Bài Viết Mới" ở trên để tạo và đăng bài viết mượt mà!</p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs shadow-md mx-auto"
            >
              + Đăng Bài Viết Đầu Tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articlesList.map((article) => (
              <div 
                key={article.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between group relative"
              >
                <div>
                  {/* Thumbnail Image Header */}
                  <div className="relative h-48 bg-slate-950 overflow-hidden">
                    <img 
                      src={article.thumbnail} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />

                    <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-indigo-600 text-white font-black text-[10px] uppercase shadow">
                      {article.categoryLabel || article.category}
                    </span>

                    {/* Action buttons top right */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(article)}
                        className="p-2 rounded-xl bg-slate-900/90 text-amber-300 hover:text-white hover:bg-slate-800 border border-amber-400/50 text-xs font-bold shadow backdrop-blur-md"
                        title="Chỉnh sửa bài viết & Ảnh AI"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteArticle(article.id, article.title)}
                        className="p-2 rounded-xl bg-slate-900/90 text-rose-400 hover:text-white hover:bg-rose-600 border border-rose-500/50 text-xs font-bold shadow backdrop-blur-md"
                        title="Xóa bài viết"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase">
                      <span>Khối {article.grade || 8} • {article.unit || 'Unit 1'}</span>
                      <span className="text-slate-500">{article.date}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-white group-hover:text-indigo-400 line-clamp-2 leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {article.description}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-3">
                  <span className="text-xs text-slate-400 font-semibold">Tác giả: <strong className="text-slate-200">{article.author}</strong></span>

                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setActiveReaderArticle(article);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> Xem bài viết
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL 1: ARTICLE EDITOR MODAL (SOẠN & SỬA BÀI VIẾT) */}
      {isEditorOpen && (
        <ArticleEditorModal
          articleToEdit={editingArticle}
          categoryKey={activeCategory}
          onClose={() => setIsEditorOpen(false)}
          onSaved={() => loadArticles()}
        />
      )}

      {/* MODAL 2: ARTICLE READER MODAL (XEM CHI TIẾT BÀI VIẾT TỰ BIÊN SOẠN) */}
      {activeReaderArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-4xl w-full border border-slate-800 overflow-hidden shadow-2xl space-y-0 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="p-6 pb-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-black text-[10px] uppercase">
                  {activeReaderArticle.categoryLabel || activeReaderArticle.category}
                </span>
                <h2 className="text-xl font-black text-white mt-1">{activeReaderArticle.title}</h2>
              </div>
              <button 
                onClick={() => setActiveReaderArticle(null)}
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reader Content Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="h-64 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img 
                  src={activeReaderArticle.thumbnail} 
                  alt={activeReaderArticle.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Audio player if audio URL exists */}
              {activeReaderArticle.audioUrl && (
                <div className="p-4 rounded-2xl bg-purple-950/50 border border-purple-500/40 space-y-2">
                  <span className="text-xs font-black text-purple-300 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-purple-400" />
                    FILE ÂM THANH BÀI NGHE AUDIO AUDIO STREAM:
                  </span>
                  <audio controls src={convertDriveUrlToDirectAudio(activeReaderArticle.audioUrl)} className="w-full rounded-xl bg-slate-950" />
                </div>
              )}

              {/* Article Content Render */}
              <div 
                className="text-sm font-serif text-slate-200 leading-relaxed space-y-4 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: activeReaderArticle.content }}
              />

              {/* Attached file link if exists */}
              {activeReaderArticle.fileUrl && (
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-400" /> Tệp tài liệu đính kèm:
                  </span>
                  <a
                    href={activeReaderArticle.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" /> Tải Tệp Về Máy
                  </a>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
