export default function StatusBadge({ status }) {
  const styles = {
    nominal:  { color: '#33ff33', border: '1px solid #33ff33' },
    warning:  { color: '#ffaa00', border: '1px solid #ffaa00' },
    critical: { color: '#ff3333', border: '1px solid #ff3333' },
    unknown:  { color: '#1a8c1a', border: '1px solid #1a8c1a' },
  };

  const style = styles[status] ?? styles.unknown;

  return (
    <span style={{
      ...style,
      padding: '2px 8px',
      fontSize: '9px',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      fontFamily: 'inherit',
    }}>
      {status ?? 'unknown'}
    </span>
  );
}
