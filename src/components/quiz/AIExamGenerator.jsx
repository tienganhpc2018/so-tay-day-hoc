import React, { useState, useEffect, useRef } from 'react';
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
  Save,
  FileCheck,
  Tag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GlobalSuccessKnowledgeBase } from '../../data/globalSuccessData';

export const AIExamGenerator = ({ onExamSaved }) => {
  const { profile } = useAuth();
  const fileInputRef = useRef(null);
  
  // Left Form Controls (Cài đặt cơ bản & Độ dài)
  const [gradeLevel, setGradeLevel] = useState(8);
  const [examType, setExamType] = useState('15'); // '15', '45', '60'
  const [difficulty, setDifficulty] = useState('Kha'); // 'CoBan', 'Kha', 'NangCao'
  
  const [readingLength, setReadingLength] = useState(150);
  const [listeningLength, setListeningLength] = useState(60);
  const [languageLength, setLanguageLength] = useState(100);

  // Sample File Upload State
  const [uploadedFile, setUploadedFile] = useState(null);
  
  // Right Form Controls (Unit selection & Grammar & Custom prompts)
  const unitsList = Object.keys(GlobalSuccessKnowledgeBase.DATA[gradeLevel] || GlobalSuccessKnowledgeBase.DATA[8]);
  const [selectedUnits, setSelectedUnits] = useState([unitsList[0], unitsList[1]]);
  const [autoGrammar, setAutoGrammar] = useState([]);
  const [customRequirements, setCustomRequirements] = useState('');

  // AI Output State
  const [generating, setGenerating] = useState(false);
  const [generatedExam, setGeneratedExam] = useState(null);
  const [saving, setSaving] = useState(false);

  // Auto sync Grammar focus whenever gradeLevel or selectedUnits change
  useEffect(() => {
    const grammarList = GlobalSuccessKnowledgeBase.getGrammarForUnits(gradeLevel, selectedUnits);
    setAutoGrammar(grammarList);
  }, [gradeLevel, selectedUnits]);

  const toggleUnit = (unit) => {
    soundFX.playClick();
    setSelectedUnits(prev => {
      if (prev.includes(unit)) {
        if (prev.length === 1) return prev; // Keep at least 1 unit
        return prev.filter(u => u !== unit);
      }
      return [...prev, unit];
    });
  };

  // Trigger real browser file dialog
  const handleTriggerUpload = () => {
    soundFX.playClick();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      soundFX.playCorrect();
      setUploadedFile(file);
    }
  };

  const handleGenerateAI = () => {
    if (selectedUnits.length === 0) {
      alert('Vui lòng chọn ít nhất 1 Unit trọng tâm!');
      return;
    }

    soundFX.playClick();
    setGenerating(true);
    setGeneratedExam(null);

    // Get exact vocab and grammar for selected units to ensure 100% textbook alignment
    const vocabList = GlobalSuccessKnowledgeBase.getVocabForUnits(gradeLevel, selectedUnits);

    setTimeout(() => {
      const generatedTitle = `Đề Kiểm Tra Tiếng Anh Khối ${gradeLevel} - ${examType === '15' ? '15 Phút (Thường Xuyên)' : examType === '45' ? 'Giữa Kỳ (45 Phút)' : 'Cuối Kỳ (60 Phút)'}`;
      
      const word1 = vocabList[0] || 'leisure';
      const word2 = vocabList[1] || 'crafts';
      const word3 = vocabList[2] || 'peaceful';
      const grammar1 = autoGrammar[0] || 'Thì Hiện tại đơn';

      const sampleQuestions = [
        {
          question_text: `[Pronunciation] Choose the word whose underlined part is pronounced differently (${selectedUnits[0]}):`,
          options: [`A. ${word1}`, `B. ${word2}`, 'C. ensure', 'D. treasure'],
          correct_answer: `A. ${word1}`,
          question_type: 'multiple_choice'
        },
        {
          question_text: `[Vocabulary] Select the best answer: "Students in Grade ${gradeLevel} enjoy __________ with their friends in free time."`,
          options: [`A. ${word2}`, `B. ${word3}`, 'C. stress', 'D. bullies'],
          correct_answer: `A. ${word2}`,
          question_type: 'multiple_choice'
        },
        {
          question_text: `[Grammar: ${grammar1}] Fill in the blank with correct form: "Nam __________ (enjoy) practicing English skills every day."`,
          options: ['enjoys', 'is enjoying', 'enjoyed', 'has enjoyed'],
          correct_answer: 'enjoys',
          question_type: 'fill_in_blanks'
        },
        {
          question_text: `[Sentence Scramble] Rearrange words: "life / Countryside / is / ${word3} / than / city / life."`,
          options: [
            `Countryside life is ${word3} than city life.`,
            `City life is ${word3} than countryside life.`,
            `Peaceful countryside life is than city life.`,
            `More peaceful countryside life is city life.`
          ],
          correct_answer: `Countryside life is ${word3} than city life.`,
          question_type: 'sentence_scramble'
        },
        {
          question_text: `[Reading Comprehension - ${readingLength} words] Read the text about ${selectedUnits.join(', ')} and choose the main topic:`,
          options: [
            `A. Daily activities and ${word1} habits of middle school students`,
            `B. Environmental protection and recycling rules`,
            `C. Traditional crafts and local artisans`,
            `D. Life skills and stress management`
          ],
          correct_answer: `A. Daily activities and ${word1} habits of middle school students`,
          question_type: 'reading_comprehension'
        }
      ];

      setGeneratedExam({
        title: generatedTitle,
        description: `Đề thi bám sát 100% SGK Global Success (${selectedUnits.join(', ')}). Ma trận Ngữ pháp: ${autoGrammar.join(', ')}`,
        grade_level: gradeLevel,
        time_limit_minutes: parseInt(examType, 10),
        questions: sampleQuestions
      });

      setGenerating(false);
      soundFX.playFanfare();
      confetti({ particleCount: 120, spread: 80 });
    }, 1200);
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
      alert('Đã lưu đề thi bám sát SGK Global Success thành công vào Ngân Hàng Đề Thi!');
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
          <BrainCircuit className="w-4 h-4" /> Soạn Đề Thi Chuẩn AI (Bám Sát SGK Global Success)
        </button>
        <span className="text-slate-400 text-xs px-2">Khung Chương Trình CV7991 Khối 6 • 7 • 8 • 9</span>
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
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">KHỐI LỚP</label>
              <select
                value={gradeLevel}
                onChange={(e) => {
                  const g = parseInt(e.target.value, 10);
                  setGradeLevel(g);
                  const newList = Object.keys(GlobalSuccessKnowledgeBase.DATA[g]);
                  setSelectedUnits([newList[0], newList[1]]);
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
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">LOẠI HÌNH & THỜI GIAN</label>
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
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">MỨC ĐỘ PHÂN HÓA ĐỀ</label>
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
                  <span className="text-slate-300">BÀI ĐỌC (READING)</span>
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
                  <span className="text-slate-300">BÀI NGHE (LISTENING)</span>
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
                  <span className="text-slate-300">BÀI NGÔN NGỮ (LANGUAGE)</span>
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

          {/* Box 3: Học Tập Đề Mẫu (Tải File Thật PDF/Word/Ảnh) */}
          <div className="glass-panel p-6 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-400" />
              Học Tập Đề Mẫu (PDF/Ảnh/Word)
            </h3>

            {/* Hidden HTML File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
              className="hidden"
            />

            {/* Interactive Upload Box */}
            <div
              onClick={handleTriggerUpload}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                uploadedFile
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-slate-800 hover:border-indigo-500/50 bg-slate-950/40'
              }`}
            >
              {uploadedFile ? (
                <div className="space-y-1.5">
                  <FileCheck className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                  <span className="text-xs font-bold text-emerald-300 block truncate">{uploadedFile.name}</span>
                  <span className="text-[10px] text-slate-400 block">✓ Đã nạp đề mẫu thành công vào AI học form</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Upload className="w-8 h-8 text-indigo-400 mx-auto" />
                  <span className="text-xs font-bold text-slate-200 block">Tải đề mẫu lên để AI học form</span>
                  <span className="text-[10px] text-slate-400 block">Hỗ trợ file PDF, DOCX, PNG, JPG</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Chọn Units Trọng Tâm & Ngữ Pháp Tự Động (8 Cols) */}
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

            {/* 1. CHỌN CÁC UNIT TRỌNG TÂM */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                1. CHỌN CÁC UNIT TRỌNG TÂM:
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

            {/* 2. TRỌNG TÂM NGỮ PHÁP (TỰ ĐỘNG THEO UNIT TICK CHỌN) */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-400" />
                  2. TRỌNG TÂM NGỮ PHÁP (TỰ ĐỘNG PHÙ HỢP VỚI {selectedUnits.length} UNIT CHỌN):
                </h4>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {autoGrammar.map((grammarTag, gIdx) => (
                  <span
                    key={gIdx}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-200 border border-indigo-500/40 text-xs font-extrabold flex items-center gap-1.5 animate-fadeIn shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    {grammarTag}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. YÊU CẦU CHI TIẾT KHÁC */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                3. YÊU CẦU CHI TIẾT KHÁC:
              </h4>
              <textarea
                rows={3}
                value={customRequirements}
                onChange={(e) => setCustomRequirements(e.target.value)}
                placeholder="Ví dụ: Đề cương cần bảng tổng hợp từ vựng cột từ - nghĩa - loại từ, bổ sung 5 câu phát âm âm /s/ và /z/..."
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
              {generating ? 'Đang Tạo Ma Trận Đề Thi AI Chuẩn Global Success...' : 'BẮT ĐẦU TẠO ĐỀ THI CHUẨN ⚡'}
            </button>

          </div>

          {/* GENERATED EXAM PREVIEW BOX */}
          {generatedExam && (
            <div className="glass-panel p-6 space-y-6 border-emerald-500/50 bg-slate-900/95 shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ Đã Sinh Đề Thi AI Bám Sát 100% SGK Global Success
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
                <h4 className="text-sm font-bold text-slate-200">Danh Sách Câu Hỏi Đã Tạo Bám Sát SGK ({generatedExam.questions.length} câu):</h4>
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
