export interface SystemParametersProps {
  id?: number;
  publicId?: string;
  pointsPerIndication?: number;
  pointsExchange?: number;
  pointsExchangeValue?: number;
  daysPointsExpire?: number;
  comission?: number;
  daysCreditExpire?: number;
  suportWhatsapp?: string;
  hourInitial?: string;
  hourFinal?: string;
  medicQueryInterval?: number;
  voucherMaxDiscountPercentage?: number;
  voucherMaxDiscountValue?: number;
  voucherMaxQuantityUse?: number;
  voucherMaxQuantityDays?: number;
  cardFeeInstallment?: number;
  ticketFeeInstallment?: number;
}
