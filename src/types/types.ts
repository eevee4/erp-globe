export interface Product {
  id: string;
  productName: string;
  productType: 'Ball Bearings' | 'Pins' | 'Conrod';
  dimensions: {
    diameter?: number; // For Ball Bearings
    height?: number; // For Pins
    diameter2?: number; // For Pins (second diameter)
    smallEndDiameter?: number; // For Conrod
    bigEndDiameter?: number; // For Conrod
    centerDistance?: number; // For Conrod
  };
  quantity: number;
  date: string;
}

export interface Conrod {
  id: string;
  srNo: number;
  name: string;
  dimensions: {
    smallEndDiameter: number;
    bigEndDiameter: number;
    centerDistance: number;
  };
  pin: string;
  ballBearing: string;
}

export interface ProductionRecord {
  id: string;
  conrodId: string;
  quantity: number;
  date: string;
}

export interface Bill {
  id: string;
  invoiceNo: string;
  productId: string; // This links to ProductionRecord ID
  quantity: number;
  amount: number;
  date: string;
}
