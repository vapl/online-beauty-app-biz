export interface Business {
  businessId?: string;
  businessName?: string;
  isVatRegisterd?: boolean;
  legalRegistrationNumber?: string;
  onsiteService?: boolean;
  legalAddress?: LegalAddress;
  phone?: string; // Uzņēmuma tālrunis
  email?: string; // Uzņēmuma e-pasts
  businessDescription?: string;
  businessTypes?: string[]; // Piemēram: ['beauty', 'massage']
  businessSize?: string;
  ownerId?: string; // Atsauce uz lietotāja ID (User ID)
  subscription?: SubscriptionDetails; // Abonementa informācija
  services?: string[]; // Saraksts ar pakalpojumu ID
  followersCount?: number; // Sekotāju skaits
  images?: BusinessImages; // Uzņēmuma attēli
  locations?: string[]; // Atsauces uz lokācijas ID
  employees?: string[]; // Atsauces uz darbinieku ID
  socialLinks?: SocialLinks; // Sociālās saites
  blackListedClients?: BlackListedClient[];
  bankDetails?: BankDetails;
  taxes?: TaxTypes;
}

export interface LegalAddress {
  address: string; // Pilna adrese
  appartment?: string;
  city: string; // Pilsēta
  postalCode: string; // Pasta indekss
  country: string;
  region?: string;
}

export interface SubscriptionDetails {
  status: "trial" | "active" | "canceled"; // Abonementa statuss
  plan: "basic" | "premium"; // Plāns
  trialPeriodEnd: FirebaseFirestore.Timestamp; // Izmēģinājuma perioda beigu datums (Firestore.Timestamp formāts)
  billingDate: FirebaseFirestore.Timestamp; // Nākamais rēķina datums (Firestore.Timestamp formāts)
  lastPaymentDate: FirebaseFirestore.Timestamp; // Pēdējais maksājuma datums (Firestore.Timestamp formāts)
  amount: number; // Abonementa maksa
}

export interface BusinessImages {
  businessLogo: string; // Uzņēmuma logo URL
  coverImage: string; // Vāka attēla URL
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  website?: string;
}

export interface BlackListedClient {
  customerId: string; // Unikāls klienta ID
  reason: string; // Iemesls, kāpēc klients ir melnajā sarakstā
  addedAt: FirebaseFirestore.Timestamp; // Datums, kad klients tika pievienots melnajam sarakstam (Firestore.Timestamp formāts)
}

export interface BankDetails {
  accountHolderName: string;
  iban: string;
  bic?: string;
  bankName?: string;
  accountNumber?: string;
}

export interface TaxTypes {
  vat?: number;
  incomeTax: number;
  socialSecurityTax: number;
  microEnterpriceTax: number;
  propertyTax?: number;
  otherTaxes?: OtherTax[];
}

export interface OtherTax {
  taxName: string;
  taxRate: number;
}

/*/////////////////////////////////////////////////////////////

  Paskaidrojumi:
  -----------------------------
businessId – unikāls uzņēmuma ID.
businessName – uzņēmuma nosaukums.
legalRegistrationNumber – juridiskās reģistrācijas numurs.
 onsiteService - piedāvā izbraukuma servisu.
phone – uzņēmuma kontakttālrunis.
email – uzņēmuma e-pasta adrese.
businessDescription – uzņēmuma apraksts.
businessTypes – uzņēmuma kategorijas (saraksts, kurā var būt dažādi uzņēmuma veidi, piemēram, skaistumkopšana, masāža).
ownerId – uzņēmuma īpašnieka lietotāja ID (atsauce uz User dokumentu).
subscription – objekts, kas satur visu abonementa informāciju:
status – abonementa statuss (trial, active, canceled).
plan – abonementa plāns (basic, premium).
trialPeriodEnd, billingDate, lastPaymentDate – datumi Firestore.Timestamp formātā.
amount – pašreizējā abonementa maksa.
services – saraksts ar pakalpojumu ID, kas norāda, kādus pakalpojumus uzņēmums piedāvā.
teamSize – uzņēmuma komandas lielums (piemēram, 10 darbinieki).
followersCount – uzņēmuma sekotāju skaits.
images – uzņēmuma attēli, kas iekļauj logo un vāka attēlu.
locations – saraksts ar lokācijas ID, kas norāda uzņēmuma atrašanās vietas (piemēram, salonu adreses).
employees – saraksts ar darbinieku ID (atsauces uz Employee dokumentiem).
Atsevišķas struktūras:
SubscriptionDetails – detalizēta informācija par abonementu, kas satur statusu, plānu, datumu un maksājumu informāciju.
BusinessImages – uzņēmuma attēli, piemēram, logotips un vāka attēls.

  /*/ ////////////////////////////////////////////////////////////
