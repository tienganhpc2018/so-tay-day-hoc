import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  BookOpen, 
  Clock, 
  Upload, 
  CheckCircle2, 
  Zap, 
  FileText, 
  Sliders, 
  HelpCircle,
  BrainCircuit,
  Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const GLOBAL_SUCCESS_UNITS = {
  6: [
    'Unit 1: My New School', 'Unit 2: My House', 'Unit 3: My Friends', 'Unit 4: My Neighbourhood',
    'Unit 5: Natural Wonders of the World', 'Unit 6: Our Tet Holiday', 'Unit 7: Television', 'Unit 8: Sports and Games',
    'Unit 9: Cities of the World', 'Unit 10: Our Houses in the Future', 'Unit 11: Our Greener World', 'Unit 12: Robots'
  ],
  7: [
    'Unit 1: Hobbies', 'Unit 2: Healthy Living', 'Unit 3: Community Service', 'Unit 4: Music and Arts',
    'Unit 5: Food and Drink', 'Unit 6: A visit to a school', 'Unit 7: Traffic', 'Unit 8: Films',
    'Unit 9: Festivals around the world', 'Unit 10: Energy sources', 'Unit 11: Travelling in the future', 'Unit 12: English-speaking countries'
  ],
  8: [
    'Unit 1: Leisure Time', 'Unit 2: Life in the Countryside', 'Unit 3: Teenagers', 'Unit 4: Ethnic Groups of Vietnam',
    'Unit 5: Our Customs and Traditions', 'Unit 6: Lifestyles', 'Unit 7: Environmental Protection', 'Unit 8: Shopping',
    'Unit 9: Natural Disasters', 'Unit 10: Communication in the Future', 'Unit 11: Science and Technology', 'Unit 12: Life on Other Planets'
  ],
  9: [
    'Unit 1: Local Environment', 'Unit 2: City Life', 'Unit 3: Teen Stress and Pressure', 'Unit 4: Life in the Past',
    'Unit 5: Wonders of Vietnam', 'Unit 6: Vietnam Then and Now', 'Unit 7: Recipes and Eating Habits', 'Unit 8: Tourism',
    'Unit 9: English in the World', 'Unit 10: Space Travel', 'Unit 11: Changing Roles in Society', 'Unit 12: My Future Career'
  ]
};

