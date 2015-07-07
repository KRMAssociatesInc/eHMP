
package org.hl7.v3;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for PRPA_MT201304UV02.Person complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="PRPA_MT201304UV02.Person">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;group ref="{urn:hl7-org:v3}InfrastructureRootElements"/>
 *         &lt;element name="id" type="{urn:hl7-org:v3}II" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="name" type="{urn:hl7-org:v3}PN" maxOccurs="unbounded"/>
 *         &lt;element name="asPatientOfOtherProvider" type="{urn:hl7-org:v3}PRPA_MT201304UV02.PatientOfOtherProvider" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="asEmployee" type="{urn:hl7-org:v3}PRPA_MT201304UV02.Employee" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="asCitizen" type="{urn:hl7-org:v3}PRPA_MT201304UV02.Citizen" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="asStudent" type="{urn:hl7-org:v3}PRPA_MT201304UV02.Student" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="asMember" type="{urn:hl7-org:v3}PRPA_MT201304UV02.Member" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="asOtherIDs" type="{urn:hl7-org:v3}PRPA_MT201304UV02.OtherIDs" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *       &lt;attGroup ref="{urn:hl7-org:v3}InfrastructureRootAttributes"/>
 *       &lt;attribute name="nullFlavor" type="{urn:hl7-org:v3}NullFlavor" />
 *       &lt;attribute name="classCode" use="required" type="{urn:hl7-org:v3}EntityClass" fixed="PSN" />
 *       &lt;attribute name="determinerCode" use="required" type="{urn:hl7-org:v3}EntityDeterminer" fixed="INSTANCE" />
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "PRPA_MT201304UV02.Person", propOrder = {
    "realmCode",
    "typeId",
    "templateId",
    "id",
    "name",
    "asPatientOfOtherProvider",
    "asEmployee",
    "asCitizen",
    "asStudent",
    "asMember",
    "asOtherIDs"
})
public class PRPAMT201304UV02Person {

    protected List<CS> realmCode;
    protected II typeId;
    protected List<II> templateId;
    protected List<II> id;
    @XmlElement(required = true)
    protected List<PN> name;
    @XmlElement(nillable = true)
    protected List<PRPAMT201304UV02PatientOfOtherProvider> asPatientOfOtherProvider;
    @XmlElement(nillable = true)
    protected List<PRPAMT201304UV02Employee> asEmployee;
    @XmlElement(nillable = true)
    protected List<PRPAMT201304UV02Citizen> asCitizen;
    @XmlElement(nillable = true)
    protected List<PRPAMT201304UV02Student> asStudent;
    @XmlElement(nillable = true)
    protected List<PRPAMT201304UV02Member> asMember;
    @XmlElement(nillable = true)
    protected List<PRPAMT201304UV02OtherIDs> asOtherIDs;
    @XmlAttribute(name = "nullFlavor")
    protected List<String> nullFlavor;
    @XmlAttribute(name = "classCode", required = true)
    protected List<String> classCode;
    @XmlAttribute(name = "determinerCode", required = true)
    protected String determinerCode;

    /**
     * Gets the value of the realmCode property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the realmCode property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getRealmCode().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link CS }
     * 
     * 
     */
    public List<CS> getRealmCode() {
        if (realmCode == null) {
            realmCode = new ArrayList<CS>();
        }
        return this.realmCode;
    }

    /**
     * Gets the value of the typeId property.
     * 
     * @return
     *     possible object is
     *     {@link II }
     *     
     */
    public II getTypeId() {
        return typeId;
    }

    /**
     * Sets the value of the typeId property.
     * 
     * @param value
     *     allowed object is
     *     {@link II }
     *     
     */
    public void setTypeId(II value) {
        this.typeId = value;
    }

    /**
     * Gets the value of the templateId property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the templateId property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getTemplateId().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link II }
     * 
     * 
     */
    public List<II> getTemplateId() {
        if (templateId == null) {
            templateId = new ArrayList<II>();
        }
        return this.templateId;
    }

