export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <div className="w-14 h-14 border-4 border-gray-700 border-t-cyan-400 rounded-full animate-spin"></div>
    </div>
  );
}