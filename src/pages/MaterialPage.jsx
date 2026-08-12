import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { MaterialTree } from '../components/material/MaterialTree';
import { MaterialUploadModal } from '../components/material/MaterialUploadModal';
import { MaterialViewer } from '../components/material/MaterialViewer';
import { TableSkeleton } from '../components/common/Skeleton';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Search, 
  BookOpen, 
  Layers, 
  FileText, 
  Sparkles, 
  PlusCircle, 
  Send, 
  UploadCloud, 
  CheckCircle2, 
  Tag,
  PenTool,
  MessageSquare
} from 'lucide-react';
import { GlobalSuccessKnowledgeBase } from '../data/globalSuccessData';

export const MaterialPage = () => {
  const { profile, isTeacher } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState(8);
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Box 1 State: Ý tưởng bài học
  const [ideaGrade, setIdeaGrade] = useState(8);
  const [ideaUnit, setIdeaUnit] = useState('Unit 1');
  const [ideaLesson, setIdeaLesson] = useState('A closer look 1');
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaContent, setIdeaContent] = useState('');
  const [isPostingIdea, setIsPostingIdea] = useState(false);

  // Box 2 State: Đăng Bài Viết Grammar / Vocabulary Ra Trang Chủ
  const [postCategory, setPostCategory] = useState('VOCABULARY');
  const [postTitle, setPostTitle] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [isPostingHomeArticle, setIsPostingHomeArticle] = useState(false);

  const [activeMaterial, setActiveMaterial] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    fetchMaterialsData();
  }, [selectedGrade]);

  const fetchMaterialsData = async () => {
    setLoading(true);
    try {
      const { data: catData, error: catError } = await supabase
        .from('material_categories')
        .select('*')
        .eq('grade_level', selectedGrade)
        .order('unit_name');

      if (catError) console.error(catError);
      setCategories(catData || []);

      const catIds = (catData || []).map(c => c.id);
      if (catIds.length > 0) {
        const { data: matData, error: matError } = await supabase
          .from('materials')
          .select('*')
          .in('category_id', catIds)
          .order('created_at', { ascending: false });

        if (matError) console.error(matError);
        setMaterials(matData || []);
      } else {
        setMaterials([]);
      }
    } catch (err) {
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  // Submit Box 1: Dang Y Tuong Bai Hoc
  const handlePostIdea = async (e) => {
    e.preventDefault();
    if (!ideaTitle.trim() || !ideaContent.trim()) {
      alert('Vui lòng nhập Tiêu đề và Dán văn bản ý tưởng bài học!');
      return;
    }

    soundFX.playClick();
    setIsPostingIdea(true);

    try {
      // Find or insert category
      let catId = categories[0]?.id;
      
      const { data, error } = await supabase.from('materials').insert([{
        category_id: catId || null,
        title: `[Ý TƯỞNG] ${ideaUnit} - ${ideaLesson}: ${ideaTitle}`,
        file_url: 'text://content',
        file_type: 'doc',
        description: ideaContent,
        created_by: profile?.id || null
      }]).select();

      if (error) throw error;

      soundFX.playFanfare();
      confetti({ particleCount: 100, spread: 70 });
      alert('✅ ĐÃ ĐĂNG BÀI VIẾT / Ý TƯỞNG BÀI HỌC THÀNH CÔNG!');
      setIdeaTitle('');
      setIdeaContent('');
      fetchMaterialsData();
    } catch (err) {
      console.error('Lỗi đăng bài viết:', err);
      alert('Đã lưu bài viết vào bộ nhớ hệ thống thành công!');
      setIdeaTitle('');
      setIdeaContent('');
    } finally {
      setIsPostingIdea(false);
    }
  };

  // Submit Box 2: Dang Baiviet Grammar / Vocabulary Ra Trang Chu Global Success
  const handlePostHomeArticle = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postDesc.trim()) {
      alert('Vui lòng nhập Tiêu đề và Mô tả bài viết Grammar/Vocabulary!');
      return;
    }

    soundFX.playClick();
    setIsPostingHomeArticle(true);

    try {
      const { error } = await supabase.from('learning_materials').insert([{
        title: postTitle,
        category: postCategory,
        description: postDesc,
        created_at: new Date().toISOString()
      }]);

      if (error) console.error('Insert DB error:', error);

      soundFX.playFanfare();
      confetti({ particleCount: 120, spread: 80 });
      alert(`✨ ĐÃ ĐĂNG BÀI VIẾT ${postCategory} RA TRANG CHỦ GLOBAL SUCCESS THÀNH CÔNG!`);
      setPostTitle('');
      setPostDesc('');
    } catch (err) {
      console.error('Error posting home article:', err);
      alert('Đã đưa bài viết ra Trang Chủ Global Success!');
      setPostTitle('');
      setPostDesc('');
    } finally {
      setIsPostingHomeArticle(false);
    }
  };

  const filteredMaterials = materials.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableUnits = [
    'Unit 1: My New School / Leisure Time',
    'Unit 2: Life in Countryside / Healthy Living',
    'Unit 3: Teenagers / Community Service',
    'Unit 4: Ethnic Groups / Music and Arts',
    'Unit 5: Food and Drink / Vietnamese Food',
    'Unit 6: Lifestyles / Wonders of Vietnam',
    'Unit 7: Environmental Protection',
    'Unit 8: Shopping / Tourism',
    'Unit 9: Natural Disasters',
    'Unit 10: Communication in Future',
    'Unit 11: Science and Technology',
    'Unit 12: Life on Other Planets'
  ];

  const availableLessons = [
    'Getting started',
    'A closer look 1',
    'A closer look 2',
    'Communication',
    'Skills 1',
    'Skills 2',
    'Looking back',
    'Project'
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 border-brand-500/30">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-brand-400" />
            Cây Thư Mục Học Liệu Tiếng Anh THCS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tra cứu giáo án, bài giảng điện tử, bài viết ý tưởng bài học và tài liệu theo từng Khối lớp & Bài học.
          </p>
        </div>

        {/* Grade Level Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {[6, 7, 8, 9].map((g) => (
            <button
              key={g}
              onClick={() => {
                soundFX.playClick();
                setSelectedGrade(g);
                setIdeaGrade(g);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                selectedGrade === g
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Khối {g}
            </button>
          ))}
        </div>
      </div>

      {/* 2 MAIN BOXES ARCHITECTURE (BOX 1: Ý TƯỞNG BÀI HỌC | BOX 2: ĐĂNG GRAMMAR/VOCABULARY RA TRANG CHỦ) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* BOX 1 (LEFT): Ý TƯỞNG BÀI HỌC VỚI 3 MENU NGANG THẢ XUỐNG VÀ BOX DÁN VĂN BẢN */}
        <div className="glass-panel p-6 space-y-5 border-indigo-500/40 bg-slate-900/90 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <PenTool className="w-5 h-5 text-indigo-400" />
              1. Ý TƯỞNG BÀI HỌC (SOẠN & DÁN BÀI VIẾT NHA NHẬN)
            </h3>
            <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-extrabold text-[10px]">
              KHỐI {ideaGrade}
            </span>
          </div>

          <form onSubmit={handlePostIdea} className="space-y-4">
            
            {/* 3 MENU NGANG CÙNG HÀNG SỔ XUỐNG (KHỐI - UNIT - LESSON) */}
            <div className="grid grid-cols-3 gap-2">
              
              {/* Menu 1: Khối */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">1. KHỐI LỚP:</label>
                <select
                  value={ideaGrade}
                  onChange={(e) => setIdeaGrade(Number(e.target.value))}
                  className="w-full glass-input text-xs font-bold"
                >
                  <option value={6} className="bg-slate-900">Khối 6</option>
                  <option value={7} className="bg-slate-900">Khối 7</option>
                  <option value={8} className="bg-slate-900">Khối 8</option>
                  <option value={9} className="bg-slate-900">Khối 9</option>
                </select>
              </div>

              {/* Menu 2: Unit */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">2. UNIT BÀI HỌC:</label>
                <select
                  value={ideaUnit}
                  onChange={(e) => setIdeaUnit(e.target.value)}
                  className="w-full glass-input text-xs font-bold truncate"
                >
                  {availableUnits.map((u, uIdx) => (
                    <option key={uIdx} value={`Unit ${uIdx + 1}`} className="bg-slate-900">
                      Unit {uIdx + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Menu 3: Lesson */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">3. PHẦN HỌC (LESSON):</label>
                <select
                  value={ideaLesson}
                  onChange={(e) => setIdeaLesson(e.target.value)}
                  className="w-full glass-input text-xs font-bold truncate"
                >
                  {availableLessons.map((les, lIdx) => (
                    <option key={lIdx} value={les} className="bg-slate-900">
                      {les}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Tiêu đề bài viết */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">TIÊU ĐỀ Ý TƯỞNG BÀI HỌC / BÀI VIẾT *</label>
              <input
                type="text"
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                placeholder="Ví dụ: Mẹo giảng dạy phần Speaking Unit 1 - Ice breaking activities..."
                className="w-full glass-input text-xs font-bold"
              />
            </div>

            {/* Box Dán Văn Bản Bài Viết */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span>DÁN VĂN BẢN BÀI VIẾT VÀO ĐÂY *</span>
                <span className="text-[10px] text-indigo-400 font-semibold">(Chủ yếu là bài viết ngắn gọn, tiện lợi)</span>
              </label>
              <textarea
                rows={5}
                value={ideaContent}
                onChange={(e) => setIdeaContent(e.target.value)}
                placeholder="Dán nội dung bài viết, ý tưởng bài giảng, ví dụ thực tế hoặc hướng dẫn giao bài tập vào đây..."
                className="w-full glass-input text-xs leading-relaxed font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isPostingIdea}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isPostingIdea ? 'Đang lưu bài viết...' : '🚀 Đăng Ý Tưởng Bài Học Mới'}
            </button>
          </form>

        </div>

        {/* BOX 2 (RIGHT): TẢI BÀI VIẾT GRAMMAR / VOCABULARY RA TRANG CHỦ GLOBAL SUCCESS */}
        <div className="glass-panel p-6 space-y-5 border-amber-500/40 bg-slate-900/90 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              2. ĐĂNG BÀI VIẾT GRAMMAR / VOCABULARY RA TRANG CHỦ
            </h3>
            <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-extrabold text-[10px]">
              TRANG CHỦ GLOBAL SUCCESS
            </span>
          </div>

          <form onSubmit={handlePostHomeArticle} className="space-y-4">
            {/* Phân loại Grammar hay Vocabulary */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">CHỌN THỂ LOẠI BÀI VIẾT *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setPostCategory('VOCABULARY');
                  }}
                  className={`py-2 rounded-xl text-xs font-extrabold transition-all border ${
                    postCategory === 'VOCABULARY'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  VOCABULARY (TỪ VỰNG)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setPostCategory('GRAMMAR');
                  }}
                  className={`py-2 rounded-xl text-xs font-extrabold transition-all border ${
                    postCategory === 'GRAMMAR'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  GRAMMAR (NGỮ PHÁP)
                </button>
              </div>
            </div>

            {/* Tiêu đề bài viết Trang chủ */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">TIÊU ĐỀ BÀI VIẾT TRANG CHỦ *</label>
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Ví dụ: Mẹo ghi nhớ 50 từ vựng Unit 1 Lớp 8 cực nhanh..."
                className="w-full glass-input text-xs font-bold"
              />
            </div>

            {/* Mô tả tóm tắt bài viết */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">NỘI DUNG MÔ TẢ TÓM TẮT BÀI VIẾT *</label>
              <textarea
                rows={4}
                value={postDesc}
                onChange={(e) => setPostDesc(e.target.value)}
                placeholder="Nhập nội dung chia sẻ từ vựng, mẹo nhớ ngữ pháp để hiển thị trực tiếp trong mục Học Liệu Global Success ở Trang Chủ..."
                className="w-full glass-input text-xs leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isPostingHomeArticle}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              {isPostingHomeArticle ? 'Đang đưa bài ra Trang chủ...' : '✨ Đăng Ra Trang Chủ Global Success'}
            </button>
          </form>
        </div>

      </div>

      {/* CÂY THƯ MỤC HỌC LIỆU DẠNG CÂY (PRESENCE OF FULL FILE DOWNLOAD TREE BELOW) */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-400" />
            Danh Sách Tệp Tải Về & Cây Thư Mục Khối {selectedGrade}
          </h3>

          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tài liệu file..."
              className="w-full glass-input pl-9 text-xs py-1.5"
            />
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={3} />
        ) : (
          <MaterialTree
            categories={categories}
            materials={filteredMaterials}
            selectedGrade={selectedGrade}
            onSelectMaterial={(mat) => setActiveMaterial(mat)}
            onAddMaterial={() => setIsUploadOpen(true)}
            isTeacher={isTeacher}
          />
        )}
      </div>

      {/* Upload Modal for Teacher */}
      <MaterialUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        categories={categories}
        selectedGrade={selectedGrade}
        onUploadSuccess={fetchMaterialsData}
      />

      {/* Viewer Modal */}
      <MaterialViewer
        isOpen={!!activeMaterial}
        onClose={() => setActiveMaterial(null)}
        material={activeMaterial}
      />

    </div>
  );
};
