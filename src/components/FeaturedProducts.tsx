import React, { useState } from 'react';
import { Sparkles, Star, Gift, Phone, Check, ChevronLeft, ChevronRight, Eye, Heart, X } from 'lucide-react';
import contentData from '../data/contentData.json';

interface FeaturedProductsProps {
  onBackToMainMenu: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ onBackToMainMenu }) => {
  const { featuredProducts, brand } = contentData;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [interestedProduct, setInterestedProduct] = useState<string | null>(null);
  const [currentCarouselIdx, setCurrentCarouselIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'list'>('carousel');

  const filteredItems = featuredProducts.items.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.groupId === selectedCategory;
  });

  const handlePrev = () => {
    setCurrentCarouselIdx(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1));
  };

  const handleNext = () => {
    setCurrentCarouselIdx(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-in fade-in duration-300">
      {/* Header Banner - nổi bật với nhãn nhỏ "Nổi bật", icon ngôi sao/quà tặng, nền gradient xanh nhẹ hoặc viền đỏ mảnh */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-sky-50 via-white to-red-50/40 border-2 border-red-500/30 shadow-lg mb-8 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Nổi Bật</span>
              <Gift className="w-3.5 h-3.5 text-amber-200" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              {featuredProducts.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl">
              {featuredProducts.description}
            </p>
          </div>

          {/* Toggle View Mode */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setViewMode('carousel')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'carousel'
                  ? 'bg-[#005596] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Dạng Carousel
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'list'
                  ? 'bg-[#005596] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Dạng Danh Sách
            </button>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="mt-6 flex flex-wrap gap-2">
          {featuredProducts.categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentCarouselIdx(0);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Display: Carousel View */}
      {viewMode === 'carousel' && filteredItems.length > 0 && (
        <div className="relative max-w-2xl mx-auto">
          {/* Main Poster Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xl overflow-hidden transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full bg-sky-50 text-[#005596] text-xs font-bold border border-sky-100">
                {filteredItems[currentCarouselIdx]?.groupName}
              </span>
              <span className="text-xs font-bold text-slate-400">
                {currentCarouselIdx + 1} / {filteredItems.length}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
              {filteredItems[currentCarouselIdx]?.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mb-4 line-clamp-2">
              {filteredItems[currentCarouselIdx]?.desc}
            </p>

            {/* Poster Image Container */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 mb-5 border border-slate-200 aspect-[4/3] flex items-center justify-center">
              <img
                src={filteredItems[currentCarouselIdx]?.image}
                alt={filteredItems[currentCarouselIdx]?.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                  const parent = (e.currentTarget as HTMLElement).parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400';
                    fallback.innerHTML = `<svg class="w-12 h-12 mb-2 text-[#005596]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg><span class="font-bold text-slate-700 text-sm">${filteredItems[currentCarouselIdx]?.title}</span><span class="text-xs mt-1 text-slate-500">Poster giới thiệu tại quầy VietinBank</span>`;
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>

            {/* Button "Tôi quan tâm" */}
            <div className="flex gap-3">
              <button
                onClick={() => setInterestedProduct(filteredItems[currentCarouselIdx]?.title)}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 transition active:scale-98"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>Tôi quan tâm</span>
              </button>
            </div>
          </div>

          {/* Carousel Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 -translate-x-3 sm:-translate-x-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-[#005596] transition"
            aria-label="Poster trước"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 translate-x-3 sm:translate-x-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-[#005596] transition"
            aria-label="Poster sau"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {filteredItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentCarouselIdx(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentCarouselIdx ? 'w-6 bg-[#005596]' : 'w-2 bg-slate-300'
                }`}
                aria-label={`Chuyển tới ảnh ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Content Display: List View (vuốt dọc dễ xem trên mobile) */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md hover:shadow-xl hover:border-sky-300 transition flex flex-col justify-between"
            >
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#005596] text-[11px] font-bold">
                  {item.groupName}
                </span>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2 mb-1">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                  {item.desc}
                </p>

                <div className="relative rounded-2xl overflow-hidden bg-slate-100 mb-4 border border-slate-200 aspect-[4/3] flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>

              <button
                onClick={() => setInterestedProduct(item.title)}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Tôi quan tâm</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Notification when clicking "Tôi quan tâm" as specified in PDF */}
      {interestedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center overflow-hidden">
            <button
              onClick={() => setInterestedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 mx-auto mb-4 flex items-center justify-center">
              <Gift className="w-8 h-8 text-red-600" />
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-1">
              {featuredProducts.modalInterested.title}
            </h3>

            <div className="inline-block px-3 py-1 rounded-full bg-sky-50 text-[#005596] text-xs font-semibold mb-4">
              Sản phẩm: {interestedProduct}
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl mb-6 text-left space-y-3">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {featuredProducts.modalInterested.message}
              </p>
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  {featuredProducts.modalInterested.advisorMessage}
                </span>
                <a
                  href={`tel:${brand.advisor.phoneClean}`}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi ngay</span>
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setInterestedProduct(null)}
                className="w-full py-3 rounded-xl bg-[#005596] hover:bg-[#004276] text-white font-bold text-sm transition"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back button */}
      <div className="mt-8 text-center">
        <button
          onClick={onBackToMainMenu}
          className="px-6 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition"
        >
          Quay lại menu chính
        </button>
      </div>
    </div>
  );
};
