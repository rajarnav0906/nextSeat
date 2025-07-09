export default function Footer() {
  return (
    <footer className="bg-[#F5F7FA] text-[#2D2D2D] px-6 md:px-20 py-16 mt-12 border-t border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        {/* Brand Info */}
        <div>
          <h3 className="text-2xl font-bold mb-2 text-[#4A90E2]">saath chaloge?</h3>
          <p className="text-sm text-gray-600">
            Your trusted travel companion platform — built for and by students.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#features" className="hover:text-[#4A90E2] transition">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-[#4A90E2] transition">How It Works</a></li>
            <li><a href="#stats" className="hover:text-[#4A90E2] transition">Platform Stats</a></li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Connect</h4>
          <div className="flex space-x-4 mt-2">
            {/* GitHub */}
            <a
              href="https://github.com/your-github"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <svg className="w-6 h-6 text-[#2D2D2D] hover:text-[#4A90E2]" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.753-1.333-1.753-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.42-1.305.762-1.605-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.045.137 3.003.403 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.244 2.873.12 3.176.77.84 1.232 1.91 1.232 3.22 0 4.61-2.807 5.623-5.48 5.92.43.372.823 1.103.823 2.222 0 1.606-.015 2.902-.015 3.296 0 .32.19.694.8.576C20.565 21.796 24 17.296 24 12c0-6.63-5.37-12-12-12z"
                />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/your-linkedin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6 text-[#2D2D2D] hover:text-[#4A90E2]" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zm-11 19H5v-9h3v9zm-1.5-10.3c-.966 0-1.75-.79-1.75-1.75S5.534 5.2 6.5 5.2s1.75.79 1.75 1.75S7.466 8.7 6.5 8.7zM20 19h-3v-4.5c0-1.1-.4-1.85-1.4-1.85-.77 0-1.23.52-1.43 1.02-.07.17-.09.41-.09.65V19h-3s.04-7.5 0-8.5h3v1.2c.4-.6 1.12-1.45 2.72-1.45 1.99 0 3.5 1.3 3.5 4.1V19z"
                />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/your-instagram"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6 text-[#2D2D2D] hover:text-[#4A90E2]" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.987.24 2.45.41.52.19.89.42 1.28.82.39.39.63.76.82 1.28.17.46.35 1.28.4 2.45.06 1.27.07 1.65.07 4.85s-.01 3.584-.07 4.85c-.056 1.17-.24 1.987-.4 2.45-.19.52-.42.89-.82 1.28-.39.39-.76.63-1.28.82-.46.17-1.28.35-2.45.4-1.27.06-1.65.07-4.85.07s-3.584-.01-4.85-.07c-1.17-.056-1.987-.24-2.45-.4-.52-.19-.89-.42-1.28-.82-.39-.39-.63-.76-.82-1.28-.17-.46-.35-1.28-.4-2.45C2.212 15.585 2.2 15.205 2.2 12s.012-3.584.07-4.85c.056-1.17.24-1.987.4-2.45.19-.52.42-.89.82-1.28.39-.39.76-.63 1.28-.82.46-.17 1.28-.35 2.45-.4C8.415 2.212 8.795 2.2 12 2.2zM12 0C8.736 0 8.332.013 7.052.072 5.773.131 4.877.27 4.1.54c-.816.277-1.48.63-2.14 1.29C1.3 2.49.947 3.154.67 3.97.4 4.747.26 5.643.202 6.922.143 8.2.13 8.604.13 12s.013 3.8.072 5.078c.059 1.279.198 2.175.468 2.952.277.816.63 1.48 1.29 2.14.66.66 1.324 1.013 2.14 1.29.777.27 1.673.409 2.952.468 1.278.059 1.682.072 5.078.072s3.8-.013 5.078-.072c1.279-.059 2.175-.198 2.952-.468.816-.277 1.48-.63 2.14-1.29.66-.66 1.013-1.324 1.29-2.14.27-.777.409-1.673.468-2.952.059-1.278.072-1.682.072-5.078s-.013-3.8-.072-5.078c-.059-1.279-.198-2.175-.468-2.952-.277-.816-.63-1.48-1.29-2.14C21.51.947 20.846.594 20.03.317c-.777-.27-1.673-.409-2.952-.468C15.264.013 14.86 0 12 0zm0 5.838A6.162 6.162 0 0 0 5.838 12 6.162 6.162 0 0 0 12 18.162 6.162 6.162 0 0 0 18.162 12 6.162 6.162 0 0 0 12 5.838zm0 10.162A4 4 0 1 1 12 8a4 4 0 0 1 0 8zm6.406-11.8a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"
                />
              </svg>
            </a>

            {/* Email */}
            <a href="mailto:support@travelmate.in" aria-label="Email">
              <svg className="w-6 h-6 text-[#2D2D2D] hover:text-[#4A90E2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h16c1.11 0 2 .9 2 2v12c0 1.1-.89 2-2 2H4c-1.11 0-2-.9-2-2V6c0-1.1.89-2 2-2zm8 7L4.5 6h15L12 11zm0 2.25L4.5 8v10h15V8L12 13.25z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-gray-500">
        Made with ❤️ by <span className="font-medium text-[#4A90E2]">Arnav Raj</span> — © 2025 TravelMate
      </div>
    </footer>
  );
}
