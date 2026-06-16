import * as authGrpc from "../../grpc/generated/auth";

import {User} from "@prisma/client";

export function userToGrpc(user: User): authGrpc.UserObject {

  return {
    id: user.id,
    email: user.email || '',
    createdAt: user.createdAt.getTime(),
    updatedAt: user.updatedAt.getTime(),
  };
}

export function userToPrisma(user: authGrpc.UserObject) {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}