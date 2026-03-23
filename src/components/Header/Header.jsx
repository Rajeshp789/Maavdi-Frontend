import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PromoBanner from "./PromoBanner";
import DesktopNav from "./DesktopNav";
import AuthIcons from "./AuthIcons";
import MobileMenu from "./MobileMenu";
import './Header.css';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  const offers = [
    { emoji: '🎉', text: 'Buy above ₹500', deal: 'Get FREE Delivery!', color: 'from-blue-500 to-cyan-500' },
    { emoji: '💰', text: 'Order above ₹800', deal: 'Get 20% Discount!', color: 'from-green-500 to-emerald-500' },
    { emoji: '🔥', text: 'Ghee & Oils Bundle', deal: 'Get 40% Discount!', color: 'from-red-500 to-pink-500' },
    { emoji: '🧈', text: 'Butter & Spreads', deal: 'Buy 2 Get 1 Free!', color: 'from-yellow-500 to-orange-500' },
    { emoji: '🍦', text: 'Ice Pops Purchase', deal: 'Extra 30% Off!', color: 'from-purple-500 to-indigo-500' },
    { emoji: '🎊', text: 'First-time Customer', deal: 'Get 25% Welcome Bonus!', color: 'from-pink-500 to-rose-500' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <PromoBanner
        offers={offers}
        currentOfferIndex={currentOfferIndex}
        setCurrentOfferIndex={setCurrentOfferIndex}
      />

      <header className="sticky top-0 z-50 bg-white shadow-2xl border-b-4 border-indigo-600">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4 flex justify-between items-center">

          <Link to="/" className="flex items-center space-x-2">
            <img src="/image/logo.png" className="w-8 h-8 md:w-10 md:h-10 rounded-lg" />
            <h1 className="text-lg md:text-2xl font-black hidden sm:inline">Maavdi</h1>
          </Link>

          <DesktopNav />

          <div className="flex items-center gap-2 md:gap-6 ml-auto">
            <AuthIcons cartCount={cartCount} />
          </div>

          <button
            className="md:hidden p-1 ml-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>

        <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      </header>
    </>
  );
}

export default Header;
