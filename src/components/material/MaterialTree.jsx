import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  FileCode, 
  Video, 
  Link as LinkIcon, 
  Download, 
  Eye, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

export const MaterialTree = ({ categories, materials, selectedGrade, onSelectMaterial, onAddMaterial, isTeacher }) => {
  const [openUnits, setOpenUnits] = useState({});

  const toggleUnit = (unitName) => {
    soundFX.playClick();
    setOpenUnits(prev => ({
      ...prev,
      [unitName]: !prev[unitName]
    }));
  };

  // Group categories by Unit
  const groupedUnits = categories.reduce((acc, cat) => {
    if (!acc[cat.unit_name]) {
      acc[cat.unit_name] = [];
    }
    acc[cat.unit_name].push(cat);
    return acc;
  }, {});

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return <FileText className="w-4 h-4 text-rose-400" />;
      case 'game_html': return <FileCode className="w-4 h-4 text-emerald-400" />;
      case 'video': return <Video className="w-4 h-4 text-blue-400" />;
      case 'iframe_link': return <LinkIcon className="w-4 h-4 text-amber-400" />;
      default: return <FileText className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="glass-panel p-6 space-y-6">
      {/* Tree Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-400" />
            Cây Thư Mục Học Liệu Khối {selectedGrade}
          </h2>
          <p className="text-xs text-slate-400">Khung chương trình Tiếng Anh THCS Global Success</p>
        </div>

        {isTeacher && (
          <button
            onClick={() => {
              soundFX.playClick();
              onAddMaterial();
            }}
            className="glass-button-primary text-xs px-3 py-2"
          >
            <Plus className="w-4 h-4" />
            Tải Học Liệu Mới
          </button>
        )}
      </div>

      {/* Tree Content */}
      <div className="space-y-3">
        {Object.keys(groupedUnits).length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            Chưa có thư mục học liệu nào cho Khối {selectedGrade}.
          </div>
        ) : (
          Object.entries(groupedUnits).map(([unitName, lessons]) => {
            const isOpen = openUnits[unitName] ?? true;
            return (
              <div key={unitName} className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40">
                {/* Unit Header */}
                <button
                  onClick={() => toggleUnit(unitName)}
                  className="w-full flex items-center justify-between p-4 bg-slate-900/80 hover:bg-slate-900 text-left font-bold text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isOpen ? <FolderOpen className="w-5 h-5 text-amber-400" /> : <Folder className="w-5 h-5 text-amber-400" />}
                    <span>{unitName}</span>
                    <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                      {lessons.length} Bài học
                    </span>
                  </div>
                  {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </button>

                {/* Lessons & Materials List */}
                {isOpen && (
                  <div className="p-3 space-y-2 bg-slate-950/20 border-t border-slate-800/60 pl-6">
                    {lessons.map((cat) => {
                      const catMaterials = materials.filter(m => m.category_id === cat.id);
                      return (
                        <div key={cat.id} className="space-y-1.5 border-l-2 border-slate-800 pl-4 py-1">
                          <h4 className="text-sm font-semibold text-brand-300">
                            {cat.lesson_name}
                          </h4>

                          {catMaterials.length === 0 ? (
                            <p className="text-xs text-slate-500 italic">Chưa có tệp tài liệu nào</p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                              {catMaterials.map((mat) => (
                                <div
                                  key={mat.id}
                                  className="glass-card p-3 flex items-center justify-between gap-3 group hover:border-brand-500/50"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    {getFileIcon(mat.file_type)}
                                    <span className="text-xs font-medium text-slate-200 truncate" title={mat.title}>
                                      {mat.title}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      onClick={() => {
                                        soundFX.playClick();
                                        onSelectMaterial(mat);
                                      }}
                                      title="Xem học liệu"
                                      className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-all"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    {mat.file_url && mat.file_type !== 'iframe_link' && (
                                      <a
                                        href={mat.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Tải về"
                                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-all"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
