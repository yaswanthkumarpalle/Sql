import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Sliders, 
  Info, 
  Filter, 
  Sparkles, 
  ArrowUpDown,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Branch, Student } from '../types';

interface RankingsTabProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const RankingsTab: React.FC<RankingsTabProps> = ({
  students,
  onSelectStudent
}) => {
  const [rankingMode, setRankingMode] = useState<'OVERALL' | 'PARTITION_BRANCH'>('PARTITION_BRANCH');
  const [primaryMetric, setPrimaryMetric] = useState<'codingScore' | 'cgpa'>('codingScore');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<'ALL' | Branch>('ALL');

  const branchesList: Branch[] = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'AIDS'];

  // Compute Window Functions mathematically
  const computedRankings = useMemo(() => {
    // Clone list
    let list = [...students];

    // Primary sort
    list.sort((a, b) => {
      if (rankingMode === 'PARTITION_BRANCH') {
        const branchComp = a.branch.localeCompare(b.branch);
        if (branchComp !== 0) return branchComp;
      }

      if (primaryMetric === 'codingScore') {
        if (b.codingScore !== a.codingScore) return b.codingScore - a.codingScore;
        return b.cgpa - a.cgpa;
      } else {
        if (b.cgpa !== a.cgpa) return b.cgpa - a.cgpa;
        return b.codingScore - a.codingScore;
      }
    });

    // Window function state tracking
    let currentPartition = '';
    let rowNumber = 0;
    let denseRank = 0;
    let actualRank = 0;
    let prevPrimaryScore = -1;
    let prevSecondaryScore = -1;
    let partitionItemsCount = 0;

    // First pass to compute partition size for NTILE
    const partitionSizes: Record<string, number> = {};
    if (rankingMode === 'PARTITION_BRANCH') {
      students.forEach(s => {
        partitionSizes[s.branch] = (partitionSizes[s.branch] || 0) + 1;
      });
    } else {
      partitionSizes['ALL'] = students.length;
    }

    return list.map((item) => {
      const partitionKey = rankingMode === 'PARTITION_BRANCH' ? item.branch : 'ALL';

      if (partitionKey !== currentPartition) {
        currentPartition = partitionKey;
        rowNumber = 0;
        denseRank = 0;
        actualRank = 0;
        prevPrimaryScore = -1;
        prevSecondaryScore = -1;
        partitionItemsCount = 0;
      }

      rowNumber++;
      partitionItemsCount++;

      const currentPrimary = primaryMetric === 'codingScore' ? item.codingScore : item.cgpa;
      const currentSecondary = primaryMetric === 'codingScore' ? item.cgpa : item.codingScore;

      const isTie = currentPrimary === prevPrimaryScore && currentSecondary === prevSecondaryScore;

      if (!isTie) {
        denseRank++;
        actualRank = partitionItemsCount;
        prevPrimaryScore = currentPrimary;
        prevSecondaryScore = currentSecondary;
      }

      // NTILE calculation
      const totalInPartition = partitionSizes[partitionKey] || 1;
      const ntile = Math.min(4, Math.floor(((rowNumber - 1) * 4) / totalInPartition) + 1);

      return {
        ...item,
        rowNumberVal: rowNumber,
        denseRankVal: denseRank,
        rankVal: actualRank,
        ntileVal: ntile,
        isTie
      };
    });
  }, [students, rankingMode, primaryMetric]);

  // Filter by selected branch if set
  const displayedRankings = useMemo(() => {
    if (selectedBranchFilter === 'ALL') return computedRankings;
    return computedRankings.filter(r => r.branch === selectedBranchFilter);
  }, [computedRankings, selectedBranchFilter]);

  return (
    <div className="space-y-6">
      
      {/* Header & Interactive Toggles */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Candidate Rankings &amp; Merit Standings</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              High-precision academic standings, test score percentiles, and talent quartile stratification
            </p>
          </div>

          {/* Mode Switchers */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Partition toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setRankingMode('OVERALL')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  rankingMode === 'OVERALL'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Overall Batch
              </button>
              <button
                onClick={() => setRankingMode('PARTITION_BRANCH')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  rankingMode === 'PARTITION_BRANCH'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Rank by Department
              </button>
            </div>

            {/* Metric toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setPrimaryMetric('codingScore')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  primaryMetric === 'codingScore'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Coding Score First
              </button>
              <button
                onClick={() => setPrimaryMetric('cgpa')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  primaryMetric === 'cgpa'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                CGPA First
              </button>
            </div>
          </div>
        </div>

        {/* Ranking Method Explanations Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/25 space-y-1">
            <span className="font-bold text-purple-400 text-xs">Dense Rank</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Assigns equal rank to tied scores <strong>without gaps</strong> in sequence (e.g. 1, 2, 2, 3).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/25 space-y-1">
            <span className="font-bold text-blue-400 text-xs">Sequential Position</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Assigns a strict <strong>unique sequential number</strong> to each candidate to break ties.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
            <span className="font-bold text-emerald-400 text-xs">Standard Rank</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Tied candidates share the same rank, with <strong>subsequent ranks skipped</strong> (e.g. 1, 2, 2, 4).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1">
            <span className="font-bold text-amber-400 text-xs">Quartile Tier (Q1-Q4)</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Partitions candidates into <strong>4 equal talent buckets</strong> (Quartile 1 = Top 25%).
            </p>
          </div>

        </div>

        {/* Branch Filter Pills (when in partition mode) */}
        {rankingMode === 'PARTITION_BRANCH' && (
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800 text-xs flex-wrap">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Focus Department:
            </span>
            <button
              onClick={() => setSelectedBranchFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                selectedBranchFilter === 'ALL'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Departments
            </button>
            {branchesList.map(b => (
              <button
                key={b}
                onClick={() => setSelectedBranchFilter(b)}
                className={`px-2.5 py-1 rounded-lg font-mono transition cursor-pointer ${
                  selectedBranchFilter === b
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        )}

        {/* Rankings Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 uppercase text-[10px] tracking-wider text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Dept</th>
                <th className="py-3 px-4 text-center">Coding Score</th>
                <th className="py-3 px-4 text-center">CGPA</th>
                <th className="py-3 px-4 text-center font-bold text-purple-400 bg-purple-500/5">
                  Dense Rank
                </th>
                <th className="py-3 px-4 text-center font-bold text-blue-400 bg-blue-500/5">
                  Sequential #
                </th>
                <th className="py-3 px-4 text-center font-bold text-emerald-400 bg-emerald-500/5">
                  Standard Rank
                </th>
                <th className="py-3 px-4 text-center font-bold text-amber-400 bg-amber-500/5">
                  Quartile
                </th>
                <th className="py-3 px-4 text-right">Placement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {displayedRankings.map((item, idx) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-2.5 px-4 font-semibold text-slate-200">
                    <button 
                      onClick={() => onSelectStudent(item)}
                      className="hover:text-blue-400 transition cursor-pointer text-left"
                    >
                      {item.fullName}
                    </button>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">
                    {item.rollNo}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                      {item.branch}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-blue-400">
                    {item.codingScore}
                  </td>
                  <td className="py-2.5 px-4 text-center font-mono text-slate-200">
                    {item.cgpa.toFixed(2)}
                  </td>

                  {/* Dense Rank */}
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-purple-400 bg-purple-500/5">
                    #{item.denseRankVal}
                  </td>

                  {/* Sequential */}
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-blue-400 bg-blue-500/5">
                    {item.rowNumberVal}
                  </td>

                  {/* Standard Rank */}
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-emerald-400 bg-emerald-500/5">
                    #{item.rankVal}
                  </td>

                  {/* NTILE */}
                  <td className="py-2.5 px-4 text-center font-mono bg-amber-500/5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.ntileVal === 1 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : item.ntileVal === 2 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : item.ntileVal === 3 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      Q{item.ntileVal}
                    </span>
                  </td>

                  <td className="py-2.5 px-4 text-right">
                    {item.status === 'Placed' ? (
                      <span className="text-[10px] font-mono font-semibold text-emerald-400">
                        {item.placedCompany}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">
                        {item.pipelineStage}
                      </span>
                    )}
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
