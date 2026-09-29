import crypto from 'crypto';

export type SzndEnvironment = 'test' | 'production';

export interface SzndInitializeParams {
  email: string;
  firstName: string;
  lastName: string;
  amount: number; // e.g. 15000 (will be formatted as "15000.00")
  currency?: string;
  reference: string;
  redirectUrl: string;
  description: string;
  phone?: string;
  metadata?: Record<string, any>;
}

export interface SzndInitializeResponse {
  success: boolean;
  checkout_link?: string;
  access_code?: string;
  transaction_reference?: string;
  reference?: string;
  environment?: SzndEnvironment;
  error?: string;
  raw?: any;
}

export interface SzndVerifyResponse {
  success: boolean;
  status: 'COMPLETED' | 'PENDING' | 'PROCESSING' | 'FAILED' | 'UNKNOWN';
  amount?: number;
  currency?: string;
  reference?: string;
  transaction_reference?: string;
  environment?: SzndEnvironment;
  metadata?: Record<string, any>;
  gateway_response?: string;
  error?: string;
  raw?: any;
}

export interface SzndDiagnostics {
  environment: 'TEST' | 'PRODUCTION';
  apiKeyConfigured: 'YES' | 'NO';
  apiSecretConfigured: 'YES' | 'NO';
  baseUrlConfigured: 'YES' | 'NO';
}

const SZND_PRODUCTION_DEFAULT_BASE_URL = 'https://api.transfaar.com/api/v1';

export class SzndClient {
  private explicitApiKey?: string;
  private explicitApiSecret?: string;
  private explicitBaseUrl?: string;
  private explicitEnvironment?: SzndEnvironment;

  constructor(apiKey?: string, apiSecret?: string, baseUrl?: string, environment?: SzndEnvironment) {
    this.explicitApiKey = apiKey;
    this.explicitApiSecret = apiSecret;
    this.explicitBaseUrl = baseUrl;
    this.explicitEnvironment = environment;
  }

  /**
   * Resolves the active SZND environment: 'test' or 'production'.
   * Defaults to 'production' if not explicitly configured as 'test' or 'sandbox'.
   */
  public getEnvironment(): SzndEnvironment {
    if (this.explicitEnvironment) {
      return this.explicitEnvironment;
    }
    const envVar = (process.env.SZND_ENV || 'production').toLowerCase().trim();
    return envVar === 'test' || envVar === 'sandbox' ? 'test' : 'production';
  }

  public getApiKey(): string {
    return (this.explicitApiKey || process.env.SZND_API_KEY || '').trim();
  }

  public getApiSecret(): string {
    return (this.explicitApiSecret || process.env.SZND_API_SECRET || '').trim();
  }

  /**
   * Resolves the API base URL based on environment variables.
   * If SZND_API_BASE_URL is set, it is always preferred.
   * In production mode, defaults to SZND_PRODUCTION_DEFAULT_BASE_URL if unspecified.
   * In test mode, returns SZND_API_BASE_URL if provided, or empty string (requires configuration).
   */
  public getBaseUrl(): string {
    const customUrl = (this.explicitBaseUrl || process.env.SZND_API_BASE_URL || '').trim();
    if (customUrl) {
      return customUrl.replace(/\/+$/, '');
    }

    if (this.getEnvironment() === 'production') {
      return SZND_PRODUCTION_DEFAULT_BASE_URL;
    }

    // In test environment, do not invent an unconfirmed URL
    return '';
  }

  public hasApiKey(): boolean {
    return Boolean(this.getApiKey());
  }

  public hasApiSecret(): boolean {
    return Boolean(this.getApiSecret());
  }

  public hasBaseUrl(): boolean {
    return Boolean(this.getBaseUrl());
  }

  public isConfigured(): boolean {
    return Boolean(this.hasApiKey() && this.hasApiSecret() && this.hasBaseUrl());
  }

  /**
   * Returns safe environment diagnostics without exposing secret values.
   */
  public getDiagnostics(): SzndDiagnostics {
    const env = this.getEnvironment();
    return {
      environment: env === 'test' ? 'TEST' : 'PRODUCTION',
      apiKeyConfigured: this.hasApiKey() ? 'YES' : 'NO',
      apiSecretConfigured: this.hasApiSecret() ? 'YES' : 'NO',
      baseUrlConfigured: this.hasBaseUrl() ? 'YES' : 'NO',
    };
  }

  /**
   * Generates HMAC-SHA256 signature using body + "|" + timestamp as string to sign.
   * Computed server-side only; never exposed to browser.
   */
  public generateHeaders(bodyString: string = ''): Record<string, string> {
    const timestamp = Date.now().toString();
    const stringToSign = `${bodyString}|${timestamp}`;
    const secret = this.getApiSecret();
    const key = this.getApiKey();

    const signature = crypto
      .createHmac('sha256', secret)
      .update(stringToSign)
      .digest('hex');

    return {
      'Content-Type': 'application/json',
      'X-API-Key': key,
      'X-Timestamp': timestamp,
      'X-Signature': signature,
    };
  }

