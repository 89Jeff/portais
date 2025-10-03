package com.contele.api.contele_forms_api.modelo;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;


public class Tarefa {

    @JsonProperty("id")
    private String id;

    @JsonProperty("creatorId")
    private String creatorId;

    @JsonProperty("clientId")
    private String clientId;

    @JsonProperty("userId")
    private String userId;

    @JsonProperty("poiId")
    private String poiId;

    @JsonProperty("datetime")
    private String datetime;

    @JsonProperty("withTime")
    private boolean withTime;

    @JsonProperty("observation")
    private String observation;

    @JsonProperty("status")
    private String status;

    @JsonProperty("read")
    private boolean read;

    @JsonProperty("received")
    private boolean received;

    @JsonProperty("rescheduled")
    private boolean rescheduled;

    @JsonProperty("origin")
    private String origin;

    @JsonProperty("os")
    private String os;

    @JsonProperty("sequence")
    private String sequence;

    @JsonProperty("order")
    private String order;

    @JsonProperty("poi")
    private Poi poi;

    @JsonProperty("originalDate")
    private String originalDate;

    @JsonProperty("createdAt")
    private String createdAt;

    @JsonProperty("updatedAt")
    private String updatedAt;

    @JsonProperty("formsAnsweredFarFormPoi")
    private boolean formsAnsweredFarFormPoi;

    @JsonProperty("creatorName")
    private String creatorName;

    @JsonProperty("date")
    private String date;

    @JsonProperty("hasForms")
    private boolean hasForms;

    @JsonProperty("recurrenceId")
    private String recurrenceId;

    @JsonProperty("forms")
    private List<Object> forms;

    @JsonProperty("checkinTime")
    private String checkinTime;

    @JsonProperty("checkoutTime")
    private String checkoutTime;

    @JsonProperty("comments")
    private String comments;

    @JsonProperty("poiId2")
    private String poiId2;

    @JsonProperty("recurrence")
    private Object recurrence;

    @JsonProperty("timezone")
    private String timezone;

    @JsonProperty("userName")
    private String userName;

    @JsonProperty("userMail")
    private String userMail;

    @JsonProperty("userData")
    private Object userData;

    @JsonProperty("creatorData")
    private Object creatorData;

    @JsonProperty("tags")
    private List<Tag> tags;

    // Getters e Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCreatorId() { return creatorId; }
    public void setCreatorId(String creatorId) { this.creatorId = creatorId; }
    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getPoiId() { return poiId; }
    public void setPoiId(String poiId) { this.poiId = poiId; }
    public String getDatetime() { return datetime; }
    public void setDatetime(String datetime) { this.datetime = datetime; }
    public boolean isWithTime() { return withTime; }
    public void setWithTime(boolean withTime) { this.withTime = withTime; }
    public String getObservation() { return observation; }
    public void setObservation(String observation) { this.observation = observation; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
    public boolean isReceived() { return received; }
    public void setReceived(boolean received) { this.received = received; }
    public boolean isRescheduled() { return rescheduled; }
    public void setRescheduled(boolean rescheduled) { this.rescheduled = rescheduled; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    public String getOs() { return os; }
    public void setOs(String os) { this.os = os; }
    public String getSequence() { return sequence; }
    public void setSequence(String sequence) { this.sequence = sequence; }
    public String getOrder() { return order; }
    public void setOrder(String order) { this.order = order; }
    public Poi getPoi() { return poi; }
    public void setPoi(Poi poi) { this.poi = poi; }
    public String getOriginalDate() { return originalDate; }
    public void setOriginalDate(String originalDate) { this.originalDate = originalDate; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
    public boolean isFormsAnsweredFarFormPoi() { return formsAnsweredFarFormPoi; }
    public void setFormsAnsweredFarFormPoi(boolean formsAnsweredFarFormPoi) { this.formsAnsweredFarFormPoi = formsAnsweredFarFormPoi; }
    public String getCreatorName() { return creatorName; }
    public void setCreatorName(String creatorName) { this.creatorName = creatorName; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public boolean isHasForms() { return hasForms; }
    public void setHasForms(boolean hasForms) { this.hasForms = hasForms; }
    public String getRecurrenceId() { return recurrenceId; }
    public void setRecurrenceId(String recurrenceId) { this.recurrenceId = recurrenceId; }
    public List<Object> getForms() { return forms; }
    public void setForms(List<Object> forms) { this.forms = forms; }
    public String getCheckinTime() { return checkinTime; }
    public void setCheckinTime(String checkinTime) { this.checkinTime = checkinTime; }
    public String getCheckoutTime() { return checkoutTime; }
    public void setCheckoutTime(String checkoutTime) { this.checkoutTime = checkoutTime; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    public String getPoiId2() { return poiId2; }
    public void setPoiId2(String poiId2) { this.poiId2 = poiId2; }
    public Object getRecurrence() { return recurrence; }
    public void setRecurrence(Object recurrence) { this.recurrence = recurrence; }
    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getUserMail() { return userMail; }
    public void setUserMail(String userMail) { this.userMail = userMail; }
    public Object getUserData() { return userData; }
    public void setUserData(Object userData) { this.userData = userData; }
    public Object getCreatorData() { return creatorData; }
    public void setCreatorData(Object creatorData) { this.creatorData = creatorData; }
    public List<Tag> getTags() { return tags; }
    public void setTags(List<Tag> tags) { this.tags = tags; }
}
