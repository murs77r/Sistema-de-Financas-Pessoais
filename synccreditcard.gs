function verificar_ativador_externo_8765(gatilho_appsheet_9512) {
    Utilities.sleep(15000);
    if (gatilho_appsheet_9512) {
        console.log("Gatilho via Google AppSheet");
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
            'ID': 0, 'Nome do Cartão de Crédito': 1, 'Instituição Financeira': 2, 'Pagamento': 3,
            'Abertura': 4, 'Fechamento': 5, 'Vencimento': 6, 'Mês de Referência': 7,
            'Ano de Referência': 8, 'Mês/Ano de Referência': 9, 'Valor da Fatura': 10,
            'Arquivo da Fatura': 11, 'Registro de Atualização': 12, 'Última Atualização': 13, 'Índice': 13
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
    const today_6548 = new Date();
    today_6548.setDate(0);
    today_6548.setHours(23, 59, 59, 999);

    const numRowsFaturas_1234 = faturasSheet_1598.getDataRange().getValues().length - 1;
    const batchSize_3947 = Math.max(25, Math.min(250, Math.round(numRowsFaturas_1234 * 0.15)));

    let linhas_para_atualizar_7485 = [];
    let linhas_para_inserir_6392 = [];
    let linhas_para_excluir_2148 = [];

    const numRowsTransacoes_9876 = transacoesSheet_9571.getDataRange().getValues().length - 1;
    const batchSizeTransacoes_8765 = Math.max(25, Math.min(250, Math.round(numRowsTransacoes_9876 * 0.15)));
    let transacoesData_3185 = [];

    for (let i_1111 = 1; i_1111 <= numRowsTransacoes_9876; i_1111 += batchSizeTransacoes_8765) {
        const startRowTransacoes_2222 = i_1111;
        const endRowTransacoes_3333 = Math.min(i_1111 + batchSizeTransacoes_8765 - 1, numRowsTransacoes_9876);
        const numRowsInBatchTransacoes_4444 = endRowTransacoes_3333 - startRowTransacoes_2222 + 1;
        const rangeTransacoes_5555 = transacoesSheet_9571.getRange(startRowTransacoes_2222 + 1, 1, numRowsInBatchTransacoes_4444, transacoesSheet_9571.getLastColumn());
        const transacoesBatch_6666 = rangeTransacoes_5555.getValues();

        transacoesData_3185 = transacoesData_3185.concat(transacoesBatch_6666);
    }

    if (transacoesData_3185.length === 0) {
        return;
    }

    const ids_para_remover_3156 = new Set();
    const faturasDataCompleta_7777 = faturasSheet_1598.getDataRange().getValues();
    const faturasFiltradas_3597 = faturasDataCompleta_7777.slice(1)
        .filter(row => {
            const vencimento_2468 = row[colunas_1495['Faturas de Cartões de Crédito']['Vencimento']];
            return vencimento_2468 >= today_6548;
        });

    const faturasIds_1597 = faturasFiltradas_3597.map(row => String(row[colunas_1495['Faturas de Cartões de Crédito']['ID']]).trim());

    faturasFiltradas_3597.forEach((faturaRow, index) => {
        const valor_2589 = parseFloat(faturaRow[colunas_1495['Faturas de Cartões de Crédito']['Valor da Fatura']]);
        const id_fatura_1478 = faturaRow[colunas_1495['Faturas de Cartões de Crédito']['ID']];

        if (valor_2589 < 0.01) {
            ids_para_remover_3156.add(String(id_fatura_1478).trim());
        }
    });


    for (let i_6294 = 1; i_6294 <= numRowsFaturas_1234; i_6294 += batchSize_3947) {
        const startRow_1835 = i_6294;
        const endRow_7392 = Math.min(i_6294 + batchSize_3947 - 1, numRowsFaturas_1234);
        const numRowsInBatch_4729 = endRow_7392 - startRow_1835 + 1;
        const range_5287 = faturasSheet_1598.getRange(startRow_1835 + 1, 1, numRowsInBatch_4729, colunas_1495['Faturas de Cartões de Crédito']['Última Atualização'] + 1);
        const faturasData_5183 = range_5287.getValues();
        const idDoLote_9123 = i_6294;

        faturasData_5183.forEach((faturaRow, index) => {
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
            let transacaoLinha_8567 = null;
            transacaoEncontrada_5698 = false;

            const indicesDuplicatas_9123 = [];
            for (let i = 0; i < transacoesData_3185.length; i++) {
                const transacao = transacoesData_3185[i];
                if (!transacao) {
                    continue;
                }
                if (String(transacao[colunas_1495['Transações com Saldo']['ID']]).trim() === String(id_fatura_3698).trim()) {
                    indicesDuplicatas_9123.push(i);
                }
            }

            let indiceManter_8234 = -1;
            if (indicesDuplicatas_9123.length > 0) {
                indiceManter_8234 = indicesDuplicatas_9123.reduce((maxIndex, currentIndex) => {
                    const linhaTransacaoAtual_7345 = transacoesData_3185[currentIndex];
                    const linhaTransacaoMax_5678 = transacoesData_3185[maxIndex];

                    if (!linhaTransacaoAtual_7345 || !linhaTransacaoMax_5678) {
                        return Math.max(currentIndex, maxIndex);
                    }

                    return transacoesData_3185.indexOf(linhaTransacaoAtual_7345) > transacoesData_3185.indexOf(linhaTransacaoMax_5678) ? currentIndex : maxIndex;
                }, indicesDuplicatas_9123[0]);

                indicesDuplicatas_9123.forEach(indice => {
                    if (indice !== indiceManter_8234) {
                        linhas_para_excluir_2148.push(indice + 2);
                    }
                });
            }

            for (let i_7589 = 0; i_7589 < transacoesData_3185.length; i_7589++) {
                const transacaoRow_1587 = transacoesData_3185[i_7589];

                if (!transacaoRow_1587) {
                    continue;
                }

                const id_transacao_7582 = transacaoRow_1587[colunas_1495['Transações com Saldo']['ID']];


                if (String(id_transacao_7582).trim() === String(id_fatura_3698).trim()) {
                    transacaoEncontrada_5698 = true;
                    transacaoLinha_8567 = transacaoRow_1587;
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
                            if (indiceManter_8234 > -1) {
                                linhas_para_atualizar_7485.push({
                                    index: indiceManter_8234 + 2,
                                    values: linhaTemporaria_4587,
                                });
                            }
                        }
                    }
                    break;
                }
            }

            if (!transacaoEncontrada_5698 && valorFatura_3571 >= 0.01) {
                const novaLinha_5896 = [];
                novaLinha_5896[0] = String(id_fatura_3698).trim();
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

            if (faturaRow[colunas_1495['Faturas de Cartões de Crédito']['Arquivo da Fatura']]) {
                const valorFatura_6294 = faturaRow[colunas_1495['Faturas de Cartões de Crédito']['Valor da Fatura']];
                faturasSheet_1598.getRange(startRow_1835 + index + 1, colunas_1495['Faturas de Cartões de Crédito']['Valor da Fatura'] + 1).setValue(valorFatura_6294);
            }
        });

        for (let i_7536 = 0; i_7536 < transacoesData_3185.length; i_7536++) {
            const transacaoRow_6259 = transacoesData_3185[i_7536];

            if (!transacaoRow_6259) {
                continue;
            }

            const id_transacao_5896 = transacaoRow_6259[colunas_1495['Transações com Saldo']['ID']];
            const status_9531 = transacaoRow_6259[colunas_1495['Transações com Saldo']['Status']];
            const idFaturaTransacao_4567 = String(id_transacao_5896).trim();

            if (idFaturaTransacao_4567.includes("F")) {
                if (ids_para_remover_3156.has(idFaturaTransacao_4567) || !faturasIds_1597.includes(idFaturaTransacao_4567)) {
                    if (status_9531 !== "Efetuado") {
                        linhas_para_excluir_2148.push(i_7536 + 2);
                    }
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
        transacoesSheet_9571.insertRowsAfter(lastRow_5397, linhas_para_inserir_6392.length);
        const range_3591 = transacoesSheet_9571.getRange(lastRow_5397 + 1, 1, linhas_para_inserir_6392.length, linhas_para_inserir_6392[0].length);
        range_3591.setValues(linhas_para_inserir_6392);

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

    Logger.log(`Tempo de execução: ${formattedTime_9821}`);
}