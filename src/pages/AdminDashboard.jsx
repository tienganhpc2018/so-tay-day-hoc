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
  Layers,
  Send,
  GraduationCap
} from 'lucide-react';

export const AdminDashboard = () => {
  const { profile, isTeacher, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // overview | users | lessons | assignments | exams | grading | analytics

  // Data states
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');

  // LMS Data
  const [classesList, setClassesList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [units, setUnits] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Selection & Modal states
  const [selectedGrade, setSelectedGrade] = useState(8);
  const [selectedUnitId, setSelectedUnitId] = useState('u1-g8');
  
  // Lesson Modal
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  // Assignment / Exam Authoring Modal
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Class & Student Creation Modals
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [classForm, setClassForm] = useState({ name: '', code: '', grade: 8, schoolYear: '2025 - 2026' });

  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [studentForm, setStudentForm] = useState({ fullName: '', studentCode: '', email: '', targetClass: '8A1', gradeLevel: 8 });

  const [isAssignToClassModalOpen, setIsAssignToClassModalOpen] = useState(false);
  const [assignForm, setAssignForm] = useState({ assignmentId: '', classId: 'cls-8a1', dueDate: '2026-10-20' });

  // Grading Modal
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

  // Rich Assignment / Exam Builder Form (Soạn Đề AI Style)
  const [asgForm, setAsgForm] = useState({
    title: '',
    description: '',
    grade: 8,
    unitId: 'u1-g8',
    assignmentType: 'HOMEWORK',
    totalPoints: 10,
    timeLimitMinutes: 20,
    dueDate: '2026-10-20',
    targetClass: '8A1',
    status: 'PUBLISHED',
    questions: [
      {
        id: 'q1',
        num: 1,
        type: 'MCQ',
        question: 'Minh enjoys _____ model cars in his free time.',
        options: ['A. building', 'B. to build', 'C. build', 'D. built'],
        correct: 'A. building',
        explanation: 'Sau động từ chỉ sở thích enjoy + V-ing -> building',
        points: 2.5
      },
      {
        id: 'q2',
        num: 2,
        type: 'TF',
        question: 'Gấp giấy origami là một hoạt động rảnh rỗi bổ ích.',
        options: ['A. True', 'B. False'],
        correct: 'A. True',
        explanation: 'Chính xác. Origami giúp rèn luyện sự kiên nhẫn.',
        points: 2.5
      },
      {
        id: 'q3',
        num: 3,
        type: 'GAPFILL',
        question: 'You need a craft _____ to make handmade gifts.',
        options: ['A. kit', 'B. box', 'C. set', 'D. bag'],
        correct: 'A. kit',
        explanation: 'Craft kit: bộ dụng cụ làm thủ công',
        points: 2.5
      },
      {
        id: 'q4',
        num: 4,
        type: 'ESSAY',
        question: 'Viết 3-5 câu mô tả hoạt động giải trí yêu thích của em trong thời gian rảnh.',
        options: [],
        correct: 'Giáo viên tự chấm',
        explanation: 'Học sinh cần ghi rõ tên hoạt động, lý do yêu thích và thời gian thực hiện.',
        points: 2.5
      }
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
    setClassesList(cmsStorage.getClasses());
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

  // Class Creation Handler
  const handleSaveClass = async () => {
    if (!classForm.name.trim() || !classForm.code.trim()) {
      alert('Vui lòng nhập Tên Lớp và Mã Lớp!');
      return;
    }
    soundFX.playClick();

    const newClassObj = {
      name: classForm.name,
      code: classForm.code.toUpperCase(),
      grade: parseInt(classForm.grade),
      schoolYear: classForm.schoolYear,
      studentCount: 0
    };

    const updatedClasses = cmsStorage.saveClass(newClassObj);
    setClassesList(updatedClasses);

    // Also attempt saving to Supabase classes table
    try {
      await supabase.from('classes').insert([
        { name: classForm.name, code: classForm.code.toUpperCase(), grade_level: parseInt(classForm.grade), teacher_id: profile?.id }
      ]);
    } catch (err) {}

    cmsStorage.logAction('TEACHER', profile?.full_name || 'Giáo Viên VIP', 'TẠO LỚP HỌC', `Tạo lớp mới: ${classForm.name} (Khối ${classForm.grade})`);
    setAuditLogs(cmsStorage.getAuditLogs());

    setIsAddClassModalOpen(false);
    setClassForm({ name: '', code: '', grade: 8, schoolYear: '2025 - 2026' });
    alert(`✨ Đã khởi tạo thành công lớp học ${newClassObj.name}!`);
  };

  // Add Student Handler
  const handleSaveStudent = async () => {
    if (!studentForm.fullName.trim()) {
      alert('Vui lòng nhập Họ và Tên học sinh!');
      return;
    }
    soundFX.playClick();

    const newCode = studentForm.studentCode.trim() || `HS${Math.floor(100 + Math.random() * 900)}`;
    const newStudent = {
      id: `stu-${Date.now()}`,
      full_name: studentForm.fullName,
      student_code: newCode,
      email: studentForm.email || `${newCode.toLowerCase()}@school.edu.vn`,
      role: 'student',
      status: 'active',
      grade_level: parseInt(studentForm.gradeLevel),
      target_class: studentForm.targetClass,
      total_stars: 10,
      total_coins: 50,
      created_at: new Date().toISOString()
    };

    setUsers(prev => [newStudent, ...prev]);

    // Also attempt saving to Supabase profiles
    try {
      await supabase.from('profiles').insert([
        { full_name: studentForm.fullName, student_code: newCode, email: newStudent.email, role: 'student', status: 'active', grade_level: newStudent.grade_level }
      ]);
    } catch (err) {}

    cmsStorage.logAction('TEACHER', profile?.full_name || 'Giáo Viên VIP', 'THÊM HỌC SINH', `Thêm HS: ${studentForm.fullName} (${newCode}) vào ${studentForm.targetClass}`);
    setAuditLogs(cmsStorage.getAuditLogs());

    setIsAddStudentModalOpen(false);
    setStudentForm({ fullName: '', studentCode: '', email: '', targetClass: '8A1', gradeLevel: 8 });
    alert(`✨ Đã thêm học sinh ${newStudent.full_name} (${newCode}) vào Lớp thành công!`);
  };

  // Assign Assignment to Class Handler
  const handleSaveAssignToClass = () => {
    if (!assignForm.assignmentId) {
      alert('Vui lòng chọn Bài tập hoặc Đề thi muốn giao!');
      return;
    }
    soundFX.playClick();
    const updatedAssignments = cmsStorage.assignWorkToClass(assignForm.assignmentId, assignForm.classId, assignForm.dueDate);
    setAssignments(updatedAssignments);

    const asgObj = assignments.find(a => a.id === assignForm.assignmentId);
    cmsStorage.logAction('TEACHER', profile?.full_name || 'Giáo Viên VIP', 'GIAO BÀI', `Giao bài: "${asgObj?.title || 'Đề thi'}" cho Lớp ${assignForm.classId} (Hạn nộp: ${assignForm.dueDate})`);
    setAuditLogs(cmsStorage.getAuditLogs());

    setIsAssignToClassModalOpen(false);
    alert(`🚀 Đã giao bài thi cho Lớp học thành công! Học sinh đã nhận được bài.`);
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

  // Assignment / Exam actions
  const handleOpenAssignmentModal = (asg = null, type = 'HOMEWORK') => {
    soundFX.playClick();
    if (asg) {
      setEditingAssignment(asg);
      setAsgForm({ ...asg });
    } else {
      setEditingAssignment(null);
      setAsgForm({
        title: type === 'EXAM' ? 'BÀI KIỂM TRA GIỮA KỲ 1 TIẾNG ANH KHỐI 8 (CHUẨN 37 CÂU)' : 'Bài Tập Ôn Tập Unit 1: Verbs of Liking & Vocabulary',
        description: 'Bài kiểm tra kiến thức tổng hợp 4 kỹ năng bám sát ma trận Global Success.',
        grade: selectedGrade || 8,
        unitId: selectedUnitId || 'u1-g8',
        assignmentType: type,
        totalPoints: 10,
        timeLimitMinutes: type === 'EXAM' ? 45 : 20,
        dueDate: '2026-10-20',
        targetClass: '8A1',
        status: 'PUBLISHED',
        questions: [
          {
            id: `q-${Date.now()}-1`,
            num: 1,
            type: 'MCQ',
            question: 'Minh enjoys _____ model cars in his free time.',
            options: ['A. building', 'B. to build', 'C. build', 'D. built'],
            correct: 'A. building',
            explanation: 'Sau động từ chỉ sở thích enjoy + V-ing -> building',
            points: 2.5
          },
          {
            id: `q-${Date.now()}-2`,
            num: 2,
            type: 'TF',
            question: 'Gấp giấy origami là một hoạt động rảnh rỗi bổ ích.',
            options: ['A. True', 'B. False'],
            correct: 'A. True',
            explanation: ' Origami giúp rèn luyện sự khéo léo và tập trung.',
            points: 2.5
          },
          {
            id: `q-${Date.now()}-3`,
            num: 3,
            type: 'GAPFILL',
            question: 'You need a craft _____ to make handmade gifts.',
            options: ['A. kit', 'B. box', 'C. set', 'D. bag'],
            correct: 'A. kit',
            explanation: 'Craft kit: bộ dụng cụ làm đồ thủ công',
            points: 2.5
          },
          {
            id: `q-${Date.now()}-4`,
            num: 4,
            type: 'ESSAY',
            question: 'Viết 3-5 câu mô tả hoạt động giải trí yêu thích của em.',
            options: [],
            correct: 'Giáo viên tự chấm',
            explanation: 'Học sinh nêu tên hoạt động, lý do và thời gian thực hiện.',
            points: 2.5
          }
        ]
      });
    }
    setIsAssignmentModalOpen(true);
  };

  const handleSaveAssignment = () => {
    if (!asgForm.title.trim()) {
      alert('Vui lòng nhập tên bài tập/đề thi!');
      return;
    }
    soundFX.playClick();
    const updated = cmsStorage.saveAssignment(asgForm);
    setAssignments(updated);

    cmsStorage.logAction('TEACHER', profile?.full_name || 'Giáo Viên VIP', editingAssignment ? 'SỬA BÀI/ĐỀ' : 'TẠO BÀI/ĐỀ', `Giao bài: ${asgForm.title} cho lớp ${asgForm.targetClass}`);
    setAuditLogs(cmsStorage.getAuditLogs());

    setIsAssignmentModalOpen(false);
    alert('✨ Đã xuất bản và giao bài thành công cho Lớp!');
  };

  // Question editing helpers inside Assignment Modal
  const handleAddQuestion = (type = 'MCQ') => {
    const qCount = asgForm.questions.length + 1;
    let newQ = {
      id: `q-${Date.now()}-${qCount}`,
      num: qCount,
      type,
      question: `Question ${qCount}: `,
      options: ['A. Option A', 'B. Option B', 'C. Option C', 'D. Option D'],
      correct: 'A. Option A',
      explanation: 'Giải thích chi tiết cho GV...',
      points: 2.0
    };

    if (type === 'TF') {
      newQ.options = ['A. True', 'B. False'];
      newQ.correct = 'A. True';
    } else if (type === 'LISTENING') {
      newQ.audioUrl = '';
      newQ.tapescript = 'Speaker A: Welcome to Grade 8 English...';
    } else if (type === 'READING') {
      newQ.passage = 'Reading Passage content...';
    } else if (type === 'ESSAY') {
      newQ.options = [];
      newQ.correct = 'Giáo viên tự chấm';
    }

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
    const matchesClass = selectedClassFilter === 'all' || u.target_class === selectedClassFilter;

    return matchesSearch && matchesStatus && matchesClass;
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
              <p className="text-xs text-emerald-800">Tạo lớp học mới, thêm học sinh vào lớp, giao bài tập hoặc mở trình chấm bài tự luận chỉ với 1 cú nhấp.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsAddClassModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow hover:bg-emerald-700 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> + Tạo Lớp Mới
              </button>
              <button
                onClick={() => setIsAddStudentModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-600 text-white font-extrabold text-xs shadow hover:bg-amber-700 flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" /> + Thêm HS Vào Lớp
              </button>
              <button
                onClick={() => setIsAssignToClassModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs shadow hover:bg-slate-800 flex items-center gap-1.5"
              >
                <Send className="w-4 h-4 text-amber-400" /> 🚀 Giao Bài Cho Lớp
              </button>
              <button
                onClick={() => { setActiveTab('lessons'); handleOpenLessonModal(); }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow hover:bg-indigo-700 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> + Soạn Bài Học
              </button>
              <button
                onClick={() => { setActiveTab('assignments'); handleOpenAssignmentModal(null, 'HOMEWORK'); }}
                className="px-4 py-2.5 rounded-xl bg-teal-600 text-white font-extrabold text-xs shadow hover:bg-teal-700 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> + Tạo Bài Tập
              </button>
            </div>
          </div>

          {/* OVERVIEW QUICK CLASSES WIDGET */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">🏫 Quản Lý Lớp Học & Học Sinh Đang Phụ Trách</h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsAddClassModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> + Tạo Lớp Học Mới
                </button>
                <button
                  onClick={() => setIsAddStudentModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 text-white font-extrabold text-xs shadow hover:bg-amber-700 flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" /> + Thêm HS Vào Lớp
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 font-extrabold text-xs hover:bg-slate-200 flex items-center gap-1"
                >
                  Xem Tất Cả Lớp & HS →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {classesList.map((cls) => (
                <div key={cls.id} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-emerald-900 text-sm">{cls.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-extrabold text-[10px]">
                      Khối {cls.grade}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">Niên khóa: {cls.schoolYear || '2025 - 2026'}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-emerald-200 text-xs font-bold">
                    <span className="text-slate-700">👥 {cls.studentCount || 30} Học sinh</span>
                    <button
                      onClick={() => {
                        setSelectedClassFilter(cls.code);
                        setActiveTab('users');
                        soundFX.playClick();
                      }}
                      className="text-emerald-700 hover:underline text-[11px]"
                    >
                      Chi tiết danh sách →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* TAB 2: QUẢN LÝ LỚP & HỌC SINH (CLASS & STUDENT MANAGEMENT) */}
      {/* ================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fadeIn">
          {/* CLASSES CARDS BAR */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">Danh Sách Lớp Học Do Thầy Cô Quản Lý</h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsAddClassModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> + Tạo Lớp Học Mới
                </button>
                <button
                  onClick={() => setIsAddStudentModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-extrabold text-xs shadow hover:bg-amber-700 flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" /> + Thêm Học Sinh Vào Lớp
                </button>
                <button
                  onClick={() => setIsAssignToClassModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-extrabold text-xs shadow hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4 text-amber-400" /> 🚀 Giao Bài Cho Lớp
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {classesList.map((cls) => (
                <div key={cls.id} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-emerald-800 text-sm">{cls.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-extrabold text-[10px]">
                      Khối {cls.grade}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">Niên khóa: {cls.schoolYear || '2025 - 2026'}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-emerald-200 text-xs font-bold">
                    <span className="text-slate-700">👥 {cls.studentCount || 30} Học sinh</span>
                    <button
                      onClick={() => {
                        setSelectedClassFilter(cls.code);
                        soundFX.playClick();
                      }}
                      className="text-emerald-700 hover:underline text-[11px]"
                    >
                      Xem danh sách lớp →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STUDENTS TABLE FILTER CONTROLS */}
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

            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-extrabold">
              <span className="text-slate-600 px-2">Lọc Lớp:</span>
              {['all', '8A1', '8A2', '9A1'].map((cCode) => (
                <button
                  key={cCode}
                  onClick={() => setSelectedClassFilter(cCode)}
                  className={`px-3 py-1.5 rounded-lg ${selectedClassFilter === cCode ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
                >
                  {cCode === 'all' ? 'Tất cả' : `Lớp ${cCode}`}
                </button>
              ))}
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
                    <th className="p-4">Lớp Học</th>
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
                      <td className="p-4 font-bold text-emerald-800">Lớp {u.target_class || '8A1'}</td>
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
      {/* TAB 3: BÀI HỌC & HỌC LIỆU */}
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
      {/* TAB 4 & 5: BÀI TẬP & ĐỀ KIỂM TRA */}
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
      {/* TAB 6: CHẤM BÀI */}
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
      {/* MODAL: TẠO LỚP HỌC MỚI */}
      {/* ================================================== */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full text-slate-900 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">🏫 Khởi Tạo Lớp Học Mới</h3>
              <button onClick={() => setIsAddClassModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="block mb-1 text-slate-700">TÊN LỚP HỌC:</label>
                <input
                  type="text"
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  placeholder="Ví dụ: Lớp 8A1, Lớp 8A2..."
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">MÃ LỚP (CODE):</label>
                <input
                  type="text"
                  value={classForm.code}
                  onChange={(e) => setClassForm({ ...classForm, code: e.target.value })}
                  placeholder="Ví dụ: 8A1"
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-900 uppercase"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">KHỐI LỚP:</label>
                <select
                  value={classForm.grade}
                  onChange={(e) => setClassForm({ ...classForm, grade: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value={6}>Khối 6</option>
                  <option value={7}>Khối 7</option>
                  <option value={8}>Khối 8</option>
                  <option value={9}>Khối 9</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-700">NIÊN KHÓA:</label>
                <input
                  type="text"
                  value={classForm.schoolYear}
                  onChange={(e) => setClassForm({ ...classForm, schoolYear: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            <button
              onClick={handleSaveClass}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Khởi Tạo Lớp Học
            </button>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* MODAL: THÊM HỌC SINH VÀO LỚP */}
      {/* ================================================== */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full text-slate-900 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">👤 Thêm Học Sinh Mới Vào Lớp</h3>
              <button onClick={() => setIsAddStudentModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="block mb-1 text-slate-700">HỌ VÀ TÊN HỌC SINH:</label>
                <input
                  type="text"
                  value={studentForm.fullName}
                  onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                  placeholder="Nhập đầy đủ Họ và Tên..."
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">MÃ HỌC SINH (MÃ ĐĂNG NHẬP):</label>
                <input
                  type="text"
                  value={studentForm.studentCode}
                  onChange={(e) => setStudentForm({ ...studentForm, studentCode: e.target.value })}
                  placeholder="Ví dụ: HS801"
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-900 uppercase"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">EMAIL TÀI KHOẢN (NẾU CÓ):</label>
                <input
                  type="email"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  placeholder="hs801@school.edu.vn"
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">CHỌN LỚP XẾP VÀO:</label>
                <select
                  value={studentForm.targetClass}
                  onChange={(e) => setStudentForm({ ...studentForm, targetClass: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                >
                  {classesList.map(c => (
                    <option key={c.id} value={c.code}>{c.name} (Khối {c.grade})</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSaveStudent}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Đăng Ký Học Sinh Vào Lớp
            </button>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* MODAL: GIAO BÀI CHO LỚP HỌC */}
      {/* ================================================== */}
      {isAssignToClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full text-slate-900 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">🚀 Giao Bài Tập / Đề Thi Cho Lớp</h3>
              <button onClick={() => setIsAssignToClassModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="block mb-1 text-slate-700">CHỌN BÀI TẬP / ĐỀ THI MUỐN GIAO:</label>
                <select
                  value={assignForm.assignmentId}
                  onChange={(e) => setAssignForm({ ...assignForm, assignmentId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="">-- Chọn bài tập/đề thi --</option>
                  {assignments.map(a => (
                    <option key={a.id} value={a.id}>[{a.assignmentType}] {a.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-700">CHỌN LỚP NHẬN BÀI:</label>
                <select
                  value={assignForm.classId}
                  onChange={(e) => setAssignForm({ ...assignForm, classId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                >
                  {classesList.map(c => (
                    <option key={c.id} value={c.code}>{c.name} ({c.studentCount} Học sinh)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-700">HẠN NỘP BÀI THI:</label>
                <input
                  type="date"
                  value={assignForm.dueDate}
                  onChange={(e) => setAssignForm({ ...assignForm, dueDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            <button
              onClick={handleSaveAssignToClass}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Phát Bài & Giao Ngay Cho Lớp
            </button>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* RICH QUESTION BUILDER MODAL (SOẠN ĐỀ AI STYLE) */}
      {/* ================================================== */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-4xl w-full text-slate-900 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  {asgForm.assignmentType === 'EXAM' ? '⚡ Trình Soạn Đề Kiểm Tra Ma Trận THCS' : '📝 Trình Soạn Bài Tập Về Nhà Nâng Cao'}
                </h3>
              </div>
              <button onClick={() => setIsAssignmentModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold">
              {/* TOP GENERAL METADATA */}
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
                    {classesList.map(c => (
                      <option key={c.id} value={c.code}>{c.name} ({c.schoolYear})</option>
                    ))}
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
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-700">TỔNG ĐIỂM BÀI THI:</label>
                  <input
                    type="number"
                    value={asgForm.totalPoints}
                    onChange={(e) => setAsgForm({ ...asgForm, totalPoints: parseFloat(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-700">HẠN NỘP BÀI:</label>
                  <input
                    type="date"
                    value={asgForm.dueDate}
                    onChange={(e) => setAsgForm({ ...asgForm, dueDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              {/* RICH QUESTION BUILDER HEADER BAR */}
              <div className="space-y-4 pt-3 border-t border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-emerald-900">DANH SÁCH CÂU HỎI ({asgForm.questions.length} CÂU)</span>
                    <span className="text-[11px] text-emerald-700 font-bold">
                      (Tổng điểm tích lũy: {asgForm.questions.reduce((sum, q) => sum + (parseFloat(q.points) || 0), 0).toFixed(1)} / {asgForm.totalPoints}đ)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => handleAddQuestion('MCQ')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 shadow-sm flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> + Trắc Nghiệm (MCQ)
                    </button>
                    <button
                      onClick={() => handleAddQuestion('TF')}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs hover:bg-indigo-700 shadow-sm flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> + Đúng / Sai
                    </button>
                    <button
                      onClick={() => handleAddQuestion('LISTENING')}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-extrabold text-xs hover:bg-purple-700 shadow-sm flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> + Bài Nghe Audio
                    </button>
                    <button
                      onClick={() => handleAddQuestion('READING')}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-extrabold text-xs hover:bg-teal-700 shadow-sm flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> + Bài Đọc Reading
                    </button>
                    <button
                      onClick={() => handleAddQuestion('ESSAY')}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-extrabold text-xs hover:bg-amber-700 shadow-sm flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> + Tự Luận
                    </button>
                  </div>
                </div>

                {/* QUESTIONS CARDS LIST (SOẠN ĐỀ AI STYLE) */}
                {asgForm.questions.map((q, qIdx) => (
                  <div key={q.id || qIdx} className="p-5 rounded-3xl bg-slate-50 border-2 border-emerald-200/80 space-y-3 shadow-sm">
                    
                    {/* CARD HEADER */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                          {qIdx + 1}
                        </span>
                        <span className="font-black text-slate-900 text-xs">Câu {qIdx + 1}</span>
                        <select
                          value={q.type}
                          onChange={(e) => {
                            const updated = [...asgForm.questions];
                            updated[qIdx].type = e.target.value;
                            setAsgForm({ ...asgForm, questions: updated });
                          }}
                          className="bg-white border border-slate-300 text-slate-900 rounded-lg p-1 text-[11px] font-bold"
                        >
                          <option value="MCQ">Trắc Nghiệm 4 Lựa Chọn (MCQ)</option>
                          <option value="TF">Đúng / Sai (True / False)</option>
                          <option value="GAPFILL">Điền Từ Chỗ Trống</option>
                          <option value="LISTENING">Bài Nghe Audio (Listening)</option>
                          <option value="READING">Bài Đọc Hiểu (Reading)</option>
                          <option value="ESSAY">Tự Luận (Speaking & Writing)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-600 text-[11px]">Điểm:</span>
                          <input
                            type="number"
                            step="0.25"
                            value={q.points}
                            onChange={(e) => {
                              const updated = [...asgForm.questions];
                              updated[qIdx].points = parseFloat(e.target.value) || 0;
                              setAsgForm({ ...asgForm, questions: updated });
                            }}
                            className="w-16 bg-white border border-slate-300 p-1 rounded-lg text-xs font-black text-emerald-800 text-center"
                          />
                        </div>

                        <button
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="text-rose-600 hover:text-rose-800 text-xs font-bold"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* QUESTION PROMPT TEXT AREA */}
                    <div>
                      <label className="block mb-1 text-slate-700 text-[11px]">NỘI DUNG CÂU HỎI:</label>
                      <textarea
                        rows={2}
                        value={q.question}
                        onChange={(e) => {
                          const updated = [...asgForm.questions];
                          updated[qIdx].question = e.target.value;
                          setAsgForm({ ...asgForm, questions: updated });
                        }}
                        placeholder="Nhập nội dung câu hỏi..."
                        className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-900 leading-relaxed"
                      />
                    </div>

                    {/* SPECIAL TYPE EXTRA FIELDS (AUDIO OR PASSAGE) */}
                    {q.type === 'LISTENING' && (
                      <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                        <label className="block text-[11px] text-purple-900 font-bold flex items-center gap-1.5">
                          <Volume2 className="w-4 h-4 text-purple-600" /> TỆP AUDIO BÀI NGHE MP3 / LINK DRIVE:
                        </label>
                        <input
                          type="url"
                          value={q.audioUrl || ''}
                          onChange={(e) => {
                            const updated = [...asgForm.questions];
                            updated[qIdx].audioUrl = e.target.value;
                            setAsgForm({ ...asgForm, questions: updated });
                          }}
                          placeholder="Dán link Drive Audio MP3..."
                          className="w-full bg-white border border-purple-300 p-2 rounded-xl text-xs"
                        />
                        <textarea
                          rows={2}
                          value={q.tapescript || ''}
                          onChange={(e) => {
                            const updated = [...asgForm.questions];
                            updated[qIdx].tapescript = e.target.value;
                            setAsgForm({ ...asgForm, questions: updated });
                          }}
                          placeholder="📜 Tapescript nội dung kịch bản bài nghe cho GV..."
                          className="w-full bg-white border border-purple-300 p-2 rounded-xl text-xs leading-relaxed"
                        />
                      </div>
                    )}

                    {q.type === 'READING' && (
                      <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 space-y-2">
                        <label className="block text-[11px] text-teal-900 font-bold flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-teal-600" /> 📖 NỘI DUNG BÀI ĐỌC READING PASSAGE:
                        </label>
                        <textarea
                          rows={3}
                          value={q.passage || ''}
                          onChange={(e) => {
                            const updated = [...asgForm.questions];
                            updated[qIdx].passage = e.target.value;
                            setAsgForm({ ...asgForm, questions: updated });
                          }}
                          placeholder="Nhập đoạn văn bài đọc..."
                          className="w-full bg-white border border-teal-300 p-2.5 rounded-xl text-xs leading-relaxed"
                        />
                      </div>
                    )}

                    {/* MULTIPLE CHOICE OPTIONS (A, B, C, D) OR TF OPTIONS */}
                    {q.type !== 'ESSAY' && (
                      <div className="space-y-2 pt-1">
                        <label className="block text-[11px] text-slate-700 font-bold">CÁC LỰA CHỌN ĐÁP ÁN:</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(q.options || ['A. ', 'B. ', 'C. ', 'D. ']).map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center gap-2">
                              <span className="w-5 font-black text-slate-600">{String.fromCharCode(65 + oIdx)}.</span>
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...asgForm.questions];
                                  const newOpts = [...(updated[qIdx].options || [])];
                                  newOpts[oIdx] = e.target.value;
                                  updated[qIdx].options = newOpts;
                                  setAsgForm({ ...asgForm, questions: updated });
                                }}
                                className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs font-bold text-slate-900"
                              />
                            </div>
                          ))}
                        </div>

                        {/* SELECT CORRECT ANSWER DROPDOWN */}
                        <div className="flex items-center gap-3 pt-2">
                          <span className="text-emerald-800 font-extrabold text-xs">🎯 ĐÁP ÁN ĐÚNG:</span>
                          <select
                            value={q.correct}
                            onChange={(e) => {
                              const updated = [...asgForm.questions];
                              updated[qIdx].correct = e.target.value;
                              setAsgForm({ ...asgForm, questions: updated });
                            }}
                            className="bg-emerald-100 border border-emerald-400 text-emerald-900 rounded-xl p-2 text-xs font-black"
                          >
                            {(q.options || []).map((optVal, oIdx) => (
                              <option key={oIdx} value={optVal}>{optVal || `Đáp án ${String.fromCharCode(65 + oIdx)}`}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* DETAILED EXPLANATION FOR TEACHER & STUDENTS */}
                    <div>
                      <label className="block mb-1 text-slate-600 text-[11px]">💡 GIẢI THÍCH ĐÁP ÁN CHI TIẾT (HIỂN THỊ CHO GV KHI CHẤM BÀI):</label>
                      <textarea
                        rows={2}
                        value={q.explanation || ''}
                        onChange={(e) => {
                          const updated = [...asgForm.questions];
                          updated[qIdx].explanation = e.target.value;
                          setAsgForm({ ...asgForm, questions: updated });
                        }}
                        placeholder="Giải thích lý do đáp án đúng..."
                        className="w-full bg-emerald-50/60 border border-emerald-200 p-2 rounded-xl text-xs text-emerald-900 leading-relaxed font-mono"
                      />
                    </div>

                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveAssignment}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" /> XUẤT BẢN & GIAO BÀI CHO LỚP HỌC
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
                  {selectedSubmission.answers?.q4 || selectedSubmission.answers?.q5 || 'Chưa có câu trả lời tự luận'}
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
                <label className="block mb-1 text-slate-700">NHẬN XET CỦA GIÁO VIÊN:</label>
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
