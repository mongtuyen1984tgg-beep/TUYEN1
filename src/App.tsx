/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { FaqSection } from './components/FaqSection';
import { AppDownloadSection } from './components/AppDownloadSection';
import { GameHub } from './components/GameHub';
import { DepositCalculator } from './components/DepositCalculator';
import { LoanScheduleCalculator } from './components/LoanScheduleCalculator';
import { FeaturedProducts } from './components/FeaturedProducts';
import { BranchNetwork } from './components/BranchNetwork';
import { EndConversationModal } from './components/EndConversationModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isEndModalOpen, setIsEndModalOpen] = useState<boolean>(false);

  const handleBackToMainMenu = () => {
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

      {/* Main Content Area */}
      <main className="grow">
        {activeTab === 'home' && (
          <HomeDashboard
            onSelectTab={handleSelectTab}
            onEndConversation={() => setIsEndModalOpen(true)}
          />
        )}

        {activeTab === 'faq' && (
          <FaqSection
            onBackToMainMenu={handleBackToMainMenu}
            onEndConversation={() => setIsEndModalOpen(true)}
          />
        )}

        {activeTab === 'download_app' && (
          <AppDownloadSection
            onBackToMainMenu={handleBackToMainMenu}
          />
        )}

        {activeTab === 'game' && (
          <GameHub
            onBackToMainMenu={handleBackToMainMenu}
          />
        )}

        {activeTab === 'deposit_calc' && (
          <DepositCalculator
            onBackToMainMenu={handleBackToMainMenu}
          />
        )}

        {activeTab === 'loan_calc' && (
          <LoanScheduleCalculator
            onBackToMainMenu={handleBackToMainMenu}
          />
        )}

        {activeTab === 'products' && (
          <FeaturedProducts
            onBackToMainMenu={handleBackToMainMenu}
          />
        )}

        {activeTab === 'branches' && (
          <BranchNetwork
            onBackToMainMenu={handleBackToMainMenu}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={handleSelectTab}
        onEndConversation={() => setIsEndModalOpen(true)}
      />

      {/* End Conversation Modal */}
      <EndConversationModal
        isOpen={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        onGoHome={handleBackToMainMenu}
      />
    </div>
  );
}
