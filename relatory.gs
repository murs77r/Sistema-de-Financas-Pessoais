function gerarRelatorio_4752(tempo_8213, tipo_2956, operador_1853, datainicial_9531, datafinal_4692, cartaoCredito_7329, contaFinanceira_3918, descricao_6485, procedimentoSaldo_5147, procedimentoCartao_8964, idRecorrencia_2759, categoria_4108, status_6925, relevanteImpostoRenda_5831, lancamentocartao_3233, operacaoSaldo_7294, parcelas_2321, qtdeparcelas_2143, gerarInsights_1344) {
    const startTime = new Date();

    tempo_8213 = validarParametro_5243(tempo_8213);
    tipo_2956 = validarParametro_5243(tipo_2956);
    operador_1853 = validarParametro_5243(operador_1853);
    datainicial_9531 = validarParametro_5243(datainicial_9531);
    datafinal_4692 = validarParametro_5243(datafinal_4692);
    cartaoCredito_7329 = validarParametro_5243(cartaoCredito_7329);
    contaFinanceira_3918 = validarParametro_5243(contaFinanceira_3918);
    descricao_6485 = validarParametro_5243(descricao_6485);
    procedimentoSaldo_5147 = validarParametro_5243(procedimentoSaldo_5147);
    procedimentoCartao_8964 = validarParametro_5243(procedimentoCartao_8964);
    idRecorrencia_2759 = validarParametro_5243(idRecorrencia_2759);
    categoria_4108 = validarParametro_5243(categoria_4108);
    status_6925 = validarParametro_5243(status_6925);
    relevanteImpostoRenda_5831 = validarParametro_5243(relevanteImpostoRenda_5831);
    operacaoSaldo_7294 = validarParametro_5243(operacaoSaldo_7294);
    lancamentocartao_3233 = validarParametro_5243(lancamentocartao_3233);
    parcelas_2321 = validarParametro_5243(parcelas_2321);
    qtdeparcelas_2143 = validarParametro_5243(qtdeparcelas_2143);
    gerarInsights_1344 = validarParametro_5243(gerarInsights_1344)

    const imprimir_3857 = false;
    const filtros1214 = 'Mostrar';
    const ss_6392 = SpreadsheetApp.openById(spreedsheet_id());

    const abaderelatorios_4323 = ss_6392.getSheetByName("Gerador de Relatórios");

    if (abaderelatorios_4323 != null) {
        var linha_5621 = 2;
        var ultimaColuna_7483 = abaderelatorios_4323.getLastColumn();

        abaderelatorios_4323.getRange(linha_5621, 1, 1, ultimaColuna_7483).clearContent();
    }

    const sheets_5721 = {
        'Transações com Saldo': ss_6392.getSheetByName('Transações com Saldo'),
        'Transações com Cartão de Crédito': ss_6392.getSheetByName('Transações com Cartão de Crédito')
    };

    const colunas_1495 = {
        'Transações com Saldo': {
            'ID': 0, 'Procedimento': 1, 'Operação': 2, 'Descrição': 3, 'Categoria - Crédito': 4,
            'Categoria - Débito': 5, 'Status': 6, 'Operador': 7, 'Data de Registro': 8,
            'Horário de Registro': 9, 'Programado': 10, 'Data Programada': 11,
            'Horário Programado': 12, 'Data de Efetivação': 13, 'Horário da Efetivação': 14,
            'Mês da Transação': 15, 'Ano da Transação': 16, 'Conta de Origem': 17,
            'Tipo de Conta de Origem': 18, 'Conta de Destino': 19, 'Tipo de Conta de Destino': 20,
            'Valor Base': 21, 'Taxas ou Impostos': 22, 'Sub-Total': 23, 'Total Efetivo': 24, 'Termos do Serviço': 25,
            'Documento Comprobatório': 26, 'Link do Documento Fiscal': 27, 'Observações': 28,
            'Relevante para Imposto de Renda': 29, 'Registro de Atualização': 30,
            'Última Atualização': 31, 'ID de Recorrência': 32
        },
        'Transações com Cartão de Crédito': {
            'ID': 0, 'Procedimento': 1, 'Descrição': 2, 'Categoria': 3, 'Status': 4, 'Operador': 5,
            'Data de Registro': 6, 'Horário de Registro': 7, 'Programado': 8, 'Data Programada': 9,
            'Horário Programado': 10, 'Data de Efetivação': 11, 'Horário da Efetivação': 12,
            'Lançamento Indicativo': 13, 'Indicativo de Mês': 14, 'Mês da Transação': 15,
            'Indicativo de Ano': 16, 'Ano da Transação': 17, 'Parcelamento': 18,
            'Quantidade de Parcelas': 19, 'Lançamento': 20, 'Cartão de Crédito': 21,
            'Valor Base': 22, 'Taxas ou Impostos': 23, 'Sub-Total': 24, 'Total Efetivo': 25,
            'Valor Individual/Parcela': 26, 'Termos do Serviço': 27, 'Documento Comprobatório': 28,
            'Link do Documento Fiscal': 29, 'Observações': 30,
            'Relevante para Imposto de Renda': 31, 'Registro de Atualização': 32,
            'Última Atualização': 33, 'ID da Recorrência': 34
        }
    };


    const dadosSaldo = lerDadosPlanilha(sheets_5721['Transações com Saldo']);
    const dadosCartao = lerDadosPlanilha(sheets_5721['Transações com Cartão de Crédito']);

    const totalLinhas = dadosSaldo.length + dadosCartao.length;
    const minBatchSize = 25;
    const maxBatchSize = 250;
    const batchSize = Math.min(maxBatchSize, Math.max(minBatchSize, Math.round(totalLinhas * 0.15)));

    try {
        if (tempo_8213 !== undefined && datainicial_9531 !== undefined && datafinal_4692 !== undefined) {
            throw new Error('Parâmetros "tempo_8213", "datainicial_9531" e "datafinal_4692" não podem ser preenchidos simultaneamente.');
        }

        if (datainicial_9531 === undefined && datafinal_4692 === undefined && !(/^(\d+\s*dias?|\d+\s*dia|Último Mês|Último Ano|Tudo)$/i.test(tempo_8213))) {
            throw new Error('Parâmetro "tempo_4826" inválido.');
        }

        if (!['Cartão de Crédito e Saldo', 'Cartão de Crédito', 'Saldo'].includes(tipo_2956)) {
            throw new Error('Parâmetro "tipo_2956" inválido.');
        }

        let htmlFinal_9642;

        if (tempo_8213 === 'Último Mês') {
            const condicaodegeracao_6834 = "Segmentado";

            const dataHoje = new Date();
            const ultimoMes = new Date(dataHoje.getFullYear(), dataHoje.getMonth() - 1, 1);
            const mesAnoUltimoMes_3523 = ultimoMes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(' de ', '/').replace(/^(.)/, (letra) => letra.toUpperCase());

            let dadosFiltradosCCRealizadas = [];
            for (let i = 0; i < dadosCartao.length; i += batchSize) {
                const batch = dadosCartao.slice(i, i + batchSize);
                dadosFiltradosCCRealizadas = dadosFiltradosCCRealizadas.concat(filtrarDados_8532(dadosSaldo, batch, colunas_1495, tempo_8213, 'Cartão de Crédito', operador_1853, datainicial_9531, datafinal_4692, cartaoCredito_7329, contaFinanceira_3918, descricao_6485, procedimentoSaldo_5147, procedimentoCartao_8964, idRecorrencia_2759, categoria_4108, status_6925, relevanteImpostoRenda_5831, operacaoSaldo_7294, mesAnoUltimoMes_3523, condicaodegeracao_6834, parcelas_2321, qtdeparcelas_2143, 'Filtro de Incidência'));
            }

            const dadosOrdenadosCCRealizadas = ordenarDados_2497(dadosFiltradosCCRealizadas, colunas_1495, 'Cartão de Crédito');
            const htmlCCRealizadas = gerarHTML_3618(dadosOrdenadosCCRealizadas, colunas_1495, 'Cartão de Crédito', tempo_8213, operador_1853, datainicial_9531, datafinal_4692, cartaoCredito_7329, contaFinanceira_3918, imprimir_3857, lancamentocartao_3233, "Segmentado", procedimentoSaldo_5147, procedimentoCartao_8964, idRecorrencia_2759, categoria_4108, status_6925, relevanteImpostoRenda_5831, descricao_6485, operacaoSaldo_7294, filtros1214, parcelas_2321, qtdeparcelas_2143, undefined, undefined, mesAnoUltimoMes_3523);


            let dadosFiltradosCCIncidentes = [];
            for (let i = 0; i < dadosCartao.length; i += batchSize) {
                const batch = dadosCartao.slice(i, i + batchSize);
                dadosFiltradosCCIncidentes = dadosFiltradosCCIncidentes.concat(filtrarDados_8532(dadosSaldo, batch, colunas_1495, 'Antes e Durante Último Mês', 'Cartão de Crédito', operador_1853, datainicial_9531, datafinal_4692, cartaoCredito_7329, contaFinanceira_3918, descricao_6485, procedimentoSaldo_5147, procedimentoCartao_8964, idRecorrencia_2759, categoria_4108, status_6925, relevanteImpostoRenda_5831, operacaoSaldo_7294, mesAnoUltimoMes_3523, condicaodegeracao_6834, parcelas_2321, qtdeparcelas_2143));
            }

            const dadosOrdenadosCCIncidentes = ordenarDados_2497(dadosFiltradosCCIncidentes, colunas_1495, 'Cartão de Crédito');
            const htmlCCIncidentes = gerarHTML_3618(dadosOrdenadosCCIncidentes, colunas_1495, 'Cartão de Crédito', tempo_8213, operador_1853, datainicial_9531, datafinal_4692, cartaoCredito_7329, contaFinanceira_3918, imprimir_3857, lancamentocartao_3233, "Segmentado", procedimentoSaldo_5147, procedimentoCartao_8964, idRecorrencia_2759, categoria_4108, status_6925, relevanteImpostoRenda_5831, descricao_6485, operacaoSaldo_7294, filtros1214, parcelas_2321, qtdeparcelas_2143, undefined, undefined, mesAnoUltimoMes_3523, 'Incidentes');

            let dadosFiltradosSaldo_2804 = [];
            for (let i = 0; i < dadosSaldo.length; i += batchSize) {
                const batch = dadosSaldo.slice(i, i + batchSize);
                dadosFiltradosSaldo_2804 = dadosFiltradosSaldo_2804.concat(filtrarDados_8532(batch, dadosCartao, colunas_1495, tempo_8213, 'Saldo', operador_1853, datainicial_9531, datafinal_4692, cartaoCredito_7329, contaFinanceira_3918, descricao_6485, procedimentoSaldo_5147, procedimentoCartao_8964, idRecorrencia_2759, categoria_4108, status_6925, relevanteImpostoRenda_5831, operacaoSaldo_7294, lancamentocartao_3233, condicaodegeracao_6834, parcelas_2321, qtdeparcelas_2143));
            }

            const dadosOrdenadosSaldo_9421 = ordenarDados_2497(dadosFiltradosSaldo_2804, colunas_1495, 'Saldo');
            const htmlSaldo_7605 = gerarHTML_3618(dadosOrdenadosSaldo_9421, colunas_1495, 'Saldo', tempo_8213, operador_1853, datainicial_9531, datafinal_4692, cartaoCredito_7329, contaFinanceira_3918, imprimir_3857, lancamentocartao_3233, "Segmentado", procedimentoSaldo_5147, procedimentoCartao_8964, idRecorrencia_2759, categoria_4108, status_6925, relevanteImpostoRenda_5831, descricao_6485, operacaoSaldo_7294, filtros1214, parcelas_2321, qtdeparcelas_2143);

            const conjuntohtml_3982 = gerarHTMLconjunto_5291(htmlCCRealizadas, htmlCCIncidentes, htmlSaldo_7605, imprimir_3857);

            htmlFinal_9642 = conjuntohtml_3982;
            enviarParaAPI_5433(htmlFinal_9642, `Relatório de Transações de ${mesAnoUltimoMes_3523}`);

        } else {
            const condicaodegeracao_4271 = "Normal";

            let dadosFiltrados_6583 = [];

            for (let i = 0; i < dadosSaldo.length; i += batchSize) {
                const saldoBatch = dadosSaldo.slice(i, i + batchSize);
                dadosFiltrados_6583 = dadosFiltrados_6583.concat(filtrarDados_8532(saldoBatch, [], colunas_1495, tempo_8213, tipo_2956, operador_1853, datainicial_9531, datafinal_4692, cartaoCredito_7329, contaFinanceira_3918, descricao_6485, procedimentoSaldo_5147, procedimentoCartao_8964, idRecorrencia_2759, categoria_4108, status_6925, relevanteImpostoRenda_5831, operacaoSaldo_7294, lancamentocartao_3233, condicaodegeracao_4271, parcelas_2321, qtdeparcelas_2143));
            }

            for (let i = 0; i < dadosCartao.length; i += batchSize) {
                const cartaoBatch = dadosCartao.slice(i, i + batchSize);
                dadosFiltrados_6583 = dadosFiltrados_6583.concat(filtrarDados_8532([], cartaoBatch, colunas_1495, tempo_8213, tipo_2956, operador_1853, datainicial_9531, datafinal_4692, cartaoCredito_7329, contaFinanceira_3918, descricao_6485, procedimentoSaldo_5147, procedimentoCartao_8964, idRecorrencia_2759, categoria_4108, status_6925, relevanteImpostoRenda_5831, operacaoSaldo_7294, lancamentocartao_3233, condicaodegeracao_4271, parcelas_2321, qtdeparcelas_2143));
            }

            const dadosOrdenados_5298 = ordenarDados_2497(dadosFiltrados_6583, colunas_1495, tipo_2956);
            const html_8036 = gerarHTML_3618(dadosOrdenados_5298, colunas_1495, tipo_2956, tempo_8213, operador_1853, datainicial_9531, datafinal_4692, cartaoCredito_7329, contaFinanceira_3918, imprimir_3857, lancamentocartao_3233, "Normal", procedimentoSaldo_5147, procedimentoCartao_8964, idRecorrencia_2759, categoria_4108, status_6925, relevanteImpostoRenda_5831, descricao_6485, operacaoSaldo_7294, filtros1214, parcelas_2321, qtdeparcelas_2143, gerarInsights_1344);
            htmlFinal_9642 = html_8036;
            enviarParaAPI_5433(htmlFinal_9642);
        }


    } catch (e) {
        console.error('Erro: ' + e.message);
    }

    const endTime = new Date();
    const executionTime = endTime - startTime;
    const minutes = Math.floor(executionTime / 60000);
    const seconds = Math.floor((executionTime % 60000) / 1000);
    const milliseconds = executionTime % 1000;

    console.log(`[gerarRelatorio_4752] Tempo de execução: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`);


    function lerDadosPlanilha(sheet) {
        const cabecalhoRow_7519 = 1;
        const linhaDados_4982 = cabecalhoRow_7519 + 1;
        const ultimaLinha_8306 = sheet.getLastRow();
        const ultimaColuna_9274 = sheet.getLastColumn();


        if (ultimaLinha_8306 < linhaDados_4982) {
            return [];
        }

        const range = sheet.getRange(linhaDados_4982, 1, ultimaLinha_8306 - cabecalhoRow_7519, ultimaColuna_9274);
        return range.getValues();
    }

}

