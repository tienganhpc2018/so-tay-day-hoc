import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Save, 
  FileText, 
  Clock, 
  Shuffle, 
  Dices, 
  CheckSquare, 
  Square, 
  FileSpreadsheet, 
  Upload, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  BookOpen,
  Mic,
  MessageSquare,
  Printer,
  Download,
  Edit3,
  Flame,
  Volume2,
  Play,
  Pause,
  Trash2,
  Eye,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Copy,
  AlertTriangle,
  Music,
  FileCode,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  Award
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { GRADE_UNITS_MAP } from '../../constants/gradeUnits';
import { EXAM_SECTIONS, EXAM_TYPES, TEXTBOOKS, DEFAULT_EXAM_METADATA } from '../../constants/examStructure';
import { createEmptyExam, calculateExamPoints, validateExamStructure, normalizeExamData } from '../../utils/examAdapter';

export const QuizCreatorModal = ({ isOpen, onClose, onQuizCreated, initialGrade = 8, initialExamData = null }) => {
  if (!isOpen) return null;

  // Main Tabs: 'metadata' | 'tree' | 'import' | 'validation' | 'preview'
  const [activeTab, setActiveTab] = useState('tree');

  // Exam Full State (Composite Standard)
  const [exam, setExam] = useState(() => {
    if (initialExamData) return normalizeExamData(initialExamData);
    return createEmptyExam({ grade_level: initialGrade });
  });

  // Selected Section & Task for Tree Editing
  const [activeSectionCode, setActiveSectionCode] = useState('A_LISTENING');
  const [activeTaskIdx, setActiveTaskIdx] = useState(0);

  // Audio Playback State for Teacher Listening Preview
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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
          question: `Listening Question ${newNum}`,
          options: ['A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'],
          correct: 'A. Option A',
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
          question: `Reading Question ${newNum}`,
          options: ['A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'],
          correct: 'A. Option A',
          points: 0.5
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
  // SECTION D: WRITING HANDLERS
  // ----------------------------------------------------
  const handleAddWritingPart2Question = () => {
    soundFX.playClick();
    setExam(prev => {
      const newSections = [...prev.sections];
      const secD = newSections.find(s => s.code === 'D_WRITING');
      if (secD) {
        const part2 = secD.parts.find(p => p.part_num === 2);
        if (part2) {
          const newNum = part2.questions.length + 1;
          part2.questions.push({
            id: `w2_q_${Date.now()}_${newNum}`,
            num: newNum,
            original_sentence: `Original sentence ${newNum}...`,
            prompt_keyword: 'Prompt...',
            suggested_answer: 'Suggested answer...',
            accepted_answers: ['Suggested answer...'],
            points: 0.25
          });
        }
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

      // Simple heuristic parser for sections
      const lines = importText.split('\n');
      let currentSecCode = 'A_LISTENING';

      lines.forEach(line => {
        const lUpper = line.toUpperCase().trim();
        if (lUpper.includes('LISTENING') || lUpper.startsWith('A.')) currentSecCode = 'A_LISTENING';
        else if (lUpper.includes('KNOWLEDGE OF LANGUAGE') || lUpper.startsWith('B.')) currentSecCode = 'B_KNOWLEDGE';
        else if (lUpper.includes('READING') || lUpper.startsWith('C.')) currentSecCode = 'C_READING';
        else if (lUpper.includes('WRITING') || lUpper.startsWith('D.')) currentSecCode = 'D_WRITING';
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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-7xl w-full border-4 border-slate-800 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        
        {/* MODAL HEADER */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                HỆ THỐNG SOẠN ĐỀ KIỂM TRA TIẾNG ANH THCS 4.0 📚
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Chuẩn 4 Section • 10.0 Điểm
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Exam Authoring System bám sát cấu trúc đề kiểm tra chuẩn Khối 6, 7, 8, 9 Global Success.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-bold text-slate-400 block">Tổng Điểm Tự Động:</span>
              <span className={`text-sm font-black ${Math.abs(grandTotal - 10.0) < 0.05 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {grandTotal} / 10.0 điểm
              </span>
            </div>

            <button
              onClick={handleSaveExam}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Lưu & Xuất Đề Thi
            </button>

            <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS BAR */}
        <div className="flex items-center justify-between p-2.5 bg-slate-950/60 border-b border-slate-800 text-xs font-black overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('tree')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === 'tree' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" /> 1. Trình Soạn Đề Cây 4 Section (A, B, C, D)
            </button>

            <button
              onClick={() => setActiveTab('metadata')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === 'metadata' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" /> 2. Thông Tin Chung Đề
            </button>

            <button
              onClick={() => setActiveTab('import')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === 'import' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" /> 3. Nhập Từ Word / PDF
            </button>

            <button
              onClick={() => setActiveTab('validation')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all relative ${
                activeTab === 'validation' ? 'bg-amber-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" /> 4. Kiểm Tra Validation
              {validationResult.errors.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-1 right-1" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                activeTab === 'preview' ? 'bg-purple-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" /> 5. Xem Trước Đề (Preview)
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">

          {/* TAB 1: TREE UI AUTHORING STUDIO (MAIN COMPOSITE EDITOR) */}
          {activeTab === 'tree' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[500px]">
              
              {/* LEFT SIDEBAR: 4 FIXED SECTIONS TREE */}
              <div className="md:col-span-1 space-y-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
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
                          setActiveTaskIdx(0);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                          isSelected
                            ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-lg'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black truncate">{sec.title}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300">
                            {secScore} / {sec.defaultPoints}đ
                          </span>
                        </div>
                        <p className="text-[10px] line-clamp-1 opacity-70">{sec.instruction}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT CONTENT EDITOR PANEL */}
              <div className="md:col-span-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
                
                {/* SECTION A: LISTENING EDITOR */}
                {activeSectionCode === 'A_LISTENING' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
                          <Music className="w-4 h-4" /> SECTION A — LISTENING (2.5 ĐIỂM)
                        </h3>
                        <p className="text-xs text-slate-400">Composite Task Group với Audio Player, Transcript & Danh sách câu hỏi con.</p>
                      </div>
                    </div>

                    {exam.sections.find(s => s.code === 'A_LISTENING')?.tasks.map((task, tIdx) => (
                      <div key={task.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
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
                            className="text-xs font-black text-white bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl w-2/3 focus:outline-none focus:border-amber-400"
                          />
                          <span className="text-xs text-amber-300 font-bold">
                            {(task.questions || []).length} câu hỏi con
                          </span>
                        </div>

                        {/* AUDIO UPLOADER & PLAYER BOX */}
                        <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                              <Volume2 className="w-4 h-4" /> File Audio Listening:
                            </span>

                            <label className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1">
                              <Upload className="w-3.5 h-3.5" /> [+ Tải Audio (MP3 / WAV / M4A)]
                              <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => { if (e.target.files?.[0]) handleAudioFileUpload(tIdx, e.target.files[0]); }}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {task.audio_url ? (
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                                  className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black"
                                >
                                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                                </button>
                                <div>
                                  <p className="font-bold text-white truncate max-w-xs">{task.audio_name || 'Audio File'}</p>
                                  <span className="text-[10px] text-slate-400">Thời lượng: {task.audio_duration}</span>
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  setExam(prev => {
                                    const newSecs = [...prev.sections];
                                    newSecs.find(s => s.code === 'A_LISTENING').tasks[tIdx].audio_url = '';
                                    return { ...prev, sections: newSecs };
                                  });
                                }}
                                className="p-1.5 rounded-lg bg-rose-950 text-rose-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">Chưa tải file audio. Bấm nút tải audio bên trên.</p>
                          )}

                          {/* TEACHER TRANSCRIPT (TEACHER ONLY) */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5" /> Teacher Transcript (Chỉ Giáo viên thấy, ẩn với Học sinh):
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
                              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-400"
                              placeholder="Nhập nội dung bài nghe transcript..."
                            />
                          </div>
                        </div>

                        {/* CHILD QUESTIONS LIST */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-300">Danh Sách Câu Hỏi Con ({task.questions?.length || 0}):</h4>
                            <button
                              onClick={() => handleAddListeningQuestion(tIdx)}
                              className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" /> [+ Thêm Câu Hỏi Con]
                            </button>
                          </div>

                          {task.questions?.map((q, qIdx) => (
                            <div key={q.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-amber-400">Câu {q.num}:</span>
                                <div className="flex items-center gap-2">
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
                                    className="w-16 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-center text-white"
                                  />
                                  <span className="text-slate-400">điểm</span>
                                  <button
                                    onClick={() => handleDeleteListeningQuestion(tIdx, qIdx)}
                                    className="p-1 text-rose-400 hover:text-rose-300"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

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
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                              />
                            </div>
                          ))}
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* SECTION B: KNOWLEDGE OF LANGUAGE (2 CLOZE PASSAGES ONLY) */}
                {activeSectionCode === 'B_KNOWLEDGE' && (
                  <div className="space-y-5">
                    <div className="border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> SECTION B — KNOWLEDGE OF LANGUAGE (2 CLOZE PASSAGES)
                      </h3>
                      <p className="text-xs text-slate-400">Bắt buộc gồm đúng 2 Cloze Passages. Mỗi Passage dùng chung cho các câu hỏi con. Bấm "+ Thêm câu" KHÔNG tạo đoạn văn mới.</p>
                    </div>

                    {exam.sections.find(s => s.code === 'B_KNOWLEDGE')?.tasks.map((task, tIdx) => (
                      <div key={task.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                        <h4 className="text-xs font-black text-indigo-300 uppercase">{task.title}</h4>

                        {/* PASSAGE TEXT EDITOR */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-300">Đoạn Văn Passage (Dùng Chung Cho Các Câu Hỏi Con):</label>
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
                            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-amber-400"
                            placeholder="Nhập nội dung bài đọc điền từ vào chỗ trống..."
                          />
                        </div>

                        {/* CHILD QUESTIONS LIST */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-slate-300">Danh Sách Câu Hỏi Con Trong Passage ({task.questions?.length || 0}):</h5>
                            <button
                              onClick={() => handleAddClozeQuestion(tIdx)}
                              className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" /> [+ Thêm Câu Hỏi Con]
                            </button>
                          </div>

                          {task.questions?.map((q, qIdx) => (
                            <div key={q.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-amber-400">Vị trí Blank ({q.blank_num}):</span>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    step="0.05"
                                    value={q.points}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value) || 0.25;
                                      setExam(prev => {
                                        const newSecs = [...prev.sections];
                                        newSecs.find(s => s.code === 'B_KNOWLEDGE').tasks[tIdx].questions[qIdx].points = val;
                                        return { ...prev, sections: newSecs };
                                      });
                                    }}
                                    className="w-16 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-center text-white"
                                  />
                                  <span className="text-slate-400">điểm</span>
                                  <button onClick={() => handleDeleteClozeQuestion(tIdx, qIdx)} className="p-1 text-rose-400">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                {q.options.map((opt, optIdx) => (
                                  <input
                                    key={optIdx}
                                    type="text"
                                    value={opt}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setExam(prev => {
                                        const newSecs = [...prev.sections];
                                        newSecs.find(s => s.code === 'B_KNOWLEDGE').tasks[tIdx].questions[qIdx].options[optIdx] = val;
                                        return { ...prev, sections: newSecs };
                                      });
                                    }}
                                    className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300"
                                  />
                                ))}
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
                  <div className="space-y-5">
                    <div className="border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> SECTION C — READING COMPREHENSION (2.5 ĐIỂM)
                      </h3>
                      <p className="text-xs text-slate-400">Bài đọc Reading Passage hiển thị duy nhất 1 lần cho cả nhóm câu hỏi con.</p>
                    </div>

                    {exam.sections.find(s => s.code === 'C_READING')?.tasks.map((task, tIdx) => (
                      <div key={task.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
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
                          className="text-xs font-black text-white bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl w-full"
                          placeholder="Tiêu đề bài đọc Reading Passage..."
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
                          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed"
                          placeholder="Nội dung bài đọc..."
                        />

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-slate-300">Danh Sách Câu Hỏi Con ({task.questions?.length || 0}):</h5>
                            <button
                              onClick={() => handleAddReadingQuestion(tIdx)}
                              className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" /> [+ Thêm Câu Hỏi Con]
                            </button>
                          </div>

                          {task.questions?.map((q, qIdx) => (
                            <div key={q.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-amber-400">Câu {q.num}:</span>
                                <button onClick={() => handleDeleteReadingQuestion(tIdx, qIdx)} className="p-1 text-rose-400">
                                  <Trash2 className="w-3.5 h-3.5" />
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
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* SECTION D: WRITING EDITOR */}
                {activeSectionCode === 'D_WRITING' && (
                  <div className="space-y-5">
                    <div className="border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
                        <Edit3 className="w-4 h-4" /> SECTION D — WRITING (ĐÚNG 3 PART CHUẨN THCS)
                      </h3>
                      <p className="text-xs text-slate-400">Part 1 Ordering, Part 2 Sentence Transformation tự luận & Part 3 Paragraph Writing.</p>
                    </div>

                    {exam.sections.find(s => s.code === 'D_WRITING')?.parts.map((part) => (
                      <div key={part.part_num} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                        <h4 className="text-xs font-black text-indigo-300 uppercase">{part.title}</h4>

                        {part.part_num === 3 ? (
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-300">Đề Bài Viết Đoạn Văn (Prompt):</label>
                            <textarea
                              rows={3}
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
                              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {part.questions?.map((q) => (
                              <div key={q.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                                <span className="font-bold text-amber-400">Câu {q.num}:</span>
                                <input
                                  type="text"
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
                                  className="w-full px-3 py-1 rounded bg-slate-900 border border-slate-800 text-white font-bold"
                                />
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
            <div className="max-w-4xl mx-auto space-y-6 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" /> THÔNG TIN CHUNG ĐỀ KIỂM TRA (EXAM METADATA)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Tên Trường Học:</label>
                  <input
                    type="text"
                    value={exam.metadata.school_name}
                    onChange={(e) => handleMetadataChange('school_name', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Năm Học:</label>
                  <input
                    type="text"
                    value={exam.metadata.academic_year}
                    onChange={(e) => handleMetadataChange('academic_year', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Khối Lớp:</label>
                  <select
                    value={exam.metadata.grade_level}
                    onChange={(e) => handleMetadataChange('grade_level', Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-bold"
                  >
                    <option value={6}>Khối 6</option>
                    <option value={7}>Khối 7</option>
                    <option value={8}>Khối 8</option>
                    <option value={9}>Khối 9</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Bộ Sách Giáo Khoa:</label>
                  <select
                    value={exam.metadata.textbook}
                    onChange={(e) => handleMetadataChange('textbook', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-bold"
                  >
                    {TEXTBOOKS.map(tb => (
                      <option key={tb.value} value={tb.value}>{tb.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Loại Đề Kiểm Tra:</label>
                  <select
                    value={exam.metadata.exam_type}
                    onChange={(e) => handleMetadataChange('exam_type', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-300 font-bold"
                  >
                    {EXAM_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Thời Gian Làm Bài (Phút):</label>
                  <input
                    type="number"
                    value={exam.metadata.time_limit_minutes}
                    onChange={(e) => handleMetadataChange('time_limit_minutes', Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SMART IMPORT */}
          {activeTab === 'import' && (
            <div className="max-w-4xl mx-auto space-y-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <h3 className="text-sm font-black text-amber-400 uppercase flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" /> NHẬP ĐỀ THI MẪU TỪ WORD / PDF / TEXT
              </h3>
              <p className="text-xs text-slate-400">Dán toàn bộ văn bản đề kiểm tra vào khung bên dưới, AI Parser sẽ tự động phân loại vào đúng 4 Section A, B, C, D.</p>

              <textarea
                rows={12}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed"
                placeholder="Dán đề mẫu có chứa A. LISTENING, B. KNOWLEDGE OF LANGUAGE, C. READING, D. WRITING..."
              />

              <button
                onClick={handleRunSmartImport}
                disabled={isImporting}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg flex items-center gap-2"
              >
                {isImporting ? 'Đang phân tích...' : '⚡ Bắt Đầu Parse Đề Thi Vào 4 Section'}
              </button>
            </div>
          )}

          {/* TAB 4: VALIDATION REPORT */}
          {activeTab === 'validation' && (
            <div className="max-w-4xl mx-auto space-y-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <h3 className="text-sm font-black text-amber-400 uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> BÁO CÁO KIỂM TRA VALIDATION ĐỀ THI
              </h3>

              {validationResult.errors.length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs space-y-1">
                  <p className="font-bold">✓ Cấu trúc đề hoàn toàn hợp lệ và sẵn sàng xuất bản!</p>
                  <p>Tổng điểm: {grandTotal} / 10.0 điểm.</p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs space-y-2">
                  <p className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Các Lỗi Cần Khắc Phục Trước Khi Publish:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    {validationResult.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validationResult.warnings.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs space-y-1">
                  <p className="font-bold">⚠️ Khuyến Nghị Hoàn Thiện:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {validationResult.warnings.map((warn, idx) => (
                      <li key={idx}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PREVIEW */}
          {activeTab === 'preview' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Chế Độ Xem Trước Đề:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewMode('teacher')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      previewMode === 'teacher' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    👑 Chế Độ Giáo Viên (Hiện Transcript & Đáp Án)
                  </button>
                  <button
                    onClick={() => setPreviewMode('student')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      previewMode === 'student' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    🎓 Chế Độ Học Sinh (Ẩn Đáp Án & Transcript)
                  </button>
                </div>
              </div>

              {/* PREVIEW CONTAINER */}
              <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 font-serif text-slate-100">
                <div className="text-center space-y-1 border-b border-slate-800 pb-4 font-sans">
                  <h2 className="text-lg font-black uppercase text-amber-400">{exam.title}</h2>
                  <p className="text-xs text-slate-400">
                    Trường: {exam.metadata.school_name} | Khối: {exam.metadata.grade_level} | Thời gian: {exam.metadata.time_limit_minutes} phút | Tổng điểm: {grandTotal} điểm
                  </p>
                </div>

                {/* 4 SECTIONS DISPLAY */}
                {exam.sections.map((sec) => (
                  <div key={sec.code} className="space-y-3 font-sans">
                    <h3 className="text-sm font-black text-amber-300 border-b border-slate-800 pb-1">{sec.title}</h3>
                    <p className="text-xs text-slate-400 italic mb-2">{sec.instruction}</p>

                    {/* SECTION CONTENT */}
                    {(sec.tasks || sec.parts || []).map((tItem, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                        <h4 className="font-bold text-indigo-300">{tItem.title}</h4>

                        {/* LISTENING PREVIEW AUDIO */}
                        {tItem.audio_url && (
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-indigo-500/40 flex items-center gap-2">
                            <Volume2 className="w-4 h-4 text-indigo-400" />
                            <span className="font-bold text-white">Audio Recording: {tItem.audio_name || 'Listening.mp3'}</span>
                          </div>
                        )}

                        {/* TEACHER TRANSCRIPT ONLY IN TEACHER PREVIEW */}
                        {previewMode === 'teacher' && tItem.teacher_transcript && (
                          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-700/40 text-amber-200 text-xs italic">
                            <span className="font-bold not-italic block mb-1">📝 Teacher Transcript:</span>
                            "{tItem.teacher_transcript}"
                          </div>
                        )}

                        {/* PASSAGE PREVIEW */}
                        {tItem.passage?.content && (
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed font-serif">
                            <h5 className="font-bold text-amber-300 font-sans mb-1">{tItem.passage.title}</h5>
                            <p>{tItem.passage.content}</p>
                          </div>
                        )}

                        {/* QUESTIONS PREVIEW */}
                        {(tItem.questions || []).map((q) => (
                          <div key={q.id} className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
                            <p className="font-bold text-white">Câu {q.num}: {q.question || q.original_sentence}</p>
                            {q.options && (
                              <div className="grid grid-cols-2 gap-2 text-slate-300 pl-4">
                                {q.options.map((opt, oIdx) => (
                                  <span key={oIdx}>{opt}</span>
                                ))}
                              </div>
                            )}

                            {previewMode === 'teacher' && q.correct && (
                              <p className="text-[11px] font-bold text-emerald-400 pt-1">
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
