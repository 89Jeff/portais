package com.contele.api.contele_forms_api.modelo;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Endereco {

     @JsonProperty("location")
    private Object location;

    @JsonProperty("neighborhood")
    private String neighborhood;

    @JsonProperty("zipcode")
    private String zipcode;

    @JsonProperty("city")
    private String city;

    @JsonProperty("complement")
    private String complement;

    @JsonProperty("name")
    private Object name;

    @JsonProperty("number")
    private String number;

    @JsonProperty("state")
    private String state;

    @JsonProperty("simpleName")
    private Object simpleName;

    @JsonProperty("nameBackup")
    private Object nameBackup;

    @JsonProperty("street")
    private String street;

    // Getters and Setters
    public Object getLocation() { return location; }
    public void setLocation(Object location) { this.location = location; }
    public String getNeighborhood() { return neighborhood; }
    public void setNeighborhood(String neighborhood) { this.neighborhood = neighborhood; }
    public String getZipcode() { return zipcode; }
    public void setZipcode(String zipcode) { this.zipcode = zipcode; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getComplement() { return complement; }
    public void setComplement(String complement) { this.complement = complement; }
    public Object getName() { return name; }
    public void setName(Object name) { this.name = name; }
    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public Object getSimpleName() { return simpleName; }
    public void setSimpleName(Object simpleName) { this.simpleName = simpleName; }
    public Object getNameBackup() { return nameBackup; }
    public void setNameBackup(Object nameBackup) { this.nameBackup = nameBackup; }
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    
}
