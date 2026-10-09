import { OverviewMetrics, SpaceRow, BookingRow, PaymentRow, UserRow, AuditLogEntry } from '../types';

export class AdminApiClient {
  private static getToken(): string | null {
    return localStorage.getItem('ofis_admin_token');
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers = new Headers(options.headers || {});

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Session expired
      localStorage.removeItem('ofis_admin_token');
      localStorage.removeItem('ofis_admin_user');
      window.dispatchEvent(new CustomEvent('ofis_admin_unauthorized'));
      throw new Error('Your session has expired. Please sign in again.');
    }

    if (response.status === 403) {
      const data = await response.json().catch(() => ({}));
      if (data.error === 'MFA_REQUIRED' || data.error === 'MFA_ENROLLMENT_REQUIRED' || data.requiresMfa) {
        window.dispatchEvent(new CustomEvent('ofis_admin_mfa_required', { detail: data }));
        throw new Error(data.message || 'Two-factor authentication required.');
      }
      throw new Error(data.error || 'Access denied: You lack administrator privileges.');
    }

    if (response.status === 429) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Rate limit exceeded. Please wait before retrying.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  // Overview Metrics
  static async getOverview(): Promise<{ metrics: OverviewMetrics; recentActivity: AuditLogEntry[] }> {
    return this.request('/api/admin/overview');
  }

  // Spaces Management
  static async getSpaces(params: { status?: string; category?: string; search?: string } = {}): Promise<{ spaces: SpaceRow[] }> {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.category) query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    return this.request(`/api/admin/spaces?${query.toString()}`);
  }

  static async verifySpace(id: string, isVerified: boolean): Promise<{ success: boolean; space: SpaceRow }> {
    return this.request(`/api/admin/spaces/${encodeURIComponent(id)}/verify`, {
      method: 'POST',
      body: JSON.stringify({ isVerified }),
    });
  }

  static async suspendSpace(id: string, reason: string): Promise<{ success: boolean; space: SpaceRow }> {
    return this.request(`/api/admin/spaces/${encodeURIComponent(id)}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  static async rejectSpace(id: string, reason: string): Promise<{ success: boolean; space: SpaceRow }> {
    return this.request(`/api/admin/spaces/${encodeURIComponent(id)}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  static async toggleSpaceActive(id: string, isActive: boolean): Promise<{ success: boolean; space: SpaceRow }> {
    return this.request(`/api/admin/spaces/${encodeURIComponent(id)}/toggle-active`, {
      method: 'POST',
      body: JSON.stringify({ isActive }),
    });
  }

  static async updateSpace(id: string, updates: Partial<SpaceRow>): Promise<{ success: boolean; space: SpaceRow }> {
    return this.request(`/api/admin/spaces/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Bookings Management
  static async getBookings(params: { status?: string; search?: string } = {}): Promise<{ bookings: BookingRow[] }> {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    return this.request(`/api/admin/bookings?${query.toString()}`);
  }

  static async cancelBooking(id: string, reason: string): Promise<{ success: boolean; booking: BookingRow }> {
    return this.request(`/api/admin/bookings/${encodeURIComponent(id)}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Payments Management
  static async getPayments(params: { status?: string; search?: string } = {}): Promise<{ payments: PaymentRow[] }> {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    return this.request(`/api/admin/payments?${query.toString()}`);
  }

  static async checkPaymentStatus(id: string): Promise<{ success: boolean; previousStatus: string; currentStatus: string; notes?: string }> {
    return this.request(`/api/admin/payments/${encodeURIComponent(id)}/check-status`, {
      method: 'POST',
    });
  }

  static async downloadPaymentsCsv(): Promise<void> {
    const token = this.getToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/admin/payments/export', { headers });
    if (!res.ok) throw new Error('Failed to export payments CSV');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ofis-payments-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  // Users Management
  static async getUsers(params: { role?: string; search?: string } = {}): Promise<{ users: UserRow[] }> {
    const query = new URLSearchParams();
    if (params.role) query.set('role', params.role);
    if (params.search) query.set('search', params.search);
    return this.request(`/api/admin/users?${query.toString()}`);
  }

  static async updateUserRole(userId: string, role: 'user' | 'host' | 'admin'): Promise<{ success: boolean; profile: UserRow }> {
    return this.request(`/api/admin/users/${encodeURIComponent(userId)}/role`, {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  }

  static async suspendUser(userId: string, suspended: boolean, reason?: string): Promise<{ success: boolean; profile: UserRow }> {
    return this.request(`/api/admin/users/${encodeURIComponent(userId)}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ suspended, reason }),
    });
  }

  // Audit Logs
  static async getAuditLogs(params: { action?: string; tableName?: string; search?: string } = {}): Promise<{ auditLogs: AuditLogEntry[] }> {
    const query = new URLSearchParams();
    if (params.action) query.set('action', params.action);
    if (params.tableName) query.set('tableName', params.tableName);
    if (params.search) query.set('search', params.search);
    return this.request(`/api/admin/audit-logs?${query.toString()}`);
  }
}
