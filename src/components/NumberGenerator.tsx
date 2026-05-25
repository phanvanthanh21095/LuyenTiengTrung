import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, Eye, EyeOff, Play, Pause, AlertCircle, ChevronsRight, ArrowRight, Settings2, Sliders } from 'lucide-react';
import { convertNumberToChinese } from '../utils/chineseNumbers';
import AudioPronounceButton from './AudioPronounceButton';

// Default presets for the picker
const NUMBER_PRESETS = [
  { id: '1', label: '1 chữ số', min: 0, max: 9, placeholder: '0 - 9' },
  { id: '2', label: '2 chữ số', min: 10, max: 99, placeholder: '10 - 99' },
  { id: '3', label: '3 chữ số', min: 100, max: 999, placeholder: '100 - 999' },
  { id: '4', label: '4 chữ số', min: 1000, max: 9999, placeholder: '1.000 - 9.999' },
  { id: '5', label: '5 chữ số', min: 10000, max: 99999, placeholder: '10.000 - 99.999' },
  { id: '6', label: '6 chữ số', min: 100000, max: 999999, placeholder: '100.000 - 999.999' },
  { id: 'mixed', label: 'Hỗn hợp (Tất cả)', min: 0, max: 999999, placeholder: '0 - 999.999' },
  { id: 'custom', label: 'Tự chọn khoảng', min: 0, max: 999999, placeholder: 'Tùy biến...' },
];

