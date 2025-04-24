import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Conrod } from '@/types/types';
import { 
  fetchProducts, 
  createProduct, 
  fetchConrods, 
  createConrod, 
  updateProductQuantity as apiUpdateProductQuantity 
} from '@/lib/api';
import { toast } from 'sonner';

interface AppContextType {
  products: Product[];
  conrods: Conrod[];
  activeModule: string;
  setActiveModule: (module: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  addConrod: (conrod: Omit<Conrod, 'id' | 'srNo'>) => void;
  updateProductQuantity: (id: string, quantity: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [conrods, setConrods] = useState<Conrod[]>([]);
  const [activeModule, setActiveModule] = useState<string>('pre-production');

  useEffect(() => {
    fetchProducts().then(setProducts).catch(err => console.error(err));
    fetchConrods().then(setConrods).catch(err => console.error(err));
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const newProduct = await createProduct(product);
      setProducts(prev => [...prev, newProduct]);
      toast.success('Product added successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add product');
    }
  };

  const addConrod = async (conrod: Omit<Conrod, 'id' | 'srNo'>) => {
    try {
      const newConrod = await createConrod(conrod);
      setConrods(prev => [...prev, newConrod]);
      toast.success('Conrod added successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add conrod');
    }
  };

  const updateProductQuantity = async (id: string, quantity: number) => {
    try {
      const updated = await apiUpdateProductQuantity(id, quantity);
      setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
      toast.success('Inventory updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update inventory');
    }
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
        updateProductQuantity,
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
