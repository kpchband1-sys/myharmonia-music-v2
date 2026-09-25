import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaItem } from '../../types';
import {
  Image as ImageIcon,
  Video,
  Upload,
  PlusCircle,
  X,
  Trash2,
  Calendar,
  Sparkles,
  ExternalLink,
  Play,
  Film,
} from 'lucide-react';

export const MediaGallery: React.FC = () => {
  const { mediaItems, addMediaItem, deleteMediaItem, userRole, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'photo' | 'video'>('all');
  const [selectedClub, setSelectedClub] = useState<'all' | 'วงโยธวาทิต' | 'ดนตรีสากล'>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  // Form State for Upload
  const [type, setType] = useState<'photo' | 'video'>('photo');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [eventDate, setEventDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [clubType, setClubType] = useState<MediaItem['clubType']>('วงโยธวาทิต');
  const [eventName, setEventName] = useState('');

  const isStaff = userRole === 'admin' || userRole === 'teacher';

  const filteredMedia = mediaItems.filter((item) => {
    if (activeTab !== 'all' && item.type !== activeTab) return false;
    if (selectedClub !== 'all' && item.clubType !== 'all' && item.clubType !== selectedClub) return false;
    return true;
  });

  // Handle local image file upload converting to Data URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const uploader = currentUser && 'fullName' in currentUser ? currentUser.fullName : 'Admin';

    addMediaItem({
      title: title.trim(),
      type,
      url: url.trim(),
      thumbnail: type === 'video' ? 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&auto=format&fit=crop&q=80' : undefined,
      description: description.trim(),
      clubType,
      eventDate,
      eventName: eventName.trim() || undefined,
      uploadedBy: uploader,
    });

    setIsUploadModalOpen(false);
    setTitle('');
    setUrl('');
    setDescription('');
    setEventName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              แกลเลอรีภาพกิจกรรม & วิดีโอผลงาน
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {mediaItems.length} ผลงาน
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            รวมภาพประทับใจ การแสดงสด และความสำเร็จของนักเรียนชุมนุมดนตรีสากลและวงโยธวาทิต
          </p>
        </div>

        {isStaff && (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>อัปโหลดภาพ / วิดีโอใหม่</span>
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
        {/* Type tabs */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'all' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setActiveTab('photo')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'photo' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>ภาพถ่าย ({mediaItems.filter((m) => m.type === 'photo').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'video' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>วิดีโอ ({mediaItems.filter((m) => m.type === 'video').length})</span>
          </button>
        </div>

        {/* Club filter */}
        <div className="flex items-center gap-1 text-xs">
          {(['all', 'วงโยธวาทิต', 'ดนตรีสากล'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setSelectedClub(c)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedClub === c ? 'bg-slate-800 text-blue-400 font-semibold border border-blue-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              {c === 'all' ? 'ทุกชุมนุม' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            onClick={() => setLightboxItem(item)}
            className="group relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer flex flex-col"
          >
            {/* Media Image / Video Preview */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
              <img
                src={item.thumbnail || item.url}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  // Fallback music image
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=80';
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

              {/* Type Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-white border border-slate-700/60 flex items-center gap-1 shadow-md">
                  {item.type === 'video' ? <Film className="w-3.5 h-3.5 text-rose-400" /> : <ImageIcon className="w-3.5 h-3.5 text-blue-400" />}
                  {item.type === 'video' ? 'วิดีโอ' : 'ภาพถ่าย'}
                </span>
              </div>

              {/* Play icon overlay for video */}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              )}

              {/* Delete button for staff */}
              {isStaff && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('คุณต้องการลบสื่อนี้หรือไม่?')) {
                      deleteMediaItem(item.id);
                    }
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-xl bg-slate-900/80 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                  title="ลบ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-blue-400 font-semibold mb-1">
                  <span>{item.clubType === 'all' ? 'ดนตรีสากล & วงโยฯ' : item.clubType}</span>
                  {item.eventName && (
                    <>
                      <span>•</span>
                      <span className="text-slate-400 truncate">{item.eventName}</span>
                    </>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {item.eventDate}
                </span>
                <span>โดย {item.uploadedBy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Media Viewer Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-4 sm:p-6 text-slate-100 flex flex-col max-h-[92vh]">
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-950/80 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Content */}
            <div className="rounded-2xl overflow-hidden bg-black max-h-[60vh] flex items-center justify-center mb-4">
              {lightboxItem.type === 'video' ? (
                <div className="w-full aspect-video flex items-center justify-center bg-slate-950 text-center p-6">
                  <div className="space-y-3">
                    <Video className="w-12 h-12 mx-auto text-blue-400 opacity-80" />
                    <p className="text-sm font-bold text-white">{lightboxItem.title}</p>
                    <a
                      href={lightboxItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>เล่นวิดีโอนี้ในแท็บใหม่</span>
                    </a>
                  </div>
                </div>
              ) : (
                <img
                  src={lightboxItem.url}
                  alt={lightboxItem.title}
                  className="max-h-[58vh] w-auto object-contain mx-auto"
                />
              )}
            </div>

            {/* Info */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-blue-400 font-semibold">
                <span>{lightboxItem.clubType}</span>
                <span>•</span>
                <span>{lightboxItem.eventDate}</span>
                {lightboxItem.eventName && <span>• {lightboxItem.eventName}</span>}
              </div>
              <h2 className="text-lg font-bold text-white">{lightboxItem.title}</h2>
              <p className="text-slate-300 leading-relaxed">{lightboxItem.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg my-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              อัปโหลดภาพถ่าย หรือ ลิงก์วิดีโอใหม่
            </h3>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              {/* Type Switcher */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">ประเภทสื่อ</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('photo')}
                    className={`py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                      type === 'photo'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>รูปภาพ (Photo)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('video')}
                    className={`py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                      type === 'video'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>วิดีโอ (Video URL)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  ชื่อภาพ / วิดีโอ <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น การแสดงคอนเสิร์ตวันไหว้ครู..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* URL or File input */}
              {type === 'photo' ? (
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-300">
                    เลือกไฟล์รูปภาพจากเครื่อง หรือใส่ URL ภาพ
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-slate-400 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                  />
                  <div className="text-center text-[10px] text-slate-500">— หรือ —</div>
                  <input
                    type="url"
                    placeholder="วาง URL รูปภาพ (https://...)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    ลิงก์วิดีโอ (YouTube / Drive / MP4) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="เช่น https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">สำหรับชุมนุม</label>
                  <select
                    value={clubType}
                    onChange={(e) => setClubType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="วงโยธวาทิต">วงโยธวาทิต</option>
                    <option value="ดนตรีสากล">ดนตรีสากล</option>
                    <option value="all">ทั้ง 2 ชุมนุม (ร่วมกัน)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">วันที่ถ่าย / วันงาน</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">ชื่องาน / กิจกรรม</label>
                <input
                  type="text"
                  placeholder="เช่น การประกวดดนตรีมัธยมศึกษาประจำปี 2569"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">คำบรรยายภาพ / วิดีโอ</label>
                <textarea
                  rows={2}
                  placeholder="เขียนบรรยายความประทับใจ..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  อัปโหลดและบันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
