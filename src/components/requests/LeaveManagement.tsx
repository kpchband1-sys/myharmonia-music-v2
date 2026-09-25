import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentRequest, RequestStatus, RequestType } from '../../types';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  AlertCircle,
  MessageSquare,
  Sparkles,
  PlusCircle,
  LogOut,
} from 'lucide-react';

export const LeaveManagement: React.FC = () => {
  const { requests, reviewRequest, userRole, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedType, setSelectedType] = useState<'all' | RequestType>('all');
  const [reviewModalRequest, setReviewModalRequest] = useState<StudentRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected'>('approved');
  const [reviewComment, setReviewComment] = useState('');

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    if (activeTab !== 'all' && r.status !== activeTab) return false;
    if (selectedType !== 'all' && r.type !== selectedType) return false;
    return true;
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  const handleOpenReview = (req: StudentRequest, action: 'approved' | 'rejected') => {
    setReviewModalRequest(req);
    setReviewAction(action);
    setReviewComment(action === 'approved' ? 'อนุมัติเรียบร้อย ขอให้ติดตามบทเพลงฝึกซ้อม' : 'ไม่อนุมัติ เนื่องจากมีคิวซ้อมสำคัญ');
  };

  const handleConfirmReview = () => {
    if (!reviewModalRequest) return;
    reviewRequest(reviewModalRequest.id, reviewAction, reviewComment);
    setReviewModalRequest(null);
  };

  const getLeaveCategoryBadge = (cat?: string) => {
    switch (cat) {
      case 'sick':
        return <span className="px-2 py-0.5 rounded-md text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30">ลาป่วย</span>;
      case 'errand':
        return <span className="px-2 py-0.5 rounded-md text-[11px] bg-blue-500/20 text-blue-300 border border-blue-500/30">ลากิจ</span>;
      case 'academic':
        return <span className="px-2 py-0.5 rounded-md text-[11px] bg-purple-500/20 text-purple-300 border border-purple-500/30">วิชาการ/สอบ</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[11px] bg-slate-800 text-slate-300">ทั่วไป</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              ระบบพิจารณาคำขอลาและขอลาออก
            </h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                รออนุมัติ {pendingCount} รายการ
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            คุณครูผู้ดูแลสามารถตรวจสอบเหตุผลและกดอนุมัติหรือไม่อนุมัติคำขอ พร้อมระบบส่งการแจ้งเตือนไปยังนักเรียนทันที
          </p>
        </div>

        {/* Request Type Selector */}
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedType === 'all' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setSelectedType('leave')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedType === 'leave' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            ขอลา
          </button>
          <button
            onClick={() => setSelectedType('resignation')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedType === 'resignation' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            ขอลาออก
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex p-1 bg-slate-900/80 rounded-2xl border border-slate-800/90 text-xs sm:text-sm font-medium">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>รอพิจารณา</span>
          {pendingCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-amber-700 text-[11px] font-black flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'approved'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>อนุมัติแล้ว</span>
        </button>

        <button
          onClick={() => setActiveTab('rejected')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'rejected'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <XCircle className="w-4 h-4" />
          <span>ไม่อนุมัติ</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>ทั้งหมด ({requests.length})</span>
        </button>
      </div>

      {/* Requests Grid / Cards */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/60 rounded-3xl border border-slate-800/80 text-slate-500">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-medium">ไม่มีรายการคำขอในหมวดหมู่นี้</p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className={`p-5 rounded-2xl border transition-all ${
                req.status === 'pending'
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : req.status === 'approved'
                  ? 'bg-slate-900/60 border-emerald-500/30'
                  : 'bg-slate-900/60 border-rose-500/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      req.type === 'leave'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {req.type === 'leave' ? 'ลา' : 'ออก'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">
                        {req.studentName}
                      </span>
                      <span className="font-mono text-xs text-blue-400">
                        (รหัส: {req.studentId})
                      </span>
                      <span className="text-xs text-slate-400">
                        {req.grade} • {req.clubType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-semibold text-slate-300">
                        คำขอ: {req.type === 'leave' ? 'ขอลาฝึกซ้อม' : 'ขอลาออกจากชุมนุม'}
                      </span>
                      {req.type === 'leave' && getLeaveCategoryBadge(req.leaveCategory)}
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {req.status === 'pending' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> รอคุณครูพิจารณา
                    </span>
                  ) : req.status === 'approved' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> อนุมัติแล้ว
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" /> ไม่อนุมัติ
                    </span>
                  )}
                </div>
              </div>

              {/* Details & Reason */}
              <div className="pt-3 space-y-2 text-xs sm:text-sm">
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <strong>ช่วงวันที่:</strong> {req.startDate} {req.endDate && req.endDate !== req.startDate ? `ถึง ${req.endDate}` : ''}
                  </span>
                  <span>
                    <strong>ส่งเมื่อ:</strong> {req.submittedAt}
                  </span>
                </div>

                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-slate-200">
                  <span className="text-slate-400 font-semibold block text-xs mb-1">เหตุผลที่ระบุ:</span>
                  <p className="leading-relaxed">{req.reason}</p>
                </div>

                {/* Review feedback if already reviewed */}
                {req.reviewedBy && (
                  <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 text-xs">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span><strong>พิจารณาโดย:</strong> {req.reviewedBy}</span>
                      <span>{req.reviewedAt}</span>
                    </div>
                    {req.reviewComment && (
                      <p className="text-slate-300">
                        <strong>ข้อความตอบกลับ:</strong> {req.reviewComment}
                      </p>
                    )}
                  </div>
                )}

                {/* Action buttons for Teacher / Admin */}
                {req.status === 'pending' && (
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenReview(req, 'rejected')}
                      className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-semibold rounded-xl border border-rose-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>ไม่อนุมัติ</span>
                    </button>
                    <button
                      onClick={() => handleOpenReview(req, 'approved')}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>อนุมัติคำขอ</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {reviewModalRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100">
            <h3 className="text-lg font-bold text-white mb-2">
              {reviewAction === 'approved' ? 'ยืนยันการอนุมัติคำขอ' : 'ยืนยันการปฏิเสธ (ไม่อนุมัติ)'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              คำขอของ <strong>{reviewModalRequest.studentName}</strong> (รหัส {reviewModalRequest.studentId})
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ข้อความชี้แจง / หมายเหตุตอบกลับถึงนักเรียน
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>ระบบจะส่งการแจ้งเตือนอัตโนมัติแจ้งผลไปยังบัญชีของนักเรียนทันที</span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setReviewModalRequest(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmReview}
                className={`flex-1 py-2.5 text-white text-xs font-bold rounded-xl shadow-lg cursor-pointer ${
                  reviewAction === 'approved'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                }`}
              >
                ยืนยันผลการพิจารณา
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
