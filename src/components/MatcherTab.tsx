import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  ArrowRight, 
  UserCheck
} from 'lucide-react';
import { Branch, CompanyDrive, PipelineStage, Student } from '../types';

interface MatcherTabProps {
  students: Student[];
  drives: CompanyDrive[];
  selectedDriveId?: string;
  onSelectStudent: (student: Student) => void;
  onBulkAdvanceCandidates: (studentIds: string[], targetStage: PipelineStage, companyName: string) => void;
  isAuthor?: boolean;
}

export const MatcherTab: React.FC<MatcherTabProps> = ({
  students,
  drives,
  selectedDriveId,
  onSelectStudent,
  onBulkAdvanceCandidates,
  isAuthor = true
}) => {
  const [selectedId, setSelectedId] = useState<string>(selectedDriveId || drives[0]?.id || 'custom');
  
  // Custom criteria state (when custom is chosen or for overrides)
  const [customCgpa, setCustomCgpa] = useState<number>(7.5);
  const [customBacklogs, setCustomBacklogs] = useState<number>(0);
  const [customMinCoding, setCustomMinCoding] = useState<number>(600);
  const [customBranches, setCustomBranches] = useState<Branch[]>(['CSE', 'IT', 'AIDS', 'ECE']);
  const [filterSkillsMatchOnly, setFilterSkillsMatchOnly] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const branchesList: Branch[] = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'AIDS'];

  // Current active drive or synthesized custom drive
  const currentDrive = useMemo<CompanyDrive>(() => {
    if (selectedId === 'custom') {
      return {
        id: 'custom',
        name: 'Custom Ad-Hoc Evaluation Criteria',
        logo: 'Sliders',
        role: 'Parametric Placement Assessment',
        ctc: 'Custom',
        ctcNumber: 0,
        minCgpa: customCgpa,
        maxBacklogs: customBacklogs,
        minCodingScore: customMinCoding,
        branches: customBranches,
        requiredSkills: ['Problem Solving', 'Data Structures', 'SQL'],
        tier: 'Standard',
        deadline: new Date().toISOString().split('T')[0],
        date: new Date().toISOString().split('T')[0],
        location: 'Campus Interview Blocks',
        openings: 25,
        appliedCount: 0,
        selectedCount: 0,
        rounds: ['Assessment', 'Technical Round', 'HR'],
        description: 'Dynamic criterion builder simulating custom company eligibility thresholds.'
      };
    }
    const found = drives.find(d => d.id === selectedId);
    return found || drives[0];
  }, [selectedId, drives, customCgpa, customBacklogs, customMinCoding, customBranches]);

  // Compute matched eligible candidates
  const eligibleCandidates = useMemo(() => {
    return students.filter(s => {
      const matchCgpa = s.cgpa >= currentDrive.minCgpa;
      const matchBacklogs = s.activeBacklogs <= currentDrive.maxBacklogs;
      const matchBranch = currentDrive.branches.includes(s.branch);
      const matchCoding = s.codingScore >= currentDrive.minCodingScore;

      let matchSkills = true;
      if (filterSkillsMatchOnly && currentDrive.requiredSkills.length > 0) {
        matchSkills = currentDrive.requiredSkills.some(req => 
          s.skills.some(sk => sk.toLowerCase().includes(req.toLowerCase()))
        );
      }

      return matchCgpa && matchBacklogs && matchBranch && matchCoding && matchSkills;
    }).sort((a, b) => b.codingScore - a.codingScore || b.cgpa - a.cgpa);
  }, [students, currentDrive, filterSkillsMatchOnly]);

  // Bulk advance eligible candidates to Written Test stage
  const handleBulkPromote = () => {
    if (eligibleCandidates.length === 0) return;
    const ids = eligibleCandidates.map(c => c.id);
    onBulkAdvanceCandidates(ids, 'Written Test', currentDrive.name);
    setToastMessage(`Successfully advanced ${ids.length} eligible candidates into the "${currentDrive.name}" recruitment pipeline!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Export CSV
  const handleExportCsv = () => {
    let csv = `Eligible Candidates for ${currentDrive.name}\n`;
    csv += "Student ID,Roll No,Full Name,Branch,CGPA,Active Backlogs,Coding Score,Matched Skills,Pipeline Status\n";
    eligibleCandidates.forEach(c => {
      const matchedSkills = c.skills.filter(sk => currentDrive.requiredSkills.some(req => req.toLowerCase().includes(sk.toLowerCase()))).join(';');
      csv += `${c.id},${c.rollNo},"${c.fullName}",${c.branch},${c.cgpa},${c.activeBacklogs},${c.codingScore},"${matchedSkills}",${c.pipelineStage}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Eligible_${currentDrive.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const toggleBranch = (b: Branch) => {
    if (customBranches.includes(b)) {
      if (customBranches.length > 1) {
        setCustomBranches(customBranches.filter(item => item !== b));
      }
    } else {
      setCustomBranches([...customBranches, b]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white">&times;</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Drive Selector & Custom Criteria Builder */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Select Placement Drive</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluates eligibility rules against composite student database records
            </p>
          </div>

          {/* Drive List */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {drives.map(drive => {
              const isSelected = selectedId === drive.id;
              return (
                <div
                  key={drive.id}
                  onClick={() => setSelectedId(drive.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600/10 border-blue-500/60 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-400'}`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-100 text-xs">{drive.name}</h4>
                        <span className="text-[10px] font-mono font-bold text-emerald-400">
                          {drive.ctc}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        CGPA &ge; {drive.minCgpa} | Backlogs &le; {drive.maxBacklogs}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs ${isSelected ? 'text-blue-400 font-bold' : 'text-slate-600'}`}>
                    &rarr;
                  </span>
                </div>
              );
            })}

            {/* Custom Option */}
            <div
              onClick={() => setSelectedId('custom')}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedId === 'custom'
                  ? 'bg-purple-600/10 border-purple-500/60 shadow-md ring-1 ring-purple-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${selectedId === 'custom' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-purple-400'}`}>
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 text-xs">Custom Criterion Evaluator</h4>
                  <p className="text-[11px] text-slate-400">Specify custom cutoff CGPA &amp; backlogs</p>
                </div>
              </div>
              <span className={`text-xs ${selectedId === 'custom' ? 'text-purple-400 font-bold' : 'text-slate-600'}`}>
                &rarr;
              </span>
            </div>
          </div>

          {/* Parametric Custom Criterion Form */}
          {selectedId === 'custom' && (
            <div className="pt-4 border-t border-slate-800 space-y-3.5">
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                Custom Threshold Parameters
              </span>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Minimum Cutoff CGPA:</span>
                  <span className="text-purple-400 font-mono font-bold">{customCgpa.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="9.5"
                  step="0.1"
                  value={customCgpa}
                  onChange={e => setCustomCgpa(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Maximum Allowed Backlogs</label>
                <div className="flex items-center gap-2">
                  {[0, 1, 2, 3].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCustomBacklogs(num)}
                      className={`flex-1 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
                        customBacklogs === num 
                          ? 'bg-purple-600 text-white shadow-sm' 
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      &le; {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Min Coding Score:</span>
                  <span className="text-blue-400 font-mono font-bold">{customMinCoding}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="900"
                  step="50"
                  value={customMinCoding}
                  onChange={e => setCustomMinCoding(parseInt(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Allowed Departments</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {branchesList.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => toggleBranch(b)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition cursor-pointer ${
                        customBranches.includes(b)
                          ? 'bg-purple-600 text-white font-semibold'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Execution View, SQL Query, Matched Candidates */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5">
          
          {/* Company Details Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white">{currentDrive.name}</h3>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {currentDrive.ctc}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{currentDrive.role} • {currentDrive.location}</p>
              </div>
            </div>

            {/* Quick Metrics Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
                Min CGPA: <strong className="text-emerald-400 font-mono">{currentDrive.minCgpa}</strong>
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
                Max Backlogs: <strong className="text-purple-400 font-mono">&le; {currentDrive.maxBacklogs}</strong>
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
                Coding: <strong className="text-blue-400 font-mono">&ge; {currentDrive.minCodingScore}</strong>
              </span>
            </div>
          </div>

          {/* Drive Eligibility Parameters Summary */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Eligibility Criteria &amp; Assessment Requirements</span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {Math.round((eligibleCandidates.length / (students.length || 1)) * 100)}% Batch Match Rate
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Min CGPA Cutoff</p>
                <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">{currentDrive.minCgpa.toFixed(1)} / 10</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Max Backlogs</p>
                <p className="text-base font-bold text-purple-400 font-mono mt-0.5">&le; {currentDrive.maxBacklogs} Active</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Min Coding Score</p>
                <p className="text-base font-bold text-blue-400 font-mono mt-0.5">&ge; {currentDrive.minCodingScore} pts</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Eligible Candidates</p>
                <p className="text-base font-bold text-white font-mono mt-0.5">{eligibleCandidates.length} of {students.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Target Skills:</span>
              {currentDrive.requiredSkills.map(sk => (
                <span key={sk} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Qualified Candidates Header & Actions */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Shortlisted Candidates
                </h4>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {eligibleCandidates.length} Qualified
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isAuthor && (
                  <button
                    onClick={handleBulkPromote}
                    disabled={eligibleCandidates.length === 0}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                    title="Author Permission: Promote candidates to written test"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Advance All to Written Test</span>
                  </button>
                )}

                <button
                  onClick={handleExportCsv}
                  disabled={eligibleCandidates.length === 0}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Matched Candidates Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-[360px]">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="sticky top-0 bg-slate-950 uppercase text-[10px] tracking-wider text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Student</th>
                    <th className="py-2.5 px-4">Roll No</th>
                    <th className="py-2.5 px-4">Dept</th>
                    <th className="py-2.5 px-4">CGPA</th>
                    <th className="py-2.5 px-4">Backlogs</th>
                    <th className="py-2.5 px-4">Coding Score</th>
                    <th className="py-2.5 px-4">Skill Match</th>
                    <th className="py-2.5 px-4 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {eligibleCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-500">
                        No candidates match this criteria. Try adjusting threshold parameters.
                      </td>
                    </tr>
                  ) : (
                    eligibleCandidates.map(candidate => {
                      // Count skill matches
                      const matchingSkills = candidate.skills.filter(sk => 
                        currentDrive.requiredSkills.some(req => req.toLowerCase().includes(sk.toLowerCase()))
                      );

                      return (
                        <tr key={candidate.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-2.5 px-4 font-semibold text-slate-200">
                            {candidate.fullName}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">
                            {candidate.rollNo}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                              {candidate.branch}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-emerald-400">
                            {candidate.cgpa.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-4 text-slate-300 font-mono">
                            {candidate.activeBacklogs}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-blue-400 font-semibold">
                            {candidate.codingScore}
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-1">
                              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                                {matchingSkills.length}/{currentDrive.requiredSkills.length}
                              </span>
                              <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                                ({matchingSkills.join(', ') || 'General'})
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => onSelectStudent(candidate)}
                              className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                            >
                              Inspect &rarr;
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
