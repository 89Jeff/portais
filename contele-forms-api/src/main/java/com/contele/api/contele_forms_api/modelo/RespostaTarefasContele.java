package com.contele.api.contele_forms_api.modelo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RespostaTarefasContele {
    private List<Tarefa> tasks;
    private Paginacao pagination;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Paginacao {
        private int page;
        private int per_page;
        private int total_pages;
        private int total_items;
    }
}