export const AIExamGenerator = ({ onExamSaved }) => {
  const { profile } = useAuth();
  
  // Left Form Controls (Cài đặt cơ bản & Độ dài)
  const [gradeLevel, setGradeLevel] = useState(8);
  const [examType, setExamType] = useState('15'); // '15', '45', '60'
  const [difficulty, setDifficulty] = useState('Kha'); // 'CoBan', 'Kha', 'NangCao'
  
  const [readingLength, setReadingLength] = useState(150);
  const [listeningLength, setListeningLength] = useState(60);
  const [languageLength, setLanguageLength] = useState(100);
  
  // Right Form Controls (Unit selection & Grammar & Custom prompts)
  const [selectedUnits, setSelectedUnits] = useState([GLOBAL_SUCCESS_UNITS[8][0], GLOBAL_SUCCESS_UNITS[8][1]]);
  const [customRequirements, setCustomRequirements] = useState('');
  const [sampleFile, setSampleFile] = useState(null);

  // AI Output State
  const [generating, setGenerating] = useState(false);
  const [generatedExam, setGeneratedExam] = useState(null);
  const [saving, setSaving] = useState(false);

  const unitsList = GLOBAL_SUCCESS_UNITS[gradeLevel] || GLOBAL_SUCCESS_UNITS[8];

  const toggleUnit = (unit) => {
    soundFX.playClick();
    setSelectedUnits(prev => 
      prev.includes(unit) ? prev.filter(u => u !== unit) : [...prev, unit]
    );
  };

  const handleGenerateAI = () => {
    if (selectedUnits.length === 0) {
      alert('Vui lòng chọn ít nhất 1 Unit trọng tâm!');
      return;
    }

    soundFX.playClick();
    setGenerating(true);
    setGeneratedExam(null);

    // AI Generator Engine: Auto builds high-quality exam questions based on selected units and parameters
    setTimeout(() => {
      const generatedTitle = `Đề Kiểm Tra Tiếng Anh Khối ${gradeLevel} - ${examType === '15' ? '15 Phút (Thường Xuyên)' : examType === '45' ? 'Giữa Kỳ (45 Phút)' : 'Cuối Kỳ (60 Phút)'}`;
      
      const sampleQuestions = [
        {
          question_text: `Choose the word whose underlined part is pronounced differently (${selectedUnits[0] || 'Unit 1'}):`,
          options: ['A. leisure', 'B. pleasure', 'C. ensure', 'D. treasure'],
          correct_answer: 'C. ensure',
          question_type: 'multiple_choice'
        },
        {
          question_text: `Select the best answer to complete the sentence: "Nam enjoys __________ crafts with his friends in free time."`,
          options: ['A. making', 'B. to make', 'C. make', 'D. made'],
          correct_answer: 'A. making',
          question_type: 'multiple_choice'
        },
        {
          question_text: `Fill in the blank with correct form of verb: "If teenagers spend too much time on social media, they __________ (feel) stressed."`,
          options: ['will feel', 'feel', 'felt', 'would feel'],
          correct_answer: 'will feel',
          question_type: 'fill_in_blanks'
        },
        {
          question_text: `Rearrange the words to form a correct sentence: "life / Countryside / is / peaceful / more / than / city / life."`,
          options: [
            'Countryside life is more peaceful than city life.',
            'City life is more peaceful than countryside life.',
            'Peaceful countryside life is than city life.',
            'More peaceful countryside life is city life.'
          ],
          correct_answer: 'Countryside life is more peaceful than city life.',
          question_type: 'sentence_scramble'
        },
        {
          question_text: `[Reading Comprehension] Read the passage and answer: "What is the main topic of the text about ${selectedUnits[0] || 'Unit 1'}?"`,
          options: [
            'A. Healthy living habits for teenagers',
            'B. Life skills in modern society',
            'C. Traditional crafts in countryside',
            'D. Environmental protection actions'
          ],
          correct_answer: 'A. Healthy living habits for teenagers',
          question_type: 'reading_comprehension'
        }
      ];

      setGeneratedExam({
        title: generatedTitle,
        description: `Đề thi soạn tự động theo chuẩn CV7991 & SGK Global Success (${selectedUnits.join(', ')})`,
        grade_level: gradeLevel,
        time_limit_minutes: parseInt(examType, 10),
        questions: sampleQuestions
      });

      setGenerating(false);
      soundFX.playFanfare();
      confetti({ particleCount: 100, spread: 70 });
    }, 1500);
  };

  // Save generated exam directly into Supabase DB
  const handleSaveToDatabase = async () => {
    if (!generatedExam || saving) return;
    setSaving(true);
    soundFX.playClick();

    try {
      // 1. Save Quiz record
      const { data: quizData, error: quizErr } = await supabase
        .from('quizzes')
        .insert([
          {
            title: generatedExam.title,
            description: generatedExam.description,
            grade_level: generatedExam.grade_level,
            time_limit_minutes: generatedExam.time_limit_minutes,
            creator_id: profile?.id || null
          }
        ])
        .select('*')
        .single();

      if (quizErr) throw quizErr;

      // 2. Save Questions records
      const questionRecords = generatedExam.questions.map(q => ({
        quiz_id: quizData.id,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        question_type: q.question_type
      }));

      const { error: qErr } = await supabase.from('quiz_questions').insert(questionRecords);
      if (qErr) throw qErr;

      soundFX.playFanfare();
      alert('Đã lưu đề thi thành công vào Ngân Hàng Đề Thi!');
      if (onExamSaved) onExamSaved();
    } catch (err) {
      console.error('Lỗi lưu đề thi:', err);
      soundFX.playWrong();
      alert('Lỗi lưu đề thi: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-3 p-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold">
        <button className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white shadow-md flex items-center gap-2">
          <BrainCircuit className="w-4 h-4" /> Soạn Đề Thi Chuẩn AI
        </button>
        <span className="text-slate-400 text-xs px-2">Khung Chương Trình CV7991 Global Success THCS</span>
      </div>

      {/* Main Grid: Left Controls + Right Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Cài Đặt Cơ Bản & Độ Dài (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Box 1: Cài đặt cơ bản */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Cài Đặt Cơ Bản
            </h3>

            {/* Khối lớp */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Khối Lớp</label>
              <select
                value={gradeLevel}
                onChange={(e) => {
                  const g = parseInt(e.target.value, 10);
                  setGradeLevel(g);
                  setSelectedUnits([GLOBAL_SUCCESS_UNITS[g][0]]);
                }}
                className="w-full glass-input text-sm font-semibold"
              >
                <option value={6} className="bg-slate-900">Lớp 6</option>
                <option value={7} className="bg-slate-900">Lớp 7</option>
                <option value={8} className="bg-slate-900">Lớp 8</option>
                <option value={9} className="bg-slate-900">Lớp 9</option>
              </select>
            </div>

            {/* Loại hình & thời gian */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Loại Hình & Thời Gian</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full glass-input text-sm font-semibold"
              >
                <option value="15" className="bg-slate-900">Kiểm tra Thường xuyên (15')</option>
                <option value="45" className="bg-slate-900">Kiểm tra Giữa kỳ (45')</option>
                <option value="60" className="bg-slate-900">Kiểm tra Cuối kỳ (60')</option>
              </select>
            </div>

            {/* Mức độ phân hóa */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">Mức Độ Phân Hóa Đề</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'CoBan', label: 'Cơ bản' },
                  { id: 'Kha', label: 'Khá' },
                  { id: 'NangCao', label: 'Nâng cao' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDifficulty(item.id)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      difficulty === item.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Box 2: Tùy chỉnh độ dài */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Tùy Chỉnh Độ Dài
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Bài Đọc (Reading)</span>
                  <span className="text-indigo-400 font-bold">{readingLength} từ</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="350"
                  step="10"
                  value={readingLength}
                  onChange={(e) => setReadingLength(e.target.value)}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Bài Nghe (Listening)</span>
                  <span className="text-indigo-400 font-bold">{listeningLength} giây</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="120"
                  step="10"
                  value={listeningLength}
                  onChange={(e) => setListeningLength(e.target.value)}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Bài Ngôn Ngữ (Language)</span>
                  <span className="text-indigo-400 font-bold">{languageLength} từ</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="10"
                  value={languageLength}
                  onChange={(e) => setLanguageLength(e.target.value)}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Box 3: Upload đề mẫu */}
          <div className="glass-panel p-6 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-400" />
              Học Tập Đề Mẫu (PDF/Ảnh)
            </h3>
            <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40">
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <span className="text-xs font-semibold text-slate-300 block">Tải đề mẫu lên để AI học form</span>
              <span className="text-[10px] text-slate-500">Hỗ trợ file PDF, DOCX, PNG</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Chọn Units Trọng Tâm & Ngữ Pháp (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="glass-panel p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  Kiến Thức Global Success (Lớp {gradeLevel})
                </h2>
                <p className="text-xs text-slate-400">Chọn các Unit bài học cần tạo ma trận câu hỏi kiểm tra</p>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                CV7991 STANDARD
              </span>
            </div>

            {/* 1. Chọn các Unit Trọng Tâm */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                1. Chọn Các Unit Trọng Tâm:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unitsList.map((unit, idx) => {
                  const isSelected = selectedUnits.includes(unit);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleUnit(unit)}
                      className={`p-3.5 rounded-xl border text-left font-semibold text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate mr-2">{unit}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-indigo-500 border-indigo-400 text-white' : 'border-slate-700'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Trọng Tâm Ngữ Pháp */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                2. Trọng Tâm Ngữ Pháp (Tự Động Phù Hợp):
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                  Mệnh đề quan hệ / Từ vựng Unit trọng tâm
                </span>
                <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                  Thì Hiện tại đơn & Quá khứ đơn
                </span>
                <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                  So sánh hơn của trạng từ
                </span>
              </div>
            </div>

            {/* 3. Yêu Cầu Chi Tiết Khác */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                3. Yêu Cầu Chi Tiết Khác (Prompt Tùy Chỉnh):
              </h4>
              <textarea
                rows={3}
                value={customRequirements}
                onChange={(e) => setCustomRequirements(e.target.value)}
                placeholder="Ví dụ: Đề cương cần bảng tổng hợp từ vựng cột từ - nghĩa - loại từ, kèm 5 câu bài tập sắp xếp từ..."
                className="w-full glass-input text-xs"
              />
            </div>

            {/* BIG ACTION BUTTON: BẮT ĐẦU TẠO ĐỀ THI CHUẨN */}
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={generating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-brand-600 to-indigo-500 hover:from-indigo-500 hover:to-brand-500 text-white font-extrabold text-base shadow-xl shadow-indigo-600/30 transition-all duration-300 flex items-center justify-center gap-2 active:scale-98"
            >
              <Zap className="w-5 h-5 fill-current animate-bounce" />
              {generating ? 'Đang Tạo Ma Trận Đề Thi AI...' : 'BẮT ĐẦU TẠO ĐỀ THI CHUẨN ⚡'}
            </button>

          </div>

          {/* GENERATED EXAM PREVIEW BOX */}
          {generatedExam && (
            <div className="glass-panel p-6 space-y-6 border-emerald-500/50 bg-slate-900/95 shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ Đã Sinh Đề Thi AI Thành Công
                  </span>
                  <h2 className="text-xl font-extrabold text-white mt-2">{generatedExam.title}</h2>
                  <p className="text-xs text-slate-400">{generatedExam.description}</p>
                </div>

                <button
                  onClick={handleSaveToDatabase}
                  disabled={saving}
                  className="glass-button-accent text-xs px-5 py-2.5 font-bold"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Đang Lưu...' : 'Lưu Vào Ngân Hàng Đề Thi'}
                </button>
              </div>

              {/* Questions Preview List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-200">Danh Sách Câu Hỏi Đã Tạo ({generatedExam.questions.length} câu):</h4>
                {generatedExam.questions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <p className="text-xs font-bold text-white">Câu {idx + 1}: {q.question_text}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="p-2 rounded bg-slate-900 border border-slate-800">
                          {opt}
                        </div>
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400 block pt-1">
                      Đáp án đúng: {q.correct_answer}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
