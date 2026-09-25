import React, { useState } from 'react';
import { Student, ClubType } from '../../types';
import { useApp } from '../../context/AppContext';
import { LogoBadge } from '../common/LogoBadge';
import { X, Printer, Download, FileText, Check } from 'lucide-react';

interface OfficialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  filterClubType: string;
  sortBy: string;
}

export const OfficialReportModal: React.FC<OfficialReportModalProps> = ({
  isOpen,
  onClose,
  students,
  filterClubType,
  sortBy,
}) => {
  const { settings } = useApp();

  const [documentTitle, setDocumentTitle] = useState(
    'บัญชีรายชื่อนักเรียน ชุมนุมดนตรีสากลและวงโยธวาทิต เพื่อขอตัวเข้าร่วมกิจกรรมและฝึกซ้อม'
  );
  const [activityName, setActivityName] = useState(
    'การฝึกซ้อมและเข้าร่วมการประกวดวงดนตรีและวงโยธวาทิต ประจำปีการศึกษา 2569'
  );
  const [locationName, setLocationName] = useState(
    'สนามกีฬาและหอประชุม โรงเรียนกาญจนาภิเษกวิทยาลัย ชัยภูมิ'
  );
  const [docDate, setDocDate] = useState(() => {
    const today = new Date();
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
    ];
    return `${today.getDate()} ${thaiMonths[today.getMonth()]} พ.ศ. ${today.getFullYear() + 543}`;
  });

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['ลำดับ', 'รหัสนักเรียน', 'ชื่อ-นามสกุล', 'ชื่อเล่น', 'ระดับชั้น', 'ชุมนุม', 'ตำแหน่ง/เครื่องดนตรี', 'เบอร์โทร', 'สถานะ'];
    const rows = students.map((s, idx) => [
      idx + 1,
      s.studentId,
      `${s.firstName} ${s.lastName}`,
      s.nickName,
      `${s.grade}/${s.room}`,
      s.clubType,
      s.position,
      s.phone || '-',
      s.status === 'active' ? 'ปกติ' : 'ลาออกแล้ว',
    ]);

    const csvContent = '\uFEFF' + [headers, ...rows].map((e) => e.map((val) => `"${val}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `รายชื่อนักเรียน_KPCH_Band_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-4 sm:p-6 text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header Controls - Hidden during print */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                แบบพิมพ์รายชื่อนักเรียนทางการ (PDF / เอกสารราชการ)
              </h2>
              <p className="text-xs text-slate-400">
                พร้อมหัวเอกสารโรงเรียนกาญจนาภิเษกวิทยาลัย ชัยภูมิ และช่องลงนาม 4 ตำแหน่ง
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="ดาวน์โหลดไฟล์ CSV"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>ส่งออก CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>สั่งพิมพ์ / บันทึกเป็น PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Customizable parameters for the letter - Hidden during print */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4 p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-xs no-print">
          <div>
            <label className="text-slate-400 block mb-1">หัวเรื่องเอกสาร:</label>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">ชื่อกิจกรรม / การขอตัว:</label>
            <input
              type="text"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">วันที่ออกเอกสาร:</label>
            <input
              type="text"
              value={docDate}
              onChange={(e) => setDocDate(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs"
            />
          </div>
        </div>

        {/* Printable Area */}
        <div className="flex-1 overflow-y-auto bg-white text-black p-6 sm:p-10 rounded-2xl printable-document font-['Sarabun',sans-serif]">
          {/* Document Header */}
          <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-4">
            <div className="w-20 h-20 shrink-0">
              <LogoBadge size="lg" />
            </div>
            <div className="text-center flex-1 px-4">
              <h1 className="text-xl font-bold tracking-tight text-black">
                {settings.schoolName}
              </h1>
              <h2 className="text-base font-semibold text-black mt-0.5">
                กลุ่มสาระการเรียนรู้ศิลปะ (ชุมนุมดนตรีสากลและวงโยธวาทิต KPCH Band)
              </h2>
              <p className="text-xs text-gray-700 mt-1">
                {documentTitle}
              </p>
            </div>
            <div className="w-20 text-right text-xs text-gray-600">
              <p className="font-semibold">เอกสารทางการ</p>
              <p className="text-[10px] mt-1">รหัสเอกสาร</p>
              <p className="font-mono text-[11px]">KPCH-BAND/69</p>
            </div>
          </div>

          {/* Letter description */}
          <div className="text-sm space-y-1 mb-4 text-black">
            <div className="flex justify-between text-xs text-gray-700">
              <span><strong>กิจกรรม:</strong> {activityName}</span>
              <span><strong>วันที่:</strong> {docDate}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-700">
              <span><strong>สถานที่:</strong> {locationName}</span>
              <span><strong>ประเภท:</strong> {filterClubType === 'all' ? 'ทุกประเภท (ดนตรีสากล & วงโยฯ)' : filterClubType} ({students.length} คน)</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-black text-xs text-black">
              <thead>
                <tr className="bg-gray-100 font-bold text-center">
                  <th className="border border-black p-1.5 w-10">ลำดับ</th>
                  <th className="border border-black p-1.5 w-20">รหัสนักเรียน</th>
                  <th className="border border-black p-1.5 text-left">ชื่อ - สกุล</th>
                  <th className="border border-black p-1.5 w-16">ชื่อเล่น</th>
                  <th className="border border-black p-1.5 w-16">ระดับชั้น</th>
                  <th className="border border-black p-1.5 w-24">ชุมนุม</th>
                  <th className="border border-black p-1.5 text-left">ตำแหน่ง / เครื่องดนตรี</th>
                  <th className="border border-black p-1.5 w-24">เบอร์โทรศัพท์</th>
                  <th className="border border-black p-1.5 w-20">ลายมือชื่อ</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st, index) => (
                  <tr key={st.id} className="text-center hover:bg-gray-50">
                    <td className="border border-black p-1">{index + 1}</td>
                    <td className="border border-black p-1 font-mono font-medium">{st.studentId}</td>
                    <td className="border border-black p-1 text-left font-medium">
                      {st.firstName} {st.lastName}
                    </td>
                    <td className="border border-black p-1">{st.nickName}</td>
                    <td className="border border-black p-1">{st.grade}/{st.room}</td>
                    <td className="border border-black p-1 text-[11px]">{st.clubType}</td>
                    <td className="border border-black p-1 text-left text-[11px]">{st.position}</td>
                    <td className="border border-black p-1 font-mono text-[10px]">{st.phone || '-'}</td>
                    <td className="border border-black p-1 text-gray-300 text-[10px]">....................</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures Footer */}
          <div className="mt-8 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs text-black">
            <div className="space-y-1">
              <p>ลงชื่อ..................................................</p>
              <p className="font-semibold">({settings.bandDirectorName})</p>
              <p className="text-[11px] text-gray-700">ครูผู้ฝึกสอนและควบคุมวง</p>
            </div>
            <div className="space-y-1">
              <p>ลงชื่อ..................................................</p>
              <p className="font-semibold">({settings.headOfMusicDepartment})</p>
              <p className="text-[11px] text-gray-700">หัวหน้ากลุ่มสาระฯ ศิลปะ</p>
            </div>
            <div className="space-y-1">
              <p>ลงชื่อ..................................................</p>
              <p className="font-semibold">(..................................................)</p>
              <p className="text-[11px] text-gray-700">รองผู้อำนวยการกลุ่มบริหารวิชาการ</p>
            </div>
            <div className="space-y-1">
              <p>ลงชื่อ..................................................</p>
              <p className="font-semibold">({settings.schoolDirectorName})</p>
              <p className="text-[11px] text-gray-700">ผู้อำนวยการโรงเรียนกาญจนาภิเษกวิทยาลัย ชัยภูมิ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
