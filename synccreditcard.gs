function verificar_ativador_externo_8765(gatilho_appsheet_9512) {
    if (gatilho_appsheet_9512) {
        sincronizarDadosEntreTabelas_7891()
    }
}

function sincronizarDadosEntreTabelas_7891() {
    const transacoesSheetName_2357 = "Transações com Saldo";
    const faturasSheetName_9876 = "Faturas de Cartões de Crédito";
    const startTime_3579 = new Date();
    const datadehoje_8642 = Utilities.formatDate(new Date(), "GMT-3", "dd/MM/yyyy");
    const horariodeagora_7531 = Utilities.formatDate(new Date(), "GMT-3", "HH:mm:ss");
    const spreadsheet_6248 = SpreadsheetApp.openById(spreedsheet_id());
    const transacoesSheet_9571 = spreadsheet_6248.getSheetByName(transacoesSheetName_2357);
    const faturasSheet_1598 = spreadsheet_6248.getSheetByName(faturasSheetName_9876);
    const transacoesData_3185 = transacoesSheet_9571.getDataRange().getValues();
    const faturasData_7532 = faturasSheet_1598.getDataRange().getValues();
    const today_6548 = new Date();
    today_6548.setHours(0, 0, 0, 0);

    const faturasFiltradas_3597 = faturasData_7532.filter((row, index) => {
        if (index === 0) {
            return true;
        }

        const vencimento_2468 = row[7];
        return vencimento_2468 >= today_6548;
    });

    const transacoesFiltradas_2369 = transacoesData_3185.filter((row, index) => {
        if (index === 0) {
            return true;
        }

        const status_5874 = row[6];
        const id_4512 = row[0];
        return status_5874 !== "Efetuado" || id_4512.includes("F");
    });

    const ids_para_remover_3156 = new Set();
    const linhas_para_atualizar_7485 = [];
    const linhas_para_inserir_6392 = [];
    const linhas_para_excluir_2148 = [];

    faturasFiltradas_3597.forEach((faturaRow, index) => {
        if (index === 0) {
            return;
        }

        const valor_2589 = parseFloat(faturaRow[11]);
        const id_fatura_1478 = faturaRow[0];

        if (valor_2589 < 0.01) {
            ids_para_remover_3156.add(id_fatura_1478);
        }
    });

    const idsComF_9513 = new Set();
    const linhasParaRemover_2649 = new Set();

    for (let i_4785 = transacoesFiltradas_2369.length - 1; i_4785 > 0; i_4785--) {
        const row_6542 = transacoesFiltradas_2369[i_4785];
        const id_4258 = row_6542[0];

        if (id_4258.includes("F")) {
            if (idsComF_9513.has(id_4258)) {
                linhasParaRemover_2649.add(i_4785);
            } else {
                idsComF_9513.add(id_4258);
            }
        }
    }

    linhasParaRemover_2649.forEach(index => {
        transacoesFiltradas_2369.splice(index, 1);
    });

    const faturasIds_1597 = faturasFiltradas_3597.map(row => row[0]);

    faturasFiltradas_3597.forEach((faturaRow, index) => {
        if (index === 0) {
            return;
        }

        const id_fatura_3698 = faturaRow[0];
        const nomeCartao_6359 = faturaRow[1];
        const instituicaoFinanceira_1578 = faturaRow[2];
        const formaPagamento_2469 = faturaRow[3];
        const fechamentoFatura_9871 = converterParaData_4259(faturaRow[6]);
        const vencimentoFatura_7412 = converterParaData_4259(faturaRow[7]);

        function converterParaData_4259(valor) {
            if (typeof valor === 'string') {
                if (valor.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                    const partes_3652 = valor.split('/');
                    return new Date(partes_3652[2], partes_3652[1] - 1, partes_3652[0]);
                } else {
                    return new Date(valor);
                }
            } else if (valor instanceof Date) {
                return valor;
            } else {
                return null;
            }
        }

        const mesReferencia_5931 = faturaRow[8];
        const anoReferencia_7593 = faturaRow[9];
        const mesAnoReferencia_2684 = faturaRow[10];
        const valorFatura_3571 = parseFloat(faturaRow[11]);
        const arquivoFatura_5271 = faturaRow[12]
        const registroFatura_6893 = faturaRow[13];
        const ultimaFatura_4279 = faturaRow[14];

        let transacaoEncontrada_5698 = false;

        for (let i_7589 = 1; i_7589 < transacoesFiltradas_2369.length; i_7589++) {
            const transacaoRow_1587 = transacoesFiltradas_2369[i_7589];
            const id_transacao_7582 = transacaoRow_1587[0];

            function normalizarHora(parametro) {
                let data;

                if (typeof parametro === 'string') {
                    data = new Date(parametro);

                    if (isNaN(data.getTime())) {
                        const partes = parametro.match(/(\d{2}):(\d{2}):(\d{2})/);
                        if (partes) {
                            return parametro;
                        } else {
                            return null;
                        }
                    }
                } else if (parametro instanceof Date) {
                    data = parametro;
                } else {
                    return null;
                }

                const hora = data.getHours().toString().padStart(2, '0');
                const minuto = data.getMinutes().toString().padStart(2, '0');
                const segundo = data.getSeconds().toString().padStart(2, '0');
                const horaFormatada = `${hora}:${minuto}:${segundo}`;

                return horaFormatada;
            }

            if (id_transacao_7582.includes("F") && id_transacao_7582 === id_fatura_3698) {
                transacaoEncontrada_5698 = true;
                const atualizacoes_3579 = {};
                let precisaAtualizar_1579 = false;
                const linhaTemporaria_4587 = [...transacaoRow_1587];

                if (transacaoRow_1587[6] === "Pendente") {
                    if (transacaoRow_1587[3] !== `Fatura (${nomeCartao_6359})`) {
                        atualizacoes_3579.coluna4 = `Fatura (${nomeCartao_6359})`;
                        precisaAtualizar_1579 = true;
                    }

                    if (transacaoRow_1587[6] !== "Pendente") {
                        atualizacoes_3579.coluna7 = "Pendente";
                        precisaAtualizar_1579 = true;
                    }

                    if (
                        transacaoRow_1587[11].getDate() !== vencimentoFatura_7412.getDate() ||
                        transacaoRow_1587[11].getMonth() !== vencimentoFatura_7412.getMonth() ||
                        transacaoRow_1587[11].getFullYear() !== vencimentoFatura_7412.getFullYear()
                    ) {
                        atualizacoes_3579.coluna12 = vencimentoFatura_7412;
                        precisaAtualizar_1579 = true;
                    }

                    if (normalizarHora(transacaoRow_1587[12]) !== (formaPagamento_2469 === "Débito Automático" ? "04:00:00" : "14:00:00")) {
                        atualizacoes_3579.coluna13 = formaPagamento_2469 === "Débito Automático" ? "04:00:00" : "14:00:00";
                        precisaAtualizar_1579 = true;
                    }

                    if (
                        transacaoRow_1587[13].getDate() !== vencimentoFatura_7412.getDate() ||
                        transacaoRow_1587[13].getMonth() !== vencimentoFatura_7412.getMonth() ||
                        transacaoRow_1587[13].getFullYear() !== vencimentoFatura_7412.getFullYear()
                    ) {
                        atualizacoes_3579.coluna14 = vencimentoFatura_7412;
                        precisaAtualizar_1579 = true;
                    }

                    if (normalizarHora(transacaoRow_1587[14]) !== (formaPagamento_2469 === "Débito Automático" ? "04:00:00" : "14:00:00")) {
                        atualizacoes_3579.coluna15 = formaPagamento_2469 === "Débito Automático" ? "04:00:00" : "14:00:00";
                        precisaAtualizar_1579 = true;
                    }

                    if (transacaoRow_1587[15] !== mesReferencia_5931) {
                        atualizacoes_3579.coluna16 = mesReferencia_5931;
                        precisaAtualizar_1579 = true;
                    }

                    if (transacaoRow_1587[16] !== anoReferencia_7593) {
                        atualizacoes_3579.coluna17 = anoReferencia_7593;
                        precisaAtualizar_1579 = true;
                    }

                    if (parseFloat(transacaoRow_1587[21]) !== parseFloat(valorFatura_3571)) {
                        atualizacoes_3579.coluna22 = valorFatura_3571;
                        precisaAtualizar_1579 = true;
                    }

                    if (parseFloat(transacaoRow_1587[22]) !== parseFloat(0.00)) {
                        atualizacoes_3579.coluna23 = 0.00;
                        precisaAtualizar_1579 = true;
                    }

                    if (parseFloat(transacaoRow_1587[23]) !== parseFloat(valorFatura_3571)) {
                        atualizacoes_3579.coluna24 = valorFatura_3571;
                        precisaAtualizar_1579 = true;
                    }

                    if (parseFloat(transacaoRow_1587[24]) !== parseFloat(-valorFatura_3571)) {
                        atualizacoes_3579.coluna25 = -valorFatura_3571;
                        precisaAtualizar_1579 = true;
                    }

                    if (transacaoRow_1587[25] !== arquivoFatura_5271) {
                        atualizacoes_3579.coluna26 = arquivoFatura_5271;
                        precisaAtualizar_1579 = true;
                    }

                    if (transacaoRow_1587[29] !== "Não") {
                        atualizacoes_3579.coluna30 = "Não";
                        precisaAtualizar_1579 = true;
                    }

                    if (transacaoRow_1587[30] !== registroFatura_6893) {
                        atualizacoes_3579.coluna31 = registroFatura_6893;
                        precisaAtualizar_1579 = true;
                    }

                    if (transacaoRow_1587[31] !== ultimaFatura_4279) {
                        atualizacoes_3579.coluna32 = ultimaFatura_4279;
                        precisaAtualizar_1579 = true;
                    }

                    if (precisaAtualizar_1579) {
                        for (const key_9516 in atualizacoes_3579) {
                            const colIndex_8532 = parseInt(key_9516.replace("coluna", "")) - 1;
                            linhaTemporaria_4587[colIndex_8532] = atualizacoes_3579[key_9516];
                        }

                        linhas_para_atualizar_7485.push({
                            index: transacoesData_3185.findIndex((row) => row[0] === id_transacao_7582) + 1,
                            values: linhaTemporaria_4587,
                        });

                        const dataVencimentoFormatada_2365 = Utilities.formatDate(vencimentoFatura_7412, "GMT-3", "dd/MM/yyyy");
                        const dataHojeFormatada_3587 = Utilities.formatDate(today_6548, "GMT-3", "dd/MM/yyyy");
                        const dataFechamentoformatada_9875 = Utilities.formatDate(fechamentoFatura_9871, "GMT-3", "dd/MM/yyyy");
                        const descricaoEvento_7591 = `Fatura referente a ${mesAnoReferencia_2684}, com fechamento em ${dataFechamentoformatada_9875}`;
                        const tituloEvento_6598 = `Pagamento de Fatura em ${nomeCartao_6359}`;

                        if (dataVencimentoFormatada_2365 !== Utilities.formatDate(transacaoRow_1587[11], "GMT-3", "dd/MM/yyyy")) {

                            if (dataVencimentoFormatada_2365 === dataHojeFormatada_3587) {
                                criarouatualizareventodehoje_9876(dataVencimentoFormatada_2365, id_fatura_3698, descricaoEvento_7591, tituloEvento_6598, "14:00");
                            } else {
                                criarouatualizarcalendarioevento_5278(dataVencimentoFormatada_2365, id_fatura_3698, descricaoEvento_7591, tituloEvento_6598, "14:00");
                            }
                        }
                    }
                }
                break;
            }
        }

        if (!transacaoEncontrada_5698 && valorFatura_3571 >= 0.01) {
            const novaLinha_5896 = [];
            novaLinha_5896[0] = id_fatura_3698;
            novaLinha_5896[1] = formaPagamento_2469 === "Débito Automático" ? "Pagamento - Débito Automático" : formaPagamento_2469 === "Boleto Bancário" ? "Pagamento - Boleto" : "Pagamento - Outros Tipos";
            novaLinha_5896[2] = "Débito";
            novaLinha_5896[3] = `Fatura (${nomeCartao_6359})`;
            novaLinha_5896[5] = "Despesa - Pagamento de Fatura";
            novaLinha_5896[6] = "Pendente";
            novaLinha_5896[7] = "Murilo Souza Ramos";
            novaLinha_5896[8] = datadehoje_8642;
            novaLinha_5896[9] = horariodeagora_7531;
            novaLinha_5896[10] = "Sim";
            novaLinha_5896[11] = vencimentoFatura_7412;
            novaLinha_5896[12] = formaPagamento_2469 === "Débito Automático" ? "04:00:00" : "14:00:00";
            novaLinha_5896[13] = vencimentoFatura_7412;
            novaLinha_5896[14] = formaPagamento_2469 === "Débito Automático" ? "04:00:00" : "14:00:00";
            novaLinha_5896[15] = mesReferencia_5931;
            novaLinha_5896[16] = anoReferencia_7593;
            novaLinha_5896[17] = instituicaoFinanceira_1578;
            novaLinha_5896[18] = "Movimentação";
            novaLinha_5896[21] = valorFatura_3571;
            novaLinha_5896[22] = 0.00;
            novaLinha_5896[23] = valorFatura_3571;
            novaLinha_5896[24] = -valorFatura_3571;
            novaLinha_5896[25] = arquivoFatura_5271;
            novaLinha_5896[29] = "Não";
            novaLinha_5896[30] = registroFatura_6893;
            novaLinha_5896[31] = ultimaFatura_4279;

            linhas_para_inserir_6392.push(novaLinha_5896);

            const dataVencimentoFormatada_9874 = Utilities.formatDate(vencimentoFatura_7412, "GMT-3", "dd/MM/yyyy");
            const dataHojeFormatada_6541 = Utilities.formatDate(today_6548, "GMT-3", "dd/MM/yyyy");
            const dataFechamentoformatada_3578 = Utilities.formatDate(fechamentoFatura_9871, "GMT-3", "dd/MM/yyyy");
            const descricaoEvento_2589 = `Fatura referente a ${mesAnoReferencia_2684}, com fechamento em ${dataFechamentoformatada_3578}`;
            const tituloEvento_8593 = `Pagamento de Fatura em ${nomeCartao_6359}`;

            if (dataVencimentoFormatada_9874 === dataHojeFormatada_6541) {
                criarouatualizareventodehoje_9876(dataVencimentoFormatada_9874, id_fatura_3698, descricaoEvento_2589, tituloEvento_8593, "14:00");
            } else {
                criarouatualizarcalendarioevento_5278(dataVencimentoFormatada_9874, id_fatura_3698, descricaoEvento_2589, tituloEvento_8593, tituloEvento_8593, "14:00");
            }
        }
    });

    for (let i_7536 = transacoesFiltradas_2369.length - 1; i_7536 > 0; i_7536--) {
        const transacaoRow_6259 = transacoesFiltradas_2369[i_7536];
        const id_transacao_5896 = transacaoRow_6259[0];
        const status_9531 = transacaoRow_6259[6];

        if (id_transacao_5896.includes("F")) {
            if (ids_para_remover_3156.has(id_transacao_5896) || !faturasIds_1597.includes(id_transacao_5896)) {
                if (status_9531 !== "Efetuado") {
                    linhas_para_excluir_2148.push(transacoesData_3185.findIndex(row => row[0] === id_transacao_5896) + 1);
                }
            }
        }
    }

    if (linhas_para_atualizar_7485.length > 0) {
        linhas_para_atualizar_7485.forEach(({ index, values }) => {
            transacoesSheet_9571.getRange(index, 1, 1, values.length).setValues([values]);
        });
    }

    if (linhas_para_inserir_6392.length > 0) {
        const lastRow_5397 = transacoesSheet_9571.getLastRow();

        if (linhas_para_inserir_6392.length > 0) {
            transacoesSheet_9571.insertRowsAfter(lastRow_5397, linhas_para_inserir_6392.length);
            const range_3591 = transacoesSheet_9571.getRange(lastRow_5397 + 1, 1, linhas_para_inserir_6392.length, linhas_para_inserir_6392[0].length);
            range_3591.setValues(linhas_para_inserir_6392);
        }
    }

    if (linhas_para_excluir_2148.length > 0) {
        const linhasParaExcluir_6497 = [...new Set(linhas_para_excluir_2148)].sort((a, b) => b - a);

        linhasParaExcluir_6497.forEach(index => {
            const id_linha_excluida_8571 = transacoesSheet_9571.getRange(index, 1).getValue();
            transacoesSheet_9571.getRange(index, 1, 1, transacoesSheet_9571.getLastColumn()).clearContent();

            if (id_linha_excluida_8571.includes("F")) {
                deletareventoporidentificador_4739(id_linha_excluida_8571);
            }
        });
    }

    SpreadsheetApp.flush();

    const endTime_2468 = new Date();
    const totalTime_6589 = endTime_2468 - startTime_3579;
    const formattedTime_9821 = formatDuration_2957(totalTime_6589);

    function formatDuration_2957(milliseconds) {
        let seconds = Math.floor(milliseconds / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);

        seconds = seconds % 60;
        minutes = minutes % 60;

        return `${pad_7384(hours)}:${pad_7384(minutes)}:${pad_7384(seconds)}`;
    }

    function pad_7384(num) {
        return num.toString().padStart(2, '0');
    }

    processarFaturasEmLote_9253();
}

