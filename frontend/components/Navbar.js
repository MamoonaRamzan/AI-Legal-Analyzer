export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-400">⚖️ Legal Analyzer</h1>
        <ul className="flex gap-6 text-gray-300">
          {["Home", "How It Works", "Features", "Demo", "Contact"].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                className="hover:text-white transition"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
