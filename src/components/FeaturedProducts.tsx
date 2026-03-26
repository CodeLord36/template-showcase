import { Star, ArrowRight } from "lucide-react";

type Product = {
  id: number;
  title: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  badgeColor?: string;
  rating: number;
  type: "digital" | "service";
};

const products: Product[] = [
  {
    id: 1,
    title: "Complete Visa Application Guide",
    price: "$9.99",
    originalPrice: "$19.99",
    badge: "BESTSELLER",
    badgeColor: "bg-secondary text-secondary-foreground",
    rating: 4.8,
    type: "digital",
  },
  {
    id: 2,
    title: "SOP Writing Masterclass",
    price: "$14.99",
    originalPrice: "$29.99",
    badge: "-50%",
    badgeColor: "bg-destructive text-destructive-foreground",
    rating: 4.9,
    type: "digital",
  },
  {
    id: 3,
    title: "Country-Specific Checklist Bundle",
    price: "$4.99",
    badge: "NEW",
    badgeColor: "bg-primary text-primary-foreground",
    rating: 4.7,
    type: "digital",
  },
  {
    id: 4,
    title: "Travel Insurance Comparison Guide",
    price: "$7.99",
    originalPrice: "$12.99",
    rating: 4.6,
    type: "digital",
  },
];

const ProductCard = ({ product }: { product: Product }) => (
  <div className="group cursor-pointer">
    <div className="relative bg-muted rounded-lg overflow-hidden aspect-[3/4] mb-4">
      {/* Placeholder product visual */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10">
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-secondary/20 flex items-center justify-center">
            <span className="text-2xl">📄</span>
          </div>
          <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">
            {product.type === "digital" ? "Digital Product" : "Service"}
          </p>
        </div>
      </div>

      {/* Badge */}
      {product.badge && (
        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-sm ${product.badgeColor}`}>
          {product.badge}
        </span>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
        <button className="bg-background text-foreground text-xs font-semibold px-6 py-2.5 rounded-full shadow-lg hover:bg-secondary hover:text-secondary-foreground transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
          Quick View
        </button>
      </div>
    </div>

    <h3 className="font-body text-sm font-medium text-foreground group-hover:text-secondary transition-colors mb-1.5 line-clamp-2">
      {product.title}
    </h3>

    <div className="flex items-center gap-1 mb-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < Math.floor(product.rating) ? "fill-secondary text-secondary" : "text-border"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{product.rating}</span>
    </div>

    <div className="flex items-center gap-2">
      <span className="font-body font-semibold text-foreground">{product.price}</span>
      {product.originalPrice && (
        <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
      )}
    </div>
  </div>
);

const FeaturedProducts = () => {
  return (
    <section id="products" className="py-16 md:py-24 bg-surface-warm">
      <div className="container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Today's Top Picks
            </h2>
            <p className="text-muted-foreground font-body">
              Start your journey with our most popular digital guides.
            </p>
          </div>
          <a
            href="#"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-foreground hover:text-secondary transition-colors font-body"
          >
            View All <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="md:hidden mt-8 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-secondary transition-colors font-body"
          >
            View All Products <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
