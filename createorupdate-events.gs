function criarouatualizarcalendarioevento_5278(dataHorarioStr, identificador, descricao, apresentacao) {
    try {
        const dataHorarioParam = new Date(dataHorarioStr);
        if (isNaN(dataHorarioParam.getTime())) {
            throw new Error(`Formato inválido para 'Data e Horário': ${dataHorarioStr}`);
        }

        const calendarId = 'primary';
        const calendar = CalendarApp.getCalendarById(calendarId);
        if (!calendar) {
            throw new Error(`Calendário com ID '${calendarId}' não encontrado.`);
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const inicioBusca = new Date();
        inicioBusca.setFullYear(inicioBusca.getFullYear() - 50);
        const fimBusca = new Date();
        fimBusca.setFullYear(fimBusca.getFullYear() + 50);

        const targetTimes = calcularHorarioEvento_2151(dataHorarioParam);

        const eventosPotenciais = calendar.getEvents(inicioBusca, fimBusca);
        const eventosEncontrados = eventosPotenciais.filter(evento => evento.getTag('identificador') === identificador);

        let eventoExisteECorreto = false;
        eventosEncontrados.forEach(evento => {
            const inicioEvento = evento.getStartTime();
            const fimEvento = evento.getEndTime();
            const tituloEvento = evento.getTitle();
            const descricaoEvento = evento.getDescription();

            if (
                inicioEvento.getTime() === targetTimes.startTime.getTime() &&
                fimEvento.getTime() === targetTimes.endTime.getTime() &&
                tituloEvento === apresentacao &&
                descricaoEvento === descricao
            ) {
                eventoExisteECorreto = true;
            } else {
                try {
                    evento.deleteEvent();
                } catch (deleteError) { }
            }
        });

        if (!eventoExisteECorreto) {
            const novoEvento = calendar.createEvent(
                apresentacao,
                targetTimes.startTime,
                targetTimes.endTime,
                {
                    description: descricao
                }
            );

            novoEvento.setTag('identificador', identificador);

            novoEvento.addPopupReminder(30);
            novoEvento.addPopupReminder(0);

            const agora = new Date();
            const vinteQuatroHorasEmMillis = 24 * 60 * 60 * 1000;
            const horaLembrete24h = new Date(targetTimes.startTime.getTime() - vinteQuatroHorasEmMillis);

            if (horaLembrete24h.getTime() > agora.getTime()) {
                novoEvento.addEmailReminder(24 * 60);
            }
        }

    } catch (error) { }
}

function calcularHorarioEvento_2151(dataHorarioParam) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const agora = new Date();

    const dataEvento = new Date(dataHorarioParam);
    dataEvento.setHours(0, 0, 0, 0);

    let horaInicioCalculada;
    const horaParamOriginal = dataHorarioParam.getHours();
    const horaParamArredondada = Math.floor(horaParamOriginal);

    if (dataEvento.getTime() !== hoje.getTime()) {
        if (horaParamOriginal >= 6 && horaParamOriginal < 22) {
            horaInicioCalculada = horaParamArredondada;
        } else {
            horaInicioCalculada = 14;
        }
    } else {
        const horaAtual = agora.getHours();
        if (horaParamArredondada <= horaAtual) {
            horaInicioCalculada = horaAtual + 1;
        } else {
            horaInicioCalculada = horaParamArredondada;
        }
    }

    const startTime = new Date(dataHorarioParam);
    startTime.setHours(horaInicioCalculada, 0, 0, 0);
    const endTime = new Date(startTime.getTime());

    return { startTime, endTime };
}

function deletareventoporidentificador_4739(identificador) {
    const calendar = CalendarApp.getDefaultCalendar();
    const start_date = new Date('1970-01-01');
    const end_date = new Date('2150-01-01');
    const eventos = calendar.getEvents(start_date, end_date);

    for (let i = 0; i < eventos.length; i++) {
        if (eventos[i].getTag('identificador') === identificador || eventos[i].getDescription().includes(identificador)) {
            eventos[i].deleteEvent();
        }
    }
}