    /**
     * Gets the value of the id property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the id property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getId().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link II }
     * 
     * 
     */
    public List<II> getId() {
        if (id == null) {
            id = new ArrayList<II>();
        }
        return this.id;
    }

    /**
     * Gets the value of the name property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the name property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getName().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link PN }
     * 
     * 
     */
    public List<PN> getName() {
        if (name == null) {
            name = new ArrayList<PN>();
        }
        return this.name;
    }

    /**
     * Gets the value of the asPatientOfOtherProvider property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the asPatientOfOtherProvider property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getAsPatientOfOtherProvider().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link PRPAMT201304UV02PatientOfOtherProvider }
     * 
     * 
     */
    public List<PRPAMT201304UV02PatientOfOtherProvider> getAsPatientOfOtherProvider() {
        if (asPatientOfOtherProvider == null) {
            asPatientOfOtherProvider = new ArrayList<PRPAMT201304UV02PatientOfOtherProvider>();
        }
        return this.asPatientOfOtherProvider;
    }

    /**
     * Gets the value of the asEmployee property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the asEmployee property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getAsEmployee().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link PRPAMT201304UV02Employee }
     * 
     * 
     */
    public List<PRPAMT201304UV02Employee> getAsEmployee() {
        if (asEmployee == null) {
            asEmployee = new ArrayList<PRPAMT201304UV02Employee>();
        }
        return this.asEmployee;
    }

    /**
     * Gets the value of the asCitizen property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the asCitizen property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getAsCitizen().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link PRPAMT201304UV02Citizen }
     * 
     * 
     */
    public List<PRPAMT201304UV02Citizen> getAsCitizen() {
        if (asCitizen == null) {
            asCitizen = new ArrayList<PRPAMT201304UV02Citizen>();
        }
        return this.asCitizen;
    }

    /**
     * Gets the value of the asStudent property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the asStudent property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getAsStudent().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link PRPAMT201304UV02Student }
     * 
     * 
     */
    public List<PRPAMT201304UV02Student> getAsStudent() {
        if (asStudent == null) {
            asStudent = new ArrayList<PRPAMT201304UV02Student>();
        }
        return this.asStudent;
    }

    /**
     * Gets the value of the asMember property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the asMember property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getAsMember().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link PRPAMT201304UV02Member }
     * 
     * 
     */
    public List<PRPAMT201304UV02Member> getAsMember() {
        if (asMember == null) {
            asMember = new ArrayList<PRPAMT201304UV02Member>();
        }
        return this.asMember;
    }

    /**
     * Gets the value of the asOtherIDs property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the asOtherIDs property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getAsOtherIDs().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link PRPAMT201304UV02OtherIDs }
     * 
     * 
     */
    public List<PRPAMT201304UV02OtherIDs> getAsOtherIDs() {
        if (asOtherIDs == null) {
            asOtherIDs = new ArrayList<PRPAMT201304UV02OtherIDs>();
        }
        return this.asOtherIDs;
    }

    /**
     * Gets the value of the nullFlavor property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the nullFlavor property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getNullFlavor().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getNullFlavor() {
        if (nullFlavor == null) {
            nullFlavor = new ArrayList<String>();
        }
        return this.nullFlavor;
    }

    /**
     * Gets the value of the classCode property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the classCode property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getClassCode().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link String }
     * 
     * 
     */
    public List<String> getClassCode() {
        if (classCode == null) {
            classCode = new ArrayList<String>();
        }
        return this.classCode;
    }

    /**
     * Gets the value of the determinerCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDeterminerCode() {
        if (determinerCode == null) {
            return "INSTANCE";
        } else {
            return determinerCode;
        }
    }

    /**
     * Sets the value of the determinerCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDeterminerCode(String value) {
        this.determinerCode = value;
    }

}
