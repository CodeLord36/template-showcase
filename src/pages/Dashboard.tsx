import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User as UserIcon, ShoppingCart, Heart, Package, Download, Settings, LogOut, Trash2, Minus, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useShop } from "@/contexts/ShopContext";
import { toast } from "@/hooks/use-toast";

type Tab = "profile" | "orders" | "cart" | "favourites" | "downloads" | "settings";

const Dashboard = () => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { cart, favourites, removeFromCart, updateQty, toggleFavourite, addToCart, cartSubtotal, clearCart, checkout } = useShop();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("profile");

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal("login", "Sign in to view your dashboard.");
    }
  }, [isAuthenticated, openAuthModal]);

  if (!isAuthenticated || !user) {
    return (
      <>
        <Header />
        <main className="container py-24 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">Sign in required</h1>
          <p className="text-muted-foreground font-body mb-6">Please sign in to view your dashboard.</p>
          <button
            onClick={() => openAuthModal("login")}
            className="bg-secondary text-secondary-foreground font-semibold px-8 py-3 rounded-full hover:bg-secondary/90 transition-colors font-body"
          >
            Sign In
          </button>
        </main>
        <Footer />
      </>
    );
  }

  const navItems: { key: Tab; label: string; icon: typeof UserIcon; badge?: number }[] = [
    { key: "profile", label: "Profile", icon: UserIcon },
    { key: "orders", label: "Orders", icon: Package },
    { key: "cart", label: "Cart", icon: ShoppingCart, badge: cart.length },
    { key: "favourites", label: "Favourites", icon: Heart, badge: favourites.length },
    { key: "downloads", label: "Downloads", icon: Download },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <Header />
      <main className="bg-surface-warm min-h-screen py-12">
        <div className="container">
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
              Welcome back, {user.name}
            </h1>
            <p className="text-muted-foreground font-body text-sm">Manage your account, orders, and saved items.</p>
          </div>

          <div className="grid lg:grid-cols-[260px_1fr] gap-8">
            {/* Sidebar */}
            <aside className="bg-background border border-border rounded-xl p-4 h-fit">
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = tab === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setTab(item.key)}
                      className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-body font-medium transition-colors ${
                        active ? "bg-secondary text-secondary-foreground" : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </span>
                      {item.badge ? (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? "bg-background/20" : "bg-secondary text-secondary-foreground"}`}>
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
                <button
                  onClick={() => { logout(); toast({ title: "Signed out" }); navigate("/"); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body font-medium text-destructive hover:bg-destructive/10 transition-colors mt-2"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </nav>
            </aside>

            {/* Content */}
            <section className="bg-background border border-border rounded-xl p-6 md:p-8">
              {tab === "profile" && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">Profile</h2>
                  <div className="grid sm:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-body">Name</label>
                      <p className="text-foreground font-body mt-1">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-body">Email</label>
                      <p className="text-foreground font-body mt-1">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-body">Member since</label>
                      <p className="text-foreground font-body mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <StatCard label="Cart items" value={cart.length} />
                    <StatCard label="Favourites" value={favourites.length} />
                    <StatCard label="Orders" value={0} />
                  </div>
                </div>
              )}

              {tab === "orders" && (
                <EmptyState icon={Package} title="No orders yet" description="Once you complete a purchase, your orders appear here." cta={{ label: "Browse products", to: "/services" }} />
              )}

              {tab === "cart" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-2xl font-bold text-foreground">Your Cart</h2>
                    {cart.length > 0 && (
                      <button onClick={clearCart} className="text-sm text-muted-foreground hover:text-destructive font-body">Clear cart</button>
                    )}
                  </div>
                  {cart.length === 0 ? (
                    <EmptyState icon={ShoppingCart} title="Your cart is empty" description="Start adding products to see them here." cta={{ label: "Browse products", to: "/services" }} />
                  ) : (
                    <>
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 py-4 border-b border-border">
                            <div className="w-16 h-16 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-2xl">📄</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-body font-medium text-foreground truncate">{item.title}</p>
                              <p className="text-sm font-semibold text-foreground font-body mt-1">{item.price}</p>
                            </div>
                            <div className="flex items-center border border-border rounded-full">
                              <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2.5 py-1.5 text-foreground hover:text-secondary"><Minus className="h-3 w-3" /></button>
                              <span className="px-2 text-sm font-body text-foreground">{item.qty}</span>
                              <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2.5 py-1.5 text-foreground hover:text-secondary"><Plus className="h-3 w-3" /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground font-body">Subtotal</p>
                          <p className="text-2xl font-bold text-foreground font-body">${cartSubtotal.toFixed(2)}</p>
                        </div>
                        <button onClick={checkout} className="bg-secondary text-secondary-foreground font-semibold px-8 py-3 rounded-full hover:bg-secondary/90 transition-colors font-body">
                          Checkout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {tab === "favourites" && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">Favourites</h2>
                  {favourites.length === 0 ? (
                    <EmptyState icon={Heart} title="No favourites yet" description="Heart products you love to save them here." cta={{ label: "Browse products", to: "/services" }} />
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {favourites.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                          <div className="w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">📄</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-body font-medium text-foreground truncate">{item.title}</p>
                            <p className="text-sm text-foreground font-body">{item.price}</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button onClick={() => addToCart(item)} className="text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full font-body">Add</button>
                            <button onClick={() => toggleFavourite(item)} className="text-xs text-muted-foreground hover:text-destructive font-body">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === "downloads" && (
                <EmptyState icon={Download} title="No downloads yet" description="Purchased digital products appear here for instant download." cta={{ label: "Browse digital guides", to: "/services" }} />
              )}

              {tab === "settings" && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">Settings</h2>
                  <div className="space-y-4 max-w-md">
                    <SettingRow label="Email notifications" description="Receive product updates and offers" />
                    <SettingRow label="Marketing emails" description="Get tips on study abroad & migration" />
                    <SettingRow label="Two-factor authentication" description="Add an extra layer of security" />
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-surface-warm border border-border rounded-lg p-4">
    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-body">{label}</p>
    <p className="text-2xl font-bold text-foreground font-body mt-1">{value}</p>
  </div>
);

const EmptyState = ({ icon: Icon, title, description, cta }: { icon: typeof UserIcon; title: string; description: string; cta?: { label: string; to: string } }) => (
  <div className="text-center py-12">
    <Icon className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
    <h3 className="font-display text-lg font-bold text-foreground mb-1">{title}</h3>
    <p className="text-muted-foreground font-body text-sm mb-6">{description}</p>
    {cta && (
      <Link to={cta.to} className="inline-block bg-secondary text-secondary-foreground font-semibold px-6 py-2.5 rounded-full hover:bg-secondary/90 transition-colors font-body text-sm">
        {cta.label}
      </Link>
    )}
  </div>
);

const SettingRow = ({ label, description }: { label: string; description: string }) => {
  const [on, setOn] = useState(false);
  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
      <div>
        <p className="font-body font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground font-body">{description}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-secondary" : "bg-muted"}`}
        aria-label={label}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-background rounded-full shadow transition-transform ${on ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
};

export default Dashboard;
