import { Branch, CompanyDrive, PresetQuery, Student } from '../types';

export const INITIAL_DRIVES: CompanyDrive[] = [
  {
    id: 'drv-google',
    name: 'Google',
    logo: 'Search',
    role: 'Associate Software Engineer (SWE)',
    ctc: '₹34.5 LPA',
    ctcNumber: 34.5,
    minCgpa: 8.5,
    maxBacklogs: 0,
    minCodingScore: 800,
    branches: ['CSE', 'IT', 'AIDS'],
    requiredSkills: ['C++', 'Python', 'Data Structures', 'Distributed Systems'],
    tier: 'Super Dream',
    deadline: '2026-10-15',
    date: '2026-10-20',
    location: 'Bangalore / Hyderabad',
    openings: 12,
    appliedCount: 46,
    selectedCount: 6,
    rounds: ['Online Coding Assessment', 'Technical Round 1', 'Technical Round 2', 'Googliness & Leadership'],
    description: 'Core software engineering role working on scalable global infrastructure, AI search, and cloud computing.'
  },
  {
    id: 'drv-microsoft',
    name: 'Microsoft',
    logo: 'Cpu',
    role: 'Software Development Engineer - I',
    ctc: '₹31.2 LPA',
    ctcNumber: 31.2,
    minCgpa: 8.0,
    maxBacklogs: 0,
    minCodingScore: 750,
    branches: ['CSE', 'IT', 'ECE', 'AIDS'],
    requiredSkills: ['C#', 'Java', 'Azure', 'Algorithms', 'TypeScript'],
    tier: 'Super Dream',
    deadline: '2026-10-18',
    date: '2026-10-25',
    location: 'Hyderabad / Noida',
    openings: 18,
    appliedCount: 62,
    selectedCount: 9,
    rounds: ['Codility OA', 'DSA Interview', 'System Design & OS', 'AA (As-Appropriate) Round'],
    description: 'Build enterprise cloud platforms, developer tools, and intelligent consumer experiences on Microsoft 365 and Azure.'
  },
  {
    id: 'drv-nvidia',
    name: 'NVIDIA',
    logo: 'Layers',
    role: 'AI / HPC Software Engineer',
    ctc: '₹29.8 LPA',
    ctcNumber: 29.8,
    minCgpa: 8.2,
    maxBacklogs: 0,
    minCodingScore: 780,
    branches: ['CSE', 'IT', 'ECE', 'AIDS'],
    requiredSkills: ['CUDA', 'C++', 'Computer Architecture', 'Deep Learning'],
    tier: 'Super Dream',
    deadline: '2026-10-22',
    date: '2026-10-30',
    location: 'Bangalore / Pune',
    openings: 8,
    appliedCount: 38,
    selectedCount: 4,
    rounds: ['Architecture & C++ Test', 'System & Concurrency Round', 'AI/GPU Deep Dive', 'Director Round'],
    description: 'Accelerate the world of generative AI and computer graphics through cutting-edge GPU programming and kernel optimization.'
  },
  {
    id: 'drv-amazon',
    name: 'Amazon',
    logo: 'ShoppingBag',
    role: 'SDE-1 (AWS & Retail Platform)',
    ctc: '₹27.5 LPA',
    ctcNumber: 27.5,
    minCgpa: 7.5,
    maxBacklogs: 0,
    minCodingScore: 700,
    branches: ['CSE', 'IT', 'ECE', 'EEE', 'AIDS'],
    requiredSkills: ['Java', 'Object Oriented Design', 'AWS', 'System Architecture'],
    tier: 'Dream',
    deadline: '2026-10-28',
    date: '2026-11-04',
    location: 'Bangalore / Chennai',
    openings: 24,
    appliedCount: 84,
    selectedCount: 14,
    rounds: ['Online OA (2 DSA + Work Style)', 'Technical Interview 1', 'Technical Interview 2', 'Bar Raiser Round'],
    description: 'Design resilient and fault-tolerant microservices processing billions of requests daily across AWS and Retail operations.'
  },
  {
    id: 'drv-goldman',
    name: 'Goldman Sachs',
    logo: 'TrendingUp',
    role: 'Quantitative Financial Analyst / Tech Analyst',
    ctc: '₹25.0 LPA',
    ctcNumber: 25.0,
    minCgpa: 8.0,
    maxBacklogs: 0,
    minCodingScore: 720,
    branches: ['CSE', 'IT', 'ECE', 'AIDS'],
    requiredSkills: ['Python', 'SQL', 'Algorithms', 'Probability & Statistics'],
    tier: 'Dream',
    deadline: '2026-11-02',
    date: '2026-11-10',
    location: 'Bangalore',
    openings: 10,
    appliedCount: 52,
    selectedCount: 5,
    rounds: ['HackerRank Aptitude & Coding', 'Math & Algo Round', 'System Round', 'Managing Director Round'],
    description: 'Solve complex high-frequency trading problems, risk assessment systems, and ultra-low latency transaction pipelines.'
  },
  {
    id: 'drv-atlassian',
    name: 'Atlassian',
    logo: 'Share2',
    role: 'Graduate Software Engineer',
    ctc: '₹32.0 LPA',
    ctcNumber: 32.0,
    minCgpa: 7.8,
    maxBacklogs: 0,
    minCodingScore: 760,
    branches: ['CSE', 'IT', 'AIDS'],
    requiredSkills: ['React', 'Java', 'Microservices', 'Distributed Systems'],
    tier: 'Super Dream',
    deadline: '2026-11-05',
    date: '2026-11-12',
    location: 'Remote / Bangalore',
    openings: 10,
    appliedCount: 55,
    selectedCount: 6,
    rounds: ['Karat Coding Assessment', 'Data Structures & Algorithms', 'System Architecture', 'Values Interview'],
    description: 'Empower millions of teams worldwide through collaboration tools like Jira, Confluence, and Bitbucket.'
  },
  {
    id: 'drv-adobe',
    name: 'Adobe Systems',
    logo: 'Palette',
    role: 'Product Development Engineer',
    ctc: '₹26.5 LPA',
    ctcNumber: 26.5,
    minCgpa: 7.5,
    maxBacklogs: 0,
    minCodingScore: 710,
    branches: ['CSE', 'IT', 'ECE', 'MECH', 'AIDS'],
    requiredSkills: ['C++', 'JavaScript', 'WebGL', 'Machine Learning'],
    tier: 'Dream',
    deadline: '2026-11-10',
    date: '2026-11-18',
    location: 'Noida / Bangalore',
    openings: 15,
    appliedCount: 70,
    selectedCount: 8,
    rounds: ['Online Assessment', 'Computer Graphics & DSA', 'Design & Problem Solving', 'Director HR'],
    description: 'Innovate digital media experiences, creative AI models like Adobe Firefly, and enterprise PDF engines.'
  },
  {
    id: 'drv-tcs',
    name: 'TCS Digital / Prime',
    logo: 'Terminal',
    role: 'Systems Engineer & Digital Developer',
    ctc: '₹9.2 LPA',
    ctcNumber: 9.2,
    minCgpa: 6.5,
    maxBacklogs: 1,
    minCodingScore: 500,
    branches: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'AIDS'],
    requiredSkills: ['Java', 'Python', 'SQL', 'Web Fundamentals'],
    tier: 'Standard',
    deadline: '2026-11-15',
    date: '2026-11-25',
    location: 'Pan-India',
    openings: 80,
    appliedCount: 110,
    selectedCount: 38,
    rounds: ['TCS NQT Assessment', 'Coding Test (2 problems)', 'Technical Interview', 'Managerial & HR'],
    description: 'Enterprise digital engineering and cloud transformation projects for Fortune 500 global clients.'
  }
];

