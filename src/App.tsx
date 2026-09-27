/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar, NavTab } from './components/Navbar';
import { AnalyticsTab } from './components/AnalyticsTab';
import { StudentsTab } from './components/StudentsTab';
import { MatcherTab } from './components/MatcherTab';
import { RankingsTab } from './components/RankingsTab';
import { PipelineTab } from './components/PipelineTab';
import { StudentProfileModal } from './components/StudentProfileModal';
import { OfferLetterModal } from './components/OfferLetterModal';
import { AddStudentModal } from './components/AddStudentModal';
import { AddDriveModal } from './components/AddDriveModal';
import { LoginModal } from './components/LoginModal';
import { INITIAL_DRIVES, generateSeedStudents } from './data/mockData';
import { Branch, CompanyDrive, CurrentUser, PipelineStage, PlacementStatus, Student } from './types';

export default function App() {
  // Load persistent or seed data
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('cp_placement_students_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed reading students from localStorage', e);
    }
    return generateSeedStudents();
  });

  const [drives, setDrives] = useState<CompanyDrive[]>(() => {
    try {
      const saved = localStorage.getItem('cp_placement_drives_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed reading drives from localStorage', e);
    }
    return INITIAL_DRIVES;
  });

  // Current logged in user (Author vs Student)
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    try {
      const saved = localStorage.getItem('cp_placement_user_session_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      role: 'author',
      name: 'Dr. Rajesh V. Raman',
      email: 'tpo.directorate@univ.ac.in'
    };
  });

  const isAuthor = currentUser.role === 'author';

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<NavTab>('analytics');

  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [loginModalInitialMode, setLoginModalInitialMode] = useState<'signin' | 'signup'>('signin');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);
  const [isAddDriveOpen, setIsAddDriveOpen] = useState<boolean>(false);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [selectedStudentForOffer, setSelectedStudentForOffer] = useState<Student | null>(null);

  // Cross-tab context parameters
  const [matcherTargetDriveId, setMatcherTargetDriveId] = useState<string | undefined>(undefined);
  const [directoryInitialBranch, setDirectoryInitialBranch] = useState<Branch | undefined>(undefined);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cp_placement_students_v2', JSON.stringify(students));
    } catch (e) {
      console.warn('Could not persist students', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('cp_placement_drives_v2', JSON.stringify(drives));
    } catch (e) {
      console.warn('Could not persist drives', e);
    }
  }, [drives]);

  useEffect(() => {
    try {
      localStorage.setItem('cp_placement_user_session_v2', JSON.stringify(currentUser));
    } catch (e) {
      console.warn('Could not persist user session', e);
    }
  }, [currentUser]);

  // Handler: Add Student (CRUD: Create - Author Only)
  const handleAddStudent = (newStudent: Student) => {
    if (!isAuthor) return;
    setStudents(prev => [newStudent, ...prev]);
  };

  // Handler: Delete Student (CRUD: Delete - Author Only)
  const handleDeleteStudent = (studentId: string) => {
    if (!isAuthor) return;
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  // Handler: Add Drive (CRUD: Create - Author Only)
  const handleAddDrive = (newDrive: CompanyDrive) => {
    if (!isAuthor) return;
    setDrives(prev => [newDrive, ...prev]);
  };

  // Handler: Reset / Reseed database (Author Only)
  const handleResetData = () => {
    if (!isAuthor) return;
    const fresh = generateSeedStudents();
    setStudents(fresh);
    setDrives(INITIAL_DRIVES);
    try {
      localStorage.removeItem('cp_placement_students_v2');
      localStorage.removeItem('cp_placement_drives_v2');
    } catch (e) {}
  };

  // Handler: Bulk advance candidates from Matcher (CRUD: Update - Author Only)
  const handleBulkAdvanceCandidates = (studentIds: string[], targetStage: PipelineStage, companyName: string) => {
    if (!isAuthor) return;
    setStudents(prev => prev.map(s => {
      if (studentIds.includes(s.id)) {
        return {
          ...s,
          pipelineStage: targetStage,
          targetCompany: companyName,
          status: targetStage === 'Selected' ? 'Placed' : 'In Process'
        };
      }
      return s;
    }));
  };

  // Handler: Update pipeline stage & placement status (CRUD: Update - Author Only)
  const handleUpdateStage = (studentId: string, stage: PipelineStage, companyName?: string, ctc?: number) => {
    if (!isAuthor) return;
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const isPlaced = stage === 'Selected';
        return {
          ...s,
          pipelineStage: stage,
          status: isPlaced ? 'Placed' : (stage === 'Rejected' ? 'Unplaced' : 'In Process'),
          placedCompany: isPlaced ? (companyName || s.targetCompany || 'Partner Company') : s.placedCompany,
          offeredCtc: isPlaced ? (ctc || s.offeredCtc || 20.0) : s.offeredCtc
        };
      }
      return s;
    }));
  };

  // Handler: Update direct status (CRUD: Update - Author Only)
  const handleUpdateStatus = (studentId: string, status: PlacementStatus, company?: string, ctc?: number) => {
    if (!isAuthor) return;
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          status,
          placedCompany: company || s.placedCompany,
          offeredCtc: ctc !== undefined ? ctc : s.offeredCtc,
          pipelineStage: status === 'Placed' || status === 'Offer Accepted' ? 'Selected' : s.pipelineStage
        };
      }
      return s;
    }));
  };

  // Navigation shortcuts
  const handleNavigateToMatcher = (driveId?: string) => {
    if (driveId) setMatcherTargetDriveId(driveId);
    setCurrentTab('matcher');
  };

  const handleNavigateToDirectory = (filterBranch?: Branch) => {
    if (filterBranch) setDirectoryInitialBranch(filterBranch);
    setCurrentTab('students');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        students={students}
        currentUser={currentUser}
        onOpenLogin={(mode?: 'signin' | 'signup') => {
          setLoginModalInitialMode(mode || 'signin');
          setIsLoginOpen(true);
        }}
        onOpenAddStudent={() => setIsAddStudentOpen(true)}
        onOpenAddDrive={() => setIsAddDriveOpen(true)}
        onResetData={handleResetData}
        onOpenStudentOffer={(stu) => setSelectedStudentForOffer(stu)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentTab === 'analytics' && (
          <AnalyticsTab
            students={students}
            drives={drives}
            currentUser={currentUser}
            onNavigateToMatcher={handleNavigateToMatcher}
            onNavigateToDirectory={handleNavigateToDirectory}
            onSelectStudent={setSelectedStudentForProfile}
            onOpenOfferLetter={setSelectedStudentForOffer}
          />
        )}

        {currentTab === 'students' && (
          <StudentsTab
            students={students}
            onSelectStudent={setSelectedStudentForProfile}
            onOpenOfferLetter={setSelectedStudentForOffer}
            onDeleteStudent={handleDeleteStudent}
            onUpdateStatus={handleUpdateStatus}
            initialBranch={directoryInitialBranch}
            isAuthor={isAuthor}
          />
        )}

        {currentTab === 'matcher' && (
          <MatcherTab
            students={students}
            drives={drives}
            selectedDriveId={matcherTargetDriveId}
            onSelectStudent={setSelectedStudentForProfile}
            onBulkAdvanceCandidates={handleBulkAdvanceCandidates}
            isAuthor={isAuthor}
          />
        )}

        {currentTab === 'rankings' && (
          <RankingsTab
            students={students}
            onSelectStudent={setSelectedStudentForProfile}
          />
        )}

        {currentTab === 'pipeline' && (
          <PipelineTab
            students={students}
            drives={drives}
            onUpdateStage={handleUpdateStage}
            onSelectStudent={setSelectedStudentForProfile}
            onOpenOfferLetter={setSelectedStudentForOffer}
            isAuthor={isAuthor}
          />
        )}
      </main>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={currentUser}
        onLogin={setCurrentUser}
        onRegisterStudent={handleAddStudent}
        students={students}
        initialMode={loginModalInitialMode}
      />

      <StudentProfileModal
        student={selectedStudentForProfile}
        onClose={() => setSelectedStudentForProfile(null)}
        onOpenOfferLetter={setSelectedStudentForOffer}
        onUpdateStatus={handleUpdateStatus}
        isAuthor={isAuthor}
      />

      <OfferLetterModal
        student={selectedStudentForOffer}
        onClose={() => setSelectedStudentForOffer(null)}
      />

      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={handleAddStudent}
        nextRollNumber={students.length + 101}
      />

      <AddDriveModal
        isOpen={isAddDriveOpen}
        onClose={() => setIsAddDriveOpen(false)}
        onAddDrive={handleAddDrive}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 CampusPlacement Portal • Campus Recruitment &amp; Career Placement Suite</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Active Batch 2025-2026</span>
            <span>•</span>
            <span>Current Role: <strong className={isAuthor ? 'text-blue-400' : 'text-emerald-400'}>{isAuthor ? 'Author (CRUD Enabled)' : 'Student (Read-Only)'}</strong></span>
          </div>
        </div>
      </footer>

    </div>
  );
}
