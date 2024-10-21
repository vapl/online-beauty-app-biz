interface Review {
  reviewId: s; // Unikāls atsauksmes ID
  authorId: string; // Lietotāja ID, kurš uzrakstījis atsauksmi
  targetId: string; // Atsauce uz businessId, locationId vai employeeId
  targetType: "business" | "location" | "employee"; // Atsauksmes mērķis
  rating: number; // Atsauksmes vērtējums (parasti no 1 līdz 5)
  reviewText: string; // Atsauksmes teksts
  createdAt: FirebaseFirestore.Timestamp; // Atsauksmes izveides datums (FirebaseFirestore.Timestamp formāts, piemēram, '2024-11-01T12:34:56Z')
}

/*/////////////////////////////////////////////////////////////

Paskaidrojumi:
--------------------------
reviewId – unikāls atsauksmes ID.
authorId – lietotāja ID, kurš sniedza atsauksmi.
targetId – atsauce uz uzņēmumu, lokāciju vai darbinieku, kurš ir atsauksmes mērķis.
targetType – norāda, vai atsauksme ir par uzņēmumu (business), lokāciju (location), vai darbinieku (employee).
rating – atsauksmes vērtējums, kur vērtība var būt no 1 līdz 5.
reviewText – tekstuāla atsauksme, ko lietotājs sniedz.
createdAt – atsauksmes izveides datums FirebaseFirestore.Timestamp formātā (piemēram, 2024-11-01T12:34:56Z).

/*/ ////////////////////////////////////////////////////////////
