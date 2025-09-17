export default function Footer() {
  return (
    <footer className="bg-gray-900 py-6">
      <div className="max-w-7xl mx-auto px-6 flex justify-between text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} AI Legal Analyzer. All rights reserved.</p>
        <p>Made with ❤️ using Next.js and Tailwind</p>
      </div>
    </footer>
  );
}