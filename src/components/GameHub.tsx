import React, { useState } from 'react';
import { Gamepad2, Trophy, Sparkles, Fuel, ArrowLeft, Star, ChevronRight } from 'lucide-react';
import { FlappyVoucherGame } from './games/FlappyVoucherGame';
import { SnakeVoucherGame } from './games/SnakeVoucherGame';
import contentData from '../data/contentData.json';

interface GameHubProps {
  onBackToMainMenu: () => void;
}

export const GameHub: React.FC<GameHubProps> = ({ onBackToMainMenu }) => {
  const [selectedGameId, setSelectedGameId] = useState<'flappy' | 'snake' | null>(null);
  const { gameSection } = contentData;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Giải Trí Tại Quầy - Rinh Quà Liền Tay</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          {gameSection.title}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {gameSection.subTitle}
        </p>
      </div>

      {!selectedGameId ? (
        /* Game Selection Screen */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Game 1: Flappy Bird */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 hover:border-[#005596] shadow-lg hover:shadow-xl transition flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100/50 rounded-full blur-2xl group-hover:bg-sky-200/50 transition" />
              
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-sky-100 text-[#005596] text-xs font-bold flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-red-600" />
                    <span>Mục tiêu: 20 Thử Thách</span>
                  </span>
                  <span className="text-xs font-bold text-slate-400">Game 1</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-800 group-hover:text-[#005596] transition">
                  {gameSection.games[0].title}
                </h3>
                <p className="text-xs font-semibold text-sky-700 mt-1 mb-3">
                  {gameSection.games[0].gameName}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {gameSection.games[0].desc}
                </p>

                <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-amber-400 text-slate-900 font-bold">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-900">Phần thưởng chiến thắng:</div>
                    <div className="text-sm font-extrabold text-red-600">{gameSection.games[0].rewardText}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedGameId('flappy')}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#005596] hover:bg-[#004276] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 group-hover:translate-x-0.5 transition"
              >
                <span>Chơi Ngay (Flappy Bird)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Game 2: Snake Challenge */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-100 hover:border-emerald-600 shadow-lg hover:shadow-xl transition flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl group-hover:bg-emerald-200/50 transition" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>Mốc 20 &amp; 40 Điểm</span>
                  </span>
                  <span className="text-xs font-bold text-slate-400">Game 2</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-800 group-hover:text-emerald-700 transition">
                  {gameSection.games[1].title}
                </h3>
                <p className="text-xs font-semibold text-emerald-700 mt-1 mb-3">
                  {gameSection.games[1].gameName}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {gameSection.games[1].desc}
                </p>

                <div className="p-3 bg-red-50 border border-red-200/80 rounded-2xl flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-red-600 text-white font-bold">
                    <Fuel className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-red-900">Phần thưởng tối đa:</div>
                    <div className="text-sm font-extrabold text-red-700">{gameSection.games[1].rewardText}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedGameId('snake')}
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 group-hover:translate-x-0.5 transition"
              >
                <span>Chơi Ngay (Rắn Săn Mồi)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Back Button */}
          <div className="text-center pt-4">
            <button
              onClick={onBackToMainMenu}
              className="px-6 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition"
            >
              Quay lại menu chính
            </button>
          </div>
        </div>
      ) : (
        /* Game View */
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-md">
          <div className="mb-4">
            <button
              onClick={() => setSelectedGameId(null)}
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#005596] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Chọn trò chơi khác</span>
            </button>
          </div>

          {selectedGameId === 'flappy' && (
            <FlappyVoucherGame onBackToMenu={() => setSelectedGameId(null)} />
          )}

          {selectedGameId === 'snake' && (
            <SnakeVoucherGame onBackToMenu={() => setSelectedGameId(null)} />
          )}
        </div>
      )}
    </div>
  );
};