  /**
   * Initializes a hosted checkout session with SZND (Test or Production).
   */
  public async initializeCheckout(params: SzndInitializeParams): Promise<SzndInitializeResponse> {
    const env = this.getEnvironment();

    if (!this.isConfigured()) {
      if (env === 'test' && !this.hasBaseUrl()) {
        return {
          success: false,
          environment: env,
          error: 'TEST SZND BASE URL REQUIRED: SZND_API_BASE_URL must be configured for Test environment.',
        };
      }
      return {
        success: false,
        environment: env,
        error: `SZND payment gateway is not fully configured for ${env.toUpperCase()} environment (missing API key, secret, or base URL).`,
      };
    }

    const payload = {
      email: params.email.trim().toLowerCase(),
      first_name: params.firstName.trim() || 'OFIS',
      last_name: params.lastName.trim() || 'Member',
      amount: Number(params.amount).toFixed(2),
      currency: params.currency || 'NGN',
      reference: params.reference.trim(),
      redirectUrl: params.redirectUrl.trim(),
      description: params.description.trim() || 'OFIS Workspace Booking',
      checkout_display_name: 'OFIS',
      customer_phone_number: (params.phone || '+2348000000000').trim(),
      metadata: {
        ...(params.metadata || {}),
        sznd_env: env,
      },
    };

    const bodyString = JSON.stringify(payload);
    const headers = this.generateHeaders(bodyString);
    const baseUrl = this.getBaseUrl();
    const endpoint = `${baseUrl}/client/checkout/initialize`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: bodyString,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data) {
        const errMsg = data?.message || data?.error || `SZND (${env.toUpperCase()}) initialization failed with HTTP ${response.status}`;
        return {
          success: false,
          environment: env,
          error: errMsg,
          raw: data,
        };
      }

      // Handle both flat and nested response formats from SZND / Transfaar
      const checkoutLink = data?.checkout_link || data?.data?.checkout_link || data?.authorization_url || data?.data?.authorization_url;
      const accessCode = data?.access_code || data?.data?.access_code;
      const transactionRef = data?.transaction_reference || data?.data?.transaction_reference || data?.data?.reference;
      const reference = data?.reference || data?.data?.reference || params.reference;

      if (!checkoutLink) {
        return {
          success: false,
          environment: env,
          error: data?.message || `SZND (${env.toUpperCase()}) initialization response did not include a valid checkout_link`,
          raw: data,
        };
      }

      return {
        success: true,
        environment: env,
        checkout_link: checkoutLink,
        access_code: accessCode,
        transaction_reference: transactionRef,
        reference,
        raw: data,
      };
    } catch (err: any) {
      return {
        success: false,
        environment: env,
        error: err.message || `Network error communicating with SZND (${env.toUpperCase()}) payment gateway`,
      };
    }
  }

  /**
   * Verifies a payment against SZND gateway (Test or Production) using reference.
   */
  public async verifyPayment(reference: string): Promise<SzndVerifyResponse> {
    const env = this.getEnvironment();

    if (!this.isConfigured()) {
      if (env === 'test' && !this.hasBaseUrl()) {
        return {
          success: false,
          status: 'UNKNOWN',
          environment: env,
          error: 'TEST SZND BASE URL REQUIRED: SZND_API_BASE_URL must be configured for Test environment verification.',
        };
      }
      return {
        success: false,
        status: 'UNKNOWN',
        environment: env,
        error: `SZND payment gateway is not fully configured for ${env.toUpperCase()} environment.`,
      };
    }

    const cleanRef = reference.trim();
    const baseUrl = this.getBaseUrl();
    const endpoint = `${baseUrl}/client/payment/verify?reference=${encodeURIComponent(cleanRef)}`;
    const headers = this.generateHeaders('');

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data) {
        const errMsg = data?.message || data?.error || `SZND (${env.toUpperCase()}) verification failed with HTTP ${response.status}`;
        return {
          success: false,
          status: 'FAILED',
          environment: env,
          error: errMsg,
          raw: data,
        };
      }

      const resData = data.data || data;
      const rawStatus = String(resData.status || resData.payment_status || '').toUpperCase();

      let mappedStatus: SzndVerifyResponse['status'] = 'UNKNOWN';
      if (rawStatus === 'COMPLETED' || rawStatus === 'SUCCESS' || rawStatus === 'PAID') {
        mappedStatus = 'COMPLETED';
      } else if (rawStatus === 'PENDING' || rawStatus === 'PROCESSING') {
        mappedStatus = 'PENDING';
      } else if (rawStatus === 'FAILED' || rawStatus === 'CANCELLED' || rawStatus === 'ABANDONED') {
        mappedStatus = 'FAILED';
      }

      const amountVal = resData.amount !== undefined ? parseFloat(String(resData.amount)) : undefined;

      return {
        success: mappedStatus === 'COMPLETED',
        status: mappedStatus,
        amount: amountVal,
        currency: resData.currency || 'NGN',
        reference: resData.reference || cleanRef,
        transaction_reference: resData.transaction_reference || resData.id,
        environment: env,
        metadata: resData.metadata,
        gateway_response: resData.gateway_response || resData.message || (mappedStatus === 'COMPLETED' ? 'Successful' : rawStatus),
        raw: data,
      };
    } catch (err: any) {
      return {
        success: false,
        status: 'UNKNOWN',
        environment: env,
        error: err.message || `Network error verifying payment with SZND (${env.toUpperCase()})`,
      };
    }
  }

  /**
   * Validates SZND webhook HMAC signature from X-Transfaar-Signature or X-Signature header.
   */
  public verifyWebhookSignature(rawBody: string | Buffer, signatureHeader?: string | string[]): boolean {
    const secret = this.getApiSecret();
    if (!secret) {
      return false;
    }

    const receivedSignature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
    if (!receivedSignature) {
      return false;
    }

    const payload = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
    const computedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    try {
      const a = Buffer.from(receivedSignature, 'hex');
      const b = Buffer.from(computedSignature, 'hex');
      if (a.length !== b.length) return false;
      return crypto.timingSafeEqual(a, b);
    } catch {
      return receivedSignature.toLowerCase() === computedSignature.toLowerCase();
    }
  }
}

export const szndClient = new SzndClient();
