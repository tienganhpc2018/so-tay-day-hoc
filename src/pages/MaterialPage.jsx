import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { MaterialTree } from '../components/material/MaterialTree';
import { MaterialUploadModal } from '../components/material/MaterialUploadModal';
import { MaterialViewer } from '../components/material/MaterialViewer';
import { TableSkeleton } from '../components/common/Skeleton';
import { soundFX } from '../utils/soundEffects';
import { Search, BookOpen, Layers } from 'lucide-react';

export const MaterialPage = () => {
  const { isTeacher } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState(8);
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [activeMaterial, setActiveMaterial] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    fetchMaterialsData();
  }, [selectedGrade]);

  const fetchMaterialsData = async () => {
    setLoading(true);
    try {
      // 1. Fetch categories for grade
      const { data: catData, error: catError } = await supabase
        .from('material_categories')
        .select('*')
        .eq('grade_level', selectedGrade)
        .order('unit_name');

      if (catError) throw catError;
      setCategories(catData || []);

      // 2. Fetch materials for categories
      const catIds = (catData || []).map(c => c.id);
      if (catIds.length > 0) {
        const { data: matData, error: matError } = await supabase
          .from('materials')
          .select('*')
          .in('category_id', catIds)
          .order('created_at', { ascending: false });

        if (matError) throw matError;
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

  // Filter materials by search query
  const filteredMaterials = materials.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 border-brand-500/30">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-brand-400" />
            Cây Thư Mục Học Liệu Tiếng Anh THCS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tra cứu giáo án, bài giảng điện tử, tệp PDF và trò chơi tương tác theo từng Khối lớp & Bài học.
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

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm tài liệu bài học..."
          className="w-full glass-input pl-10 text-xs"
        />
      </div>

      {/* Tree Content / Skeleton Loading */}
      {loading ? (
        <TableSkeleton rows={4} />
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
