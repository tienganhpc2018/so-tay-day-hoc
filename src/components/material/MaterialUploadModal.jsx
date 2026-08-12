import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { supabase } from '../../lib/supabase';
import { soundFX } from '../../utils/soundEffects';
import { Upload, Link as LinkIcon, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const MaterialUploadModal = ({ isOpen, onClose, categories, selectedGrade, onUploadSuccess }) => {
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [fileType, setFileType] = useState('pdf');
  const [fileUrl, setFileUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryId || !title || !fileUrl) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { error: insertError } = await supabase.from('materials').insert([
        {
          category_id: categoryId,
          title,
          file_type: fileType,
          file_url: fileUrl,
          uploader_id: userData?.user?.id || null
        }
      ]);

      if (insertError) throw insertError;

      soundFX.playCorrect();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        onUploadSuccess();
      }, 1200);
    } catch (err) {
      soundFX.playWrong();
      setError(err.message || 'Lỗi tải học liệu lên hệ thống');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Tải Học Liệu Mới - Khối ${selectedGrade}`}>
      {success ? (
        <div className="py-8 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
          <h3 className="text-xl font-bold text-white">Tải Học Liệu Thành Công!</h3>
          <p className="text-sm text-slate-300">Đã cập nhật bài học vào cây học liệu.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Chọn Bài Học (Unit / Lesson) <span className="text-rose-400">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full glass-input"
              required
            >
              <option value="" className="bg-slate-900">-- Chọn danh mục bài học --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-slate-900">
                  {cat.unit_name} - {cat.lesson_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tên Tiêu Đề Tài Liệu / Bài Giảng <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Giáo án điện tử Unit 1 - Grammar Present Simple"
              className="w-full glass-input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Loại Định Dạng Học Liệu
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full glass-input"
              >
                <option value="pdf" className="bg-slate-900">Tệp PDF / Tài liệu</option>
                <option value="iframe_link" className="bg-slate-900">Liên kết iFrame (Wordwall, Quizizz, Kahoot)</option>
                <option value="game_html" className="bg-slate-900">HTML5 Game / Trò chơi</option>
                <option value="video" className="bg-slate-900">Video bài giảng</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Đường Dẫn URL / File Supabase Storage <span className="text-rose-400">*</span>
              </label>
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://... hoặc link storage"
                className="w-full glass-input"
                required
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="glass-button-secondary text-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="glass-button-primary text-sm"
            >
              <Upload className="w-4 h-4" />
              {uploading ? 'Đang lưu...' : 'Tải Lên Học Liệu'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
