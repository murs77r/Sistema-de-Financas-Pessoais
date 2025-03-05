function verificar_ativador_externo_8765(gatilho_appsheet_9512) {
    if (gatilho_appsheet_9512) {
        sincronizarDadosEntreTabelas_7891()
    }
}

function sincronizarDadosEntreTabelas_7891() {
    const spreadsheet_6248 = SpreadsheetApp.openById(spreedsheet_id());

    const sheets_5721 = {
        'Transações com Saldo': spreadsheet_6248.getSheetByName('Transações com Saldo'),
        'Faturas de Cartões de Crédito': spreadsheet_6248.getSheetByName('Faturas de Cartões de Crédito')
    };

    const colunas_1495 = {
        'Faturas de Cartões de Crédito': {
            'ID': 0, 'Nome do Cartão de Crédito': 1, 'Instituição Financeira': 2, 'Pagamento': 3, 'Correção': 4,
            'Abertura': 5, 'Fechamento': 6, 'Vencimento': 7, 'Mês de Referência': 8,
            'Ano de Referência': 9, 'Mês/Ano de Referência': 10, 'Valor da Fatura': 11,
            'Arquivo da Fatura': 12, 'Registro de Atualização': 13, 'Última Atualização': 14
        },
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

    const startTime_3579 = new Date();
    const datadehoje_8642 = Utilities.formatDate(new Date(), "GMT-3", "dd/MM/yyyy");
    const horariodeagora_7531 = Utilities.formatDate(new Date(), "GMT-3", "HH:mm:ss");
    const transacoesSheet_9571 = sheets_5721['Transações com Saldo'];
    const faturasSheet_1598 = sheets_5721['Faturas de Cartões de Crédito'];
    const transacoesData_3185 = transacoesSheet_9571.getDataRange().getValues();
    const faturasData_7532 = faturasSheet_1598.getDataRange().getValues();
    const today_6548 = new Date();
    today_6548.setHours(0, 0, 0, 0);

    const faturasFiltradas_3597 = faturasData_7532.filter((row, index) => {
        if (index === 0) {
            return true;
        }

        const vencimento_2468 = row[colunas_1495['Faturas de Cartões de Crédito']['Vencimento']];
        return vencimento_2468 >= today_6548;
    });

    const transacoesFiltradas_2369 = transacoesData_3185.filter((row, index) => {
        if (index === 0) {
            return true;
        }

        const status_5874 = row[colunas_1495['Transações com Saldo']['Status']];
        const id_4512 = row[colunas_1495['Transações com Saldo']['ID']];
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

        const valor_2589 = parseFloat(faturaRow[colunas_1495['Faturas de Cartões de Crédito']['Valor da Fatura']]);
        const id_fatura_1478 = faturaRow[colunas_1495['Faturas de Cartões de Crédito']['ID']];

        if (valor_2589 < 0.01) {
            ids_para_remover_3156.add(id_fatura_1478);
        }
    });

    const idsComF_9513 = new Set();
    const linhasParaRemover_2649 = new Set();

    for (let i_4785 = transacoesFiltradas_2369.length - 1; i_4785 > 0; i_4785--) {
        const row_6542 = transacoesFiltradas_2369[i_4785];
        const id_4258 = row_6542[colunas_1495['Transações com Saldo']['ID']];

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

    const faturasIds_1597 = faturasFiltradas_3597.map(row => row[colunas_1495['Faturas de Cartões de Crédito']['ID']]);

    faturasFiltradas_3597.forEach((faturaRow, index) => {
        if (index === 0) {
            return;
        }

        const id_fatura_3698 = faturaRow[colunas_1495['Faturas de Cartões de Crédito']['ID']];
        const nomeCartao_6359 = faturaRow[colunas_1495['Faturas de Cartões de Crédito']['Nome do Cartão de Crédito']];
        const instituicaoFinanceira_1578 = faturaRow[colunas_1495['Faturas de Cartões de Crédito']['Instituição Financeira']];
        const formaPagamento_2469 = faturaRow[colunas_1495['Faturas de Cartões de Crédito']['Pagamento']];
        const fechamentoFatura_9871 = converterParaData_4259(faturaRow[colunas_1495['Faturas de Cartões de Crédito']['Fechamento']]);
        const vencimentoFatura_7412 = converterParaData_4259(faturaRow[colunas_1495['Faturas de Cartões de Crédito']['Vencimento']]);

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

        const mesReferencia_5931 = faturaRow[colunas_1495['Faturas de Cartões de Crédito']['Mês de Referência']];
        const anoReferencia_7593 = faturaRow[colunas_1495['Faturas de Cartões de Crédito']['Ano de Referência']];
        const mesAnoReferencia_2684 = faturaRow[colunas_1495['Faturas de Cartões de Crédito']['Mês/Ano de Referência']];
        const valorFatura_3571 = parseFloat(faturaRow[colunas_1495['Faturas de Cartões de Crédito']['Valor da Fatura']]);
        const arquivoFatura_5271 = faturaRow[colunas_1495['Faturas de Cartões de Crédito']['Arquivo da Fatura']];
        const registroFatura_6893 = faturaRow[colunas_1495['Faturas de Cartões de Crédito']['Registro de Atualização']];
        const ultimaFatura_4279 = faturaRow[colunas_1495['Faturas de Cartões de Crédito']['Última Atualização']];

        let transacaoEncontrada_5698 = false;

        for (let i_7589 = 1; i_7589 < transacoesFiltradas_2369.length; i_7589++) {
            const transacaoRow_1587 = transacoesFiltradas_2369[i_7589];
            const id_transacao_7582 = transacaoRow_1587[colunas_1495['Transações com Saldo']['ID']];

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

                if (transacaoRow_1587[colunas_1495['Transações com Saldo']['Status']] === "Pendente") {
                    if (transacaoRow_1587[colunas_1495['Transações com Saldo']['Descrição']] !== `Fatura (${nomeCartao_6359})`) {
                        atualizacoes_3579.coluna4 = `Fatura (${nomeCartao_6359})`;
                        precisaAtualizar_1579 = true;
                    }

                    if (transacaoRow_1587[colunas_1495['Transações com Saldo']['Status']] !== "Pendente") {
                        atualizacoes_3579.coluna7 = "Pendente";
                        precisaAtualizar_1579 = true;
                    }

                    if (
                        transacaoRow_1587[colunas_1495['Transações com Saldo']['Data Programada']].getDate() !== vencimentoFatura_7412.getDate() ||
                        transacaoRow_1587[colunas_1495['Transações com Saldo']['Data Programada']].getMonth() !== vencimentoFatura_7412.getMonth() ||
                        transacaoRow_1587[colunas_1495['Transações com Saldo']['Data Programada']].getFullYear() !== vencimentoFatura_7412.getFullYear()
                    ) {
                        atualizacoes_3579.coluna12 = vencimentoFatura_7412;
                        precisaAtualizar_1579 = true;
                    }

                    if (normalizarHora(transacaoRow_1587[colunas_1495['Transações com Saldo']['Horário Programado']]) !== (formaPagamento_2469 === "Débito Automático" ? "04:00:00" : "14:00:00")) {
                        atualizacoes_3579.coluna13 = formaPagamento_2469 === "Débito Automático" ? "04:00:00" : "14:00:00";
                        precisaAtualizar_1579 = true;
                    }

                    if (
                        transacaoRow_1587[colunas_1495['Transações com Saldo']['Data de Efetivação']].getDate() !== vencimentoFatura_7412.getDate() ||
                        transacaoRow_1587[colunas_1495['Transações com Saldo']['Data de Efetivação']].getMonth() !== vencimentoFatura_7412.getMonth() ||
                        transacaoRow_1587[colunas_1495['Transações com Saldo']['Data de Efetivação']].getFullYear() !== vencimentoFatura_7412.getFullYear()
                    ) {
                        atualizacoes_3579.coluna14 = vencimentoFatura_7412;
                        precisaAtualizar_1579 = true;
                    }

                    if (normalizarHora(transacaoRow_1587[colunas_1495['Transações com Saldo']['Horário da Efetivação']]) !== (formaPagamento_2469 === "Débito Automático" ? "04:00:00" : "14:00:00")) {
                        atualizacoes_3579.coluna15 = formaPagamento_2469 === "Débito Automático" ? "04:00:00" : "14:00:00";
                        precisaAtualizar_1579 = true;
                    }

                    if (transacaoRow_1587[colunas_1495['Transações com Saldo']['Mês da Transação']] !== mesReferencia_5931) {
                        atualizacoes_3579.coluna16 = mesReferencia_5931;
                        precisaAtualizar_1579 = true;
                    }

                    if (transacaoRow_1587[colunas_1495['Transações com Saldo']['Ano da Transação']] !== anoReferencia_7593) {
                        atualizacoes_3579.coluna17 = anoReferencia_7593;
                        precisaAtualizar_1579 = true;
                    }

                    if (parseFloat(transacaoRow_1587[colunas_1495['Transações com Saldo']['Valor Base']]) !== parseFloat(valorFatura_3571)) {
                        atualizacoes_3579.coluna22 = valorFatura_3571;
                        precisaAtualizar_1579 = true;
                    }

                    if (parseFloat(transacaoRow_1587[colunas_1495['Transações com Saldo']['Taxas ou Impostos']]) !== parseFloat(0.00)) {
                        atualizacoes_3579.coluna23 = 0.00;
                        precisaAtualizar_1579 = true;
                    }

                    if (parseFloat(transacaoRow_1587[colunas_1495['Transações com Saldo']['Sub-Total']]) !== parseFloat(valorFatura_3571)) {
                        atualizacoes_3579.coluna24 = valorFatura_3571;
                        precisaAtualizar_1579 = true;
                    }

                    if (parseFloat(transacaoRow_1587[colunas_1495['Transações com Saldo']['Total Efetivo']]) !== parseFloat(-valorFatura_3571)) {
                        atualizacoes_3579.coluna25 = -valorFatura_3571;
                        precisaAtualizar_1579 = true;
                    }

                    if (transacaoRow_1587[colunas_1495['Transações com Saldo']['Termos do Serviço']] !== arquivoFatura_5271) {
                        atualizacoes_3579.coluna26 = arquivoFatura_5271;
                        precisaAtualizar_1579 = true;
                    }

                    if (transacaoRow_1587[colunas_1495['Transações com Saldo']['Relevante para Imposto de Renda']] !== "Não") {
                        atualizacoes_3579.coluna30 = "Não";
                        precisaAtualizar_1579 = true;
                    }

                    if (transacaoRow_1587[colunas_1495['Transações com Saldo']['Registro de Atualização']] !== registroFatura_6893) {
                        atualizacoes_3579.coluna31 = registroFatura_6893;
                        precisaAtualizar_1579 = true;
                    }

                    if (transacaoRow_1587[colunas_1495['Transações com Saldo']['Última Atualização']] !== ultimaFatura_4279) {
                        atualizacoes_3579.coluna32 = ultimaFatura_4279;
                        precisaAtualizar_1579 = true;
                    }

                    if (precisaAtualizar_1579) {
                        for (const key_9516 in atualizacoes_3579) {
                            const colIndex_8532 = parseInt(key_9516.replace("coluna", "")) - 1;
                            linhaTemporaria_4587[colIndex_8532] = atualizacoes_3579[key_9516];
                        }

                        linhas_para_atualizar_7485.push({
                            index: transacoesData_3185.findIndex((row) => row[colunas_1495['Transações com Saldo']['ID']] === id_transacao_7582) + 1,
                            values: linhaTemporaria_4587,
                        });

                        const dataVencimentoFormatada_2365 = Utilities.formatDate(vencimentoFatura_7412, "GMT-3", "dd/MM/yyyy");
                        const dataHojeFormatada_3587 = Utilities.formatDate(today_6548, "GMT-3", "dd/MM/yyyy");
                        const dataFechamentoformatada_9875 = Utilities.formatDate(fechamentoFatura_9871, "GMT-3", "dd/MM/yyyy");
                        const descricaoEvento_7591 = `Fatura referente a ${mesAnoReferencia_2684}, com fechamento em ${dataFechamentoformatada_9875}`;
                        const tituloEvento_6598 = `Pagamento de Fatura em ${nomeCartao_6359}`;

                        if (dataVencimentoFormatada_2365 !== Utilities.formatDate(transacaoRow_1587[colunas_1495['Transações com Saldo']['Data Programada']], "GMT-3", "dd/MM/yyyy")) {

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
                criarouatualizarcalendarioevento_5278(dataVencimentoFormatada_9874, id_fatura_3698, descricaoEvento_2589, tituloEvento_8593, "14:00");
            }
        }
    });

    for (let i_7536 = transacoesFiltradas_2369.length - 1; i_7536 > 0; i_7536--) {
        const transacaoRow_6259 = transacoesFiltradas_2369[i_7536];
        const id_transacao_5896 = transacaoRow_6259[colunas_1495['Transações com Saldo']['ID']];
        const status_9531 = transacaoRow_6259[colunas_1495['Transações com Saldo']['Status']];

        if (id_transacao_5896.includes("F")) {
            if (ids_para_remover_3156.has(id_transacao_5896) || !faturasIds_1597.includes(id_transacao_5896)) {
                if (status_9531 !== "Efetuado") {
                    linhas_para_excluir_2148.push(transacoesData_3185.findIndex(row => row[colunas_1495['Transações com Saldo']['ID']] === id_transacao_5896) + 1);
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

    const sheets_5721 = {
        'Faturas de Cartões de Crédito': spreadsheet_7245.getSheetByName('Faturas de Cartões de Crédito')
    };

    const colunas_1495 = {
        'Faturas de Cartões de Crédito': {
            'ID': 0, 'Nome do Cartão de Crédito': 1, 'Instituição Financeira': 2, 'Pagamento': 3, 'Correção': 4,
            'Abertura': 5, 'Fechamento': 6, 'Vencimento': 7, 'Mês de Referência': 8,
            'Ano de Referência': 9, 'Mês/Ano de Referência': 10, 'Valor da Fatura': 11,
            'Arquivo da Fatura': 12, 'Registro de Atualização': 13, 'Última Atualização': 14
        }
    };
    const faturasSheet_9274 = sheets_5721['Faturas de Cartões de Crédito'];
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
            if (values_9461[j_8351][colunas_1495['Faturas de Cartões de Crédito']['Arquivo da Fatura']]) {
                const valorFatura_6294 = values_9461[j_8351][colunas_1495['Faturas de Cartões de Crédito']['Valor da Fatura']];
                faturasSheet_9274.getRange(startRow_1835 + 1 + j_8351, colunas_1495['Faturas de Cartões de Crédito']['Valor da Fatura'] + 1).setValue(valorFatura_6294);
            }
        }
    }
}