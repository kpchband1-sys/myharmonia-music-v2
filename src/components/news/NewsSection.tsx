import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Announcement } from '../../types';
import {
  Megaphone,
  Pin,
  Calendar,
  MapPin,
  PlusCircle,
  X,
  Edit,
  Trash2,
  Trophy,
  Music,
  Info,
  Sparkles,
} from 'lucide-react';

export const NewsSection: React.FC = () => {
  const {
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    userRole,
    currentUser,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'rehearsal' | 'performance' | 'general' | 'award'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('rehearsal');
  const [targetClub, setTargetClub] = useState<Announcement['targetClub']>('all');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [pinned, setPinned] = useState(false);

  const isStaff = userRole === 'admin' || userRole === 'teacher';

  const filteredAnnouncements = announcements
    .filter((a) => selectedCategory === 'all' || a.category === selectedCategory)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setCategory('rehearsal');
    setTargetClub('all');
    setEventDate('');
    setLocation('');
    setPinned(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingId(ann.id);
    setTitle(ann.title);
    setContent(ann.content);
    setCategory(ann.category);
    setTargetClub(ann.targetClub);
    setEventDate(ann.eventDate || '');
    setLocation(ann.location || '');
    setPinned(ann.pinned);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const authorName = currentUser && 'fullName' in currentUser ? currentUser.fullName : 'ครูผู้ดูแลชุมนุม';

    if (editingId) {
      updateAnnouncement(editingId, {
        title: title.trim(),
        content: content.trim(),
        category,
        targetClub,
        eventDate: eventDate.trim() || undefined,
        location: location.trim() || undefined,
        pinned,
      });
    } else {
      addAnnouncement({
        title: title.trim(),
        content: content.trim(),
        category,
        targetClub,
        author: authorName,
        pinned,
        eventDate: eventDate.trim() || undefined,
        location: location.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  const getCategoryBadge = (cat: Announcement['category']) => {
    switch (cat) {
      case 'rehearsal':
        return (
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20 flex items-center gap-1">
            <Music className="w-3 h-3" /> ตารางซ้อม
          </span>
        );
      case 'performance':
        return (
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> คอนเสิร์ต / การแสดง
          </span>
        );
      case 'award':
        return (
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20 flex items-center gap-1">
            <Trophy className="w-3 h-3" /> รางวัลเกียรติยศ
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 flex items-center gap-1">
            <Info className="w-3 h-3" /> ข่าวทั่วไป
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              ข่าวประชาสัมพันธ์ & ตารางซ้อม
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {announcements.length} ข่าว
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            ติดตามกำหนดการฝึกซ้อม คอนเสิร์ต การประกวด และการแจ้งเตือนสำคัญจากคุณครู
          </p>
        </div>

        {isStaff && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>สร้างประกาศใหม่</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 pb-1">
        {[
          { id: 'all', label: 'ทั้งหมด' },
          { id: 'rehearsal', label: '🎺 ตารางซ้อม' },
          { id: 'performance', label: '🎸 การแสดง/แข่งขัน' },
          { id: 'award', label: '🏆 ผลงานรางวัล' },
          { id: 'general', label: '📢 ทั่วไป' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === c.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => (
          <div
            key={ann.id}
            className={`relative p-5 sm:p-6 rounded-3xl border transition-all ${
              ann.pinned
                ? 'bg-gradient-to-br from-slate-900 via-blue-950/20 to-slate-900 border-blue-500/40 shadow-xl shadow-blue-500/5'
                : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            {/* Top metadata row */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                {ann.pinned && (
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Pin className="w-3 h-3 fill-current" /> ปักหมุดประกาศสำคัญ
                  </span>
                )}
                {getCategoryBadge(ann.category)}
                <span className="text-xs text-slate-400 font-medium">
                  เป้าหมาย:{' '}
                  {ann.targetClub === 'all'
                    ? 'สมาชิกทุกคน'
                    : ann.targetClub === 'วงโยธวาทิต'
                    ? 'เฉพาะวงโยธวาทิต'
                    : 'เฉพาะดนตรีสากล'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{ann.date}</span>
                {isStaff && (
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => handleOpenEdit(ann)}
                      className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="แก้ไขประกาศ"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('คุณต้องการลบประกาศนี้หรือไม่?')) {
                          deleteAnnouncement(ann.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="ลบประกาศ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-2">
              {ann.title}
            </h2>

            {/* Event Date / Location badges if available */}
            {(ann.eventDate || ann.location) && (
              <div className="flex flex-wrap items-center gap-3 my-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                {ann.eventDate && (
                  <span className="flex items-center gap-1.5 text-cyan-300 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    {ann.eventDate}
                  </span>
                )}
                {ann.location && (
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    {ann.location}
                  </span>
                )}
              </div>
            )}

            {/* Content */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line mt-2">
              {ann.content}
            </p>

            {/* Author Footer */}
            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
              <span>ประกาศโดย: <strong className="text-slate-400 font-medium">{ann.author}</strong></span>
              <span className="text-[11px] text-blue-400/80">ระบบส่งแจ้งเตือนอัตโนมัติแล้ว</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg my-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              {editingId ? 'แก้ไขประกาศข่าว' : 'สร้างประกาศข่าว / ตารางซ้อมใหม่'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  หัวข้อข่าว / ประกาศ <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ประกาศตารางซ้อมใหญ่เตรียมแข่งชิงถ้วย..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">หมวดหมู่</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="rehearsal">ตารางซ้อม</option>
                    <option value="performance">การแสดง / คอนเสิร์ต</option>
                    <option value="award">ผลงานรางวัล</option>
                    <option value="general">ข่าวทั่วไป</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">กลุ่มเป้าหมาย</label>
                  <select
                    value={targetClub}
                    onChange={(e) => setTargetClub(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">สมาชิกทุกคน (ทั้งหมด)</option>
                    <option value="วงโยธวาทิต">เฉพาะวงโยธวาทิต</option>
                    <option value="ดนตรีสากล">เฉพาะดนตรีสากล</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">วันที่จัดกิจกรรม (ถ้ามี)</label>
                  <input
                    type="text"
                    placeholder="เช่น 25 ก.ย. - 10 ต.ค. 2569"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">สถานที่ (ถ้ามี)</label>
                  <input
                    type="text"
                    placeholder="เช่น สนามฟุตบอล หรือ หอประชุม"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  เนื้อหาประกาศอย่างละเอียด <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="เขียนรายละเอียดประกาศ..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="pinCheck" className="text-slate-300 font-medium cursor-pointer">
                  ปักหมุดข่าวนี้ไว้ด้านบนสุด
                </label>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>เมื่อบันทึก ระบบจะแจ้งเตือนอัตโนมัติไปยังกระดิ่งแจ้งเตือนของนักเรียนทันที</span>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  บันทึกและส่งประกาศ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
