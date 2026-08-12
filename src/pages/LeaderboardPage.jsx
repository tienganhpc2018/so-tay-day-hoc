import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { LeaderboardTable } from '../components/gamification/LeaderboardTable';
import { BadgeGrid } from '../components/gamification/BadgeGrid';
import { TableSkeleton } from '../components/common/Skeleton';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { Trophy, Award, Star } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export const LeaderboardPage = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [students, setStudents] = useState([]);
  const [badges, setBadges] = useState([]);
  const [userBadgeIds, setUserBadgeIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGamificationData();
  }, [profile]);

  const fetchGamificationData = async () => {
    setLoading(true);
    try {
      const { data: stData } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('total_stars', { ascending: false })
        .limit(20);

      if (!stData || stData.length === 0) {
        setStudents([
          { id: '1', full_name: 'Nguyễn Minh Anh', grade_level: 8, student_code: 'HS8A5_01', total_stars: 120 },
          { id: '2', full_name: 'Trần Bảo Nam', grade_level: 8, student_code: 'HS8A5_02', total_stars: 95 },
          { id: '3', full_name: 'Lê Hoàng Yến', grade_level: 7, student_code: 'HS7A1_05', total_stars: 80 },
          { id: '4', full_name: 'Phạm Đức Huy', grade_level: 9, student_code: 'HS9A2_12', total_stars: 65 },
          { id: '5', full_name: 'Vũ Thùy Linh', grade_level: 6, student_code: 'HS6A3_08', total_stars: 50 },
        ]);
      } else {
        setStudents(stData);
      }

      const { data: bgData } = await supabase
        .from('badges')
        .select('*')
        .order('required_stars');

      if (!bgData || bgData.length === 0) {
        setBadges([
          { id: 'b1', title: 'Master of Vocabulary', description: 'Tích lũy 50 sao từ bài thi từ vựng', icon_name: 'BookOpen', required_stars: 50 },
          { id: 'b2', title: 'Grammar Expert', description: 'Tích lũy 100 sao từ kiểm tra ngữ pháp', icon_name: 'CheckCircle2', required_stars: 100 },
          { id: 'b3', title: 'Streak 7 Ngày', description: 'Tích cực tham gia học tập liên tục 7 ngày', icon_name: 'Flame', required_stars: 30 },
          { id: 'b4', title: 'Ngôi Sao Nề Nếp', description: 'Đạt 20 điểm cộng nề nếp từ giáo viên', icon_name: 'Star', required_stars: 40 },
          { id: 'b5', title: 'Nhà Thám Hiểm Tiếng Anh', description: 'Hoàn thành bài học ở cả 4 khối lớp', icon_name: 'Compass', required_stars: 60 },
          { id: 'b6', title: 'Vua Trò Chơi', description: 'Chiến thắng 10 ván game tương tác', icon_name: 'Trophy', required_stars: 80 },
        ]);
      } else {
        setBadges(bgData);
      }

      if (profile?.id) {
        const { data: ubData } = await supabase
          .from('student_badges')
          .select('badge_id')
          .eq('student_id', profile.id);

        setUserBadgeIds((ubData || []).map(u => u.badge_id));
      }
    } catch (err) {
      console.error('Error fetching gamification data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* HERO BANNER WITH AI SCHOOL BACKGROUND IMAGE */}
      <PageHeroBanner
        title="Bảng Xếp Hạng & Vinh Danh 🏆"
        subtitle="Vinh danh học sinh có thành tích xuất sắc, tích lũy điểm Sao thưởng và bộ sưu tập huy hiệu Tiếng Anh THCS."
        badge="VINH DANH THÀNH TÍCH • BANG XẾP HẠNG HỌC SINH"
        bgImage="/images/hero_school_bg.jpg"
        actions={
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 w-fit backdrop-blur-md">
            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab('leaderboard');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" /> Bảng Xếp Hạng
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                setActiveTab('badges');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeTab === 'badges'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" /> Huy Hiệu Thành Tích
            </button>
          </div>
        }
      />

      {/* Content */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : activeTab === 'leaderboard' ? (
        <LeaderboardTable students={students} />
      ) : (
        <BadgeGrid badges={badges} userBadgeIds={userBadgeIds} />
      )}

    </div>
  );
};
