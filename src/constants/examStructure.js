// CẤU TRÚC ĐỀ KIỂM TRA CHUẨN MÔN TIẾNG ANH THCS (KHỐI 6, 7, 8, 9)

export const EXAM_SECTIONS = [
  {
    code: 'A_LISTENING',
    title: 'A. LISTENING',
    instruction: 'Listen to the audio recordings and complete the tasks below.',
    defaultPoints: 2.5
  },
  {
    code: 'B_KNOWLEDGE',
    title: 'B. KNOWLEDGE OF LANGUAGE',
    instruction: 'Read the passages and choose the best option to fill in each blank.',
    defaultPoints: 2.5
  },
  {
    code: 'C_READING',
    title: 'C. READING',
    instruction: 'Read the passages carefully and answer the questions.',
    defaultPoints: 2.5
  },
  {
    code: 'D_WRITING',
    title: 'D. WRITING',
    instruction: 'Complete the writing parts below.',
    defaultPoints: 2.5
  }
];

export const EXAM_TYPES = [
  { value: 'thuong_xuyen', label: 'Kiểm tra thường xuyên' },
  { value: '15_min', label: 'Kiểm tra 15 phút' },
  { value: '45_min', label: 'Kiểm tra 1 tiết / 45 phút' },
  { value: 'giua_ky', label: 'Kiểm tra Giữa kỳ' },
  { value: 'cuoi_ky', label: 'Kiểm tra Cuối kỳ' }
];

export const TEXTBOOKS = [
  { value: 'global_success', label: 'Global Success' },
  { value: 'friends_plus', label: 'Friends Plus' },
  { value: 'ilearn_smart_world', label: 'i-Learn Smart World' },
  { value: 'other', label: 'Tùy chọn khác' }
];

export const TIME_LIMIT_OPTIONS = [15, 45, 60, 90];

export const DEFAULT_EXAM_METADATA = {
  school_name: 'THCS Nguyễn Du',
  academic_year: '2025-2026',
  subject: 'Tiếng Anh',
  grade_level: 8,
  class_name: '8A5',
  textbook: 'global_success',
  exam_type: 'giua_ky',
  time_limit_minutes: 60,
  exam_date: new Date().toISOString().split('T')[0],
  total_score: 10.0,
  general_instructions: 'Học sinh đọc kỹ hướng dẫn trước khi làm bài.',
  status: 'draft' // 'draft' | 'published' | 'closed'
};