function filtrarDados_8532(dadosSaldo, dadosCartao, colunas_1495, tempo_8213, tipo_2956, operador_1853, datainicial_9531, datafinal_4692, cartaoCredito_7329, contaFinanceira_3918, descricao_6485, procedimentoSaldo_5147, procedimentoCartao_8964, idRecorrencia_2759, categoria_4108, status_6925, relevanteImpostoRenda_5831, operacaoSaldo_7294, lancamentocartao_3233, condicaodegeracao_6834, parcelas_2321, qtdeparcelas_2143, incidencia_2545 = undefined) {
    function parseDateString(dateString) {
        if (dateString instanceof Date) return dateString;
        if (!dateString || typeof dateString !== 'string') return null;
        let match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (match) return new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10));
        match = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
        if (match) return new Date(parseInt(match[3], 10), parseInt(match[2], 10) - 1, parseInt(match[1], 10));
        return null;
    }

    function isDateWithinRange(date, startDate, endDate) {
        if (!date) return false;
        if (startDate && date < startDate) return false;
        if (endDate && date > endDate) return false;
        return true;
    }

    let operadorLower = operador_1853?.toLowerCase();
    let operadorNotContains = false;
    if (operadorLower && operadorLower.startsWith("<>")) {
        operadorNotContains = true;
        operadorLower = operadorLower.substring(2);
    }

    let cartaoCreditoLower = cartaoCredito_7329?.toLowerCase();
    let cartaoCreditoNotContains = false;
    if (cartaoCreditoLower && cartaoCreditoLower.startsWith("<>")) {
        cartaoCreditoNotContains = true;
        cartaoCreditoLower = cartaoCreditoLower.substring(2);
    }

    let contaFinanceiraLower = contaFinanceira_3918?.toLowerCase();
    let contaFinanceiraNotContains = false;
    if (contaFinanceiraLower && contaFinanceiraLower.startsWith("<>")) {
        contaFinanceiraNotContains = true;
        contaFinanceiraLower = contaFinanceiraLower.substring(2);
    }

    let descricaoLower = descricao_6485?.toLowerCase();
    let descricaoNotContains = false;
    if (descricaoLower && descricaoLower.startsWith("<>")) {
        descricaoNotContains = true;
        descricaoLower = descricaoLower.substring(2);
    }

    let procedimentoSaldoLower = procedimentoSaldo_5147?.toLowerCase();
    let procedimentoSaldoNotContains = false;
    if (procedimentoSaldoLower && procedimentoSaldoLower.startsWith("<>")) {
        procedimentoSaldoNotContains = true;
        procedimentoSaldoLower = procedimentoSaldoLower.substring(2);
    }

    let procedimentoCartaoLower = procedimentoCartao_8964?.toLowerCase();
    let procedimentoCartaoNotContains = false;
    if (procedimentoCartaoLower && procedimentoCartaoLower.startsWith("<>")) {
        procedimentoCartaoNotContains = true;
        procedimentoCartaoLower = procedimentoCartaoLower.substring(2);
    }

    let idRecorrenciaLower = idRecorrencia_2759?.toLowerCase();
    let idRecorrenciaNotContains = false;
    if (idRecorrenciaLower && idRecorrenciaLower.startsWith("<>")) {
        idRecorrenciaNotContains = true;
        idRecorrenciaLower = idRecorrenciaLower.substring(2);
    }

    let categoriaLower = categoria_4108?.toLowerCase();
    let categoriaNotContains = false;
    if (categoriaLower && categoriaLower.startsWith("<>")) {
        categoriaNotContains = true;
        categoriaLower = categoriaLower.substring(2);
    }

    let statusLower = status_6925?.toLowerCase();
    let statusNotContains = false;
    if (statusLower && statusLower.startsWith("<>")) {
        statusNotContains = true;
        statusLower = statusLower.substring(2);
    }

    let relevanteImpostoRendaLower = relevanteImpostoRenda_5831?.toLowerCase();
    let relevanteImpostoRendaNotContains = false;
    if (relevanteImpostoRendaLower && relevanteImpostoRendaLower.startsWith("<>")) {
        relevanteImpostoRendaNotContains = true;
        relevanteImpostoRendaLower = relevanteImpostoRendaLower.substring(2);
    }

    let operacaoSaldoLower = operacaoSaldo_7294?.toLowerCase();
    let operacaoSaldoNotContains = false;
    if (operacaoSaldoLower && operacaoSaldoLower.startsWith("<>")) {
        operacaoSaldoNotContains = true;
        operacaoSaldoLower = operacaoSaldoLower.substring(2);
    }

    const lancamentosLower = lancamentocartao_3233?.split(",").map(s => s.trim().toLowerCase());
    const incidenciaprin = incidencia_2545

    let dadosFiltrados_9376 = [];

    function filtrarLinha(linha_5729, colunasTabela_8543, tabelaOrigem_1486) {
        const procedimento_6395 = linha_5729[colunasTabela_8543['Procedimento']];
        const id_1937 = linha_5729[colunasTabela_8543['ID']];
        if (!linha_5729 || linha_5729.length === 0 || linha_5729.every(item_9247 => item_9247 === '' || !id_1937)) return false;
        if (procedimento_6395 === 'Saldo Anterior' || id_1937.startsWith('N')) return false;

        if (!(tempo_8213 === 'Tudo' && lancamentocartao_3233)) {
            const dataHoje_3185 = new Date();
            let { dataInicial_6294, dataFinal_1573 } = calcularDataLimite_4820(dataHoje_3185, tempo_8213, datainicial_9531, datafinal_4692);
            if (dataInicial_6294) dataInicial_6294.setHours(0, 0, 0, 0);
            if (dataFinal_1573) dataFinal_1573.setHours(23, 59, 59, 999);
            const dataEfetivacao_4816 = parseDateString(linha_5729[colunasTabela_8543['Data de Efetivação']]);
            if (!isDateWithinRange(dataEfetivacao_4816, dataInicial_6294, dataFinal_1573)) return false;
        }

        const operadorLinhaLower = linha_5729[colunasTabela_8543['Operador']]?.toLowerCase();
        const statusLinhaLower = linha_5729[colunasTabela_8543['Status']]?.toLowerCase();
        const cartaoCreditoLinhaLower = linha_5729[colunasTabela_8543['Cartão de Crédito']]?.toLowerCase();
        const lancamentoLinhaLower = linha_5729[colunasTabela_8543['Lançamento']]?.toLowerCase();
        const contaOrigemLinhaLower = linha_5729[colunasTabela_8543['Conta de Origem']]?.toLowerCase();
        const contaDestinoLinhaLower = linha_5729[colunasTabela_8543['Conta de Destino']]?.toLowerCase();
        const descricaoLinhaLower = linha_5729[colunasTabela_8543['Descrição']]?.toLowerCase();
        const idRecorrenciaLinhaLower = linha_5729[colunasTabela_8543['ID de Recorrência']]?.toLowerCase();
        const relevanteImpostoRendaLinhaLower = linha_5729[colunasTabela_8543['Relevante para Imposto de Renda']]?.toLowerCase();
        const operacaoSaldoLinhaLower = linha_5729[colunasTabela_8543['Operação']]?.toLowerCase();
        const procedimentoLinhaLower = procedimento_6395?.toLowerCase();
        const parcelamentolinha_2321 = linha_5729[colunasTabela_8543['Parcelamento']];
        const parcelaslinha_2142 = linha_5729[colunasTabela_8543['Quantidade de Parcelas']];

        let categoriaLinhaLower;
        if (tabelaOrigem_1486 === 'Transações com Saldo') {
            const operacao = linha_5729[colunasTabela_8543['Operação']];
            const categoriaCredito = linha_5729[colunasTabela_8543['Categoria - Crédito']];
            const categoriaDebito = linha_5729[colunasTabela_8543['Categoria - Débito']];
            categoriaLinhaLower = (operacao === 'Crédito' ? categoriaCredito : categoriaDebito)?.toLowerCase();
        } else {
            categoriaLinhaLower = linha_5729[colunasTabela_8543['Categoria']]?.toLowerCase();
        }

        if (
            (tipo_2956 === 'Cartão de Crédito e Saldo' && id_1937.startsWith('F')) ||
            (tipo_2956 === 'Cartão de Crédito e Saldo' && condicaodegeracao_6834 === 'Segmentado' && statusLinhaLower !== 'efetuado') ||
            (parcelas_2321 && parcelas_2321 !== parcelamentolinha_2321) ||
            (qtdeparcelas_2143 && qtdeparcelas_2143 !== parcelaslinha_2142)
        ) {
            return false;
        }

        if (operadorLower) {
            if (operadorNotContains ? operadorLinhaLower.indexOf(operadorLower) !== -1 : operadorLinhaLower.indexOf(operadorLower) === -1) return false;
        }
        if (cartaoCreditoLower) {
            if (cartaoCreditoNotContains ? cartaoCreditoLinhaLower.indexOf(cartaoCreditoLower) !== -1 : cartaoCreditoLinhaLower.indexOf(cartaoCreditoLower) === -1) return false;
        }
        if (descricaoLower) {
            if (descricaoNotContains ? descricaoLinhaLower.indexOf(descricaoLower) !== -1 : descricaoLinhaLower.indexOf(descricaoLower) === -1) return false;
        }
        if (procedimentoSaldoLower && tabelaOrigem_1486 === 'Transações com Saldo') {
            if (procedimentoSaldoNotContains ? procedimentoLinhaLower.indexOf(procedimentoSaldoLower) !== -1 : procedimentoLinhaLower.indexOf(procedimentoSaldoLower) === -1) return false;
        }
        if (procedimentoCartaoLower && tabelaOrigem_1486 === 'Transações com Cartão de Crédito') {
            if (procedimentoCartaoNotContains ? procedimentoLinhaLower.indexOf(procedimentoCartaoLower) !== -1 : procedimentoLinhaLower.indexOf(procedimentoCartaoLower) === -1) return false;
        }
        if (idRecorrenciaLower) {
            if (idRecorrenciaNotContains ? idRecorrenciaLinhaLower.indexOf(idRecorrenciaLower) !== -1 : idRecorrenciaLinhaLower.indexOf(idRecorrenciaLower) === -1) return false;
        }

        if (categoriaLower) {
            if (categoriaNotContains ? categoriaLinhaLower.indexOf(categoriaLower) !== -1 : categoriaLinhaLower.indexOf(categoriaLower) === -1) return false;
        }

        if (statusLower) {
            if (statusNotContains ? statusLinhaLower.indexOf(statusLower) !== -1 : statusLinhaLower.indexOf(statusLower) === -1) return false;
        }

        if (relevanteImpostoRendaLower) {
            if (relevanteImpostoRendaNotContains ? relevanteImpostoRendaLinhaLower.indexOf(relevanteImpostoRendaLower) !== -1 : relevanteImpostoRendaLinhaLower.indexOf(relevanteImpostoRendaLower) === -1) return false;
        }

        if (operacaoSaldoLower && tabelaOrigem_1486 === 'Transações com Saldo') {
            if (operacaoSaldoNotContains ? operacaoSaldoLinhaLower.indexOf(operacaoSaldoLower) !== -1 : operacaoSaldoLinhaLower.indexOf(operacaoSaldoLower) === -1) return false;
        }
        const isCartaoCredito = tabelaOrigem_1486 === 'Transações com Cartão de Crédito';
        const contasVazias = !contaOrigemLinhaLower && !contaDestinoLinhaLower;
        const naoMovimentacao = procedimento_6395 && procedimento_6395.toLowerCase() !== "movimentação entre contas";
        const origemDiferente = contaOrigemLinhaLower && contaOrigemLinhaLower !== contaFinanceiraLower;
        const destinoDiferente = contaDestinoLinhaLower && contaDestinoLinhaLower !== contaFinanceiraLower;
        const movimentacaoEntreContas = procedimento_6395 && procedimento_6395.toLowerCase() === "movimentação entre contas";


        if (contaFinanceiraLower) {
            if (contaFinanceiraNotContains) {
                if (!isCartaoCredito) {
                    if (!(
                        contasVazias ||
                        (naoMovimentacao && (contaOrigemLinhaLower.includes(contaFinanceiraLower) || contaDestinoLinhaLower.includes(contaFinanceiraLower))) ||
                        (movimentacaoEntreContas && (contaOrigemLinhaLower.includes(contaFinanceiraLower) && contaDestinoLinhaLower.includes(contaFinanceiraLower)))
                    )) {
                        return false;
                    }
                }
            } else {
                if (!isCartaoCredito) {
                    if (
                        contasVazias ||
                        (naoMovimentacao && (origemDiferente || destinoDiferente)) ||
                        (movimentacaoEntreContas && (origemDiferente && destinoDiferente))
                    ) {
                        return false;
                    }
                }
            }
        }


        if (lancamentosLower && lancamentoLinhaLower && incidenciaprin !== 'Filtro de Incidência') {
            if (!lancamentosLower.some(lancamento => lancamentoLinhaLower.indexOf(lancamento) !== -1)) return false;
        }

        if (lancamentosLower && lancamentoLinhaLower && incidenciaprin === 'Filtro de Incidência') {
            if (lancamentosLower.some(lancamento => lancamentoLinhaLower.indexOf(lancamento) !== -1)) return false;
        }

        return true;
    }

    if (tipo_2956 === 'Cartão de Crédito e Saldo' || tipo_2956 === 'Saldo') {
        dadosFiltrados_9376 = dadosFiltrados_9376.concat(dadosSaldo.filter(linha => filtrarLinha(linha, colunas_1495['Transações com Saldo'], 'Transações com Saldo')).map(linha_8429 => ({ ...linha_8429, tabelaOrigem: 'Transações com Saldo' })));
    }
    if (tipo_2956 === 'Cartão de Crédito e Saldo' || tipo_2956 === 'Cartão de Crédito') {
        dadosFiltrados_9376 = dadosFiltrados_9376.concat(dadosCartao.filter(linha => filtrarLinha(linha, colunas_1495['Transações com Cartão de Crédito'], 'Transações com Cartão de Crédito')).map(linha_3967 => ({ ...linha_3967, tabelaOrigem: 'Transações com Cartão de Crédito' })));
    }

    return dadosFiltrados_9376;
}

