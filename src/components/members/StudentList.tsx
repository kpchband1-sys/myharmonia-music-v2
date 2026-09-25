import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, ClubType, GradeLevel } from '../../types';
import { OfficialReportModal } from '../print/OfficialReportModal';
import {
  Search,
  Filter,
  ArrowUpDown,
  Printer,
  Download,
  Music,
  UserCheck,
  UserX,
  Phone,
  GraduationCap,
  Sparkles,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';

interface StudentListProps {
  onOpenSignUp?: () => void;
}

export const StudentList: React.FC<StudentListProps> = ({ onOpenSignUp }) => {
  const { students, userRole } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClub, setSelectedClub] = useState<'all' | ClubType>('all');
  const [selectedGrade, setSelectedGrade] = useState<'all' | GradeLevel>('all');
  const [sortBy, setSortBy] = useState<'thai_alpha' | 'grade' | 'id'>('thai_alpha');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Sorting and Filtering logic
  const filteredStudents = useMemo(() => {
    let result = [...students];

    // Filter by Club
    if (selectedClub !== 'all') {
      result = result.filter((s) => s.clubType === selectedClub);
    }

    // Filter by Grade
    if (selectedGrade !== 'all') {
      result = result.filter((s) => s.grade === selectedGrade);
    }

    // Filter by Search Query
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.firstName.toLowerCase().includes(q) ||
          s.lastName.toLowerCase().includes(q) ||
          s.nickName.toLowerCase().includes(q) ||
          s.studentId.includes(q) ||
          s.position.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'thai_alpha') {
        // Thai alphabetical sorting ก-ฮ using Intl / localeCompare with Thai collation
        const nameA = a.firstName + ' ' + a.lastName;
        const nameB = b.firstName + b.lastName;
        return nameA.localeCompare(nameB, 'th');
      } else if (sortBy === 'grade') {
        // Order by grade: ม.1 to ม.6, then room
        const gradeRank: Record<GradeLevel, number> = {
          'ม.1': 1,
          'ม.2': 2,
          'ม.3': 3,
          'ม.4': 4,
          'ม.5': 5,
          'ม.6': 6,
        };
        const rankDiff = (gradeRank[a.grade] || 99) - (gradeRank[b.grade] || 99);
        if (rankDiff !== 0) return rankDiff;
        // Same grade -> sort by room
        const roomA = parseInt(a.room, 10) || 0;
        const roomB = parseInt(b.room, 10) || 0;
        if (roomA !== roomB) return roomA - roomB;
        return a.firstName.localeCompare(b.firstName, 'th');
      } else {
        // Sort by Student ID
        return a.studentId.localeCompare(b.studentId);
      }
    });

    return result;
  }, [students, selectedClub, selectedGrade, searchTerm, sortBy]);

  const stats = useMemo(() => {
    const total = students.length;
    const marching = students.filter((s) => s.clubType === 'วงโยธวาทิต').length;
    const western = students.filter((s) => s.clubType === 'ดนตรีสากล').length;
    return { total, marching, western };
  }, [students]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              ทำเนียบรายชื่อสมาชิกชุมนุม
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {stats.total} คน
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            เรียงตามลำดับอักษรไทย ก-ฮ และตามระดับชั้น สามารถส่งออกและพิมพ์เป็นไฟล์ PDF ทางการได้
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onOpenSignUp && (
            <button
              onClick={onOpenSignUp}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>สมัครเข้าชุมนุม</span>
            </button>
          )}

          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์ / PDF ทางการ</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div
          onClick={() => setSelectedClub('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedClub === 'all'
              ? 'bg-blue-950/40 border-blue-500/80 shadow-lg shadow-blue-500/10'
              : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400 font-medium">สมาชิกทั้งหมด</span>
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">👥</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{stats.total}</p>
          <span className="text-[11px] text-blue-400/80 mt-1 block">ม.1 - ม.6 ทั้งหมด</span>
        </div>

        <div
          onClick={() => setSelectedClub('วงโยธวาทิต')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedClub === 'วงโยธวาทิต'
              ? 'bg-blue-950/40 border-blue-500/80 shadow-lg shadow-blue-500/10'
              : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400 font-medium">วงโยธวาทิต</span>
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">🎺</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-sky-400">{stats.marching}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Marching & Brass</span>
        </div>

        <div
          onClick={() => setSelectedClub('ดนตรีสากล')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedClub === 'ดนตรีสากล'
              ? 'bg-indigo-950/40 border-indigo-500/80 shadow-lg shadow-indigo-500/10'
              : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400 font-medium">ดนตรีสากล</span>
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">🎸</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-indigo-400">{stats.western}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Combo & String</span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800/90 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, นามสกุล, ชื่อเล่น, รหัสนักเรียน หรือเครื่องดนตรี..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ล้าง
              </button>
            )}
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> เรียงตาม:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="thai_alpha">ก-ฮ (อักษรไทย)</option>
              <option value="grade">ระดับชั้น (ม.1 - ม.6)</option>
              <option value="id">รหัสนักเรียน</option>
            </select>
          </div>
        </div>

        {/* Category & Grade Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> ชุมนุม:
            </span>
            {(['all', 'วงโยธวาทิต', 'ดนตรีสากล'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setSelectedClub(c)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedClub === c
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {c === 'all' ? 'ทั้งหมด' : c}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs text-slate-400 mr-1">ชั้น:</span>
            {(['all', 'ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedGrade === g
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {g === 'all' ? 'ทุกชั้น' : g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">รหัสนักเรียน</th>
                <th className="py-3.5 px-4">ชื่อ - นามสกุล</th>
                <th className="py-3.5 px-4 text-center">ชื่อเล่น</th>
                <th className="py-3.5 px-4 text-center">ระดับชั้น</th>
                <th className="py-3.5 px-4">ชุมนุม</th>
                <th className="py-3.5 px-4">ตำแหน่ง / เครื่องดนตรี</th>
                <th className="py-3.5 px-4 text-center">เบอร์ติดต่อ</th>
                <th className="py-3.5 px-4 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <Music className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                    ไม่พบรายชื่อนักเรียนตามเงื่อนไขที่ค้นหา
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st, idx) => (
                  <tr
                    key={st.id}
                    onClick={() => setSelectedStudent(st)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-xs">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-400">
                      {st.studentId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                        <span>{st.firstName} {st.lastName}</span>
                        {st.status === 'resigned' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            ลาออกแล้ว
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                        {st.nickName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-medium text-slate-200">
                        {st.grade}/{st.room}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          st.clubType === 'วงโยธวาทิต'
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                            : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                        }`}
                      >
                        {st.clubType === 'วงโยธวาทิต' ? '🎺 วงโยฯ' : '🎸 ดนตรีสากล'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      {st.position}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-400">
                      {st.phone || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {st.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          ปกติ
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/15 text-rose-400 border border-rose-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                          ลาออก
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>
            แสดงผล {filteredStudents.length} จากทั้งหมด {students.length} คน (เรียงตาม:{' '}
            {sortBy === 'thai_alpha' ? 'ก-ฮ ภาษาไทย' : sortBy === 'grade' ? 'ระดับชั้น' : 'รหัสนักเรียน'})
          </span>
          <span className="text-[11px] text-slate-500">
            คลิกที่แถวนักเรียนเพื่อดูรายละเอียดแบบเจาะจง
          </span>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                  {selectedStudent.nickName.substring(0, 1)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {selectedStudent.firstName} {selectedStudent.lastName} ({selectedStudent.nickName})
                  </h3>
                  <p className="text-xs text-blue-400 font-mono">
                    รหัสนักเรียน: {selectedStudent.studentId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">ระดับชั้น:</span>
                <span className="font-semibold text-slate-200">{selectedStudent.grade} ห้อง {selectedStudent.room}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">ประเภทชุมนุม:</span>
                <span className="font-semibold text-blue-400">{selectedStudent.clubType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">ตำแหน่ง / เครื่องดนตรี:</span>
                <span className="font-semibold text-slate-200">{selectedStudent.position}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">เบอร์โทรศัพท์:</span>
                <span className="font-mono text-slate-200">{selectedStudent.phone || '-'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">เบอร์ผู้ปกครอง:</span>
                <span className="font-mono text-slate-200">{selectedStudent.parentPhone || '-'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">วันที่สมัครเข้าชุมนุม:</span>
                <span className="text-slate-200">{selectedStudent.joinedDate}</span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official PDF Print Preview Modal */}
      <OfficialReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        students={filteredStudents}
        filterClubType={selectedClub}
        sortBy={sortBy}
      />
    </div>
  );
};
