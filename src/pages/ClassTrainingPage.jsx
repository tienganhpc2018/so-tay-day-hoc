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
  Save
} from 'lucide-react';

export const ClassTrainingPage = () => {
  // 4 MAIN TABS ACCORDING TO USER DIRECTIVE:
  // Tab 1: 'courses' (Các khóa học - Sổ xuống Tiếng Anh 6,7,8,9)
  // Tab 2: 'students' (Thông tin học sinh - danh sách, Lớp...)
  // Tab 3: 'academic_year' (Năm học - GV tự nhập)
  // Tab 4: 'tuition' (Học phí & Điểm danh - danh sách, điểm danh, tổng số buổi, Tiền nộp Đợt 1, 2, 3)
  const [activeTab, setActiveTab] = useState('courses');

  // Tab 1: Course Selection
  const [selectedCourseGrade, setSelectedCourseGrade] = useState(8);

  // Tab 2: Student Management State
  const [studentList, setStudentList] = useState([
    { id: 'st1', name: 'Phạm Thanh Tú', grade: 8, className: '8A5', parentPhone: '0987.654.321', status: 'Active' },
    { id: 'st2', name: 'Trần Thuỳ Dương', grade: 8, className: '8A5', parentPhone: '0912.345.678', status: 'Active' },
    { id: 'st3', name: 'Vũ Mai Phương', grade: 7, className: '7A2', parentPhone: '0903.111.222', status: 'Active' },
    { id: 'st4', name: 'Bùi Hoàng Hải', grade: 9, className: '9A1', parentPhone: '0977.888.999', status: 'Active' }
  ]);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('8A5');
  const [newStudentPhone, setNewStudentPhone] = useState('');

  // Tab 3: Academic Year State
  const [academicYears, setAcademicYears] = useState([
    { id: 'ay1', year: 'Năm học 2025 - 2026', startDate: '2025-09-05', endDate: '2026-05-30', isCurrent: true },
    { id: 'ay2', year: 'Năm học 2026 - 2027', startDate: '2026-09-05', endDate: '2027-05-30', isCurrent: false }
  ]);
  const [newYearTitle, setNewYearTitle] = useState('');
  const [newStartDate, setNewStartDate] = useState('2026-09-05');
  const [newEndDate, setNewEndDate] = useState('2027-05-30');

  // Tab 4: Tuition & Attendance State
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
    },
    {
      id: 't3',
      studentName: 'Vũ Mai Phương',
      className: '7A2',
      attendedSessions: 22,
      totalSessions: 24,
      phase1: { amount: 1500000, paid: true, date: '10/09/2025' },
      phase2: { amount: 1500000, paid: false, date: 'Chưa nộp' },
      phase3: { amount: 1500000, paid: false, date: 'Chưa nộp' }
    }
  ]);

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    const stObj = {
      id: `st_${Date.now()}`,
      name: newStudentName,
      grade: 8,
      className: newStudentClass || '8A5',
      parentPhone: newStudentPhone || '0988.xxx.xxx',
      status: 'Active'
    };
    setStudentList([...studentList, stObj]);
    setNewStudentName(''); setNewStudentPhone('');
    try { soundFX.playFanfare(); } catch (e) {}
  };

  const handleAddAcademicYear = (e) => {
    e.preventDefault();
    if (!newYearTitle.trim()) return;
    const ayObj = {
      id: `ay_${Date.now()}`,
      year: newYearTitle,
      startDate: newStartDate,
      endDate: newEndDate,
      isCurrent: false
    };
    setAcademicYears([...academicYears, ayObj]);
    setNewYearTitle('');
    try { soundFX.playFanfare(); } catch (e) {}
  };

  const togglePhasePayment = (tId, phaseKey) => {
    try { soundFX.playClick(); } catch (e) {}
    setTuitionList(tuitionList.map(t => {
      if (t.id === tId) {
        return {
          ...t,
          [phaseKey]: {
            ...t[phaseKey],
            paid: !t[phaseKey].paid,
            date: !t[phaseKey].paid ? new Date().toLocaleDateString('vi-VN') : 'Chưa nộp'
          }
        };
      }
      return t;
    }));
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* 1. HERO BANNER */}
      <PageHeroBanner
        title="Quản Lý Lớp Đào Tạo & Học Phí 🎓"
        subtitle="Hệ thống quản lý toàn diện Khóa học Tiếng Anh THCS, Thông tin Học sinh, Năm học và Khai báo Học phí 3 Đợt kèm Điểm danh chuyên cần."
        badge="HỆ THỐNG LỚP ĐÀO TẠO VIP 4.0"
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
          <span>2. THÔNG TIN HỌC SINH</span>
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
          <span>4. HỌC PHÍ & ĐIỂM DANH</span>
        </button>
      </div>

      {/* 3. TAB CONTENT BODIES */}
      
      {/* TAB 1: CÁC KHÓA HỌC (SỔ XUỐNG TIẾNG ANH 6, 7, 8, 9) */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between flex-wrap gap-4 shadow-xl">
            <span className="text-xs font-black text-slate-300">CHỌN KHÓA HỌC TIẾNG ANH THCS:</span>
            <select
              value={selectedCourseGrade}
              onChange={(e) => setSelectedCourseGrade(Number(e.target.value))}
              className="bg-slate-950 text-emerald-400 text-xs font-black px-4 py-2.5 rounded-2xl border border-slate-800 focus:outline-none"
            >
              <option value={6}>📚 Khóa Học Tiếng Anh Khối 6 Global Success</option>
              <option value={7}>📚 Khóa Học Tiếng Anh Khối 7 Global Success</option>
              <option value={8}>📚 Khóa Học Tiếng Anh Khối 8 Global Success</option>
              <option value={9}>📚 Khóa Học Tiếng Anh Khối 9 Global Success</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-black">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">Chương Trình Tiếng Anh Khối {selectedCourseGrade}</h3>
              <p className="text-xs text-slate-400 font-bold">12 Units trọng tâm chuẩn Bộ Giáo Dục & Đào Tạo, tích hợp 4 kỹ năng Nghe, Nói, Đọc, Viết và Ngân hàng đề thi AI.</p>
              <div className="pt-2 flex items-center justify-between text-xs font-black text-emerald-400">
                <span>Số bài học: 12 Units</span>
                <span>Học viên: 35 HS</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">Luyện Thi Giữa Kỳ & Cuối Kỳ Khối {selectedCourseGrade}</h3>
              <p className="text-xs text-slate-400 font-bold">Ma trận đề thi CV7991 gồm 6 dạng câu hỏi trắc nghiệm, đúng/sai, điền từ và tự luận có nhận xét Voice AI.</p>
              <div className="pt-2 flex items-center justify-between text-xs font-black text-amber-400">
                <span>Số đề thi: 50+ Đề</span>
                <span>Chấm tự động AI</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-black">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">Ôn Thi Học Sinh Giỏi & Vào 10</h3>
              <p className="text-xs text-slate-400 font-bold">Bộ đề chuyên sâu phát triển năng lực ngôn ngữ dành cho học sinh khá giỏi bứt phá điểm số 9-10.</p>
              <div className="pt-2 flex items-center justify-between text-xs font-black text-indigo-400">
                <span>Mức độ: Nâng cao</span>
                <span>VIP Master Pass</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: THÔNG TIN HỌC SINH */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <form onSubmit={handleAddStudent} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-xs font-black text-white uppercase flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <UserPlus className="w-4 h-4 text-emerald-400" /> THÊM HỌC SINH MỚI VÀO LỚP ĐÀO TẠO
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
              <input
                type="text"
                placeholder="Họ và tên học sinh..."
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                required
              />
              <input
                type="text"
                placeholder="Lớp học (Ví dụ: 8A5)..."
                value={newStudentClass}
                onChange={(e) => setNewStudentClass(e.target.value)}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
              />
              <input
                type="text"
                placeholder="SĐT Phụ huynh..."
                value={newStudentPhone}
                onChange={(e) => setNewStudentPhone(e.target.value)}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Thêm Học Sinh Này
              </button>
            </div>
          </form>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">DANH SÁCH {studentList.length} HỌC SINH DANG THEO HỌC:</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Họ và tên</th>
                    <th className="p-3">Lớp</th>
                    <th className="p-3">SĐT Phụ huynh</th>
                    <th className="p-3">Trạng thái</th>
                    <th className="p-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {studentList.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-950/50">
                      <td className="p-3 font-black text-white">{st.name}</td>
                      <td className="p-3 text-brand-300">{st.className}</td>
                      <td className="p-3 text-slate-400">{st.parentPhone}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black">
                          Đang học
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button onClick={() => setStudentList(studentList.filter(s => s.id !== st.id))} className="text-rose-400 hover:text-rose-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NĂM HỌC (GV TỰ NHẬP KHOẢNG THỜI GIAN) */}
      {activeTab === 'academic_year' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <form onSubmit={handleAddAcademicYear} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-xs font-black text-white uppercase flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <Calendar className="w-4 h-4 text-amber-400" /> THÊM NĂM HỌC MỚI (GIÁO VIÊN TỰ KHAI BÁO)
            </h3>

            <div className="space-y-3 text-xs font-bold">
              <input
                type="text"
                placeholder="Tên năm học (Ví dụ: Năm học 2026 - 2027)..."
                value={newYearTitle}
                onChange={(e) => setNewYearTitle(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Ngày bắt đầu Học kỳ 1:</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Ngày kết thúc năm học:</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow flex items-center justify-center gap-1.5">
              <Save className="w-4 h-4" /> Lưu Khhai Báo Năm Học Này
            </button>
          </form>

          <div className="space-y-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">DANH SÁCH NĂM HỌC ĐÃ THIẾT LẬP:</h3>
            {academicYears.map((ay) => (
              <div key={ay.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-bold">
                <div>
                  <div className="text-white font-black">{ay.year}</div>
                  <div className="text-slate-400 text-[11px]">Thới gian: {ay.startDate} đến {ay.endDate}</div>
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

      {/* TAB 4: HỌC PHÍ & ĐIỂM DANH (DANH SÁCH HỌC VIÊN, THEO DÕI ĐIỂM DANH, SỐ BUỔI HỌC, TIỀN NỘP ĐỢT 1, 2, 3) */}
      {activeTab === 'tuition' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
              <h3 className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-purple-400" /> BẢNG THEO DÕI HỌC PHÍ & ĐIỂM DANH THỜI GIAN THỰC
              </h3>
              <span className="text-xs text-slate-400 font-bold">Bấm vào ô đợt tiền để đánh dấu 🟢 Đã nộp / 🔴 Chưa nộp</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Tên Học Viên</th>
                    <th className="p-3">Lớp</th>
                    <th className="p-3">Điểm danh / Tổng số buổi</th>
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
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-950 text-emerald-400 border border-slate-800 font-black">
                          {t.attendedSessions}/{t.totalSessions} buổi tham gia
                        </span>
                      </td>

                      {/* ĐỢT 1 */}
                      <td className="p-3">
                        <button
                          onClick={() => togglePhasePayment(t.id, 'phase1')}
                          className={`p-2 rounded-xl border w-full text-left transition-all ${
                            t.phase1.paid ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}
                        >
                          <div className="font-black">1.500.000đ {t.phase1.paid ? '✓' : '✗'}</div>
                          <div className="text-[10px] text-slate-400">{t.phase1.date}</div>
                        </button>
                      </td>

                      {/* ĐỢT 2 */}
                      <td className="p-3">
                        <button
                          onClick={() => togglePhasePayment(t.id, 'phase2')}
                          className={`p-2 rounded-xl border w-full text-left transition-all ${
                            t.phase2.paid ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}
                        >
                          <div className="font-black">1.500.000đ {t.phase2.paid ? '✓' : '✗'}</div>
                          <div className="text-[10px] text-slate-400">{t.phase2.date}</div>
                        </button>
                      </td>

                      {/* ĐỢT 3 */}
                      <td className="p-3">
                        <button
                          onClick={() => togglePhasePayment(t.id, 'phase3')}
                          className={`p-2 rounded-xl border w-full text-left transition-all ${
                            t.phase3.paid ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}
                        >
                          <div className="font-black">1.500.000đ {t.phase3.paid ? '✓' : '✗'}</div>
                          <div className="text-[10px] text-slate-400">{t.phase3.date}</div>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
