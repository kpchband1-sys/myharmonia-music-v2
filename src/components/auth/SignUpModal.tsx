import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LogoBadge } from '../common/LogoBadge';
import { ClubType, GradeLevel } from '../../types';
import { X, CheckCircle2, AlertCircle, Music, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, onOpenLogin }) => {
  const { registerStudent, settings } = useApp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickName, setNickName] = useState('');
  const [grade, setGrade] = useState<GradeLevel>('ม.1');
  const [room, setRoom] = useState('1');
  const [studentId, setStudentId] = useState('');
  const [clubType, setClubType] = useState<ClubType>('วงโยธวาทิต');
  const [position, setPosition] = useState('');
  const [customPosition, setCustomPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [parentPhone, setParentPhone] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  // Preset instruments based on club type
  const marchingInstruments = [
    'ดรัมเมเยอร์ (Drum Major)',
    'ฟลูต (Flute)',
    'คลาริเน็ต (Clarinet)',
    'อัลโตแซกโซโฟน (Alto Saxophone)',
    'เทเนอร์แซกโซโฟน (Tenor Saxophone)',
    'ทรัมเป็ต (Trumpet)',
    'เมลโลโฟน / ฮอร์น (Mellophone / Horn)',
    'ทรอมโบน (Trombone)',
    'ยูโฟเนียม (Euphonium)',
    'ทูบา / ซูซาโฟน (Tuba / Sousaphone)',
    'สแนร์ดรัม (Snare Drum)',
    'เบสดรัม (Bass Drum)',
    'ควอด / เทเนอร์ดรัม (Tenor Quads)',
    'ฉาบ (Cymbals)',
    'เพอร์คัสชัน / มาริมบา (Front Pit Percussion)',
    'คัลเลอร์การ์ด (Color Guard)',
    'อื่นๆ (ระบุเอง)',
  ];

  const westernInstruments = [
    'นักร้องนำ (Lead Vocal)',
    'นักร้องประสาน (Backing Vocal)',
    'กีตาร์โปร่ง (Acoustic Guitar)',
    'กีตาร์ไฟฟ้า (Electric Guitar)',
    'กีตาร์เบส (Electric Bass)',
    'กลองชุด (Drum Set)',
    'คีย์บอร์ด / เปียโน (Keyboard / Piano)',
    'แซกโซโฟน (Saxophone)',
    'ทรัมเป็ต (Trumpet)',
    'ไวโอลิน (Violin)',
    'เพอร์คัสชัน (Percussion / Cajon)',
    'อื่นๆ (ระบุเอง)',
  ];

  const currentInstruments = clubType === 'วงโยธวาทิต' ? marchingInstruments : westernInstruments;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!firstName.trim() || !lastName.trim() || !nickName.trim()) {
      setError('กรุณากรอก ชื่อ, นามสกุล และชื่อเล่นให้ครบถ้วน');
      return;
    }

    if (!studentId.trim()) {
      setError('กรุณากรอกรหัสนักเรียน (ตัวเลข)');
      return;
    }

    const finalPosition = position === 'อื่นๆ (ระบุเอง)' ? customPosition.trim() : position.trim();
    if (!finalPosition) {
      setError('กรุณาเลือกหรือระบุตำแหน่ง / เครื่องดนตรี');
      return;
    }

    const res = registerStudent({
      studentId: studentId.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nickName: nickName.trim(),
      grade,
      room: room.trim() || '1',
      clubType,
      position: finalPosition,
      phone: phone.trim(),
      parentPhone: parentPhone.trim(),
    });

    if (res.success) {
      setSuccess(res.message);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg my-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <LogoBadge size="sm" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            ใบสมัครเข้าชุมนุมดนตรีสากล & วงโยธวาทิต
          </h2>
          <p className="text-xs text-blue-400 font-medium mt-0.5">
            โรงเรียนกาญจนาภิเษกวิทยาลัย ชัยภูมิ (KPCH Band)
          </p>
        </div>

        {!settings.registrationOpen ? (
          <div className="p-6 text-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <AlertCircle className="w-10 h-10 mx-auto mb-2 text-amber-400" />
            <h3 className="font-bold text-base mb-1">ปิดรับสมัครชั่วคราว</h3>
            <p className="text-xs text-amber-200/80">
              ขณะนี้ระบบปิดรับสมัครสมาชิกใหม่ กรุณาติดต่อครูผู้ดูแลชุมนุมเพื่อขอข้อมูลเพิ่มเติม
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Club Type Selection - Big Toggle Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                เลือกประเภทชุมนุมที่ต้องการสมัคร <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setClubType('วงโยธวาทิต');
                    setPosition('');
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    clubType === 'วงโยธวาทิต'
                      ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl">🎺</span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 ${
                        clubType === 'วงโยธวาทิต' ? 'border-blue-400 bg-blue-500' : 'border-slate-600'
                      }`}
                    />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">วงโยธวาทิต</span>
                    <span className="text-[11px] text-slate-400">Marching Band / วงโย</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setClubType('ดนตรีสากล');
                    setPosition('');
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    clubType === 'ดนตรีสากล'
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl">🎸</span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 ${
                        clubType === 'ดนตรีสากล' ? 'border-indigo-400 bg-indigo-500' : 'border-slate-600'
                      }`}
                    />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">ดนตรีสากล</span>
                    <span className="text-[11px] text-slate-400">Combo / สตริง / อะคูสติก</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                รหัสนักเรียน (5 หลัก) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={7}
                placeholder="เช่น 54120"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                * รหัสนักเรียนนี้จะใช้เป็นรหัสผ่านสำหรับเข้าสู่ระบบของนักเรียน
              </span>
            </div>

            {/* Names: ชื่อ, นามสกุล, ชื่อเล่น */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ชื่อ <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น สมชาย"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  นามสกุล <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ใจดี"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Nickname, Grade, Room */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ชื่อเล่น <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น บาส"
                  value={nickName}
                  onChange={(e) => setNickName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ชั้น <span className="text-rose-400">*</span>
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as GradeLevel)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 text-sm"
                >
                  <option value="ม.1">ม.1</option>
                  <option value="ม.2">ม.2</option>
                  <option value="ม.3">ม.3</option>
                  <option value="ม.4">ม.4</option>
                  <option value="ม.5">ม.5</option>
                  <option value="ม.6">ม.6</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ห้อง
                </label>
                <input
                  type="text"
                  placeholder="เช่น 1 หรือ 4"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm text-center"
                />
              </div>
            </div>

            {/* Position / Instrument */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ตำแหน่ง / เครื่องดนตรีที่สนใจ <span className="text-rose-400">*</span>
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 text-sm mb-2"
              >
                <option value="">-- กรุณาเลือกเครื่องดนตรี / ตำแหน่ง --</option>
                {currentInstruments.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>

              {position === 'อื่นๆ (ระบุเอง)' && (
                <input
                  type="text"
                  placeholder="ระบุเครื่องดนตรีหรือตำแหน่งที่ต้องการ..."
                  value={customPosition}
                  onChange={(e) => setCustomPosition(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 bg-slate-950/90 border border-blue-500/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
                />
              )}
            </div>

            {/* Contact Phones */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  เบอร์โทรศัพท์นักเรียน
                </label>
                <input
                  type="tel"
                  placeholder="08X-XXX-XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  เบอร์โทรผู้ปกครอง
                </label>
                <input
                  type="tel"
                  placeholder="08X-XXX-XXXX"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 hover:from-blue-500 to-indigo-600 hover:to-indigo-500 text-white font-medium rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Music className="w-4 h-4" />
              <span>ยืนยันการสมัครสมาชิก</span>
              <Sparkles className="w-4 h-4 text-cyan-300" />
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">มีรหัสนักเรียนอยู่แล้ว? </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 ml-1 cursor-pointer"
              >
                เข้าสู่ระบบที่นี่
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
