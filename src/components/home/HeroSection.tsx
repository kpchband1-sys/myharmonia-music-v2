import React from 'react';
import { useApp } from '../../context/AppContext';
import { LogoBadge } from '../common/LogoBadge';
import {
  Music,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Award,
} from 'lucide-react';

interface HeroSectionProps {
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenLogin, onOpenSignUp }) => {
  const { students, setActiveTab, currentUser, userRole, settings } = useApp();

  const marchingCount = students.filter((s) => s.clubType === 'วงโยธวาทิต').length;
  const westernCount = students.filter((s) => s.clubType === 'ดนตรีสากล').length;

  return (
    <div className="space-y-10 py-4">
      {/* Hero Banner */}
      <div className="relative rounded-3xl p-6 sm:p-12 overflow-hidden border border-blue-500/30 bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-950 shadow-2xl">
        {/* Glow Spheres */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold shadow-inner">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>เปิดรับสมัครนักเรียนมัธยมศึกษาผู้มีใจรักในเสียงดนตรี</span>
          </div>

          {/* Logo Badge Large */}
          <div className="flex justify-center">
            <LogoBadge size="lg" />
          </div>

          {/* Main Title */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              ชุมนุมดนตรีสากล & วงโยธวาทิต
            </h1>
            <p className="text-base sm:text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-indigo-300">
              {settings.schoolName} (KPCH Band)
            </p>
          </div>

          <p className="text-xs sm:text-base text-slate-300 max-h-24 overflow-hidden leading-relaxed max-w-2xl mx-auto">
            ยินดีต้อนรับนักเรียนชั้นมัธยมศึกษาปีที่ 1 - 6 ร่วมฝึกซ้อมทักษะดนตรี สร้างมิตรภาพ
            และสร้างชื่อเสียงให้กับโรงเรียนในเวทีการประกวดระดับจังหวัดและระดับประเทศ
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {currentUser ? (
              <button
                onClick={() => {
                  if (userRole === 'student') setActiveTab('my-portal');
                  else setActiveTab('attendance');
                }}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>เข้าสู่แดชบอร์ดของฉัน</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={onOpenSignUp}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-102"
                >
                  <Music className="w-4 h-4" />
                  <span>สมัครเข้าชุมนุมออนไลน์</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenLogin}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>เข้าสู่ระบบ (นักเรียน / คุณครู)</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('members')}
              className="px-5 py-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span>ทำเนียบสมาชิก & พิมพ์ PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* TWO CLUB CATEGORIES SHOWCASE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category 1: วงโยธวาทิต */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 shadow-xl overflow-hidden group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-all" />

          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl p-3 rounded-2xl bg-blue-500/15 border border-blue-500/30">
              🎺
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              สมาชิก {marchingCount} คน
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
            วงโยธวาทิต (Marching Band)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
            ฝึกซ้อมการบรรเลงเครื่องเป่าทองเหลือง (Brass), เครื่องเป่าลมไม้ (Woodwind) และเครื่องกระทบ (Percussion)
            พร้อมการเดินแถวแปรขบวน (Field Show) และงานพิธีการโรงเรียน
          </p>

          <div className="flex flex-wrap gap-1.5 mb-5 text-[11px] text-slate-300">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800">ดรัมเมเยอร์</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800">Trumpet</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800">Trombone</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800">Tuba</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800">Snare Drum</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800">Color Guard</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400">ซ้อมทุกวันจันทร์ - ศุกร์ (16:30 - 18:30 น.)</span>
            <button
              onClick={() => {
                setActiveTab('members');
              }}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>ดูรายชื่อ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category 2: ดนตรีสากล */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 shadow-xl overflow-hidden group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-indigo-600/20 transition-all" />

          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30">
              🎸
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              สมาชิก {westernCount} คน
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
            ดนตรีสากล (Combo & String Band)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
            ฝึกซ้อมวงดนตรีสากล วงสตริงคอมโบ อะคูสติก และวงโฟล์กซอง สำหรับการแสดงในงานกิจกรรมโรงเรียน
            และการส่งเข้าประกวดดนตรีระดับเยาวชน
          </p>

          <div className="flex flex-wrap gap-1.5 mb-5 text-[11px] text-slate-300">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800">นักร้องนำ</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800">กีตาร์โปร่ง / ไฟฟ้า</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800">เบสไฟฟ้า</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800">กลองชุด</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800">คีย์บอร์ด</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400">ซ้อมทุกวันอังคารและพฤหัสบดี (ห้องดนตรีสากล)</span>
            <button
              onClick={() => {
                setActiveTab('members');
              }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>ดูรายชื่อ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* QUICK HIGHLIGHT FEATURES FOR STUDENTS & TEACHERS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('attendance')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center gap-4"
        >
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">ระบบเช็คชื่อรวดเร็ว</h3>
            <p className="text-xs text-slate-400 mt-0.5">ครูกรอกรหัสนักเรียน 5 หลัก หรือติ๊กในตาราง</p>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('calendar')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center gap-4"
        >
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">ปฏิทินการฝึกซ้อม</h3>
            <p className="text-xs text-slate-400 mt-0.5">ดูคิวซ้อม คอนเสิร์ต และการแข่งขันได้ทุกวัน</p>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('gallery')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center gap-4"
        >
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">แกลเลอรีและผลงาน</h3>
            <p className="text-xs text-slate-400 mt-0.5">ภาพกิจกรรมความภาคภูมิใจ และคลิปวิดีโอ</p>
          </div>
        </div>
      </div>
    </div>
  );
};
