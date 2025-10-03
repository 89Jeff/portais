package com.contele.api.contele_forms_api.modelo;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class RespostaFormulariosContele {

    @JsonProperty("forms")
    private List<Object> forms;

    @JsonProperty("pagination")
    private Object pagination;

    // Getters e Setters
    public List<Object> getForms() {
        return forms;
    }

    public void setForms(List<Object> forms) {
        this.forms = forms;
    }

    public Object getPagination() {
        return pagination;
    }

    public void setPagination(Object pagination) {
        this.pagination = pagination;
    }
}
