import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { fetchBills, Bill } from '@/lib/api';
import { fetchProduction, ProductionRecord } from '@/lib/api';
import { Button } from '@/components/ui/button';

const BillingHistoryPage: React.FC = () => {
  const { conrods } = useAppContext();
  const [bills, setBills] = useState<Bill[]>([]);
  const [productions, setProductions] = useState<ProductionRecord[]>([]);

  useEffect(() => {
    fetchBills().then(setBills).catch(err => console.error(err));
    fetchProduction().then(setProductions).catch(err => console.error(err));
  }, []);

  const handlePrintInvoice = (b: Bill) => {
    const rec = productions.find(r => r.id === b.productId);
    const conrod = rec && conrods.find(c => c.id === rec.conrodId);
    const html = `
      <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice - The Globe Stores Co.</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 0; 
      padding: 20px; 
      background-color: #f8f8f8; 
    }
    .invoice-box { 
      max-width: 800px; 
      margin: auto; 
      padding: 0; 
      background-color: white; 
      border: 1.5px solid #000; /* Thicker outer border */
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
    }
    td { 
      padding: 4px; 
      vertical-align: top; 
      font-size: 12px; 
      border: 0.5px solid #000; /* Thinner inner borders */
    }
    
    /* Main items table outer border and header separators */
    .main-table {
      border: 1px solid #000;
      margin-top: -1px;
    }
    .main-table tr:first-child td {
      border-bottom: 1px solid #000; /* Header bottom line */
    }
    .company-name { 
      font-size: 22px; 
      font-weight: bold; 
      color: #1a3c78; 
      margin-bottom: 2px; 
      letter-spacing: 1px; 
    }
    .tax-invoice { 
      font-size: 14px; 
      font-weight: bold; 
      color: #1a3c78; 
      text-align: center; 
      margin-bottom: 5px;
      text-decoration: underline; 
    }
    .jurisdiction { 
      font-size: 10px; 
      color: #1a3c78; 
      padding: 2px 0; 
      text-align: center; 
      font-weight: bold; 
    }
    .company-details { 
      font-size: 11px; 
      color: #1a3c78; 
    }
    .logo { 
      float: left;
      width: 100px; 
      margin-right: 10px; 
    }
    .tagline { 
      color: #1a3c78; 
      font-weight: bold; 
      font-size: 12px; 
      margin-top: 5px;
    }
    .business-type { 
      color: #1a3c78; 
      font-size: 11px; 
    }
    .description-header {
      letter-spacing: 3px;
      text-align: center;
    }
    .footer-signature { 
      text-align: right; 
      vertical-align: bottom; 
      font-size: 11px; 
      padding-right: 10px; 
    }
    .eo-text { 
      font-size: 10px; 
      padding-left: 5px; 
      text-align: left; 
    }
    .section-header {
      font-size: 11px;
      color: #1a3c78;
    }
  </style>
</head>
<body>
  <div class="invoice-box">
    <div class="tax-invoice">TAX INVOICE</div>
    
    <!-- Header Section -->
    <table>
      <tr>
        <td style="width: 65%; vertical-align: top; padding: 10px; border-right: none;">
          <div style="display: flex;">
            <div class="logo">
              <!-- Logo SVG -->
              <svg viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="50" cy="35" rx="45" ry="30" stroke="#1a3c78" stroke-width="1.5" fill="none"/>
                <ellipse cx="50" cy="35" rx="40" ry="25" stroke="#1a3c78" stroke-width="0.75" fill="none"/>
                <path d="M20,35 L80,35" stroke="#1a3c78" stroke-width="0.75" fill="none"/>
                <path d="M50,10 L50,60" stroke="#1a3c78" stroke-width="0.75" fill="none"/>
                <path d="M30,15 C40,40 60,40 70,15" stroke="#1a3c78" stroke-width="0.75" fill="none"/>
                <path d="M30,55 C40,30 60,30 70,55" stroke="#1a3c78" stroke-width="0.75" fill="none"/>
                <rect x="32" y="30" width="36" height="10" rx="2" ry="2" fill="#1a3c78"/>
                <text x="50" y="38" text-anchor="middle" fill="white" font-size="8" font-weight="bold">GLOSTOCO</text>
              </svg>
            </div>
            <div>
              <div class="company-name">THE GLOBE STORES CO.</div>
              <div class="company-details">4-D Block, Greenstone Heritage, D. N. Road, Mumbai - 400 001.</div>
              <div class="company-details">Mob.: 98201 25895 • Email: sarangtagare@gmail.com</div>
              <div class="company-details">GSTIN: 27AABFT4424E1ZG</div>
            </div>
          </div>
          
          <div class="tagline">QUALITY TRUST EXCELLENCE</div>
          <div class="business-type">Dealers & Exporters: Two / Three Wheeler Spares & Accessories</div>
        </td>
        
        <td style="width: 35%; padding: 0; vertical-align: top; border-left: none;">
          <div class="jurisdiction" style="border-bottom: 1px solid #000;">SUBJECT TO MUMBAI JURISDICTION</div>
          
          <!-- Invoice no and date -->
          <table style="border-collapse: collapse; margin: 0;">
            <tr>
              <td style="width: 60%; border-right: 1px solid #000;">INVOICE NO.</td>
              <td style="width: 40%">DATE</td>
            </tr>
            <tr>
              <td style="height: 20px; border-right: 1px solid #000;"></td>
              <td style="height: 20px;"></td>
            </tr>
          </table>
          
          <!-- Order no and date -->
          <table style="border-collapse: collapse; margin: 0; border-top: none;">
            <tr>
              <td style="width: 60%; border-right: 1px solid #000; border-top: 1px solid #000;">YOUR ORDER NO.</td>
              <td style="width: 40%; border-top: 1px solid #000;">DATE</td>
            </tr>
            <tr>
              <td style="height: 20px; border-right: 1px solid #000;"></td>
              <td style="height: 20px;"></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <!-- Customer/Address Section with Packing & Documents -->
    <table style="border-collapse: collapse; margin-top: -1px;">
      <tr>
        <td style="width: 65%; height: 120px;"></td>
        <td style="width: 35%; vertical-align: top; padding: 0;">
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="border-top: 0.5px solid #000;">PACKING NOTE NO. / DELIVERY CHALLAN NO.</td>
            </tr>
            <tr>
              <td style="height: 20px;"></td>
            </tr>
            <tr>
              <td style="border-top: 0.5px solid #000;">DOCUMENTS THROUGH</td>
            </tr>
            <tr>
              <td style="height: 20px;"></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <!-- Transport Section -->
    <table style="border-collapse: collapse; margin-top: -1px;">
      <tr>
        <td style="width: 15%;" class="section-header">TRANSPORTER</td>
        <td style="width: 50%;"></td>
        <td style="width: 10%; text-align: center;" class="section-header">LR./RR.<br>NO.</td>
        <td style="width: 25%;"></td>
      </tr>
    </table>
    
    <!-- Items Table -->
    <table class="main-table">
      <tr>
        <td style="width: 5%; text-align: center;" class="section-header">SR.<br>NO.</td>
        <td style="width: 10%; text-align: center;" class="section-header">PART<br>NO.</td>
        <td style="width: 40%;" class="description-header section-header">D E S C R I P T I O N</td>
        <td style="width: 10%; text-align: center;" class="section-header">UNIT</td>
        <td style="width: 10%; text-align: center;" class="section-header">QTY.</td>
        <td style="width: 10%; text-align: center;" class="section-header">RATE</td>
        <td style="width: 15%; text-align: center;" class="section-header">AMOUNT</td>
      </tr>
      <tr class="empty-row" style="height: 400px;">
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td colspan="5" class="eo-text" style="border-right: none; vertical-align: bottom;">E. & O. E.</td>
        <td colspan="2" class="footer-signature" style="border-left: none;">
          For THE GLOBE STORES CO.<br><br><br>
          Partner
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
    const w = window.open('', '_blank', 'width=800,height=600');
    if (w) { w.document.write(html); w.document.close(); w.focus(); w.print(); }
  };

  const handlePrintBill = (b: Bill) => {
    const rec = productions.find(r => r.id === b.productId);
    const conrod = rec && conrods.find(c => c.id === rec.conrodId);
    const dateStr = new Date().toLocaleDateString();
    const rate = (b.amount / b.quantity).toFixed(2);
    const html = `
  <html>
  <head>
    <title>Invoice ${b.invoiceNo}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
      .invoice-box { max-width: 800px; margin: auto; padding: 20px; background-color:rgb(249, 226, 113); border: 1px solid #000; }
      table { width: 100%; border-collapse: collapse; }
      .header { font-size: 20px; font-weight: bold; text-align: left; margin-bottom: 5px; }
      .address { font-size: 12px; margin-bottom: 15px; }
      td { font-size: 12px; }
      .main-table td { border: 1px solid #000; padding: 4px; vertical-align: top; }
      .items-table { border-collapse: collapse; margin: 0; }
      .items-table td { border: 1px solid #000; padding: 4px; }
      .footer-table td { border: 1px solid #000; padding: 4px; }
      .no-border { border: none !important; }
    </style>
  </head>
  <body>
    <div class="invoice-box">
      <div class="header">GLOBE ACCESSORIES PVT. LTD.</div>
      <div class="address">Gate No.: 2145/2146, Nanekarwadi, Chakan,<br>Tal.: Khed, Dist.: Pune - 410 501.</div>
      
      <table class="main-table">
        <tr>
          <td style="width: 65%">Range - CHAKAN VII Tal. Khed, Dist. Pune - 410 501.</td>
          <td style="width: 35%">INVOICE NO.</td>
        </tr>
        <tr>
          <td>Division - Pune V, Dr. Ambedkar Road, Excise Bhavan,<br>Akurdi Pune - 411 044.</td>
          <td>Date:</td>
        </tr>
        <tr>
          <td>To,</td>
          <td rowspan="1">
            *CLEARANCE FOR HOME CONSUMPTION /<br>
            EXPORT NATURE FOR REMOVAL (e.g. Stock<br>
            Transfer / Captive use Related Person /<br>
            Independent Buyer etc.<br>
            <br>
            I. T. PAN No.: AAACG 4166 H
          </td>
        </tr>
        <tr>
          <td>E.C.C. No.:</td>
          <td>P.L.A. No.: 170 / 87 / 97</td>
        </tr>
        <tr>
          <td>GST No.:</td>
          <td>Name of Excisable Commodity : Parts & Accessories of Vehicles</td>
        </tr>
        <tr>
          <td>Category of Consignee<br>Wholesale dealer / Industrial Consumer / Government Department / etc.</td>
          <td>Tariff Heading No. 8714 19 00<br>Exemption Notification No.</td>
        </tr>
        <tr>
          <td>Your P. O. No. & Date</td>
          <td>Rate of Duty:<br>[Notification No.] 8 / 2003 dated 01/03/2003</td>
        </tr>
        <tr>
          <td>Delivery Challan No. & Date</td>
          <td></td>
        </tr>
      </table>

      <table class="items-table" style="width: 100%; margin-top:0; border-top:0;">
        <tr>
          <td style="width: 5%">Sr.<br>No.</td>
          <td style="width: 40%">Description and Specification<br>of goods</td>
          <td style="width: 15%">No. & description<br>of Packages</td>
          <td style="width: 10%">Total Qty. of<br>goods (net)</td>
          <td style="width: 15%">Rate per Unit Rs.</td>
          <td style="width: 15%">Total Amount<br>Rs.</td>
        </tr>
        <tr style="height: 400px;">
          <td>${b.productId ? '1' : ''}</td>
          <td>${conrod?.name || ''}</td>
          <td></td>
          <td>${b.quantity || ''}</td>
          <td>${rate || ''}</td>
          <td>${b.amount ? b.amount.toFixed(2) : ''}</td>
        </tr>
      </table>

      <table class="footer-table" style="width: 100%; border-collapse: collapse; margin-top:0;">
        <tr>
          <td rowspan="2" style="width: 10%; border: 1px solid black;">Debit<br>Entry</td>
          <td style="width: 10%; border: 1px solid black;">P.L.A.</td>
          <td style="width: 20%; border: 1px solid black;">S. No.</td>
          <td style="width: 20%; border: 1px solid black;">Date</td>
          <td style="width: 10%; border: 1px solid black;">Rs.</td>
          <td style="width: 15%; border: 1px solid black;"></td>
          <td style="width: 15%; border: 1px solid black;"></td>
        </tr>
        <tr>
          <td style="border: 1px solid black;">Cenvat</td>
          <td style="border: 1px solid black;"></td>
          <td style="border: 1px solid black;"></td>
          <td style="border: 1px solid black;"></td>
          <td style="border: 1px solid black;"></td>
          <td style="border: 1px solid black;"></td>
        </tr>
        <tr>
          <td colspan="3" style="border: 1px solid black;">Date of issue of Invoice:</td>
          <td style="border: 1px solid black;">Time of issue of Invoice:</td>
          <td style="border: 1px solid black;">Hrs.</td>
          <td style="border: 1px solid black;"></td>
          <td style="border: 1px solid black;"></td>
        </tr>
        <tr>
          <td colspan="3" style="border: 1px solid black;">Date of removal:</td>
          <td style="border: 1px solid black;">Time of removal:</td>
          <td style="border: 1px solid black;">Hrs.</td>

          <td style="border: 1px solid black;"></td>
          <td style="border: 1px solid black;"></td>
        </tr>
        <tr>
          <td colspan="3" style="border: 1px solid black;">Mode of Transport:</td>
          <td colspan="2" style="border: 1px solid black;">Veh. No.:</td>

          <td style="border: 1px solid black;"></td>
          <td style="border: 1px solid black;"></td>
        </tr>
        <tr>
          <td colspan="5" style="border: 1px solid black; font-size: 11px;">Certified that the particulars given above are true and correct and the amount indicated represents the price<br>actually charged and that there is no flow additional consideration directly or indirectly from the buyer.</td>
          <td style="border: 1px solid black; text-align: right;">Total</td>
        
          <td style="border: 1px solid black;"></td>
        </tr>
        <tr>
          <td colspan="5 style="border: 1px solid black;">Amount in words:</td>
          <td style="border: 1px solid black; text-align: right;">Round Off</td>

          <td style="border: 1px solid black;"></td>
        </tr>
        <tr>
          <td colspan="5" style="border: 1px solid black;"></td>
          <td style="border: 1px solid black; text-align: right;">Grand Total</td>

          <td style="border: 1px solid black;"></td>
        </tr>
        <tr>
          <td colspan="3" style="border: 1px solid black;">GST No.: 27AAACG4173B1Z0</td>
          <td style="border: 1px solid black; text-align: center;">Space for Pre-authentication</td>
          <td colspan="5" style="border: 1px solid black; text-align: center;">For Globe Accessories Pvt. Ltd.<br><br><br>Authorised Signatories</td>
        </tr>
      </table>
    </div>
  </body>
  </html>`;
    const w = window.open('', '_blank', 'width=600,height=600');
    if (w) { w.document.write(html); w.document.close(); w.focus(); w.print(); }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Billing History</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">No bills yet.</td>
                  </tr>
                ) : (
                  bills.map(b => {
                    const rec = productions.find(r => r.id === b.productId);
                    const prod = rec ? conrods.find(c => c.id === rec.conrodId) : undefined;
                    return (
                      <tr key={b.id}>
                        <td>{b.invoiceNo}</td>
                        <td>{prod?.name || b.productId}</td>
                        <td>{b.quantity}</td>
                        <td>{b.amount}</td>
                        <td>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handlePrintBill(b)}>Print Bill</Button>
                            <Button variant="outline" size="sm" onClick={() => handlePrintInvoice(b)}>Print Invoice</Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingHistoryPage;
