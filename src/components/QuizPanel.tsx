import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, CheckCircle, XCircle, Award, Volume2, HelpCircle, Trophy, Sparkles } from 'lucide-react';
import { convertNumberToChinese, getRandomNumberWithZeroBias } from '../utils/chineseNumbers';
import { speakChinese } from '../utils/speech';

// Quiz mode definitions
type QuizType = 'number-to-pinyin' | 'audio-to-number' | 'hanzi-to-number';

interface QuizQuestion {
  correctNumber: number;
  options: {
    number: number;
    hz: string;
    py: string;
  }[];
}

const PRESET_RANGES = [
  { label: 'Dễ (0 - 9)', min: 0, max: 9 },
  { label: 'Trung bình (10 - 99)', min: 10, max: 99 },
  { label: 'Thử thách (100 - 999)', min: 100, max: 999 },
  { label: 'Siêu việt (1.000 - 99.999)', min: 1000, max: 99999 },
  { label: 'Hàng Triệu (1 Tr - 99 Tr)', min: 1000000, max: 99999999 },
  { label: 'Hàng Tỷ (100 Tr - 10 Tỷ)', min: 100000000, max: 10000000000 },
];

export default function QuizPanel() {
  const [activeTab, setActiveTab] = useState<QuizType>('number-to-pinyin');
  const [selectedRange, setSelectedRange] = useState(1); // Default to Medium (10-99)
  
  // Quiz session stats state
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Active question state
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Helper inside range
  const getMinMax = () => {
    const range = PRESET_RANGES[selectedRange];
    return { min: range.min, max: range.max };
  };

  // Generate a distinct list of distractors
  const generateQuestion = () => {
    const { min, max } = getMinMax();
    const correctVal = getRandomNumberWithZeroBias(min, max);
    
    // Generate distractors
    const devSet = new Set<number>();
    
    // 1. Reversed digit distraction (e.g. 35 -> 53)
    if (correctVal >= 10 && correctVal <= 99) {
      const reversed = parseInt(correctVal.toString().split('').reverse().join(''));
      if (reversed !== correctVal && reversed >= min && reversed <= max) {
        devSet.add(reversed);
      }
    }

    // 2. Offsets (nearby counts)
    const offsets = [1, -1, 10, -10, 5, -5, 100, -100, 1000, -1000, 10000, -10000, 100000, -100000, 1000000, -1000000];
    for (const offset of offsets) {
      const val = correctVal + offset;
      if (val >= min && val <= max && val !== correctVal) {
        devSet.add(val);
      }
    }

    // 3. Fill up with genuine randoms
    while (devSet.size < 3) {
      const val = Math.floor(Math.random() * (max - min + 1)) + min;
      if (val !== correctVal) {
        devSet.add(val);
      }
    }

    const wrongValues = Array.from(devSet).slice(0, 3);
    const allValues = [correctVal, ...wrongValues].sort(() => Math.random() - 0.5);

    const options = allValues.map((val) => {
      const conversion = convertNumberToChinese(val);
      return {
        number: val,
        hz: conversion.hz,
        py: conversion.py,
      };
    });

    setCurrentQuestion({
      correctNumber: correctVal,
      options,
    });
    setSelectedAnswerIndex(null);
    setIsAnswered(false);
    setFeedbackMessage(null);
  };

  // Trigger sound synthesis for the audio quiz mode
  const playActiveKeyword = () => {
    if (!currentQuestion) return;
    const keyDetail = convertNumberToChinese(currentQuestion.correctNumber);
    speakChinese(keyDetail.hz);
  };

  // Standard setup on state load
  useEffect(() => {
    generateQuestion();
  }, [activeTab, selectedRange]);

  // Handle voice synthesis on first loading if in audio mode
  useEffect(() => {
    if (currentQuestion && activeTab === 'audio-to-number' && !isAnswered) {
      // Small timeout to allow state to settle
      const timeout = setTimeout(() => {
        playActiveKeyword();
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [currentQuestion, activeTab]);

  const handleAnswerSelection = (index: number) => {
    if (isAnswered) return;
    
    const option = currentQuestion!.options[index];
    const isCorrect = option.number === currentQuestion!.correctNumber;

    setSelectedAnswerIndex(index);
    setIsAnswered(true);
    setTotalQuestions((prev) => prev + 1);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => {
        const next = prev + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
      setFeedbackMessage('Chính xác! Bạn thông minh quá. 🎉');
      
      // Keep voice active as reinforcement
      speakChinese(option.hz);
    } else {
      setStreak(0);
      const correctAnswer = currentQuestion!.options.find((o) => o.number === currentQuestion!.correctNumber);
      setFeedbackMessage(`Rất tiếc! Đáp án đúng đúng là: ${correctAnswer?.number} (${correctAnswer?.hz} - ${correctAnswer?.py})`);
    }
  };

  const handleResetStats = () => {
    setScore(0);
    setTotalQuestions(0);
    setStreak(0);
  };

  // Dynamic font sizing helpers for QuizPanel questions
  const getQuizNumberFontSizeClass = (numStr: string) => {
    const len = numStr.length;
    if (len <= 7) return 'text-5xl sm:text-6xl';
    if (len <= 11) return 'text-3xl sm:text-4xl';
    return 'text-2xl sm:text-3xl';
  };

  const getQuizHzFontSizeClass = (hzStr: string) => {
    const len = hzStr.length;
    if (len <= 6) return 'text-5xl';
    if (len <= 12) return 'text-3xl';
    return 'text-2xl';
  };

  const quizDisplayNumber = currentQuestion ? currentQuestion.correctNumber.toLocaleString('vi-VN') : '';
  const quizDisplayHz = currentQuestion ? convertNumberToChinese(currentQuestion.correctNumber).hz : '';
  const quizDisplayPy = currentQuestion ? convertNumberToChinese(currentQuestion.correctNumber).py : '';
  
  const quizNumberFontSize = getQuizNumberFontSizeClass(quizDisplayNumber);
  const quizHzFontSize = getQuizHzFontSizeClass(quizDisplayHz);

  return (
    <div className="bg-white border-4 border-black rounded-[30px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
      {/* Quiz statistics panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FDBA74] border-2 border-black p-4 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-black">
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-1.5 bg-white text-black border-2 border-black px-2.5 py-1.5 rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Trophy className="w-4 h-4 text-[#3B82F6]" />
            <span>ĐIỂM: {score}/{totalQuestions}</span>
          </div>

          <div className="flex items-center space-x-1 bg-white text-black border-2 border-black px-2.5 py-1.5 rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="w-4 h-4 text-[#4ADE80]" />
            <span>CHUỖI: {streak} 🔥</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-black font-black uppercase">Chuỗi tốt nhất: <strong className="text-black bg-white px-1.5 py-0.5 border border-black rounded">{bestStreak}</strong></span>
          <button
            onClick={handleResetStats}
            className="text-[10px] text-black font-black uppercase bg-white border-2 border-black hover:bg-rose-500 hover:text-white px-2 py-1 rounded transition"
            title="Xóa điểm số để thi lại từ đầu"
          >
            Reset Điểm
          </button>
        </div>
      </div>

      {/* Tabs configuration inside Quiz */}
      <div className="flex bg-white p-1 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] gap-1">
        <button
          onClick={() => setActiveTab('number-to-pinyin')}
          className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${
            activeTab === 'number-to-pinyin'
              ? 'bg-[#3B82F6] text-white border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              : 'text-black hover:bg-gray-100'
          }`}
          id="tab-quiz-n2p"
        >
          Nhìn Số đoán Pinyin
        </button>
        <button
          onClick={() => setActiveTab('audio-to-number')}
          className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${
            activeTab === 'audio-to-number'
              ? 'bg-[#3B82F6] text-white border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              : 'text-black hover:bg-gray-100'
          }`}
          id="tab-quiz-a2n"
        >
          Nghe Tiếng chọn Số
        </button>
        <button
          onClick={() => setActiveTab('hanzi-to-number')}
          className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${
            activeTab === 'hanzi-to-number'
              ? 'bg-[#3B82F6] text-white border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              : 'text-black hover:bg-gray-100'
          }`}
          id="tab-quiz-h2n"
        >
          Nhìn Hán Tự chọn Số
        </button>
      </div>

      {/* Range difficulty selector */}
      <div className="space-y-2">
        <label className="text-xs font-black text-black block uppercase tracking-wide">Độ khó dải số luyện phản xạ:</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {PRESET_RANGES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedRange(idx)}
              className={`py-2 px-3 text-xs font-black rounded-lg text-center transition border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                selectedRange === idx
                  ? 'bg-[#FFD600] text-black'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
              id={`preset-range-${idx}`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Question Display Box */}
      {currentQuestion && (
        <div className="bg-white border-4 border-black rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-xs text-gray-500 font-black tracking-widest uppercase">
            {activeTab === 'number-to-pinyin' ? 'Nhìn số dưới và tìm phiên âm chính xác' : 
             activeTab === 'audio-to-number' ? 'Luyện nghe: Bấm loa phát âm và điền số' : 
             'Xem chữ Hán tự này tương ứng với số nào'}
          </span>

          <div className="h-32 flex items-center justify-center">
            {activeTab === 'number-to-pinyin' && (
              <span className={`${quizNumberFontSize} font-black text-black tracking-tight select-none block break-all`}>
                {quizDisplayNumber}
              </span>
            )}

            {activeTab === 'audio-to-number' && (
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={playActiveKeyword}
                  className="w-20 h-20 bg-[#FFD600] hover:bg-[#FFE55C] border-4 border-black text-black rounded-full flex items-center justify-center transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95 duration-150"
                  title="Nhấp để nghe lại"
                  id="hear-sound-speaker-btn"
                >
                  <Volume2 className="w-9 h-9" />
                </button>
                <span className="text-xs font-bold text-gray-700 uppercase">BẤM ĐỂ PHÁT LẠI ÂM</span>
              </div>
            )}

            {activeTab === 'hanzi-to-number' && (
              <div className="text-center space-y-2 w-full overflow-hidden">
                <span className={`${quizHzFontSize} font-black text-black block select-none break-all`}>
                  {quizDisplayHz}
                </span>
                <span className="text-sm font-mono text-gray-700 italic font-bold block break-words">
                  ({quizDisplayPy})
                </span>
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            {currentQuestion.options.map((option, idx) => {
              const isCorrectTarget = option.number === currentQuestion.correctNumber;
              const isChosen = selectedAnswerIndex === idx;

              let btnStyle = 'bg-[#E0E7FF] text-black border-2 border-black hover:bg-[#C7D2FE] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]';
              if (isAnswered) {
                if (isCorrectTarget) {
                  btnStyle = 'bg-[#4ADE80] text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-[1.02] cursor-not-allowed';
                } else if (isChosen) {
                  btnStyle = 'bg-[#FF4F4F] text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-[0.98] opacity-100 cursor-not-allowed';
                } else {
                  btnStyle = 'bg-white border-2 border-gray-200 text-gray-400 opacity-50 cursor-not-allowed';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelection(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4.5 text-center text-sm font-black rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 ${btnStyle}`}
                  id={`choice-btn-${idx}`}
                >
                  {activeTab === 'number-to-pinyin' ? (
                    <>
                      <span className="text-xl font-extrabold">{option.hz}</span>
                      <span className="text-xs font-mono italic opacity-95">({option.py})</span>
                    </>
                  ) : (
                    // For sound / hanzi modes, choices are digits
                    <span className="text-2xl font-black tracking-tight">
                      {option.number.toLocaleString('vi-VN')}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Correct/Incorrect Answer Message Box */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`w-full p-4.5 rounded-xl text-sm font-black flex items-center gap-2.5 justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                  currentQuestion.options[selectedAnswerIndex!]?.number === currentQuestion.correctNumber
                    ? 'bg-[#4ADE80] text-black'
                    : 'bg-[#FF4F4F] text-white'
                }`}
                id="quiz-feedback-box"
              >
                {currentQuestion.options[selectedAnswerIndex!]?.number === currentQuestion.correctNumber ? (
                  <CheckCircle className="w-5 h-5 text-black shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-white shrink-0" />
                )}
                <span className="text-center">{feedbackMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Trigger Next question */}
          {isAnswered && (
            <button
              onClick={generateQuestion}
              className="mt-2 text-sm font-black bg-black text-white hover:bg-slate-950 px-6 py-3.5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all outline-none flex items-center justify-center gap-1.5 self-center"
              id="quiz-next-question-btn"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tiếp tục câu tiếp theo</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
