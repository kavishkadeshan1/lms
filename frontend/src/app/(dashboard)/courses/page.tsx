"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  MoreVertical, 
  Plus, 
  BookOpen, 
  Filter, 
  CheckCircle2, 
  X, 
  Lock, 
  Key, 
  Users, 
  Layers, 
  GraduationCap, 
  ChevronRight,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";

interface CourseItem {
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

export default function CoursesPage() {
  const { tenant, user } = useTenant();
  const isInstructor = user.role === "lecturer" || user.role === "admin";

  // Tab State: "enrolled" (My Enrolled Courses) vs "catalogue" (Full Faculty Catalogue)
  const [activeTab, setActiveTab] = useState<"enrolled" | "catalogue">("enrolled");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Notification Banner
  const [notice, setNotice] = useState<string | null>(null);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState<CourseItem | null>(null);
  const [enteredKey, setEnteredKey] = useState("");
  const [enrollKeyError, setEnrollKeyError] = useState(false);

  // Create Course Form State (SRS FR-034)
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDept, setNewDept] = useState<"DICT" | "DBST" | "DET" | "DIAT">("DICT");
  const [newLecturer, setNewLecturer] = useState(user.role === "lecturer" ? user.name : "Dr. Aruna Pathirana");
  const [newCategory, setNewCategory] = useState("Level 3 - Semester 1");
  const [newEnrollKey, setNewEnrollKey] = useState("FOT2026");

  const [courses, setCourses] = useState<CourseItem[]>([
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
  ]);