function processarFaturasEmLote_9253() {
    const spreadsheet_7245 = SpreadsheetApp.openById(spreedsheet_id());
    const faturasSheet_9274 = spreadsheet_7245.getSheetByName("Faturas de Cartões de Crédito");
    const faturasData_5183 = faturasSheet_9274.getDataRange().getValues();
    const numRows_8539 = faturasData_5183.length - 1;
    const batchSize_3947 = Math.max(25, Math.min(250, Math.round(numRows_8539 * 0.15)));

    for (let i_6294 = 1; i_6294 <= numRows_8539; i_6294 += batchSize_3947) {
        const startRow_1835 = i_6294;
        const endRow_7392 = Math.min(i_6294 + batchSize_3947 - 1, numRows_8539);
        const numRowsInBatch_4729 = endRow_7392 - startRow_1835 + 1;
        const range_5287 = faturasSheet_9274.getRange(startRow_1835 + 1, 1, numRowsInBatch_4729, faturasData_5183[0].length);
        const values_9461 = range_5287.getValues();

        for (let j_8351 = 0; j_8351 < values_9461.length; j_8351++) {
            if (values_9461[j_8351][12]) {
                const valorFatura_6294 = values_9461[j_8351][11];
                faturasSheet_9274.getRange(startRow_1835 + 1 + j_8351, 12).setValue(valorFatura_6294);
            }
        }
    }
}