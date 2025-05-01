"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ContatoModal } from '@/components/ui/ContatoModal';

interface ModalContextProps {
  openContatoModal: () => void;
  closeContatoModal: () => void;
  isContatoModalOpen: boolean;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isContatoModalOpen, setIsContatoModalOpen] = useState(false);

  const openContatoModal = () => setIsContatoModalOpen(true);
  const closeContatoModal = () => setIsContatoModalOpen(false);

  return (
    <ModalContext.Provider
      value={{
        openContatoModal,
        closeContatoModal,
        isContatoModalOpen,
      }}
    >
      {children}
      <ContatoModal
        isOpen={isContatoModalOpen}
        onClose={closeContatoModal}
      />
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
