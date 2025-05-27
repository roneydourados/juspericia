import vine from '@vinejs/vine'

export const asaasCustomerValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(5).trim(),
    cpfCnpj: vine.string().minLength(11).maxLength(20).trim(),
    email: vine.string().email().trim(),
    phone: vine.string().trim().optional(),
    mobilePhone: vine.string().trim().optional(),
    address: vine.string().trim().optional(),
    addressNumber: vine.string().trim().optional(),
    complement: vine.string().trim().optional(),
    province: vine.string().trim().optional(),
    postalCode: vine.string().trim().optional(),
    externalReference: vine.string().trim().optional(),
    notificationDisabled: vine.boolean().optional(),
    additionalEmails: vine.string().trim().optional(),
    municipalInscription: vine.string().trim().optional(),
    stateInscription: vine.string().trim().optional(),
    observations: vine.string().trim().optional(),
    groupName: vine.string().trim().optional(),
    company: vine.string().trim().optional(),
    foreignCustomer: vine.boolean().optional(),
    userId: vine.number().optional(),
  })
)

export const asaasPaymentValidator = vine.compile(
  vine.object({
    customer: vine.string().trim().optional(),

    //Forma de pagamento
    billingType: vine.string().trim().optional(),

    //Valor da cobrança
    value: vine.number(),

    //Data de vencimento da cobrança
    dueDate: vine.string().trim(),

    //Descrição da cobrança (máx. 500 caracteres)
    description: vine.string().trim().optional(),

    //Dias após o vencimento para cancelamento do registro (somente para boleto bancário)
    daysAfterDueDateToRegistrationCancellation: vine.number().optional(),

    //Campo livre para busca
    externalReference: vine.string().trim().optional(),

    //Número de parcelas (somente no caso de cobrança parcelada)
    installmentCount: vine.number().optional(),

    // aqui são campos opcionais de controle somente do sistema
    category: vine.string().trim().optional(),
    packageId: vine.number().optional(),
    solicitationId: vine.number().optional(),
    dueDays: vine.number().min(0).optional(),

    /**
     * Informe o valor total de uma cobrança que será parcelada (somente no caso de cobrança parcelada).
     * Caso enviado este campo o installmentValue não é necessário, o cálculo por parcela será automático.
     */
    totalValue: vine.number().optional(),

    // Informações de desconto
    discount: vine
      .object({
        //Valor percentual ou fixo de desconto a ser aplicado sobre o valor da cobrança
        value: vine.number(),

        //Dias antes do vencimento para aplicar desconto. Ex: 0 = até o vencimento, 1 = até um dia antes, 2 = até dois dias antes, e assim por diante
        dueDateLimitDays: vine.number().optional(),

        //Tipo de desconto (FIXED, PERCENTAGE)
        type: vine.string().trim().optional(),
      })
      .optional(),

    // informações de juros
    interest: vine
      .object({
        //Percentual de juros ao mês sobre o valor da cobrança para pagamento após o vencimento
        value: vine.number().optional(),
      })
      .optional(),

    // informações de juros
    fine: vine
      .object({
        //Percentual de multa sobre o valor da cobrança para pagamento após o vencimento
        value: vine.number().optional(),

        //Tipo de desconto (FIXED, PERCENTAGE)
        type: vine.string().trim().optional(),
      })
      .optional(),

    //Define se a cobrança será enviada via Correios
    postalService: vine.boolean().optional(),

    callback: vine
      .object({
        //URL que o cliente será redirecionado após o pagamento com sucesso da fatura ou link de pagamento
        successUrl: vine.string().trim(),

        //Definir se o cliente será redirecionado automaticamente ou será apenas informado
        //com um botão para retornar ao site. O padrão é true, caso queira desativar informar false
        autoRedirect: vine.boolean().optional(),
      })
      .optional(),

    split: vine
      .array(
        vine.object({
          //Identificador da carteira Asaas que será transferido
          walletId: vine.string().trim(),

          //Valor fixo a ser transferido para a conta quando a cobrança for recebida
          fixedValue: vine.number().optional(),

          //Percentual sobre o valor líquido da cobrança a ser transferido quando for recebida
          percentualValue: vine.number().optional(),

          //(Somente parcelamentos). Valor que será feito split referente ao valor total que será parcelado.
          totalFixedValue: vine.number().optional(),

          //Identificador do split no seu sistema
          externalReference: vine.string().trim().optional(),

          //Descrição do split
          description: vine.string().trim().optional(),
        })
      )
      .optional(),
  })
)
