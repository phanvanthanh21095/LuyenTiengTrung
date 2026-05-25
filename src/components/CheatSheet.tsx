import React from 'react';
import { BookOpen, Info, CheckCircle2 } from 'lucide-react';
import { NUMBER_CHEAT_SHEET } from '../utils/chineseNumbers';

export default function CheatSheet() {
  return (
    <div className="bg-[#FDBA74] border-4 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center space-x-2 text-black mb-4">
        <BookOpen className="w-6 h-6 text-black" id="cheat-sheet-icon" />
        <h3 className="font-black text-xl text-black uppercase underline decoration-2" id="cheat-sheet-title">Bí kíp quy tắc số Trung Quốc</h3>
      </div>

      <p className="text-xs font-bold text-black mb-4 leading-relaxed bg-white border-2 border-black p-3 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        Hệ thống số của Trung Quốc cực kỳ logic và bám chặt quy luật toán học. Hãy ngấm nhanh và ghim chặt các quy tắc bên dưới để nói tự tin:
      </p>

      {/* Basic numbers grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {NUMBER_CHEAT_SHEET.map((item, index) => (
          <div key={index} className="bg-white border-2 border-black rounded-xl p-3 text-center transition hover:-translate-y-0.5 active:translate-y-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-lg font-black text-[#3B82F6] block">{item.val}</span>
            <span className="text-xl font-bold text-black block my-0.5">{item.hz}</span>
            <span className="text-xs text-gray-700 font-mono italic block">({item.py})</span>
          </div>
        ))}
      </div>

      {/* Advanced Rules Accordion/List */}
      <h4 className="font-black text-black text-sm uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Info className="w-4 h-4 text-black shrink-0" />
        4 Quy tắc vàng phản xạ nhanh:
      </h4>

      <ul className="space-y-3">
        <li className="bg-white border-2 border-black rounded-xl p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs text-black space-y-1">
          <span className="font-black text-black text-xs block uppercase">1/ Quy tắc hàng Vạn (万 - wàn):</span>
          <p className="font-bold text-gray-800 leading-normal">
            Trung Quốc gom cụm <span className="bg-[#FFD600] px-1 border border-black font-black">4 chữ số (10.000)</span> thay vì cụm 3 số như Việt Nam.
          </p>
          <div className="bg-gray-100 border border-black text-[10px] font-mono p-1.5 rounded mt-1 text-black font-bold">
            Ví dụ: 25,000 = 2 Vạn + 5 Ngàn = 两万五千 (liǎng wàn wǔ qiān).
          </div>
        </li>

        <li className="bg-white border-2 border-black rounded-xl p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs text-black space-y-1">
          <span className="font-black text-black text-xs block uppercase">2/ Số 2 cô độc (二 - èr vs 两 - liǎng):</span>
          <p className="font-bold text-gray-800 leading-normal">
            Dùng <span className="underline font-black text-[#FF4F4F]">二 (èr)</span> cho số đếm lẻ hay hàng chục (20 - 二十).
            Dùng <span className="underline font-black text-[#3B82F6]">两 (liǎng)</span> cho hàng lượng từ: trăm, nghìn, vạn (200 - 两百).
          </p>
        </li>

        <li className="bg-white border-2 border-black rounded-xl p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs text-black space-y-1">
          <span className="font-black text-black text-xs block uppercase">3/ Số 10 biến tấu (shí):</span>
          <p className="font-bold text-gray-800 leading-normal">
            Đứng lẻ đọc là <span className="font-black text-black">十二 (shí èr - 12)</span>. Nhưng đứng sau hàng trăm khác phải đọc rõ <span className="font-black text-black">一百一十二 (yī bǎi yī shí èr - 112)</span>.
          </p>
        </li>

        <li className="bg-white border-2 border-black rounded-xl p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs text-black space-y-1">
          <span className="font-black text-black text-xs block uppercase">4/ Số 0 xen kẽ (零 - líng):</span>
          <p className="font-bold text-gray-800 leading-normal">
            Dù có bao nhiêu số 0 liền kề ở giữa, ta chỉ phát âm đúng một chữ <span className="bg-[#4ADE80] px-1 border border-black font-black">零 (líng)</span>.
          </p>
          <div className="bg-gray-100 border border-black text-[10px] font-mono p-1.5 rounded mt-1 text-black font-bold">
            Ví dụ: 1,005 = Một nghìn LẺ năm = 一千零五 (yī qiān líng wǔ).
          </div>
        </li>
      </ul>
    </div>
  );
}
