"use client";

import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import newsletter from "@/assets/gallery-3.jpg";

const NewsletterPopup = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Close other modals when this one opens
  useEffect(() => {
    if (open) {
      window.dispatchEvent(new CustomEvent("closeAllModals"));
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(email);
    alert(`Subscribed: ${email}`);

    setEmail("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="hidden md:block md:w-2/5">
            <img
              src={newsletter}
              alt="Newsletter"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex w-full flex-col items-center justify-center p-8 text-center md:w-3/5 md:p-12">
            <DialogClose className="absolute right-4 top-4"></DialogClose>

            <p className="mb-2 text-lg font-semibold uppercase text-gray-600">
              Subscribe & Enjoy
            </p>

            <p className="mb-4 text-4xl font-bold text-primary">10% OFF</p>

            <p className="mb-6 text-gray-600">
              Get exclusive offers & updates!
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-sm">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-md border px-4 py-2"
                />

                <button className="rounded-md bg-primary text-white px-5 py-2">
                  Subscribe
                </button>
              </div>
            </form>

            <p className="mt-3 text-xs text-gray-500">
              Don't worry, we hate spam as much as you do!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterPopup;
