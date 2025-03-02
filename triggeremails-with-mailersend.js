function sendEmailWithMailerSend(encodedToken, html, subject, recipientEmail, senderEmail, senderName) {
    const secretToken = secrettoken_id();
    const mailerSendApiKey = mailersend_id();
    const maxRetries = 3;
    const retryDelay = 2000;

    try {
        const receivedToken = Utilities.base64DecodeWebSafe(encodedToken);
        const receivedTokenString = String.fromCharCode.apply(null, receivedToken);

        if (receivedTokenString !== secretToken) {
            Logger.log("Erro: Token de autenticação inválido.");
            Logger.log("Token Recebido (Decodificado): " + receivedTokenString);
            Logger.log("Token Esperado: " + secretToken);
            return {
                status: "erro",
                message: "Erro: Token de autenticação inválido.",
                receivedToken: receivedTokenString,
                expectedToken: secretToken
            };
        }

        if (!html) {
            Logger.log("Erro: HTML não fornecido.");
            return {
                status: "erro",
                message: "Erro: HTML não fornecido."
            };
        }

        const payload = {
            "from": {
                "email": senderEmail,
                "name": senderName
            },
            "to": [{
                "email": recipientEmail
            }],
            "subject": subject,
            "html": html
        };

        const options = {
            "method": "post",
            "contentType": "application/json",
            "headers": {
                "Authorization": "Bearer " + mailerSendApiKey,
                "X-Requested-With": "XMLHttpRequest"
            },
            "payload": JSON.stringify(payload),
            "muteHttpExceptions": true
        };

        let response;
        let responseCode;
        let responseBody;
        let retries = 0;

        do {
            response = UrlFetchApp.fetch("https://api.mailersend.com/v1/email", options);
            responseCode = response.getResponseCode();
            responseBody = response.getContentText();

            if (responseCode >= 200 && responseCode < 300) {
                Logger.log("E-mail enviado com sucesso usando a API do MailerSend!");

                if (responseCode === 202) {
                    Logger.log("Resposta da API do MailerSend: 202 Accepted (Requisição Aceita)");
                    return {
                        status: "sucesso",
                        message: "E-mail enviado com sucesso! (202 Accepted)"
                    };
                } else {
                    // Caso o MailerSend retorne um código de sucesso diferente de 202
                    Logger.log("Resposta da API do MailerSend: " + responseBody);
                    return {
                        status: "sucesso",
                        message: "E-mail enviado com sucesso! Resposta: " + responseBody
                    };
                }

            } else {
                Logger.log("Erro ao enviar e-mail com a API do MailerSend. Código de status: " + responseCode);
                Logger.log("Resposta da API do MailerSend: " + responseBody);
                retries++;
                if (retries <= maxRetries) {
                    Logger.log(`Tentativa ${retries} de ${maxRetries}. Tentando novamente em ${retryDelay / 1000} segundos...`);
                    Utilities.sleep(retryDelay);
                }
            }
        } while (retries <= maxRetries);

        return {
            status: "erro",
            message: `Erro ao enviar e-mail após ${maxRetries} tentativas: ` + responseBody
        };

    } catch (error) {
        Logger.log("Erro ao enviar e-mail com a API do MailerSend: " + error);
        return {
            status: "erro",
            message: "Erro ao enviar e-mail: " + error
        };
    }
}