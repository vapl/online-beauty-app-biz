export interface PortfolioImage {
  imageId: string; // Unikāls attēla ID
  businessId: string;
  uploadedBy: string;
  targetLocationId: string;
  targetEmployeeId: string;
  imageUrl: string; // Attēla URL
  caption?: string; // Pēc izvēles: attēla apraksts
  uploadedAt: FirebaseFirestore.Timestamp; // Firestore.Timestamp datuma formāts (piemēram, '2024-11-01T12:34:56Z')
  likes: string[]; // Saraksts ar lietotāju ID, kuri ir atzīmējuši šo attēlu ar "patīk"
}

/*/////////////////////////////////////////////////////////////

Paskaidrojumi:
--------------------------
imageId – unikāls attēla ID.
targetId – atsauce uz mērķa objektu (piemēram, uzņēmuma, lokācijas vai darbinieka ID).
targetType – norāda, uz ko attēls ir saistīts, un var būt: business, location, vai employee.
imageUrl – attēla URL, kas norāda uz faila atrašanās vietu.
caption (pēc izvēles) – attēla apraksts, ja tāds ir pieejams.
uploadedAt – datums, kad attēls tika augšupielādēts, Firestore.Timestamp formātā (piemēram, 2024-11-01T12:34:56Z).
likes – saraksts ar lietotāju ID, kuri ir atzīmējuši šo attēlu ar "patīk".

/*/ ////////////////////////////////////////////////////////////
