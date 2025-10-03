package com.contele.api.contele_forms_api.modelo;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Tag {

    @JsonProperty("id")
    private String id;

    // Mapeia o campo "tagName" do JSON para o atributo "name"
    @JsonProperty("tagName")
    private String name;

    @JsonProperty("color")
    private String color;

    @JsonProperty("isDefault")
    private Boolean isDefault;

    @JsonProperty("clientId")
    private String clientId;

    @JsonProperty("creatorId")
    private String creatorId;

    @JsonProperty("createdAt")
    private String createdAt;

    @JsonProperty("updatedAt")
    private String updatedAt;

    // Outros campos do JSON que você pode precisar mapear no futuro:
    @JsonProperty("urn")
    private String urn;
    
    @JsonProperty("createdBy")
    private String createdBy;

    // Getters e Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Boolean getIsDefault() {
        return isDefault;
    }

    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUrn() {
        return urn;
    }

    public void setUrn(String urn) {
        this.urn = urn;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}
