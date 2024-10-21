interface Absence {
  id: string; // Unikāls prombūtnes ID (var būt vacationId vai breakId)
  type: "vacation" | "break"; // Prombūtnes tips: atvaļinājums vai pārtraukums
  startTime: FirebaseFirestore.Timestamp; // Prombūtnes sākuma laiks vai datums (Firestore.Timestamp formāts vai "HH:mm" formāts atkarībā no tipa)
  endTime?: FirebaseFirestore.Timestamp; // Prombūtnes beigu laiks vai datums (nepieciešams atvaļinājumiem, bet ne vienmēr pārtraukumiem)
  duration?: number; // Prombūtnes ilgums minūtēs (pārtraukumiem)
  approved?: boolean; // Vai atvaļinājums ir apstiprināts (pēc izvēles atvaļinājumiem)
}

/*/////////////////////////////////////////////////////////////

Paskaidrojumi:
-----------------------------
id – unikāls ID, kas var būt atvaļinājuma vai pārtraukuma identifikators.
type – nosaka, vai prombūtne ir atvaļinājums (vacation) vai pārtraukums (break).
startTime – sākuma laiks vai datums. Atvaļinājumiem tas ir Firestore.Timestamp datuma formāts, bet pārtraukumiem var būt "HH
".
endTime – pēc izvēles lauks atvaļinājuma beigu laikam vai datumam. Ne vienmēr nepieciešams pārtraukumiem.
duration – pārtraukuma ilgums minūtēs. Piemērojams tikai pārtraukumiem, tāpēc tas ir izvēles lauks.
approved – pēc izvēles lauks atvaļinājumiem, lai norādītu, vai atvaļinājums ir apstiprināts.


*/ ////////////////////////////////////////////////////////////
