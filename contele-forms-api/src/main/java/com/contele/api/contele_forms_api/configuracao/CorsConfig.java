package com.contele.api.contele_forms_api.configuracao;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

     @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") 
                // ✨ AQUI: Usamos a URL específica do seu frontend
                .allowedOrigins("http://localhost:5173") 
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") 
                .allowedHeaders("*"); 
    }
}