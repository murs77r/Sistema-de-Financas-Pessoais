function verificar_gatilho_appsheet_7192(gatilho_appsheet_2748) {
    if (gatilho_appsheet_2748 !== "") {
        console.log("Gatilho via Google AppSheet");
        sincronizar_tabelas_transacoes_3856();
    }
}

function sincronizar_tabelas_transacoes_3856() {
    const tempo_inicial_8374 = Date.now();

    const planilha_principal_9265 = SpreadsheetApp.openById(spreedsheet_id());
    const tabela_transacoes_1638 = planilha_principal_9265.getSheetByName("Transações com Saldo");
    const tabela_investimentos_7492 = planilha_principal_9265.getSheetByName("Transações em Investimentos");

    if (!tabela_transacoes_1638 || !tabela_investimentos_7492) {
        Logger.log("Erro: Uma ou ambas as tabelas não foram encontradas.");
        return;
    }

    let dados_transacoes_9274 = tabela_transacoes_1638.getDataRange().getValues();
    const dados_investimentos_1835 = tabela_investimentos_7492.getDataRange().getValues();

    const mapa_investimentos_2957 = new Map();
    for (let i = 1; i < dados_investimentos_1835.length; i++) {
        const id_investimento_6391 = dados_investimentos_1835[i][0];
        if (id_investimento_6391 !== "" && (dados_investimentos_1835[i][19] !== "" || dados_investimentos_1835[i][21] !== "")) {
            mapa_investimentos_2957.set(id_investimento_6391, i);
        }
    }

    const mapa_transacoes_8532 = new Map();
    const ids_duplicados_3729 = new Set();

    for (let i = 1; i < dados_transacoes_9274.length; i++) {
        const id_transacao_5371 = dados_transacoes_9274[i][0];
        if (mapa_transacoes_8532.has(id_transacao_5371)) {
            ids_duplicados_3729.add(id_transacao_5371);
        } else {
            mapa_transacoes_8532.set(id_transacao_5371, i);
        }
    }

    if (ids_duplicados_3729.size > 0) {
        Logger.log(`IDs duplicados encontrados: ${Array.from(ids_duplicados_3729).join(", ")}`);
        for (let i = dados_transacoes_9274.length - 1; i > 0; i--) {
            const id_transacao_5371 = dados_transacoes_9274[i][0];
            if (ids_duplicados_3729.has(id_transacao_5371)) {
                tabela_transacoes_1638.getRange(i + 1, 1, 1, tabela_transacoes_1638.getLastColumn()).clearContent();
                Logger.log(`Linha duplicada com ID ${id_transacao_5371} apagada.`);
            }
        }
        dados_transacoes_9274 = tabela_transacoes_1638.getDataRange().getValues();
        mapa_transacoes_8532.clear();
        for (let i = 1; i < dados_transacoes_9274.length; i++) {
            const id_transacao_5371 = dados_transacoes_9274[i][0];
            mapa_transacoes_8532.set(id_transacao_5371, i);
        }
    }

    for (let i = 1; i < dados_investimentos_1835.length; i++) {
        const linha_investimento_8572 = dados_investimentos_1835[i];
        const id_investimento_6391 = linha_investimento_8572[0];
        const ativo_7461 = linha_investimento_8572[1];
        const operacao_investimento_6284 = linha_investimento_8572[2];
        const tipo_investimento_3847 = linha_investimento_8572[3];
        const categoria_7394 = linha_investimento_8572[4];
        const quantidade_2759 = linha_investimento_8572[5];
        const status_investimento_9182 = linha_investimento_8572[6];
        const operador_4825 = linha_investimento_8572[7];
        const data_registro_7351 = linha_investimento_8572[8];
        const horario_registro_2947 = linha_investimento_8572[9];
        const programado_9528 = linha_investimento_8572[10];
        const data_programada_2781 = linha_investimento_8572[11];
        const horario_programado_6539 = linha_investimento_8572[12];
        const data_efetivacao_5201 = linha_investimento_8572[13];
        const horario_efetivacao_8264 = linha_investimento_8572[14];
        const mes_transacao_4852 = linha_investimento_8572[15];
        const ano_transacao_9638 = linha_investimento_8572[16];
        const corretora_investimento_1749 = linha_investimento_8572[17];
        const conta_origem_9527 = linha_investimento_8572[18];
        const tipo_conta_origem_7593 = linha_investimento_8572[19];
        const conta_destino_6831 = linha_investimento_8572[20];
        const tipo_conta_destino_4729 = linha_investimento_8572[21];
        const valor_inicial_2957 = linha_investimento_8572[22];
        const taxas_impostos_8493 = linha_investimento_8572[23];
        const sub_total_9521 = linha_investimento_8572[24];
        const total_efetivo_7431 = linha_investimento_8572[25];
        const contrato_acordo3521 = linha_investimento_8572[26];
        const documento_comprobatorio_3725 = linha_investimento_8572[27];
        const registro_atualizacao_9173 = linha_investimento_8572[28];
        const ultima_atualizacao_4736 = linha_investimento_8572[29];

        if (conta_origem_9527 !== "" || conta_destino_6831 !== "") {
            const nova_transacao_6738 = [
                id_investimento_6391,
                "Aplicação em Investimento",
                operacao_investimento_6284 === "Aplicação" ? "Débito" : "Crédito",
                `${operacao_investimento_6284} em ${ativo_7461} (${tipo_investimento_3847})`,
                operacao_investimento_6284 === "Resgate" ? "Receita - Outros Tipos" : "",
                operacao_investimento_6284 === "Aplicação" ? "Despesa - Outros Tipos" : "",
                status_investimento_9182 === "Liquidado" ? "Efetuado" : "Pendente",
                operador_4825,
                data_registro_7351,
                horario_registro_2947,
                programado_9528,
                data_programada_2781,
                horario_programado_6539,
                data_efetivacao_5201,
                horario_efetivacao_8264,
                mes_transacao_4852,
                ano_transacao_9638,
                conta_origem_9527,
                tipo_conta_origem_7593,
                conta_destino_6831,
                tipo_conta_destino_4729,
                operacao_investimento_6284 === "Resgate" ? sub_total_9521 + taxas_impostos_8493 : sub_total_9521 - taxas_impostos_8493,
                taxas_impostos_8493,
                sub_total_9521,
                total_efetivo_7431,
                contrato_acordo3521,
                documento_comprobatorio_3725,
                "",
                "",
                "Sim",
                registro_atualizacao_9173,
                ultima_atualizacao_4736
            ];

            if (mapa_transacoes_8532.has(id_investimento_6391)) {
                const indice_transacao_4751 = mapa_transacoes_8532.get(id_investimento_6391);
                const transacao_existente_1964 = dados_transacoes_9274[indice_transacao_4751];

                let dados_sao_iguais_4759 = true;
                for (let j = 0; j < nova_transacao_6738.length; j++) {
                    if (String(nova_transacao_6738[j]) !== String(transacao_existente_1964[j])) {
                        dados_sao_iguais_4759 = false;
                        break;
                    }
                }

                if (!dados_sao_iguais_4759) {
                    tabela_transacoes_1638.getRange(indice_transacao_4751 + 1, 1, 1, tabela_transacoes_1638.getLastColumn()).clearContent();
                    tabela_transacoes_1638.appendRow(nova_transacao_6738);
                    Logger.log(`Linha da transação com ID ${id_investimento_6391} atualizada.`);
                }
            } else {
                tabela_transacoes_1638.appendRow(nova_transacao_6738);
                Logger.log(`Nova linha de transação criada para o ID ${id_investimento_6391}.`);
            }
        }
    }

    for (let i = dados_transacoes_9274.length - 1; i > 0; i--) {
        const linha_transacao_3759 = dados_transacoes_9274[i];
        const id_transacao_5371 = linha_transacao_3759[0];
        const procedimento_7439 = linha_transacao_3759[1];

        if (procedimento_7439 === "Aplicação em Investimento") {
            if (!mapa_investimentos_2957.has(id_transacao_5371)) {
                tabela_transacoes_1638.getRange(i + 1, 1, 1, tabela_transacoes_1638.getLastColumn()).clearContent();
                Logger.log(`Linha da transação com ID ${id_transacao_5371} apagada (não encontrada na tabela de investimentos).`);
            }
        } else if (!mapa_investimentos_2957.has(id_transacao_5371) && (linha_transacao_3759[17] === "" && linha_transacao_3759[19] === "")) {
            tabela_transacoes_1638.getRange(i + 1, 1, 1, tabela_transacoes_1638.getLastColumn()).clearContent();
            Logger.log(`Linha de transação com ID ${id_transacao_5371} apagada (ID não encontrado e sem conta de origem ou destino).`);
        }
    }

    const tempo_final_8641 = Date.now();
    const tempo_decorrido_9648 = (tempo_final_8641 - tempo_inicial_8374) / 1000;
    Logger.log(`Sincronização concluída em ${tempo_decorrido_9648.toFixed(2)} segundos.`);
}