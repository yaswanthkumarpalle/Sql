import React, { useState } from 'react';
import { Terminal, X, Copy, Check, Database, Layers, ShieldCheck } from 'lucide-react';
import { SQL_SCHEMA_DDL } from '../data/mockData';

interface SqlDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlDrawer: React.FC<SqlDrawerProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sections = [
    {
      title: '1. Relational Schema & Composite Indexes (DDL)',
      desc: 'Creates the core 5 tables with referential integrity constraints and composite indexes for sub-millisecond query evaluation.',
      code: SQL_SCHEMA_DDL
    },
    {
      title: '2. Multi-Criteria Drive Matcher Filter (DML)',
      desc: 'Filters candidates for high-tier corporate drives utilizing the composite B-Tree index on (cgpa, backlogs, coding_score).',
      code: `SELECT 
    s.roll_no,
    s.full_name,
    s.branch,
    a.cgpa,
    a.active_backlogs,
    a.coding_score
FROM Students s
JOIN AcademicRecords a ON s.student_id = a.student_id
WHERE a.cgpa >= 8.00
  AND a.active_backlogs = 0
  AND s.branch IN ('CSE', 'IT', 'AIDS')
  AND a.coding_score >= 750
ORDER BY a.coding_score DESC;`
    },
    {
      title: '3. SQL Window Functions Partitioning',
      desc: 'Evaluates DENSE_RANK(), ROW_NUMBER(), and RANK() partitioned by student department to determine class valedictorians.',
      code: `SELECT 
    s.full_name,
    s.branch,
    a.coding_score,
    a.cgpa,
    DENSE_RANK() OVER (
        PARTITION BY s.branch 
        ORDER BY a.coding_score DESC, a.cgpa DESC
    ) AS branch_dense_rank,
    ROW_NUMBER() OVER (
        PARTITION BY s.branch 
        ORDER BY a.coding_score DESC, a.cgpa DESC
    ) AS branch_row_num,
    RANK() OVER (
        PARTITION BY s.branch 
        ORDER BY a.coding_score DESC
    ) AS branch_rank,
    NTILE(4) OVER (
        PARTITION BY s.branch 
        ORDER BY a.coding_score DESC
    ) AS branch_quartile
FROM Students s
JOIN AcademicRecords a ON s.student_id = a.student_id;`
    },
    {
      title: '4. Common Table Expressions (CTE) & Aggregate Reporting',
      desc: 'Aggregates placement conversion metrics, average salary packages, and academic averages per branch.',
      code: `WITH BranchSummary AS (
    SELECT 
        s.branch,
        COUNT(s.student_id) AS total_students,
        SUM(CASE WHEN da.current_stage = 'Selected' THEN 1 ELSE 0 END) AS placed_students,
        ROUND(AVG(a.cgpa), 2) AS avg_cgpa,
        ROUND(AVG(da.offered_ctc), 2) AS avg_placed_ctc
    FROM Students s
    JOIN AcademicRecords a ON s.student_id = a.student_id
    LEFT JOIN DriveApplications da ON s.student_id = da.student_id
    GROUP BY s.branch
)
SELECT 
    branch,
    total_students,
    placed_students,
    ROUND((placed_students * 100.0 / total_students), 1) AS placement_pct,
    avg_cgpa,
    COALESCE(avg_placed_ctc, 0) AS avg_ctc_lpa
FROM BranchSummary
ORDER BY placement_pct DESC;`
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-2xl bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Underlying DBMS Architecture &amp; SQL Engine</h3>
              <p className="text-[11px] text-slate-400">PostgreSQL / ANSI SQL DDL, DML, Indexes &amp; Window Functions</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Indexing Info Box */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1">
            <h4 className="font-bold text-blue-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Composite B-Tree Index Optimization
            </h4>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              When querying over 10,000+ student records with multiple conditions (<code className="text-blue-300 font-mono">branch = 'CSE' AND cgpa &gt;= 8.0 AND active_backlogs = 0</code>), a composite index prevents sequential table scans and reduces lookup complexity from O(N) to O(log N).
            </p>
          </div>

          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                  {sec.title}
                </h4>
                <button
                  onClick={() => copyCode(sec.code, idx)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-sans border border-slate-700 transition cursor-pointer"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-slate-400 text-xs font-sans">{sec.desc}</p>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <pre className="text-blue-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {sec.code}
                </pre>
              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
};
