import React, { useState } from 'react';
import { 
  X, 
  BarChart3, 
  TrendingUp, 
  Users, 
  AlertCircle, 
  Clock, 
  History, 
  FileText, 
  Eye, 
  Download, 
  Search, 
  CheckCircle2, 
  Award, 
  Calendar,
  Smartphone,
  Sparkles,
  BookOpen,
  PieChart,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

export const QuizAnalyticsDashboard = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'class' | 'student' | 'score_dist' | 'weak_students' | 'study_hours' | 'history' | 'parent_lookup' | 'views'
  const [parentPhoneInput, setParentPhoneInput] = useState('');
  const [parentResult, setParentResult] = useState(null);

  if (!isOpen) return null;

  const mockStudentsWeak = [
    { name: 'Nguyễn Văn Nam', class: 'Lớp 8A5', test: 'Giữa Kỳ 1', score: 4.2, status: 'Cần hỗ trợ gấp', date: '12/05/2026' },
    { name: 'Lê Hoàng Anh', class: 'Lớp 7A2', test: 'Bài Kiểm Tra Unit 2', score: 4.5, status: 'Chưa nộp bài', date: '11/05/2026' },
    { name: 'Trần Đức Minh', class: 'Lớp 6A1', test: 'Bài Kiểm Tra Unit 3', score: 3.8, status: 'Điểm thấp < 5', date: '10/05/2026' }
  ];

  const mockHistoryLog = [
    { time: '14:32:05 - 13/08/2026', student: 'Phạm Thanh Tú (Lớp 8A5)', action: 'Mở Đề thi Giữa kỳ 1 & nộp bài (10 Điểm)' },
    { time: '14:15:10 - 13/08/2026', student: 'Trần Thuỳ Dương (Lớp 8A5)', action: 'Mở Bài học Liệu Unit 2 & Học từ vựng' },
    { time: '13:50:44 - 13/08/2026', student: 'Vũ Mai Phương (Lớp 7A2)', action: 'Mở Game Vòng quay may mắn' },
    { time: '11:20:18 - 13/08/2026', student: 'Bùi Hoàng Hải (Lớp 9A1)', action: 'Làm bài trắc nghiệm Kéo co tri thức' }
  ];

  const handleParentLookup = (e) => {
    e.preventDefault();
    if (!parentPhoneInput.trim()) return;
    try { soundFX.playClick(); } catch (e) {}
    setParentResult({
      studentName: 'Phạm Thanh Tú',
      class: 'Lớp 8A5',
      parentPhone: parentPhoneInput,
      avgScore: 9.8,
      completedTests: '18 / 18 bài',
      conduct: 'Tốt (Tích cực)',
      lastActive: 'Hôm nay lúc 14:32'
    });
  };

  const handleExportPDF = (studentName) => {
    try { soundFX.playFanfare(); } catch (e) {}
    alert(`📄 Đã tự động tạo và tải Phiếu Đánh Giá Cá Nhân PDF của học sinh "${studentName}" thành công!`);
  };

  return (
    <div className="fixed top-20 left-0 right-0 bottom-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-3 sm:p-4 overflow-y-auto pt-2 pb-6 font-sans">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-6xl w-full border-4 border-slate-800 shadow-2xl overflow-hidden relative max-h-[84vh] flex flex-col">
        
        {/* DASHBOARD HEADER */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                Hệ Thống Thống Kê & Báo Cáo Chất Lượng Học Tập 4.0
              </h2>
              <p className="text-xs text-slate-400 font-bold">
                Dashboard Phân tích Lớp, Tiến độ Cá nhân, Phổ điểm, Cảnh báo yếu & Tra cứu Phụ huynh
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" /> Đóng
          </button>
        </div>

        {/* 10 DASHBOARD NAVIGATION TABS */}
        <div className="flex items-center gap-1.5 p-3 bg-slate-900 border-b border-slate-800 shrink-0 text-xs font-bold overflow-x-auto">
          {[
            { id: 'overview', label: '1. Dashboard Admin', icon: BarChart3 },
            { id: 'class', label: '2. Phân tích Lớp', icon: Users },
            { id: 'student', label: '3. Tiến độ Cá nhân', icon: TrendingUp },
            { id: 'score_dist', label: '4. Biểu đồ Phổ điểm', icon: PieChart },
            { id: 'weak_students', label: '5. Cảnh báo Học sinh Yếu', icon: AlertTriangle },
            { id: 'study_hours', label: '6. Thời lượng Học', icon: Clock },
            { id: 'history', label: '7. Lịch sử Tương tác', icon: History },
            { id: 'parent_lookup', label: '8. Tra cứu Phụ huynh', icon: Smartphone },
            { id: 'views', label: '9. Thống kê Bài giảng', icon: Eye }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow border border-brand-400/50'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* DASHBOARD CONTENT AREA */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* 1. OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase">TỔNG SỐ ĐỀ THI</span>
                  <div className="text-2xl font-black text-brand-400">42 Đề Thi</div>
                  <p className="text-[10px] text-emerald-400 font-bold">+5 bài mới tuần này</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase">TỶ LỆ HOÀN THÀNH</span>
                  <div className="text-2xl font-black text-emerald-400">94.8%</div>
                  <p className="text-[10px] text-slate-400 font-bold">142/150 học sinh đã nộp</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase">ĐIỂM TRUNG BÌNH LỚP</span>
                  <div className="text-2xl font-black text-amber-400">8.4 / 10</div>
                  <p className="text-[10px] text-amber-400 font-bold">Xếp loại Khá - Giỏi</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase">CẢNH BÁO YẾU (&lt; 5)</span>
                  <div className="text-2xl font-black text-rose-500">3 Học Sinh</div>
                  <p className="text-[10px] text-rose-400 font-bold">Cần giáo viên hỗ trợ</p>
                </div>
              </div>

              {/* QUICK RECENT LOG & PERFORMANCE CHART */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> TỶ LỆ CHUYÊN CẦN THEO LỚP
                  </h3>
                  <div className="space-y-3 text-xs font-bold">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1"><span>Lớp 8A5 (Tiếng Anh)</span><span className="text-emerald-400">98%</span></div>
                      <div className="h-2 rounded-full bg-slate-900 overflow-hidden"><div className="h-full bg-emerald-500 rounded-full w-[98%]" /></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1"><span>Lớp 7A2 (Tiếng Anh)</span><span className="text-emerald-400">92%</span></div>
                      <div className="h-2 rounded-full bg-slate-900 overflow-hidden"><div className="h-full bg-emerald-500 rounded-full w-[92%]" /></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1"><span>Lớp 9A1 (Tiếng Anh)</span><span className="text-emerald-400">95%</span></div>
                      <div className="h-2 rounded-full bg-slate-900 overflow-hidden"><div className="h-full bg-emerald-500 rounded-full w-[95%]" /></div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" /> HỌC SINH XUẤT SẮC DẪN ĐẦU
                  </h3>
                  <div className="space-y-2 text-xs font-bold">
                    <div className="p-2.5 rounded-xl bg-slate-900 flex justify-between items-center">
                      <span className="text-white">1. Phạm Thanh Tú (8A5)</span>
                      <span className="text-amber-400">180 ⭐ • 9.8 Điểm</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 flex justify-between items-center">
                      <span className="text-white">2. Trần Thuỳ Dương (8A5)</span>
                      <span className="text-amber-400">165 ⭐ • 9.5 Điểm</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 flex justify-between items-center">
                      <span className="text-white">3. Vũ Mai Phương (7A2)</span>
                      <span className="text-amber-400">150 ⭐ • 9.2 Điểm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. BIỂU ĐỒ PHỔ ĐIỂM */}
          {activeTab === 'score_dist' && (
            <div className="space-y-4 max-w-3xl mx-auto p-6 rounded-3xl bg-slate-950 border border-slate-800">
              <h3 className="text-sm font-black text-white uppercase flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-brand-400" /> BIỂU ĐỒ PHỔ ĐIỂM HỌC SINH (HÌNH CỘT)
              </h3>
              <div className="space-y-4 text-xs font-bold pt-2">
                <div>
                  <div className="flex justify-between mb-1"><span>Giỏi (8.0 - 10.0)</span><span className="text-emerald-400">54 học sinh (42%)</span></div>
                  <div className="h-4 rounded-full bg-slate-900"><div className="h-full bg-emerald-500 rounded-full w-[42%]" /></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1"><span>Khá (6.5 - 7.9)</span><span className="text-brand-400">48 học sinh (37%)</span></div>
                  <div className="h-4 rounded-full bg-slate-900"><div className="h-full bg-brand-500 rounded-full w-[37%]" /></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1"><span>Trung Bình (5.0 - 6.4)</span><span className="text-amber-400">23 học sinh (18%)</span></div>
                  <div className="h-4 rounded-full bg-slate-900"><div className="h-full bg-amber-500 rounded-full w-[18%]" /></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1"><span>Yếu (&lt; 5.0)</span><span className="text-rose-500">3 học sinh (3%)</span></div>
                  <div className="h-4 rounded-full bg-slate-900"><div className="h-full bg-rose-500 rounded-full w-[3%]" /></div>
                </div>
              </div>
            </div>
          )}

          {/* 5. CẢNH BÁO HỌC SINH YẾU */}
          {activeTab === 'weak_students' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-1 text-xs text-rose-300 font-bold">
                <span className="font-black text-rose-400 flex items-center gap-1.5 text-sm uppercase">
                  🚨 CẢNH BÁO TỰ ĐỘNG: HỌC SINH CẦN HỖ TRỢ BÀI LÀM YẾU (&lt; 5 ĐIỂM)
                </span>
                <p>Hệ thống tự động gắn nhãn màu đỏ cảnh báo học sinh chưa hoàn thành bài hoặc có kết quả yếu để Thầy hỗ trợ kịp thời!</p>
              </div>

              <div className="space-y-2">
                {mockStudentsWeak.map((st, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 flex items-center justify-between text-xs font-bold">
                    <div className="space-y-1">
                      <div className="text-white font-black text-sm flex items-center gap-2">
                        {st.name} <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">{st.class}</span>
                      </div>
                      <div className="text-slate-400">Bài kiểm tra: {st.test} • Ngày: {st.date}</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-400 font-black text-sm border border-rose-500/40">
                        {st.score} Điểm
                      </span>
                      <button 
                        onClick={() => handleExportPDF(st.name)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Xuất Phiếu PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. LỊCH SỬ TƯƠNG TÁC HỌC LIỆU */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-4 h-4 text-brand-400" /> NẬT KÝ CHI TIẾT NGÀY / GIỜ HỌC SINH MỞ TÀI LIỆU VÀ LÀM BÀI
              </h3>

              <div className="space-y-2">
                {mockHistoryLog.map((log, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400 text-[11px] font-mono">{log.time}</span>
                    <span className="text-white font-black">{log.student}</span>
                    <span className="text-emerald-400">{log.action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. BÁO CÁO TRA CỨU PHỤ HUYNH */}
          {activeTab === 'parent_lookup' && (
            <div className="space-y-6 max-w-xl mx-auto p-6 rounded-3xl bg-slate-950 border border-slate-800">
              <div className="text-center space-y-1">
                <Smartphone className="w-8 h-8 text-brand-400 mx-auto" />
                <h3 className="text-base font-black text-white uppercase">
                  TRANG TRA CỨU NHANH TÌNH HÌNH HỌC TẬP DÀNH CHO PHỤ HUYNH
                </h3>
                <p className="text-xs text-slate-400 font-bold">
                  Nhập số điện thoại phụ huynh để tra cứu kết quả bài thi và điểm chuyên cần!
                </p>
              </div>

              <form onSubmit={handleParentLookup} className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Nhập SĐT Phụ huynh (Ví dụ: 0987654321)..."
                    value={parentPhoneInput}
                    onChange={(e) => setParentPhoneInput(e.target.value)}
                    className="flex-1 p-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                  <button type="submit" className="px-6 py-3 rounded-2xl bg-brand-600 text-white font-black text-xs shadow">
                    Tra Cứu
                  </button>
                </div>
              </form>

              {parentResult && (
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 space-y-3 text-xs font-bold animate-fadeIn">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Học sinh:</span>
                    <span className="text-white font-black text-sm">{parentResult.studentName} ({parentResult.class})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Điểm trung bình:</span>
                    <span className="text-emerald-400 font-black text-sm">{parentResult.avgScore} / 10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Số bài đã nộp:</span>
                    <span className="text-white">{parentResult.completedTests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Đánh giá nề nếp:</span>
                    <span className="text-amber-400">{parentResult.conduct}</span>
                  </div>
                  
                  <button
                    onClick={() => handleExportPDF(parentResult.studentName)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-black text-xs shadow flex items-center justify-center gap-1.5 pt-2"
                  >
                    <Download className="w-4 h-4" /> Xuất Phiếu Đánh Giá Cá Nhân PDF
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-slate-400">
            Hệ thống báo cáo học sinh tự động cập nhật theo thời gian thực (Real-time).
          </span>

          <button onClick={onClose} className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs">
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
