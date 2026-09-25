import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  TeacherUser,
  AttendanceRecord,
  StudentRequest,
  Announcement,
  CalendarEvent,
  MediaItem,
  AppNotification,
  AppSettings,
  UserRole,
  AttendanceStatus,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_REQUESTS,
  INITIAL_ATTENDANCE,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_MEDIA,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
} from '../data/initialData';

interface AppContextType {
  currentUser: Student | TeacherUser | null;
  userRole: UserRole | 'guest';
  students: Student[];
  teachers: TeacherUser[];
  announcements: Announcement[];
  requests: StudentRequest[];
  attendance: AttendanceRecord[];
  calendarEvents: CalendarEvent[];
  mediaItems: MediaItem[];
  notifications: AppNotification[];
  settings: AppSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // Auth
  studentLogin: (studentId: string) => { success: boolean; message: string; student?: Student };
  teacherLogin: (username: string, password: string) => { success: boolean; message: string; teacher?: TeacherUser };
  logout: () => void;
  registerStudent: (data: Omit<Student, 'id' | 'joinedDate' | 'status'>) => { success: boolean; message: string; student?: Student };
  // Attendance
  recordAttendanceByStudentId: (
    studentId: string,
    session?: AttendanceRecord['session'],
    status?: AttendanceStatus,
    note?: string
  ) => { success: boolean; message: string; student?: Student; record?: AttendanceRecord };
  bulkRecordAttendance: (records: { studentId: string; status: AttendanceStatus; note?: string }[], session: AttendanceRecord['session'], date: string) => void;
  // Requests
  submitRequest: (data: Omit<StudentRequest, 'id' | 'status' | 'submittedAt'>) => { success: boolean; message: string };
  reviewRequest: (requestId: string, status: 'approved' | 'rejected', reviewComment?: string) => void;
  // Announcements
  addAnnouncement: (data: Omit<Announcement, 'id' | 'date'>) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  // Calendar
  addCalendarEvent: (data: Omit<CalendarEvent, 'id'>) => void;
  deleteCalendarEvent: (id: string) => void;
  // Media Gallery
  addMediaItem: (data: Omit<MediaItem, 'id'>) => void;
  deleteMediaItem: (id: string) => void;
  // Admin & Teachers
  addTeacher: (data: Omit<TeacherUser, 'id' | 'createdAt'>) => { success: boolean; message: string };
  updateTeacher: (id: string, updates: Partial<TeacherUser>) => void;
  deleteTeacher: (id: string) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'kpch_band_';

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage write error', err);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => getStorage('students', INITIAL_STUDENTS));
  const [teachers, setTeachers] = useState<TeacherUser[]>(() => getStorage('teachers', INITIAL_TEACHERS));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => getStorage('announcements', INITIAL_ANNOUNCEMENTS));
  const [requests, setRequests] = useState<StudentRequest[]>(() => getStorage('requests', INITIAL_REQUESTS));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => getStorage('attendance', INITIAL_ATTENDANCE));
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => getStorage('calendar', INITIAL_CALENDAR_EVENTS));
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => getStorage('media', INITIAL_MEDIA));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getStorage('notifications', INITIAL_NOTIFICATIONS));
  const [settings, setSettings] = useState<AppSettings>(() => getStorage('settings', INITIAL_SETTINGS));

  const [currentUser, setCurrentUser] = useState<Student | TeacherUser | null>(() => {
    const stored = getStorage<Student | TeacherUser | null>('currentUser', null);
    // Never restore admin or teacher session from storage to prevent students from accessing staff accounts on shared computers
    if (stored && 'role' in stored && (stored.role === 'admin' || stored.role === 'teacher')) {
      return null;
    }
    return stored;
  });
  const [userRole, setUserRole] = useState<UserRole | 'guest'>(() => {
    const storedRole = getStorage<UserRole | 'guest'>('userRole', 'guest');
    // Never restore admin or teacher role from storage
    if (storedRole === 'admin' || storedRole === 'teacher') {
      return 'guest';
    }
    return storedRole;
  });
  const [activeTab, setActiveTab] = useState<string>('home');

  // Sync to local storage
  useEffect(() => { setStorage('students', students); }, [students]);
  useEffect(() => { setStorage('teachers', teachers); }, [teachers]);
  useEffect(() => { setStorage('announcements', announcements); }, [announcements]);
  useEffect(() => { setStorage('requests', requests); }, [requests]);
  useEffect(() => { setStorage('attendance', attendance); }, [attendance]);
  useEffect(() => { setStorage('calendar', calendarEvents); }, [calendarEvents]);
  useEffect(() => { setStorage('media', mediaItems); }, [mediaItems]);
  useEffect(() => { setStorage('notifications', notifications); }, [notifications]);
  useEffect(() => { setStorage('settings', settings); }, [settings]);
  useEffect(() => {
    // Only persist student sessions; admin and teacher sessions are never saved to localStorage
    if (currentUser && 'role' in currentUser && (currentUser.role === 'admin' || currentUser.role === 'teacher')) {
      setStorage('currentUser', null);
      setStorage('userRole', 'guest');
    } else {
      setStorage('currentUser', currentUser);
      setStorage('userRole', userRole);
    }
  }, [currentUser, userRole]);

  // Student Login by Student ID
  const studentLogin = (studentId: string) => {
    const trimmed = studentId.trim();
    const found = students.find((s) => s.studentId === trimmed);
    if (!found) {
      return { success: false, message: `ไม่พบข้อมูลรหัสนักเรียน "${trimmed}" ในระบบ กรุณาลงทะเบียนสมัครเข้าชุมนุมก่อน` };
    }
    if (found.status === 'resigned') {
      return { success: false, message: `รหัสนักเรียน "${trimmed}" มีสถานะลาออกจากชุมนุมแล้ว กรุณาติดต่อคุณครูผู้ดูแล` };
    }
    setCurrentUser(found);
    setUserRole('student');
    return { success: true, message: `ยินดีต้อนรับ ${found.firstName} ${found.lastName} (${found.nickName}) เข้าสู่ระบบ`, student: found };
  };

  // Teacher/Admin Login
  const teacherLogin = (username: string, password: string) => {
    const trimmedUser = username.trim().toLowerCase();
    const found = teachers.find((t) => t.username.toLowerCase() === trimmedUser && t.password === password);
    if (!found) {
      return { success: false, message: 'ชื่อผู้ใช้ (Name) หรือ รหัสผ่าน (Password) ไม่ถูกต้อง' };
    }
    setCurrentUser(found);
    setUserRole(found.role);
    return { success: true, message: `เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ ${found.fullName}`, teacher: found };
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole('guest');
    setStorage('currentUser', null);
    setStorage('userRole', 'guest');
    setActiveTab('home');
  };

  // Register Student
  const registerStudent = (data: Omit<Student, 'id' | 'joinedDate' | 'status'>) => {
    if (!settings.registrationOpen) {
      return { success: false, message: 'ขณะนี้ระบบปิดรับสมัครสมาชิกใหม่ชั่วคราว กรุณาติดต่อคุณครูผู้ดูแล' };
    }
    const cleanId = data.studentId.trim();
    if (students.some((s) => s.studentId === cleanId)) {
      return { success: false, message: `รหัสนักเรียน "${cleanId}" มีการลงทะเบียนในระบบแล้ว` };
    }

    const newStudent: Student = {
      ...data,
      id: 's-' + Date.now(),
      studentId: cleanId,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Send automatic welcome notification to student
    const welcomeNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      recipientStudentId: cleanId,
      title: 'ยินดีต้อนรับสู่ครอบครัว KPCH Band!',
      message: `ยินดีต้อนรับ ${data.firstName} (${data.nickName}) เข้าสู่ชุมนุม${data.clubType} ตำแหน่ง ${data.position} คุณสามารถเข้าสู่ระบบด้วยรหัสนักเรียนนี้ได้ทันที`,
      type: 'system',
      isRead: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);

    // Log the student in automatically
    setCurrentUser(newStudent);
    setUserRole('student');

    return {
      success: true,
      message: `ลงทะเบียนสำเร็จ! ยินดีต้อนรับ ${data.firstName} ${data.lastName} เข้าสู่ชุมนุม${data.clubType}`,
      student: newStudent,
    };
  };

  // Attendance checking by student ID
  const recordAttendanceByStudentId = (
    studentId: string,
    session: AttendanceRecord['session'] = 'evening',
    status: AttendanceStatus = 'present',
    note?: string
  ) => {
    // Only teachers and admins are permitted to record attendance
    if (userRole === 'student') {
      return {
        success: false,
        message: 'นักเรียนสามารถตรวจสอบข้อมูลการเข้าซ้อมได้เท่านั้น การเช็คชื่อต้องดำเนินการโดยคุณครูหรือผู้ดูแลระบบ',
      };
    }

    const cleanId = studentId.trim();
    const student = students.find((s) => s.studentId === cleanId);
    if (!student) {
      return { success: false, message: `ไม่พบรหัสนักเรียน "${cleanId}" ในฐานข้อมูลชุมนุม` };
    }

    const today = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    // Check if already checked today for this session
    const existingIndex = attendance.findIndex(
      (a) => a.studentId === cleanId && a.date === today && a.session === session
    );

    const checkedByName = currentUser && 'fullName' in currentUser ? currentUser.fullName : 'ครูผู้ควบคุม';

    let updatedRecord: AttendanceRecord;

    if (existingIndex >= 0) {
      updatedRecord = {
        ...attendance[existingIndex],
        status,
        note: note || attendance[existingIndex].note,
        checkedBy: checkedByName,
        timestamp: `${today} ${timestamp}`,
      };
      setAttendance((prev) => {
        const next = [...prev];
        next[existingIndex] = updatedRecord;
        return next;
      });
      return {
        success: true,
        message: `อัปเดตสถานะเช็คชื่อ ${student.firstName} ${student.lastName} (${student.nickName} - ${student.grade}/${student.room}) เป็น "${status === 'present' ? 'มาซ้อม' : status === 'late' ? 'มาสาย' : status === 'leave' ? 'ลา' : 'ขาด'}"`,
        student,
        record: updatedRecord,
      };
    } else {
      updatedRecord = {
        id: 'att-' + Date.now(),
        date: today,
        session,
        studentId: cleanId,
        status,
        note,
        checkedBy: checkedByName,
        timestamp: `${today} ${timestamp}`,
      };
      setAttendance((prev) => [updatedRecord, ...prev]);
      return {
        success: true,
        message: `เช็คชื่อสำเร็จ: ${student.firstName} ${student.lastName} (${student.nickName}) - ${student.position} [${student.clubType}]`,
        student,
        record: updatedRecord,
      };
    }
  };

  const bulkRecordAttendance = (
    records: { studentId: string; status: AttendanceStatus; note?: string }[],
    session: AttendanceRecord['session'],
    date: string
  ) => {
    // Only teachers and admins can bulk record attendance
    if (userRole === 'student') {
      return;
    }

    const checkedByName = currentUser && 'fullName' in currentUser ? currentUser.fullName : 'ครูผู้ควบคุม';
    const timestamp = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    setAttendance((prev) => {
      const filtered = prev.filter((a) => !(a.date === date && a.session === session && records.some((r) => r.studentId === a.studentId)));
      const newItems: AttendanceRecord[] = records.map((r, idx) => ({
        id: `att-${Date.now()}-${idx}`,
        date,
        session,
        studentId: r.studentId,
        status: r.status,
        note: r.note,
        checkedBy: checkedByName,
        timestamp: `${date} ${timestamp}`,
      }));
      return [...newItems, ...filtered];
    });
  };

  // Student submits leave or resignation request
  const submitRequest = (data: Omit<StudentRequest, 'id' | 'status' | 'submittedAt'>) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newReq: StudentRequest = {
      ...data,
      id: 'req-' + Date.now(),
      status: 'pending',
      submittedAt: now,
    };
    setRequests((prev) => [newReq, ...prev]);

    // Notify teachers
    const typeLabel = data.type === 'leave' ? 'ขอลา' : 'ขอลาออก';
    const notif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: `มีคำขอใหม่: ${typeLabel} จาก ${data.studentName}`,
      message: `${data.studentName} (${data.grade} - ${data.clubType}) ได้ยื่นคำ${typeLabel}: "${data.reason.substring(0, 50)}..."`,
      type: 'request_status',
      isRead: false,
      createdAt: now,
    };
    setNotifications((prev) => [notif, ...prev]);

    return {
      success: true,
      message: `ส่งคำ${typeLabel}เรียบร้อยแล้ว กรุณารอคุณครูผู้ดูแลพิจารณาอนุมัติ`,
    };
  };

  // Teacher / Admin reviews request (Approve / Reject)
  const reviewRequest = (requestId: string, status: 'approved' | 'rejected', reviewComment?: string) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    const reviewerName = currentUser && 'fullName' in currentUser ? currentUser.fullName : 'ครูผู้ดูแล';
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status,
              reviewedBy: reviewerName,
              reviewComment: reviewComment || (status === 'approved' ? 'อนุมัติเรียบร้อย' : 'ไม่อนุมัติ'),
              reviewedAt: now,
            }
          : r
      )
    );

    // If resignation approved, update student status to 'resigned'
    if (req.type === 'resignation' && status === 'approved') {
      setStudents((prev) =>
        prev.map((s) => (s.studentId === req.studentId ? { ...s, status: 'resigned' } : s))
      );
    }

    // AUTOMATIC NOTIFICATION SYSTEM: Alert student about status update!
    const reqTypeName = req.type === 'leave' ? 'ขอลา' : 'ขอลาออกจากชุมนุม';
    const statusText = status === 'approved' ? 'ได้รับการอนุมัติแล้ว ✅' : 'ไม่ได้รับการอนุมัติ ❌';
    const autoNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      recipientStudentId: req.studentId,
      title: `ผลการพิจารณาคำ${reqTypeName}: ${statusText}`,
      message: `${reviewerName} ได้พิจารณาคำ${reqTypeName}ของคุณ (${req.reason.substring(0, 40)}...) ผลคือ "${statusText}" ${
        reviewComment ? `หมายเหตุจากครู: ${reviewComment}` : ''
      }`,
      type: 'request_status',
      isRead: false,
      createdAt: now,
    };
    setNotifications((prev) => [autoNotif, ...prev]);
  };

  // Announcements
  const addAnnouncement = (data: Omit<Announcement, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newAnn: Announcement = {
      ...data,
      id: 'ann-' + Date.now(),
      date: today,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    // AUTOMATIC NOTIFICATION: Alert students about new announcement!
    const notif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: `📢 ประกาศใหม่: ${data.title}`,
      message: `${data.content.substring(0, 100)}... โดย ${data.author}`,
      type: 'announcement',
      isRead: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Calendar
  const addCalendarEvent = (data: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...data,
      id: 'cal-' + Date.now(),
    };
    setCalendarEvents((prev) => [...prev, newEvent]);

    // Notify students about upcoming event/rehearsal
    const notif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: `📅 เพิ่มกิจกรรมในปฏิทิน: ${data.title}`,
      message: `วันที่ ${data.date} เวลา ${data.timeStart} - ${data.timeEnd} น. ณ ${data.location}`,
      type: 'calendar',
      isRead: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents((prev) => prev.filter((c) => c.id !== id));
  };

  // Media Items
  const addMediaItem = (data: Omit<MediaItem, 'id'>) => {
    const newItem: MediaItem = {
      ...data,
      id: 'med-' + Date.now(),
    };
    setMediaItems((prev) => [newItem, ...prev]);
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems((prev) => prev.filter((m) => m.id !== id));
  };

  // Teachers management by Admin
  const addTeacher = (data: Omit<TeacherUser, 'id' | 'createdAt'>) => {
    const cleanUser = data.username.trim();
    if (teachers.some((t) => t.username.toLowerCase() === cleanUser.toLowerCase())) {
      return { success: false, message: `มีชื่อผู้ใช้ "${cleanUser}" อยู่ในระบบแล้ว` };
    }
    const newTeacher: TeacherUser = {
      ...data,
      id: 't-' + Date.now(),
      username: cleanUser,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTeachers((prev) => [...prev, newTeacher]);
    return { success: true, message: `เพิ่มบัญชีครู/ผู้ดูแล "${cleanUser}" สำเร็จ` };
  };

  const updateTeacher = (id: string, updates: Partial<TeacherUser>) => {
    setTeachers((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTeacher = (id: string) => {
    if (teachers.length <= 1) return;
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    // If student updated is the currently logged in student
    if (currentUser && 'studentId' in currentUser && currentUser.id === id) {
      setCurrentUser((prev) => (prev ? ({ ...prev, ...updates } as Student) : null));
    }
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (currentUser && 'studentId' in currentUser && currentUser.id === id) {
      logout();
    }
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const resetToInitialData = () => {
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setRequests(INITIAL_REQUESTS);
    setAttendance(INITIAL_ATTENDANCE);
    setCalendarEvents(INITIAL_CALENDAR_EVENTS);
    setMediaItems(INITIAL_MEDIA);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SETTINGS);
    setCurrentUser(null);
    setUserRole('guest');
    setActiveTab('home');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole,
        students,
        teachers,
        announcements,
        requests,
        attendance,
        calendarEvents,
        mediaItems,
        notifications,
        settings,
        activeTab,
        setActiveTab,
        studentLogin,
        teacherLogin,
        logout,
        registerStudent,
        recordAttendanceByStudentId,
        bulkRecordAttendance,
        submitRequest,
        reviewRequest,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        addCalendarEvent,
        deleteCalendarEvent,
        addMediaItem,
        deleteMediaItem,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        updateStudent,
        deleteStudent,
        updateSettings,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetToInitialData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
