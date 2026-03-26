import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import CollectionBanners from "@/components/CollectionBanners";
import HighTicketServices from "@/components/HighTicketServices";
import MarqueeSection from "@/components/MarqueeSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FeaturesBar from "@/components/FeaturesBar";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Header />
      <HeroSlider />
      <CategoriesSection />
      <FeaturedProducts />
      <CollectionBanners />
      <HighTicketServices />
      <MarqueeSection />
      <TestimonialsSection />
      <FeaturesBar />
      <Footer />
    </div>
  );
};

export default Index;
