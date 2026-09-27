import React from 'react';
import { 
  GraduationCap, 
  BarChart3, 
  Users, 
  Building2, 
  Trophy, 
  KanbanSquare, 
  PlusCircle, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Lock,
  FileText,
  UserPlus
} from 'lucide-react';
import { CurrentUser, Student } from '../types';

export type NavTab = 'analytics' | 'students' | 'matcher' | 'rankings' | 'pipeline';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  students: Student[];
  currentUser: CurrentUser;
  onOpenLogin: (mode?: 'signin' | 'signup') => void;
  onOpenAddStudent: () => void;
  onOpenAddDrive: () => void;
  onResetData: () => void;
  onOpenStudentOffer?: (student: Student) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  students,
  currentUser,
  onOpenLogin,
  onOpenAddStudent,
  onOpenAddDrive,
  onResetData,
  onOpenStudentOffer
}) => {
  const isAuthor = currentUser.role === 'author';
  const totalStudents = students.length;
  const placedStudents = students.filter(s => s.status === 'Placed' || s.status === 'Offer Accepted').length;
  const placedPercentage = totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : '0';
  
  const placedWithCtc = students.filter(s => s.offeredCtc && s.offeredCtc > 0);
  const avgCtc = placedWithCtc.length > 0 
    ? (placedWithCtc.reduce((acc, curr) => acc + (curr.offeredCtc || 0), 0) / placedWithCtc.length).toFixed(1)
    : '0';

  const loggedInStudent = !isAuthor && currentUser.studentId 
    ? students.find(s => s.id === currentUser.studentId)
    : null;

  const navItems = [
    { id: 'analytics' as NavTab, label: 'Analytics', icon: BarChart3 },
    { id: 'students' as NavTab, label: 'Student Directory', icon: Users, badge: `${students.length}` },
    { id: 'matcher' as NavTab, label: 'Drive Matcher', icon: Building2 },
    { id: 'rankings' as NavTab, label: 'Candidate Rankings', icon: Trophy },
    { id: 'pipeline' as NavTab, label: 'Recruitment Pipeline', icon: KanbanSquare }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between py-3 gap-3">
          
          {/* Logo & Platform Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative p-2.5 bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-blue-600/25 ring-1 ring-white/20">
                <GraduationCap className="w-5 h-5 text-white" />
                <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                    CampusPlacement <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-semibold text-sm sm:text-base">Portal</span>
                  </h1>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    Production 2.4
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Campus Recruitment Operations &amp; Candidate Career Intelligence
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="hidden xl:flex items-center space-x-4 px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Placed:</span>
              <span className="font-bold text-emerald-400">{placedPercentage}%</span>
              <span className="text-slate-500 font-mono text-[11px]">({placedStudents}/{totalStudents})</span>
            </div>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Avg CTC:</span>
              <span className="font-bold text-amber-400 font-mono">₹{avgCtc} LPA</span>
            </div>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center gap-1 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Drive Ready</span>
            </div>
          </div>

          {/* Top Bar Action Buttons & Role Switcher */}
          <div className="flex items-center space-x-2 flex-wrap">
            
            {/* User Profile & Role Badge Button */}
            <button
              onClick={() => onOpenLogin('signin')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                isAuthor 
                  ? 'bg-blue-600/10 border-blue-500/40 text-blue-300 hover:bg-blue-600/20' 
                  : 'bg-emerald-600/10 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/20'
              }`}
              title="Click to Switch Login Role (Author vs Student)"
            >
              {isAuthor ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <div className="text-left hidden sm:block">
                    <span className="text-[10px] text-blue-400 block font-normal">Author (CRUD Access)</span>
                    <span className="font-bold text-white text-xs">{currentUser.name}</span>
                  </div>
                  <span className="sm:hidden font-bold">Author</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <div className="text-left hidden sm:block">
                    <span className="text-[10px] text-emerald-400 block font-normal">Student (Read-Only)</span>
                    <span className="font-bold text-white text-xs">{currentUser.name}</span>
                  </div>
                  <span className="sm:hidden font-bold">Student</span>
                </>
              )}
              <span className="text-[10px] underline ml-1 text-slate-400">Switch</span>
            </button>

            {/* Direct Sign Up Button */}
            <button
              onClick={() => onOpenLogin('signup')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/25 transition cursor-pointer"
              title="Sign up as new student or placement authority"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>

            {/* If Logged-in Student has an offer letter, allow 1-click preview */}
            {!isAuthor && loggedInStudent && (loggedInStudent.status === 'Placed' || loggedInStudent.status === 'Offer Accepted') && onOpenStudentOffer && (
              <button
                onClick={() => onOpenStudentOffer(loggedInStudent)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                title="View My Formal Offer Letter"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>My Offer Letter</span>
              </button>
            )}

            {/* Author-Only CRUD Action Buttons */}
            {isAuthor ? (
              <>
                <button
                  onClick={onOpenAddStudent}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                  title="Author Permission: Add Candidate to Database"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Candidate</span>
                </button>

                <button
                  onClick={onOpenAddDrive}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                  title="Author Permission: Launch Corporate Drive"
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">New Drive</span>
                </button>

                <button
                  onClick={onResetData}
                  className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
                  title="Reset Dataset (Author Only)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                <Lock className="w-3 h-3 text-amber-400" />
                <span className="hidden md:inline">CRUD Actions Locked (Student View)</span>
              </div>
            )}

          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center space-x-1.5 overflow-x-auto pb-2 pt-1 border-t border-slate-800/40 no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 ring-1 ring-blue-500'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-blue-700/80 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
