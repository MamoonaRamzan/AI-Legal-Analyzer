export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-gray-950 px-6">
      <h3 className="text-3xl font-semibold text-center mb-12">Contact Us</h3>
      <div className="max-w-xl mx-auto bg-gray-900 p-8 rounded-xl shadow-lg">
        <form className="space-y-4">
          <input type="text" placeholder="Your Name" className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700" />
          <input type="email" placeholder="Your Email" className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700" />
          <textarea placeholder="Message" rows={4} className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700" />
          <button type="submit" className="w-full px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700">Send Message</button>
        </form>
      </div>
    </section>
  );
}
