export interface BusinessInfoProps {
  businessId?: string;
  businessName?: string;
  website?: string;
  businessTypes?: string[];
  services?: string[];
  teamSize?: number;
  employeeIds?: string[];
  location?: {
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  openingHours?: {
    monday?: {
      start?: string;
      end?: string;
    };
    tuesday?: {
      start?: string;
      end?: string;
    };
    wednesday?: {
      start?: string;
      end?: string;
    };
    thirstday?: {
      start?: string;
      end?: string;
    };
    friday?: {
      start?: string;
      end?: string;
    };
    saturtday?: {
      start?: string;
      end?: string;
    };
    sunday?: {
      start?: string;
      end?: string;
    };
  };
  billingDetails?: string;
  taxes?: [
    {
      taxName?: string;
      taxRate?: number;
    }
  ];
  receiptSequencing?: {
    ReceiptNoPrefix?: string;
    nextReceiptNumber?: number;
  };
}
