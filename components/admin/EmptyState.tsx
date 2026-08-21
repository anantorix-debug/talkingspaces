export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center border border-dashed border-gray-300 bg-white py-16 text-sm text-gray-400">
      {message}
    </div>
  );
}
