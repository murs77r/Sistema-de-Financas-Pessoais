# 🤖 Sistema de Controle de Transações Financeiras Pessoais (com Automação) 💼

Este repositório contém um conjunto de scripts em Google Apps Script (GAS) projetados para automatizar tarefas de gestão financeira pessoal e empresarial, integrando-se perfeitamente com o ecossistema Google (Planilhas, Agenda, etc.).  Esses scripts trabalham em conjunto com um sistema baseado em Google AppSheet (interface gráfica) e Google Planilhas (banco de dados), *mas este repositório foca especificamente nas automações em GAS*.

## ✨ O Que os Scripts Fazem

Os scripts deste repositório oferecem um conjunto abrangente de funcionalidades para automatizar e otimizar a gestão financeira, incluindo, mas não se limitando a:

1.  **Limpeza e Organização de Dados:**
    *   `limpar_tabelas_atualizar_9876()`:  Remove linhas vazias de múltiplas abas em uma planilha, garantindo a integridade e a clareza dos dados.  Também atualiza fórmulas em uma aba específica ("Investimentos Ativos").
    *   `sincronizar_tabelas_transacoes_3856()`: Mantém a consistência dos dados entre as tabelas "Transações com Saldo" e "Transações em Investimentos", inserindo, atualizando ou removendo linhas conforme necessário.  Lida com IDs duplicados e garante que as informações estejam sempre sincronizadas.  Pode ser acionado automaticamente via Google AppSheet.
    *   `sincronizarDadosEntreTabelas_7891()`: Sincroniza os dados entre as tabelas de "Transações com Saldo" e "Faturas de Cartões de Crédito". Garante que as informações de faturas (pagamentos, datas, etc.) estejam refletidas corretamente nas transações, além de criar/atualizar/remover eventos no Google Agenda, relacionados a esses dados.

2.  **Atualização de Saldos e Investimentos:**
    *   `atualizar_investimentos_ativos_3456()`:  Atualiza a aba "Investimentos Ativos" com fórmulas que calculam o saldo atual de cada investimento, com base nas transações registradas.
    *   `atualizarSaldoContas_1234()`: Consolida os saldos de diferentes contas financeiras (bancos, corretoras, etc.) em uma única aba ("Saldo das Contas"), automatizando o cálculo dos saldos com base nas transações e nos tipos de conta.

3.  **Geração de Relatórios:**
    *   `gerarRelatorio_4752()`: Cria relatórios detalhados e personalizados em formato HTML, com base em diversos critérios de filtragem (período, tipo de transação, operador, conta, categoria, etc.). Os relatórios podem incluir tabelas, resumos por categoria e insights gerados por IA (Google Gemini). Os relatórios podem ser exibidos tanto em um formato *web* quanto em um formato para *impressão*.
    *   `gerarHTML_3618()`, `gerarHTMLconjunto_5291()`, e funções auxiliares:  Funções internas que constroem a estrutura HTML dos relatórios, formatando dados, tabelas e outros elementos visuais.
    *    `processarGemini_5312()`: Usa a API do Google Gemini para gerar insights e recomendações com base nos dados financeiros, integrando-os aos relatórios (opcional).

4.  **Transferência e Registro de Dados:**
    *   `transferir_saldos_bancarios_1654()`:  Copia os saldos das contas no primeiro dia de cada mês para uma tabela de histórico ("Transações com Saldo"), registrando o saldo anterior como uma "receita".
    *   `processar_dados_planilha_2873()`:  Transfere dados da tabela "Saldo das Contas" para a tabela "Registro de Saldo das Contas", formatando e organizando as informações.

5.  **Gestão de Eventos na Agenda:**
    *   `criarouatualizarcalendarioevento_5278()`: Cria ou atualiza eventos no Google Agenda, com base em datas e informações de transações financeiras (ex: vencimento de faturas). Inclui lembretes configuráveis.
    *   `criarouatualizareventodehoje_9876()`:  Função específica para criar ou atualizar eventos no dia atual, considerando horários e fusos horários.
    *   `deletareventoporidentificador_4739()`:  Remove eventos da agenda com base em um identificador, evitando duplicidades.

6.  **Envio de E-mails:**
    *   `sendEmailWithMailerSend()`: Envia e-mails automatizados utilizando a API do MailerSend, com relatórios financeiros anexados (em formato HTML).  Inclui tratamento de erros e retentativas.
    * `enviarParaAPI_5433()`: Chama a função de envio, utilizando as devidas credenciais

7. **Funções auxiliares**:
    * `validarParametro_5243()`: Trata os dados, tirando os espaços em brancos e tornando-os `undefined`.
    * `encodeStringToBase64UTF8_4829()`: Codifica as URLs que são anexadas para a visualização Web dos relatórios, para que funcione o filtro.
    * `lerDadosPlanilha()`: Função que lê os dados de uma planilha em específico.
    * `calcularDataLimite_4820()`: Retorna uma data final e inicial conforme os parâmetros dos filtros.
    * `ordenarDados_2497()`: Organiza os dados do relatório de acordo com os filtros utilizados
    * `getFileCache_5431()`: Gerencia os arquivos salvos dentro de uma determinada pasta do Drive
    * `filtrarDados_8532()`: Filtra os dados de acordo com os parâmetros fornecidos.
    * `getTabelaFromTipo_4183()`, `getNomeColuna_2836()`, `getTipoRelatorio_8042()`, `getFiltro_9257()`: Funções que lidam com os filtros dentro do script.
    * `gerarLinhaHTML_9427()`, `formatarData_6284()`, `gerarDescricao_7194()`, `gerarNome_8206()`, `formatarValor_7529()`: Tratam a formatação do HTML final.
    * `processarReceitas_8352()`, `processarDespesas_7491()`, `processarOperadores_2332()`: Lidam com a criação dos resumos dentro do relatório.
    * `isEmpty_4321()`, `limpar_linhas_vazias_9123()`: Tratam as funções que limpam as linhas da planilha.

8. **Funções de integração e triggers**
   * `doPost()`: Permite o tratamento de requisições POST, para utilizar o script como uma Web App e fazer o relatório.
   * `doGet()`: Permite o tratamento de requisições GET, mas é bloqueado para acesso externo
   * `gerarMensalmente_4325()`: Cria o relatório automaticamente, de modo mensal.
   * `verificar_gatilho_appsheet_7192()` e `verificar_ativador_externo_8765()`: Fazem a verificação para ver se o script deve ser rodado de modo automatizado

Em essência, estes scripts transformam o Google Planilhas em uma poderosa ferramenta de gestão financeira, automatizando tarefas repetitivas, garantindo a precisão dos dados e fornecendo *insights* valiosos para a tomada de decisões.  Eles são ideais para quem busca:

*   **Controle Financeiro Completo:**  Ter uma visão clara e atualizada de suas finanças.
*   **Automação de Tarefas:**  Eliminar o trabalho manual e reduzir erros.
*   **Relatórios Personalizados:**  Obter informações relevantes e sob medida.
*   **Integração com o Ecossistema Google:**  Aproveitar a sinergia entre Planilhas, Agenda e outros serviços.
*  **Geração de Insights via IA:** Ter a ajuda do Google Gemini para análises.
