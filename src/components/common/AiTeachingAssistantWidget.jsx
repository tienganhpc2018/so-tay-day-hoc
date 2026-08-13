import React, { useState, useRef, useEffect } from 'react';
import { soundFX } from '../../utils/soundEffects';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  FileText, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  Upload,
  User,
  Zap
} from 'lucide-react';

export const AiTeachingAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDocumentName, setSelectedDocumentName] = useState('Đề Thi & Bài Học Tiếng Anh Global Success.pdf');

  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'bot',
      text: 'Xin chào em! Thầy Hải AI Trợ Giảng đây! Em có thắc mắc gì về bài học hoặc tài liệu PDF này không? Thầy sẽ giải thích chi tiết cho em ngay nhé! 🎓'
    }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    soundFX.playClick();
    const userMessage = inputMsg.trim();
    setChatHistory((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInputMsg('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = 'Thầy Hải AI đã phân tích câu hỏi của em! Trong tài liệu bài học này, trọng tâm ngữ pháp và từ vựng liên quan đến phần em hỏi là cấu trúc câu điều kiện và từ vựng chủ điểm. Em hãy xem lại bảng từ vựng ở Unit này nhé!';

      const textLower = userMessage.toLowerCase();
      if (textLower.includes('ngữ pháp') || textLower.includes('cấu trúc')) {
        botResponse = '📌 **Giải đáp Ngữ pháp từ AI:** Trong tài liệu PDF này, điểm ngữ pháp trọng tâm là Thì Hiện tại Hoàn thành (Present Perfect) và Cấu trúc So sánh (Comparatives/Superlatives). Công thức: `S + have/has + V3/ed`. Em ghi nhớ nhé!';
      } else if (textLower.includes('từ vựng') || textLower.includes('nghĩa')) {
        botResponse = '📚 **Giải đáp Từ vựng:** Các từ vựng then chốt trong bài gồm: `hospitable` (hiếu khách), `leisure time` (thời gian rảnh), `craft` (thủ công). Thầy khuyên em áp dụng mô hình Kiềng 3 Chân để ghi nhớ lâu hơn!';
      } else if (textLower.includes('đáp án') || textLower.includes('câu 1') || textLower.includes('câu 2')) {
        botResponse = '🎯 **Phân tích Đáp án từ PDF:** Theo tài liệu bài tập, câu 1 đáp án chính xác là **A** vì đi kèm với động từ `enjoy + V-ing`. Câu 2 chọn **C** vì diễn tả một hành động vừa xảy ra!';
      }

      setIsTyping(false);
      try { soundFX.playFanfare(); } catch (err) {}
      setChatHistory((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* FLOATING BOT BUTTON */}
      {!isOpen && (
        <button
          onClick={() => {
            soundFX.playClick();
            setIsOpen(true);
          }}
          className="group relative p-4 rounded-full bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-amber-300/60 animate-bounce"
        >
          <Bot className="w-7 h-7 text-amber-300" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
          
          {/* HOVER TOOLTIP */}
          <div className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-black text-xs whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
            🤖 AI Trợ Giảng - Giải Đáp PDF 24/7
          </div>
        </button>
      )}

      {/* CHATBOT DIALOG MODAL */}
      {isOpen && (
        <div className="bg-slate-900 border-2 border-indigo-500/60 rounded-3xl w-[360px] sm:w-[420px] h-[540px] shadow-2xl flex flex-col overflow-hidden animate-fadeIn text-xs font-bold">
          
          {/* HEADER */}
          <div className="p-4 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-amber-300">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  Thầy Hải AI Trợ Giảng <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Sẵn sàng giải đáp PDF bài học
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ACTIVE PDF CONTEXT BAR */}
          <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-semibold truncate flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">{selectedDocumentName}</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-black shrink-0">
              PDF Active
            </span>
          </div>

          {/* CHAT MESSAGES BODY */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-slate-950/60">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-600/30 text-amber-300 border border-indigo-500/40 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-br-none shadow'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-indigo-400 text-xs italic">
                <Bot className="w-4 h-4 animate-spin" />
                <span>Thầy Hải AI đang đọc file PDF & soạn câu trả lời...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* QUICK SUGGESTIONS */}
          <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => setInputMsg('Giải thích cho em điểm ngữ pháp trong bài!')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap"
            >
              💡 Ngữ pháp bài này?
            </button>
            <button
              onClick={() => setInputMsg('Từ vựng quan trọng nhất trong file PDF là gì?')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap"
            >
              📚 Từ vựng chính?
            </button>
            <button
              onClick={() => setInputMsg('Giải thích đáp án câu 1 giúp em')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap"
            >
              🎯 Giải thích câu 1
            </button>
          </div>

          {/* INPUT FORM */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Hỏi AI bất kỳ điều gì về bài học/PDF..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
