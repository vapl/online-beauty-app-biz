interface Service {
  serviceId: string; // Unikāls pakalpojuma ID
  name: string; // Pakalpojuma nosaukums
  description: string; // Pakalpojuma apraksts
  price: number; // Cena (piemēram, EUR)
  duration: number; // Ilgums minūtēs
  employeeIds: string[]; // Saraksts ar darbinieku ID, kas piedāvā šo pakalpojumu
  isAvailable: boolean; // Vai pakalpojums ir pieejams
  category?: string; // Pakalpojuma kategorija, ja tiek kategorizēts (pēc izvēles)
  discount?: Discount; // Atlaides vai īpašās cenas (pēc izvēles)
  tags?: string[]; // Etiķetes pakalpojuma meklēšanai un filtrēšanai (piemēram, "hair", "nails")
  imageUrl?: string; // Attēls, kas pārstāv pakalpojumu (pēc izvēles)
}

interface Discount {
  percentage?: number; // Atlaides procenti (ja tiek izmantota procentuālā atlaide)
  fixedAmount?: number; // Fiksēta atlaide (piemēram, 5 EUR)
  startDate?: FirebaseFirestore.Timestamp; // Atlaides sākuma datums (FirebaseFirestore.Timestamp formāts)
  endDate?: FirebaseFirestore.Timestamp; // Atlaides beigu datums (FirebaseFirestore.Timestamp formāts)
}

/*/////////////////////////////////////////////////////////////

Paskaidrojumi:
-----------------------------
category (pēc izvēles) – šis lauks var palīdzēt kategorizēt pakalpojumus, piemēram, "Frizētava", "Manikīrs" utt.
discount (pēc izvēles) – objekts, kas pārvalda atlaides, kur var būt procentuāla vai fiksēta atlaide. Iekļauts arī atlaides darbības periods (sākuma un beigu datumi).
tags (pēc izvēles) – saraksts ar etiķetēm, kas palīdz meklēt un filtrēt pakalpojumus (piemēram, "hair", "nails"). Tas var būt noderīgi pakalpojumu meklēšanā vai kategorizēšanā.
imageUrl (pēc izvēles) – pakalpojuma attēla URL, kas var tikt izmantots vizuālajai prezentācijai.
Paskaidrojumi:
Discount – šis objekts ļauj pievienot atlaides pakalpojumam. Atlaides var būt vai nu procentuālas (piemēram, 10% atlaide), vai fiksētas (piemēram, 5 EUR atlaide). Iekļauj arī atlaides periodu, ja nepieciešams.

*/ ////////////////////////////////////////////////////////////
