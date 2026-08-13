import React, { useState, useEffect } from 'react';
import { X, Image, Wand2, Upload, FileText, Code, CheckCircle2, Sparkles, Volume2, Link as LinkIcon } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { cmsStorage } from '../../utils/cmsStorage';

export const ArticleEditorModal = ({ articleToEdit, categoryKey, onClose, onSaved }) => {
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

  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState(categoryKey || 'vocabulary');
  const [formGrade, setFormGrade] = useState(8);
  const [formUnit, setFormUnit] = useState('Unit 1');
  const [formThumbnail, setFormThumbnail] = useState(presetAiThumbnails[0].url);
  const [formDescription, setFormDescription] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formAudioUrl, setFormAudioUrl] = useState('');
  const [formFileUrl, setFormFileUrl] = useState('');

  useEffect(() => {
    if (articleToEdit) {
      setFormTitle(articleToEdit.title || '');
      setFormCategory(articleToEdit.category || categoryKey || 'vocabulary');
      setFormGrade(articleToEdit.grade || 8);
      setFormUnit(articleToEdit.unit || 'Unit 1');
      setFormThumbnail(articleToEdit.thumbnail || presetAiThumbnails[0].url);
      setFormDescription(articleToEdit.description || '');
      setFormContent(articleToEdit.content || '');
      setFormAudioUrl(articleToEdit.audioUrl || '');
      setFormFileUrl(articleToEdit.fileUrl || '');
    }
  }, [articleToEdit, categoryKey]);

  const handleAutoGenerateAiThumbnail = () => {
    soundFX.playClick();
    const randomImg = presetAiThumbnails[Math.floor(Math.random() * presetAiThumbnails.length)].url;
    setFormThumbnail(randomImg);
    alert('✨ AI đã sinh xong 1 bức ảnh bìa 3D Pixar cute cho bài viết của Thầy!');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Vui lòng nhập Tiêu đề bài viết!');
      return;
    }

    soundFX.playClick();

    const catKey = (formCategory || 'vocabulary').toLowerCase();
    const articlePayload = {
      id: articleToEdit?.id || `art-custom-${Date.now()}`,
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

    soundFX.playFanfare();
    confetti({ particleCount: 120, spread: 80 });

    alert(`✨ ĐÃ LƯU & XUẤT BẢN BÀI VIẾT THÀNH CÔNG RÀ TRANG CHỦ VÀ TRANG DẠNH MỤC ${catKey.toUpperCase()}!`);
    if (onSaved) onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-slate-900 space-y-6 shadow-2xl relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-indigo-600" />
            {articleToEdit ? 'Chỉnh Sửa Bài Viết & Đổi Ảnh Bìa AI' : 'Đăng Bài Viết Mới Màn Hình Trang Chủ & Danh Mục'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI THUMBNAIL SELECTOR BOX */}
        <div className="space-y-3 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-extrabold text-indigo-900 flex items-center gap-1.5">
              <Image className="w-4 h-4 text-indigo-600" />
              CHỌN ẢNH BÌA AI 3D PIXAR CUTE HOẶC DÁN LINK ẢNH TÙY CHỌN:
            </label>
            <button
              type="button"
              onClick={handleAutoGenerateAiThumbnail}
              className="px-3 py-1.5 rounded-full bg-indigo-600 text-white font-extrabold text-[10px] flex items-center gap-1 shadow hover:bg-indigo-500"
            >
              <Wand2 className="w-3 h-3" /> ✨ AI Tự Tạo Ảnh
            </button>
          </div>

          {/* Preset Gallery */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
            {presetAiThumbnails.map((preset, pIdx) => (
              <button
                type="button"
                key={pIdx}
                onClick={() => {
                  soundFX.playClick();
                  setFormThumbnail(preset.url);
                }}
                className={`h-16 rounded-xl overflow-hidden border-2 relative transition-all ${
                  formThumbnail === preset.url ? 'border-indigo-600 scale-105 shadow-md' : 'border-slate-300 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                {formThumbnail === preset.url && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-1">
            <span className="text-[10px] text-slate-500 font-semibold block mb-1">DÁN LINK ẢNH TÙY CHỌN BÊN NGOÀI:</span>
            <input
              type="url"
              value={formThumbnail}
              onChange={(e) => setFormThumbnail(e.target.value)}
              placeholder="https://link-anh-bia-cua-thay.jpg"
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
            />
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
          
          <div>
            <label className="block text-slate-700 mb-1">TIÊU ĐỀ BÀI VIẾT / BÀI HỌC *</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Ví dụ: Mẹo & Từ Vựng Cốt Lõi Khối 8 Unit 1..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 mb-1">DANH MỤC</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-white font-bold"
              >
                <option value="vocabulary">VOCABULARY (Từ vựng)</option>
                <option value="grammar">GRAMMAR (Ngữ pháp)</option>
                <option value="audio">AUDIO (File nghe/Tapescript)</option>
                <option value="infographic">INFOGRAPHIC (Trực quan)</option>
                <option value="project">PROJECT (iFrame Game)</option>
                <option value="worksheet">WORKSHEET (Phiếu bài tập)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">KHỐI LỚP</label>
              <select
                value={formGrade}
                onChange={(e) => setFormGrade(parseInt(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-white font-bold"
              >
                <option value={6}>Khối 6</option>
                <option value={7}>Khối 7</option>
                <option value={8}>Khối 8</option>
                <option value={9}>Khối 9</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">UNIT</label>
              <input
                type="text"
                value={formUnit}
                onChange={(e) => setFormUnit(e.target.value)}
                placeholder="Unit 1, Unit 2..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-1">MÔ TẢ TÓM TẮT BÀI VIẾT (HIỂN THỊ THẺ CARD)</label>
            <input
              type="text"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Tóm tắt ngắn 1-2 câu về nội dung bài viết..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">NỘI DUNG CHI TIẾT BÀI VIẾT (VĂN BẢN / HTML / KỊCH BẢN)</label>
            <textarea
              rows={6}
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Dán hoặc soạn nội dung chi tiết bài viết, phiên âm từ vựng, kịch bản nghe hay công thức ngữ pháp..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-serif leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 mb-1">LINK AUDIO GOOGLE DRIVE / MP3 (NẾU CÓ)</label>
              <input
                type="url"
                value={formAudioUrl}
                onChange={(e) => setFormAudioUrl(e.target.value)}
                placeholder="https://drive.google.com/... hoặc link MP3"
                className="w-full p-3 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">LINK FILE ĐÍNH KÈM WORD/PDF/PROJECT (NẾU CÓ)</label>
              <input
                type="url"
                value={formFileUrl}
                onChange={(e) => setFormFileUrl(e.target.value)}
                placeholder="https://link-file-tailieu.docx"
                className="w-full p-3 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-xl flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            {articleToEdit ? '✨ LƯU THAY ĐỔI BÀI VIẾT' : '✨ LƯU & XUẤT BẢN BÀI VIẾT RA TRANG CHỦ'}
          </button>
        </form>

      </div>
    </div>
  );
};
