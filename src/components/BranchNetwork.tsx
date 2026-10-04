import React, { useState } from 'react';
import { MapPin, Phone, Clock, ExternalLink, Navigation, Building2, Search, Calendar } from 'lucide-react';
import contentData from '../data/contentData.json';

interface BranchNetworkProps {
  onBackToMainMenu: () => void;
}

export const BranchNetwork: React.FC<BranchNetworkProps> = ({ onBackToMainMenu }) => {
  const { branchNetwork, brand } = contentData;
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredBranches = branchNetwork.branches.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-in fade-in duration-300">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-[#005596] text-xs font-bold uppercase tracking-wider mb-3">
          <MapPin className="w-4 h-4" />
          <span>Mạng Lưới Chi Nhánh &amp; Phòng Giao Dịch</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
          {branchNetwork.title}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          {branchNetwork.subtitle}
        </p>
      </div>

      {/* Working Hours Alert Banner */}
      <div className="bg-gradient-to-r from-sky-900 to-[#005596] text-white rounded-3xl p-5 sm:p-6 shadow-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-white/10 text-amber-300 backdrop-blur-xs">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white">
              Thời gian giao dịch tại quầy:
            </h3>
            <p className="text-xs sm:text-sm text-sky-100 mt-0.5">
              <strong>{brand.workingHours.weekdays.title}:</strong> Sáng từ <strong>07:30 AM Đến 11:30 AM</strong> | Chiều từ <strong>01:30 PM Đến 04:30 PM</strong>
            </p>
            <p className="text-xs text-sky-200">
              <strong>{brand.workingHours.weekend.title}:</strong> {brand.workingHours.weekend.status}
            </p>
          </div>
        </div>

        <a
          href={`tel:${brand.advisor.phoneClean}`}
          className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 shrink-0"
        >
          <Phone className="w-4 h-4" />
          <span>Liên hệ CVTV: {brand.advisor.phone}</span>
        </a>
      </div>

      {/* Search Input Filter */}
      <div className="max-w-md mx-auto mb-8 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm theo tên PGD hoặc địa chỉ..."
          className="w-full py-3 pl-11 pr-4 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-[#005596] text-sm bg-white shadow-xs"
        />
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((branch) => (
          <div
            key={branch.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md hover:shadow-xl hover:border-sky-300 transition flex flex-col justify-between overflow-hidden group"
          >
            <div>
              {/* Photo */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 mb-4 aspect-[16/10] border border-slate-200">
                <img
                  src={branch.image}
                  alt={branch.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                    const parent = (e.currentTarget as HTMLElement).parentElement;
                    if (parent) {
                      const fb = document.createElement('div');
                      fb.className = 'w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center';
                      fb.innerHTML = `<svg class="w-10 h-10 mb-1 text-[#005596]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg><span class="text-xs font-bold text-slate-700">${branch.name}</span>`;
                      parent.appendChild(fb);
                    }
                  }}
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold">
                  {branch.type}
                </span>
              </div>

              {/* Title & Address */}
              <h3 className="text-lg font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#005596] shrink-0" />
                <span>{branch.name}</span>
              </h3>

              <div className="flex items-start gap-2 text-xs text-slate-600 mb-4">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{branch.address}</span>
              </div>
            </div>

            {/* Bottom Actions: Hotline & Google Maps */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <a
                href={`tel:${branch.phone.replace(/[^0-9]/g, '')}`}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition"
              >
                <Phone className="w-3.5 h-3.5 text-red-600" />
                <span>{branch.phone}</span>
              </a>

              <a
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-[#005596] hover:bg-[#004276] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Back button */}
      <div className="mt-10 text-center">
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
