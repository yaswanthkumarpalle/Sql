import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  GraduationCap, 
  KeyRound, 
  UserPlus,
  LogIn,
  Check, 
  Lock, 
  ArrowRight,
  Sparkles,
  Mail,
  User,
  Hash,
  Award
} from 'lucide-react';
import { Branch, CurrentUser, Student, UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  onLogin: (user: CurrentUser) => void;
  onRegisterStudent: (student: Student) => void;
  students: Student[];
  initialMode?: 'signin' | 'signup';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onRegisterStudent,
  students,
  initialMode = 'signin'
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  
  // Sign In State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    currentUser.studentId || students[0]?.id || ''
  );

  // Sign Up State for Student
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupBranch, setSignupBranch] = useState<Branch>('CSE');
  const [signupCgpa, setSignupCgpa] = useState<number>(8.4);
  const [signupCodingScore, setSignupCodingScore] = useState<number>(760);
  const [signupSkills, setSignupSkills] = useState('React, TypeScript, Python, SQL');
  const [signupGender, setSignupGender] = useState<'Male' | 'Female'>('Female');

  // Sign Up State for Author
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorDesignation, setAuthorDesignation] = useState('Assistant Placement Director');
  const [authorPasscode, setAuthorPasscode] = useState('admin2026');

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'author') {
      onLogin({
        role: 'author',
        name: 'Dr. Rajesh V. Raman',
        email: 'tpo.directorate@univ.ac.in'
      });
    } else {
      const stu = students.find(s => s.id === selectedStudentId) || students[0];
      onLogin({
        role: 'student',
        name: stu.fullName,
        email: stu.email,
        studentId: stu.id,
        rollNo: stu.rollNo
      });
    }
    onClose();
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRole === 'student') {
      if (!signupName.trim()) return;
      const rollIndex = students.length + 101;
      const rollNo = `22B${signupBranch.substring(0, 2)}${rollIndex}`;
      const email = signupEmail.trim() || `${signupName.toLowerCase().trim().replace(/\s+/g, '.')}${rollIndex % 99}@univ.ac.in`;
      const skills = signupSkills.split(',').map(s => s.trim()).filter(Boolean);

      const newStudent: Student = {
        id: `STU-2026-${rollIndex}`,
        rollNo,
        fullName: signupName.trim(),
        email,
        phone: `+91 98${Math.floor(10000000 + Math.random() * 89999999)}`,
        branch: signupBranch,
        cgpa: parseFloat(Number(signupCgpa).toFixed(2)),
        activeBacklogs: 0,
        historyOfBacklogs: 0,
        codingScore: Number(signupCodingScore),
        leetCodeSolved: Math.floor((Number(signupCodingScore) / 1000) * 450),
        skills,
        status: 'Unplaced',
        pipelineStage: 'Applied',
        gender: signupGender,
        resumeSummary: `Motivated candidate in ${signupBranch} specializing in ${skills.slice(0, 3).join(', ')}.`
      };

      // Register student into the database state
      onRegisterStudent(newStudent);

      // Log in as this newly created student
      onLogin({
        role: 'student',
        name: newStudent.fullName,
        email: newStudent.email,
        studentId: newStudent.id,
        rollNo: newStudent.rollNo
      });
    } else {
      // Register Author
      if (!authorName.trim()) return;
      const name = authorName.trim();
      const email = authorEmail.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@univ.ac.in`;

      onLogin({
        role: 'author',
        name: `${name} (${authorDesignation})`,
        email
      });
    }

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
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${
              authMode === 'signup' 
                ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-blue-600/10 text-blue-400 border-blue-500/20'
            }`}>
              {authMode === 'signup' ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                {authMode === 'signup' ? 'Create New Account' : 'Portal Authentication'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {authMode === 'signup' 
                  ? 'Sign up as Student (Candidate) or Author (Directorate)' 
                  : 'Sign in to access personalized features or admin controls'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle: Sign In vs Sign Up */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-center">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 w-full max-w-xs text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className={`flex-1 py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'signin'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'signup'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          
          {/* Role Cards Selector */}
          <div className="space-y-2">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Select Role:
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Author Option */}
              <div
                onClick={() => setSelectedRole('author')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 relative ${
                  selectedRole === 'author'
                    ? 'bg-blue-600/10 border-blue-500 ring-1 ring-blue-500/40 shadow-md'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-lg ${selectedRole === 'author' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-400'}`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  {selectedRole === 'author' && (
                    <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-white text-xs">Author / Admin</h4>
                  <p className="text-[10px] text-slate-400">Placement Directorate</p>
                </div>

                <span className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  Full CRUD Access
                </span>
              </div>

              {/* Student Option */}
              <div
                onClick={() => setSelectedRole('student')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 relative ${
                  selectedRole === 'student'
                    ? 'bg-emerald-600/10 border-emerald-500 ring-1 ring-emerald-500/40 shadow-md'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-lg ${selectedRole === 'student' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-emerald-400'}`}>
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  {selectedRole === 'student' && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-white text-xs">Student / Candidate</h4>
                  <p className="text-[10px] text-slate-400">Academic Cohort</p>
                </div>

                <span className="inline-block text-[10px] font-bold text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">
                  Read-Only View
                </span>
              </div>
            </div>
          </div>

          {/* ================= SIGN IN MODE ================= */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              {selectedRole === 'author' ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-300">Author Account</span>
                    <span className="text-emerald-400 font-bold font-mono">Signatory Verified</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Sign in as <strong>Dr. Rajesh V. Raman</strong> (Head of Training &amp; Placement). You have permission to perform all candidate CRUD operations, launch placement drives, promote pipeline candidates, and generate offer letters.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Select Existing Enrolled Student:
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                  >
                    {students.slice(0, 35).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.rollNo} • {s.branch} • CGPA {s.cgpa})
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Students have read-only access. Want to register a new student? Click "Sign Up" above.</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  New here? Create an Account &rarr;
                </button>

                <button
                  type="submit"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-white shadow-md transition cursor-pointer ${
                    selectedRole === 'author'
                      ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  }`}
                >
                  <span>Sign In as {selectedRole === 'author' ? 'Author' : 'Student'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* ================= SIGN UP MODE ================= */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              
              {selectedRole === 'student' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Candidate Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={signupName}
                        onChange={e => setSignupName(e.target.value)}
                        placeholder="e.g. Yaswanth Kumar"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Campus Email
                      </label>
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={e => setSignupEmail(e.target.value)}
                        placeholder="e.g. yaswanth@univ.ac.in"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Department
                      </label>
                      <select
                        value={signupBranch}
                        onChange={e => setSignupBranch(e.target.value as Branch)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                      >
                        {(['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'AIDS'] as Branch[]).map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        CGPA (0 - 10)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        required
                        value={signupCgpa}
                        onChange={e => setSignupCgpa(parseFloat(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Coding Score
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        required
                        value={signupCodingScore}
                        onChange={e => setSignupCodingScore(parseInt(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Technical Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={signupSkills}
                      onChange={e => setSignupSkills(e.target.value)}
                      placeholder="e.g. React, Node.js, Python, SQL, C++"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500 text-xs"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                    Your candidate profile will be registered in the directory with unique Roll Number and you will be signed in immediately to check your drive eligibility!
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Placement Officer Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={authorName}
                        onChange={e => setAuthorName(e.target.value)}
                        placeholder="e.g. Prof. Anita Desai"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Official Directorate Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={authorEmail}
                        onChange={e => setAuthorEmail(e.target.value)}
                        placeholder="e.g. anita.desai@univ.ac.in"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Directorate Designation
                      </label>
                      <input
                        type="text"
                        value={authorDesignation}
                        onChange={e => setAuthorDesignation(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Admin Author Passcode
                      </label>
                      <input
                        type="password"
                        value={authorPasscode}
                        onChange={e => setAuthorPasscode(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
                      />
                    </div>

                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300">
                      Author accounts are authorized to perform candidate additions, drive launches, pipeline updates, and record deletions.
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-xs text-slate-400 hover:text-white font-medium"
                >
                  &larr; Already have an account? Sign In
                </button>

                <button
                  type="submit"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-white shadow-md transition cursor-pointer ${
                    selectedRole === 'author'
                      ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account &amp; Sign In</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
