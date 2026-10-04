import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, RotateCcw, Copy, Check, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SnakeVoucherGameProps {
  onBackToMenu: () => void;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export const SnakeVoucherGame: React.FC<SnakeVoucherGameProps> = ({ onBackToMenu }) => {
  const GRID_SIZE = 20;
  const CELL_SIZE = 16; // Canvas 320x320
  const INITIAL_SPEED = 140; // Moderate friendly speed for all customers

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'running' | 'over'>('idle');
  const [score, setScore] = useState<number>(0);
  const [rewardLevel, setRewardLevel] = useState<0 | 1 | 2>(0);
  const [milestoneBanner, setMilestoneBanner] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [completedTime, setCompletedTime] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const snakeRef = useRef<Array<{ x: number; y: number }>>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]);
  const dirRef = useRef<Direction>('RIGHT');
  const nextDirRef = useRef<Direction>('RIGHT');
  const foodRef = useRef<{ x: number; y: number }>({ x: 15, y: 10 });
  const gameIntervalRef = useRef<number | null>(null);
  const currentScoreRef = useRef<number>(0);
  const reached20Ref = useRef<boolean>(false);
  const reached40Ref = useRef<boolean>(false);

  // Generate random voucher code VB-XXXXXX
  const generateCode = (): string => {
    return `VB-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  const spawnFood = useCallback(() => {
    let newX = Math.floor(Math.random() * GRID_SIZE);
    let newY = Math.floor(Math.random() * GRID_SIZE);

    // Ensure food doesn't spawn on snake
    let onSnake = snakeRef.current.some(segment => segment.x === newX && segment.y === newY);
    while (onSnake) {
      newX = Math.floor(Math.random() * GRID_SIZE);
      newY = Math.floor(Math.random() * GRID_SIZE);
      onSnake = snakeRef.current.some(segment => segment.x === newX && segment.y === newY);
    }
    foodRef.current = { x: newX, y: newY };
  }, [GRID_SIZE]);

  const startGame = () => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    dirRef.current = 'RIGHT';
    nextDirRef.current = 'RIGHT';
    currentScoreRef.current = 0;
    reached20Ref.current = false;
    reached40Ref.current = false;
    setScore(0);
    setRewardLevel(0);
    setMilestoneBanner(null);
    setVoucherCode('');
    spawnFood();
    setGameState('running');
  };

  const endGame = useCallback(() => {
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    const finalScore = currentScoreRef.current;
    setGameState('over');

    const now = new Date();
    const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} - ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    setCompletedTime(timeFormatted);

    if (finalScore >= 20) {
      setVoucherCode(generateCode());
      confetti({ particleCount: 80, spread: 60 });
    }
  }, []);

  const changeDirection = useCallback((newDir: Direction) => {
    const current = dirRef.current;
    if (newDir === 'UP' && current !== 'DOWN') nextDirRef.current = 'UP';
    if (newDir === 'DOWN' && current !== 'UP') nextDirRef.current = 'DOWN';
    if (newDir === 'LEFT' && current !== 'RIGHT') nextDirRef.current = 'LEFT';
    if (newDir === 'RIGHT' && current !== 'LEFT') nextDirRef.current = 'RIGHT';
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        changeDirection('UP');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        changeDirection('DOWN');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        changeDirection('LEFT');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        changeDirection('RIGHT');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection]);

  // Game step logic
  useEffect(() => {
    if (gameState !== 'running') return;

    const tick = () => {
      dirRef.current = nextDirRef.current;
      const head = { ...snakeRef.current[0] };

      switch (dirRef.current) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        endGame();
        return;
      }

      // Check self bite collision
      if (snakeRef.current.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
      }

      snakeRef.current.unshift(head);

      // Check food eating
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        currentScoreRef.current += 1;
        const newScore = currentScoreRef.current;
        setScore(newScore);

        // Milestone notifications as specified
        if (newScore === 20 && !reached20Ref.current) {
          reached20Ref.current = true;
          setRewardLevel(1);
          setMilestoneBanner("Chúc mừng Quý khách đã đạt 20 điểm! Nhận 01 voucher xăng 2 lít.");
          setTimeout(() => setMilestoneBanner(null), 3500);
        } else if (newScore === 40 && !reached40Ref.current) {
          reached40Ref.current = true;
          setRewardLevel(2);
          setMilestoneBanner("Xuất sắc! Quý khách đã đạt 40 điểm! Nhận 02 voucher xăng (2 lít/voucher).");
          setTimeout(() => setMilestoneBanner(null), 3500);
        }

        spawnFood();
      } else {
        snakeRef.current.pop();
      }

      // Render Canvas
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clean board
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle grid dots
      ctx.fillStyle = '#E2E8F0';
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          ctx.fillRect(i * CELL_SIZE + CELL_SIZE / 2 - 0.5, j * CELL_SIZE + CELL_SIZE / 2 - 0.5, 1, 1);
        }
      }

      // Draw Food (Reward coin / gift)
      const food = foodRef.current;
      ctx.fillStyle = '#ED1C24'; // Red VietinBank accent
      ctx.beginPath();
      ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 1,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Golden star inside coin
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 4,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw Snake
      snakeRef.current.forEach((seg, index) => {
        if (index === 0) {
          // Snake Head (Deep VietinBank Blue)
          ctx.fillStyle = '#005596';
        } else {
          // Snake Body
          ctx.fillStyle = index % 2 === 0 ? '#0284C7' : '#38BDF8';
        }
        ctx.beginPath();
        ctx.roundRect(
          seg.x * CELL_SIZE + 1,
          seg.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2,
          index === 0 ? 4 : 2
        );
        ctx.fill();
      });
    };

    gameIntervalRef.current = window.setInterval(tick, INITIAL_SPEED);

    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    };
  }, [gameState, spawnFood, endGame, INITIAL_SPEED]);

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Title & Subtitle */}
      <div className="text-center mb-3">
        <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
          VietinBank Snake Challenge
        </h3>
        <p className="text-xs text-sky-700 font-medium">
          Chơi vui tại quầy – Săn voucher xăng hấp dẫn
        </p>
      </div>

      {/* Rules Bar */}
      <div className="w-full bg-sky-50 border border-sky-100 rounded-2xl p-2.5 mb-3 text-xs text-slate-600 flex flex-wrap items-center justify-around gap-2 text-center">
        <span>🎮 Ăn vật phẩm: <strong className="text-[#005596]">+1 điểm</strong></span>
        <span>⛽ Đạt 20 điểm: <strong className="text-amber-700">01 voucher 2L</strong></span>
        <span>🏆 Đạt 40 điểm: <strong className="text-red-600">02 voucher 2L</strong></span>
      </div>

      {/* Score and Reward HUD */}
      <div className="w-full flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Điểm: {score}</span>
          </span>
          <span className="text-xs font-semibold text-slate-500">
            Thưởng: {rewardLevel === 0 ? 'Chưa đạt mốc' : rewardLevel === 1 ? '1 Voucher' : '2 Voucher'}
          </span>
        </div>

        <button
          onClick={onBackToMenu}
          className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
        >
          Đổi trò chơi
        </button>
      </div>

      {/* Canvas Area */}
      <div className="relative w-[320px] h-[320px] bg-slate-50 rounded-2xl border-4 border-slate-800 shadow-xl overflow-hidden">
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="w-full h-full block"
        />

        {/* Milestone floating banner during play */}
        {milestoneBanner && (
          <div className="absolute top-4 left-4 right-4 bg-amber-500 text-white p-2 rounded-xl text-center text-xs font-bold shadow-lg animate-in slide-in-from-top duration-300">
            {milestoneBanner}
          </div>
        )}

        {/* Idle Start Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white text-center">
            <Award className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
            <h4 className="text-lg font-bold mb-1">Rắn Săn Điểm Thưởng</h4>
            <p className="text-xs text-sky-200 mb-4 max-w-xs">
              Dùng phím mũi tên hoặc nút điều khiển bên dưới để điều khiển rắn ăn điểm
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg flex items-center gap-2 transition"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Bắt đầu chơi</span>
            </button>
          </div>
        )}

        {/* Game Over / Certificate Screen */}
        {gameState === 'over' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-white text-center overflow-y-auto">
            {score >= 20 ? (
              /* Reward Certificate */
              <div className="w-full bg-white text-slate-800 rounded-2xl p-4 shadow-2xl border-2 border-amber-400 text-left">
                <div className="text-center pb-2 border-b border-slate-100">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-600">
                    PHIẾU XÁC NHẬN QUÀ TẶNG VIETINBANK
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Điểm số:</span>
                    <strong className="text-slate-800 font-bold">{score} điểm</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mức quà đạt được:</span>
                    <strong className="text-[#005596] font-bold">
                      {score >= 40 ? '02 voucher xăng (2 lít/voucher)' : '01 voucher xăng trị giá 2 lít'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thời gian:</span>
                    <span className="text-slate-600">{completedTime}</span>
                  </div>
                  <div className="p-2 bg-sky-50 rounded-lg text-center mt-2">
                    <span className="text-[10px] text-slate-500 block">Mã xác nhận</span>
                    <span className="text-xl font-black font-mono text-[#005596]">{voucherCode}</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 mt-2 text-center">
                  Vui lòng chụp màn hình hoặc thông báo với giao dịch viên để nhận quà.
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(voucherCode);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex-1 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold rounded-lg flex items-center justify-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Đã sao chép' : 'Sao chép mã'}</span>
                  </button>
                  <button
                    onClick={startGame}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Chơi lại</span>
                  </button>
                </div>
              </div>
            ) : (
              /* No Reward - Encouragement */
              <div className="p-3 text-center">
                <Trophy className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="text-base font-bold text-white mb-1">
                  Điểm của bạn: {score} điểm
                </h4>
                <p className="text-xs text-sky-200 max-w-xs mb-4">
                  Rất tiếc, Quý khách chưa đạt mốc nhận voucher. Hãy thử lại để chinh phục mốc 20 điểm!
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={startGame}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Chơi lại</span>
                  </button>
                  <button
                    onClick={onBackToMenu}
                    className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs"
                  >
                    Về menu
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Touch Screen Virtual D-Pad for Mobile & Tablets */}
      <div className="mt-4 flex flex-col items-center gap-1.5">
        <button
          onClick={() => changeDirection('UP')}
          className="w-12 h-12 rounded-xl bg-white border border-slate-300 shadow-sm active:bg-slate-200 flex items-center justify-center text-slate-700"
          aria-label="Lên"
        >
          <ArrowUp className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => changeDirection('LEFT')}
            className="w-12 h-12 rounded-xl bg-white border border-slate-300 shadow-sm active:bg-slate-200 flex items-center justify-center text-slate-700"
            aria-label="Trái"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => changeDirection('DOWN')}
            className="w-12 h-12 rounded-xl bg-white border border-slate-300 shadow-sm active:bg-slate-200 flex items-center justify-center text-slate-700"
            aria-label="Xuống"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
          <button
            onClick={() => changeDirection('RIGHT')}
            className="w-12 h-12 rounded-xl bg-white border border-slate-300 shadow-sm active:bg-slate-200 flex items-center justify-center text-slate-700"
            aria-label="Phải"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
