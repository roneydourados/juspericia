# Reunião 29/05/2025

[x]- Eliminar nome do médico no agendamento
[x]- Deixar agendar conforme quantidade de médico dentro do intervalo de horário
[] - Criar uma tela de transações (pegar detalhes)
[] - Criar uma tela de voucher / promoção, nela informar o valor de desconto, data e hora de inicio e fim
e quais pacotes farão parte do voucher
[] - Mudar cor caso o agendamento passe da data em detalhes de solicitação
[] - Criar tela de adminstração de perfil para o usuário admin

# cobrar

[x] - Logo de empresa
[x] - Paleta de cores
[x] - CNPJ para cadastro no ASAAS (Dudu Fez o cadastro)
[] - Se cadastrar com CNPJ, na plataforma de teleconferência
[x] - Landing page para divulgação do produto (Esta parte ficou com pessoal do marketing)

# dúvidas

O horário inicial/Final de atendimentos para configurar na agenda,
será global para todos os médicos ou cada médico terá o seu ?

# R: Cada médico terá o seu horário de atendimento [OK]

# R: Intervalo entre uma consulta e outra de 15 minutos [OK - já está configurável no cadsatro do médico]

O valor a ser pago por laudo para os médicos, será informado no cadastro do laudo ou no cadastro do mético ?

# R: O valor será informado no cadastro do médico, o valor vai ser em valor fixo ou porcentagem. [OK]

# Correções

[x] - Tela de estatísticas do advogado esta somando vendas canceladas como investimento
[x] - Na tela de meus saldos, campo data de pagamento estra mostrando pago para uma venda cancelada
[x] - No envio do e-mail de confirmação de cadastro, acrescentar o email cadastrado
[x] - Quanto a conta já estiver ativa e mostrar o erro, retornar para tela de login em 15s

# pendentes

[x] - Pensar em um cache para componentes que serão selects
[x] - Ter opção de dar uma gorjeta (habilitar na tela um QRCode de PIX)
[x] - Criar tabela para controlar as vendas realizadas (mostrar dash posteriormente)
[x] - Paginação de dados
[x] - Habilitar botão de correção depois do atendimento de laudo
[x] - Financeiro do médico, pagamento por laudo, pagar os médicos por laudo entregue depois ver valor
[x] - Cadastro de horários intervalo por médico
[x] - Liberação dos horários por médico levar consideração do dia da semana que pode atender
[x] - Cadastro de pacotes de serviço

# pendente tela advogado (termiar aqui primeiro 11/01/2025)

[x] - interar com api as indicações
[x] - integração com asaas para pagamento de pacotes
[] - integrar videos com youtube
[x] - acrescentar filtros na tela de meus saldos
[x] - Enviar email de confirmação de cadastro
[x] - Enviar email para resetar senha
[x] - Integrar pagamento de solicitações com asaas
[x] - Ter opção de pagar uma solicitação com saldo de crédito

# correções

# entregue

# Reunião 27/11/2024

[N] - Clinica nas nuvens plataforma de telemedicina
[x] - Valor da consulta, é por médico e um valor fixo, porém fica no cadastro do médico
[x] - Criar tela para cadastrar os valores que serão pagos para consulta
[] - Criar controle de comissionamento por consulta
[] - Gatware de pagamento pegar 3 opções
[] - Dashboard quantidade de consulta por médico
[x] - Remover o H de avaliações
[] - No Dashboard onde esta venda pendente clicar abrir a lista
[] - CRM dados de funil [lead, Prospecção, Reunião agendada, Aguardando fechamento, fechamento] -> Criar um cadastro
[x] - Dashboard, mostrar pacotes próximos a vencer no dashboard do admin
[x] - Dashboard admin Usuários com 40 dias ou mas da última solicitação de consulta
[] - Deixar Whatsapp ou chat para atendimento ao cliente
[] - Analisar integração com youtube
[] - Dashboard identificar a carteira, que é o valor total que os clientes compraram - saldo total da carteira
[] - API mensagem whatsapp, identificar qual usar
[] - Ao abrir o laudo, para fechar ou efetuar download será necessário avaliar, se não avaliou exigir o mesmo

# ### 02/11/2024

[x] - Médico que mais teve revisão de laudo
[x] - Dash horas trabalhadas médico
[x] - Destacar qual médico esta com mais havilações
[x] - Dashboard ADM, montar grafico das solicitações por status
[x] - Na digitação do laudo ter possibilidade de colocar anexo
[x] - Anexar documentos por solicitação e disponibilizar os anexos para médico

# ### 28/10/2024

