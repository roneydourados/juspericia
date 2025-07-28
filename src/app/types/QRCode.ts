export interface IQRCodeResponse {
  payload: () => string; //payload for QrCode
  base64: (options?: any) => Promise<string>; //QrCode image base64
}

export interface IQRCodeParameter {
  version: string;
  key: string;
  city: string;
  name: string;
  value?: number;
  transactionId?: string;
  message?: string;
  cep?: string;
  currency?: number; //default: 986 ('R$')
  countryCode?: string; //default: 'BR'
}
