function processarParcelamento_7394(id_2412) {
    const startTime_8254 = new Date();
    const spreadsheetId_9571 = spreedsheet_id();

    const sheets_5721 = {
        'Transacoes': SpreadsheetApp.openById(spreadsheetId_9571).getSheetByName('Transações com Cartão de Crédito'),
        'Parcelamentos': SpreadsheetApp.openById(spreadsheetId_9571).getSheetByName('Parcelamentos no Cartão de Crédito')
    };

    const colunas_1495 = {
        'Transacoes': {
            'ID': 0, 'Procedimento': 1, 'Descricao': 2, 'Categoria': 3, 'Status': 4, 'Operador': 5,
            'DataRegistro': 6, 'HorarioRegistro': 7, 'Programado': 8, 'DataProgramada': 9,
            'HorarioProgramado': 10, 'DataEfetivacao': 11, 'HorarioEfetivacao': 12,
            'LancamentoIndicativo': 13, 'IndicativoMes': 14, 'MesTransacao': 15,
            'IndicativoAno': 16, 'AnoTransacao': 17, 'Parcelamento': 18,
            'QuantidadeParcelas': 19, 'Lancamento': 20, 'CartaoCredito': 21,
            'ValorBase': 22, 'TaxasImpostos': 23, 'SubTotal': 24, 'TotalEfetivo': 25,
            'ValorIndividualParcela': 26, 'TermosServico': 27, 'DocumentoComprobatorio': 28,
            'LinkDocumentoFiscal': 29, 'Observacoes': 30,
            'RelevanteImpostoRenda': 31, 'RegistroAtualizacao': 32,
            'UltimaAtualizacao': 33, 'IDRecorrencia': 34
        },
        'Parcelamentos': {
            'ID': 0, 'IDTransacao': 1, 'Parcela': 2, 'Lancamento': 3, 'CartaoCredito': 4,
            'ValorBase': 5, 'ValorEfetivo': 6, 'Observacoes': 7
        }
    };

    const transacoesIds_3852 = sheets_5721.Transacoes.getRange(1, colunas_1495.Transacoes.ID + 1, sheets_5721.Transacoes.getLastRow()).getValues().flat();
    const transacaoIndex_5285 = transacoesIds_3852.indexOf(id_2412);

    if (transacaoIndex_5285 === -1) {
        const allParcelamentos_3853 = sheets_5721.Parcelamentos.getDataRange().getValues();
        const indicesParaExcluir_9374 = allParcelamentos_3853
            .map((row, index) => row[colunas_1495.Parcelamentos.IDTransacao] === id_2412 ? index + 1 : -1)
            .filter(row => row !== -1)
            .sort((a, b) => b - a);

        let linhasExcluidas_3957 = 0;
        if (indicesParaExcluir_9374.length > 0) {
            const batchSizeDelete_7392 = Math.min(Math.max(Math.round(indicesParaExcluir_9374.length * 0.25), 25), 250);
            for (let i = 0; i < indicesParaExcluir_9374.length; i += batchSizeDelete_7392) {
                const batch_9374 = indicesParaExcluir_9374.slice(i, i + batchSizeDelete_7392);
                batch_9374.forEach(linha => {
                    sheets_5721.Parcelamentos.deleteRow(linha);
                    linhasExcluidas_3957++;
                });
            }
        }
        return;
    }

    const row_8531 = transacaoIndex_5285 + 1;
    const transacaoRange_9642 = sheets_5721.Transacoes.getRange(row_8531, 1, 1, sheets_5721.Transacoes.getLastColumn());
    const transacaoValues_7392 = transacaoRange_9642.getValues()[0];

    const parcelamento_9834 = transacaoValues_7392[colunas_1495.Transacoes.Parcelamento];
    const quantidadeParcelas_2947 = transacaoValues_7392[colunas_1495.Transacoes.QuantidadeParcelas];
    const lancamento_8561 = transacaoValues_7392[colunas_1495.Transacoes.Lancamento];
    const valorIndividualParcela_6384 = transacaoValues_7392[colunas_1495.Transacoes.ValorIndividualParcela];
    const cartaoCredito_5294 = transacaoValues_7392[colunas_1495.Transacoes.CartaoCredito];

    const allParcelamentos_3853 = sheets_5721.Parcelamentos.getDataRange().getValues();

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
                row[colunas_1495.Parcelamentos.IDTransacao] === id_2412 &&
                row[colunas_1495.Parcelamentos.Parcela] === parcelaNum_9473
            );

            if (parcelamentoExistente_8474) {
                const linha_4733 = allParcelamentos_3853.findIndex(row =>
                    row[colunas_1495.Parcelamentos.ID] === parcelamentoExistente_8474[colunas_1495.Parcelamentos.ID]
                );

                const updateParcelamento_2847 = [
                    parcelamentoExistente_8474[colunas_1495.Parcelamentos.ID],
                    id_2412,
                    parcelaNum_9473,
                    mesAno_9647,
                    cartaoCredito_5294,
                    -valorIndividualParcela_6384,
                    valorIndividualParcela_6384,
                    parcelamentoExistente_8474[colunas_1495.Parcelamentos.Observacoes]
                ];

                sheets_5721.Parcelamentos.getRange(linha_4733 + 1, 1, 1, updateParcelamento_2847.length).setValues([updateParcelamento_2847]);
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
                    const lastRow_7539 = sheets_5721.Parcelamentos.getLastRow();
                    sheets_5721.Parcelamentos.getRange(lastRow_7539 + 1, 1, dadosParaInserir_7492.length, dadosParaInserir_7492[0].length).setValues(dadosParaInserir_7492);
                    dadosParaInserir_7492 = [];
                }
            }
        }

        if (dadosParaInserir_7492.length > 0) {
            const lastRow_7539 = sheets_5721.Parcelamentos.getLastRow();
            sheets_5721.Parcelamentos.getRange(lastRow_7539 + 1, 1, dadosParaInserir_7492.length, dadosParaInserir_7492[0].length).setValues(dadosParaInserir_7492);
        }

        const parcelasExcedentes_3852 = allParcelamentos_3853
            .filter(row => row[colunas_1495.Parcelamentos.IDTransacao] === id_2412)
            .filter(row => row[colunas_1495.Parcelamentos.Parcela] > numParcelas_8529)
            .map(row => allParcelamentos_3853.indexOf(row) + 1)
            .sort((a, b) => b - a);

        if (parcelasExcedentes_3852.length > 0) {
            const batchSizeDelete_7392 = Math.min(Math.max(Math.round(parcelasExcedentes_3852.length * 0.25), 25), 250);
            for (let i = 0; i < parcelasExcedentes_3852.length; i += batchSizeDelete_7392) {
                const batch_9374 = parcelasExcedentes_3852.slice(i, i + batchSizeDelete_7392);
                batch_9374.forEach(linha => sheets_5721.Parcelamentos.deleteRow(linha));
            }
        }
    }

    if (parcelamento_9834 === 'Não') {
        const indicesParaExcluir_9374 = allParcelamentos_3853
            .map((row, index) => row[colunas_1495.Parcelamentos.IDTransacao] === id_2412 ? index + 1 : -1)
            .filter(row => row !== -1)
            .sort((a, b) => b - a);

        let linhasExcluidas_3957 = 0;
        if (indicesParaExcluir_9374.length > 0) {
            const batchSizeDelete_7392 = Math.min(Math.max(Math.round(indicesParaExcluir_9374.length * 0.25), 25), 250);
            for (let i = 0; i < indicesParaExcluir_9374.length; i += batchSizeDelete_7392) {
                const batch_9374 = indicesParaExcluir_9374.slice(i, i + batchSizeDelete_7392);
                batch_9374.forEach(linha => {
                    sheets_5721.Parcelamentos.deleteRow(linha);
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