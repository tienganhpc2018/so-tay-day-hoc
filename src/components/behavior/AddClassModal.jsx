import React, { useState } from 'react';
import { X, Plus, Upload, Check, UserPlus } from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

export const AddClassModal = ({ isOpen, onClose, onAddClass }) => {
  const [className, setClassName] = useState('');
  const [fullClassName, setFullClassName] = useState('');
  const [rawStudentNames, setRawStudentNames] = useState('');
  const [studentList, setStudentList] = useState([
    { id: 1, gender: 'Nam', name: 'Danh sách mẫu' },
    { id: 2, gender: 'Nam', name: 'Gia Khôi' },
    { id: 3, gender: 'Nữ', name: 'Ánh Dương' }
  ]);

  if (!isOpen) return null;

  // Add bulk text list into preview roster
  const handleParseNames = () => {
    if (!rawStudentNames.trim()) return;
    soundFX.playClick();
    const lines = rawStudentNames.split('\n').filter(l => l.trim().length > 0);
    const newItems = lines.map((name, idx) => ({
      id: Date.now() + idx,
      gender: 'Nam',
      name: name.trim()
    }));
    setStudentList(prev => [...prev, ...newItems]);
    setRawStudentNames('');
  };

  // Toggle Gender (Nam <-> Nữ) as indicated in Screenshot 1
  const toggleGender = (id) => {
    soundFX.playClick();
    setStudentList(prev => prev.map(item => item.id === id ? { ...item, gender: item.gender === 'Nam' ? 'Nữ' : 'Nam' } : item));
  };

  // Create Class Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!className.trim()) {
      alert('Vui lòng nhập Tên lớp!');
      return;
    }
    soundFX.playClick();
    const newClassData = {
      id: `class_${Date.now()}`,
      className: className.trim(),
      fullClassName: fullClassName.trim() || `Lớp ${className.trim()}`,
      students: studentList.map((st, idx) => ({
        id: `st_${Date.now()}_${idx}`,
        code: (idx + 101).toString(),
        full_name: st.name,
        gender: st.gender,
        plus_points: 0,
        minus_points: 0,
        status: 'Present',
        avatar: st.gender === 'Nam' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
      }))
    };

    onAddClass(newClassData);
    onClose();
  };

  return (
    <div className="fixed top-14 inset-x-0 bottom-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-6 overflow-y-auto font-sans">
      <div className="bg-white text-slate-900 rounded-3xl max-w-3xl w-full p-8 space-y-6 shadow-2xl animate-fadeIn relative">
        
        {/* CLOSE BUTTON */}
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600">
          <X className="w-5 h-5" />
        </button>

        {/* HEADER MATCHING SCREENSHOT 1 */}
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Thêm Lớp Học Mới</h2>
          <p className="text-xs text-slate-600 leading-relaxed font-bold">
            Thầy cô hãy nhập "Tên lớp", sau đó nhập Danh sách học sinh vào ô Danh sách và bấm nút màu xanh "Thêm vào Danh sách". Thầy cô hãy kiểm tra và sửa lại "Giới tính Học sinh", bấm chuột vào "Nam" để đổi thành "Nữ". Cuối cùng, hãy bấm "Tạo lớp học mới". Thầy cô cũng có thể sửa lại các thông tin của lớp học, danh sách lớp sau này.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-bold">
          
          {/* INPUT: TÊN LỚP */}
          <div>
            <label className="block text-slate-800 mb-1">
              Tên lớp <span className="text-rose-500 font-normal">(Tên ngắn gọn, ví dụ: 4A1, 9A6)</span>
            </label>
            <input
              type="text"
              placeholder="4A1, TA1..."
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-rose-500 text-sm font-bold"
              required
            />
          </div>

          {/* INPUT: TÊN LỚP ĐẦY ĐỦ */}
          <div>
            <label className="block text-slate-800 mb-1">
              Tên lớp đầy đủ <span className="text-slate-500 font-normal">(Nếu cần, ví dụ: Lớp Toán-Tiếng Việt 4A1)</span>
            </label>
            <input
              type="text"
              placeholder="Nếu không cần, hãy để trống"
              value={fullClassName}
              onChange={(e) => setFullClassName(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-rose-500 text-sm"
            />
          </div>

          {/* INPUT: DANH SÁCH HS & PREVIEW ROSTER MATCHING SCREENSHOT 1 */}
          <div className="space-y-2">
            <label className="block text-slate-800">
              Danh sách HS <span className="text-rose-500 font-normal">(Mỗi tên trên 1 dòng)</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* TEXTAREA INPUT (LEFT) */}
              <div className="md:col-span-6 space-y-3">
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center gap-2 text-[11px]">
                  <input type="checkbox" id="excel" className="rounded text-rose-600" />
                  <label htmlFor="excel">Lấy dữ liệu từ Excel / Dán danh sách</label>
                </div>

                <textarea
                  rows={5}
                  placeholder={`Danh sách HS ở đây. Hãy nhập tên gọi ở lớp, HỌ VÀ TÊN đầy đủ sẽ nhập sau. Sau đó bấm Thêm vào DS`}
                  value={rawStudentNames}
                  onChange={(e) => setRawStudentNames(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-rose-500 text-xs"
                />

                <button
                  type="button"
                  onClick={handleParseNames}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md"
                >
                  Thêm vào Danh sách
                </button>
              </div>

              {/* PREVIEW ROSTER (RIGHT MATCHING SCREENSHOT 1) */}
              <div className="md:col-span-6 space-y-2 max-h-60 overflow-y-auto pr-1">
                {studentList.map((st, idx) => (
                  <div key={st.id} className="p-3 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between font-bold text-xs shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-rose-600 font-black w-4">{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => toggleGender(st.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-black border transition-all ${
                          st.gender === 'Nam' ? 'bg-sky-100 text-sky-700 border-sky-300' : 'bg-rose-100 text-rose-700 border-rose-300'
                        }`}
                      >
                        {st.gender}
                      </button>
                      <span className="text-slate-900 font-extrabold">{st.name}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStudentList(studentList.filter(s => s.id !== st.id))}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-normal pt-2">
            Thầy cô bấm nút để tạo lớp học. Nếu cần thay đổi tên lớp, danh sách HS, thầy cô cũng có thể thay đổi lại sau.
          </p>

          {/* SUBMIT BUTTON MATCHING SCREENSHOT 1 */}
          <div className="pt-2">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-sm shadow-xl animate-pulse"
            >
              Tạo Lớp Học Mới
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
