# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

```bash
[x] - Colocar campo de preço na especialidade médica
[x] - Aparecer as compras de pacotes de clientes em transações
[x] - Editar advogado não esta carregando as informações de endereço ao editar
[x] - Cadastrar cliente novo, já gerar também oportunidade no nectar
[x] - Calcular em percentual o valor de saldo minimo
[x] - Solicitação caso não tenha crédito não selecionar especialidade
[x] - Solicitação calcular o valor somando com valor da especialidade
[x] - Parametrizar qual especidade que sera clínico geral por padrão
[x] - Meus saldos não esta aparecendo corretamente, quando o saldo é zerado tem que ir para finalizado
[x] - Intervalo de data no agendamento
[x] - No Agendamento dar possibilidade de ver Solicitação
[x] - No histórico de uso de crédito informar mais detalhes referente a solcitação utilizada
[x] - Ao estornar uma solcitação, devolver o valor de crédito de cliente para o saldo
[x] - Formulário para atuialização de termos e condições de uso
[x] - Criar um parametro para identificar quantidade de dias que pode solicitar uma correção de laudo
[x] - Criar um parametro para identificar quantidade de vezes que pode solicitar uma correção de laudo
[x] - Validar parametros de limite para solicitação de correção de laudo
[x] - Analisar o reagendar se apaga os angandamentos anteriores
[x] - Ver possibilidade de deixar apenas um agendamento por solicitação
[x] - No editor de texto ter a opção de trocar a fonte, tamanho e cor do texto
[x] - Criar uma coluna de comissão para médico específica para especialidade
[x] - No agendamento da solicitação, só liberar para aparecer a data do agendamento 4 dias para frente
[x] - Remover reagendar pra advogado
[x] - Aguardando laudo aparecer somente quando fechar
[x] - Ao gerar o laudo, quando for clinico geral não mostrar nada, caso contrário mostrar a especialidade-
[x] - Mostrar valor na solicitação com desconto
[x] - Gerar PDF do laudo com todas as fontes e formatações de acordo com o que foi criado
[x] - Para o médico especialista, só aparecer os agendamentos para sua especialidade e para a especialidade
[x] - Revisar regras de negócio para pagamento de comissão dos médicos, quando é especialista o valor é diferente pegar do parametro de comissão especialidade
[x] - Validar listagem da agenda pelo tipo de especialidade do médico
[x] - Refazer a a configuração de agenda, deve ser separado por especialidade, dia da semana, e cada dia/especialidade pode ter vários intervalos de horário
[x] - Visualizar PDF sem precisar fazer download e abrir
[x] - Teleconsulta, ver possibilidade de escolher microfone/configurar
[x] - Tela do médico no agendamento, ter um botão para definir que o paciente não compareceu
[x] - Melhorar tela de cadastro de médico, campo de chave pix muito pequeno
[x] - Correção selecionar outra especialidade no cadastro de solicitação
[x] - possibilidade de remover antecipação
[x] - utilizar saldo remover
[x] - Indicação nao esta respeitando os parametros
[x] - Currency input nao aceitou valor zerado
[x] - ajustar barra de rolagem na tela de detalhes solicitação na consulta
[x] - Cadastro de termos de uso diferente para médico
[x] - ao abrir a tela de parametrização se o valor vem zerado esta dando erro no campo de pontos
[x] - Criar novo método para cadastrar mais de um termo de uso
[x] - Para o médico aparecer o termo de uso de prestação de serviço e não o que esta aparecendo atualmente
[x] - Fazer uma tela de consulta automática na agenda para evitar de dois médicos ao mesmo tempo pegar o mesmo agendamento
[x] - Consultar um agendamento antes de tentar agendar para ver se outro médico já não pegou
[x] - Unificar PDFS para um único arquivo

*************************** Demais Pendências **************************************************************************
[] - Recriar tela de controle de crédito do lado administrador
[] - Melhoria na interface de acordo com a imagem que desgin mandou


*************************** integração com nuvidio *********************************************************************
[x] - Criar um departamento por médico
[x] - Criar um atendente por médico
[x] - Criar vínculo entre departamento médico e atendente
[x] - Gerar token para efetuar as requisições
[x] - Usar o token até que seja expirado, caso contrário gerar um novo (tempo do token expiração 10 minuos)
[x] - Criar um convite para atendimento de chamada
[] - Enviar convite no whatsapp do advogado e do advogado
[x] - Possibilitar o admin criar um atendente na nuvidio atravéz de um botão na tela de médicos
[x] - Só liberar o médico para criar um atendimento se ele já possuir o atendente criado pelo adm na nuvidio

Verificar este erro
 [AsaasPaymentService] Erro ao deletar pagamento: {
  errors: [
    {
      code: 'invalid_action',
      description: 'A cobrança [637382471] não pode ser removida: Só é possível remover cobranças pendentes ou vencidas.'
    }
  ]
}

[x] - Solicitação cancelada esta aparecendo como pendente
[] - Webhook para enviar chamada finalizada do nuvidio
```
