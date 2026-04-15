import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import HeroSlider from "@/components/sections/hero/HeroSlider";
import CategoriesSection from "@/components/sections/product/CategoriesSection";
import FeaturedProducts from "@/components/sections/product/FeaturedProducts";
import CollectionBanners from "@/components/sections/product/CollectionBanners";
import HighTicketServices from "@/components/sections/marketing/HighTicketServices";
import LookbookSection from "@/components/sections/branding/LookbookSection";
import CollectionSlider from "@/components/sections/product/CollectionSlider";
import MarqueeSection from "@/components/sections/marketing/MarqueeSection";
import TestimonialsSection from "@/components/sections/marketing/TestimonialsSection";
import InstagramGallery from "@/components/sections/branding/InstagramGallery";
import FeaturesBar from "@/components/sections/marketing/FeaturesBar";
import Footer from "@/components/layout/Footer";
import PurchaseNotification from "@/components/features/product/PurchaseNotification";
import NewsletterPopup from "@/components/sections/marketing/NewsletterPopup";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NewsletterPopup />
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
