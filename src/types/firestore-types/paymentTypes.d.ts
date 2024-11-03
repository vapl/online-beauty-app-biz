interface Payment {
  paymentId: string; // Unikāls maksājuma ID
  reservationId: string; // Atsauce uz rezervācijas ID
  customerId: string; // Atsauce uz klienta ID
  businessId: string; // Atsauce uz uzņēmuma vai pašnodarbinātā ID
  amount: number; // Maksājuma summa
  currency: string; // Valūta (piemēram, "EUR")
  paymentMethod: "card" | "paypal" | "stripe"; // Maksājuma metode
  paymentStatus: "pending" | "completed" | "failed"; // Maksājuma statuss
  paymentDate: FirebaseFirestore.Timestamp; // Maksājuma datums (Firestore TimeStamp formāts)
  transactionId?: string; // Maksājuma pakalpojuma transakcijas ID (pēc izvēles)
}

/*/////////////////////////////////////////////////////////////

Paskaidrojumi:
--------------------------
paymentId – unikāls maksājuma identifikators.
reservationId – atsauce uz rezervācijas ID, par kuru maksājums tika veikts.
customerId – atsauce uz klientu, kurš veica maksājumu.
businessId – atsauce uz uzņēmuma vai pašnodarbinātā ID, kuram tika veikts maksājums.
amount – maksājuma summa (piemēram, 49.99).
currency – valūta, kurā maksājums tika veikts (piemēram, "EUR").
paymentMethod – maksājuma metode, var būt card, paypal, vai stripe.
paymentStatus – maksājuma statuss, kas var būt pending (gaidīšana), completed (pabeigts) vai failed (neveiksmīgs).
paymentDate – datums un laiks, kad maksājums tika veikts, Firestore TimeStamp formātā (piemēram, 2024-11-01T12:34:56Z).
transactionId (pēc izvēles) – maksājumu pakalpojuma transakcijas ID (piemēram, ja maksājums tika veikts caur Stripe vai PayPal).

/*/ ////////////////////////////////////////////////////////////
