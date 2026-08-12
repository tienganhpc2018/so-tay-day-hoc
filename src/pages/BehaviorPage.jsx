import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { StudentBehaviorCard } from '../components/behavior/StudentBehaviorCard';
import { RandomStudentPicker } from '../components/behavior/RandomStudentPicker';
import { TableSkeleton } from '../components/common/Skeleton';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { soundFX } from '../utils/soundEffects';
import { UserCheck, Dices, PlusCircle, MinusCircle, Star, Search, ShieldCheck, Calendar } from 'lucide-react';

export const BehaviorPage = () => {
  const { isTeacher } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const yearParam = searchParams.get('year') || '2025-2026';

  const [selectedClass, setSelectedClass] = useState('8A5');
  const [academicYear, setAcademicYear] = useState(yearParam);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [logHistory, setLogHistory] = useState([]);

  useEffect(() => {
    if (yearParam) setAcademicYear(yearParam);
  }, [yearParam]);

  useEffect(() => {
    fetchStudents();
  }, [selectedClass, academicYear]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('full_name');

      if (error) console.error(error);

      if (!data || data.length === 0) {
        const dummyRoster = Array.from({ length: 12 }).map((_, i) => ({
          id: `demo-student-${i + 1}`,
          full_name: `Học Sinh ${i + 1} - Lớp ${selectedClass}`,
          student_code: `HS8A5_${(i + 1).toString().padStart(2, '0')}`,
          total_stars: Math.floor(Math.random() * 40) + 10,
          role: 'student',
          status: 'active'
        }));
        setStudents(dummyRoster);
      } else {
        setStudents(data);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogBehavior = async (student, actionType, points, defaultNote) => {
    try {
      const note = prompt(`Nhập ghi chú nề nếp cho ${student.full_name}:`, defaultNote);
      if (note === null) return;

      let starDelta = 0;
      if (actionType === 'plus' || actionType === 'praise') starDelta = points || 1;
      if (actionType === 'minus') starDelta = -(points || 1);

      const newStars = Math.max(0, (student.total_stars || 0) + starDelta);
      setStudents(prev => prev.map(s => s.id === student.id ? { ...s, total_stars: newStars } : s));

      setLogHistory(prev => [
        {
          id: Date.now(),
          studentName: student.full_name,
          actionType,
          points: starDelta,
          note,
          time: new Date().toLocaleTimeString('vi-VN')
        },
        ...prev
      ]);

      if (!student.id.startsWith('demo-')) {
        await supabase.from('profiles').update({ total_stars: newStars }).eq('id', student.id);
      }
    } catch (err) {
      console.error('Error logging behavior:', err);
    }
  };

  const filteredStudents = students.filter(s =>
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.student_code && s.student_code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* HERO BANNER WITH AI LIBRARY BACKGROUND IMAGE */}
      <PageHeroBanner
        title={`Sổ Nề Nếp & Ý Thức Học Sinh (${academicYear}) 📋`}
        subtitle={`Quản lý cộng/trừ điểm nề nếp trực tiếp trong giờ Tiếng Anh, điểm danh & Gọi tên ngẫu nhiên cho Năm học ${academicYear}.`}
        badge={`QUẢN LÝ NỀ NẾP • LỚP ${selectedClass}`}
        bgImage="/images/hero_library_bg.jpg"
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold backdrop-blur-md">
              <button
                onClick={() => {
                  soundFX.playClick();
                  setAcademicYear('2025-2026');
                  setSearchParams({ year: '2025-2026' });
                }}
                className={`px-3 py-1.5 rounded-xl transition-all ${academicYear === '2025-2026' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                Năm 2025 - 2026
              </button>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setAcademicYear('2026-2027');
                  setSearchParams({ year: '2026-2027' });
                }}
                className={`px-3 py-1.5 rounded-xl transition-all ${academicYear === '2026-2027' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                Năm 2026 - 2027
              </button>
            </div>

            <button
              onClick={() => {
                soundFX.playClick();
                setIsPickerOpen(true);
              }}
              className="glass-button-accent text-xs px-4 py-2.5"
            >
              <Dices className="w-4 h-4" /> Gọi Tên Ngẫu Nhiên 🎲
            </button>
          </div>
        }
      />

      {/* Search & Class Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm học sinh theo tên hoặc mã..."
            className="w-full glass-input pl-10 text-xs py-2"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Danh sách Lớp 8A5 • Sĩ số {students.length} học sinh</span>
        </div>
      </div>

      {/* Student Cards Grid */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredStudents.map((st) => (
            <StudentBehaviorCard
              key={st.id}
              student={st}
              isTeacher={isTeacher}
              onLogBehavior={handleLogBehavior}
            />
          ))}
        </div>
      )}

      {/* Log History */}
      {logHistory.length > 0 && (
        <div className="glass-panel p-6 space-y-4 border-slate-800">
          <h3 className="text-base font-extrabold text-white">Lịch Sử Nhật Ký Nề Nếp Năm Học {academicYear}</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {logHistory.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">{log.studentName}: </span>
                  <span className="text-slate-300">{log.note}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-black ${log.points >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {log.points >= 0 ? `+${log.points}` : log.points} Sao
                  </span>
                  <span className="text-[10px] text-slate-500">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <RandomStudentPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        students={students}
        onRewardWinner={(winner) => {
          handleLogBehavior(winner, 'praise', 2, 'Tuyên dương phát biểu xuất sắc khi gọi ngẫu nhiên');
          setIsPickerOpen(false);
        }}
      />

    </div>
  );
};
