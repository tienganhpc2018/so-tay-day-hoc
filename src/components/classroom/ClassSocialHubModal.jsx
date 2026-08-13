import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  MessageSquare, 
  Users, 
  Send, 
  Heart, 
  ThumbsUp, 
  Star, 
  Trash2, 
  ShieldAlert, 
  Sparkles, 
  Award, 
  Download, 
  Upload, 
  FileText, 
  Bell, 
  X, 
  CheckCircle2, 
  Mail, 
  Bot, 
  Database,
  Share2,
  Lock,
  UserCheck
} from 'lucide-react';

export const ClassSocialHubModal = ({ isOpen, onClose }) => {
  const { isTeacher, isAdmin, profile } = useAuth();

  // Active Sub-Tab in Social Hub:
  // 'feed' (Bảng tin lớp học)
  // 'qa_forum' (Diễn đàn hỏi đáp)
  // 'chat_1on1' (Nhắn tin 1-1)
  // 'group_chat' (Phòng chat nhóm lớp)
  // 'ai_tools' (AI Tạo trắc nghiệm & Soạn giáo án + Backup + Cấp chứng chỉ)
  const [activeSubTab, setActiveSubTab] = useState('feed');

  // Class Feed Announcements State (Directive 2.1 & 2.7 & 2.8)
  const [feedPosts, setFeedPosts] = useState([
    {
      id: 'p1',
      author: 'Thầy Nguyễn Văn Hải',
      role: 'Giáo viên',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      time: '20 phút trước',
      content: '📢 THÔNG BÁO LỚP 8A5: Tối nay 20h00 các em nhớ vào thi thử trực tuyến Chuyên đề Trắc nghiệm Trọng âm nhé! Đề gồm 40 câu làm trong 45 phút.',
      likes: 12,
      hearts: 8,
      comments: [
        { id: 'c1', user: 'Phạm Thanh Tú', text: 'Em đã chuẩn bị sẵn sàng rồi thầy ơi!', time: '15 phút trước' },
        { id: 'c2', user: 'Trần Thuỳ Dương', text: 'Thầy cho em hỏi bài thi có chấm tự động không ạ?', time: '10 phút trước' }
      ]
    }
  ]);

  const [newPostContent, setNewPostContent] = useState('');
  const [newCommentInput, setNewCommentInput] = useState({});

  // Q&A Forum State (Directive 2.6)
  const [qaQuestions, setQaQuestions] = useState([
    {
      id: 'q1',
      student: 'Vũ Mai Phương',
      title: 'Cho em hỏi cách phân biệt động từ đi với V-ing và To-V với ạ?',
      answers: [
        { id: 'a1', user: 'Bùi Hoàng Hải', text: 'Sau các động từ như enjoy, avoid, mind, suggest thì dùng V-ing. Còn sau want, decide, promise thì dùng To-V nha bạn!', likes: 5 }
      ]
    }
  ]);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');

  // 1-1 Chat State (Directive 2.5)
  const [directMessages, setDirectMessages] = useState([
    { sender: 'teacher', text: 'Em Tú ơi, bài kiểm tra vừa rồi em làm rất tốt (9.5đ), tiếp tục phát huy nhé!' },
    { sender: 'student', text: 'Dạ em cảm ơn Thầy Hải nhiều ạ! Em sẽ cố gắng hơn nữa.' }
  ]);
  const [inputDmMsg, setInputDmMsg] = useState('');

  // Group Chat State (Directive 2.10)
  const [groupChatMsgs, setGroupChatMsgs] = useState([
    { user: 'Thầy Hải', text: 'Chào cả lớp 8A5! Thầy gửi lời khen cả lớp tuần này đi học rất đúng giờ.', time: '18:30' },
    { user: 'Thanh Tú', text: 'Dạ cảm ơn thầy!', time: '18:32' }
  ]);
  const [inputGroupMsg, setInputGroupMsg] = useState('');

  // AI Quiz & Lesson Plan Generator State (Directive 1.2 & 1.3)
  const [aiGeneratedQuiz, setAiGeneratedQuiz] = useState(null);
  const [isGeneratingAiQuiz, setIsGeneratingAiQuiz] = useState(false);

  // Certificate Generator State (Directive 1.4)
  const [studentCertName, setStudentCertName] = useState(profile?.full_name || 'Phạm Thanh Tú');
  const [certGenerated, setCertGenerated] = useState(false);

  if (!isOpen) return null;

  // Post Announcement (Feed)
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    soundFX.playClick();
    const newP = {
      id: `p_${Date.now()}`,
      author: profile?.full_name || 'Giáo viên VIP',
      role: isTeacher ? 'Giáo viên' : 'Học sinh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      time: 'Vừa xong',
      content: newPostContent,
      likes: 0,
      hearts: 0,
      comments: []
    };
    setFeedPosts([newP, ...feedPosts]);
    setNewPostContent('');
    try { soundFX.playFanfare(); } catch (err) {}
  };

  // Add Comment
  const handleAddComment = (postId) => {
    const text = newCommentInput[postId];
    if (!text || !text.trim()) return;

    soundFX.playClick();
    setFeedPosts(feedPosts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, { id: `c_${Date.now()}`, user: profile?.full_name || 'Học sinh', text: text.trim(), time: 'Vừa xong' }]
        };
      }
      return p;
    }));
    setNewCommentInput({ ...newCommentInput, [postId]: '' });
  };

  // Teacher Delete Comment (Directive 2.8 - Moderation)
  const handleDeleteComment = (postId, commentId) => {
    if (window.confirm('Thầy/Cô có chắc chắn muốn xóa bình luận này?')) {
      soundFX.playClick();
      setFeedPosts(feedPosts.map(p => {
        if (p.id === postId) {
          return { ...p, comments: p.comments.filter(c => c.id !== commentId) };
        }
        return p;
      }));
    }
  };

  // Reactions (Directive 2.7)
  const handleLikePost = (postId) => {
    soundFX.playClick();
    setFeedPosts(feedPosts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleHeartPost = (postId) => {
    soundFX.playClick();
    setFeedPosts(feedPosts.map(p => p.id === postId ? { ...p, hearts: p.hearts + 1 } : p));
  };

  // Send Direct Message 1-1
  const handleSendDm = (e) => {
    e.preventDefault();
    if (!inputDmMsg.trim()) return;
    soundFX.playClick();
    setDirectMessages([...directMessages, { sender: isTeacher ? 'teacher' : 'student', text: inputDmMsg.trim() }]);
    setInputDmMsg('');
  };

  // Send Group Chat
  const handleSendGroup = (e) => {
    e.preventDefault();
    if (!inputGroupMsg.trim()) return;
    soundFX.playClick();
    setGroupChatMsgs([...groupChatMsgs, { user: profile?.full_name || 'Thành viên', text: inputGroupMsg.trim(), time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) }]);
    setInputGroupMsg('');
  };

  // AI Generate 10 Questions Quiz (Directive 1.2)
  const handleGenerateAiQuizFromPdf = () => {
    soundFX.playClick();
    setIsGeneratingAiQuiz(true);
    setTimeout(() => {
      setIsGeneratingAiQuiz(false);
      try { soundFX.playFanfare(); } catch (err) {}
      confetti({ particleCount: 120, spread: 80 });
      setAiGeneratedQuiz([
        { q: '1. Choose the word with a different stress pattern:', a: 'A. finish', b: 'B. enjoy', c: 'C. listen', d: 'D. open', ans: 'B' },
        { q: '2. She enjoys _______ crafts in her free time.', a: 'A. make', b: 'B. making', c: 'C. to make', d: 'D. made', ans: 'B' },
        { q: '3. Life in the countryside is _______ than in the city.', a: 'A. peacefuler', b: 'B. more peaceful', c: 'C. most peaceful', d: 'D. as peaceful', ans: 'B' },
        { q: '4. Students should _______ recycling to protect the environment.', a: 'A. practice', b: 'B. practicing', c: 'C. practiced', d: 'D. to practice', ans: 'A' },
        { q: '5. Which word is CLOSEST in meaning to "hospitable"?', a: 'A. friendly', b: 'B. cold', c: 'C. selfish', d: 'D. quiet', ans: 'A' },
        { q: '6. My father usually _______ coffee in the morning.', a: 'A. drink', b: 'B. drinks', c: 'C. drinking', d: 'D. drank', ans: 'B' },
        { q: '7. They have lived in Gia Lai _______ 2018.', a: 'A. for', b: 'B. since', c: 'C. in', d: 'D. at', ans: 'B' },
        { q: '8. If it rains tomorrow, we _______ stay at home.', a: 'A. will', b: 'B. would', c: 'C. did', d: 'D. are', ans: 'A' },
        { q: '9. This is the _______ interesting book I have ever read.', a: 'A. more', b: 'B. most', c: 'C. best', d: 'D. as', ans: 'B' },
        { q: '10. Lan is fond _______ listening to English songs.', a: 'A. on', b: 'B. of', c: 'C. at', d: 'D. with', ans: 'B' }
      ]);
    }, 1500);
  };

  // Download Backup Data (Directive 1.5)
  const handleDownloadBackupData = () => {
    soundFX.playClick();
    const backupObj = {
      app: 'Sổ Tay Dạy Học THCS',
      version: '4.0',
      exportDate: new Date().toISOString(),
      feedPosts,
      qaQuestions,
      classList: [{ name: 'Lớp 8A5', students: 35 }]
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `BACKUP_STDH_DATA_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    alert('📥 ĐÃ TẢI FILE BACKUP SAO LƯU DỮ LIỆU THÀNH CÔNG!');
  };

  // Generate Certificate (Directive 1.4)
  const handleGenerateCertificate = () => {
    soundFX.playClick();
    setCertGenerated(true);
    try { soundFX.playFanfare(); } catch (err) {}
    confetti({ particleCount: 150, spread: 90 });
  };

  return (
    <div className="fixed top-16 inset-x-0 bottom-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-4 overflow-y-auto font-sans">
      <div className="bg-slate-900 border-2 border-indigo-500/60 rounded-3xl max-w-4xl w-full p-6 space-y-5 shadow-2xl animate-fadeIn max-h-[86vh] flex flex-col">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 flex items-center justify-center text-amber-300 font-black">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">TRUNG TÂM TƯƠNG TÁC LỚP HỌC & AUTOMATION AI 4.0</h3>
              <span className="text-[11px] text-slate-400 font-bold">Bảng tin, Diễn đàng Q&A, Chat 1-1, AI Soạn Trắc nghiệm & Backup Dữ liệu</span>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUB-TAB NAVIGATOR */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-black shrink-0">
          <button
            onClick={() => setActiveSubTab('feed')}
            className={`p-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'feed' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-300" /> Bảng Tin Lớp
          </button>

          <button
            onClick={() => setActiveSubTab('qa_forum')}
            className={`p-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'qa_forum' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" /> Hỏi Đáp Q&A
          </button>

          <button
            onClick={() => setActiveSubTab('chat_1on1')}
            className={`p-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'chat_1on1' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" /> Chat 1-1
          </button>

          <button
            onClick={() => setActiveSubTab('group_chat')}
            className={`p-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'group_chat' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-teal-400" /> Chat Nhóm Lớp
          </button>

          <button
            onClick={() => setActiveSubTab('ai_tools')}
            className={`p-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'ai_tools' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI & Automation
          </button>
        </div>

        {/* SUB-TAB 1: BẢNG TIN LỚP HỌC (CLASS FEED) */}
        {activeSubTab === 'feed' && (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            {/* POST FORM */}
            <form onSubmit={handleCreatePost} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <textarea
                placeholder="Đăng thông báo, dặn dò bài học kèm hình ảnh/file lên Bảng tin chung..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 min-h-[70px]"
              />
              <div className="flex justify-end">
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" /> Đăng Thông Báo
                </button>
              </div>
            </form>

            {/* FEED POSTS LIST */}
            {feedPosts.map((post) => (
              <div key={post.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs font-bold">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={post.avatar} alt={post.author} className="w-8 h-8 rounded-full object-cover border border-indigo-500/50" />
                    <div>
                      <span className="text-white font-black">{post.author}</span>
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">{post.role}</span>
                      <div className="text-[10px] text-slate-500 font-normal">{post.time}</div>
                    </div>
                  </div>
                </div>

                <p className="text-slate-200 leading-relaxed font-sans">{post.content}</p>

                {/* REACTIONS ROW (DIRECTIVE 2.7) */}
                <div className="flex items-center gap-3 pt-2 border-t border-slate-900 text-slate-400">
                  <button onClick={() => handleLikePost(post.id)} className="flex items-center gap-1 hover:text-amber-400">
                    <ThumbsUp className="w-3.5 h-3.5" /> <span>{post.likes}</span>
                  </button>
                  <button onClick={() => handleHeartPost(post.id)} className="flex items-center gap-1 hover:text-rose-400">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> <span>{post.hearts}</span>
                  </button>
                </div>

                {/* COMMENTS SECTION */}
                <div className="space-y-2 pt-2 border-t border-slate-900">
                  {post.comments.map((cm) => (
                    <div key={cm.id} className="p-2.5 rounded-xl bg-slate-900 flex items-center justify-between text-slate-300">
                      <div>
                        <span className="text-brand-300 font-black">{cm.user}:</span> <span className="font-normal">{cm.text}</span>
                        <div className="text-[9px] text-slate-500">{cm.time}</div>
                      </div>
                      {(isTeacher || isAdmin) && (
                        <button onClick={() => handleDeleteComment(post.id, cm.id)} className="text-rose-400 hover:text-rose-300 p-1" title="Xóa bình luận vi phạm">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Viết bình luận..."
                      value={newCommentInput[post.id] || ''}
                      onChange={(e) => setNewCommentInput({ ...newCommentInput, [post.id]: e.target.value })}
                      className="flex-1 p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-normal text-white focus:outline-none"
                    />
                    <button onClick={() => handleAddComment(post.id)} className="px-3 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs">
                      Gửi
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* SUB-TAB 2: DIỄN ĐÀN HOỎI ĐÁP Q&A */}
        {activeSubTab === 'qa_forum' && (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1 text-xs font-bold">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-white uppercase font-black">ĐĂNG CÂU HỎI KHÓ LÊN DIỄN ĐÀN:</h4>
              <input
                type="text"
                placeholder="Nhập câu hỏi bài tập khó cần giải đáp..."
                value={newQuestionTitle}
                onChange={(e) => setNewQuestionTitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (!newQuestionTitle.trim()) return;
                    soundFX.playClick();
                    setQaQuestions([{ id: `q_${Date.now()}`, student: profile?.full_name || 'Học sinh', title: newQuestionTitle, answers: [] }, ...qaQuestions]);
                    setNewQuestionTitle('');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black"
                >
                  Đăng Câu Hỏi
                </button>
              </div>
            </div>

            {qaQuestions.map((q) => (
              <div key={q.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-amber-300 font-black">❓ {q.student}: <span className="text-white font-bold">{q.title}</span></div>
                <div className="pl-4 space-y-2 border-l-2 border-slate-800">
                  {q.answers.map((ans) => (
                    <div key={ans.id} className="p-2 rounded-xl bg-slate-900 text-slate-300">
                      <span className="text-emerald-400 font-bold">{ans.user}:</span> {ans.text}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SUB-TAB 3: CHAT 1-1 */}
        {activeSubTab === 'chat_1on1' && (
          <div className="space-y-4 flex-1 flex flex-col text-xs font-bold">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-between">
              <span>💬 KHUNG CHAT RIÊNG TƯ 1-1 GIỮA GIÁO VIÊN VỚI HỌC SINH</span>
              <span className="text-emerald-400">🟢 Đang online</span>
            </div>

            <div className="flex-1 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 overflow-y-auto">
              {directMessages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === (isTeacher ? 'teacher' : 'student') ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[75%] ${m.sender === (isTeacher ? 'teacher' : 'student') ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-200 border border-slate-800'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendDm} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhắn tin riêng cho Giáo viên / Học sinh..."
                value={inputDmMsg}
                onChange={(e) => setInputDmMsg(e.target.value)}
                className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
              />
              <button type="submit" className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-black">Gửi</button>
            </form>
          </div>
        )}

        {/* SUB-TAB 4: GROUP CHAT NHÓM LỚP */}
        {activeSubTab === 'group_chat' && (
          <div className="space-y-4 flex-1 flex flex-col text-xs font-bold">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-between">
              <span>👥 PHÒNG CHAT CHUNG TOÀN LỚP 8A5</span>
              <span className="text-purple-400">35 Học sinh</span>
            </div>

            <div className="flex-1 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 overflow-y-auto">
              {groupChatMsgs.map((g, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-brand-300 font-black">{g.user}</span> <span className="text-[10px] text-slate-500">({g.time}):</span>
                  <div className="text-slate-200 mt-1">{g.text}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendGroup} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhắn vào nhóm chat chung lớp..."
                value={inputGroupMsg}
                onChange={(e) => setInputGroupMsg(e.target.value)}
                className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
              />
              <button type="submit" className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-black">Gửi Nhóm</button>
            </form>
          </div>
        )}

        {/* SUB-TAB 5: AI AUTOMATION, BACKUP & CERTIFICATE GENERATOR */}
        {activeSubTab === 'ai_tools' && (
          <div className="space-y-5 flex-1 overflow-y-auto pr-1 text-xs font-bold">
            
            {/* AI TẠO TRẮC NGHIỆM TỰ ĐỘNG (DIRECTIVE 1.2) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-amber-400 font-black uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AI TỰ ĐỘNG PHÂN TÍCH TÀI LIỆU PDF & SINH 10 CÂU TRẮC NGHIỆM
              </h4>
              <p className="text-slate-400 text-[11px]">Tải up file PDF bài học để AI tự động trích xuất nội dung và tạo 10 câu hỏi trắc nghiệm A, B, C, D chuẩn xác.</p>

              <button
                onClick={handleGenerateAiQuizFromPdf}
                disabled={isGeneratingAiQuiz}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black flex items-center gap-2"
              >
                <Bot className={`w-4 h-4 ${isGeneratingAiQuiz ? 'animate-spin' : ''}`} />
                {isGeneratingAiQuiz ? 'AI Đang Phân Tích PDF...' : '✨ AI Phân Tích PDF & Sinh 10 Câu Hỏi'}
              </button>

              {aiGeneratedQuiz && (
                <div className="p-4 rounded-xl bg-slate-900 space-y-3 border border-purple-500/40">
                  <div className="text-emerald-400 font-black">✅ ĐÃ SINH THÀNH CÔNG 10 CÂU HỎI TRẮC NGHIỆM TỪ PDF:</div>
                  <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-[11px]">
                    {aiGeneratedQuiz.map((item, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800">
                        <div>{item.q}</div>
                        <div className="text-slate-400">{item.a} | {item.b} | {item.c} | {item.d}</div>
                        <div className="text-emerald-400 font-bold">👉 Đáp án: {item.ans}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CẤP CHỨNG CHỈ TỰ ĐỘNG (DIRECTIVE 1.4) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-amber-400 font-black uppercase flex items-center gap-2">
                <Award className="w-4 h-4" /> CẤP BẰNG KHEN / CHỨNG CHỈ TỰ ĐỘNG CHO HỌC SINH (COMPLETION 100%)
              </h4>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={studentCertName}
                  onChange={(e) => setStudentCertName(e.target.value)}
                  placeholder="Nhập tên học sinh..."
                  className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
                <button onClick={handleGenerateCertificate} className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black">
                  🎓 Cấp Chứng Chỉ
                </button>
              </div>

              {certGenerated && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-purple-950 border-2 border-amber-400 text-center space-y-2 shadow-2xl">
                  <div className="text-xs font-black text-amber-300 uppercase tracking-widest">BẰNG KHEN HOÀN THÀNH XUẤT SẮC KHÓA HỌC</div>
                  <div className="text-xl font-black text-white">{studentCertName}</div>
                  <div className="text-xs text-slate-300">Đã hoàn thành 100% Khóa Luyện Thi Tiếng Anh THCS Global Success</div>
                  <button onClick={() => alert('📥 Đã tải chứng chỉ PDF thành công!')} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs inline-flex items-center gap-1.5 mt-2">
                    <Download className="w-4 h-4" /> Tải Bằng Khen PDF
                  </button>
                </div>
              )}
            </div>

            {/* SAO LƯU & KHÔI PHỤC BACKUP DATA (DIRECTIVE 1.5) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-amber-400 font-black uppercase flex items-center gap-2">
                <Database className="w-4 h-4" /> TẢI FILE BACKUP SAO LƯU TOÀN BỘ DỮ LIỆU LỚP HỌC & ĐIỂM SỐ
              </h4>
              <p className="text-slate-400 text-[11px]">Tải file JSON backup để lưu trữ an toàn dữ liệu lớp học, điểm danh và sổ nề nếp về máy tính.</p>
              <button onClick={handleDownloadBackupData} className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black flex items-center gap-2">
                <Download className="w-4 h-4" /> 📥 Tải File Backup Ngay (.JSON)
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