export default function NumberGenerator() {
  const [selectedPreset, setSelectedPreset] = useState('3');
  const [customMin, setCustomMin] = useState(1);
  const [customMax, setCustomMax] = useState(500);
  const [currentNumber, setCurrentNumber] = useState(256);
  const [isRevealed, setIsRevealed] = useState(false);

  // Autoplay states
  const [isAutoplayActive, setIsAutoplayActive] = useState(false);
  const [autoplaySpeed, setAutoplaySpeed] = useState(5); // in seconds
  const [autoSpeak, setAutoSpeak] = useState(true);

  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get active range values
  const getRange = () => {
    const preset = NUMBER_PRESETS.find((p) => p.id === selectedPreset);
    if (preset && preset.id !== 'custom') {
      return { min: preset.min, max: preset.max };
    }
    return {
      min: Math.max(0, customMin),
      max: Math.max(customMin, customMax),
    };
  };

  // Generate random number
  const handleRandomize = () => {
    const { min, max } = getRange();
    const rangeSize = max - min + 1;
    const rand = Math.floor(Math.random() * rangeSize) + min;
    setCurrentNumber(rand);
    setIsRevealed(false);
  };

  // Audio autostart on reveal (for manual or automatic reveal)
  const handleReveal = () => {
    if (!isRevealed) {
      setIsRevealed(true);
      if (autoSpeak) {
        // Trigger voice pronunciation asynchronously
        import('../utils/speech').then(({ speakChinese }) => {
          const res = convertNumberToChinese(currentNumber);
          speakChinese(res.hz);
        });
      }
    } else {
      setIsRevealed(false);
    }
  };

  // Perform randomize on mount and on preset change
  useEffect(() => {
    handleRandomize();
  }, [selectedPreset]);

  // Handle autoplay logic
  useEffect(() => {
    if (isAutoplayActive) {
      // First cycle: Reveal if not revealed, or wait and move to next
      const intervalMs = autoplaySpeed * 1000;
      
      const runCycle = () => {
        // If not revealed, reveal it
        if (!isRevealed) {
          setIsRevealed(true);
          // Auto speak when revealed
          if (autoSpeak) {
            const res = convertNumberToChinese(currentNumber);
            import('../utils/speech').then(({ speakChinese }) => {
              speakChinese(res.hz);
            });
          }
          // Schedule next randomization halfway through interval or full
          autoplayTimerRef.current = setTimeout(() => {
            handleRandomize();
          }, intervalMs / 2);
        } else {
          // If already revealed, randomize new number and hide
          handleRandomize();
        }
      };

      autoplayTimerRef.current = setTimeout(() => {
        runCycle();
      }, intervalMs / 2);
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [isAutoplayActive, isRevealed, autoplaySpeed, currentNumber]);

  const { hz, py } = convertNumberToChinese(currentNumber);

  // Group number into formatted strings based on Locale for easy reading
  const displayFormattedNumber = currentNumber.toLocaleString('vi-VN');

  // Generate logical grouping text to help users learn the conversion breakdown
  const getBreakdown = (num: number) => {
    if (num === 0) return '0 = 零 (líng)';
    const parts = [];
    if (num >= 100000) {
      const hundredK = Math.floor(num / 100000);
      parts.push(`${hundredK * 100.0}k`);
    }
    const wàn = Math.floor((num % 100000) / 10000);
    if (wàn > 0) parts.push(`${wàn} Vạn (10.000)`);
    const qiān = Math.floor((num % 10000) / 1000);
    if (qiān > 0) parts.push(`${qiān} Nghìn`);
    const bǎi = Math.floor((num % 1000) / 100);
    if (bǎi > 0) parts.push(`${bǎi} Trăm`);
    const shí = Math.floor((num % 100) / 10);
    if (shí > 0) parts.push(`${shí} Chục`);
    const ones = num % 10;
    if (ones > 0) parts.push(`${ones} Đơn vị`);

    return parts.join(' + ');
  };

  return (
    <div className="space-y-6">
      {/* Selection Panel */}
      <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="font-black text-black text-sm uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Sliders className="w-5 h-5 text-[#3B82F6]" />
          DẢI CHỮ SỐ THỰC HÀNH:
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {NUMBER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset.id)}
              className={`p-3.5 text-xs font-black rounded-xl transition-all border-2 border-black text-left flex flex-col justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none ${
                selectedPreset === preset.id
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-[#E0E7FF] text-black hover:bg-[#C7D2FE]'
              }`}
              id={`preset-btn-${preset.id}`}
            >
              <span className="font-extrabold block">{preset.label}</span>
              <span className="text-[10px] font-mono mt-1 opacity-80 block">{preset.placeholder}</span>
            </button>
          ))}
        </div>

        {/* Custom Range Settings */}
        {selectedPreset === 'custom' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-[#FEF9C3] border-2 border-black rounded-xl grid grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-xs font-black text-black mb-1" htmlFor="custom-min">Bắt đầu (Min)</label>
              <input
                id="custom-min"
                type="number"
                min="0"
                max="999999"
                value={customMin}
                onChange={(e) => setCustomMin(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm bg-white border-2 border-black rounded-lg focus:outline-none font-bold font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-black mb-1" htmlFor="custom-max">Kết thúc (Max)</label>
              <input
                id="custom-max"
                type="number"
                min="0"
                max="999999"
                value={customMax}
                onChange={(e) => setCustomMax(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm bg-white border-2 border-black rounded-lg focus:outline-none font-bold font-mono"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Flashcard Container */}
      <div className="flex flex-col items-center">
        {/* Flashcard wrapper */}
        <div 
          onClick={handleReveal}
          className="w-full max-w-xl bg-white border-4 border-black rounded-[40px] p-8 sm:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] cursor-pointer relative overflow-hidden group select-none hover:-translate-y-1 hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] transition-all"
          title="Nhấp vào để lật xem phiên âm hoặc ẩn đi"
          id="flashcard-click-area"
        >
          <div className="flex flex-col items-center text-center space-y-6 relative z-10">
            {/* Range indicator badge */}
            <span className="px-4 py-1 rounded-full bg-[#FFD600] border-2 border-black text-black text-[11px] font-black tracking-wider uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {NUMBER_PRESETS.find((p) => p.id === selectedPreset)?.label}
            </span>

            {/* Giant Number Visual display */}
            <div className="py-2">
              <span className="text-[72px] sm:text-[96px] font-sans font-black tracking-tighter text-black leading-none" id="current-number-display">
                {displayFormattedNumber}
              </span>
            </div>

            {/* Helper Hint */}
            <span className="text-xs font-bold text-black py-1.5 px-3.5 bg-[#E0E7FF] border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#C7D2FE] flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {isRevealed ? 'Bấm vào thẻ để Ẩn kết quả' : 'BẤM VÀO THẺ ĐỂ LẬT XEM ĐÁP ÁN'}
            </span>

            {/* Separator */}
            <div className="w-full border-t-2 border-black my-2" />

            {/* Hidden / Revealed Core Mandarin Answer Area */}
            <div className="h-44 flex flex-col items-center justify-center w-full">
              <AnimatePresence mode="wait">
                {!isRevealed ? (
                  <motion.div
                    key="hidden-panel"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center space-y-3"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#E0E7FF] border-2 border-black text-black flex items-center justify-center animate-bounce shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <EyeOff className="w-7 h-7" />
                    </div>
                    <span className="text-sm font-black text-black uppercase">Đang ẩn phiên âm & Hán tự</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="revealed-panel"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="w-full space-y-3.5"
                  >
                    {/* Chinese Characters Hanzi */}
                    <div className="text-5xl sm:text-6xl font-black text-[#FF4F4F] select-all tracking-wide" id="revealed-hanzi">
                      {hz}
                    </div>

                    {/* Pinyin Phonetic with accents */}
                    <div className="text-2xl font-mono italic font-black text-[#3B82F6] tracking-wider" id="revealed-pinyin">
                      {py}
                    </div>

                    {/* Audio Player component */}
                    <div className="pt-2 flex justify-center">
                      <AudioPronounceButton text={hz} size="md" label="Phát âm chuẩn" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Action Controls Panel below card */}
        <div className="w-full max-w-xl mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Main Manual button triggers */}
          <button
            onClick={handleReveal}
            className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-black border-2 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none ${
              isRevealed
                ? 'bg-white text-black hover:bg-gray-100'
                : 'bg-[#FFD600] text-black hover:bg-[#FFE55C]'
            }`}
            id="reveal-toggle-btn"
          >
            {isRevealed ? (
              <>
                <EyeOff className="w-5 h-5 text-black" />
                <span>ẨN ĐÁP ÁN</span>
              </>
            ) : (
              <>
                <Eye className="w-5 h-5 text-black" />
                <span>HIỆN ĐÁP ÁN</span>
              </>
            )}
          </button>

          <button
            onClick={handleRandomize}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-[#4ADE80] hover:bg-[#2ecc71] text-black border-2 border-black rounded-2xl font-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
            id="next-random-btn"
          >
            <RefreshCw className="w-5 h-5 text-black" />
            <span>SỐ NGẪU NHIÊN KHÁC</span>
          </button>
        </div>

        {/* Breakdown hints for multi-digit ones */}
        {isRevealed && currentNumber > 9 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl mt-4 p-4.5 bg-[#FDBA74] border-2 border-black text-black rounded-2xl flex items-start gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            <AlertCircle className="w-5 h-5 text-black shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-black mb-0.5">Phân tích ghép số:</p>
              <p className="text-sm font-black font-mono tracking-tight text-black">{getBreakdown(currentNumber)}</p>
            </div>
          </motion.div>
        )}

        {/* Autoplay & Listening Hub Extra Customization Box */}
        <div className="w-full max-w-xl bg-white border-4 border-black rounded-3xl p-6 mt-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h4 className="font-black text-black text-sm mb-4 flex items-center justify-between">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Play className="w-4 h-4 text-[#3B82F6]" />
              CHẾ ĐỘ TỰ ĐỘNG PHÁT SỐ (AUTOPLAY)
            </span>
            <span className="text-[10px] bg-[#4ADE80] border-2 border-black text-black font-black px-2.5 py-0.5 rounded-full uppercase">
              Rảnh tay
            </span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-black flex items-center justify-between">
                <span>Khoảng thời gian đổi số:</span>
                <span className="text-black font-black font-mono bg-[#E0E7FF] border border-black px-1.5 py-0.5 rounded">{autoplaySpeed} giây</span>
              </label>
              <input
                type="range"
                min="3"
                max="15"
                step="1"
                value={autoplaySpeed}
                onChange={(e) => setAutoplaySpeed(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono font-bold">
                <span>3s (Nhanh)</span>
                <span>15s (Chậm)</span>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-3">
              <label className="relative flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSpeak}
                  onChange={(e) => setAutoSpeak(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black border border-black"></div>
                <span className="ms-3 text-xs font-bold text-black">Tự phát âm khi mở số</span>
              </label>

              <button
                type="button"
                onClick={() => setIsAutoplayActive(!isAutoplayActive)}
                className={`py-2 px-4 rounded-xl text-xs font-black border-2 border-black transition-all flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 ${
                  isAutoplayActive
                    ? 'bg-[#FFD600] text-black animate-pulse'
                    : 'bg-[#FEF9C3] text-black hover:bg-[#FFF]'
                }`}
              >
                {isAutoplayActive ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>DỪNG TỰ ĐỘNG</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>CHẠY TỰ ĐỘNG</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
