import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import {
  Task,
  CreateTaskProps,
  UpdateTaskProps,
  TaskStatus,
} from "../../domain/entities/Task";
import { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import { PaginationParams, PaginatedResult } from "../../domain/types/pagination";
import { FirebaseAdmin } from "../firebase/FirebaseAdmin";

const COLLECTION = "tasks";

export class FirestoreTaskRepository implements ITaskRepository {
  private readonly db: admin.firestore.Firestore;

  constructor() {
    this.db = FirebaseAdmin.getFirestore();
  }

  async findByUserId(userId: string, params: PaginationParams): Promise<PaginatedResult<Task>> {
    // Se pide uno extra para saber si hay más páginas
    const fetchLimit = params.limit + 1;

    let query = this.db
      .collection(COLLECTION)
      .where("userId", "==", userId)
      .where("isDeleted", "==", false)
      .orderBy("createdAt", "asc")
      .limit(fetchLimit);

    if (params.cursor) {
      query = query.startAfter(Timestamp.fromDate(params.cursor));
    }

    const snapshot = await query.get();
    const hasMore = snapshot.docs.length > params.limit;
    const docs = hasMore ? snapshot.docs.slice(0, params.limit) : snapshot.docs;
    const data = docs.map((doc) => this.toEntity(doc));
    const nextCursor = hasMore ? data[data.length - 1]!.createdAt.toISOString() : null;

    return { data, nextCursor, hasMore };
  }

  async findById(id: string): Promise<Task | null> {
    const doc = await this.db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data()!;
    if (data["isDeleted"] === true) return null;
    return this.toEntity(doc);
  }

  async create(props: CreateTaskProps): Promise<Task> {
    const now = new Date();
    const data = {
      userId: props.userId,
      title: props.title,
      description: props.description,
      status: "pending" as TaskStatus,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
      isDeleted: false,
      deletedAt: null,
    };

    const docRef = await this.db.collection(COLLECTION).add(data);

    return {
      id: docRef.id,
      ...props,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
  }

  async update(id: string, props: UpdateTaskProps): Promise<Task> {
    const now = new Date();
    const updateData: Record<string, unknown> = {
      updatedAt: Timestamp.fromDate(now),
    };

    if (props.title !== undefined) updateData["title"] = props.title;
    if (props.description !== undefined) updateData["description"] = props.description;
    if (props.status !== undefined) updateData["status"] = props.status;

    await this.db.collection(COLLECTION).doc(id).update(updateData);

    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<void> {
    const now = Timestamp.fromDate(new Date());
    await this.db.collection(COLLECTION).doc(id).update({
      isDeleted: true,
      deletedAt: now,
      updatedAt: now,
    });
  }

  private toEntity(doc: admin.firestore.DocumentSnapshot): Task {
    const data = doc.data()!;
    const entity: Task = {
      id: doc.id,
      userId: data["userId"],
      title: data["title"],
      description: data["description"],
      status: data["status"] as TaskStatus,
      createdAt: (data["createdAt"] as Timestamp).toDate(),
      updatedAt: (data["updatedAt"] as Timestamp).toDate(),
    };

    if (data["deletedAt"]) {
      entity.deletedAt = (data["deletedAt"] as Timestamp).toDate();
    }

    return entity;
  }
}
