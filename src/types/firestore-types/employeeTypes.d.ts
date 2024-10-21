interface Employee {
  employeeId: string; // Unikāls darbinieka ID
  name: string; // Darbinieka vārds
  role: "hairdresser" | "nail_specialist"; // Darbinieka loma
  workingHours: WorkingHours; // Darba laiks, sadalīts pa dienām
  avatar: string; // URL uz darbinieka attēlu
  rating: EmployeeRating; // Darbinieka reitings
  reviews: string[]; // Atsauces uz atsauksmēm
  vacations: string[]; // Atsauces uz atvaļinājumiem
  holidays: string[]; // Atsauces uz brīvdienām
  breaks: string[]; // Atsauces uz pārtraukumiem
}

interface WorkingHours {
  monday?: TimeRange;
  tuesday?: TimeRange;
  wednesday?: TimeRange;
  thursday?: TimeRange;
  friday?: TimeRange;
  saturday?: TimeRange;
  sunday?: TimeRange;
}

interface TimeRange {
  start: string; // Darba laika sākums (formātā "HH:mm")
  end: string; // Darba laika beigas (formātā "HH:mm")
}

interface EmployeeRating {
  averageRating: number; // Vidējais reitings (piemēram, 4.5)
  totalRatings: number; // Kopējais vērtējumu skaits (piemēram, 50)
}

/*/////////////////////////////////////////////////////////////

Paskaidrojumi:
-----------------------------
employeeId – unikāls darbinieka ID.
name – darbinieka vārds.
role – darbinieka loma, kas šajā gadījumā ir hairdresser vai nail_specialist. Pievienojot jaunus amatus, šo sarakstu var paplašināt.
workingHours – objekts, kas satur darba laiku sadalītu pa dienām, līdzīgi kā lokācijām.
avatar – darbinieka attēla URL.
rating – objekts, kas satur darbinieka vidējo reitingu un kopējo vērtējumu skaitu.
reviews – saraksts ar atsauces ID uz darbinieka atsauksmēm.
vacations – saraksts ar atsauces ID uz darbinieka atvaļinājumiem.
holidays – saraksts ar atsauces ID uz darbinieka brīvdienām.
breaks – saraksts ar atsauces ID uz darbinieka pārtraukumiem.
-------------------------------
Papildus detaļas:
WorkingHours un TimeRange tiek izmantoti līdzīgi kā lokācijās, lai norādītu darba laika sākumu un beigas katrai nedēļas dienai.
EmployeeRating satur gan vidējo reitingu (averageRating), gan kopējo vērtējumu skaitu (totalRatings), kas palīdz ātri aprēķināt darbinieka popularitāti un kvalitāti.

*/ ////////////////////////////////////////////////////////////
