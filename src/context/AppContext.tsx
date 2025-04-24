
import React, { createContext, useContext, useState } from 'react';
import { Product, Conrod } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface AppContextType {
  products: Product[];
  conrods: Conrod[];
  activeModule: string;
  setActiveModule: (module: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  addConrod: (conrod: Omit<Conrod, 'id' | 'srNo'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [conrods, setConrods] = useState<Conrod[]>([]);
  const [activeModule, setActiveModule] = useState<string>('pre-production');

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: uuidv4(),
    };
    setProducts([...products, newProduct]);
    toast.success('Product added successfully');
  };

  const addConrod = (conrod: Omit<Conrod, 'id' | 'srNo'>) => {
    const newConrod = {
      ...conrod,
      id: uuidv4(),
      srNo: conrods.length + 1,
    };
    setConrods([...conrods, newConrod]);
    toast.success('Conrod added successfully');
  };

  return (
    <AppContext.Provider
      value={{
        products,
        conrods,
        activeModule,
        setActiveModule,
        addProduct,
        addConrod,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