  // Filter logic
  const filteredCourses = courses.filter((c) => {
    // Tab condition
    if (activeTab === "enrolled" && !c.enrolled) return false;

    // Search condition
    const matchesSearch = 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.lecturer.toLowerCase().includes(search.toLowerCase()) ||
      c.departmentName.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    // Department condition
    if (deptFilter !== "all" && c.department !== deptFilter) return false;

    // Status condition
    if (statusFilter === "inprogress" && (c.progress <= 0 || c.progress >= 100)) return false;
    if (statusFilter === "past" && c.progress < 100) return false;
    if (statusFilter === "future" && c.progress > 0) return false;

    return true;
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newTitle.trim()) return;

    const gradients = [
      "from-purple-600 via-indigo-600 to-blue-700",
      "from-teal-600 via-emerald-600 to-green-700",
      "from-blue-600 via-sky-600 to-cyan-700",
      "from-orange-600 via-amber-600 to-yellow-700",
      "from-rose-600 via-red-600 to-pink-700"
    ];
    const pickedGradient = gradients[Math.floor(Math.random() * gradients.length)];

    const deptMap: Record<string, string> = {
      DICT: "Department of Information and Communication Technology",
      DBST: "Department of Biosystems Technology",
      DET: "Department of Engineering Technology",
      DIAT: "Department of Instrumentation & Automation"
    };

    const newId = newCode.toLowerCase().replace(/\s+/g, "-");

    const created: CourseItem = {
      id: newId,
      code: newCode.trim().toUpperCase(),
      title: newTitle.trim(),
      department: newDept,
      departmentName: deptMap[newDept] || "Faculty of Technology",
      category: newCategory,
      lecturer: newLecturer.trim(),
      gradient: pickedGradient,
      progress: 0,
      enrolled: true,
      selfEnrollable: !!newEnrollKey.trim(),
      enrollmentKey: newEnrollKey.trim() || undefined,
      studentsCount: 1
    };

    setCourses(prev => [created, ...prev]);
    setShowCreateModal(false);
    setNewCode("");
    setNewTitle("");
    setNotice(`Course ${created.code}: ${created.title} created successfully.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleOpenEnrollDialog = (course: CourseItem) => {
    setSelectedCourseForEnroll(course);
    setEnteredKey("");
    setEnrollKeyError(false);
    setShowEnrollModal(true);
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForEnroll) return;

    if (selectedCourseForEnroll.enrollmentKey && enteredKey.trim() !== selectedCourseForEnroll.enrollmentKey) {
      setEnrollKeyError(true);
      return;
    }

    setCourses(prev => prev.map(c => {
      if (c.id !== selectedCourseForEnroll.id) return c;
      return { ...c, enrolled: true, studentsCount: c.studentsCount + 1 };
    }));

    setShowEnrollModal(false);
    setNotice(`Enrolled successfully in ${selectedCourseForEnroll.code}: ${selectedCourseForEnroll.title}!`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-[#dee2e6] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#6c757d]">
            <span className="font-bold text-[#0f6cbf]">{tenant.shortName}</span>
            <span>•</span>
            <span>Academic Course Catalogue & Enrolment (SRS §6.4, §6.5, §6.6)</span>
          </div>
          <h1 className="text-2xl font-bold text-[#212529] mt-1">
            {activeTab === "enrolled" ? "My Enrolled Courses" : "Faculty Course Catalogue"}
          </h1>
          <p className="text-xs text-[#6c757d] mt-1">
            {activeTab === "enrolled" 
              ? `Academic modules enrolled for ${user.displayName} (${user.indexNo || user.role})`
              : "Discover and self-enrol in active semester courses across Faculty of Technology"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isInstructor && (
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-[#0f6cbf] hover:bg-[#0d5ca3] text-white text-xs font-semibold rounded-md shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus size={14} />
              <span>Create New Course</span>
            </button>
          )}
        </div>
      </div>

      {/* Notification Toast Alert */}
      {notice && (
        <div className="p-3 bg-green-50 border border-green-300 text-green-800 rounded-lg text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 size={15} className="text-green-600 flex-shrink-0" />
            <span>{notice}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setNotice(null)} 
            className="text-green-700 hover:text-green-900 cursor-pointer p-0.5"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Primary Tab Navigation (Enrolled vs Catalogue) */}
      <div className="flex border-b border-[#dee2e6] text-xs font-semibold">
        <button
          onClick={() => setActiveTab("enrolled")}
          className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "enrolled"
              ? "border-[#0f6cbf] text-[#0f6cbf]"
              : "border-transparent text-[#6c757d] hover:text-[#212529]"
          }`}
        >
          <BookOpen size={14} />
          <span>My Enrolled Courses ({courses.filter(c => c.enrolled).length})</span>
        </button>
        <button
          onClick={() => setActiveTab("catalogue")}
          className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "catalogue"
              ? "border-[#0f6cbf] text-[#0f6cbf]"
              : "border-transparent text-[#6c757d] hover:text-[#212529]"
          }`}
        >
          <Layers size={14} />
          <span>All Course Catalogue ({courses.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar (Matching Moodle 4 course management) */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white p-4 border border-[#dee2e6] rounded-xl shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Department Filter (SRS FR-026, FR-030) */}
          <div className="flex items-center gap-1.5 text-xs text-[#6c757d]">
            <Filter size={13} />
            <select 
              value={deptFilter} 
              onChange={(e) => setDeptFilter(e.target.value)}
              className="border border-[#ced4da] rounded-md px-2.5 py-1.5 bg-white font-medium text-[#495057] focus:outline-hidden focus:border-[#0f6cbf]"
            >
              <option value="all">All Departments</option>
              <option value="DICT">Dept of ICT (DICT)</option>
              <option value="DBST">Dept of Biosystems (DBST)</option>
              <option value="DET">Dept of Engineering (DET)</option>
              <option value="DIAT">Dept of Instrumentation (DIAT)</option>
            </select>
          </div>

          {/* Progress / Status Filter */}
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-[#ced4da] rounded-md px-3 py-1.5 bg-white font-medium text-[#495057] focus:outline-hidden focus:border-[#0f6cbf]"
          >
            <option value="all">All Statuses</option>
            <option value="inprogress">In progress</option>
            <option value="future">Not started</option>
            <option value="past">Completed</option>
          </select>
        </div>

        {/* Search Input (FR-031) */}
        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3 top-2.5 text-[#adb5bd]" />
          <input
            type="text"
            placeholder="Search code, title, coordinator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#ced4da] rounded-md bg-[#f8f9fa] focus:bg-white focus:outline-hidden focus:border-[#0f6cbf]"
          />
        </div>
      </div>

      {/* 3-Column Responsive Course Cards Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white border border-[#dee2e6] rounded-xl p-12 text-center space-y-3">
          <BookOpen size={36} className="mx-auto text-[#ced4da]" />
          <h3 className="text-base font-bold text-[#212529]">No courses match the selected filters</h3>
          <p className="text-xs text-[#6c757d]">Try switching departments or searching by course code.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div 
              key={course.id} 
              className="bg-white border border-[#dee2e6] rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Banner Gradient Card Header */}
                <div className={`h-28 bg-gradient-to-tr ${course.gradient} p-3.5 flex justify-between items-start text-white relative`}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono font-bold bg-black/30 px-2 py-0.5 rounded backdrop-blur-xs">
                      {course.department}
                    </span>
                    <span className="text-[11px] font-medium bg-black/25 px-2 py-0.5 rounded backdrop-blur-xs">
                      {course.category}
                    </span>
                  </div>

                  {course.enrolled ? (
                    <span className="text-[10px] bg-green-500/90 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      <CheckCircle2 size={11} /> Enrolled
                    </span>
                  ) : (
                    <span className="text-[10px] bg-white/20 text-white font-medium px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                      <Lock size={10} /> Open
                    </span>
                  )}
                </div>

                {/* Course Details Body */}
                <div className="p-5 space-y-2.5">
                  <span className="text-xs font-mono text-[#6c757d] block font-bold">
                    {course.code}
                  </span>
                  
                  {course.enrolled ? (
                    <Link href={`/courses/${course.id}`} className="block">
                      <h3 className="text-sm font-bold text-[#0f6cbf] hover:underline line-clamp-2 leading-snug">
                        {course.title}
                      </h3>
                    </Link>
                  ) : (
                    <h3 className="text-sm font-bold text-[#212529] line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                  )}

                  <div className="text-[11px] text-[#6c757d] leading-tight">
                    {course.departmentName}
                  </div>

                  <div className="text-[11px] text-[#495057] font-medium pt-1 flex items-center justify-between border-t border-[#f1f3f5]">
                    <span>Coordinator: <strong>{course.lecturer}</strong></span>
                    <span className="text-[#6c757d] font-mono text-[10px]">{course.studentsCount} students</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0 border-t border-[#f1f3f5] mt-2 space-y-2">
                {course.enrolled ? (
                  <>
                    <div className="flex justify-between items-center text-xs text-[#6c757d] font-medium pt-2">
                      <span>{course.progress}% complete</span>
                    </div>
                    <div className="w-full bg-[#e9ecef] rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-[#0f6cbf] h-1.5 rounded-full transition-all duration-500" 
                        style={{ width: `${course.progress}%` }} 
                      />
                    </div>
                    <div className="pt-2">
                      <Link href={`/courses/${course.id}`} className="block">
                        <button 
                          type="button"
                          className="w-full py-1.5 bg-[#f8f9fa] hover:bg-blue-50/50 border border-[#ced4da] hover:border-[#0f6cbf] text-[#0f6cbf] text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Open Course Page</span>
                          <ArrowRight size={13} />
                        </button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => handleOpenEnrollDialog(course)}
                      className="w-full py-2 bg-[#0f6cbf] hover:bg-[#0d5ca3] text-white text-xs font-semibold rounded-md shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Key size={13} />
                      <span>Enrol in Course</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE NEW COURSE (SRS FR-034)                    */}
      {/* ======================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#dee2e6] rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 text-xs text-[#212529] animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-[#e9ecef] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#212529] flex items-center gap-2">
                  <Plus size={16} className="text-[#0f6cbf]" />
                  <span>Create Academic Course (FR-034)</span>
                </h3>
                <p className="text-[11px] text-[#6c757d]">Define new course offering in {tenant.facultyName}</p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowCreateModal(false)}
                className="text-[#6c757d] hover:text-[#212529] p-1 rounded hover:bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#495057] block">
                    Course Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IC 3205"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs font-mono font-bold focus:outline-hidden focus:border-[#0f6cbf]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#495057] block">Academic Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value as any)}
                    className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs text-[#495057]"
                  >
                    <option value="DICT">Dept of ICT (DICT)</option>
                    <option value="DBST">Dept of Biosystems (DBST)</option>
                    <option value="DET">Dept of Engineering (DET)</option>
                    <option value="DIAT">Dept of Instrumentation (DIAT)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#495057] block">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Native DevOps & Site Reliability Engineering"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs font-medium focus:outline-hidden focus:border-[#0f6cbf]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#495057] block">Assigned Lecturer / Coordinator</label>
                  <input
                    type="text"
                    value={newLecturer}
                    onChange={(e) => setNewLecturer(e.target.value)}
                    className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs focus:outline-hidden focus:border-[#0f6cbf]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#495057] block">Academic Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs text-[#495057]"
                  >
                    <option value="Level 1 - Semester 1">Level 1 - Semester 1</option>
                    <option value="Level 1 - Semester 2">Level 1 - Semester 2</option>
                    <option value="Level 2 - Semester 1">Level 2 - Semester 1</option>
                    <option value="Level 2 - Semester 2">Level 2 - Semester 2</option>
                    <option value="Level 3 - Semester 1">Level 3 - Semester 1</option>
                    <option value="Level 3 - Semester 2">Level 3 - Semester 2</option>
                    <option value="Level 4 - Semester 1">Level 4 - Semester 1</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#495057] block">
                  Self-Enrolment Passcode (Key) (FR-046)
                </label>
                <input
                  type="text"
                  placeholder="Optional enrolment passcode (e.g. FOT2026)"
                  value={newEnrollKey}
                  onChange={(e) => setNewEnrollKey(e.target.value)}
                  className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs font-mono focus:outline-hidden focus:border-[#0f6cbf]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e9ecef]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 border border-[#ced4da] rounded text-xs text-[#495057] hover:bg-[#f8f9fa] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0f6cbf] hover:bg-[#0d5ca3] text-white font-semibold rounded text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Plus size={13} />
                  <span>Publish Course</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SELF-ENROLMENT IN COURSE (SRS FR-046)             */}
      {/* ======================================================== */}
      {showEnrollModal && selectedCourseForEnroll && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#dee2e6] rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs text-[#212529] animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-[#e9ecef] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#0f6cbf]">{selectedCourseForEnroll.code}</span>
                <h3 className="text-base font-bold text-[#212529] mt-0.5">Course Enrolment Options</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowEnrollModal(false)}
                className="text-[#6c757d] hover:text-[#212529] p-1 rounded hover:bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e9ecef] space-y-1">
              <div className="font-bold text-xs text-[#212529]">{selectedCourseForEnroll.title}</div>
              <div className="text-[11px] text-[#6c757d]">{selectedCourseForEnroll.departmentName}</div>
              <div className="text-[11px] text-[#495057]">Coordinator: {selectedCourseForEnroll.lecturer}</div>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-3 pt-1">
              {selectedCourseForEnroll.enrollmentKey ? (
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#495057] block">
                    Course Enrolment Key (Passcode) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter enrolment key..."
                    value={enteredKey}
                    onChange={(e) => { setEnteredKey(e.target.value); setEnrollKeyError(false); }}
                    className="w-full p-2 border border-[#ced4da] rounded bg-white text-xs font-mono focus:outline-hidden focus:border-[#0f6cbf]"
                  />
                  {enrollKeyError ? (
                    <span className="text-red-600 text-[11px] block font-medium">
                      Incorrect enrolment key. Please check with course coordinator.
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#6c757d] block font-mono">
                      (Demo hint: pass is <strong>{selectedCourseForEnroll.enrollmentKey}</strong>)
                    </span>
                  )}
                </div>
              ) : (
                <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 rounded text-xs">
                  This course allows open self-enrolment without a passcode.
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-[#e9ecef]">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-3 py-1.5 border border-[#ced4da] rounded text-xs text-[#495057] hover:bg-[#f8f9fa] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0f6cbf] hover:bg-[#0d5ca3] text-white font-semibold rounded text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Key size={13} />
                  <span>Confirm Enrolment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
