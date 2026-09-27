import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Download, 
  ArrowUpDown, 
  Eye, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  Trash2,
  Edit3,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Branch, PlacementStatus, Student } from '../types';

interface StudentsTabProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenOfferLetter: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onUpdateStatus: (studentId: string, status: PlacementStatus, company?: string, ctc?: number) => void;
  initialBranch?: Branch;
  isAuthor?: boolean;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({
  students,
  onSelectStudent,
  onOpenOfferLetter,
  onDeleteStudent,
  onUpdateStatus,
  initialBranch,
  isAuthor = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<'ALL' | Branch>(initialBranch || 'ALL');
  const [minCgpa, setMinCgpa] = useState<number>(6.0);
  const [backlogFilter, setBacklogFilter] = useState<'ALL' | 'ZERO' | 'MAX_1'>('ZERO');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PlacementStatus>('ALL');
  const [minCodingScore, setMinCodingScore] = useState<number>(0);
  
  // Sorting
  const [sortBy, setSortBy] = useState<'cgpa' | 'codingScore' | 'fullName' | 'backlogs' | 'rollNo'>('cgpa');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);

  const branches: Branch[] = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'AIDS'];

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedBranch('ALL');
    setMinCgpa(6.0);
    setBacklogFilter('ZERO');
    setStatusFilter('ALL');
    setMinCodingScore(0);
    setCurrentPage(1);
  };

  // Filtered & Sorted dataset
  const filteredStudents = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return students.filter(s => {
      const matchSearch = !term || 
        s.fullName.toLowerCase().includes(term) ||
        s.rollNo.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.skills.some(skill => skill.toLowerCase().includes(term)) ||
        (s.placedCompany && s.placedCompany.toLowerCase().includes(term));

      const matchBranch = selectedBranch === 'ALL' || s.branch === selectedBranch;
      const matchCgpa = s.cgpa >= minCgpa;
      const matchCoding = s.codingScore >= minCodingScore;

      let matchBacklog = true;
      if (backlogFilter === 'ZERO') matchBacklog = s.activeBacklogs === 0;
      if (backlogFilter === 'MAX_1') matchBacklog = s.activeBacklogs <= 1;

      const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;

      return matchSearch && matchBranch && matchCgpa && matchCoding && matchBacklog && matchStatus;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'cgpa') comparison = a.cgpa - b.cgpa;
      else if (sortBy === 'codingScore') comparison = a.codingScore - b.codingScore;
      else if (sortBy === 'backlogs') comparison = a.activeBacklogs - b.activeBacklogs;
      else if (sortBy === 'fullName') comparison = a.fullName.localeCompare(b.fullName);
      else if (sortBy === 'rollNo') comparison = a.rollNo.localeCompare(b.rollNo);

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [students, searchTerm, selectedBranch, minCgpa, backlogFilter, statusFilter, minCodingScore, sortBy, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  // Export CSV
  const handleExportCsv = () => {
    let csv = "Student ID,Roll No,Full Name,Email,Branch,CGPA,Active Backlogs,Coding Score,LeetCode Solved,Status,Company,Offered CTC (LPA),Skills\n";
    filteredStudents.forEach(s => {
      const skillsStr = `"${s.skills.join(', ')}"`;
      const compStr = s.placedCompany ? `"${s.placedCompany}"` : '""';
      csv += `${s.id},${s.rollNo},"${s.fullName}",${s.email},${s.branch},${s.cgpa},${s.activeBacklogs},${s.codingScore},${s.leetCodeSolved},${s.status},${compStr},${s.offeredCtc || ''},${skillsStr}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Students_Directory_${selectedBranch}_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const toggleSort = (field: 'cgpa' | 'codingScore' | 'fullName' | 'backlogs' | 'rollNo') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls Box */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Student Academic &amp; Placement Directory</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {filteredStudents.length} of {students.length} Candidates
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified candidate profiles, academic credentials, and recruitment status records
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              title="Export filtered candidate records"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/80 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Filter Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          
          {/* Search bar */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Search Candidate (Name, Roll, Skill, Company)
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="e.g. Aarav, 22BCE101, Python, Google..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Branch filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Academic Department
            </label>
            <select
              value={selectedBranch}
              onChange={e => { setSelectedBranch(e.target.value as any); setCurrentPage(1); }}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Departments</option>
              {branches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Min CGPA Slider */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
              <span>Min CGPA:</span>
              <span className="text-blue-400 font-mono font-bold text-xs">{minCgpa.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="10.0"
              step="0.1"
              value={minCgpa}
              onChange={e => { setMinCgpa(parseFloat(e.target.value)); setCurrentPage(1); }}
              className="w-full accent-blue-500 mt-1 cursor-pointer"
            />
          </div>

          {/* Backlogs Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Backlog Criteria
            </label>
            <select
              value={backlogFilter}
              onChange={e => { setBacklogFilter(e.target.value as any); setCurrentPage(1); }}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ZERO">Zero Active Backlogs (Strict)</option>
              <option value="MAX_1">Max 1 Active Backlog</option>
              <option value="ALL">All (Regardless of Backlogs)</option>
            </select>
          </div>

        </div>

        {/* Secondary Filter Chips Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Status:
            </span>
            {(['ALL', 'Placed', 'In Process', 'Unplaced'] as const).map(st => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px]">Academic Year 2025-2026 Batch Active</span>
          </div>
        </div>

        {/* Students Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 uppercase text-[10px] tracking-wider text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">
                  <button onClick={() => toggleSort('fullName')} className="flex items-center gap-1.5 hover:text-white cursor-pointer">
                    <span>Student Profile</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button onClick={() => toggleSort('rollNo')} className="flex items-center gap-1.5 hover:text-white cursor-pointer">
                    <span>Roll No</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </button>
                </th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">
                  <button onClick={() => toggleSort('cgpa')} className="flex items-center gap-1.5 hover:text-white cursor-pointer">
                    <span>CGPA</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button onClick={() => toggleSort('backlogs')} className="flex items-center gap-1.5 hover:text-white cursor-pointer">
                    <span>Backlogs</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button onClick={() => toggleSort('codingScore')} className="flex items-center gap-1.5 hover:text-white cursor-pointer">
                    <span>Coding Score</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </button>
                </th>
                <th className="py-3 px-4">Top Skills</th>
                <th className="py-3 px-4">Placement Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-500">
                    <p className="text-sm font-medium">No candidates match the specified criteria.</p>
                    <p className="text-xs text-slate-600 mt-1">Try relaxing CGPA or backlog filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map(student => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Name & Avatar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center font-bold text-xs text-blue-400">
                          {student.fullName.charAt(0)}
                        </div>
                        <div>
                          <p 
                            onClick={() => onSelectStudent(student)}
                            className="font-bold text-slate-100 hover:text-blue-400 cursor-pointer transition-colors"
                          >
                            {student.fullName}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{student.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Roll No */}
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                      {student.rollNo}
                    </td>

                    {/* Branch */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {student.branch}
                      </span>
                    </td>

                    {/* CGPA */}
                    <td className="py-3 px-4 font-mono font-bold">
                      <span className={student.cgpa >= 8.5 ? 'text-emerald-400' : student.cgpa >= 7.5 ? 'text-blue-400' : 'text-slate-300'}>
                        {student.cgpa.toFixed(2)}
                      </span>
                    </td>

                    {/* Backlogs */}
                    <td className="py-3 px-4">
                      {student.activeBacklogs === 0 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 0 Clear
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-semibold text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" /> {student.activeBacklogs} Backlog{student.activeBacklogs > 1 ? 's' : ''}
                        </span>
                      )}
                    </td>

                    {/* Coding Score */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-blue-400 font-bold">{student.codingScore}</span>
                          <span className="text-slate-500">LC {student.leetCodeSolved}</span>
                        </div>
                        <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full rounded-full" 
                            style={{ width: `${(student.codingScore / 1000) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Top Skills */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 flex-wrap max-w-[200px]">
                        {student.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700/60 font-mono">
                            {skill}
                          </span>
                        ))}
                        {student.skills.length > 3 && (
                          <span className="text-[10px] text-slate-500 font-mono">+{student.skills.length - 3}</span>
                        )}
                      </div>
                    </td>

                    {/* Placement Status */}
                    <td className="py-3 px-4">
                      {student.status === 'Placed' || student.status === 'Offer Accepted' ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Award className="w-3 h-3" /> {student.placedCompany || 'Placed'}
                          </span>
                          {student.offeredCtc && (
                            <p className="text-[10px] font-mono font-bold text-amber-400">
                              ₹{student.offeredCtc} LPA
                            </p>
                          )}
                        </div>
                      ) : student.status === 'In Process' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {student.pipelineStage || 'In Drive'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400">
                          Available
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition cursor-pointer"
                          title="View Full Profile Transcript"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        
                        {(student.status === 'Placed' || student.status === 'Offer Accepted') && (
                          <button
                            onClick={() => onOpenOfferLetter(student)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition cursor-pointer"
                            title="Generate Formal Offer Letter"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {isAuthor && (
                          <button
                            onClick={() => onDeleteStudent(student.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                            title="Author Permission: Remove Candidate Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Pagination & Record Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 pt-2">
          <div className="flex items-center gap-2">
            <span>Showing {filteredStudents.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredStudents.length)} of {filteredStudents.length} entries</span>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-xs text-slate-300"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-mono text-slate-300 text-xs">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
