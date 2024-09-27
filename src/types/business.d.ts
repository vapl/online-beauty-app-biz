export interface BusinessInfoProps {
  businessId?: string;
  businessName?: string;
  website?: string;
  businessTypes?: string[];
  services?: string[];
  teamSize?: string;
  employeeIds?: string[];
  location?: {
    hasLocation?: boolean;
    address?: string;
    city?: string;
    parish?: string;
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
  userFeedback?: {
    question: string;
    response?: string;
  };
}
