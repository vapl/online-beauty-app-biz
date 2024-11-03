export interface User {
  userId?: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  role?: "owner" | "admin" | "employee" | "customer";
  profilePhoto?: string;
  businessId?: string; // Piesaistīts biznesa profils, tikai ja role ir 'self-employed' vai 'owner'
  locationId?: string; // Norādīts, ja pašnodarbinātais strādā konkrētā vietā
  subscriptionTrialEnd?: FirebaseFirestore.Timestamp; // FirebaseFirestore.Timestamp datuma formāts (piemēram, '2024-12-31T23:59:59Z')
  verified?: boolean;
  isFirstLogin?: boolean;
}

/*/////////////////////////////////////////////////////////////

Paskaidrojumi:
-----------------------------
userId – unikāls lietotāja ID.
name – lietotāja pilnais vārds.
email – lietotāja e-pasta adrese.
phone – lietotāja tālruņa numurs.
role – lietotāja loma, kas var būt:
self-employed – pašnodarbinātais speciālists.
owner – uzņēmuma īpašnieks.
admin – administratīvā loma.
employee – darbinieks.
customer – klients, kas rezervē pakalpojumus.
profilePhoto – URL vai ceļš uz lietotāja profila attēlu.
businessId (pēc izvēles) – ja lietotājs ir pašnodarbinātais vai uzņēmuma īpašnieks, šis ID norāda uz piesaistīto biznesa profilu.
locationId (pēc izvēles) – ja pašnodarbinātais speciālists strādā konkrētā lokācijā (piemēram, salonā).
subscriptionTrialEnd (pēc izvēles) – datums, kad beidzas abonementa izmēģinājuma periods. Tiek glabāts ISO datuma formātā (piemēram, 2024-12-31T23:59:59Z).

*/ ////////////////////////////////////////////////////////////
