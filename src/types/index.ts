export type ClubType = 'ดนตรีสากล' | 'วงโยธวาทิต';

export type GradeLevel = 'ม.1' | 'ม.2' | 'ม.3' | 'ม.4' | 'ม.5' | 'ม.6';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface Student {
  id: string; // unique internal id
  studentId: string; // e.g. "54321" (5 digits)
  firstName: string; // ชื่อ
  lastName: string; // นามสกุล
  nickName: string; // ชื่อเล่น
  grade: GradeLevel; // ชั้น เช่น ม.1 - ม.6
  room: string; // ห้อง เช่น "1", "2" (e.g. ม.4/2)
  clubType: ClubType; // ดนตรีสากล หรือ วงโยธวาทิต
  position: string; // ตำแหน่ง / เครื่องดนตรี เช่น ทรัมเป็ต, กลองชุด, กีตาร์เบส
  phone?: string; // เบอร์โทรศัพท์
  parentPhone?: string; // เบอร์ผู้ปกครอง
  joinedDate: string; // วันที่สมัคร
  status: 'active' | 'resigned' | 'suspended';
  avatarUrl?: string;
  notes?: string;
}

export interface TeacherUser {
  id: string;
  username: string; // Name for login
  password: string; // Admin can set this
  fullName: string;
  role: 'teacher' | 'admin';
  clubResponsible?: ClubType | 'ทั้งหมด' | 'all';
  assignedClub?: ClubType | 'all';
  phone?: string;
  createdAt: string;
}

export type AttendanceStatus = 'present' | 'late' | 'leave' | 'absent';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  session: 'morning' | 'evening' | 'club_period' | 'special_camp';
  studentId: string;
  status: AttendanceStatus;
  note?: string;
  checkedBy: string; // Teacher name
  timestamp: string;
}

export type RequestType = 'leave' | 'resignation'; // ขอลา หรือ ขอลาออก
export type LeaveCategory = 'sick' | 'errand' | 'academic' | 'other';
export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface StudentRequest {
  id: string;
  studentId: string; // matches student.studentId
  studentName: string;
  grade: string;
  clubType: ClubType;
  type: RequestType;
  leaveCategory?: LeaveCategory; // for leave
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  reason: string;
  status: RequestStatus;
  reviewedBy?: string;
  reviewComment?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'rehearsal' | 'performance' | 'general' | 'award';
  targetClub: 'all' | 'ดนตรีสากล' | 'วงโยธวาทิต';
  author: string;
  date: string; // YYYY-MM-DD
  pinned: boolean;
  eventDate?: string;
  location?: string;
  imageUrl?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  timeStart: string; // HH:mm
  timeEnd: string; // HH:mm
  location: string;
  description: string;
  clubType: 'all' | 'ดนตรีสากล' | 'วงโยธวาทิต';
  category: 'rehearsal' | 'competition' | 'show' | 'meeting' | 'other';
  color?: string;
  createdBy: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'photo' | 'video';
  url: string; // Image URL or Video URL / Embed URL / base64
  thumbnail?: string;
  caption?: string;
  description?: string;
  date?: string;
  eventDate?: string;
  eventName?: string;
  clubType: 'all' | 'ดนตรีสากล' | 'วงโยธวาทิต';
  tags?: string[];
  uploadedBy: string;
}

export interface AppNotification {
  id: string;
  recipientStudentId?: string; // if null, broadcast to all
  title: string;
  message: string;
  type: 'announcement' | 'request_status' | 'attendance' | 'calendar' | 'system';
  isRead: boolean;
  createdAt: string;
  linkAction?: string;
}

export interface AppSettings {
  registrationOpen: boolean;
  schoolName: string;
  academicYear?: string;
  schoolDirectorName: string;
  headOfMusicDepartment: string;
  bandDirectorName: string;
  defaultRehearsalTime: string;
  announcementTicker: string;
}
