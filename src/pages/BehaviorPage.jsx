import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { soundFX } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
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
  Crown
} from 'lucide-react';

export const BehaviorPage = () => {
  const { isTeacher } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const yearParam = searchParams.get('year') || '2025-2026';

  const [selectedClass, setSelectedClass] = useState('9A6');
  const [academicYear, setAcademicYear] = useState(yearParam);
  const [avatarSize, setAvatarSize] = useState('normal'); // 'normal' | 'large'
  const [themeMode, setThemeMode] = useState('default'); // 'default' | 'tet'

  // MODAL / VIEW STATES MATCHING SCREENSHOTS 1-5
  const [activeModal, setActiveModal] = useState(null); 
  // 'attendance' (Screenshot 3) | 'reward_penalty' (Screenshot 2) | 'group_division' (Screenshots 4,5) | 'bee_race' | 'blind_bag' | 'seating_map' | 'timer'

  // Student roster data
  const [students, setStudents] = useState([
    { id: 'st-1', code: '384', full_name: 'Nguyễn Văn Anh', plus_points: 20, minus_points: 0, status: 'Present', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
    { id: 'st-2', code: '444', full_name: 'Lê Thị Trà Dáng', plus_points: 0, minus_points: 0, status: 'Present', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
    { id: 'st-3', code: '932', full_name: 'Nguyễn Thị Thùy Giang', plus_points: 20, minus_points: 0, status: 'Present', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop' },
    { id: 'st-4', code: '292', full_name: 'Phạm Thị Thu Hà', plus_points: 0, minus_points: 0, status: 'Present', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
    { id: 'st-5', code: '105', full_name: 'Đồng Nguyễn Xuân Yên', plus_points: 0, minus_points: 0, status: 'Present', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
    { id: 'st-6', code: '106', full_name: 'Võ Mai Sâm', plus_points: 15, minus_points: 0, status: 'Present', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop' },
    { id: 'st-7', code: '107', full_name: 'Trần Thị Phương Trinh', plus_points: 10, minus_points: 0, status: 'Present', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop' },
    { id: 'st-8', code: '108', full_name: 'Nguyễn Thị Kim My', plus_points: 25, minus_points: 0, status: 'Present', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
    { id: 'st-9', code: '109', full_name: 'Huỳnh Thị Trà My', plus_points: 5, minus_points: 0, status: 'Present', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' }
  ]);

  const [selectedStudentForReward, setSelectedStudentForReward] = useState(students[4]); // Đồng Nguyễn Xuân Yên (Screenshot 2)
  const [rewardTab, setRewardTab] = useState('plus'); // 'plus' (Điểm THƯỞNG) | 'minus' (Điểm PHẠT)

  // Group Division State (Screenshots 4 & 5)
  const [numGroups, setNumGroups] = useState(3);
  const [studentsPerGroup, setStudentsPerGroup] = useState(3);
  const [showImagesInGroup, setShowImagesInGroup] = useState(true);
  const [groupedStudents, setGroupedStudents] = useState([]);
  const [selectedRepresentative, setSelectedRepresentative] = useState(null); // Selected presenter (Screenshot 5)

  // Timer Stopwatch State
  const [stopwatchSeconds, setStopwatchSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Bee / Duck Race State
  const [racingBees, setRacingBees] = useState([
    { id: 1, name: 'Chú Ong Vàng 1', progress: 0 },
    { id: 2, name: 'Chú Ong Vàng 2', progress: 0 },
    { id: 3, name: 'Chú Ong Vàng 3', progress: 0 }
  ]);
  const [isRacing, setIsRacing] = useState(false);
  const [raceWinner, setRaceWinner] = useState(null);

  // Blind Bag State
  const [blindBagResult, setBlindBagResult] = useState(null);

  // Random Single / Multiple Pick Result
  const [pickedRandomStudents, setPickedRandomStudents] = useState([]);

  // Auto-Group Division Function
  const handleDivideGroups = () => {
    soundFX.playClick();
    const shuffled = [...students].sort(() => 0.5 - Math.random());
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

  // Pick Random Representative from Groups (Screenshot 5)
  const handlePickRepresentative = () => {
    soundFX.playClick();
    if (groupedStudents.length === 0) handleDivideGroups();

    const allMembers = groupedStudents.flatMap(g => g.members);
    if (allMembers.length === 0) return;

    const winner = allMembers[Math.floor(Math.random() * allMembers.length)];
    setSelectedRepresentative(winner);
    try { soundFX.playFanfare(); } catch (err) {}
    confetti({ particleCount: 120, spread: 80 });
  };

  // Pick 1 Random Student
  const handlePickOne = () => {
    soundFX.playClick();
    const winner = students[Math.floor(Math.random() * students.length)];
    setPickedRandomStudents([winner]);
    setSelectedStudentForReward(winner);
    try { soundFX.playFanfare(); } catch (err) {}
    confetti({ particleCount: 120, spread: 80 });
    alert(`🎯 GỌI TÊN NGẪU NHIÊN: ${winner.full_name} (${winner.code})!`);
  };

  // Pick Multiple Random Students
  const handlePickMultiple = () => {
    soundFX.playClick();
    const shuffled = [...students].sort(() => 0.5 - Math.random()).slice(0, 3);
    setPickedRandomStudents(shuffled);
    try { soundFX.playFanfare(); } catch (err) {}
    confetti({ particleCount: 120, spread: 80 });
    alert(`🎯 GỌI TÊN NGẪU NHIÊN 3 HỌC SINH: ${shuffled.map(s => s.full_name).join(', ')}!`);
  };

  // Bee Race Engine
  const handleStartBeeRace = () => {
    soundFX.playClick();
    setIsRacing(true);
    setRaceWinner(null);

    const interval = setInterval(() => {
      setRacingBees(prev => {
        const updated = prev.map(bee => ({
          ...bee,
          progress: Math.min(100, bee.progress + Math.floor(Math.random() * 20) + 5)
        }));

        const winner = updated.find(b => b.progress >= 100);
        if (winner) {
          clearInterval(interval);
          setIsRacing(false);
          setRaceWinner(winner);
          try { soundFX.playFanfare(); } catch (err) {}
          confetti({ particleCount: 150, spread: 90 });
        }
        return updated;
      });
    }, 400);
  };

  // Grant Reward Points (Screenshot 2)
  const handleApplyPoints = (points, reason) => {
    soundFX.playClick();
    if (!selectedStudentForReward) return;

    const delta = rewardTab === 'plus' ? points : -points;
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

    try { soundFX.playFanfare(); } catch (err) {}
    confetti({ particleCount: 100, spread: 70 });
    alert(`✨ ĐÃ ${rewardTab === 'plus' ? 'CỘNG' : 'TRỪ'} ${points} ĐIỂM CHO HỌC SINH ${selectedStudentForReward.full_name}! Lý do: ${reason}`);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* HERO BANNER */}
      <PageHeroBanner
        title={`Sổ Nề Nếp & Quản Lý Lớp Chủ Nhiệm (${academicYear}) 📋`}
        subtitle={`Điểm danh thời gian thực, Cộng/Trừ điểm thưởng phạt, Gọi tên ngẫu nhiên, Bee Race Đua Vịt và Chia nhóm học tập Lớp ${selectedClass}.`}
        badge={`QUẢN LÝ LỚP CHỦ NHIỆM • LỚP ${selectedClass}`}
        bgImage="/images/hero_library_bg.jpg"
      />

      {/* 1. TOP TOOL ACTION PILLS BAR (MATCHING SCREENSHOT 1 100%) */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4" /> BẢNG THAO TÁC QUẢN LÝ NỀ NẾP & LỚP HỌC 4.0
          </span>
          <span className="text-xs font-bold text-slate-400">Sĩ số: <strong>{students.length} Học Sinh</strong> • Lớp {selectedClass}</span>
        </div>

        {/* PILLS ROW MATCHING SCREENSHOT 1 */}
        <div className="flex flex-wrap gap-2 text-xs font-black">
          
          <button
            onClick={() => setAvatarSize(avatarSize === 'normal' ? 'large' : 'normal')}
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
            onClick={() => setThemeMode(themeMode === 'default' ? 'tet' : 'default')}
            className="px-4 py-2 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 shadow"
          >
            Tết 🌸
          </button>

          <button
            onClick={handlePickOne}
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
            onClick={() => { soundFX.playClick(); setActiveModal('bee_race'); }}
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
            onClick={() => { soundFX.playClick(); setActiveModal('bee_race'); }}
            className="px-4 py-2 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 shadow animate-pulse"
          >
            Bee Race (Đua Vịt) 🐝
          </button>

          <button
            onClick={() => { soundFX.playClick(); alert('Đã phân chia học sinh theo 4 Tổ học tập!'); }}
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
            onClick={() => { soundFX.playClick(); alert(`Đã chọn tất cả ${students.length} học sinh!`); }}
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

      {/* STUDENT CARDS GRID (MAIN PAGE DISPLAY) */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" /> DANH SÁCH HỌC SINH LỚP {selectedClass} ({academicYear})
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {students.map((st) => (
            <div
              key={st.id}
              onClick={() => {
                soundFX.playClick();
                setSelectedStudentForReward(st);
                setActiveModal('reward_penalty');
              }}
              className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer shadow-xl flex flex-col items-center text-center space-y-3 group"
            >
              <div className={`relative rounded-full overflow-hidden border-2 border-amber-400 shadow-md ${avatarSize === 'large' ? 'w-24 h-24' : 'w-16 h-16'}`}>
                <img src={st.avatar} alt={st.full_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold">Mã: {st.code}</span>
                <h4 className="text-xs font-black text-white line-clamp-1">{st.full_name}</h4>
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
          ))}
        </div>
      </div>

      {/* MODAL 1: HOMEROOM REWARD & PENALTY DIALOG (MATCHING SCREENSHOT 2 100%) */}
      {activeModal === 'reward_penalty' && selectedStudentForReward && (
        <div className="fixed top-16 inset-x-0 bottom-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl animate-fadeIn font-sans">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* LEFT CARD: STUDENT PROFILE (MATCHING SCREENSHOT 2 LEFT CARD) */}
              <div className="md:col-span-5 p-5 rounded-3xl border border-slate-200 shadow-lg bg-white flex flex-col items-center justify-between text-center space-y-4">
                <h3 className="text-base font-black text-slate-900">{selectedStudentForReward.full_name}</h3>

                <div className="relative">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-amber-400 shadow-xl">
                    <img src={selectedStudentForReward.avatar} alt={selectedStudentForReward.full_name} className="w-full h-full object-cover" />
                  </div>

                  {/* PLUS / MINUS BADGES ON AVATAR */}
                  <span className="absolute top-0 left-0 w-8 h-8 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shadow">
                    {selectedStudentForReward.plus_points}
                  </span>
                  <span className="absolute top-0 right-0 w-8 h-8 rounded-full bg-purple-900 text-white font-black text-xs flex items-center justify-center shadow">
                    {selectedStudentForReward.minus_points}
                  </span>
                </div>

                <button className="text-xs text-rose-600 font-bold hover:underline">Xem thông tin</button>
                <span className="text-[11px] text-slate-500">[Chọn Danh sách]</span>

                <button
                  onClick={handlePickOne}
                  className="w-full py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg"
                >
                  Chọn Ngẫu Nhiên
                </button>
              </div>

              {/* RIGHT CARD: POINT CATEGORIES & PRESETS (MATCHING SCREENSHOT 2 RIGHT PANEL) */}
              <div className="md:col-span-7 space-y-4">
                
                {/* TABS: Điểm THƯỞNG / Điểm PHẠT */}
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

                <p className="text-[11px] text-rose-600 font-bold text-center">
                  Thầy cô cần tạo điểm danh trước mới có thể cho điểm. Tạo điểm danh để khởi tạo 1 buổi học mới.
                </p>

                <div className="flex justify-center">
                  <button
                    onClick={() => setActiveModal('attendance')}
                    className="px-6 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md"
                  >
                    Vào Điểm Danh
                  </button>
                </div>

                {/* PRESET BADGES */}
                {rewardTab === 'plus' ? (
                  <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold pt-2">
                    <button onClick={() => handleApplyPoints(5, 'Phát biểu bài')} className="p-3 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 flex flex-col items-center gap-1 group">
                      <span className="w-8 h-8 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shadow">
                        +5
                      </span>
                      <span className="text-slate-800 text-[11px]">Phát biểu bài</span>
                    </button>

                    <button onClick={() => handleApplyPoints(4, 'Giúp đỡ bạn')} className="p-3 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 flex flex-col items-center gap-1 group">
                      <span className="w-8 h-8 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shadow">
                        +4
                      </span>
                      <span className="text-slate-800 text-[11px]">Giúp đỡ bạn</span>
                    </button>

                    <button onClick={() => handleApplyPoints(2, 'Làm bài tập về nhà')} className="p-3 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 flex flex-col items-center gap-1 group">
                      <span className="w-8 h-8 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shadow">
                        +2
                      </span>
                      <span className="text-slate-800 text-[11px]">Làm BTVN</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold pt-2">
                    <button onClick={() => handleApplyPoints(5, 'Không làm bài tập')} className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200 flex flex-col items-center gap-1 group">
                      <span className="w-8 h-8 rounded-full bg-purple-900 text-white font-black text-xs flex items-center justify-center shadow">
                        -5
                      </span>
                      <span className="text-slate-800 text-[11px]">Không làm bài</span>
                    </button>

                    <button onClick={() => handleApplyPoints(4, 'Mất trật tự')} className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200 flex flex-col items-center gap-1 group">
                      <span className="w-8 h-8 rounded-full bg-purple-900 text-white font-black text-xs flex items-center justify-center shadow">
                        -4
                      </span>
                      <span className="text-slate-800 text-[11px]">Mất trật tự</span>
                    </button>

                    <button onClick={() => handleApplyPoints(2, 'Đi học trễ')} className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200 flex flex-col items-center gap-1 group">
                      <span className="w-8 h-8 rounded-full bg-purple-900 text-white font-black text-xs flex items-center justify-center shadow">
                        -2
                      </span>
                      <span className="text-slate-800 text-[11px]">Đi học trễ</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-600 pt-2">
                  <input type="checkbox" id="extra_pts" className="rounded text-rose-600" />
                  <label htmlFor="extra_pts">Điểm Cộng/Trừ đột xuất hoặc thu hồi</label>
                </div>
              </div>

            </div>

            {/* BOTTOM BUTTON BAR (MATCHING SCREENSHOT 2 BOTTOM BAR) */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button onClick={() => handleApplyPoints(5, 'Cộng điểm tổng hợp')} className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow">
                Cộng Điểm
              </button>
              <button onClick={() => setActiveModal('attendance')} className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow">
                Điểm Hôm Nay
              </button>
              <button onClick={() => { const note = prompt('Nhập nhận xét:'); if (note) alert(`Đã ghi nhận xét: ${note}`); }} className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow">
                Nhận Xét
              </button>
              <button onClick={() => setActiveModal(null)} className="px-5 py-2 rounded-full border border-rose-600 text-rose-600 hover:bg-rose-50 font-black text-xs">
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: DAILY ATTENDANCE TABLE (MATCHING SCREENSHOT 3 100%) */}
      {activeModal === 'attendance' && (
        <div className="fixed top-16 inset-x-0 bottom-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-5xl w-full p-6 space-y-5 shadow-2xl animate-fadeIn max-h-[88vh] flex flex-col font-sans">
            
            {/* HEADER MATCHING SCREENSHOT 3 */}
            <div className="text-center space-y-3 shrink-0">
              <h2 className="text-2xl font-black text-slate-900">
                Điểm Danh Hôm Nay 13/08/2026 - Lớp {selectedClass}
              </h2>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    soundFX.playClick();
                    alert('🎉 ĐÃ TẠO BẢNG ĐIỂM DANH CHO HÔM NAY THÀNH CÔNG!');
                  }}
                  className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md"
                >
                  Tạo Điểm Danh Hôm Nay
                </button>

                <button
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md"
                >
                  Vào Lớp
                </button>
              </div>

              <p className="text-xs font-bold text-slate-700 max-w-3xl mx-auto leading-relaxed">
                <strong>Lưu ý:</strong> Nếu cần ghi nhận xét của buổi học trước đó, hãy viết xong nhận xét mới bấm "Tạo điểm danh hôm nay", vì sau khi bấm thì chỉ cập nhật được nhận xét cho hôm nay.
              </p>
            </div>

            {/* ATTENDANCE TABLE MATCHING SCREENSHOT 3 */}
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
                    <tr key={st.id} className="hover:bg-amber-50/50">
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
                          className="p-1 rounded bg-slate-100 border border-slate-300 text-slate-900 text-xs font-bold"
                        >
                          <option value="Present">Chưa / Có mặt</option>
                          <option value="Absent_Perm">Vắng có phép</option>
                          <option value="Absent_NoPerm">Vắng không phép</option>
                          <option value="Late">Trễ</option>
                        </select>
                      </td>
                      <td className="p-3 text-center text-xs">
                        <span className="text-rose-600 cursor-pointer hover:underline">[Xem] </span>
                        <span className="text-purple-600 cursor-pointer hover:underline">[Copy]</span>
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

      {/* MODAL 3: GROUP DIVISION & REPRESENTATIVE SELECTION (MATCHING SCREENSHOTS 4 & 5 100%) */}
      {activeModal === 'group_division' && (
        <div className="fixed top-16 inset-x-0 bottom-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-5xl w-full p-6 space-y-6 shadow-2xl animate-fadeIn max-h-[88vh] flex flex-col font-sans">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                🐝 HỆ THỐNG CHIA NHÓM HỌC TẬP & CHỌN ĐẠI DIỆN TRÌNH BÀY
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-xl bg-slate-100 text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* GROUP CARDS GRID (MATCHING SCREENSHOTS 4 & 5) */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {groupedStudents.map((grp) => (
                  <div key={grp.id} className="p-5 rounded-3xl border-2 border-amber-400 bg-slate-50 space-y-4 shadow-lg relative">
                    <h4 className="text-base font-black text-slate-900 border-b-2 border-amber-400 pb-2">
                      {grp.name}
                    </h4>

                    <div className="space-y-3">
                      {grp.members.map((mem) => {
                        const isSelectedPresenter = selectedRepresentative?.id === mem.id;
                        return (
                          <div
                            key={mem.id}
                            className={`p-3 rounded-2xl border transition-all flex items-center gap-3 font-bold text-xs shadow-sm ${
                              isSelectedPresenter
                                ? 'bg-rose-600 text-white border-rose-600 animate-pulse scale-105 shadow-xl'
                                : 'bg-white text-slate-900 border-slate-200'
                            }`}
                          >
                            {showImagesInGroup && (
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-400 shrink-0">
                                <img src={mem.avatar} alt={mem.full_name} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <span className="truncate">{mem.full_name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GROUP SETUP CONTROLS (MATCHING SCREENSHOT 4 BOTTOM CONTROLS) */}
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex flex-wrap items-center justify-between gap-4 shrink-0 text-xs font-bold">
              <div className="flex items-center gap-4">
                <span>Số nhóm:</span>
                <select
                  value={numGroups}
                  onChange={(e) => setNumGroups(Number(e.target.value))}
                  className="p-2 rounded-xl bg-white border border-slate-300"
                >
                  <option value={2}>2 Nhóm</option>
                  <option value={3}>3 Nhóm</option>
                  <option value={4}>4 Nhóm</option>
                </select>

                <span>Số HS:</span>
                <select
                  value={studentsPerGroup}
                  onChange={(e) => setStudentsPerGroup(Number(e.target.value))}
                  className="p-2 rounded-xl bg-white border border-slate-300"
                >
                  <option value={2}>2 HS</option>
                  <option value={3}>3 HS</option>
                  <option value={4}>4 HS</option>
                </select>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showImagesInGroup}
                    onChange={(e) => setShowImagesInGroup(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  Có hình
                </label>
              </div>

              <button
                onClick={handleDivideGroups}
                className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-md"
              >
                Chia Nhóm
              </button>
            </div>

            {/* ACTION BAR (MATCHING SCREENSHOT 4 & 5 BOTTOM BUTTON BAR) */}
            <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 pt-2">
              <div className="flex items-center gap-2">
                <button onClick={() => setActiveModal(null)} className="px-5 py-2 rounded-full bg-rose-600 text-white font-black text-xs shadow">
                  Vào Lớp
                </button>
                <button onClick={handlePickOne} className="px-5 py-2 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow">
                  Gọi 1
                </button>
                <button onClick={handlePickMultiple} className="px-5 py-2 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow">
                  Gọi Nhiều
                </button>
                <button onClick={() => setActiveModal('timer')} className="px-5 py-2 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow">
                  Bấm Giờ
                </button>
              </div>

              <button
                onClick={handlePickRepresentative}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-xs shadow-lg animate-pulse"
              >
                🎯 Chọn Đại Diện Trình Bày (Ngẫu Nhiên 1 Bạn)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 4: BEE RACE / ĐUA VỊT MINI-GAME PICKER */}
      {activeModal === 'bee_race' && (
        <div className="fixed top-16 inset-x-0 bottom-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-4 overflow-y-auto font-sans">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-amber-400 flex items-center gap-2">
                🐝 TRÒ CHƠI BEE RACE (ĐUA VỊT) CHỌN HỌC SINH PHÁT BIỂU
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded bg-slate-800 text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* RACE TRACK */}
            <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              {racingBees.map((bee) => (
                <div key={bee.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>{bee.name}</span>
                    <span>{bee.progress}%</span>
                  </div>
                  <div className="w-full h-6 rounded-full bg-slate-800 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 flex items-center justify-end pr-2 font-black text-slate-950 text-xs"
                      style={{ width: `${bee.progress}%` }}
                    >
                      🐝
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {raceWinner && (
              <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-300 font-black text-center text-sm animate-bounce">
                🎉 CHIẾN THẮNG: {raceWinner.name}! ĐẠI DIỆN LÊN BẢNG TRÌNH BÀY!
              </div>
            )}

            <button
              onClick={handleStartBeeRace}
              disabled={isRacing}
              className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg"
            >
              {isRacing ? 'Đang Đua...' : 'BẮT ĐẦU ĐUA BEE RACE NGAY'}
            </button>

          </div>
        </div>
      )}

      {/* MODAL 5: BLIND BAG LUCKY PICKER */}
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
            <div className="text-5xl font-black text-amber-400 font-mono py-4">
              {stopwatchSeconds}s
            </div>
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
