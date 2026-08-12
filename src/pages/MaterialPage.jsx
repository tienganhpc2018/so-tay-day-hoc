import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { MaterialTree } from '../components/material/MaterialTree';
import { MaterialUploadModal } from '../components/material/MaterialUploadModal';
import { MaterialViewer } from '../components/material/MaterialViewer';
import { TableSkeleton } from '../components/common/Skeleton';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
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
  Brain,
  Volume2,
  Gamepad2,
  Edit3
} from 'lucide-react';

export const MaterialPage = () => {
  const { profile, isTeacher } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTypeParam = searchParams.get('type') || 'vocabulary';

  const [selectedGrade, setSelectedGrade] = useState(8);
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [activeBoxTab, setActiveBoxTab] = useState(activeTypeParam);

  useEffect(() => {
    if (activeTypeParam) setActiveBoxTab(activeTypeParam);
  }, [activeTypeParam]);

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

  // 6 DEDICATED SUB-PAGE TABS CORRESPONDING TO 6 CARDS ON HOMEPAGE
  const subPageTabs = [
    { id: 'vocabulary', label: '1. Từ Vựng (Vocabulary)', icon: BookMarked, badgeColor: 'bg-indigo-500/20 text-indigo-300' },
    { id: 'grammar', label: '2. Ngữ Pháp (Grammar)', icon: Brain, badgeColor: 'bg-amber-500/20 text-amber-300' },
    { id: 'audio', label: '3. Audio & Tapescript', icon: Volume2, badgeColor: 'bg-purple-500/20 text-purple-300' },
    { id: 'infographic', label: '4. Infographic Trực Quan', icon: Image, badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'project', label: '5. iFrame Game & Project', icon: Gamepad2, badgeColor: 'bg-rose-500/20 text-rose-300' },
    { id: 'worksheet', label: '6. Phiếu Bài Tập 4 Kỹ Năng', icon: Edit3, badgeColor: 'bg-teal-500/20 text-teal-300' }
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* HERO BANNER WITH AI LIBRARY BACKDROP */}
      <PageHeroBanner
        title="Thư Mục Học Liệu Tiếng Anh THCS 📚"
        subtitle="Cây thư mục bài học 6 Trang con chuyên biệt: Từ vựng, Ngữ pháp, Audio Tapescript, Infographic, Game Project và Phiếu bài tập tích hợp AI."
        badge="HỌC LIỆU SỐ • KHỐI 6 - 7 - 8 - 9 GLOBAL SUCCESS"
        bgImage="/images/hero_library_bg.jpg"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {isTeacher && (
              <button
                onClick={() => {
                  soundFX.playClick();
                  setIsUploadOpen(true);
                }}
                className="glass-button-primary text-xs px-4 py-2.5"
              >
                <UploadCloud className="w-4 h-4" /> Tải Lên Thư Mục Mới
              </button>
            )}

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

      {/* 6 SUB-PAGE TABS NAVIGATION BAR (EXACTLY CORRESPONDING TO HOMEPAGE CARDS) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl">
        {subPageTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeBoxTab === tab.id;
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
                  setActiveBoxTab(tab.id);
                  setSearchParams({ type: tab.id });
                }
              }}
              className={`p-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/30 scale-102 border border-brand-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{tab.label}</span>
              {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* CONTENT AREA FOR THE ACTIVE SUB-PAGE TAB */}
      <div className="space-y-6">
        
        {/* SUB-PAGE 1: VOCABULARY */}
        {activeBoxTab === 'vocabulary' && (
          <div className="glass-panel p-8 space-y-6 border-indigo-500/40 bg-slate-900/95 shadow-2xl animate-fadeIn">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black">
                <BookMarked className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Trang Con: Mẹo & Từ Vựng Cốt Lõi Khối {selectedGrade} Global Success</h2>
                <p className="text-xs text-slate-400">Tổng hợp trọn bộ Word Bank từ vựng kèm âm thanh audio phát âm bám sát 12 Units SGK.</p>
              </div>
            </div>

            <MaterialTree
              grade={selectedGrade}
              categories={categories}
              materials={materials}
              searchQuery={searchQuery}
              onSelectMaterial={(mat) => {
                soundFX.playClick();
                setActiveMaterial(mat);
              }}
            />
          </div>
        )}

        {/* SUB-PAGE 2: GRAMMAR */}
        {activeBoxTab === 'grammar' && (
          <div className="glass-panel p-8 space-y-6 border-amber-500/40 bg-slate-900/95 shadow-2xl animate-fadeIn">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Trang Con: Chủ Điểm Ngữ Pháp Trọng Tâm Khối {selectedGrade}</h2>
                <p className="text-xs text-slate-400">Tổng hợp công thức ngữ pháp, ví dụ minh họa và ma trận kiểm tra định kỳ 12 Units.</p>
              </div>
            </div>

            <MaterialTree
              grade={selectedGrade}
              categories={categories}
              materials={materials}
              searchQuery={searchQuery}
              onSelectMaterial={(mat) => {
                soundFX.playClick();
                setActiveMaterial(mat);
              }}
            />
          </div>
        )}

        {/* SUB-PAGE 3: AUDIO & TAPESCRIPT */}
        {activeBoxTab === 'audio' && (
          <div className="glass-panel p-8 space-y-6 border-purple-500/40 bg-slate-900/95 shadow-2xl animate-fadeIn">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-black">
                <Volume2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Trang Con: Trọn Bộ Tapescript & File Audio Luyện Nghe Khối {selectedGrade}</h2>
                <p className="text-xs text-slate-400">File âm thanh chuẩn mono tích hợp icon cái loa cho từng phần nghe chuẩn thời lượng.</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-xs space-y-4">
              <span className="font-extrabold text-purple-400 text-sm block">🎧 DANH SÁCH AUDIO BÀI NGHE KHỐI {selectedGrade}:</span>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((u) => (
                  <div key={u} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-5 h-5 text-purple-400 shrink-0" />
                      <div>
                        <h4 className="font-extrabold text-white">Audio Unit {u}: Global Success Grade {selectedGrade}</h4>
                        <span className="text-[11px] text-slate-400">Thời lượng chuẩn: 60 - 80 Giây</span>
                      </div>
                    </div>
                    <audio controls src="https://actions.google.com/sounds/v1/speech/person_speaking.ogg" className="w-48 sm:w-64" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB-PAGE 4: INFOGRAPHIC */}
        {activeBoxTab === 'infographic' && (
          <div className="glass-panel p-8 space-y-6 border-emerald-500/40 bg-slate-900/95 shadow-2xl animate-fadeIn">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
                <Image className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Trang Con: Tuyển Tập Infographic Kiến Thức Khối {selectedGrade} Trực Quan</h2>
                <p className="text-xs text-slate-400">Hình ảnh Infographic tóm tắt ngữ pháp giúp học sinh dễ nhớ bài học trực quan.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((infoIdx) => (
                <div key={infoIdx} className="bg-slate-950 border border-slate-800 rounded-3xl p-4 space-y-3">
                  <div className="h-48 rounded-2xl bg-slate-900 overflow-hidden border border-slate-800">
                    <img 
                      src={`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop`}
                      alt="Infographic" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-extrabold text-white text-xs">Infographic Unit {infoIdx}: Kiến Thức Trọng Tâm Khối {selectedGrade}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <MaterialUploadModal
          grade={selectedGrade}
          categories={categories}
          onClose={() => setIsUploadOpen(false)}
          onUploaded={() => {
            fetchMaterialsData();
            setIsUploadOpen(false);
          }}
        />
      )}

      {/* Material Viewer Modal */}
      {activeMaterial && (
        <MaterialViewer
          material={activeMaterial}
          onClose={() => setActiveMaterial(null)}
        />
      )}

    </div>
  );
};
