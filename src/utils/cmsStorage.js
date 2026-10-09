// Dynamic Content Management System (CMS) Storage Utility for Thầy
import { supabase } from '../lib/supabase';

const CMS_STORAGE_KEY = 'so_tay_cms_articles_v2';

// 6 Default Categories Initial Seed Data
const defaultSeedArticles = [
  {
    id: 'art-vocab-1',
    title: 'Mẹo Học Từ Vựng Cốt Lõi Khối 8 Unit 1: Leisure Time',
    category: 'vocabulary',
    categoryLabel: 'VOCABULARY',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    grade: 8,
    unit: 'Unit 1: Leisure Time',
    author: 'Thầy Nguyễn Văn Hải',
    date: '13/08/2026',
    thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop',
    description: 'Tổng hợp trọn bộ 35 từ vựng trọng tâm Unit 1 kèm phiên âm IPA và audio mẫu phát âm chuẩn giọng Mỹ/Anh.',
    content: `<h3>I. CÁC TỪ VỰNG TRỌNG TÂM UNIT 1: LEISURE TIME</h3>
<p>1. <strong>craft kit</strong> /krɑːft kɪt/ (n): bộ dụng cụ làm thủ công</p>
<p>2. <strong>DIY (Do It Yourself)</strong> /ˌdiː aɪ ˈwaɪ/ (n): tự làm đồ cá nhân</p>
<p>3. <strong>leisure activity</strong> /ˈleʒər ækˈtɪvəti/ (n): hoạt động thư giãn lúc rảnh rỗi</p>
<p>4. <strong>fold origami</strong> /fəʊld ˌɒrɪˈɡɑːmi/ (v): gấp giấy origami Nhật Bản</p>
<p>5. <strong>hang out with friends</strong> /hæŋ aʊt/ (v): đi chơi tụ tập với bạn bè</p>
<br/>
<p>💡 <em>Mẹo ghi nhớ:</em> Học sinh nên viết mỗi từ vựng vào Flashcard và thực hành đặt 1 câu ví dụ hoàn chỉnh mỗi ngày.</p>`,
    fileUrl: '',
    audioUrl: ''
  },
  {
    id: 'art-grammar-1',
    title: 'Chủ Điểm Ngữ Pháp Trọng Tâm 12 Units Tiếng Anh THCS',
    category: 'grammar',
    categoryLabel: 'GRAMMAR',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    grade: 8,
    unit: 'Unit 1 & Unit 2',
    author: 'Thầy Nguyễn Văn Hải',
    date: '13/08/2026',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop',
    description: 'Tổng hợp công thức Verbs of liking + V-ing/To-infinitive và các cấu trúc so sánh hơn của trạng từ.',
    content: `<h3>I. ĐỘNG TỪ CHỈ SỞ THÍCH (VERBS OF LIKING + V-ING)</h3>
<p>Các động từ chỉ sở thích như <strong>like, love, enjoy, fancy, prefer, hate, dislike, detest</strong> theo sau bởi động từ danh từ hóa (V-ing).</p>
<p><strong>Ví dụ:</strong> Minh enjoys <em>building</em> model cars in his free time.</p>
<br/>
<h3>II. SO SÁNH HƠN CỦA TRẠNG TỪ (COMPARATIVE ADVERBS)</h3>
<p>1. Trạng từ ngắn + -er + than: <em>fast -> faster, hard -> harder</em></p>
<p>2. More + trạng từ dài + than: <em>more fluently, more carefully</em></p>`,
    fileUrl: '',
    audioUrl: ''
  },
  {
    id: 'art-audio-1',
    title: 'Trọn Bộ Tapescript & File Audio Luyện Nghe Tiếng Anh THCS',
    category: 'audio',
    categoryLabel: 'AUDIO',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    grade: 8,
    unit: 'Unit 1: Leisure Time',
    author: 'Thầy Nguyễn Văn Hải',
    date: '13/08/2026',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    description: 'File âm thanh chuẩn mono tích hợp icon cái loa cho từng phần nghe chuẩn thời lượng 60-80s.',
    content: `📜 <strong>TAPESCRIPT PART 1:</strong><br/>
Speaker 1: Welcome to Grade 8 English! Today in Unit 1: Leisure Time, we discuss leisure activities and healthy living. Key vocabulary includes craft kit, DIY, origami.`,
    audioUrl: 'https://actions.google.com/sounds/v1/speech/person_speaking.ogg'
  },
  {
    id: 'art-info-1',
    title: 'Tuyển Tập Infographic Kiến Thức Tiếng Anh THCS Trực Quan',
    category: 'infographic',
    categoryLabel: 'INFOGRAPHIC',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    grade: 8,
    unit: 'Unit 1: Leisure Time',
    author: 'Thầy Nguyễn Văn Hải',
    date: '13/08/2026',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    description: 'Sơ đồ Infographic tóm tắt công thức Verbs of liking + V-ing giúp học sinh dễ nhớ bài học bằng hình ảnh 3D.',
    content: `<p>Hình ảnh Infographic tóm tắt ngữ pháp trực quan bám sát sách giáo khoa Tiếng Anh THCS Global Success.</p>`,
    fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'art-proj-1',
    title: 'Hướng Dẫn Thiết Kế iFrame Game & Project Tương Tác',
    category: 'project',
    categoryLabel: 'PROJECT',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    grade: 8,
    unit: 'Unit 1 & Unit 2',
    author: 'Thầy Nguyễn Văn Hải',
    date: '13/08/2026',
    thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop',
    description: 'Tích hợp các trò chơi ghép cặp, trắc nghiệm và flashcards tương tác trực tiếp trên lớp học.',
    content: `<p>Dự án tương tác Project cho học sinh làm việc nhóm theo từng Unit.</p>`,
    fileUrl: ''
  },
  {
    id: 'art-sheet-1',
    title: 'Bộ Phiếu Bài Tập 4 Kỹ Năng Tích Hợp AI Chấm Điểm & Nhắc Lỗi',
    category: 'worksheet',
    categoryLabel: 'WORKSHEET',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    grade: 8,
    unit: 'Unit 1: Leisure Time',
    author: 'Thầy Nguyễn Văn Hải',
    date: '13/08/2026',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop',
    description: 'Phiếu làm bài 4 kỹ năng Listening, Speaking, Reading, Writing có đáp án giải thích chi tiết cho GV.',
    content: `<p>Bộ phiếu bài tập 4 kỹ năng tương tác chấm điểm tự động.</p>`,
    fileUrl: ''
  }
];

