export interface SendDocumentProps {
  fileBase64: string;
  fileName: string;
  name: string;
  email: string;
  fileCategory: string;
  ownerId: number;
}

export interface DocumentResponseProps {
  sandbox: boolean;
  external_id: string;
  open_id: number;
  token: string;
  name: string;
  folder_path: string;
  folder_token: string;
  status: string;
  rejected_reason: string;
  lang: string;
  original_file: string;
  signed_file: string;
  extra_docs: any[];
  created_through: string;
  deleted: boolean;
  deleted_at: string;
  signed_file_only_finished: boolean;
  disable_signer_emails: boolean;
  brand_logo: string;
  brand_primary_color: string;
  created_at: string;
  last_update_at: string;
  created_by: CreatedBy;
  template: string;
  signers: Signer[];
  answers: any[];
  auto_reminder: number;
  signature_report: string;
  tsa_country: string;
  use_timestamp: boolean;
  metadata: any[];
}

export interface CreatedBy {
  email: string;
}

export interface Signer {
  external_id: string;
  sign_url: string;
  token: string;
  status: string;
  name: string;
  lock_name: boolean;
  email: string;
  lock_email: boolean;
  hide_email: boolean;
  blank_email: boolean;
  phone_country: string;
  phone_number: string;
  lock_phone: boolean;
  hide_phone: boolean;
  blank_phone: boolean;
  times_viewed: number;
  last_view_at: string;
  signed_at: string;
  auth_mode: string;
  qualification: string;
  require_selfie_photo: boolean;
  require_document_photo: boolean;
  geo_latitude: string;
  geo_longitude: string;
  redirect_link: string;
  signature_image: string;
  visto_image: string;
  document_photo_url: string;
  document_verse_photo_url: string;
  selfie_photo_url: string;
  selfie_photo_url2: string;
  send_via: string;
  resend_attempts: string;
  cpf: string;
  cnpj: string;
  send_automatic_whatsapp_signed_file: string;
  liveness_photo_url: string;
  selfie_validation_type: string;
  ip: string;
}