[x] - Segurança, proteger rotas acessiveis pelo usário admin na api
[x] - Na agenda mostar count de consultas
[x] - Remover o nome do médico da solicitação na tela do advogado
[x] - Criar modelo de layout no cadatro de modelo de laudo, tambem obrigar a informar um modelo de laudo na digitação do mesmo.
[x] - Mostrar idade e data de nascimento do paciente nos detalhes de consulta
[x] - Botão para abrir e interagir com chatgpt
[x] - Tirar do advogado botão cancelar depois de pago ou andamento a solicitação
[x] - Agendamento eftuar um cadastro de horários para os médicos
[x] - Ao selecionar os médico, retornar os horários disponíveis e já agendado
[x] - Deixar apenas clicar em horas não agendada, sendo de seleção única, ou seja, não permitir clicar em vários ao mesmo tempo
[x] - Ao selecionar a data, recarregar todos os horários
[x] - Ao clicar em agendar uma consulta, aparecer os horários
[x] - Para perfil de médico remover informações de valor
[x] - Agenda somente fica disponível para usuários administrador
[x] - Remover imprimir na digitação do laudo

# ### outras datas

[x] - Agendar uma solicitação de consulta
[x] - Mostrar agenda separada por médico
[x] - Mostrar todas as agendas de todos médicos para usuário ADMIN
[x] - Iniciar uma consulta através do usuário médico
[x] - Meus saldos com dados enviados para servidor
[x] - Simulação de compra de um pacote para acumular o mesmo em meus saldos
[x] - Tela de minha conta no usuário médico
[x] - Tela para listagem dos laudos gerados
[x] - Possibilidade de gerar PDF de um laudo listado
[x] - Controle de saldo expirado
[x] - Tela para detalhar o uso do saldo
[x] - Possibilidade de descrever laudo médico para uma solicitação de consulta
[x] - Possibilidade de, buscar um modelo pronto de laudo ao iniciar a presquição
[x] - upload de arquivos, no cadastro de pacientes
[x] - Médico não pode ver dados do escritório nos detalhes de solicitação
[x] - Médico não pode ver telefone, email de cliente nos detalhes de solicitação
[x] - Finalizar tela de cadastro de pacientes
[x] - Listar as consultas de acordo com api
[x] - Exibir uma consulta de acordo com a api
[x] - Atualizar dados de uma consulta
[x] - Excluir uma consulta, sera cancelada
[x] - Verificar porque ainda não gravou numero do processo
[x] - Finalidade do laudo
[x] - Solicitar antecipação, acrescentar variação de 24, 48, 72 horas, precificar conforme opção selecionada
[x] - Solicitar uma correção, aparecer um campo para digitar o motivo da solicitação
[x] - Limite para efetuar uma solicitação de correção consulta é de 24hrs, caso ultrapasse, cobrar uma nova consulta
[x] - Endereço no cadastro de médico
[x] - filtrar pacientes por escritório
[x] - filtrar solicitações por escritório se não for admin
[x] - correção no cadastro de advogado na tela admin[x] Criar a tela de minha conta no perfil advogado
[x] Criar a tela de indicações
[x] Colocar uma lista no menu de videos
[x] - Criar uma tabela responsiva, se transforme em card quando for mobile
[x] Finalidade do laudo
[x] - Adminstrativo
[x] - Judicial (caso selecionar a opção judicial, então habilitar mais essas duas)
---[x] - Processo a distribuir
---[x] - Processo em andamento (caso escolha esta opção, informar numero de processo)
[x] Correção na tabela Solicitações por tipo de benefício no dashboard de advogado
[x] Botão nova solicitação e comprar créditos sempre visíveis
[x] Em relação ao campo de preenchimento de login e senha na
plataforma, sugiro a inclusão de um ícone de "olho", que permitirá aos usuários
e administradores visualizarem as credenciais digitadas.
Isso garantirá que tanto o login quanto a senha estejam corretos antes
de finalizar o acesso
[x] Gostaria que a expressão “Home” fosse trocada por “Início”
[x] Na seção "Solicitação" da plataforma, é essencial incorporar quatro
categorias distintas, conforme implementado na plataforma Facilita.
[x] Separar tela de vendas por região
[x] No dash de vendas filtrar cidades referente aos estados da região escolhida
[x] Campos de consultas auxiliares já inicializar com dados
[x] É crucial que adicionemos uma opção "Outros" nos campos "Tipo de Benefício" e "Finalidade do Laudo" na nossa plataforma (Já havia mencionado que é um cadastro, porém não existia o formulário para realizar o mesmo. Foi adicionado)
