import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-sprinkle-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-sprinkle-green mb-4">SprinkleX</h3>
          <p className="text-gray-400 mb-6">Water Smart. Grow Smart.</p>
          
          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-400 flex items-center justify-center">
              Made with <Heart className="w-4 h-4 text-red-500 mx-2" /> for sustainable agriculture
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;