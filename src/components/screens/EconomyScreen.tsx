import React, { useState } from 'react';
import { Globe2, Calendar, TrendingDown, DollarSign } from 'lucide-react';
import { ECONOMIC_CALENDAR_DATA } from '../../data/marketData';

export const EconomyScreen: React.FC = () => {
  const [filterImpact, setFilterImpact] = useState<'all' | 'high'>('all');

  const filteredEvents = filterImpact === 'all'
    ? ECONOMIC_CALENDAR_DATA
    : ECONOMIC_CALENDAR_DATA.filter(e => e.impact === 'high');

  const centralBankRates = [
    { cb: 'Federal Reserve (Fed)', country: 'United States', rate: '4.75% - 5.00%', nextMeeting: 'Nov 07', bias: 'Dovish' },
    { cb: 'European Central Bank (ECB)', country: 'Euro Area', rate: '3.25%', nextMeeting: 'Tomorrow', bias: 'Dovish' },
    { cb: 'Bank of England (BoE)', country: 'United Kingdom', rate: '5.00%', nextMeeting: 'Nov 07', bias: 'Neutral' },
    { cb: 'Bank of Japan (BoJ)', country: 'Japan', rate: '0.25%', nextMeeting: 'Oct 31', bias: 'Hawkish' },
    { cb: 'Reserve Bank of Australia (RBA)', country: 'Australia', rate: '4.35%', nextMeeting: 'Nov 05', bias: 'Neutral' },
    { cb: 'Swiss National Bank (SNB)', country: 'Switzerland', rate: '1.00%', nextMeeting: 'Dec 12', bias: 'Dovish' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="border-b border-[#2a2e39] pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2962ff] mb-1">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Macroeconomics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Global Economic Indicators
            </h1>
            <p className="text-xs sm:text-sm text-[#787b86] mt-1">
              Track global central bank policy decisions, inflation prints, employment reports, and sovereign economic calendars.
            </p>
          </div>

          {/* Filter button */}
          <div className="flex items-center gap-1 bg-[#1e222d] p-1 rounded-md border border-[#2a2e39] text-xs">
            <button
              onClick={() => setFilterImpact('all')}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                filterImpact === 'all'
                  ? 'bg-[#2962ff] text-white'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilterImpact('high')}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                filterImpact === 'high'
                  ? 'bg-[#2962ff] text-white'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              High Impact Only
            </button>
          </div>
        </div>
      </div>

      {/* Global Central Bank Policy Rates */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#1e222d] border border-[#2a2e39]">
        <div className="mb-4">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#2962ff]" />
            <span>Central Bank Benchmark Policy Rates</span>
          </h2>
          <p className="text-xs text-[#787b86]">
            Prevailing policy interest rate targets across major monetary authorities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {centralBankRates.map(cb => (
            <div
              key={cb.cb}
              className="p-3.5 rounded-lg bg-[#131722] border border-[#2a2e39] flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-white mb-0.5">{cb.cb}</div>
                <div className="text-[11px] text-[#787b86]">{cb.country}</div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#2a2e39] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#787b86] block">TARGET RATE</span>
                  <span className="text-sm font-bold font-mono text-white">{cb.rate}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#787b86] block">NEXT MEETING</span>
                  <span className="text-xs font-medium text-white/90">{cb.nextMeeting}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Economic Calendar Detailed Table */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#1e222d] border border-[#2a2e39]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2962ff]" />
              <span>Economic Calendar</span>
            </h2>
            <p className="text-xs text-[#787b86]">
              Consensus forecasts and reported macroeconomic data
            </p>
          </div>
          <span className="text-xs text-[#787b86]">
            Showing {filteredEvents.length} events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2a2e39] text-[#787b86] font-semibold">
                <th className="py-2.5 px-3">DATE / TIME</th>
                <th className="py-2.5 px-3">COUNTRY</th>
                <th className="py-2.5 px-3">EVENT</th>
                <th className="py-2.5 px-3 text-center">IMPACT</th>
                <th className="py-2.5 px-3 text-right">ACTUAL</th>
                <th className="py-2.5 px-3 text-right">FORECAST</th>
                <th className="py-2.5 px-3 text-right">PREVIOUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/60">
              {filteredEvents.map(ev => (
                <tr key={ev.id} className="hover:bg-[#2a2e39]/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-white">
                    <span className="block font-bold">{ev.date}</span>
                    <span className="text-[11px] text-[#787b86]">{ev.time}</span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={ev.flagUrl}
                        alt={ev.countryCode}
                        className="w-4 h-4 rounded-full object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-medium text-white">{ev.country}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-medium text-white max-w-xs">
                    {ev.event}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ev.impact === 'high'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {ev.impact}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">
                    {ev.actual}
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-[#787b86] tabular-nums">
                    {ev.forecast}
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-[#787b86] tabular-nums">
                    {ev.previous}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
