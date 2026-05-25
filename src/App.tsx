import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Trophy, Sparkles, Languages, Info, ExternalLink, HelpCircle, GraduationCap, AudioLines } from 'lucide-react';
import NumberGenerator from './components/NumberGenerator';
import QuizPanel from './components/QuizPanel';
import CheatSheet from './components/CheatSheet';

type MainTab = 'practice' | 'quiz';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('practice');

  return (
    <div className="min-h-screen bg-[#FEF9C3] text-black pb-16 selection:bg-[#4ADE80]">
      {/* Visual Header Decoration Removed for clean background */}

      {/* Main Core Navigation bar / Header */}
      <header className="relative border-b-4 border-black bg-white z-10 sticky top-0 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            {/* Visual Icon Launcher resembling Chinese character / dynamic numbers */}
            <div className="w-12 h-12 bg-[#FF4F4F] border-2 border-black rounded-full flex items-center justify-center text-white text-2xl font-bold italic shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              中
            </div>
            <div>
              <h1 className="font-black text-2xl sm:text-3xl tracking-tighter text-black flex items-center gap-1.5" id="app-logo-text">
                NUMBERS <span className="text-[#3B82F6]">FLASH</span>
                <span className="text-[10px] font-mono font-bold bg-[#4ADE80] border-2 border-black text-black px-2.5 py-0.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                  中文数字
                </span>
              </h1>
              <p className="text-xs font-bold text-gray-700">Luyện đếm, phản xạ và nghe phát âm chuẩn Pinyin</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-mono font-bold text-black bg-white px-3 py-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5">
              <AudioLines className="w-4 h-4 text-[#FF4F4F]" />
              Standard Mandarin Voice 🇨🇳
            </span>
          </div>
        </div>
      </header>

      {/* Hero Welcome banner */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="bg-[#3B82F6] text-white border-4 border-black rounded-[30px] p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden mb-8">
          {/* Abs decorator circles */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full filter blur-xl" />
          <div className="absolute top-4 right-1/4 w-28 h-28 bg-emerald-500/20 rounded-full filter blur-lg" />

          <div className="max-w-xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFD600] border-2 border-black text-black text-xs font-black uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-black" />
              Luyện Trực Quan & Sẵn Giọng Nói
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">Học Hệ Thống Số Đếm Tiếng Trung Quốc!</h2>
            <p className="text-white text-sm sm:text-base font-bold leading-relaxed">
              Bối rối trước quy tắc đếm hàng <span className="underline decoration-2 decoration-[#FFD600] text-[#FFD600] font-black">VẠN (10.000)</span> trong tiếng Trung? Hãy chọn dải chữ số phù hợp, phát ngẫu nhiên số, nghe đọc giọng bản ngữ và click lật xem phiên âm để kiểm tra lập tức!
            </p>
          </div>
        </div>

        {/* Dynamic Mode Switcher */}
        <div className="flex bg-white border-4 border-black p-1.5 rounded-2xl max-w-md mx-auto mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-black transition-all ${
              activeTab === 'practice'
                ? 'bg-[#3B82F6] text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'text-black hover:bg-gray-100 hover:text-black'
            }`}
            id="main-tab-practice-btn"
          >
            <Sparkles className="w-4 h-4" />
            <span>Luyện Số Ngẫu Nhiên</span>
          </button>
          
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-black transition-all ${
              activeTab === 'quiz'
                ? 'bg-[#3B82F6] text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'text-black hover:bg-gray-100 hover:text-black'
            }`}
            id="main-tab-quiz-btn"
          >
            <Trophy className="w-4 h-4" />
            <span>Đấu Trường Phản Xạ</span>
          </button>
        </div>

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Core Panel column: Width 2xl/3xl */}
          <main className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'practice' ? (
                <motion.div
                  key="practice-deck"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.23 }}
                >
                  <div className="space-y-4">
                    <div className="bg-white border-4 border-black text-black font-semibold rounded-2xl p-4 text-xs leading-relaxed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      💡 <strong>Hướng dẫn thực hành:</strong> Chọn quy mô chữ số mong muốn (1, 2, 3...) dưới đây. Click trực tiếp vào <strong>Vùng Thẻ Đen</strong> để lật tiết lộ chữ viết Hán tự & phiên âm Pinyin, hoặc nhấn nút chạy tự động Rảnh tay.
                    </div>
                    <NumberGenerator />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="quiz-deck"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.23 }}
                >
                  <div className="space-y-4">
                    <div className="bg-white border-4 border-black text-black font-semibold rounded-2xl p-4 text-xs leading-relaxed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      ⚡ <strong>Luyện phản xạ nhanh:</strong> Trò chơi trắc nghiệm 3 chế độ đỉnh cao giúp ghim chặt phát âm số vào sâu trí nhớ phản xạ tự nhiên của bạn.
                    </div>
                    <QuizPanel />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Sidebar Rules column */}
          <aside className="space-y-6">
            <CheatSheet />

            {/* Extra FAQ advice card */}
            <div className="bg-white border-4 border-black rounded-3xl p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black">
              <h4 className="font-extrabold text-sm uppercase underline text-black mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                Mẹo nhớ âm điệu chuẩn xác?
              </h4>
              <p className="text-xs font-medium text-gray-700 leading-relaxed space-y-2">
                Nên bắt đầu nháp từ nhóm có 1-2 chữ số để thành thạo dấu thanh điệu (Thanh 1, 2, 3, 4) trong tiếng Trung.
                Sau đó hãy gạt lướt thử dải số cao hơn. Hãy nghe đi nghe lại âm thanh từ loa phát mẫu để tai làm quen với tần số âm điệu Trung Quốc nhé!
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer copyright section */}
      <footer className="max-w-6xl mx-auto px-4 mt-16 pt-8 border-t-2 border-slate-300 text-center text-xs font-bold uppercase tracking-wide opacity-50">
        <p>© 2026 Luyện Số Tiếng Trung Học Thuật // SHUFFLE ENGINE V2.4</p>
        <p className="mt-1">Phát âm chuẩn xác Mandarin / PinYin Audio</p>
      </footer>
    </div>
  );
}