// Seed generator to guarantee deterministic, realistic student database
const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Sanya', 'Vikram', 'Neha', 'Karan', 'Priya',
  'Aditya', 'Meera', 'Rahul', 'Divya', 'Siddharth', 'Kavya', 'Arjun', 'Tanvi',
  'Dev', 'Ishita', 'Nikhil', 'Pooja', 'Abhishek', 'Shruti', 'Varun', 'Riya',
  'Gautam', 'Sneha', 'Manish', 'Ritika', 'Harsh', 'Anushka', 'Vivek', 'Bhavna'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Reddy', 'Singh', 'Rao', 'Nair', 'Joshi',
  'Gupta', 'Chowdhury', 'Iyer', 'Menon', 'Bose', 'Kulkarni', 'Deshmukh', 'Mishra'
];

const SKILL_POOL = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'C++', 'Go', 'SQL', 
  'PostgreSQL', 'Docker', 'AWS', 'Kubernetes', 'Redis', 'Spring Boot', 'GraphQL',
  'Machine Learning', 'TensorFlow', 'PyTorch', 'Data Structures', 'System Design',
  'Microservices', 'TailwindCSS', 'Embedded C', 'Computer Vision', 'Git'
];

export function generateSeedStudents(): Student[] {
  const students: Student[] = [];
  const branches: Branch[] = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'AIDS'];
  
  // Hand-curated standout profiles
  const standoutProfiles: Partial<Student>[] = [
    {
      fullName: 'Aarav Sharma',
      branch: 'CSE',
      cgpa: 9.85,
      activeBacklogs: 0,
      historyOfBacklogs: 0,
      codingScore: 980,
      leetCodeSolved: 650,
      skills: ['C++', 'Python', 'Distributed Systems', 'System Design', 'Docker', 'Go'],
      status: 'Placed',
      pipelineStage: 'Selected',
      placedCompany: 'Google',
      offeredCtc: 34.5,
      targetCompany: 'Google',
      gender: 'Male',
      resumeSummary: 'Competitive programmer (Codeforces Candidate Master) with expertise in low-latency backend systems and distributed consensus algorithms.'
    },
    {
      fullName: 'Ananya Iyer',
      branch: 'AIDS',
      cgpa: 9.72,
      activeBacklogs: 0,
      historyOfBacklogs: 0,
      codingScore: 950,
      leetCodeSolved: 580,
      skills: ['Python', 'PyTorch', 'TensorFlow', 'Computer Vision', 'CUDA', 'FastAPI'],
      status: 'Placed',
      pipelineStage: 'Selected',
      placedCompany: 'NVIDIA',
      offeredCtc: 29.8,
      targetCompany: 'NVIDIA',
      gender: 'Female',
      resumeSummary: 'Published researcher in multimodal transformers with 2 NeurIPS workshop papers. Proficient in CUDA kernel optimization and LLM fine-tuning.'
    },
    {
      fullName: 'Siddharth Patel',
      branch: 'CSE',
      cgpa: 9.45,
      activeBacklogs: 0,
      historyOfBacklogs: 0,
      codingScore: 920,
      leetCodeSolved: 520,
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
      status: 'Placed',
      pipelineStage: 'Selected',
      placedCompany: 'Atlassian',
      offeredCtc: 32.0,
      targetCompany: 'Atlassian',
      gender: 'Male',
      resumeSummary: 'Full-stack builder with open source contributions to Webpack and Next.js ecosystem. Created real-time collaborative whiteboarding app.'
    },
    {
      fullName: 'Kavya Reddy',
      branch: 'IT',
      cgpa: 9.30,
      activeBacklogs: 0,
      historyOfBacklogs: 0,
      codingScore: 890,
      leetCodeSolved: 490,
      skills: ['Java', 'Spring Boot', 'Kafka', 'Microservices', 'Kubernetes'],
      status: 'Placed',
      pipelineStage: 'Selected',
      placedCompany: 'Microsoft',
      offeredCtc: 31.2,
      targetCompany: 'Microsoft',
      gender: 'Female',
      resumeSummary: 'Passionate cloud backend engineer with deep expertise in distributed event-driven messaging architectures using Apache Kafka.'
    },
    {
      fullName: 'Rohan Verma',
      branch: 'ECE',
      cgpa: 8.92,
      activeBacklogs: 0,
      historyOfBacklogs: 0,
      codingScore: 840,
      leetCodeSolved: 410,
      skills: ['C++', 'Embedded C', 'Linux Kernel', 'Computer Architecture', 'Python'],
      status: 'Placed',
      pipelineStage: 'Selected',
      placedCompany: 'Amazon',
      offeredCtc: 27.5,
      targetCompany: 'Amazon',
      gender: 'Male',
      resumeSummary: 'Interdisciplinary engineer merging embedded systems with cloud computing. Built IoT firmware with TLS encryption on ESP32.'
    },
    {
      fullName: 'Meera Deshmukh',
      branch: 'CSE',
      cgpa: 9.15,
      activeBacklogs: 0,
      historyOfBacklogs: 0,
      codingScore: 880,
      leetCodeSolved: 460,
      skills: ['Python', 'SQL', 'C++', 'Data Structures', 'Statistical Modeling'],
      status: 'Placed',
      pipelineStage: 'Selected',
      placedCompany: 'Goldman Sachs',
      offeredCtc: 25.0,
      targetCompany: 'Goldman Sachs',
      gender: 'Female',
      resumeSummary: 'Algorithmic problem solver with strong mathematical foundations in stochastic processes and high-frequency order book simulations.'
    },
    {
      fullName: 'Vikram Singh',
      branch: 'CSE',
      cgpa: 8.85,
      activeBacklogs: 0,
      historyOfBacklogs: 0,
      codingScore: 860,
      leetCodeSolved: 430,
      skills: ['Java', 'C++', 'Data Structures', 'MySQL', 'Redis'],
      status: 'In Process',
      pipelineStage: 'Technical Round 2',
      targetCompany: 'Google',
      gender: 'Male',
      resumeSummary: 'Strong in graph algorithms, dynamic programming, and scalable relational schema design with Redis caching.'
    },
    {
      fullName: 'Tanvi Joshi',
      branch: 'IT',
      cgpa: 8.70,
      activeBacklogs: 0,
      historyOfBacklogs: 0,
      codingScore: 820,
      leetCodeSolved: 390,
      skills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'GraphQL'],
      status: 'In Process',
      pipelineStage: 'Technical Round 1',
      targetCompany: 'Microsoft',
      gender: 'Female',
      resumeSummary: 'Frontend specialist experienced in building responsive accessible UIs with React and robust GraphQL backend resolvers.'
    },
    {
      fullName: 'Arjun Bose',
      branch: 'AIDS',
      cgpa: 8.65,
      activeBacklogs: 0,
      historyOfBacklogs: 0,
      codingScore: 810,
      leetCodeSolved: 380,
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'FastAPI'],
      status: 'In Process',
      pipelineStage: 'Written Test',
      targetCompany: 'NVIDIA',
      gender: 'Male',
      resumeSummary: 'AI engineer focused on computer vision models for edge devices. Experience with ONNX runtime and model quantization.'
    },
    {
      fullName: 'Priya Nair',
      branch: 'ECE',
      cgpa: 8.40,
      activeBacklogs: 0,
      historyOfBacklogs: 0,
      codingScore: 790,
      leetCodeSolved: 360,
      skills: ['C++', 'Python', 'Data Structures', 'Algorithms', 'SQL'],
      status: 'In Process',
      pipelineStage: 'HR Round',
      targetCompany: 'Amazon',
      gender: 'Female',
      resumeSummary: 'Versatile programmer clearing multiple recruitment assessments with top percentile marks in core algorithms and data structures.'
    }
  ];

  let rollIndex = 101;

  // Insert standout profiles
  standoutProfiles.forEach((item, idx) => {
    students.push({
      id: `STU-2026-${rollIndex}`,
      rollNo: `22BCE${rollIndex}`,
      fullName: item.fullName!,
      email: `${item.fullName!.toLowerCase().replace(' ', '.')}@univ.ac.in`,
      phone: `+91 98${Math.floor(10000000 + Math.random() * 89999999)}`,
      branch: item.branch!,
      cgpa: item.cgpa!,
      activeBacklogs: item.activeBacklogs!,
      historyOfBacklogs: item.historyOfBacklogs!,
      codingScore: item.codingScore!,
      leetCodeSolved: item.leetCodeSolved!,
      skills: item.skills!,
      status: item.status!,
      pipelineStage: item.pipelineStage!,
      placedCompany: item.placedCompany,
      offeredCtc: item.offeredCtc,
      targetCompany: item.targetCompany,
      gender: item.gender!,
      resumeSummary: item.resumeSummary!,
      interviewNotes: item.status === 'Placed' 
        ? `Cleared all 4 rounds with outstanding ratings. Strong grasp of fundamental CS principles.` 
        : `Advancing steadily through stages with positive interviewer feedback.`
    });
    rollIndex++;
  });

  // Generate remaining students up to 125 total
  const remainingCount = 115;
  for (let i = 0; i < remainingCount; i++) {
    const fn = FIRST_NAMES[(i * 3 + 7) % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i * 2 + 5) % LAST_NAMES.length];
    const fullName = `${fn} ${ln}`;
    const branch = branches[i % branches.length];
    const gender = (i % 2 === 0 ? 'Female' : 'Male') as 'Male' | 'Female';

    // CGPA distribution: mostly 6.8 - 9.4
    const baseCgpa = 6.2 + ((i * 7) % 36) * 0.09;
    const cgpa = Number(Math.min(9.65, Math.max(5.8, baseCgpa)).toFixed(2));

    // Backlogs: 85% have 0, 10% have 1, 5% have 2+
    let activeBacklogs = 0;
    if (i % 8 === 0 && cgpa < 7.5) {
      activeBacklogs = 1;
    } else if (i % 19 === 0 && cgpa < 6.8) {
      activeBacklogs = 2;
    }

    const historyOfBacklogs = activeBacklogs > 0 ? activeBacklogs + (i % 2) : (i % 14 === 0 ? 1 : 0);

    // Coding score (scaled 400 - 950 based loosely on CGPA + interest)
    const codingScore = Math.min(960, Math.max(380, Math.floor(cgpa * 85 + ((i * 37) % 180))));
    const leetCodeSolved = Math.floor((codingScore / 960) * 450);

    // Pick 4-6 random skills
    const skillCount = 4 + (i % 3);
    const assignedSkills: string[] = [];
    for (let k = 0; k < skillCount; k++) {
      const s = SKILL_POOL[(i * 3 + k * 5) % SKILL_POOL.length];
      if (!assignedSkills.includes(s)) assignedSkills.push(s);
    }

    // Determine status & pipeline stage
    let status: Student['status'] = 'Unplaced';
    let pipelineStage: Student['pipelineStage'] = 'Applied';
    let placedCompany: string | undefined = undefined;
    let offeredCtc: number | undefined = undefined;
    let targetCompany: string | undefined = undefined;

    if (cgpa >= 8.2 && activeBacklogs === 0 && i % 3 === 0) {
      status = 'Placed';
      pipelineStage = 'Selected';
      const companyOptions = INITIAL_DRIVES.filter(d => d.tier !== 'Standard');
      const comp = companyOptions[i % companyOptions.length];
      placedCompany = comp.name;
      offeredCtc = comp.ctcNumber;
      targetCompany = comp.name;
    } else if (cgpa >= 7.0 && activeBacklogs <= 1 && i % 4 === 0) {
      status = 'Placed';
      pipelineStage = 'Selected';
      placedCompany = 'TCS Digital / Prime';
      offeredCtc = 9.2;
      targetCompany = 'TCS Digital / Prime';
    } else if (cgpa >= 7.2 && activeBacklogs === 0 && i % 2 === 0) {
      status = 'In Process';
      const stages: Student['pipelineStage'][] = ['Written Test', 'Technical Round 1', 'Technical Round 2', 'HR Round'];
      pipelineStage = stages[i % stages.length];
      const targetDrives = INITIAL_DRIVES.slice(0, 5);
      targetCompany = targetDrives[i % targetDrives.length].name;
    } else {
      status = 'Unplaced';
      pipelineStage = 'Applied';
      targetCompany = INITIAL_DRIVES[i % INITIAL_DRIVES.length].name;
    }

    students.push({
      id: `STU-2026-${rollIndex}`,
      rollNo: `22B${branch.substring(0, 2)}${rollIndex}`,
      fullName,
      email: `${fullName.toLowerCase().replace(' ', '.')}${rollIndex % 99}@univ.ac.in`,
      phone: `+91 97${Math.floor(10000000 + Math.random() * 89999999)}`,
      branch,
      cgpa,
      activeBacklogs,
      historyOfBacklogs,
      codingScore,
      leetCodeSolved,
      skills: assignedSkills,
      status,
      pipelineStage,
      placedCompany,
      offeredCtc,
      targetCompany,
      gender,
      resumeSummary: `Goal-oriented student in ${branch} with hands-on projects in ${assignedSkills.slice(0, 3).join(', ')}. Strong team collaborator with academic consistency.`,
      interviewNotes: status === 'Placed' ? `Offered full-time role during campus drive.` : undefined
    });

    rollIndex++;
  }

  return students;
}

