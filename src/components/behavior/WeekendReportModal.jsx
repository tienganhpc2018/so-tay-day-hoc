import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Printer, 
  Crown, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Users, 
  TrendingUp, 
  Calendar,
  Send,
  Award,
  ShieldAlert,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

export const WeekendReportModal = ({
  isOpen,
  onClose,
  selectedClass = '8A5',
  students = []
}) => {
  if (!isOpen) return null;

  const [weekName, setWeekName] = useState('Tuần 4 (Tháng 9)');
  const [teacherNote, setTeacherNote] = useState(
    'Kính mời Quý Phụ huynh nhắc nhở các em chuẩn bị bài tập Tiếng Anh đầy đủ trước khi đến lớp và hoàn thành bài tập ôn luyện cuối tuần trên hệ thống Sổ Tay Dạy Học.'
  );
  const [copiedStatus, setCopiedStatus] = useState(false);
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'zalo'

  // Calculations & Analytics
  const totalStudents = students.length;
  const presentCount = students.filter(s => s.status === 'Present').length;
  const absentPermCount = students.filter(s => s.status === 'Absent_Perm').length;
  const absentNoPermCount = students.filter(s => s.status === 'Absent_NoPerm').length;
  const absentCount = absentPermCount + absentNoPermCount;

  // Top Hardworking Students (Sorted by plus_points descending)
  const topHardworking = [...students]
    .filter(s => s.plus_points > 0)
    .sort((a, b) => b.plus_points - a.plus_points)
    .slice(0, 5);

  // Students Needing Reminder (minus_points > 0 or Absent)
  const needingReminder = [...students]
    .filter(s => s.minus_points > 0 || s.status !== 'Present')
    .sort((a, b) => b.minus_points - a.minus_points);

  // Generate formatted text for Zalo / SMS
  const generateZaloReportText = () => {
    let report = `📢 BÁO CÁO NỀ NẾP & HỌC TẬP CUỐI TUẦN - LỚP ${selectedClass}\n`;
    report += `🗓️ Thời gian: ${weekName}\n`;
    report += `------------------------------------\n\n`;

    report += `📊 1. THỐNG KÊ CHUYÊN CẦN:\n`;
    report += `• Sĩ số lớp: ${totalStudents} học sinh\n`;
    report += `• Hiện diện học tập: ${presentCount} học sinh\n`;
    if (absentCount > 0) {
      report += `• Vắng mặt: ${absentCount} học sinh (${absentPermCount} có phép, ${absentNoPermCount} không phép)\n`;
    } else {
      report += `• Chuyên cần: 100% học sinh đi học đầy đủ! 🎉\n`;
    }
    report += `\n`;

    report += `🏆 2. TOP HỌC SINH CHĂM CHỈ & TIÊU BIỂU NHẤT TUẦN:\n`;
    if (topHardworking.length === 0) {
      report += `(Chưa có thống kê tuyên dương tuần này)\n`;
    } else {
      const medals = ['🥇', '🥈', '🥉', '⭐', '⭐'];
      topHardworking.forEach((st, idx) => {
        const medal = medals[idx] || '⭐';
        report += `${medal} Top ${idx + 1}: ${st.full_name} (+${st.plus_points} điểm thưởng)\n`;
      });
    }
    report += `\n`;

    report += `⚠️ 3. HỌC SINH CẦN PHỤ HUYNH PHỐI HỢP NHẮC NHỞ:\n`;
    if (needingReminder.length === 0) {
      report += `🎉 Tuyệt vời! Tuần này không có học sinh nào vi phạm nề nếp.\n`;
    } else {
      needingReminder.forEach((st) => {
        let reasonStr = [];
        if (st.minus_points > 0) reasonStr.push(`bị trừ ${st.minus_points} điểm nề nếp`);
        if (st.status === 'Absent_Perm') reasonStr.push('vắng mặt có phép');
        if (st.status === 'Absent_NoPerm') reasonStr.push('vắng mặt KHÔNG phép');
        report += `• ${st.full_name}: ${reasonStr.join(', ')}\n`;
      });
    }
    report += `\n`;

    if (teacherNote.trim()) {
      report += `📌 4. LỜI NHẮN TỪ GIÁO VIÊN CHỦ NHIỆM:\n`;
      report += `"${teacherNote.trim()}"\n\n`;
    }

    report += `Trân trọng cảm ơn Quý Phụ Huynh đã luôn đồng hành cùng Giáo viên và Nhà trường! ❤️`;
    return report;
  };

  const handleCopyZaloText = () => {
    soundFX.playClick();
    const text = generateZaloReportText();
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStatus(true);
      confetti({ particleCount: 80, spread: 60 });
      setTimeout(() => setCopiedStatus(false), 3000);
    });
  };

  const handlePrint = () => {
    soundFX.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-3xl max-w-4xl w-full p-6 space-y-6 shadow-2xl animate-fadeIn max-h-[92vh] flex flex-col text-slate-100 relative print:bg-white print:text-black print:border-none print:shadow-none print:max-h-none print:relative print:p-0">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                BÁO CÁO SỔ CHỦ NHIỆM CUỐI TUẦN 📊
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Lớp {selectedClass}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Tự động tổng hợp Top học sinh chăm chỉ nhất & học sinh vi phạm cần nhắc nhở để gửi cho Phụ huynh.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRINT HEADER ONLY VISIBLE WHEN PRINTING */}
        <div className="hidden print:block text-center space-y-2 mb-6">
          <h1 className="text-xl font-bold uppercase">BÁO CÁO NỀ NẾP & HỌC TẬP CUỐI TUẦN</h1>
          <p className="text-sm font-semibold">Lớp: {selectedClass} | {weekName}</p>
        </div>

        {/* SETTINGS BAR (WEEK & TEACHER NOTE INPUT) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 shrink-0 print:hidden">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> Chọn Tuần Báo Cáo:
            </label>
            <input
              type="text"
              value={weekName}
              onChange={(e) => setWeekName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
              placeholder="VD: Tuần 4 (Tháng 9)"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Ghi Chú / Lời Nhắn Dặn Dò Của GVCN:
            </label>
            <input
              type="text"
              value={teacherNote}
              onChange={(e) => setTeacherNote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-400"
              placeholder="Nhập dặn dò nộp quỹ, bài tập về nhà..."
            />
          </div>
        </div>

        {/* TAB TOGGLE: GIAO DIỆN XEM TRƯỚC vs FORMAT VĂN BẢN ZALO */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                activeTab === 'preview'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Giao Diện Báo Cáo Trực Quan
            </button>
            <button
              onClick={() => setActiveTab('zalo')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                activeTab === 'zalo'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Send className="w-4 h-4" /> Định Dạng Mẫu Gửi Zalo / SMS
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyZaloText}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 transition-transform active:scale-95"
            >
              <Copy className="w-4 h-4" />
              {copiedStatus ? '✓ ĐÃ COPY NỘI DUNG ZALO!' : 'Copy Gửi Phụ Huynh Zalo (1-Click)'}
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700"
            >
              <Printer className="w-4 h-4" /> In Báo Cáo (PDF)
            </button>
          </div>
        </div>

        {/* TAB CONTENT 1: VISUAL PREVIEW */}
        {activeTab === 'preview' && (
          <div className="flex-1 overflow-y-auto space-y-6 pr-1">
            
            {/* STATS OVERVIEW CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/50 space-y-1">
                <span className="text-[11px] font-bold text-indigo-400 uppercase flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Sĩ Số Lớp
                </span>
                <p className="text-2xl font-black text-white">{totalStudents} <span className="text-xs font-normal text-slate-400">học sinh</span></p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 space-y-1">
                <span className="text-[11px] font-bold text-emerald-400 uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Hiện Diện
                </span>
                <p className="text-2xl font-black text-emerald-300">{presentCount} <span className="text-xs font-normal text-slate-400">bạn</span></p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/50 space-y-1">
                <span className="text-[11px] font-bold text-amber-400 uppercase flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" /> Top Tuyên Dương
                </span>
                <p className="text-2xl font-black text-amber-300">{topHardworking.length} <span className="text-xs font-normal text-slate-400">bạn</span></p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/50 space-y-1">
                <span className="text-[11px] font-bold text-rose-400 uppercase flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Cần Nhắc Nhở
                </span>
                <p className="text-2xl font-black text-rose-300">{needingReminder.length} <span className="text-xs font-normal text-slate-400">bạn</span></p>
              </div>
            </div>

            {/* SECTION: TOP HARWORKING STUDENTS */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Crown className="w-4 h-4" /> 🏆 TOP HỌC SINH CHĂM CHỈ & XUẤT SẮC NHẤT TUẦN
              </h4>

              {topHardworking.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-950/40 text-center text-xs text-slate-400 border border-slate-800">
                  Chưa ghi nhận điểm cộng tuyên dương nào trong tuần này.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {topHardworking.map((st, idx) => {
                    const isTop1 = idx === 0;
                    const isTop2 = idx === 1;
                    const isTop3 = idx === 2;

                    return (
                      <div
                        key={st.id}
                        className={`p-4 rounded-2xl border transition-all flex items-center gap-3 relative overflow-hidden ${
                          isTop1
                            ? 'bg-gradient-to-r from-amber-950/80 to-yellow-900/40 border-amber-500/60 shadow-lg'
                            : isTop2
                            ? 'bg-gradient-to-r from-slate-800 to-slate-900 border-slate-400/50'
                            : isTop3
                            ? 'bg-gradient-to-r from-amber-950/40 to-slate-900 border-amber-700/40'
                            : 'bg-slate-950/60 border-slate-800'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={st.avatar}
                            alt={st.full_name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-md"
                          />
                          <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow">
                            #{idx + 1}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-black text-white truncate">{st.full_name}</h5>
                          <p className="text-[11px] text-amber-300 font-bold flex items-center gap-1 mt-0.5">
                            <Sparkles className="w-3 h-3 text-amber-400" /> +{st.plus_points} điểm thưởng
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SECTION: STUDENTS NEEDING REMINDER */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> ⚠️ CÁC BẠN VI PHẠM NỀ NẾP & CẦN GIA ĐÌNH NHẮC NHỞ
              </h4>

              {needingReminder.length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-950/30 text-center text-xs text-emerald-300 border border-emerald-800/40">
                  🎉 Tuyệt vời! Tuần này tất cả học sinh đều chấp hành nề nếp tốt, không có bạn nào bị nhắc nhở.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {needingReminder.map((st) => (
                    <div
                      key={st.id}
                      className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-800/40 flex items-center gap-3"
                    >
                      <img
                        src={st.avatar}
                        alt={st.full_name}
                        className="w-10 h-10 rounded-full object-cover border border-rose-500 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-black text-white truncate">{st.full_name}</h5>
                          {st.minus_points > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px]">
                              -{st.minus_points} điểm
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-rose-300 mt-0.5">
                          {st.status === 'Absent_Perm' && '• Vắng mặt có phép'}
                          {st.status === 'Absent_NoPerm' && '• Vắng mặt KHÔNG phép'}
                          {st.minus_points > 0 && ' • Cần nhắc nhở giữ nề nếp bài tập & trật tự'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TEACHER NOTE DISPLAY */}
            {teacherNote.trim() && (
              <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-700/50 space-y-1.5">
                <span className="text-xs font-black text-indigo-300 uppercase flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" /> LỜI NHẮN TỪ GIÁO VIÊN CHỦ NHIỆM:
                </span>
                <p className="text-xs text-slate-200 italic leading-relaxed">
                  "{teacherNote}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT 2: ZALO PREVIEW TEXTAREA */}
        {activeTab === 'zalo' && (
          <div className="flex-1 flex flex-col space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Đoạn văn bản báo cáo đã được định dạng sẵn Emoji chuẩn Zalo / Facebook / SMS:</span>
              <span className="text-amber-400 font-bold">Chỉ cần bấm "Copy" và Paste (Ctrl+V) vào nhóm Zalo Phụ Huynh</span>
            </div>

            <textarea
              readOnly
              value={generateZaloReportText()}
              className="flex-1 w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-emerald-500 resize-none min-h-[300px]"
            />
          </div>
        )}

        {/* MODAL FOOTER */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 shrink-0 print:hidden">
          <span className="text-xs text-slate-400 font-medium">
            💡 Gợi ý: Thầy/Cô có thể copy nội dung để gửi trực tiếp vào nhóm Zalo Phụ huynh lớp {selectedClass}.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
          >
            Đóng Cửa Sổ
          </button>
        </div>

      </div>
    </div>
  );
};
