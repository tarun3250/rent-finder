export type UserRole = "TENANT" | "OWNER" | "ADMIN";

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  preferences?: {
    budget: number;
    location: string;
    bhk: number;
    amenities: string[];
  };
}

export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  bhkType: string;
  amenities: string;
  verified: boolean;
  owner?: UserProfile;
  images?: { id: number; imageUrl: string }[];
  createdAt: string;
  matchScore?: number;
}

export interface ListingRequest {
  id: number;
  address: string;
  contactInfo: string;
  status: string;
  owner?: UserProfile;
  assignedAdmin?: UserProfile;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}
