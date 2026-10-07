import React, { useState } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { FieldsView } from './views/FieldsView';
import { LandMappingView } from './views/LandMappingView';
import { IrrigationAdvisorView } from './views/IrrigationAdvisorView';
import { WeatherView } from './views/WeatherView';
import { CropHealthView } from './views/CropHealthView';
import { SensorSimulatorView } from './views/SensorSimulatorView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { LandingPageView } from './views/LandingPageView';
import { Field } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [advisorInitialField, setAdvisorInitialField] = useState<Field | null>(null);

  const handleOpenAdvisorWithField = (field: Field) => {
    setAdvisorInitialField(field);
    setActiveTab('irrigation');
  };

  // If user is viewing landing page, render standalone full-screen landing view
  if (activeTab === 'landing') {
    return <LandingPageView onStartApp={(tab) => setActiveTab(tab || 'dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop & Mobile Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 xl:pl-72 min-w-0 transition-all">
        {/* Sticky Header Bar */}
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSimulator={() => setActiveTab('simulator')}
        />

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenAdvisorWithField={handleOpenAdvisorWithField}
            />
          )}

          {activeTab === 'fields' && (
            <FieldsView onOpenAdvisorWithField={handleOpenAdvisorWithField} />
          )}

          {activeTab === 'mapping' && <LandMappingView />}

          {activeTab === 'irrigation' && (
            <IrrigationAdvisorView initialField={advisorInitialField} />
          )}

          {activeTab === 'crop-health' && <CropHealthView />}

          {activeTab === 'weather' && <WeatherView />}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'simulator' && <SensorSimulatorView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

export default App;
