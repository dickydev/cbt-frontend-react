interface WarningBannerProps {
  violations: number;
}

export default function WarningBanner({ violations }: WarningBannerProps) {
  if (violations <= 0) return null;

  return (
    <div className="warning-banner">
      Peringatan: Anda terdeteksi keluar fokus sebanyak{" "}
      <strong>{violations}</strong> kali.
    </div>
  );
}
