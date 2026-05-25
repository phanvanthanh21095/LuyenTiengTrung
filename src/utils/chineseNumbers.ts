/**
 * Utility to convert numbers to Chinese Characters (Hanzi) and Pinyin (Mandarin).
 * Supports numbers from 0 to 99,999,999.
 */

export interface ChineseNumberRepresentation {
  hz: string;
  py: string;
}

const HANZIS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const PINYINS = ['líng', 'yī', 'èr', 'sān', 'sì', 'wǔ', 'liù', 'qī', 'bā', 'jiǔ'];

/**
 * Converts a 4-digit number (0-9999) to characters and Pinyin
 * @param part number 0 - 9999
 * @param isSubPart if true, means it's a part of a larger number (e.g. unit part under 10000)
 */
function convert4Digits(part: number, isSubPart: boolean): { hzWords: string[]; pyWords: string[] } {
  const hzWords: string[] = [];
  const pyWords: string[] = [];

  const thousand = Math.floor(part / 1000);
  const hundred = Math.floor((part % 1000) / 100);
  const ten = Math.floor((part % 100) / 10);
  const one = part % 10;

  let zeroActive = false;

  // 1. Thousands place
  if (thousand > 0) {
    if (thousand === 2) {
      hzWords.push('两');
      pyWords.push('liǎng');
    } else {
      hzWords.push(HANZIS[thousand]);
      pyWords.push(PINYINS[thousand]);
    }
    hzWords.push('千');
    pyWords.push('qiān');
  } else if (isSubPart && part > 0) {
    // If there is preceding numbers (like 万) and thousand is 0, we might need to pronounce 'ling'
    zeroActive = true;
  }

  // 2. Hundreds place
  if (hundred > 0) {
    if (zeroActive) {
      hzWords.push('零');
      pyWords.push('líng');
      zeroActive = false;
    }
    if (hundred === 2) {
      hzWords.push('两');
      pyWords.push('liǎng');
    } else {
      hzWords.push(HANZIS[hundred]);
      pyWords.push(PINYINS[hundred]);
    }
    hzWords.push('百');
    pyWords.push('bǎi');
  } else if (thousand > 0 || isSubPart) {
    if (part % 100 > 0) {
      zeroActive = true;
    }
  }

  // 3. Tens place
  if (ten > 0) {
    if (zeroActive) {
      hzWords.push('零');
      pyWords.push('líng');
      zeroActive = false;
    }

    // Modern Chinese rule: 
    // If the number starts with 1x (like 12 is 十二, not 一十二), we omit "yī" (一).
    // Specifically: if thousand == 0 and hundred == 0 and ten == 1 AND we are NOT a subpart
    // (i.e. we are at the very beginning of the spoken number).
    const isStartTeen = (thousand === 0 && hundred === 0 && !isSubPart && ten === 1);

    if (!isStartTeen) {
      hzWords.push(HANZIS[ten]);
      pyWords.push(PINYINS[ten]);
    }
    hzWords.push('十');
    pyWords.push('shí');
  } else if (thousand > 0 || hundred > 0 || isSubPart) {
    if (one > 0) {
      zeroActive = true;
    }
  }

  // 4. Ones place
  if (one > 0) {
    if (zeroActive) {
      hzWords.push('零');
      pyWords.push('líng');
    }
    hzWords.push(HANZIS[one]);
    pyWords.push(PINYINS[one]);
  }

  return { hzWords, pyWords };
}

/**
 * Converts any integer between 0 and 99,999,999,999 to Hanzi and Pinyin.
 */
export function convertNumberToChinese(num: number): ChineseNumberRepresentation {
  // Validate and handle floats or negative numbers gracefully just in case
  const n = Math.abs(Math.floor(num));
  
  if (n === 0) {
    return { hz: '零', py: 'líng' };
  }

  const yìPart = Math.floor(n / 100000000);
  const wànPart = Math.floor((n % 100000000) / 10000);
  const unitPart = n % 10000;

  const hzParts: string[] = [];
  const pyParts: string[] = [];

  // 1. Handle Yi (亿) group (Hundred Millions and above)
  if (yìPart > 0) {
    if (yìPart === 2) {
      hzParts.push('两');
      pyParts.push('liǎng');
    } else {
      const yiRes = convert4Digits(yìPart, false);
      hzParts.push(...yiRes.hzWords);
      pyParts.push(...yiRes.pyWords);
    }
    hzParts.push('亿');
    pyParts.push('yì');
  }

  // 2. Handle Wan (万) group (Ten Thousands to Millions)
  if (wànPart > 0) {
    // If we have Yi part and Wan part doesn't have thousands (i.e. wànPart < 1000),
    // we need to insert '零'
    if (yìPart > 0 && wànPart < 1000) {
      hzParts.push('零');
      pyParts.push('líng');
    }

    if (wànPart === 2) {
      hzParts.push('两');
      pyParts.push('liǎng');
    } else {
      const wanRes = convert4Digits(wànPart, yìPart > 0);
      hzParts.push(...wanRes.hzWords);
      pyParts.push(...wanRes.pyWords);
    }
    hzParts.push('万');
    pyParts.push('wàn');
  } else if (yìPart > 0 && unitPart > 0) {
    // If wànPart is 0, but we have both yìPart and unitPart, we need to insert '零'
    // only if unitPart doesn't start its own zero (i.e. unitPart >= 1000).
    // If unitPart < 1000, convert4Digits(unitPart, true) will automatically add '零'.
    if (unitPart >= 1000) {
      hzParts.push('零');
      pyParts.push('líng');
    }
  }

  // 3. Handle Unit group
  if (unitPart > 0) {
    const unitRes = convert4Digits(unitPart, (yìPart > 0 || wànPart > 0));
    hzParts.push(...unitRes.hzWords);
    pyParts.push(...unitRes.pyWords);
  }

  return {
    hz: hzParts.join(''),
    py: pyParts.join(' ')
  };
}

/**
 * Lists details for numbers used as quick references in cheat sheets.
 */
export const NUMBER_CHEAT_SHEET = [
  { val: 0, hz: '零', py: 'líng', note: 'Số không' },
  { val: 1, hz: '一', py: 'yī', note: 'Số một' },
  { val: 2, hz: '二 / 两', py: 'èr / liǎng', note: 'Dùng 二 cho số lẻ, 两 cho hàng trăm/nghìn/vạn/ức' },
  { val: 10, hz: '十', py: 'shí', note: 'Hàng chục' },
  { val: 100, hz: '百', py: 'bǎi', note: 'Hàng trăm' },
  { val: 1000, hz: '千', py: 'qiān', note: 'Hàng nghìn' },
  { val: 10000, hz: '万', py: 'wàn', note: 'Hàng vạn (10.000)' },
  { val: 100000000, hz: '亿', py: 'yì', note: 'Hàng ức / trăm triệu (100Tr)' },
];
