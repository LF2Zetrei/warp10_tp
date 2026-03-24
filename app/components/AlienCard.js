export default function AlienCard({ children, className = '', style = {} }) {
  return (
    <div className={`alien-card ${className}`} style={style}>
      {children}
    </div>
  );
}
