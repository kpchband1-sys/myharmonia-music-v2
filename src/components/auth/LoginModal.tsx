import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LogoBadge } from '../common/LogoBadge';
import {
  X,
  User,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignUp: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onOpenSignUp }) => {
  const { studentLogin, teacherLogin } = useApp();
  const [activeTab, setActiveTab] = useState<'student' | 'staff'>('student');

  // Student form state
  const [studentId, setStudentId] = useState('');
  const [studentError, setStudentError] = useState('');
  const [studentSuccess, setStudentSuccess] = useState('');

  // Teacher / Admin form state (Never remembered, reset on open/close/tab change)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [staffError, setStaffError] = useState('');
  const [staffSuccess, setStaffSuccess] = useState('');

  // Always reset fields and clear sensitive data when modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setStudentId('');
      setStudentError('');
      setStudentSuccess('');
      setUsername('');
      setPassword('');
      setShowStaffPassword(false);
      setStaffError('');
      setStaffSuccess('');
    }
  }, [isOpen]);

  const handleTabSwitch = (tab: 'student' | 'staff') => {
    setActiveTab(tab);
    // Clear any credentials and errors when switching
    setUsername('');
    setPassword('');
    setShowStaffPassword(false);
    setStaffError('');
    setStudentError('');
  };

  if (!isOpen) return null;

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError('');
    setStudentSuccess('');

    if (!studentId.trim()) {
      setStudentError('กรุณากรอกรหัสนักเรียน');
      return;
    }

    const res = studentLogin(studentId);
    if (res.success) {
      setStudentSuccess(res.message);
      setTimeout(() => {
        onClose();
        setStudentId('');
        setStudentSuccess('');
      }, 700);
    } else {
      setStudentError(res.message);
    }
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError('');
    setStaffSuccess('');

    if (!username.trim() || !password) {
      setStaffError('กรุณากรอกชื่อผู้ใช้ (Name) และรหัสผ่าน (Password)');
      return;
    }

    const res = teacherLogin(username, password);
    if (res.success) {
      setStaffSuccess(res.message);
      setTimeout(() => {
        onClose();
        setUsername('');
        setPassword('');
        setShowStaffPassword(false);
        setStaffSuccess('');
      }, 700);
    } else {
      setStaffError(res.message);
    }
  };

  const quickFillStudent = (id: string) => {
    setStudentId(id);
    setStudentError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Glow behind modal */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <LogoBadge size="md" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            เข้าสู่ระบบ KPCH Band
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ชุมนุมดนตรีสากล & วงโยธวาทิต โรงเรียนกาญจนาภิเษกวิทยาลัย ชัยภูมิ
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 mb-6 rounded-2xl bg-slate-950/80 border border-slate-800">
          <button
            type="button"
            onClick={() => handleTabSwitch('student')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === 'student'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            นักเรียน (ใส่รหัส)
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('staff')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            คุณครู & Admin
          </button>
        </div>

        {/* Student Login Form */}
        {activeTab === 'student' && (
          <form onSubmit={handleStudentLogin} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                รหัสนักเรียน (Student ID)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="เช่น 54101"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-950/70 border border-slate-700/80 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-center font-mono text-lg tracking-widest transition-all"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1 justify-center">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                เข้าใช้งานสะดวก เพียงกรอกรหัสนักเรียน 5 หลัก
              </p>
            </div>

            {/* Quick test student pills */}
            <div className="pt-1">
              <span className="text-[11px] text-slate-400 block mb-1.5">
                ⚡ รหัสนักเรียนตัวอย่างสำหรับการทดสอบ:
              </span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {[
                  { id: '54101', name: 'กฤษฎา (วงโยฯ)' },
                  { id: '54103', name: 'ขจรศักดิ์ (ดนตรีสากล)' },
                  { id: '54104', name: 'จิรายุส (วงโยฯ)' },
                  { id: '54105', name: 'ชญาดา (ดนตรีสากล)' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => quickFillStudent(s.id)}
                    className="text-[11px] px-2.5 py-1 bg-slate-800/80 hover:bg-blue-600/30 text-slate-300 hover:text-blue-300 rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
                  >
                    {s.id} ({s.name})
                  </button>
                ))}
              </div>
            </div>

            {studentError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{studentError}</span>
              </div>
            )}

            {studentSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{studentSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 hover:from-blue-500 to-indigo-600 hover:to-indigo-500 text-white font-medium rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>เข้าสู่ระบบนักเรียน</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center">
              <span className="text-xs text-slate-400">ยังไม่ได้เป็นสมาชิกชุมนุม? </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSignUp();
                }}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 ml-1 cursor-pointer"
              >
                สมัครสมาชิกที่นี่
              </button>
            </div>
          </form>
        )}

        {/* Teacher / Admin Login Form - Protected & No Password Memorization */}
        {activeTab === 'staff' && (
          <form
            onSubmit={handleStaffLogin}
            className="space-y-4"
            autoComplete="off"
            noValidate
          >
            {/* Security Notice: No Remembering of Passwords */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200/90 leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 block mb-0.5">
                  ความปลอดภัยสูง (ไม่มีการจดจำรหัสผ่าน):
                </span>
                ระบบจะไม่มีการบันทึกหรือจดจำรหัสผ่านของแอดมินและคุณครู เพื่อป้องกันไม่ให้นักเรียนเข้าถึงระบบจัดการ กรุณากรอกรหัสผ่านทุกครั้งที่เข้าใช้งาน
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ชื่อผู้ใช้ (Name / Username)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="staff_username_no_remember"
                  id="staff_username_no_remember"
                  placeholder="กรอกชื่อผู้ใช้ เช่น admin หรือ ชื่อครูที่แอดมินกำหนด"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  spellCheck="false"
                  className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700/80 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <input
                  type={showStaffPassword ? 'text' : 'password'}
                  name="staff_password_no_remember"
                  id="staff_password_no_remember"
                  placeholder="กรอกรหัสผ่านของคุณครู / แอดมิน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  spellCheck="false"
                  className="w-full pl-4 pr-11 py-3 bg-slate-950/70 border border-slate-700/80 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowStaffPassword(!showStaffPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title={showStaffPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showStaffPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>แอดมินเป็นผู้กำหนดชื่อและรหัสผ่านให้แก่คุณครูแต่ละท่าน</span>
              </p>
            </div>

            {staffError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{staffError}</span>
              </div>
            )}

            {staffSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{staffSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 hover:from-blue-500 to-indigo-600 hover:to-indigo-500 text-white font-medium rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>เข้าสู่ระบบครู / Admin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
