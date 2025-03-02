function verificar_ativador_externo_8765(gatilho_appsheet_9512) {
    console.log("verificar_ativador_externo_8765: Iniciando verificação do gatilho...");

    if (gatilho_appsheet_9512) {
        console.log("verificar_ativador_externo_8765: Gatilho via Google AppSheet detectado!");
        sincronizarDadosEntreTabelas_7891()
    } else {
        console.log("verificar_ativador_externo_8765: Gatilho via Google AppSheet não detectado.");
    }

    console.log("verificar_ativador_externo_8765: Verificação do gatilho concluída.");
}

function sincronizarDadosEntreTabelas_7891() {
    const transacoesSheetName_2357 = "Transações com Saldo";
    const faturasSheetName_9876 = "Faturas de Cartões de Crédito";

    console.log("sincronizarDadosEntreTabelas_7891: Iniciando o processo de sincronização...");

    const startTime_3579 = new Date();
    let tempoEtapa_1593;

    const datadehoje_8642 = Utilities.formatDate(new Date(), "GMT-3", "dd/MM/yyyy");
    const horariodeagora_7531 = Utilities.formatDate(new Date(), "GMT-3", "HH:mm:ss");

    tempoEtapa_1593 = new Date();
    console.log("sincronizarDadosEntreTabelas_7891: 1. Iniciando a leitura e armazenamento em cache...");

    const spreadsheet_6248 = SpreadsheetApp.openById(spreedsheet_id());
    console.log(`sincronizarDadosEntreTabelas_7891: Planilha aberta com ID: ${spreedsheet_id()}`);

    const transacoesSheet_9571 = spreadsheet_6248.getSheetByName(transacoesSheetName_2357);
    console.log(`sincronizarDadosEntreTabelas_7891: Lendo dados da planilha: ${transacoesSheetName_2357}`);
    const transacoesData_3185 = transacoesSheet_9571.getDataRange().getValues();
    console.log(`sincronizarDadosEntreTabelas_7891: Dados lidos de "${transacoesSheetName_2357}": ${transacoesData_3185.length} linhas.`);

    const faturasSheet_1598 = spreadsheet_6248.getSheetByName(faturasSheetName_9876);
    console.log(`sincronizarDadosEntreTabelas_7891: Lendo dados da planilha: ${faturasSheetName_9876}`);
    const faturasData_7532 = faturasSheet_1598.getDataRange().getValues();
    console.log(`sincronizarDadosEntreTabelas_7891: Dados lidos de "${faturasSheetName_9876}": ${faturasData_7532.length} linhas.`);

    console.log(`sincronizarDadosEntreTabelas_7891: Tempo gasto na leitura: ${new Date() - tempoEtapa_1593} ms`);

    tempoEtapa_1593 = new Date();
    console.log("sincronizarDadosEntreTabelas_7891: 2. Iniciando a filtragem inicial...");

    const today_6548 = new Date();
    today_6548.setHours(0, 0, 0, 0);
    console.log(`sincronizarDadosEntreTabelas_7891: Data atual: ${today_6548}`);

    console.log(`sincronizarDadosEntreTabelas_7891: Filtrando dados de "${faturasSheetName_9876}"...`);
    const faturasFiltradas_3597 = faturasData_7532.filter((row, index) => {
        if (index === 0) {
            console.log("sincronizarDadosEntreTabelas_7891: Mantendo cabeçalho da planilha Faturas.");
            return true;
        }

        const vencimento_2468 = row[7];
        const filtro_7895 = vencimento_2468 >= today_6548;
        console.log(`sincronizarDadosEntreTabelas_7891: Linha ${index + 1} - Vencimento: ${vencimento_2468}, Filtro: ${filtro_7895}`);

        return filtro_7895;
    });
    console.log(`sincronizarDadosEntreTabelas_7891: Dados filtrados de "${faturasSheetName_9876}": ${faturasFiltradas_3597.length} linhas.`);

    console.log(`sincronizarDadosEntreTabelas_7891: Filtrando dados de "${transacoesSheetName_2357}"...`);
    const transacoesFiltradas_2369 = transacoesData_3185.filter((row, index) => {
        if (index === 0) {
            console.log("sincronizarDadosEntreTabelas_7891: Mantendo cabeçalho da planilha Transações.");
            return true;
        }

        const status_5874 = row[6];
        const id_4512 = row[0];
        const filtro_8963 = status_5874 !== "Efetuado" || id_4512.includes("F");
        console.log(`sincronizarDadosEntreTabelas_7891: Linha ${index + 1} - Status: ${status_5874}, ID: ${id_4512}, Filtro: ${filtro_8963}`);

        return filtro_8963;
    });
    console.log(`sincronizarDadosEntreTabelas_7891: Dados filtrados de "${transacoesSheetName_2357}": ${transacoesFiltradas_2369.length} linhas.`);

    console.log(`sincronizarDadosEntreTabelas_7891: Tempo gasto na filtragem: ${new Date() - tempoEtapa_1593} ms`);

    tempoEtapa_1593 = new Date();
    console.log("sincronizarDadosEntreTabelas_7891: 3. Iniciando o processamento em cache e preparação de mudanças...");

    const ids_para_remover_3156 = new Set();
    const linhas_para_atualizar_7485 = [];
    const linhas_para_inserir_6392 = [];
    const linhas_para_excluir_2148 = [];

    console.log("sincronizarDadosEntreTabelas_7891: 3.1 Identificando IDs para remover...");
    faturasFiltradas_3597.forEach((faturaRow, index) => {
        if (index === 0) {
            console.log("sincronizarDadosEntreTabelas_7891: 3.1 Ignorando cabeçalho da planilha Faturas.");
            return;
        }

        const valor_2589 = parseFloat(faturaRow[11]);
        const id_fatura_1478 = faturaRow[0];
        console.log(`sincronizarDadosEntreTabelas_7891: 3.1 Verificando fatura - ID: ${id_fatura_1478}, Valor: ${valor_2589}`);

        if (valor_2589 < 0.01) {
            ids_para_remover_3156.add(id_fatura_1478);
            console.log(`sincronizarDadosEntreTabelas_7891: 3.1 ID ${id_fatura_1478} identificado para remoção (valor menor que 0.01).`);
        } else {
            console.log(`sincronizarDadosEntreTabelas_7891: 3.1 ID ${id_fatura_1478} não será removido (valor maior ou igual a 0.01).`);
        }
    });
    console.log(`sincronizarDadosEntreTabelas_7891: 3.1 Total de IDs para remover: ${ids_para_remover_3156.size}`);

    console.log("sincronizarDadosEntreTabelas_7891: 3.2 Removendo duplicatas de IDs com 'F' em 'Transações com Saldo'...");
    const idsComF_9513 = new Set();
    const linhasParaRemover_2649 = new Set();

    for (let i_4785 = transacoesFiltradas_2369.length - 1; i_4785 > 0; i_4785--) {
        const row_6542 = transacoesFiltradas_2369[i_4785];
        const id_4258 = row_6542[0];

        console.log(`sincronizarDadosEntreTabelas_7891: 3.2 Verificando transação - Linha: ${i_4785 + 1}, ID: ${id_4258}`);

        if (id_4258.includes("F")) {
            console.log(`sincronizarDadosEntreTabelas_7891: 3.2 ID ${id_4258} contém 'F'.`);

            if (idsComF_9513.has(id_4258)) {
                linhasParaRemover_2649.add(i_4785);
                console.log(`sincronizarDadosEntreTabelas_7891: 3.2 Linha ${i_4785 + 1} (ID: ${id_4258}) marcada para remoção por duplicidade.`);
            } else {
                idsComF_9513.add(id_4258);
                console.log(`sincronizarDadosEntreTabelas_7891: 3.2 ID ${id_4258} adicionado ao conjunto de IDs com 'F'.`);
            }
        } else {
            console.log(`sincronizarDadosEntreTabelas_7891: 3.2 ID ${id_4258} não contém 'F'.`);
        }
    }

    console.log(`sincronizarDadosEntreTabelas_7891: 3.2 Total de linhas duplicadas para remover: ${linhasParaRemover_2649.size}`);

    linhasParaRemover_2649.forEach(index => {
        console.log(`sincronizarDadosEntreTabelas_7891: 3.2 Removendo linha duplicada ${index + 1} da lista de transações filtradas.`);
        transacoesFiltradas_2369.splice(index, 1);
    });

    console.log(`sincronizarDadosEntreTabelas_7891: 3.2 Duplicatas removidas. Total de linhas restantes em transações filtradas: ${transacoesFiltradas_2369.length}`);

    console.log("sincronizarDadosEntreTabelas_7891: 3.3 Processando faturas e preparando atualizações/inserções...");
    const faturasIds_1597 = faturasFiltradas_3597.map(row => row[0]);
    console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Lista de IDs de faturas filtradas: ${faturasIds_1597.join(", ")}`);

    faturasFiltradas_3597.forEach((faturaRow, index) => {
        if (index === 0) {
            console.log("sincronizarDadosEntreTabelas_7891: 3.3 Ignorando cabeçalho da planilha Faturas.");
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
                console.error("Formato de data inválido:", valor);
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

        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Processando fatura ID: ${id_fatura_3698}`);
        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Detalhes da fatura:`, faturaRow);

        let transacaoEncontrada_5698 = false;
        for (let i_7589 = 1; i_7589 < transacoesFiltradas_2369.length; i_7589++) {
            const transacaoRow_1587 = transacoesFiltradas_2369[i_7589];
            const id_transacao_7582 = transacaoRow_1587[0];

            function normalizarHora(parametro) {
                console.log("Parâmetro recebido:", parametro);

                let data;

                if (typeof parametro === 'string') {
                    console.log("O parâmetro é uma string.");
                    data = new Date(parametro);
                    if (isNaN(data.getTime())) {
                        console.log("A string não é uma data válida, tentando converter como hora pura.");
                        const partes = parametro.match(/(\d{2}):(\d{2}):(\d{2})/);
                        if (partes) {
                            console.log("Hora pura detectada.");
                            return parametro;
                        } else {
                            console.log("Formato de string inválido para conversão.");
                            return null;
                        }
                    }
                } else if (parametro instanceof Date) {
                    console.log("O parâmetro é um objeto Date.");
                    data = parametro;
                } else {
                    console.log("Tipo de parâmetro inválido.");
                    return null;
                }

                console.log("Data após conversão:", data);

                const hora = data.getHours().toString().padStart(2, '0');
                const minuto = data.getMinutes().toString().padStart(2, '0');
                const segundo = data.getSeconds().toString().padStart(2, '0');

                const horaFormatada = `${hora}:${minuto}:${segundo}`;
                console.log("Hora formatada:", horaFormatada);

                return horaFormatada;
            }

            console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Procurando transação correspondente para fatura ${id_fatura_3698}. Verificando ID: ${id_transacao_7582}`);

            if (id_transacao_7582.includes("F") && id_transacao_7582 === id_fatura_3698) {
                console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Transação encontrada para fatura ${id_fatura_3698}: ID da transação ${id_transacao_7582}`);
                transacaoEncontrada_5698 = true;

                const atualizacoes_3579 = {};
                let precisaAtualizar_1579 = false;
                const linhaTemporaria_4587 = [...transacaoRow_1587];

                console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Verificando campos para atualização na transação ${id_transacao_7582}...`);
                if (transacaoRow_1587[6] === "Pendente") {
                    if (transacaoRow_1587[3] !== `Fatura (${nomeCartao_6359})`) {
                        atualizacoes_3579.coluna4 = `Fatura (${nomeCartao_6359})`;
                        precisaAtualizar_1579 = true;
                        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Atualização necessária: coluna4 (${transacaoRow_1587[3]} -> Fatura (${nomeCartao_6359}))`);
                    }

                    if (transacaoRow_1587[6] !== "Pendente") {
                        atualizacoes_3579.coluna7 = "Pendente";
                        precisaAtualizar_1579 = true;
                        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Atualização necessária: coluna7 (${transacaoRow_1587[6]} -> Pendente)`);
                    }

                    if (
                        transacaoRow_1587[11].getDate() !== vencimentoFatura_7412.getDate() ||
                        transacaoRow_1587[11].getMonth() !== vencimentoFatura_7412.getMonth() ||
                        transacaoRow_1587[11].getFullYear() !== vencimentoFatura_7412.getFullYear()
                    ) {
                        atualizacoes_3579.coluna12 = vencimentoFatura_7412;
                        precisaAtualizar_1579 = true;
                        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Atualização necessária: coluna12 (${transacaoRow_1587[11]} -> ${vencimentoFatura_7412})`);
                    }

                    if (normalizarHora(transacaoRow_1587[12]) !== (formaPagamento_2469 === "Débito Automático" ? "04:00:00" : "14:00:00")) {
                        atualizacoes_3579.coluna13 = formaPagamento_2469 === "Débito Automático" ? "04:00:00" : "14:00:00";
                        precisaAtualizar_1579 = true;
                        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Atualização necessária: coluna13 (${transacaoRow_1587[12]} -> ${atualizacoes_3579.coluna13})`);
                    }

                    if (
                        transacaoRow_1587[13].getDate() !== vencimentoFatura_7412.getDate() ||
                        transacaoRow_1587[13].getMonth() !== vencimentoFatura_7412.getMonth() ||
                        transacaoRow_1587[13].getFullYear() !== vencimentoFatura_7412.getFullYear()
                    ) {
                        atualizacoes_3579.coluna14 = vencimentoFatura_7412;
                        precisaAtualizar_1579 = true;
                        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Atualização necessária: coluna14 (${transacaoRow_1587[13]} -> ${vencimentoFatura_7412})`);
                    }

                    if (normalizarHora(transacaoRow_1587[14]) !== (formaPagamento_2469 === "Débito Automático" ? "04:00:00" : "14:00:00")) {
                        atualizacoes_3579.coluna15 = formaPagamento_2469 === "Débito Automático" ? "04:00:00" : "14:00:00";
                        precisaAtualizar_1579 = true;
                        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Atualização necessária: coluna15 (${transacaoRow_1587[14]} -> ${atualizacoes_3579.coluna15})`);
                    }

                    if (transacaoRow_1587[15] !== mesReferencia_5931) {
                        atualizacoes_3579.coluna16 = mesReferencia_5931;
                        precisaAtualizar_1579 = true;
                        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Atualização necessária: coluna16 (${transacaoRow_1587[15]} -> ${mesReferencia_5931})`);
                    }

                    if (transacaoRow_1587[16] !== anoReferencia_7593) {
                        atualizacoes_3579.coluna17 = anoReferencia_7593;
                        precisaAtualizar_1579 = true;
                        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Atualização necessária: coluna17 (${transacaoRow_1587[16]} -> ${anoReferencia_7593})`);
                    }

                    if (parseFloat(transacaoRow_1587[21]) !== parseFloat(valorFatura_3571)) {
                        atualizacoes_3579.coluna22 = valorFatura_3571;
                        precisaAtualizar_1579 = true;
                        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Atualização necessária: coluna22 (${transacaoRow_1587[21]} -> ${valorFatura_3571})`);
                    }

                    if (parseFloat(transacaoRow_1587[22]) !== parseFloat(0.00)) {
                        atualizacoes_3579.coluna23 = 0.00;
                        precisaAtualizar_1579 = true;
                        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Atualização necessária: coluna23 (${transacaoRow_1587[21]} -> ${0.00})`);
                    }

                    if (parseFloat(transacaoRow_1587[23]) !== parseFloat(valorFatura_3571)) {
                        atualizacoes_3579.coluna24 = valorFatura_3571;
                        precisaAtualizar_1579 = true;
                        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Atualização necessária: coluna24 (${transacaoRow_1587[23]} -> ${valorFatura_3571})`);
                    }

                    if (parseFloat(transacaoRow_1587[24]) !== parseFloat(-valorFatura_3571)) {
                        atualizacoes_3579.coluna25 = -valorFatura_3571;
                        precisaAtualizar_1579 = true;
                        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Atualização necessária: coluna25 (${transacaoRow_1587[24]} -> ${-valorFatura_3571})`);
                    }

                    if (transacaoRow_1587[25] !== arquivoFatura_5271) {
                        atualizacoes_3579.coluna26 = arquivoFatura_5271;
                        precisaAtualizar_1579 = true;
                        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Atualização necessária: coluna26 (${transacaoRow_1587[25]} -> ${arquivoFatura_5271})`);
                    }

                    if (transacaoRow_1587[29] !== "Não") {
                        atualizacoes_3579.coluna30 = "Não";
                        precisaAtualizar_1579 = true;
                        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Atualização necessária: coluna29 (${transacaoRow_1587[29]} -> Não)`);
                    }

                    if (transacaoRow_1587[30] !== registroFatura_6893) {
                        atualizacoes_3579.coluna31 = registroFatura_6893;
                        precisaAtualizar_1579 = true;
                        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Atualização necessária: coluna30 (${transacaoRow_1587[30]} -> ${registroFatura_6893})`);
                    }

                    if (transacaoRow_1587[31] !== ultimaFatura_4279) {
                        atualizacoes_3579.coluna32 = ultimaFatura_4279;
                        precisaAtualizar_1579 = true;
                        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Atualização necessária: coluna31 (${transacaoRow_1587[31]} -> ${ultimaFatura_4279})`);
                    }

                    if (precisaAtualizar_1579) {
                        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Campos que precisam ser atualizados na transação ${id_transacao_7582}:`, atualizacoes_3579);

                        for (const key_9516 in atualizacoes_3579) {
                            const colIndex_8532 = parseInt(key_9516.replace("coluna", "")) - 1;
                            linhaTemporaria_4587[colIndex_8532] = atualizacoes_3579[key_9516];
                            console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Atualizando linha temporária: coluna ${colIndex_8532 + 1} -> ${atualizacoes_3579[key_9516]}`);
                        }

                        linhas_para_atualizar_7485.push({
                            index: transacoesData_3185.findIndex((row) => row[0] === id_transacao_7582) + 1,
                            values: linhaTemporaria_4587,
                        });

                        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Linha ${linhas_para_atualizar_7485.length} adicionada para atualização. ID: ${id_transacao_7582}, Índice na planilha: ${linhas_para_atualizar_7485[linhas_para_atualizar_7485.length - 1].index}`);

                        const dataVencimentoFormatada_2365 = Utilities.formatDate(vencimentoFatura_7412, "GMT-3", "dd/MM/yyyy");
                        const dataHojeFormatada_3587 = Utilities.formatDate(today_6548, "GMT-3", "dd/MM/yyyy");
                        const dataFechamentoformatada_9875 = Utilities.formatDate(fechamentoFatura_9871, "GMT-3", "dd/MM/yyyy");
                        const descricaoEvento_7591 = `Fatura referente a ${mesAnoReferencia_2684}, com fechamento em ${dataFechamentoformatada_9875}`;
                        const tituloEvento_6598 = `Pagamento de Fatura em ${nomeCartao_6359}`;

                        if (dataVencimentoFormatada_2365 !== Utilities.formatDate(transacaoRow_1587[11], "GMT-3", "dd/MM/yyyy")) {
                            console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Data de vencimento formatada: ${dataVencimentoFormatada_2365}`);

                            if (dataVencimentoFormatada_2365 === dataHojeFormatada_3587) {
                                console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Chamando criarouatualizareventodehoje_9876 para fatura ${id_fatura_3698}...`);
                                criarouatualizareventodehoje_9876(dataVencimentoFormatada_2365, id_fatura_3698, descricaoEvento_7591, tituloEvento_6598, "14:00");
                            } else {
                                console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Chamando criarouatualizarcalendarioevento_5278 para fatura ${id_fatura_3698}...`);
                                criarouatualizarcalendarioevento_5278(dataVencimentoFormatada_2365, id_fatura_3698, descricaoEvento_7591, tituloEvento_6598, "14:00");
                            }
                        }
                    } else {
                        console.log(`sincronizarDadosEntreTabelas_7891: 3.3 A linha da transação ${id_transacao_7582} já está atualizada.`);
                    }
                    break;
                }
            }
        }

        if (!transacaoEncontrada_5698 && valorFatura_3571 >= 0.01) {
            console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Transação não encontrada para fatura ${id_fatura_3698}. Criando nova linha...`);
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
            console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Nova linha criada para fatura ${id_fatura_3698}:`, novaLinha_5896);

            const dataVencimentoFormatada_9874 = Utilities.formatDate(vencimentoFatura_7412, "GMT-3", "dd/MM/yyyy");
            const dataHojeFormatada_6541 = Utilities.formatDate(today_6548, "GMT-3", "dd/MM/yyyy");
            const dataFechamentoformatada_3578 = Utilities.formatDate(fechamentoFatura_9871, "GMT-3", "dd/MM/yyyy");
            const descricaoEvento_2589 = `Fatura referente a ${mesAnoReferencia_2684}, com fechamento em ${dataFechamentoformatada_3578}`;
            const tituloEvento_8593 = `Pagamento de Fatura em ${nomeCartao_6359}`;

            console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Data de vencimento formatada: ${dataVencimentoFormatada_9874}`);

            if (dataVencimentoFormatada_9874 === dataHojeFormatada_6541) {
                console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Chamando criarouatualizareventodehoje_9876 para fatura ${id_fatura_3698}...`);
                criarouatualizareventodehoje_9876(dataVencimentoFormatada_9874, id_fatura_3698, descricaoEvento_2589, tituloEvento_8593, "14:00");
            } else {
                console.log(`sincronizarDadosEntreTabelas_7891: 3.3 Chamando criarouatualizarcalendarioevento_5278 para fatura ${id_fatura_3698}...`);
                criarouatualizarcalendarioevento_5278(dataVencimentoFormatada_9874, id_fatura_3698, descricaoEvento_2589, tituloEvento_8593, tituloEvento_8593, "14:00");
            }
        }
    });

    console.log("sincronizarDadosEntreTabelas_7891: 3.4 Identificando linhas para exclusão em 'Transações com Saldo'...");

    for (let i_7536 = transacoesFiltradas_2369.length - 1; i_7536 > 0; i_7536--) {
        const transacaoRow_6259 = transacoesFiltradas_2369[i_7536];
        const id_transacao_5896 = transacaoRow_6259[0];
        const status_9531 = transacaoRow_6259[6];

        console.log(`sincronizarDadosEntreTabelas_7891: 3.4 Verificando transação para exclusão - Linha: ${i_7536 + 1}, ID: ${id_transacao_5896}, Status: ${status_9531}`);

        if (id_transacao_5896.includes("F")) {
            console.log(`sincronizarDadosEntreTabelas_7891: 3.4 ID ${id_transacao_5896} contém 'F'.`);

            if (ids_para_remover_3156.has(id_transacao_5896) || !faturasIds_1597.includes(id_transacao_5896)) {
                console.log(`sincronizarDadosEntreTabelas_7891: 3.4 ID ${id_transacao_5896} está na lista de IDs para remover ou não está na lista de faturas filtradas.`);

                if (status_9531 !== "Efetuado") {
                    linhas_para_excluir_2148.push(transacoesData_3185.findIndex(row => row[0] === id_transacao_5896) + 1);
                    console.log(`sincronizarDadosEntreTabelas_7891: 3.4 Linha ${linhas_para_excluir_2148[linhas_para_excluir_2148.length - 1]} (ID: ${id_transacao_5896}) marcada para exclusão (status diferente de "Efetuado").`);
                } else {
                    console.log(`sincronizarDadosEntreTabelas_7891: 3.4 Linha ${i_7536 + 1} (ID: ${id_transacao_5896}) não será marcada para exclusão (status "Efetuado").`);
                }
            } else {
                console.log(`sincronizarDadosEntreTabelas_7891: 3.4 ID ${id_transacao_5896} não será removido (não está na lista de IDs para remover e está na lista de faturas filtradas).`);
            }
        } else {
            console.log(`sincronizarDadosEntreTabelas_7891: 3.4 ID ${id_transacao_5896} não contém 'F'.`);
        }
    }
    console.log(`sincronizarDadosEntreTabelas_7891: 3.4 Total de linhas para exclusão: ${linhas_para_excluir_2148.length}`);

    console.log(`sincronizarDadosEntreTabelas_7891: 3. Tempo gasto no processamento: ${new Date() - tempoEtapa_1593} ms`);

    tempoEtapa_1593 = new Date();
    console.log("sincronizarDadosEntreTabelas_7891: 4. Iniciando a aplicação de mudanças em lote...");

    if (linhas_para_atualizar_7485.length > 0) {
        console.log(`sincronizarDadosEntreTabelas_7891: 4.1 Atualizando ${linhas_para_atualizar_7485.length} linhas em "${transacoesSheetName_2357}"...`);
        linhas_para_atualizar_7485.forEach(({ index, values }) => {
            transacoesSheet_9571.getRange(index, 1, 1, values.length).setValues([values]);
            console.log(`sincronizarDadosEntreTabelas_7891: 4.1 Linha ${index} atualizada com os valores:`, values);
        });
    } else {
        console.log(`sincronizarDadosEntreTabelas_7891: 4.1 Nenhuma linha para atualizar.`);
    }

    if (linhas_para_inserir_6392.length > 0) {
        console.log(`sincronizarDadosEntreTabelas_7891: 4.2 Inserindo ${linhas_para_inserir_6392.length} novas linhas em "${transacoesSheetName_2357}" ao final da tabela...`);
        const lastRow_5397 = transacoesSheet_9571.getLastRow();
        console.log(`sincronizarDadosEntreTabelas_7891: 4.2 Última linha da planilha: ${lastRow_5397}`);

        if (linhas_para_inserir_6392.length > 0) {
            transacoesSheet_9571.insertRowsAfter(lastRow_5397, linhas_para_inserir_6392.length);
            console.log(`sincronizarDadosEntreTabelas_7891: 4.2 Inserindo ${linhas_para_inserir_6392.length} linhas após a linha ${lastRow_5397}`);
            const range_3591 = transacoesSheet_9571.getRange(lastRow_5397 + 1, 1, linhas_para_inserir_6392.length, linhas_para_inserir_6392[0].length);
            range_3591.setValues(linhas_para_inserir_6392);
            console.log(`sincronizarDadosEntreTabelas_7891: 4.2 Valores inseridos:`, linhas_para_inserir_6392);
        }

        console.log(`sincronizarDadosEntreTabelas_7891: 4.2 ${linhas_para_inserir_6392.length} linhas inseridas ao final da tabela.`);
    } else {
        console.log(`sincronizarDadosEntreTabelas_7891: 4.2 Nenhuma linha para inserir.`);
    }

    if (linhas_para_excluir_2148.length > 0) {
        console.log(`sincronizarDadosEntreTabelas_7891: 4.3 Excluindo ${linhas_para_excluir_2148.length} linhas em "${transacoesSheetName_2357}"...`);
        const linhasParaExcluir_6497 = [...new Set(linhas_para_excluir_2148)].sort((a, b) => b - a);
        console.log(`sincronizarDadosEntreTabelas_7891: 4.3 Linhas para excluir (ordenadas): ${linhasParaExcluir_6497.join(", ")}`);

        linhasParaExcluir_6497.forEach(index => {
            const id_linha_excluida_8571 = transacoesSheet_9571.getRange(index, 1).getValue();
            console.log(`sincronizarDadosEntreTabelas_7891: 4.3 Excluindo linha ${index} (ID: ${id_linha_excluida_8571})...`);
            transacoesSheet_9571.getRange(index, 1, 1, transacoesSheet_9571.getLastColumn()).clearContent();
            console.log(`sincronizarDadosEntreTabelas_7891: 4.3 Linha ${index} limpa.`);

            if (id_linha_excluida_8571.includes("F")) {
                console.log(`sincronizarDadosEntreTabelas_7891: 4.3 Chamando deletareventoporidentificador_4739 para ID ${id_linha_excluida_8571}...`);
                deletareventoporidentificador_4739(id_linha_excluida_8571);
            }
        });
    } else {
        console.log(`sincronizarDadosEntreTabelas_7891: 4.3 Nenhuma linha para excluir.`);
    }

    console.log(`sincronizarDadosEntreTabelas_7891: 4. Tempo gasto na aplicação de mudanças: ${new Date() - tempoEtapa_1593} ms`);

    console.log("sincronizarDadosEntreTabelas_7891: 5. Aplicando todas as mudanças pendentes na planilha...");
    SpreadsheetApp.flush();

    const endTime_2468 = new Date();
    const totalTime_6589 = endTime_2468 - startTime_3579;

    console.log(`sincronizarDadosEntreTabelas_7891: 5. Tempo total gasto na sincronização: ${totalTime_6589} ms`);
    console.log("sincronizarDadosEntreTabelas_7891: Sincronização concluída com sucesso!");
}