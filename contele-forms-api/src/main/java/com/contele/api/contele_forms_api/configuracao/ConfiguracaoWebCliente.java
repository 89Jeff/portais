package com.contele.api.contele_forms_api.configuracao;

import io.netty.handler.logging.LogLevel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import reactor.netty.transport.logging.AdvancedByteBufFormat;
import java.time.Duration;

@Configuration
public class ConfiguracaoWebCliente {

    @Value("${contele.api.forms.base-url}")
    private String urlBaseForms;

    @Value("${contele.api.tasks.base-url}")
    private String urlBaseTasks;

    @Value("${contele.api.users.base-url}")
    private String urlBaseUsers;

    @Value("${contele.api.token}")
    private String tokenApi;

    @Value("${contele.api.key}")
    private String apiKey;

    @Bean("formsWebClient")
    public WebClient clienteWebConteleForms() {
        return createWebClient(urlBaseForms, true, false);
    }

    @Bean("tasksWebClient")
    public WebClient clienteWebConteleTasks() {
        return createWebClient(urlBaseTasks, true, true);
    }

    @Bean("usersWebClient")
    public WebClient clienteWebConteleUsers() {
        return createWebClient(urlBaseUsers, true, true);
    }

    private WebClient createWebClient(String baseUrl, boolean withAuth, boolean withApiKey) {
        HttpClient httpClient = HttpClient.create()
                // Define um timeout de resposta de 30 segundos para as requisições HTTP.
                .responseTimeout(Duration.ofSeconds(30))
                .wiretap("reactor.netty.http.client.HttpClient", LogLevel.DEBUG, AdvancedByteBufFormat.HEX_DUMP);

        final int size = 10 * 1024 * 1024;
        final ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(size))
                .build();

        WebClient.Builder builder = WebClient.builder()
                .baseUrl(baseUrl)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .exchangeStrategies(strategies);

        if (withAuth) {
            builder.defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + tokenApi);
        }
        if (withApiKey) {
            builder.defaultHeader("x-api-key", apiKey);
        }

        return builder.build();
    }
}
