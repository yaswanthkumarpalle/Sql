export type Branch = 'CSE' | 'IT' | 'ECE' | 'EEE' | 'MECH' | 'AIDS';

export type PlacementStatus = 'Placed' | 'In Process' | 'Unplaced' | 'Offer Accepted' | 'Opted Out';

export type PipelineStage = 
  | 'Applied' 
  | 'Written Test' 
  | 'Technical Round 1' 
  | 'Technical Round 2' 
  | 'HR Round' 
  | 'Selected' 
  | 'Rejected';

export type DriveTier = 'Super Dream' | 'Dream' | 'Standard' | 'Mass';

export type UserRole = 'author' | 'student';

export interface CurrentUser {
  role: UserRole;
  name: string;
  email: string;
  studentId?: string;
  rollNo?: string;
}

export interface Student {
  id: string;
  rollNo: string;
  fullName: string;
  email: string;
  phone: string;
  branch: Branch;
  cgpa: number;
  activeBacklogs: number;
  historyOfBacklogs: number;
  codingScore: number; // 0 - 1000
  leetCodeSolved: number;
  skills: string[];
  status: PlacementStatus;
  pipelineStage: PipelineStage;
  placedCompany?: string;
  offeredCtc?: number; // in LPA
  targetCompany?: string;
  gender: 'Male' | 'Female' | 'Other';
  resumeSummary: string;
  interviewNotes?: string;
}

export interface CompanyDrive {
  id: string;
  name: string;
  logo: string;
  role: string;
  ctc: string;
  ctcNumber: number; // in LPA for sorting/calculations
  minCgpa: number;
  maxBacklogs: number;
  minCodingScore: number;
  branches: Branch[];
  requiredSkills: string[];
  tier: DriveTier;
  deadline: string;
  date: string;
  location: string;
  openings: number;
  appliedCount: number;
  selectedCount: number;
  rounds: string[];
  description: string;
}

export interface QueryExecutionPlan {
  scanType: 'Composite Index Scan' | 'Index Range Scan' | 'Full Table Scan' | 'Window Partition Scan';
  indexUsed: string;
  estimatedCost: number;
  rowsExamined: number;
  rowsReturned: number;
  executionTimeMs: number;
  indexDetails: string;
}

export interface PresetQuery {
  id: string;
  title: string;
  category: 'Filtering' | 'Window Functions' | 'Aggregations & CTE' | 'Joins & Subqueries';
  description: string;
  sql: string;
}
