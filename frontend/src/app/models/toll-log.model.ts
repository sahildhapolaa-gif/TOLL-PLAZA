export type VehicleType = 'Car' | 'Motorcycle' | 'Truck';
export type LogStatus = 'Paid' | 'Pending' | 'Violation';

export interface TollLog {
  id: string;
  licensePlate: string;
  vehicleType: VehicleType;
  timestamp: string;
  tollFee: number;
  status: LogStatus;
  isOfficial: boolean;
}

export interface CreateTollLogDto {
  licensePlate: string;
  vehicleType: VehicleType;
  isOfficial?: boolean;
}

export interface UpdateStatusDto {
  status: LogStatus;
}

export interface DashboardStats {
  total: number;
  paid: number;
  pending: number;
  violations: number;
  totalRevenue: number;
}
