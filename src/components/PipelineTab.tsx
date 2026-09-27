import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  KanbanSquare, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  FileText, 
  Filter, 
  Search, 
  Building2, 
  Award,
  Sparkles,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { CompanyDrive, PipelineStage, Student } from '../types';

interface PipelineTabProps {
  students: Student[];
  drives: CompanyDrive[];
  onUpdateStage: (studentId: string, stage: PipelineStage, companyName?: string, ctc?: number) => void;
  onSelectStudent: (student: Student) => void;
  onOpenOfferLetter: (student: Student) => void;
  isAuthor?: boolean;
}

const STAGES: { id: PipelineStage; label: string; color: string; badgeBg: string }[] = [
  { id: 'Applied', label: '1. Applied', color: 'border-slate-700', badgeBg: 'bg-slate-800 text-slate-300' },
  { id: 'Written Test', label: '2. Written Test', color: 'border-blue-700', badgeBg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  { id: 'Technical Round 1', label: '3. Tech Round 1', color: 'border-indigo-700', badgeBg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' },
  { id: 'Technical Round 2', label: '4. Tech Round 2', color: 'border-purple-700', badgeBg: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
  { id: 'HR Round', label: '5. HR Round', color: 'border-amber-700', badgeBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  { id: 'Selected', label: '6. Offer Extended', color: 'border-emerald-700', badgeBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' }
];

export const PipelineTab: React.FC<PipelineTabProps> = ({
  students,
  drives,
  onUpdateStage,
  onSelectStudent,
  onOpenOfferLetter,
  isAuthor = true
}) => {
  const [selectedCompany, setSelectedCompany] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const companyList = useMemo(() => {
    return Array.from(new Set(drives.map(d => d.name)));
  }, [drives]);

  // Filter students based on company and search
  const filteredCandidates = useMemo(() => {
    return students.filter(s => {
      const matchComp = selectedCompany === 'ALL' || 
        s.targetCompany === selectedCompany || 
        s.placedCompany === selectedCompany;

      const matchSearch = !searchQuery || 
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.branch.toLowerCase().includes(searchQuery.toLowerCase());

      return matchComp && matchSearch;
    });
  }, [students, selectedCompany, searchQuery]);

  // Move candidate to next stage
  const handleAdvance = (student: Student, currentIdx: number) => {
    if (currentIdx < STAGES.length - 1) {
      const nextStage = STAGES[currentIdx + 1].id;
      
      // If moving to Selected, trigger confetti celebration and associate CTC
      if (nextStage === 'Selected') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        const targetDrive = drives.find(d => d.name === student.targetCompany) || drives[0];
        onUpdateStage(student.id, 'Selected', targetDrive.name, targetDrive.ctcNumber);
      } else {
        onUpdateStage(student.id, nextStage, student.targetCompany);
      }
    }
  };

  // Move candidate backward
  const handleRegress = (student: Student, currentIdx: number) => {
    if (currentIdx > 0) {
      const prevStage = STAGES[currentIdx - 1].id;
      onUpdateStage(student.id, prevStage, student.targetCompany);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <KanbanSquare className="w-5 h-5 text-emerald-400" />
              <span>Campus Recruitment Pipeline</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Track candidates through online assessments, technical evaluations, and offer extensions
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <input
                type="text"
                placeholder="Filter candidate..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            </div>

            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <select
                value={selectedCompany}
                onChange={e => setSelectedCompany(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Partner Companies</option>
                {companyList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
        {STAGES.map((stageObj, stageIdx) => {
          const stageCandidates = filteredCandidates.filter(s => s.pipelineStage === stageObj.id);

          return (
            <div
              key={stageObj.id}
              className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-3.5 space-y-3 flex flex-col min-w-[210px] min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <h3 className="text-xs font-bold text-slate-200">
                    {stageObj.label}
                  </h3>
                </div>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${stageObj.badgeBg}`}>
                  {stageCandidates.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[620px] pr-1">
                {stageCandidates.length === 0 ? (
                  <div className="h-32 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-600 text-[11px]">
                    No candidates
                  </div>
                ) : (
                  stageCandidates.map(student => (
                    <div
                      key={student.id}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2 group shadow-sm"
                    >
                      {/* Top: Name & Dept */}
                      <div className="flex items-start justify-between">
                        <div>
                          <p 
                            onClick={() => onSelectStudent(student)}
                            className="font-bold text-slate-200 text-xs hover:text-blue-400 cursor-pointer transition-colors"
                          >
                            {student.fullName}
                          </p>
                          <span className="text-[10px] font-mono text-slate-400">
                            {student.rollNo} • {student.branch}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400">
                          {student.cgpa.toFixed(1)}
                        </span>
                      </div>

                      {/* Scores & Company */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-1.5">
                        <span className="text-blue-400 font-mono font-medium">
                          {student.codingScore} pts
                        </span>
                        <span className="text-[10px] text-indigo-300 font-semibold truncate max-w-[100px]">
                          {student.placedCompany || student.targetCompany || 'General'}
                        </span>
                      </div>

                      {/* Actions: Promote / Regress Buttons (Author Only) */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                        {isAuthor ? (
                          <>
                            {stageIdx > 0 ? (
                              <button
                                onClick={() => handleRegress(student, stageIdx)}
                                className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800 text-[10px] transition cursor-pointer"
                                title="Author Permission: Move back to previous round"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            ) : <div />}

                            {stageObj.id === 'Selected' ? (
                              <button
                                onClick={() => onOpenOfferLetter(student)}
                                className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition cursor-pointer"
                                title="View/Generate Letter"
                              >
                                <FileText className="w-3 h-3" />
                                <span>Offer Letter</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAdvance(student, stageIdx)}
                                className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-600/80 hover:bg-blue-600 text-white transition cursor-pointer"
                                title="Author Permission: Advance to next round"
                              >
                                <span>Advance</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="text-[10px] text-slate-500 font-mono">Stage {stageIdx + 1}</span>
                            {stageObj.id === 'Selected' && (
                              <button
                                onClick={() => onOpenOfferLetter(student)}
                                className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition cursor-pointer"
                              >
                                <FileText className="w-3 h-3" />
                                <span>Offer</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
