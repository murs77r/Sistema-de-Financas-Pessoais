function transferir_saldos_bancarios_1654() {
    const data_atual_5678 = new Date();

    if (data_atual_5678.getDate() !== 1) {
        Logger.log("Script não executado: hoje não é o primeiro dia do mês.");
        return;
    }

    const planilha_9012 = SpreadsheetApp.openById(spreedsheet_id());
    const planilha_origem_3456 = planilha_9012.getSheetByName("Saldo das Contas");
    const planilha_destino_7890 = planilha_9012.getSheetByName("Transações com Saldo");
    const dados_origem_1230 = planilha_origem_3456.getDataRange().getValues().slice(1);
    const data_formatada_4560 = Utilities.formatDate(data_atual_5678, "GMT-3", "dd/MM/yyyy");
    const mes_atual_formatado_7890 = `${data_atual_5678.getMonth() + 1} (${[
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ][data_atual_5678.getMonth()]})`;
    const ano_atual_2345 = data_atual_5678.getFullYear();


    dados_origem_1230.forEach(linha_9876 => {
        if (linha_9876[3] !== 0 && linha_9876[2] !== "Investimentos") {
            const id_aleatorio_6543 = `N${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
            const nova_linha_0987 = [
                id_aleatorio_6543,
                "Saldo Anterior",
                "Crédito",
                "Saldo Anterior",
                "Receita - Outros Tipos",
                "",
                "Efetuado",
                "Murilo Souza Ramos",
                data_formatada_4560,
                "00:00:00",
                "Não",
                data_formatada_4560,
                "00:00:00",
                data_formatada_4560,
                "00:00:00",
                mes_atual_formatado_7890,
                ano_atual_2345,
                "",
                "",
                linha_9876[0],
                linha_9876[2],
                linha_9876[3],
                "0",
                linha_9876[3],
                linha_9876[3],
                "",
                "",
                "",
                "",
                "Não",
                "",
                `${data_formatada_4560} às 00:00`
            ];

            planilha_destino_7890.appendRow(nova_linha_0987);
        }
    });

    Logger.log("Dados copiados com sucesso!");
}