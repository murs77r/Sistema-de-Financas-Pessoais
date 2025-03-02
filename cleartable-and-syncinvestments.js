function limpar_tabelas_atualizar_9876() {
    const startTime_2345 = new Date();
    console.log("Início da execução: " + startTime_2345);

    const planilha_ativa_2345 = SpreadsheetApp.openById(spreedsheet_id());
    console.log("Planilha aberta: " + planilha_ativa_2345.getName());
    const abas_da_planilha_6789 = planilha_ativa_2345.getSheets();
    console.log("Número de abas: " + abas_da_planilha_6789.length);

    const abas_para_limpar_7654 = ["Transações com Saldo", "Pagamentos Recorrentes", "Transações em Investimentos", "Transações com Cartão de Crédito", "Faturas de Cartões de Crédito"];
    console.log("Abas a serem limpas: " + abas_para_limpar_7654.join(", "));

    for (let i = 0; i < abas_da_planilha_6789.length; i++) {
        const aba_atual_5432 = abas_da_planilha_6789[i];
        const nome_da_aba_8765 = aba_atual_5432.getName();
        console.log("Processando a aba: " + nome_da_aba_8765);

        if (abas_para_limpar_7654.includes(nome_da_aba_8765)) {
            console.log("Chamando limpar_linhas_vazias_9123 para a aba: " + nome_da_aba_8765);
            limpar_linhas_vazias_9123(aba_atual_5432);
        } else if (nome_da_aba_8765 === "Investimentos Ativos") {
            console.log("Chamando atualizar_investimentos_ativos_3456 para a aba: " + nome_da_aba_8765);
            atualizar_investimentos_ativos_3456(aba_atual_5432);
        } else {
            console.log("Aba ignorada: " + nome_da_aba_8765);
        }
    }

    const endTime_7890 = new Date();
    const elapsedTime_4567 = endTime_7890 - startTime_2345;
    const seconds_9012 = Math.floor(elapsedTime_4567 / 1000);
    const minutes_5678 = Math.floor(seconds_9012 / 60);
    const hours_1234 = Math.floor(minutes_5678 / 60);
    const formattedTime_8901 = `${String(hours_1234).padStart(2, '0')}:${String(minutes_5678 % 60).padStart(2, '0')}:${String(seconds_9012 % 60).padStart(2, '0')}`;

    console.log("Tempo total de execução: " + formattedTime_8901);

    function isEmpty_4321(valor) {
        return (
            valor === null ||
            valor === undefined ||
            valor === "" ||
            (typeof valor === "string" && valor.trim() === "")
        );
    }

    function limpar_linhas_vazias_9123(aba) {
        console.log("Entrando em limpar_linhas_vazias_9123 para a aba: " + aba.getName());

        let blocosParaDeletar_4321 = [];
        let inicioBloco_5432 = -1;
        let ultimaLinha_7654 = aba.getLastRow();

        console.log("Ultima linha preenchida: " + ultimaLinha_7654);

        let valoresColunaA_2109 = aba.getRange("A1:A" + ultimaLinha_7654).getValues();
        console.log("Valores da coluna A obtidos em lote.");

        for (let i = 0; i < valoresColunaA_2109.length; i++) {
            let numeroLinha_8765 = i + 1;
            let valorCelulaA_3210 = valoresColunaA_2109[i][0];

            console.log("Linha: " + numeroLinha_8765 + ", valor da celula A: " + valorCelulaA_3210);

            if (isEmpty_4321(valorCelulaA_3210)) {
                console.log("Celula A vazia na linha: " + numeroLinha_8765);
                if (inicioBloco_5432 === -1) {
                    inicioBloco_5432 = numeroLinha_8765;
                }
            } else {
                if (inicioBloco_5432 !== -1) {
                    blocosParaDeletar_4321.push({
                        start: inicioBloco_5432,
                        numRows: numeroLinha_8765 - inicioBloco_5432,
                    });
                    inicioBloco_5432 = -1;
                }
            }
        }

        if (inicioBloco_5432 !== -1) {
            blocosParaDeletar_4321.push({
                start: inicioBloco_5432,
                numRows: ultimaLinha_7654 - inicioBloco_5432 + 1,
            });
        }

        console.log("Deletando blocos: " + blocosParaDeletar_4321.length);
        for (let i = 0; i < blocosParaDeletar_4321.length; i++) {
            let bloco_6543 = blocosParaDeletar_4321[i];
            console.log("Deletando bloco: " + bloco_6543.start + " - " + (bloco_6543.start + bloco_6543.numRows - 1));
            aba.deleteRows(bloco_6543.start, bloco_6543.numRows);

            for (let j = i + 1; j < blocosParaDeletar_4321.length; j++) {
                blocosParaDeletar_4321[j].start -= bloco_6543.numRows;
            }
        }

        console.log("Saindo de limpar_linhas_vazias_9123");
    }

    function atualizar_investimentos_ativos_3456(aba) {
        console.log("Entrando em atualizar_investimentos_ativos_3456 para a aba: " + aba.getName());
        const ultima_linha_7654 = aba.getLastRow();
        console.log("Última linha da aba: " + ultima_linha_7654);

        if (ultima_linha_7654 < 2) {
            console.log("Aba com menos de 2 linhas. Retornando.");
            return;
        }

        const valores_coluna_ag_3210 = aba.getRange("A2:G" + ultima_linha_7654).getValues();
        console.log("Valores de A2:G obtidos. Total de linhas: " + valores_coluna_ag_3210.length);
        const formulas_4321 = [];

        for (let i = 0; i < valores_coluna_ag_3210.length; i++) {
            const linha_atual_2109 = valores_coluna_ag_3210[i];
            const numero_linha_8765 = i + 2;
            const valor_atualizacao_6543 = linha_atual_2109[6];
            let colunas_vazias_9876 = true;

            for (let j = 0; j < 6; j++) {
                if (linha_atual_2109[j] !== "") {
                    colunas_vazias_9876 = false;
                    break;
                }
            }

            console.log("Linha " + numero_linha_8765 + ": colunas_vazias_9876 = " + colunas_vazias_9876 + ", typeof valor_atualizacao_6543 = " + typeof valor_atualizacao_6543);

            if (typeof valor_atualizacao_6543 === 'number' && colunas_vazias_9876) {
                const formula_atualizacao_5432 = `IF(((SUMIFS('Transações em Investimentos'!$Z$2:Z,'Transações em Investimentos'!$B$2:B,B${numero_linha_8765},'Transações em Investimentos'!$R$2:R,F${numero_linha_8765},'Transações em Investimentos'!$D$2:D,D${numero_linha_8765},'Transações em Investimentos'!$E$2:E,E${numero_linha_8765},'Transações em Investimentos'!$C$2:C,"Aplicação")*-1)+(SUMIFS('Transações em Investimentos'!$Z$2:Z,'Transações em Investimentos'!$B$2:B,B${numero_linha_8765},'Transações em Investimentos'!$R$2:R,F${numero_linha_8765},'Transações em Investimentos'!$D$2:D,D${numero_linha_8765},'Transações em Investimentos'!$E$2:E,E${numero_linha_8765},'Transações em Investimentos'!$C$2:C,"Resgate")*-1))<>0;((SUMIFS('Transações em Investimentos'!$Z$2:Z,'Transações em Investimentos'!$B$2:B,B${numero_linha_8765},'Transações em Investimentos'!$R$2:R,F${numero_linha_8765},'Transações em Investimentos'!$D$2:D,D${numero_linha_8765},'Transações em Investimentos'!$E$2:E,E${numero_linha_8765},'Transações em Investimentos'!$C$2:C,"Resgate")*-1)+(SUMIFS('Transações em Investimentos'!$Z$2:Z,'Transações em Investimentos'!$B$2:B,B${numero_linha_8765},'Transações em Investimentos'!$R$2:R,F${numero_linha_8765},'Transações em Investimentos'!$D$2:D,D${numero_linha_8765},'Transações em Investimentos'!$E$2:E,E${numero_linha_8765},'Transações em Investimentos'!$C$2:C,"Aplicação")*-1));"")`;
                console.log("Adicionando fórmula para a linha " + numero_linha_8765);
                formulas_4321.push([formula_atualizacao_5432]);
            } else {
                console.log("Nenhuma fórmula adicionada para a linha " + numero_linha_8765);
                formulas_4321.push([""]);
            }
        }

        console.log("Total de fórmulas a serem aplicadas: " + formulas_4321.length);
        if (formulas_4321.length > 0) {
            aba.getRange(2, 7, formulas_4321.length, 1).setFormulas(formulas_4321);
            console.log("Fórmulas aplicadas.");
        } else {
            console.log("Nenhuma fórmula para aplicar");
        }
        console.log("Saindo de atualizar_investimentos_ativos_3456");
    }
}