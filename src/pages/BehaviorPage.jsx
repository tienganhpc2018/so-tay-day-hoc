import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { DuckRaceGameCanvas } from '../components/behavior/DuckRaceGameCanvas';
import { 
  Users, 
  Dices, 
  PlusCircle, 
  MinusCircle, 
  Star, 
  Search, 
  ShieldCheck, 
  Calendar,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Award,
  Flame,
  UserCheck,
  Zap,
  Grid,
  X,
  Play,
  Copy,
  Gift,
  HelpCircle,
  Maximize2,
  Lock,
  Layers,
  Crown,
  Upload,
  Plus,
  Image as ImageIcon
} from 'lucide-react';

// PRESET AI PIXAR / ANIME AVATARS FOR SELECTION (DIRECTIVE BY THẦY)
const AI_PIXAR_AVATARS = [
  { id: 'ai-1', label: 'Cậu bé Pixar 3D', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
  { id: 'ai-2', label: 'Cô bé Anime VIP', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
  { id: 'ai-3', label: 'Thần đồng Tiếng Anh', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop' },
  { id: 'ai-4', label: 'Hiệu trưởng AI', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
  { id: 'ai-5', label: 'Học sinh Ưu tú', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
  { id: 'ai-6', label: 'Nữ sinh Năng động', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop' }
];

export const BehaviorPage = () => {
  const { isTeacher } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const yearParam = searchParams.get('year') || '2025-2026';

  const [selectedClass, setSelectedClass] = useState('9A6');
  const [academicYear, setAcademicYear] = useState(yearParam);
  const [avatarSize, setAvatarSize] = useState('normal');
  const [themeMode, setThemeMode] = useState('default');

  const [activeModal, setActiveModal] = useState(null); 
  // 'attendance' | 'reward_penalty' | 'group_division' | 'duck_race' | 'blind_bag' | 'seating_map' | 'timer' | 'avatar_picker' | 'announcement' | 'wheel' | 'teams'

  // Dynamic Roster State
  const [students, setStudents] = useState([
    { id: 'st-1', code: '384', full_name: 'Nguyễn Văn Anh', plus_points: 20, minus_points: 0, status: 'Present', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
    { id: 'st-2', code: '444', full_name: 'Lê Thị Trà Dáng', plus_points: 0, minus_points: 0, status: 'Present', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
    { id: 'st-3', code: '932', full_name: 'Nguyễn Thị Thùy Giang', plus_points: 20, minus_points: 0, status: 'Present', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop' },
    { id: 'st-4', code: '292', full_name: 'Phạm Thị Thu Hà', plus_points: 0, minus_points: 0, status: 'Present', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
    { id: 'st-5', code: '105', full_name: 'Đồng Nguyễn Xuân Yên', plus_points: 0, minus_points: 0, status: 'Present', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
    { id: 'st-6', code: '106', full_name: 'Võ Mai Sâm', plus_points: 15, minus_points: 0, status: 'Present', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop' },
    { id: 'st-7', code: '107', full_name: 'Trần Thị Phương Trinh', plus_points: 10, minus_points: 0, status: 'Absent_Perm', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop' },
    { id: 'st-8', code: '108', full_name: 'Nguyễn Thị Kim My', plus_points: 25, minus_points: 0, status: 'Present', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
    { id: 'st-9', code: '109', full_name: 'Huỳnh Thị Trà My', plus_points: 5, minus_points: 0, status: 'Present', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' }
  ]);

  // Active (Present) Students only
  const presentStudents = students.filter(s => s.status !== 'Absent_Perm' && s.status !== 'Absent_NoPerm');

  const [selectedStudentForReward, setSelectedStudentForReward] = useState(students[4]);
  const [rewardTab, setRewardTab] = useState('plus');

  // CUSTOM CRITERIA PRESETS (DIRECTIVE BY THẦY)
  const [plusCriteriaList, setPlusCriteriaList] = useState([
    { id: 'p1', name: 'Phát biểu bài', points: 5 },
    { id: 'p2', name: 'Giúp đỡ bạn', points: 4 },
    { id: 'p3', name: 'Làm bài tập về nhà', points: 2 },
    { id: 'p4', name: 'Hát Tiếng Anh hay', points: 5 }
  ]);

  const [minusCriteriaList, setMinusCriteriaList] = useState([
    { id: 'm1', name: 'Không làm bài', points: 5 },
    { id: 'm2', name: 'Mất trật tự', points: 4 },
    { id: 'm3', name: 'Đi học trễ', points: 2 },
    { id: 'm4', name: 'Nói chuyện riêng', points: 3 }
  ]);

  const [showAddCriteriaModal, setShowAddCriteriaModal] = useState(false);
  const [newCriteriaName, setNewCriteriaName] = useState('');
  const [newCriteriaPoints, setNewCriteriaPoints] = useState(5);

  // CENTERED ANNOUNCEMENT POPUP STATE (NO MORE BROWSER ALERTS - DIRECTIVE BY THẦY)
  const [announcementData, setAnnouncementData] = useState(null);

  // Group Division State
  const [numGroups, setNumGroups] = useState(3);
  const [studentsPerGroup, setStudentsPerGroup] = useState(3);
  const [showImagesInGroup, setShowImagesInGroup] = useState(true);
  const [groupedStudents, setGroupedStudents] = useState([]);
  const [selectedRepresentative, setSelectedRepresentative] = useState(null);

  // Timer Stopwatch State
  const [stopwatchSeconds, setStopwatchSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Blind Bag State
  const [blindBagResult, setBlindBagResult] = useState(null);

  // Show Centered In-App Announcement Modal (No Browser Alerts)
  const triggerAnnouncement = (title, message, winner = null) => {
    try { soundFX.playFanfare(); } catch (err) {}
    confetti({ particleCount: 120, spread: 80 });
    setAnnouncementData({ title, message, winner });
    setActiveModal('announcement');
  };

  // Add Custom Criterion Function
  const handleAddCriteria = (e) => {
    e.preventDefault();
    if (!newCriteriaName.trim()) return;

    soundFX.playClick();
    const newCrit = {
      id: `crit_${Date.now()}`,
      name: newCriteriaName,
      points: Number(newCriteriaPoints)
    };

    if (rewardTab === 'plus') {
      setPlusCriteriaList([...plusCriteriaList, newCrit]);
    } else {
      setMinusCriteriaList([...minusCriteriaList, newCrit]);
    }

    setNewCriteriaName('');
    setShowAddCriteriaModal(false);
    triggerAnnouncement('✨ ĐÃ THÊM TIÊU CHÍ MỚI', `Thêm tiêu chí "${newCriteriaName}" (${newCriteriaPoints} điểm) thành công!`);
  };

  // Change Student Avatar (AI Gallery or Upload)
  const handleUpdateStudentAvatar = (avatarUrl) => {
    soundFX.playClick();
    if (!selectedStudentForReward) return;

    setStudents(prev => prev.map(s => s.id === selectedStudentForReward.id ? { ...s, avatar: avatarUrl } : s));
    setSelectedStudentForReward({ ...selectedStudentForReward, avatar: avatarUrl });
    setActiveModal('reward_penalty');
    triggerAnnouncement('🖼️ ĐÃ CẬP NHẬT ANH ĐẠI DIỆN', `Thay đổi ảnh đại diện AI Pixar cho ${selectedStudentForReward.full_name} thành công!`);
  };

  // Auto-Group Division Function (Present Students Only)
  const handleDivideGroups = () => {
    soundFX.playClick();
    const shuffled = [...presentStudents].sort(() => 0.5 - Math.random());
    const groups = [];
    for (let i = 0; i < numGroups; i++) {
      groups.push({
        id: i + 1,
        name: `Nhóm ${i + 1}`,
        members: shuffled.slice(i * studentsPerGroup, (i + 1) * studentsPerGroup)
      });
    }
    setGroupedStudents(groups);
    setSelectedRepresentative(null);
    try { soundFX.playFanfare(); } catch (err) {}
    confetti({ particleCount: 100, spread: 70 });
  };

  // Pick Random Representative from Groups
  const handlePickRepresentative = () => {
    soundFX.playClick();
    if (groupedStudents.length === 0) handleDivideGroups();

    const allMembers = groupedStudents.flatMap(g => g.members);
    if (allMembers.length === 0) return;

    const winner = allMembers[Math.floor(Math.random() * allMembers.length)];
    setSelectedRepresentative(winner);
    triggerAnnouncement('🎯 CHỌN ĐẠI DIỆN TRÌNH BÀY', `Đã chọn ngẫu nhiên đại diện nhóm: ${winner.full_name}!`, winner);
  };

  // Pick 1 Random Student
  const handlePickOne = () => {
    if (presentStudents.length === 0) {
      triggerAnnouncement('❌ THÔNG BÁO', 'Tất cả học sinh đều đã vắng mặt!');
      return;
    }
    soundFX.playClick();
    const winner = presentStudents[Math.floor(Math.random() * presentStudents.length)];
    setSelectedStudentForReward(winner);
    triggerAnnouncement('🎯 GỌI TÊN NGẪU NHIÊN 1 HỌC SINH', `Xin mời học sinh: ${winner.full_name} (Mã: ${winner.code}) lên bảng!`, winner);
  };

  // Pick Multiple Random Students
  const handlePickMultiple = () => {
    if (presentStudents.length === 0) {
      triggerAnnouncement('❌ THÔNG BÁO', 'Tất cả học sinh đều đã vắng mặt!');
      return;
    }
    soundFX.playClick();
    const shuffled = [...presentStudents].sort(() => 0.5 - Math.random()).slice(0, 3);
    triggerAnnouncement('🎯 GỌI TÊN NGẪU NHIÊN 3 HỌC SINH', `Xin mời 3 học sinh có tên sau lên bảng: ${shuffled.map(s => s.full_name).join(', ')}!`);
  };

  // Grant Reward Points
  const handleApplyPoints = (points, reason) => {
    soundFX.playClick();
    if (!selectedStudentForReward) return;

    setStudents(prev => prev.map(s => {
      if (s.id === selectedStudentForReward.id) {
        return {
          ...s,
          plus_points: rewardTab === 'plus' ? s.plus_points + points : s.plus_points,
          minus_points: rewardTab === 'minus' ? s.minus_points + points : s.minus_points
        };
      }
      return s;
    }));

    triggerAnnouncement(
      `✨ ĐÃ ${rewardTab === 'plus' ? 'CỘNG' : 'TRỪ'} ${points} ĐIỂM NỀ NẾP`,
      `Cập nhật điểm cho học sinh ${selectedStudentForReward.full_name}. Lý do: ${reason}`,
      selectedStudentForReward
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* HERO BANNER */}
      <PageHeroBanner
        title={`Sổ Nề Nếp & Quản Lý Lớp Chủ Nhiệm (${academicYear}) 📋`}
        subtitle={`Điểm danh thời gian thực, Thêm tiêu chí Thưởng/Phạt linh hoạt, Chọn Avatar AI Pixar & Đua Vịt Duck Race 00:00:12 Lớp ${selectedClass}.`}
        badge={`QUẢN LÝ LỚP CHỦ NHIỆM • LỚP ${selectedClass}`}
        bgImage="/images/hero_library_bg.jpg"
      />

      {/* 1. TOP TOOL ACTION PILLS BAR (MATCHING SCREENSHOT 1 100%) */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4" /> BẢNG THAO TÁC QUẢN LÝ NỀ NẾP & LỚP HỌC 4.0
          </span>
          <span className="text-xs font-bold text-slate-400">
            Sĩ số: <strong>{students.length} Học Sinh</strong> (Có mặt: <strong className="text-emerald-400">{presentStudents.length}</strong>, Vắng: <strong className="text-rose-400">{students.length - presentStudents.length}</strong>)
          </span>
        </div>

        {/* PILLS ROW MATCHING SCREENSHOT 1 */}
        <div className="flex flex-wrap gap-2 text-xs font-black">
          
          <button
            onClick={() => {
              setAvatarSize(avatarSize === 'normal' ? 'large' : 'normal');
              triggerAnnouncement('🔍 ĐỔI KÍCH THƯỚC AVATAR', `Đã chuyển sang chế độ hiển thị avatar ${avatarSize === 'normal' ? 'LỚN' : 'CHUẨN'}!`);
            }}
            className="px-4 py-2 rounded-full border border-rose-500 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20"
          >
            Hiển Thị To/Nhỏ
          </button>

          <button
            onClick={() => { soundFX.playClick(); setActiveModal('attendance'); }}
            className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" /> Điểm Danh
          </button>

          <button
            onClick={() => { soundFX.playClick(); setActiveModal('reward_penalty'); }}
            className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg"
          >
            Danh Sách & Cho Điểm
          </button>

          <button
            onClick={() => {
              setThemeMode(themeMode === 'default' ? 'tet' : 'default');
              triggerAnnouncement('🌸 CHẾ ĐỘ PHONG BÌ TẾT', 'Đã bật không khí Tết Nguyên Đán rực rỡ!');
            }}
            className="px-4 py-2 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 shadow"
          >
            Tết 🌸
          </button>

          <button
            onClick={() => { soundFX.playClick(); setActiveModal('wheel'); }}
            className="px-4 py-2 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 shadow"
          >
            Vòng Quay
          </button>

          <button
            onClick={handlePickOne}
            className="px-4 py-2 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 shadow"
          >
            Gọi 1
          </button>

          <button
            onClick={() => { soundFX.playClick(); setActiveModal('duck_race'); }}
            className="px-4 py-2 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 shadow"
          >
            Cá
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              const gifts = ['+10 XP Bonus', 'Thẻ Khung Rồng Vàng', 'Tuyên Dương Trước Lớp', '+5 Điểm Thưởng'];
              setBlindBagResult(gifts[Math.floor(Math.random() * gifts.length)]);
              setActiveModal('blind_bag');
            }}
            className="px-4 py-2 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 shadow"
          >
            Túi Mù 1
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              const gifts = ['Voucher Miễn Bài Tập', '+20 XP', 'Trưởng Nhóm Học Tập'];
              setBlindBagResult(gifts[Math.floor(Math.random() * gifts.length)]);
              setActiveModal('blind_bag');
            }}
            className="px-4 py-2 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 shadow"
          >
            Túi Mù 2
          </button>

          <button
            onClick={handlePickMultiple}
            className="px-4 py-2 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 shadow"
          >
            Gọi Nhiều
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              handleDivideGroups();
              setActiveModal('group_division');
            }}
            className="px-4 py-2 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 shadow"
          >
            Chia Nhóm
          </button>

          <button
            onClick={() => { soundFX.playClick(); setActiveModal('duck_race'); }}
            className="px-4 py-2 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 shadow animate-pulse"
          >
            Bee Race (Đua Vịt) 🐥
          </button>

          <button
            onClick={() => { soundFX.playClick(); setActiveModal('teams'); }}
            className="px-4 py-2 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 shadow"
          >
            Tổ
          </button>

          <button
            onClick={() => { soundFX.playClick(); setActiveModal('timer'); }}
            className="px-4 py-2 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 shadow"
          >
            Bấm Giờ ⏱️
          </button>

          <button
            onClick={() => {
              triggerAnnouncement('✅ CHỌN TẤT CẢ HỌC SINH', `Đã chọn tất cả ${presentStudents.length} học sinh có mặt trong lớp!`);
            }}
            className="px-4 py-2 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 shadow"
          >
            Chọn Tất Cả
          </button>

          <button
            onClick={() => { soundFX.playClick(); setActiveModal('seating_map'); }}
            className="px-4 py-2 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 shadow"
          >
            Sơ Đồ Lớp 🏫
          </button>

        </div>
      </div>

      {/* MAIN STUDENT CARDS GRID */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" /> DANH SÁCH HỌC SINH LỚP {selectedClass} ({academicYear})
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {students.map((st) => {
            const isAbsent = st.status === 'Absent_Perm' || st.status === 'Absent_NoPerm';
            return (
              <div
                key={st.id}
                onClick={() => {
                  if (isAbsent) {
                    triggerAnnouncement('⚠️ HỌC SINH VẮNG MẶT', `Học sinh ${st.full_name} đã vắng mặt hôm nay (bôi đỏ), không thể cộng điểm!`);
                    return;
                  }
                  soundFX.playClick();
                  setSelectedStudentForReward(st);
                  setActiveModal('reward_penalty');
                }}
                className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-xl flex flex-col items-center text-center space-y-3 group ${
                  isAbsent
                    ? 'bg-rose-950/80 border-rose-600 text-rose-300 opacity-60 cursor-not-allowed'
                    : 'bg-slate-900 border-slate-800 hover:border-amber-500/50 text-white'
                }`}
              >
                <div className={`relative rounded-full overflow-hidden border-2 shadow-md ${isAbsent ? 'border-rose-600 grayscale' : 'border-amber-400'} ${avatarSize === 'large' ? 'w-24 h-24' : 'w-16 h-16'}`}>
                  <img src={st.avatar} alt={st.full_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold">Mã: {st.code}</span>
                  <h4 className="text-xs font-black line-clamp-1">{st.full_name}</h4>
                  {isAbsent && <span className="text-[10px] font-black text-rose-400 block mt-0.5">[ VẮNG MẶT ]</span>}
                </div>

                <div className="flex items-center gap-2 text-[11px] font-black">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    +{st.plus_points}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    -{st.minus_points}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: HOMEROOM REWARD & PENALTY DIALOG WITH CUSTOM CRITERIA & AI AVATAR (MATCHING SCREENSHOT 1 100%) */}
      {activeModal === 'reward_penalty' && selectedStudentForReward && (
        <div className="fixed top-16 inset-x-0 bottom-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl animate-fadeIn font-sans">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* LEFT CARD: STUDENT PROFILE & AVATAR PICKER TRIGGER */}
              <div className="md:col-span-5 p-5 rounded-3xl border border-slate-200 shadow-lg bg-white flex flex-col items-center justify-between text-center space-y-4">
                <h3 className="text-base font-black text-slate-900">{selectedStudentForReward.full_name}</h3>

                <div
                  onClick={() => setActiveModal('avatar_picker')}
                  className="relative cursor-pointer group"
                  title="Click để đổi ảnh đại diện AI Pixar / Tải ảnh mới"
                >
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-amber-400 shadow-xl group-hover:scale-105 transition-transform">
                    <img src={selectedStudentForReward.avatar} alt={selectedStudentForReward.full_name} className="w-full h-full object-cover" />
                  </div>

                  <span className="absolute top-0 left-0 w-8 h-8 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shadow">
                    {selectedStudentForReward.plus_points}
                  </span>
                  <span className="absolute top-0 right-0 w-8 h-8 rounded-full bg-purple-900 text-white font-black text-xs flex items-center justify-center shadow">
                    {selectedStudentForReward.minus_points}
                  </span>

                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/70 text-white text-[9px] font-bold py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    Đổi Ảnh AI
                  </span>
                </div>

                <button onClick={() => setActiveModal('avatar_picker')} className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" /> Đổi Ảnh AI Pixar / Tải Ảnh
                </button>
                <span className="text-[11px] text-slate-500">[Chọn Danh sách]</span>

                <button
                  onClick={handlePickOne}
                  className="w-full py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg"
                >
                  Chọn Ngẫu Nhiên
                </button>
              </div>

              {/* RIGHT CARD: POINT CATEGORIES & DYNAMIC CRITERIA PRESETS (DIRECTIVE BY THẦY) */}
              <div className="md:col-span-7 space-y-4">
                
                <div className="p-1 rounded-2xl bg-blue-600 flex items-center gap-2">
                  <button
                    onClick={() => setRewardTab('plus')}
                    className={`flex-1 py-2 rounded-xl font-black text-xs transition-all ${
                      rewardTab === 'plus' ? 'bg-rose-600 text-white shadow' : 'text-slate-100 hover:bg-blue-700'
                    }`}
                  >
                    Điểm THƯỞNG
                  </button>

                  <button
                    onClick={() => setRewardTab('minus')}
                    className={`flex-1 py-2 rounded-xl font-black text-xs transition-all ${
                      rewardTab === 'minus' ? 'bg-purple-900 text-white shadow' : 'text-slate-100 hover:bg-blue-700'
                    }`}
                  >
                    - Điểm PHẠT
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-rose-600 font-bold">
                    Thầy cô bấm chọn tiêu chí khen/phạt bên dưới để cho điểm:
                  </p>

                  <button
                    onClick={() => setShowAddCriteriaModal(true)}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] flex items-center gap-1 shadow"
                  >
                    <Plus className="w-3 h-3" /> + Thêm Tiêu Chí
                  </button>
                </div>

                {/* DYNAMIC CRITERIA PRESETS (DIRECTIVE BY THẦY) */}
                <div className="grid grid-cols-3 gap-2.5 text-center text-xs font-bold pt-1 max-h-48 overflow-y-auto">
                  {(rewardTab === 'plus' ? plusCriteriaList : minusCriteriaList).map((crit) => (
                    <button
                      key={crit.id}
                      onClick={() => handleApplyPoints(crit.points, crit.name)}
                      className="p-2.5 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 flex flex-col items-center gap-1 group shadow-sm transition-all"
                    >
                      <span className={`w-7 h-7 rounded-full text-white font-black text-xs flex items-center justify-center shadow ${
                        rewardTab === 'plus' ? 'bg-rose-600' : 'bg-purple-900'
                      }`}>
                        {rewardTab === 'plus' ? `+${crit.points}` : `-${crit.points}`}
                      </span>
                      <span className="text-slate-800 text-[10px] line-clamp-1">{crit.name}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 pt-2">
                  <input type="checkbox" id="extra_pts" className="rounded text-rose-600" />
                  <label htmlFor="extra_pts">Điểm Cộng/Trừ đột xuất hoặc thu hồi</label>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button onClick={() => handleApplyPoints(5, 'Cộng điểm thưởng chung')} className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow">
                Cộng Điểm
              </button>
              <button onClick={() => setActiveModal('attendance')} className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow">
                Điểm Hôm Nay
              </button>
              <button onClick={() => setActiveModal(null)} className="px-5 py-2 rounded-full border border-rose-600 text-rose-600 hover:bg-rose-50 font-black text-xs">
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FORM MODAL: ADD CUSTOM CRITERIA (DIRECTIVE BY THẦY) */}
      {showAddCriteriaModal && (
        <div className="fixed top-20 inset-x-0 bottom-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-6 font-sans">
          <div className="bg-slate-900 border-2 border-indigo-500 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs font-bold text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white uppercase">THÊM TIÊU CHÍ KHEN THƯỞNG / PHẠT MỚI</h3>
              <button onClick={() => setShowAddCriteriaModal(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCriteria} className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1">TÊN TIÊU CHÍ *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hát Tiếng Anh hay, Đi trực nhật muộn..."
                  value={newCriteriaName}
                  onChange={(e) => setNewCriteriaName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">SỐ ĐIỂM ({rewardTab === 'plus' ? 'CỘNG' : 'TRỪ'}) *</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newCriteriaPoints}
                  onChange={(e) => setNewCriteriaPoints(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddCriteriaModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                  Hủy
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-black">
                  + Lưu Tiêu Chí Mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AVATAR SELECTOR MODAL (AI PIXAR / UPLOAD CUSTOM IMAGE - DIRECTIVE BY THẦY) */}
      {activeModal === 'avatar_picker' && selectedStudentForReward && (
        <div className="fixed top-16 inset-x-0 bottom-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-6 font-sans">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-xs font-bold text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-amber-400 uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> KHO AVATAR AI PIXAR & TẢI ẢNH ĐẠI DIỆN MỚI
              </h3>
              <button onClick={() => setActiveModal('reward_penalty')} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-300">
              Chọn nhân vật hoạt hình 3D Pixar AI tạo sẵn hoặc tải ảnh mới từ máy cho <strong>{selectedStudentForReward.full_name}</strong>:
            </p>

            <div className="grid grid-cols-3 gap-3">
              {AI_PIXAR_AVATARS.map((av) => (
                <div
                  key={av.id}
                  onClick={() => handleUpdateStudentAvatar(av.url)}
                  className="p-2 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 cursor-pointer flex flex-col items-center text-center space-y-1.5 group transition-all"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 group-hover:scale-110 transition-transform">
                    <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] text-slate-300 font-bold">{av.label}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer flex items-center gap-1.5">
                <Upload className="w-4 h-4" /> Tải Ảnh Mới Từ Máy
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const url = URL.createObjectURL(e.target.files[0]);
                      handleUpdateStudentAvatar(url);
                    }
                  }}
                  className="hidden"
                />
              </label>

              <button onClick={() => setActiveModal('reward_penalty')} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                Quay Lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CENTERED ANNOUNCEMENT POPUP MODAL (REPLACES ALL BROWSER ALERTS - DIRECTIVE BY THẦY) */}
      {activeModal === 'announcement' && announcementData && (
        <div className="fixed top-16 inset-x-0 bottom-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-10 font-sans">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-center animate-fadeIn">
            
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-amber-400 uppercase tracking-wider">{announcementData.title}</h3>
              <p className="text-xs text-slate-200 leading-relaxed font-bold">{announcementData.message}</p>
            </div>

            {announcementData.winner && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400">
                  <img src={announcementData.winner.avatar} alt={announcementData.winner.full_name} className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-white">{announcementData.winner.full_name}</h4>
                  <span className="text-[10px] text-amber-400 font-bold">Mã HS: {announcementData.winner.code}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg"
            >
              ĐÃ HIỂU & ĐÓNG THÔNG BÁO
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: DAILY ATTENDANCE TABLE */}
      {activeModal === 'attendance' && (
        <div className="fixed top-16 inset-x-0 bottom-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-5xl w-full p-6 space-y-5 shadow-2xl animate-fadeIn max-h-[88vh] flex flex-col font-sans">
            <div className="text-center space-y-3 shrink-0">
              <h2 className="text-2xl font-black text-slate-900">Điểm Danh Hôm Nay 13/08/2026 - Lớp {selectedClass}</h2>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => triggerAnnouncement('🎉 BẢNG ĐIỂM DANH', 'Đã lưu điểm danh hôm nay thành công!')} className="px-6 py-2.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md">
                  Tạo Điểm Danh Hôm Nay
                </button>
                <button onClick={() => setActiveModal(null)} className="px-6 py-2.5 rounded-full bg-rose-600 text-white font-black text-xs shadow-md">
                  Vào Lớp
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs font-bold text-slate-800">
                <thead className="bg-slate-100 text-slate-700 sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-center border-r border-slate-200">STT</th>
                    <th className="p-3 border-r border-slate-200">Tên</th>
                    <th className="p-3 text-center border-r border-slate-200" colSpan={2}>Tổng điểm</th>
                    <th className="p-3 text-center border-r border-slate-200">Tháng này</th>
                    <th className="p-3 text-center border-r border-slate-200">Tuần này</th>
                    <th className="p-3 text-center border-r border-slate-200">Hôm nay</th>
                    <th className="p-3 text-center border-r border-slate-200">Điểm danh</th>
                    <th className="p-3 text-center bg-rose-600 text-white">Nhận xét ngày 13/08/2026</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {students.map((st, idx) => (
                    <tr key={st.id} className={st.status.startsWith('Absent') ? 'bg-rose-100 text-rose-900 font-bold' : 'hover:bg-amber-50/50'}>
                      <td className="p-3 text-center font-black border-r border-slate-200">{idx + 1}</td>
                      <td className="p-3 border-r border-slate-200">
                        <div className="text-rose-600 font-bold">{st.full_name}</div>
                        <div className="text-[10px] text-slate-500">[Mã: {st.code}]</div>
                      </td>
                      <td className="p-2 text-center">
                        <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] inline-flex items-center justify-center shadow">
                          {st.plus_points}
                        </span>
                      </td>
                      <td className="p-2 text-center border-r border-slate-200">
                        <span className="w-7 h-7 rounded-full bg-purple-900 text-white font-black text-[11px] inline-flex items-center justify-center shadow">
                          {st.minus_points}
                        </span>
                      </td>
                      <td className="p-3 text-center border-r border-slate-200">--</td>
                      <td className="p-3 text-center border-r border-slate-200">--</td>
                      <td className="p-3 text-center border-r border-slate-200">--</td>
                      <td className="p-3 text-center border-r border-slate-200">
                        <select
                          value={st.status}
                          onChange={(e) => setStudents(students.map(s => s.id === st.id ? { ...s, status: e.target.value } : s))}
                          className="p-1.5 rounded bg-white border border-slate-300 text-slate-900 text-xs font-bold shadow-sm"
                        >
                          <option value="Present">Có mặt</option>
                          <option value="Absent_Perm">Vắng có phép (Bôi đỏ)</option>
                          <option value="Absent_NoPerm">Vắng không phép (Bôi đỏ)</option>
                          <option value="Late">Đi trễ</option>
                        </select>
                      </td>
                      <td className="p-3 text-center text-xs">
                        <span onClick={() => triggerAnnouncement('📝 NHẬN XÉT HỌC SINH', `Ghi nhận xét cho học sinh ${st.full_name} thành công!`)} className="text-rose-600 cursor-pointer hover:underline">[Xem] </span>
                        <span onClick={() => triggerAnnouncement('📋 SAO CHÉP NHẬN XÉT', `Đã sao chép nhận xét của ${st.full_name} vào bộ nhớ tạm!`)} className="text-purple-600 cursor-pointer hover:underline">[Copy]</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end shrink-0">
              <button onClick={() => setActiveModal(null)} className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-black text-xs shadow">
                Đóng Bảng Điểm Danh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: GROUP DIVISION */}
      {activeModal === 'group_division' && (
        <div className="fixed top-16 inset-x-0 bottom-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-5xl w-full p-6 space-y-6 shadow-2xl animate-fadeIn max-h-[88vh] flex flex-col font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
              <h3 className="text-base font-black text-slate-900">🐝 HỆ THỐNG CHIA NHÓM HỌC TẬP</h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-xl bg-slate-100 text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {groupedStudents.map((grp) => (
                  <div key={grp.id} className="p-5 rounded-3xl border-2 border-amber-400 bg-slate-50 space-y-4 shadow-lg">
                    <h4 className="text-base font-black text-slate-900 border-b-2 border-amber-400 pb-2">{grp.name}</h4>
                    <div className="space-y-3">
                      {grp.members.map((mem) => {
                        const isSelectedPresenter = selectedRepresentative?.id === mem.id;
                        return (
                          <div key={mem.id} className={`p-3 rounded-2xl border flex items-center gap-3 font-bold text-xs ${
                            isSelectedPresenter ? 'bg-rose-600 text-white border-rose-600 animate-pulse scale-105 shadow-xl' : 'bg-white text-slate-900 border-slate-200'
                          }`}>
                            {showImagesInGroup && (
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-400 shrink-0">
                                <img src={mem.avatar} alt={mem.full_name} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <span>{mem.full_name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 shrink-0">
              <button onClick={handlePickRepresentative} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-xs shadow-lg animate-pulse">
                🎯 Chọn Đại Diện Trình Bày (Ngẫu Nhiên 1 Bạn)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DUCK RACE GAME CANVAS */}
      {activeModal === 'duck_race' && (
        <DuckRaceGameCanvas
          students={students}
          onClose={() => setActiveModal(null)}
          onRewardWinner={(winner, pts) => {
            soundFX.playClick();
            handleApplyPoints(pts, `Thưởng chiến thắng Game Đua Vịt (#${winner.rank})`);
          }}
        />
      )}

      {/* MODAL 5: BLIND BAG */}
      {activeModal === 'blind_bag' && (
        <div className="fixed top-16 inset-x-0 bottom-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-10 font-sans">
          <div className="bg-slate-900 border-2 border-purple-500 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <h3 className="text-base font-black text-purple-300">🎁 TÚI MÙ PHẦN THƯỞNG MAY MẮN</h3>
            <div className="p-6 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-amber-300 font-black text-base animate-bounce">
              {blindBagResult}
            </div>
            <button onClick={() => setActiveModal(null)} className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-black text-xs">
              Đóng Túi Mù
            </button>
          </div>
        </div>
      )}

      {/* MODAL 6: TIMER STOPWATCH */}
      {activeModal === 'timer' && (
        <div className="fixed top-16 inset-x-0 bottom-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-10 font-sans">
          <div className="bg-slate-900 border-2 border-indigo-500 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <h3 className="text-base font-black text-white">⏱️ BẤM GIỜ THỜI GIAN THẢO LUẬN LỚP HỌC</h3>
            <div className="text-5xl font-black text-amber-400 font-mono py-4">{stopwatchSeconds}s</div>
            <div className="flex justify-center gap-3">
              <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-black text-xs">
                {isTimerRunning ? 'Tạm Dừng' : 'Bắt Đầu'}
              </button>
              <button onClick={() => setStopwatchSeconds(60)} className="px-6 py-2 rounded-xl bg-slate-800 text-slate-300 font-black text-xs">
                Đặt Lại (60s)
              </button>
              <button onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-black text-xs">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
