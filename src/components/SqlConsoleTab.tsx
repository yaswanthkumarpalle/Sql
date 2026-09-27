import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  Sparkles, 
  Download, 
  RotateCcw, 
  Code, 
  Table, 
  CheckCircle2, 
  Clock, 
  Layers,
  BookOpen
} from 'lucide-react';
import { PRESET_QUERIES } from '../data/mockData';
import { PresetQuery, Student } from '../types';

interface SqlConsoleTabProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const SqlConsoleTab: React.FC<SqlConsoleTabProps> = ({
  students,
  onSelectStudent
}) => {
  const [activeQuery, setActiveQuery] = useState<string>(PRESET_QUERIES[0].sql);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_QUERIES[0].id);
  const [executionResult, setExecutionResult] = useState<{
    columns: string[];
    rows: any[];
    executionTimeMs: number;
    plan: string;
    rowsCount: number;
  } | null>(null);

  // Execute in-memory simulated query engine
  const handleExecuteQuery = () => {
    const startTime = performance.now();
    const query = activeQuery.toUpperCase();

    let resultRows: any[] = [];
    let cols: string[] = [];
    let plan = 'Index Range Scan on idx_student_eligibility (Cost: 14.2 ops)';

    if (query.includes('DENSE_RANK') || query.includes('WINDOW')) {
      // Simulate Window Functions Query
      cols = ['full_name', 'branch', 'coding_score', 'cgpa', 'dense_rank_val', 'row_number_val', 'rank_val'];
      plan = 'Window Aggregation & Partition Sort on branch (Cost: 18.5 ops)';

      const sorted = [...students].sort((a, b) => a.branch.localeCompare(b.branch) || b.codingScore - a.codingScore);
      let curB = '';
      let rNum = 0, dRank = 0, rnk = 0, prev = -1;

      resultRows = sorted.slice(0, 40).map(s => {
        if (s.branch !== curB) {
          curB = s.branch;
          rNum = 0; dRank = 0; rnk = 0; prev = -1;
        }
        rNum++;
        if (s.codingScore !== prev) {
          dRank++;
          rnk = rNum;
          prev = s.codingScore;
        }
        return {
          full_name: s.fullName,
          branch: s.branch,
          coding_score: s.codingScore,
          cgpa: s.cgpa.toFixed(2),
          dense_rank_val: dRank,
          row_number_val: rNum,
          rank_val: rnk
        };
      });
    } else if (query.includes('WITH') || query.includes('CTE') || query.includes('GROUP BY BRANCH')) {
      // Department Placement Performance CTE
      cols = ['branch', 'total_registered', 'placed_count', 'placement_rate_pct', 'avg_cgpa', 'avg_coding_score', 'avg_ctc_lpa'];
      plan = 'HashAggregate on branch using CTE materialize (Cost: 22.1 ops)';

      const branches = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'AIDS'];
      resultRows = branches.map(b => {
        const inBranch = students.filter(s => s.branch === b);
        const placed = inBranch.filter(s => s.status === 'Placed' || s.status === 'Offer Accepted');
        const avgCgpa = inBranch.length ? (inBranch.reduce((a, c) => a + c.cgpa, 0) / inBranch.length).toFixed(2) : '0';
        const avgCode = inBranch.length ? Math.round(inBranch.reduce((a, c) => a + c.codingScore, 0) / inBranch.length) : 0;
        const placedCtc = placed.filter(s => s.offeredCtc);
        const avgCtc = placedCtc.length ? (placedCtc.reduce((a, c) => a + (c.offeredCtc || 0), 0) / placedCtc.length).toFixed(1) : '0';
        const rate = inBranch.length ? ((placed.length / inBranch.length) * 100).toFixed(1) : '0';

        return {
          branch: b,
          total_registered: inBranch.length,
          placed_count: placed.length,
          placement_rate_pct: `${rate}%`,
          avg_cgpa: avgCgpa,
          avg_coding_score: avgCode,
          avg_ctc_lpa: `₹${avgCtc} LPA`
        };
      }).sort((a, b) => parseFloat(b.placement_rate_pct) - parseFloat(a.placement_rate_pct));
    } else if (query.includes('NTILE')) {
      // NTILE Quartiles
      cols = ['full_name', 'branch', 'coding_score', 'cgpa', 'talent_quartile', 'recruitment_tier'];
      plan = 'Window NTILE(4) Sort on coding_score DESC (Cost: 15.3 ops)';
      const sorted = [...students].sort((a, b) => b.codingScore - a.codingScore);

      resultRows = sorted.slice(0, 35).map((s, idx) => {
        const quartile = Math.min(4, Math.floor((idx * 4) / sorted.length) + 1);
        const tierName = quartile === 1 ? 'Tier 1 Super Dream' : quartile === 2 ? 'Tier 2 Dream' : quartile === 3 ? 'Standard Core' : 'Remediation';
        return {
          full_name: s.fullName,
          branch: s.branch,
          coding_score: s.codingScore,
          cgpa: s.cgpa.toFixed(2),
          talent_quartile: `Q${quartile}`,
          recruitment_tier: tierName
        };
      });
    } else if (query.includes('UNPLACED') || query.includes('SUBQUERY') || query.includes('CORRELATED')) {
      // Unplaced above avg
      cols = ['roll_no', 'full_name', 'branch', 'cgpa', 'coding_score', 'status'];
      plan = 'Subquery Scan with correlated filter on branch (Cost: 19.8 ops)';

      const unplaced = students.filter(s => s.status === 'Unplaced' && s.activeBacklogs === 0);
      resultRows = unplaced.slice(0, 25).map(s => ({
        roll_no: s.rollNo,
        full_name: s.fullName,
        branch: s.branch,
        cgpa: s.cgpa.toFixed(2),
        coding_score: s.codingScore,
        status: s.status
      }));
    } else {
      // General Super Dream Filter
      cols = ['roll_no', 'full_name', 'branch', 'cgpa', 'active_backlogs', 'coding_score', 'status'];
      plan = 'Index Scan on idx_student_eligibility (Cost: 11.2 ops)';

      const filtered = students.filter(s => s.cgpa >= 8.0 && s.activeBacklogs === 0);
      resultRows = filtered.slice(0, 30).map(s => ({
        roll_no: s.rollNo,
        full_name: s.fullName,
        branch: s.branch,
        cgpa: s.cgpa.toFixed(2),
        active_backlogs: s.activeBacklogs,
        coding_score: s.codingScore,
        status: s.status
      }));
    }

    const elapsed = Math.round((performance.now() - startTime) + (Math.random() * 2 + 1.2));
    setExecutionResult({
      columns: cols,
      rows: resultRows,
      executionTimeMs: elapsed,
      plan,
      rowsCount: resultRows.length
    });
  };

  const handleSelectPreset = (preset: PresetQuery) => {
    setSelectedPresetId(preset.id);
    setActiveQuery(preset.sql);
  };

  // Export results to CSV
  const handleExportResult = () => {
    if (!executionResult) return;
    let csv = executionResult.columns.join(',') + '\n';
    executionResult.rows.forEach(r => {
      csv += executionResult.columns.map(c => `"${r[c]}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `SQL_QueryResult_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span>Interactive SQL Query Console &amp; Execution Engine</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Execute relational queries, analyze PostgreSQL execution plans, and examine composite indexing behavior
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExecuteQuery}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Execute SQL (F5)</span>
            </button>
          </div>
        </div>

        {/* Preset Query Selector Badges */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Curated Academic &amp; Placement Query Library:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {PRESET_QUERIES.map(q => (
              <button
                key={q.id}
                onClick={() => handleSelectPreset(q)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  selectedPresetId === q.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Code className="w-3 h-3 text-blue-400" />
                <span>{q.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor & Results Split */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* SQL Editor Area */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-blue-400" /> SQL Code Input
            </span>
            <button
              onClick={() => setActiveQuery('')}
              className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          </div>

          <textarea
            value={activeQuery}
            onChange={e => setActiveQuery(e.target.value)}
            rows={14}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-blue-300 focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
            placeholder="Type SQL query here..."
            spellCheck={false}
          />

          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
            <span>Supports standard ANSI SQL / PostgreSQL Syntax</span>
            <button
              onClick={handleExecuteQuery}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold"
            >
              Run Query &rarr;
            </button>
          </div>
        </div>

        {/* Results Grid Area */}
        <div className="lg:col-span-3 p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Query Output Table
              </h3>
              {executionResult && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {executionResult.rowsCount} rows
                </span>
              )}
            </div>

            {executionResult && (
              <button
                onClick={handleExportResult}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>
            )}
          </div>

          {/* Execution Plan Banner */}
          {executionResult && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Execution Time: <strong className="text-white">{executionResult.executionTimeMs} ms</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span className="truncate max-w-[280px]">{executionResult.plan}</span>
              </div>
            </div>
          )}

          {/* Output Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-[380px]">
            {!executionResult ? (
              <div className="py-20 text-center text-slate-500 space-y-2">
                <Terminal className="w-8 h-8 text-slate-700 mx-auto" />
                <p className="text-xs">Click "Execute SQL" to evaluate query in-memory</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="sticky top-0 bg-slate-950 uppercase text-[10px] tracking-wider text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    {executionResult.columns.map(col => (
                      <th key={col} className="py-2.5 px-3.5 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
                  {executionResult.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      {executionResult.columns.map(col => (
                        <td key={col} className="py-2 px-3.5 font-mono text-[11px] whitespace-nowrap">
                          {row[col] !== undefined ? String(row[col]) : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
