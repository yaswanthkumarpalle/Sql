import React, { useState } from 'react';
import { X, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';
import { Branch, Student } from '../types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: Student) => void;
  nextRollNumber: number;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
  nextRollNumber
}) => {
  const [fullName, setFullName] = useState('');
  const [branch, setBranch] = useState<Branch>('CSE');
  const [cgpa, setCgpa] = useState<number>(8.2);
  const [codingScore, setCodingScore] = useState<number>(750);
  const [activeBacklogs, setActiveBacklogs] = useState<number>(0);
  const [skillsStr, setSkillsStr] = useState('React, TypeScript, SQL, Python');
  const [gender, setGender] = useState<'Male' | 'Female'>('Female');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const rollNo = `22B${branch.substring(0, 2)}${nextRollNumber}`;
    const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);

    const newStudent: Student = {
      id: `STU-2026-${nextRollNumber}`,
      rollNo,
      fullName: fullName.trim(),
      email: `${fullName.toLowerCase().trim().replace(/\s+/g, '.')}${nextRollNumber % 100}@univ.ac.in`,
      phone: `+91 98${Math.floor(10000000 + Math.random() * 89999999)}`,
      branch,
      cgpa: parseFloat(Number(cgpa).toFixed(2)),
      activeBacklogs: Number(activeBacklogs),
      historyOfBacklogs: Number(activeBacklogs),
      codingScore: Number(codingScore),
      leetCodeSolved: Math.floor((Number(codingScore) / 1000) * 480),
      skills,
      status: 'Unplaced',
      pipelineStage: 'Applied',
      gender,
      resumeSummary: `Dedicated engineering candidate in ${branch} with practical coursework in ${skills.slice(0, 3).join(', ')}. Strong academic consistency.`
    };

    onAddStudent(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-10 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Register New Candidate</h3>
              <p className="text-[11px] text-slate-400">Inserts record into Students &amp; AcademicRecords</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Academic Department</label>
              <select
                value={branch}
                onChange={e => setBranch(e.target.value as Branch)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
              >
                {(['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'AIDS'] as Branch[]).map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Gender</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">CGPA (0 - 10)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={cgpa}
                onChange={e => setCgpa(parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Coding Score (1000)</label>
              <input
                type="number"
                min="0"
                max="1000"
                required
                value={codingScore}
                onChange={e => setCodingScore(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Active Backlogs</label>
              <input
                type="number"
                min="0"
                max="10"
                required
                value={activeBacklogs}
                onChange={e => setActiveBacklogs(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Technical Skills (Comma separated)
            </label>
            <input
              type="text"
              value={skillsStr}
              onChange={e => setSkillsStr(e.target.value)}
              placeholder="e.g. React, Python, C++, Docker, PostgreSQL"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs font-mono"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/30 transition cursor-pointer"
            >
              Register Candidate
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
