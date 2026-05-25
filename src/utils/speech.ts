/**
 * Speech synthesis utility for Chinese Standard Mandarin (zh-CN).
 */

export function speakChinese(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve(false);
      return;
    }

    try {
      // Cancel any ongoing speaking
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Look for a suitable Chinese voice
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find standard mainland China Chinese (zh-CN)
      let chineseVoice = voices.find(
        (voice) => 
          voice.lang.includes('zh-CN') || 
          voice.lang.includes('zh_CN') || 
          voice.lang.toLowerCase() === 'zh'
      );

      // Fallback to any Chinese
      if (!chineseVoice) {
        chineseVoice = voices.find((voice) => voice.lang.toLowerCase().includes('zh'));
      }

      if (chineseVoice) {
        utterance.voice = chineseVoice;
      }
      
      utterance.lang = 'zh-CN';
      utterance.rate = 0.85; // Slightly slower for clear pronunciation learning
      utterance.pitch = 1.0;

      utterance.onend = () => {
        resolve(true);
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        resolve(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Failed to synthesize speech', err);
      resolve(false);
    }
  });
}

/**
 * Checks if Speech Synthesis is supported and whether any Chinese voice is available.
 */
export function checkChineseVoiceSupport(): { supported: boolean; hasZhVoice: boolean } {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return { supported: false, hasZhVoice: false };
  }
  
  const voices = window.speechSynthesis.getVoices();
  const hasVoice = voices.some((voice) => voice.lang.toLowerCase().includes('zh'));
  
  return {
    supported: true,
    hasZhVoice: hasVoice
  };
}
