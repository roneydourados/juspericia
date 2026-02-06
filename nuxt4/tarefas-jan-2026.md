# Implementações

# Nuvidio

[x] - Implementar as funcionalidades da nuvio para acompanhar fila de espera
[x] - Implementar as funcionalidades da nuvidio para acompanhar chamadas atendidas
[x] - Implementar as funcionalidades da nuvidio para acompanhar chamadas encerradas
[x] - Implementar as funcionalidades da nuvidio para acompanhar chamadas canceladas
[x] - Implementar as funcionalidades da nuvidio para acompanhar chamadas abandonadas
[x] - Implementar para acompanhar se o cliente saiu da fila
[x] - Implementar para ver questão da finalização do atendimento

# Interface

[x] - Implementar modo dark

# Comissão

[] - analisar e testar o porque anda gerando comissão com valor zerado

# Solicitações

[x] - Verificar filtro que não esta salvando corretamente o advogado selecionado

# Controle de saldo de créditos

[x] - possibilidade de lançar um crédito avulso através do usuário Admin
[x] - Implementar validação que além de ser admin o usuário precisa ser master para lançar créditos avulsos

# NPS

[x] - Finalizar ajustes do NPS, para avaliação de funcionalidade e qualidade do serviço em geral
[x] - Enviar email solicitando para avalidar a solicitação finalizada

# Transações

[x] - Implementar tela para mostrar detalhes do webhook nas transações de venda

# Tratamento para transações

[x] - Dar possibilidade do ADM gerar a cobrança da transação caso o usuário não queira fazer, criar cobrança no asaas ou apenas pegar o link da mesma.
Deixar um botão no front-end para copiar link, um endpoint na api que já faça esta tarefa retornar o link ou gerar uma nova cobrança caso a anterior tenha expirado.

[x] - Criar uma tabela para gravar todos os logs gerados pelo webhook do assass, para facilitar o debug e acompanhamento das transações
[x] - Verificar o que esta acontecendo quando esquece de colocar todas as informações do laudo por exemplo CPF, edita o mesmo adiciona a informação correta, porém ao assinar some

# Implementações Fevereiro

[] - Criar Cofre de senhas apenas usuário master
[] - Criar Controle de desepesas para o usuário master
[] - Tirar a trava da correção para usuário admin
[] - Analisar quando seleciona um laudo para assinar, pegar os dados do médico que o laudo está vinculado e não do usuário logado