export const cmsStorage = {
  // Get All Articles
  getAllArticles: () => {
    try {
      const stored = localStorage.getItem(CMS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error reading CMS articles:', e);
    }
    // Initialize seed
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(defaultSeedArticles));
    return defaultSeedArticles;
  },

  // Get Articles By Category
  getArticlesByCategory: (categoryKey) => {
    const all = cmsStorage.getAllArticles();
    if (!categoryKey || categoryKey === 'all') return all;
    return all.filter(a => (a.category || '').toLowerCase() === categoryKey.toLowerCase());
  },

  // Get Article By Id
  getArticleById: (articleId) => {
    if (!articleId) return null;
    const all = cmsStorage.getAllArticles();
    return all.find(a => String(a.id) === String(articleId)) || null;
  },

  // Save / Add / Update Article
  saveArticle: (articleData) => {
    const all = cmsStorage.getAllArticles();
    let updatedList = [];

    const existingIdx = all.findIndex(a => a.id === articleData.id);
    if (existingIdx >= 0) {
      // Edit existing
      all[existingIdx] = {
        ...all[existingIdx],
        ...articleData,
        date: new Date().toLocaleDateString('vi-VN')
      };
      updatedList = [...all];
    } else {
      // Create new
      const newObj = {
        ...articleData,
        id: articleData.id || `art-custom-${Date.now()}`,
        author: articleData.author || 'Thầy Nguyễn Văn Hải',
        date: new Date().toLocaleDateString('vi-VN')
      };
      updatedList = [newObj, ...all];
    }

    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(updatedList));
    return updatedList;
  },

  // Delete Article
  deleteArticle: (articleId) => {
    const all = cmsStorage.getAllArticles();
    const filtered = all.filter(a => a.id !== articleId);
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  },

  // --------------------------------------------------
  // LMS COURSES & UNITS & LESSONS
  // --------------------------------------------------
  getCourses: () => {
    try {
      const stored = localStorage.getItem('lms_courses_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    const defaultCourses = [
      { id: 'course-6', title: 'Tiếng Anh 6 Global Success', grade: 6, subject: 'Tiếng Anh', order: 1 },
      { id: 'course-7', title: 'Tiếng Anh 7 Global Success', grade: 7, subject: 'Tiếng Anh', order: 2 },
      { id: 'course-8', title: 'Tiếng Anh 8 Global Success', grade: 8, subject: 'Tiếng Anh', order: 3 },
      { id: 'course-9', title: 'Tiếng Anh 9 Global Success', grade: 9, subject: 'Tiếng Anh', order: 4 }
    ];
    localStorage.setItem('lms_courses_v1', JSON.stringify(defaultCourses));
    return defaultCourses;
  },

  saveCourse: (courseData) => {
    const courses = cmsStorage.getCourses();
    const idx = courses.findIndex(c => c.id === courseData.id);
    if (idx >= 0) {
      courses[idx] = { ...courses[idx], ...courseData };
    } else {
      courses.push({ ...courseData, id: courseData.id || `course-${Date.now()}` });
    }
    localStorage.setItem('lms_courses_v1', JSON.stringify(courses));
    return courses;
  },

  getUnits: (gradeLevel = null) => {
    try {
      const stored = localStorage.getItem('lms_units_v1');
      let units = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(units) || units.length === 0) {
        units = [
          { id: 'u1-g8', courseId: 'course-8', grade: 8, title: 'Unit 1: Leisure Time', description: 'Từ vựng & Ngữ pháp chủ đề hoạt động rảnh rỗi', order: 1, status: 'PUBLISHED' },
          { id: 'u2-g8', courseId: 'course-8', grade: 8, title: 'Unit 2: Life in the Countryside', description: 'Từ vựng & Ngữ pháp cuộc sống nông thôn', order: 2, status: 'PUBLISHED' },
          { id: 'u3-g8', courseId: 'course-8', grade: 8, title: 'Unit 3: Teenagers', description: 'Đời sống & Thách thức lứa tuổi teen', order: 3, status: 'PUBLISHED' },
          { id: 'u1-g9', courseId: 'course-9', grade: 9, title: 'Unit 1: Local Community', description: 'Cộng đồng địa phương & Làng nghề truyền thống', order: 1, status: 'PUBLISHED' }
        ];
        localStorage.setItem('lms_units_v1', JSON.stringify(units));
      }
      if (gradeLevel) return units.filter(u => u && Number(u.grade) === Number(gradeLevel));
      return units;
    } catch (e) {
      return [];
    }
  },

  saveUnit: (unitData) => {
    const units = cmsStorage.getUnits();
    const idx = units.findIndex(u => u.id === unitData.id);
    if (idx >= 0) {
      units[idx] = { ...units[idx], ...unitData };
    } else {
      units.push({ ...unitData, id: unitData.id || `unit-${Date.now()}` });
    }
    localStorage.setItem('lms_units_v1', JSON.stringify(units));
    return units;
  },

  getLessons: (unitId = null) => {
    try {
      const stored = localStorage.getItem('lms_lessons_v1');
      let lessons = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(lessons) || lessons.length === 0) {
        lessons = [
          {
            id: 'les-1',
            unitId: 'u1-g8',
            title: 'Getting Started: My Favourite Leisure Activity',
            grade: 8,
            objectives: 'Học sinh nhận biết từ vựng craft kit, DIY, origami và làm quen cấu trúc Verbs of liking + V-ing.',
            content: 'Đoạn hội thoại mở đầu bài học Unit 1 giữa Trang, Phúc và Nick về sở thích cá nhân.',
            vocabulary: 'craft kit, DIY, origami, leisure activity, hang out',
            grammar: 'Verbs of liking + V-ing (enjoy, fancy, prefer)',
            teacherNotes: 'Cho học sinh đóng vai hội thoại theo cặp và thực hành Flashcard.',
            order: 1,
            status: 'PUBLISHED',
            created_at: new Date().toLocaleDateString('vi-VN')
          },
          {
            id: 'les-2',
            unitId: 'u1-g8',
            title: 'A Closer Look 1: Vocabulary & Pronunciation',
            grade: 8,
            objectives: 'Phát âm chuẩn âm /u:/ và /ʊ/ trong từ vựng Unit 1.',
            content: 'Bài luyện phát âm chuẩn audio theo ma trận sách giáo khoa.',
            vocabulary: 'book, cook, foot, group, soup, fruit',
            grammar: 'Phát âm /u:/ vs /ʊ/',
            teacherNotes: 'Bật audio mẫu cho học sinh nghe lại 2 lần.',
            order: 2,
            status: 'PUBLISHED',
            created_at: new Date().toLocaleDateString('vi-VN')
          }
        ];
        localStorage.setItem('lms_lessons_v1', JSON.stringify(lessons));
      }
      if (unitId) return lessons.filter(l => l && l.unitId === unitId);
      return lessons;
    } catch (e) {
      return [];
    }
  },

  saveLesson: (lessonData) => {
    const lessons = cmsStorage.getLessons();
    const idx = lessons.findIndex(l => l.id === lessonData.id);
    let updated = [];
    if (idx >= 0) {
      lessons[idx] = { ...lessons[idx], ...lessonData, updated_at: new Date().toLocaleDateString('vi-VN') };
      updated = [...lessons];
    } else {
      const newLes = {
        ...lessonData,
        id: lessonData.id || `les-${Date.now()}`,
        status: lessonData.status || 'PUBLISHED',
        created_at: new Date().toLocaleDateString('vi-VN')
      };
      updated = [newLes, ...lessons];
    }
    localStorage.setItem('lms_lessons_v1', JSON.stringify(updated));
    return updated;
  },

  deleteLesson: (lessonId) => {
    const lessons = cmsStorage.getLessons();
    const filtered = lessons.filter(l => l && l.id !== lessonId);
    localStorage.setItem('lms_lessons_v1', JSON.stringify(filtered));
    return filtered;
  },

  // --------------------------------------------------
  // LMS ASSIGNMENTS & EXAMS & SUBMISSIONS
  // --------------------------------------------------
  getAssignments: () => {
    try {
      const stored = localStorage.getItem('lms_assignments_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    const defaultAssignments = [
      {
        id: 'asg-1',
        title: 'Bài Tập Ôn Tập Unit 1: Verbs of Liking & Vocabulary',
        description: 'Bài tập 10 câu trắc nghiệm và điền từ kiểm tra kiến thức Unit 1.',
        grade: 8,
        unitId: 'u1-g8',
        assignmentType: 'HOMEWORK', // HOMEWORK vs EXAM
        totalPoints: 10,
        timeLimitMinutes: 20,
        dueDate: '2026-10-15',
        targetClass: '8A1',
        status: 'PUBLISHED',
        questions: [
          { id: 'q1', num: 1, type: 'MCQ', question: 'Minh enjoys _____ model cars in his free time.', options: ['A. building', 'B. to build', 'C. build', 'D. built'], correct: 'A. building', points: 2 },
          { id: 'q2', num: 2, type: 'MCQ', question: 'She is hooked _____ playing volleyball.', options: ['A. on', 'B. in', 'C. at', 'D. with'], correct: 'A. on', points: 2 },
          { id: 'q3', num: 3, type: 'TF', question: 'Gấp giấy origami là một hoạt động rảnh rỗi bổ ích.', options: ['A. True', 'B. False'], correct: 'A. True', points: 2 },
          { id: 'q4', num: 4, type: 'GAPFILL', question: 'Điền 1 từ: You need a craft _____ to make handmade gifts.', options: ['A. kit', 'B. box', 'C. set', 'D. bag'], correct: 'A. kit', points: 2 },
          { id: 'q5', num: 5, type: 'ESSAY', question: 'Viết 3-5 câu mô tả hoạt động giải trí yêu thích của em.', options: [], correct: 'Giáo viên tự chấm', points: 2 }
        ],
        created_at: new Date().toLocaleDateString('vi-VN')
      }
    ];
    localStorage.setItem('lms_assignments_v1', JSON.stringify(defaultAssignments));
    return defaultAssignments;
  },

  saveAssignment: (asgData) => {
    const list = cmsStorage.getAssignments();
    const idx = list.findIndex(a => a && a.id === asgData.id);
    let updated = [];
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...asgData };
      updated = [...list];
    } else {
      const newAsg = {
        ...asgData,
        id: asgData.id || `asg-${Date.now()}`,
        status: asgData.status || 'PUBLISHED',
        created_at: new Date().toLocaleDateString('vi-VN')
      };
      updated = [newAsg, ...list];
    }
    localStorage.setItem('lms_assignments_v1', JSON.stringify(updated));
    return updated;
  },

  deleteAssignment: (asgId) => {
    const list = cmsStorage.getAssignments();
    const filtered = list.filter(a => a && a.id !== asgId);
    localStorage.setItem('lms_assignments_v1', JSON.stringify(filtered));
    return filtered;
  },

  getSubmissions: () => {
    try {
      const stored = localStorage.getItem('lms_submissions_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    const defaultSubmissions = [
      {
        id: 'sub-1',
        assignmentId: 'asg-1',
        studentId: 'stu-1',
        studentName: 'Trần Văn An',
        studentCode: 'HS801',
        targetClass: '8A1',
        submittedAt: '08/10/2026 19:30',
        autoScore: 8.0,
        essayScore: 2.0,
        totalScore: 10.0,
        status: 'GRADED', // SUBMITTED vs GRADED
        teacherFeedback: 'Bài làm rất xuất sắc! Viết câu lưu thoát, đúng ngữ pháp.',
        answers: { q1: 'A. building', q2: 'A. on', q3: 'A. True', q4: 'A. kit', q5: 'My favourite leisure activity is playing football with my classmates after school.' }
      },
      {
        id: 'sub-2',
        assignmentId: 'asg-1',
        studentId: 'stu-2',
        studentName: 'Lê Thị Mai',
        studentCode: 'HS802',
        targetClass: '8A1',
        submittedAt: '08/10/2026 20:15',
        autoScore: 6.0,
        essayScore: null,
        totalScore: 6.0,
        status: 'SUBMITTED',
        teacherFeedback: '',
        answers: { q1: 'A. building', q2: 'B. in', q3: 'A. True', q4: 'A. kit', q5: 'I love reading books in the evening.' }
      }
    ];
    localStorage.setItem('lms_submissions_v1', JSON.stringify(defaultSubmissions));
    return defaultSubmissions;
  },

  saveSubmission: (subData) => {
    const list = cmsStorage.getSubmissions();
    const idx = list.findIndex(s => s && (s.id === subData.id || (s.assignmentId === subData.assignmentId && s.studentId === subData.studentId)));
    let updated = [];
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...subData };
      updated = [...list];
    } else {
      const newSub = {
        ...subData,
        id: subData.id || `sub-${Date.now()}`,
        submittedAt: new Date().toLocaleString('vi-VN')
      };
      updated = [newSub, ...list];
    }
    localStorage.setItem('lms_submissions_v1', JSON.stringify(updated));
    return updated;
  },

  gradeSubmission: (subId, essayScore, teacherFeedback) => {
    const list = cmsStorage.getSubmissions();
    const idx = list.findIndex(s => s && s.id === subId);
    if (idx >= 0) {
      const autoS = Number(list[idx].autoScore || 0);
      const essayS = Number(essayScore || 0);
      list[idx] = {
        ...list[idx],
        essayScore: essayS,
        totalScore: autoS + essayS,
        status: 'GRADED',
        teacherFeedback: teacherFeedback || 'Đã hoàn thành chấm bài.'
      };
      localStorage.setItem('lms_submissions_v1', JSON.stringify(list));
    }
    return list;
  },

  // --------------------------------------------------
  // AUDIT LOGS STORAGE
  // --------------------------------------------------
  getAuditLogs: () => {
    try {
      const stored = localStorage.getItem('lms_audit_logs_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  },

  logAction: (userRole, userName, action, details) => {
    const logs = cmsStorage.getAuditLogs();
    const newEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('vi-VN'),
      role: userRole || 'TEACHER',
      user: userName || 'Giáo Viên VIP',
      action,
      details
    };
    const updated = [newEntry, ...logs.slice(0, 99)];
    localStorage.setItem('lms_audit_logs_v1', JSON.stringify(updated));
    return updated;
  },

  // --------------------------------------------------
  // CLASS MANAGEMENT & STUDENT ENROLLMENT
  // --------------------------------------------------
  getClasses: () => {
    try {
      const stored = localStorage.getItem('lms_classes_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    const defaultClasses = [
      { id: 'cls-8a1', name: 'Lớp 8A1', code: '8A1', grade: 8, schoolYear: '2025 - 2026', studentCount: 32, created_at: new Date().toLocaleDateString('vi-VN') },
      { id: 'cls-8a2', name: 'Lớp 8A2', code: '8A2', grade: 8, schoolYear: '2025 - 2026', studentCount: 28, created_at: new Date().toLocaleDateString('vi-VN') },
      { id: 'cls-9a1', name: 'Lớp 9A1', code: '9A1', grade: 9, schoolYear: '2025 - 2026', studentCount: 30, created_at: new Date().toLocaleDateString('vi-VN') }
    ];
    localStorage.setItem('lms_classes_v1', JSON.stringify(defaultClasses));
    return defaultClasses;
  },

  saveClass: (classData) => {
    const list = cmsStorage.getClasses();
    const idx = list.findIndex(c => c && (c.id === classData.id || c.code === classData.code));
    let updated = [];
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...classData };
      updated = [...list];
    } else {
      const newCls = {
        ...classData,
        id: classData.id || `cls-${Date.now()}`,
        studentCount: classData.studentCount || 0,
        created_at: new Date().toLocaleDateString('vi-VN')
      };
      updated = [newCls, ...list];
    }
    localStorage.setItem('lms_classes_v1', JSON.stringify(updated));
    return updated;
  },

  deleteClass: (classId) => {
    const list = cmsStorage.getClasses();
    const filtered = list.filter(c => c && c.id !== classId);
    localStorage.setItem('lms_classes_v1', JSON.stringify(filtered));
    return filtered;
  },

  assignWorkToClass: (assignmentId, classId, dueDate) => {
    const assignments = cmsStorage.getAssignments();
    const classes = cmsStorage.getClasses();
    const targetCls = classes.find(c => c && (c.id === classId || c.code === classId));
    const className = targetCls ? targetCls.name : classId;

    const idx = assignments.findIndex(a => a && a.id === assignmentId);
    if (idx >= 0) {
      assignments[idx] = {
        ...assignments[idx],
        targetClass: className,
        dueDate: dueDate || assignments[idx].dueDate,
        status: 'PUBLISHED'
      };
      localStorage.setItem('lms_assignments_v1', JSON.stringify(assignments));
    }
    return assignments;
  }
};
