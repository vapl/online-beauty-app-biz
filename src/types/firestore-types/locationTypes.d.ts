export interface Location {
  locationId?: string; // Unikāls lokācijas ID
  name?: string; // Lokācijas nosaukums (piemēram, salons)
  address?: string; // Pilna adrese
  appartment?: string;
  city?: string; // Pilsēta
  postalCode?: string; // Pasta indekss
  country?: string;
  region?: string;
  openingHours?: OpeningHours; // Darba laiks, sadalīts pa dienām
}

export interface OpeningHours {
  monday?: TimeRange;
  tuesday?: TimeRange;
  wednesday?: TimeRange;
  thursday?: TimeRange;
  friday?: TimeRange;
  saturday?: TimeRange;
  sunday?: TimeRange;
}

export interface TimeRange {
  start: string; // Darba laika sākums (formātā "HH:mm")
  end: string; // Darba laika beigas (formātā "HH:mm")
}

/*/////////////////////////////////////////////////////////////

Paskaidrojumi:
-----------------------------
locationId – unikāls lokācijas ID.
name – lokācijas vai salona nosaukums.
address – pilna adrese, kur atrodas lokācija.
city – pilsēta, kur atrodas lokācija.
postalCode – pasta indekss lokācijas adresei.
openingHours – objekts, kurā ir katras dienas darba laiks (monday, tuesday utt.).
TimeRange – laika diapazons ar start un end laukiem, kas norāda darba laiku dienās.
-----------------------------
Papildu informācija:
openingHours ir pēc izvēles definēts katrai dienai, kas nozīmē, ka, ja lokācija ir slēgta kādā dienā, var vienkārši neiekļaut šo dienu (piemēram, saturday?: TimeRange).
TimeRange izmanto formātu "HH:mm" (piemēram, "09:00"), lai norādītu darba sākuma un beigu laiku.

*/ ////////////////////////////////////////////////////////////
