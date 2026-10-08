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
  Volume2, 
  Play, 
  Pause, 
  FileText, 
  Edit3, 
  BookOpen, 
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { normalizeExamData, calculateExamPoints } from '../../utils/examAdapter';

export const QuizTakeModal = ({ isOpen, onClose, quiz, onQuizSubmitted }) => {
  if (!isOpen || !quiz) return null;

  const { profile } = useAuth();
  const [exam, setExam] = useState(() => normalizeExamData(quiz));
  const [activeSectionCode, setActiveSectionCode] = useState('A_LISTENING');
  const [userAnswers, setUserAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Live Timer Countdown
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const mins = quiz.time_limit_minutes || quiz.metadata?.time_limit_minutes || 45;
    return mins > 0 ? mins * 60 : 0;
  });

  // Audio Playback State for Listening
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const norm = normalizeExamData(quiz);
    setExam(norm);
    setUserAnswers({});
    setResult(null);

    const mins = norm.metadata?.time_limit_minutes || quiz.time_limit_minutes || 45;
    setSecondsLeft(mins > 0 ? mins * 60 : 0);
  }, [quiz]);

  // Live Timer Countdown Effect
  useEffect(() => {
    let timer = null;
    if (secondsLeft > 0 && !result) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [secondsLeft, result]);

  // Answer Selected Handlers
  const handleSelectAnswer = (qId, answerValue) => {
    try { soundFX.playClick(); } catch (e) {}
    setUserAnswers(prev => ({
      ...prev,
      [qId]: answerValue
    }));
  };

  // Submit Quiz Calculation
  const handleSubmitQuiz = async () => {
    soundFX.playClick();
    setSubmitting(true);

    let earnedScore = 0;
    const { grandTotal } = calculateExamPoints(exam);

    exam.sections.forEach(sec => {
      if (sec.code === 'D_WRITING') {
        (sec.parts || []).forEach(p => {
          if (p.part_num !== 3) {
            (p.questions || []).forEach(q => {
              const uAns = (userAnswers[q.id] || '').trim().toLowerCase();
              const cAns = (q.correct || q.suggested_answer || '').trim().toLowerCase();
              if (uAns && (uAns === cAns || (q.accepted_answers || []).some(a => a.toLowerCase() === uAns))) {
                earnedScore += (q.points || 0.25);
              }
            });
          }
        });
      } else {
        (sec.tasks || []).forEach(t => {
          (t.questions || []).forEach(q => {
            const uAns = (userAnswers[q.id] || '').trim();
            const cAns = (q.correct || '').trim();
            if (uAns && uAns === cAns) {
              earnedScore += (q.points || 0.25);
            }
          });
        });
      }
    });

    earnedScore = Math.round(earnedScore * 100) / 100;
    const finalScore10 = grandTotal > 0 ? Math.round((earnedScore / grandTotal) * 1000) / 100 : 10;
    const starsEarned = Math.round(finalScore10 * 2);

    const resObj = {
      score: finalScore10,
      rawScore: earnedScore,
      totalScore: grandTotal,
      starsEarned,
      submittedAt: new Date().toLocaleTimeString('vi-VN')
    };

    setResult(resObj);
    setSubmitting(false);
    confetti({ particleCount: 150, spread: 80 });

    if (onQuizSubmitted) onQuizSubmitted(resObj);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-sans">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-6xl w-full border-4 border-slate-800 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        
        {/* MODAL HEADER */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
              🎓 {exam.title}
            </h2>
            <p className="text-xs text-slate-400">
              Trường: {exam.metadata.school_name || 'THCS'} | Lớp: {exam.metadata.class_name || '8A5'} | Bộ sách: {exam.metadata.textbook}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {!result && secondsLeft > 0 && (
              <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-black text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                {formatTime(secondsLeft)}
              </div>
            )}

            <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-300">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SECTION NAV TABS */}
        <div className="flex items-center gap-2 p-3 bg-slate-950/60 border-b border-slate-800 text-xs font-black shrink-0 overflow-x-auto">
          {exam.sections.map((sec) => (
            <button
              key={sec.code}
              onClick={() => setActiveSectionCode(sec.code)}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeSectionCode === sec.code
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {sec.title}
            </button>
          ))}
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* RESULT SUMMARY VIEW AFTER SUBMIT */}
          {result ? (
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-4 max-w-lg mx-auto my-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">KẾT QUẢ BÀI THI CỦA EM</h3>
              <p className="text-4xl font-black text-amber-400 font-mono">{result.score} / 10.0 Điểm</p>
              <p className="text-xs text-slate-300">
                Thưởng thành tích: <span className="font-bold text-amber-300">+{result.starsEarned} Sao 🌟</span>
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs"
              >
                Hoàn Thành & Đóng
              </button>
            </div>
          ) : (
            <div>
              {/* CURRENT ACTIVE SECTION VIEW */}
              {exam.sections.map((sec) => {
                if (sec.code !== activeSectionCode) return null;

                return (
                  <div key={sec.code} className="space-y-6">
                    <div className="border-b border-slate-800 pb-2">
                      <h3 className="text-base font-black text-amber-300">{sec.title}</h3>
                      <p className="text-xs text-slate-400 italic">{sec.instruction}</p>
                    </div>

                    {/* SECTION A: LISTENING TASKS */}
                    {sec.code === 'A_LISTENING' && sec.tasks?.map((task, tIdx) => (
                      <div key={task.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                        <h4 className="text-xs font-black text-indigo-300 uppercase">{task.title}</h4>

                        {/* AUDIO PLAYER (TEACHER TRANSCRIPT HIDDEN FROM STUDENTS) */}
                        {task.audio_url && (
                          <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/40 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                                className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg"
                              >
                                {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                              </button>
                              <div>
                                <p className="text-xs font-bold text-white">Audio Recording (Listening Task)</p>
                                <span className="text-[10px] text-slate-400">Nghe kỹ đoạn băng để trả lời câu hỏi bên dưới</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* QUESTIONS */}
                        <div className="space-y-4 pt-2">
                          {task.questions?.map((q) => (
                            <div key={q.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                              <p className="text-xs font-bold text-white">Câu {q.num}: {q.question}</p>
                              {q.options && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  {q.options.map((opt, oIdx) => (
                                    <button
                                      key={oIdx}
                                      onClick={() => handleSelectAnswer(q.id, opt)}
                                      className={`p-3 rounded-xl border text-left transition-all ${
                                        userAnswers[q.id] === opt
                                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow'
                                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* SECTION B: KNOWLEDGE OF LANGUAGE (SINGLE PASSAGE PER CLOZE GROUP) */}
                    {sec.code === 'B_KNOWLEDGE' && sec.tasks?.map((task, tIdx) => (
                      <div key={task.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                        <h4 className="text-xs font-black text-indigo-300 uppercase">{task.title}</h4>

                        {/* CLOZE PASSAGE SHOWN ONCE */}
                        {task.passage?.content && (
                          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed font-serif">
                            <h5 className="font-bold text-amber-300 font-sans mb-1">{task.passage.title}</h5>
                            <p>{task.passage.content}</p>
                          </div>
                        )}

                        {/* CHILD QUESTIONS */}
                        <div className="space-y-3">
                          {task.questions?.map((q) => (
                            <div key={q.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                              <p className="font-bold text-white">Vị trí Vẫn Blank ({q.blank_num}):</p>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {q.options?.map((opt, oIdx) => (
                                  <button
                                    key={oIdx}
                                    onClick={() => handleSelectAnswer(q.id, opt)}
                                    className={`p-2.5 rounded-lg border text-center transition-all ${
                                      userAnswers[q.id] === opt
                                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow'
                                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* SECTION C: READING (SINGLE PASSAGE PER READING GROUP) */}
                    {sec.code === 'C_READING' && sec.tasks?.map((task, tIdx) => (
                      <div key={task.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                        <h4 className="text-xs font-black text-indigo-300 uppercase">{task.title}</h4>

                        {/* READING PASSAGE SHOWN ONCE */}
                        {task.passage?.content && (
                          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed font-serif">
                            <h5 className="font-bold text-amber-300 font-sans mb-1">{task.passage.title}</h5>
                            <p>{task.passage.content}</p>
                          </div>
                        )}

                        <div className="space-y-3">
                          {task.questions?.map((q) => (
                            <div key={q.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                              <p className="font-bold text-white">Câu {q.num}: {q.question}</p>
                              {q.options && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {q.options.map((opt, oIdx) => (
                                    <button
                                      key={oIdx}
                                      onClick={() => handleSelectAnswer(q.id, opt)}
                                      className={`p-2.5 rounded-xl border text-left transition-all ${
                                        userAnswers[q.id] === opt
                                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow'
                                          : 'bg-slate-950 text-slate-300 border-slate-800'
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* SECTION D: WRITING (3 PARTS) */}
                    {sec.code === 'D_WRITING' && sec.parts?.map((part) => (
                      <div key={part.part_num} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                        <h4 className="text-xs font-black text-indigo-300 uppercase">{part.title}</h4>
                        <p className="text-xs text-slate-400 italic">{part.instruction}</p>

                        {part.part_num === 3 ? (
                          <div className="space-y-3">
                            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-bold">
                              {part.prompt}
                            </div>
                            <textarea
                              rows={6}
                              value={userAnswers['writing_p3'] || ''}
                              onChange={(e) => handleSelectAnswer('writing_p3', e.target.value)}
                              className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white leading-relaxed focus:outline-none focus:border-amber-400"
                              placeholder="Gõ bài viết đoạn văn của em tại đây (80-100 từ)..."
                            />
                            <div className="text-right text-[11px] text-slate-400">
                              Số từ đã gõ: {(userAnswers['writing_p3'] || '').trim().split(/\s+/).filter(Boolean).length} từ
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {part.questions?.map((q) => (
                              <div key={q.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                                <p className="font-bold text-white">Câu {q.num}: {q.question || q.original_sentence}</p>
                                {q.prompt_keyword && (
                                  <p className="text-amber-300 font-bold">➔ {q.prompt_keyword}</p>
                                )}

                                {q.options ? (
                                  <div className="grid grid-cols-2 gap-2">
                                    {q.options.map((opt, oIdx) => (
                                      <button
                                        key={oIdx}
                                        onClick={() => handleSelectAnswer(q.id, opt)}
                                        className={`p-2.5 rounded-xl border text-left transition-all ${
                                          userAnswers[q.id] === opt
                                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                                            : 'bg-slate-950 text-slate-300 border-slate-800'
                                        }`}
                                      >
                                        {opt}
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <input
                                    type="text"
                                    value={userAnswers[q.id] || ''}
                                    onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                                    placeholder="Gõ câu trả lời viết lại của em..."
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        {!result && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-400">Hãy kiểm tra kỹ bài làm của cả 4 Section trước khi Nộp Bài.</span>
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-lg flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> {submitting ? 'Đang Nộp Bài...' : 'Nộp Bài Thi (Submit)'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
