import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, AlertCircle, Sparkles } from 'lucide-react';
import { speakChinese, checkChineseVoiceSupport } from '../utils/speech';

interface AudioPronounceButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export default function AudioPronounceButton({
  text,
  size = 'md',
  label = 'Nghe đọc',
  className = '',
}: AudioPronounceButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supportInfo, setSupportInfo] = useState({ supported: true, hasZhVoice: true });

  useEffect(() => {
    // Only query voices in client-side context
    if (typeof window !== 'undefined') {
      const getSupported = () => {
        const check = checkChineseVoiceSupport();
        setSupportInfo(check);
      };

      getSupported();
      
      // Some browsers load voices asynchronously, attach event onvoiceschanged
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = getSupported;
      }
    }
  }, []);

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent flipping or card click triggers
    if (isSpeaking) return;

    setIsSpeaking(true);
    const success = await speakChinese(text);
    setIsSpeaking(false);
  };

  const getDimensionClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs rounded-lg gap-1';
      case 'lg':
        return 'px-6 py-3.5 text-base rounded-xl gap-2.5 shadow-md hover:shadow-lg';
      default:
        return 'px-4 py-2.5 text-sm rounded-xl gap-2';
    }
  };

  // Icon sizing
  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-3.5 h-3.5';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <button
        type="button"
        onClick={handleSpeak}
        disabled={!supportInfo.supported}
        className={`inline-flex items-center justify-center font-black uppercase transition-all transform border-2 border-black ${
          isSpeaking
            ? 'bg-[#4ADE80] text-black animate-pulse cursor-wait'
            : 'bg-[#FFD600] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] active:translate-y-0 active:shadow-none'
        } disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed ${getDimensionClasses()}`}
        title="Nghe phát âm chuẩn giọng Bắc Kinh"
        id={`speak-btn-${text}`}
      >
        {isSpeaking ? (
          <div className="flex items-center gap-1">
            {/* Soft waveform animation */}
            <span className="w-1 h-3 bg-black rounded-full animate-bounce delay-75" />
            <span className="w-1 h-4 bg-black rounded-full animate-bounce delay-150" />
            <span className="w-1 h-3 bg-black rounded-full animate-bounce delay-225" />
          </div>
        ) : (
          <Volume2 className={getIconSize()} />
        )}
        <span>{isSpeaking ? 'Đang đọc...' : label}</span>
      </button>

      {/* Conditional Warning if OS doesn't have Chinese voice packs installed */}
      {!supportInfo.hasZhVoice && supportInfo.supported && (
        <span className="text-[10px] text-[#FF4F4F] mt-2 font-bold text-center max-w-xs flex items-center justify-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          Máy bạn thiếu giọng nói Tiếng Trung (zh-CN). Hãy cài gói ngôn ngữ Trung Bắc Kinh.
        </span>
      )}
    </div>
  );
}
