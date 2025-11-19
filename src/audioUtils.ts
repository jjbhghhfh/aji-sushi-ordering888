/**
 * 播放订单提示音
 */
export const playOrderNotificationSound = async () => {
  try {
    // 使用Web Audio API创建蜂鸣声
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const now = audioContext.currentTime;
    
    // 创建振荡器
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // 设置参数：频率、音量、持续时间
    oscillator.frequency.value = 1000; // 1000Hz
    oscillator.type = 'sine';
    
    // 音量包络
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    
    // 播放两个音调
    oscillator.start(now);
    oscillator.stop(now + 0.5);
    
    // 第二个音调
    const oscillator2 = audioContext.createOscillator();
    oscillator2.connect(gainNode);
    oscillator2.frequency.value = 1200;
    oscillator2.type = 'sine';
    oscillator2.start(now + 0.1);
    oscillator2.stop(now + 0.6);
    
  } catch (error) {
    console.log('提示音播放失败:', error);
  }
};

/**
 * 播放简单的单音提示音（备选方案）
 */
export const playSimpleBeep = async () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.log('提示音播放失败:', error);
  }
};
