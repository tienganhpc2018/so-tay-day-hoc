import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { TableSkeleton } from '../components/common/Skeleton';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { soundFX } from '../utils/soundEffects';
import { cmsStorage } from '../utils/cmsStorage';
import { 
  ShieldAlert, 
  UserCheck, 
  Lock, 
  Unlock, 
  Search, 
  Users, 
  UserPlus, 
  BookOpen, 
  HelpCircle, 
  Zap, 
  FileCheck, 
  BarChart3, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Award, 
  FileText, 
  Volume2, 
  Video, 
  Paperclip, 
  ChevronRight, 
  Layers 
} from 'lucide-react';

export const AdminDashboard = () => {
  const { profile, isTeacher, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // overview | users | lessons | assignments | exams | grading | analytics

  // Data states
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // LMS Data
  const [courses, setCourses] = useState([]);
  const [units, setUnits] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Selection & Modal states
  const [selectedGrade, setSelectedGrade] = useState(8);
  const [selectedUnitId, setSelectedUnitId] = useState('u1-g8');
  
  // Modals
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [essayScoreInput, setEssayScoreInput] = useState('');
  const [teacherFeedbackInput, setTeacherFeedbackInput] = useState('');

  // Lesson Form
  const [lessonForm, setLessonForm] = useState({
    title: '',
    unitId: 'u1-g8',
    grade: 8,
    objectives: '',
    content: '',
    vocabulary: '',
    grammar: '',
    teacherNotes: '',
    mediaUrl: '',
    fileUrl: '',
    order: 1,
    status: 'PUBLISHED'
  });

  // Assignment Form
  const [asgForm, setAsgForm] = useState({
    title: '',
    description: '',
    grade: 8,
    unitId: 'u1-g8',
    assignmentType: 'HOMEWORK',
    totalPoints: 10,
    timeLimitMinutes: 20,
    dueDate: '2026-10-15',
    targetClass: '8A1',
    status: 'PUBLISHED',
    questions: [
      { id: 'q1', num: 1, type: 'MCQ', question: '', options: ['', '', '', ''], correct: '', points: 2 }
    ]
  });

  useEffect(() => {
    fetchUsers();
    loadLmsData();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLmsData = () => {
    setCourses(cmsStorage.getCourses());
    setUnits(cmsStorage.getUnits());
    setLessons(cmsStorage.getLessons());
    setAssignments(cmsStorage.getAssignments());
    setSubmissions(cmsStorage.getSubmissions());
    setAuditLogs(cmsStorage.getAuditLogs());
  };

  const toggleUserStatus = async (userToToggle) => {
    const newStatus = userToToggle.status === 'locked' ? 'active' : 'locked';
    soundFX.playClick();

    try {
      setUsers(prev => prev.map(u => u.id === userToToggle.id ? { ...u, status: newStatus } : u));

      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userToToggle.id);

      if (error) throw error;

      cmsStorage.logAction('TEACHER', profile?.full_name || 'Giáo Viên VIP', 'TẠM KHÓA HS', `Đổi trạng thái tài khoản ${userToToggle.full_name} sang ${newStatus}`);
      setAuditLogs(cmsStorage.getAuditLogs());

      if (newStatus === 'locked') soundFX.playWrong();
      else soundFX.playCorrect();
    } catch (err) {
      console.error('Error toggling status:', err);
      setUsers(prev => prev.map(u => u.id === userToToggle.id ? { ...u, status: userToToggle.status } : u));
    }
  };

  // Lesson actions
  const handleOpenLessonModal = (lesson = null) => {
    soundFX.playClick();
    if (lesson) {
      setEditingLesson(lesson);
      setLessonForm({ ...lesson });
    } else {
      setEditingLesson(null);
      setLessonForm({
        title: '',
        unitId: selectedUnitId || 'u1-g8',
        grade: selectedGrade || 8,
        objectives: '',
        content: '',
        vocabulary: '',
        grammar: '',
        teacherNotes: '',
        mediaUrl: '',
        fileUrl: '',
        order: (lessons.length || 0) + 1,
        status: 'PUBLISHED'
      });
    }
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = () => {
    if (!lessonForm.title.trim()) {
      alert('Vui lòng nhập tên bài học!');
      return;
    }
    soundFX.playClick();
    const updated = cmsStorage.saveLesson(lessonForm);
    setLessons(updated);

    cmsStorage.logAction('TEACHER', profile?.full_name || 'Giáo Viên VIP', editingLesson ? 'SỬA BÀI HỌC' : 'TẠO BÀI HỌC', `Bài học: ${lessonForm.title}`);
    setAuditLogs(cmsStorage.getAuditLogs());

    setIsLessonModalOpen(false);
    alert('✨ Đã lưu thông tin bài học thành công!');
  };

  const handleDeleteLesson = (lessonId) => {
    if (window.confirm('Thầy/Cô có chắc chắn muốn xóa bài học này?')) {
      soundFX.playClick();
      const updated = cmsStorage.deleteLesson(lessonId);
      setLessons(updated);
    }
  };

  // Assignment actions
  const handleOpenAssignmentModal = (asg = null, type = 'HOMEWORK') => {
    soundFX.playClick();
    if (asg) {
      setEditingAssignment(asg);
      setAsgForm({ ...asg });
    } else {
      setEditingAssignment(null);
      setAsgForm({
        title: type === 'EXAM' ? 'Đề Kiểm Tra Định Kỳ 45 Phút Tiếng Anh THCS' : 'Bài Tập Ôn Tập Unit 1',
        description: 'Bài kiểm tra kiến thức tổng hợp',
        grade: selectedGrade || 8,
        unitId: selectedUnitId || 'u1-g8',
        assignmentType: type,
        totalPoints: 10,
        timeLimitMinutes: type === 'EXAM' ? 45 : 20,
        dueDate: '2026-10-20',
        targetClass: '8A1',
        status: 'PUBLISHED',
        questions: [
          { id: `q-${Date.now()}-1`, num: 1, type: 'MCQ', question: 'Minh enjoys _____ model cars.', options: ['A. building', 'B. to build', 'C. build', 'D. built'], correct: 'A. building', points: 2.5 },
          { id: `q-${Date.now()}-2`, num: 2, type: 'TF', question: 'Gấp giấy origami là hoạt động thư giãn tốt.', options: ['A. True', 'B. False'], correct: 'A. True', points: 2.5 },
          { id: `q-${Date.now()}-3`, num: 3, type: 'GAPFILL', question: 'Điền 1 từ: You need a craft _____ to make handmade gifts.', options: ['A. kit', 'B. box', 'C. set', 'D. bag'], correct: 'A. kit', points: 2.5 },
          { id: `q-${Date.now()}-4`, num: 4, type: 'ESSAY', question: 'Write 3 sentences about your favourite hobby.', options: [], correct: 'Giáo viên tự chấm', points: 2.5 }
        ]
      });
    }
    setIsAssignmentModalOpen(true);
  };

  const handleSaveAssignment = () => {
    if (!asgForm.title.trim()) {
      alert('Vui lòng nhập tên bài!');
      return;
    }
    soundFX.playClick();
    const updated = cmsStorage.saveAssignment(asgForm);
    setAssignments(updated);

    cmsStorage.logAction('TEACHER', profile?.full_name || 'Giáo Viên VIP', editingAssignment ? 'SỬA BÀI/ĐỀ' : 'TẠO BÀI/ĐỀ', `Giao bài: ${asgForm.title} cho lớp ${asgForm.targetClass}`);
    setAuditLogs(cmsStorage.getAuditLogs());

    setIsAssignmentModalOpen(false);
    alert('✨ Đã xuất bản và giao bài thành công cho lớp!');
  };

  // Question editing helpers inside Assignment Modal
  const handleAddQuestion = () => {
    const qCount = asgForm.questions.length + 1;
    const newQ = {
      id: `q-${Date.now()}-${qCount}`,
      num: qCount,
      type: 'MCQ',
      question: `Câu hỏi ${qCount}: `,
      options: ['A. ', 'B. ', 'C. ', 'D. '],
      correct: 'A. ',
      points: 2
    };
    setAsgForm({
      ...asgForm,
      questions: [...asgForm.questions, newQ]
    });
  };

  const handleRemoveQuestion = (idx) => {
    const updatedQ = asgForm.questions.filter((_, i) => i !== idx);
    setAsgForm({ ...asgForm, questions: updatedQ });
  };

  // Grading Actions
  const handleOpenGradingModal = (sub) => {
    soundFX.playClick();
    setSelectedSubmission(sub);
    setEssayScoreInput(sub.essayScore !== null && sub.essayScore !== undefined ? String(sub.essayScore) : '2.0');
    setTeacherFeedbackInput(sub.teacherFeedback || 'Bài làm rất xuất sắc! Viết câu lưu thoát, đúng ngữ pháp.');
    setIsGradingModalOpen(true);
  };

  const handleSaveGrading = () => {
    if (!selectedSubmission) return;
    soundFX.playClick();
    const essayS = parseFloat(essayScoreInput) || 0;
    const updatedSubs = cmsStorage.gradeSubmission(selectedSubmission.id, essayS, teacherFeedbackInput);
    setSubmissions(updatedSubs);

    cmsStorage.logAction('TEACHER', profile?.full_name || 'Giáo Viên VIP', 'CHẤM BÀI', `Chấm bài cho ${selectedSubmission.studentName} - Điểm: ${Number(selectedSubmission.autoScore || 0) + essayS}`);
    setAuditLogs(cmsStorage.getAuditLogs());

    setIsGradingModalOpen(false);
    alert('✨ Đã hoàn thành chấm bài và công bố kết quả cho Học Sinh!');
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.student_code && u.student_code.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* 1. HERO BANNER */}
      <PageHeroBanner
        title="Trung Tâm Bảng Điều Hành & Chấm Bài Giáo Viên 🎓"
        subtitle="Quản lý toàn diện khóa học, soạn Unit/Bài học, khởi tạo bài tập & đề kiểm tra, chấm bài trực quan và theo dõi tiến độ thời gian thực."
        badge="TEACHER CENTER VIP • QUẢN LÝ CHUYÊN MÔN"
        bgImage="/images/hero_school_bg.jpg"
        showVipBadge={true}
      />

      {/* 2. MAIN 7-TAB SYSTEM NAVIGATION MENU */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white border border-slate-200 shadow-md">
        {[
          { id: 'overview', label: '1. TỔNG QUAN', icon: BarChart3 },
          { id: 'users', label: '2. QUẢN LÝ LỚP & HS', icon: Users },
          { id: 'lessons', label: '3. BÀI HỌC & HỌC LIỆU', icon: BookOpen },
          { id: 'assignments', label: '4. BÀI TẬP', icon: HelpCircle },
          { id: 'exams', label: '5. ĐỀ KIỂM TRA', icon: Zap },
          { id: 'grading', label: '6. CHẤM BÀI', icon: FileCheck },
          { id: 'analytics', label: '7. THỐNG KÊ', icon: Layers }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.playClick();
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================================================== */}
      {/* TAB 1: TỔNG QUAN (OVERVIEW METRICS) */}
      {/* ================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* STAT METRICS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-emerald-600">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Tổng Bài Học</span>
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-slate-900">{lessons.length}</div>
              <p className="text-xs text-slate-500 font-semibold">Thuộc 4 Khối 6 • 7 • 8 • 9 Global Success</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-amber-600">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Bài Tập & Đề Thi</span>
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-slate-900">{assignments.length}</div>
              <p className="text-xs text-slate-500 font-semibold">Đã giao cho các lớp 8A1, 8A2, 9A1</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-indigo-600">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Học Sinh Đăng Ký</span>
                <Users className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-slate-900">{users.filter(u => u.role !== 'admin' && u.role !== 'teacher').length}</div>
              <p className="text-xs text-slate-500 font-semibold">Tài khoản học sinh chính thức</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-purple-600">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Chờ Chấm Bài</span>
                <FileCheck className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-emerald-700">{submissions.filter(s => s.status === 'SUBMITTED').length}</div>
              <p className="text-xs text-slate-500 font-semibold">Bài làm cần giáo viên chấm tự luận</p>
            </div>
          </div>

          {/* QUICK ACTIONS BANNER */}
          <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-black text-emerald-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" /> Phím Tắt Thao Tác Nhanh Cho Giáo Viên:
              </h3>
              <p className="text-xs text-emerald-800">Tạo mới bài học, giao bài tập hoặc mở trình chấm bài tự luận chỉ với 1 cú nhấp.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => { setActiveTab('lessons'); handleOpenLessonModal(); }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow hover:bg-emerald-700 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> + Soạn Bài Học Mới
              </button>
              <button
                onClick={() => { setActiveTab('assignments'); handleOpenAssignmentModal(null, 'HOMEWORK'); }}
                className="px-4 py-2.5 rounded-xl bg-amber-600 text-white font-extrabold text-xs shadow hover:bg-amber-700 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> + Tạo Bài Tập Mới
              </button>
              <button
                onClick={() => setActiveTab('grading')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs shadow hover:bg-slate-800 flex items-center gap-1.5"
              >
                <FileCheck className="w-4 h-4 text-amber-400" /> Chấm Bài Ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* TAB 2: QUẢN LÝ LỚP & HỌC SINH */}
      {/* ================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm họ tên, email hoặc mã HS..."
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl pl-10 text-xs py-2"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-extrabold">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg ${filterStatus === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
              >
                Tất Cả ({users.length})
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-3 py-1.5 rounded-lg ${filterStatus === 'active' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
              >
                Đang Hoạt Động
              </button>
              <button
                onClick={() => setFilterStatus('locked')}
                className={`px-3 py-1.5 rounded-lg ${filterStatus === 'locked' ? 'bg-rose-600 text-white' : 'text-slate-600'}`}
              >
                Đã Tạm Khóa
              </button>
            </div>
          </div>

          {loading ? (
            <TableSkeleton rows={5} />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 uppercase tracking-wider font-extrabold">
                    <th className="p-4">Họ và Tên Học Sinh</th>
                    <th className="p-4">Mã HS / Email</th>
                    <th className="p-4">Vai Trò</th>
                    <th className="p-4">Khối Lớp</th>
                    <th className="p-4">Trạng Thái</th>
                    <th className="p-4 text-right">Thao Tác Quản Lý</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                          {u.full_name ? u.full_name.charAt(0) : 'H'}
                        </div>
                        <span>{u.full_name}</span>
                      </td>
                      <td className="p-4 text-slate-700 font-mono">
                        {u.student_code || u.email || 'HS801'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded font-extrabold uppercase text-[10px] ${
                          u.role === 'admin' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                          u.role === 'teacher' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}>
                          {u.role === 'admin' ? 'Quản Trị' : u.role === 'teacher' ? 'Giáo Viên' : 'Học Sinh'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-700 font-bold">Khối {u.grade_level || 8}</td>
                      <td className="p-4">
                        {u.status === 'locked' ? (
                          <span className="px-2.5 py-1 rounded bg-rose-100 text-rose-800 font-bold border border-rose-300">
                            🔒 Đã Tạm Khóa
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                            ✓ Hoạt Động
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => toggleUserStatus(u)}
                          className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 ml-auto shadow-sm ${
                            u.status === 'locked'
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-rose-600 text-white hover:bg-rose-700'
                          }`}
                        >
                          {u.status === 'locked' ? (
                            <>
                              <Unlock className="w-3.5 h-3.5" /> Mở Khóa Tài Khoản
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5" /> Tạm Khóa Tài Khoản
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ================================================== */}
      {/* TAB 3: BÀI HỌC & HỌC LIỆU (LESSONS & MATERIAL EDITOR) */}
      {/* ================================================== */}
      {activeTab === 'lessons' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="text-base font-black text-slate-900">Quản Lý & Soạn Bài Học Tiếng Anh THCS</h3>
                  <p className="text-xs text-slate-600">Chọn Khối lớp, Unit và thực hiện soạn thảo nội dung bài giảng phong phú.</p>
                </div>
              </div>

              <button
                onClick={() => handleOpenLessonModal()}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> + Tạo Bài Học Mới
              </button>
            </div>

            {/* GRADE & UNIT SELECTOR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">CHỌN KHỐI LỚP:</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 text-xs font-bold"
                >
                  <option value={6}>Khối 6 Global Success</option>
                  <option value={7}>Khối 7 Global Success</option>
                  <option value={8}>Khối 8 Global Success</option>
                  <option value={9}>Khối 9 Global Success</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">CHỌN UNIT BÀI HỌC:</label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 text-xs font-bold"
                >
                  {cmsStorage.getUnits(selectedGrade).map((u) => (
                    <option key={u.id} value={u.id}>{u.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* LESSONS LIST */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Danh Sách Bài Học ({cmsStorage.getLessons(selectedUnitId).length} Bài):</h4>
              {cmsStorage.getLessons(selectedUnitId).map((les) => (
                <div key={les.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                        {les.order || 1}
                      </span>
                      <h4 className="text-sm font-black text-slate-900">{les.title}</h4>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-300">
                        {les.status || 'PUBLISHED'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{les.objectives}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenLessonModal(les)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 flex items-center gap-1 shadow-sm"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(les.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 flex items-center gap-1 shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* TAB 4 & 5: BÀI TẬP & ĐỀ KIỂM TRA (ASSIGNMENTS & EXAMS) */}
      {/* ================================================== */}
      {(activeTab === 'assignments' || activeTab === 'exams') && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                {activeTab === 'assignments' ? <HelpCircle className="w-6 h-6 text-amber-600" /> : <Zap className="w-6 h-6 text-emerald-600" />}
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {activeTab === 'assignments' ? 'Quản Lý Bài Tập Về Nhà & Trắc Nghiệm' : 'Hệ Thống Soạn Đề Kiểm Tra Ma Trận THCS'}
                  </h3>
                  <p className="text-xs text-slate-600">Khởi tạo bài tập hoặc đề thi, giao trực tiếp cho các lớp và thiết lập thời gian làm bài.</p>
                </div>
              </div>

              <button
                onClick={() => handleOpenAssignmentModal(null, activeTab === 'assignments' ? 'HOMEWORK' : 'EXAM')}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> {activeTab === 'assignments' ? '+ Tạo Bài Tập Mới' : '+ Tạo Đề Kiểm Tra Mới'}
              </button>
            </div>

            {/* ASSIGNMENTS LIST */}
            <div className="space-y-3">
              {assignments
                .filter(a => activeTab === 'assignments' ? a.assignmentType !== 'EXAM' : a.assignmentType === 'EXAM')
                .map((asg) => (
                  <div key={asg.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-2 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-emerald-600 text-white font-black text-[10px]">
                          Lớp {asg.targetClass || '8A1'}
                        </span>
                        <h4 className="text-sm font-black text-slate-900">{asg.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600">{asg.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-500">
                        <span>⏱️ Thời gian: {asg.timeLimitMinutes} phút</span>
                        <span>🎯 Điểm: {asg.totalPoints} điểm</span>
                        <span>📅 Hạn nộp: {asg.dueDate}</span>
                        <span>❓ Số câu: {asg.questions?.length || 0} câu</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAssignmentModal(asg, asg.assignmentType)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 flex items-center gap-1 shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Sửa
                      </button>
                      <button
                        onClick={() => {
                          const updated = cmsStorage.deleteAssignment(asg.id);
                          setAssignments(updated);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 flex items-center gap-1 shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Xóa
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* TAB 6: CHẤM BÀI (GRADING QUEUE & TEACHER FEEDBACK) */}
      {/* ================================================== */}
      {activeTab === 'grading' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <FileCheck className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="text-base font-black text-slate-900">Danh Sách Học Sinh Đã Nộp Bài & Chấm Điểm</h3>
                  <p className="text-xs text-slate-600">Xem chi tiết bài làm tự luận, nhập điểm số bổ sung và ghi nhận xét của Giáo viên.</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-extrabold uppercase">
                    <th className="p-4">Họ và Tên HS</th>
                    <th className="p-4">Mã HS / Lớp</th>
                    <th className="p-4">Thời Gian Nộp</th>
                    <th className="p-4">Điểm Trắc Nghiệm</th>
                    <th className="p-4">Điểm Tự Luận</th>
                    <th className="p-4">Tổng Điểm</th>
                    <th className="p-4">Trạng Thái</th>
                    <th className="p-4 text-right">Thao Tác Chấm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">{sub.studentName}</td>
                      <td className="p-4 text-slate-700 font-mono">{sub.studentCode} ({sub.targetClass})</td>
                      <td className="p-4 text-slate-600">{sub.submittedAt}</td>
                      <td className="p-4 font-bold text-emerald-700">{sub.autoScore} / 8.0</td>
                      <td className="p-4 font-bold text-amber-700">{sub.essayScore !== null ? `${sub.essayScore}đ` : 'Chờ chấm'}</td>
                      <td className="p-4 font-black text-slate-900 text-sm">{sub.totalScore} / 10.0</td>
                      <td className="p-4">
                        {sub.status === 'GRADED' ? (
                          <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                            ✓ Đã Chấm Điểm
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 font-bold border border-amber-300">
                            ⏳ Chờ Giáo Viên Chấm
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleOpenGradingModal(sub)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 ml-auto"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Chấm Bài
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

      {/* ================================================== */}
      {/* TAB 7: THỐNG KÊ & AUDIT LOGS */}
      {/* ================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" /> Nhật Ký Hoạt Động & Audit Logs Giáo Viên
            </h3>

            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-4 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">{log.action}</span>
                    <span className="text-slate-900 font-bold">{log.user}:</span>
                    <span className="text-slate-700 font-sans">{log.details}</span>
                  </div>
                  <span className="text-slate-500 text-[11px] shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* LESSON EDITOR MODAL */}
      {/* ================================================== */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full text-slate-900 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingLesson ? '✏️ Chỉnh Sửa Bài Học' : '📝 Soạn Bài Học Mới'}
              </h3>
              <button onClick={() => setIsLessonModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="block mb-1 text-slate-700">TÊN BÀI HỌC:</label>
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="Ví dụ: Getting Started: My Favourite Leisure Activity..."
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">MỤC TIÊU BÀI HỌC (OBJECTIVES):</label>
                <textarea
                  rows={2}
                  value={lessonForm.objectives}
                  onChange={(e) => setLessonForm({ ...lessonForm, objectives: e.target.value })}
                  placeholder="Mục tiêu bài học cần đạt..."
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">TỪ VỰNG TRỌNG TÂM (VOCABULARY):</label>
                <input
                  type="text"
                  value={lessonForm.vocabulary}
                  onChange={(e) => setLessonForm({ ...lessonForm, vocabulary: e.target.value })}
                  placeholder="craft kit, DIY, origami..."
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">NGỮ PHÁP (GRAMMAR):</label>
                <input
                  type="text"
                  value={lessonForm.grammar}
                  onChange={(e) => setLessonForm({ ...lessonForm, grammar: e.target.value })}
                  placeholder="Verbs of liking + V-ing..."
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">NỘI DUNG CHI TIẾT (CONTENT):</label>
                <textarea
                  rows={4}
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                  placeholder="Soạn nội dung văn bản, kịch bản nghe..."
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">GHI CHÚ GIÁO VIÊN (TEACHER NOTES):</label>
                <input
                  type="text"
                  value={lessonForm.teacherNotes}
                  onChange={(e) => setLessonForm({ ...lessonForm, teacherNotes: e.target.value })}
                  placeholder="Ghi chú giảng dạy trên lớp..."
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                <span className="text-slate-700">Trạng thái xuất bản:</span>
                <select
                  value={lessonForm.status}
                  onChange={(e) => setLessonForm({ ...lessonForm, status: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-slate-900 rounded-lg p-1.5 text-xs font-bold"
                >
                  <option value="PUBLISHED">XUẤT BẢN (PUBLISHED)</option>
                  <option value="DRAFT">LƯU NHÁP (DRAFT)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSaveLesson}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Lưu Bài Học
            </button>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* ASSIGNMENT & EXAM BUILDER MODAL */}
      {/* ================================================== */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full text-slate-900 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {asgForm.assignmentType === 'EXAM' ? '⚡ Trình Soạn Đề Kiểm Tra Ma Trận' : '📝 Trình Soạn Bài Tập Về Nhà'}
              </h3>
              <button onClick={() => setIsAssignmentModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-700">TÊN BÀI / ĐỀ THI:</label>
                  <input
                    type="text"
                    value={asgForm.title}
                    onChange={(e) => setAsgForm({ ...asgForm, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-700">LỚP NHẬN BÀI:</label>
                  <select
                    value={asgForm.targetClass}
                    onChange={(e) => setAsgForm({ ...asgForm, targetClass: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value="8A1">Lớp 8A1</option>
                    <option value="8A2">Lớp 8A2</option>
                    <option value="9A1">Lớp 9A1</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1 text-slate-700">THỜI GIAN LÀM (PHÚT):</label>
                  <input
                    type="number"
                    value={asgForm.timeLimitMinutes}
                    onChange={(e) => setAsgForm({ ...asgForm, timeLimitMinutes: parseInt(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-700">TỔNG ĐIỂM:</label>
                  <input
                    type="number"
                    value={asgForm.totalPoints}
                    onChange={(e) => setAsgForm({ ...asgForm, totalPoints: parseFloat(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-700">HẠN NỘP BÀI:</label>
                  <input
                    type="date"
                    value={asgForm.dueDate}
                    onChange={(e) => setAsgForm({ ...asgForm, dueDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* QUESTIONS EDITING */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900">DANH SÁCH CÂU HỎI ({asgForm.questions.length} CÂU):</h4>
                  <button
                    onClick={handleAddQuestion}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Thêm Câu Hỏi
                  </button>
                </div>

                {asgForm.questions.map((q, qIdx) => (
                  <div key={q.id || qIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-800">Câu {qIdx + 1}:</span>
                      <button
                        onClick={() => handleRemoveQuestion(qIdx)}
                        className="text-rose-600 hover:text-rose-800 text-xs font-bold"
                      >
                        Xóa câu
                      </button>
                    </div>

                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => {
                        const updated = [...asgForm.questions];
                        updated[qIdx].question = e.target.value;
                        setAsgForm({ ...asgForm, questions: updated });
                      }}
                      placeholder="Nội dung câu hỏi..."
                      className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs font-bold text-slate-900"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={q.correct}
                        onChange={(e) => {
                          const updated = [...asgForm.questions];
                          updated[qIdx].correct = e.target.value;
                          setAsgForm({ ...asgForm, questions: updated });
                        }}
                        placeholder="Đáp án đúng (Ví dụ: A. building)"
                        className="bg-white border border-emerald-300 p-2 rounded-xl text-xs text-emerald-900 font-bold"
                      />
                      <input
                        type="number"
                        step="0.5"
                        value={q.points}
                        onChange={(e) => {
                          const updated = [...asgForm.questions];
                          updated[qIdx].points = parseFloat(e.target.value);
                          setAsgForm({ ...asgForm, questions: updated });
                        }}
                        placeholder="Điểm số câu"
                        className="bg-white border border-slate-200 p-2 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveAssignment}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Xuất Bản & Giao Bài Cho Lớp
            </button>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* MANUAL GRADING MODAL */}
      {/* ================================================== */}
      {isGradingModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full text-slate-900 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                ✏️ Giám Sát & Chấm Bài Tự Luận
              </h3>
              <button onClick={() => setIsGradingModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-slate-900">Học sinh: <strong>{selectedSubmission.studentName}</strong> ({selectedSubmission.studentCode})</p>
                <p className="text-slate-700">Điểm trắc nghiệm tự động: <strong>{selectedSubmission.autoScore} / 8.0 điểm</strong></p>
              </div>

              <div>
                <label className="block mb-1 text-slate-700">BÀI LÀM TỰ LUẬN CỦA HỌC SINH:</label>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono leading-relaxed">
                  {selectedSubmission.answers?.q5 || 'Chưa có câu trả lời tự luận'}
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-700">NHẬP ĐIỂM TỰ LUẬN (TỐI ĐA 2.0Đ):</label>
                <input
                  type="number"
                  step="0.25"
                  max="2.0"
                  value={essayScoreInput}
                  onChange={(e) => setEssayScoreInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-black text-slate-900"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">NHẬN XÉT CỦA GIÁO VIÊN:</label>
                <textarea
                  rows={3}
                  value={teacherFeedbackInput}
                  onChange={(e) => setTeacherFeedbackInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs leading-relaxed"
                />
              </div>
            </div>

            <button
              onClick={handleSaveGrading}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Hoàn Thành Chấm & Công Bố Kết Quả
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
