// components/Protected/ProtectedAction.tsx
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";

interface ProtectedActionProps {
  children: ReactNode;
  action?: string; // description for sessionStorage
  redirectUrl?: string; // optional custom URL after login
}

export const ProtectedAction = ({
  children,
  action = "view more products",
  redirectUrl,
}: ProtectedActionProps) => {
  const { isAuthenticated, promptAuth } = useAuth();

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      e.stopPropagation();
      promptAuth("login", redirectUrl);
      sessionStorage.setItem("postLoginAction", action);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{ cursor: !isAuthenticated ? "pointer" : "default" }}
    >
      {children}
    </div>
  );
};
