/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MusicalBackground } from './components/common/MusicalBackground';
import { LogoBadge } from './components/common/LogoBadge';
import { NotificationBell } from './components/common/NotificationBell';
import { LoginModal } from './components/auth/LoginModal';
import { SignUpModal } from './components/auth/SignUpModal';
import { HeroSection } from './components/home/HeroSection';
import { StudentList } from './components/members/StudentList';
import { AttendanceSystem } from './components/attendance/AttendanceSystem';
import { LeaveManagement } from './components/requests/LeaveManagement';
import { NewsSection } from './components/news/NewsSection';
import { ClubCalendar } from './components/calendar/ClubCalendar';
import { MediaGallery } from './components/gallery/MediaGallery';
import { StudentPortal } from './components/student/StudentPortal';
import { AdminBackend } from './components/admin/AdminBackend';
import {
  Home,
  Users,
  CheckSquare,
  FileText,
  Megaphone,
  Calendar,
  Image,
  ShieldCheck,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Music,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, userRole, logout, settings, requests } = useApp();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Pending count for badge
  const pendingRequestsCount = requests.filter((r) => r.status === 'pending').length;

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'หน้าแรก', icon: Home },
    { id: 'members', label: 'รายชื่อสมาชิก & PDF', icon: Users },
    {
      id: 'attendance',
      label: userRole === 'student' ? 'ตรวจสอบการเข้าซ้อม' : 'เช็คชื่อ',
      icon: CheckSquare,
    },
    {
      id: 'requests',
      label: 'ขอลา / ขอออก',
      icon: FileText,
      badge: userRole === 'admin' || userRole === 'teacher' ? pendingRequestsCount : undefined,
    },
    { id: 'news', label: 'ข่าวประกาศ', icon: Megaphone },
    { id: 'calendar', label: 'ปฏิทินซ้อม', icon: Calendar },
    { id: 'gallery', label: 'ภาพ & วิดีโอ', icon: Image },
  ];

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-['Prompt',sans-serif] selection:bg-blue-600 selection:text-white">
      {/* Musical Background with ambient glowing notes and deep navy-black palette */}
      <MusicalBackground />

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Brand Title */}
            <div
              onClick={() => handleTabClick('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <LogoBadge size="sm" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg sm:text-xl text-white tracking-tight group-hover:text-blue-400 transition-colors">
                    KPCH BAND
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    ดนตรีสากล & วงโยฯ
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium truncate max-w-[220px] sm:max-w-none">
                  โรงเรียนกาญจนาภิเษกวิทยาลัย ชัยภูมิ
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center animate-bounce">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Special Role Tabs */}
              {userRole === 'student' && (
                <button
                  onClick={() => handleTabClick('my-portal')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'my-portal'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-cyan-300 bg-blue-950/60 border border-blue-500/30 hover:bg-blue-900/40'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>พอร์ทัลนักเรียน</span>
                </button>
              )}

              {userRole === 'admin' && (
                <button
                  onClick={() => handleTabClick('admin-backend')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'admin-backend'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 hover:bg-indigo-900/40'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>ระบบหลังบ้าน</span>
                </button>
              )}
            </nav>

            {/* Right Controls: Notification Bell & Auth */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Automatic Notification Bell */}
              <NotificationBell />

              {/* User Logged In / Out Controls */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div
                    onClick={() => {
                      if (userRole === 'student') handleTabClick('my-portal');
                      else if (userRole === 'admin') handleTabClick('admin-backend');
                      else handleTabClick('attendance');
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {'studentId' in currentUser
                        ? currentUser.nickName.substring(0, 1)
                        : currentUser.fullName.substring(0, 1)}
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-xs font-bold text-white leading-tight">
                        {'studentId' in currentUser ? currentUser.nickName : currentUser.username}
                      </p>
                      <span className="text-[10px] text-blue-400 capitalize block leading-tight">
                        {userRole === 'student' ? 'นักเรียน' : userRole === 'teacher' ? 'คุณครู' : 'Admin'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
                    title="ออกจากระบบ"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-blue-400" />
                    <span>เข้าสู่ระบบ</span>
                  </button>

                  <button
                    onClick={() => setIsSignUpOpen(true)}
                    className="hidden sm:flex px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/25 transition-all items-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>สมัครเข้าชุมนุม</span>
                  </button>
                </div>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                aria-label="เมนู"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-4 bg-slate-950/95 border-b border-slate-800 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    isActive ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {userRole === 'student' && (
              <button
                onClick={() => handleTabClick('my-portal')}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-bold text-cyan-300 bg-blue-950/60 border border-blue-500/30 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>พอร์ทัลนักเรียนของฉัน</span>
              </button>
            )}

            {userRole === 'admin' && (
              <button
                onClick={() => handleTabClick('admin-backend')}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>ระบบหลังบ้าน Admin</span>
              </button>
            )}

            {!currentUser && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSignUpOpen(true);
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold bg-blue-600 text-white rounded-xl"
                >
                  สมัครเข้าชุมนุมออนไลน์
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {activeTab === 'home' && (
          <HeroSection
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenSignUp={() => setIsSignUpOpen(true)}
          />
        )}

        {activeTab === 'members' && (
          <StudentList onOpenSignUp={() => setIsSignUpOpen(true)} />
        )}

        {activeTab === 'attendance' && <AttendanceSystem />}

        {activeTab === 'requests' && <LeaveManagement />}

        {activeTab === 'news' && <NewsSection />}

        {activeTab === 'calendar' && <ClubCalendar />}

        {activeTab === 'gallery' && <MediaGallery />}

        {activeTab === 'my-portal' && <StudentPortal />}

        {activeTab === 'admin-backend' && <AdminBackend />}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 py-8 relative z-10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <LogoBadge size="sm" />
              <div>
                <p className="font-bold text-sm text-white">
                  {settings.schoolName}
                </p>
                <p className="text-xs text-slate-400">
                  กลุ่มสาระการเรียนรู้ศิลปะ • ชุมนุมดนตรีสากล & วงโยธวาทิต (KPCH Band)
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
              <button
                onClick={() => handleTabClick('members')}
                className="hover:text-blue-400 transition-colors cursor-pointer"
              >
                ทำเนียบสมาชิก ก-ฮ
              </button>
              <button
                onClick={() => handleTabClick('attendance')}
                className="hover:text-blue-400 transition-colors cursor-pointer"
              >
                ระบบเช็คชื่อ
              </button>
              <button
                onClick={() => handleTabClick('news')}
                className="hover:text-blue-400 transition-colors cursor-pointer"
              >
                ข่าวสาร
              </button>
              <button
                onClick={() => handleTabClick('calendar')}
                className="hover:text-blue-400 transition-colors cursor-pointer"
              >
                ปฏิทินซ้อม
              </button>
              <button
                onClick={() => handleTabClick('gallery')}
                className="hover:text-blue-400 transition-colors cursor-pointer"
              >
                แกลเลอรี
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>
              © พ.ศ. 2569 KPCH Band. พัฒนาขึ้นเพื่อความสะดวกในการจัดการวงดนตรีสากลและวงโยธวาทิต
            </span>
            <span className="flex items-center gap-1 text-blue-400/80">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              ระบบแจ้งเตือนอัตโนมัติ & เอกสารขอตัวเข้าร่วมกิจกรรมพร้อมพิมพ์
            </span>
          </div>
        </div>
      </footer>

      {/* AUTHENTICATION MODALS */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenSignUp={() => setIsSignUpOpen(true)}
      />

      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onOpenLogin={() => setIsLoginOpen(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