export const PRESET_QUERIES: PresetQuery[] = [
  {
    id: 'pq-window-dense-rank',
    title: 'Department-Wise DENSE_RANK() by Coding & CGPA',
    category: 'Window Functions',
    description: 'Partitions all students by their academic department and calculates dense rank, standard rank, and sequential row number.',
    sql: `SELECT 
    s.full_name,
    s.branch,
    s.coding_score,
    s.cgpa,
    DENSE_RANK() OVER (
        PARTITION BY s.branch 
        ORDER BY s.coding_score DESC, s.cgpa DESC
    ) AS branch_dense_rank,
    ROW_NUMBER() OVER (
        PARTITION BY s.branch 
        ORDER BY s.coding_score DESC, s.cgpa DESC
    ) AS branch_row_num,
    RANK() OVER (
        PARTITION BY s.branch 
        ORDER BY s.coding_score DESC
    ) AS branch_rank
FROM Students s
ORDER BY s.branch, branch_dense_rank;`
  },
  {
    id: 'pq-google-matcher',
    title: 'Super Dream Drive Composite Index Filter',
    category: 'Filtering',
    description: 'Finds students satisfying Google Super-Dream criteria (CGPA >= 8.5, 0 backlogs, CSE/IT/AIDS) leveraging composite index scan.',
    sql: `SELECT 
    s.roll_no,
    s.full_name,
    s.branch,
    s.cgpa,
    s.active_backlogs,
    s.coding_score,
    s.status
FROM Students s
WHERE s.cgpa >= 8.50
  AND s.active_backlogs = 0
  AND s.branch IN ('CSE', 'IT', 'AIDS')
  AND s.coding_score >= 800
ORDER BY s.coding_score DESC;`
  },
  {
    id: 'pq-cte-branch-summary',
    title: 'Department Placement Performance (CTE & Aggregations)',
    category: 'Aggregations & CTE',
    description: 'Uses Common Table Expressions (CTE) to calculate total candidates, placed count, placement percentage, and avg CTC per branch.',
    sql: `WITH DepartmentStats AS (
    SELECT 
        branch,
        COUNT(*) AS total_registered,
        SUM(CASE WHEN status = 'Placed' THEN 1 ELSE 0 END) AS placed_count,
        ROUND(AVG(cgpa), 2) AS avg_cgpa,
        ROUND(AVG(coding_score), 0) AS avg_coding_score,
        ROUND(AVG(CASE WHEN status = 'Placed' THEN offered_ctc ELSE NULL END), 2) AS avg_placed_ctc
    FROM Students
    GROUP BY branch
)
SELECT 
    branch,
    total_registered,
    placed_count,
    ROUND((placed_count * 100.0 / total_registered), 1) AS placement_rate_pct,
    avg_cgpa,
    avg_coding_score,
    COALESCE(avg_placed_ctc, 0) AS avg_ctc_lpa
FROM DepartmentStats
ORDER BY placement_rate_pct DESC;`
  },
  {
    id: 'pq-subquery-above-avg',
    title: 'Unplaced High Performers (Correlated Subquery)',
    category: 'Joins & Subqueries',
    description: 'Finds students whose CGPA is strictly above their department average but are currently unplaced.',
    sql: `SELECT 
    s.roll_no,
    s.full_name,
    s.branch,
    s.cgpa,
    s.coding_score,
    s.status
FROM Students s
WHERE s.status = 'Unplaced'
  AND s.active_backlogs = 0
  AND s.cgpa > (
      SELECT AVG(inner_s.cgpa)
      FROM Students inner_s
      WHERE inner_s.branch = s.branch
  )
ORDER BY s.cgpa DESC;`
  },
  {
    id: 'pq-ntile-quartiles',
    title: 'Candidate Quartiles with NTILE(4)',
    category: 'Window Functions',
    description: 'Divides candidates into 4 performance buckets (Quartile 1 = Top 25%) based on combined coding score.',
    sql: `SELECT 
    s.full_name,
    s.branch,
    s.coding_score,
    s.cgpa,
    NTILE(4) OVER (ORDER BY s.coding_score DESC) AS talent_quartile,
    CASE NTILE(4) OVER (ORDER BY s.coding_score DESC)
        WHEN 1 THEN 'Top Tier (Tier 1 Drives)'
        WHEN 2 THEN 'High Potential (Tier 2 Drives)'
        WHEN 3 THEN 'Core Prepared (Standard Drives)'
        ELSE 'Needs Coding Remediation'
    END AS recruitment_tier
FROM Students s
ORDER BY s.coding_score DESC;`
  },
  {
    id: 'pq-ctc-distribution',
    title: 'Placed Package Distribution by Drive Tier',
    category: 'Aggregations & CTE',
    description: 'Calculates minimum, maximum, and average salary packaged achieved by campus placement candidates.',
    sql: `SELECT 
    placed_company,
    COUNT(*) AS hires_count,
    MIN(offered_ctc) AS min_ctc_lpa,
    MAX(offered_ctc) AS max_ctc_lpa,
    ROUND(AVG(offered_ctc), 2) AS avg_ctc_lpa
FROM Students
WHERE status = 'Placed' AND placed_company IS NOT NULL
GROUP BY placed_company
ORDER BY avg_ctc_lpa DESC;`
  }
];

