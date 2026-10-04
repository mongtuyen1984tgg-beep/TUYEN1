import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Trophy, Volume2, VolumeX, RotateCcw, Copy, Check, Home, Play, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FlappyVoucherGameProps {
  onBackToMenu: () => void;
}

// Global window callback type declaration
declare global {
  interface Window {
    onFlappyVoucherWin?: (data: {
      score: number;
      voucherCode: string;
      reward: string;
      timestamp: string;
    }) => void;
    onFlappyVoucherLose?: (data: {
      score: number;
      timestamp: string;
    }) => void;
  }
}

export const FlappyVoucherGame: React.FC<FlappyVoucherGameProps> = ({ onBackToMenu }) => {
  // Game Configuration Constants
  const WIN_SCORE = 20;
  const GRAVITY = 0.32;
  const JUMP_FORCE = -6.5;
  const PIPE_SPEED = 2.0;
  const PIPE_GAP = 145; // Generous gap for casual banking customers
  const PIPE_SPAWN_INTERVAL = 110; // Frames between pipe spawns
  const VOUCHER_TEXT = "Voucher 2 lít xăng";
  const BRAND_NAME = "VietinBank";
  const GAME_TITLE = "Chờ vui – Chơi hay – Nhận quà liền tay";

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'won'>('start');
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('vb_flappy_best_score') || '0', 10);
  });
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [latestSavedVoucher, setLatestSavedVoucher] = useState<string>(() => {
    return localStorage.getItem('vb_flappy_latest_voucher') || '';
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Audio Context synthesis (pure JS, no external assets required)
  const playBeep = useCallback((freq: number, type: OscillatorType = 'sine', duration: number = 0.08) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context may be restricted
    }
  }, [soundEnabled]);

  // Generate Unique Voucher Code
  const generateVoucherCode = (): string => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `VB-${randomDigits}`;
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Motivational cheer text
  const getMotivationalText = (currentScore: number) => {
    if (currentScore >= WIN_SCORE) return "Xuất sắc!";
    if (currentScore >= 15) return "Sắp nhận quà rồi!";
    if (currentScore >= 10) return "Một nửa chặng đường rồi!";
    if (currentScore >= 5) return "Tốt lắm, tiếp tục nào!";
    return "Khởi động nhẹ nhàng!";
  };

  // Game Loop References
  const animationFrameId = useRef<number | null>(null);
  const birdRef = useRef({
    x: 70,
    y: 180,
    width: 36,
    height: 24,
    velocity: 0,
    angle: 0
  });

  const pipesRef = useRef<Array<{
    x: number;
    topHeight: number;
    bottomHeight: number;
    passed: boolean;
  }>>([]);

  const frameCountRef = useRef<number>(0);
  const currentScoreRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);

  // Jump Action
  const jump = useCallback(() => {
    if (gameState === 'start') {
      startGame();
      return;
    }
    if (gameState !== 'playing') return;

    birdRef.current.velocity = JUMP_FORCE;
    playBeep(520, 'sine', 0.06);
  }, [gameState, playBeep]);

  const startGame = () => {
    birdRef.current = {
      x: 70,
      y: 180,
      width: 36,
      height: 24,
      velocity: 0,
      angle: 0
    };
    pipesRef.current = [];
    frameCountRef.current = 0;
    currentScoreRef.current = 0;
    setScore(0);
    setVoucherCode('');
    setIsShaking(false);
    isPlayingRef.current = true;
    setGameState('playing');
  };

  const resetGame = () => {
    startGame();
  };

  const winGame = useCallback((finalScore: number) => {
    isPlayingRef.current = false;
    setGameState('won');
    playBeep(780, 'triangle', 0.2);

    const newCode = generateVoucherCode();
    setVoucherCode(newCode);
    setLatestSavedVoucher(newCode);
    localStorage.setItem('vb_flappy_latest_voucher', newCode);
    localStorage.setItem('vb_flappy_best_score', String(Math.max(bestScore, finalScore)));
    setBestScore(prev => Math.max(prev, finalScore));

    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (window.onFlappyVoucherWin) {
      window.onFlappyVoucherWin({
        score: finalScore,
        voucherCode: newCode,
        reward: VOUCHER_TEXT,
        timestamp: new Date().toISOString()
      });
    }
  }, [bestScore, playBeep]);

  const endGame = useCallback((finalScore: number) => {
    isPlayingRef.current = false;
    setGameState('gameover');
    setIsShaking(true);
    playBeep(180, 'sawtooth', 0.18);
    setTimeout(() => setIsShaking(false), 500);

    if (finalScore > bestScore) {
      setBestScore(finalScore);
      localStorage.setItem('vb_flappy_best_score', String(finalScore));
    }

    if (window.onFlappyVoucherLose) {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString()
      });
    }
  }, [bestScore, playBeep]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear background & draw sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      skyGradient.addColorStop(0, '#E0F2FE');
      skyGradient.addColorStop(0.7, '#BAE6FD');
      skyGradient.addColorStop(1, '#93C5FD');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Clouds decoration
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.beginPath();
      ctx.arc(80, 50, 24, 0, Math.PI * 2);
      ctx.arc(110, 45, 32, 0, Math.PI * 2);
      ctx.arc(140, 50, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(280, 80, 20, 0, Math.PI * 2);
      ctx.arc(305, 75, 28, 0, Math.PI * 2);
      ctx.arc(330, 80, 20, 0, Math.PI * 2);
      ctx.fill();

      // Ground bar
      const groundHeight = 36;
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(0, height - groundHeight, width, groundHeight);
      ctx.fillStyle = '#0369A1';
      ctx.fillRect(0, height - groundHeight, width, 5);

      if (isPlayingRef.current) {
        frameCountRef.current++;

        // 2. Bird Physics
        const bird = birdRef.current;
        bird.velocity += GRAVITY;
        bird.y += bird.velocity;
        bird.angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (bird.velocity * 4 * Math.PI) / 180));

        // Floor / Ceiling collision
        if (bird.y + bird.height / 2 >= height - groundHeight) {
          bird.y = height - groundHeight - bird.height / 2;
          endGame(currentScoreRef.current);
          return;
        }
        if (bird.y - bird.height / 2 <= 0) {
          bird.y = bird.height / 2;
          bird.velocity = 0;
        }

        // 3. Pipe Spawning
        if (frameCountRef.current % PIPE_SPAWN_INTERVAL === 0) {
          const minPipe = 50;
          const maxPipe = height - groundHeight - PIPE_GAP - minPipe;
          const topHeight = Math.floor(minPipe + Math.random() * (maxPipe - minPipe));
          const bottomHeight = height - groundHeight - (topHeight + PIPE_GAP);

          pipesRef.current.push({
            x: width,
            topHeight,
            bottomHeight,
            passed: false
          });
        }

        // 4. Update & Draw Pipes
        const pipeWidth = 52;
        for (let i = pipesRef.current.length - 1; i >= 0; i--) {
          const pipe = pipesRef.current[i];
          pipe.x -= PIPE_SPEED;

          // VietinBank branded pipes: Slate Blue with Red accent stripe
          ctx.fillStyle = '#005596';
          // Top pipe
          ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
          // Top pipe rim
          ctx.fillStyle = '#ED1C24';
          ctx.fillRect(pipe.x - 3, pipe.topHeight - 12, pipeWidth + 6, 12);

          // Bottom pipe
          ctx.fillStyle = '#005596';
          ctx.fillRect(pipe.x, height - groundHeight - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);
          // Bottom pipe rim
          ctx.fillStyle = '#ED1C24';
          ctx.fillRect(pipe.x - 3, height - groundHeight - pipe.bottomHeight, pipeWidth + 6, 12);

          // Check if bird passed pipe
          if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            pipe.passed = true;
            currentScoreRef.current += 1;
            const newScore = currentScoreRef.current;
            setScore(newScore);
            playBeep(660, 'sine', 0.08);

            // Win condition reached
            if (newScore >= WIN_SCORE) {
              winGame(newScore);
              return;
            }
          }

          // Collision Detection (Circle vs Rect)
          const birdRadius = 14;
          const birdCenterX = bird.x;
          const birdCenterY = bird.y;

          // Top pipe box
          const inTopX = birdCenterX + birdRadius > pipe.x && birdCenterX - birdRadius < pipe.x + pipeWidth;
          const inTopY = birdCenterY - birdRadius < pipe.topHeight;
          if (inTopX && inTopY) {
            endGame(currentScoreRef.current);
            return;
          }

          // Bottom pipe box
          const bottomY = height - groundHeight - pipe.bottomHeight;
          const inBottomY = birdCenterY + birdRadius > bottomY;
          if (inTopX && inBottomY) {
            endGame(currentScoreRef.current);
            return;
          }

          // Remove offscreen pipes
          if (pipe.x + pipeWidth < -10) {
            pipesRef.current.splice(i, 1);
          }
        }
      }

      // 5. Draw Mascot (Flying VietinBank Gold Smart Card)
      const bird = birdRef.current;
      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.rotate(bird.angle);

      // Card body
      ctx.fillStyle = '#D97706'; // Gold metallic
      ctx.beginPath();
      ctx.roundRect(-18, -12, 36, 24, 4);
      ctx.fill();

      // Card stripe & chip
      ctx.fillStyle = '#ED1C24'; // Red VietinBank accent
      ctx.fillRect(-18, -3, 36, 4);

      // Golden microchip
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(-12, -9, 8, 6);

      // Cute wing / propeller
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.ellipse(-4, 0, 7, 4, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Loop only if playing or initial idle float
      if (isPlayingRef.current) {
        localFrameId = requestAnimationFrame(render);
      }
    };

    localFrameId = requestAnimationFrame(render);
    animationFrameId.current = localFrameId;

    return () => {
      if (localFrameId) cancelAnimationFrame(localFrameId);
    };
  }, [gameState, endGame, winGame, playBeep]);

  // Keyboard Space listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  return (
    <div id="flappy-voucher-game" className="relative w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Top Controls Bar */}
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            {BRAND_NAME}
          </span>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs font-semibold text-sky-700">Mục tiêu: {WIN_SCORE} điểm</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition text-xs flex items-center gap-1"
            title="Bật/Tắt âm thanh"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            onClick={onBackToMenu}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition text-xs flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            <span className="text-[11px] font-semibold hidden sm:inline">Về menu</span>
          </button>
        </div>
      </div>

      {/* Main Game Screen Box */}
      <div
        className={`relative w-full aspect-[4/3] sm:aspect-[16/10] bg-sky-100 rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl touch-none select-none ${
          isShaking ? 'animate-bounce' : ''
        }`}
        onClick={jump}
        onTouchStart={(e) => {
          e.preventDefault(); // Prevent double tap zoom
          jump();
        }}
      >
        <canvas
          ref={canvasRef}
          width={480}
          height={320}
          className="w-full h-full block cursor-pointer"
        />

        {/* In-game HUD */}
        {gameState === 'playing' && (
          <div className="absolute top-3 left-0 right-0 px-4 flex flex-col items-center pointer-events-none">
            <div className="bg-slate-900/80 backdrop-blur-xs text-white px-4 py-1 rounded-full text-sm sm:text-base font-extrabold shadow-md flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Điểm: {score}/{WIN_SCORE}</span>
            </div>

            {/* Progress bar 0 to 20 */}
            <div className="w-48 h-2 bg-white/60 rounded-full mt-2 overflow-hidden border border-white/80 shadow-xs">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-150"
                style={{ width: `${Math.min(100, (score / WIN_SCORE) * 100)}%` }}
              />
            </div>

            {/* Dynamic Cheer text */}
            <div className="mt-1 text-xs font-bold text-slate-800 bg-white/90 px-3 py-0.5 rounded-full shadow-xs">
              {getMotivationalText(score)}
            </div>
          </div>
        )}

        {/* Start Overlay Screen */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="p-3 bg-red-600 rounded-2xl shadow-lg mb-3">
              <Sparkles className="w-8 h-8 text-amber-300 animate-spin" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black mb-1 tracking-tight text-amber-300">
              {GAME_TITLE}
            </h3>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xs mb-4">
              Vượt qua 20 thử thách để nhận voucher 2 lít xăng
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-sm sm:text-base shadow-xl transform active:scale-95 transition flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Bắt đầu chơi</span>
            </button>

            <p className="text-[11px] text-white/80 mt-4">
              Chạm màn hình hoặc nhấn Space để bay
            </p>

            {latestSavedVoucher && (
              <div className="mt-4 p-2 bg-white/10 rounded-xl border border-white/20 text-xs">
                <span className="text-white/70">Mã voucher gần nhất của bạn: </span>
                <strong className="text-amber-300 font-mono">{latestSavedVoucher}</strong>
              </div>
            )}
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-2">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-1">
              Rất tiếc, bạn đã vượt qua {score}/{WIN_SCORE} thử thách
            </h3>
            <p className="text-xs sm:text-sm text-sky-200 mb-5">
              Chỉ còn một chút nữa thôi, hãy thử lại nhé!
            </p>

            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetGame();
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBackToMenu();
                }}
                className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm transition"
              >
                Về màn hình chính
              </button>
            </div>
          </div>
        )}

        {/* Won Victory Screen */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white animate-in zoom-in-95">
            <div className="p-3 bg-amber-400 text-slate-900 rounded-full mb-2 animate-bounce">
              <Trophy className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-amber-300">
              Chúc mừng!
            </h3>
            <p className="text-xs sm:text-sm text-white/90 max-w-xs mt-1 mb-4">
              Bạn đã vượt qua 20 thử thách và đủ điều kiện nhận {VOUCHER_TEXT}.
            </p>

            {/* Voucher Box */}
            <div className="w-full max-w-xs bg-white text-slate-800 rounded-2xl p-4 shadow-xl border-2 border-amber-400 mb-4">
              <div className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                MÃ NHẬN QUÀ TẶNG
              </div>
              <div className="text-2xl font-black font-mono tracking-widest text-[#005596] my-1">
                {voucherCode}
              </div>
              <p className="text-[11px] text-slate-500">
                Vui lòng chụp màn hình hoặc đưa mã này cho nhân viên để nhận quà.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyVoucherCode(voucherCode);
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã chép' : 'Sao chép mã'}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetGame();
                }}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500">
          Chạm lên màn hình hoặc nhấn phím <kbd className="px-1.5 py-0.5 bg-slate-200 rounded font-mono text-[11px]">Space</kbd> để nhảy qua các chướng ngại vật
        </p>
      </div>
    </div>
  );
};
