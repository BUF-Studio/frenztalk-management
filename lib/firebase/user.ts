import type { UserRole } from "../enums";
import type { User } from "../models/User";
import {
  addData,
  collectionStream,
  documentStream,
  setData,
} from "./service/firestore";

const PATH = "users";

export const fetchUserDetails = (
    userId: string,
    onUpdate: (user: User) => void
  ): () => void => {
    return documentStream<User>(
      `${PATH}/${userId}`,
      (data, documentID) => ({
        id: documentID,
        username: data.username,
        email: data.email,
        role: data.role as UserRole,
        createdAt: data.createdAt.toDate(),
      }),
      onUpdate
    );
  };