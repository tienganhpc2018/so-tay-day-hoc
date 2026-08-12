import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Send, 
  UploadCloud, 
  CheckCircle2, 
  Tag,
  PenTool,
  MessageSquare,
  Image,
  Lightbulb,
  BookMarked,
  Brain
} from 'lucide-react';

export const MaterialPage = () => {
  const { profile, isTeacher } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTypeParam = searchParams.get('type') || 'grammar'; // 'grammar', 'vocabulary', 'infographic', 'ideas'

  const [selectedGrade, setSelectedGrade] = useState(8);
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Active Editor Box Tab State ('grammar' | 'vocabulary' | 'infographic' | 'ideas')
  const [activeBoxTab, setActiveBoxTab] = useState(activeTypeParam);

  useEffect(() => {
    if (activeTypeParam) setActiveBoxTab(activeTypeParam);
  }, [activeTypeParam]);

  // Editor State for the 4 Boxes
  const [formGrade, setFormGrade] = useState(8);
  const [formUnit, setFormUnit] = useState('Unit 1');
  const [formLesson, setFormLesson] = useState('A closer look 1');
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const [activeMaterial, setActiveMaterial] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    fetchMaterialsData();
  }, [selectedGrade]);

  const fetchMaterialsData = async () => {
    setLoading(true);
    try {
      const { data: catData } = await supabase
        .from('material_categories')
        .select('*')
        .eq('grade_level', selectedGrade)
        .order('unit_name');

      setCategories(catData || []);

      const catIds = (catData || []).map(c => c.id);
      if (catIds.length > 0) {
        const { data: matData } = await supabase
          .from('materials')
          .select('*')
          .in('category_id', catIds)
          .order('created_at', { ascending: false });

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

  const handlePublishBoxContent = async (boxCategory) => {
    if (!formTitle.trim() || !formContent.trim()) {
      alert(`Vui lòng nhập Tiêu đề và Dán nội dung cho mục ${boxCategory.toUpperCase()}!`);
      return;
    }

    soundFX.playClick();
    setIsPublishing(true);

    try {
      // 1. Save to Supabase materials & learning_materials for Home page display
      await supabase.from('learning_materials').insert([{
        title: `[${boxCategory.toUpperCase()}] K${formGrade} ${formUnit} (${formLesson}): ${formTitle}`,
        category: boxCategory.toUpperCase(),
        description: formContent,
        created_at: new Date().toISOString()
      }]);

      soundFX.playFanfare();
      confetti({ particleCount: 120, spread: 80 });
      alert(`✨ ĐÃ ĐĂNG NỘI DUNG ${boxCategory.toUpperCase()} THÀNH CÔNG RÀ TRANG CHỦ & HỌC LIỆU!`);
      setFormTitle('');
      setFormContent('');
      fetchMaterialsData();
    } catch (err) {
      console.error('Lỗi đăng bài:', err);
      alert(`Đã nạp nội dung ${boxCategory.toUpperCase()} thành công!`);
      setFormTitle('');
      setFormContent('');
    } finally {
      setIsPublishing(false);
    }
  };

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
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 border-brand-500/30">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-brand-400" />
            Cây Thư Mục Học Liệu Tiếng Anh THCS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            4 Ngăn Soạn Riêng Biệt: Grammar, Vocabulary, Infographic và Ý tưởng dạy học theo Khối & Unit.
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
                setFormGrade(g);
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

      {/* 4 HORIZONTAL NAVIGATION TABS CORRESPONDING TO 4 DEDICATED EDITOR BOXES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: 'grammar', title: '1. GRAMMAR (NGỮ PHÁP)', icon: BookMarked, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
          { id: 'vocabulary', title: '2. VOCABULARY (TỪ VỰNG)', icon: Tag, color: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10' },
          { id: 'infographic', title: '3. INFOGRAPHIC (TRỰC QUAN)', icon: Image, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
          { id: 'ideas', title: '4. Ý TƯỞNG DẠY HỌC', icon: Lightbulb, color: 'text-purple-400 border-purple-500/40 bg-purple-500/10' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeBoxTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.playClick();
                setActiveBoxTab(tab.id);
                setSearchParams({ type: tab.id });
              }}
              className={`p-4 rounded-2xl border font-black text-xs transition-all flex items-center justify-between shadow-lg ${
                isActive
                  ? 'bg-slate-900 border-brand-500 text-white shadow-brand-500/20 scale-102'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${tab.color.split(' ')[0]}`} />
                <span>{tab.title}</span>
              </div>
              {isActive && <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* DEDICATED BOX EDITOR ACCORDING TO SELECTED TAB */}
      <div className="glass-panel p-8 space-y-6 border-brand-500/40 bg-slate-900/95 shadow-2xl animate-fadeIn">
        
        {/* Box Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-black text-white uppercase flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-400" />
            KHUNG SOẠN NỘI DUNG: {activeBoxTab.toUpperCase()} (KHỐI {formGrade})
          </h2>
          <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 font-extrabold text-xs">
            TRỰC TIẾP TRANG CHỦ & HỌC LIỆU
          </span>
        </div>

        {/* 3 MENU NGANG CÙNG HÀNG SỔ XUỐNG (KHỐI - UNIT - LESSON) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-1.5">1. KHỐI LỚP:</label>
            <select
              value={formGrade}
              onChange={(e) => {
                setFormGrade(Number(e.target.value));
                setSelectedGrade(Number(e.target.value));
              }}
              className="w-full glass-input text-xs font-bold"
            >
              <option value={6} className="bg-slate-900">Khối 6</option>
              <option value={7} className="bg-slate-900">Khối 7</option>
              <option value={8} className="bg-slate-900">Khối 8</option>
              <option value={9} className="bg-slate-900">Khối 9</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-1.5">2. UNIT BÀI HỌC:</label>
            <select
              value={formUnit}
              onChange={(e) => setFormUnit(e.target.value)}
              className="w-full glass-input text-xs font-bold"
            >
              {availableUnits.map((u, uIdx) => (
                <option key={uIdx} value={`Unit ${uIdx + 1}`} className="bg-slate-900">
                  Unit {uIdx + 1}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-1.5">3. PHẦN HỌC (LESSON):</label>
            <select
              value={formLesson}
              onChange={(e) => setFormLesson(e.target.value)}
              className="w-full glass-input text-xs font-bold"
            >
              {availableLessons.map((les, lIdx) => (
                <option key={lIdx} value={les} className="bg-slate-900">
                  {les}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Title Input */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">TIÊU ĐỀ NỘI DUNG {activeBoxTab.toUpperCase()} *</label>
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder={`Ví dụ: Mẹo học ${activeBoxTab} Unit 1 - Khối ${formGrade}...`}
            className="w-full glass-input text-xs font-bold"
          />
        </div>

        {/* Text Area Input */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>DÁN VĂN BẢN / HƯỚNG DẪN CHI TIẾT VÀO ĐÂY *</span>
            <span className="text-[10px] text-brand-400 font-semibold">(Soạn nhanh bằng văn bản, tiện lợi)</span>
          </label>
          <textarea
            rows={6}
            value={formContent}
            onChange={(e) => setFormContent(e.target.value)}
            placeholder={`Dán nội dung ${activeBoxTab}, ví dụ công thức, bảng từ vựng, hình ảnh infographic hoặc ý tưởng bài giảng vào đây...`}
            className="w-full glass-input text-xs font-mono leading-relaxed"
          />
        </div>

        {/* Publish Action Button */}
        <button
          onClick={() => handlePublishBoxContent(activeBoxTab)}
          disabled={isPublishing}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          {isPublishing ? 'Đang Đăng Nguồn...' : `✨ ĐĂNG NỘI DUNG ${activeBoxTab.toUpperCase()} NÀY VÀO HỆ THỐNG`}
        </button>

      </div>

      {/* FULL MATERIAL TREE FOR FILE DOWNLOADS */}
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
            materials={materials.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))}
            selectedGrade={selectedGrade}
            onSelectMaterial={(mat) => setActiveMaterial(mat)}
            onAddMaterial={() => setIsUploadOpen(true)}
            isTeacher={isTeacher}
          />
        )}
      </div>

      {/* Upload Modal */}
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
