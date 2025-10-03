package com.contele.api.contele_forms_api.modelo;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class RespostaTemplatesFormulariosContele {

    @JsonProperty("forms_templates")
    private List<Object> formsTemplates;

    // Getters e Setters
    public List<Object> getFormsTemplates() {
        return formsTemplates;
    }

    public void setFormsTemplates(List<Object> formsTemplates) {
        this.formsTemplates = formsTemplates;
    }
}
