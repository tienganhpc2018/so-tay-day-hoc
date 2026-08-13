import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Clock, 
  Calendar, 
  Users, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Mic, 
  Upload, 
  Link2, 
  Download, 
  RotateCcw, 
  Grid, 
  FileSpreadsheet, 
  AlertTriangle,
  Award,
  Sparkles,
  BookOpen,
  Check,
  Play
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

export const AssignmentGradingModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('assign'); // 'assign' | 'submissions' | 'gradebook' | 'wrong_stats'
  
  // 1. Giao bài State
  const [assignTarget, setAssignTarget] = useState('all'); // 'all' | 'group' | 'individual'
  const [selectedGroup, setSelectedGroup] = useState('Nhom_Gioi');
  const [selectedStudent, setSelectedStudent] = useState('Nguyen_Van_Nam');
  const [deadlineDate, setDeadlineDate] = useState('2026-08-20T23:59');
  const [allowLate, setAllowLate] = useState(true);

  // 2. Chấm bài & Trả bài State
  const [selectedSub, setSelectedSub] = useState(null);
  const [scoreInput, setScoreInput] = useState('8.5');
  const [feedbackText, setFeedbackText] = useState('Em làm bài rất tốt, câu tự luận sáng tạo!');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);

  if (!isOpen) return null;

  const mockSubmissions = [
    {
      id: 'sub_1',
      studentName: 'Phạm Thanh Tú',
      class: 'Lớp 8A5',
      submitType: 'photo', // 'photo' | 'pdf' | 'canva' | 'text'
      submittedAt: '13/08/2026 14:32 (Đúng hạn)',
      autoScore: '10.0 (Trắc nghiệm)',
      essayContent: 'My favorite hobby is reading English books and joining community clean-up events...',
      fileUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=400&auto=format&fit=crop',
      status: 'graded',
      teacherScore: 9.8,
      teacherFeedback: 'Bài làm xuất sắc! Phát huy tốt từ vựng Unit 1 & 2.'
    },
    {
      id: 'sub_2',
      studentName: 'Nguyễn Văn Nam',
      class: 'Lớp 8A5',
      submitType: 'pdf',
      submittedAt: '13/08/2026 15:10 (🔴 Nộp trễ)',
      autoScore: '4.2 (Trắc nghiệm)',
      essayContent: 'File PDF bài tập viết tay 2 trang.',
      status: 'pending',
      teacherScore: '',
      teacherFeedback: ''
    },
    {
      id: 'sub_3',
      studentName: 'Lê Hoàng Anh',
      class: 'Lớp 7A2',
      submitType: 'canva',
      submittedAt: '13/08/2026 11:20 (Đúng hạn)',
      autoScore: '7.5 (Trắc nghiệm)',
      essayContent: 'https://canva.com/design/DAGX890/view',
      status: 'pending',
      teacherScore: '',
      teacherFeedback: ''
    }
  ];

  const mockGradebook = [
    { name: 'Phạm Thanh Tú', class: 'Lớp 8A5', giuaKy: 9.8, cuoiKy: 10.0, unit1: 9.5, unit2: 10.0, chuyenCan: '100%', avg: 9.8 },
    { name: 'Trần Thuỳ Dương', class: 'Lớp 8A5', giuaKy: 9.5, cuoiKy: 9.5, unit1: 9.0, unit2: 9.8, chuyenCan: '98%', avg: 9.5 },
    { name: 'Vũ Mai Phương', class: 'Lớp 7A2', giuaKy: 9.0, cuoiKy: 9.2, unit1: 9.2, unit2: 9.0, chuyenCan: '95%', avg: 9.1 },
    { name: 'Nguyễn Văn Nam', class: 'Lớp 8A5', giuaKy: 4.2, cuoiKy: 5.0, unit1: 4.5, unit2: 4.0, chuyenCan: '80%', avg: 4.4 }
  ];

  const mockWrongStats = [
    { qNum: 'Câu 4 (Khối 8 Unit 2)', text: 'She enjoys _____ (read) books.', wrongRate: '68% học sinh làm sai', mainError: 'Quên chia V-ing sau động từ enjoy' },
    { qNum: 'Câu 9 (Khối 8 Unit 3)', text: 'Which of the following is NOT a healthy habit?', wrongRate: '52% học sinh làm sai', mainError: 'Đọc thiếu từ phủ định NOT' }
  ];

  const handleSaveGrade = () => {
    try { soundFX.playFanfare(); } catch (e) {}
    confetti({ particleCount: 120, spread: 80 });
    alert(`✨ Đã chấm điểm ${scoreInput} điểm & trả bài kèm nhận xét giọng nói cho học sinh "${selectedSub?.studentName || 'Phạm Thanh Tú'}" thành công!`);
    setSelectedSub(null);
  };

  const handleRequestResubmit = () => {
    try { soundFX.playClick(); } catch (e) {}
    alert(`🔄 Đã gởi yêu cầu NỘP LẠI BÀI (Lần 2) tới học sinh "${selectedSub?.studentName}"!`);
  };

  const handleExportExcel = () => {
    try { soundFX.playFanfare(); } catch (e) {}
    alert('📊 Đã xuất Bảng Điểm Ma Trận (Gradebook) toàn bộ lớp ra file Excel (.xlsx) 1-Click thành công!');
  };

  return (
    <div className="fixed top-20 left-0 right-0 bottom-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-3 sm:p-4 overflow-y-auto pt-2 pb-6 font-sans">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-6xl w-full border-4 border-slate-800 shadow-2xl overflow-hidden relative max-h-[84vh] flex flex-col">
        
        {/* MODAL HEADER */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                Hệ Thống Giao Bài, Chấm Điểm & Trả Bài 4.0 (EVAL STUDIO)
              </h2>
              <p className="text-xs text-slate-400 font-bold">
                Giao bài linh hoạt, Hạn chót, Trình chấm tự luận kèm Voice, Sổ điểm ma trận & Xuất Excel 1-Click
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700">
            <X className="w-4 h-4" /> Đóng
          </button>
        </div>

        {/* TOP TAB NAVIGATION */}
        <div className="flex items-center gap-2 p-3 bg-slate-900 border-b border-slate-800 shrink-0 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('assign')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'assign' ? 'bg-brand-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <Send className="w-4 h-4" /> 1. Giao Bài & Hạn Chót (Deadline)
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'submissions' ? 'bg-brand-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" /> 2. Trình Chấm Bài & Trả Bài ({mockSubmissions.length})
          </button>

          <button
            onClick={() => setActiveTab('gradebook')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'gradebook' ? 'bg-brand-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" /> 3. Sổ Điểm Ma Trận & Xuất Excel
          </button>

          <button
            onClick={() => setActiveTab('wrong_stats')}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'wrong_stats' ? 'bg-brand-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> 4. Thống Kê Câu Làm Sai Nhiều
          </button>
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: GIAO BÀI LINH HOẠT & DEADLINE */}
          {activeTab === 'assign' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              {/* TARGET SELECTION */}
              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-brand-400" /> 1. CHỌN ĐỐI TƯỢNG GIAO BÀI (LINH HOẠT)
                </h4>

                <div className="grid grid-cols-3 gap-3 text-xs font-bold">
                  <button
                    onClick={() => setAssignTarget('all')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      assignTarget === 'all' ? 'bg-brand-600/90 text-white border-brand-400 shadow' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    🌐 Toàn Lớp (Tất cả HS)
                  </button>
                  <button
                    onClick={() => setAssignTarget('group')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      assignTarget === 'group' ? 'bg-brand-600/90 text-white border-brand-400 shadow' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    👥 Nhóm Cụ Thể
                  </button>
                  <button
                    onClick={() => setAssignTarget('individual')}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      assignTarget === 'individual' ? 'bg-brand-600/90 text-white border-brand-400 shadow' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    👤 Học Sinh Cá Biệt
                  </button>
                </div>

                {assignTarget === 'group' && (
                  <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-white">
                    <option value="Nhom_Gioi">Nhóm Học Sinh Khá - Giỏi</option>
                    <option value="Nhom_Yeu">Nhóm Học Sinh Cần Phụ Đạo</option>
                  </select>
                )}

                {assignTarget === 'individual' && (
                  <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-white">
                    <option value="Nguyen_Van_Nam">Nguyễn Văn Nam (Lớp 8A5)</option>
                    <option value="Le_Hoang_Anh">Lê Hoàng Anh (Lớp 7A2)</option>
                  </select>
                )}
              </div>

              {/* DEADLINE & LATE LOCK */}
              <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-xs font-black text-amber-400 uppercase flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> 2. CÀI ĐẶT HẠN CHÓT (DEADLINE) & KHÓA NỘP MUỘN
                </h4>

                <div className="space-y-2 text-xs font-bold">
                  <label className="text-slate-300">Chọn Hạn Chót Nộp Bài:</label>
                  <input
                    type="datetime-local"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-white"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-bold">
                  <span>Cho phép nộp muộn (Đánh dấu nhãn 🔴 "Nộp trễ")</span>
                  <input type="checkbox" checked={allowLate} onChange={(e) => setAllowLate(e.target.checked)} className="accent-brand-500 w-4 h-4" />
                </div>
              </div>

              <button
                onClick={() => {
                  try { soundFX.playFanfare(); } catch (e) {}
                  alert('🚀 Đã GIAO BÀI TẬP THÀNH CÔNG cho học sinh!');
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-xl"
              >
                🚀 XÁC NHẬN GIAO BÀI VỚI HẠN CHÓT
              </button>

            </div>
          )}

          {/* TAB 2: TRÌNH CHẤM BÀI & TRẢ BÀI */}
          {activeTab === 'submissions' && (
            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider">
                DANH SÁCH {mockSubmissions.length} BÀI THI HỌC SINH ĐÃ NỘP:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockSubmissions.map((sub) => (
                  <div key={sub.id} className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                    <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                      <div>
                        <div className="font-black text-white text-sm">{sub.studentName}</div>
                        <div className="text-slate-400">{sub.class} • {sub.submittedAt}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${sub.status === 'graded' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'}`}>
                        {sub.status === 'graded' ? 'Đã chấm điểm' : 'Chờ chấm'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-slate-400 font-bold">Chấm tự động: <span className="text-emerald-400 font-black">{sub.autoScore}</span></div>
                      <div className="text-slate-300 font-bold">Hình thức nộp: <span className="text-indigo-400 uppercase font-black">{sub.submitType}</span></div>
                    </div>

                    {/* SUBMISSION ATTACHMENT PREVIEW */}
                    {sub.submitType === 'photo' && (
                      <img src={sub.fileUrl} alt="Bài làm" className="w-full h-32 object-cover rounded-xl border border-slate-800" />
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          setSelectedSub(sub);
                          setScoreInput(sub.teacherScore ? String(sub.teacherScore) : '8.5');
                          setFeedbackText(sub.teacherFeedback || 'Em làm bài tốt!');
                        }}
                        className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow"
                      >
                        ✍️ Mở Trình Chấm Bài
                      </button>

                      <button
                        onClick={handleRequestResubmit}
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Nộp lại (Lần 2)
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* GRADING MODAL PANEL FOR TEACHER */}
              {selectedSub && (
                <div className="p-6 rounded-3xl bg-slate-950 border-2 border-brand-500 space-y-4 animate-fadeIn">
                  <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
                    ✍️ TRÌNH CHẤM BÀI CHO: <span className="text-brand-400">{selectedSub.studentName}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                    <div className="space-y-1">
                      <label className="text-slate-300">Nhập Điểm Chấm Tự Luận (0-10):</label>
                      <input
                        type="number"
                        step="0.1"
                        max="10"
                        min="0"
                        value={scoreInput}
                        onChange={(e) => setScoreInput(e.target.value)}
                        className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-700 text-sm font-black text-emerald-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300">Ghi Nhận Xét Cho Học Sinh:</label>
                      <input
                        type="text"
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200"
                      />
                    </div>
                  </div>

                  {/* VOICE NOTE RECORDING FEATURE */}
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Mic className="w-4 h-4 text-rose-500 animate-pulse" /> Đẩy nhận xét bằng giọng nói Voice Note (Nâng cao)
                    </span>
                    <button
                      onClick={() => {
                        setIsRecordingVoice(!isRecordingVoice);
                        if (!isRecordingVoice) {
                          setTimeout(() => setVoiceRecorded(true), 2000);
                        }
                      }}
                      className={`px-4 py-1.5 rounded-xl font-black ${isRecordingVoice ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-300'}`}
                    >
                      {isRecordingVoice ? '🔴 Đang thu âm Voice...' : voiceRecorded ? '✅ Đã lưu ghi chú Voice (2.5s)' : '🎙️ Ghi âm Voice'}
                    </button>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setSelectedSub(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">
                      Hủy
                    </button>
                    <button onClick={handleSaveGrade} className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs shadow flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> TRẢ BÀI & GỬI NHẬN XÉT
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SỔ ĐIỂM MA TRẬN (GRADEBOOK) & XUẤT EXCEL 1-CLICK */}
          {activeTab === 'gradebook' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                  <Grid className="w-4 h-4 text-emerald-400" /> BẢNG SỔ ĐIỂM MA TRẬN (GRADEBOOK) TOÀN LỚP
                </h4>

                <button
                  onClick={handleExportExcel}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-lg flex items-center gap-2 hover:scale-105 transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4" /> 1-Click Xuất Sổ Điểm Ra Excel (.xlsx)
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-black uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3">Học Sinh</th>
                      <th className="p-3">Lớp</th>
                      <th className="p-3">Giữa Kỳ 1</th>
                      <th className="p-3">Cuối Kỳ 1</th>
                      <th className="p-3">Unit 1</th>
                      <th className="p-3">Unit 2</th>
                      <th className="p-3">Chuyên Cần</th>
                      <th className="p-3">Điểm TB</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-bold text-slate-200">
                    {mockGradebook.map((st, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50">
                        <td className="p-3 font-black text-white">{st.name}</td>
                        <td className="p-3 text-slate-400">{st.class}</td>
                        <td className="p-3 text-emerald-400">{st.giuaKy}</td>
                        <td className="p-3 text-emerald-400">{st.cuoiKy}</td>
                        <td className="p-3 text-brand-400">{st.unit1}</td>
                        <td className="p-3 text-brand-400">{st.unit2}</td>
                        <td className="p-3 text-amber-400">{st.chuyenCan}</td>
                        <td className="p-3 font-black text-emerald-400 text-sm">{st.avg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: THỐNG KÊ CÂU LÀM SAI NHIỀU */}
          {activeTab === 'wrong_stats' && (
            <div className="space-y-4">
              <h4 className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" /> DANH SÁCH CÁC CÂU HỎI HỌC SINH LÀM SAI NHIỀU NHẤT DÙNG ĐỂ CHỮA BÀI
              </h4>

              <div className="space-y-3">
                {mockWrongStats.map((st, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-2 text-xs font-bold">
                    <div className="flex justify-between items-center text-rose-400 font-black">
                      <span>{st.qNum}</span>
                      <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40">{st.wrongRate}</span>
                    </div>
                    <div className="text-white text-sm font-black">{st.text}</div>
                    <div className="text-slate-400 italic">💡 Nguyên nhân sai phổ biến: {st.mainError}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-slate-400">
            Hệ thống Giao bài & Chấm điểm 4.0 sẵn sàng xuất báo cáo.
          </span>

          <button onClick={onClose} className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs">
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
