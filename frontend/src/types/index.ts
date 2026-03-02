export type UserRole = "citizen" | "officer" | "admin";

export type VehicleType = "Bike" | "Car" | "Truck";
export type ChallanStatus = "Pending" | "Paid" | "Under Review";
export type DetectionStatus = "pending" | "approved" | "rejected" | "false_positive";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  vehicleNumber?: string;
  active: boolean;
}

export interface AuthUser extends User {
  password: string;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  number: string;
  type: VehicleType;
  registrationDate: string;
}

export interface AIMetadata {
  speedKmph: number;
  signalState: "Red" | "Yellow" | "Green";
  helmetDetected: boolean;
  laneDiscipline: "Compliant" | "Violation";
  seatbeltDetected: boolean;
}

export interface Challan {
  id: string;
  userId: string;
  vehicleId: string;
  violationType: string;
  datetime: string;
  location: string;
  status: ChallanStatus;
  fineAmount: number;
  confidence: number;
  imageUrls: string[];
  metadata: AIMetadata;
}

export interface Payment {
  id: string;
  challanId: string;
  userId: string;
  amount: number;
  date: string;
  transactionId: string;
}

export interface ViolationDetection {
  id: string;
  vehicleNumber: string;
  probableUserId: string;
  violationType: string;
  confidence: number;
  datetime: string;
  location: string;
  imageUrls: string[];
  metadata: AIMetadata;
  status: DetectionStatus;
  reviewedBy?: string;
}

export interface SystemLog {
  id: string;
  type: "detection" | "approval" | "payment" | "user" | "settings";
  message: string;
  timestamp: string;
}

export interface FineConfig {
  [violationType: string]: number;
}
