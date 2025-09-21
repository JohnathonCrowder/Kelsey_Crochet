export function WaveDivider() {
  return (
    <svg viewBox="0 0 1440 120" aria-hidden="true" className="w-full h-16 text-petal-100">
      <path fill="currentColor" d="M0,64L60,58.7C120,53,240,43,360,74.7C480,107,600,181,720,186.7C840,192,960,128,1080,96C1200,64,1320,64,1380,64L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"/>
    </svg>
  );
}

export function Blob({ className = "" }: { className?: string }) {
  return (
    <div className={"absolute blur-3xl opacity-60 " + className} aria-hidden="true">
      <div className="w-[28rem] h-[28rem] bg-petal-200 rounded-blob rotate-6" />
    </div>
  );
}
