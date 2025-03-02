function criarouatualizarcalendarioevento_5278(dataProgramada, identificador, descricao, apresentacao, timestring) {
    if (typeof dataProgramada === 'string' || typeof dataProgramada === 'number') {
        dataProgramada = new Date(dataProgramada);
    }
    if (!(dataProgramada instanceof Date)) {
        return;
    }

    const dataProgramada_sem_hora = new Date(dataProgramada.getFullYear(), dataProgramada.getMonth(), dataProgramada.getDate());
    const hoje_sem_hora = new Date();
    hoje_sem_hora.setHours(0, 0, 0, 0);

    if (dataProgramada_sem_hora.getTime() === hoje_sem_hora.getTime()) {
        criarouatualizareventodehoje_9876(dataProgramada, identificador, descricao, apresentacao, timestring);
        return;
    }

    const titulo_evento = apresentacao;
    const [hora] = timestring.split(':').map(Number);
    const data_hora_inicio = new Date(dataProgramada);
    data_hora_inicio.setHours(hora, 0, 0, 0);

    const calendar = CalendarApp.getDefaultCalendar();
    const start_date = new Date('1970-01-01');
    const end_date = new Date('2150-01-01');
    const eventos = calendar.getEvents(start_date, end_date);

    for (let i = 0; i < eventos.length; i++) {
        if (eventos[i].getTag('identificador') === identificador || eventos[i].getDescription().includes(identificador)) {
            eventos[i].deleteEvent();
        }
    }

    const evento = calendar.createEvent(titulo_evento, data_hora_inicio, new Date(data_hora_inicio.getTime() + 60 * 60 * 1000), {
        description: descricao
    });

    evento.setTag('identificador', identificador);
    evento.addEmailReminder(18 * 60);
    evento.addPopupReminder(18 * 60);
    evento.addPopupReminder(2 * 60);
    evento.addPopupReminder(0);
}

function criarouatualizareventodehoje_9876(dataProgramada, identificador, descricao, apresentacao, time_string) {
    const titulo_evento = apresentacao;
    const data_hora_inicio = new Date(dataProgramada);
    const agora = new Date();
    let horas = agora.getHours();
    let minutos = agora.getMinutes();
    let segundos = agora.getSeconds();

    if (time_string instanceof Date) {
        horas = time_string.getHours();
        minutos = time_string.getMinutes();
        segundos = time_string.getSeconds();
    } else if (typeof time_string === 'string') {
        const [h, m, s] = time_string.split(':');
        if (h && m && s) {
            horas = parseInt(h, 10);
            minutos = parseInt(m, 10);
            segundos = parseInt(s, 10);
        }
    } else if (typeof time_string === 'number') {
        const timestamp_date = new Date(time_string);
        horas = timestamp_date.getHours();
        minutos = timestamp_date.getMinutes();
        segundos = timestamp_date.getSeconds();
    }

    if (minutos > 0 || segundos > 0) {
        horas += 1;
    }

    const time_string_hora = new Date();
    time_string_hora.setHours(horas, 0, 0, 0);

    const agora_hora = new Date();
    agora_hora.setHours(agora.getHours(), 0, 0, 0);

    if (time_string_hora > agora_hora) {
        data_hora_inicio.setHours(horas, 0, 0);
    } else {
        data_hora_inicio.setHours(agora.getHours() + 2, 0, 0);
    }

    const calendar = CalendarApp.getDefaultCalendar();
    const start_date = new Date('1970-01-01');
    const end_date = new Date('2150-01-01');
    const eventos = calendar.getEvents(start_date, end_date);

    for (let i = 0; i < eventos.length; i++) {
        if (eventos[i].getTag('identificador') === identificador || eventos[i].getDescription().includes(identificador)) {
            eventos[i].deleteEvent();
        }
    }

    const evento = calendar.createEvent(titulo_evento, data_hora_inicio, new Date(data_hora_inicio.getTime() + 60 * 60 * 1000), { description: descricao });
    evento.setTag('identificador', identificador);
    evento.addPopupReminder(0);
    evento.addPopupReminder(30);
    evento.addPopupReminder(60 * 1);
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

