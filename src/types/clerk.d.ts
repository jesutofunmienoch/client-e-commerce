// src/types/clerk.d.ts
import "@clerk/clerk-react";

declare module "@clerk/clerk-react" {
  interface UserPublicMetadata {
    role?: "admin" | "customer";
  }

  interface UserUnsafeMetadata {
    hasSeenAdminPrompt?: boolean;
  }
}