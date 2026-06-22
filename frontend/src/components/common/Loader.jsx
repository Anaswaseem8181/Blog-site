export default function Loader({ fullScreen = false }) {
  const spinner = (
    <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin"></div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        {spinner}
      </div>
    );
  }
  return <div className="flex justify-center py-8">{spinner}</div>;
}
