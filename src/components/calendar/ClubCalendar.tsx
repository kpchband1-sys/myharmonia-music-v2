import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent } from '../../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  PlusCircle,
  X,
  Music,
  Trophy,
  Users,
  Sparkles,
  Trash2,
} from 'lucide-react';

export const ClubCalendar: React.FC = () => {
  const { calendarEvents, addCalendarEvent, deleteCalendarEvent, userRole, currentUser } = useApp();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(() => new Date().toISOString().split('T')[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterClub, setFilterClub] = useState<'all' | 'วงโยธวาทิต' | 'ดนตรีสากล'>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeStart, setTimeStart] = useState('16:30');
  const [timeEnd, setTimeEnd] = useState('18:30');
  const [location, setLocation] = useState('สนามฟุตบอล / ห้องดนตรีสากล');
  const [description, setDescription] = useState('');
  const [clubType, setClubType] = useState<CalendarEvent['clubType']>('all');
  const [category, setCategory] = useState<CalendarEvent['category']>('rehearsal');

  const isStaff = userRole === 'admin' || userRole === 'teacher';

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNamesThai = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
  ];

  // Calendar matrix calculations
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday

  // Events map for the current month
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    calendarEvents.forEach((ev) => {
      if (filterClub !== 'all' && ev.clubType !== 'all' && ev.clubType !== filterClub) {
        return;
      }
      const list = map.get(ev.date) || [];
      list.push(ev);
      map.set(ev.date, list);
    });
    return map;
  }, [calendarEvents, filterClub]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Selected date's events
  const selectedDateEvents = eventsByDate.get(selectedDateStr) || [];

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !eventDate) return;

    const authorName = currentUser && 'fullName' in currentUser ? currentUser.fullName : 'ครูผู้ดูแล';

    const colors: Record<CalendarEvent['category'], string> = {
      rehearsal: '#3b82f6',
      competition: '#f59e0b',
      show: '#ec4899',
      meeting: '#10b981',
      other: '#8b5cf6',
    };

    addCalendarEvent({
      title: title.trim(),
      date: eventDate,
      timeStart,
      timeEnd,
      location: location.trim(),
      description: description.trim(),
      clubType,
      category,
      color: colors[category] || '#3b82f6',
      createdBy: authorName,
    });

    setIsAddModalOpen(false);
    setSelectedDateStr(eventDate);
    setTitle('');
    setDescription('');
  };

  const getCategoryIcon = (cat: CalendarEvent['category']) => {
    switch (cat) {
      case 'rehearsal':
        return <Music className="w-3.5 h-3.5 text-blue-400" />;
      case 'competition':
        return <Trophy className="w-3.5 h-3.5 text-amber-400" />;
      case 'show':
        return <Sparkles className="w-3.5 h-3.5 text-pink-400" />;
      case 'meeting':
        return <Users className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              ปฏิทินกิจกรรมและการฝึกซ้อม
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              KPCH Calendar
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            ติดตามตารางซ้อมประจำวัน คอนเสิร์ต และการแข่งขัน ทั้งนักเรียนและคุณครูสามารถตรวจสอบได้สะดวก
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Club Filter */}
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
            {(['all', 'วงโยธวาทิต', 'ดนตรีสากล'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setFilterClub(c)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterClub === c ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {c === 'all' ? 'ทั้งหมด' : c}
              </button>
            ))}
          </div>

          {isStaff && (
            <button
              onClick={() => {
                setEventDate(selectedDateStr);
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>เพิ่มกิจกรรม</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Calendar + Day Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Grid (2 cols on large screen) */}
        <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800/90 p-5 sm:p-6 shadow-xl">
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-400" />
              <span>
                {monthNamesThai[month]} พ.ศ. {year + 543}
              </span>
            </h2>

            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="เดือนก่อนหน้า"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                วันนี้
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="เดือนถัดไป"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
            <span className="text-rose-400">อา</span>
            <span>จ</span>
            <span>อ</span>
            <span>พ</span>
            <span>พฤ</span>
            <span>ศ</span>
            <span className="text-indigo-400">ส</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[75px] sm:min-h-[90px] rounded-xl bg-slate-950/20" />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = eventsByDate.get(dateStr) || [];
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDateStr;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`min-h-[75px] sm:min-h-[90px] p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-950/60 border-blue-400 shadow-md shadow-blue-500/10'
                      : isToday
                      ? 'bg-slate-800/80 border-cyan-500/50'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-cyan-500 text-slate-950 font-black'
                          : isSelected
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300'
                      }`}
                    >
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    )}
                  </div>

                  {/* Event Badges inside cell */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className="truncate text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded-md text-white shadow-xs"
                        style={{ backgroundColor: ev.color || '#3b82f6' }}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-slate-400 block text-right font-medium">
                        +{dayEvents.length - 2} อื่นๆ
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details Panel (1 col) */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800/90 p-5 sm:p-6 shadow-xl flex flex-col">
          <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">
                กิจกรรมประจำวันที่
              </span>
              <h3 className="text-base font-bold text-white">
                {selectedDateStr}
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {selectedDateEvents.length} รายการ
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 max-h-[500px]">
            {selectedDateEvents.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                <p className="text-xs">ไม่มีกิจกรรมหรือการฝึกซ้อมในวันนี้</p>
                {isStaff && (
                  <button
                    onClick={() => {
                      setEventDate(selectedDateStr);
                      setIsAddModalOpen(true);
                    }}
                    className="mt-3 text-xs text-blue-400 hover:text-blue-300 underline font-medium cursor-pointer"
                  >
                    + เพิ่มกิจกรรมสำหรับวันนี้
                  </button>
                )}
              </div>
            ) : (
              selectedDateEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: ev.color || '#3b82f6' }}
                      />
                      <h4 className="font-bold text-sm text-white">{ev.title}</h4>
                    </div>

                    {isStaff && (
                      <button
                        onClick={() => deleteCalendarEvent(ev.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="ลบกิจกรรม"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                    <span className="flex items-center gap-1 text-cyan-300">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {ev.timeStart} - {ev.timeEnd} น.
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      {ev.location}
                    </span>
                  </div>

                  {ev.description && (
                    <p className="text-xs text-slate-300 pt-1 leading-relaxed border-t border-slate-800/80">
                      {ev.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>ชุมนุม: {ev.clubType === 'all' ? 'ทุกประเภท' : ev.clubType}</span>
                    <span>โดย: {ev.createdBy}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md my-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              เพิ่มกิจกรรม / การฝึกซ้อมในปฏิทิน
            </h3>

            <form onSubmit={handleAddEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  ชื่อกิจกรรม / หัวข้อการซ้อม <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ซ้อมใหญ่รูปขบวนสนาม..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    วันที่ <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">หมวดหมู่</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="rehearsal">🎺 การฝึกซ้อม</option>
                    <option value="competition">🏆 การแข่งขัน</option>
                    <option value="show">🎸 การแสดงสด/คอนเสิร์ต</option>
                    <option value="meeting">📋 ประชุมสมาชิก</option>
                    <option value="other">📌 อื่นๆ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">เวลาเริ่ม</label>
                  <input
                    type="time"
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">เวลาสิ้นสุด</label>
                  <input
                    type="time"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">สถานที่</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">สำหรับชุมนุม</label>
                  <select
                    value={clubType}
                    onChange={(e) => setClubType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">ทั้ง 2 ชุมนุม (ทั้งหมด)</option>
                    <option value="วงโยธวาทิต">วงโยธวาทิต</option>
                    <option value="ดนตรีสากล">ดนตรีสากล</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">คำอธิบายเพิ่มเติม</label>
                <textarea
                  rows={2}
                  placeholder="เช่น เตรียมเครื่องดนตรีและชุดฝึกซ้อม..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  บันทึกลงปฏิทิน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
