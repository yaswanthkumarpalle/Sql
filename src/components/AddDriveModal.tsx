import React, { useState } from 'react';
import { X, Building2, Plus, Sparkles } from 'lucide-react';
import { Branch, CompanyDrive, DriveTier } from '../types';

interface AddDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDrive: (drive: CompanyDrive) => void;
}

export const AddDriveModal: React.FC<AddDriveModalProps> = ({
  isOpen,
  onClose,
  onAddDrive
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Software Engineer');
  const [ctcNumber, setCtcNumber] = useState<number>(24.0);
  const [minCgpa, setMinCgpa] = useState<number>(7.5);
  const [maxBacklogs, setMaxBacklogs] = useState<number>(0);
  const [minCodingScore, setMinCodingScore] = useState<number>(700);
  const [tier, setTier] = useState<DriveTier>('Dream');
  const [location, setLocation] = useState('Bangalore / Hyderabad');
  const [openings, setOpenings] = useState<number>(15);
  const [branches, setBranches] = useState<Branch[]>(['CSE', 'IT', 'AIDS']);

  const branchesList: Branch[] = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'AIDS'];

  if (!isOpen) return null;

  const toggleBranch = (b: Branch) => {
    if (branches.includes(b)) {
      if (branches.length > 1) {
        setBranches(branches.filter(item => item !== b));
      }
    } else {
      setBranches([...branches, b]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newDrive: CompanyDrive = {
      id: `drv-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      logo: 'Building2',
      role: role.trim(),
      ctc: `₹${ctcNumber.toFixed(1)} LPA`,
      ctcNumber: Number(ctcNumber),
      minCgpa: Number(minCgpa),
      maxBacklogs: Number(maxBacklogs),
      minCodingScore: Number(minCodingScore),
      branches,
      requiredSkills: ['Problem Solving', 'Data Structures', 'Algorithms', 'System Design'],
      tier,
      deadline: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      date: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
      location: location.trim(),
      openings: Number(openings),
      appliedCount: 0,
      selectedCount: 0,
      rounds: ['Online Assessment', 'Technical Round 1', 'Technical Round 2', 'HR Round'],
      description: `Campus recruitment drive for ${role} with ${name}.`
    };

    onAddDrive(newDrive);
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
            <div className="p-2 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Launch Corporate Placement Drive</h3>
              <p className="text-[11px] text-slate-400">Inserts record into CorporateDrives table</p>
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
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Cisco Systems, Oracle"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Role Title</label>
              <input
                type="text"
                required
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">CTC (LPA)</label>
              <input
                type="number"
                step="0.1"
                min="3"
                max="100"
                required
                value={ctcNumber}
                onChange={e => setCtcNumber(parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Min CGPA</label>
              <input
                type="number"
                step="0.1"
                min="5"
                max="10"
                required
                value={minCgpa}
                onChange={e => setMinCgpa(parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Max Backlogs</label>
              <input
                type="number"
                min="0"
                max="5"
                required
                value={maxBacklogs}
                onChange={e => setMaxBacklogs(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Drive Tier</label>
              <select
                value={tier}
                onChange={e => setTier(e.target.value as DriveTier)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
              >
                <option value="Super Dream">Super Dream (&gt;₹25L)</option>
                <option value="Dream">Dream (₹15L - ₹25L)</option>
                <option value="Standard">Standard (₹7L - ₹15L)</option>
                <option value="Mass">Mass Recruitment</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Openings</label>
              <input
                type="number"
                min="1"
                required
                value={openings}
                onChange={e => setOpenings(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Eligible Departments
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {branchesList.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBranch(b)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition cursor-pointer ${
                    branches.includes(b)
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-950 border border-slate-800 text-slate-400'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
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
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30 transition cursor-pointer"
            >
              Launch Placement Drive
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
