import React from 'react';
import { 
  X, 
  Award, 
  GraduationCap, 
  CheckCircle2, 
  AlertTriangle, 
  Code, 
  FileText, 
  Mail, 
  Phone, 
  Building2, 
  Calendar,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { PipelineStage, PlacementStatus, Student } from '../types';

interface StudentProfileModalProps {
  student: Student | null;
  onClose: () => void;
  onOpenOfferLetter: (student: Student) => void;
  onUpdateStatus: (studentId: string, status: PlacementStatus, company?: string, ctc?: number) => void;
  isAuthor?: boolean;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  onClose,
  onOpenOfferLetter,
  onUpdateStatus,
  isAuthor = true
}) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-start justify-between relative">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 border-2 border-slate-700 flex items-center justify-center text-white text-xl font-extrabold shadow-lg shadow-blue-600/30">
              {student.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{student.fullName}</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  {student.branch}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Roll No: {student.rollNo} • ID: {student.id}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" /> {student.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" /> {student.phone}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          
          {/* Academic & Assessment Performance Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Cumulative GPA</span>
              <p className="text-xl font-bold font-mono text-emerald-400">{student.cgpa.toFixed(2)} / 10</p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(student.cgpa / 10) * 100}%` }} />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Backlogs</span>
              <p className="text-xl font-bold font-mono text-slate-200">
                {student.activeBacklogs === 0 ? (
                  <span className="text-emerald-400 flex items-center gap-1 text-sm font-sans font-bold">
                    <CheckCircle2 className="w-4 h-4" /> 0 (All Clear)
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1 text-sm font-sans font-bold">
                    <AlertTriangle className="w-4 h-4" /> {student.activeBacklogs} Pending
                  </span>
                )}
              </p>
              <span className="text-[10px] text-slate-500">History: {student.historyOfBacklogs} total</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Coding Assessment</span>
              <p className="text-xl font-bold font-mono text-blue-400">{student.codingScore} / 1000</p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(student.codingScore / 1000) * 100}%` }} />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">LeetCode Problems</span>
              <p className="text-xl font-bold font-mono text-amber-400">{student.leetCodeSolved}+</p>
              <span className="text-[10px] text-slate-500">Solved &amp; Verified</span>
            </div>
          </div>

          {/* Current Placement Status Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Current Hiring Stage</span>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  student.status === 'Placed' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : student.status === 'In Process' 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {student.status} • {student.pipelineStage}
                </span>

                {student.placedCompany && (
                  <span className="font-bold text-slate-200 text-xs">
                    at {student.placedCompany}
                  </span>
                )}
              </div>

              {student.offeredCtc && (
                <p className="text-xs font-mono font-bold text-amber-400 pt-0.5">
                  Verified Package: ₹{student.offeredCtc} LPA
                </p>
              )}
            </div>

            {(student.status === 'Placed' || student.status === 'Offer Accepted') && (
              <button
                onClick={() => {
                  onClose();
                  onOpenOfferLetter(student);
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>View Official Offer Letter</span>
              </button>
            )}
          </div>

          {/* Technical Skills Inventory */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Technical Competencies &amp; Skills
            </h4>
            <div className="flex items-center gap-1.5 flex-wrap">
              {student.skills.map(skill => (
                <span 
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Academic & Interview Feedback Notes */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Resume Profile Summary
            </h4>
            <p className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
              {student.resumeSummary}
            </p>
          </div>

          {student.interviewNotes && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Interviewer &amp; Assessment Remarks
              </h4>
              <p className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-blue-300 leading-relaxed font-sans">
                {student.interviewNotes}
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Database Record Verified: Academic Year 2025-2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
