import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { cmsStorage } from '../utils/cmsStorage';
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
  Wand2,
  Image,
  Upload,
  Link as LinkIcon,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export const MaterialPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTypeParam = searchParams.get('type') || 'vocabulary';

  const [activeCategory, setActiveCategory] = useState(activeTypeParam);
  const [selectedGrade, setSelectedGrade] = useState(8);
  const [articlesList, setArticlesList] = useState([]);

  // INLINE EDITOR FORM STATE (DIRECTLY EMBEDDED ON PAGE)
  const [showEditorForm, setShowEditorForm] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState(null);

  const [formTitle, setFormTitle] = useState('');
  const [formGrade, setFormGrade] = useState(8);
  const [formUnit, setFormUnit] = useState('Unit 1');
  const [formThumbnail, setFormThumbnail] = useState('https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop');
  const [formDescription, setFormDescription] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formAudioUrl, setFormAudioUrl] = useState('');
  const [formFileUrl, setFormFileUrl] = useState('');

  // Reader Modal State
  const [activeReaderArticle, setActiveReaderArticle] = useState(null);

  const editorRef = useRef(null);

  const presetAiThumbnails = [
    { title: '3D Pixar Học Sinh Trắc Nghiệm', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop' },
    { title: 'Vòng Quay May Mắn 3D', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop' },
    { title: 'Kéo Co Đấu Trí 3D', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop' },
    { title: 'Chém Hoa Quả AI 3D', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop' },
    { title: 'Mặt Cắt Kỹ Thuật 3D', url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop' },
    { title: 'Hình Học Tương Tác 3D', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop' }
  ];

  const categoryBadgeColors = {
    vocabulary: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    grammar: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    audio: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    infographic: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    project: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    worksheet: 'bg-teal-500/20 text-teal-300 border-teal-500/40'
  };

  useEffect(() => {
    if (activeTypeParam) setActiveCategory(activeTypeParam);
  }, [activeTypeParam]);

  useEffect(() => {
    loadArticles();
  }, [activeCategory, selectedGrade]);

  const loadArticles = () => {
    const categoryArticles = cmsStorage.getArticlesByCategory(activeCategory);
    setArticlesList(categoryArticles);
  };

  const handleStartCreateNew = () => {
    soundFX.playClick();
    setEditingArticleId(null);
    setFormTitle('');
    setFormGrade(selectedGrade);
    setFormUnit('Unit 1');
    setFormThumbnail(presetAiThumbnails[0].url);
    setFormDescription('');
    setFormContent('');
    setFormAudioUrl('');
    setFormFileUrl('');
    setShowEditorForm(true);

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleStartEdit = (article) => {
    soundFX.playClick();
    setEditingArticleId(article.id);
    setFormTitle(article.title || '');
    setFormGrade(article.grade || selectedGrade);
    setFormUnit(article.unit || 'Unit 1');
    setFormThumbnail(article.thumbnail || presetAiThumbnails[0].url);
    setFormDescription(article.description || '');
    setFormContent(article.content || '');
    setFormAudioUrl(article.audioUrl || '');
    setFormFileUrl(article.fileUrl || '');
    setShowEditorForm(true);

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleDeleteArticle = (articleId, title) => {
    if (window.confirm(`Thầy có chắc chắn muốn xóa bài viết: "${title}"?`)) {
      soundFX.playClick();
      cmsStorage.deleteArticle(articleId);
      loadArticles();
      alert('✨ Đã xóa bài viết thành công!');
    }
  };

  const handleSaveArticleForm = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Vui lòng nhập Tiêu đề bài viết!');
      return;
    }

    soundFX.playClick();

    const catKey = (activeCategory || 'vocabulary').toLowerCase();
    const articlePayload = {
      id: editingArticleId || `art-custom-${Date.now()}`,
      title: formTitle,
      category: catKey,
      categoryLabel: catKey.toUpperCase(),
      badgeColor: categoryBadgeColors[catKey] || categoryBadgeColors.vocabulary,
      grade: formGrade,
      unit: formUnit,
      author: 'Thầy Nguyễn Văn Hải',
      thumbnail: formThumbnail,
      description: formDescription || 'Bài viết hướng dẫn bám sát sách giáo khoa Tiếng Anh THCS Global Success.',
      content: formContent || '<p>Nội dung bài viết đang được cập nhật...</p>',
      audioUrl: formAudioUrl,
      fileUrl: formFileUrl
    };

    cmsStorage.saveArticle(articlePayload);
    loadArticles();

    soundFX.playFanfare();
    confetti({ particleCount: 150, spread: 90 });

    alert(`✨ ĐÃ LƯU & XUẤT BẢN BÀI VIẾT THÀNH CÔNG RÀ TRANG CHỦ VÀ MỤC ${catKey.toUpperCase()}!`);
    setShowEditorForm(false);
  };

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
        title="Thư Mục Học Liệu & Studio Soạn Bài Động 📚"
        subtitle="Quản lý, soạn mới, sửa bài và đổi ảnh AI 3D Pixar cho 6 danh mục bài học Tiếng Anh THCS Global Success."
        badge="STUDIO SOẠN BÀI • GLOBAL SUCCESS KHỐI 6 - 9"
        bgImage="/images/hero_library_bg.jpg"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleStartCreateNew}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> + Soạn Bài Viết Mới Cho Mục Này
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

      {/* 2. 6 CATEGORY SUB-TABS */}
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

      {/* 3. INLINE EDITOR FORM PANEL (ALWAYS AVAILABLE RIGHT ON PAGE WHEN CLICKED) */}
      {showEditorForm && (
        <div ref={editorRef} className="glass-panel p-6 sm:p-8 space-y-6 border-2 border-indigo-500/60 bg-slate-900/95 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-indigo-400" />
              {editingArticleId ? `KHUNG CHỈNH SỬA BÀI VIẾT: ${formTitle}` : `KHUNG SOẠN BÀI VIẾT MỚI CHO MỤC ${activeCategory.toUpperCase()}`}
            </h3>
            <button
              onClick={() => setShowEditorForm(false)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Đóng khung soạn
            </button>
          </div>

          <form onSubmit={handleSaveArticleForm} className="space-y-4 text-xs font-bold">
            
            {/* AI Pixar Cover Gallery Selector */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-indigo-400 flex items-center gap-1.5">
                  <Image className="w-4 h-4" /> CHỌN ẢNH BÌA AI 3D PIXAR CUTE HOẶC DÁN LINK ẢNH TÙY CHỌN:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    const rand = presetAiThumbnails[Math.floor(Math.random() * presetAiThumbnails.length)].url;
                    setFormThumbnail(rand);
                  }}
                  className="px-3 py-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold flex items-center gap-1"
                >
                  <Wand2 className="w-3 h-3" /> ✨ AI Tự Tạo Ảnh
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {presetAiThumbnails.map((preset, pIdx) => (
                  <button
                    type="button"
                    key={pIdx}
                    onClick={() => {
                      soundFX.playClick();
                      setFormThumbnail(preset.url);
                    }}
                    className={`h-16 rounded-xl overflow-hidden border-2 relative transition-all ${
                      formThumbnail === preset.url ? 'border-indigo-500 scale-105 shadow-md' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <input
                type="url"
                value={formThumbnail}
                onChange={(e) => setFormThumbnail(e.target.value)}
                placeholder="https://link-anh-bia-cua-thay.jpg"
                className="w-full glass-input p-2.5 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">TIÊU ĐỀ BÀI VIẾT / BÀI HỌC *</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài viết..."
                className="w-full glass-input p-3 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">KHỐI LỚP</label>
                <select
                  value={formGrade}
                  onChange={(e) => setFormGrade(parseInt(e.target.value))}
                  className="w-full glass-input p-3 text-xs bg-slate-900"
                >
                  <option value={6}>Khối 6</option>
                  <option value={7}>Khối 7</option>
                  <option value={8}>Khối 8</option>
                  <option value={9}>Khối 9</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">UNIT</label>
                <input
                  type="text"
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value)}
                  placeholder="Unit 1, Unit 2..."
                  className="w-full glass-input p-3 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">MÔ TẢ TÓM TẮT BÀI VIẾT</label>
              <input
                type="text"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Tóm tắt ngắn bài viết..."
                className="w-full glass-input p-3 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">NỘI DUNG CHI TIẾT BÀI VIẾT (VĂN BẢN / HTML / KỊCH BẢN)</label>
              <textarea
                rows={6}
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Dán hoặc soạn nội dung chi tiết bài viết tại đây..."
                className="w-full glass-input p-3 text-xs font-serif leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">LINK AUDIO GOOGLE DRIVE / MP3 (NẾU CÓ)</label>
                <input
                  type="url"
                  value={formAudioUrl}
                  onChange={(e) => setFormAudioUrl(e.target.value)}
                  placeholder="https://drive.google.com/... hoặc link MP3"
                  className="w-full glass-input p-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">LINK FILE ĐÍNH KÈM WORD/PDF/PROJECT (NẾU CÓ)</label>
                <input
                  type="url"
                  value={formFileUrl}
                  onChange={(e) => setFormFileUrl(e.target.value)}
                  placeholder="https://link-file-tailieu.docx"
                  className="w-full glass-input p-3 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              {editingArticleId ? '✨ LƯU THAY ĐỔI BÀI VIẾT' : '✨ LƯU & XUẤT BẢN BÀI VIẾT RA TRANG CHỦ'}
            </button>

          </form>
        </div>
      )}

      {/* 4. DYNAMIC ARTICLE CARDS LIST */}
      <div className="space-y-6">
        
        {/* Category Header */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Danh Mục: {currentTabInfo.label}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Danh sách {articlesList.length} bài viết do Thầy tự soạn trong danh mục này.
              </p>
            </div>
          </div>

          <button
            onClick={handleStartCreateNew}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> + Soạn Bài Viết Mới
          </button>
        </div>

        {/* Cards Grid */}
        {articlesList.length === 0 ? (
          <div className="glass-panel p-12 text-center text-slate-400 space-y-4">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <div>
              <p className="font-extrabold text-white text-base">Chưa có bài viết nào trong mục {currentTabInfo.label}.</p>
              <p className="text-xs text-slate-400 mt-1">Thầy nhấp nút "+ Soạn Bài Viết Mới" ở trên để mở ngay Khung soạn thảo mượt mà!</p>
            </div>

            <button
              onClick={handleStartCreateNew}
              className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs shadow-md mx-auto"
            >
              + Soạn Bài Viết Đầu Tiên
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
                        onClick={() => handleStartEdit(article)}
                        className="p-2.5 rounded-xl bg-slate-900/90 text-amber-300 hover:text-white hover:bg-slate-800 border border-amber-400/50 text-xs font-bold shadow backdrop-blur-md flex items-center gap-1"
                        title="Sửa bài viết"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteArticle(article.id, article.title)}
                        className="p-2.5 rounded-xl bg-slate-900/90 text-rose-400 hover:text-white hover:bg-rose-600 border border-rose-500/50 text-xs font-bold shadow backdrop-blur-md"
                        title="Xóa bài viết"
                      >
                        <Trash2 className="w-4 h-4" />
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

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(article)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1 hover:bg-amber-500 hover:text-slate-950"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Sửa
                    </button>

                    <button
                      onClick={() => {
                        soundFX.playClick();
                        setActiveReaderArticle(article);
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> Xem bài
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Reader Modal */}
      {activeReaderArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-4xl w-full border border-slate-800 overflow-hidden shadow-2xl space-y-0 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
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

            <div className="p-6 sm:p-8 space-y-6">
              <div className="h-64 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img 
                  src={activeReaderArticle.thumbnail} 
                  alt={activeReaderArticle.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {activeReaderArticle.audioUrl && (
                <div className="p-4 rounded-2xl bg-purple-950/50 border border-purple-500/40 space-y-2">
                  <span className="text-xs font-black text-purple-300 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-purple-400" />
                    FILE ÂM THANH BÀI NGHE AUDIO AUDIO STREAM:
                  </span>
                  <audio controls src={activeReaderArticle.audioUrl} className="w-full rounded-xl bg-slate-950" />
                </div>
              )}

              <div 
                className="text-sm font-serif text-slate-200 leading-relaxed space-y-4 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: activeReaderArticle.content }}
              />

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
