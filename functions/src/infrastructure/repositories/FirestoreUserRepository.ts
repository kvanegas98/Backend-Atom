import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { FirebaseAdmin } from "../firebase/FirebaseAdmin";

const COLLECTION = "users";

export class FirestoreUserRepository implements IUserRepository {
  private readonly db: admin.firestore.Firestore;

  constructor() {
    this.db = FirebaseAdmin.getFirestore();
  }

  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.db
      .collection(COLLECTION)
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    return this.toEntity(snapshot.docs[0]);
  }

  async create(email: string): Promise<User> {
    const now = new Date();
    const data = {
      email,
      createdAt: Timestamp.fromDate(now),
    };

    const docRef = await this.db.collection(COLLECTION).add(data);

    return { id: docRef.id, email, createdAt: now };
  }

  private toEntity(doc: admin.firestore.DocumentSnapshot): User {
    const data = doc.data()!;
    return {
      id: doc.id,
      email: data["email"],
      createdAt: (data["createdAt"] as Timestamp).toDate(),
    };
  }
}
