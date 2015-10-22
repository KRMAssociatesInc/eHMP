package us.vistacore.vxsync.config;


import com.fasterxml.jackson.annotation.JsonProperty;

public class DodServicesEnabled {

    @JsonProperty("allergy")
    private Boolean allergy;

    @JsonProperty("appointment")
    private Boolean appointment;

    @JsonProperty("consultnote")
    private Boolean consultnote;

    @JsonProperty("demographics")
    private Boolean demographics;

    @JsonProperty("encounter")
    private Boolean encounter;

    @JsonProperty("immunization")
    private Boolean immunization;

    @JsonProperty("lab")
    private Boolean lab;

    @JsonProperty("medication")
    private Boolean medication;

    @JsonProperty("note")
    private Boolean note;

    @JsonProperty("order")
    private Boolean order;

    @JsonProperty("patient")
    private Boolean patient;

    @JsonProperty("problem")
    private Boolean problem;

    @JsonProperty("radiology")
    private Boolean radiology;

    @JsonProperty("vital")
    private Boolean vital;

    public Boolean getAllergy() {
        return allergy;
    }

    public void setAllergy(Boolean allergy) {
        this.allergy = allergy;
    }

    public Boolean getAppointment() {
        return appointment;
    }

    public void setAppointment(Boolean appointment) {
        this.appointment = appointment;
    }

    public Boolean getConsultnote() {
        return consultnote;
    }

    public void setConsultnote(Boolean consultnote) {
        this.consultnote = consultnote;
    }

    public Boolean getDemographics() {
        return demographics;
    }

    public void setDemographics(Boolean demographics) {
        this.demographics = demographics;
    }

    public Boolean getEncounter() {
        return encounter;
    }

    public void setEncounter(Boolean encounter) {
        this.encounter = encounter;
    }

    public Boolean getImmunization() {
        return immunization;
    }

    public void setImmunization(Boolean immunization) {
        this.immunization = immunization;
    }

    public Boolean getLab() {
        return lab;
    }

    public void setLab(Boolean lab) {
        this.lab = lab;
    }

    public Boolean getMedication() {
        return medication;
    }

    public void setMedication(Boolean medication) {
        this.medication = medication;
    }

    public Boolean getNote() {
        return note;
    }

    public void setNote(Boolean note) {
        this.note = note;
    }

    public Boolean getOrder() {
        return order;
    }

    public void setOrder(Boolean order) {
        this.order = order;
    }

    public Boolean getPatient() {
        return patient;
    }

    public void setPatient(Boolean patient) {
        this.patient = patient;
    }

    public Boolean getProblem() {
        return problem;
    }

    public void setProblem(Boolean problem) {
        this.problem = problem;
    }

    public Boolean getRadiology() {
        return radiology;
    }

    public void setRadiology(Boolean radiology) {
        this.radiology = radiology;
    }

    public Boolean getVital() {
        return vital;
    }

    public void setVital(Boolean vital) {
        this.vital = vital;
    }
}
