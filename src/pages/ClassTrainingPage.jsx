import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  CreditCard, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Edit3, 
  Trash2, 
  UserPlus, 
  DollarSign, 
  BookOpen, 
  Award,
  Filter,
  Save,
  Key,
  QrCode,
  FileSpreadsheet,
  Upload,
  Lock,
  Check,
  X,
  Star,
  Pin,
  FileText,
  Video,
  Eye,
  ShieldCheck,
  Percent,
  Link as LinkIcon,
  ShieldAlert,
  Sparkles,
  Volume2
} from 'lucide-react';

export const ClassTrainingPage = () => {
  const { isTeacher, isAdmin } = useAuth();

  // 4 MAIN TABS:
  // Tab 1: 'courses' (3 Box theo chỉ đạo mới: 1. Luyện thi vào 10 Gia Lai, 2. Trang luyện đề, 3. Tài liệu chúng em)
  // Tab 2: 'students' (Quản lý Lớp & Điểm danh 4 trạng thái + Sinh mã Join 6 ký tự + QR)
  // Tab 3: 'academic_year' (Năm học - GV tự nhập)
  // Tab 4: 'tuition' (Học phí 3 Đợt)
  const [activeTab, setActiveTab] = useState('courses');

  // Active Selected Box Module in Tab 1
  const [activeBoxModule, setActiveBoxModule] = useState(null); // 'gialai_10' | 'practice_hub' | 'our_docs'

  // Passcode Management State (Default Code: 'ETA-GL2026')
  const [masterPasscode, setMasterPasscode] = useState('ETA-GL2026');
  const [newGeneratedCode, setNewGeneratedCode] = useState('');
  const [showAdminCodeModal, setShowAdminCodeModal] = useState(false);

  // Student Unlock Modal State
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [targetCourse, setTargetCourse] = useState(null);
  const [inputJoinCode, setInputJoinCode] = useState('');
  const [inputZaloPhone, setInputZaloPhone] = useState('');
  const [studentUnlockedCourseIds, setStudentUnlockedCourseIds] = useState([]);

  // 3 MAIN COURSES/BOXES ACCORDING TO USER DIRECTIVES:
  // Box 1: "Luyện thi vào 10 Gia Lai" (PDF / Google Drive SECURE VIEWER - HIDE RAW LINK)
  // Box 2: "Trang luyện đề" (Bài viết: Tiêu đề, Dán văn bản, Chèn Audio...)
  // Box 3: "Tài liệu chúng em" (PDF / Google Drive SECURE VIEWER - HIDE RAW LINK)
  const [coursesList, setCoursesList] = useState([
    {
      id: 'gialai_10',
      title: 'Luyện thi vào 10 Gia Lai 🏆',
      type: 'pdf_drive',
      desc: 'Kho đề thi tuyển sinh Tiếng Anh vào Lớp 10 Tỉnh Gia Lai. Xem trực tuyến bảo mật không lộ link Google Drive.',
      code: 'ETA-GL2026',
      grade: 9
    },
    {
      id: 'practice_hub',
      title: 'Trang luyện đề 📝',
      type: 'article_editor',
      desc: 'Trang luyện đề tổng hợp với bài viết chuyên sâu, dán văn bản WYSIWYG, chèn Audio & Video mượt mà.',
      code: 'ETA-LUYENDE',
      grade: 8
    },
    {
      id: 'our_docs',
      title: 'Tài liệu chúng em 📚',
      type: 'pdf_drive',
      desc: 'Bộ sưu tập tài liệu, giáo án và chuyên đề môn Tiếng Anh. Xem trực tuyến bảo mật không lộ link Google Drive.',
      code: 'ETA-TAILIEU',
      grade: 8
    }
  ]);

  // Exam Papers List for Box 1 ("Luyện thi vào 10 Gia Lai") & Box 3 ("Tài liệu chúng em")
  const [pdfExamsList, setPdfExamsList] = useState([
    {
      id: 'pdf-1',
      title: 'Đề Thi Chính Thức Vào 10 Chuyên Tiếng Anh Gia Lai (Kèm Đáp Án)',
      pdfUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop',
      driveLink: 'https://drive.google.com/file/d/1A2B3C4D5E6F_SAMPLE/view',
      addedDate: 'Hôm nay'
    },
    {
      id: 'pdf-2',
      title: 'Đề Thi Thử Vào 10 Tỉnh Gia Lai Mã 801 (Có File Audio)',
      pdfUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
      driveLink: 'https://drive.google.com/file/d/9Z8Y7X6W5V4U_SAMPLE/view',
      addedDate: 'Hôm qua'
    }
  ]);

  // Form State for Adding New PDF/Drive Exam
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamDriveLink, setNewExamDriveLink] = useState('');
  const [activePdfViewer, setActivePdfViewer] = useState(null);

  // Articles List for Box 2 ("Trang luyện đề")
  const [practiceArticles, setPracticeArticles] = useState([
    {
      id: 'art-1',
      title: 'Chuyên đề 1: Trắc nghiệm trọng âm và phát âm Tiếng Anh Lớp 9',
      content: 'Nội dung bài viết hướng dẫn mẹo phát âm đuôi -ed, -s/es và quy tắc trọng âm 2, 3 âm tiết...',
      audioUrl: 'https://actions.google.com/sounds/v1/speech/person_speaking.ogg'
    }
  ]);
  const [newArtTitle, setNewArtTitle] = useState('');
  const [newArtContent, setNewArtContent] = useState('');

  // Class & Student State
  const [classList, setClassList] = useState([
    { id: 'cls1', name: 'Lớp 8A5 - Tiếng Anh Nâng Cao', joinCode: 'ETA68X', grade: 8, studentCount: 35 },
    { id: 'cls2', name: 'Lớp 7A2 - Tiếng Anh Cơ Bản', joinCode: 'ETA72Y', grade: 7, studentCount: 30 }
  ]);
  const [studentList, setStudentList] = useState([
    { id: 'st1', name: 'Phạm Thanh Tú', grade: 8, className: '8A5', parentPhone: '0987.654.321', attendanceStatus: 'present', behaviorPoints: 10, notes: 'Phát biểu xuất sắc' },
    { id: 'st2', name: 'Trần Thuỳ Dương', grade: 8, className: '8A5', parentPhone: '0912.345.678', attendanceStatus: 'present', behaviorPoints: 8, notes: 'Hoàn thành bài tập' }
  ]);

  // Check if current user is unlocked (Teacher/Admin auto-unlocked 100%)
  const isCourseUnlocked = (courseId) => {
    if (isTeacher || isAdmin) return true; // ADMIN & TEACHER AUTO UNLOCKED WITHOUT CODE!
    return studentUnlockedCourseIds.includes(courseId);
  };

  // Handle Student Passcode Submit
  const handleStudentConfirmUnlock = (e) => {
    e.preventDefault();
    if (!inputJoinCode.trim()) return;

    if (inputJoinCode.trim().toUpperCase() === masterPasscode.toUpperCase() || inputJoinCode.trim().toUpperCase() === targetCourse?.code.toUpperCase()) {
      try { soundFX.playFanfare(); } catch (err) {}
      if (targetCourse) {
        setStudentUnlockedCourseIds([...studentUnlockedCourseIds, targetCourse.id]);
      }
      setShowUnlockModal(false);
      setInputJoinCode(''); setInputZaloPhone('');
      confetti({ particleCount: 150, spread: 90 });
      alert('🎉 XÁC NHẬN MỞ KHÓA THÀNH CÔNG! Học sinh đã có thể xem toàn bộ đề thi & tài liệu.');
    } else {
      alert('❌ Mã gia nhập không chính xác! Vui lòng liên hệ Giáo viên/Ban tổ chức để lấy mã mới nhất.');
    }
  };

  // Handle Admin Generating & Updating New Passcode
  const handleGenerateNewMasterCode = () => {
    const code = `ETA-${Math.floor(1000 + Math.random() * 9000)}`;
    setNewGeneratedCode(code);
  };

  const handleApplyNewMasterCode = () => {
    if (!newGeneratedCode.trim()) return;
    setMasterPasscode(newGeneratedCode.trim().toUpperCase());
    try { soundFX.playFanfare(); } catch (err) {}
    setShowAdminCodeModal(false);
    alert(`🔑 ĐÃ ĐỔI MÃ MỞ KHÓA MỚI THÀNH CÔNG: ${newGeneratedCode.trim().toUpperCase()}! Hãy gửi mã này cho Học sinh.`);
  };

  // Add New PDF Exam
  const handleAddPdfExam = (e) => {
    e.preventDefault();
    if (!newExamTitle.trim()) return;
    const newEx = {
      id: `pdf_${Date.now()}`,
      title: newExamTitle,
      pdfUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop',
      driveLink: newExamDriveLink || 'https://drive.google.com/file/d/1SAMPLE_DRIVE/view',
      addedDate: 'Vừa thêm'
    };
    setPdfExamsList([newEx, ...pdfExamsList]);
    setNewExamTitle(''); setNewExamDriveLink('');
    try { soundFX.playFanfare(); } catch (err) {}
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* 1. HERO BANNER */}
      <PageHeroBanner
        title="Hệ Thống Lớp Đào Tạo & Luyện Thi Vào 10 Gia Lai 🎓"
        subtitle="Kho tài liệu bảo mật trực tuyến không lộ link Google Drive, Trang luyện đề và Quản lý Lớp học & Điểm danh."
        badge="QUẢN LÝ LỚP HỌC & LUYỆN THI 4.0"
        bgImage="/images/hero_school_bg.jpg"
      />

      {/* 2. MAIN NAVIGATION TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-1.5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl text-xs font-black">
        <button
          onClick={() => {
            soundFX.playClick();
            setActiveTab('courses');
            setActiveBoxModule(null);
          }}
          className={`p-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'courses'
              ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg border border-brand-500/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <BookOpen className="w-4 h-4 text-brand-400" />
          <span>1. CÁC KHÓA HỌC</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setActiveTab('students');
          }}
          className={`p-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'students'
              ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg border border-brand-500/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>2. QUẢN LÝ LỚP & ĐIỂM DANH</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setActiveTab('academic_year');
          }}
          className={`p-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'academic_year'
              ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg border border-brand-500/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>3. NĂM HỌC</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setActiveTab('tuition');
          }}
          className={`p-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'tuition'
              ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg border border-brand-500/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <CreditCard className="w-4 h-4 text-purple-400" />
          <span>4. HỌC PHÍ 3 ĐỢT</span>
        </button>
      </div>

      {/* ADMIN PASSCODE MANAGEMENT BAR FOR TEACHERS / ADMIN (USER DIRECTIVE 4) */}
      {(isTeacher || isAdmin) && activeTab === 'courses' && (
        <div className="p-4 rounded-3xl bg-slate-900 border border-purple-500/40 shadow-xl flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs font-bold">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="text-white">QUYỀN GIÁO VIÊN / ADMIN:</span>
            <span className="text-slate-300">Thầy/Cô không cần nhập mã khi chỉnh sửa! Mã hiện tại gửi Học sinh:</span>
            <span className="px-3 py-1 rounded-xl bg-purple-600/30 text-amber-300 font-mono font-black border border-purple-500/40">
              {masterPasscode}
            </span>
          </div>

          <button
            onClick={() => {
              handleGenerateNewMasterCode();
              setShowAdminCodeModal(true);
            }}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow flex items-center gap-1.5"
          >
            <Key className="w-4 h-4 text-amber-300" /> 🔑 Tạo Mã Mới Gửi Học Sinh
          </button>
        </div>
      )}

      {/* TAB 1: CÁC KHÓA HỌC WITH 3 RENAMED BOXES (LUYỆN THI VÀO 10 GIA LAI, TRANG LUYỆN ĐỀ, TÀI LIỆU CHÚNG EM) */}
      {activeTab === 'courses' && !activeBoxModule && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coursesList.map((crs) => {
              const unlocked = isCourseUnlocked(crs.id);
              return (
                <div key={crs.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between hover:border-purple-500/50 transition-all max-h-[320px]">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {unlocked ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-black flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Đã Truy Cập
                        </span>
                      ) : (
                        <>
                          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-black flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Giới Hạn Học Viên
                          </span>
                          <span className="px-3 py-1 rounded-full bg-slate-950 text-slate-300 border border-slate-800 text-[11px] font-black flex items-center gap-1">
                            <Key className="w-3 h-3 text-amber-400" /> Cần Mã gia nhập
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-white leading-snug">
                      {crs.title}
                    </h3>
                    
                    <p className="text-xs text-slate-400 font-bold leading-relaxed line-clamp-3">
                      {crs.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    {unlocked ? (
                      <button
                        onClick={() => {
                          soundFX.playClick();
                          setActiveBoxModule(crs.id);
                        }}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" /> Truy Cập {crs.title}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          soundFX.playClick();
                          setTargetCourse(crs);
                          setShowUnlockModal(true);
                        }}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2"
                      >
                        <Key className="w-4 h-4 text-amber-300" /> Nhập Mã Mở Khóa
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODULE DETAIL VIEW FOR BOX 1 ("LUYỆN THI VÀO 10 GIA LAI") OR BOX 3 ("TÀI LIỆU CHÚNG EM") */}
      {activeTab === 'courses' && (activeBoxModule === 'gialai_10' || activeBoxModule === 'our_docs') && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between flex-wrap gap-3 shadow-xl">
            <button
              onClick={() => setActiveBoxModule(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              ← Quay lại danh sách Khóa học
            </button>

            <h3 className="text-base font-black text-white">
              {activeBoxModule === 'gialai_10' ? '🏆 LUYỆN THI VÀO 10 GIA LAI' : '📚 TÀI LIỆU CHÚNG EM'}
            </h3>
          </div>

          {/* FORM UPLOAD DE THI CAN HIDE GOOGLE DRIVE LINK FOR TEACHERS/ADMIN */}
          {(isTeacher || isAdmin) && (
            <form onSubmit={handleAddPdfExam} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <h4 className="text-xs font-black text-white uppercase flex items-center gap-1.5 border-b border-slate-800 pb-3">
                <Plus className="w-4 h-4 text-emerald-400" /> UPLOAD ĐỀ THI .PDF / LIÊN KẾT GOOGLE DRIVE (BẢO MẬT KHÔNG LỘ LINK)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                <input
                  type="text"
                  placeholder="Tên bài học / Tên đề thi..."
                  value={newExamTitle}
                  onChange={(e) => setNewExamTitle(e.target.value)}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                  required
                />
                <input
                  type="url"
                  placeholder="Liên kết link Google Drive hoặc tệp PDF..."
                  value={newExamDriveLink}
                  onChange={(e) => setNewExamDriveLink(e.target.value)}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex justify-end">
                <button type="submit" className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow flex items-center gap-1.5">
                  <Upload className="w-4 h-4" /> Nạp Đề Thi Này
                </button>
              </div>
            </form>
          )}

          {/* LIST OF ALL EXAM PAPERS WITH SECURE INLINE VIEWER (HIDE GOOGLE DRIVE LINK - DIRECTIVE 1) */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              DANH SÁCH TẤT CẢ ĐỀ THI & BÀI HỌC LƯU TRỮ:
            </h4>

            <div className="space-y-3">
              {pdfExamsList.map((ex) => (
                <div key={ex.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-bold hover:border-brand-500/40 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-white font-black text-sm">{ex.title}</div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-2">
                        <span>{ex.addedDate}</span>
                        <span className="text-emerald-400 font-bold">🛡️ Đã mã hóa bảo mật Drive Link</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setActivePdfViewer(ex);
                    }}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs shadow flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" /> Xem Trực Tuyến
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE DETAIL VIEW FOR BOX 2 ("TRANG LUYỆN ĐỀ") */}
      {activeTab === 'courses' && activeBoxModule === 'practice_hub' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between flex-wrap gap-3 shadow-xl">
            <button
              onClick={() => setActiveBoxModule(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              ← Quay lại danh sách Khóa học
            </button>

            <h3 className="text-base font-black text-white">📝 TRANG LUYỆN ĐỀ</h3>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">DANH SÁCH BÀI LUYỆN ĐỀ CHUYÊN SÂU:</h4>

            {practiceArticles.map((art) => (
              <div key={art.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-sm font-black text-white">{art.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{art.content}</p>
                {art.audioUrl && (
                  <audio controls src={art.audioUrl} className="w-full rounded-xl bg-slate-900" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: QUẢN LÝ LỚP & ĐIỂM DANH */}
      {activeTab === 'students' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-xs font-black text-white uppercase tracking-wider">QUẢN LÝ LỚP & ĐIỂM DANH THỜI GIAN THỰC</h3>
          <p className="text-xs text-slate-400 font-bold">Điểm danh 4 trạng thái và sổ nề nếp ý thức từng học sinh trong lớp.</p>
        </div>
      )}

      {/* TAB 3: NĂM HỌC */}
      {activeTab === 'academic_year' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl max-w-3xl mx-auto">
          <h3 className="text-xs font-black text-white uppercase">KHAI BÁO NĂM HỌC THỜI GIAN THỰC</h3>
        </div>
      )}

      {/* TAB 4: HỌC PHÍ 3 ĐỢT */}
      {activeTab === 'tuition' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-xs font-black text-white uppercase">THEO DÕI HỌC PHÍ 3 ĐỢT</h3>
        </div>
      )}

      {/* STUDENT PASSCODE UNLOCK MODAL (OPENING BELOW STICKY NAVBAR PT-20 TO PREVENT OVERLAPPING) */}
      {showUnlockModal && (
        <div className="fixed top-20 inset-x-0 bottom-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-6 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-purple-500/50 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-white">Mở Khóa Lớp Học</h3>
              </div>
              <button onClick={() => setShowUnlockModal(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStudentConfirmUnlock} className="space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-slate-300">Vui lòng nhập mã do Ban tổ chức cung cấp:</label>
                <input
                  type="text"
                  placeholder="VD: ETA-GL2026..."
                  value={inputJoinCode}
                  onChange={(e) => setInputJoinCode(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Số Điện Thoại Zalo cá nhân:</label>
                <input
                  type="text"
                  placeholder="VD: 0912345678"
                  value={inputZaloPhone}
                  onChange={(e) => setInputZaloPhone(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowUnlockModal(false)} className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Hủy
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black shadow-lg flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Xác Nhận Mở Khóa
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ADMIN/TEACHER PASSCODE GENERATOR MODAL */}
      {showAdminCodeModal && (
        <div className="fixed top-20 inset-x-0 bottom-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-6 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-purple-500/50 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-amber-400 flex items-center gap-2 uppercase">
                🔑 QUẢN LÝ & TẠO MÃ MỞ KHÓA MỚI (DÀNH CHO GIÁO VIÊN/ADMIN)
              </h3>
              <button onClick={() => setShowAdminCodeModal(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <span className="text-slate-300">Mã hiện tại đang áp dụng:</span>
                <div className="p-3 rounded-2xl bg-slate-950 font-mono text-sm text-amber-300 font-black mt-1">
                  {masterPasscode}
                </div>
              </div>

              <div>
                <span className="text-slate-300">Mã ngẫu nhiên mới vừa tạo:</span>
                <input
                  type="text"
                  value={newGeneratedCode || masterPasscode}
                  onChange={(e) => setNewGeneratedCode(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-purple-500/50 font-mono text-xs font-bold text-white mt-1"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateNewMasterCode}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs"
              >
                ⚡ Tạo Mã Ngẫu Nhiên Mới
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAdminCodeModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">
                Hủy
              </button>
              <button
                onClick={handleApplyNewMasterCode}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs shadow-lg"
              >
                ✓ Áp Dụng Mã Mới & Gửi Học Sinh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECURE PDF/DRIVE INLINE VIEWER (HIDE RAW GOOGLE DRIVE LINK - DIRECTIVE 1) */}
      {activePdfViewer && (
        <div className="fixed top-20 inset-x-0 bottom-0 z-40 bg-slate-950/90 backdrop-blur-md flex items-start justify-center p-4 pt-4 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-3xl max-w-4xl w-full p-6 space-y-4 shadow-2xl animate-fadeIn max-h-[84vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <div>
                <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">
                  🛡️ BẢO MẬT MÃ HÓA LINK GOOGLE DRIVE • XEM TRỰC TUYẾN
                </span>
                <h3 className="text-base font-black text-white">{activePdfViewer.title}</h3>
              </div>
              <button onClick={() => setActivePdfViewer(null)} className="p-2 rounded-xl bg-slate-800 text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative min-h-[400px]">
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(activePdfViewer.driveLink)}&embedded=true`}
                title={activePdfViewer.title}
                className="w-full h-full min-h-[450px] border-0"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
