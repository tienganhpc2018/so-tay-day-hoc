import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { TableSkeleton } from '../components/common/Skeleton';
import { PageHeroBanner } from '../components/common/PageHeroBanner';
import { soundFX } from '../utils/soundEffects';
import { ShieldAlert, UserCheck, Lock, Unlock, Search, Users, UserPlus } from 'lucide-react';

export const AdminDashboard = () => {
  const { isAdmin, isTeacher } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userToToggle) => {
    const newStatus = userToToggle.status === 'locked' ? 'active' : 'locked';
    soundFX.playClick();

    try {
      setUsers(prev => prev.map(u => u.id === userToToggle.id ? { ...u, status: newStatus } : u));

      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userToToggle.id);

      if (error) throw error;
      if (newStatus === 'locked') soundFX.playWrong();
      else soundFX.playCorrect();
    } catch (err) {
      console.error('Error toggling status:', err);
      setUsers(prev => prev.map(u => u.id === userToToggle.id ? { ...u, status: userToToggle.status } : u));
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.student_code && u.student_code.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans animate-fadeIn">
      
      {/* HERO BANNER WITH VIBRANT AI CLASSROOM BACKGROUND */}
      <PageHeroBanner
        title="Quản Lý Tài Khoản & Phân Quyền Hệ Thống 👥"
        subtitle="Quản lý danh sách tài khoản Học sinh & Giáo viên, phân quyền RBAC và thực hiện Tạm khóa / Kích hoạt lại tài khoản tức thì."
        badge="QUẢN TRỊ VIÊN VIP • BẢO MẬT HỆ THỐNG"
        bgImage="/images/hero_school_bg.jpg"
        showVipBadge={true}
      />

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tài liệu, họ tên, email hoặc mã HS..."
            className="w-full glass-input pl-10 text-xs py-2"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-bold ${filterStatus === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
          >
            Tất Cả ({users.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-lg font-bold ${filterStatus === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}
          >
            Đang Hoạt Động
          </button>
          <button
            onClick={() => setFilterStatus('locked')}
            className={`px-3 py-1.5 rounded-lg font-bold ${filterStatus === 'locked' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-400'}`}
          >
            Đã Khóa
          </button>
        </div>
      </div>

      {/* User Table */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : (
        <div className="glass-panel overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase tracking-wider font-bold">
                <th className="p-4">Họ và Tên</th>
                <th className="p-4">Mã HS / Email</th>
                <th className="p-4">Vai Trò</th>
                <th className="p-4">Khối Lớp</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Thao Tác Tạm Khóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-600/20 text-brand-400 flex items-center justify-center font-bold">
                      {u.full_name ? u.full_name.charAt(0) : 'U'}
                    </div>
                    <span>{u.full_name}</span>
                  </td>
                  <td className="p-4 text-slate-300">
                    {u.student_code || u.email || 'HS_LOGIN'}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                      u.role === 'admin' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                      u.role === 'teacher' ? 'bg-brand-500/10 text-brand-400 border border-brand-500/30' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {u.role === 'admin' ? 'Quản Trị' : u.role === 'teacher' ? 'Giáo Viên' : 'Học Sinh'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">Khối {u.grade_level || 8}</td>
                  <td className="p-4">
                    {u.status === 'locked' ? (
                      <span className="px-2 py-1 rounded bg-rose-500/10 text-rose-400 font-bold border border-rose-500/30">
                        🔒 Đã Tạm Khóa
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                        ✓ Hoạt Động
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleUserStatus(u)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ml-auto ${
                        u.status === 'locked'
                          ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40'
                      }`}
                    >
                      {u.status === 'locked' ? (
                        <>
                          <Unlock className="w-3.5 h-3.5" /> Mở Khóa Tài Khoản
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" /> Tạm Khóa Tài Khoản
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
