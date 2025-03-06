function processarParcelamento_7394(id_2412) {
    const startTime_8254 = new Date();
    const spreadsheetId_9571 = spreedsheet_id();

    const spreadsheet_6248 = SpreadsheetApp.openById(spreadsheetId_9571);
    const sheets_5721 = {
        'Transações com Cartão de Crédito': spreadsheet_6248.getSheetByName('Transações com Cartão de Crédito'),
        'Parcelamentos no Cartão de Crédito': spreadsheet_6248.getSheetByName('Parcelamentos no Cartão de Crédito')
    };

    const colunas_1495 = {
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
        },
        'Parcelamentos no Cartão de Crédito': {
            'ID': 0, 'ID da Transação': 1, 'Parcela': 2, 'Lançamento': 3, 'Cartão de Crédito': 4,
            'Valor Base': 5, 'Valor Efetivo': 6, 'Observações': 7
        }
    };

    const transacoesIds_3852 = sheets_5721['Transações com Cartão de Crédito'].getRange(1, colunas_1495['Transações com Cartão de Crédito'].ID + 1, sheets_5721['Transações com Cartão de Crédito'].getLastRow()).getValues().flat();
    const transacaoIndex_5285 = transacoesIds_3852.indexOf(id_2412);

    if (transacaoIndex_5285 === -1) {
        const allParcelamentos_3853 = sheets_5721['Parcelamentos no Cartão de Crédito'].getDataRange().getValues();
        const indicesParaExcluir_9374 = allParcelamentos_3853
            .map((row, index) => row[colunas_1495['Parcelamentos no Cartão de Crédito']['ID da Transação']] === id_2412 ? index + 1 : -1)
            .filter(row => row !== -1)
            .sort((a, b) => b - a);

        let linhasExcluidas_3957 = 0;
        if (indicesParaExcluir_9374.length > 0) {
            const batchSizeDelete_7392 = Math.min(Math.max(Math.round(indicesParaExcluir_9374.length * 0.25), 25), 250);
            for (let i = 0; i < indicesParaExcluir_9374.length; i += batchSizeDelete_7392) {
                const batch_9374 = indicesParaExcluir_9374.slice(i, i + batchSizeDelete_7392);
                batch_9374.forEach(linha => {
                    sheets_5721['Parcelamentos no Cartão de Crédito'].deleteRow(linha);
                    linhasExcluidas_3957++;
                });
            }
        }
        return;
    }

    const row_8531 = transacaoIndex_5285 + 1;
    const transacaoRange_9642 = sheets_5721['Transações com Cartão de Crédito'].getRange(row_8531, 1, 1, sheets_5721['Transações com Cartão de Crédito'].getLastColumn());
    const transacaoValues_7392 = transacaoRange_9642.getValues()[0];

    const parcelamento_9834 = transacaoValues_7392[colunas_1495['Transações com Cartão de Crédito'].Parcelamento];
    const quantidadeParcelas_2947 = transacaoValues_7392[colunas_1495['Transações com Cartão de Crédito']['Quantidade de Parcelas']];
    const lancamento_8561 = transacaoValues_7392[colunas_1495['Transações com Cartão de Crédito'].Lançamento];
    const valorIndividualParcela_6384 = transacaoValues_7392[colunas_1495['Transações com Cartão de Crédito']['Valor Individual/Parcela']];
    const cartaoCredito_5294 = transacaoValues_7392[colunas_1495['Transações com Cartão de Crédito']['Cartão de Crédito']];

    const allParcelamentos_3853 = sheets_5721['Parcelamentos no Cartão de Crédito'].getDataRange().getValues();

    if (parcelamento_9834 === 'Sim') {
        const numParcelas_8529 = parseInt(quantidadeParcelas_2947, 10);
        const lancamentos_8572 = lancamento_8561.split(', ').slice(0, numParcelas_8529);
        const batchSize_9638 = Math.min(Math.max(Math.round(numParcelas_8529 * 0.25), 25), 250);
        let dadosParaInserir_7492 = [];
        let updatedRows_8462 = 0;

        for (let i = 0; i < numParcelas_8529; i++) {
            const parcelaNum_9473 = i + 1;
            const mesAno_9647 = lancamentos_8572[i];
            const parcelamentoExistente_8474 = allParcelamentos_3853.find(row =>
                row[colunas_1495['Parcelamentos no Cartão de Crédito']['ID da Transação']] === id_2412 &&
                row[colunas_1495['Parcelamentos no Cartão de Crédito'].Parcela] === parcelaNum_9473
            );

            if (parcelamentoExistente_8474) {
                const linha_4733 = allParcelamentos_3853.findIndex(row =>
                    row[colunas_1495['Parcelamentos no Cartão de Crédito'].ID] === parcelamentoExistente_8474[colunas_1495['Parcelamentos no Cartão de Crédito'].ID]
                );

                const updateParcelamento_2847 = [
                    parcelamentoExistente_8474[colunas_1495['Parcelamentos no Cartão de Crédito'].ID],
                    id_2412,
                    parcelaNum_9473,
                    mesAno_9647,
                    cartaoCredito_5294,
                    -valorIndividualParcela_6384,
                    valorIndividualParcela_6384,
                    parcelamentoExistente_8474[colunas_1495['Parcelamentos no Cartão de Crédito'].Observacoes]
                ];

                sheets_5721['Parcelamentos no Cartão de Crédito'].getRange(linha_4733 + 1, 1, 1, updateParcelamento_2847.length).setValues([updateParcelamento_2847]);
                updatedRows_8462++;
            } else {
                const idParcela_8573 = "PAR" + Math.floor(Math.random() * 9000 + 1000) + "-" + Math.floor(Math.random() * 9000 + 1000);
                const newParcelamento_8574 = [
                    idParcela_8573,
                    id_2412,
                    parcelaNum_9473,
                    mesAno_9647,
                    cartaoCredito_5294,
                    -valorIndividualParcela_6384,
                    valorIndividualParcela_6384,
                    ''
                ];
                dadosParaInserir_7492.push(newParcelamento_8574);

                if (dadosParaInserir_7492.length >= batchSize_9638) {
                    const lastRow_7539 = sheets_5721['Parcelamentos no Cartão de Crédito'].getLastRow();
                    sheets_5721['Parcelamentos no Cartão de Crédito'].getRange(lastRow_7539 + 1, 1, dadosParaInserir_7492.length, dadosParaInserir_7492[0].length).setValues(dadosParaInserir_7492);
                    dadosParaInserir_7492 = [];
                }
            }
        }

        if (dadosParaInserir_7492.length > 0) {
            const lastRow_7539 = sheets_5721['Parcelamentos no Cartão de Crédito'].getLastRow();
            sheets_5721['Parcelamentos no Cartão de Crédito'].getRange(lastRow_7539 + 1, 1, dadosParaInserir_7492.length, dadosParaInserir_7492[0].length).setValues(dadosParaInserir_7492);
        }

        const parcelasExcedentes_3852 = allParcelamentos_3853
            .filter(row => row[colunas_1495['Parcelamentos no Cartão de Crédito']['ID da Transação']] === id_2412)
            .filter(row => row[colunas_1495['Parcelamentos no Cartão de Crédito'].Parcela] > numParcelas_8529)
            .map(row => allParcelamentos_3853.indexOf(row) + 1)
            .sort((a, b) => b - a);

        if (parcelasExcedentes_3852.length > 0) {
            const batchSizeDelete_7392 = Math.min(Math.max(Math.round(parcelasExcedentes_3852.length * 0.25), 25), 250);
            for (let i = 0; i < parcelasExcedentes_3852.length; i += batchSizeDelete_7392) {
                const batch_9374 = parcelasExcedentes_3852.slice(i, i + batchSizeDelete_7392);
                batch_9374.forEach(linha => sheets_5721['Parcelamentos no Cartão de Crédito'].deleteRow(linha));
            }
        }
    }

    if (parcelamento_9834 === 'Não') {
        const indicesParaExcluir_9374 = allParcelamentos_3853
            .map((row, index) => row[colunas_1495['Parcelamentos no Cartão de Crédito']['ID da Transação']] === id_2412 ? index + 1 : -1)
            .filter(row => row !== -1)
            .sort((a, b) => b - a);

        let linhasExcluidas_3957 = 0;
        if (indicesParaExcluir_9374.length > 0) {
            const batchSizeDelete_7392 = Math.min(Math.max(Math.round(indicesParaExcluir_9374.length * 0.25), 25), 250);
            for (let i = 0; i < indicesParaExcluir_9374.length; i += batchSizeDelete_7392) {
                const batch_9374 = indicesParaExcluir_9374.slice(i, i + batchSizeDelete_7392);
                batch_9374.forEach(linha => {
                    sheets_5721['Parcelamentos no Cartão de Crédito'].deleteRow(linha);
                    linhasExcluidas_3957++;
                });
            }
        }
    }

    const endTime_9385 = new Date();
    const executionTime_3857 = endTime_9385.getTime() - startTime_8254.getTime();
    const formattedTime_6482 = new Date(executionTime_3857).toISOString().substr(11, 8);
    console.log("Tempo de execução: " + formattedTime_6482);
}