import * as admin from "firebase-admin";

/**
 * Singleton wrapper for Firebase Admin SDK.
 * Ensures a single app instance across the Cloud Function lifecycle.
 */
export class FirebaseAdmin {
  private static app: admin.app.App | null = null;

  private constructor() {}

  static getInstance(): admin.app.App {
    if (!FirebaseAdmin.app) {
      FirebaseAdmin.app = admin.initializeApp();
    }
    return FirebaseAdmin.app;
  }

  static getFirestore(): admin.firestore.Firestore {
    return FirebaseAdmin.getInstance().firestore();
  }
}
