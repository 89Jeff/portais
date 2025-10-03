package com.contele.api.contele_forms_api.modelo;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class Poi {

    @JsonProperty("id")
    private String id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("obs")
    private Object obs;

    @JsonProperty("corporateName")
    private String corporateName;

    @JsonProperty("cnpj_cpf")
    private String cnpjCpf;

    // Ajustado para usar sua classe Endereco
    @JsonProperty("address")
    private Endereco address;

    @JsonProperty("contacts")
    private List<Contato> contacts;

    @JsonProperty("lat")
    private double lat;

    @JsonProperty("lng")
    private double lng;

    @JsonProperty("locationReliability")
    private Object locationReliability;

    @JsonProperty("searchTerm")
    private Object searchTerm;

    @JsonProperty("search_term")
    private Object searchTermBackup;

    @JsonProperty("fullTextSearchTerm")
    private Object fullTextSearchTerm;

    @JsonProperty("status")
    private String status;

    @JsonProperty("origin")
    private Object origin;

    @JsonProperty("clientId")
    private Object clientId;

    @JsonProperty("creatorId")
    private Object creatorId;

    @JsonProperty("creatorName")
    private Object creatorName;

    @JsonProperty("createdAt")
    private String createdAt;

    @JsonProperty("updatedAt")
    private String updatedAt;

    @JsonProperty("data")
    private Object data;

    @JsonProperty("categoryId")
    private String categoryId;

    @JsonProperty("importId")
    private Object importId;

    @JsonProperty("localId")
    private Object localId;

    @JsonProperty("positionedByCheckin")
    private Object positionedByCheckin;

    @JsonProperty("customId")
    private String customId;

    @JsonProperty("categoryName")
    private String categoryName;

    @JsonProperty("categoryColor")
    private String categoryColor;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Object getObs() { return obs; }
    public void setObs(Object obs) { this.obs = obs; }
    public String getCorporateName() { return corporateName; }
    public void setCorporateName(String corporateName) { this.corporateName = corporateName; }
    public String getCnpjCpf() { return cnpjCpf; }
    public void setCnpjCpf(String cnpjCpf) { this.cnpjCpf = cnpjCpf; }
    public Endereco getAddress() { return address; }
    public void setAddress(Endereco address) { this.address = address; }
    public List<Contato> getContacts() { return contacts; }
    public void setContacts(List<Contato> contacts) { this.contacts = contacts; }
    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }
    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }
    public Object getLocationReliability() { return locationReliability; }
    public void setLocationReliability(Object locationReliability) { this.locationReliability = locationReliability; }
    public Object getSearchTerm() { return searchTerm; }
    public void setSearchTerm(Object searchTerm) { this.searchTerm = searchTerm; }
    public Object getSearchTermBackup() { return searchTermBackup; }
    public void setSearchTermBackup(Object searchTermBackup) { this.searchTermBackup = searchTermBackup; }
    public Object getFullTextSearchTerm() { return fullTextSearchTerm; }
    public void setFullTextSearchTerm(Object fullTextSearchTerm) { this.fullTextSearchTerm = fullTextSearchTerm; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Object getOrigin() { return origin; }
    public void setOrigin(Object origin) { this.origin = origin; }
    public Object getClientId() { return clientId; }
    public void setClientId(Object clientId) { this.clientId = clientId; }
    public Object getCreatorId() { return creatorId; }
    public void setCreatorId(Object creatorId) { this.creatorId = creatorId; }
    public Object getCreatorName() { return creatorName; }
    public void setCreatorName(Object creatorName) { this.creatorName = creatorName; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }
    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
    public Object getImportId() { return importId; }
    public void setImportId(Object importId) { this.importId = importId; }
    public Object getLocalId() { return localId; }
    public void setLocalId(Object localId) { this.localId = localId; }
    public Object getPositionedByCheckin() { return positionedByCheckin; }
    public void setPositionedByCheckin(Object positionedByCheckin) { this.positionedByCheckin = positionedByCheckin; }
    public String getCustomId() { return customId; }
    public void setCustomId(String customId) { this.customId = customId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getCategoryColor() { return categoryColor; }
    public void setCategoryColor(String categoryColor) { this.categoryColor = categoryColor; }
}
