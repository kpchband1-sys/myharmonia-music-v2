import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord, AttendanceStatus, ClubType, Student } from '../../types';
import {
  CheckCircle2,
  Clock,
  UserX,
  AlertTriangle,
  Calendar,
  Search,
  CheckCheck,
  Sparkles,
  Lock,
  Eye,
  ShieldCheck,
  UserCheck,
  Info,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const AttendanceSystem: React.FC = () => {
  const {
    students,
    attendance,
    recordAttendanceByStudentId,
    bulkRecordAttendance,
    userRole,
    currentUser,
    setActiveTab,
  } = useApp();

  const isTeacherOrAdmin = userRole === 'teacher' || userRole === 'admin';
  const isStudent = userRole === 'student';
  const loggedStudent = currentUser && 'studentId' in currentUser ? (currentUser as Student) : null;

  const [inputStudentId, setInputStudentId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [session, setSession] = useState<AttendanceRecord['session']>('evening');
  const [quickStatus, setQuickStatus] = useState<AttendanceStatus>('present');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [clubFilter, setClubFilter] = useState<'all' | ClubType>('all');
  const [lastCheckedStudent, setLastCheckedStudent] = useState<Student | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Filter students based on club and search query
  const clubStudents = useMemo(() => {
    let list = students.filter((s) => s.status === 'active');
    if (clubFilter !== 'all') {
      list = list.filter((s) => s.clubType === clubFilter);
    }
    return list;
  }, [students, clubFilter]);

  const displayedStudents = useMemo(() => {
    if (!searchQuery.trim()) return clubStudents;
    const q = searchQuery.toLowerCase().trim();
    return clubStudents.filter(
      (s) =>
        s.studentId.toLowerCase().includes(q) ||
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.nickName.toLowerCase().includes(q) ||
        s.position.toLowerCase().includes(q) ||
        `${s.grade}/${s.room}`.includes(q)
    );
  }, [clubStudents, searchQuery]);

  // Today's records for current date and session
  const currentAttendanceMap = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    attendance.forEach((record) => {
      if (record.date === selectedDate && record.session === session) {
        map.set(record.studentId, record);
      }
    });
    return map;
  }, [attendance, selectedDate, session]);

  // Summary statistics
  const summaryStats = useMemo(() => {
    let present = 0;
    let late = 0;
    let leave = 0;
    let absent = 0;

    clubStudents.forEach((st) => {
      const rec = currentAttendanceMap.get(st.studentId);
      if (!rec) {
        // Not checked yet
      } else if (rec.status === 'present') {
        present++;
      } else if (rec.status === 'late') {
        late++;
      } else if (rec.status === 'leave') {
        leave++;
      } else if (rec.status === 'absent') {
        absent++;
      }
    });

    const totalChecked = present + late + leave + absent;
    const rate = clubStudents.length > 0 ? Math.round(((present + late) / clubStudents.length) * 100) : 0;

    return { present, late, leave, absent, totalChecked, rate };
  }, [clubStudents, currentAttendanceMap]);

  // Handle Quick ID Submission (Enter key or button) - Only for teachers/admins
  const handleQuickCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTeacherOrAdmin) {
      setFeedbackMessage({
        type: 'error',
        text: 'นักเรียนสามารถดูข้อมูลได้อย่างเดียว ไม่สามารถบันทึกการเช็คชื่อได้',
      });
      return;
    }
    if (!inputStudentId.trim()) return;

    const res = recordAttendanceByStudentId(inputStudentId, session, quickStatus);
    if (res.success) {
      setLastCheckedStudent(res.student || null);
      setFeedbackMessage({ type: 'success', text: res.message });
      setInputStudentId('');
      if (inputRef.current) inputRef.current.focus();
    } else {
      setFeedbackMessage({ type: 'error', text: res.message });
    }
  };

  // Quick toggle status for student row in table - Only for teachers/admins
  const handleToggleStatus = (studentId: string, status: AttendanceStatus) => {
    if (!isTeacherOrAdmin) return;
    recordAttendanceByStudentId(studentId, session, status);
  };

  // Mark all active students in current filtered list as Present - Only for teachers/admins
  const handleMarkAllPresent = () => {
    if (!isTeacherOrAdmin) return;
    const records = clubStudents.map((s) => ({
      studentId: s.studentId,
      status: 'present' as AttendanceStatus,
    }));
    bulkRecordAttendance(records, session, selectedDate);
    setFeedbackMessage({
      type: 'success',
      text: `เช็คชื่อนักเรียนทั้งหมด ${clubStudents.length} คน เป็น "มาซ้อม" เรียบร้อยแล้ว`,
    });
  };

  // Helper for logged in student's current status
  const loggedStudentCurrentRecord = loggedStudent
    ? currentAttendanceMap.get(loggedStudent.studentId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {isTeacherOrAdmin ? 'ระบบเช็คชื่อเข้าฝึกซ้อม / กิจกรรม' : 'ตรวจสอบข้อมูลการเข้าฝึกซ้อม / กิจกรรม'}
            </h1>
            {isTeacherOrAdmin ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                สิทธิ์คุณครู: บันทึกข้อมูลได้
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-cyan-300 border border-blue-500/30 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>โหมดนักเรียน: ดูข้อมูลได้อย่างเดียว</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isTeacherOrAdmin
              ? 'คุณครูสามารถกรอกรหัสนักเรียน (5 หลัก) เพื่อเช็คชื่อได้ทันที หรือคลิกเปลี่ยนสถานะในตาราง'
              : 'นักเรียนสามารถตรวจสอบสถานะ สถิติ วันเวลาการเข้าซ้อมของตนเองและเพื่อนร่วมวงได้ (สงวนสิทธิ์การเช็คชื่อเฉพาะคุณครู)'}
          </p>
        </div>

        {/* Date & Session Pickers */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-slate-100 focus:outline-none cursor-pointer"
            />
          </div>

          <select
            value={session}
            onChange={(e) => setSession(e.target.value as any)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="evening">🌅 ซ้อมเย็น (16:30 - 18:30 น.)</option>
            <option value="morning">☀️ ซ้อมเช้า (07:00 - 08:00 น.)</option>
            <option value="club_period">🏫 คาบกิจกรรมชุมนุม</option>
            <option value="special_camp">⛺ เข้าค่ายดนตรีพิเศษ</option>
          </select>
        </div>
      </div>

      {/* TOP SECTION: TEACHER/ADMIN CHECK-IN FORM VS STUDENT READ-ONLY INSPECTOR */}
      {isTeacherOrAdmin ? (
        /* TEACHER/ADMIN QUICK ID CHECK-IN SECTION */
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-900 rounded-3xl border border-blue-500/30 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-center">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> ครูเช็คชื่อด่วนด้วยรหัสนักเรียน
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                กรอกรหัสนักเรียน (Student ID) แล้วกด Enter
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                รองรับทั้งการพิมพ์จากแป้นพิมพ์ และเครื่องยิงบาร์โค้ด
              </p>
            </div>

            {/* Quick status selector */}
            <div className="flex justify-center gap-2">
              {[
                { id: 'present', label: 'มาซ้อม', color: 'from-emerald-600 to-green-600' },
                { id: 'late', label: 'มาสาย', color: 'from-amber-600 to-yellow-600' },
                { id: 'leave', label: 'ลา', color: 'from-blue-600 to-cyan-600' },
                { id: 'absent', label: 'ขาดซ้อม', color: 'from-rose-600 to-red-600' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setQuickStatus(s.id as AttendanceStatus)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    quickStatus === s.id
                      ? `bg-gradient-to-r ${s.color} text-white shadow-lg shadow-black/40 scale-105`
                      : 'bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* ID Input Form */}
            <form onSubmit={handleQuickCheck} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={7}
                  placeholder="พิมพ์รหัสนักเรียน 5 หลัก เช่น 54101..."
                  value={inputStudentId}
                  onChange={(e) => setInputStudentId(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-950 border-2 border-blue-500/60 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/20 text-center font-mono text-xl sm:text-2xl font-bold tracking-widest transition-all shadow-inner"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <CheckCheck className="w-5 h-5" />
                <span className="hidden sm:inline">บันทึก</span>
              </button>
            </form>

            {/* Feedback message banner */}
            {feedbackMessage && (
              <div
                className={`p-3 rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2 duration-200 ${
                  feedbackMessage.type === 'success'
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {feedbackMessage.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                  <span>{feedbackMessage.text}</span>
                </div>
                <button
                  onClick={() => setFeedbackMessage(null)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Last checked student mini card */}
            {lastCheckedStudent && (
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                    {lastCheckedStudent.nickName.substring(0, 1)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      {lastCheckedStudent.firstName} {lastCheckedStudent.lastName} ({lastCheckedStudent.nickName})
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {lastCheckedStudent.grade}/{lastCheckedStudent.room} • {lastCheckedStudent.clubType} • {lastCheckedStudent.position}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ✓ บันทึกสำเร็จ
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* STUDENT READ-ONLY INSPECTOR CARD */
        <div className="p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-blue-950/20 to-slate-900 rounded-3xl border border-blue-500/30 shadow-xl space-y-5">
          {/* Read-only Security Notice */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    โหมดดูข้อมูลเท่านั้น (Student Read-Only Mode)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                    ดูได้อย่างเดียว
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  นักเรียนไม่สามารถเช็คชื่อหรือแก้ไขสถานะได้ด้วยตนเอง สิทธิ์การเช็คชื่อสงวนไว้สำหรับคุณครูผู้ควบคุมวงเท่านั้น เพื่อความถูกต้องและเป็นทางการ
                </p>
              </div>
            </div>

            {isStudent && (
              <button
                onClick={() => setActiveTab('my-portal')}
                className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <span>ดูประวัติส่วนตัวในพอร์ทัล</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* If Logged in Student: Highlight My Status Today */}
          {loggedStudent && (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
                  {loggedStudent.nickName.substring(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">สถานะของคุณ:</span>
                    <span className="text-sm font-bold text-white">
                      {loggedStudent.firstName} {loggedStudent.lastName} (น้อง{loggedStudent.nickName})
                    </span>
                    <span className="font-mono text-xs text-blue-400 font-semibold">
                      #{loggedStudent.studentId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {loggedStudent.clubType} • {loggedStudent.position} • ม.{loggedStudent.grade}/{loggedStudent.room}
                  </p>
                </div>
              </div>

              {/* Status Pill for Selected Date & Session */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">
                    รอบวันที่ {selectedDate} ({session === 'evening' ? 'ซ้อมเย็น' : session === 'morning' ? 'ซ้อมเช้า' : 'คาบชุมนุม'})
                  </span>
                  {loggedStudentCurrentRecord ? (
                    <div>
                      {loggedStudentCurrentRecord.status === 'present' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>มาซ้อม</span>
                        </span>
                      ) : loggedStudentCurrentRecord.status === 'late' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 inline-flex items-center gap-1 mt-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>มาสาย</span>
                        </span>
                      ) : loggedStudentCurrentRecord.status === 'leave' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 inline-flex items-center gap-1 mt-1">
                          <Info className="w-3.5 h-3.5" />
                          <span>ลา</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 inline-flex items-center gap-1 mt-1">
                          <UserX className="w-3.5 h-3.5" />
                          <span>ขาดซ้อม</span>
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        ผู้บันทึก: {loggedStudentCurrentRecord.checkedBy} ({loggedStudentCurrentRecord.timestamp})
                      </span>
                    </div>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700 inline-block mt-1">
                      ⏳ ยังไม่มีการบันทึกสถานะในรอบนี้
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Search Student in Roster */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อ, นามสกุล, ชื่อเล่น, รหัสนักเรียน หรือเครื่องดนตรี เพื่อดูสถานะการเข้าซ้อม..."
              className="w-full pl-11 pr-4 py-3 bg-slate-950/90 border border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ล้างคำค้น
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400">มาซ้อมวันนี้</span>
          <p className="text-2xl font-bold text-emerald-400">{summaryStats.present}</p>
        </div>
        <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400">มาสาย</span>
          <p className="text-2xl font-bold text-amber-400">{summaryStats.late}</p>
        </div>
        <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400">ลา (มีใบลา)</span>
          <p className="text-2xl font-bold text-sky-400">{summaryStats.leave}</p>
        </div>
        <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400">ขาดซ้อม</span>
          <p className="text-2xl font-bold text-rose-400">{summaryStats.absent}</p>
        </div>
        <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400">อัตราเข้าซ้อม</span>
          <p className="text-2xl font-bold text-blue-400">{summaryStats.rate}%</p>
        </div>
      </div>

      {/* Batch Roster Table Section */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800/90 overflow-hidden shadow-xl space-y-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>
                ตารางสถานะสมาชิก: {session === 'evening' ? 'ซ้อมเย็น' : session === 'morning' ? 'ซ้อมเช้า' : 'คาบชุมนุม'} ({selectedDate})
              </span>
              {!isTeacherOrAdmin && (
                <span className="text-xs font-normal text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  โหมดดูข้อมูล
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              {isTeacherOrAdmin
                ? 'สามารถกดปุ่มเปลี่ยนสถานะ มา/สาย/ลา/ขาด รายคนได้อย่างสะดวก'
                : 'แสดงรายชื่อสมาชิกและสถานะการเช็คชื่อประจำรอบ'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Club filter */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
              {(['all', 'วงโยธวาทิต', 'ดนตรีสากล'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setClubFilter(c)}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    clubFilter === c ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c === 'all' ? 'ทั้งหมด' : c}
                </button>
              ))}
            </div>

            {/* Mark all present button - ONLY FOR TEACHERS/ADMINS */}
            {isTeacherOrAdmin && (
              <button
                onClick={handleMarkAllPresent}
                className="px-3.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-semibold rounded-xl border border-emerald-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>เช็คมาทุกคน</span>
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 text-center w-12">#</th>
                <th className="py-3 px-3">รหัสนักเรียน</th>
                <th className="py-3 px-3">ชื่อ - นามสกุล (ชื่อเล่น)</th>
                <th className="py-3 px-3 text-center">ชั้น</th>
                <th className="py-3 px-3">ตำแหน่ง / เครื่องดนตรี</th>
                <th className="py-3 px-3 text-center">สถานะปัจจุบัน</th>
                {isTeacherOrAdmin ? (
                  <th className="py-3 px-3 text-center">กดเปลี่ยนสถานะ (ครู)</th>
                ) : (
                  <th className="py-3 px-3 text-center">เวลาที่บันทึก & ผู้ตรวจ</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {displayedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    ไม่พบข้อมูลนักเรียนที่ตรงกับคำค้นหา
                  </td>
                </tr>
              ) : (
                displayedStudents.map((st, idx) => {
                  const record = currentAttendanceMap.get(st.studentId);
                  const currentStatus = record ? record.status : null;
                  const isCurrentLoggedUser = loggedStudent?.studentId === st.studentId;

                  return (
                    <tr
                      key={st.id}
                      className={`transition-colors ${
                        isCurrentLoggedUser
                          ? 'bg-blue-950/30 hover:bg-blue-950/50'
                          : 'hover:bg-slate-800/30'
                      }`}
                    >
                      <td className="py-3 px-3 text-center text-slate-500 font-mono text-xs">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-blue-400">
                        {st.studentId}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-100">
                            {st.firstName} {st.lastName}
                          </span>
                          <span className="text-slate-400 text-xs">({st.nickName})</span>
                          {isCurrentLoggedUser && (
                            <span className="px-1.5 py-0.2 rounded-md bg-blue-500/20 text-cyan-300 text-[10px] font-bold border border-blue-500/30">
                              คุณ
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-medium text-slate-300">
                        {st.grade}/{st.room}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {st.position}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {!currentStatus ? (
                          <span className="text-[11px] text-slate-500 font-medium">ยังไม่เช็ค</span>
                        ) : currentStatus === 'present' ? (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            ✓ มาซ้อม
                          </span>
                        ) : currentStatus === 'late' ? (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            🕒 มาสาย
                          </span>
                        ) : currentStatus === 'leave' ? (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                            📝 ลา
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            ✕ ขาด
                          </span>
                        )}
                      </td>

                      {/* Right column: Interactive for teachers, Informational for students */}
                      {isTeacherOrAdmin ? (
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleToggleStatus(st.studentId, 'present')}
                              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                currentStatus === 'present'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/20'
                              }`}
                              title="มาซ้อม"
                            >
                              มา
                            </button>
                            <button
                              onClick={() => handleToggleStatus(st.studentId, 'late')}
                              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                currentStatus === 'late'
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-amber-500/20'
                              }`}
                              title="มาสาย"
                            >
                              สาย
                            </button>
                            <button
                              onClick={() => handleToggleStatus(st.studentId, 'leave')}
                              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                currentStatus === 'leave'
                                  ? 'bg-sky-600 text-white'
                                  : 'bg-slate-800 text-slate-400 hover:text-sky-400 hover:bg-sky-500/20'
                              }`}
                              title="ขอลา"
                            >
                              ลา
                            </button>
                            <button
                              onClick={() => handleToggleStatus(st.studentId, 'absent')}
                              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                currentStatus === 'absent'
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20'
                              }`}
                              title="ขาดซ้อม"
                            >
                              ขาด
                            </button>
                          </div>
                        </td>
                      ) : (
                        <td className="py-3 px-3 text-center text-slate-400 text-xs">
                          {record ? (
                            <div>
                              <span className="font-mono text-slate-300">
                                {record.timestamp.split(' ')[1] || record.timestamp}
                              </span>
                              <span className="text-[10px] text-slate-500 block truncate max-w-[130px] mx-auto">
                                โดย: {record.checkedBy}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
