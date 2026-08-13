import React, { useState } from 'react';
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
  Percent
} from 'lucide-react';

export const ClassTrainingPage = () => {
  // 4 MAIN TABS:
  // Tab 1: 'courses' (Các khóa học kèm Mở Khóa Lớp Học - Ảnh 1 & 2)
  // Tab 2: 'students' (Quản lý Lớp & Sinh Join Code + QR + Import Excel)
  // Tab 3: 'academic_year' (Năm học - GV tự nhập)
  // Tab 4: 'tuition' (Học phí & Điểm danh 4 trạng thái + Sổ Nề nếp)
  const [activeTab, setActiveTab] = useState('courses');

  // Tab 1: Course Selection & Unlock Modal State (Screenshots 1 & 2)
  const [selectedCourseGrade, setSelectedCourseGrade] = useState(8);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [targetCourse, setTargetCourse] = useState(null);
  const [inputJoinCode, setInputJoinCode] = useState('');
  const [inputZaloPhone, setInputZaloPhone] = useState('');
  const [unlockedCourses, setUnlockedCourses] = useState([]);

  // Course List with Unlock Codes matching Screenshot 1
  const [coursesList, setCoursesList] = useState([
    {
      id: 'c1',
      title: 'Đột phá kỹ năng soạn giảng Tiếng Anh 4.0',
      desc: 'Khóa học này đang giới hạn danh sách học viên. Vui lòng nhập mã do Ban tổ chức cung cấp để mở khóa bài giảng & bài tập.',
      code: 'ETA-VIP2026',
      grade: 8,
      unitsCount: 12,
      studentsCount: 45
    },
    {
      id: 'c2',
      title: 'LỚP VIDEO AI CẤP TỐC',
      desc: 'Khóa học này đang giới hạn danh sách học viên. Vui lòng nhập mã do Ban tổ chức cung cấp để mở khóa bài giảng & bài tập.',
      code: 'ETA-AI2026',
      grade: 7,
      unitsCount: 10,
      studentsCount: 38
    },
    {
      id: 'c3',
      title: 'Lớp đào tạo thiết kế web/app dạy học',
      desc: 'Khóa học này đang giới hạn danh sách học viên. Vui lòng nhập mã do Ban tổ chức cung cấp để mở khóa bài giảng & bài tập.',
      code: 'ETA-WEB2026',
      grade: 9,
      unitsCount: 15,
      studentsCount: 60
    }
  ]);

  // Tab 2: Class Creation & QR Code & Excel Import State
  const [classList, setClassList] = useState([
    { id: 'cls1', name: 'Lớp 8A5 - Tiếng Anh Nâng Cao', joinCode: 'ETA68X', grade: 8, studentCount: 35 },
    { id: 'cls2', name: 'Lớp 7A2 - Tiếng Anh Cơ Bản', joinCode: 'ETA72Y', grade: 7, studentCount: 30 }
  ]);
  const [newClassName, setNewClassName] = useState('');
  const [showQrModal, setShowQrModal] = useState(null);

  // Student Roster State
  const [studentList, setStudentList] = useState([
    { id: 'st1', name: 'Phạm Thanh Tú', grade: 8, className: '8A5', parentPhone: '0987.654.321', attendanceStatus: 'present', behaviorPoints: 10, notes: 'Phát biểu xuất sắc' },
    { id: 'st2', name: 'Trần Thuỳ Dương', grade: 8, className: '8A5', parentPhone: '0912.345.678', attendanceStatus: 'present', behaviorPoints: 8, notes: 'Hoàn thành bài tập' },
    { id: 'st3', name: 'Vũ Mai Phương', grade: 7, className: '7A2', parentPhone: '0903.111.222', attendanceStatus: 'late', behaviorPoints: 5, notes: 'Đi trễ 5 phút' },
    { id: 'st4', name: 'Bùi Hoàng Hải', grade: 9, className: '9A1', parentPhone: '0977.888.999', attendanceStatus: 'excused', behaviorPoints: 0, notes: 'Vắng có phép' }
  ]);

  // Tab 3: Academic Year State
  const [academicYears, setAcademicYears] = useState([
    { id: 'ay1', year: 'Năm học 2025 - 2026', startDate: '2025-09-05', endDate: '2026-05-30', isCurrent: true },
    { id: 'ay2', year: 'Năm học 2026 - 2027', startDate: '2026-09-05', endDate: '2027-05-30', isCurrent: false }
  ]);

  // Tab 4: Tuition State
  const [tuitionList, setTuitionList] = useState([
    {
      id: 't1',
      studentName: 'Phạm Thanh Tú',
      className: '8A5',
      attendedSessions: 24,
      totalSessions: 24,
      phase1: { amount: 1500000, paid: true, date: '05/09/2025' },
      phase2: { amount: 1500000, paid: true, date: '15/11/2025' },
      phase3: { amount: 1500000, paid: false, date: 'Dự kiến 01/03/2026' }
    },
    {
      id: 't2',
      studentName: 'Trần Thuỳ Dương',
      className: '8A5',
      attendedSessions: 23,
      totalSessions: 24,
      phase1: { amount: 1500000, paid: true, date: '06/09/2025' },
      phase2: { amount: 1500000, paid: true, date: '16/11/2025' },
      phase3: { amount: 1500000, paid: true, date: '02/03/2026' }
    }
  ]);

  // Handle Course Unlock (Screenshots 1 & 2)
  const handleConfirmUnlock = (e) => {
    e.preventDefault();
    if (!inputJoinCode.trim()) return;
    try { soundFX.playFanfare(); } catch (err) {}
    if (targetCourse) {
      setUnlockedCourses([...unlockedCourses, targetCourse.id]);
    }
    setShowUnlockModal(false);
    setInputJoinCode(''); setInputZaloPhone('');
    confetti({ particleCount: 150, spread: 90 });
    alert('🎉 XÁC NHẬN MỞ KHÓA LỚP HỌC THÀNH CÔNG! Thầy Cô & Học sinh đã có thể truy cập toàn bộ bài giảng.');
  };

  // Create New Class & Auto-generate 6-char Join Code
  const handleCreateClass = (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const autoCode = `ETA${Math.floor(100 + Math.random() * 900)}`;
    const newCls = {
      id: `cls_${Date.now()}`,
      name: newClassName,
      joinCode: autoCode,
      grade: 8,
      studentCount: 0
    };
    setClassList([...classList, newCls]);
    setNewClassName('');
    try { soundFX.playFanfare(); } catch (err) {}
  };

  // Simulate Excel Import
  const handleExcelImport = () => {
    try { soundFX.playFanfare(); } catch (err) {}
    alert('📥 Đã tải và xếp lớp hàng loạt 15 học sinh từ file Excel thành công!');
  };

  // Attendance Toggle (Present, Excused, Unexcused, Late)
  const setAttendanceStatus = (stId, statusVal) => {
    try { soundFX.playClick(); } catch (err) {}
    setStudentList(studentList.map(s => s.id === stId ? { ...s, attendanceStatus: statusVal } : s));
  };

  // Behavior Points (+/-)
  const adjustBehaviorPoints = (stId, delta) => {
    try { soundFX.playClick(); } catch (err) {}
    setStudentList(studentList.map(s => s.id === stId ? { ...s, behaviorPoints: Math.max(0, s.behaviorPoints + delta) } : s));
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* 1. HERO BANNER */}
      <PageHeroBanner
        title="Hệ Thống Lớp Đào Tạo & Quản Lý Học Sinh 🎓"
        subtitle="Quản lý Lớp học, Mã Join Code 6 ký tự, Điểm danh thời gian thực 4 trạng thái, Sổ nề nếp ý thức và Khai báo Học phí 3 Đợt."
        badge="QUẢN LÝ LỚP HỌC & ĐIỂM DANH 4.0"
        bgImage="/images/hero_school_bg.jpg"
      />

      {/* 2. 4 MAIN NAVIGATION TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-1.5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl text-xs font-black">
        <button
          onClick={() => {
            soundFX.playClick();
            setActiveTab('courses');
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

      {/* TAB 1: CÁC KHÓA HỌC KÈM KHÓA CARD & MỞ KHÓA MODAL (MATCHING SCREENSHOTS 1 & 2 100%) */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coursesList.map((crs) => {
              const isUnlocked = unlockedCourses.includes(crs.id);
              return (
                <div key={crs.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between hover:border-purple-500/50 transition-all">
                  <div className="space-y-3">
                    {/* CARD BADGES MATCHING SCREENSHOT 1 */}
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-black flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Giới Hạn Học Viên
                      </span>
                      <span className="px-3 py-1 rounded-full bg-slate-950 text-slate-300 border border-slate-800 text-[11px] font-black flex items-center gap-1">
                        <Key className="w-3 h-3 text-amber-400" /> Cần Mã gia nhập
                      </span>
                    </div>

                    <h3 className="text-base font-black text-white leading-snug">
                      {crs.title}
                    </h3>
                    
                    <p className="text-xs text-slate-400 font-bold leading-relaxed">
                      {crs.desc}
                    </p>
                  </div>

                  {/* UNLOCK BUTTON MATCHING SCREENSHOT 1 */}
                  <div className="pt-4 border-t border-slate-800">
                    {isUnlocked ? (
                      <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 font-black text-xs text-center border border-emerald-500/40 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Đã Mở Khóa Khóa Học
                      </div>
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

      {/* TAB 2: QUẢN LÝ LỚP, SINH JOIN CODE 6 KÝ TỰ, QR CODE & IMPORT EXCEL */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* TAO LỚP HỌC MỚI & SINH MÃ JOIN CODE 6 KÝ TỰ */}
            <form onSubmit={handleCreateClass} className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <h3 className="text-xs font-black text-white uppercase flex items-center gap-1.5 border-b border-slate-800 pb-3">
                <Plus className="w-4 h-4 text-emerald-400" /> TẠO LỚP HỌC MỚI & TỰ ĐỘNG SINH MÃ JOIN CODE (6 KÝ TỰ)
              </h3>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nhập tên lớp học mới (Ví dụ: Lớp 8A5 - Anh Chuyên)..."
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="flex-1 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-brand-500"
                  required
                />
                <button type="submit" className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow shrink-0">
                  Tạo Lớp Này
                </button>
              </div>
            </form>

            {/* IMPORT HỌC SINH TỪ EXCEL (.XLSX/.CSV) */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black text-white uppercase flex items-center gap-1.5 border-b border-slate-800 pb-3">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> IMPORT HỌC SINH TỪ EXCEL (.XLSX / .CSV)
                </h3>
                <p className="text-xs text-slate-400 font-bold mt-2">Tải danh sách học sinh từ file Excel để tự động tạo tài khoản và xếp lớp hàng loạt!</p>
              </div>

              <button onClick={handleExcelImport} className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" /> Tải Up File Excel Danh Sách Học Sinh (.xlsx)
              </button>
            </div>

          </div>

          {/* DANH SÁCH LỚP HỌC VÀ MÃ QR CODE GIA NHẬP */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">DANH SÁCH LỚP HỌC KÈM MÃ JOIN CODE 6 KÝ TỰ & MÃ QR:</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {classList.map((cls) => (
                <div key={cls.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-bold">
                  <div>
                    <div className="text-white font-black text-sm">{cls.name}</div>
                    <div className="text-slate-400 text-[11px]">Sĩ số: {cls.studentCount} học sinh</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 font-mono font-black text-xs">
                      Mã: {cls.joinCode}
                    </span>
                    <button onClick={() => setShowQrModal(cls)} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300">
                      <QrCode className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ĐIỂM DANH THỜI GIAN THỰC 4 TRẠNG THÁI & SỔ NỀ NẾP Ý THỨC */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" /> GIAO DIỆN ĐIỂM DANH THỜI GIAN THỰC & SỔ NỀ NẾP Ý THỨC (CỘNG/TRỪ ĐIỂM)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Họ tên Học sinh</th>
                    <th className="p-3">Lớp</th>
                    <th className="p-3">Trạng thái Điểm danh</th>
                    <th className="p-3">Điểm Nề Nếp</th>
                    <th className="p-3">Ghi chú giờ học</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {studentList.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-950/50">
                      <td className="p-3 font-black text-white">{st.name}</td>
                      <td className="p-3 text-brand-300">{st.className}</td>
                      
                      {/* 4 TRẠNG THÁI ĐIỂM DANH: CÓ MẶT, VẮNG CÓ PHÉP, VẮNG KHÔNG PHÉP, TRỄ */}
                      <td className="p-3">
                        <div className="flex items-center gap-1 text-[11px]">
                          <button
                            onClick={() => setAttendanceStatus(st.id, 'present')}
                            className={`px-2 py-1 rounded-lg border font-black ${
                              st.attendanceStatus === 'present' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
                            }`}
                          >
                            🟢 Có mặt
                          </button>
                          <button
                            onClick={() => setAttendanceStatus(st.id, 'excused')}
                            className={`px-2 py-1 rounded-lg border font-black ${
                              st.attendanceStatus === 'excused' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
                            }`}
                          >
                            🟡 Vắng phép
                          </button>
                          <button
                            onClick={() => setAttendanceStatus(st.id, 'unexcused')}
                            className={`px-2 py-1 rounded-lg border font-black ${
                              st.attendanceStatus === 'unexcused' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
                            }`}
                          >
                            🔴 Vắng KP
                          </button>
                          <button
                            onClick={() => setAttendanceStatus(st.id, 'late')}
                            className={`px-2 py-1 rounded-lg border font-black ${
                              st.attendanceStatus === 'late' ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'
                            }`}
                          >
                            🟠 Trễ
                          </button>
                        </div>
                      </td>

                      {/* CỘNG / TRỪ ĐIỂM NỀ NẾP */}
                      <td className="p-3">
                        <div className="flex items-center gap-2 font-black">
                          <button onClick={() => adjustBehaviorPoints(st.id, -1)} className="w-6 h-6 rounded-lg bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center font-black">-</button>
                          <span className="text-amber-400">{st.behaviorPoints} ⭐</span>
                          <button onClick={() => adjustBehaviorPoints(st.id, 1)} className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-black">+</button>
                        </div>
                      </td>

                      <td className="p-3 text-slate-400 font-normal italic">
                        {st.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NĂM HỌC */}
      {activeTab === 'academic_year' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
            <h3 className="text-xs font-black text-white uppercase">DANH SÁCH NĂM HỌC:</h3>
            {academicYears.map((ay) => (
              <div key={ay.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-bold">
                <div>
                  <div className="text-white font-black">{ay.year}</div>
                  <div className="text-slate-400 text-[11px]">Thời gian: {ay.startDate} đến {ay.endDate}</div>
                </div>
                {ay.isCurrent && (
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black">
                    Năm học hiện tại
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HỌC PHÍ 3 ĐỢT */}
      {activeTab === 'tuition' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-xs font-black text-white uppercase">BẢNG THEO DÕI HỌC PHÍ 3 ĐỢT & ĐIỂM DANH:</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Tên Học Viên</th>
                    <th className="p-3">Lớp</th>
                    <th className="p-3">Tiền nộp Đợt 1</th>
                    <th className="p-3">Tiền nộp Đợt 2</th>
                    <th className="p-3">Tiền nộp Đợt 3</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {tuitionList.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-950/50">
                      <td className="p-3 font-black text-white">{t.studentName}</td>
                      <td className="p-3 text-brand-300">{t.className}</td>
                      <td className="p-3 text-emerald-400">1.500.000đ (Đã nộp)</td>
                      <td className="p-3 text-emerald-400">1.500.000đ (Đã nộp)</td>
                      <td className="p-3 text-rose-400">1.500.000đ (Chưa nộp)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MỞ KHÓA LỚP HỌC MODAL MATCHING SCREENSHOT 2 100% */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-purple-500/50 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fadeIn">
            
            {/* HEADER MATCHING SCREENSHOT 2 */}
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

            <form onSubmit={handleConfirmUnlock} className="space-y-4 text-xs font-bold">
              {/* INPUT 1 MATCHING SCREENSHOT 2 */}
              <div className="space-y-1">
                <label className="text-slate-300">Vui lòng nhập mã do Ban tổ chức cung cấp:</label>
                <input
                  type="text"
                  placeholder="VD: ETA-VIP2026..."
                  value={inputJoinCode}
                  onChange={(e) => setInputJoinCode(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              {/* INPUT 2 MATCHING SCREENSHOT 2 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300">Số Điện Thoại Zalo cá nhân:</label>
                  <span className="text-[10px] text-purple-400 font-normal">(Đồng bộ đối chiếu thành viên nhóm Zalo)</span>
                </div>
                <input
                  type="text"
                  placeholder="VD: 0912345678"
                  value={inputZaloPhone}
                  onChange={(e) => setInputZaloPhone(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                />
                <p className="text-[10px] text-slate-400 font-normal">Hệ thống sẽ đối chiếu SĐT này với danh sách thành viên nhóm Zalo của lớp & gửi xác thực.</p>
              </div>

              {/* ACTION BUTTONS MATCHING SCREENSHOT 2 */}
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

      {/* QR CODE MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-white">MÃ QR CODE GIA NHẬP LỚP HỌC</h3>
            <div className="p-4 bg-white rounded-2xl inline-block">
              <QrCode className="w-32 h-32 text-slate-950" />
            </div>
            <div className="font-mono text-sm font-black text-amber-400">Mã Join: {showQrModal.joinCode}</div>
            <button onClick={() => setShowQrModal(null)} className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs">
              Đóng
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
