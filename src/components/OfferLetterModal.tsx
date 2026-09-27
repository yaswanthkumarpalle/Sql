import React from 'react';
import { X, Printer, Award, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { Student } from '../types';

interface OfferLetterModalProps {
  student: Student | null;
  onClose: () => void;
}

export const OfferLetterModal: React.FC<OfferLetterModalProps> = ({ student, onClose }) => {
  if (!student) return null;

  const company = student.placedCompany || 'Google';
  const ctc = student.offeredCtc || 28.5;
  const baseSalary = (ctc * 0.72).toFixed(2);
  const bonus = (ctc * 0.18).toFixed(2);
  const stocksOrAllowance = (ctc * 0.10).toFixed(2);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[95vh] border border-slate-200">
        
        {/* Top Controls Bar (Hidden during print) */}
        <div className="print:hidden p-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs">Official Campus Placement Letter of Intent</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Letter</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-10 overflow-y-auto space-y-6 text-slate-800 font-sans leading-relaxed text-xs">
          
          {/* Institution Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-slate-900 uppercase">
                Directorate of Training &amp; Placement
              </h2>
              <p className="text-[11px] text-slate-600 font-medium">
                National Institute of Engineering &amp; Technology • Corporate Relations Cell
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-[10px] font-bold rounded">
                VERIFIED OFFER
              </span>
              <p className="text-[10px] font-mono text-slate-500 mt-1">
                REF: TPO/2026/OFFER-{student.rollNo}
              </p>
            </div>
          </div>

          {/* Date & Addressee */}
          <div className="flex justify-between items-start text-xs pt-1">
            <div>
              <p className="text-slate-500">Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <div className="mt-2 space-y-0.5">
                <p className="font-bold text-slate-900 text-sm">{student.fullName}</p>
                <p className="font-mono text-slate-700">Roll No: {student.rollNo}</p>
                <p className="text-slate-700">Department: {student.branch} Engineering</p>
                <p className="text-slate-700">Campus Email: {student.email}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold text-slate-500">Corporate Hiring Partner:</p>
              <p className="font-extrabold text-base text-blue-900">{company}</p>
              <p className="text-[11px] text-slate-600">Global Engineering Campus</p>
            </div>
          </div>

          {/* Letter Subject */}
          <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
            <p className="font-bold text-slate-900">
              Subject: Letter of Intent &amp; Full-Time Employment Offer — Campus Recruitment Drive 2026
            </p>
          </div>

          {/* Formal Body Paragraphs */}
          <div className="space-y-3 text-slate-700 text-xs">
            <p>
              Dear <strong>{student.fullName}</strong>,
            </p>
            <p>
              On behalf of <strong>{company}</strong> and the Institutional Placement Directorate, we are thrilled to congratulate you on your selection for the position of <strong>Software Development Engineer (SWE)</strong>. Following your exceptional performance in the rigorous online coding assessments, technical interview panels, and behavioral evaluations, the company is pleased to extend this formal offer.
            </p>
            <p>
              Your cumulative academic track record with a CGPA of <strong>{student.cgpa.toFixed(2)}</strong>, combined with your demonstrated problem-solving aptitude (Coding Assessment Benchmark: <strong>{student.codingScore}</strong> points), places you among the top percentile of campus candidates.
            </p>
          </div>

          {/* Compensation Structure Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Annual Compensation Breakdown (CTC)
            </h4>
            <table className="w-full border border-slate-300 rounded text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                <tr>
                  <th className="py-2 px-3">Salary Component</th>
                  <th className="py-2 px-3">Frequency</th>
                  <th className="py-2 px-3 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2 px-3 font-medium">Fixed Base Salary</td>
                  <td className="py-2 px-3 text-slate-500">Monthly / Annualized</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold">₹{baseSalary} LPA</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Target Performance Incentive &amp; Allowances</td>
                  <td className="py-2 px-3 text-slate-500">Annual Review</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold">₹{bonus} LPA</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Relocation Grant &amp; Signing Bonus</td>
                  <td className="py-2 px-3 text-slate-500">One-time upon Joining</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold">₹{stocksOrAllowance} LPA</td>
                </tr>
                <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-400">
                  <td className="py-2.5 px-3">Total Annual Cost to Company (CTC)</td>
                  <td className="py-2.5 px-3">Gross Annualized</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-800 text-sm">
                    ₹{ctc.toFixed(2)} LPA
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
            <div>
              <div className="h-10 border-b border-slate-400 w-44"></div>
              <p className="font-bold text-slate-900 mt-1">Dr. Rajesh V. Raman</p>
              <p className="text-[11px] text-slate-600">Head — Training &amp; Placement Operations</p>
              <p className="text-[10px] text-slate-400 font-mono">Digitally Signed &amp; Stamped</p>
            </div>
            <div className="text-right">
              <div className="h-10 border-b border-slate-400 w-44 ml-auto"></div>
              <p className="font-bold text-slate-900 mt-1">Global University Recruiter</p>
              <p className="text-[11px] text-slate-600">{company} University Talent Acquisition</p>
              <p className="text-[10px] text-slate-400 font-mono">Issued via DBMS Automation Portal</p>
            </div>
          </div>

        </div>

        {/* Modal Footer (Hidden on print) */}
        <div className="print:hidden p-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>This letter conforms to standard campus placement guidelines.</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
