function atualizarSaldoContas_1234() {
    const ss_5678 = SpreadsheetApp.openById(spreedsheet_id());
    const tabela1Sheet_9012 = ss_5678.getSheetByName('Contas Financeiras');
    const tabela2Sheet_3456 = ss_5678.getSheetByName('Saldo das Contas');

    if (!tabela1Sheet_9012) {
        Logger.log("Erro: A aba 'Contas Financeiras' não foi encontrada.");
        return;
    }

    if (!tabela2Sheet_3456) {
        Logger.log("Erro: A aba 'Saldo das Contas' não foi encontrada.");
        return;
    }

    const tabela1Data_7890 = tabela1Sheet_9012.getDataRange().getValues();
    const tabela2Data_2345 = tabela2Sheet_3456.getDataRange().getValues();

    const tabela1Header_6789 = tabela1Data_7890.shift();
    if (!tabela1Header_6789 || tabela1Header_6789[0] != "Instituição" || tabela1Header_6789[1] != "Tipo de Conta" || tabela1Header_6789[2] != "Habilitação para Investimentos") {
        Logger.log("Erro: Os cabeçalhos da aba 'Contas Financeiras' estão incorretos.");
        return;
    }

    const tabela2Header_0123 = tabela2Data_2345.shift();
    if (!tabela2Header_0123 || tabela2Header_0123[0] != "Instituição" || tabela2Header_0123[1] != "Tipo de Conta" || tabela2Header_0123[2] != "Categoria" || tabela2Header_0123[3] != "Saldo Atual") {
        Logger.log("Erro: Os cabeçalhos da aba 'Saldo das Contas' estão incorretos.");
        return;
    }

    if (tabela2Sheet_3456.getLastRow() > 1) {
        tabela2Sheet_3456.getRange(2, 1, tabela2Sheet_3456.getLastRow() - 1, tabela2Sheet_3456.getLastColumn()).clearContent();
        Logger.log("Tabela 'Saldo das Contas' limpa.");
    } else {
        Logger.log("Tabela 'Saldo das Contas' já estava vazia (exceto cabeçalho).");
    }

    tabela1Data_7890.forEach(rowTabela1_4567 => {
        const instituicaoTabela1_8901 = rowTabela1_4567[0];
        const tipoContaTabela1_2345 = rowTabela1_4567[1];
        const habilitacaoInvestimentos_6789 = rowTabela1_4567[2];

        if (tipoContaTabela1_2345 === "Corretora de Investimentos") {
            criarLinhaTabela2_1234(tabela2Sheet_3456, rowTabela1_4567, "Investimentos");
            Logger.log(`Instituição: ${instituicaoTabela1_8901}, Tipo: Corretora de Investimentos, Criando linha para Investimentos`);
        } else if (habilitacaoInvestimentos_6789 === "Sim") {
            criarLinhaTabela2_1234(tabela2Sheet_3456, rowTabela1_4567, "Movimentação");
            criarLinhaTabela2_1234(tabela2Sheet_3456, rowTabela1_4567, "Investimentos");
            Logger.log(`Instituição: ${instituicaoTabela1_8901}, Tipo: ${tipoContaTabela1_2345}, Habilitação para Investimentos: Sim, Criando linhas para Movimentação e Investimentos.`);
        } else if (tipoContaTabela1_2345 === "Benefício") {
            criarLinhaTabela2_1234(tabela2Sheet_3456, rowTabela1_4567, "Benefício");
            Logger.log(`Instituição: ${instituicaoTabela1_8901}, Tipo: ${tipoContaTabela1_2345}, Criando linha para benefício.`);
        } else {
            criarLinhaTabela2_1234(tabela2Sheet_3456, rowTabela1_4567, "Movimentação");
            Logger.log(`Instituição: ${instituicaoTabela1_8901}, Tipo: ${tipoContaTabela1_2345}, Habilitação para Investimentos: Não, Criando linha para Movimentação.`);
        }
    });

    Logger.log("Atualização concluída.");
}

function criarLinhaTabela2_1234(tabela2Sheet_3456, rowTabela1_4567, categoria_7890) {
    const instituicao_0123 = rowTabela1_4567[0];
    const tipoConta_5678 = rowTabela1_4567[1];

    const formula_9012 = `=IF(INDIRECT("C" & ROW())="Movimentação";IFERROR((SUMIFS('Transações com Saldo'!$Y$2:$Y;'Transações com Saldo'!$R$2:$R;INDIRECT("A" & ROW());'Transações com Saldo'!$S$2:$S;"Movimentação";'Transações com Saldo'!$G$2:G;"Efetuado";'Transações com Saldo'!$B$2:B;"<>""Movimentação entre Contas")+(SUMIFS('Transações com Saldo'!$X$2:$X;'Transações com Saldo'!$R$2:$R;INDIRECT("A" & ROW());'Transações com Saldo'!$S$2:$S;"Movimentação";'Transações com Saldo'!$G$2:G;"Efetuado";'Transações com Saldo'!$B$2:B;"Movimentação entre Contas")*-1)+SUMIFS('Transações com Saldo'!$X$2:$X;'Transações com Saldo'!$T$2:$T;INDIRECT("A" & ROW());'Transações com Saldo'!$U$2:$U;"Movimentação";'Transações com Saldo'!$G$2:G;"Efetuado";'Transações com Saldo'!B$2:$B;"<>Saldo Anterior"));0);IFERROR(SUMIFS('Investimentos Ativos'!$H$2:$H;'Investimentos Ativos'!$F$2:$F;INDIRECT("A" & ROW()));0)+IFERROR((SUMIFS('Transações com Saldo'!$Y$2:$Y;'Transações com Saldo'!$R$2:$R;INDIRECT("A" & ROW());'Transações com Saldo'!$S$2:$S;"Investimentos";'Transações com Saldo'!$G$2:G;"Efetuado";'Transações com Saldo'!$B$2:B;"<>""Movimentação entre Contas")+(SUMIFS('Transações com Saldo'!$X$2:$X;'Transações com Saldo'!$R$2:$R;INDIRECT("A" & ROW());'Transações com Saldo'!$S$2:$S;"Investimentos";'Transações com Saldo'!$G$2:G;"Efetuado";'Transações com Saldo'!$B$2:B;"Movimentação entre Contas")*-1)+SUMIFS('Transações com Saldo'!$X$2:$X;'Transações com Saldo'!$T$2:$T;INDIRECT("A" & ROW());'Transações com Saldo'!$U$2:$U;"Investimentos";'Transações com Saldo'!$G$2:G;"Efetuado";'Transações com Saldo'!B$2:$B;"<>Saldo Anterior"));0))`;
    const novaLinha_3456 = [instituicao_0123, tipoConta_5678, categoria_7890, formula_9012];
    tabela2Sheet_3456.appendRow(novaLinha_3456);
}