import React from 'react';
import { useMarket } from '../context/MarketContext';
import { Bookmark, Bell, Newspaper, Calendar, Flame } from 'lucide-react';

interface ToolItem {
  id: 'watchlist' | 'alerts' | 'news' | 'calendar';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const RightToolStrip: React.FC = () => {
  const { activeSidebarTab, setActiveSidebarTab, watchlist, alerts } = useMarket();

  const tools: ToolItem[] = [
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark, badge: watchlist.length },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: alerts.length },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  return (
    <aside className="hidden md:flex flex-col items-center py-4 bg-[#1e222d] dark:bg-[#1e222d] light:bg-[#f0f3fa] border-l border-[#2a2e39] dark:border-[#2a2e39] light:border-slate-200 w-12 shrink-0 select-none">
      <div className="flex flex-col items-center gap-3 w-full">
        {tools.map(tool => {
          const Icon = tool.icon;
          const isActive = activeSidebarTab === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => setActiveSidebarTab(isActive ? null : (tool.id as any))}
              className={`p-2.5 rounded-lg relative transition-colors ${
                isActive
                  ? 'bg-[#2962ff] text-white shadow-md'
                  : 'text-[#787b86] hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-[#2a2e39] dark:hover:bg-[#2a2e39] light:hover:bg-slate-200'
              }`}
              title={tool.label}
              aria-label={tool.label}
            >
              <Icon className="w-4 h-4" />
              {tool.badge !== undefined && tool.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#2962ff] text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center border border-[#1e222d]">
                  {tool.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
