export default function PostAction({ icon, text, onClick }) {
  return (
    <button className="flex items-center" onClick={onClick}>
      <span className="mr-1 text-gray-500">{icon}</span>
      <span className="hidden sm:inline text-gray-500">{text}</span>
    </button>
  );
}
