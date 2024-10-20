export interface BusinessInfoProps {
  businessId?: string;
  businessName?: string;
  businessTypes?: string[];
  services?: string[];
  teamSize?: string;
  employeeIds?: string[];
  images?: {
    businessLogo?: string;
    coverImage?: string;
    portfolioImages?: string[];
  };
  raiting?: number;
  location?: {
    hasLocation?: boolean;
    address?: string;
    apartment?: string;
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
    thursday?: {
      start?: string;
      end?: string;
    };
    friday?: {
      start?: string;
      end?: string;
    };
    saturday?: {
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
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    X?: string;
    linkedin?: string;
  };
}
