package com.contele.api.contele_forms_api.modelo;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@Data
public class FormularioMedicao {
    
     @JsonProperty("tipo_produto")
    private TipoProduto tipoProduto;

    @JsonProperty("andamie")
    private boolean andamie;

    @JsonProperty("icamento")
    private boolean icamento;

    @JsonProperty("ambientes")
    private List<Ambiente> ambientes;

    @Data
    public static class Ambiente {
        @JsonProperty("nome_ambiente")
        private String nome;

        @JsonProperty("largura")
        private String largura;

        @JsonProperty("altura")
        private String altura;

        @JsonProperty("lado_comando")
        private LadoComando ladoComando;

        @JsonProperty("instalacao")
        private TipoInstalacao instalacao;

        @JsonProperty("ha_puxadores")
        private boolean haPuxadores;

        @JsonProperty("instalacao_com_transpasse")
        private boolean instalacaoComTranspasse;

        @JsonProperty("descontar_rodape")
        private boolean descontarRodape;

        @JsonProperty("lado_motor")
        private LadoMotor ladoMotor;
    }

    public enum TipoProduto {
        @JsonProperty("cortinas_de_confeccao")
        CORTINAS_DE_CONFECCAO,
        @JsonProperty("hunter_douglas")
        HUNTER_DOUGLAS
    }

    public enum LadoComando {
        @JsonProperty("ESQ")
        ESQ,
        @JsonProperty("DIR")
        DIR
    }

    public enum TipoInstalacao {
        @JsonProperty("TETO")
        TETO,
        @JsonProperty("PAREDE")
        PAREDE,
        @JsonProperty("DENTRO_DO_VAO")
        DENTRO_DO_VAO
    }

    public enum LadoMotor {
        @JsonProperty("ESQ")
        ESQ,
        @JsonProperty("DIR")
        DIR
    }
}