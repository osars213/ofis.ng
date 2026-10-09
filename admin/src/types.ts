export type AdminTab = 'overview' | 'spaces' | 'bookings' | 'payments' | 'users' | 'audit_log';

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: 'admin';
}

export interface SpaceRow {
  id: string;
  title: string;
  tagline?: string;
  category: string;
  city: string;
  neighborhood: string;
  address: string;
  price_per_hour: number;
  price_per_day?: number;
  capacity: number;
  has_backup_power: boolean;
  power_uptime_guarantee_percent: number;
  internet_speed_mbps: number;
  host_name?: string;
  host_email?: string;
  is_verified: boolean;
  is_active: boolean;
  is_superhost?: boolean;
  featured_image?: string;
  created_at: string;
  updated_at?: string;
}

export interface BookingRow {
  id: string;
  space_id: string;
  space_title: string;
  space_city: string;
  user_email: string;
  user_name: string;
  user_phone?: string;
  date: string;
  start_time: string;
  duration_hours: number;
  total_amount: number;
  currency: string;
  status: string;
  booking_status?: string;
  payment_status: string;
  payment_reference: string;
  checked_in?: boolean;
  cancellation_reason?: string;
  created_at: string;
}

export interface PaymentRow {
  id: string;
  booking_id: string;
  user_id?: string;
  amount: number;
  currency: string;
  provider: string;
  reference: string;
  status: string;
  created_at: string;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'host' | 'admin';
  company?: string;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  admin_id?: string;
  admin_email: string;
  action: string;
  table_name: string;
  record_id: string;
  old_values: Record<string, any>;
  new_values: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface OverviewMetrics {
  spaces: {
    total: number;
    active: number;
    pendingVerification: number;
  };
  bookings: {
    total: number;
    confirmed: number;
  };
  payments: {
    totalSuccessful: number;
    totalGmvNGN: number;
  };
  users: {
    user: number;
    host: number;
    admin: number;
    total: number;
  };
}
