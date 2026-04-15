// components/Auth/AuthModal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";

// Combined schema (all fields optional, validated conditionally)
const authSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof authSchema>;

const AuthModal = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    login,
    signup,
  } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  // AuthModal.tsx
  useEffect(() => {
    const handleClose = () => {
      if (showAuthModal) {
        setShowAuthModal(false);
      }
    };
    window.addEventListener("closeAllModals", handleClose);
    return () => window.removeEventListener("closeAllModals", handleClose);
  }, [showAuthModal, setShowAuthModal]);

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (!showAuthModal) {
      form.reset();
      setError("");
    }
  }, [showAuthModal, form]);

  useEffect(() => {
    // Clear fields when switching mode
    form.reset();
    setError("");
  }, [authMode, form]);

  const onSubmit = async (values: AuthFormValues) => {
    setError("");
    setLoading(true);
    try {
      if (authMode === "login") {
        await login(values.email, values.password);
      } else {
        if (!values.name) throw new Error("Name is required");
        await signup(values.name, values.email, values.password);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setShowAuthModal(open);
  };

  if (!showAuthModal) return null; // Optional: Dialog already handles open state

  return (
    <Dialog open={showAuthModal} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {authMode === "login" ? "Welcome Back!" : "Create Account"}
          </DialogTitle>
          <DialogDescription>
            {authMode === "login"
              ? "Sign in to access your account and continue shopping"
              : "Join us to unlock exclusive deals and track your orders"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {authMode === "signup" && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        autoComplete="name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete={
                        authMode === "login"
                          ? "current-password"
                          : "new-password"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Please wait..."
                : authMode === "login"
                  ? "Sign In"
                  : "Create Account"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm mt-4">
          {authMode === "login" ? (
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-medium"
                onClick={() => setAuthMode("signup")}
              >
                Sign Up
              </Button>
            </p>
          ) : (
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-medium"
                onClick={() => setAuthMode("login")}
              >
                Sign In
              </Button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
