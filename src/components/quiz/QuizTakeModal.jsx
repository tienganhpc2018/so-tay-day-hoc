import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { supabase } from '../../lib/supabase';
import { soundFX } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Clock, CheckCircle2, AlertCircle, Award, Sparkles, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const QuizTakeModal = ({ isOpen, onClose, quiz, onQuizSubmitted }) => {
  const { profile, refreshProfile } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isOpen && quiz?.id) {
      fetchQuestions();
      setUserAnswers({});
      setCurrentIdx(0);
      setResult(null);
    }
  }, [isOpen, quiz]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quiz.id);

      if (error) throw error;

      // Ensure options are parsed safely
      const parsed = (data || []).map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : (typeof q.options === 'string' ? JSON.parse(q.options) : [])
      }));

      setQuestions(parsed);
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, option) => {
    soundFX.playClick();
    setUserAnswers(prev => ({
      ...prev,
      [qId]: option
    }));
  };

  const handleSubmitQuiz = async () => {
    if (submitting || !questions.length) return;
    setSubmitting(true);

    let correctCount = 0;
    questions.forEach(q => {
      const userAns = (userAnswers[q.id] || '').trim().toLowerCase();
      const correctAns = (q.correct_answer || '').trim().toLowerCase();
      if (userAns === correctAns) {
        correctCount++;
      }
    });

    const score = Number(((correctCount / questions.length) * 10).toFixed(1));
    const starsEarned = Math.round(score * 2); // E.g., 10 score -> 20 stars

    try {
      // Save result
      const { error: resultErr } = await supabase.from('student_quiz_results').insert([
        {
          quiz_id: quiz.id,
          student_id: profile.id,
          score,
          stars_earned: starsEarned,
          answers: userAnswers
        }
      ]);

      if (resultErr) throw resultErr;

      // Update student total stars in profiles
      const { error: profileErr } = await supabase
        .from('profiles')
        .update({
          total_stars: (profile.total_stars || 0) + starsEarned
        })
        .eq('id', profile.id);

      if (profileErr) console.warn('Profile star update error:', profileErr);

      soundFX.playFanfare();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });

      setResult({ score, starsEarned, correctCount, total: questions.length });
      await refreshProfile();
      if (onQuizSubmitted) onQuizSubmitted();
    } catch (err) {
      soundFX.playWrong();
      console.error('Error submitting quiz:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !quiz) return null;

  const currentQ = questions[currentIdx];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={quiz.title} maxWidth="max-w-3xl">
      {loading ? (
        <div className="py-12 text-center text-slate-400">Đang tải câu hỏi kiểm tra...</div>
      ) : result ? (
        <div className="py-8 text-center space-y-5 animate-fadeIn">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/25">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white">Hoàn Thành Bài Kiểm Tra!</h2>
            <p className="text-sm text-slate-300 mt-1">
              Em đã trả lời đúng <span className="text-emerald-400 font-bold">{result.correctCount}/{result.total}</span> câu hỏi.
            </p>
          </div>

          <div className="flex justify-center items-center gap-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block">Điểm số</span>
              <span className="text-3xl font-black text-brand-400">{result.score}/10</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-xs text-slate-400 block">Thưởng Sao</span>
              <span className="text-3xl font-black text-amber-400 flex items-center gap-1">
                +{result.starsEarned} <Sparkles className="w-5 h-5 fill-amber-400" />
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="w-full glass-button-primary py-3 font-bold"
          >
            Đóng Bài Thi & Xem Điểm
          </button>
        </div>
      ) : questions.length === 0 ? (
        <div className="py-8 text-center text-slate-400">
          Bài thi này chưa có câu hỏi nào. Giáo viên sẽ cập nhật sớm!
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 pb-2 border-b border-slate-800">
            <span>Câu {currentIdx + 1} / {questions.length}</span>
            <div className="flex items-center gap-1 text-amber-400">
              <Clock className="w-4 h-4" />
              <span>Thời gian làm bài: {quiz.time_limit_minutes || 15} phút</span>
            </div>
          </div>

          {/* Question Content */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-base font-bold text-white">
              {currentQ.question_text}
            </div>

            {/* Answer Modes */}
            {currentQ.question_type === 'multiple_choice' || currentQ.question_type === 'reading_comprehension' ? (
              <div className="grid grid-cols-1 gap-2.5">
                {(currentQ.options || []).map((opt, i) => {
                  const isSelected = userAnswers[currentQ.id] === opt;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(currentQ.id, opt)}
                      className={`w-full p-3.5 rounded-xl border text-left font-medium text-sm transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-brand-600/30 border-brand-500 text-white shadow-md shadow-brand-500/10'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-400" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400">
                  Nhập câu trả lời của em:
                </label>
                <input
                  type="text"
                  value={userAnswers[currentQ.id] || ''}
                  onChange={(e) => setUserAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                  placeholder="Điền đáp án chính xác..."
                  className="w-full glass-input"
                />
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                soundFX.playClick();
                setCurrentIdx(prev => Math.max(0, prev - 1));
              }}
              disabled={currentIdx === 0}
              className="glass-button-secondary text-xs px-4 py-2"
            >
              Câu Trước
            </button>

            {currentIdx === questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="glass-button-accent text-xs px-6 py-2"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Đang Nộp...' : 'Nộp Bài Thi'}
              </button>
            ) : (
              <button
                onClick={() => {
                  soundFX.playClick();
                  setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1));
                }}
                className="glass-button-primary text-xs px-4 py-2"
              >
                Câu Tiếp Theo
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
