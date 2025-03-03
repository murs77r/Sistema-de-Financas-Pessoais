function executarScript_8529(id_2412) {
    const spreadsheetId_9271 = "ID_DA_SUA_PLANILHA";
    const abaTransacoes_2957 = "Transações com Cartão de Crédito";
    const abaParcelamentos_7351 = "Parcelamentos no Cartão de Crédito";

    const ss_1835 = SpreadsheetApp.openById(spreadsheetId_9271);
    const transacoesSheet_6492 = ss_1835.getSheetByName(abaTransacoes_2957);
    const parcelamentosSheet_4863 = ss_1835.getSheetByName(abaParcelamentos_7351);

    const startTime_8351 = new Date();

    const transacoesIds_5830 = transacoesSheet_6492.getRange("A:A").getValues().flat();
    const rowIndex_3916 = transacoesIds_5830.indexOf(id_2412);

    if (rowIndex_3916 === -1) {
        console.error("ID não encontrado: " + id_2412);
        return;
    }

    const rowData_1583 = transacoesSheet_6492.getRange(rowIndex_3916 + 1, 1, 1, transacoesSheet_6492.getLastColumn()).getValues()[0];
    const idTransacao_8361 = rowData_1583[0];
    const parcelamento_9572 = rowData_1583[17];
    const qtdParcelas_4957 = rowData_1583[18];
    const lancamentos_6391 = rowData_1583[19];
    const valorParcela_8642 = rowData_1583[25];
    const cartaoCredito_2947 = rowData_1583[20];

    const existingIds_9472 = parcelamentosSheet_4863.getRange("B:B").getValues().flat();
    const idExists_5281 = existingIds_9472.includes(id_2412);

    if (idExists_5281) {
        const indices_9648 = [];
        existingIds_9472.forEach((element_7391, index_9753) => {
            if (element_7391 === id_2412) {
                indices_9648.push(index_9753);
            }
        });

        const allParcelamentosData_8362 = parcelamentosSheet_4863.getDataRange().getValues();

        for (let i_7539 = 0; i_7539 < indices_9648.length; i_7539++) {
            let currentIndex_1836 = indices_9648[i_7539];
            let currentRow_9742 = allParcelamentosData_8362[currentIndex_1836];

            const currentParcela_5397 = parseInt(currentRow_9742[2], 10);
            const lancamentoArray_8452 = lancamentos_6391.split(", ");
            const currentLancamento_6834 = lancamentoArray_8452[currentParcela_5397 - 1];

            currentRow_9742[3] = currentLancamento_6834;
            currentRow_9742[4] = cartaoCredito_2947;
            currentRow_9742[5] = valorParcela_8642 * -1;
            currentRow_9742[6] = valorParcela_8642;

            parcelamentosSheet_4863.getRange(currentIndex_1836 + 1, 1, 1, currentRow_9742.length).setValues([currentRow_9742]);
        }
    } else {

        if (parcelamento_9572 === "Sim") {
            const numParcelas_9752 = parseInt(qtdParcelas_4957, 10);
            const lancamentoArray_8452 = lancamentos_6391.split(", ");

            const batchSize_8462 = Math.min(Math.max(Math.round(numParcelas_9752 * 0.15), 25), 250);
            let batchData_1936 = [];

            for (let i_7539 = 1; i_7539 <= numParcelas_9752; i_7539++) {
                const idParcela_6381 = "PAR" + Math.floor(Math.random() * 9000 + 1000) + "-" + Math.floor(Math.random() * 9000 + 1000);
                const currentLancamento_6834 = lancamentoArray_8452[i_7539 - 1];

                batchData_1936.push([
                    idParcela_6381,
                    idTransacao_8361,
                    i_7539,
                    currentLancamento_6834,
                    cartaoCredito_2947,
                    valorParcela_8642 * -1,
                    valorParcela_8642,
                    ""
                ]);

                if (batchData_1936.length === batchSize_8462 || i_7539 === numParcelas_9752) {
                    parcelamentosSheet_4863.appendRows(batchData_1936);
                    batchData_1936 = [];
                }
            }
        }
    }
    const endTime_9472 = new Date();
    const executionTime_2846 = new Date(endTime_9472 - startTime_8351);
    const formattedTime_8539 = formatTime_7395(executionTime_2846);

    console.log("Tempo de execução: " + formattedTime_8539);

    function formatTime_7395(date_6482) {
        const hours_9638 = date_6482.getUTCHours().toString().padStart(2, '0');
        const minutes_5821 = date_6482.getUTCMinutes().toString().padStart(2, '0');
        const seconds_8529 = date_6482.getUTCSeconds().toString().padStart(2, '0');
        return hours_9638 + ":" + minutes_5821 + ":" + seconds_8529;
    }
}