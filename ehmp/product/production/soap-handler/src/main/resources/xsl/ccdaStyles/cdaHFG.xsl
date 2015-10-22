<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:n1="urn:hl7-org:v3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   
   <xsl:output method="html" indent="yes" version="4.01" encoding="ISO-8859-1" doctype-system="http://www.w3.org/TR/html4/strict.dtd" doctype-public="-//W3C//DTD HTML 4.01//EN"/>
 
   <!-- global variable title -->
   <xsl:variable name="title">
      <xsl:choose>
         <xsl:when test="string-length(/n1:ClinicalDocument/n1:title)  &gt;= 1">
            <xsl:value-of select="/n1:ClinicalDocument/n1:title"/>
         </xsl:when>
         <xsl:when test="/n1:ClinicalDocument/n1:code/@displayName">
            <xsl:value-of select="/n1:ClinicalDocument/n1:code/@displayName"/>
         </xsl:when>
         <xsl:otherwise>
            <xsl:text>Clinical Document</xsl:text>
         </xsl:otherwise>
      </xsl:choose>
   </xsl:variable>


	   <xsl:variable name="ccdTemplateIdArray">
		   <templateId>2.16.840.1.113883.10.20.22.2.6</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.5</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.1</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.4</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.3</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.2</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.22</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.7</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.10</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.14</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.15</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.17</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.18</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.21</templateId>
	   </xsl:variable> 
	   
	   <xsl:param name="ccdTemplateIdArrayParam" select="document('')/*/xsl:variable[@name='ccdTemplateIdArray']/*" />
	   
	   <xsl:variable name="ccdAdditionalTemplateIdArray">
	   
           	   <templateId>2.16.840.1.113883.10.20.22.2.25</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.9</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.8</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.13</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.37</templateId>
		   <templateId>2.16.840.1.113883.10.20.6.1.1</templateId>
		   <templateId>1.3.6.1.4.1.19376.1.5.3.1.3.33</templateId>
		   <templateId>2.16.840.1.113883.10.20.6.1.2</templateId>
		   <templateId>2.16.840.1.113883.10.20.2.5</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.20</templateId>
		   <templateId>1.3.6.1.4.1.19376.1.5.3.1.3.4</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.43</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.44</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.42</templateId>
		   <templateId>1.3.6.1.4.1.19376.1.5.3.1.3.5</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.24</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.41</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.11.1</templateId>
		   <templateId>1.3.6.1.4.1.19376.1.5.3.1.3.26</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.16</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.45</templateId>
		   <templateId>2.16.840.1.113883.10.20.21.2.3</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.23</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.39</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.38</templateId>
		   <templateId>2.16.840.1.113883.10.20.21.2.1</templateId>
		   <templateId>2.16.840.1.113883.10.20.7.12</templateId>
		   <templateId>2.16.840.1.113883.10.20.7.14</templateId>
		   <templateId>2.16.840.1.113883.10.20.2.10</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.30</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.35</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.36</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.34</templateId>
		   <templateId>2.16.840.1.113883.10.20.18.2.12</templateId>
		   <templateId>2.16.840.1.113883.10.20.18.2.9</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.28</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.40</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.29</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.31</templateId>
		   <templateId>1.3.6.1.4.1.19376.1.5.3.1.3.1</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.12</templateId>
		   <templateId>1.3.6.1.4.1.19376.1.5.3.1.3.18</templateId>
		   <templateId>2.16.840.1.113883.10.20.7.13</templateId>  
	   
	   </xsl:variable> 
	   
	   <xsl:param name="ccdAdditionalTemplateIdArrayParam" select="document('')/*/xsl:variable[@name='ccdAdditionalTemplateIdArray']/*" />
	   
	   <xsl:variable name="progressAdditionalTemplateIdArray">
	   
           	   <templateId>2.16.840.1.113883.10.20.22.2.25</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.9</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.13</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.37</templateId>
		   <templateId>2.16.840.1.113883.10.20.6.1.1</templateId>
		   <templateId>1.3.6.1.4.1.19376.1.5.3.1.3.33</templateId>
           	   <templateId>2.16.840.1.113883.10.20.22.2.15</templateId>
		   <templateId>2.16.840.1.113883.10.20.6.1.2</templateId>
		   <templateId>2.16.840.1.113883.10.20.2.5</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.20</templateId>
		   <templateId>1.3.6.1.4.1.19376.1.5.3.1.3.4</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.43</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.44</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.42</templateId>
		   <templateId>1.3.6.1.4.1.19376.1.5.3.1.3.5</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.24</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.41</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.11.1</templateId>
		   <templateId>1.3.6.1.4.1.19376.1.5.3.1.3.26</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.16</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.2.1</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.23</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.39</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.38</templateId>
		   <templateId>2.16.840.1.113883.10.20.7.12</templateId>
		   <templateId>2.16.840.1.113883.10.20.7.14</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.18</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.30</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.35</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.36</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.34</templateId>
		   <templateId>2.16.840.1.113883.10.20.18.2.12</templateId>
		   <templateId>2.16.840.1.113883.10.20.18.2.9</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.28</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.40</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.29</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.31</templateId>
		   <templateId>1.3.6.1.4.1.19376.1.5.3.1.3.1</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.12</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.17</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.2</templateId>
		   <templateId>2.16.840.1.113883.10.20.7.13</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.21</templateId> 
		   <templateId>2.16.840.1.113883.10.20.22.2.22</templateId>
	   
	   </xsl:variable> 	   
	   
	   <xsl:param name="progressAdditionalTemplateIdArrayParam" select="document('')/*/xsl:variable[@name='progressAdditionalTemplateIdArray']/*" />

	   <xsl:variable name="progressTemplateIdArray">
		   <templateId>2.16.840.1.113883.10.20.22.2.8</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.10</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.6</templateId>
		   <templateId>1.3.6.1.4.1.19376.1.5.3.1.1.13.2.1</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.45</templateId>
		   <templateId>2.16.840.1.113883.10.20.21.2.3</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.1</templateId>
		   <templateId>2.16.840.1.113883.10.20.21.2.1</templateId>
		   <templateId>2.16.840.1.113883.10.20.2.10</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.5</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.3</templateId>
		   <templateId>1.3.6.1.4.1.19376.1.5.3.1.3.18</templateId>
		   <templateId>2.16.840.1.113883.10.20.21.2.2</templateId>
		   <templateId>2.16.840.1.113883.10.20.22.2.4</templateId>
	   </xsl:variable> 
	   
	   <xsl:param name="progressTemplateIdArrayParam" select="document('')/*/xsl:variable[@name='progressTemplateIdArray']/*" />
	   
	   <xsl:variable name="ccdSectionHeader">
		   <headerName>Allergies</headerName>
		   <headerName>Problems</headerName>
		   <headerName>Medications</headerName>
		   <headerName>Vital Signs</headerName>
		   <headerName>Results</headerName>
		   <headerName>Immunizations</headerName>
		   <headerName>Encounters</headerName>
		   <headerName>Procedures</headerName>
		   <headerName>Plan of Care</headerName>
		   <headerName>Functional Status</headerName>
		   <headerName>Family History</headerName>
		   <headerName>Social History</headerName>
		   <headerName>Insurance Providers</headerName>
		   <headerName>Advance Directive</headerName>
	   </xsl:variable>
	   
	   <xsl:param name="ccdSectionHeaderParam" select="document('')/*/xsl:variable[@name='ccdSectionHeader']/*" />
	   
	   <xsl:variable name="ccdAdditionalSectionHeader">
		<headerName>Anesthesia</headerName>
		<headerName>Assessment And Plan</headerName>
		<headerName>Assessment</headerName>
		<headerName>REASON FOR VISIT/CHIEF COMPLAINT</headerName>
		<headerName>Complications</headerName>
		<headerName>DICOM Object Catalog</headerName>
		<headerName>Discharge Diet</headerName>
		<headerName>Findings</headerName>
		<headerName>General Status</headerName>
		<headerName>Past Medical History</headerName>
		<headerName>History Of Present Illness</headerName>
		<headerName>Hospital Admission Diagnosis</headerName>
		<headerName>Hospital Admission Medications Entries</headerName>
		<headerName>Hospital Consultations</headerName>
		<headerName>Hospital Course</headerName>
		<headerName>Hospital Discharge Diagnosis</headerName>
		<headerName>Hospital Discharge Instructions</headerName>
		<headerName>Hospital Discharge Medications</headerName>
		<headerName>Hospital Discharge Physical</headerName>
		<headerName>Hospital Discharge Studies Summary</headerName>
		<headerName>Instructions</headerName>
		<headerName>Interventions</headerName>
		<headerName>Medical Equipment</headerName>
		<headerName>Medical History</headerName>
		<headerName>Medications Administered</headerName>
		<headerName>Objective</headerName>
		<headerName>Operative Note Fluid</headerName>
		<headerName>Operative Note Surgical Procedure</headerName>
		<headerName>PhysicalExam</headerName>
		<headerName>Planned Procedure</headerName>
		<headerName>Postoperative Diagnosis</headerName>
		<headerName>Postprocedure Diagnosis</headerName>
		<headerName>Preoperative Diagnosis</headerName>
		<headerName>Procedure Disposition</headerName>
		<headerName>Procedure Estimated Blood Loss</headerName>
		<headerName>Procedure Findings</headerName>
		<headerName>Procedure Implants</headerName>
		<headerName>Procedure Indications</headerName>
		<headerName>Procedure Specimens Taken</headerName>
		<headerName>Reason For Referral</headerName>
		<headerName>Reason For Visit</headerName>
		<headerName>Review Of Systems</headerName>
		<headerName>Surgical Drains</headerName>
	   </xsl:variable>
	   
	   <xsl:param name="ccdAdditionalSectionHeaderParam" select="document('')/*/xsl:variable[@name='ccdAdditionalSectionHeader']/*" />
	   
	   <xsl:variable name="progressAdditionalSectionHeader">
		<headerName>Anesthesia</headerName>
		<headerName>Assessment And Plan</headerName>
		<headerName>REASON FOR VISIT/CHIEF COMPLAINT</headerName>
		<headerName>Complications</headerName>
		<headerName>DICOM Object Catalog</headerName>
		<headerName>Discharge Diet</headerName>
		<headerName>Family History</headerName> 
		<headerName>Findings</headerName>
		<headerName>General Status</headerName>
		<headerName>Past Medical History</headerName>
		<headerName>History Of Present Illness</headerName>
		<headerName>Hospital Admission Diagnosis</headerName>
		<headerName>Hospital Admission Medications Entries</headerName>
		<headerName>Hospital Consultations</headerName>
		<headerName>Hospital Course</headerName>
		<headerName>Hospital Discharge Diagnosis</headerName>
		<headerName>Hospital Discharge Instructions</headerName>
		<headerName>Hospital Discharge Medications</headerName>
		<headerName>Hospital Discharge Physical</headerName>
		<headerName>Hospital Discharge Studies Summary</headerName>
		<headerName>Immunizations</headerName> 
		<headerName>Medical Equipment</headerName>
		<headerName>Medical History</headerName>
		<headerName>Medications Administered</headerName>
		<headerName>Operative Note Fluid</headerName>
		<headerName>Operative Note Surgical Procedure</headerName>
		<headerName>Insurance Providers</headerName>
		<headerName>Planned Procedure</headerName>
		<headerName>Postoperative Diagnosis</headerName>
		<headerName>Postprocedure Diagnosis</headerName>
		<headerName>Preoperative Diagnosis</headerName>
		<headerName>Procedure Disposition</headerName>
		<headerName>Procedure Estimated Blood Loss</headerName>
		<headerName>Procedure Findings</headerName>
		<headerName>Procedure Implants</headerName>
		<headerName>Procedure Indications</headerName>
		<headerName>Procedure Specimens Taken</headerName>
		<headerName>Reason For Referral</headerName>
		<headerName>Reason For Visit</headerName>
		<headerName>Social History</headerName> 
		<headerName>Immunizations Entries</headerName> 
		<headerName>Surgical Drains</headerName>
		<headerName>Advance Directive</headerName>
		<headerName>Encounters</headerName>
	   </xsl:variable>
	   
	   <xsl:param name="progressAdditionalSectionHeaderParam" select="document('')/*/xsl:variable[@name='progressAdditionalSectionHeader']/*" />
	   
	   <xsl:variable name="ccdSectionHeaderHref">
		   <titleId><xsl:value-of select="generate-id($ccdSectionHeaderParam/headerName[1])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdSectionHeaderParam/headerName[2])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdSectionHeaderParam/headerName[3])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdSectionHeaderParam/headerName[4])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdSectionHeaderParam/headerName[5])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdSectionHeaderParam/headerName[6])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdSectionHeaderParam/headerName[7])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdSectionHeaderParam/headerName[8])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdSectionHeaderParam/headerName[9])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdSectionHeaderParam/headerName[10])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdSectionHeaderParam/headerName[11])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdSectionHeaderParam/headerName[12])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdSectionHeaderParam/headerName[13])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdSectionHeaderParam/headerName[14])" /></titleId>
	   </xsl:variable>	
	   
	   <xsl:param name="ccdSectionHeaderRefParam" select="document('')/*/xsl:variable[@name='ccdSectionHeaderHref']/*" />
	   
	   <xsl:variable name="ccdAdditionalSectionHeaderHref">
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[1])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[2])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[3])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[4])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[5])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[6])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[7])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[8])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[9])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[10])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[11])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[12])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[13])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[14])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[15])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[16])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[17])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[18])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[19])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[20])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[21])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[22])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[23])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[24])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[25])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[26])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[27])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[28])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[29])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[30])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[31])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[32])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[33])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[34])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[35])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[36])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[37])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[38])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[39])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[40])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[41])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[42])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($ccdAdditionalSectionHeaderParam/headerName[43])" /></titleId>
	   </xsl:variable>	
	   
	   <xsl:param name="ccdAdditionalSectionHeaderHrefParam" select="document('')/*/xsl:variable[@name='ccdAdditionalSectionHeaderHref']/*" />
	   
	   <xsl:variable name="progressAdditionalSectionHeaderHref">
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[1])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[2])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[3])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[4])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[5])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[6])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[7])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[8])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[9])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[10])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[11])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[12])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[13])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[14])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[15])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[16])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[17])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[18])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[19])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[20])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[21])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[22])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[23])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[24])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[25])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[26])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[27])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[28])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[29])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[30])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[31])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[32])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[33])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[34])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[35])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[36])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[37])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[38])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[39])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[40])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[41])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[42])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[43])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progressAdditionalSectionHeaderParam/headerName[44])" /></titleId>

	   </xsl:variable>	   

		<xsl:param name="progressAdditionalSectionHeaderHrefParam" select="document('')/*/xsl:variable[@name='progressAdditionalSectionHeaderHref']/*" />
	   
	   <xsl:variable name="progSectionHeader">
		   <headerName>Assesment</headerName>
		   <headerName>Plan of Care</headerName>
		   <headerName>Allergies</headerName>
		   <headerName>Chief Complaint</headerName>
		   <headerName>Instructions</headerName>
		   <headerName>Interventions</headerName>
		   <headerName>Medications</headerName>
		   <headerName>Objective</headerName>
		   <headerName>Physical Exam</headerName>
		   <headerName>Problem List</headerName>
		   <headerName>Results</headerName>
		   <headerName>Review of Systems</headerName>
		   <headerName>Subjectives</headerName>
		   <headerName>Vital Signs</headerName>
	   </xsl:variable>
	   
	   <xsl:param name="progSectionHeaderParam" select="document('')/*/xsl:variable[@name='progSectionHeader']/*" />
	   
	   <xsl:variable name="progSectionHeaderHref">
		   <titleId><xsl:value-of select="generate-id($progSectionHeaderParam/headerName[1])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progSectionHeaderParam/headerName[2])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progSectionHeaderParam/headerName[3])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progSectionHeaderParam/headerName[4])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progSectionHeaderParam/headerName[5])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progSectionHeaderParam/headerName[6])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progSectionHeaderParam/headerName[7])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progSectionHeaderParam/headerName[8])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progSectionHeaderParam/headerName[9])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progSectionHeaderParam/headerName[10])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progSectionHeaderParam/headerName[11])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progSectionHeaderParam/headerName[12])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progSectionHeaderParam/headerName[13])" /></titleId>
		   <titleId><xsl:value-of select="generate-id($progSectionHeaderParam/headerName[14])" /></titleId>
	   </xsl:variable>	   
	   
	   <xsl:param name="progSectionHeaderHrefParam" select="document('')/*/xsl:variable[@name='progSectionHeaderHref']/*" />	   
	   
	<xsl:variable name="ccdDocTemplateRoot" select="/n1:ClinicalDocument/n1:templateId[@root='2.16.840.1.113883.10.20.22.1.1']/@root"/>
	<xsl:variable name="progDocTemplateRoot" select="/n1:ClinicalDocument/n1:templateId[@root='2.16.840.1.113883.10.20.22.1.9']/@root"/>
	
	<xsl:variable name="ccdaDoc">
		<xsl:text>2.16.840.1.113883.10.20.22.1.1</xsl:text>
	</xsl:variable>
		<xsl:variable name="progressDoc">
		<xsl:text>2.16.840.1.113883.10.20.22.1.9</xsl:text>
	</xsl:variable>
	
   <!-- Main -->
   <xsl:template match="/">
	  <xsl:apply-templates select="n1:ClinicalDocument"/>
   </xsl:template>
   <!-- produce browser rendered, human readable clinical document -->
   <xsl:template match="n1:ClinicalDocument">
      <html>
		 <head>
			<meta charset="utf-8" />
			<meta http-equiv="X-UA-Compatible" content="IE=edge" />
			<title>Veterans Affairs</title>
			<meta name="description" content="" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
	
			<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,300,400,600,700" />
			<link rel="stylesheet" href="app/applets/ccd_grid/assets/vler_resource/ccdaStyles/cda_plain.css" />
	
		 </head>	
         <body>
			<div id="top" class="episode-note-container">
			
				<div id="titlebar-container" class="titlebar-container">
					<header id="titlebar" class="titlebar">
						<div class="columns">
							<div class="col-2">
								<h1>
								  <xsl:value-of select="n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:name" />
								</h1>
								<p>
								  <xsl:value-of select="n1:title" />
								 <!--
								   VA Continuity of Care Document
								   <xsl:choose>
								   	<xsl:when test="contains($docTemplateRoot, $ccdaDoc)">
									  (VA CCD)
									</xsl:when>
								   	<xsl:when test="contains($docTemplateRoot, $progressDoc)">
									  (VA Progress Notes)
									</xsl:when>
								   	<xsl:otherwise>
									</xsl:otherwise>
								   </xsl:choose>
								  -->
									<br/>created on 
									<strong>
										<xsl:call-template name="show-time">
											 <xsl:with-param name="datetime" select="n1:effectiveTime"/>
										</xsl:call-template>
									</strong>
								</p>
							</div>
							<div class="col-2" style="text-align: right;word-wrap: break-word;">
								   <br/><b>Prepared</b> for 
								    <strong style="font-size:15px; word-wrap: break-word;"><xsl:call-template name="show-name">
										<xsl:with-param name="name" select="n1:recordTarget/n1:patientRole/n1:patient/n1:name"/>
									</xsl:call-template>
								    </strong>	
								<p>
									DOB: 
									<span class="cell">
										<xsl:call-template name="show-time">
										   <xsl:with-param name="datetime" select="n1:recordTarget/n1:patientRole/n1:patient/n1:birthTime"/>
										</xsl:call-template>
									</span>

									<br/>
									Birth Sex: 
									<span class="cell">
									  <xsl:for-each select="/n1:ClinicalDocument/n1:recordTarget/n1:patientRole/n1:patient/n1:administrativeGenderCode">
										<xsl:call-template name="show-gender"/>
									  </xsl:for-each>
									</span>
								</p>
							</div>
							<nav class="toc infobar">
								<p><strong>Table of Contents</strong></p>

								<xsl:if test="not(//n1:nonXMLBody)">
								   <xsl:if test="count(/n1:ClinicalDocument/n1:component/n1:structuredBody/n1:component[n1:section]) &gt; 1">
									  <xsl:call-template name="make-tableofcontents"/>
								   </xsl:if>
								</xsl:if>						
						

							</nav>							
						</div>

						<button id="backtotop" class="backtotop">&#x2191; Back To Top</button>
					</header>
				</div>            <!-- START display top portion of clinical document -->
				<div class="sections">
					
				<section id="patient-information">
					<div class="columns">
						<div class="col-1">
							<table>
								<thead>
									<tr>
										<th colspan="2">Patient Information</th>
									</tr>
								</thead>
								<tbody>
									<!--
									<tr valign="top">
										<th width="30%">Name</th>
										<td width="70%">
											<xsl:call-template name="show-name">
												<xsl:with-param name="name" select="n1:recordTarget/n1:patientRole/n1:patient/n1:name"/>
											</xsl:call-template>
										</td>
									</tr>
									<tr valign="top">
										<th>Medical Record Number</th>
										<td>
											<xsl:value-of select="n1:recordTarget/n1:patientRole/n1:id/@extension" />
										 </td>
									</tr>
									<tr valign="top">
										<th>Birthdate</th>
										<td>
											<xsl:call-template name="show-time">
											   <xsl:with-param name="datetime" select="n1:recordTarget/n1:patientRole/n1:patient/n1:birthTime"/>
											</xsl:call-template>
										</td>
									</tr>
									-->
									<tr valign="top">
										<th>Address</th>
										<td>
											<xsl:for-each select="/n1:ClinicalDocument/n1:recordTarget/n1:patientRole">
											   <xsl:if test="not(n1:id/@nullFlavor)">
													<xsl:call-template name="show-contactInfo">
													   <xsl:with-param name="contact" select="."/>
													</xsl:call-template>
											  </xsl:if>
											</xsl:for-each>
										</td>
									</tr>
									<!--<tr valign="top">
										<th>Patient Id</th>
										<td>
											<xsl:for-each select="n1:recordTarget/n1:patientRole/n1:id">
											   <xsl:call-template name="show-id"/>
											   <br/>
											</xsl:for-each>
										</td>
									</tr>	-->	
									<!--
									<tr valign="top">
										<th>Gender</th>
										<td>
											<xsl:for-each select="/n1:ClinicalDocument/n1:recordTarget/n1:patientRole/n1:patient/n1:administrativeGenderCode">
											   <xsl:call-template name="show-gender"/>
											</xsl:for-each>
										</td>
									</tr>
									-->
									<tr valign="top">
										<th>Marital status</th>
										<td>
											<xsl:choose>
												<xsl:when test="n1:recordTarget/n1:patientRole/n1:patient/n1:maritalStatusCode">
													<xsl:value-of select="n1:recordTarget/n1:patientRole/n1:patient/n1:maritalStatusCode" />
												</xsl:when>
												<xsl:otherwise>
													<xsl:text>Information not available</xsl:text>
												</xsl:otherwise>
											</xsl:choose>
										</td>
									</tr>									
									 <tr valign="top">
										<th>Race</th>
										<td>
											 <xsl:for-each select="n1:recordTarget/n1:patientRole/n1:patient/n1:raceCode">
												<xsl:call-template name="show-race-ethnicity"/>
											 </xsl:for-each>
										</td>
									 </tr>

								  <tr valign="top">
									<th>Ethnicity</th>
									<td>
										 <xsl:for-each select="n1:recordTarget/n1:patientRole/n1:patient/n1:ethnicGroupCode">
											<xsl:call-template name="show-race-ethnicity"/>
										 </xsl:for-each>
									</td>
								 </tr>		
					
									<tr valign="top">
										<th>Language(s)</th>
										<td>
											<xsl:for-each select="n1:recordTarget/n1:patientRole/n1:patient/n1:languageCommunication">
												<xsl:call-template name="show-language">
													<xsl:with-param name="langCode" select="n1:languageCode" />
												</xsl:call-template>
												<xsl:if test="position()!=last()">
													 <xsl:text>, </xsl:text>
												</xsl:if>													
											</xsl:for-each>	
										</td>
									</tr>
									<tr valign="top">
										<th>Preferred Language</th>
										<td>
											<xsl:for-each select="n1:recordTarget/n1:patientRole/n1:patient/n1:languageCommunication">
												<xsl:call-template name="pref-language">
													<xsl:with-param name="langCode" select="n1:languageCode" />
													<xsl:with-param name="prefLang" select="n1:preferenceInd" />
												</xsl:call-template>
											</xsl:for-each>	
										</td>
									</tr>	
					<!--				
					<xsl:for-each select="n1:author/n1:assignedAuthor">
					  <tr valign="top">
						 <th>
							Author
						 </th>
						 <td>
							<xsl:choose>
							   <xsl:when test="n1:assignedPerson/n1:name">
								  <xsl:call-template name="show-name">
									 <xsl:with-param name="name" select="n1:assignedPerson/n1:name"/>
								  </xsl:call-template>

							   </xsl:when>
							   <xsl:when test="n1:assignedAuthoringDevice/n1:softwareName">
								  <xsl:value-of select="n1:assignedAuthoringDevice/n1:softwareName"/>
							   </xsl:when>
							   <xsl:when test="n1:representedOrganization">
								  <xsl:call-template name="show-name">
									 <xsl:with-param name="name" select="n1:representedOrganization/n1:name"/>
								  </xsl:call-template>
							   </xsl:when>
							   <xsl:otherwise>
								  <xsl:for-each select="n1:id">
									 <xsl:call-template name="show-id"/>
									 <br/>
								  </xsl:for-each>
							   </xsl:otherwise>
							</xsl:choose>
						 </td>
					  </tr>
					  <xsl:if test="n1:addr | n1:telecom">
						 <tr valign="top">
							<th>
							   Contact info
							</th>
							<td>
							   <xsl:call-template name="show-contactInfo">
								  <xsl:with-param name="contact" select="."/>
							   </xsl:call-template>
							</td>
						 </tr>
					  </xsl:if>
				   </xsl:for-each>
				   -->
								</tbody>
							</table>
						</div>

					</div>
				</section>
				
				<xsl:apply-templates select="n1:component/n1:structuredBody|n1:component/n1:nonXMLBody"/>
				
				<section id="healthcare-providers">
					<header>
						<h2>Healthcare Providers</h2>
						<!--<p><strong>Business Rules for Construction of Medical Information:</strong> Business Rules description of the section goes here.</p>-->
					</header>
					
					<xsl:choose>
						<xsl:when test="n1:documentationOf/n1:serviceEvent/n1:performer">
							<xsl:call-template name="documentationOf"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:text>No data provided for this section.</xsl:text>
						</xsl:otherwise>
					</xsl:choose>
				</section>
				
				<section id="contact-info">
					<header>
						<h2>Contact Information</h2>
					</header>				
					<div class="col-2">
						<xsl:if test="n1:participant">
							<table>
								<thead>
									<tr>
										<th colspan="2">Contact Information</th>
									</tr>
								</thead>
								<tbody>						
									<xsl:for-each select="n1:participant">
										<xsl:call-template name="participant"/>
									</xsl:for-each>	
								</tbody>
							</table>		
						</xsl:if>
					</div>
				</section>						
				</div>			
			</div>
            <!--<xsl:call-template name="recordTarget"/>
            <p/>
            <xsl:call-template name="documentGeneral"/>
            <p/>
            <xsl:call-template name="documentationOf"/>
            <p/>
            <xsl:call-template name="author"/>
            <p/>
            <xsl:call-template name="componentof"/>
            <p/>
            <xsl:call-template name="participant"/>
            <p/>
            <xsl:call-template name="dataEnterer"/>
            <p/>
            <xsl:call-template name="authenticator"/>
            <p/>
            <xsl:call-template name="informant"/>
            <p/>
            <xsl:call-template name="informationRecipient"/>
            <p/>
            <xsl:call-template name="legalAuthenticator"/>
            <p/>
            <xsl:call-template name="custodian"/>
            <p/>-->
            <!-- END display top portion of clinical document -->
            <!-- produce table of contents  
            <xsl:if test="not(//n1:nonXMLBody)">
               <xsl:if test="count(/n1:ClinicalDocument/n1:component/n1:structuredBody/n1:component[n1:section]) &gt; 1">
                  <xsl:call-template name="make-tableofcontents"/>
               </xsl:if>
            </xsl:if>

            <p/>
            <hr align="left" color="teal" size="2" width="80%"/>
            <p/>-->
            <!-- produce human readable document content -->
         </body>
      </html>
   </xsl:template>
   <!-- generate table of contents-->
	<xsl:template name="make-tableofcontents">
		<xsl:variable name="compTemplateIdRoots" select="n1:component/n1:structuredBody/n1:component/n1:section/n1:templateId/@root"/>
		<xsl:variable name="sections" select="n1:component/n1:structuredBody/n1:component/n1:section"/>

		<!--<h2>
			<a name="toc">Table of Contents</a>
		</h2>
		<div style="margin-left : 2em;">-->
		<!-- CCD ToC -->
		<!-- Progress notes ToC -->
		<xsl:choose>
		<xsl:when test="contains($progDocTemplateRoot, $progressDoc)">
			<!--<li>
				<a href="#{generate-id(Demographics)}">
					<xsl:text>Demographics</xsl:text>
				</a>
			</li>-->
			<ul>
				<li>
					<a data-target="patient-information" href="#patient-information">
						<xsl:value-of select="'Patient Information'"/>
					</a>
					<xsl:for-each select="$progressTemplateIdArrayParam">
						<xsl:variable name="templateId">
							<xsl:value-of select="."/>
						</xsl:variable>
		
						<!--<xsl:if test="$compTemplateIdRoots  = $templateId or $compTemplateIdRoots  = concat($templateId,'.1')">-->
							<xsl:variable name="pos-int" select="position()"/>
							<!--<xsl:value-of select="$pos-int" />-->
							<xsl:variable name="headerValue">
								<xsl:value-of select="$progSectionHeaderParam[$pos-int]"/>
							</xsl:variable>
							<xsl:variable name="headerTxt">
								<xsl:value-of select="$sections[n1:templateId[@root = $templateId or @root = concat($templateId,'.1')]]/n1:text"/>
							</xsl:variable>

							<xsl:choose>
								<xsl:when test="contains($headerTxt, 'No Information')">
										<a data-target="{$headerValue}" href="#{$headerValue}" class="disabled">
											<xsl:value-of select="$headerValue"/>
										</a>
								</xsl:when>
								<xsl:when test="string-length($headerTxt) &gt; 0">
										<a data-target="{$headerValue}" href="#{$headerValue}">
											<xsl:value-of select="$headerValue"/>
										</a>
								</xsl:when>
								<xsl:otherwise>
									<a data-target="{$headerValue}" href="#{$headerValue}" class="disabled">
											<xsl:value-of select="$headerValue"/>
										</a>
								</xsl:otherwise>

							</xsl:choose>
						<!--</xsl:if>-->
					</xsl:for-each>
					<xsl:choose>
						<xsl:when test="n1:documentationOf/n1:serviceEvent/n1:performer">
								<a data-target="healthcare-providers" href="#healthcare-providers">
									<xsl:value-of select="'Healthcare Providers'"/>
								</a>
						</xsl:when>
						<xsl:otherwise>
								<a data-target="healthcare-providers" href="#healthcare-providers" class="disabled">
									<xsl:value-of select="'Healthcare Providers'"/>
								</a>
						</xsl:otherwise>
					</xsl:choose>	
					<a data-target="contact-info" href="#contact-info">
						<xsl:value-of select="'Contact Information'"/>
					</a>												
				</li>
			</ul>
		</xsl:when>			
		<xsl:when test="contains($ccdDocTemplateRoot, $ccdaDoc)">
		<!--	<li>
				<a href="#{generate-id(Demographics)}">
					<xsl:text>Demographics</xsl:text>
				</a>
			</li>
		-->
			<ul>
				<li>
					<a data-target="patient-information" href="#patient-information">
						<xsl:value-of select="'Patient Information'"/>
					</a>
		
					<xsl:for-each select="$ccdTemplateIdArrayParam">
						<xsl:variable name="templateId">
							<xsl:value-of select="."/>
						</xsl:variable>
		
						<!--<xsl:if test="$compTemplateIdRoots  = $templateId or $compTemplateIdRoots  = concat($templateId,'.1')">-->
							<xsl:variable name="pos-int" select="position()"/>
							<!--<xsl:value-of select="$pos-int" />-->
							<xsl:variable name="headerValue">
								<xsl:value-of select="$ccdSectionHeaderParam[$pos-int]"/>
							</xsl:variable>
							<xsl:variable name="headerTxt">
								<xsl:value-of select="$sections[n1:templateId[@root = $templateId or @root = concat($templateId,'.1')]]/n1:text"/>
							</xsl:variable>

							<xsl:choose>
								<xsl:when test="contains($headerTxt, 'No Information')">
										<a data-target="{$headerValue}" href="#{$headerValue}" class="disabled">
											<xsl:value-of select="$headerValue"/>
										</a>
								</xsl:when>
								<xsl:when test="string-length($headerTxt) &gt; 0">
										<a data-target="{$headerValue}" href="#{$headerValue}">
											<xsl:value-of select="$headerValue"/>
										</a>
								</xsl:when>
								<xsl:otherwise>
									<a data-target="{$headerValue}" href="#{$headerValue}" class="disabled">
											<xsl:value-of select="$headerValue"/>
										</a>
								</xsl:otherwise>

							</xsl:choose>
						<!--</xsl:if>-->
					</xsl:for-each>
					<xsl:choose>
						<xsl:when test="n1:documentationOf/n1:serviceEvent/n1:performer">
								<a data-target="healthcare-providers" href="#healthcare-providers">
									<xsl:value-of select="'Healthcare Providers'"/>
								</a>
						</xsl:when>
						<xsl:otherwise>
								<a data-target="healthcare-providers" href="#healthcare-providers" class="disabled">
									<xsl:value-of select="'Healthcare Providers'"/>
								</a>
						</xsl:otherwise>
					</xsl:choose>	
					<a data-target="contact-info" href="#contact-info">
						<xsl:value-of select="'Contact Information'"/>
					</a>														
				</li>
			</ul>
		</xsl:when>
		</xsl:choose>
	</xsl:template>
   <!-- header elements -->
   <xsl:template name="documentGeneral">
		 <fieldset>
			<legend><b>Document Information</b></legend>
			<table>
				<tbody>
					<tr>
					   <td>
						  <label><b>Document Id: </b></label>
					   </td>
					   <td>
						  <xsl:call-template name="show-id">
							 <xsl:with-param name="id" select="n1:id"/>
						  </xsl:call-template>
					   </td>
					</tr>
					<tr>
					   <td>
						  <label><b>Document Created: </b></label>
					   </td>
					   <td>
						  <xsl:call-template name="show-time">
							 <xsl:with-param name="datetime" select="n1:effectiveTime"/>
						  </xsl:call-template>
					   </td>
					</tr>
				</tbody>
			</table>
		</fieldset>
   </xsl:template>
   <!-- confidentiality -->
   <xsl:template name="confidentiality">
      <table class="header_table">
         <tbody>
            <td width="20%" bgcolor="#3399ff">
               <xsl:text>Confidentiality</xsl:text>
            </td>
            <td width="80%">
               <xsl:choose>
                  <xsl:when test="n1:confidentialityCode/@code  = &apos;N&apos;">
                     <xsl:text>Normal</xsl:text>
                  </xsl:when>
                  <xsl:when test="n1:confidentialityCode/@code  = &apos;R&apos;">
                     <xsl:text>Restricted</xsl:text>
                  </xsl:when>
                  <xsl:when test="n1:confidentialityCode/@code  = &apos;V&apos;">
                     <xsl:text>Very restricted</xsl:text>
                  </xsl:when>
               </xsl:choose>
               <xsl:if test="n1:confidentialityCode/n1:originalText">
                  <xsl:text> </xsl:text>
                  <xsl:value-of select="n1:confidentialityCode/n1:originalText"/>
               </xsl:if>
            </td>
         </tbody>
      </table>
   </xsl:template>
   <!-- author -->
   <xsl:template name="author">
      <xsl:if test="n1:author">
		<div class="columns">
			<div class="col-2">
				<table>
					<thead>
						<tr>
							<th colspan="2">Author Information</th>
						</tr>
					</thead>
					<tbody>
					   <xsl:for-each select="n1:author/n1:assignedAuthor">
					  <tr valign="top">
						 <th>
							Author
						 </th>
						 <td>
							<xsl:choose>
							   <xsl:when test="n1:assignedPerson/n1:name">
								  <xsl:call-template name="show-name">
									 <xsl:with-param name="name" select="n1:assignedPerson/n1:name"/>
								  </xsl:call-template>
								  <!--<xsl:if test="n1:representedOrganization">
									 <xsl:text>, </xsl:text>
									 <xsl:call-template name="show-name">
										<xsl:with-param name="name" select="n1:representedOrganization/n1:name"/>
									 </xsl:call-template>
								  </xsl:if>-->
							   </xsl:when>
							   <xsl:when test="n1:assignedAuthoringDevice/n1:softwareName">
								  <xsl:value-of select="n1:assignedAuthoringDevice/n1:softwareName"/>
							   </xsl:when>
							   <xsl:when test="n1:representedOrganization">
								  <xsl:call-template name="show-name">
									 <xsl:with-param name="name" select="n1:representedOrganization/n1:name"/>
								  </xsl:call-template>
							   </xsl:when>
							   <xsl:otherwise>
								  <xsl:for-each select="n1:id">
									 <xsl:call-template name="show-id"/>
									 <br/>
								  </xsl:for-each>
							   </xsl:otherwise>
							</xsl:choose>
						 </td>
					  </tr>
					  <xsl:if test="n1:addr | n1:telecom">
						 <tr valign="top">
							<th>
							   Contact info
							</th>
							<td>
							   <xsl:call-template name="show-contactInfo">
								  <xsl:with-param name="contact" select="."/>
							   </xsl:call-template>
							</td>
						 </tr>
					  </xsl:if>
				   </xsl:for-each>
                </tbody>
             </table>
          </div>
          </div>      
       </xsl:if>
   </xsl:template>
   <!--  authenticator -->
 <xsl:template name="authenticator">
      <xsl:if test="n1:authenticator">
 		 <fieldset>
			<legend><b>Authenticator Information</b></legend>
			<table>
				<tbody>
                  <xsl:for-each select="n1:authenticator">
                     <tr>
                        <td>
                           <label><b>Signed: </b></label>
                        </td>
                        <td>
                           <xsl:call-template name="show-name">
                              <xsl:with-param name="name" select="n1:assignedEntity/n1:assignedPerson/n1:name"/>
                           </xsl:call-template>
                           <xsl:text> at </xsl:text>
                           <xsl:call-template name="show-time">
                              <xsl:with-param name="date" select="n1:time"/>
                           </xsl:call-template>
                        </td>
                     </tr>
                     <xsl:if test="n1:assignedEntity/n1:addr | n1:assignedEntity/n1:telecom">
                        <tr>
                           <td>
                              <label><b>Contact info: </b></label>
                           </td>
                           <td>
                              <xsl:call-template name="show-contactInfo">
                                 <xsl:with-param name="contact" select="n1:assignedEntity"/>
                              </xsl:call-template>
                           </td>
                        </tr>
                     </xsl:if>
                  </xsl:for-each>
				</tbody>
			</table>
		 </fieldset>	
      </xsl:if>
   </xsl:template>
  
   <!-- legalAuthenticator -->
   <xsl:template name="legalAuthenticator">
      <xsl:if test="n1:legalAuthenticator">
  		 <fieldset>
			<legend><b>Legal Authenticator Information</b></legend>
			<table>
				<tbody>
               <tr>
                  <td>
                     <label><b>Legal authenticator: </b></label>
                  </td>
                  <td>
                     <xsl:call-template name="show-assignedEntity">
                        <xsl:with-param name="asgnEntity" select="n1:legalAuthenticator/n1:assignedEntity"/>
                     </xsl:call-template>
                     <xsl:text> </xsl:text>
                     <xsl:call-template name="show-sig">
                        <xsl:with-param name="sig" select="n1:legalAuthenticator/n1:signatureCode"/>
                     </xsl:call-template>
                     <xsl:if test="n1:legalAuthenticator/n1:time/@value">
                        <xsl:text> at </xsl:text>
                        <xsl:call-template name="show-time">
                           <xsl:with-param name="datetime" select="n1:legalAuthenticator/n1:time"/>
                        </xsl:call-template>
                     </xsl:if>
                  </td>
               </tr>
               <xsl:if test="n1:legalAuthenticator/n1:assignedEntity/n1:addr | n1:legalAuthenticator/n1:assignedEntity/n1:telecom">
                  <tr>
                     <td>
                        <label><b>Contact info: </b></label>
                     </td>
                     <td>
                        <xsl:call-template name="show-contactInfo">
                           <xsl:with-param name="contact" select="n1:legalAuthenticator/n1:assignedEntity"/>
                        </xsl:call-template>
                     </td>
                  </tr>
               </xsl:if>
            </tbody>
			</table>
		 </fieldset>	
      </xsl:if>
   </xsl:template>

   <!-- dataEnterer -->
   <xsl:template name="dataEnterer">
      <xsl:if test="n1:dataEnterer">
  		 <fieldset>
			<legend><b>Data Enterer Information</b></legend>
			<table>
				<tbody>
				   <tr>
					  <td>
						 <label><b>Entered by: </b></label>
					  </td>
					  <td width="80%">
						 <xsl:call-template name="show-assignedEntity">
							<xsl:with-param name="asgnEntity" select="n1:dataEnterer/n1:assignedEntity"/>
						 </xsl:call-template>
					  </td>
				   </tr>
				   <xsl:if test="n1:dataEnterer/n1:assignedEntity/n1:addr | n1:dataEnterer/n1:assignedEntity/n1:telecom">
					  <tr>
						 <td>
							<label><b>Contact info: </b></label>
						 </td>
						 <td>
							<xsl:call-template name="show-contactInfo">
							   <xsl:with-param name="contact" select="n1:dataEnterer/n1:assignedEntity"/>
							</xsl:call-template>
						 </td>
					  </tr>
				   </xsl:if>
				</tbody>
			 </table>
		 </fieldset>
      </xsl:if>
   </xsl:template>

   <!-- componentOf -->
   <xsl:template name="componentof">
      <xsl:if test="n1:componentOf">
  		 <fieldset>
			<legend><b>Component Information</b></legend>
			<table>
				<tbody>
				   <xsl:for-each select="n1:componentOf/n1:encompassingEncounter">
                  <xsl:if test="n1:id">
                     <tr>
                        <xsl:choose>
                           <xsl:when test="n1:code">
                              <td>
                                 <label><b>Encounter Id: </b></label>
                              </td>
                              <td>
                                 <xsl:call-template name="show-id">
                                    <xsl:with-param name="id" select="n1:id"/>
                                 </xsl:call-template>
                              </td>
                              <td>
                                 <label><b>Encounter Type: </b></label>
                              </td>
                              <td>
                                 <xsl:call-template name="show-code">
                                    <xsl:with-param name="code" select="n1:code"/>
                                 </xsl:call-template>
                              </td>
                           </xsl:when>
                           <xsl:otherwise>
                              <td>
                                 <label><b>Encounter Id: </b></label>
                              </td>
                              <td>
                                 <xsl:call-template name="show-id">
                                    <xsl:with-param name="id" select="n1:id"/>
                                 </xsl:call-template>
                              </td>
                           </xsl:otherwise>
                        </xsl:choose>
                     </tr>
                  </xsl:if>
                  <tr>
                     <td>
                        <label><b>Encounter Date: </b></label>
                     </td>
                     <td>
                        <xsl:if test="n1:effectiveTime">
                           <xsl:choose>
                              <xsl:when test="n1:effectiveTime/@value">
                                 <xsl:text>&#160;at&#160;</xsl:text>
                                 <xsl:call-template name="show-time">
                                    <xsl:with-param name="datetime" select="n1:effectiveTime"/>
                                 </xsl:call-template>
                              </xsl:when>
                              <xsl:when test="n1:effectiveTime/n1:low">
                                 <xsl:text>&#160;From&#160;</xsl:text>
                                 <xsl:call-template name="show-time">
                                    <xsl:with-param name="datetime" select="n1:effectiveTime/n1:low"/>
                                 </xsl:call-template>
                                 <xsl:if test="n1:effectiveTime/n1:high">
                                    <xsl:text> to </xsl:text>
                                    <xsl:call-template name="show-time">
                                       <xsl:with-param name="datetime" select="n1:effectiveTime/n1:high"/>
                                    </xsl:call-template>
                                 </xsl:if>
                              </xsl:when>
                           </xsl:choose>
                        </xsl:if>
                     </td>
                  </tr>
                  <xsl:if test="n1:location/n1:healthCareFacility">
                     <tr>
                        <td>
                           <label><b>Encounter Location: </b></label>
                        </td>
                        <td>
                           <xsl:choose>
                              <xsl:when test="n1:location/n1:healthCareFacility/n1:location/n1:name">
                                 <xsl:call-template name="show-name">
                                    <xsl:with-param name="name" select="n1:location/n1:healthCareFacility/n1:location/n1:name"/>
                                 </xsl:call-template>
                                 <xsl:for-each select="n1:location/n1:healthCareFacility/n1:serviceProviderOrganization/n1:name">
                                    <xsl:text> of </xsl:text>
                                    <xsl:call-template name="show-name">
                                       <xsl:with-param name="name" select="n1:location/n1:healthCareFacility/n1:serviceProviderOrganization/n1:name"/>
                                    </xsl:call-template>
                                 </xsl:for-each>
                              </xsl:when>
                              <xsl:when test="n1:location/n1:healthCareFacility/n1:code">
                                 <xsl:call-template name="show-code">
                                    <xsl:with-param name="code" select="n1:location/n1:healthCareFacility/n1:code"/>
                                 </xsl:call-template>
                              </xsl:when>
                              <xsl:otherwise>
                                 <xsl:if test="n1:location/n1:healthCareFacility/n1:id">
                                    <xsl:text>id: </xsl:text>
                                    <xsl:for-each select="n1:location/n1:healthCareFacility/n1:id">
                                       <xsl:call-template name="show-id">
                                          <xsl:with-param name="id" select="."/>
                                       </xsl:call-template>
                                    </xsl:for-each>
                                 </xsl:if>
                              </xsl:otherwise>
                           </xsl:choose>
                        </td>
                     </tr>
                  </xsl:if>
                  <xsl:if test="n1:responsibleParty">
                     <tr>
                        <td>
                           <label><b>Responsible party: </b></label>
                        </td>
                        <td>
                           <xsl:call-template name="show-assignedEntity">
                              <xsl:with-param name="asgnEntity" select="n1:responsibleParty/n1:assignedEntity"/>
                           </xsl:call-template>
                        </td>
                     </tr>
                  </xsl:if>
                  <xsl:if test="n1:responsibleParty/n1:assignedEntity/n1:addr | n1:responsibleParty/n1:assignedEntity/n1:telecom">
                     <tr>
                        <td>
                           <label><b>Contact info: </b></label>
                        </td>
                        <td>
                           <xsl:call-template name="show-contactInfo">
                              <xsl:with-param name="contact" select="n1:responsibleParty/n1:assignedEntity"/>
                           </xsl:call-template>
                        </td>
                     </tr>
                  </xsl:if>
               </xsl:for-each>
				</tbody>
			</table>
		</fieldset>
      </xsl:if>
   </xsl:template>
   <!-- custodian -->
   <xsl:template name="custodian">
      <xsl:if test="n1:custodian">
  		 <fieldset>
			<legend><b>Legal Authenticator Information</b></legend>
			<table>
				<tbody>
               <tr>
                  <td>
                     <label><b>Document maintained by: </b></label>
                  </td>
                  <td>
                     <xsl:choose>
                        <xsl:when test="n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:name">
                           <xsl:call-template name="show-name">
                              <xsl:with-param name="name" select="n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:name"/>
                           </xsl:call-template>
                        </xsl:when>
                        <xsl:otherwise>
                           <xsl:for-each select="n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:id">
                              <xsl:call-template name="show-id"/>
                              <xsl:if test="position()!=last()">
                                 <br/>
                              </xsl:if>
                           </xsl:for-each>
                        </xsl:otherwise>
                     </xsl:choose>
                  </td>
               </tr>
               <xsl:if test="n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:addr |             n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:telecom">
                  <tr>
                     <td>
                        <label><b>Contact info: </b></label>
                     </td>
                     <td>
                        <xsl:call-template name="show-contactInfo">
                           <xsl:with-param name="contact" select="n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization"/>
                        </xsl:call-template>
                     </td>
                  </tr>
               </xsl:if>
            </tbody>
			</table>
		 </fieldset>	
      </xsl:if>
   </xsl:template>

   <!-- documentationOf -->
   <xsl:template name="documentationOf">
      <xsl:if test="n1:documentationOf">
 			<table>
			  <thead>
				<tr>
				 <th>Name</th>
				 <th>Provider Type</th>
				 <th>Address</th>
				 <th>Telephone Number</th>
				</tr>
			  </thead> 			
				<tbody>
				   <xsl:for-each select="n1:documentationOf">
                  <xsl:if test="n1:serviceEvent/@classCode and n1:serviceEvent/n1:code">
                     <xsl:variable name="displayName">
                        <xsl:call-template name="show-actClassCode">
                           <xsl:with-param name="clsCode" select="n1:serviceEvent/@classCode"/>
                        </xsl:call-template>
                     </xsl:variable>
                     <xsl:if test="$displayName">
                        <tr valign="top">
                           <td>
                              <xsl:call-template name="show-code">
                                 <xsl:with-param name="code" select="n1:serviceEvent/n1:code"/>
                              </xsl:call-template>
                              <xsl:if test="n1:serviceEvent/n1:effectiveTime">
                                 <xsl:choose>
                                    <xsl:when test="n1:serviceEvent/n1:effectiveTime/@value">
                                       <xsl:text>&#160;at&#160;</xsl:text>
                                       <xsl:call-template name="show-time">
                                          <xsl:with-param name="datetime" select="n1:serviceEvent/n1:effectiveTime"/>
                                       </xsl:call-template>
                                    </xsl:when>
                                    <xsl:when test="n1:serviceEvent/n1:effectiveTime/n1:low">
                                       <xsl:text>&#160;from&#160;</xsl:text>
                                       <xsl:call-template name="show-time">
                                          <xsl:with-param name="datetime" select="n1:serviceEvent/n1:effectiveTime/n1:low"/>
                                       </xsl:call-template>
                                       <xsl:if test="n1:serviceEvent/n1:effectiveTime/n1:high">
                                          <xsl:text> to </xsl:text>
                                          <xsl:call-template name="show-time">
                                             <xsl:with-param name="datetime" select="n1:serviceEvent/n1:effectiveTime/n1:high"/>
                                          </xsl:call-template>
                                       </xsl:if>
                                    </xsl:when>
                                 </xsl:choose>
                              </xsl:if>
                           </td>
                        </tr>
                     </xsl:if>
                  </xsl:if>
                  <xsl:for-each select="n1:serviceEvent/n1:performer">
                     <xsl:variable name="displayName">
                     <!-- DEFECT#177018: Display originalText instead of displayName -->
						<xsl:if test="n1:functionCode/n1:originalText">
							<xsl:value-of select="n1:functionCode/n1:originalText" />
						</xsl:if>
						<!--                      
                        <xsl:call-template name="show-participationType">
                           <xsl:with-param name="ptype" select="@typeCode"/>
                        </xsl:call-template>
                        <xsl:text> </xsl:text>
                        <xsl:if test="n1:functionCode/@code">
                           <xsl:call-template name="show-participationFunction">
                              <xsl:with-param name="pFunction" select="n1:functionCode/@code"/>
                           </xsl:call-template>
                        </xsl:if>
                        -->
                     </xsl:variable>
                     <tr valign="top">
                        <th>
                           <xsl:call-template name="show-assignedEntity">
                              <xsl:with-param name="asgnEntity" select="n1:assignedEntity"/>
                           </xsl:call-template>
                        </th>
				  <th>
					<xsl:value-of select="$displayName"/>
				  </th>
				  <th>
					<xsl:if test="not(n1:assignedEntity/n1:addr/@nullFlavor)">
					<xsl:call-template name="show-address">
         					<xsl:with-param name="address" select="n1:assignedEntity/n1:addr"/>
      				</xsl:call-template>
				</xsl:if>
				  </th>	
				  <th>
					<xsl:if test="not(n1:assignedEntity/n1:telecom/@nullFlavor)">
      				<xsl:call-template name="show-telecom">
         					<xsl:with-param name="telecom" select="n1:assignedEntity/n1:telecom"/>
     					</xsl:call-template>
				</xsl:if>
				  </th>	
                     </tr>
                  </xsl:for-each>
               </xsl:for-each>
				</tbody>
			</table>
      </xsl:if>
   </xsl:template>

   <!-- inFulfillmentOf -->
   <xsl:template name="inFulfillmentOf">
      <xsl:if test="n1:infulfillmentOf">
         <table class="header_table">
            <tbody>
               <xsl:for-each select="n1:inFulfillmentOf">
                  <tr>
                     <td width="20%" bgcolor="#3399ff">
                        <span class="td_label">
                           <xsl:text>In fulfillment of</xsl:text>
                        </span>
                     </td>
                     <td width="80%">
                        <xsl:for-each select="n1:order">
                           <xsl:for-each select="n1:id">
                              <xsl:call-template name="show-id"/>
                           </xsl:for-each>
                           <xsl:for-each select="n1:code">
                              <xsl:text>&#160;</xsl:text>
                              <xsl:call-template name="show-code">
                                 <xsl:with-param name="code" select="."/>
                              </xsl:call-template>
                           </xsl:for-each>
                           <xsl:for-each select="n1:priorityCode">
                              <xsl:text>&#160;</xsl:text>
                              <xsl:call-template name="show-code">
                                 <xsl:with-param name="code" select="."/>
                              </xsl:call-template>
                           </xsl:for-each>
                        </xsl:for-each>
                     </td>
                  </tr>
               </xsl:for-each>
            </tbody>
         </table>
      </xsl:if>
   </xsl:template>
   <!-- informant -->
   <xsl:template name="informant">
      <xsl:if test="n1:informant">
 		 <fieldset>
			<legend><b>Informant Information</b></legend>
			<table>
				<tbody>
				   <xsl:for-each select="n1:informant">
					  <tr>
						 <td>
							<label><b>Informant: </b></label>
						 </td>
						 <td>
							<xsl:if test="n1:assignedEntity">
							   <xsl:call-template name="show-assignedEntity">
								  <xsl:with-param name="asgnEntity" select="n1:assignedEntity"/>
							   </xsl:call-template>
							</xsl:if>
							<xsl:if test="n1:relatedEntity">
							   <xsl:call-template name="show-relatedEntity">
								  <xsl:with-param name="relatedEntity" select="n1:relatedEntity"/>
							   </xsl:call-template>
							</xsl:if>
						 </td>
					  </tr>
					  <xsl:choose>
						 <xsl:when test="n1:assignedEntity/n1:addr | n1:assignedEntity/n1:telecom">
							<tr>
							   <td>
								  <label><b>Contact info: </b></label>
							   </td>
							   <td>
								  <xsl:if test="n1:assignedEntity">
									 <xsl:call-template name="show-contactInfo">
										<xsl:with-param name="contact" select="n1:assignedEntity"/>
									 </xsl:call-template>
								  </xsl:if>
							   </td>
							</tr>
						 </xsl:when>
						 <xsl:when test="n1:relatedEntity/n1:addr | n1:relatedEntity/n1:telecom">
							<tr>
							   <td>
								  <label><b>Contact info: </b></label>
							   </td>
							   <td>
								  <xsl:if test="n1:relatedEntity">
									 <xsl:call-template name="show-contactInfo">
										<xsl:with-param name="contact" select="n1:relatedEntity"/>
									 </xsl:call-template>
								  </xsl:if>
							   </td>
							</tr>
						 </xsl:when>
					  </xsl:choose>
				   </xsl:for-each>
				</tbody>
			</table>
		 </fieldset>	
      </xsl:if>
   </xsl:template>

   <!-- informantionRecipient -->
   <xsl:template name="informationRecipient">
      <xsl:if test="n1:informationRecipient">
  		 <fieldset>
			<legend><b>Recipient Information</b></legend>
			<table>
				<tbody>
				   <xsl:for-each select="n1:informationRecipient">
                  <tr>
                     <td>
                        <label><b>Information recipient: </b></label>
                     </td>
                     <td>
                        <xsl:choose>
                           <xsl:when test="n1:intendedRecipient/n1:informationRecipient/n1:name">
                              <xsl:for-each select="n1:intendedRecipient/n1:informationRecipient">
                                 <xsl:call-template name="show-name">
                                    <xsl:with-param name="name" select="n1:name"/>
                                 </xsl:call-template>
                                 <xsl:if test="position() != last()">
                                    <br/>
                                 </xsl:if>
                              </xsl:for-each>
                           </xsl:when>
                           <xsl:otherwise>
                              <xsl:for-each select="n1:intendedRecipient">
                                 <xsl:for-each select="n1:id">
                                    <xsl:call-template name="show-id"/>
                                 </xsl:for-each>
                                 <xsl:if test="position() != last()">
                                    <br/>
                                 </xsl:if>
                                 <br/>
                              </xsl:for-each>
                           </xsl:otherwise>
                        </xsl:choose>
                     </td>
                  </tr>
                  <xsl:if test="n1:intendedRecipient/n1:addr | n1:intendedRecipient/n1:telecom">
                     <tr>
                        <td>
                           <label><b>Contact info: </b></label>
                        </td>
                        <td>
                           <xsl:call-template name="show-contactInfo">
                              <xsl:with-param name="contact" select="n1:intendedRecipient"/>
                           </xsl:call-template>
                        </td>
                     </tr>
                  </xsl:if>
               </xsl:for-each>
				</tbody>
			</table>
		 </fieldset>
      </xsl:if>
   </xsl:template>

   <!-- participant -->
 <xsl:template name="participant">
                  <tr valign="top">
                     <th>
                        <xsl:variable name="participtRole">
                           <xsl:call-template name="translateRoleAssoCode">
                              <xsl:with-param name="classCode" select="n1:associatedEntity/@classCode"/>
                              <xsl:with-param name="code" select="n1:associatedEntity/n1:code"/>
                           </xsl:call-template>
                        </xsl:variable>
                        <xsl:choose>
                           <xsl:when test="$participtRole">
                                 <xsl:call-template name="firstCharCaseUp">
                                    <xsl:with-param name="data" select="$participtRole"/>
                                 </xsl:call-template>
                           </xsl:when>
                           <xsl:otherwise>
								Participant
                           </xsl:otherwise>
                        </xsl:choose>
                     </th>
                     <td>
                        <xsl:if test="n1:functionCode">
                           <xsl:call-template name="show-code">
                              <xsl:with-param name="code" select="n1:functionCode"/>
                           </xsl:call-template>
                           <xsl:text> </xsl:text>
                        </xsl:if>
                        <xsl:call-template name="show-associatedEntity">
                           <xsl:with-param name="assoEntity" select="n1:associatedEntity"/>
                        </xsl:call-template>
					  <xsl:if test="n1:associatedEntity/n1:addr | n1:associatedEntity/n1:telecom">
						   <xsl:call-template name="show-contactInfo">
							  <xsl:with-param name="contact" select="n1:associatedEntity"/>
						   </xsl:call-template>
					  </xsl:if>                        
                      <!--  <xsl:if test="n1:time">
                           <xsl:if test="n1:time/n1:low">
                              <xsl:text> from </xsl:text>
                              <xsl:call-template name="show-time">
                                 <xsl:with-param name="datetime" select="n1:time/n1:low"/>
                              </xsl:call-template>
                           </xsl:if>
                           <xsl:if test="n1:time/n1:high">
                              <xsl:text> to </xsl:text>
                              <xsl:call-template name="show-time">
                                 <xsl:with-param name="datetime" select="n1:time/n1:high"/>
                              </xsl:call-template>
                           </xsl:if>
                        </xsl:if>
					  -->	
                     </td>
                  </tr>
   </xsl:template>
  
   <!-- recordTarget -->
   <xsl:template name="recordTarget">
		 <fieldset>
			<legend><b>Demographic Information</b></legend>
			<table>
				<tbody>
					<xsl:for-each select="/n1:ClinicalDocument/n1:recordTarget/n1:patientRole">
               <xsl:if test="not(n1:id/@nullFlavor)">
                  <tr>
                     <td>
                        <label><b>Patient: </b></label>
                     </td>
                     <td>
                        <xsl:call-template name="show-name">
                           <xsl:with-param name="name" select="n1:patient/n1:name"/>
                        </xsl:call-template>
                     </td>
                  </tr>
                  <tr>
                     <td>
                        <label><b>Date of birth: </b></label>
                     </td>
                     <td>
                        <xsl:call-template name="show-time">
                           <xsl:with-param name="datetime" select="n1:patient/n1:birthTime"/>
                        </xsl:call-template>
                     </td>
                  </tr>
                  <tr>
                     <td>
                        <label><b>Gender: </b></label>
                     </td>
                     <td>
                        <xsl:for-each select="n1:patient/n1:administrativeGenderCode">
                           <xsl:call-template name="show-gender"/>
                        </xsl:for-each>
                     </td>
                  </tr>
                  <xsl:if test="n1:patient/n1:raceCode | (n1:patient/n1:ethnicGroupCode)">
                     <tr>
                        <td>
                           <label><b>Race: </b></label>
                        </td>
                        <td>
                           <xsl:choose>
                              <xsl:when test="n1:patient/n1:raceCode">
                                 <xsl:for-each select="n1:patient/n1:raceCode">
                                    <xsl:call-template name="show-race-ethnicity"/>
                                 </xsl:for-each>
                              </xsl:when>
                              <xsl:otherwise>
                                 <xsl:text>Information not available</xsl:text>
                              </xsl:otherwise>
                           </xsl:choose>
                        </td>
                     </tr>
                  </xsl:if>
                  <tr>
					<td>
					  <label><b>Ethnicity: </b></label>
					</td>
					<td>
					   <xsl:choose>
						  <xsl:when test="n1:patient/n1:ethnicGroupCode">
							 <xsl:for-each select="n1:patient/n1:ethnicGroupCode">
								<xsl:call-template name="show-race-ethnicity"/>
							 </xsl:for-each>
						  </xsl:when>
						  <xsl:otherwise>
							 <xsl:text>Information not available</xsl:text>
						  </xsl:otherwise>
					   </xsl:choose>
					</td>
				 </tr>
                  <tr>
                     <td style="vertical-align: top;">
                        <label><b>Contact info: </b></label>
                     </td>
                     <td>
                        <xsl:call-template name="show-contactInfo">
                           <xsl:with-param name="contact" select="."/>
                        </xsl:call-template>
                     </td>
                  </tr>
                  <tr>
                     <td>
                        <label><b>Patient IDs: </b></label>
                     </td>
                     <td>
                        <xsl:for-each select="n1:id">
                           <xsl:call-template name="show-id"/>
                           <br/>
                        </xsl:for-each>
                     </td>
                  </tr>
               </xsl:if>
            </xsl:for-each>
				</tbody>
			</table>
		 </fieldset>	
   </xsl:template>

   <!-- relatedDocument -->
   <xsl:template name="relatedDocument">
      <xsl:if test="n1:relatedDocument">
         <table class="header_table">
            <tbody>
               <xsl:for-each select="n1:relatedDocument">
                  <tr>
                     <td width="20%" bgcolor="#3399ff">
                        <span class="td_label">
                           <xsl:text>Related document</xsl:text>
                        </span>
                     </td>
                     <td width="80%">
                        <xsl:for-each select="n1:parentDocument">
                           <xsl:for-each select="n1:id">
                              <xsl:call-template name="show-id"/>
                              <br/>
                           </xsl:for-each>
                        </xsl:for-each>
                     </td>
                  </tr>
               </xsl:for-each>
            </tbody>
         </table>
      </xsl:if>
   </xsl:template>
   <!-- authorization (consent) -->
   <xsl:template name="authorization">
      <xsl:if test="n1:authorization">
         <table class="header_table">
            <tbody>
               <xsl:for-each select="n1:authorization">
                  <tr>
                     <td width="20%" bgcolor="#3399ff">
                        <span class="td_label">
                           <xsl:text>Consent</xsl:text>
                        </span>
                     </td>
                     <td width="80%">
                        <xsl:choose>
                           <xsl:when test="n1:consent/n1:code">
                              <xsl:call-template name="show-code">
                                 <xsl:with-param name="code" select="n1:consent/n1:code"/>
                              </xsl:call-template>
                           </xsl:when>
                           <xsl:otherwise>
                              <xsl:call-template name="show-code">
                                 <xsl:with-param name="code" select="n1:consent/n1:statusCode"/>
                              </xsl:call-template>
                           </xsl:otherwise>
                        </xsl:choose>
                        <br/>
                     </td>
                  </tr>
               </xsl:for-each>
            </tbody>
         </table>
      </xsl:if>
   </xsl:template>
   <!-- setAndVersion -->
   <xsl:template name="setAndVersion">
      <xsl:if test="n1:setId and n1:versionNumber">
         <table class="header_table">
            <tbody>
               <tr>
                  <td width="20%">
                     <xsl:text>SetId and Version</xsl:text>
                  </td>
                  <td colspan="3">
                     <xsl:text>SetId: </xsl:text>
                     <xsl:call-template name="show-id">
                        <xsl:with-param name="id" select="n1:setId"/>
                     </xsl:call-template>
                     <xsl:text>  Version: </xsl:text>
                     <xsl:value-of select="n1:versionNumber/@value"/>
                  </td>
               </tr>
            </tbody>
         </table>
      </xsl:if>
   </xsl:template>
   <!-- show StructuredBody  -->
   <xsl:template match="n1:component/n1:structuredBody">
      <xsl:for-each select=".">
         <xsl:call-template name="section"/>
      </xsl:for-each>
   </xsl:template>
   <!-- show nonXMLBody -->
   <xsl:template match='n1:component/n1:nonXMLBody'>
      <xsl:choose>
         <!-- if there is a reference, use that in an IFRAME -->
         <xsl:when test='n1:text/n1:reference'>
            <IFRAME name='nonXMLBody' id='nonXMLBody' WIDTH='80%' HEIGHT='600' src='{n1:text/n1:reference/@value}'/>
         </xsl:when>
         <xsl:when test='n1:text/@mediaType="text/plain"'>
            <pre>
               <xsl:value-of select='n1:text/text()'/>
            </pre>
         </xsl:when>
         <xsl:otherwise>
            <CENTER>Cannot display the text</CENTER>
         </xsl:otherwise>
      </xsl:choose>
   </xsl:template>
   <!-- top level component/section: display title and text,
     and process any nested component/sections -->
  
   <xsl:template name="section">
	   <xsl:variable name="compTemplateIdRoots" select="n1:component/n1:section/n1:templateId/@root"/>
	   <xsl:variable name="sectionsCount" select="count(n1:component/n1:section)"/>
	   <xsl:variable name="sections" select="n1:component/n1:section"/>
	  
	  <xsl:choose>
	  <xsl:when test="contains($ccdDocTemplateRoot, $ccdaDoc)">		
       		 <xsl:for-each select="$ccdTemplateIdArrayParam">
			<xsl:variable name="templateId">
				<xsl:value-of select="." />
			</xsl:variable>   
			<xsl:variable name="pos-int" select="position()" />
			<xsl:variable name="currentSection" select="$sections[n1:templateId[@root = $templateId or @root = concat($templateId,'.1')]]/n1:text" />
			<xsl:variable name="headerValue">
				<xsl:value-of select="$ccdSectionHeaderParam[$pos-int]" />
			</xsl:variable>	
			<xsl:variable name="headerHrefTitleId">	
				<xsl:value-of select="$ccdSectionHeaderRefParam[$pos-int]" />
			</xsl:variable>	  
    
			<xsl:choose>
			<xsl:when test="$compTemplateIdRoots  = $templateId or $compTemplateIdRoots  = concat($templateId,'.1')">
			   <!--<xsl:call-template name="section-title">
				  <xsl:with-param name="title" select="$headerValue"/>
				  <xsl:with-param name="titleId" select="$headerHrefTitleId"/>
				  <xsl:with-param name="sectionCount" select="$sectionsCount"/>
			   </xsl:call-template>		
			   <xsl:call-template name="section-author">
				   <xsl:with-param name="templateId" select="$templateId"/>
			   </xsl:call-template>-->
			   <xsl:call-template name="section-text">
			   	   <xsl:with-param name="title" select="$headerValue"/>
				   <xsl:with-param name="titleId" select="$headerHrefTitleId"/>
				   <xsl:with-param name="htmlText" select="$currentSection" />
				   <xsl:with-param name="sectionPosition" select="$pos-int" />	
			   </xsl:call-template>
		   	</xsl:when>
			<xsl:otherwise>
			  <section id="{$headerValue}">
				<header>
					<h2>
						<xsl:value-of select="$headerValue"/>	
						<!--<span class="count"><xsl:value-of select="$pos-int"/></span>-->			
					</h2>

					No data provided for this section.
				</header>
			  </section>
			</xsl:otherwise>
			</xsl:choose>	
		</xsl:for-each>
       		<xsl:for-each select="$ccdAdditionalTemplateIdArrayParam">
			<xsl:variable name="templateId">
				<xsl:value-of select="." />
			</xsl:variable>   
			<xsl:variable name="pos-int" select="position()" />
			<xsl:variable name="currentSection" select="$sections[n1:templateId[@root = $templateId or @root = concat($templateId,'.1')]]/n1:text" />
			<xsl:variable name="headerValue">
				<xsl:value-of select="$ccdAdditionalSectionHeaderParam[$pos-int]" />
			</xsl:variable>	
			<xsl:variable name="headerHrefTitleId">	
				<xsl:value-of select="$ccdAdditionalSectionHeaderHrefParam[$pos-int]" />
			</xsl:variable>	  
    
			<xsl:choose>
				<xsl:when test="$compTemplateIdRoots  = $templateId or $compTemplateIdRoots  = concat($templateId,'.1')">
				   <xsl:call-template name="section-text">
					   <xsl:with-param name="title" select="$headerValue"/>
					   <xsl:with-param name="titleId" select="$headerHrefTitleId"/>
					   <xsl:with-param name="htmlText" select="$currentSection" />
					   <xsl:with-param name="sectionPosition" select="$pos-int" />	
				   </xsl:call-template>
				</xsl:when>
				<!--
				<xsl:otherwise>
				  <section id="{$headerValue}">
					<header>
						<h2>
							<xsl:value-of select="$headerValue"/>	
						</h2>

						No data available within defined date range for this section.
					</header>
				  </section>
				</xsl:otherwise>
				-->
			</xsl:choose>	
		</xsl:for-each>
	</xsl:when>	  
	  <xsl:when test="contains($progDocTemplateRoot, $progressDoc)">		
       <xsl:for-each select="$progressTemplateIdArrayParam/templateId">
			<xsl:variable name="templateId">
				<xsl:value-of select="." />
			</xsl:variable>   
			<xsl:variable name="pos-int" select="position()" />
			<xsl:variable name="currentSection" select="$sections[n1:templateId[@root = $templateId or @root = concat($templateId,'.1')]]/n1:text" />
			<xsl:variable name="headerValue">
				<xsl:value-of select="$progSectionHeaderParam[$pos-int]" />
			</xsl:variable>	
			<xsl:variable name="headerHrefTitleId">	
				<xsl:value-of select="$progSectionHeaderHrefParam[$pos-int]" />
			</xsl:variable>	  
    
			<xsl:choose>
			<xsl:when test="$compTemplateIdRoots  = $templateId or $compTemplateIdRoots  = concat($templateId,'.1')">
			   <xsl:call-template name="section-text">
			   	   <xsl:with-param name="title" select="$headerValue"/>
				   <xsl:with-param name="titleId" select="$headerHrefTitleId"/>
				   <xsl:with-param name="htmlText" select="$currentSection" />
				   <xsl:with-param name="sectionPosition" select="$pos-int" />
			   </xsl:call-template>
		   	</xsl:when>
			<xsl:otherwise>
	  <section id="{$headerValue}">
		<header>
			<h2>
				<xsl:value-of select="$headerValue"/>	
				<!--<span class="count"><xsl:value-of select="$pos-int"/></span>-->			
			</h2>
			
			No data provided for this section.
		</header>
	  </section>
			</xsl:otherwise>
		</xsl:choose>	
		 </xsl:for-each>
       		<xsl:for-each select="$progressAdditionalTemplateIdArrayParam">
			<xsl:variable name="templateId">
				<xsl:value-of select="." />
			</xsl:variable>   
			<xsl:variable name="pos-int" select="position()" />
			<xsl:variable name="currentSection" select="$sections[n1:templateId[@root = $templateId or @root = concat($templateId,'.1')]]/n1:text" />
			<xsl:variable name="headerValue">
				<xsl:value-of select="$progressAdditionalSectionHeaderParam[$pos-int]" />
			</xsl:variable>	
			<xsl:variable name="headerHrefTitleId">	
				<xsl:value-of select="$progressAdditionalSectionHeaderHrefParam[$pos-int]" />
			</xsl:variable>	  
    
			<xsl:choose>
				<xsl:when test="$compTemplateIdRoots  = $templateId or $compTemplateIdRoots  = concat($templateId,'.1')">
				   <xsl:call-template name="section-text">
					   <xsl:with-param name="title" select="$headerValue"/>
					   <xsl:with-param name="titleId" select="$headerHrefTitleId"/>
					   <xsl:with-param name="htmlText" select="$currentSection" />
					   <xsl:with-param name="sectionPosition" select="$pos-int" />	
				   </xsl:call-template>
				</xsl:when>

			</xsl:choose>	
		</xsl:for-each>
	</xsl:when>
	<xsl:otherwise></xsl:otherwise>
	</xsl:choose>	  
   </xsl:template>
   <!-- top level section title -->
   <xsl:template name="section-title">
      <xsl:param name="title"/>
      <xsl:param name="titleId"/>
      <xsl:param name="sectionCount"/>

      <xsl:choose>
         <xsl:when test="$sectionCount &gt; 1">
            <h3>
               <a name="{$titleId}" href="#toc">
                  <xsl:value-of select="$title"/>
               </a>
            </h3>
         </xsl:when>
         <xsl:otherwise>
            <h3>
               <xsl:value-of select="$title"/>
            </h3>
         </xsl:otherwise>
      </xsl:choose>
   </xsl:template>
   <!-- section author -->
   <xsl:template name="section-author">
	   <xsl:param name="templateId"/>

      <xsl:if test="count(n1:component/n1:section/n1:templateId[@root = $templateId or @root = concat($templateId,'.1')]/*/n1:author)&gt;0">
         <div style="margin-left : 2em;">
            <b>
               <xsl:text>Section Author: </xsl:text>
            </b>
            <xsl:for-each select="n1:component/n1:section/n1:templateId[@root = $templateId or @root = concat($templateId,'.1')]/n1:author/n1:assignedAuthor">
               <xsl:choose>
                  <xsl:when test="n1:assignedPerson/n1:name">
                     <xsl:call-template name="show-name">
                        <xsl:with-param name="name" select="n1:assignedPerson/n1:name"/>
                     </xsl:call-template>
                     <xsl:if test="n1:representedOrganization">
                        <xsl:text>, </xsl:text>
                        <xsl:call-template name="show-name">
                           <xsl:with-param name="name" select="n1:representedOrganization/n1:name"/>
                        </xsl:call-template>
                     </xsl:if>
                  </xsl:when>
                  <xsl:when test="n1:assignedAuthoringDevice/n1:softwareName">
                     <xsl:value-of select="n1:assignedAuthoringDevice/n1:softwareName"/>
                  </xsl:when>
                  <xsl:otherwise>
                     <xsl:for-each select="n1:id">
                        <xsl:call-template name="show-id"/>
                        <br/>
                     </xsl:for-each>
                  </xsl:otherwise>
               </xsl:choose>
            </xsl:for-each>
            <br/>
         </div>
      </xsl:if>
   </xsl:template>
   <!-- top-level section Text   -->
   <xsl:template name="section-text">
	  <xsl:param name="htmlText" />
      <xsl:param name="title"/>
      <xsl:param name="titleId"/>
      <xsl:param name="sectionPosition"/>

      <xsl:variable name="alpha" select="$htmlText"/>

	  <section id="{$title}">
		<header>
			<h2>
				<xsl:value-of select="$title"/>	
				<!--<span class="count"><xsl:value-of select="$sectionPosition"/></span>	-->		
			</h2>
			
		  <xsl:choose>
					<xsl:when test="$htmlText[contains(., 'No Information')]">
						<xsl:text>No data provided for this section.</xsl:text>
					</xsl:when>
					<xsl:when test="count($htmlText/n1:table) &gt; 1">
						<!--<p>
							<strong>
								Business Rules for Construction of Medical Information:
							</strong> 
							<xsl:value-of select="$htmlText/n1:table[position() = 1]/n1:tbody/n1:tr/n1:td[position() = 2]"/>
						</p>-->	
					</xsl:when>
					<xsl:otherwise>				
					</xsl:otherwise>
		  </xsl:choose>			
		</header>
		  <xsl:choose>
					<xsl:when test="$htmlText[contains(., 'No Information')]">
					</xsl:when>
					<xsl:otherwise>		
						<xsl:apply-templates select="$htmlText"/>		
					</xsl:otherwise>
		  </xsl:choose>
	  </section>
   </xsl:template>

   <!--   paragraph  -->
   <xsl:template match="n1:paragraph">
      <p>
         <xsl:apply-templates/>
      </p>
   </xsl:template>
   <!--   pre format  -->
   <xsl:template match="n1:pre">
      <pre>
         <xsl:apply-templates/>
      </pre>
   </xsl:template>
   <!--   Content w/ deleted text is hidden -->
   <xsl:template match="n1:content[@revised='delete']"/>
   <!--   content  -->
   <xsl:template match="n1:content">
      <xsl:apply-templates/>
   </xsl:template>
   <!-- line break -->
   <xsl:template match="n1:br">
      <xsl:element name='br'>
         <xsl:apply-templates/>
      </xsl:element>
   </xsl:template>
   <!--   list  -->
   <xsl:template match="n1:list">
      <xsl:if test="n1:caption">
         <p>
            <b>
               <xsl:apply-templates select="n1:caption"/>
            </b>
         </p>
      </xsl:if>
      <ul>
         <xsl:for-each select="n1:item">
            <li>
               <xsl:apply-templates/>
            </li>
         </xsl:for-each>
      </ul>
   </xsl:template>
   <xsl:template match="n1:list[@listType='ordered']">
      <xsl:if test="n1:caption">
         <span style="font-weight:bold; ">
            <xsl:apply-templates select="n1:caption"/>
         </span>
      </xsl:if>
      <ol>
         <xsl:for-each select="n1:item">
            <li>
               <xsl:apply-templates/>
            </li>
         </xsl:for-each>
      </ol>
   </xsl:template>
   <!--   caption  -->
   <xsl:template match="n1:caption">
      <xsl:apply-templates/>
      <xsl:text>: </xsl:text>
   </xsl:template>
   <!--  Tables   -->
   <xsl:template match="n1:table/@*|n1:thead/@*|n1:tfoot/@*|n1:tbody/@*|n1:colgroup/@*|n1:col/@*|n1:tr/@*|n1:th/@*|n1:td/@*">
      <xsl:copy>
         <xsl:copy-of select="@*"/>
         <xsl:apply-templates/>
      </xsl:copy>
   </xsl:template>
   <xsl:template match="n1:table">
      <table class="narr_table">
         <xsl:copy-of select="@*"/>
         <xsl:apply-templates/>
      </table>
   </xsl:template>
   <xsl:template match="n1:thead">
      <thead>
         <xsl:copy-of select="@*"/>
         <xsl:apply-templates/>
      </thead>
   </xsl:template>
   <xsl:template match="n1:tfoot">
      <tfoot>
         <xsl:copy-of select="@*"/>
         <xsl:apply-templates/>
      </tfoot>
   </xsl:template>
   <xsl:template match="n1:tbody">
      <tbody>
         <xsl:copy-of select="@*"/>
         <xsl:apply-templates/>
      </tbody>
   </xsl:template>
   <xsl:template match="n1:colgroup">
      <colgroup>
         <xsl:copy-of select="@*"/>
         <xsl:apply-templates/>
      </colgroup>
   </xsl:template>
   <xsl:template match="n1:col">
      <col>
         <xsl:copy-of select="@*"/>
         <xsl:apply-templates/>
      </col>
   </xsl:template>
   <xsl:template match="n1:tr">
      <tr class="narr_tr">
         <xsl:copy-of select="@*"/>
         <xsl:apply-templates/>
      </tr>
   </xsl:template>
   <xsl:template match="n1:th">
      <th class="narr_th">
         <xsl:copy-of select="@*"/>
         <xsl:apply-templates/>
      </th>
   </xsl:template>
   <xsl:template match="n1:td">
      <td>
         <xsl:copy-of select="@*"/>
         <xsl:apply-templates/>
      </td>
   </xsl:template>
   <xsl:template match="n1:table/n1:caption">
      <span style="font-weight:bold; ">
         <xsl:apply-templates/>
      </span>
   </xsl:template>
   <!--   RenderMultiMedia 
    this currently only handles GIF's and JPEG's.  It could, however,
    be extended by including other image MIME types in the predicate
    and/or by generating <object> or <applet> tag with the correct
    params depending on the media type  @ID  =$imageRef  referencedObject
    -->
   <xsl:template match="n1:renderMultiMedia">
      <xsl:variable name="imageRef" select="@referencedObject"/>
      <xsl:choose>
         <xsl:when test="//n1:regionOfInterest[@ID=$imageRef]">
            <!-- Here is where the Region of Interest image referencing goes -->
            <xsl:if test="//n1:regionOfInterest[@ID=$imageRef]//n1:observationMedia/n1:value[@mediaType='image/gif' or
 @mediaType='image/jpeg']">
               <br clear="all"/>
               <xsl:element name="img">
                  <xsl:attribute name="src"><xsl:value-of select="//n1:regionOfInterest[@ID=$imageRef]//n1:observationMedia/n1:value/n1:reference/@value"/></xsl:attribute>
               </xsl:element>
            </xsl:if>
         </xsl:when>
         <xsl:otherwise>
            <!-- Here is where the direct MultiMedia image referencing goes -->
            <xsl:if test="//n1:observationMedia[@ID=$imageRef]/n1:value[@mediaType='image/gif' or @mediaType='image/jpeg']">
               <br clear="all"/>
               <xsl:element name="img">
                  <xsl:attribute name="src"><xsl:value-of select="//n1:observationMedia[@ID=$imageRef]/n1:value/n1:reference/@value"/></xsl:attribute>
               </xsl:element>
            </xsl:if>
         </xsl:otherwise>
      </xsl:choose>
   </xsl:template>
   <!--    Stylecode processing   
    Supports Bold, Underline and Italics display
    -->
    <xsl:template match="@styleCode">
        <xsl:attribute name="class"><xsl:value-of select="."/></xsl:attribute>
    </xsl:template>
   <!--
   <xsl:template match="//n1:*[@styleCode]">
      <xsl:if test="@styleCode='Bold'">
         <xsl:element name="b">
            <xsl:apply-templates/>
         </xsl:element>
      </xsl:if>
      <xsl:if test="@styleCode='Italics'">
         <xsl:element name="i">
            <xsl:apply-templates/>
         </xsl:element>
      </xsl:if>
      <xsl:if test="@styleCode='Underline'">
         <xsl:element name="u">
            <xsl:apply-templates/>
         </xsl:element>
      </xsl:if>
      <xsl:if test="contains(@styleCode,'Bold') and contains(@styleCode,'Italics') and not (contains(@styleCode, 'Underline'))">
         <xsl:element name="b">
            <xsl:element name="i">
               <xsl:apply-templates/>
            </xsl:element>
         </xsl:element>
      </xsl:if>
      <xsl:if test="contains(@styleCode,'Bold') and contains(@styleCode,'Underline') and not (contains(@styleCode, 'Italics'))">
         <xsl:element name="b">
            <xsl:element name="u">
               <xsl:apply-templates/>
            </xsl:element>
         </xsl:element>
      </xsl:if>
      <xsl:if test="contains(@styleCode,'Italics') and contains(@styleCode,'Underline') and not (contains(@styleCode, 'Bold'))">
         <xsl:element name="i">
            <xsl:element name="u">
               <xsl:apply-templates/>
            </xsl:element>
         </xsl:element>
      </xsl:if>
      <xsl:if test="contains(@styleCode,'Italics') and contains(@styleCode,'Underline') and contains(@styleCode, 'Bold')">
         <xsl:element name="b">
            <xsl:element name="i">
               <xsl:element name="u">
                  <xsl:apply-templates/>
               </xsl:element>
            </xsl:element>
         </xsl:element>
      </xsl:if>
      <xsl:if test="not (contains(@styleCode,'Italics') or contains(@styleCode,'Underline') or contains(@styleCode, 'Bold'))">
         <xsl:apply-templates/>
      </xsl:if>
   </xsl:template>
   -->
   <!--    Superscript or Subscript   -->
   <xsl:template match="n1:sup">
      <xsl:element name="sup">
         <xsl:apply-templates/>
      </xsl:element>
   </xsl:template>
   <xsl:template match="n1:sub">
      <xsl:element name="sub">
         <xsl:apply-templates/>
      </xsl:element>
   </xsl:template>
   <!-- show-signature -->
   <xsl:template name="show-sig">
      <xsl:param name="sig"/>
      <xsl:choose>
         <xsl:when test="$sig/@code =&apos;S&apos;">
            <xsl:text>signed</xsl:text>
         </xsl:when>
         <xsl:when test="$sig/@code=&apos;I&apos;">
            <xsl:text>intended</xsl:text>
         </xsl:when>
         <xsl:when test="$sig/@code=&apos;X&apos;">
            <xsl:text>signature required</xsl:text>
         </xsl:when>
      </xsl:choose>
   </xsl:template>
   <!--  show-id -->
   <xsl:template name="show-id">
      <xsl:param name="id"/>
      <xsl:choose>
         <xsl:when test="not($id)">
            <xsl:if test="not(@nullFlavor)">
               <xsl:if test="@extension">
                  <xsl:value-of select="@extension"/>
               </xsl:if>
               <xsl:text> </xsl:text>
               <xsl:value-of select="@root"/>
            </xsl:if>
         </xsl:when>
         <xsl:otherwise>
            <xsl:if test="not($id/@nullFlavor)">
               <xsl:if test="$id/@extension">
                  <xsl:value-of select="$id/@extension"/>
               </xsl:if>
               <xsl:text> </xsl:text>
               <xsl:value-of select="$id/@root"/>
            </xsl:if>
         </xsl:otherwise>
      </xsl:choose>
   </xsl:template>
   <!-- show-name  -->
   <xsl:template name="show-name">
      <xsl:param name="name"/>
      <xsl:choose>
         <xsl:when test="$name/n1:family">
            <xsl:if test="$name/n1:prefix">
               <xsl:value-of select="$name/n1:prefix"/>
               <xsl:text> </xsl:text>
            </xsl:if>
            <xsl:value-of select="$name/n1:given"/>
            <xsl:text> </xsl:text>
            <xsl:value-of select="$name/n1:family"/>
            <xsl:if test="$name/n1:suffix">
               <xsl:text>, </xsl:text>
               <xsl:value-of select="$name/n1:suffix"/>
            </xsl:if>
         </xsl:when>
         <xsl:otherwise>
            <xsl:value-of select="$name"/>
         </xsl:otherwise>
      </xsl:choose>
   </xsl:template>
   <!-- show-gender  -->
   <xsl:template name="show-gender">
      <xsl:choose>
         <xsl:when test="@code   = &apos;M&apos;">
            <xsl:text>Male</xsl:text>
         </xsl:when>
         <xsl:when test="@code  = &apos;F&apos;">
            <xsl:text>Female</xsl:text>
         </xsl:when>
         <xsl:when test="@code  = &apos;U&apos;">
            <xsl:text>Undifferentiated</xsl:text>
         </xsl:when>
      </xsl:choose>
   </xsl:template>
   <!-- show-race-ethnicity  -->
   <xsl:template name="show-race-ethnicity">
      <xsl:choose>
         <xsl:when test="@displayName">
            <xsl:value-of select="@displayName"/>
         </xsl:when>
         <xsl:otherwise>
            <xsl:value-of select="''"/>
         </xsl:otherwise>
      </xsl:choose>
   </xsl:template>
   <!-- show-contactInfo -->
   <xsl:template name="show-contactInfo">
      <xsl:param name="contact"/>
      <xsl:call-template name="show-address">
         <xsl:with-param name="address" select="$contact/n1:addr"/>
      </xsl:call-template>
      <xsl:call-template name="show-telecom">
         <xsl:with-param name="telecom" select="$contact/n1:telecom"/>
      </xsl:call-template>
   </xsl:template>
   <!-- show-address -->
   <xsl:template name="show-address">
      <xsl:param name="address"/>
      <xsl:choose>
         <xsl:when test="$address">
            <xsl:if test="$address/@use">
               <xsl:text> </xsl:text>
               <xsl:call-template name="translateTelecomCode">
                  <xsl:with-param name="code" select="$address/@use"/>
               </xsl:call-template>
               <xsl:text>:</xsl:text>
               <br/>
            </xsl:if>
            <xsl:for-each select="$address/n1:streetAddressLine">
               <xsl:value-of select="."/>
               <br/>
            </xsl:for-each>
            <xsl:if test="$address/n1:streetName">
               <xsl:value-of select="$address/n1:streetName"/>
               <xsl:text> </xsl:text>
               <xsl:value-of select="$address/n1:houseNumber"/>
               <br/>
            </xsl:if>
            <xsl:if test="string-length($address/n1:city)>0">
               <xsl:value-of select="$address/n1:city"/>
            </xsl:if>
            <xsl:if test="string-length($address/n1:state)>0">
               <xsl:text>,&#160;</xsl:text>
               <xsl:value-of select="$address/n1:state"/>
            </xsl:if>
            <xsl:if test="string-length($address/n1:postalCode)>0">
               <xsl:text>&#160;</xsl:text>
               <xsl:value-of select="$address/n1:postalCode"/>
            </xsl:if>
            <xsl:if test="string-length($address/n1:country)>0">
               <xsl:text>,&#160;</xsl:text>
               <xsl:value-of select="$address/n1:country"/>
            </xsl:if>
         </xsl:when>
         <xsl:otherwise>
            <xsl:text>address not available</xsl:text>
         </xsl:otherwise>
      </xsl:choose>
      <br/>
   </xsl:template>
   <!-- show-telecom -->
   <xsl:template name="show-telecom">
      <xsl:param name="telecom"/>
      <xsl:choose>
         <xsl:when test="$telecom">
            <xsl:variable name="type" select="substring-before($telecom/@value, ':')"/>
            <xsl:variable name="value" select="substring-after($telecom/@value, ':')"/>
            <xsl:if test="$type">
               <xsl:call-template name="translateTelecomCode">
                  <xsl:with-param name="code" select="$type"/>
               </xsl:call-template>
               <xsl:if test="@use">
                  <xsl:text> (</xsl:text>
                  <xsl:call-template name="translateTelecomCode">
                     <xsl:with-param name="code" select="@use"/>
                  </xsl:call-template>
                  <xsl:text>)</xsl:text>
               </xsl:if>
               <xsl:text>: </xsl:text>
               <xsl:text> </xsl:text>
               <xsl:value-of select="$value"/>
            </xsl:if>
         </xsl:when>
         <xsl:otherwise>
            <xsl:text>Telecom information not available</xsl:text>
         </xsl:otherwise>
      </xsl:choose>
      <br/>
   </xsl:template>
   <!-- show-recipientType -->
   <xsl:template name="show-recipientType">
      <xsl:param name="typeCode"/>
      <xsl:choose>
         <xsl:when test="$typeCode='PRCP'">Primary Recipient:</xsl:when>
         <xsl:when test="$typeCode='TRC'">Secondary Recipient:</xsl:when>
         <xsl:otherwise>Recipient:</xsl:otherwise>
      </xsl:choose>
   </xsl:template>
   <!-- Convert Telecom URL to display text -->
   <xsl:template name="translateTelecomCode">
      <xsl:param name="code"/>
      <!--xsl:value-of select="document('voc.xml')/systems/system[@root=$code/@codeSystem]/code[@value=$code/@code]/@displayName"/-->
      <!--xsl:value-of select="document('codes.xml')/*/code[@code=$code]/@display"/-->
      <xsl:choose>
         <!-- lookup table Telecom URI -->
         <xsl:when test="$code='tel'">
            <xsl:text>Tel</xsl:text>
         </xsl:when>
         <xsl:when test="$code='fax'">
            <xsl:text>Fax</xsl:text>
         </xsl:when>
         <xsl:when test="$code='http'">
            <xsl:text>Web</xsl:text>
         </xsl:when>
         <xsl:when test="$code='mailto'">
            <xsl:text>Mail</xsl:text>
         </xsl:when>
         <xsl:when test="$code='H'">
            <xsl:text>Home</xsl:text>
         </xsl:when>
         <xsl:when test="$code='HV'">
            <xsl:text>Vacation Home</xsl:text>
         </xsl:when>
         <xsl:when test="$code='HP'">
            <xsl:text>Primary Home</xsl:text>
         </xsl:when>
         <xsl:when test="$code='WP'">
            <xsl:text>Work Place</xsl:text>
         </xsl:when>
         <xsl:when test="$code='PUB'">
            <xsl:text>Pub</xsl:text>
         </xsl:when>
         <xsl:otherwise>
            <xsl:text>{$code='</xsl:text>
            <xsl:value-of select="$code"/>
            <xsl:text>'?}</xsl:text>
         </xsl:otherwise>
      </xsl:choose>
   </xsl:template>
   <!-- convert RoleClassAssociative code to display text -->
   <xsl:template name="showDisplayName">
      <xsl:param name="code"/>

      <xsl:if test="($code/@code) and ($code/@codeSystem='2.16.840.1.113883.5.111') and ($code/@displayName)">
         <xsl:text> (</xsl:text>
         <xsl:value-of select="$code/@displayName"/>
         <xsl:text>)</xsl:text>
      </xsl:if>
   </xsl:template>
      <xsl:template name="translateRoleAssoCode">
      <xsl:param name="classCode"/>
      <xsl:param name="code"/>
      <xsl:choose>
         <xsl:when test="$classCode='AFFL'">
            <xsl:text>affiliate</xsl:text>
         </xsl:when>
         <xsl:when test="$classCode='AGNT'">
            <xsl:text>agent</xsl:text>
         </xsl:when>
         <xsl:when test="$classCode='ASSIGNED'">
            <xsl:text>assigned entity</xsl:text>
         </xsl:when>
         <xsl:when test="$classCode='COMPAR'">
            <xsl:text>commissioning party</xsl:text>
         </xsl:when>
         <xsl:when test="$classCode='CON'">
            <xsl:text>contact</xsl:text>
         </xsl:when>
         <xsl:when test="$classCode='ECON'">
            <xsl:text>emergency contact</xsl:text>
         </xsl:when>
         <xsl:when test="$classCode='NOK'">
            <xsl:text>next of kin</xsl:text>
         </xsl:when>
         <xsl:when test="$classCode='SGNOFF'">
            <xsl:text>signing authority</xsl:text>
         </xsl:when>
         <xsl:when test="$classCode='GUARD'">
            <xsl:text>guardian</xsl:text>
         </xsl:when>
         <xsl:when test="$classCode='GUAR'">
            <xsl:text>guardian</xsl:text>
         </xsl:when>
         <xsl:when test="$classCode='CIT'">
            <xsl:text>citizen</xsl:text>
         </xsl:when>
         <xsl:when test="$classCode='COVPTY'">
            <xsl:text>covered party</xsl:text>
         </xsl:when>
         <xsl:when test="$classCode='PRS'">
            <xsl:text>personal relationship</xsl:text>
         </xsl:when>
         <xsl:when test="$classCode='CAREGIVER'">
            <xsl:text>care giver</xsl:text>
         </xsl:when>
         <xsl:when test="$classCode='PROV'">
            <xsl:text>provider</xsl:text>
         </xsl:when>
         <xsl:otherwise>
            <xsl:text>{$classCode='</xsl:text>
            <xsl:value-of select="$classCode"/>
            <xsl:text>'?}</xsl:text>
         </xsl:otherwise>
      </xsl:choose>
      <!--<xsl:if test="($code/@code) and ($code/@codeSystem='2.16.840.1.113883.5.111')">
         <xsl:text> </xsl:text>
         <xsl:choose>
            <xsl:when test="$code/@code='FTH'">
               <xsl:text>(Father)</xsl:text>
            </xsl:when>
            <xsl:when test="$code/@code='MTH'">
               <xsl:text>(Mother)</xsl:text>
            </xsl:when>
            <xsl:when test="$code/@code='NPRN'">
               <xsl:text>(Natural parent)</xsl:text>
            </xsl:when>
            <xsl:when test="$code/@code='STPPRN'">
               <xsl:text>(Step parent)</xsl:text>
            </xsl:when>
            <xsl:when test="$code/@code='SONC'">
               <xsl:text>(Son)</xsl:text>
            </xsl:when>
            <xsl:when test="$code/@code='DAUC'">
               <xsl:text>(Daughter)</xsl:text>
            </xsl:when>
            <xsl:when test="$code/@code='CHILD'">
               <xsl:text>(Child)</xsl:text>
            </xsl:when>
            <xsl:when test="$code/@code='EXT'">
               <xsl:text>(Extended family member)</xsl:text>
            </xsl:when>
            <xsl:when test="$code/@code='NBOR'">
               <xsl:text>(Neighbor)</xsl:text>
            </xsl:when>
            <xsl:when test="$code/@code='SIGOTHR'">
               <xsl:text>(Significant other)</xsl:text>
            </xsl:when>
            <xsl:otherwise>
               <xsl:text>{$code/@code='</xsl:text>
               <xsl:value-of select="$code/@code"/>
               <xsl:text>'?}</xsl:text>
            </xsl:otherwise>
         </xsl:choose>
      </xsl:if>-->
   </xsl:template>
   <!-- show time -->
   <xsl:template name="show-time">
      <xsl:param name="datetime"/>
      <xsl:choose>
         <xsl:when test="not($datetime)">
            <xsl:call-template name="formatDateTime">
               <xsl:with-param name="date" select="@value"/>
            </xsl:call-template>
            <xsl:text> </xsl:text>
         </xsl:when>
         <xsl:otherwise>
            <xsl:call-template name="formatDateTime">
               <xsl:with-param name="date" select="$datetime/@value"/>
            </xsl:call-template>
            <xsl:text> </xsl:text>
         </xsl:otherwise>
      </xsl:choose>
   </xsl:template>
   <!-- paticipant facility and date -->
   <xsl:template name="facilityAndDates">
      <table class="header_table">
         <tbody>
            <!-- facility id -->
            <tr>
               <td width="20%" bgcolor="#3399ff">
                  <span class="td_label">
                     <xsl:text>Facility ID</xsl:text>
                  </span>
               </td>
               <td colspan="3">
                  <xsl:choose>
                     <xsl:when test="count(/n1:ClinicalDocument/n1:participant
                                      [@typeCode='LOC'][@contextControlCode='OP']
                                      /n1:associatedEntity[@classCode='SDLOC']/n1:id)&gt;0">
                        <!-- change context node -->
                        <xsl:for-each select="/n1:ClinicalDocument/n1:participant
                                      [@typeCode='LOC'][@contextControlCode='OP']
                                      /n1:associatedEntity[@classCode='SDLOC']/n1:id">
                           <xsl:call-template name="show-id"/>
                           <!-- change context node again, for the code -->
                           <xsl:for-each select="../n1:code">
                              <xsl:text> (</xsl:text>
                              <xsl:call-template name="show-code">
                                 <xsl:with-param name="code" select="."/>
                              </xsl:call-template>
                              <xsl:text>)</xsl:text>
                           </xsl:for-each>
                        </xsl:for-each>
                     </xsl:when>
                     <xsl:otherwise>
                 Not available
                             </xsl:otherwise>
                  </xsl:choose>
               </td>
            </tr>
            <!-- Period reported -->
            <tr>
               <td width="20%" bgcolor="#3399ff">
                  <span class="td_label">
                     <xsl:text>First day of period reported</xsl:text>
                  </span>
               </td>
               <td colspan="3">
                  <xsl:call-template name="show-time">
                     <xsl:with-param name="datetime" select="/n1:ClinicalDocument/n1:documentationOf
                                      /n1:serviceEvent/n1:effectiveTime/n1:low"/>
                  </xsl:call-template>
               </td>
            </tr>
            <tr>
               <td width="20%" bgcolor="#3399ff">
                  <span class="td_label">
                     <xsl:text>Last day of period reported</xsl:text>
                  </span>
               </td>
               <td colspan="3">
                  <xsl:call-template name="show-time">
                     <xsl:with-param name="datetime" select="/n1:ClinicalDocument/n1:documentationOf
                                      /n1:serviceEvent/n1:effectiveTime/n1:high"/>
                  </xsl:call-template>
               </td>
            </tr>
         </tbody>
      </table>
   </xsl:template>
   <!-- show assignedEntity -->
   <xsl:template name="show-assignedEntity">
      <xsl:param name="asgnEntity"/>
      <xsl:choose>
         <xsl:when test="$asgnEntity/n1:assignedPerson/n1:name">
            <xsl:call-template name="show-name">
               <xsl:with-param name="name" select="$asgnEntity/n1:assignedPerson/n1:name"/>
            </xsl:call-template>
            <xsl:if test="$asgnEntity/n1:representedOrganization/n1:name">
               <xsl:text> of </xsl:text>
               <xsl:value-of select="$asgnEntity/n1:representedOrganization/n1:name"/>
            </xsl:if>
         </xsl:when>
         <xsl:when test="$asgnEntity/n1:representedOrganization">
            <xsl:value-of select="$asgnEntity/n1:representedOrganization/n1:name"/>
         </xsl:when>
         <xsl:otherwise>
            <xsl:for-each select="$asgnEntity/n1:id">
               <xsl:call-template name="show-id"/>
               <xsl:choose>
                  <xsl:when test="position()!=last()">
                     <xsl:text>, </xsl:text>
                  </xsl:when>
                  <xsl:otherwise>
                     <br/>
                  </xsl:otherwise>
               </xsl:choose>
            </xsl:for-each>
         </xsl:otherwise>
      </xsl:choose>
   </xsl:template>
   <!-- show relatedEntity -->
   <xsl:template name="show-relatedEntity">
      <xsl:param name="relatedEntity"/>
      <xsl:choose>
         <xsl:when test="$relatedEntity/n1:relatedPerson/n1:name">
            <xsl:call-template name="show-name">
               <xsl:with-param name="name" select="$relatedEntity/n1:relatedPerson/n1:name"/>
            </xsl:call-template>
         </xsl:when>
      </xsl:choose>
   </xsl:template>
   <!-- show associatedEntity -->
   <xsl:template name="show-associatedEntity">
      <xsl:param name="assoEntity"/>
      <xsl:choose>
         <xsl:when test="$assoEntity/n1:associatedPerson">
            <xsl:for-each select="$assoEntity/n1:associatedPerson/n1:name">
               <xsl:call-template name="show-name">
                  <xsl:with-param name="name" select="."/>
               </xsl:call-template>
               <xsl:call-template name="showDisplayName">
				   <xsl:with-param name="code" select="$assoEntity/n1:code"/>
               </xsl:call-template>
               <br/>
            </xsl:for-each>
         </xsl:when>
         <xsl:when test="$assoEntity/n1:scopingOrganization">
            <xsl:for-each select="$assoEntity/n1:scopingOrganization">
               <xsl:if test="n1:name">
                  <xsl:call-template name="show-name">
                     <xsl:with-param name="name" select="n1:name"/>
                  </xsl:call-template>
                  <br/>
               </xsl:if>
               <xsl:if test="n1:standardIndustryClassCode">
                  <xsl:value-of select="n1:standardIndustryClassCode/@displayName"/>
                  <xsl:text> code:</xsl:text>
                  <xsl:value-of select="n1:standardIndustryClassCode/@code"/>
               </xsl:if>
            </xsl:for-each>
         </xsl:when>
         <xsl:when test="$assoEntity/n1:code">
            <xsl:call-template name="show-code">
               <xsl:with-param name="code" select="$assoEntity/n1:code"/>
            </xsl:call-template>
         </xsl:when>
         <xsl:when test="$assoEntity/n1:id">
            <xsl:value-of select="$assoEntity/n1:id/@extension"/>
            <xsl:text> </xsl:text>
            <xsl:value-of select="$assoEntity/n1:id/@root"/>
         </xsl:when>
      </xsl:choose>
   </xsl:template>
   <!-- show code 
    if originalText present, return it, otherwise, check and return attribute: display name
    -->
   <xsl:template name="show-code">
      <xsl:param name="code"/>
      <xsl:variable name="this-codeSystem">
         <xsl:value-of select="$code/@codeSystem"/>
      </xsl:variable>
      <xsl:variable name="this-code">
         <xsl:value-of select="$code/@code"/>
      </xsl:variable>
      <xsl:choose>
         <xsl:when test="$code/n1:originalText">
            <xsl:value-of select="$code/n1:originalText"/>
         </xsl:when>
         <xsl:when test="$code/@displayName">
            <xsl:value-of select="$code/@displayName"/>
         </xsl:when>
         <!--
      <xsl:when test="$the-valuesets/*/voc:system[@root=$this-codeSystem]/voc:code[@value=$this-code]/@displayName">
        <xsl:value-of select="$the-valuesets/*/voc:system[@root=$this-codeSystem]/voc:code[@value=$this-code]/@displayName"/>
      </xsl:when>
      -->
         <xsl:otherwise>
            <xsl:value-of select="$this-code"/>
         </xsl:otherwise>
      </xsl:choose>
   </xsl:template>
   <!-- show classCode -->
   <xsl:template name="show-actClassCode">
      <xsl:param name="clsCode"/>
      <xsl:choose>
         <xsl:when test=" $clsCode = 'ACT' ">
            <xsl:text>healthcare service</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'ACCM' ">
            <xsl:text>accommodation</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'ACCT' ">
            <xsl:text>account</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'ACSN' ">
            <xsl:text>accession</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'ADJUD' ">
            <xsl:text>financial adjudication</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'CONS' ">
            <xsl:text>consent</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'CONTREG' ">
            <xsl:text>container registration</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'CTTEVENT' ">
            <xsl:text>clinical trial timepoint event</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'DISPACT' ">
            <xsl:text>disciplinary action</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'ENC' ">
            <xsl:text>encounter</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'INC' ">
            <xsl:text>incident</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'INFRM' ">
            <xsl:text>inform</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'INVE' ">
            <xsl:text>invoice element</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'LIST' ">
            <xsl:text>working list</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'MPROT' ">
            <xsl:text>monitoring program</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'PCPR' ">
            <xsl:text>care provision</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'PROC' ">
            <xsl:text>procedure</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'REG' ">
            <xsl:text>registration</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'REV' ">
            <xsl:text>review</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'SBADM' ">
            <xsl:text>substance administration</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'SPCTRT' ">
            <xsl:text>speciment treatment</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'SUBST' ">
            <xsl:text>substitution</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'TRNS' ">
            <xsl:text>transportation</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'VERIF' ">
            <xsl:text>verification</xsl:text>
         </xsl:when>
         <xsl:when test=" $clsCode = 'XACT' ">
            <xsl:text>financial transaction</xsl:text>
         </xsl:when>
      </xsl:choose>
   </xsl:template>
   <!-- show participationType -->
   <xsl:template name="show-participationType">
      <xsl:param name="ptype"/>
      <xsl:choose>
         <xsl:when test=" $ptype='PPRF' ">
            <xsl:text>primary performer</xsl:text>
         </xsl:when>
         <xsl:when test=" $ptype='PRF' ">
            <xsl:text>performer</xsl:text>
         </xsl:when>
         <xsl:when test=" $ptype='VRF' ">
            <xsl:text>verifier</xsl:text>
         </xsl:when>
         <xsl:when test=" $ptype='SPRF' ">
            <xsl:text>secondary performer</xsl:text>
         </xsl:when>
      </xsl:choose>
   </xsl:template>
   <!-- show participationFunction -->
   <xsl:template name="show-participationFunction">
      <xsl:param name="pFunction"/>
      <xsl:choose>
         <!-- From the HL7 v3 ParticipationFunction code system -->
         <xsl:when test=" $pFunction = 'ADMPHYS' ">
            <xsl:text>(admitting physician)</xsl:text>
         </xsl:when>
         <xsl:when test=" $pFunction = 'ANEST' ">
            <xsl:text>(anesthesist)</xsl:text>
         </xsl:when>
         <xsl:when test=" $pFunction = 'ANRS' ">
            <xsl:text>(anesthesia nurse)</xsl:text>
         </xsl:when>
         <xsl:when test=" $pFunction = 'ATTPHYS' ">
            <xsl:text>(attending physician)</xsl:text>
         </xsl:when>
         <xsl:when test=" $pFunction = 'DISPHYS' ">
            <xsl:text>(discharging physician)</xsl:text>
         </xsl:when>
         <xsl:when test=" $pFunction = 'FASST' ">
            <xsl:text>(first assistant surgeon)</xsl:text>
         </xsl:when>
         <xsl:when test=" $pFunction = 'MDWF' ">
            <xsl:text>(midwife)</xsl:text>
         </xsl:when>
         <xsl:when test=" $pFunction = 'NASST' ">
            <xsl:text>(nurse assistant)</xsl:text>
         </xsl:when>
         <xsl:when test=" $pFunction = 'PCP' ">
            <xsl:text>(primary care physician)</xsl:text>
         </xsl:when>
         <xsl:when test=" $pFunction = 'PRISURG' ">
            <xsl:text>(primary surgeon)</xsl:text>
         </xsl:when>
         <xsl:when test=" $pFunction = 'RNDPHYS' ">
            <xsl:text>(rounding physician)</xsl:text>
         </xsl:when>
         <xsl:when test=" $pFunction = 'SASST' ">
            <xsl:text>(second assistant surgeon)</xsl:text>
         </xsl:when>
         <xsl:when test=" $pFunction = 'SNRS' ">
            <xsl:text>(scrub nurse)</xsl:text>
         </xsl:when>
         <xsl:when test=" $pFunction = 'TASST' ">
            <xsl:text>(third assistant)</xsl:text>
         </xsl:when>
         <!-- From the HL7 v2 Provider Role code system (2.16.840.1.113883.12.443) which is used by HITSP -->
         <xsl:when test=" $pFunction = 'CP' ">
            <xsl:text>(consulting provider)</xsl:text>
         </xsl:when>
         <xsl:when test=" $pFunction = 'PP' ">
            <xsl:text>(primary care provider)</xsl:text>
         </xsl:when>
         <xsl:when test=" $pFunction = 'RP' ">
            <xsl:text>(referring provider)</xsl:text>
         </xsl:when>
         <xsl:when test=" $pFunction = 'MP' ">
            <xsl:text>(medical home provider)</xsl:text>
         </xsl:when>
      </xsl:choose>
   </xsl:template>
   <xsl:template name="formatDateTime">
      <xsl:param name="date"/>
      <!-- month -->
      <xsl:variable name="month" select="substring ($date, 5, 2)"/>
      <xsl:choose>
         <xsl:when test="$month='01'">
            <xsl:text>January </xsl:text>
         </xsl:when>
         <xsl:when test="$month='02'">
            <xsl:text>February </xsl:text>
         </xsl:when>
         <xsl:when test="$month='03'">
            <xsl:text>March </xsl:text>
         </xsl:when>
         <xsl:when test="$month='04'">
            <xsl:text>April </xsl:text>
         </xsl:when>
         <xsl:when test="$month='05'">
            <xsl:text>May </xsl:text>
         </xsl:when>
         <xsl:when test="$month='06'">
            <xsl:text>June </xsl:text>
         </xsl:when>
         <xsl:when test="$month='07'">
            <xsl:text>July </xsl:text>
         </xsl:when>
         <xsl:when test="$month='08'">
            <xsl:text>August </xsl:text>
         </xsl:when>
         <xsl:when test="$month='09'">
            <xsl:text>September </xsl:text>
         </xsl:when>
         <xsl:when test="$month='10'">
            <xsl:text>October </xsl:text>
         </xsl:when>
         <xsl:when test="$month='11'">
            <xsl:text>November </xsl:text>
         </xsl:when>
         <xsl:when test="$month='12'">
            <xsl:text>December </xsl:text>
         </xsl:when>
      </xsl:choose>
      <!-- day -->
      <xsl:choose>
         <xsl:when test='substring ($date, 7, 1)="0"'>
            <xsl:value-of select="substring ($date, 8, 1)"/>
            <xsl:text>, </xsl:text>
         </xsl:when>
         <xsl:otherwise>
            <xsl:value-of select="substring ($date, 7, 2)"/>
            <xsl:text>, </xsl:text>
         </xsl:otherwise>
      </xsl:choose>
      <!-- year -->
      <xsl:value-of select="substring ($date, 1, 4)"/>
      <!-- time and US timezone -->
      <xsl:if test="string-length($date) > 8">
         <xsl:text>, </xsl:text>
         <!-- time -->
         <xsl:variable name="time">
            <xsl:value-of select="substring($date,9,6)"/>
         </xsl:variable>
         <xsl:variable name="hh">
            <xsl:value-of select="substring($time,1,2)"/>
         </xsl:variable>
         <xsl:variable name="mm">
            <xsl:value-of select="substring($time,3,2)"/>
         </xsl:variable>
         <xsl:variable name="ss">
            <xsl:value-of select="substring($time,5,2)"/>
         </xsl:variable>
         <xsl:if test="string-length($hh)&gt;1">
            <xsl:value-of select="$hh"/>
            <xsl:if test="string-length($mm)&gt;1 and not(contains($mm,'-')) and not (contains($mm,'+'))">
               <xsl:text>:</xsl:text>
               <xsl:value-of select="$mm"/>
               <xsl:if test="string-length($ss)&gt;1 and not(contains($ss,'-')) and not (contains($ss,'+'))">
                  <xsl:text>:</xsl:text>
                  <xsl:value-of select="$ss"/>
               </xsl:if>
            </xsl:if>
         </xsl:if>
         <!-- time zone -->
         <xsl:variable name="tzon">
            <xsl:choose>
               <xsl:when test="contains($date,'+')">
                  <xsl:text>+</xsl:text>
                  <xsl:value-of select="substring-after($date, '+')"/>
               </xsl:when>
               <xsl:when test="contains($date,'-')">
                  <xsl:text>-</xsl:text>
                  <xsl:value-of select="substring-after($date, '-')"/>
               </xsl:when>
            </xsl:choose>
         </xsl:variable>
         <xsl:choose>
            <!-- reference: http://www.timeanddate.com/library/abbreviations/timezones/na/ -->
            <xsl:when test="$tzon = '-0500' ">
               <xsl:text>, EST</xsl:text>
            </xsl:when>
            <xsl:when test="$tzon = '-0600' ">
               <xsl:text>, CST</xsl:text>
            </xsl:when>
            <xsl:when test="$tzon = '-0700' ">
               <xsl:text>, MST</xsl:text>
            </xsl:when>
            <xsl:when test="$tzon = '-0800' ">
               <xsl:text>, PST</xsl:text>
            </xsl:when>
            <xsl:otherwise>
               <xsl:text> </xsl:text>
               <xsl:value-of select="$tzon"/>
            </xsl:otherwise>
         </xsl:choose>
      </xsl:if>
   </xsl:template>
   <!-- convert to lower case -->
   <xsl:template name="caseDown">
      <xsl:param name="data"/>
      <xsl:if test="$data">
         <xsl:value-of select="translate($data, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')"/>
      </xsl:if>
   </xsl:template>
   <!-- convert to upper case -->
   <xsl:template name="caseUp">
      <xsl:param name="data"/>
      <xsl:if test="$data">
         <xsl:value-of select="translate($data,'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')"/>
      </xsl:if>
   </xsl:template>
   <!-- convert first character to upper case -->
   <xsl:template name="firstCharCaseUp">
      <xsl:param name="data"/>
      <xsl:if test="$data">
         <xsl:call-template name="caseUp">
            <xsl:with-param name="data" select="substring($data,1,1)"/>
         </xsl:call-template>
         <xsl:value-of select="substring($data,2)"/>
      </xsl:if>
   </xsl:template>
   <!-- show-noneFlavor -->
   <xsl:template name="show-noneFlavor">
      <xsl:param name="nf"/>
      <xsl:choose>
         <xsl:when test=" $nf = 'NI' ">
            <xsl:text>no information</xsl:text>
         </xsl:when>
         <xsl:when test=" $nf = 'INV' ">
            <xsl:text>invalid</xsl:text>
         </xsl:when>
         <xsl:when test=" $nf = 'MSK' ">
            <xsl:text>masked</xsl:text>
         </xsl:when>
         <xsl:when test=" $nf = 'NA' ">
            <xsl:text>not applicable</xsl:text>
         </xsl:when>
         <xsl:when test=" $nf = 'UNK' ">
            <xsl:text>unknown</xsl:text>
         </xsl:when>
         <xsl:when test=" $nf = 'OTH' ">
            <xsl:text>other</xsl:text>
         </xsl:when>
      </xsl:choose>
   </xsl:template>
   <!--Language translation-->
   <xsl:template name="show-language">
	   <xsl:param name="langCode" />
	   <xsl:choose>
			<xsl:when test="$langCode/@code = 'eng'">
				<xsl:text>Engllish</xsl:text>
			</xsl:when>
			<xsl:when test="$langCode/@code = 'spa'">
				<xsl:text>Spanish</xsl:text>
			</xsl:when>
			<xsl:when test="$langCode/@code = 'ita'">
				<xsl:text>Italian</xsl:text>
			</xsl:when>
			<xsl:when test="$langCode/@code = 'gem'">
				<xsl:text>German</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text></xsl:text>
			</xsl:otherwise>												
		</xsl:choose>
   </xsl:template>
  <xsl:template name="pref-language">
	   <xsl:param name="langCode" />
	   <xsl:param name="prefLang" />
	   
	   <xsl:choose>
			<xsl:when test="$prefLang/@value='true'">
			   <xsl:choose>
					<xsl:when test="$langCode/@code = 'eng'">
						<xsl:text>Engllish</xsl:text>
					</xsl:when>
					<xsl:when test="$langCode/@code = 'spa'">
						<xsl:text>Spanish</xsl:text>
					</xsl:when>
					<xsl:when test="$langCode/@code = 'ita'">
						<xsl:text>Italian</xsl:text>
					</xsl:when>
					<xsl:when test="$langCode/@code = 'gem'">
						<xsl:text>German</xsl:text>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text></xsl:text>
					</xsl:otherwise>												
				</xsl:choose>			
			</xsl:when>
			<xsl:otherwise>
				<xsl:text></xsl:text>
			</xsl:otherwise>
		</xsl:choose>
   </xsl:template>      
</xsl:stylesheet>
