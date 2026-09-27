import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  IndianRupee, 
  Building2, 
  ArrowUpRight, 
  Filter, 
  Award, 
  Trophy,
  Sparkles,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  FileSpreadsheet
} from 'lucide-react';
import { Branch, CompanyDrive, CurrentUser, Student } from '../types';

interface AnalyticsTabProps {
  students: Student[];
  drives: CompanyDrive[];
  currentUser?: CurrentUser;
  onNavigateToMatcher: (driveId?: string) => void;
  onNavigateToDirectory: (filterBranch?: Branch) => void;
  onSelectStudent: (student: Student) => void;
  onOpenOfferLetter?: (student: Student) => void;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  students,
  drives,
  currentUser,
  onNavigateToMatcher,
  onNavigateToDirectory,
  onSelectStudent,
  onOpenOfferLetter
}) => {
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<'ALL' | Branch>('ALL');

  const loggedInStudent = currentUser?.role === 'student' && currentUser.studentId
    ? students.find(s => s.id === currentUser.studentId)
    : null;

  const eligibleDrivesForStudent = loggedInStudent
    ? drives.filter(d => 
        loggedInStudent.cgpa >= d.minCgpa && 
        loggedInStudent.activeBacklogs <= d.maxBacklogs && 
        d.branches.includes(loggedInStudent.branch)
      )
    : [];

  const filteredStudents = selectedBranchFilter === 'ALL' 
    ? students 
    : students.filter(s => s.branch === selectedBranchFilter);

  const total = filteredStudents.length;
  const placed = filteredStudents.filter(s => s.status === 'Placed' || s.status === 'Offer Accepted').length;
  const placementRate = total > 0 ? ((placed / total) * 100).toFixed(1) : '0';
  
  const zeroBacklog = filteredStudents.filter(s => s.activeBacklogs === 0).length;
  const zeroBacklogRate = total > 0 ? ((zeroBacklog / total) * 100).toFixed(1) : '0';

  const placedStudents = filteredStudents.filter(s => s.offeredCtc && s.offeredCtc > 0);
  const avgCtc = placedStudents.length > 0
    ? (placedStudents.reduce((sum, s) => sum + (s.offeredCtc || 0), 0) / placedStudents.length).toFixed(1)
    : '0';

  const maxCtc = placedStudents.length > 0
    ? Math.max(...placedStudents.map(s => s.offeredCtc || 0)).toFixed(1)
    : '0';

  // Branch statistics calculation
  const branches: Branch[] = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'AIDS'];
  const branchStats = branches.map(b => {
    const inBranch = students.filter(s => s.branch === b);
    const bPlaced = inBranch.filter(s => s.status === 'Placed' || s.status === 'Offer Accepted').length;
    const avgCgpa = inBranch.length > 0 
      ? (inBranch.reduce((sum, s) => sum + s.cgpa, 0) / inBranch.length).toFixed(2)
      : '0';
    const rate = inBranch.length > 0 ? Math.round((bPlaced / inBranch.length) * 100) : 0;
    return {
      branch: b,
      total: inBranch.length,
      placed: bPlaced,
      avgCgpa: Number(avgCgpa),
      rate
    };
  });

  // Pipeline counts
  const pipelineCounts = {
    Applied: students.filter(s => s.pipelineStage === 'Applied').length,
    'Written Test': students.filter(s => s.pipelineStage === 'Written Test').length,
    'Tech Rounds': students.filter(s => s.pipelineStage === 'Technical Round 1' || s.pipelineStage === 'Technical Round 2').length,
    'HR Round': students.filter(s => s.pipelineStage === 'HR Round').length,
    Selected: students.filter(s => s.pipelineStage === 'Selected').length
  };

  // CTC Buckets
  const ctcBuckets = [
    { label: '< 8 LPA', count: students.filter(s => s.offeredCtc && s.offeredCtc < 8).length, color: 'bg-slate-500' },
    { label: '8 - 15 LPA', count: students.filter(s => s.offeredCtc && s.offeredCtc >= 8 && s.offeredCtc < 15).length, color: 'bg-blue-500' },
    { label: '15 - 25 LPA', count: students.filter(s => s.offeredCtc && s.offeredCtc >= 15 && s.offeredCtc < 25).length, color: 'bg-indigo-500' },
    { label: '25 - 32 LPA', count: students.filter(s => s.offeredCtc && s.offeredCtc >= 25 && s.offeredCtc < 32).length, color: 'bg-purple-500' },
    { label: '> 32 LPA (Super Dream)', count: students.filter(s => s.offeredCtc && s.offeredCtc >= 32).length, color: 'bg-emerald-500' }
  ];

  // Top 5 rankers
  const topRankers = [...students]
    .sort((a, b) => b.codingScore - a.codingScore || b.cgpa - a.cgpa)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Student Logged-in Personalized Candidate Card */}
      {loggedInStudent && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-xl space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-emerald-600/30">
                {loggedInStudent.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{loggedInStudent.fullName}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Candidate Portal (Read-Only)
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Roll No: <span className="font-mono text-white">{loggedInStudent.rollNo}</span> • Dept: <span className="font-semibold text-white">{loggedInStudent.branch}</span> • CGPA: <span className="font-mono font-bold text-emerald-400">{loggedInStudent.cgpa}</span> • Coding: <span className="font-mono font-bold text-blue-400">{loggedInStudent.codingScore} pts</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {(loggedInStudent.status === 'Placed' || loggedInStudent.status === 'Offer Accepted') && onOpenOfferLetter && (
                <button
                  onClick={() => onOpenOfferLetter(loggedInStudent)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>View Official Offer Letter</span>
                </button>
              )}

              <button
                onClick={() => onSelectStudent(loggedInStudent)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              >
                <span>My Full Transcript</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 block font-medium">Placement Status</span>
              <span className={`font-bold ${loggedInStudent.status === 'Placed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {loggedInStudent.status} {loggedInStudent.placedCompany ? `(${loggedInStudent.placedCompany})` : ''}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 block font-medium">Eligible Drives</span>
              <span className="font-bold text-blue-400 font-mono">
                {eligibleDrivesForStudent.length} of {drives.length} Companies
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 block font-medium">Active Backlogs</span>
              <span className={`font-bold font-mono ${loggedInStudent.activeBacklogs === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {loggedInStudent.activeBacklogs === 0 ? '0 (Clean Record)' : `${loggedInStudent.activeBacklogs} Pending`}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 block font-medium">CRUD Permission</span>
              <span className="text-slate-400 font-medium">Disabled (Student)</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner & Branch Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Campus Placement Performance Dashboard</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Live Aggregate
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time analytics across academic branches, corporate drives, and recruitment pipelines
          </p>
        </div>

        {/* Branch Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Branch:
          </span>
          <button
            onClick={() => setSelectedBranchFilter('ALL')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
              selectedBranchFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          {branches.map(b => (
            <button
              key={b}
              onClick={() => setSelectedBranchFilter(b)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
                selectedBranchFilter === b
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Registered Students */}
        <div 
          onClick={() => onNavigateToDirectory(selectedBranchFilter !== 'ALL' ? selectedBranchFilter : undefined)}
          className="group p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition-all duration-300 relative overflow-hidden cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/15 transition-all"></div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Registered</p>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">{total}</h3>
            <span className="text-xs font-medium text-slate-400">students</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 100% Verified
            </span>
            <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Directory &rarr;
            </span>
          </div>
        </div>

        {/* Card 2: Total Offers Placed */}
        <div className="group p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all"></div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Offers Placed</p>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">{placed}</h3>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {placementRate}% rate
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700" 
              style={{ width: `${placementRate}%` }}
            />
          </div>
        </div>

        {/* Card 3: Zero Backlogs */}
        <div className="group p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/15 transition-all"></div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Zero Backlogs</p>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">{zeroBacklog}</h3>
            <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              {zeroBacklogRate}% drive-ready
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Clean Academic History</span>
            <span className="text-slate-300 font-mono text-[11px]">{total - zeroBacklog} with backlogs</span>
          </div>
        </div>

        {/* Card 4: Average / Highest CTC */}
        <div className="group p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all"></div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average / Highest CTC</p>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <IndianRupee className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-amber-400 tracking-tight font-mono">₹{avgCtc} L</h3>
            <span className="text-xs text-slate-400">/ ₹{maxCtc} L (Max)</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span className="text-amber-300 font-medium">Top Tier: Google, Microsoft</span>
            <span className="text-slate-500 font-mono">LPA</span>
          </div>
        </div>

      </div>

      {/* Main Charts & Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Placement Comparison Chart (SVG-based, reliable, sharp) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm sm:text-base">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>Department-Wise Placement Ratio & Academic CGPA</span>
              </h3>
              <p className="text-xs text-slate-400">Placement % compared against department average CGPA</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block"></span>
                <span>Placement %</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block"></span>
                <span>Avg CGPA (x10)</span>
              </div>
            </div>
          </div>

          {/* Department Bar Graphic */}
          <div className="space-y-4 pt-2">
            {branchStats.map(item => (
              <div key={item.branch} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700 font-mono text-[11px]">
                      {item.branch}
                    </span>
                    <span className="text-slate-400">({item.placed} of {item.total} Placed)</span>
                  </span>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-blue-400 font-bold">{item.rate}%</span>
                    <span className="text-emerald-400 font-bold">CGPA: {item.avgCgpa}</span>
                  </div>
                </div>

                {/* Dual Progress Bars */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 hover:bg-blue-400 transition-all duration-500 h-full rounded-full" 
                      style={{ width: `${item.rate}%` }}
                      title={`Placement: ${item.rate}%`}
                    />
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 hover:bg-emerald-400 transition-all duration-500 h-full rounded-full" 
                      style={{ width: `${(item.avgCgpa / 10) * 100}%` }}
                      title={`Avg CGPA: ${item.avgCgpa}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Aggregated across all registered batch students and academic departments</span>
            <button 
              onClick={() => onNavigateToDirectory()}
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Students</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CTC Package Distribution Card */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div>
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm sm:text-base">
              <Award className="w-4 h-4 text-amber-400" />
              <span>CTC Package Tiers</span>
            </h3>
            <p className="text-xs text-slate-400">Salary bands of verified placement offers</p>
          </div>

          <div className="space-y-3 pt-1">
            {ctcBuckets.map(b => {
              const pct = placedStudents.length > 0 
                ? Math.round((b.count / placedStudents.length) * 100) 
                : 0;
              return (
                <div key={b.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{b.label}</span>
                    <span className="text-slate-400 font-mono">{b.count} offers ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`${b.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Super Dream Offers (&gt;₹25L)</span>
              <span className="text-emerald-400 font-bold font-mono">
                {students.filter(s => s.offeredCtc && s.offeredCtc >= 25).length} candidates
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Median Batch Salary</span>
              <span className="text-amber-400 font-bold font-mono">₹14.5 LPA</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recruitment Funnel & Active Corporate Drives Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recruitment Pipeline Funnel */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              <span>Hiring Pipeline Conversion</span>
            </h3>
            <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              Active Drives
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {Object.entries(pipelineCounts).map(([stage, count], idx) => {
              const widthPct = Math.max(15, Math.min(100, Math.round((count / students.length) * 100 * 2.5)));
              const colors = [
                'from-blue-600 to-indigo-600',
                'from-indigo-600 to-purple-600',
                'from-purple-600 to-pink-600',
                'from-pink-600 to-amber-600',
                'from-emerald-600 to-teal-500'
              ];
              return (
                <div key={stage} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">{stage}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden hidden sm:block">
                      <div className={`h-full bg-gradient-to-r ${colors[idx]} rounded-full`} style={{ width: `${widthPct}%` }} />
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-100 w-8 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Corporate Drives Quick Access Grid */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm sm:text-base">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>Featured Corporate Recruitment Drives</span>
              </h3>
              <p className="text-xs text-slate-400">Match batch eligibility criteria against partner companies</p>
            </div>
            <button
              onClick={() => onNavigateToMatcher()}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Full Matcher</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {drives.slice(0, 6).map(drive => (
              <div
                key={drive.id}
                onClick={() => onNavigateToMatcher(drive.id)}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-900/80 transition-all duration-200 cursor-pointer space-y-2.5 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm group-hover:text-blue-400 transition-colors">
                      {drive.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{drive.role}</p>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {drive.ctc}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Min CGPA: <strong className="text-white">{drive.minCgpa}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Backlogs: <strong className="text-white">&le; {drive.maxBacklogs}</strong>
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{drive.openings} Openings</span>
                  <span className="text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Match &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top 5 Ranked Candidates Preview Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm sm:text-base">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Campus Coding Assessment Top Rankers</span>
            </h3>
            <p className="text-xs text-slate-400">Ranked by overall coding challenge score and academic cumulative CGPA</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {topRankers.map((student, idx) => (
            <div
              key={student.id}
              onClick={() => onSelectStudent(student)}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 transition-all cursor-pointer space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-center font-mono">
                  #{idx + 1}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {student.branch}
                </span>
              </div>
              <div>
                <p className="font-bold text-slate-200 text-xs truncate">{student.fullName}</p>
                <p className="text-[11px] text-slate-400 font-mono">{student.rollNo}</p>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                <span className="text-emerald-400 font-bold font-mono">{student.codingScore} pts</span>
                <span className="text-slate-300 font-mono">CGPA {student.cgpa}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
