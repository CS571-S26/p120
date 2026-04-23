type StatCardProps = {
  label: string;
  value: string | number;
  sub: string;
};

function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="bg-white rounded-3 border shadow-sm p-3 h-100">
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#212529' }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: '#6c757d', marginTop: '2px' }}>{label}</div>
      <div style={{ fontSize: '0.75rem', color: '#adb5bd', marginTop: '2px' }}>{sub}</div>
    </div>
  );
}

export default StatCard;
