import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, RequestType, LeaveCategory } from '../../types';
import { LogoBadge } from '../common/LogoBadge';
import { DigitalIdCard } from './DigitalIdCard';
import {
  User,
  Music,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  Send,
  PlusCircle,
  LogOut,
  Sparkles,
  QrCode,
  ShieldCheck,
  CreditCard,
  Download,
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const { currentUser, userRole, requests, submitRequest, attendance, logout } = useApp();

  const student = currentUser && 'studentId' in currentUser ? (currentUser as Student) : null;

  const [activeTab, setActiveTab] = useState<'overview' | 'id-card' | 'new-request' | 'my-requests'>('overview');

  // Form states for new request
  const [requestType, setRequestType] = useState<RequestType>('leave');
  const [leaveCategory, setLeaveCategory] = useState<LeaveCategory>('sick');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [formFeedback, setFormFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!student) {
    return (
      <div className="py-16 text-center text-slate-400">
        <User className="w-12 h-12 mx-auto mb-3 opacity-40 text-blue-400" />
        <p className="text-base font-medium">กรุณาเข้าสู่ระบบด้วยรหัสนักเรียนเพื่อเข้าถึงหน้านักเรียน</p>
      </div>
    );
  }

  // Student's personal requests
  const myRequests = requests.filter((r) => r.studentId === student.studentId);

  // Student's personal attendance
  const myAttendance = attendance.filter((a) => a.studentId === student.studentId);
  const presentCount = myAttendance.filter((a) => a.status === 'present').length;
  const lateCount = myAttendance.filter((a) => a.status === 'late').length;
  const leaveCount = myAttendance.filter((a) => a.status === 'leave').length;
  const absentCount = myAttendance.filter((a) => a.status === 'absent').length;
  const totalAtt = myAttendance.length;
  const attRate = totalAtt > 0 ? Math.round(((presentCount + lateCount) / totalAtt) * 100) : 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setFormFeedback({ success: false, message: 'กรุณาระบุเหตุผลการขอลาหรือขอลาออก' });
      return;
    }

    const res = submitRequest({
      studentId: student.studentId,
      studentName: `${student.firstName} ${student.lastName} (${student.nickName})`,
      grade: `${student.grade}/${student.room}`,
      clubType: student.clubType,
      type: requestType,
      leaveCategory: requestType === 'leave' ? leaveCategory : undefined,
      startDate,
      endDate: requestType === 'leave' ? endDate : undefined,
      reason: reason.trim(),
    });

    setFormFeedback(res);
    if (res.success) {
      setReason('');
      setActiveTab('my-requests');
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Profile Card (KPCH Member Badge) */}
      <div className="relative p-6 sm:p-8 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 rounded-3xl border border-blue-500/40 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-1 shadow-xl shadow-blue-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-3xl font-black text-white">
                  {student.nickName.substring(0, 1)}
                </div>
              </div>
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white shadow-md">
                มัธยม
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {student.firstName} {student.lastName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                  ชื่อเล่น: {student.nickName}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300">
                ชั้นมัธยมศึกษาปีที่ {student.grade} ห้อง {student.room} • ชุมนุม
                <strong className="text-blue-400 font-bold ml-1">{student.clubType}</strong>
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-medium text-slate-200">
                  <Music className="w-3.5 h-3.5 text-indigo-400" />
                  ตำแหน่ง: {student.position}
                </span>
                <span className="font-mono text-cyan-400 font-bold">
                  รหัสนักเรียน: {student.studentId}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Member Badge & Logout */}
          <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('id-card')}
              className="px-4 py-2.5 bg-slate-950/80 hover:bg-slate-900 border border-blue-500/40 hover:border-amber-400/60 rounded-2xl text-center transition-all cursor-pointer group shadow-lg shadow-blue-900/20"
            >
              <div className="flex items-center justify-center gap-1.5 text-blue-400 group-hover:text-amber-300">
                <CreditCard className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-widest font-mono font-bold">KPCH Digital ID Card</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-white block mt-0.5 group-hover:text-amber-200 transition-colors">
                สร้าง / บันทึกบัตรสมาชิกดิจิทัล
              </span>
              <span className="text-[10px] text-emerald-400 block mt-0.5 font-medium">✓ สถานะ: ใช้งานปกติ (คลิกเปิดบัตร)</span>
            </button>

            <button
              onClick={logout}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700/60 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap p-1 bg-slate-900/80 rounded-2xl border border-slate-800/90 text-xs sm:text-sm font-medium gap-1 sm:gap-0">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 min-w-[130px] py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          สถิติการเข้าซ้อม
        </button>
        <button
          onClick={() => setActiveTab('id-card')}
          className={`flex-1 min-w-[160px] py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'id-card'
              ? 'bg-gradient-to-r from-amber-500 to-blue-600 text-white font-bold shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-amber-300'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-400" />
          <span>บัตรประจำตัวดิจิทัล (Digital ID)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/30">
            ใหม่
          </span>
        </button>
        <button
          onClick={() => setActiveTab('new-request')}
          className={`flex-1 min-w-[140px] py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'new-request'
              ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-cyan-300" />
          <span>ยื่นคำขอลา / ขอลาออก</span>
        </button>
        <button
          onClick={() => setActiveTab('my-requests')}
          className={`flex-1 min-w-[140px] py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'my-requests'
              ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-300" />
          <span>ติดตามสถานะคำขอ ({myRequests.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ATTENDANCE */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Digital ID Card Teaser Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                  <span>บัตรประจำตัวสมาชิกดิจิทัล (Digital ID Card Generator)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    PNG Save
                  </span>
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  สร้างบัตรประจำตัวสมาชิกชุมนุม {student.clubType} พร้อมชื่อ ระดับชั้น เครื่องดนตรี และบันทึกเป็นรูปภาพ PNG ได้ทันที
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('id-card')}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>เปิดระบบสร้างบัตรดิจิทัล</span>
            </button>
          </div>

          {/* Attendance KPI for student */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400">มาซ้อมทั้งหมด</span>
              <p className="text-2xl font-bold text-emerald-400">{presentCount} ครั้ง</p>
            </div>
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400">มาสาย</span>
              <p className="text-2xl font-bold text-amber-400">{lateCount} ครั้ง</p>
            </div>
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400">ขอลา (มีใบลา)</span>
              <p className="text-2xl font-bold text-sky-400">{leaveCount} ครั้ง</p>
            </div>
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400">ร้อยละการเข้าซ้อม</span>
              <p className="text-2xl font-bold text-blue-400">{attRate}%</p>
            </div>
          </div>

          {/* Attendance history logs */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>ประวัติการเช็คชื่อเข้าซ้อมของฉัน</span>
            </h3>

            {myAttendance.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">
                ยังไม่มีประวัติการเช็คชื่อ
              </p>
            ) : (
              <div className="divide-y divide-slate-800/80 text-xs">
                {myAttendance.map((rec) => (
                  <div key={rec.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-200">
                        วันที่ {rec.date} ({rec.session === 'evening' ? 'ซ้อมเย็น' : 'ซ้อมเช้า'})
                      </span>
                      <span className="text-slate-500 text-[11px] block mt-0.5">
                        ผู้ตรวจ: {rec.checkedBy} • บันทึกเมื่อ {rec.timestamp}
                      </span>
                    </div>
                    <div>
                      {rec.status === 'present' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          มาซ้อม
                        </span>
                      ) : rec.status === 'late' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          มาสาย
                        </span>
                      ) : rec.status === 'leave' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                          ลา
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          ขาดซ้อม
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: DIGITAL ID CARD GENERATOR */}
      {activeTab === 'id-card' && (
        <DigitalIdCard student={student} />
      )}

      {/* TAB 2: SUBMIT NEW REQUEST */}
      {activeTab === 'new-request' && (
        <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl max-w-xl mx-auto">
          <div className="text-center mb-5">
            <h2 className="text-lg font-bold text-white">แบบฟอร์มยื่นคำขอลา หรือ ขอลาออก</h2>
            <p className="text-xs text-slate-400 mt-1">
              คำขอจะถูกส่งไปยังคุณครูผู้ดูแลเพื่อพิจารณาอนุมัติ และจะมีแจ้งเตือนอัตโนมัติแจ้งผลกลับมา
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Request Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                ประเภทคำขอ <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRequestType('leave')}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    requestType === 'leave'
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-lg block mb-1">📝</span>
                  <span className="font-bold text-sm block">ขอลาการฝึกซ้อม</span>
                  <span className="text-[11px] opacity-80">ลาป่วย / ลากิจ / สอบ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRequestType('resignation')}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    requestType === 'resignation'
                      ? 'bg-rose-600/20 border-rose-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-lg block mb-1">🚪</span>
                  <span className="font-bold text-sm block">ขอลาออกจากชุมนุม</span>
                  <span className="text-[11px] opacity-80">สละสิทธิ์การเป็นสมาชิก</span>
                </button>
              </div>
            </div>

            {/* If Leave -> Category & Dates */}
            {requestType === 'leave' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    สาเหตุการลา <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={leaveCategory}
                    onChange={(e) => setLeaveCategory(e.target.value as LeaveCategory)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="sick">ลาป่วย (ไม่สบาย / ป่วยมีใบรับรองแพทย์)</option>
                    <option value="errand">ลากิจ (ติดธุระจำเป็นกับครอบครัว)</option>
                    <option value="academic">วิชาการ (ติวสอบ / แข่งขันวิชาการ / งานโรงเรียน)</option>
                    <option value="other">อื่นๆ</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      ตั้งแต่วันที่ <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      ถึงวันที่ <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Reason Text */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                รายละเอียดเหตุผล <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder={
                  requestType === 'leave'
                    ? 'โปรดระบุรายละเอียดอาการป่วย หรือธุระจำเป็น...'
                    : 'โปรดระบุเหตุผลในการขอลาออกจากชุมนุม...'
                }
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {formFeedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  formFeedback.success
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                }`}
              >
                {formFeedback.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{formFeedback.message}</span>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 text-white text-xs font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                requestType === 'leave'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/30'
                  : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-600/30'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>ส่งคำขอไปยังคุณครู</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: MY REQUESTS & STATUS */}
      {activeTab === 'my-requests' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">ประวัติและสถานะคำขอของฉัน</h3>
            <span className="text-xs text-slate-400">ระบบจะอัปเดตแจ้งเตือนเมื่อครูกดอนุมัติ</span>
          </div>

          {myRequests.length === 0 ? (
            <div className="py-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-500">
              <FileText className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-xs font-medium">คุณยังไม่มีรายการคำขอลาหรือขอลาออก</p>
            </div>
          ) : (
            myRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        req.type === 'leave'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {req.type === 'leave' ? 'ขอลา' : 'ขอลาออก'}
                    </span>
                    <span className="font-semibold text-slate-200">
                      ช่วงวันที่: {req.startDate} {req.endDate && req.endDate !== req.startDate ? `ถึง ${req.endDate}` : ''}
                    </span>
                  </div>

                  <div>
                    {req.status === 'pending' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> รอครูอนุมัติ
                      </span>
                    ) : req.status === 'approved' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> อนุมัติแล้ว
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> ไม่อนุมัติ
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80 text-slate-300">
                  <span className="text-slate-500 block text-[10px] mb-0.5">เหตุผล:</span>
                  <p>{req.reason}</p>
                </div>

                {req.reviewedBy && (
                  <div className="p-2.5 bg-slate-800/50 rounded-xl text-slate-300">
                    <span className="text-slate-400 font-semibold block text-[10px]">
                      พิจารณาโดย: {req.reviewedBy} ({req.reviewedAt})
                    </span>
                    <p className="mt-0.5 text-blue-300">
                      <strong>หมายเหตุจากครู:</strong> {req.reviewComment}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
