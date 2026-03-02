import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import {
  initialChallans,
  initialDetections,
  initialFineConfig,
  initialLogs,
  initialPayments,
  initialVehicles
} from "../data/mockData";
import {
  Challan,
  DetectionStatus,
  FineConfig,
  Payment,
  SystemLog,
  Vehicle,
  ViolationDetection
} from "../types";

interface AppDataContextType {
  vehicles: Vehicle[];
  challans: Challan[];
  payments: Payment[];
  detections: ViolationDetection[];
  logs: SystemLog[];
  fineConfig: FineConfig;
  payChallan: (challanId: string, userId: string) => { ok: boolean; message?: string };
  reviewDetection: (
    detectionId: string,
    status: Exclude<DetectionStatus, "pending">,
    officerName: string
  ) => void;
  updateFine: (violationType: string, amount: number) => void;
}

const AppDataContext = createContext<AppDataContextType | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [vehicles] = useState<Vehicle[]>(initialVehicles);
  const [challans, setChallans] = useState<Challan[]>(initialChallans);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [detections, setDetections] = useState<ViolationDetection[]>(initialDetections);
  const [fineConfig, setFineConfig] = useState<FineConfig>(initialFineConfig);
  const [logs, setLogs] = useState<SystemLog[]>(initialLogs);

  const payChallan = (challanId: string, userId: string) => {
    const challan = challans.find((c) => c.id === challanId);
    if (!challan) return { ok: false, message: "Challan not found." };
    if (challan.status === "Paid") return { ok: false, message: "Challan already paid." };

    const txId = `TXN-TRAFFIC-${Math.floor(100000 + Math.random() * 900000)}`;
    const paidAt = new Date().toISOString();
    const payment: Payment = {
      id: `p-${Date.now()}`,
      challanId,
      userId,
      amount: challan.fineAmount,
      date: paidAt,
      transactionId: txId
    };
    setPayments((prev) => [payment, ...prev]);
    setChallans((prev) => prev.map((c) => (c.id === challanId ? { ...c, status: "Paid" } : c)));
    setLogs((prev) => [
      {
        id: `l-${Date.now()}`,
        type: "payment",
        message: `Payment received for challan ${challanId} via ${txId}`,
        timestamp: paidAt
      },
      ...prev
    ]);
    return { ok: true };
  };

  const reviewDetection = (
    detectionId: string,
    status: Exclude<DetectionStatus, "pending">,
    officerName: string
  ) => {
    const detection = detections.find((d) => d.id === detectionId);
    if (!detection) return;

    setDetections((prev) =>
      prev.map((d) =>
        d.id === detectionId
          ? {
              ...d,
              status,
              reviewedBy: officerName
            }
          : d
      )
    );

    // Approved detections are promoted into citizen challans automatically.
    if (status === "approved") {
      const ownerVehicle = vehicles.find((v) => v.number === detection.vehicleNumber);
      if (ownerVehicle) {
        setChallans((prev) => [
          {
            id: `c-${Date.now()}`,
            userId: ownerVehicle.ownerId,
            vehicleId: ownerVehicle.id,
            violationType: detection.violationType,
            datetime: detection.datetime,
            location: detection.location,
            status: "Pending",
            fineAmount: fineConfig[detection.violationType] ?? 200,
            confidence: detection.confidence,
            imageUrls: detection.imageUrls,
            metadata: detection.metadata
          },
          ...prev
        ]);
      }
    }

    setLogs((prev) => [
      {
        id: `l-${Date.now()}`,
        type: "approval",
        message: `${officerName} marked detection ${detectionId} as ${status.replace("_", " ")}`,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const updateFine = (violationType: string, amount: number) => {
    setFineConfig((prev) => ({ ...prev, [violationType]: amount }));
    setLogs((prev) => [
      {
        id: `l-${Date.now()}`,
        type: "settings",
        message: `Fine updated for ${violationType} to $${amount}`,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const value = useMemo<AppDataContextType>(
    () => ({
      vehicles,
      challans,
      payments,
      detections,
      logs,
      fineConfig,
      payChallan,
      reviewDetection,
      updateFine
    }),
    [vehicles, challans, payments, detections, logs, fineConfig]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
