import { Search, User, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import SearchOverlay from "../features/search/SearchOverlay";
import CartDrawer from "../features/cart/CartDrawer";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Services", href: "#services" },
  { label: "Products", href: "#products" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { isAuthenticated, user, promptAuth, logout } = useAuth();

  return (
    <>
      <header className="bg-background sticky top-0 z-50 border-b border-border">
        <div className="container flex items-center justify-between py-4">
          {/* Left nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-secondary transition-colors tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Logo */}
          <a href="#" className="flex flex-col items-center">
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">
              The Digital Desk
            </span>
          </a>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-foreground hover:text-secondary transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <div className="relative">
              <button
                className="text-foreground hover:text-secondary transition-colors hidden sm:block"
                aria-label="Account"
                onClick={() => {
                  // console.log("Button clicked");

                  if (!isAuthenticated) {
                    // console.log(
                    //   "🟢 User icon clicked, isAuthenticated:",
                    //   isAuthenticated,
                    // );
                    promptAuth("login");
                  }
                }}
              >
                <User className="h-5 w-5" />
                {isAuthenticated && <span className="user-indicator">●</span>}
              </button>
              {isAuthenticated && (
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                  <p className="px-4 py-2 text-sm text-foreground">
                    Welcome, {user?.name}
                  </p>
                  <hr className="my-1" />
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm hover:bg-muted"
                  >
                    Profile
                  </a>
                  <a
                    href="/orders"
                    className="block px-4 py-2 text-sm hover:bg-muted"
                  >
                    My Orders
                  </a>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            <button
              className="text-foreground hover:text-secondary transition-colors hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-foreground hover:text-secondary transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-secondary text-secondary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden border-t border-border bg-background py-4">
            <div className="container flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-foreground hover:text-secondary py-2 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Header;
