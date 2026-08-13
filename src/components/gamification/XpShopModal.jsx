import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Award, 
  ShoppingBag, 
  Flame, 
  Target, 
  Zap, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  X, 
  Plus, 
  ShieldCheck, 
  Gift, 
  Swords, 
  UserCheck, 
  Crown
} from 'lucide-react';

export const XpShopModal = ({ isOpen, onClose }) => {
  const { profile, isTeacher, isAdmin } = useAuth();

  const [currentXp, setCurrentXp] = useState(profile?.total_xp || 1450);
  const [currentLevel, setCurrentLevel] = useState(Math.floor((profile?.total_xp || 1450) / 100) + 1);
  const [streakDays, setStreakDays] = useState(7);
  const [equippedFrame, setEquippedFrame] = useState('frame-default');
  const [unlockedFrames, setUnlockedFrames] = useState(['frame-default']);

  // SHOP ITEMS (DIRECTIVE 2.4 & 2.6)
  const shopFrames = [
    { id: 'frame-gold', name: 'Khung Rồng Vàng VIP 👑', xpCost: 500, style: 'border-4 border-amber-400 shadow-amber-500/50' },
    { id: 'frame-neon', name: 'Khung Neon Cyber ⚡', xpCost: 800, style: 'border-4 border-cyan-400 shadow-cyan-500/50 animate-pulse' },
    { id: 'frame-ruby', name: 'Khung Ruby Hoàng Gia 💎', xpCost: 1200, style: 'border-4 border-rose-500 shadow-rose-500/50' },
    { id: 'frame-galaxy', name: 'Khung Vũ Trụ Galaxy 🌌', xpCost: 2000, style: 'border-4 border-purple-500 shadow-purple-500/50' }
  ];

  // DAILY QUESTS (DIRECTIVE 2.8)
  const [dailyQuests, setDailyQuests] = useState([
    { id: 'q1', title: 'Hoàn thành 1 bài luyện đễ hoặc trắc nghiệm', xpReward: 100, isDone: true },
    { id: 'q2', title: 'Chơi 1 trò chơi giáo dục HTML5', xpReward: 150, isDone: false },
    { id: 'q3', title: 'Đạt điểm tối đa (100%) trong 1 bài thi', xpReward: 200, isDone: false }
  ]);

  // BADGES LIST (DIRECTIVE 2.4)
  const badgesList = [
    { id: 'b1', name: 'Cú Đêm Chăm Chỉ 🌙', desc: 'Đăng nhập & học tập sau 22h00', icon: '🌙' },
    { id: 'b2', name: 'Chuyên Gia Trắc Nghiệm 🎯', desc: 'Đạt 10/10 câu trắc nghiệm', icon: '🎯' },
    { id: 'b3', name: 'Top 1 Game 🏆', desc: 'Đạt điểm TOP 1 trong trò chơi', icon: '🏆' },
    { id: 'b4', name: 'Thần Đồng Từ Vựng 📚', desc: 'Thuộc hơn 100 từ vựng SGK', icon: '📚' }
  ];

  // TEACHER XP BONUS GRANTING STATE (DIRECTIVE 2.10)
  const [grantStudentName, setGrantStudentName] = useState('Phạm Thanh Tú');
  const [grantXpAmount, setGrantXpAmount] = useState(50);
  const [grantReason, setGrantReason] = useState('Phát biểu xây dựng bài xuất sắc');

  if (!isOpen) return null;

  // Buy Shop Frame
  const handleBuyFrame = (frame) => {
    if (unlockedFrames.includes(frame.id)) {
      setEquippedFrame(frame.id);
      soundFX.playClick();
      alert(`✨ ĐÃ TRANG BỊ: ${frame.name}!`);
      return;
    }

    if (currentXp < frame.xpCost) {
      alert(`❌ Bạn chưa đủ điểm XP! Cần thêm ${frame.xpCost - currentXp} XP để đổi.`);
      return;
    }

    soundFX.playClick();
    setCurrentXp(currentXp - frame.xpCost);
    setUnlockedFrames([...unlockedFrames, frame.id]);
    setEquippedFrame(frame.id);
    try { soundFX.playFanfare(); } catch (err) {}
    confetti({ particleCount: 120, spread: 80 });
    alert(`🎉 ĐỔI QUÀ THÀNH CÔNG: ${frame.name}! Đã trang bị vào Avatar của bạn.`);
  };

  // Claim Quest Reward
  const handleClaimQuest = (questId, reward) => {
    soundFX.playClick();
    setCurrentXp(currentXp + reward);
    setDailyQuests(dailyQuests.map(q => q.id === questId ? { ...q, isDone: true } : q));
    try { soundFX.playFanfare(); } catch (err) {}
    confetti({ particleCount: 100, spread: 70 });
  };

  // Teacher Grant Bonus XP
  const handleTeacherGrantXp = (e) => {
    e.preventDefault();
    soundFX.playClick();
    try { soundFX.playFanfare(); } catch (err) {}
    confetti({ particleCount: 150, spread: 90 });
    alert(`⭐ GIÁO VIÊN ĐÃ TẶNG +${grantXpAmount} XP CHO HỌC SINH ${grantStudentName}! Lý do: "${grantReason}"`);
  };

  return (
    <div className="fixed top-16 inset-x-0 bottom-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-4 overflow-y-auto font-sans">
      <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-4xl w-full p-6 space-y-6 shadow-2xl animate-fadeIn max-h-[86vh] flex flex-col">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">GAMIFICATION & THI ĐUA HỌC TẬP 4.0</h3>
              <span className="text-[11px] text-slate-400 font-bold">Cấp độ (Level 1-100), Chuỗi Streak, Nhiệm vụ Hàng ngày & XP Shop</span>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STATUS DASHBOARD */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold shrink-0">
          
          {/* LEVEL & XP PROGRESS */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">CẤP ĐỘ HỌC VIÊN:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black">
                LEVEL {currentLevel}
              </span>
            </div>
            <div className="text-lg font-black text-white">{currentXp} XP</div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: `${(currentXp % 100)}%` }} />
            </div>
            <div className="text-[10px] text-slate-500 text-right">Còn {100 - (currentXp % 100)} XP lên Level {currentLevel + 1}</div>
          </div>

          {/* DAILY STREAK */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex items-center justify-between">
            <div>
              <div className="text-slate-400">CHUỖI HỌC TẬP (STREAK):</div>
              <div className="text-xl font-black text-orange-400 flex items-center gap-1.5 mt-1">
                <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
                {streakDays} Ngày Liên Tiếp!
              </div>
              <p className="text-[10px] text-slate-500 font-normal mt-1">Đăng nhập mỗi ngày để duy trì ngọn lửa!</p>
            </div>
          </div>

          {/* EQUIPPED AVATAR FRAME PREVIEW */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className={`w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-white font-black text-sm shrink-0 ${shopFrames.find(f => f.id === equippedFrame)?.style || ''}`}>
              Avatar
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">KHUNG VIỀN ĐANG KHÓA/ĐÃ TRANG BỊ:</div>
              <div className="text-xs font-black text-amber-300 mt-1">
                {shopFrames.find(f => f.id === equippedFrame)?.name || 'Khung Mặc Định'}
              </div>
            </div>
          </div>

        </div>

        {/* TEACHER BONUS XP GRANTING PANEL (DIRECTIVE 2.10) */}
        {(isTeacher || isAdmin) && (
          <form onSubmit={handleTeacherGrantXp} className="p-4 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-3 shrink-0">
            <h4 className="text-xs font-black text-purple-300 uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> QUYỀN GIÁO VIÊN: CỘNG ĐIỂM THƯỞNG XP TRỰC TIẾP CHO HỌC SINH
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
              <input
                type="text"
                value={grantStudentName}
                onChange={(e) => setGrantStudentName(e.target.value)}
                placeholder="Tên học sinh được thưởng..."
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
              />
              <input
                type="number"
                value={grantXpAmount}
                onChange={(e) => setGrantXpAmount(Number(e.target.value))}
                placeholder="Số điểm XP thưởng..."
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
              />
              <input
                type="text"
                value={grantReason}
                onChange={(e) => setGrantReason(e.target.value)}
                placeholder="Lý do cộng điểm..."
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-amber-300" /> Tặng XP Thưởng
              </button>
            </div>
          </form>
        )}

        {/* MAIN BODY: XP SHOP & DAILY QUESTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-1 text-xs font-bold">
          
          {/* CỬA HÀNG XP (XP SHOP - DIRECTIVE 2.4 & 2.6) */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" /> CỬA HÀNG VẬT PHẨM & KHUNG VIỀN AVATAR XP
            </h4>

            <div className="space-y-3">
              {shopFrames.map((frame) => {
                const isUnlocked = unlockedFrames.includes(frame.id);
                const isEquipped = equippedFrame === frame.id;
                return (
                  <div key={frame.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-xs font-black shrink-0 ${frame.style}`}>
                        AVT
                      </div>
                      <div>
                        <div className="text-white font-black">{frame.name}</div>
                        <div className="text-amber-400 text-[11px] font-extrabold">{frame.xpCost} XP</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuyFrame(frame)}
                      className={`px-4 py-2 rounded-xl font-black text-xs ${
                        isEquipped
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : isUnlocked
                          ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow'
                      }`}
                    >
                      {isEquipped ? '✓ Đang Dùng' : isUnlocked ? 'Trang Bị' : 'Đổi Vật Phẩm'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* NHIỆM VỤ HÀNG NGÀY & DANH HIỆU (DIRECTIVE 2.4 & 2.8) */}
          <div className="space-y-4">
            {/* NHIỆM VỤ HÀNG NGÀY */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" /> NHIỆM VỤ HÀNG NGÀY (DAILY QUESTS)
              </h4>

              <div className="space-y-2">
                {dailyQuests.map((quest) => (
                  <div key={quest.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 font-bold">{quest.title}</div>
                      <div className="text-amber-400 text-[10px] font-black">Thưởng: +{quest.xpReward} XP</div>
                    </div>

                    {quest.isDone ? (
                      <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px]">
                        ✓ Đã Nhận
                      </span>
                    ) : (
                      <button
                        onClick={() => handleClaimQuest(quest.id, quest.xpReward)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px]"
                      >
                        Nhận XP
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* DANH HIỆU & HUY HIỆU */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" /> BỘ TẬP HUY HIỆU & DANH HIỆU
              </h4>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {badgesList.map((b) => (
                  <div key={b.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                    <span className="text-xl">{b.icon}</span>
                    <div>
                      <div className="text-white font-black">{b.name}</div>
                      <div className="text-slate-400 font-normal text-[9px]">{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
