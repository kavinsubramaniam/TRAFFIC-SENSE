import {
  AuthUser,
  Challan,
  FineConfig,
  Payment,
  SystemLog,
  Vehicle,
  ViolationDetection
} from "../types";

export const initialUsers: AuthUser[] = [
  {
    id: "u-100",
    name: "Rohan Mehta",
    email: "rohan@trafficsense.gov",
    phone: "+1-202-555-0181",
    role: "citizen",
    vehicleNumber: "TS09AB1234",
    password: "password123",
    active: true
  },
  {
    id: "u-101",
    name: "Ananya Rao",
    email: "ananya@trafficsense.gov",
    phone: "+1-202-555-0154",
    role: "citizen",
    vehicleNumber: "TS11CD5678",
    password: "password123",
    active: true
  },
  {
    id: "o-200",
    name: "Officer Priya Iyer",
    email: "priya.officer@trafficsense.gov",
    phone: "+1-202-555-0119",
    role: "officer",
    password: "password123",
    active: true
  },
  {
    id: "o-201",
    name: "Officer Naveen Das",
    email: "naveen.officer@trafficsense.gov",
    phone: "+1-202-555-0170",
    role: "officer",
    password: "password123",
    active: true
  },
  {
    id: "a-300",
    name: "Admin Kavita Sharma",
    email: "admin@trafficsense.gov",
    phone: "+1-202-555-0101",
    role: "admin",
    password: "password123",
    active: true
  }
];

export const initialVehicles: Vehicle[] = [
  {
    id: "v-1",
    ownerId: "u-100",
    number: "TS09AB1234",
    type: "Car",
    registrationDate: "2021-08-11"
  },
  {
    id: "v-2",
    ownerId: "u-100",
    number: "TS09EF9012",
    type: "Bike",
    registrationDate: "2022-02-15"
  },
  {
    id: "v-3",
    ownerId: "u-101",
    number: "TS11CD5678",
    type: "Truck",
    registrationDate: "2020-12-05"
  }
];

export const initialChallans: Challan[] = [
  {
    id: "c-1000",
    userId: "u-100",
    vehicleId: "v-1",
    violationType: "Red Light Jump",
    datetime: "2026-02-04T10:22:00",
    location: "Jubilee Junction, Sector 9",
    status: "Pending",
    fineAmount: 250,
    confidence: 0.94,
    imageUrls: [
      "https://placehold.co/800x480/1f2937/f59e0b?text=Junction+Camera+Frame+1",
      "https://placehold.co/800x480/334155/f8fafc?text=Plate+Zoom+Frame"
    ],
    metadata: {
      speedKmph: 48,
      signalState: "Red",
      helmetDetected: true,
      laneDiscipline: "Compliant",
      seatbeltDetected: true
    }
  },
  {
    id: "c-1001",
    userId: "u-100",
    vehicleId: "v-2",
    violationType: "No Helmet",
    datetime: "2026-02-03T09:10:00",
    location: "MG Road Flyover",
    status: "Paid",
    fineAmount: 120,
    confidence: 0.91,
    imageUrls: [
      "https://placehold.co/800x480/0f172a/f97316?text=Bike+Detection+Frame",
      "https://placehold.co/800x480/475569/e2e8f0?text=Rider+Closeup"
    ],
    metadata: {
      speedKmph: 55,
      signalState: "Green",
      helmetDetected: false,
      laneDiscipline: "Compliant",
      seatbeltDetected: false
    }
  },
  {
    id: "c-1002",
    userId: "u-101",
    vehicleId: "v-3",
    violationType: "Over Speeding",
    datetime: "2026-02-05T17:40:00",
    location: "Ring Road, Zone 3",
    status: "Under Review",
    fineAmount: 300,
    confidence: 0.88,
    imageUrls: [
      "https://placehold.co/800x480/1e293b/facc15?text=Radar+Capture",
      "https://placehold.co/800x480/0b1120/cbd5e1?text=Truck+Plate+Frame"
    ],
    metadata: {
      speedKmph: 96,
      signalState: "Green",
      helmetDetected: true,
      laneDiscipline: "Violation",
      seatbeltDetected: true
    }
  }
];

export const initialPayments: Payment[] = [
  {
    id: "p-700",
    challanId: "c-1001",
    userId: "u-100",
    amount: 120,
    date: "2026-02-03T15:30:00",
    transactionId: "TXN-TRAFFIC-882900"
  }
];

export const initialDetections: ViolationDetection[] = [
  {
    id: "d-9000",
    vehicleNumber: "TS09AB1234",
    probableUserId: "u-100",
    violationType: "Illegal U-Turn",
    confidence: 0.81,
    datetime: "2026-02-06T08:05:00",
    location: "Civic Circle",
    imageUrls: [
      "https://placehold.co/800x480/172554/93c5fd?text=UTurn+Cam+1",
      "https://placehold.co/800x480/1e3a8a/dbeafe?text=UTurn+Cam+2"
    ],
    metadata: {
      speedKmph: 26,
      signalState: "Green",
      helmetDetected: true,
      laneDiscipline: "Violation",
      seatbeltDetected: true
    },
    status: "pending"
  },
  {
    id: "d-9001",
    vehicleNumber: "TS11CD5678",
    probableUserId: "u-101",
    violationType: "Wrong Lane Driving",
    confidence: 0.92,
    datetime: "2026-02-06T09:20:00",
    location: "Metro Corridor, Lane 1",
    imageUrls: [
      "https://placehold.co/800x480/3f1d1d/fca5a5?text=Lane+Violation+Frame",
      "https://placehold.co/800x480/7f1d1d/fecaca?text=Direction+Marker+Frame"
    ],
    metadata: {
      speedKmph: 38,
      signalState: "Green",
      helmetDetected: true,
      laneDiscipline: "Violation",
      seatbeltDetected: true
    },
    status: "pending"
  },
  {
    id: "d-9002",
    vehicleNumber: "TS07KL1010",
    probableUserId: "u-100",
    violationType: "No Seatbelt",
    confidence: 0.74,
    datetime: "2026-02-05T13:12:00",
    location: "Airport Highway",
    imageUrls: [
      "https://placehold.co/800x480/0f172a/a3e635?text=Cabin+Frame",
      "https://placehold.co/800x480/334155/d9f99d?text=Driver+Frame"
    ],
    metadata: {
      speedKmph: 63,
      signalState: "Green",
      helmetDetected: true,
      laneDiscipline: "Compliant",
      seatbeltDetected: false
    },
    status: "approved",
    reviewedBy: "o-200"
  }
];

export const initialFineConfig: FineConfig = {
  "Red Light Jump": 250,
  "Over Speeding": 300,
  "No Helmet": 120,
  "No Seatbelt": 180,
  "Illegal U-Turn": 200,
  "Wrong Lane Driving": 220
};

export const initialLogs: SystemLog[] = [
  {
    id: "l-1",
    type: "detection",
    message: "Camera C-14 detected Red Light Jump for TS09AB1234",
    timestamp: "2026-02-04T10:22:30"
  },
  {
    id: "l-2",
    type: "approval",
    message: "Officer Priya approved No Seatbelt detection d-9002",
    timestamp: "2026-02-05T13:21:00"
  },
  {
    id: "l-3",
    type: "payment",
    message: "Payment received for challan c-1001 via TXN-TRAFFIC-882900",
    timestamp: "2026-02-03T15:30:31"
  }
];
