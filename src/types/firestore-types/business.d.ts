// export interface BusinessInfoProps {
//   businessId?: string;
//   businessName?: string;
//   legalRegistrationNumber?: string;
//   businessDescription?: string;
//   businessTypes?: string[];
//   services?: string[];
//   teamSize?: string;
//   employeeIds?: string[];
//   images?: {
//     businessLogo?: string;
//     coverImage?: string;
//     portfolioImages?: string[];
//   };
//   raiting?: number;
//   legalLocation?: {
//     hasLocation?: boolean;
//     address?: string;
//     apartment?: string;
//     city?: string;
//     region?: string;
//     country?: string;
//     postalCode?: string;
//   };
//   businessLocations?: {
//     id?: string;
//     name?: string;
//     address?: string;
//     apartment?: string;
//     city?: string;
//     region?: string;
//     country?: string;
//     postalCode?: string;
//   }[];
//   openingHours?: {
//     monday?: {
//       start?: string;
//       end?: string;
//     };
//     tuesday?: {
//       start?: string;
//       end?: string;
//     };
//     wednesday?: {
//       start?: string;
//       end?: string;
//     };
//     thursday?: {
//       start?: string;
//       end?: string;
//     };
//     friday?: {
//       start?: string;
//       end?: string;
//     };
//     saturday?: {
//       start?: string;
//       end?: string;
//     };
//     sunday?: {
//       start?: string;
//       end?: string;
//     };
//   };
//   billingDetails?: string;
//   taxes?: [
//     {
//       taxName?: string;
//       taxRate?: number;
//     }
//   ];
//   receiptSequencing?: {
//     ReceiptNoPrefix?: string;
//     nextReceiptNumber?: number;
//   };
//   socialLinks?: {
//     website?: string;
//     facebook?: string;
//     instagram?: string;
//     X?: string;
//     linkedin?: string;
//   };
// }

// // Location data type
// export interface LocationProps {
//   id?: string;
//   name?: string;
//   address?: string;
//   apartment?: string;
//   city?: string;
//   region?: string;
//   country?: string;
//   postalCode?: string;
// }

// // Images data type
// export interface ImageProps {
//   businessLogo?: string;
//   coverImage?: string;
//   portfolioImages?: string[];
// }

// Galvenā biznesa informācija
export interface BusinessInfoProps {
  businessId?: string;
  businessName?: string;
  legalRegistrationNumber?: string;
  businessDescription?: string;
  businessTypes?: string[];
  services?: ServiceProps[]; // Pakalpojumi, ko piedāvā uzņēmums
  teamSize?: string;
  employeeIds?: string[];

  // Reitings un atsauksmes uzņēmumam
  rating?: RatingProps;
  reviews?: ReviewProps[];

  // Atsauce uz atrašanās vietu kolekciju (vairāki saloni)
  legalLocation?: LocationProps;
  businessLocations?: LocationProps[];

  // Attēli: logo, vāka attēls, portfolio
  images?: ImageProps;

  // Darba laiki uzņēmumam kopumā
  openingHours?: OpeningHoursProps;

  // Brīvdienas uzņēmumam
  holidays?: HolidayProps[];

  // Sociālās saites
  socialLinks?: SocialLinksProps;

  // Nodokļu informācija
  taxes?: TaxProps[];

  // Rēķinu numerācija
  receiptSequencing?: {
    receiptNoPrefix?: string;
    nextReceiptNumber?: number;
  };

  // Sekotāji
  followersCount?: number;
}

// Atrašanās vietas (saloni) struktūra
export interface LocationProps {
  id?: string;
  hasLocation?: boolean;
  name?: string;
  address?: string;
  apartment?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;

  // Reitings un atsauksmes katrai lokācijai
  rating?: RatingProps;
  reviews?: ReviewProps[];

  // Darbinieku dati, kas strādā šajā salonā
  employees?: EmployeeProps[];

  // Darba laiku datu tips katrai lokācijai
  openingHours?: OpeningHoursProps;

  // Brīvdienas salonam
  holidays?: HolidayProps[];
}

// Darbinieku struktūra
export interface EmployeeProps {
  id?: string;
  name?: string;
  role?: string;
  rating?: RatingProps;
  reviews?: ReviewProps[];

  // Darbinieka darba laiki
  workingHours?: OpeningHoursProps;

  // Pārtraukumi
  breaks?: BreakProps[];

  // Atvaļinājumi
  vacations?: VacationProps[];

  // Brīvdienas darbiniekam
  holidays?: HolidayProps[];
}

// Pakalpojumu struktūra
export interface ServiceProps {
  [key: string]: any;
  serviceId?: string;
  name?: string;
  description?: string;
  price?: number;
  duration?: number; // Pakalpojuma ilgums minūtēs
  employeeIds?: string[]; // Pieejamie darbinieki, kas piedāvā šo pakalpojumu
}

// Rezervāciju struktūra
export interface ReservationProps {
  [key: string]: any;
  reservationId?: string;
  serviceId?: string;
  employeeId?: string;
  customerId?: string;
  startTime?: string; // Rezervācijas sākuma laiks (ISO formāts)
  endTime?: string; // Rezervācijas beigu laiks (ISO formāts)
  status?: "pending" | "confirmed" | "completed" | "cancelled";
}

// Reitingu struktūra
export interface RatingProps {
  averageRating?: number; // Vidējais reitings
  totalRatings?: number; // Kopējais reitingu skaits
}

// Atsauksmju struktūra
export interface ReviewProps {
  [key: string]: any;
  reviewerId?: string; // Lietotāja ID, kurš atstāja atsauksmi
  reviewText?: string; // Atsauksmes teksts
  rating?: number; // Piešķirtais reitings
  createdAt?: Date; // Atsauksmes izveides datums
}

// Attēlu struktūra
export interface ImageProps {
  businessLogo?: string;
  coverImage?: string;
  portfolioImages?: string[]; // Saraksts ar portfeļa attēlu URL
}

// Darba laiku struktūra
export interface OpeningHoursProps {
  monday?: TimeRangeProps;
  tuesday?: TimeRangeProps;
  wednesday?: TimeRangeProps;
  thursday?: TimeRangeProps;
  friday?: TimeRangeProps;
  saturday?: TimeRangeProps;
  sunday?: TimeRangeProps;
}

// Pārtraukumu struktūra
export interface BreakProps {
  [key: string]: any;
  start?: string; // Pārtraukuma sākuma laiks (HH:mm)
  end?: string; // Pārtraukuma beigu laiks (HH:mm)
}

// Brīvdienu struktūra
export interface HolidayProps {
  date?: string; // Brīvdienas datums (YYYY-MM-DD)
  description?: string; // Brīvdienas apraksts
}

// Atvaļinājuma struktūra
export interface VacationProps {
  [key: string]: any;
  start?: string; // Atvaļinājuma sākuma datums (YYYY-MM-DD)
  end?: string; // Atvaļinājuma beigu datums (YYYY-MM-DD)
  description?: string; // Atvaļinājuma apraksts
}

// Darba laika intervālu struktūra
export interface TimeRangeProps {
  start?: string; // Sākuma laiks (HH:mm)
  end?: string; // Beigu laiks (HH:mm)
}

// Sociālo saišu struktūra
export interface SocialLinksProps {
  website?: string;
  facebook?: string;
  instagram?: string;
  X?: string; // bijušais Twitter
  linkedin?: string;
}

// Nodokļu struktūra
export interface TaxProps {
  taxName?: string;
  taxRate?: number;
}
