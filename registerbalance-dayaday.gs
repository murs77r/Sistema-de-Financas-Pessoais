function processar_dados_planilha_2873() {
    const planilha_google_3981 = SpreadsheetApp.openById(spreedsheet_id());
    const planilha_destino_8765 = planilha_google_3981.getSheetByName("Registro de Saldo das Contas");
    const planilha_origem_5432 = planilha_google_3981.getSheetByName("Saldo das Contas");

    const dados_tabela_origem_1290 = planilha_origem_5432.getRange(2, 1, planilha_origem_5432.getLastRow() - 1, planilha_origem_5432.getLastColumn()).getValues();

    const novos_dados_tabela_6734 = dados_tabela_origem_1290
        .filter(linha => Math.abs(linha[3]) > 0.01)
        .map(linha => {
            const id_unico_9876 = `B${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
            const data_ontem_2345 = new Date();
            data_ontem_2345.setDate(data_ontem_2345.getDate() - 1);
            const data_formatada_7654 = Utilities.formatDate(data_ontem_2345, planilha_google_3981.getSpreadsheetTimeZone(), "yyyy-MM-dd");
            const valor_formatado_8901 = parseFloat(Number(linha[3]).toFixed(2));

            return [
                id_unico_9876,
                linha[2],
                linha[0],
                data_formatada_7654,
                valor_formatado_8901
            ];
        });

    if (novos_dados_tabela_6734.length > 0) {
        planilha_destino_8765.getRange(planilha_destino_8765.getLastRow() + 1, 1, novos_dados_tabela_6734.length, novos_dados_tabela_6734[0].length).setValues(novos_dados_tabela_6734);
    }
}