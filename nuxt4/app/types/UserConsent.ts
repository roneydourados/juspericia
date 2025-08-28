export interface UserConsentProps {
  userId?: number;

  //Dados para paciente que não é um usuário ativo da aplicação
  publicId?: string;
  fullName?: string;
  documentNumber?: string;
  documentType?: string; //RG, CPF, CNH, CARTAO CNPJ, ETC...
  email?: string;

  //informações do consentimento
  consentType?: string; // termos_uso, biometria_qualityapi, etc..
  termsVersion?: string;
  acceptedAt?: string;
  revokedAt?: string; // caso o usuário revogue o consentimento

  //auditoria técnica
  ipAddress?: string;
  userAgent?: string;

  //dados de identificação biométrico
  biometricTransactionId?: string;
  biometricProvider?: string;
  termsContent?: string;
}
