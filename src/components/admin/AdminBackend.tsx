import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TeacherUser, ClubType } from '../../types';
import {
  ShieldCheck,
  KeyRound,
  UserPlus,
  Settings,
  Database,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  School,
  Lock,
  User,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AdminBackend: React.FC = () => {
  const {
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    settings,
    updateSettings,
    resetToInitialData,
    students,
    requests,
    attendance,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'teachers' | 'settings' | 'data'>('teachers');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Teacher Form State
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'admin' | 'teacher'>('teacher');
  const [assignedClub, setAssignedClub] = useState<ClubType | 'all'>('วงโยธวาทิต');
  const [teacherPhone, setTeacherPhone] = useState('');
  const [teacherFeedback, setTeacherFeedback] = useState<string | null>(null);

  // Settings State
  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [academicYear, setAcademicYear] = useState(settings.academicYear);
  const [schoolDirectorName, setSchoolDirectorName] = useState(settings.schoolDirectorName);
  const [bandDirectorName, setBandDirectorName] = useState(settings.bandDirectorName);
  const [headOfMusicDepartment, setHeadOfMusicDepartment] = useState(settings.headOfMusicDepartment);
  const [registrationOpen, setRegistrationOpen] = useState(settings.registrationOpen);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleOpenCreateTeacher = () => {
    setEditingTeacherId(null);
    setUsername('');
    setPassword('');
    setFullName('');
    setRole('teacher');
    setAssignedClub('วงโยธวาทิต');
    setTeacherPhone('');
    setTeacherFeedback(null);
    setIsTeacherModalOpen(true);
  };

  const handleOpenEditTeacher = (t: TeacherUser) => {
    setEditingTeacherId(t.id);
    setUsername(t.username);
    setPassword(t.password);
    setFullName(t.fullName);
    setRole(t.role);
    setAssignedClub(t.assignedClub || 'วงโยธวาทิต');
    setTeacherPhone(t.phone || '');
    setTeacherFeedback(null);
    setIsTeacherModalOpen(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password || !fullName.trim()) {
      setTeacherFeedback('กรุณากรอก Username, Password และชื่อเต็มให้ครบถ้วน');
      return;
    }

    if (editingTeacherId) {
      updateTeacher(editingTeacherId, {
        username: username.trim(),
        password,
        fullName: fullName.trim(),
        role,
        assignedClub,
        phone: teacherPhone.trim(),
      });
    } else {
      addTeacher({
        username: username.trim(),
        password,
        fullName: fullName.trim(),
        role,
        assignedClub,
        phone: teacherPhone.trim(),
      });
    }

    setIsTeacherModalOpen(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      schoolName,
      academicYear,
      schoolDirectorName,
      bandDirectorName,
      headOfMusicDepartment,
      registrationOpen,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              ระบบหลังบ้านและการจัดการผู้ดูแล (Admin Console)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              สิทธิ์ผู้ดูแลระบบ
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            แอดมินสามารถกำหนด Name และ Password ให้คุณครู, ตั้งค่าเปิด-ปิดรับสมัคร, และกำหนดรายชื่อผู้บริหารสำหรับเอกสาร
          </p>
        </div>

        {activeSubTab === 'teachers' && (
          <button
            onClick={handleOpenCreateTeacher}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>สร้างบัญชีครู / Admin ใหม่</span>
          </button>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex p-1 bg-slate-900/80 rounded-2xl border border-slate-800/90 text-xs sm:text-sm font-medium">
        <button
          onClick={() => setActiveSubTab('teachers')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'teachers'
              ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <KeyRound className="w-4 h-4 text-cyan-300" />
          <span>บัญชีครู & รหัสผ่าน ({teachers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'settings'
              ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4 text-indigo-300" />
          <span>ตั้งค่าระบบ & เอกสารโรงเรียน</span>
        </button>

        <button
          onClick={() => setActiveSubTab('data')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'data'
              ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-300" />
          <span>จัดการฐานข้อมูล & สถิติ</span>
        </button>
      </div>

      {/* SUB TAB 1: TEACHER & ADMIN CREDENTIALS MANAGEMENT */}
      {activeSubTab === 'teachers' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-950/30 border border-blue-500/20 rounded-2xl text-xs text-blue-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block">สิทธิ์การตั้งค่าของ Admin:</strong>
              Admin เป็นผู้กำหนด Name (Username) และ Password ให้คุณครูแต่ละท่าน เพื่อใช้ในการเข้าสู่ระบบตรวจสอบรายชื่อ เช็คชื่อ และอนุมัติใบลา
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800/90 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">ชื่อ - นามสกุล</th>
                    <th className="py-3 px-4">Username (Name)</th>
                    <th className="py-3 px-4">Password</th>
                    <th className="py-3 px-4">บทบาท</th>
                    <th className="py-3 px-4">ชุมนุมที่ดูแล</th>
                    <th className="py-3 px-4 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {teachers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-100">
                        {t.fullName}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-cyan-400">
                        {t.username}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 tracking-wider">
                            {visiblePasswords[t.id] ? t.password : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setVisiblePasswords((prev) => ({ ...prev, [t.id]: !prev[t.id] }))
                            }
                            className="p-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                            title={visiblePasswords[t.id] ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                          >
                            {visiblePasswords[t.id] ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            t.role === 'admin'
                              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {t.role === 'admin' ? '🛡️ ผู้ดูแลระบบ (Admin)' : '👨‍🏫 ครูผู้สอน (Teacher)'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {t.assignedClub === 'all'
                          ? 'ดูแลทั้ง 2 ชุมนุม'
                          : t.assignedClub === 'วงโยธวาทิต'
                          ? '🎺 วงโยธวาทิต'
                          : '🎸 ดนตรีสากล'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEditTeacher(t)}
                            className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-800 transition-colors"
                            title="แก้ไขรหัสผ่านและข้อมูล"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {teachers.length > 1 && (
                            <button
                              onClick={() => {
                                if (confirm(`คุณต้องการลบบัญชี ${t.fullName} หรือไม่?`)) {
                                  deleteTeacher(t.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                              title="ลบบัญชี"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: CLUB SETTINGS & SIGNATURES */}
      {activeSubTab === 'settings' && (
        <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl max-w-2xl">
          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <h3 className="text-base font-bold text-white mb-2">
              ตั้งค่าระบบโรงเรียนและหัวเอกสารราชการ
            </h3>

            {/* Registration Switch */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-white block">
                  สถานะการเปิดรับสมัครนักเรียนใหม่
                </span>
                <span className="text-slate-400 text-xs">
                  หากปิด จะไม่สามารถส่งใบสมัครใหม่ผ่านหน้าเว็ปไซต์ได้
                </span>
              </div>
              <button
                type="button"
                onClick={() => setRegistrationOpen(!registrationOpen)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  registrationOpen
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                }`}
              >
                {registrationOpen ? '✓ กำลังเปิดรับสมัคร' : '✕ ปิดรับสมัครชั่วคราว'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  ชื่อโรงเรียน
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  ปีการศึกษา
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-3">
              <span className="font-bold text-slate-200 block text-xs">
                ผู้ลงนามในหนังสือขอตัวนักเรียน (PDF Report):
              </span>

              <div>
                <label className="block text-slate-400 mb-1">
                  1. ผู้อำนวยการโรงเรียน (ผู้มีอำนาจอนุมัติสูงสุด)
                </label>
                <input
                  type="text"
                  value={schoolDirectorName}
                  onChange={(e) => setSchoolDirectorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  2. ครูผู้ฝึกสอนและควบคุมวง (Band Director)
                </label>
                <input
                  type="text"
                  value={bandDirectorName}
                  onChange={(e) => setBandDirectorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  3. หัวหน้ากลุ่มสาระการเรียนรู้ศิลปะ
                </label>
                <input
                  type="text"
                  value={headOfMusicDepartment}
                  onChange={(e) => setHeadOfMusicDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {settingsSaved && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>บันทึกการตั้งค่าระบบเรียบร้อยแล้ว</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการตั้งค่า</span>
            </button>
          </form>
        </div>
      )}

      {/* SUB TAB 3: DATA & STATS */}
      {activeSubTab === 'data' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400">จำนวนนักเรียนในฐานข้อมูล</span>
              <p className="text-3xl font-bold text-white mt-1">{students.length} คน</p>
              <span className="text-[11px] text-emerald-400 mt-2 block">
                ใช้งานปกติ {students.filter((s) => s.status === 'active').length} คน
              </span>
            </div>

            <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400">ประวัติการบันทึกเวลาฝึกซ้อม</span>
              <p className="text-3xl font-bold text-blue-400 mt-1">{attendance.length} เรคอร์ด</p>
              <span className="text-[11px] text-slate-400 mt-2 block">
                บันทึกการซ้อมเช้าและซ้อมเย็น
              </span>
            </div>

            <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400">คำขอลา / ลาออกทั้งหมด</span>
              <p className="text-3xl font-bold text-amber-400 mt-1">{requests.length} คำขอ</p>
              <span className="text-[11px] text-amber-400 mt-2 block">
                รออนุมัติ {requests.filter((r) => r.status === 'pending').length} รายการ
              </span>
            </div>
          </div>

          <div className="p-6 bg-slate-900/80 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>คืนค่าข้อมูลเริ่มต้นสำหรับการสาธิต (Reset Demo Data)</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              หากต้องการรีเซ็ตข้อมูลตัวอย่างทั้งหมด (นักเรียน, ครู, ตารางซ้อม, แกลเลอรี) ให้กลับเป็นค่าเริ่มต้นของโรงเรียนกาญจนาภิเษกวิทยาลัย ชัยภูมิ สามารถคลิกปุ่มด้านล่าง
            </p>
            <button
              onClick={() => {
                if (confirm('คุณต้องการรีเซ็ตข้อมูลระบบกลับสู่ค่าเริ่มต้นใช่หรือไม่?')) {
                  resetToInitialData();
                }
              }}
              className="px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              รีเซ็ตข้อมูลเริ่มต้น (Factory Reset)
            </button>
          </div>
        </div>
      )}

      {/* Teacher Form Modal */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md my-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100">
            <h3 className="text-lg font-bold text-white mb-2">
              {editingTeacherId ? 'แก้ไขข้อมูลบัญชีและรหัสผ่าน' : 'สร้างบัญชีผู้ใช้งานครู / Admin ใหม่'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              แอดมินเป็นผู้กำหนด Username (Name) และ Password ให้คุณครู
            </p>

            <form onSubmit={handleSaveTeacher} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  ชื่อ - นามสกุลคุณครู <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ครูวิชัย บรรเลงกาล"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Username (Name) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น teacher_marching"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Password <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น password123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">บทบาทสิทธิ์</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="teacher">คุณครูผู้ดูแล (Teacher)</option>
                    <option value="admin">ผู้ดูแลระบบสูงสุด (Admin)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">ชุมนุมที่รับผิดชอบ</label>
                  <select
                    value={assignedClub}
                    onChange={(e) => setAssignedClub(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="วงโยธวาทิต">วงโยธวาทิต</option>
                    <option value="ดนตรีสากล">ดนตรีสากล</option>
                    <option value="all">ทั้ง 2 ชุมนุม</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">เบอร์โทรศัพท์ติดต่อ</label>
                <input
                  type="tel"
                  placeholder="08X-XXX-XXXX"
                  value={teacherPhone}
                  onChange={(e) => setTeacherPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              {teacherFeedback && (
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                  {teacherFeedback}
                </div>
              )}

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsTeacherModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
