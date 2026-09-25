import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, Megaphone, CheckCircle2, XCircle, Calendar, Sparkles, X } from 'lucide-react';

export const NotificationBell: React.FC = () => {
  const { notifications, currentUser, userRole, markNotificationAsRead, markAllNotificationsAsRead, setActiveTab } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter notifications relevant to current user
  const relevantNotifications = notifications.filter((n) => {
    // If targeted to a specific student
    if (n.recipientStudentId) {
      if (userRole === 'student' && currentUser && 'studentId' in currentUser) {
        return n.recipientStudentId === currentUser.studentId;
      }
      // If admin/teacher, they can also see it
      return userRole === 'admin' || userRole === 'teacher';
    }
    return true; // broadcast notifications
  });

  const unreadCount = relevantNotifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (id: string, type: string) => {
    markNotificationAsRead(id);
    if (type === 'announcement') {
      setActiveTab('news');
    } else if (type === 'calendar') {
      setActiveTab('calendar');
    } else if (type === 'request_status') {
      if (userRole === 'student') {
        setActiveTab('my-portal');
      } else {
        setActiveTab('requests');
      }
    }
    setIsOpen(false);
  };

  const getIcon = (type: string, title: string) => {
    if (type === 'announcement') {
      return <Megaphone className="w-4 h-4 text-amber-400" />;
    }
    if (type === 'calendar') {
      return <Calendar className="w-4 h-4 text-sky-400" />;
    }
    if (type === 'request_status') {
      if (title.includes('อนุมัติแล้ว') || title.includes('✅')) {
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      }
      return <XCircle className="w-4 h-4 text-rose-400" />;
    }
    return <Sparkles className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-200 cursor-pointer"
        title="การแจ้งเตือน"
        aria-label="การแจ้งเตือน"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[11px] font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-full border-2 border-slate-950 shadow-lg animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-800/90 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-slate-100 text-sm">การแจ้งเตือนอัตโนมัติ</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {unreadCount} ใหม่
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-blue-400 hover:text-blue-300 p-1 flex items-center gap-1 hover:underline cursor-pointer"
                  title="อ่านทั้งหมด"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">อ่านทั้งหมด</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800/60 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60">
            {relevantNotifications.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-sm">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                ยังไม่มีการแจ้งเตือนในขณะนี้
              </div>
            ) : (
              relevantNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id, notif.type)}
                  className={`p-3.5 hover:bg-slate-800/60 cursor-pointer transition-colors flex gap-3 ${
                    !notif.isRead ? 'bg-blue-950/30 border-l-2 border-blue-500' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0 p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center">
                    {getIcon(notif.type, notif.title)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <p className={`text-xs font-semibold truncate ${!notif.isRead ? 'text-blue-200 font-bold' : 'text-slate-200'}`}>
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-500 mt-1.5 block">
                      {notif.createdAt}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              แจ้งเตือนอัตโนมัติเมื่อมีประกาศหรือผลอนุมัติคำขอ
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
