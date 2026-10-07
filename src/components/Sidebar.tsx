import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Droplets, 
  Sprout, 
  CloudSun, 
  Waves, 
  BarChart3, 
  Sliders, 
  Settings, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Home,
  Ruler,
  Map as MapIcon
} from 'lucide-react';
import { CropCareLogo } from './CropCareLogo';
import { useLanguage } from '../i18n/LanguageContext';

export type NavTab = 
  | 'dashboard' 
  | 'fields' 
  | 'mapping'
  | 'irrigation' 
  | 'crop-health' 
  | 'weather' 
  | 'reports' 
  | 'simulator' 
  | 'settings'
  | 'landing';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { t } = useLanguage();

  const navItems: { id: NavTab; label: string; icon: any; badge?: string }[] = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'fields', label: t('myFields'), icon: Layers },
    { id: 'mapping', label: t('landMapping'), icon: Ruler, badge: 'GPS' },
    { id: 'irrigation', label: t('irrigation'), icon: Droplets, badge: 'Advisor' },
    { id: 'crop-health', label: t('cropHealth'), icon: Sprout },
    { id: 'weather', label: t('weather'), icon: CloudSun },
    { id: 'reports', label: t('reports'), icon: BarChart3 },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  const handleSelect = (id: NavTab) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between p-4 bg-white border-r border-slate-200/90 shadow-sm">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="px-2 pt-2 flex items-center justify-between">
          <button 
            onClick={() => handleSelect('dashboard')}
            className="focus:outline-none text-left"
          >
            <CropCareLogo size="md" showTagline={true} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-bold shadow-sm shadow-emerald-500/5'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? 'bg-emerald-600 text-white' : 'text-slate-500 group-hover:text-slate-900'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badge === 'Advisor' 
                        ? 'bg-rose-100 text-rose-700' 
                        : item.badge === 'GPS'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <div className="w-1.5 h-4 bg-emerald-600 rounded-full" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <button
          onClick={() => handleSelect('landing')}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-emerald-600" />
            <span>{t('landingPage')}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Info Box */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white shadow-md">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CropCare AI</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            {t('tagline')}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden lg:flex w-64 xl:w-72 flex-col fixed inset-y-0 left-0 z-40">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-4/5 max-w-xs h-full bg-white z-10 shadow-2xl">
            {navContent}
          </div>
        </div>
      )}

      {/* Mobile Bottom Bar for Quick Navigation */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around">
        {[
          { id: 'dashboard' as NavTab, label: 'Home', icon: LayoutDashboard },
          { id: 'fields' as NavTab, label: 'Fields', icon: Layers },
          { id: 'mapping' as NavTab, label: 'Map Land', icon: Ruler },
          { id: 'irrigation' as NavTab, label: 'Irrigate', icon: Droplets },
          { id: 'crop-health' as NavTab, label: 'Health', icon: Sprout },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
                isActive ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