function calcularDataLimite_4820(dataHoje_3185, tempo_8213, datainicial_9531, datafinal_4692) {
    let dataInicial_6294 = null;
    let dataFinal_1573 = new Date(dataHoje_3185);
    dataFinal_1573.setHours(23, 59, 59, 999);

    if (datainicial_9531 && datafinal_4692) {
        const [diaInicial_2846, mesInicial_9153, anoInicial_4370] = datainicial_9531.includes('T') ? datainicial_9531.split('T')[0].split('-').reverse() : datainicial_9531.split('/').map(Number);
        const [diaFinal_6824, mesFinal_3951, anoFinal_2187] = datafinal_4692.includes('T') ? datafinal_4692.split('T')[0].split('-').reverse() : datafinal_4692.split('/').map(Number);

        dataInicial_6294 = new Date(anoInicial_4370, mesInicial_9153 - 1, diaInicial_2846);
        dataFinal_1573 = new Date(anoFinal_2187, mesFinal_3951 - 1, diaFinal_6824);
        dataInicial_6294.setHours(0, 0, 0, 0);
        dataFinal_1573.setHours(23, 59, 59, 999);

    } else {
        const tempoParaDias = {
            '3 meses': () => {
                const data_9571 = new Date(dataHoje_3185);
                data_9571.setMonth(dataHoje_3185.getMonth() - 3);
                return data_9571;
            },
            '6 meses': () => {
                const data_9571 = new Date(dataHoje_3185);
                data_9571.setMonth(dataHoje_3185.getMonth() - 6);
                return data_9571;
            },
            '1 ano': () => {
                const data_9571 = new Date(dataHoje_3185);
                data_9571.setFullYear(dataHoje_3185.getFullYear() - 1);
                return data_9571;
            },
            '2 anos': () => {
                const data_9571 = new Date(dataHoje_3185);
                data_9571.setFullYear(dataHoje_3185.getFullYear() - 2);
                return data_9571;
            },
            '3 anos': () => {
                const data_9571 = new Date(dataHoje_3185);
                data_9571.setFullYear(dataHoje_3185.getFullYear() - 3);
                return data_9571;
            },
            '4 anos': () => {
                const data_9571 = new Date(dataHoje_3185);
                data_9571.setFullYear(dataHoje_3185.getFullYear() - 4);
                return data_9571;
            },
            '5 anos': () => {
                const data_9571 = new Date(dataHoje_3185);
                data_9571.setFullYear(dataHoje_3185.getFullYear() - 5);
                return data_9571;
            },
        };


        let numeroDias_7518 = null;
        if (typeof tempo_8213 === 'string') {
            const match_8306 = tempo_8213.match(/^(\d+)\s*dias$/);
            if (match_8306) {
                numeroDias_7518 = parseInt(match_8306[1], 10);
            }
        }

        if (numeroDias_7518 !== null) {
            dataInicial_6294 = new Date(dataHoje_3185);
            dataInicial_6294.setDate(dataHoje_3185.getDate() - numeroDias_7518);
        } else if (tempo_8213 in tempoParaDias) {
            dataInicial_6294 = tempoParaDias[tempo_8213]();
        }
        else {
            switch (tempo_8213) {
                case 'Último Mês':
                    dataInicial_6294 = new Date(dataHoje_3185.getFullYear(), dataHoje_3185.getMonth() - 1, 1);
                    dataFinal_1573 = new Date(dataHoje_3185.getFullYear(), dataHoje_3185.getMonth(), 0, 23, 59, 59, 999);
                    break;
                case 'Último Ano':
                    dataInicial_6294 = new Date(dataHoje_3185.getFullYear() - 1, 0, 1);
                    dataFinal_1573 = new Date(dataHoje_3185.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
                    break;
                case 'Tudo':
                    dataInicial_6294 = new Date(0);
                    break;
                case 'Antes e Durante Último Mês':
                    dataInicial_6294 = new Date(0);
                    dataFinal_1573 = new Date(dataHoje_3185.getFullYear(), dataHoje_3185.getMonth(), 0);
                    dataFinal_1573.setHours(23, 59, 59, 999);
                    break;
            }
        }

        if (dataInicial_6294) {
            dataInicial_6294.setHours(0, 0, 0, 0);
        }
    }
    return { dataInicial_6294, dataFinal_1573 };
}

function ordenarDados_2497(dados_7439, colunas_1495) {
    const ordenar_9615 = (arr_4857, colunas_1495) => {
        arr_4857.sort((a_2947, b_7518) => {
            const tabelaA_6394 = a_2947.tabelaOrigem;
            const tabelaB_1840 = b_7518.tabelaOrigem;

            const dataA_5283 = new Date(a_2947[colunas_1495[tabelaA_6394]['Data de Efetivação']]);
            const dataB_9726 = new Date(b_7518[colunas_1495[tabelaB_1840]['Data de Efetivação']]);
            const timeA = dataA_5283.getTime();
            const timeB = dataB_9726.getTime();


            if (timeA !== timeB) {
                return timeA - timeB;
            } else {
                let horarioA_4195 = new Date(a_2947[colunas_1495[tabelaA_6394]['Horário da Efetivação']]);
                let horarioB_8602 = new Date(b_7518[colunas_1495[tabelaB_1840]['Horário da Efetivação']]);

                if (a_2947[colunas_1495[tabelaA_6394]['Procedimento']] === 'Pagamento - Débito Automático') {
                    horarioA_4195.setHours(4, 0, 0, 0);
                }
                if (b_7518[colunas_1495[tabelaB_1840]['Procedimento']] === 'Pagamento - Débito Automático') {
                    horarioB_8602.setHours(4, 0, 0, 0);
                }

                const horarioAString_7359 = horarioA_4195.toLocaleTimeString('pt-BR');
                const horarioBString_2984 = horarioB_8602.toLocaleTimeString('pt-BR');

                return horarioAString_7359.localeCompare(horarioBString_2984);
            }
        });
    };
    ordenar_9615(dados_7439, colunas_1495);
    return dados_7439;
}

function getTabelaFromTipo_4183(linha_7620, tipo_2956) {
    let tabela_4917;
    if (tipo_2956 === 'Cartão de Crédito') {
        tabela_4917 = 'Transações com Cartão de Crédito';
    } else if (tipo_2956 === 'Saldo') {
        tabela_4917 = 'Transações com Saldo';
    } else {
        tabela_4917 = linha_7620.tabelaOrigem;
    }
    return tabela_4917;
}

function gerarHTML_3618(dados_3805, colunas_1495, tipo_2956, tempo_8213, operador_1853, datainicial_9531, datafinal_4692, cartaoCredito_7329, contaFinanceira_3918, imprimir_3857, lancamentocartao_3233, condicaodegeracao_6834, procedimentoSaldo_5147, procedimentoCartao_8964, idRecorrencia_2759, categoria_4108, status_6925, relevanteImpostoRenda_5831, descricao_6485, operacaoSaldo_7294, filtros1214, parcelas_2321, qtdeparcelas_2143, gerarInsights_1344 = undefined, insightgerado_9250 = undefined, mesAnoUltimoMes_3523 = undefined, incidencia2432 = undefined) {
    operador_1853 = operador_1853 ? operador_1853.replace('<>', 'DIFERENTE DE ') : operador_1853
    cartaoCredito_7329 = cartaoCredito_7329 ? cartaoCredito_7329.replace('<>', 'DIFERENTE DE ') : cartaoCredito_7329
    contaFinanceira_3918 = contaFinanceira_3918 ? contaFinanceira_3918.replace('<>', 'DIFERENTE DE ') : contaFinanceira_3918
    procedimentoSaldo_5147 = procedimentoSaldo_5147 ? procedimentoSaldo_5147.replace('<>', 'DIFERENTE DE ') : procedimentoSaldo_5147
    procedimentoCartao_8964 = procedimentoCartao_8964 ? procedimentoCartao_8964.replace('<>', 'DIFERENTE DE ') : procedimentoCartao_8964
    categoria_4108 = categoria_4108 ? categoria_4108.replace('<>', 'DIFERENTE DE ') : categoria_4108
    descricao_6485 = descricao_6485 ? descricao_6485.replace('<>', 'DIFERENTE DE ') : descricao_6485

    const fileCache_7426 = getFileCache_5431();
    const nomeColuna_1242 = getNomeColuna_2836(tipo_2956)
    const insights_2145 = gerarInsights_1344
    const tipogerador_2413 = tipo_2956

    if (condicaodegeracao_6834 !== "Segmentado") {
        let html_2951 = ``;
        let html_gemini_1242 = ``;

        const calcularTotaisPorCategoria = (dados, colunas) => {
            const totais = new Map();
            dados.forEach(linha => {
                const tabela = getTabelaFromTipo_4183(linha, tipo_2956);
                const colunasTabela = colunas[tabela];

                let categoria, tipoCategoria;
                if (tabela === 'Transações com Saldo') {
                    const operacao = linha[colunasTabela['Operação']];
                    if (linha[colunasTabela['Procedimento']] !== 'Movimentação entre Contas') {
                        categoria = operacao === 'Crédito'
                            ? linha[colunasTabela['Categoria - Crédito']]
                            : linha[colunasTabela['Categoria - Débito']];
                        tipoCategoria = operacao === 'Crédito' ? 'receita' : 'despesa';
                    }
                } else {
                    if (linha[colunasTabela['Procedimento']] === 'Compra') {
                        categoria = linha[colunasTabela['Categoria']];
                        tipoCategoria = 'despesa';
                    } else {
                        categoria = linha[colunasTabela['Categoria']];
                        tipoCategoria = 'receita';
                    }
                }

                if ((mesAnoUltimoMes_3523 || lancamentocartao_3233) && tabela !== 'Transações com Saldo') {
                    let valor;
                    if (linha[colunasTabela['Parcelamento']] === 'Sim') {
                        const idtransacao_2432 = linha[colunasTabela['ID']];
                        const mesdelancamento_2431 = mesAnoUltimoMes_3523 || lancamentocartao_3233;
                        valor = obterValorBaseParcelamento_2412(idtransacao_2432, mesdelancamento_2431);
                    } else {
                        valor = parseFloat(linha[colunasTabela['Valor Individual/Parcela']]) < 0 ? -parseFloat(linha[colunasTabela['Valor Individual/Parcela']]) : parseFloat(linha[colunasTabela['Valor Individual/Parcela']]);
                    }
                    if (categoria) {
                        categoria = categoria.replace(/^Receita - /, '').replace(/^Despesa - /, '');
                        const chave = `${categoria}|${tipoCategoria}`;
                        totais.set(chave, (totais.get(chave) || 0) + valor);
                    }
                } else {
                    const valor = parseFloat(linha[colunasTabela['Sub-Total']]);
                    if (categoria) {
                        categoria = categoria.replace(/^Receita - /, '').replace(/^Despesa - /, '');
                        const chave = `${categoria}|${tipoCategoria}`;
                        totais.set(chave, (totais.get(chave) || 0) + valor);
                    }
                }


            });
            return totais;
        };

        if (imprimir_3857 === false) {
            html_2951 += `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
        <title>Relatório de Transações</title>
        <meta charset="UTF-8">
        <style type="text/css">
          @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap');
          body {
            padding: 0px;
            margin: 0px;
            font-family: 'Roboto Condensed'!important;
          }
        </style>
        </head>
        <body>
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; table-layout: fixed;">
            <tr>
              <td>
      `;
        } else {
            html_2951 += `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
        <title>Relatório de Transações</title>
        <link rel="icon" type="image/png" href="https://i.ibb.co/MMdSHDp/financa.png">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
        <style>
          body {
            padding: 15px 150px;
            color: white;
            background-color: #121212
          }
  
          a:visited {
            color: #96BAFF !important;
            text-decoration: none !important;
          }
  
          a:hover {
            color: #96BAFF !important;
            text-decoration: underline!important;
          }
  
          a:link {
            color: #96BAFF !important;
            text-decoration: none;
          }
  
          a:focus {
            outline: 2px solid #90CAF9 !important;
            background-color: #333333 !important;
          }
  
          .alternada {
            background-color: #1a1a1a!important
          }
  
          .cabecalho {
            background-color: white!important
            color: black!important
          }
  
          .normal {
            background-color: #2b2b2b!important
          }
  
          .layout {
            display: none!important
          }
  
          .hr-espac {
            color: #fff!important;
            background-color: #fff!important
          }
  
          @media (max-width: 768px) {
            body {
              padding: 15px 15px;
            }
          }
  
          @media (min-width: 769px) and (max-width: 1024px) {
            body {
              padding: 15px 35px;
            }
          }
  
          @media (min-width: 1025px) {
            body {
              padding: 15px 150px;
            }
          }
  
          @media (orientation: landscape) {
            body {
              padding: 15px 25px;
            }
          }
  
          @media (orientation: portrait) {
            body {
              padding: 15px 15px;
            }
          }
  
          @media print {
            body {
              padding: 0px;
              color: black;
              background-color: white
            }
  
            .impressao-gemini {
              margin: 0 auto;
              display: block;
              text-align: center;
            }
  
            .imagem-impressao {
              filter: grayscale(1);
            }
  
            .layout {
              display: revert!important
            }
  
            a:visited {
              color: black!important;
              text-decoration: none!important;
            }
  
            a:link {
              color: black!important;
              text-decoration: none!important;
            }
  
            .alternada {
              background-color: #f3f3f3!important
            }
  
            .cabecalho {
              background-color: black!important;
              color: white!important
            }
  
            .normal {
              background-color: #fff!important
            }
  
            .hr-espac {
              color: black!important;
              background-color: black!important
            }
  
            .impressao {
              text-align: center;
            }
  
            .hidden {
              display: none
            }
  
            #data-hora {
              display: block!important;
            }
          }
  
        </style>
        </head>
        <body style="font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">
      `;
        }

        const dataFormatadaparaapr_7249 = `${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()} às ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;

        if (dados_3805.length > 0) {
            if (imprimir_3857 === false) {
                let filtroVisualizacao = ``;

                if (tipo_2956) {
                    filtroVisualizacao += `<b>${tipo_2956.toUpperCase()}</b>`;
                }

                if (tempo_8213 && tempo_8213 !== null && tempo_8213 !== undefined && !datainicial_9531 && !datafinal_4692) {
                    filtroVisualizacao += tempo_8213.toUpperCase() === 'TUDO'
                        ? ' | <b>ATÉ HOJE</b> '
                        : ' | <b>NOS ÚLTIMOS ' + tempo_8213.toUpperCase() + '</b>';
                } else if (datainicial_9531 && datafinal_4692) {
                    const dataInicialFormatada_1846 = datainicial_9531.includes('T')
                        ? datainicial_9531.split('T')[0].split('-').reverse().join('/')
                        : datainicial_9531;
                    const dataFinalFormatada_4938 = datafinal_4692.includes('T')
                        ? datafinal_4692.split('T')[0].split('-').reverse().join('/')
                        : datafinal_4692;
                    tempoTexto_8531 = `${dataInicialFormatada_1846} A ${dataFinalFormatada_4938}`;
                    filtroVisualizacao += ` | <b>${tempoTexto_8531}</b>`;
                }

                if (operador_1853) {
                    filtroVisualizacao += ` | <b>POR ${operador_1853.toUpperCase()}</b>`;
                } else {
                    filtroVisualizacao += "";
                }

                filtroVisualizacao += (idRecorrencia_2759
                    ? ` | <b>COM ID DA RECORRÊNCIA ${idRecorrencia_2759.toUpperCase()}</b>`
                    : ""
                );

                filtroVisualizacao += (categoria_4108
                    ? ` | <b>CATEGORIA ${categoria_4108.toUpperCase()}</b>`
                    : ""
                );

                filtroVisualizacao += (status_6925
                    ? ` | <b>STATUS ${status_6925.toUpperCase()}</b>`
                    : ""
                );
                filtroVisualizacao += (descricao_6485
                    ? ` | <b>COM DESCRIÇÃO "${descricao_6485.toUpperCase()}"</b>`
                    : ""
                );
                filtroVisualizacao += (relevanteImpostoRenda_5831?.toLowerCase() === "sim"
                    ? " | <b>COM RELEVÂNCIA PARA IMPOSTO DE RENDA</b>"
                    : ""
                );
                filtroVisualizacao += (procedimentoCartao_8964 && !(tipo_2956.toLowerCase().includes('saldo'))
                    ? ` | <b>COM PROCEDIMENTO ${procedimentoCartao_8964.toUpperCase()}</b>`
                    : ""
                );

                filtroVisualizacao += (procedimentoCartao_8964 && (tipo_2956.toLowerCase().includes('saldo'))
                    ? ` | <b>COM PROCEDIMENTO (NO CARTÃO DE CRÉDITO) ${procedimentoCartao_8964.toUpperCase()}</b>`
                    : ""
                );

                filtroVisualizacao += (cartaoCredito_7329 && tipo_2956?.toLowerCase() !== "saldo"
                    ? ` | <b>EM ${cartaoCredito_7329.toUpperCase()}</b>`
                    : ""
                );

                if (lancamentocartao_3233?.length) {
                    filtroVisualizacao += lancamentocartao_3233.includes(',') ? ` | <b>COM LANÇAMENTOS EM ${lancamentocartao_3233.toUpperCase().replace(/,([^,]*)$/, ' e$1')}</b>` : ` | <b>COM LANÇAMENTO EM ${lancamentocartao_3233.toUpperCase().replace(/,([^,]*)$/, ' e$1')}</b>`;
                }

                filtroVisualizacao += (qtdeparcelas_2143 && tipo_2956.toLowerCase().includes('cartão de crédito')
                    ? ` | <b>COM ${qtdeparcelas_2143} PARCELAS</b>`
                    : ""
                );

                filtroVisualizacao += (parcelas_2321 && tipo_2956.toLowerCase().includes('cartão de crédito')
                    ? ` | <b>COM PARCELAMENTO</b>`
                    : ""
                );

                filtroVisualizacao += (contaFinanceira_3918 && tipo_2956?.toLowerCase() !== "cartão de crédito"
                    ? ` | <b>${contaFinanceira_3918.toUpperCase()}</b>`
                    : ''
                );

                filtroVisualizacao += (procedimentoSaldo_5147 && !(tipo_2956.toLowerCase().includes('cartão de crédito'))
                    ? ` | <b>COM PROCEDIMENTO ${procedimentoSaldo_5147.toUpperCase()}</b>`
                    : ""
                );
                filtroVisualizacao += (procedimentoSaldo_5147 && (tipo_2956.toLowerCase().includes('cartão de crédito'))
                    ? ` | <b>COM PROCEDIMENTO (EM SALDO) ${procedimentoSaldo_5147.toUpperCase()}</b>`
                    : ""
                );
                filtroVisualizacao += (operacaoSaldo_7294 && !(tipo_2956.toLowerCase().includes('cartão de crédito'))
                    ? ` | <b>COM OPERAÇÃO SENDO ${operacaoSaldo_7294.toUpperCase()}</b>`
                    : ""
                );

                filtroVisualizacao += (operacaoSaldo_7294 && (tipo_2956.toLowerCase().includes('cartão de crédito'))
                    ? ` | <b>COM OPERAÇÃO (EM SALDO) SENDO ${operacaoSaldo_7294.toUpperCase()}</b>`
                    : ""
                );

                html_2951 += `
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
          <p style="font-size: 0.75rem; margin: 0; display: inline-block; vertical-align: middle; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">
            Segue, abaixo, o Relatório de Transações gerado em ${dataFormatadaparaapr_7249} por meio do aplicativo
            <b>Controle de Transações</b>, com os seguintes filtros: ${filtroVisualizacao}.
          </p>
          <div style="display: flex; align-items: center;">
            <span style="display:inline-block; vertical-align:middle; margin:0 10px; background-color:black; width:3px; height:30px;border-radius: 10px;"></span>
            <a href="#$#$#SUBSTITUIRAQUIURLDERED#$#$#"
              style="background-color:black; color:white; padding:5px 10px; border:none; text-decoration:none; font-size: 0.75rem; display:inline-block;text-align: center;border-radius: 10px; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">
              VISUALIZAÇÃO WEB
            </a>
          </div>
        </div>`;
            } else {
                html_2951 += `<h1 style="font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; font-size: 1.75rem; margin: 0 0 0 0;font-weight: 600;text-align: center;">RELATÓRIO DE TRANSAÇÕES</h1>`;
                html_2951 += `<hr class="hr-espac" style="width: 100%; color: #000; border-radius: 40px; background-color: #000; height: 2px; border: 0px;margin: 12.5px auto;">`;

                let filtro_4826 = ``;

                if (tipo_2956) {
                    filtro_4826 += `<b>${tipo_2956.toUpperCase()}</b>`;
                }

                if (tempo_8213 && tempo_8213 !== null && tempo_8213 !== undefined && !datainicial_9531 && !datafinal_4692) {
                    filtro_4826 += tempo_8213.toUpperCase() === 'TUDO'
                        ? ''
                        : ' | <b>NOS ÚLTIMOS ' + tempo_8213.toUpperCase() + '</b>';
                } else if (datainicial_9531 && datafinal_4692) {
                    const dataInicialFormatada_1846 = datainicial_9531.includes('T')
                        ? datainicial_9531.split('T')[0].split('-').reverse().join('/')
                        : datainicial_9531;
                    const dataFinalFormatada_4938 = datafinal_4692.includes('T')
                        ? datafinal_4692.split('T')[0].split('-').reverse().join('/')
                        : datafinal_4692;
                    tempoTexto_8531 = `${dataInicialFormatada_1846} A ${dataFinalFormatada_4938}`;
                    filtro_4826 += ` | <b>${tempoTexto_8531}</b>`;
                }

                if (operador_1853) {
                    filtro_4826 += ` | <b>POR ${operador_1853.toUpperCase()}</b>`;
                } else {
                    filtro_4826 += ``;
                }
                if (filtros1214 !== 'Não mostrar') {
                    filtro_4826 += (idRecorrencia_2759
                        ? ` | <b>COM ID DA RECORRÊNCIA ${idRecorrencia_2759.toUpperCase()}</b>`
                        : ""
                    );
                }
                filtro_4826 += (categoria_4108
                    ? ` | <b>CATEGORIA ${categoria_4108.toUpperCase()}</b>`
                    : ""
                );

                if (filtros1214 !== 'Não mostrar') {
                    filtro_4826 += (status_6925
                        ? ` | <b>STATUS ${status_6925.toUpperCase()}</b>`
                        : ""
                    );

                    filtro_4826 += (descricao_6485
                        ? ` | <b>COM DESCRIÇÃO "${descricao_6485.toUpperCase()}"</b>`
                        : ""
                    );

                    filtro_4826 += (relevanteImpostoRenda_5831?.toLowerCase() === "sim"
                        ? " | <b>COM RELEVÂNCIA PARA IMPOSTO DE RENDA</b>"
                        : ""
                    );

                    filtro_4826 += (procedimentoCartao_8964 && !(tipo_2956.toLowerCase().includes('saldo'))
                        ? ` | <b>COM PROCEDIMENTO ${procedimentoCartao_8964.toUpperCase()}</b>`
                        : ""
                    );

                    filtro_4826 += (procedimentoCartao_8964 && (tipo_2956.toLowerCase().includes('saldo'))
                        ? ` | <b>COM PROCEDIMENTO (NO CARTÃO DE CRÉDITO) ${procedimentoCartao_8964.toUpperCase()}</b>`
                        : ""
                    );
                }
                filtro_4826 += (cartaoCredito_7329 && tipo_2956?.toLowerCase() !== "saldo"
                    ? ` | <b>EM ${cartaoCredito_7329.toUpperCase()}</b>`
                    : ""
                );

                if (lancamentocartao_3233?.length) {
                    filtro_4826 += lancamentocartao_3233.includes(',') ? ` | <b>COM LANÇAMENTOS EM ${lancamentocartao_3233.toUpperCase().replace(/,([^,]*)$/, ' e$1')}</b>` : ` | <b>COM LANÇAMENTO EM ${lancamentocartao_3233.toUpperCase().replace(/,([^,]*)$/, ' e$1')}</b>`;
                }
                filtro_4826 += (qtdeparcelas_2143 && tipo_2956.toLowerCase().includes('cartão de crédito')
                    ? ` | <b>COM ${qtdeparcelas_2143} PARCELAS</b>`
                    : ""
                );

                filtro_4826 += (parcelas_2321 && tipo_2956.toLowerCase().includes('cartão de crédito')
                    ? ` | <b>COM PARCELAMENTO</b>`
                    : ""
                );
                if (filtros1214 !== 'Não mostrar') {
                    filtro_4826 += (contaFinanceira_3918 && tipo_2956?.toLowerCase() !== "cartão de crédito"
                        ? ` | <b>${contaFinanceira_3918.toUpperCase()}</b>`
                        : ''
                    );

                    filtro_4826 += (procedimentoSaldo_5147 && !(tipo_2956.toLowerCase().includes('cartão de crédito'))
                        ? ` | <b>COM PROCEDIMENTO ${procedimentoSaldo_5147.toUpperCase()}</b>`
                        : ""
                    );

                    filtro_4826 += (procedimentoSaldo_5147 && (tipo_2956.toLowerCase().includes('cartão de crédito'))
                        ? ` | <b>COM PROCEDIMENTO (EM SALDO) ${procedimentoSaldo_5147.toUpperCase()}</b>`
                        : ""
                    );

                    filtro_4826 += (operacaoSaldo_7294 && !(tipo_2956.toLowerCase().includes('cartão de crédito'))
                        ? ` | <b>COM OPERAÇÃO SENDO ${operacaoSaldo_7294.toUpperCase()}</b>`
                        : ""
                    );

                    filtro_4826 += (operacaoSaldo_7294 && (tipo_2956.toLowerCase().includes('cartão de crédito'))
                        ? ` | <b>COM OPERAÇÃO (EM SALDO) SENDO ${operacaoSaldo_7294.toUpperCase()}</b>`
                        : ""
                    );
                }

                html_2951 += `<p style="font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; font-size: 0.75rem; margin: 0 0 20px 0;font-weight: 300;text-align: center;text-wrap: balance;line-height: 1.2rem;">${filtro_4826.toUpperCase()}</p>`;
            }
            let mesesProcessados_9517 = {};
            const totaisPorCategoria = new Map();

            dados_3805.forEach((linha_9248, index_6381) => {
                const tabela_8402 = getTabelaFromTipo_4183(linha_9248, tipo_2956);
                const colunasTabela_5719 = colunas_1495[tabela_8402];
                const dataEfetivacao_3927 = linha_9248[colunasTabela_5719['Data de Efetivação']];
                const mes_8265 = new Date(dataEfetivacao_3927).getMonth();
                const ano_4819 = new Date(dataEfetivacao_3927).getFullYear();
                const mesAno_5930 = `${mes_8265 + 1}/${ano_4819}`;

                if (!mesesProcessados_9517[mesAno_5930]) {
                    if (Object.keys(mesesProcessados_9517).length > 0) {
                        html_2951 += `
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          <br>`;
                    }

                    let somaValores_4728 = 0;
                    dados_3805.forEach((linhaInterna_6839) => {
                        const tabelaInterna_2957 = getTabelaFromTipo_4183(linhaInterna_6839, tipo_2956);
                        const colunasTabelaInterna_8416 = colunas_1495[tabelaInterna_2957];
                        const dataEfetivacaoInterna_1593 = linhaInterna_6839[colunasTabelaInterna_8416['Data de Efetivação']];
                        const mesInterno_7305 = new Date(dataEfetivacaoInterna_1593).getMonth();
                        const anoInterno_3842 = new Date(dataEfetivacaoInterna_1593).getFullYear();
                        const mesAnoInterno_9168 = `${mesInterno_7305 + 1}/${anoInterno_3842}`;

                        if (mesAnoInterno_9168 === mesAno_5930) {
                            if (tabelaInterna_2957 === 'Transações com Cartão de Crédito') {
                                const valor_6482 = mesAnoUltimoMes_3523 || lancamentocartao_3233 ? -parseFloat(linhaInterna_6839[colunasTabelaInterna_8416['Valor Individual/Parcela']]) < 0 ? -parseFloat(linhaInterna_6839[colunasTabelaInterna_8416['Valor Individual/Parcela']]) : parseFloat(linhaInterna_6839[colunasTabelaInterna_8416['Valor Individual/Parcela']]) : parseFloat(linhaInterna_6839[colunasTabelaInterna_8416['Sub-Total']]);
                                if (!isNaN(valor_6482)) {
                                    if (linhaInterna_6839[colunasTabelaInterna_8416['Procedimento']] === 'Compra') {
                                        somaValores_4728 -= valor_6482;
                                    } else {
                                        somaValores_4728 += valor_6482;
                                    }
                                }
                            } else {
                                if (mesAnoInterno_9168 === mesAno_5930) {
                                    const valor_6482 = parseFloat(linhaInterna_6839[colunasTabelaInterna_8416['Sub-Total']]);
                                    if (!isNaN(valor_6482)) {
                                        if (tabelaInterna_2957 === 'Transações com Saldo' && linhaInterna_6839[colunasTabelaInterna_8416['Operação']] === 'Débito' && linhaInterna_6839[colunasTabelaInterna_8416['Procedimento']] !== 'Movimentação entre Contas') {
                                            somaValores_4728 -= valor_6482;
                                        } else if (tabelaInterna_2957 === 'Transações com Saldo' && linhaInterna_6839[colunasTabelaInterna_8416['Procedimento']] === 'Movimentação entre Contas') {
                                            somaValores_4728 -= valor_6482;
                                            somaValores_4728 += valor_6482;
                                        } else {
                                            somaValores_4728 += valor_6482;
                                        }
                                    }
                                }
                            }
                        }
                    });

                    const nomeMes_2958 = new Date(dataEfetivacao_3927).toLocaleString('pt-BR', { month: 'long' }).toUpperCase();
                    const valorSomadoFormatado_8364 = formatarValor_7529(somaValores_4728);
                    html_2951 += `<p style="font-size: 1rem; font-weight: bold; text-transform: uppercase; margin: 16px 0 8px 0; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">${nomeMes_2958}/${ano_4819}</p>`;
                    html_2951 += `
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; table-layout: fixed;">
                <tr>
                  <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="8" style="border-collapse: collapse; background-color: #000; color: white;">
                      <tr class="cabecalho">
                        <th style="text-align: left; width: 15%; font-size: 0.75rem; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">DATA/STATUS</th>
                        <th style="text-align: left; width: 47%; font-size: 0.75rem; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">DESCRIÇÃO</th>
                        <th style="text-align: left; width: 25.5%; font-size: 0.75rem; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">${nomeColuna_1242}</th>
                        <th style="text-align: right; width: 12.5%; font-size: 0.75rem; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">${filtros1214 !== 'Mostrar' || tipo_2956 === 'Cartão de Crédito' || (tipo_2956 = 'Cartão de Crédito' && (tempo_8213 === 'Último Mês' || tempo_8213 === 'Antes e Durante Último Mês')) ? valorSomadoFormatado_8364.replace('-', '') : valorSomadoFormatado_8364}</th>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="8" style="border-collapse: collapse;">
            `;
                    mesesProcessados_9517[mesAno_5930] = true;
                }

                let categoria_5294;
                let tipoCategoria_9361;

                if (tabela_8402 === 'Transações com Saldo') {
                    const operacao_7294 = linha_9248[colunasTabela_5719['Operação']];
                    if (linha_9248[colunasTabela_5719['Procedimento']] !== 'Movimentação entre Contas') {
                        categoria_5294 = operacao_7294 === 'Crédito'
                            ? linha_9248[colunasTabela_5719['Categoria - Crédito']]
                            : linha_9248[colunasTabela_5719['Categoria - Débito']];
                        tipoCategoria_9361 = operacao_7294 === 'Crédito' ? 'receita' : 'despesa';
                    }
                } else {
                    if (linha_9248[colunasTabela_5719['Procedimento']] === 'Compra') {
                        categoria_5294 = linha_9248[colunasTabela_5719['Categoria']];
                        tipoCategoria_9361 = 'despesa';
                    }
                    else {
                        categoria_5294 = linha_9248[colunasTabela_5719['Categoria']];
                        tipoCategoria_9361 = 'receita';
                    }
                }

                if (categoria_5294) {
                    categoria_5294 = categoria_5294.replace(/^Receita - /, '').replace(/^Despesa - /, '');

                    const chaveCategoriaTipo = `${categoria_5294}|${tipoCategoria_9361}`;

                    if (tabela_8402 === 'Transações com Saldo') {
                        const valor_6482 = parseFloat(linha_9248[colunasTabela_5719['Sub-Total']]);
                        if (categoria_5294 && !isNaN(valor_6482)) {
                            if (totaisPorCategoria.has(chaveCategoriaTipo)) {
                                const valorExistente = totaisPorCategoria.get(chaveCategoriaTipo);
                                totaisPorCategoria.set(chaveCategoriaTipo, valorExistente + (tipoCategoria_9361 === 'despesa' ? valor_6482 : valor_6482));
                            } else {
                                totaisPorCategoria.set(chaveCategoriaTipo, tipoCategoria_9361 === 'despesa' ? valor_6482 : valor_6482);
                            }
                        }
                    } else {
                        const valor_6482 = mesAnoUltimoMes_3523 || lancamentocartao_3233 ? -parseFloat(linha_9248[colunasTabela_5719['Valor Individual/Parcela']]) < 0 ? -parseFloat(linha_9248[colunasTabela_5719['Valor Individual/Parcela']]) : parseFloat(linha_9248[colunasTabela_5719['Valor Individual/Parcela']]) : parseFloat(linha_9248[colunasTabela_5719['Sub-Total']]);
                        if (categoria_5294 && !isNaN(valor_6482)) {
                            if (totaisPorCategoria.has(chaveCategoriaTipo)) {
                                const valorExistente = totaisPorCategoria.get(chaveCategoriaTipo);
                                totaisPorCategoria.set(chaveCategoriaTipo, valorExistente + (tipoCategoria_9361 === 'despesa' ? valor_6482 : valor_6482));
                            } else {
                                totaisPorCategoria.set(chaveCategoriaTipo, tipoCategoria_9361 === 'despesa' ? valor_6482 : valor_6482);
                            }
                        }
                    }

                }

                html_2951 += gerarLinhaHTML_9427(linha_9248, colunasTabela_5719, tabela_8402, index_6381, operador_1853, tipo_2956, condicaodegeracao_6834, fileCache_7426, filtros1214);
            });

            html_2951 += `
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;



            const receitas_4578 = new Map();
            const despesas_9274 = new Map();

            const totais_2342 = calcularTotaisPorCategoria(dados_3805, colunas_1495);

            totais_2342.forEach((valor, chaveComposta) => {
                const [categoria, tipo] = chaveComposta.split('|');
                if (tipo === 'receita') {
                    receitas_4578.set(categoria, valor);
                } else {
                    despesas_9274.set(categoria, valor);
                }
            });

            if (despesas_9274.size > 0 || receitas_4578.size > 0) {
                html_2951 += `<br><p class="impressao" style="font-size: 1rem; font-weight: bold; text-transform: uppercase; margin: 23px 0 8px 0; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">RESUMO DAS TRANSAÇÕES</p>`;

                if (receitas_4578.size > 0) html_2951 += processarReceitas_8352(receitas_4578);
                if (despesas_9274.size > 0) html_2951 += processarDespesas_7491(despesas_9274);
                html_2951 += processarOperadores_2332(dados_3805, colunas_1495, tipo_2956, mesAnoUltimoMes_3523, lancamentocartao_3233);
            }

            html_gemini_1242 += html_2951

            if (insights_2145 !== "Não") {
                const insightgerado_9111 = !insightgerado_9250 ? processarGemini_5312(html_gemini_1242) : insightgerado_9250

                html_2951 += insightgerado_9111

                if (imprimir_3857 === false) {
                    html_2951 = html_2951.replace('#$#$#SUBSTITUIRAQUIURLDERED#$#$#', encurtarUrlBase64_4829(`${contaFinanceira_3918 ? '&contaFinanceira=' + contaFinanceira_3918 : ''}${cartaoCredito_7329 ? '&cartaoCredito=' + cartaoCredito_7329 : ''}${lancamentocartao_3233 ? '&lancamentocartao=' + lancamentocartao_3233 : ''}${descricao_6485 ? '&descricao=' + descricao_6485 : ''}${procedimentoSaldo_5147 ? '&procedimentoSaldo=' + procedimentoSaldo_5147 : ''}${operacaoSaldo_7294 ? '&operacaoSaldo=' + operacaoSaldo_7294 : ''}${datainicial_9531 ? '&datainicial=' + datainicial_9531 : ''}${datafinal_4692 ? '&datafinal=' + datafinal_4692 : ''}${tipogerador_2413 ? '&tipo=' + tipogerador_2413 : ''}${tempo_8213 ? '&tempo=' + tempo_8213 : ''}${operador_1853 ? '&operador=' + operador_1853 : ''}${procedimentoCartao_8964 ? '&procedimentoCartao=' + procedimentoCartao_8964 : ''}${categoria_4108 ? '&categoria=' + categoria_4108 : ''}${idRecorrencia_2759 ? '&idRecorrencia=' + idRecorrencia_2759 : ''}${relevanteImpostoRenda_5831 ? '&relevanteImpostoRenda=' + relevanteImpostoRenda_5831 : ''}${status_6925 ? '&status=' + status_6925 : ''}${qtdeparcelas_2143 ? '&qtdeparcelas=' + qtdeparcelas_2143 : ''}${parcelas_2321 ? '&parcelamento=' + parcelas_2321 : ''}${gerarInsights_1344 ? '&recomendacoes=' + gerarInsights_1344 : ''}${insightgerado_9111 ? '&insightgerado=' + insightgerado_9111 : ''}${'&senha=MSRmsr2005@'}`))
                }
            }

        } else {
            let filtroVisualizacao = ``;

            if (tipo_2956) {
                filtroVisualizacao += `<b>${tipo_2956.toUpperCase()}</b>`;
            }

            if (tempo_8213 && tempo_8213 !== null && tempo_8213 !== undefined && !datainicial_9531 && !datafinal_4692) {
                filtroVisualizacao += tempo_8213.toUpperCase() === 'TUDO'
                    ? ''
                    : ' | <b>NOS ÚLTIMOS ' + tempo_8213.toUpperCase() + '</b>';
            } else if (datainicial_9531 && datafinal_4692) {
                const dataInicialFormatada_1846 = datainicial_9531.includes('T')
                    ? datainicial_9531.split('T')[0].split('-').reverse().join('/')
                    : datainicial_9531;
                const dataFinalFormatada_4938 = datafinal_4692.includes('T')
                    ? datafinal_4692.split('T')[0].split('-').reverse().join('/')
                    : datafinal_4692;
                tempoTexto_8531 = `${dataInicialFormatada_1846} A ${dataFinalFormatada_4938}`;
                filtroVisualizacao += ` | <b>${tempoTexto_8531}</b>`;
            }

            if (operador_1853) {
                filtroVisualizacao += ` | <b>POR ${operador_1853.toUpperCase()}</b>`;
            } else {
                filtroVisualizacao += '';
            }
            filtroVisualizacao += (idRecorrencia_2759
                ? ` | <b>COM ID DA RECORRÊNCIA ${idRecorrencia_2759.toUpperCase()}</b>`
                : ""
            );

            filtroVisualizacao += (categoria_4108
                ? ` | <b>CATEGORIA ${categoria_4108.toUpperCase()}</b>`
                : ""
            );

            filtroVisualizacao += (status_6925
                ? ` | <b>STATUS ${status_6925.toUpperCase()}</b>`
                : ""
            );

            filtroVisualizacao += (descricao_6485
                ? ` | <b>COM DESCRIÇÃO "${descricao_6485.toUpperCase()}"</b>`
                : ""
            );

            filtroVisualizacao += (relevanteImpostoRenda_5831?.toLowerCase() === "sim"
                ? " | <b>COM RELEVÂNCIA PARA IMPOSTO DE RENDA</b>"
                : ""
            );

            filtroVisualizacao += (procedimentoCartao_8964 && !(tipo_2956.toLowerCase().includes('saldo'))
                ? ` | <b>COM PROCEDIMENTO ${procedimentoCartao_8964.toUpperCase()}</b>`
                : ""
            );

            filtroVisualizacao += (procedimentoCartao_8964 && (tipo_2956.toLowerCase().includes('saldo'))
                ? ` | <b>COM PROCEDIMENTO (NO CARTÃO DE CRÉDITO) ${procedimentoCartao_8964.toUpperCase()}</b>`
                : ""
            );

            filtroVisualizacao += (cartaoCredito_7329 && tipo_2956?.toLowerCase() !== "saldo"
                ? ` | <b>EM ${cartaoCredito_7329.toUpperCase()}</b>`
                : ""
            );
            if (lancamentocartao_3233?.length) {
                filtroVisualizacao += lancamentocartao_3233.includes(',') ? ` | <b>COM LANÇAMENTOS EM ${lancamentocartao_3233.toUpperCase().replace(/,([^,]*)$/, ' e$1')}</b>` : ` | <b>COM LANÇAMENTO EM ${lancamentocartao_3233.toUpperCase().replace(/,([^,]*)$/, ' e$1')}</b>`;
            }

            filtroVisualizacao += (qtdeparcelas_2143 && tipo_2956.toLowerCase().includes('cartão de crédito')
                ? ` | <b>COM ${qtdeparcelas_2143} PARCELAS</b>`
                : ""
            );
            filtroVisualizacao += (parcelas_2321 && tipo_2956.toLowerCase().includes('cartão de crédito')
                ? ` | <b>COM PARCELAMENTO</b>`
                : ""
            );

            filtroVisualizacao += (contaFinanceira_3918 && tipo_2956?.toLowerCase() !== "cartão de crédito"
                ? ` | <b>${contaFinanceira_3918.toUpperCase()}</b>`
                : ''
            );

            filtroVisualizacao += (procedimentoSaldo_5147 && !(tipo_2956.toLowerCase().includes('cartão de crédito'))
                ? ` | <b>COM PROCEDIMENTO ${procedimentoSaldo_5147.toUpperCase()}</b>`
                : ""
            );

            filtroVisualizacao += (procedimentoSaldo_5147 && (tipo_2956.toLowerCase().includes('cartão de crédito'))
                ? ` | <b>COM PROCEDIMENTO (EM SALDO) ${procedimentoSaldo_5147.toUpperCase()}</b>`
                : ""
            );

            filtroVisualizacao += (operacaoSaldo_7294 && !(tipo_2956.toLowerCase().includes('cartão de crédito'))
                ? ` | <b>COM OPERAÇÃO SENDO ${operacaoSaldo_7294.toUpperCase()}</b>`
                : ""
            );

            filtroVisualizacao += (operacaoSaldo_7294 && (tipo_2956.toLowerCase().includes('cartão de crédito'))
                ? ` | <b>COM OPERAÇÃO (EM SALDO) SENDO ${operacaoSaldo_7294.toUpperCase()}</b>`
                : ""
            );

            html_2951 += `
          <p style="${imprimir_3857 === false ? 'text-align: left' : 'text-align: center'}; font-size: 0.75rem; margin: 0 0 10px 0">
            O Relatório de Transações gerado em ${dataFormatadaparaapr_7249} por meio do aplicativo <b>Controle de Transações</b>, não retornou resultados.<br><br><b style="font-size: 0.85rem;">FILTROS APLICADOS:</b><br>${filtroVisualizacao}
          </p>`;
        }

        html_2951 += `<p id="data-hora" style="display: none; text-align: center; font-size: 0.75rem; margin: 0px; margin-top: 23px; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;"><b>GERADO EM ${dataFormatadaparaapr_7249.toUpperCase()}</b></p>`;

        html_2951 += `
      </body>
      </html>
      `;
        return html_2951;

    } else {
        let html_2951 = ``;

        const calcularTotaisPorCategoria = (dados, colunas) => {
            const totais = new Map();
            dados.forEach(linha => {
                const tabela = getTabelaFromTipo_4183(linha, tipo_2956);
                const colunasTabela = colunas[tabela];

                let categoria, tipoCategoria;
                if (tabela === 'Transações com Saldo') {
                    const operacao = linha[colunasTabela['Operação']];
                    if (linha[colunasTabela['Procedimento']] !== 'Movimentação entre Contas') {
                        categoria = operacao === 'Crédito'
                            ? linha[colunasTabela['Categoria - Crédito']]
                            : linha[colunasTabela['Categoria - Débito']];
                        tipoCategoria = operacao === 'Crédito' ? 'receita' : 'despesa';
                    }
                } else {
                    if (linha[colunasTabela['Procedimento']] === 'Compra') {
                        categoria = linha[colunasTabela['Categoria']];
                        tipoCategoria = 'despesa';
                    } else {
                        categoria = linha[colunasTabela['Categoria']];
                        tipoCategoria = 'receita';
                    }
                }

                if ((mesAnoUltimoMes_3523 || lancamentocartao_3233) && tabela !== 'Transações com Saldo') {
                    let valor;
                    if (linha[colunasTabela['Parcelamento']] === 'Sim') {
                        const idtransacao_2432 = linha[colunasTabela['ID']];
                        const mesdelancamento_2431 = mesAnoUltimoMes_3523 || lancamentocartao_3233;
                        valor = obterValorBaseParcelamento_2412(idtransacao_2432, mesdelancamento_2431);
                    } else {
                        valor = parseFloat(linha[colunasTabela['Valor Individual/Parcela']]) < 0 ? -parseFloat(linha[colunasTabela['Valor Individual/Parcela']]) : parseFloat(linha[colunasTabela['Valor Individual/Parcela']]);
                    }
                    if (categoria) {
                        categoria = categoria.replace(/^Receita - /, '').replace(/^Despesa - /, '');
                        const chave = `${categoria}|${tipoCategoria}`;
                        totais.set(chave, (totais.get(chave) || 0) + valor);
                    }
                } else {
                    const valor = parseFloat(linha[colunasTabela['Sub-Total']]);
                    if (categoria) {
                        categoria = categoria.replace(/^Receita - /, '').replace(/^Despesa - /, '');
                        const chave = `${categoria}|${tipoCategoria}`;
                        totais.set(chave, (totais.get(chave) || 0) + valor);
                    }
                }


            });
            return totais;
        };

        if (dados_3805.length > 0) {
            let mesesProcessados_9517 = {};
            dados_3805.forEach((linha_9248, index_6381) => {
                const tabela_8402 = getTabelaFromTipo_4183(linha_9248, tipo_2956);
                const colunasTabela_5719 = colunas_1495[tabela_8402];
                const dataEfetivacao_3927 = linha_9248[colunasTabela_5719['Data de Efetivação']];
                const mes_8265 = new Date(dataEfetivacao_3927).getMonth();
                const ano_4819 = new Date(dataEfetivacao_3927).getFullYear();
                const mesAno_5930 = `${mes_8265 + 1}/${ano_4819}`;

                if (!mesesProcessados_9517[mesAno_5930]) {
                    if (Object.keys(mesesProcessados_9517).length > 0) {
                        html_2951 += `
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          <br>`;
                    }

                    let somaValores_4728 = 0;
                    dados_3805.forEach((linhaInterna_6839) => {
                        const tabelaInterna_2957 = getTabelaFromTipo_4183(linhaInterna_6839, tipo_2956);
                        const colunasTabelaInterna_8416 = colunas_1495[tabelaInterna_2957];
                        const dataEfetivacaoInterna_1593 = linhaInterna_6839[colunasTabelaInterna_8416['Data de Efetivação']];
                        const mesInterno_7305 = new Date(dataEfetivacaoInterna_1593).getMonth();
                        const anoInterno_3842 = new Date(dataEfetivacaoInterna_1593).getFullYear();
                        const mesAnoInterno_9168 = `${mesInterno_7305 + 1}/${anoInterno_3842}`;

                        if (mesAnoInterno_9168 === mesAno_5930) {
                            if (tabelaInterna_2957 === 'Transações com Cartão de Crédito') {
                                const valor_6482 = mesAnoUltimoMes_3523 || lancamentocartao_3233 ? -parseFloat(linhaInterna_6839[colunasTabelaInterna_8416['Valor Individual/Parcela']]) < 0 ? -parseFloat(linhaInterna_6839[colunasTabelaInterna_8416['Valor Individual/Parcela']]) : parseFloat(linhaInterna_6839[colunasTabelaInterna_8416['Valor Individual/Parcela']]) : parseFloat(linhaInterna_6839[colunasTabelaInterna_8416['Sub-Total']]);
                                if (!isNaN(valor_6482)) {
                                    if (linhaInterna_6839[colunasTabelaInterna_8416['Procedimento']] === 'Compra') {
                                        somaValores_4728 -= valor_6482;
                                    } else {
                                        somaValores_4728 += valor_6482;
                                    }
                                }
                            } else {
                                if (mesAnoInterno_9168 === mesAno_5930) {
                                    const valor_6482 = parseFloat(linhaInterna_6839[colunasTabelaInterna_8416['Sub-Total']]);
                                    if (!isNaN(valor_6482)) {
                                        if (tabelaInterna_2957 === 'Transações com Saldo' && linhaInterna_6839[colunasTabelaInterna_8416['Operação']] === 'Débito' && linhaInterna_6839[colunasTabelaInterna_8416['Procedimento']] !== 'Movimentação entre Contas') {
                                            somaValores_4728 -= valor_6482;
                                        } else if (tabelaInterna_2957 === 'Transações com Saldo' && linhaInterna_6839[colunasTabelaInterna_8416['Procedimento']] === 'Movimentação entre Contas') {
                                            somaValores_4728 -= valor_6482;
                                            somaValores_4728 += valor_6482;
                                        } else {
                                            somaValores_4728 += valor_6482;
                                        }
                                    }
                                }
                            }
                        }
                    });
                    const nomeMes_2958 = new Date(dataEfetivacao_3927).toLocaleString('pt-BR', { month: 'long' }).toUpperCase();
                    const valorSomadoFormatado_8364 = formatarValor_7529(somaValores_4728);
                    if ((tipo_2956 === 'Cartão de Crédito e Saldo' || tipo_2956 === 'Cartão de Crédito') && incidencia2432 === 'Incidentes') {
                        html_2951 += `<p style="font-size: 0.85rem; font-weight: bold; text-transform: uppercase; margin: 2px 0 8px 0; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">${nomeMes_2958}/${ano_4819}</p>`;
                    }
                    html_2951 += `
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; table-layout: fixed;">
                <tr>
                  <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="8" style="border-collapse: collapse; background-color: #000; color: white;">
                      <tr class="cabecalho">
                        <th style="text-align: left; width: 15%; font-size: 0.75rem; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">DATA/STATUS</th>
                        <th style="text-align: left; width: 47%; font-size: 0.75rem; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">DESCRIÇÃO</th>
                        <th style="text-align: left; width: 25.5%; font-size: 0.75rem; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">${nomeColuna_1242}</th>
                        <th style="text-align: right; width: 12.5%; font-size: 0.75rem; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">${filtros1214 !== 'Mostrar' || tipo_2956 === 'Cartão de Crédito' || (tipo_2956 === 'Cartão de Crédito' && (tempo_8213 === 'Último Mês' || tempo_8213 === 'Antes e Durante Último Mês')) ? valorSomadoFormatado_8364.replace('-', '') : valorSomadoFormatado_8364}</th>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="8" style="border-collapse: collapse;">
            `;
                    mesesProcessados_9517[mesAno_5930] = true;
                }

                html_2951 += gerarLinhaHTML_9427(linha_9248, colunasTabela_5719, tabela_8402, index_6381, operador_1853, tipo_2956, condicaodegeracao_6834, fileCache_7426, filtros1214);
            });

            html_2951 += `
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;

        }
        else {
            html_2951 += `
          <p style="${imprimir_3857 === false ? 'text-align: left' : 'text-align: center'}; font-size: 0.75rem; margin: 0 0 10px 0">
            Não retornou resultados.
          </p>`;
        }

        if ((tipo_2956 === 'Cartão de Crédito e Saldo' || tipo_2956 === 'Cartão de Crédito') && incidencia2432 === 'Incidentes') {
            const dadosCC = dados_3805.filter(linha => linha.tabelaOrigem === 'Transações com Cartão de Crédito');
            const totaisCC = calcularTotaisPorCategoria(dadosCC, colunas_1495);

            const receitasCC = new Map();
            const despesasCC = new Map();
            totaisCC.forEach((valor, chaveComposta) => {
                const [categoria, tipo] = chaveComposta.split('|');
                if (tipo === 'receita') {
                    receitasCC.set(categoria, valor);
                } else {
                    despesasCC.set(categoria, valor);
                }
            });
            if (despesasCC.size > 0 || receitasCC.size > 0) {
                html_2951 += `<p class="impressao" style="font-size: 1rem; font-weight: bold; text-transform: uppercase; margin: 23px 0 3px 0; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">RESUMO DAS TRANSAÇÕES NO CARTÃO DE CRÉDITO</p>`;
                html_2951 += `<p class="impressao" style="font-size: 0.5rem; font-weight: bold; text-transform: uppercase; margin: 3px 0 18px 0; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">INCIDENTES EM ${mesAnoUltimoMes_3523}</p>`;
                if (receitasCC.size > 0) html_2951 += processarReceitas_8352(receitasCC);
                if (despesasCC.size > 0) html_2951 += processarDespesas_7491(despesasCC);
                html_2951 += processarOperadores_2332(dados_3805, colunas_1495, tipo_2956, mesAnoUltimoMes_3523, lancamentocartao_3233);
            }

        } else if ((tipo_2956 === 'Cartão de Crédito e Saldo' || tipo_2956 === 'Cartão de Crédito') && tempo_8213 === 'Último Mês') {
            const dadosCC = dados_3805.filter(linha => linha.tabelaOrigem === 'Transações com Cartão de Crédito');
            const totaisCC = calcularTotaisPorCategoria(dadosCC, colunas_1495);

            const receitasCC = new Map();
            const despesasCC = new Map();
            totaisCC.forEach((valor, chaveComposta) => {
                const [categoria, tipo] = chaveComposta.split('|');
                if (tipo === 'receita') {
                    receitasCC.set(categoria, valor);
                } else {
                    despesasCC.set(categoria, valor);
                }
            });
            if (despesasCC.size > 0 || receitasCC.size > 0) {
                html_2951 += `<p class="impressao" style="font-size: 1rem; font-weight: bold; text-transform: uppercase; margin: 23px 0 3px 0; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">RESUMO DAS TRANSAÇÕES NO CARTÃO DE CRÉDITO</p>`;
                html_2951 += `<p class="impressao" style="font-size: 0.5rem; font-weight: bold; text-transform: uppercase; margin: 3px 0 8px 0; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">REALIZADAS EM ${mesAnoUltimoMes_3523}, COM INCIDÊNCIA EM OUTROS MESES</p>`;
                if (receitasCC.size > 0) html_2951 += processarReceitas_8352(receitasCC);
                if (despesasCC.size > 0) html_2951 += processarDespesas_7491(despesasCC);
                html_2951 += processarOperadores_2332(dados_3805, colunas_1495, tipo_2956, mesAnoUltimoMes_3523, lancamentocartao_3233);
            }
        } else if (tipo_2956 === 'Cartão de Crédito e Saldo' || tipo_2956 === 'Cartão de Crédito') {
            const dadosCC = dados_3805.filter(linha => linha.tabelaOrigem === 'Transações com Cartão de Crédito');
            const totaisCC = calcularTotaisPorCategoria(dadosCC, colunas_1495);

            const receitasCC = new Map();
            const despesasCC = new Map();
            totaisCC.forEach((valor, chaveComposta) => {
                const [categoria, tipo] = chaveComposta.split('|');
                if (tipo === 'receita') {
                    receitasCC.set(categoria, valor);
                } else {
                    despesasCC.set(categoria, valor);
                }
            });
            if (despesasCC.size > 0 || receitasCC.size > 0) {
                html_2951 += `<p class="impressao" style="font-size: 1rem; font-weight: bold; text-transform: uppercase; margin: 23px 0 8px 0; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">RESUMO DAS TRANSAÇÕES NO CARTÃO DE CRÉDITO</p>`;
                if (receitasCC.size > 0) html_2951 += processarReceitas_8352(receitasCC);
                if (despesasCC.size > 0) html_2951 += processarDespesas_7491(despesasCC);
                html_2951 += processarOperadores_2332(dados_3805, colunas_1495, tipo_2956, mesAnoUltimoMes_3523, lancamentocartao_3233);
            }
        }

        if (tipo_2956 === 'Cartão de Crédito e Saldo' || tipo_2956 === 'Saldo') {
            const dadosSaldo = dados_3805.filter(linha => linha.tabelaOrigem === 'Transações com Saldo');
            const totaisSaldo = calcularTotaisPorCategoria(dadosSaldo, colunas_1495);

            const receitasSaldo = new Map();
            const despesasSaldo = new Map();
            totaisSaldo.forEach((valor, chaveComposta) => {
                const [categoria, tipo] = chaveComposta.split('|');
                if (tipo === 'receita') {
                    receitasSaldo.set(categoria, valor);
                } else {
                    despesasSaldo.set(categoria, valor);
                }
            });

            if (despesasSaldo.size > 0 || receitasSaldo.size > 0) {
                html_2951 += `<p class="impressao" style="font-size: 1rem; font-weight: bold; text-transform: uppercase; margin: 23px 0 8px 0; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">RESUMO DAS TRANSAÇÕES COM SALDO</p>`;
                if (receitasSaldo.size > 0) html_2951 += processarReceitas_8352(receitasSaldo);
                if (despesasSaldo.size > 0) html_2951 += processarDespesas_7491(despesasSaldo);
                html_2951 += processarOperadores_2332(dados_3805, colunas_1495, tipo_2956, mesAnoUltimoMes_3523, lancamentocartao_3233);
            }
        }

        return html_2951;
    }
}

function processarReceitas_8352(receitas_4578) {
    let receitasFiltradas_8572 = [];

    receitas_4578.forEach((valor_7392, chave_2856) => {
        if (valor_7392 > 0) {
            receitasFiltradas_8572.push({ nome: chave_2856, valor: valor_7392 });
        }
    });

    receitasFiltradas_8572.sort((a_7461, b_9928) => a_7461.nome.localeCompare(b_9928.nome));


    if (receitasFiltradas_8572.length === 0) {
        return '';
    }

    let tabelaHTML_3857 = `
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; table-layout: fixed; margin: 10px 0 8px 0;"">
            <tr>
                <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="8" style="border-collapse: collapse; background-color: #000; color: white;">
                        <tr class="cabecalho" style="height: 37.5px">
                            <th style="text-align: left; width: 65%; font-size: 0.865rem; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">RECEITAS</th>
                            <th style="text-align: left; width: 17.5%; font-size: 0.75rem; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">PARTE</th>
                            <th style="text-align: right; width: 17.5%; font-size: 0.75rem; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">VALOR</th>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="8" style="border-collapse: collapse;">`;

    let totalReceitas_9472 = receitasFiltradas_8572.reduce((acc_5832, curr_9275) => acc_5832 + curr_9275.valor, 0);


    receitasFiltradas_8572.forEach((item_3751, index_6381) => {
        const nomeReceita_1835 = item_3751.nome;
        const valorReceita_4927 = item_3751.valor;
        const porcentagem_2847 = ((valorReceita_4927 / totalReceitas_9472) * 100).toFixed(2).replace('.', ',') + '%';
        const valorFormatado_8539 = valorReceita_4927.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        const bgColor_4720 = index_6381 % 2 === 0 ? '#f3f3f3;" class="alternada"' : '#fff;" class="normal"';
        const linhaHTML_6308 = `
            <tr style="background-color: ${bgColor_4720}">
                <td style="width: 65%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; ">${nomeReceita_1835}</td>
                <td style="width: 17.5%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; ">${porcentagem_2847}</td>
                <td style="width: 17.5%; vertical-align: middle; font-size: 0.75rem; text-align: right; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; ">${valorFormatado_8539}</td>
            </tr>`;
        tabelaHTML_3857 += linhaHTML_6308;
    });

    tabelaHTML_3857 += `
        <tr style="background-color: #000; color: white;">
            <td style="width: 65%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; font-weight: bold;">TOTAL</td>
            <td style="width: 17.5%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; font-weight: bold;">100%</td>
            <td style="width: 17.5%; vertical-align: middle; font-size: 0.75rem; text-align: right; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; font-weight: bold;">${totalReceitas_9472.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
        </tr>`;


    tabelaHTML_3857 += `
                    </table>
                </td>
            </tr>
        </table>`;
    return tabelaHTML_3857;
}

function processarDespesas_7491(despesas_9274) {
    let despesasFiltradas_5739 = [];

    despesas_9274.forEach((valor_6489, chave_1935) => {
        if (valor_6489 > 0) {
            despesasFiltradas_5739.push({ nome: chave_1935, valor: valor_6489 });
        }
    });

    despesasFiltradas_5739.sort((a_8264, b_3581) => a_8264.nome.localeCompare(b_3581.nome));

    if (despesasFiltradas_5739.length === 0) {
        return '';
    }

    let tabelaHTML_8472 = `
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; table-layout: fixed; margin: 10px 0 8px 0;"">
            <tr>
                <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="8" style="border-collapse: collapse; background-color: #000; color: white;">
                        <tr class="cabecalho" style="height: 37.5px">
                            <th style="text-align: left; width: 65%; font-size: 0.865rem; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">DESPESAS</th>
                            <th style="text-align: left; width: 17.5%; font-size: 0.75rem; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">PARTE</th>
                            <th style="text-align: right; width: 17.5%; font-size: 0.75rem; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">VALOR</th>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="8" style="border-collapse: collapse;">`;

    let totalDespesas_4827 = despesasFiltradas_5739.reduce((acc_3957, curr_2948) => acc_3957 + curr_2948.valor, 0);

    despesasFiltradas_5739.forEach((item_6824, index_8471) => {
        const nomeDespesa_2947 = item_6824.nome;
        const valorDespesa_7591 = item_6824.valor;
        const porcentagem_9375 = ((valorDespesa_7591 / totalDespesas_4827) * 100).toFixed(2).replace('.', ',') + '%';
        const valorFormatado_2749 = valorDespesa_7591.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        const bgColor_4720 = index_8471 % 2 === 0 ? '#f3f3f3;" class="alternada"' : '#fff;" class="normal"';
        const linhaHTML_6308 = `
            <tr style="background-color: ${bgColor_4720}">
                <td style="width: 65%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">${nomeDespesa_2947}</td>
                <td style="width: 17.5%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">${porcentagem_9375}</td>
                <td style="width: 17.5%; vertical-align: middle; font-size: 0.75rem; text-align: right; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">${valorFormatado_2749}</td>
            </tr>`;
        tabelaHTML_8472 += linhaHTML_6308;
    });

    tabelaHTML_8472 += `
          <tr style="background-color: #000; color: white; ">
              <td style="width: 65%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; font-weight: bold;">TOTAL</td>
              <td style="width: 17.5%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; font-weight: bold;">100%</td>
              <td style="width: 17.5%; vertical-align: middle; font-size: 0.75rem; text-align: right; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; font-weight: bold;">${totalDespesas_4827.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
          </tr>`;

    tabelaHTML_8472 += `
                    </table>
                </td>
            </tr>
        </table>`;
    return tabelaHTML_8472;
}

function processarOperadores_2332(dados_3805, colunas_1495, tipo_2956, mesAnoUltimoMes_3523, lancamentocartao_3245) {

    const operadores_9572 = new Map();

    dados_3805.forEach(linha_8361 => {
        const tabela_9163 = getTabelaFromTipo_4183(linha_8361, tipo_2956);
        const colunasTabela_6381 = colunas_1495[tabela_9163];

        const operador_4728 = linha_8361[colunasTabela_6381['Operador']];

        if (tabela_9163 === 'Transações com Saldo') {
            let valor_8539 = parseFloat(linha_8361[colunasTabela_6381['Sub-Total']]);
            const operacao_3917 = linha_8361[colunasTabela_6381['Operação']];
            if (linha_8361[colunasTabela_6381['Procedimento']] !== 'Movimentação entre Contas') {
                if (operacao_3917 === 'Débito') {
                    if (operadores_9572.has(operador_4728)) {
                        operadores_9572.set(operador_4728, operadores_9572.get(operador_4728) + valor_8539);
                    } else {
                        operadores_9572.set(operador_4728, valor_8539);
                    }
                }
            }
        } else {
            let valor_8539;
            if (mesAnoUltimoMes_3523 || lancamentocartao_3245) {
                if (linha_8361[colunasTabela_6381['Parcelamento']] === 'Sim') {
                    const idtransacao_2432 = linha_8361[colunasTabela_6381['ID']];
                    const mesdelancamento_2431 = mesAnoUltimoMes_3523 || lancamentocartao_3245;
                    valor_8539 = obterValorBaseParcelamento_2412(idtransacao_2432, mesdelancamento_2431);
                } else {
                    valor_8539 = parseFloat(linha_8361[colunasTabela_6381['Valor Individual/Parcela']]);
                    valor_8539 = valor_8539 < 0 ? -valor_8539 : valor_8539;
                }
            }
            else {
                valor_8539 = parseFloat(linha_8361[colunasTabela_6381['Sub-Total']]);
            }


            if (linha_8361[colunasTabela_6381['Procedimento']] === 'Compra') {
                if (operadores_9572.has(operador_4728)) {
                    operadores_9572.set(operador_4728, operadores_9572.get(operador_4728) + valor_8539);
                } else {
                    operadores_9572.set(operador_4728, valor_8539);
                }
            } else {
                if (operadores_9572.has(operador_4728)) {
                    operadores_9572.set(operador_4728, operadores_9572.get(operador_4728) + -valor_8539);  // Mantém a inversão de sinal
                } else {
                    operadores_9572.set(operador_4728, -valor_8539); // Mantém a inversão de sinal
                }
            }
        }
    });

    const operadoresOrdenados_6382 = Array.from(operadores_9572.entries()).sort((a_8361, b_9274) => a_8361[0].localeCompare(b_9274[0]));

    if (operadoresOrdenados_6382.length <= 1) {
        return '';
    }

    let tabelaHTML_7491 = '';

    if (operadoresOrdenados_6382.length > 0) {
        tabelaHTML_7491 = `
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; table-layout: fixed; margin: 10px 0 8px 0;"">
            <tr>
                <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="8" style="border-collapse: collapse; background-color: #000; color: white;">
                        <tr class="cabecalho" style="height: 37.5px">
                            <th style="text-align: left; width: 65%; font-size: 0.865rem; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">OPERADORES</th>
                            <th style="text-align: left; width: 17.5%; font-size: 0.75rem; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">PARTE</th>
                            <th style="text-align: right; width: 17.5%; font-size: 0.75rem; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">VALOR</th>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="8" style="border-collapse: collapse;">`;


        let totalOperadores_2947 = 0;
        operadoresOrdenados_6382.forEach(([operador_5839, valor_4815]) => {
            totalOperadores_2947 += valor_4815;
        });

        operadoresOrdenados_6382.forEach(([operador_5839, valor_4815], index_7592) => {
            const porcentagem_9164 = ((valor_4815 / totalOperadores_2947) * 100).toFixed(2).replace('.', ',') + '%';
            const valorFormatado_6284 = valor_4815.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            const bgColor_4720 = index_7592 % 2 === 0 ? '#f3f3f3;" class="alternada"' : '#fff;" class="normal"';
            const linhaHTML_9582 = `
            <tr style="background-color: ${bgColor_4720}">
                <td style="width: 65%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">${operador_5839}</td>
                <td style="width: 17.5%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">${porcentagem_9164}</td>
                <td style="width: 17.5%; vertical-align: middle; font-size: 0.75rem; text-align: right; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">${valorFormatado_6284}</td>
            </tr>`;
            tabelaHTML_7491 += linhaHTML_9582;
        });
        tabelaHTML_7491 += `
            <tr style="background-color: #000; color: white;">
                <td style="width: 65%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; font-weight: bold;">TOTAL</td>
                <td style="width: 17.5%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; font-weight: bold;">100%</td>
                <td style="width: 17.5%; vertical-align: middle; font-size: 0.75rem; text-align: right; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; font-weight: bold;">${totalOperadores_2947.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            </tr>`;

        tabelaHTML_7491 += `
                      </table>
                  </td>
              </tr>
          </table>`;
    }
    return tabelaHTML_7491;
}

function gerarHTMLconjunto_5291(htmlCCRealizadas, htmlCCIncidentes, htmlSaldo, imprimir_3857, insightgerado_9250 = undefined) {
    const hoje_4693 = new Date();
    const mesAnterior_8204 = new Date(hoje_4693.getFullYear(), hoje_4693.getMonth() - 1, 1);

    const nomeMes_7491 = mesAnterior_8204.toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase();
    const ano_9368 = mesAnterior_8204.getFullYear();

    let html_8520 = ``;
    let html_gemini_8520 = ``;
    if (imprimir_3857 === false) {
        html_8520 += `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
    <title>Relatório de Transações</title>
    <meta charset="UTF-8">
    <style type="text/css">
      @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap');
      body {
        padding: 0px;
        margin: 0px;
        font-family: 'Roboto Condensed'!important;
      }
    </style>
    </head>
    <body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; table-layout: fixed;">
        <tr>
          <td>
  `;
    } else {
        html_8520 += `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
    <title>Relatório de Transações</title>
    <link rel="icon" type="image/png" href="https://i.ibb.co/MMdSHDp/financa.png">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <style>
        body {
          padding: 15px 150px;
          color: white;
          background-color: #121212
        }
  
        a:visited {
          color: #96BAFF !important;
          text-decoration: none !important;
        }
  
        a:hover {
          color: #96BAFF !important;
          text-decoration: underline!important;
        }
  
        a:link {
          color: #96BAFF !important;
          text-decoration: none;
        }
  
        a:focus {
          outline: 2px solid #90CAF9 !important;
          background-color: #333333 !important;
        }
  
        .alternada {
          background-color: #1a1a1a!important
        }
  
        .cabecalho {
          background-color: white!important
          color: black!important
        }
  
        .normal {
          background-color: #2b2b2b!important
        }
  
        .layout {
          display: none!important
        }
  
        .hr-espac {
          color: #fff!important;
          background-color: #fff!important
        }
  
        @media (max-width: 768px) {
          body {
            padding: 15px 15px;
          }
        }
  
        @media (min-width: 769px) and (max-width: 1024px) {
          body {
            padding: 15px 35px;
          }
        }
  
        @media (min-width: 1025px) {
          body {
            padding: 15px 150px;
          }
        }
  
        @media (orientation: landscape) {
          body {
            padding: 15px 25px;
          }
        }
  
        @media (orientation: portrait) {
          body {
            padding: 15px 15px;
          }
        }
  
        @media print {
          body {
            padding: 0px;
            color: black;
            background-color: white
          }
  
          .impressao-gemini {
            margin: 0 auto;
            display: block;
            text-align: center;
          }
  
          .imagem-impressao {
            filter: grayscale(1);
          }
  
          .layout {
            display: revert!important
          }
  
          a:visited {
            color: black!important;
            text-decoration: none!important;
          }
  
          a:link {
            color: black!important;
            text-decoration: none!important;
          }
  
          .alternada {
            background-color: #f3f3f3!important
          }
  
          .cabecalho {
            background-color: black!important;
            color: white!important
          }
  
          .normal {
            background-color: #fff!important
          }
  
          .hr-espac {
            color: black!important;
            background-color: black!important
          }
  
          .impressao {
            text-align: center;
          }
  
          .hidden {
            display: none
          }
  
          #data-hora {
            display: block!important;
          }
        }
  
      </style>
    </head>
    <body">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; table-layout: fixed;">
        <tr>
          <td>
  `;
    }

    const dataFormatadaparaapr_3946 = `${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()} às ${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;

    if (htmlCCIncidentes.includes('Não retornou resultados.') && htmlCCRealizadas.includes('Não retornou resultados.') && htmlSaldo.includes('Não retornou resultados.')) {
        html_8520 += `
        <p style="${imprimir_3857 === false ? 'text-align: left' : 'text-align: center'}; font-size: 0.75rem; margin: 0 0 10px 0">
          O Relatório de Transações de <b>${nomeMes_7491}/${ano_9368}</b>, gerado em ${dataFormatadaparaapr_3946} por meio do aplicativo
          <b>Controle de Transações</b>, não retornou resultados.
        </p>`;
    } else {
        if (imprimir_3857 === false) {
            html_gemini_8520 += html_8520 += `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
        <p style="font-size: 0.75rem; margin: 0; display: inline-block; vertical-align: middle; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">
          Segue, abaixo, o Relatório de Transações de <b>${nomeMes_7491}/${ano_9368}</b>, gerado em ${dataFormatadaparaapr_3946} por meio do aplicativo
          <b>Controle de Transações</b>, para fins de <b>AUDITÓRIA</b> e <b>CONTROLE</b>.
        </p>
        <div style="display: flex; align-items: center;">
          <span style="display:inline-block; vertical-align:middle; margin:0 10px; background-color:black; width:3px; height:30px;border-radius: 10px;"></span>
          <a href="#$#$#SUBSTITUIRAQUIURLDERED#$#$#"
            style="background-color:black; color:white; padding:5px 10px; border:none; text-decoration:none; font-size: 0.75rem; display:inline-block;text-align: center;border-radius: 10px; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">
            VISUALIZAÇÃO WEB
          </a>
        </div>
      </div>`;
        } else {
            html_gemini_8520 += html_8520 += `<h1 style="font-size: 1.75rem; margin: 0 0 0 0;font-weight: 600;text-align: center;">RELATÓRIO DE TRANSAÇÕES DO ÚLTIMO MÊS</h1>`;
            html_gemini_8520 += html_8520 += `<hr class="hr-espac" style="width: 100%; color: #000; border-radius: 40px; background-color: #000; height: 2px; border: 0px;margin: 12.5px auto;">`;
            let filtro_6294 = ``;
            filtro_6294 += `CARTÃO DE CRÉDITO E SALDO`;
            filtro_6294 += ` | ${nomeMes_7491}/${ano_9368}`;
            filtro_6294 + ` | EM TODOS OS CARTÕES DE CRÉDITO E EM TODAS AS CONTAS`;
            html_gemini_8520 += html_8520 += `<p class="hidden" style="font-size: 0.75rem; margin: 0 0 20px 0;font-weight: 300;text-align: center;">${filtro_6294.toUpperCase()}</p>`;
        }

        if (!htmlCCIncidentes.includes('Não retornou resultados.')) {
            html_gemini_8520 += html_8520 += `<p class="impressao" style="font-size: 1rem; font-weight: bold; text-transform: uppercase; margin: 16px 0 3px 0; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">TRANSAÇÕES COM CARTÃO DE CRÉDITO</p>`;
            html_gemini_8520 += html_8520 += `<p class="impressao" style="font-size: 0.5rem; font-weight: bold; text-transform: uppercase; margin: 3px 0 18px 0; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">INCIDENTES EM ${nomeMes_7491}/${ano_9368}</p>`;
            html_gemini_8520 += html_8520 += htmlCCIncidentes;
        }

        if (!htmlCCRealizadas.includes('Não retornou resultados.')) {
            html_8520 += `<p class="impressao" style="font-size: 1rem; font-weight: bold; text-transform: uppercase; margin: 24px 0 3px 0; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">TRANSAÇÕES COM CARTÃO DE CRÉDITO</p>`;
            html_8520 += `<p class="impressao" style="font-size: 0.5rem; font-weight: bold; text-transform: uppercase; margin: 3px 0 8px 0; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">REALIZADAS EM ${nomeMes_7491}/${ano_9368}, COM INCIDÊNCIA EM OUTROS MESES</p>`;
            html_8520 += htmlCCRealizadas;
        }

        if (!htmlSaldo.includes('Não retornou resultados.')) {
            html_gemini_8520 += `<p class="impressao" style="font-size: 1rem; font-weight: bold; text-transform: uppercase; margin: 24px 0 8px 0; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">TRANSAÇÕES COM SALDO</p>`;
            html_8520 += `<p class="impressao" style="font-size: 1rem; font-weight: bold; text-transform: uppercase; margin: 24px 0 8px 0; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">TRANSAÇÕES COM SALDO</p>`;
            html_8520 += htmlSaldo;
            html_gemini_8520 += htmlSaldo;
        }

        const insightgerado_9111 = !insightgerado_9250 ? processarGemini_5312(html_gemini_8520, !htmlSaldo.includes('Não retornou resultados.') ? 'HTML Conjunto' : undefined) : insightgerado_9250

        html_8520 += insightgerado_9111

        if (imprimir_3857 === false) {
            html_8520 = html_8520.replace('#$#$#SUBSTITUIRAQUIURLDERED#$#$#', encurtarUrlBase64_4829(`tempo=${'Último Mês'}&tipo=${htmlCCIncidentes || htmlCCRealizadas ? 'Cartão de Crédito e Saldo' : 'Saldo'}${insightgerado_9111 ? '&insightgerado=' + insightgerado_9111 : ''}${'&senha=MSRmsr2005@'}`))
        }

        html_8520 += `<p id="data-hora" style="display: none; text-align: center; font-size: 0.75rem; margin: 0px; margin-top: 23px; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;"><b>GERADO EM ${dataFormatadaparaapr_3946.toUpperCase()}</b></p>`
    }
    html_8520 += `
    </body>
    </html>`;
    return html_8520;
}

function processarGemini_5312(dados_9140, dados1243 = undefined) {
    try {
        const API_KEY_2957 = gemini_id();

        const payload_9725 = {
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: dados_9140
                        },
                        {
                            text: (dados1243 && dados1243 === 'HTML Conjunto') ? "Você é uma Inteligência Artificial especializada em análise de finanças pessoais, responsável por fornecer recomendações com base nas transações financeiras do usuário. As transações já estão categorizadas e incluem totais de receitas e despesas, tanto no Cartão de Crédito quanto em Saldo. Nunca critique a base de dados fornecidas e nunca peça por mais dados e nem dê sugestões para que os relatórios melhorem. Com base nesses dados, forneça recomendações práticas e viáveis para melhorar a saúde financeira, bem como insights acionáveis relacionados às transações. As Transações no Cartão de Crédito correspondem exatamente às faturas pagas em Transações com Saldo. Lembre-se que todas as respostas devem ser feitas com base nos dados fornecidos, então não inventes novidades. Caso o nome de alguma transação precise ser citado, sempre coloque-o em maiúsculo. Faça uso descente da norma culta da Língua Portuguesa. A resposta pode conter o uso da tag HTML <b> (negrito), sem uso de markdown ou outras linguagens de marcação, em DOIS parágrafos de 600 a 1000 caracteres cada (separados por uma única tag  HTML <br> (quebrar linha)), ambos corridos e sem tópicos (sendo que o primeiro deve tratar dos insights dos dados, com uma análise detalhada, e o segundo parágrafo deve tratar das recomendações a serem tomadas). Também é importante não ter título algum, somente texto." : "Você é uma Inteligência Artificial especializada em análise de finanças pessoais, responsável por fornecer recomendações com base nas transações financeiras do usuário. As transações já estão categorizadas e incluem totais de receitas e despesas. Nunca critique a base de dados fornecidas e nunca peça por mais dados e nem dê sugestões para que os relatórios melhorem. Com base nesses dados, forneça recomendações práticas e viáveis para melhorar a saúde financeira, bem como insights acionáveis relacionados às transações. Lembre-se que todas as respostas devem ser feitas com base nos dados fornecidos, então não inventes novidades. Caso o nome de alguma transação precise ser citado, sempre coloque-o em maiúsculo. Faça uso descente da norma culta da Língua Portuguesa. A resposta pode conter o uso da tag HTML <b> (negrito), sem uso de markdown ou outras linguagens de marcação, em DOIS parágrafos de 300 a 500 caracteres cada (separados por uma única tag HTML <br> (quebrar linha)), ambos corridos e sem tópicos (sendo que o primeiro deve tratar dos insights dos dados, com uma análise detalhada, e o segundo parágrafo deve tratar das recomendações a serem tomadas). Também é importante não ter título algum, somente texto."
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.05,
                topK: 2,
                topP: 0.05,
                maxOutputTokens: 65536,
                responseMimeType: "text/plain"
            }
        };

        const url_7319 = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-thinking-exp-01-21:generateContent?key=" + API_KEY_2957;

        const options_1846 = {
            method: "post",
            contentType: "application/json",
            payload: JSON.stringify(payload_9725)
        };

        const response_3947 = UrlFetchApp.fetch(url_7319, options_1846);

        const json_6284 = JSON.parse(response_3947.getContentText());

        const generatedText_8541 = json_6284.candidates[0].content.parts[0].text;

        const htmlinsights_2142 = `<div class="impressao-gemini"><p class="impressao" style="display: inline-block; font-size: 1rem; font-weight: bold; text-transform: uppercase; margin: 23px 0 8px 0; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">INSIGHTS</p><span style="font-size: 0.4em; margin-left: 5px; margin-top: 9px; font-weight: 100;">by</span><img class="imagem-impressao" style="height: 16px; margin-left: 5px; margin-top: 2px;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/2560px-Google_Gemini_logo.svg.png" alt="Google Gemini Logo"></div><p style="font-size: 0.8rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; margin-bottom: 0px; margin-top: 0px;">${generatedText_8541.replace('<br>', '<br><br>')}<br><br></p><p style="text-align: left; font-size: 0.55rem; margin: 0px; margin-top: 0px; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;"><b>*</b> Os insights gerados pelo Google Gemini não refletem a opinião do desenvolvedor e podem estar sujeitos a erros e alucinações.</p>`

        return htmlinsights_2142
    } catch (e) {
        return `<div class="impressao-gemini"><p class="impressao" style="display: inline-block; font-size: 1rem; font-weight: bold; text-transform: uppercase; margin: 23px 0 8px 0; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif;">INSIGHTS</p><span style="font-size: 0.4em; margin-left: 5px; margin-top: 9px; font-weight: 100;">by</span><img class="imagem-impressao" style="height: 16px; margin-left: 5px; margin-top: 2px;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/2560px-Google_Gemini_logo.svg.png" alt="Google Gemini Logo"></div><p style="font-size: 0.8rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; margin-bottom: 0px; margin-top: 0px;">A geração de Insights, via Google Gemini, não deu certo. Repasse o erro seguinte ao Analista de Sistema: ${e}</p>`
    }
}

function getNomeColuna_2836(tipo_2956) {
    let nomeColuna_6195;
    const tipo_1244 = tipo_2956.toLowerCase();
    switch (tipo_1244) {
        case 'cartão de crédito':
            nomeColuna_6195 = 'CARTÃO DE CRÉDITO';
            break;
        case 'cartão de crédito e saldo':
            nomeColuna_6195 = 'CARTÃO/CONTA';
            break;
        case 'saldo':
            nomeColuna_6195 = 'CONTA BANCÁRIA';
            break;
        default:
            nomeColuna_6195 = '';
    }
    return nomeColuna_6195;
}

function getTipoRelatorio_8042(tipo_2956) {
    let textoDescritivo_3851;
    switch (tipo_2956) {
        case 'Cartão de Crédito':
            textoDescritivo_3851 = 'com Cartão de Crédito';
            break;
        case 'Cartão de Crédito e Saldo':
            textoDescritivo_3851 = 'com Saldo e Cartão de Crédito';
            break;
        case 'Saldo':
            textoDescritivo_3851 = 'com Saldo';
            break;
        default:
            textoDescritivo_3851 = '';
    }
    return textoDescritivo_3851;
}

function getFiltro_9257(cartaoCredito_7329, contaFinanceira_3918) {
    let textoFiltro_8516;
    if (cartaoCredito_7329 && contaFinanceira_3918) {
        textoFiltro_8516 = ` (no cartão de crédito ${cartaoCredito_7329} e conta ${contaFinanceira_3918})`;
    }
    if (cartaoCredito_7329 && !contaFinanceira_3918) {
        textoFiltro_8516 = ` (no cartão de crédito ${cartaoCredito_7329})`;
    }
    if (!cartaoCredito_7329 && contaFinanceira_3918) {
        textoFiltro_8516 = ` (na conta ${contaFinanceira_3918})`;
    }
    if (!cartaoCredito_7329 && !contaFinanceira_3918) {
        textoFiltro_8516 = ``;
    }
    return textoFiltro_8516;
}

function gerarLinhaHTML_9427(linha_9248, colunasTabela_5719, tabela_8402, index_6381, operador_1853, tipo_2956, condicaodegeracao_6834, fileCache_7426, filtros1214) {
    const data_4937 = formatarData_6284(linha_9248[colunasTabela_5719['Data de Efetivação']], linha_9248[colunasTabela_5719['Horário da Efetivação']], linha_9248[colunasTabela_5719['Procedimento']], linha_9248[colunasTabela_5719['Status']], condicaodegeracao_6834, filtros1214);
    const descricao_5826 = gerarDescricao_7194(linha_9248, colunasTabela_5719, tabela_8402, operador_1853, tipo_2956, fileCache_7426, filtros1214);
    const nome_3958 = gerarNome_8206(linha_9248, colunasTabela_5719, tabela_8402);
    const valor_2849 = formatarValor_7529(linha_9248[colunasTabela_5719['Sub-Total']]);
    const bgColor_4720 = index_6381 % 2 === 0 ? '#f3f3f3;" class="alternada"' : '#fff;" class="normal"';
    let linhaHTML_6308 = ''
    if (tabela_8402 === 'Transações com Saldo') {
        linhaHTML_6308 = `
    <tr style="background-color: ${bgColor_4720}>
      <td style="width: 15%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; height: 60px;">${data_4937}</td>
      <td style="width: 47%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; height: 60px;">${descricao_5826}</td>
      <td style="width: 25.5%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; height: 60px;">${nome_3958}</td>
      <td style="width: 12.5%; vertical-align: middle; font-size: 0.75rem; text-align: right; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; height: 60px;">${valor_2849}</td>
    </tr>
  `;
    } else {
        const valor_2456 = formatarValor_7529(-linha_9248[colunasTabela_5719['Valor Individual/Parcela']])
        const parcer_2456 = String(linha_9248[colunasTabela_5719['Parcelamento']])
        const qtdpar_2456 = Number(linha_9248[colunasTabela_5719['Quantidade de Parcelas']])
        if (parcer_2456 === 'Sim' && qtdpar_2456 > 1) {
            linhaHTML_6308 = `
      <tr style="background-color: ${bgColor_4720}>
        <td style="width: 15%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; height: 60px;">${data_4937}</td>
        <td style="width: 47%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; height: 60px;">${descricao_5826}</td>
        <td style="width: 25.5%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; height: 60px;">${nome_3958}</td>
        <td style="width: 12.5%; vertical-align: middle; font-size: 0.75rem; text-align: right; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; height: 60px;">${valor_2849}<br><span style="margin-top: 2px; font-size: 0.55rem;">${qtdpar_2456}x de ${valor_2456}</span></td>
      </tr>
    `;
        } else {
            linhaHTML_6308 = `
      <tr style="background-color: ${bgColor_4720}>
        <td style="width: 15%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; height: 60px;">${data_4937}</td>
        <td style="width: 47%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; height: 60px;">${descricao_5826}</td>
        <td style="width: 25.5%; vertical-align: middle; font-size: 0.75rem; text-align: left; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; height: 60px;">${nome_3958}</td>
        <td style="width: 12.5%; vertical-align: middle; font-size: 0.75rem; text-align: right; font-family: 'Roboto Condensed', Arial, Helvetica, sans-serif; height: 60px;">${valor_2849}</td>
      </tr>
    `;
        }

    }


    return linhaHTML_6308;
}

function formatarData_6284(dataEfetivacao_9417, horarioEfetivacao_2751, procedimento_5839, status_8294, condicaodegeracao_6834, filtros1214) {
    const data_7592 = new Date(dataEfetivacao_9417);
    const dia_4928 = String(data_7592.getDate()).padStart(2, '0');
    const mes_6205 = String(data_7592.getMonth() + 1).padStart(2, '0');
    const hora_3850 = String(horarioEfetivacao_2751.getHours()).padStart(2, '0');
    const minuto_9184 = String(horarioEfetivacao_2751.getMinutes()).padStart(2, '0');
    let dataFormatada_5729;
    if (filtros1214 !== 'Não mostrar') {
        if (condicaodegeracao_6834 === "Segmentado") {
            if (procedimento_5839 === 'Pagamento - Débito Automático') {
                dataFormatada_5729 = `${dia_4928}/${mes_6205}`;
            } else {
                dataFormatada_5729 = `${dia_4928}/${mes_6205} às ${hora_3850}:${minuto_9184}`;
            }
            return dataFormatada_5729;
        } else {
            if (procedimento_5839 === 'Pagamento - Débito Automático' || status_8294 !== 'Efetuado') {
                dataFormatada_5729 = `${dia_4928}/${mes_6205}<br>${status_8294}`;
            } else {
                dataFormatada_5729 = `${dia_4928}/${mes_6205} às ${hora_3850}:${minuto_9184}<br>${status_8294}`;
            }
            return dataFormatada_5729;
        }
    } else {
        if (condicaodegeracao_6834 === "Segmentado") {
            if (procedimento_5839 === 'Pagamento - Débito Automático') {
                dataFormatada_5729 = `${dia_4928}/${mes_6205}`;
            } else {
                dataFormatada_5729 = `${dia_4928}/${mes_6205} às ${hora_3850}:${minuto_9184}`;
            }
            return dataFormatada_5729;
        } else {
            if (procedimento_5839 === 'Pagamento - Débito Automático' || status_8294 !== 'Efetuado') {
                dataFormatada_5729 = `${dia_4928}/${mes_6205}`;
            } else {
                dataFormatada_5729 = `${dia_4928}/${mes_6205} às ${hora_3850}:${minuto_9184}`;
            }
            return dataFormatada_5729;
        }
    }


}

function gerarDescricao_7194(linha_9248, colunasTabela_5719, tabela_8402, operador_1853, tipo_2956, fileCache_7426, filtros1214) {
    let descricaoFormatada_4826;
    const documentoComprobatorio_9518 = linha_9248[colunasTabela_5719['Documento Comprobatório']];
    const linkDocumentoFiscal_6391 = linha_9248[colunasTabela_5719['Link do Documento Fiscal']];
    const termosDoServico_2947 = linha_9248[colunasTabela_5719['Termos do Serviço']];
    const relevanteimposto_2947 = linha_9248[colunasTabela_5719['Relevante para Imposto de Renda']];

    let linkHref_8539 = '';
    if (documentoComprobatorio_9518 && fileCache_7426[documentoComprobatorio_9518]) {
        linkHref_8539 = `target="_blank" href="${fileCache_7426[documentoComprobatorio_9518]}"`;
    }

    let linkTermosHref_4926 = '';
    if (termosDoServico_2947 && fileCache_7426[termosDoServico_2947]) {
        linkTermosHref_4926 = `href="${fileCache_7426[termosDoServico_2947]}"`;
    }

    let linkFiscalHref_6831 = '';
    if (linkDocumentoFiscal_6391) {
        linkFiscalHref_6831 = `target="_blank"  href="${linkDocumentoFiscal_6391}"`;
    }

    if (tabela_8402 === 'Transações com Saldo') {
        const id_5820 = linha_9248[colunasTabela_5719['ID']];
        const operacao_7294 = linha_9248[colunasTabela_5719['Operação']];
        const procedimento_9157 = linha_9248[colunasTabela_5719['Procedimento']];
        const descricao_6934 = linha_9248[colunasTabela_5719['Descrição']];
        const observacoes_8305 = linha_9248[colunasTabela_5719['Observações']];
        const oper_4827 = linha_9248[colunasTabela_5719['Operador']];

        if (id_5820) {
            linkAppsheetHref_6831 = `target="_blank"  href="https://www.appsheet.com/start/039a7295-2371-4bd6-81b5-9ac85fa3f3c3#control=${tabela_8402 === 'Transações com Saldo' ? 'Detalhes de Transações com Saldo (3)' : 'Detalhes de Transações com Cartão de Crédito (3)'}&row=${id_5820}"`;
        }

        let cabecalhodeprod_7529 = '';
        if (procedimento_9157.toUpperCase().includes("TRANSFERÊNCIA")) {
            if (operacao_7294.toUpperCase() === 'CRÉDITO') {
                cabecalhodeprod_7529 = 'ORIGINADOR: ';
            } else {
                cabecalhodeprod_7529 = 'RECEBEDOR: ';
            }
        }
        if (filtros1214 !== 'Não mostrar') {
            descricaoFormatada_4826 = `<a style="font-size: 0.59375rem; margin-top: 0px; margin-bottom: 0px; font-stretch: condensed;" ${linkAppsheetHref_6831}><b>${id_5820}</b></a>`;
        } else {
            descricaoFormatada_4826 = ``
        }


        if (filtros1214 !== 'Não mostrar') {
            descricaoFormatada_4826 += `<span style="font-size: 0.59375rem; margin-top: 0px; margin-bottom: 0px; font-stretch: condensed;">, operado por ${oper_4827}</span><br>`;
        } else {
            descricaoFormatada_4826 += ``;
        }

        if (linkHref_8539) {
            if (procedimento_9157 === 'Movimentação entre Contas') {
                descricaoFormatada_4826 += `<a style="font-weight: bold; font-stretch: condensed;" ${linkHref_8539}>MOVIMENTAÇÃO ENTRE CONTAS${relevanteimposto_2947 === 'Sim' ? '<b style="font-size: 0.675rem;"> (IR)</b>' : ''}</a>`;
            } else {
                const categoria_5294 = operacao_7294 === 'Crédito' ? linha_9248[colunasTabela_5719['Categoria - Crédito']] : linha_9248[colunasTabela_5719['Categoria - Débito']];
                descricaoFormatada_4826 += `<a style="font-weight: bold; font-stretch: condensed;" ${linkHref_8539}>${operacao_7294.toUpperCase()} COM ${categoria_5294.toUpperCase().replace("DESPESA - ", "").replace("RECEITA - ", "")} | ${procedimento_9157.toUpperCase()}${relevanteimposto_2947 === 'Sim' ? '<b style="font-size: 0.675rem;"> (IR)</b>' : ''}</a>`;
            }
        } else {
            if (procedimento_9157 === 'Movimentação entre Contas') {
                descricaoFormatada_4826 += `<span style="font-weight: bold; font-stretch: condensed;">MOVIMENTAÇÃO ENTRE CONTAS${relevanteimposto_2947 === 'Sim' ? '<b style="font-size: 0.675rem;"> (IR)</b>' : ''}</span>`;
            } else {
                const categoria_5294 = operacao_7294 === 'Crédito' ? linha_9248[colunasTabela_5719['Categoria - Crédito']] : linha_9248[colunasTabela_5719['Categoria - Débito']];
                descricaoFormatada_4826 += `<span style="font-weight: bold; font-stretch: condensed;">${operacao_7294.toUpperCase()} COM ${categoria_5294.toUpperCase().replace("DESPESA - ", "").replace("RECEITA - ", "")} | ${procedimento_9157.toUpperCase()}${relevanteimposto_2947 === 'Sim' ? '<b style="font-size: 0.675rem;"> (IR)</b>' : ''}</span>`;
            }
        }
        if (filtros1214 !== 'Não mostrar') {
            if (linkDocumentoFiscal_6391 && termosDoServico_2947) {
                descricaoFormatada_4826 += `<a class="hidden" style="font-size: 0.59375rem; margin-top: 0px; margin-bottom: 0px; font-stretch: condensed;" ${linkHref_8539}><b><br>${(id_5820.includes('F') && descricao_6934.includes('Fatura') ? 'FATURA' : 'TERMOS DO SERVIÇO')}</b></a><a class="hidden" style="font-size: 0.59375rem; margin-top: 0px; margin-bottom: 0px; font-stretch: condensed;"><b> | </b></a><a class="hidden" style="font-size: 0.59375rem; margin-top: 0px; margin-bottom: 0px; font-stretch: condensed;" ${linkFiscalHref_6831}><b>DOCUMENTO FISCAL</b></a>`;
            } else if (linkDocumentoFiscal_6391 && !termosDoServico_2947) {
                descricaoFormatada_4826 += `<a class="hidden" style="font-size: 0.59375rem; margin-top: 0px; margin-bottom: 0px; font-stretch: condensed;" ${linkFiscalHref_6831}><b><br>DOCUMENTO FISCAL</b></a>`;
            } else if (!linkDocumentoFiscal_6391 && termosDoServico_2947) {
                descricaoFormatada_4826 += `<a class="hidden" style="font-size: 0.59375rem; margin-top: 0px; margin-bottom: 0px; font-stretch: condensed;" ${linkTermosHref_4926}><b><br>${(id_5820.includes('F') && descricao_6934.includes('Fatura') ? 'FATURA' : 'TERMOS DO SERVIÇO')}</b></a>`;
            }
        }

        if (procedimento_9157 !== 'Movimentação entre Contas') {
            descricaoFormatada_4826 += `<p style="margin-top: 4px; margin-bottom: 0px;"><span style="font-size: 0.53125rem; font-stretch: condensed;">${cabecalhodeprod_7529}</span><span style="font-size: 0.71875rem;">${descricao_6934.includes('Fatura') && id_5820.includes('F') ? descricao_6934.replace('Fatura (', '').replace(')', '') : descricao_6934}`;
        }
        if (observacoes_8305 && procedimento_9157 !== 'Movimentação entre Contas') {
            descricaoFormatada_4826 += ` | ${observacoes_8305}</span></p>`;
        } else if (!observacoes_8305 && procedimento_9157 !== 'Movimentação entre Contas') {
            descricaoFormatada_4826 += `</span></p>`;
        }

        if (observacoes_8305 && procedimento_9157 === 'Movimentação entre Contas') {
            descricaoFormatada_4826 += `<p style="font-size: 0.71875rem; margin-top: 4px; margin-bottom: 0px; font-stretch: condensed;"><a style="font-size: 0.53125rem; font-stretch: condensed;">OBSERVAÇÕES: </a>${observacoes_8305}</p>`;
        }

        descricaoFormatada_4826 += `<p style="font-size: 0.75rem; margin-top: 0px; margin-bottom: 1px; font-stretch: condensed;"></p>`;
    } else {
        const id_5110 = linha_9248[colunasTabela_5719['ID']];
        const procedimento_9157 = linha_9248[colunasTabela_5719['Procedimento']].toUpperCase();
        const descricao_6934 = linha_9248[colunasTabela_5719['Descrição']].toUpperCase();
        const categoria_5294 = linha_9248[colunasTabela_5719['Categoria']].toUpperCase().replace("DESPESA - ", "").replace("RECEITA - ", "");
        const observacoes_8305 = linha_9248[colunasTabela_5719['Observações']];
        const cartaoCredito_4751 = linha_9248[colunasTabela_5719['Cartão de Crédito']];
        const oper_4827 = linha_9248[colunasTabela_5719['Operador']];

        if (id_5110) {
            linkAppsheetHref_6811 = `target="_blank"  href="https://www.appsheet.com/start/039a7295-2371-4bd6-81b5-9ac85fa3f3c3#control=${tabela_8402 === 'Transações com Saldo' ? 'Detalhes de Transações com Saldo (3)' : 'Detalhes de Transações com Cartão de Crédito (3)'}&row=${id_5110}"`;
        }

        if (filtros1214 !== 'Não mostrar') {
            descricaoFormatada_4826 = `<a style="font-size: 0.59375rem; margin-top: 0px; margin-bottom: 0px; font-stretch: condensed;" ${linkAppsheetHref_6811}><b>${id_5110}</b></a>`;
        } else {
            descricaoFormatada_4826 = ``
        }

        if (filtros1214 !== 'Não mostrar') {
            descricaoFormatada_4826 += `<span style="font-size: 0.59375rem; margin-top: 0px; margin-bottom: 0px; font-stretch: condensed;">, operado por ${oper_4827}</span><br>`;
        } else {
            descricaoFormatada_4826 += ``;
        }

        if (linkHref_8539) {
            if (procedimento_9157.toUpperCase() === 'ANTECIPAÇÃO' || procedimento_9157.toUpperCase() === 'REEMBOLSO') {
                descricaoFormatada_4826 += `<a style="font-weight: bold; font-stretch: condensed;" ${linkHref_8539}>ANTECIPAÇÃO EM ${cartaoCredito_4751.toUpperCase()}${relevanteimposto_2947 === 'Sim' ? '<b style="font-size: 0.675rem;"> (IR)</b>' : ''}</a>`;
            } else {
                descricaoFormatada_4826 += `<a style="font-weight: bold; font-stretch: condensed;" ${linkHref_8539}>${categoria_5294} | ${procedimento_9157} EM ${descricao_6934}${relevanteimposto_2947 === 'Sim' ? '<b style="font-size: 0.675rem;"> (IR)</b>' : ''}</a>`;
            }
        } else {
            if (procedimento_9157.toUpperCase() === 'ANTECIPAÇÃO' || procedimento_9157.toUpperCase() === 'REEMBOLSO') {
                descricaoFormatada_4826 += `<span style="font-weight: bold; font-stretch: condensed;">ANTECIPAÇÃO EM ${cartaoCredito_4751.toUpperCase()}${relevanteimposto_2947 === 'Sim' ? '<b style="font-size: 0.675rem;"> (IR)</b>' : ''}</span>`;
            } else {
                descricaoFormatada_4826 += `<span style="font-weight: bold; font-stretch: condensed;">${categoria_5294} | ${procedimento_9157} EM ${descricao_6934}${relevanteimposto_2947 === 'Sim' ? '<b style="font-size: 0.675rem;"> (IR)</b>' : ''}</span>`;
            }
        }

        if (filtros1214 !== 'Não mostrar') {
            if (linkDocumentoFiscal_6391 && termosDoServico_2947) {
                descricaoFormatada_4826 += `<a class="hidden" style="font-size: 0.59375rem; margin-top: 0px; margin-bottom: 0px; font-stretch: condensed;" ${linkHref_8539}><b><br>TERMOS DO SERVIÇO</b></a><a style="font-size: 0.59375rem; margin-top: 0px; margin-bottom: 0px; font-stretch: condensed;"><b> | </b></a><a style="font-size: 0.59375rem; margin-top: 0px; margin-bottom: 0px; font-stretch: condensed;" ${linkFiscalHref_6831}><b>| DOCUMENTO FISCAL</b></a>`;
            } else if (linkDocumentoFiscal_6391 && !termosDoServico_2947) {
                descricaoFormatada_4826 += `<a class="hidden" style="font-size: 0.59375rem; margin-top: 0px; margin-bottom: 0px; font-stretch: condensed;" ${linkFiscalHref_6831}><b><br>DOCUMENTO FISCAL</b></a>`;
            } else if (!linkDocumentoFiscal_6391 && termosDoServico_2947) {
                descricaoFormatada_4826 += `<a class="hidden" style="font-size: 0.59375rem; margin-top: 0px; margin-bottom: 0px; font-stretch: condensed;" ${linkTermosHref_4926}><b><br>TERMOS DO SERVIÇO</b></a>`;
            }
        }

        if (observacoes_8305) {
            descricaoFormatada_4826 += `<p style="font-size: 0.71875rem; margin-top: 4px; margin-bottom: 0px; font-stretch: condensed;">${observacoes_8305}</p>`;
        }
        if (operador_1853 === undefined || observacoes_8305) {
            descricaoFormatada_4826 += `<p style="font-size: 0.75rem; margin-top: 0px; margin-bottom: 1px; font-stretch: condensed;"></p>`;
        }
    }
    return descricaoFormatada_4826;
}

function gerarNome_8206(linha_9248, colunasTabela_5719, tabela_8402) {
    let nomeFormatado_5938;
    if (tabela_8402 === 'Transações com Saldo') {
        const operacao_7294 = linha_9248[colunasTabela_5719['Operação']];
        const procedimento_9157 = linha_9248[colunasTabela_5719['Procedimento']];
        const contaOrigem_6284 = linha_9248[colunasTabela_5719['Conta de Origem']];
        const contaDestino_9502 = linha_9248[colunasTabela_5719['Conta de Destino']];

        if (procedimento_9157 === 'Movimentação entre Contas') {
            nomeFormatado_5938 = `${contaOrigem_6284} para ${contaDestino_9502}`;
        } else if (operacao_7294 === 'Crédito') {
            nomeFormatado_5938 = contaDestino_9502;
        } else {
            nomeFormatado_5938 = contaOrigem_6284;
        }
    } else {
        const cartao_7519 = linha_9248[colunasTabela_5719['Cartão de Crédito']];
        const lancamento_4936 = linha_9248[colunasTabela_5719['Lançamento']];
        const qtdParcelas_8614 = linha_9248[colunasTabela_5719['Quantidade de Parcelas']];
        const parcelamento_2847 = linha_9248[colunasTabela_5719['Parcelamento']];

        if (parcelamento_2847 === "Sim") {
            nomeFormatado_5938 = `${cartao_7519}<br><p style="font-size: 0.59375rem; margin-top: 0px; margin-bottom: 1px; font-stretch: condensed;">Lançamento com ${qtdParcelas_8614} parcelas em ${lancamento_4936}</p>`;
        } else {
            nomeFormatado_5938 = `${cartao_7519}<br><p style="font-size: 0.59375rem; margin-top: 0px; margin-bottom: 1px; font-stretch: condensed;">Lançamento em ${lancamento_4936}</p>`;
        }
    }
    return nomeFormatado_5938;
}

function formatarValor_7529(valor_8391) {
    let valorFormatado_4916;
    if (valor_8391 !== undefined && valor_8391 !== null) {
        try {
            const numero_6283 = Number(valor_8391);

            if (isNaN(numero_6283)) {
                return '';
            }

            valorFormatado_4916 = numero_6283.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });

        } catch (error_5829) {
            valorFormatado_4916 = '';
        }
    } else {
        valorFormatado_4916 = '';
    }
    return valorFormatado_4916;
}

function getFileCache_5431() {
    const cache_7429 = CacheService.getScriptCache();
    let fileCache_7426 = cache_7429.get('fileCache');

    if (fileCache_7426) {
        try {
            fileCache_7426 = JSON.parse(fileCache_7426);
            return fileCache_7426;
        } catch (e) {
            fileCache_7426 = {};
        }
    } else {
        fileCache_7426 = {};
    }

    const rootFolderName_8531 = "Gestão de Finanças Pessoais";
    let rootFolder_4927 = DriveApp.getRootFolder();
    let folders_6810 = rootFolder_4927.getFoldersByName(rootFolderName_8531);

    if (!folders_6810.hasNext()) {
        return fileCache_7426;
    }

    let targetRootFolder_9305 = folders_6810.next();

    function searchFolder_2749(folder_5821, currentPath_8306) {
        let files_9517 = folder_5821.getFiles();
        while (files_9517.hasNext()) {
            let file_4829 = files_9517.next();
            let filePath_6294 = currentPath_8306 + "/" + file_4829.getName();
            fileCache_7426[filePath_6294] = file_4829.getUrl();
        }

        let subfolders_7429 = folder_5821.getFolders();
        while (subfolders_7429.hasNext()) {
            let subfolder_8530 = subfolders_7429.next();
            let newPath_9167 = currentPath_8306 + "/" + subfolder_8530.getName();
            searchFolder_2749(subfolder_8530, newPath_9167);
        }
    }

    searchFolder_2749(targetRootFolder_9305, "/" + rootFolderName_8531);

    try {
        cache_7429.put('fileCache', JSON.stringify(fileCache_7426), 21600);
    } catch (e) {
        console.error("Erro ao armazenar fileCache no cache:", e);
    }

    return fileCache_7426;
}

function enviarParaAPI_5433(html_7301, subject_1239 = undefined) {
    const secretToken_9462 = secrettoken_id();
    const encodedToken_4729 = Utilities.base64EncodeWebSafe(secretToken_9462);

    const now_5820 = new Date();
    const formattedDate_6194 = Utilities.formatDate(now_5820, Session.getTimeZone(), 'dd/MM');
    const formattedTime_8352 = Utilities.formatDate(now_5820, Session.getTimeZone(), 'HH:mm');
    let subject_2846 = `Seu Relatório de Transações chegou (${formattedDate_6194} às ${formattedTime_8352})`;

    if (subject_1239) {
        subject_2846 = subject_1239
    }

    const recipient_7924 = "murilosr@outlook.com.br";
    const senderemail_4815 = "relatorios@transacoes.class-one.com.br ";
    const sendername_9270 = "Controle de Transações";

    const result_6395 = sendEmailWithMailerSend(encodedToken_4729, html_7301, subject_2846, recipient_7924, senderemail_4815, sendername_9270);

    if (result_6395.status === "sucesso") {

    } else {
        console.log('Erro ao enviar e-mail: ' + result_6395.message);
        if (result_6395.message.includes("Token de autenticação inválido")) {
        }
    }
}

function doPost(e) {
    const startTime = new Date();
    const tokenpadrao_7419 = secrettoken_id();

    const params_5937 = e.parameter;
    const tempo_4826 = validarParametro_5243(params_5937.tempo);
    const tipo_9157 = validarParametro_5243(params_5937.tipo);
    const operador_6385 = validarParametro_5243(params_5937.operador);
    const datainicial_2847 = validarParametro_5243(params_5937.datainicial);
    const datafinal_7429 = validarParametro_5243(params_5937.datafinal);
    const cartaoCredito_5930 = validarParametro_5243(params_5937.cartaoCredito);
    const contaFinanceira_4692 = validarParametro_5243(params_5937.contaFinanceira);
    const descricao_9571 = validarParametro_5243(params_5937.descricao);
    const procedimentoSaldo_3916 = validarParametro_5243(params_5937.procedimentoSaldo);
    const procedimentoCartao_8205 = validarParametro_5243(params_5937.procedimentoCartao);
    const idRecorrencia_4719 = validarParametro_5243(params_5937.idRecorrencia);
    const categoria_6832 = validarParametro_5243(params_5937.categoria);
    const status_5729 = validarParametro_5243(params_5937.status);
    const relevanteImpostoRenda_2916 = validarParametro_5243(params_5937.relevanteImpostoRenda);
    const operacaoSaldo_8429 = validarParametro_5243(params_5937.operacaoSaldo);
    const lancamentocartao_3233 = validarParametro_5243(params_5937.lancamentocartao);
    const filtros1214 = validarParametro_5243(params_5937.filtros);
    const tokenrecebido_6295 = params_5937.token;
    const parcelas_2321 = validarParametro_5243(params_5937.parcelamento);
    const qtdeparcelas_2143 = validarParametro_5243(params_5937.qtdeparcelas);
    const gerarInsights_1144 = validarParametro_5243(params_5937.recomendacoes);
    const insightgerado_1134 = validarParametro_5243(params_5937.insightgerado);
    const imprimir_7639 = true;

    const ss_8371 = SpreadsheetApp.openById(spreedsheet_id());
    const sheets_2847 = {
        'Transações com Saldo': ss_8371.getSheetByName('Transações com Saldo'),
        'Transações com Cartão de Crédito': ss_8371.getSheetByName('Transações com Cartão de Crédito')
    };


    const colunas_9158 = {
        'Transações com Saldo': {
            'ID': 0, 'Procedimento': 1, 'Operação': 2, 'Descrição': 3, 'Categoria - Crédito': 4,
            'Categoria - Débito': 5, 'Status': 6, 'Operador': 7, 'Data de Registro': 8,
            'Horário de Registro': 9, 'Programado': 10, 'Data Programada': 11,
            'Horário Programado': 12, 'Data de Efetivação': 13, 'Horário da Efetivação': 14,
            'Mês da Transação': 15, 'Ano da Transação': 16, 'Conta de Origem': 17,
            'Tipo de Conta de Origem': 18, 'Conta de Destino': 19, 'Tipo de Conta de Destino': 20,
            'Valor Base': 21, 'Taxas ou Impostos': 22, 'Sub-Total': 23, 'Total Efetivo': 24, 'Termos do Serviço': 25,
            'Documento Comprobatório': 26, 'Link do Documento Fiscal': 27, 'Observações': 28,
            'Relevante para Imposto de Renda': 29, 'Registro de Atualização': 30,
            'Última Atualização': 31, 'ID de Recorrência': 32
        },
        'Transações com Cartão de Crédito': {
            'ID': 0, 'Procedimento': 1, 'Descrição': 2, 'Categoria': 3, 'Status': 4, 'Operador': 5,
            'Data de Registro': 6, 'Horário de Registro': 7, 'Programado': 8, 'Data Programada': 9,
            'Horário Programado': 10, 'Data de Efetivação': 11, 'Horário da Efetivação': 12,
            'Lançamento Indicativo': 13, 'Indicativo de Mês': 14, 'Mês da Transação': 15,
            'Indicativo de Ano': 16, 'Ano da Transação': 17, 'Parcelamento': 18,
            'Quantidade de Parcelas': 19, 'Lançamento': 20, 'Cartão de Crédito': 21,
            'Valor Base': 22, 'Taxas ou Impostos': 23, 'Sub-Total': 24, 'Total Efetivo': 25,
            'Valor Individual/Parcela': 26, 'Termos do Serviço': 27, 'Documento Comprobatório': 28,
            'Link do Documento Fiscal': 29, 'Observações': 30,
            'Relevante para Imposto de Renda': 31, 'Registro de Atualização': 32,
            'Última Atualização': 33, 'ID da Recorrência': 34
        }
    };

    const dadosSaldo = lerDadosPlanilha(sheets_2847['Transações com Saldo']);
    const dadosCartao = lerDadosPlanilha(sheets_2847['Transações com Cartão de Crédito']);

    const totalLinhas = dadosSaldo.length + dadosCartao.length;
    const minBatchSize = 25;
    const maxBatchSize = 250;
    const batchSize = Math.min(maxBatchSize, Math.max(minBatchSize, Math.round(totalLinhas * 0.15)));


    try {
        if (tokenrecebido_6295 !== tokenpadrao_7419) {
            throw new Error('O token não corresponde.');
        }
        if (!tempo_4826 && !datainicial_2847 && !datafinal_7429) {
            throw new Error('Parâmetros "tempo_4826", "datainicial_2847" e "datafinal_7429" não podem ser preenchidos simultaneamente.');
        }
        if (datainicial_2847 === undefined && datafinal_7429 === undefined && !(/^(\d+\s*dias?|\d+\s*dia|Último Mês|Último Ano|Tudo)$/i.test(tempo_4826))) {
            throw new Error('Parâmetro "tempo_4826" inválido.');
        }
        if (!['Cartão de Crédito e Saldo', 'Cartão de Crédito', 'Saldo'].includes(tipo_9157)) {
            throw new Error('Parâmetro "tipo_9157" inválido.');
        }

        let htmlFinal_5839;

        if (tempo_4826 === 'Último Mês') {
            const condicaodegeracao_6291 = "Segmentado";

            const dataHoje = new Date();
            const ultimoMes = new Date(dataHoje.getFullYear(), dataHoje.getMonth() - 1, 1);
            const mesAnoUltimoMes_3523 = ultimoMes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(' de ', '/').replace(/^(.)/, (letra) => letra.toUpperCase());

            let dadosFiltradosCCRealizadas = [];
            for (let i = 0; i < dadosCartao.length; i += batchSize) {
                const batch = dadosCartao.slice(i, i + batchSize);
                dadosFiltradosCCRealizadas = dadosFiltradosCCRealizadas.concat(filtrarDados_8532(dadosSaldo, batch, colunas_9158, tempo_4826, 'Cartão de Crédito', operador_6385, datainicial_2847, datafinal_7429, cartaoCredito_5930, contaFinanceira_4692, descricao_9571, procedimentoSaldo_3916, procedimentoCartao_8205, idRecorrencia_4719, categoria_6832, status_5729, relevanteImpostoRenda_2916, operacaoSaldo_8429, mesAnoUltimoMes_3523, condicaodegeracao_6291, parcelas_2321, qtdeparcelas_2143, 'Filtro de Incidência'));
            }

            const dadosOrdenadosCCRealizadas = ordenarDados_2497(dadosFiltradosCCRealizadas, colunas_9158);
            const htmlCCRealizadas = gerarHTML_3618(dadosOrdenadosCCRealizadas, colunas_9158, 'Cartão de Crédito', tempo_4826, operador_6385, datainicial_2847, datafinal_7429, cartaoCredito_5930, contaFinanceira_4692, imprimir_7639, lancamentocartao_3233, condicaodegeracao_6291, procedimentoSaldo_3916, procedimentoCartao_8205, idRecorrencia_4719, categoria_6832, status_5729, relevanteImpostoRenda_2916, descricao_9571, operacaoSaldo_8429, filtros1214, parcelas_2321, qtdeparcelas_2143, undefined, undefined, mesAnoUltimoMes_3523);

            let dadosFiltradosCCIncidentes = [];
            for (let i = 0; i < dadosCartao.length; i += batchSize) {
                const batch = dadosCartao.slice(i, i + batchSize);
                dadosFiltradosCCIncidentes = dadosFiltradosCCIncidentes.concat(filtrarDados_8532(dadosSaldo, batch, colunas_9158, 'Antes e Durante Último Mês', 'Cartão de Crédito', operador_6385, datainicial_2847, datafinal_7429, cartaoCredito_5930, contaFinanceira_4692, descricao_9571, procedimentoSaldo_3916, procedimentoCartao_8205, idRecorrencia_4719, categoria_6832, status_5729, relevanteImpostoRenda_2916, operacaoSaldo_8429, mesAnoUltimoMes_3523, condicaodegeracao_6291, parcelas_2321, qtdeparcelas_2143));
            }

            const dadosOrdenadosCCIncidentes = ordenarDados_2497(dadosFiltradosCCIncidentes, colunas_9158);
            const htmlCCIncidentes = gerarHTML_3618(dadosOrdenadosCCIncidentes, colunas_9158, 'Cartão de Crédito', tempo_4826, operador_6385, datainicial_2847, datafinal_7429, cartaoCredito_5930, contaFinanceira_4692, imprimir_7639, lancamentocartao_3233, condicaodegeracao_6291, procedimentoSaldo_3916, procedimentoCartao_8205, idRecorrencia_4719, categoria_6832, status_5729, relevanteImpostoRenda_2916, descricao_9571, operacaoSaldo_8429, filtros1214, parcelas_2321, qtdeparcelas_2143, undefined, undefined, mesAnoUltimoMes_3523, 'Incidentes');

            let dadosFiltradosSaldo_8532 = [];
            for (let i = 0; i < dadosSaldo.length; i += batchSize) {
                const batch = dadosSaldo.slice(i, i + batchSize);
                dadosFiltradosSaldo_8532 = dadosFiltradosSaldo_8532.concat(filtrarDados_8532(batch, dadosCartao, colunas_9158, tempo_4826, 'Saldo', operador_6385, datainicial_2847, datafinal_7429, cartaoCredito_5930, contaFinanceira_4692, descricao_9571, procedimentoSaldo_3916, procedimentoCartao_8205, idRecorrencia_4719, categoria_6832, status_5729, relevanteImpostoRenda_2916, operacaoSaldo_8429, lancamentocartao_3233, condicaodegeracao_6291, parcelas_2321, qtdeparcelas_2143));
            }


            const dadosOrdenadosSaldo_5927 = ordenarDados_2497(dadosFiltradosSaldo_8532, colunas_9158);
            const htmlSaldo_4826 = gerarHTML_3618(dadosOrdenadosSaldo_5927, colunas_9158, 'Saldo', tempo_4826, operador_6385, datainicial_2847, datafinal_7429, cartaoCredito_5930, contaFinanceira_4692, imprimir_7639, lancamentocartao_3233, condicaodegeracao_6291, procedimentoSaldo_3916, procedimentoCartao_8205, idRecorrencia_4719, categoria_6832, status_5729, relevanteImpostoRenda_2916, descricao_9571, operacaoSaldo_8429, filtros1214, parcelas_2321, qtdeparcelas_2143);

            const conjuntohtml_6935 = gerarHTMLconjunto_5291(htmlCCRealizadas, htmlCCIncidentes, htmlSaldo_4826, imprimir_7639, insightgerado_1134);

            htmlFinal_5839 = conjuntohtml_6935;

        } else {
            const condicaodegeracao_9173 = "Normal";

            let dadosFiltrados_7428 = [];

            for (let i = 0; i < dadosSaldo.length; i += batchSize) {
                const saldoBatch = dadosSaldo.slice(i, i + batchSize);
                dadosFiltrados_7428 = dadosFiltrados_7428.concat(filtrarDados_8532(saldoBatch, [], colunas_9158, tempo_4826, tipo_9157, operador_6385, datainicial_2847, datafinal_7429, cartaoCredito_5930, contaFinanceira_4692, descricao_9571, procedimentoSaldo_3916, procedimentoCartao_8205, idRecorrencia_4719, categoria_6832, status_5729, relevanteImpostoRenda_2916, operacaoSaldo_8429, lancamentocartao_3233, condicaodegeracao_9173, parcelas_2321, qtdeparcelas_2143));
            }

            for (let i = 0; i < dadosCartao.length; i += batchSize) {
                const cartaoBatch = dadosCartao.slice(i, i + batchSize);
                dadosFiltrados_7428 = dadosFiltrados_7428.concat(filtrarDados_8532([], cartaoBatch, colunas_9158, tempo_4826, tipo_9157, operador_6385, datainicial_2847, datafinal_7429, cartaoCredito_5930, contaFinanceira_4692, descricao_9571, procedimentoSaldo_3916, procedimentoCartao_8205, idRecorrencia_4719, categoria_6832, status_5729, relevanteImpostoRenda_2916, operacaoSaldo_8429, lancamentocartao_3233, condicaodegeracao_9173, parcelas_2321, qtdeparcelas_2143));
            }


            const dadosOrdenados_4936 = ordenarDados_2497(dadosFiltrados_7428, colunas_9158);
            const html_5728 = gerarHTML_3618(dadosOrdenados_4936, colunas_9158, tipo_9157, tempo_4826, operador_6385, datainicial_2847, datafinal_7429, cartaoCredito_5930, contaFinanceira_4692, imprimir_7639, lancamentocartao_3233, condicaodegeracao_9173, procedimentoSaldo_3916, procedimentoCartao_8205, idRecorrencia_4719, categoria_6832, status_5729, relevanteImpostoRenda_2916, descricao_9571, operacaoSaldo_8429, filtros1214, parcelas_2321, qtdeparcelas_2143, gerarInsights_1144, insightgerado_1134);
            htmlFinal_5839 = html_5728;
        }


        return ContentService.createTextOutput(htmlFinal_5839).setMimeType(ContentService.MimeType.HTML);

    } catch (e) {
        const errorResponse_8294 = "MENSAGEM DE ERRO: " + e.message + " | Valor de Tipo: " + tipo_9157 + " | Valor de Tempo: " + tempo_4826 + " | Valor do Operador: " + operador_6385 + " | Valor da Data Inicial: " + datainicial_2847 + " | Valor da Data Final: " + datafinal_7429 + " | Valor do Cartão de Crédito: " + cartaoCredito_5930 + " | Valor da Conta Financeira: " + contaFinanceira_4692 + " | Valor da Descrição: " + descricao_9571 + " | Valor de Procedimento para Saldo: " + procedimentoSaldo_3916 + " | Valor de Procedimento para Cartão de Crédito: " + procedimentoCartao_8205 + " | Valor do ID da Recorrência: " + idRecorrencia_4719 + " | Valor da Categoria: " + categoria_6832 + " | Valor do Status: " + status_5729 + " | Valor do Relevante para Imposto de Renda: " + relevanteImpostoRenda_2916 + " | Valor da Operação para Saldo: " + operacaoSaldo_8429 + " | Valor de Lançamento: " + lancamentocartao_3233 + " | Valor de Parcelamento: " + parcelas_2321 + " | Valor de Quantidade de Parcelas: " + qtdeparcelas_2143;
        return ContentService.createTextOutput(errorResponse_8294).setMimeType(ContentService.MimeType.TEXT);
    } finally {
        const endTime = new Date();
        const executionTime = endTime - startTime;
        const minutes = Math.floor(executionTime / 60000);
        const seconds = Math.floor((executionTime % 60000) / 1000);
        const milliseconds = executionTime % 1000;
        console.log(`[doPost] Tempo de execução: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`);
    }

    function lerDadosPlanilha(sheet) {
        const cabecalhoRow_7519 = 1;
        const linhaDados_4982 = cabecalhoRow_7519 + 1;
        const ultimaLinha_8306 = sheet.getLastRow();
        const ultimaColuna_9274 = sheet.getLastColumn();

        if (ultimaLinha_8306 < linhaDados_4982) {
            return [];
        }

        const range = sheet.getRange(linhaDados_4982, 1, ultimaLinha_8306 - cabecalhoRow_7519, ultimaColuna_9274);
        return range.getValues();
    }
}

function doGet() {
    return ContentService.createTextOutput('ACESSO NÃO PERMITIDO.').setMimeType(ContentService.MimeType.TEXT);
}

function validarParametro_5243(valor_9582) {
    const valorValidado_6294 = (valor_9582 === "" || valor_9582 === null) ? undefined : valor_9582;
    return valorValidado_6294;
}

function obterValorBaseParcelamento_2412(idtransacao_2432, mesdelancamento_2431) {
    const spreadsheet_6248 = SpreadsheetApp.openById(spreedsheet_id());
    const sheet_9527 = spreadsheet_6248.getSheetByName('Parcelamentos no Cartão de Crédito');
    if (!sheet_9527) {
        throw new Error("Planilha 'Parcelamentos no Cartão de Crédito' não encontrada.");
    }

    const colunas_1495 = {
        'Parcelamentos no Cartão de Crédito': {
            'ID': 0, 'ID da Transação': 1, 'Parcela': 2, 'Data de Efetivação': 3, 'Horário da Efetivação': 4,'Lançamento': 5, 'Cartão de Crédito': 6, 'Valor Base': 7, 'Valor Efetivo': 8, 'Observações': 9
        }
    };

    const ultimaLinha_8306 = sheet_9527.getLastRow();
    const cabecalhoRow_7519 = 1;
    const linhaDados_4982 = cabecalhoRow_7519 + 1;
    if (ultimaLinha_8306 < linhaDados_4982) {
        throw new Error("A planilha 'Parcelamentos no Cartão de Crédito' está vazia.");
    }

    const totalLinhas_3957 = ultimaLinha_8306 - cabecalhoRow_7519;
    const minBatchSize_6283 = 25;
    const maxBatchSize_9158 = 250;
    const batchSize_7492 = Math.min(maxBatchSize_9158, Math.max(minBatchSize_6283, Math.round(totalLinhas_3957 * 0.15)));
    const numColunas_4827 = sheet_9527.getLastColumn();

    let correspondenciasEncontradas_6391 = 0;

    for (let i = linhaDados_4982; i <= ultimaLinha_8306; i += batchSize_7492) {
        const currentBatchSize_8205 = Math.min(batchSize_7492, ultimaLinha_8306 - i + 1);
        const range_4691 = sheet_9527.getRange(i, 1, currentBatchSize_8205, numColunas_4827);
        const values_2916 = range_4691.getValues();

        for (let j = 0; j < values_2916.length; j++) {
            const linha_5729 = values_2916[j];
            if (linha_5729[colunas_1495['Parcelamentos no Cartão de Crédito']['ID da Transação']] === idtransacao_2432 &&
                linha_5729[colunas_1495['Parcelamentos no Cartão de Crédito']['Lançamento']] === mesdelancamento_2431) {

                correspondenciasEncontradas_6391++;
                if (correspondenciasEncontradas_6391 > 1) {
                    throw new Error(`Mais de uma correspondência encontrada para ID da Transação ${idtransacao_2432} e Lançamento ${mesdelancamento_2431} na planilha 'Parcelamentos no Cartão de Crédito'.`);
                }

                const valorBase_7429 = parseFloat(linha_5729[colunas_1495['Parcelamentos no Cartão de Crédito']['Valor Base']]);
                if (isNaN(valorBase_7429)) {
                    throw new Error(`Valor Base inválido encontrado para ID da Transação ${idtransacao_2432} e Lançamento ${mesdelancamento_2431} na planilha 'Parcelamentos no Cartão de Crédito'.`);
                }
                return valorBase_7429;
            }
        }
    }
    if (correspondenciasEncontradas_6391 === 0) {
        throw new Error(`Nenhuma correspondência encontrada para ID da Transação ${idtransacao_2432} e Lançamento ${mesdelancamento_2431} na planilha 'Parcelamentos no Cartão de Crédito'.`);
    }

}

function encurtarUrlBase64_4829(str_6390) {
    const utf8Bytes_2847 = Utilities.newBlob(str_6390, "text/plain", "temp").getBytes();
    const base64String_5117 = url_transacoes() + Utilities.base64EncodeWebSafe(utf8Bytes_2847);
    const workerURL = worker_url();
    const apiToken = secrettoken_id();
    const short = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const payload = {
        "metodo": "adicao",
        "short": short,
        "long": base64String_5117,
        "token": apiToken
    };

    const options = {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(payload),
        'muteHttpExceptions': true
    };

    try {
        const response = UrlFetchApp.fetch(workerURL, options);
        const responseCode = response.getResponseCode();
        console.log(responseCode)

        if (responseCode >= 200 && responseCode < 300) {
            return response.getContentText();
        } else {
            return base64String_5117;
        }
    } catch (e) {
        console.log('Erro' + e)
        return base64String_5117;
    }
}

function gerarMensalmente_4325() {
    gerarRelatorio_4752('Último Mês', 'Cartão de Crédito e Saldo')
}