export interface PaymentAsaasProps {
  //Identificador único do cliente no Asaas
  customer?: string;

  //Forma de pagamento
  billingType?: string;

  //Valor da cobrança
  value: number;

  //Data de vencimento da cobrança
  dueDate: string;

  //Descrição da cobrança (máx. 500 caracteres)
  description?: string;

  //Dias após o vencimento para cancelamento do registro (somente para boleto bancário)
  daysAfterDueDateToRegistrationCancellation?: number;

  //Campo livre para busca
  externalReference?: string;

  //Número de parcelas (somente no caso de cobrança parcelada)
  installmentCount?: number;

  /**
   * Informe o valor total de uma cobrança que será parcelada (somente no caso de cobrança parcelada).
   * Caso enviado este campo o installmentValue não é necessário, o cálculo por parcela será automático.
   */
  totalValue?: number;

  // Informações de desconto
  discount?: {
    //Valor percentual ou fixo de desconto a ser aplicado sobre o valor da cobrança
    value: number;

    //Dias antes do vencimento para aplicar desconto. Ex: 0 = até o vencimento, 1 = até um dia antes, 2 = até dois dias antes, e assim por diante
    dueDateLimitDays?: number;

    //Tipo de desconto (FIXED, PERCENTAGE)
    type?: string;
  };

  // informações de juros
  interest?: {
    //Percentual de juros ao mês sobre o valor da cobrança para pagamento após o vencimento
    value?: number;
  };

  // informações de juros
  fine?: {
    //Percentual de multa sobre o valor da cobrança para pagamento após o vencimento
    value?: number;

    //Tipo de desconto (FIXED, PERCENTAGE)
    type?: string;
  };

  //Define se a cobrança será enviada via Correios
  postalService?: boolean;

  //Configurações do split
  split?: PaymentAsaasSplitProps[];

  callback?: {
    //URL que o cliente será redirecionado após o pagamento com sucesso da fatura ou link de pagamento
    successUrl: string;

    //Definir se o cliente será redirecionado automaticamente ou será apenas informado
    //com um botão para retornar ao site. O padrão é true, caso queira desativar informar false
    autoRedirect?: boolean;
  };
}

interface PaymentAsaasSplitProps {
  //Identificador da carteira Asaas que será transferido
  walletId: string;

  //Valor fixo a ser transferido para a conta quando a cobrança for recebida
  fixedValue?: number;

  //Percentual sobre o valor líquido da cobrança a ser transferido quando for recebida
  percentualValue?: number;

  //(Somente parcelamentos). Valor que será feito split referente ao valor total que será parcelado.
  totalFixedValue?: number;

  //Identificador do split no seu sistema
  externalReference?: string;

  //Descrição do split
  description?: string;
}
