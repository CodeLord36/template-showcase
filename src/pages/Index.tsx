import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import CollectionBanners from "@/components/CollectionBanners";
import HighTicketServices from "@/components/HighTicketServices";
import LookbookSection from "@/components/LookbookSection";
import CollectionSlider from "@/components/CollectionSlider";
import MarqueeSection from "@/components/MarqueeSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import InstagramGallery from "@/components/InstagramGallery";
import FeaturesBar from "@/components/FeaturesBar";
import Footer from "@/components/Footer";
import PurchaseNotification from "@/components/PurchaseNotification";

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
      <LookbookSection />
      <CollectionSlider />
      <MarqueeSection />
      <TestimonialsSection />
      <InstagramGallery />
      <FeaturesBar />
      <Footer />
      <PurchaseNotification />
    </div>
  );
};

export default Index;