export const SQL_SCHEMA_DDL = `-- Placement DBMS Core Relational DDL & Composite Indexes

-- 1. Departments Master
CREATE TABLE Departments (
    branch_code VARCHAR(10) PRIMARY KEY,
    branch_name VARCHAR(100) NOT NULL,
    hod_name VARCHAR(100),
    accreditation_status VARCHAR(20) DEFAULT 'NBA Accredited'
);

-- 2. Students Master Table
CREATE TABLE Students (
    student_id VARCHAR(36) PRIMARY KEY,
    roll_no VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    phone VARCHAR(20),
    branch VARCHAR(10) NOT NULL REFERENCES Departments(branch_code),
    gender VARCHAR(10),
    status VARCHAR(20) DEFAULT 'Unplaced',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Academic & Coding Performance
CREATE TABLE AcademicRecords (
    record_id SERIAL PRIMARY KEY,
    student_id VARCHAR(36) UNIQUE REFERENCES Students(student_id) ON DELETE CASCADE,
    cgpa NUMERIC(4, 2) NOT NULL CHECK (cgpa >= 0.0 AND cgpa <= 10.0),
    active_backlogs INTEGER DEFAULT 0 CHECK (active_backlogs >= 0),
    history_of_backlogs INTEGER DEFAULT 0,
    coding_score INTEGER DEFAULT 0 CHECK (coding_score >= 0 AND coding_score <= 1000),
    leetcode_count INTEGER DEFAULT 0,
    skills TEXT[]
);

-- 4. Corporate Recruitment Drives
CREATE TABLE CorporateDrives (
    drive_id VARCHAR(36) PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    role_title VARCHAR(120) NOT NULL,
    ctc_lpa NUMERIC(6, 2) NOT NULL,
    min_cgpa NUMERIC(4, 2) NOT NULL,
    max_backlogs INTEGER DEFAULT 0,
    min_coding_score INTEGER DEFAULT 0,
    drive_tier VARCHAR(20) NOT NULL,
    drive_date DATE NOT NULL,
    openings_count INTEGER DEFAULT 1
);

-- 5. Drive Applications & Pipeline Stages
CREATE TABLE DriveApplications (
    application_id SERIAL PRIMARY KEY,
    student_id VARCHAR(36) REFERENCES Students(student_id),
    drive_id VARCHAR(36) REFERENCES CorporateDrives(drive_id),
    current_stage VARCHAR(30) DEFAULT 'Applied',
    offered_ctc NUMERIC(6, 2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_drive UNIQUE (student_id, drive_id)
);

-- ================= PERFORMANCE INDEXES =================
-- High speed composite index for multi-criteria drive matching
CREATE INDEX idx_student_eligibility 
ON AcademicRecords (cgpa DESC, active_backlogs ASC, coding_score DESC);

-- Composite index for branch-partitioned rankings
CREATE INDEX idx_branch_scores 
ON Students (branch, student_id);

-- GIN Index for fast skill set queries
CREATE INDEX idx_student_skills 
ON AcademicRecords USING GIN (skills);
`;
