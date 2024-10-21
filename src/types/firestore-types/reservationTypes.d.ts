interface Reservation {
  reservationId: string; // Unikāls rezervācijas ID
  serviceId: string; // Atsauce uz pakalpojuma ID
  businessId: string; // Atsauce uz uzņēmuma ID
  locationId: string; // Atsauce uz lokācijas ID (salonu)
  employeeId: string; // Atsauce uz darbinieka ID
  customerId: string; // Atsauce uz klienta ID
  startTime: FirebaseFirestore.Timestamp; // Rezervācijas sākuma laiks (Firestore.Timestamp formāts)
  endTime: FirebaseFirestore.Timestamp; // Rezervācijas beigu laiks (Firestore.Timestamp formāts)
  status: "pending" | "confirmed" | "completed" | "cancelled"; // Rezervācijas statuss
  paymentStatus: "pending" | "completed" | "failed"; // Maksājuma statuss
  prepaymentRequired: boolean; // Vai priekšapmaksa ir nepieciešama
  paymentId: string; // Atsauce uz maksājuma ID (ja pieejams)
}

/*/////////////////////////////////////////////////////////////

Paskaidrojumi:
--------------------------
reservationId – unikāls rezervācijas ID.
serviceId – atsauce uz pakalpojuma ID, kurš tiek rezervēts.
businessId – atsauce uz uzņēmuma ID, pie kura tiek veikta rezervācija.
locationId – atsauce uz lokācijas (salona) ID, kurā rezervācija notiek.
employeeId – atsauce uz darbinieka ID, kurš veic pakalpojumu.
customerId – atsauce uz klienta ID, kurš veic rezervāciju.
startTime un endTime – rezervācijas sākuma un beigu laiks Firestore.Timestamp formātā (piemēram, 2024-11-01T12:00:00Z).
status – rezervācijas statuss, kas var būt pending (gaidīšana), confirmed (apstiprināts), completed (izpildīts) vai cancelled (atcelts).
paymentStatus – maksājuma statuss, kas var būt pending (gaidīšana), completed (pabeigts) vai failed (neveiksmīgs).
prepaymentRequired – norāda, vai rezervācijai ir nepieciešama priekšapmaksa.
paymentId – atsauce uz maksājuma ID, ja maksājums ir veikts vai saistīts ar šo rezervāciju.

/*/ ////////////////////////////////////////////////////////////
