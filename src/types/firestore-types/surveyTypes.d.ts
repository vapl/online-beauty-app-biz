export interface Survey {
  userId: string;
  question: string;
  response?: string;
  createdAt: FirebaseFirestore.Timestamp;
}
