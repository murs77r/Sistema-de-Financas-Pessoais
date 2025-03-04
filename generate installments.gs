function processarParcelamento_7394(id_2412) {
    const startTime_8254 = new Date();

    const spreadsheetId_9571 = spreedsheet_id()

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
        console.log("Transação não encontrada para o ID: " + id_2412);
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
    const existingParcelamentoIndex_8473 = allParcelamentos_3853.findIndex(row => row[colunas_1495.Parcelamentos.IDTransacao] === id_2412);

    if (parcelamento_9834 === 'Sim') {
        const numParcelas_8529 = parseInt(quantidadeParcelas_2947, 10);
        const lancamentos_8572 = lancamento_8561.split(', ');
        const batchSize_9638 = Math.min(Math.max(Math.round(numParcelas_8529 * 0.15), 25), 250);
        let dadosParaInserir_7492 = [];

        if (existingParcelamentoIndex_8473 === -1) {
            for (let i = 0; i < numParcelas_8529; i++) {
                const idParcela_8573 = "PAR" + Math.floor(Math.random() * 9000 + 1000) + "-" + Math.floor(Math.random() * 9000 + 1000);
                const mesAno_9647 = lancamentos_8572[i];
                const newParcelamento_8574 = [
                    idParcela_8573,
                    id_2412,
                    i + 1,
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
            if (dadosParaInserir_7492.length > 0) {
                const lastRow_7539 = sheets_5721.Parcelamentos.getLastRow();
                sheets_5721.Parcelamentos.getRange(lastRow_7539 + 1, 1, dadosParaInserir_7492.length, dadosParaInserir_7492[0].length).setValues(dadosParaInserir_7492);
            }
        }

        if (existingParcelamentoIndex_8473 > -1) {
            let updatedRows_8462 = 0;
            for (let i = 0; i < numParcelas_8529; i++) {
                const idParcela_8573 = allParcelamentos_3853[existingParcelamentoIndex_8473 + i][colunas_1495.Parcelamentos.ID];
                const mesAno_9647 = lancamentos_8572[i];
                const parcelamentoExistente_8474 = allParcelamentos_3853.find(row => row[colunas_1495.Parcelamentos.IDTransacao] === id_2412 && row[colunas_1495.Parcelamentos.Parcela] === i + 1);
                if (parcelamentoExistente_8474) {
                    const linha_4733 = allParcelamentos_3853.indexOf(parcelamentoExistente_8474);
                    const updateParcelamento_2847 = [
                        idParcela_8573,
                        id_2412,
                        i + 1,
                        mesAno_9647,
                        cartaoCredito_5294,
                        -valorIndividualParcela_6384,
                        valorIndividualParcela_6384,
                        parcelamentoExistente_8474[colunas_1495.Parcelamentos.Observacoes]
                    ];
                    if (
                        parcelamentoExistente_8474[colunas_1495.Parcelamentos.ID] !== updateParcelamento_2847[0] ||
                        parcelamentoExistente_8474[colunas_1495.Parcelamentos.IDTransacao] !== updateParcelamento_2847[1] ||
                        parcelamentoExistente_8474[colunas_1495.Parcelamentos.Parcela] !== updateParcelamento_2847[2] ||
                        parcelamentoExistente_8474[colunas_1495.Parcelamentos.Lancamento] !== updateParcelamento_2847[3] ||
                        parcelamentoExistente_8474[colunas_1495.Parcelamentos.CartaoCredito] !== updateParcelamento_2847[4] ||
                        parcelamentoExistente_8474[colunas_1495.Parcelamentos.ValorBase] !== updateParcelamento_2847[5] ||
                        parcelamentoExistente_8474[colunas_1495.Parcelamentos.ValorEfetivo] !== updateParcelamento_2847[6]
                    ) {
                        sheets_5721.Parcelamentos.getRange(linha_4733 + 1, 1, 1, updateParcelamento_2847.length).setValues([updateParcelamento_2847]);
                        updatedRows_8462 = updatedRows_8462 + 1;
                    }
                }

            }
            console.log(updatedRows_8462 + " linha(s) atualizadas")
        }
    }


    if (parcelamento_9834 === 'Não' && existingParcelamentoIndex_8473 !== -1) {
        const indicesParaExcluir_9374 = [];
        for (let i = 0; i < allParcelamentos_3853.length; i++) {
            if (allParcelamentos_3853[i][colunas_1495.Parcelamentos.IDTransacao] === id_2412) {
                indicesParaExcluir_9374.push(i + 1);
            }
        }

        let linhasExcluidas_3957 = 0;
        if (indicesParaExcluir_9374.length > 0) {
            indicesParaExcluir_9374.sort((a, b) => b - a);

            const batchSize_7482 = Math.min(Math.max(Math.round(indicesParaExcluir_9374.length * 0.15), 25), 250);
            let currentBatch_6385 = [];

            for (let i = 0; i < indicesParaExcluir_9374.length; i++) {
                currentBatch_6385.push(indicesParaExcluir_9374[i]);

                if (currentBatch_6385.length >= batchSize_7482) {
                    for (let j = 0; j < currentBatch_6385.length; j++) {
                        sheets_5721.Parcelamentos.deleteRow(currentBatch_6385[j]);
                        linhasExcluidas_3957 = linhasExcluidas_3957 + 1;
                    }
                    currentBatch_6385 = [];
                }
            }
            if (currentBatch_6385.length > 0) {
                for (let j = 0; j < currentBatch_6385.length; j++) {
                    sheets_5721.Parcelamentos.deleteRow(currentBatch_6385[j]);
                    linhasExcluidas_3957 = linhasExcluidas_3957 + 1;
                }
                currentBatch_6385 = [];
            }
        }
        console.log(linhasExcluidas_3957 + " linhas foram excluídas")
    }

    const endTime_9385 = new Date();
    const executionTime_3857 = endTime_9385.getTime() - startTime_8254.getTime();
    const formattedTime_6482 = new Date(executionTime_3857).toISOString().substr(11, 8);
    console.log("Tempo de execução: " + formattedTime_6482);
}