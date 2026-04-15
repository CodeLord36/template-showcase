import { createContext, useContext, useState } from "react";

type ModalType = "auth" | "newsletter" | null;

interface ModalCoordinatorContextType {
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
}

const ModalCoordinatorContext = createContext<
  ModalCoordinatorContextType | undefined
>(undefined);

export const ModalCoordinatorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  return (
    <ModalCoordinatorContext.Provider value={{ activeModal, setActiveModal }}>
      {children}
    </ModalCoordinatorContext.Provider>
  );
};

export const useModalCoordinator = () => {
  const context = useContext(ModalCoordinatorContext);
  if (!context)
    throw new Error(
      "useModalCoordinator must be used within ModalCoordinatorProvider",
    );
  return context;
};
