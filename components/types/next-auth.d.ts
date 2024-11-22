import "next-auth";

declare module "next-auth" {
  // Extend the session interface with custom fields
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      accessToken: string;
      provider?: string;
      list?: string[];  // Optional custom property for user lists
    } & DefaultSession["user"];
  }

  // Extend the user interface to include custom fields
  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    accessToken: string;
    provider?: string;
    list?: string[];  // Custom property for user's list
  }

  // Extend the JWT interface with custom fields
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    accessToken?: string;
    provider?: string;
    list?: string[];  // Optional, if you want to store lists in JWT
  }
}
