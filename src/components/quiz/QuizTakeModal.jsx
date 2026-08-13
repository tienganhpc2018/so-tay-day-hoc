import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Sparkles, 
  Send, 
  X, 
  Shuffle, 
  Upload, 
  Image as ImageIcon,
  Check,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const QuizTakeModal = ({ isOpen, onClose, quiz, onQuizSubmitted }) => {
  const { profile } = useAuth();
  const [questionsList, setQuestionsList] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Live Timer Countdown State
  const [secondsLeft, setSecondsLeft] = useState(45 * 60);

  // Handwritten Photo State for Essay
  const [photoPreview, setPhotoPreview] = useState({});

  useEffect(() => {
    if (isOpen && quiz) {
      loadQuizQuestions();
      setUserAnswers({});
      setCurrentIdx(0);
      setResult(null);
      setPhotoPreview({});
      
      const mins = quiz.time_limit_minutes || 45;
      setSecondsLeft(mins > 0 ? mins * 60 : 0);
    }
  }, [isOpen, quiz]);

  // Live Countdown Timer Effect
  useEffect(() => {
    let timer = null;
    if (isOpen && secondsLeft > 0 && !result) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuizAuto();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, secondsLeft, result]);

  const loadQuizQuestions = () => {
    setLoading(true);
    let rawList = [];

    if (quiz.questions && Array.isArray(quiz.questions) && quiz.questions.length > 0) {
      quiz.questions.forEach(sec => {
        if (sec.tasks && Array.isArray(sec.tasks)) {
          sec.tasks.forEach(tsk => {
            if (tsk.questions && Array.isArray(tsk.questions)) {
              rawList.push(...tsk.questions);
            }
          });
        }
      });
    }

    if (rawList.length === 0) {
      rawList = [
        {
          id: 'q1',
          type: 'single_choice',
          qText: 'What is the synonym of "famous" in Grade 8 Unit 1?',
          options: ['A. Well-known', 'B. Unknown', 'C. Secret', 'D. Quiet'],
          correct: 'A. Well-known'
        },
        {
          id: 'q2',
          type: 'multi_choice',
          qText: 'Which of the following are healthy habits? (Select ALL correct)',
          options: ['A. Eating fresh vegetables', 'B. Drinking water', 'C. Staying up past midnight', 'D. Exercising'],
          correct: ['A. Eating fresh vegetables', 'B. Drinking water', 'D. Exercising']
        },
        {
          id: 'q3',
          type: 'true_false',
          qText: 'The present simple tense is used for daily routines.',
          options: ['Đúng (True)', 'Sai (False)'],
          correct: 'Đúng (True)'
        },
        {
          id: 'q4',
          type: 'fill_blank',
          qText: 'She enjoys _____ (read) books in her leisure time.',
          correct: 'reading'
        },
        {
          id: 'q5',
          type: 'essay',
          qText: 'Write a short paragraph about your favorite hobby or upload a photo of your handwritten paper.',
          allowPhoto: true
        }
      ];
    }

    // Shuffle questions if enabled
    if (quiz.shuffleQuestions) {
      rawList = [...rawList].sort(() => Math.random() - 0.5);
    }

    setQuestionsList(rawList);
    setLoading(false);
  };

  const handleSelectSingleOption = (qId, option) => {
    try { soundFX.playClick(); } catch (e) {}
    setUserAnswers(prev => ({
      ...prev,
      [qId]: option
    }));
  };

  const handleSelectMultiOption = (qId, option) => {
    try { soundFX.playClick(); } catch (e) {}
    const current = userAnswers[qId] || [];
    const updated = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option];
    setUserAnswers(prev => ({
      ...prev,
      [qId]: updated
    }));
  };

  const handleFillInput = (qId, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: value
    }));
  };

  const handleFileUpload = (qId, event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(prev => ({ ...prev, [qId]: url }));
      setUserAnswers(prev => ({ ...prev, [`${qId}_photo`]: file.name }));
      try { soundFX.playFanfare(); } catch (e) {}
    }
  };

  const handleSubmitQuizAuto = () => {
    alert('⏱️ Đã hết thời gian làm bài! Hệ thống đang tự động nộp bài cho em...');
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = async () => {
    if (submitting || !questionsList.length) return;
    setSubmitting(true);

    let correctCount = 0;
    questionsList.forEach((q) => {
      const uAns = userAnswers[q.id];
      if (q.type === 'single_choice' || q.type === 'true_false') {
        if (uAns && (uAns === q.correct || uAns.includes(q.correct))) correctCount++;
      } else if (q.type === 'fill_blank') {
        if (uAns && uAns.trim().toLowerCase() === (q.correct || '').trim().toLowerCase()) correctCount++;
      } else if (q.type === 'multi_choice') {
        if (Array.isArray(uAns) && uAns.length > 0) correctCount++;
      } else {
        if (uAns) correctCount++;
      }
    });

    const score = Number(((correctCount / questionsList.length) * 10).toFixed(1));
    const starsEarned = Math.round(score * 2);

    setResult({
      score,
      correctCount,
      totalCount: questionsList.length,
      starsEarned
    });

    setSubmitting(false);
    try { soundFX.playFanfare(); } catch (e) {}
    confetti({ particleCount: 150, spread: 90 });
    if (onQuizSubmitted) onQuizSubmitted(score);
  };

  if (!isOpen) return null;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQ = questionsList[currentIdx];

  return (
    <div className="fixed top-20 left-0 right-0 bottom-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-start justify-center p-3 sm:p-4 overflow-y-auto pt-2 pb-6">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-4xl w-full border-4 border-slate-800 shadow-2xl overflow-hidden relative font-sans max-h-[82vh] flex flex-col justify-between animate-fadeIn">
        
        {/* HEADER BAR WITH LIVE TIMER */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-600 text-white font-black text-[10px] uppercase">
              {quiz?.exam_code || 'BÀI THI THỦ CÔNG'}
            </span>
            <h3 className="text-base font-black text-white truncate max-w-md mt-0.5">
              {quiz?.title || 'BÀI KIỂM TRA TIẾNG ANH THCS'}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* LIVE COUNTDOWN TIMER */}
            <div className="px-4 py-1.5 rounded-2xl bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-500/40 flex items-center gap-1.5 shadow">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Thời gian: {formatTime(secondsLeft)}</span>
            </div>

            <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!result ? (
          /* ARENA PLAYING VIEW */
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
            
            {/* QUESTION PROGRESS & COUNTER */}
            <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-3">
              <span className="text-slate-400">
                Câu {currentIdx + 1} / {questionsList.length}
              </span>
              <span className="text-indigo-400 uppercase font-black">
                Dạng: {currentQ?.type || 'Trắc nghiệm'}
              </span>
            </div>

            {/* QUESTION TEXT */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 border-l-4 border-l-brand-500">
              <h2 className="text-lg sm:text-xl font-black text-white leading-relaxed">
                {currentQ?.qText || currentQ?.question}
              </h2>
            </div>

            {/* OPTIONS RENDERING BASED ON TYPE */}
            <div className="space-y-3">
              {/* SINGLE CHOICE OR TRUE/FALSE */}
              {(currentQ?.type === 'single_choice' || currentQ?.type === 'true_false' || !currentQ?.type) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(currentQ?.options || []).map((opt, oIdx) => {
                    const isSelected = userAnswers[currentQ.id] === opt;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectSingleOption(currentQ.id, opt)}
                        className={`p-4 rounded-2xl border-2 font-bold text-xs sm:text-sm flex items-center gap-3 transition-all text-left ${
                          isSelected
                            ? 'bg-brand-600/90 text-white border-brand-400 shadow-lg scale-101'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${isSelected ? 'bg-white text-brand-600' : 'bg-slate-900 text-slate-400'}`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* MULTI CHOICE (CHECKBOXES) */}
              {currentQ?.type === 'multi_choice' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(currentQ?.options || []).map((opt, oIdx) => {
                    const isChecked = (userAnswers[currentQ.id] || []).includes(opt);
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectMultiOption(currentQ.id, opt)}
                        className={`p-4 rounded-2xl border-2 font-bold text-xs sm:text-sm flex items-center gap-3 transition-all text-left ${
                          isChecked
                            ? 'bg-emerald-600/90 text-white border-emerald-400 shadow-lg'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center border ${isChecked ? 'bg-white text-emerald-600 border-white' : 'border-slate-600'}`}>
                          {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* FILL IN THE BLANK */}
              {currentQ?.type === 'fill_blank' && (
                <div className="space-y-2 bg-slate-950 p-5 rounded-3xl border border-slate-800">
                  <label className="text-xs font-bold text-slate-300">Nhập câu trả lời điền vào chỗ trống:</label>
                  <input
                    type="text"
                    placeholder="Gõ từ hoặc cụm từ điền vào đây..."
                    value={userAnswers[currentQ.id] || ''}
                    onChange={(e) => handleFillInput(currentQ.id, e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs font-bold text-emerald-400 focus:outline-none focus:border-brand-500"
                  />
                </div>
              )}

              {/* ESSAY & PHOTO UPLOAD */}
              {currentQ?.type === 'essay' && (
                <div className="space-y-4 bg-slate-950 p-5 rounded-3xl border border-slate-800">
                  <textarea
                    rows={4}
                    placeholder="Gõ bài làm tự luận dài vào đây..."
                    value={userAnswers[currentQ.id] || ''}
                    onChange={(e) => handleFillInput(currentQ.id, e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 focus:outline-none focus:border-brand-500"
                  />

                  {/* PHOTO UPLOADER */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-dashed border-slate-700 text-center space-y-2">
                    <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="text-xs font-bold text-slate-300">Tải Ảnh Chụp Bài Làm Thủ Công (Nếu có)</div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(currentQ.id, e)} 
                      className="hidden" 
                      id={`file_input_${currentQ.id}`}
                    />
                    <label 
                      htmlFor={`file_input_${currentQ.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow"
                    >
                      <Upload className="w-4 h-4" /> Chọn Ảnh Chụp Vở Bài Tập
                    </label>

                    {photoPreview[currentQ.id] && (
                      <div className="mt-2 text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Đã đính kèm ảnh bài làm!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* RESULT SUMMARY VIEW */
          <div className="p-8 text-center space-y-6 my-auto">
            <Award className="w-20 h-20 text-amber-400 mx-auto animate-bounce" />
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              🎉 HOÀN THÀNH BÀI THI THÀNH CÔNG!
            </h2>
            <div className="text-lg font-black text-emerald-400">
              Điểm số: {result.score} / 10 • Đúng {result.correctCount}/{result.totalCount} câu
            </div>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs shadow-xl"
            >
              Đóng và Quay lại Ngân Hàng Đề Thi
            </button>
          </div>
        )}

        {/* BOTTOM NAVIGATION FOOTER */}
        {!result && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs disabled:opacity-40"
            >
              ← Câu trước
            </button>

            {currentIdx < questionsList.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(questionsList.length - 1, prev + 1))}
                className="px-6 py-2 rounded-xl bg-brand-600 text-white font-black text-xs shadow"
              >
                Câu tiếp theo →
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> NỘP BÀI THI
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
