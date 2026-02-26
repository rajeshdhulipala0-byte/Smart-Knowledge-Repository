const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © {currentYear} Smart Knowledge Repository. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm hover:text-primary-400 transition">
              About
            </a>
            <a href="#" className="text-sm hover:text-primary-400 transition">
              Privacy
            </a>
            <a href="#" className="text-sm hover:text-primary-400 transition">
              Terms
            </a>
            <a href="#" className="text-sm hover:text-primary-400 transition">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
