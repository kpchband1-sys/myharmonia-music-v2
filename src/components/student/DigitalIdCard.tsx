import React, { useState, useRef, useEffect } from 'react';
import { Student } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Download,
  Sparkles,
  Camera,
  RefreshCw,
  Palette,
  Check,
  Music,
  CreditCard,
  QrCode,
  ShieldCheck,
  Share2,
  Copy,
  Printer,
  ChevronRight,
  Eye,
} from 'lucide-react';

interface DigitalIdCardProps {
  student: Student;
}

type CardThemeId = 'navy-gold' | 'cyber-cyan' | 'ruby-crimson' | 'emerald-prestige' | 'cosmic-purple';
type CardLayout = 'vertical' | 'horizontal';

interface CardTheme {
  id: CardThemeId;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgGradStart: string;
  bgGradMid: string;
  bgGradEnd: string;
  borderColor: string;
  cardPreviewClass: string;
  accentBadgeClass: string;
}

const THEMES: CardTheme[] = [
  {
    id: 'navy-gold',
    name: 'มิดไนท์โกลด์ (Midnight Gold)',
    primaryColor: '#eab308',
    secondaryColor: '#3b82f6',
    accentColor: '#facc15',
    bgGradStart: '#0f172a',
    bgGradMid: '#1e293b',
    bgGradEnd: '#090d16',
    borderColor: '#eab308',
    cardPreviewClass: 'from-slate-950 via-slate-900 to-blue-950 border-amber-500/50 shadow-amber-500/10',
    accentBadgeClass: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
  },
  {
    id: 'cyber-cyan',
    name: 'นีออนไซเบอร์ (Electric Cyan)',
    primaryColor: '#06b6d4',
    secondaryColor: '#3b82f6',
    accentColor: '#38bdf8',
    bgGradStart: '#020617',
    bgGradMid: '#082f49',
    bgGradEnd: '#030712',
    borderColor: '#06b6d4',
    cardPreviewClass: 'from-slate-950 via-cyan-950/60 to-slate-950 border-cyan-500/50 shadow-cyan-500/10',
    accentBadgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
  },
  {
    id: 'ruby-crimson',
    name: 'รูบี้คริมสัน (Ruby Crimson)',
    primaryColor: '#f43f5e',
    secondaryColor: '#fb7185',
    accentColor: '#fda4af',
    bgGradStart: '#18070d',
    bgGradMid: '#4c0519',
    bgGradEnd: '#0f0206',
    borderColor: '#f43f5e',
    cardPreviewClass: 'from-slate-950 via-rose-950/60 to-slate-950 border-rose-500/50 shadow-rose-500/10',
    accentBadgeClass: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
  },
  {
    id: 'emerald-prestige',
    name: 'เอเมอรัลด์ (Emerald Prestige)',
    primaryColor: '#10b981',
    secondaryColor: '#34d399',
    accentColor: '#6ee7b7',
    bgGradStart: '#021811',
    bgGradMid: '#064e3b',
    bgGradEnd: '#020f0b',
    borderColor: '#10b981',
    cardPreviewClass: 'from-slate-950 via-emerald-950/60 to-slate-950 border-emerald-500/50 shadow-emerald-500/10',
    accentBadgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
  },
  {
    id: 'cosmic-purple',
    name: 'คอสมิกเพอร์เพิล (Cosmic Purple)',
    primaryColor: '#a855f7',
    secondaryColor: '#c084fc',
    accentColor: '#e9d5ff',
    bgGradStart: '#0f051d',
    bgGradMid: '#3b0764',
    bgGradEnd: '#090214',
    borderColor: '#a855f7',
    cardPreviewClass: 'from-slate-950 via-purple-950/60 to-slate-950 border-purple-500/50 shadow-purple-500/10',
    accentBadgeClass: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
  },
];

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({ student }) => {
  const { settings } = useApp();

  const [selectedThemeId, setSelectedThemeId] = useState<CardThemeId>('navy-gold');
  const [layout, setLayout] = useState<CardLayout>('vertical');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentTheme = THEMES.find((t) => t.id === selectedThemeId) || THEMES[0];
  const academicYear = settings.academicYear || '2569';
  const schoolName = settings.schoolName || 'โรงเรียนกาญจนาภิเษกวิทยาลัย ชัยภูมิ';

  // Handle local photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetPhoto = () => {
    setCustomPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper to draw rounded rectangle
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  // Helper to load image
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = src;
    });
  };

  // Draw high resolution PNG card on canvas
  const renderCardToCanvas = async (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Wait for fonts
    if (document.fonts) {
      try {
        await document.fonts.ready;
      } catch (e) {
        // continue
      }
    }

    const isVert = layout === 'vertical';
    // High DPI dimensions (scale: 2x)
    const W = isVert ? 700 : 1000;
    const H = isVert ? 1100 : 640;

    canvas.width = W;
    canvas.height = H;

    ctx.clearRect(0, 0, W, H);

    // 1. Draw Card Background with luxury gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, currentTheme.bgGradStart);
    bgGrad.addColorStop(0.5, currentTheme.bgGradMid);
    bgGrad.addColorStop(1, currentTheme.bgGradEnd);

    drawRoundedRect(ctx, 16, 16, W - 32, H - 32, 36);
    ctx.fillStyle = bgGrad;
    ctx.fill();

    // Subtle texture: decorative musical staff wave
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      const waveY = isVert ? 260 + i * 16 : 140 + i * 14;
      ctx.moveTo(30, waveY);
      ctx.bezierCurveTo(W * 0.25, waveY - 30, W * 0.75, waveY + 40, W - 30, waveY - 10);
      ctx.stroke();
    }
    ctx.restore();

    // 2. Outer and Inner Borders with Theme Glow
    ctx.save();
    drawRoundedRect(ctx, 16, 16, W - 32, H - 32, 36);
    ctx.lineWidth = 4;
    ctx.strokeStyle = currentTheme.primaryColor;
    ctx.stroke();

    // Inner subtle border
    drawRoundedRect(ctx, 28, 28, W - 56, H - 56, 26);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.stroke();
    ctx.restore();

    // 3. Header Accent Bar
    const headerH = isVert ? 150 : 120;
    const headerGrad = ctx.createLinearGradient(30, 30, W - 60, headerH);
    headerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    headerGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.03)');
    headerGrad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');

    ctx.save();
    drawRoundedRect(ctx, 28, 28, W - 56, headerH, 24);
    ctx.fillStyle = headerGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();
    ctx.restore();

    // Gold decorative top line inside header
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(60, 32);
    ctx.lineTo(W - 60, 32);
    ctx.lineWidth = 3;
    ctx.strokeStyle = currentTheme.primaryColor;
    ctx.stroke();
    ctx.restore();

    // Header Content
    // Insignia icon circle
    const logoX = 75;
    const logoY = isVert ? 100 : 88;
    const logoR = 36;

    ctx.save();
    ctx.beginPath();
    ctx.arc(logoX, logoY, logoR, 0, Math.PI * 2);
    ctx.fillStyle = currentTheme.primaryColor;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Inner icon inside insignia (Trumpet/Musical note)
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 30px "Prompt", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎺', logoX, logoY);
    ctx.restore();

    // School Name & Band Title
    ctx.save();
    ctx.textAlign = 'left';

    // Badge Title
    ctx.fillStyle = currentTheme.accentColor;
    ctx.font = 'bold 16px "Prompt", sans-serif';
    ctx.fillText('KPCH BAND • OFFICIAL MEMBER CARD', logoX + 50, logoY - 22);

    // School Thai Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Prompt", sans-serif';
    ctx.fillText(schoolName, logoX + 50, logoY + 4);

    // Subtitle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '15px "Prompt", sans-serif';
    ctx.fillText(`ชุมนุมดนตรีสากล & วงโยธวาทิต • ปีการศึกษา ${academicYear}`, logoX + 50, logoY + 28);
    ctx.restore();

    if (isVert) {
      // ==========================================
      // VERTICAL VIP BADGE LAYOUT
      // ==========================================

      // Smart Card Chip Graphic (Left side under header)
      const chipX = 60;
      const chipY = 210;
      drawRoundedRect(ctx, chipX, chipY, 65, 48, 8);
      ctx.fillStyle = '#d4af37';
      ctx.fill();
      ctx.strokeStyle = '#996515';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Chip circuit pattern
      ctx.strokeStyle = '#614400';
      ctx.lineWidth = 1;
      ctx.strokeRect(chipX + 8, chipY + 10, 49, 28);
      ctx.beginPath();
      ctx.moveTo(chipX + 32, chipY + 10);
      ctx.lineTo(chipX + 32, chipY + 38);
      ctx.moveTo(chipX + 8, chipY + 24);
      ctx.lineTo(chipX + 57, chipY + 24);
      ctx.stroke();

      // Holographic Member Badge (Right side under header)
      const holoX = W - 190;
      const holoY = 210;
      drawRoundedRect(ctx, holoX, holoY, 130, 36, 18);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fill();
      ctx.strokeStyle = currentTheme.primaryColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = currentTheme.accentColor;
      ctx.font = 'bold 13px "Prompt", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✓ VERIFIED', holoX + 65, holoY + 23);

      // Student Photo / Avatar Area
      const photoSize = 190;
      const photoX = (W - photoSize) / 2;
      const photoY = 290;

      // Glow behind photo
      ctx.save();
      ctx.beginPath();
      ctx.arc(W / 2, photoY + photoSize / 2, photoSize / 2 + 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = currentTheme.primaryColor;
      ctx.stroke();
      ctx.restore();

      // Draw Photo or Initials Monogram
      ctx.save();
      ctx.beginPath();
      ctx.arc(W / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
      ctx.clip();

      if (customPhotoUrl) {
        try {
          const img = await loadImage(customPhotoUrl);
          ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
        } catch (e) {
          // fallback
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(photoX, photoY, photoSize, photoSize);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 64px "Prompt", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(student.nickName.substring(0, 1), W / 2, photoY + photoSize / 2);
        }
      } else {
        // Gradient Monogram
        const monoGrad = ctx.createLinearGradient(photoX, photoY, photoX + photoSize, photoY + photoSize);
        monoGrad.addColorStop(0, currentTheme.secondaryColor);
        monoGrad.addColorStop(1, currentTheme.primaryColor);
        ctx.fillStyle = monoGrad;
        ctx.fillRect(photoX, photoY, photoSize, photoSize);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 74px "Prompt", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(student.nickName.substring(0, 1), W / 2, photoY + photoSize / 2 - 8);

        ctx.font = 'bold 18px "Prompt", sans-serif';
        ctx.fillText('KPCH', W / 2, photoY + photoSize / 2 + 50);
      }
      ctx.restore();

      // Student Name & Nickname
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px "Prompt", sans-serif';
      ctx.fillText(`${student.firstName} ${student.lastName}`, W / 2, 530);

      // Nickname & Role Badge
      ctx.fillStyle = currentTheme.accentColor;
      ctx.font = 'bold 20px "Prompt", sans-serif';
      ctx.fillText(`(น้อง${student.nickName})`, W / 2, 565);
      ctx.restore();

      // Information Table Card (White glassy box)
      const boxX = 50;
      const boxY = 600;
      const boxW = W - 100;
      const boxH = 260;

      ctx.save();
      drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 20);
      ctx.fillStyle = 'rgba(2, 6, 23, 0.65)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Divider lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.moveTo(boxX + 20, boxY + 65);
      ctx.lineTo(boxX + boxW - 20, boxY + 65);
      ctx.moveTo(boxX + 20, boxY + 130);
      ctx.lineTo(boxX + boxW - 20, boxY + 130);
      ctx.moveTo(boxX + 20, boxY + 195);
      ctx.lineTo(boxX + boxW - 20, boxY + 195);
      ctx.stroke();

      // Field 1: รหัสนักเรียน (Student ID)
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '16px "Prompt", sans-serif';
      ctx.fillText('รหัสนักเรียน (Student ID):', boxX + 25, boxY + 40);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(student.studentId, boxX + boxW - 25, boxY + 40);

      // Field 2: ระดับชั้น (Class)
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '16px "Prompt", sans-serif';
      ctx.fillText('ระดับชั้น (Class / Room):', boxX + 25, boxY + 105);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px "Prompt", sans-serif';
      ctx.fillText(`มัธยมศึกษาปีที่ ${student.grade} ห้อง ${student.room}`, boxX + boxW - 25, boxY + 105);

      // Field 3: เครื่องดนตรี / ตำแหน่ง (Instrument)
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '16px "Prompt", sans-serif';
      ctx.fillText('เครื่องดนตรี / ตำแหน่ง:', boxX + 25, boxY + 170);

      ctx.textAlign = 'right';
      ctx.fillStyle = currentTheme.accentColor;
      ctx.font = 'bold 20px "Prompt", sans-serif';
      ctx.fillText(student.position, boxX + boxW - 25, boxY + 170);

      // Field 4: ชุมนุม (Club Type)
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '16px "Prompt", sans-serif';
      ctx.fillText('สังกัดชุมนุม:', boxX + 25, boxY + 235);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 20px "Prompt", sans-serif';
      ctx.fillText(student.clubType, boxX + boxW - 25, boxY + 235);
      ctx.restore();

      // Bottom Barcode & Serial Number
      const barcodeY = 890;
      ctx.save();
      // Draw Barcode lines
      const barcodeW = 400;
      const barcodeStartX = (W - barcodeW) / 2;
      ctx.fillStyle = '#ffffff';

      // Deterministic barcode pattern using student ID
      const seedStr = student.studentId + '88492015';
      let currX = barcodeStartX;
      for (let i = 0; i < seedStr.length * 6; i++) {
        const charCode = seedStr.charCodeAt(i % seedStr.length);
        const barWidth = (charCode % 4) + 1.5;
        const spacing = ((charCode * 3) % 4) + 2;
        if (currX + barWidth > barcodeStartX + barcodeW) break;
        ctx.fillRect(currX, barcodeY, barWidth, 48);
        currX += barWidth + spacing;
      }

      // Barcode digits
      ctx.textAlign = 'center';
      ctx.font = '15px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(`KPCH-${student.studentId}-${academicYear}`, W / 2, barcodeY + 70);

      // Footer notice
      ctx.font = '12px "Prompt", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillText('บัตรนี้เป็นกรรมสิทธิ์ของโรงเรียนกาญจนาภิเษกวิทยาลัย ชัยภูมิ ใช้แสดงตนในการฝึกซ้อม', W / 2, H - 45);
      ctx.restore();
    } else {
      // ==========================================
      // HORIZONTAL WALLET CARD LAYOUT
      // ==========================================
      const leftColW = 340;

      // Smart Card Chip
      const chipX = 55;
      const chipY = 160;
      drawRoundedRect(ctx, chipX, chipY, 60, 44, 8);
      ctx.fillStyle = '#d4af37';
      ctx.fill();
      ctx.strokeStyle = '#996515';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Student Photo on Left
      const photoSize = 175;
      const photoX = 65;
      const photoY = 230;

      ctx.save();
      ctx.beginPath();
      ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2 + 6, 0, Math.PI * 2);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = currentTheme.primaryColor;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
      ctx.clip();

      if (customPhotoUrl) {
        try {
          const img = await loadImage(customPhotoUrl);
          ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
        } catch (e) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(photoX, photoY, photoSize, photoSize);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 50px "Prompt", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(student.nickName.substring(0, 1), photoX + photoSize / 2, photoY + photoSize / 2);
        }
      } else {
        const monoGrad = ctx.createLinearGradient(photoX, photoY, photoX + photoSize, photoY + photoSize);
        monoGrad.addColorStop(0, currentTheme.secondaryColor);
        monoGrad.addColorStop(1, currentTheme.primaryColor);
        ctx.fillStyle = monoGrad;
        ctx.fillRect(photoX, photoY, photoSize, photoSize);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 64px "Prompt", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(student.nickName.substring(0, 1), photoX + photoSize / 2, photoY + photoSize / 2 - 6);
      }
      ctx.restore();

      // Under-photo barcode
      const bcX = 55;
      const bcY = 440;
      ctx.save();
      ctx.fillStyle = '#ffffff';
      const seedStr = student.studentId + '992144';
      let cx = bcX;
      for (let i = 0; i < seedStr.length * 6; i++) {
        const charCode = seedStr.charCodeAt(i % seedStr.length);
        const bw = (charCode % 3) + 1.5;
        const sp = ((charCode * 2) % 3) + 2;
        if (cx + bw > bcX + 195) break;
        ctx.fillRect(cx, bcY, bw, 32);
        cx += bw + sp;
      }
      ctx.textAlign = 'center';
      ctx.font = '12px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(student.studentId, bcX + 98, bcY + 48);
      ctx.restore();

      // Right Column: Student Details
      const rightX = 295;
      const rightW = W - rightX - 55;

      // Student Full Name
      ctx.save();
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px "Prompt", sans-serif';
      ctx.fillText(`${student.firstName} ${student.lastName}`, rightX, 190);

      // Nickname & Club Type Tag
      ctx.fillStyle = currentTheme.accentColor;
      ctx.font = 'bold 18px "Prompt", sans-serif';
      ctx.fillText(`ชื่อเล่น: น้อง${student.nickName}`, rightX, 225);

      // Details Box
      const dBoxY = 250;
      const dBoxH = 220;
      drawRoundedRect(ctx, rightX, dBoxY, rightW, dBoxH, 18);
      ctx.fillStyle = 'rgba(2, 6, 23, 0.6)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Info rows
      const rowY1 = dBoxY + 45;
      const rowY2 = dBoxY + 100;
      const rowY3 = dBoxY + 155;
      const rowY4 = dBoxY + 200;

      // Row 1: Student ID & Class
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '15px "Prompt", sans-serif';
      ctx.fillText('รหัสนักเรียน:', rightX + 20, rowY1);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(student.studentId, rightX + 125, rowY1);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '15px "Prompt", sans-serif';
      ctx.fillText('ชั้น/ห้อง:', rightX + 280, rowY1);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px "Prompt", sans-serif';
      ctx.fillText(`ม.${student.grade}/${student.room}`, rightX + 355, rowY1);

      // Row 2: Instrument / Position
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '15px "Prompt", sans-serif';
      ctx.fillText('ตำแหน่ง / เครื่องดนตรี:', rightX + 20, rowY2);
      ctx.fillStyle = currentTheme.accentColor;
      ctx.font = 'bold 19px "Prompt", sans-serif';
      ctx.fillText(student.position, rightX + 185, rowY2);

      // Row 3: Club Type
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '15px "Prompt", sans-serif';
      ctx.fillText('สังกัดชุมนุม:', rightX + 20, rowY3);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 19px "Prompt", sans-serif';
      ctx.fillText(student.clubType, rightX + 115, rowY3);

      // Verified stamp
      const stampX = rightX + rightW - 130;
      const stampY = 160;
      drawRoundedRect(ctx, stampX, stampY, 115, 34, 17);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fill();
      ctx.strokeStyle = currentTheme.primaryColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = currentTheme.accentColor;
      ctx.font = 'bold 13px "Prompt", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✓ VERIFIED', stampX + 57, stampY + 22);

      // Footer
      ctx.textAlign = 'left';
      ctx.font = '12px "Prompt", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillText(`ปีการศึกษา ${academicYear} • โรงเรียนกาญจนาภิเษกวิทยาลัย ชัยภูมิ • KPCH Band Card`, rightX, H - 42);
      ctx.restore();
    }
  };

  // Download Handler: Render to canvas and trigger PNG download
  const handleDownloadPNG = async () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      const canvas = document.createElement('canvas');
      await renderCardToCanvas(canvas);

      // Convert to blob / data URL
      const dataUrl = canvas.toDataURL('image/png', 1.0);

      // Create download anchor
      const link = document.createElement('a');
      const cleanName = `${student.firstName}_${student.lastName}`.replace(/\s+/g, '_');
      link.download = `KPCH_Band_ID_${student.studentId}_${cleanName}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error downloading PNG:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy to clipboard handler
  const handleCopyToClipboard = async () => {
    try {
      const canvas = document.createElement('canvas');
      await renderCardToCanvas(canvas);

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          setCopiedSuccess(true);
          setTimeout(() => setCopiedSuccess(false), 3000);
        } catch (e) {
          // fallback to download if clipboard write fails
          handleDownloadPNG();
        }
      }, 'image/png');
    } catch (err) {
      console.error('Failed to copy image', err);
    }
  };

  // Print card handler
  const handlePrintCard = async () => {
    const canvas = document.createElement('canvas');
    await renderCardToCanvas(canvas);
    const dataUrl = canvas.toDataURL('image/png', 1.0);

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>พิมพ์บัตรประจำตัวสมาชิก - ${student.firstName} ${student.lastName}</title>
            <style>
              body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 90vh; background: #f1f5f9; font-family: sans-serif; }
              img { max-width: 95%; max-height: 90vh; box-shadow: 0 10px 30px rgba(0,0,0,0.2); border-radius: 16px; }
              @media print {
                body { padding: 0; background: transparent; }
                img { box-shadow: none; max-width: 100%; }
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="window.print();" />
          </body>
        </html>
      `);
      win.document.close();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <span>เครื่องมือสร้างบัตรประจำตัวดิจิทัล (Digital ID Card Generator)</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              VIP Pass
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            บัตรสมาชิกอย่างเป็นทางการพร้อมชื่อ ระดับชั้น ตำแหน่งเครื่องดนตรี และสามารถบันทึกเป็นรูปภาพ PNG ความละเอียดสูงได้ทันที
          </p>
        </div>

        {/* Quick Download Button */}
        <button
          onClick={handleDownloadPNG}
          disabled={isGenerating}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-102 shrink-0 disabled:opacity-50"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{isGenerating ? 'กำลังสร้างรูปภาพ...' : 'บันทึกเป็นรูปภาพ PNG (Save PNG)'}</span>
        </button>
      </div>

      {/* Main Grid: Customization Controls (Left) + Interactive Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card Layout Selector */}
          <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>1. รูปแบบบัตร (Card Orientation)</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setLayout('vertical')}
                className={`py-3 px-4 rounded-2xl font-bold flex flex-col items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  layout === 'vertical'
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="w-6 h-9 rounded-md border-2 border-current flex items-center justify-center text-[10px]">
                  ID
                </div>
                <span>บัตรแนวตั้ง (VIP Badge)</span>
              </button>

              <button
                type="button"
                onClick={() => setLayout('horizontal')}
                className={`py-3 px-4 rounded-2xl font-bold flex flex-col items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  layout === 'horizontal'
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="w-9 h-6 rounded-md border-2 border-current flex items-center justify-center text-[9px]">
                  CARD
                </div>
                <span>บัตรแนวนอน (Wallet Card)</span>
              </button>
            </div>
          </div>

          {/* Color Theme Selector */}
          <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span>2. ธีมสีของบัตร (Color Palette)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {THEMES.map((theme) => {
                const isSelected = selectedThemeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedThemeId(theme.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-blue-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shrink-0 shadow-xs"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      <span className="font-semibold text-xs truncate">{theme.name.split(' ')[0]}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo Customization */}
          <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-blue-400" />
              <span>3. รูปถ่ายบนบัตร (Photo)</span>
            </h3>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 flex items-center justify-center shrink-0">
                {customPhotoUrl ? (
                  <img src={customPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xl font-black text-white">
                    {student.nickName.substring(0, 1)}
                  </div>
                )}
              </div>

              <div className="space-y-2 flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="card-photo-input"
                />
                <label
                  htmlFor="card-photo-input"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{customPhotoUrl ? 'เปลี่ยนรูปภาพ' : 'อัปโหลดรูปถ่ายจริง'}</span>
                </label>

                {customPhotoUrl && (
                  <button
                    onClick={handleResetPhoto}
                    className="block text-[11px] text-slate-400 hover:text-rose-400 underline cursor-pointer"
                  >
                    ใช้สัญลักษณ์ย่อเริ่มต้น
                  </button>
                )}
                <p className="text-[10px] text-slate-500 leading-tight">
                  รองรับภาพถ่ายชุดนักเรียน หรือภาพเล่นเครื่องดนตรี (JPG, PNG)
                </p>
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              4. เครื่องมือบันทึกและแชร์ (Export Options)
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={handleCopyToClipboard}
                className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-blue-400" />
                <span>{copiedSuccess ? 'คัดลอกแล้ว!' : 'คัดลอกรูปภาพ'}</span>
              </button>

              <button
                onClick={handlePrintCard}
                className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-indigo-400" />
                <span>สั่งพิมพ์บัตร</span>
              </button>
            </div>

            {downloadSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>บันทึกไฟล์ภาพ PNG ลงในเครื่องของคุณเรียบร้อยแล้ว!</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Interactive Preview Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-3xl border border-slate-800/80 min-h-[500px]">
          <div className="flex items-center justify-between w-full max-w-md mb-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>ภาพตัวอย่างแบบสมจริง (Live Interactive Card)</span>
            </span>
            <span className="font-mono text-[11px] text-cyan-400">
              {layout === 'vertical' ? '700 × 1100 px' : '1000 × 640 px'}
            </span>
          </div>

          {/* CARD PREVIEW WRAPPER */}
          {layout === 'vertical' ? (
            /* VERTICAL VIP BADGE PREVIEW */
            <div
              className={`relative w-full max-w-[360px] aspect-[7/11] rounded-[32px] p-5 border-2 bg-gradient-to-b ${currentTheme.cardPreviewClass} shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group`}
            >
              {/* Top Lanyard Hole Visual */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-2.5 rounded-full bg-slate-900 border border-slate-700" />

              {/* Decorative staff lines */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Header */}
              <div className="pt-3">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg shrink-0 border-2 border-white shadow-md"
                    style={{ backgroundColor: currentTheme.primaryColor, color: '#000' }}
                  >
                    🎺
                  </div>
                  <div className="overflow-hidden">
                    <span
                      className="text-[10px] font-bold block uppercase tracking-wider truncate"
                      style={{ color: currentTheme.accentColor }}
                    >
                      KPCH BAND • OFFICIAL MEMBER
                    </span>
                    <h3 className="text-xs font-bold text-white truncate leading-tight">
                      {schoolName}
                    </h3>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {student.clubType} • ปีการศึกษา {academicYear}
                    </p>
                  </div>
                </div>

                {/* Sub Bar with Chip & Verified */}
                <div className="flex items-center justify-between mt-3 px-1">
                  {/* Smart Card Chip */}
                  <div className="w-10 h-7 rounded-md bg-amber-400 border border-amber-600 shadow-inner flex items-center justify-center">
                    <div className="w-6 h-4 border border-amber-700/80 rounded-xs" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${currentTheme.accentBadgeClass}`}>
                    ✓ VERIFIED
                  </span>
                </div>
              </div>

              {/* Photo & Name Center */}
              <div className="flex flex-col items-center text-center my-auto py-2">
                <div className="relative mb-3">
                  <div
                    className="w-28 h-28 rounded-full p-1 border-2 shadow-xl"
                    style={{ borderColor: currentTheme.primaryColor }}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 flex items-center justify-center">
                      {customPhotoUrl ? (
                        <img src={customPhotoUrl} alt="Photo" className="w-full h-full object-cover" />
                      ) : (
                        <div
                          className="w-full h-full flex flex-col items-center justify-center text-white"
                          style={{
                            background: `linear-gradient(135deg, ${currentTheme.secondaryColor}, ${currentTheme.primaryColor})`,
                          }}
                        >
                          <span className="text-3xl font-black">{student.nickName.substring(0, 1)}</span>
                          <span className="text-[9px] font-mono tracking-widest uppercase">KPCH</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="text-base font-black text-white tracking-tight">
                  {student.firstName} {student.lastName}
                </h3>
                <span className="text-xs font-bold mt-0.5" style={{ color: currentTheme.accentColor }}>
                  (น้อง{student.nickName})
                </span>
              </div>

              {/* Details Box */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/70 border border-white/10 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">รหัสนักเรียน:</span>
                  <span className="font-mono font-bold text-white">{student.studentId}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-800">
                  <span className="text-slate-400">ระดับชั้น:</span>
                  <span className="font-medium text-slate-200">
                    ม.{student.grade}/{student.room}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-800">
                  <span className="text-slate-400">เครื่องดนตรี / ตำแหน่ง:</span>
                  <span className="font-bold truncate max-w-[150px]" style={{ color: currentTheme.accentColor }}>
                    {student.position}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-800">
                  <span className="text-slate-400">สังกัด:</span>
                  <span className="font-medium text-cyan-400">{student.clubType}</span>
                </div>
              </div>

              {/* Barcode & Footer */}
              <div className="pt-2 text-center">
                {/* Barcode visual */}
                <div className="h-6 w-44 mx-auto flex items-stretch justify-between gap-[2px] opacity-80">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white flex-1"
                      style={{
                        width: `${(i % 3) + 1}px`,
                        opacity: i % 4 === 0 ? 0.4 : 1,
                      }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] text-slate-400 block mt-1 tracking-wider">
                  KPCH-{student.studentId}-{academicYear}
                </span>
              </div>
            </div>
          ) : (
            /* HORIZONTAL WALLET CARD PREVIEW */
            <div
              className={`relative w-full max-w-[460px] aspect-[100/64] rounded-[28px] p-5 border-2 bg-gradient-to-br ${currentTheme.cardPreviewClass} shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden`}
            >
              {/* Decorative staff lines */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Top Row: School Branding */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border border-white"
                    style={{ backgroundColor: currentTheme.primaryColor, color: '#000' }}
                  >
                    🎺
                  </div>
                  <div>
                    <span
                      className="text-[9px] font-bold block uppercase tracking-wider"
                      style={{ color: currentTheme.accentColor }}
                    >
                      KPCH BAND DIGITAL PASS
                    </span>
                    <h4 className="text-xs font-bold text-white truncate max-w-[220px]">
                      {schoolName}
                    </h4>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${currentTheme.accentBadgeClass}`}>
                  ✓ VERIFIED
                </span>
              </div>

              {/* Middle Row: Photo on Left, Details on Right */}
              <div className="grid grid-cols-12 gap-3 items-center my-auto py-1">
                {/* Left col with photo & chip */}
                <div className="col-span-4 flex flex-col items-center">
                  <div
                    className="w-20 h-20 rounded-full p-1 border-2 shadow-lg mb-1.5"
                    style={{ borderColor: currentTheme.primaryColor }}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 flex items-center justify-center">
                      {customPhotoUrl ? (
                        <img src={customPhotoUrl} alt="Photo" className="w-full h-full object-cover" />
                      ) : (
                        <div
                          className="w-full h-full flex flex-col items-center justify-center text-white"
                          style={{
                            background: `linear-gradient(135deg, ${currentTheme.secondaryColor}, ${currentTheme.primaryColor})`,
                          }}
                        >
                          <span className="text-2xl font-black">{student.nickName.substring(0, 1)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Micro chip */}
                  <div className="w-8 h-5 rounded-xs bg-amber-400 border border-amber-600 flex items-center justify-center">
                    <div className="w-4 h-2.5 border border-amber-700/80 rounded-xs" />
                  </div>
                </div>

                {/* Right col with student info */}
                <div className="col-span-8 space-y-1.5 text-xs">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight leading-tight">
                      {student.firstName} {student.lastName}
                    </h3>
                    <span className="text-[11px] font-semibold" style={{ color: currentTheme.accentColor }}>
                      (น้อง{student.nickName})
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-950/70 border border-white/10 space-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">รหัสนักเรียน:</span>
                      <span className="font-mono font-bold text-white">{student.studentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ระดับชั้น:</span>
                      <span className="text-slate-200">ม.{student.grade}/{student.room}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ตำแหน่ง/เครื่อง:</span>
                      <span className="font-bold truncate max-w-[120px]" style={{ color: currentTheme.accentColor }}>
                        {student.position}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ชุมนุม:</span>
                      <span className="font-medium text-cyan-400 truncate max-w-[120px]">{student.clubType}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-white/10">
                <span className="font-mono">KPCH-{student.studentId}-{academicYear}</span>
                <span>ปีการศึกษา {academicYear}</span>
              </div>
            </div>
          )}

          {/* Download Action under Card Preview */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleDownloadPNG}
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลดภาพ PNG คุณภาพสูง</span>
            </button>
            <button
              onClick={handleCopyToClipboard}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedSuccess ? 'คัดลอกแล้ว!' : 'คัดลอกรูป'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
