package com.contele.api.contele_forms_api.modelo;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class Usuario {
    private String id;
    private String nome;
    private String email;
    @JsonProperty("username")
    private String username;
    @JsonProperty("full_name")
    private String nomeCompleto;
}