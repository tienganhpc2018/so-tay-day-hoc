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

  // Get Article By ID
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
  }
};
