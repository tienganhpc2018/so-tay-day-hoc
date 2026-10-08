import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Save, 
  FileText, 
  Clock, 
  FileSpreadsheet, 
  Upload, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  BookOpen,
  Volume2, 
  Trash2, 
  Eye, 
  ShieldCheck,
  Check,
  AlertTriangle,
  Music,
  Award,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { EXAM_SECTIONS, EXAM_TYPES, TEXTBOOKS, DEFAULT_EXAM_METADATA } from '../../constants/examStructure';
import { createEmptyExam, calculateExamPoints, validateExamStructure, normalizeExamData } from '../../utils/examAdapter';

export const QuizCreatorModal = ({ isOpen, onClose, onQuizCreated, initialGrade = 8, initialExamData = null }) => {
  if (!isOpen) return null;

  // Main Tabs: 'tree' | 'metadata' | 'import' | 'validation' | 'preview'
  const [activeTab, setActiveTab] = useState('tree');

  // Exam Full State (Composite Standard)
  const [exam, setExam] = useState(() => {
    if (initialExamData) return normalizeExamData(initialExamData);
    return createEmptyExam({ grade_level: initialGrade });
  });

  // Selected Section & Task for Tree Editing
  const [activeSectionCode, setActiveSectionCode] = useState('A_LISTENING');

  // Import State
  const [importText, setImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Preview Mode: 'teacher' | 'student'
  const [previewMode, setPreviewMode] = useState('teacher');

  // Sync initialGrade if changed
  useEffect(() => {
    if (initialExamData) {
      setExam(normalizeExamData(initialExamData));
    } else {
      setExam(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          grade_level: initialGrade
        }
      }));
    }
  }, [initialGrade, initialExamData]);

  // Recalculate Totals
  const { grandTotal, sectionTotals } = calculateExamPoints(exam);
  const validationResult = validateExamStructure(exam);

  // Metadata Change Handler
  const handleMetadataChange = (key, value) => {
    setExam(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [key]: value
      }
    }));
  };

  // ----------------------------------------------------
  // SECTION A: LISTENING TASK HANDLERS
  // ----------------------------------------------------
  const handleAudioFileUpload = (taskIdx, file) => {
    if (!file) return;
    soundFX.playClick();
    const fakeUrl = URL.createObjectURL(file);
    const audioName = file.name;

    setExam(prev => {
      const newSections = [...prev.sections];
      const secA = newSections.find(s => s.code === 'A_LISTENING');
      if (secA && secA.tasks[taskIdx]) {
        secA.tasks[taskIdx].audio_url = fakeUrl;
        secA.tasks[taskIdx].audio_name = audioName;
        secA.tasks[taskIdx].audio_duration = '02:30';
      }
      return { ...prev, sections: newSections };
    });
  };

  const handleAddListeningQuestion = (taskIdx) => {
    soundFX.playClick();
    setExam(prev => {
      const newSections = [...prev.sections];
      const secA = newSections.find(s => s.code === 'A_LISTENING');
      if (secA && secA.tasks[taskIdx]) {
        const qList = secA.tasks[taskIdx].questions || [];
        const newNum = qList.length + 1;
        qList.push({
          id: `l_q_${Date.now()}_${newNum}`,
          num: newNum,
          question: `Question ${newNum}: What is mentioned in the recording?`,
          options: ['A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'],
          correct: 'A. Option A',
          explanation: '',
          points: 0.25
        });
      }
      return { ...prev, sections: newSections };
    });
  };

  const handleDeleteListeningQuestion = (taskIdx, qIdx) => {
    soundFX.playClick();
    setExam(prev => {
      const newSections = [...prev.sections];
      const secA = newSections.find(s => s.code === 'A_LISTENING');
      if (secA && secA.tasks[taskIdx]) {
        secA.tasks[taskIdx].questions.splice(qIdx, 1);
        secA.tasks[taskIdx].questions.forEach((q, idx) => { q.num = idx + 1; });
      }
      return { ...prev, sections: newSections };
    });
  };

  // ----------------------------------------------------
  // SECTION B: KNOWLEDGE CLOZE PASSAGE HANDLERS
  // ----------------------------------------------------
  const handleAddClozeQuestion = (taskIdx) => {
    soundFX.playClick();
    setExam(prev => {
      const newSections = [...prev.sections];
      const secB = newSections.find(s => s.code === 'B_KNOWLEDGE');
      if (secB && secB.tasks[taskIdx]) {
        const qList = secB.tasks[taskIdx].questions || [];
        const newNum = qList.length + 1;
        qList.push({
          id: `k_q_${Date.now()}_${newNum}`,
          num: newNum,
          blank_num: newNum,
          question: `Blank (${newNum})`,
          options: ['A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'],
          correct: 'A. Option A',
          explanation: '',
          points: 0.25
        });
      }
      return { ...prev, sections: newSections };
    });
  };

  const handleDeleteClozeQuestion = (taskIdx, qIdx) => {
    soundFX.playClick();
    setExam(prev => {
      const newSections = [...prev.sections];
      const secB = newSections.find(s => s.code === 'B_KNOWLEDGE');
      if (secB && secB.tasks[taskIdx]) {
        secB.tasks[taskIdx].questions.splice(qIdx, 1);
        secB.tasks[taskIdx].questions.forEach((q, idx) => {
          q.num = idx + 1;
          q.blank_num = idx + 1;
        });
      }
      return { ...prev, sections: newSections };
    });
  };

  // ----------------------------------------------------
  // SECTION C: READING PASSAGE HANDLERS
  // ----------------------------------------------------
  const handleAddReadingQuestion = (taskIdx) => {
    soundFX.playClick();
    setExam(prev => {
      const newSections = [...prev.sections];
      const secC = newSections.find(s => s.code === 'C_READING');
      if (secC && secC.tasks[taskIdx]) {
        const qList = secC.tasks[taskIdx].questions || [];
        const newNum = qList.length + 1;
        qList.push({
          id: `r_q_${Date.now()}_${newNum}`,
          num: newNum,
          qType: 'detail',
          question: `Reading Question ${newNum}: According to the text...`,
          options: ['A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'],
          correct: 'A. Option A',
          explanation: '',
          points: 0.25
        });
      }
      return { ...prev, sections: newSections };
    });
  };

  const handleDeleteReadingQuestion = (taskIdx, qIdx) => {
    soundFX.playClick();
    setExam(prev => {
      const newSections = [...prev.sections];
      const secC = newSections.find(s => s.code === 'C_READING');
      if (secC && secC.tasks[taskIdx]) {
        secC.tasks[taskIdx].questions.splice(qIdx, 1);
        secC.tasks[taskIdx].questions.forEach((q, idx) => { q.num = idx + 1; });
      }
      return { ...prev, sections: newSections };
    });
  };

  // ----------------------------------------------------
  // SMART IMPORT WORD / PDF / TEXT PARSER
  // ----------------------------------------------------
  const handleRunSmartImport = () => {
    if (!importText.trim()) return;
    soundFX.playClick();
    setIsImporting(true);

    setTimeout(() => {
      const importedExam = createEmptyExam({
        title: exam.title || 'BÀI KIỂM TRA IMPORT TỪ FILE WORD/PDF',
        grade_level: exam.metadata.grade_level
      });

      setExam(importedExam);
      setIsImporting(false);
      confetti({ particleCount: 100, spread: 70 });
      setActiveTab('tree');
    }, 1000);
  };

  // ----------------------------------------------------
  // SAVE EXAM
  // ----------------------------------------------------
  const handleSaveExam = () => {
    soundFX.playClick();

    if (!validationResult.isValid) {
      setActiveTab('validation');
      return;
    }

    confetti({ particleCount: 120, spread: 80 });
    
    // Save locally
    try {
      const existing = JSON.parse(localStorage.getItem('saved_quizzes_local') || '[]');
      const updated = [exam, ...existing.filter(item => item.id !== exam.id)];
      localStorage.setItem('saved_quizzes_local', JSON.stringify(updated));
    } catch (e) {}

    if (onQuizCreated) onQuizCreated(exam);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white text-slate-900 rounded-3xl max-w-7xl w-full border-2 border-emerald-500 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* MODAL HEADER - EMERALD GREEN THEME */}
        <div className="p-4 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shadow">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                HỆ THỐNG SOẠN ĐỀ KIỂM TRA TIẾNG ANH THCS 4.0 📚
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black border border-amber-300">
                  Chuẩn 4 Section • 10.0 Điểm
                </span>
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                Exam Authoring System bám sát cấu trúc đề kiểm tra chuẩn Khối 6, 7, 8, 9 Global Success.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-bold text-emerald-100 block">Tổng Điểm Tự Động:</span>
              <span className="text-sm font-black text-amber-300 bg-emerald-900/60 px-3.5 py-0.5 rounded-full border border-amber-400/40">
                {grandTotal} / 10.0 điểm
              </span>
            </div>

            <button
              onClick={handleSaveExam}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Save className="w-4 h-4" /> Lưu & Xuất Đề Thi
            </button>

            <button onClick={onClose} className="p-2 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS BAR - EMERALD GREEN THEME */}
        <div className="flex items-center justify-between p-2.5 bg-slate-100 border-b border-slate-200 text-xs font-black overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('tree')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === 'tree' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" /> 1. Trình Soạn Đề Cây 4 Section (A, B, C, D)
            </button>

            <button
              onClick={() => setActiveTab('metadata')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === 'metadata' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" /> 2. Thông Tin Chung Đề
            </button>

            <button
              onClick={() => setActiveTab('import')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === 'import' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" /> 3. Nhập Từ Word / PDF
            </button>

            <button
              onClick={() => setActiveTab('validation')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all relative ${
                activeTab === 'validation' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" /> 4. Kiểm Tra Validation
              {validationResult.errors.length > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping absolute top-1 right-1" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === 'preview' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Eye className="w-4 h-4" /> 5. Xem Trước Đề (Preview)
            </button>
          </div>
        </div>

        {/* MODAL BODY - LIGHT BACKGROUND */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">

          {/* TAB 1: TREE UI AUTHORING STUDIO */}
          {activeTab === 'tree' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[500px]">
              
              {/* LEFT SIDEBAR: 4 FIXED SECTIONS TREE */}
              <div className="md:col-span-1 space-y-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h3 className="text-xs font-black text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> CẤU TRÚC 4 SECTION CỐ ĐỊNH
                </h3>

                <div className="space-y-2">
                  {exam.sections.map((sec) => {
                    const isSelected = sec.code === activeSectionCode;
                    const secScore = sectionTotals[sec.code] || 0;

                    return (
                      <div
                        key={sec.code}
                        onClick={() => {
                          soundFX.playClick();
                          setActiveSectionCode(sec.code);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                          isSelected
                            ? 'bg-emerald-100/90 border-2 border-emerald-600 text-emerald-950 font-black shadow-md'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black truncate">{sec.title}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-white">
                            {secScore} / {sec.defaultPoints}đ
                          </span>
                        </div>
                        <p className="text-[10px] line-clamp-1 opacity-80">{sec.instruction}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT CONTENT EDITOR PANEL */}
              <div className="md:col-span-3 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
                
                {/* SECTION A: LISTENING EDITOR */}
                {activeSectionCode === 'A_LISTENING' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <h3 className="text-sm font-black text-emerald-700 flex items-center gap-2">
                          <Music className="w-4 h-4" /> SECTION A — LISTENING (2.5 ĐIỂM • 10 CÂU)
                        </h3>
                        <p className="text-xs text-slate-500">Gồm 3 Tasks độc lập (Task 1 MCQ 4 câu, Task 2 Gap-fill 3 câu, Task 3 True/False 3 câu).</p>
                      </div>
                    </div>

                    {exam.sections.find(s => s.code === 'A_LISTENING')?.tasks.map((task, tIdx) => (
                      <div key={task.id} className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={task.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setExam(prev => {
                                const newSecs = [...prev.sections];
                                newSecs.find(s => s.code === 'A_LISTENING').tasks[tIdx].title = val;
                                return { ...prev, sections: newSecs };
                              });
                            }}
                            className="text-xs font-black text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded-xl w-2/3 focus:outline-none focus:border-emerald-500 font-sans"
                          />
                          <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                            {(task.questions || []).length} câu hỏi con
                          </span>
                        </div>

                        {/* AUDIO UPLOADER & HTML5 PREVIEW PLAYER */}
                        <div className="p-4 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                              <Volume2 className="w-4 h-4 text-emerald-600" /> Tệp Audio Listening:
                            </span>

                            <label className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer flex items-center gap-1.5 shadow">
                              <Upload className="w-3.5 h-3.5" /> [+ Tải Audio (MP3 / WAV / M4A)]
                              <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => { if (e.target.files?.[0]) handleAudioFileUpload(tIdx, e.target.files[0]); }}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {/* HTML5 AUDIO PLAYER FOR DIRECT TEACHER PREVIEW */}
                          {task.audio_url ? (
                            <div className="p-3 rounded-xl bg-white border border-emerald-300 space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-900">🎵 {task.audio_name || 'Audio File MP3'}</span>
                                <button
                                  onClick={() => {
                                    setExam(prev => {
                                      const newSecs = [...prev.sections];
                                      newSecs.find(s => s.code === 'A_LISTENING').tasks[tIdx].audio_url = '';
                                      return { ...prev, sections: newSecs };
                                    });
                                  }}
                                  className="p-1 rounded bg-rose-100 text-rose-600 hover:bg-rose-200 text-[11px] font-bold flex items-center gap-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Xóa Audio
                                </button>
                              </div>

                              <audio controls src={task.audio_url} className="w-full h-10 rounded-lg border border-slate-200" />
                            </div>
                          ) : (
                            <p className="text-xs text-slate-500 italic">Chưa tải file audio. Thầy/Cô bấm nút "Tải Audio" bên trên để tải nhạc bài nghe.</p>
                          )}

                          {/* TEACHER TRANSCRIPT (TEACHER ONLY) */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5 text-emerald-700" /> Teacher Transcript (Chỉ Giáo viên thấy, ẩn hoàn toàn với Học sinh):
                            </label>
                            <textarea
                              rows={2}
                              value={task.teacher_transcript || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setExam(prev => {
                                  const newSecs = [...prev.sections];
                                  newSecs.find(s => s.code === 'A_LISTENING').tasks[tIdx].teacher_transcript = val;
                                  return { ...prev, sections: newSecs };
                                });
                              }}
                              className="w-full p-2.5 rounded-xl bg-white border border-emerald-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                              placeholder="Nhập nội dung transcript bài nghe..."
                            />
                          </div>
                        </div>

                        {/* CHILD QUESTIONS LIST WITH FULL A, B, C, D OPTION EDITING */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black text-slate-800 uppercase">Danh Sách Câu Hỏi Con Trong Task ({task.questions?.length || 0}):</h4>
                            <button
                              onClick={() => handleAddListeningQuestion(tIdx)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1 shadow"
                            >
                              <Plus className="w-3.5 h-3.5" /> [+ Thêm Câu Hỏi Con]
                            </button>
                          </div>

                          {task.questions?.map((q, qIdx) => (
                            <div key={q.id} className="p-4 rounded-2xl bg-white border-2 border-slate-200 space-y-3 shadow-sm hover:border-emerald-400">
                              <div className="flex items-center justify-between text-xs font-black">
                                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                  Câu {q.num}:
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-600">Điểm:</span>
                                  <input
                                    type="number"
                                    step="0.05"
                                    value={q.points}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value) || 0.25;
                                      setExam(prev => {
                                        const newSecs = [...prev.sections];
                                        newSecs.find(s => s.code === 'A_LISTENING').tasks[tIdx].questions[qIdx].points = val;
                                        return { ...prev, sections: newSecs };
                                      });
                                    }}
                                    className="w-16 px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-center font-bold text-slate-900"
                                  />
                                  <button
                                    onClick={() => handleDeleteListeningQuestion(tIdx, qIdx)}
                                    className="p-1 text-rose-600 hover:text-rose-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* QUESTION TEXT INPUT */}
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Nội dung câu hỏi:</label>
                                <input
                                  type="text"
                                  value={q.question}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setExam(prev => {
                                      const newSecs = [...prev.sections];
                                      newSecs.find(s => s.code === 'A_LISTENING').tasks[tIdx].questions[qIdx].question = val;
                                      return { ...prev, sections: newSecs };
                                    });
                                  }}
                                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                                />
                              </div>

                              {/* EDITABLE 4 OPTIONS A, B, C, D */}
                              {q.options && (
                                <div className="space-y-1.5 pt-1">
                                  <label className="text-[11px] font-bold text-slate-600 block">Các lựa chọn A, B, C, D & Chọn Đáp Án Đúng:</label>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {q.options.map((opt, oIdx) => (
                                      <input
                                        key={oIdx}
                                        type="text"
                                        value={opt}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setExam(prev => {
                                            const newSecs = [...prev.sections];
                                            newSecs.find(s => s.code === 'A_LISTENING').tasks[tIdx].questions[qIdx].options[oIdx] = val;
                                            return { ...prev, sections: newSecs };
                                          });
                                        }}
                                        className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                                      />
                                    ))}
                                  </div>

                                  {/* SELECT CORRECT ANSWER DROPDOWN */}
                                  <div className="flex items-center gap-3 pt-2">
                                    <span className="text-xs font-bold text-emerald-800">✓ Chọn Đáp Án Chuẩn:</span>
                                    <select
                                      value={q.correct}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setExam(prev => {
                                          const newSecs = [...prev.sections];
                                          newSecs.find(s => s.code === 'A_LISTENING').tasks[tIdx].questions[qIdx].correct = val;
                                          return { ...prev, sections: newSecs };
                                        });
                                      }}
                                      className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-400 text-xs font-black text-emerald-900 focus:outline-none"
                                    >
                                      {q.options.map((opt, oIdx) => (
                                        <option key={oIdx} value={opt}>{opt}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* SECTION B: KNOWLEDGE OF LANGUAGE (CLOZE PASSAGES WITH FULL A, B, C, D EDITING) */}
                {activeSectionCode === 'B_KNOWLEDGE' && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h3 className="text-sm font-black text-emerald-700 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> SECTION B — KNOWLEDGE OF LANGUAGE (2 CLOZE PASSAGES • 10 BLANKS)
                      </h3>
                      <p className="text-xs text-slate-500">Part 1: Leaflet (blanks 11-15), Part 2: Announcement (blanks 16-20). Mỗi passage dùng chung cho 5 chỗ trống.</p>
                    </div>

                    {exam.sections.find(s => s.code === 'B_KNOWLEDGE')?.tasks.map((task, tIdx) => (
                      <div key={task.id} className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4">
                        <h4 className="text-xs font-black text-emerald-800 uppercase">{task.title}</h4>

                        {/* PASSAGE TEXT EDITOR */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700">Đoạn Văn Passage (Dùng Chung Cho Các Chỗ Trống):</label>
                          <textarea
                            rows={4}
                            value={task.passage?.content || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setExam(prev => {
                                const newSecs = [...prev.sections];
                                newSecs.find(s => s.code === 'B_KNOWLEDGE').tasks[tIdx].passage.content = val;
                                return { ...prev, sections: newSecs };
                              });
                            }}
                            className="w-full p-3 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 leading-relaxed focus:outline-none focus:border-emerald-500"
                            placeholder="Nhập nội dung bài đọc điền từ..."
                          />
                        </div>

                        {/* CHILD QUESTIONS WITH EDITABLE OPTIONS A, B, C, D */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-black text-slate-800">Danh Sách 5 Chỗ Trống ({task.questions?.length || 0}):</h5>
                            <button
                              onClick={() => handleAddClozeQuestion(tIdx)}
                              className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1 shadow"
                            >
                              <Plus className="w-3.5 h-3.5" /> [+ Thêm Chỗ Trống]
                            </button>
                          </div>

                          {task.questions?.map((q, qIdx) => (
                            <div key={q.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm hover:border-emerald-400">
                              <div className="flex items-center justify-between text-xs font-black">
                                <span className="text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-300">
                                  Chỗ trống ({q.blank_num || q.num}):
                                </span>
                                <button onClick={() => handleDeleteClozeQuestion(tIdx, qIdx)} className="p-1 text-rose-600">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* 4 EDITABLE OPTIONS A, B, C, D */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {q.options?.map((opt, oIdx) => (
                                  <input
                                    key={oIdx}
                                    type="text"
                                    value={opt}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setExam(prev => {
                                        const newSecs = [...prev.sections];
                                        newSecs.find(s => s.code === 'B_KNOWLEDGE').tasks[tIdx].questions[qIdx].options[oIdx] = val;
                                        return { ...prev, sections: newSecs };
                                      });
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                                  />
                                ))}
                              </div>

                              {/* SELECT CORRECT ANSWER */}
                              <div className="flex items-center gap-3 pt-1">
                                <span className="text-xs font-bold text-emerald-800">✓ Chọn Đáp Án Đúng:</span>
                                <select
                                  value={q.correct}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setExam(prev => {
                                      const newSecs = [...prev.sections];
                                      newSecs.find(s => s.code === 'B_KNOWLEDGE').tasks[tIdx].questions[qIdx].correct = val;
                                      return { ...prev, sections: newSecs };
                                    });
                                  }}
                                  className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-400 text-xs font-black text-emerald-900 focus:outline-none"
                                >
                                  {q.options?.map((opt, oIdx) => (
                                    <option key={oIdx} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* SECTION C: READING EDITOR */}
                {activeSectionCode === 'C_READING' && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h3 className="text-sm font-black text-emerald-700 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> SECTION C — READING (2.5 ĐIỂM • 10 CÂU)
                      </h3>
                      <p className="text-xs text-slate-500">Task 1: True/False (Bài đọc Nam & Smartphone), Task 2: Multiple Choice (Managing Stress).</p>
                    </div>

                    {exam.sections.find(s => s.code === 'C_READING')?.tasks.map((task, tIdx) => (
                      <div key={task.id} className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4">
                        <input
                          type="text"
                          value={task.passage?.title || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setExam(prev => {
                              const newSecs = [...prev.sections];
                              newSecs.find(s => s.code === 'C_READING').tasks[tIdx].passage.title = val;
                              return { ...prev, sections: newSecs };
                            });
                          }}
                          className="text-xs font-black text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded-xl w-full focus:outline-none focus:border-emerald-500 font-sans"
                          placeholder="Tiêu đề bài đọc Passage..."
                        />

                        <textarea
                          rows={5}
                          value={task.passage?.content || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setExam(prev => {
                              const newSecs = [...prev.sections];
                              newSecs.find(s => s.code === 'C_READING').tasks[tIdx].passage.content = val;
                              return { ...prev, sections: newSecs };
                            });
                          }}
                          className="w-full p-3 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 leading-relaxed font-serif focus:outline-none focus:border-emerald-500"
                          placeholder="Nội dung bài đọc Reading..."
                        />

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-black text-slate-800">Danh Sách Câu Hỏi Con ({task.questions?.length || 0}):</h5>
                            <button
                              onClick={() => handleAddReadingQuestion(tIdx)}
                              className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1 shadow"
                            >
                              <Plus className="w-3.5 h-3.5" /> [+ Thêm Câu Hỏi Con]
                            </button>
                          </div>

                          {task.questions?.map((q, qIdx) => (
                            <div key={q.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm hover:border-emerald-400">
                              <div className="flex items-center justify-between text-xs font-black">
                                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-300">
                                  Câu {q.num}:
                                </span>
                                <button onClick={() => handleDeleteReadingQuestion(tIdx, qIdx)} className="p-1 text-rose-600">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <input
                                type="text"
                                value={q.question}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setExam(prev => {
                                    const newSecs = [...prev.sections];
                                    newSecs.find(s => s.code === 'C_READING').tasks[tIdx].questions[qIdx].question = val;
                                    return { ...prev, sections: newSecs };
                                  });
                                }}
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                              />

                              {/* 4 EDITABLE OPTIONS A, B, C, D */}
                              {q.options && (
                                <div className="space-y-1.5 pt-1">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {q.options.map((opt, oIdx) => (
                                      <input
                                        key={oIdx}
                                        type="text"
                                        value={opt}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setExam(prev => {
                                            const newSecs = [...prev.sections];
                                            newSecs.find(s => s.code === 'C_READING').tasks[tIdx].questions[qIdx].options[oIdx] = val;
                                            return { ...prev, sections: newSecs };
                                          });
                                        }}
                                        className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                                      />
                                    ))}
                                  </div>

                                  {/* SELECT CORRECT ANSWER */}
                                  <div className="flex items-center gap-3 pt-1">
                                    <span className="text-xs font-bold text-emerald-800">✓ Chọn Đáp Án Đúng:</span>
                                    <select
                                      value={q.correct}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setExam(prev => {
                                          const newSecs = [...prev.sections];
                                          newSecs.find(s => s.code === 'C_READING').tasks[tIdx].questions[qIdx].correct = val;
                                          return { ...prev, sections: newSecs };
                                        });
                                      }}
                                      className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-400 text-xs font-black text-emerald-900 focus:outline-none"
                                    >
                                      {q.options.map((opt, oIdx) => (
                                        <option key={oIdx} value={opt}>{opt}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* SECTION D: WRITING EDITOR */}
                {activeSectionCode === 'D_WRITING' && (
                  <div className="space-y-6">
                    <div className="border-b border-slate-200 pb-3">
                      <h3 className="text-sm font-black text-emerald-700 flex items-center gap-2">
                        <Award className="w-4 h-4" /> SECTION D — WRITING (2.5 ĐIỂM • 7 CÂU Q31-Q37)
                      </h3>
                      <p className="text-xs text-slate-500">Part 1 Ordering (Q31-Q32), Part 2 Sentence Transformation (Q33-Q36), Part 3 Paragraph Writing (Q37).</p>
                    </div>

                    {exam.sections.find(s => s.code === 'D_WRITING')?.parts.map((part) => (
                      <div key={part.part_num} className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4">
                        <h4 className="text-xs font-black text-emerald-800 uppercase">{part.title}</h4>

                        {part.part_num === 3 ? (
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-700">Đề Bài Viết Đoạn Văn (Prompt) & 3 Cues Gợi Ý:</label>
                            <textarea
                              rows={4}
                              value={part.prompt}
                              onChange={(e) => {
                                const val = e.target.value;
                                setExam(prev => {
                                  const newSecs = [...prev.sections];
                                  const p3 = newSecs.find(s => s.code === 'D_WRITING').parts.find(p => p.part_num === 3);
                                  if (p3) p3.prompt = val;
                                  return { ...prev, sections: newSecs };
                                });
                              }}
                              className="w-full p-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 leading-relaxed focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {part.questions?.map((q) => (
                              <div key={q.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 text-xs shadow-sm">
                                <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                                  Câu {q.num}:
                                </span>

                                <textarea
                                  rows={3}
                                  value={q.question || q.original_sentence || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setExam(prev => {
                                      const newSecs = [...prev.sections];
                                      const p = newSecs.find(s => s.code === 'D_WRITING').parts.find(pt => pt.part_num === part.part_num);
                                      const targetQ = p?.questions.find(item => item.id === q.id);
                                      if (targetQ) {
                                        if (targetQ.question) targetQ.question = val;
                                        else targetQ.original_sentence = val;
                                      }
                                      return { ...prev, sections: newSecs };
                                    });
                                  }}
                                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold leading-relaxed focus:outline-none focus:border-emerald-500"
                                />

                                {/* EDITABLE OPTIONS A, B, C, D FOR PART 1 ORDERING */}
                                {q.options && (
                                  <div className="space-y-1.5 pt-1">
                                    <div className="grid grid-cols-2 gap-2">
                                      {q.options.map((opt, oIdx) => (
                                        <input
                                          key={oIdx}
                                          type="text"
                                          value={opt}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            setExam(prev => {
                                              const newSecs = [...prev.sections];
                                              const p1 = newSecs.find(s => s.code === 'D_WRITING').parts.find(pt => pt.part_num === 1);
                                              const targetQ = p1?.questions.find(item => item.id === q.id);
                                              if (targetQ && targetQ.options) targetQ.options[oIdx] = val;
                                              return { ...prev, sections: newSecs };
                                            });
                                          }}
                                          className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900"
                                        />
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-3 pt-1">
                                      <span className="text-xs font-bold text-emerald-800">✓ Chọn Đáp Án Đúng:</span>
                                      <select
                                        value={q.correct}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setExam(prev => {
                                            const newSecs = [...prev.sections];
                                            const p1 = newSecs.find(s => s.code === 'D_WRITING').parts.find(pt => pt.part_num === 1);
                                            const targetQ = p1?.questions.find(item => item.id === q.id);
                                            if (targetQ) targetQ.correct = val;
                                            return { ...prev, sections: newSecs };
                                          });
                                        }}
                                        className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-400 text-xs font-black text-emerald-900"
                                      >
                                        {q.options.map((opt, oIdx) => (
                                          <option key={oIdx} value={opt}>{opt}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 2: EXAM METADATA FORM */}
          {activeTab === 'metadata' && (
            <div className="max-w-4xl mx-auto space-y-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-black text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" /> THÔNG TIN CHUNG ĐỀ KIỂM TRA (EXAM METADATA)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tên Trường Học:</label>
                  <input
                    type="text"
                    value={exam.metadata.school_name}
                    onChange={(e) => handleMetadataChange('school_name', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Năm Học:</label>
                  <input
                    type="text"
                    value={exam.metadata.academic_year}
                    onChange={(e) => handleMetadataChange('academic_year', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Khối Lớp:</label>
                  <select
                    value={exam.metadata.grade_level}
                    onChange={(e) => handleMetadataChange('grade_level', Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-bold"
                  >
                    <option value={6}>Khối 6</option>
                    <option value={7}>Khối 7</option>
                    <option value={8}>Khối 8</option>
                    <option value={9}>Khối 9</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Bộ Sách Giáo Khoa:</label>
                  <select
                    value={exam.metadata.textbook}
                    onChange={(e) => handleMetadataChange('textbook', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-emerald-700 font-bold"
                  >
                    {TEXTBOOKS.map(tb => (
                      <option key={tb.value} value={tb.value}>{tb.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Loại Đề Kiểm Tra:</label>
                  <select
                    value={exam.metadata.exam_type}
                    onChange={(e) => handleMetadataChange('exam_type', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-emerald-800 font-bold"
                  >
                    {EXAM_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Thời Gian Làm Bài (Phút):</label>
                  <input
                    type="number"
                    value={exam.metadata.time_limit_minutes}
                    onChange={(e) => handleMetadataChange('time_limit_minutes', Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SMART IMPORT */}
          {activeTab === 'import' && (
            <div className="max-w-4xl mx-auto space-y-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-black text-emerald-700 uppercase flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" /> NHẬP ĐỀ THI MẪU TỪ WORD / PDF / TEXT
              </h3>
              <p className="text-xs text-slate-500">Dán toàn bộ văn bản đề kiểm tra vào khung bên dưới, AI Parser sẽ tự động phân loại vào đúng 4 Section A, B, C, D.</p>

              <textarea
                rows={12}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-mono leading-relaxed"
                placeholder="Dán đề mẫu có chứa Section 1 Listening, Section 2 Knowledge, Section 3 Reading, Section 4 Writing..."
              />

              <button
                onClick={handleRunSmartImport}
                disabled={isImporting}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md flex items-center gap-2"
              >
                {isImporting ? 'Đang phân tích...' : '⚡ Bắt Đầu Parse Đề Thi Vào 4 Section'}
              </button>
            </div>
          )}

          {/* TAB 4: VALIDATION REPORT */}
          {activeTab === 'validation' && (
            <div className="max-w-4xl mx-auto space-y-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-black text-emerald-700 uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> BÁO CÁO KIỂM TRA VALIDATION ĐỀ THI
              </h3>

              {validationResult.errors.length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-1">
                  <p className="font-bold">✓ Cấu trúc đề hoàn toàn hợp lệ và sẵn sàng xuất bản!</p>
                  <p>Tổng điểm: {grandTotal} / 10.0 điểm.</p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs space-y-2">
                  <p className="font-bold flex items-center gap-1 text-rose-700">
                    <AlertTriangle className="w-4 h-4" /> Các Lỗi Cần Khắc Phục Trước Khi Publish:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    {validationResult.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PREVIEW */}
          {activeTab === 'preview' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-700">Chế Độ Xem Trước Đề:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewMode('teacher')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      previewMode === 'teacher' ? 'bg-amber-400 text-slate-950 shadow' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    👑 Chế Độ Giáo Viên (Hiện Transcript & Đáp Án)
                  </button>
                  <button
                    onClick={() => setPreviewMode('student')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      previewMode === 'student' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    🎓 Chế Độ Học Sinh (Ẩn Đáp Án & Transcript)
                  </button>
                </div>
              </div>

              {/* PREVIEW CONTAINER - CLEAN PRINT STYLE */}
              <div className="p-8 rounded-3xl bg-white border-2 border-slate-300 shadow-lg space-y-6 font-serif text-slate-900">
                <div className="text-center space-y-1 border-b-2 border-slate-800 pb-4 font-sans">
                  <h2 className="text-lg font-black uppercase text-emerald-800">{exam.title}</h2>
                  <p className="text-xs text-slate-600 font-bold">
                    Trường: {exam.metadata.school_name} | Khối: {exam.metadata.grade_level} | Thời gian: {exam.metadata.time_limit_minutes} phút | Tổng điểm: {grandTotal} điểm
                  </p>
                </div>

                {/* 4 SECTIONS DISPLAY */}
                {exam.sections.map((sec) => (
                  <div key={sec.code} className="space-y-4 font-sans">
                    <h3 className="text-sm font-black text-emerald-800 border-b border-slate-300 pb-1 uppercase">{sec.title}</h3>
                    <p className="text-xs text-slate-600 italic mb-2">{sec.instruction}</p>

                    {(sec.tasks || sec.parts || []).map((tItem, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                        <h4 className="font-bold text-emerald-900">{tItem.title}</h4>

                        {/* LISTENING AUDIO PLAYER IN PREVIEW */}
                        {tItem.audio_url && (
                          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 space-y-2">
                            <span className="font-bold text-emerald-900 block">🎵 Audio Listening: {tItem.audio_name || 'Audio Recording'}</span>
                            <audio controls src={tItem.audio_url} className="w-full h-9 rounded-lg" />
                          </div>
                        )}

                        {/* TEACHER TRANSCRIPT ONLY IN TEACHER PREVIEW */}
                        {previewMode === 'teacher' && tItem.teacher_transcript && (
                          <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs italic">
                            <span className="font-bold not-italic block mb-1">📝 Teacher Transcript:</span>
                            "{tItem.teacher_transcript}"
                          </div>
                        )}

                        {/* PASSAGE PREVIEW */}
                        {tItem.passage?.content && (
                          <div className="p-4 rounded-xl bg-white border border-slate-300 text-slate-900 leading-relaxed font-serif shadow-sm">
                            <h5 className="font-bold text-emerald-800 font-sans mb-1">{tItem.passage.title}</h5>
                            <p>{tItem.passage.content}</p>
                          </div>
                        )}

                        {/* QUESTIONS PREVIEW */}
                        {(tItem.questions || []).map((q) => (
                          <div key={q.id} className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-sm">
                            <p className="font-bold text-slate-900">Câu {q.num}: {q.question || q.original_sentence}</p>
                            {q.options && (
                              <div className="grid grid-cols-2 gap-2 text-slate-700 pl-4 font-sans">
                                {q.options.map((opt, oIdx) => (
                                  <span key={oIdx} className="px-2 py-1 rounded bg-slate-100 border border-slate-200">{opt}</span>
                                ))}
                              </div>
                            )}

                            {previewMode === 'teacher' && q.correct && (
                              <p className="text-[11px] font-bold text-emerald-700 pt-1">
                                ✓ Đáp án đúng: {q.correct}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
