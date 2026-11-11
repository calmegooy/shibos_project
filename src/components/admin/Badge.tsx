import React from 'react';

export type StatusBadgeType =
  | 'menunggu'
  | 'dikonfirmasi'
  | 'diracik'
  | 'selesai'
  | 'dibatalkan'
  | 'menunggu_verifikasi'
  | 'terverifikasi'
  | 'ditolak'
  | 'tunai_lunas'
  | 'tersedia'
  | 'habis';

interface BadgeProps {
  status: StatusBadgeType | string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, size = 'md', className = '' }) => {
  const norm = status.toLowerCase();

  let label = status;
  let bgStyles = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (norm) {
    case 'menunggu':
      label = 'Menunggu';
      bgStyles = 'bg-amber-50 text-amber-800 border border-amber-200/80';
      break;
    case 'dikonfirmasi':
      label = 'Dikonfirmasi';
      bgStyles = 'bg-blue-50 text-[#0052cc] border border-blue-200/80 font-medium';
      break;
    case 'diracik':
      label = 'Sedang Diracik';
      bgStyles = 'bg-indigo-50 text-indigo-800 border border-indigo-200/80';
      break;
    case 'selesai':
      label = 'Selesai';
      bgStyles = 'bg-emerald-50 text-emerald-800 border border-emerald-200/80';
      break;
    case 'dibatalkan':
      label = 'Dibatalkan';
      bgStyles = 'bg-rose-50 text-rose-800 border border-rose-200/80';
      break;
    case 'menunggu_verifikasi':
    case 'menunggu verifikasi':
      label = 'Menunggu Verifikasi';
      bgStyles = 'bg-amber-50 text-amber-900 border border-amber-300 font-medium';
      break;
    case 'terverifikasi':
      label = 'Terverifikasi';
      bgStyles = 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-medium';
      break;
    case 'ditolak':
      label = 'Ditolak';
      bgStyles = 'bg-red-50 text-red-800 border border-red-200/80 font-medium';
      break;
    case 'tunai_lunas':
    case 'tunai':
      label = 'Tunai Lunas';
      bgStyles = 'bg-sky-50 text-sky-800 border border-sky-200/80';
      break;
    case 'tersedia':
    case 'true':
      label = 'Tersedia';
      bgStyles = 'bg-emerald-50 text-emerald-800 border border-emerald-200/70';
      break;
    case 'habis':
    case 'false':
      label = 'Stok Habis';
      bgStyles = 'bg-slate-100 text-slate-600 border border-slate-200';
      break;
  }

  const sizeClasses =
    size === 'sm' ? 'text-[11px] px-2 py-0.5 rounded' : 'text-xs px-2.5 py-1 rounded-md';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium tracking-tight whitespace-nowrap ${sizeClasses} ${bgStyles} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          norm.includes('selesai') || norm.includes('terverifikasi') || norm.includes('tersedia')
            ? 'bg-emerald-600'
            : norm.includes('menunggu')
            ? 'bg-amber-500'
            : norm.includes('dikonfirmasi')
            ? 'bg-[#0052cc]'
            : norm.includes('dibatalkan') || norm.includes('ditolak')
            ? 'bg-rose-600'
            : 'bg-slate-500'
        }`}
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
};
