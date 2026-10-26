export interface CourseItem {
  id: string;
  code: string;
  title: string;
  department: "DICT" | "DBST" | "DET" | "DIAT";
  departmentName: string;
  category: string;
  lecturer: string;
  gradient: string;
  progress: number;
  enrolled: boolean;
  selfEnrollable: boolean;
  enrollmentKey?: string;
  studentsCount: number;
}


export const INITIAL_COURSES: CourseItem[] = [
    {
      id: "ic-3204",
      code: "IC 3204",
      title: "Introduction to Software Quality Assurance",
      department: "DICT",
      departmentName: "Department of Information and Communication Technology",
      category: "Level 3 - Semester 1",
      lecturer: "Dr. Aruna Pathirana",
      gradient: "from-purple-600 via-indigo-600 to-blue-700",
      progress: 44,
      enrolled: true,
      selfEnrollable: true,
      enrollmentKey: "SQA2026",
      studentsCount: 145
    },
    {
      id: "ic-3101",
      code: "IC 3101",
      title: "Advanced Web Application Architectures",
      department: "DICT",
      departmentName: "Department of Information and Communication Technology",
      category: "Level 3 - Semester 1",
      lecturer: "Dr. Aruna Pathirana",
      gradient: "from-blue-600 via-teal-600 to-cyan-700",
      progress: 75,
      enrolled: true,
      selfEnrollable: true,
      enrollmentKey: "WEB3101",
      studentsCount: 140
    },
    {
      id: "ic-3102",
      code: "IC 3102",
      title: "Distributed Database Systems & Cloud Sharding",
      department: "DICT",
      departmentName: "Department of Information and Communication Technology",
      category: "Level 3 - Semester 1",
      lecturer: "Prof. K. A. S. Fernando",
      gradient: "from-slate-700 via-gray-800 to-zinc-900",
      progress: 88,
      enrolled: true,
      selfEnrollable: false,
      studentsCount: 135
    },
    {
      id: "et-2105",
      code: "ET 2105",
      title: "Embedded Systems, Industrial IoT & Edge Devices",
      department: "DET",
      departmentName: "Department of Engineering Technology",
      category: "Level 2 - Semester 2",
      lecturer: "Dr. R. M. Wijesinghe",
      gradient: "from-amber-700 via-orange-600 to-red-800",
      progress: 30,
      enrolled: true,
      selfEnrollable: true,
      enrollmentKey: "IOT2026",
      studentsCount: 110
    },
    {
      id: "bst-3104",
      code: "BST 3104",
      title: "Bioprocess Engineering Principles & Bioreactors",
      department: "DBST",
      departmentName: "Department of Biosystems Technology",
      category: "Level 3 - Semester 1",
      lecturer: "Dr. S. M. Senanayake",
      gradient: "from-emerald-700 via-teal-700 to-green-800",
      progress: 0,
      enrolled: false,
      selfEnrollable: true,
      enrollmentKey: "BIO3104",
      studentsCount: 95
    },
    {
      id: "iat-3102",
      code: "IAT 3102",
      title: "Industrial Robotics & Autonomous Motion Control",
      department: "DIAT",
      departmentName: "Department of Instrumentation & Automation",
      category: "Level 3 - Semester 1",
      lecturer: "Dr. P. L. Perera",
      gradient: "from-cyan-700 via-blue-700 to-indigo-800",
      progress: 0,
      enrolled: false,
      selfEnrollable: true,
      enrollmentKey: "ROBOT2026",
      studentsCount: 80
    },
    {
      id: "ic-3205",
      code: "IC 3205",
      title: "Cloud Native DevOps & Site Reliability Engineering",
      department: "DICT",
      departmentName: "Department of Information and Communication Technology",
      category: "Level 3 - Semester 2",
      lecturer: "Eng. Chathura Silva",
      gradient: "from-rose-700 via-pink-700 to-red-800",
      progress: 0,
      enrolled: false,
      selfEnrollable: true,
      enrollmentKey: "DEVOPS2026",
      studentsCount: 120
    }
  ];

export function normalizeCourseId(code: string) {
  return code.trim().toLowerCase().replace(/^ict(?=[ -])/i, "ic").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function findCourse(courses: CourseItem[], id: string) {
  return courses.find(course => course.id === normalizeCourseId(id));
}
