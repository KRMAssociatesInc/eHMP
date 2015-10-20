<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:n3="http://www.w3.org/1999/xhtml"
	xmlns:n1="urn:hl7-org:v3"
	xmlns:n2="urn:hl7-org:v3/meta/voc"
	xmlns:voc="urn:hl7-org:v3/voc"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:section="urn:gov.va.med"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt">

	<xsl:import href="cda2detailCommon.xslt"/>
	<xsl:import href="detailCommon.xsl"/>
	<xsl:import href="../common.xsl"/>
	<xsl:output method="text"/>

	<xsl:template name="displaySource">
		<xsl:call-template name="documentTitle">
			<xsl:with-param name="root" select="."/>
		</xsl:call-template>

		<xsl:text>&#13;&#10;</xsl:text>
	</xsl:template>

	<xsl:template name="displayTitle">
		<xsl:value-of select="n1:code/@displayName"/>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>
	</xsl:template>

	<xsl:template name="displayReportDates">
		<xsl:text>Created On: </xsl:text>
		<xsl:call-template name="getCreatedOnDate"/>
		<xsl:if test="n1:documentationOf/n1:serviceEvent/n1:performer/n1:effectiveTime/n1:low/@value">
			<xsl:text>        </xsl:text>
			<xsl:text>Date Range: </xsl:text>

			<xsl:choose>
				<xsl:when test="string-length(n1:documentationOf/n1:serviceEvent/n1:performer/n1:effectiveTime/n1:low/@value)=0">
					<xsl:call-template name="na"/>
				</xsl:when>
				<xsl:when test="starts-with(n1:documentationOf/n1:serviceEvent/n1:performer/n1:effectiveTime/n1:low/@value,' ')">
					<xsl:call-template name="na"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="formatDateLong">
						<xsl:with-param name="dateString" select="n1:documentationOf/n1:serviceEvent/n1:performer/n1:effectiveTime/n1:low/@value"/>
					</xsl:call-template>
				</xsl:otherwise>
			</xsl:choose>

			<xsl:text> - </xsl:text>

			<xsl:choose>
				<xsl:when test="string-length(n1:documentationOf/n1:serviceEvent/n1:performer/n1:effectiveTime/n1:high/@value)=0">
					<xsl:call-template name="na"/>
				</xsl:when>
				<xsl:when test="starts-with(n1:documentationOf/n1:serviceEvent/n1:performer/n1:effectiveTime/n1:high/@value,' ')">
					<xsl:call-template name="na"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="formatDateLong">
						<xsl:with-param name="dateString" select="n1:documentationOf/n1:serviceEvent/n1:performer/n1:effectiveTime/n1:high/@value"/>
					</xsl:call-template>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

	<xsl:template name="displayPatientBlock">
		<xsl:variable name="patientRole" select="n1:recordTarget/n1:patientRole"/>

		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>Patient: </xsl:text>
		<xsl:call-template name="getName">
			<xsl:with-param name="name" select="$patientRole/n1:patient/n1:name"/>
		</xsl:call-template>
		<xsl:if test="$patientRole/n1:addr">
			<xsl:call-template name="getAddress">
				<xsl:with-param name="addr" select="$patientRole/n1:addr"/>
			</xsl:call-template>
		</xsl:if>
		<xsl:choose>
			<xsl:when test="$patientRole/n1:telecom/@value">
				<xsl:for-each select="$patientRole/n1:telecom">
					<xsl:call-template name="getTelecom">
						<xsl:with-param name="telecom" select="."/>
					</xsl:call-template>
				</xsl:for-each>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>tel: PATIENT PHONE MISSING</xsl:text>
				<xsl:text>&#13;&#10;</xsl:text>
			</xsl:otherwise>
		</xsl:choose>

		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>Patient ID: </xsl:text>
		<xsl:if test="string-length($patientRole/n1:id/@extension)>0">
			<xsl:value-of select="$patientRole/n1:id/@extension"/>
		</xsl:if>

		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>Birthdate: </xsl:text>
		<xsl:call-template name="formatDateLong">
			<xsl:with-param name="dateString" select="n1:recordTarget/n1:patientRole/n1:patient/n1:birthTime/@value"/>
		</xsl:call-template>

		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>Sex: </xsl:text>
		<xsl:call-template name="getGenderString"/>

		<xsl:variable name="hasLanguages">
			<xsl:call-template name="isLanguageFound">
				<xsl:with-param name="patientRole" select="$patientRole"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:if test="$hasLanguages">
			<xsl:text>&#13;&#10;</xsl:text>
			<xsl:text>Language(s): </xsl:text>
			<xsl:text>&#13;&#10;</xsl:text>
			<xsl:call-template name="displayLanguages">
				<xsl:with-param name="patientRole" select="$patientRole"/>
			</xsl:call-template>
		</xsl:if>

		<xsl:text>&#13;&#10;</xsl:text>
	</xsl:template>

	<xsl:template match="n1:languageCode">
		<xsl:variable name="lang">
			<xsl:apply-templates select="." mode="data"/>
		</xsl:variable>
		<xsl:if test="string-length(normalize-space($lang))>0">
			<xsl:text>  </xsl:text>
			<xsl:value-of select="$lang"/>
			<xsl:text>&#13;&#10;</xsl:text>
		</xsl:if>
	</xsl:template>

	<xsl:template name="displayAuthorBlock">
		<xsl:if test="n1:author">
			<xsl:text>Source: </xsl:text>
			<xsl:value-of select="n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name/text()"/>
			<xsl:text>&#13;&#10;</xsl:text>
			<xsl:if test="n1:author/n1:assignedAuthor/n1:assignedPerson">
				<xsl:text>Author: </xsl:text>
				<xsl:choose>
					<xsl:when test="n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name/n1:family and n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name/n1:given">
						<xsl:value-of select="n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name/n1:family"/>
						<xsl:text>, </xsl:text>
						<xsl:value-of select="n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name/n1:given"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name"/>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:text>&#13;&#10;</xsl:text>
			</xsl:if>
		</xsl:if>

		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>
	</xsl:template>

	<xsl:template name="displayTableOfContents">
		<xsl:text>Table of Contents</xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>=================</xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:for-each select="n1:component/n1:structuredBody/n1:component/n1:section/n1:title">
			<xsl:sort/>
			<xsl:variable name="compFound">
				<xsl:call-template name="componentFound">
					<xsl:with-param name="compSection" select="../."/>
				</xsl:call-template>
			</xsl:variable>
			<xsl:choose>
				<xsl:when test="string-length($compFound)>0">
					<xsl:text>    </xsl:text>
					<xsl:value-of select="."/>
					<xsl:text>&#13;&#10;</xsl:text>
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
		<xsl:text>&#13;&#10;</xsl:text>
	</xsl:template>

	<xsl:template name="displayContents">
		<xsl:apply-templates select="n1:component/n1:structuredBody/n1:component">
			<xsl:sort select="n1:section/n1:title"/>
		</xsl:apply-templates>

		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>
	</xsl:template>

	<xsl:template name="displayContactInfoBlock">
		<xsl:choose>
			<xsl:when test="string-length(n1:participant[@typeCode='IND']/n1:associatedEntity[@classCode='NOK'])>0">
				<xsl:text>Emergency Contact: </xsl:text>
				<xsl:call-template name="getParticipant">
					<xsl:with-param name="participant" select="n1:participant[@typeCode='IND']/n1:associatedEntity[@classCode='NOK']"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>EMERGENCY CONTACT INFO MISSING!</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:text>&#13;&#10;</xsl:text>
	</xsl:template>

	<xsl:template name="getParticipant">
		<xsl:param name="participant"/>
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:call-template name="getName">
			<xsl:with-param name="name" select="$participant/n1:associatedPerson/n1:name"/>
		</xsl:call-template>
		<xsl:if test="$participant/n1:addr">
			<xsl:call-template name="getSingleAddress">
				<xsl:with-param name="addr" select="$participant/n1:addr"/>
			</xsl:call-template>
		</xsl:if>
		<xsl:choose>
			<xsl:when test="$participant/n1:telecom/@value">
				<xsl:for-each select="$participant/n1:telecom">
					<xsl:call-template name="getTelecom">
						<xsl:with-param name="telecom" select="."/>
					</xsl:call-template>
				</xsl:for-each>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>&#9;tel: CONTACT PHONE MISSING</xsl:text>
				<xsl:text>&#13;&#10;</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:if test="$participant/n1:code/n1:originalText">
			<xsl:text>Relationship: </xsl:text>
			<xsl:value-of select="$participant/n1:code/n1:originalText"/>
			<xsl:text>&#13;&#10;</xsl:text>
		</xsl:if>
	</xsl:template>

	<xsl:template name="getSingleAddress">
		<xsl:param name="addr"/>
		<xsl:if test="$addr/n1:streetAddressLine != ' '">
			<xsl:text>&#13;&#10;</xsl:text>
			<xsl:text>    </xsl:text>
			<xsl:if test="string-length($addr/n1:streetAddressLine)>0">
				<xsl:value-of select="$addr/n1:streetAddressLine"/>
			</xsl:if>

			<xsl:text>&#13;&#10;</xsl:text>
			<xsl:text>    </xsl:text>
			<xsl:value-of select="$addr/n1:city"/>
			<xsl:text>, </xsl:text>
			<xsl:value-of select="$addr/n1:state"/>
			<xsl:text>  </xsl:text>
			<xsl:value-of select="$addr/n1:postalCode"/>
			<xsl:text>&#13;&#10;</xsl:text>
		</xsl:if>
	</xsl:template>

	<xsl:template name="getAddress">
		<xsl:param name="addr"/>
		<xsl:if test="$addr/n1:streetAddressLine != ' '">
			<xsl:for-each select="$addr/n1:streetAddressLine">
				<xsl:text>&#13;&#10;</xsl:text>
				<xsl:text>    </xsl:text>
				<xsl:if test="string-length($addr/n1:streetAddressLine)>0">
					<xsl:value-of select="."/>
				</xsl:if>
			</xsl:for-each>
			<xsl:text>&#13;&#10;</xsl:text>
			<xsl:text>    </xsl:text>
			<xsl:value-of select="$addr/n1:city"/>
			<xsl:text>,  </xsl:text>
			<xsl:value-of select="$addr/n1:state"/>
			<xsl:text>  </xsl:text>
			<xsl:value-of select="$addr/n1:postalCode"/>
			<xsl:text>&#13;&#10;</xsl:text>
		</xsl:if>
	</xsl:template>

	<xsl:template name="getTelecom">
		<xsl:param name="telecom"/>
		<xsl:if test="string-length($telecom/@value)>0">
			<xsl:text>    </xsl:text>
			<xsl:value-of select="$telecom/@value"/>
			<xsl:choose>
				<xsl:when test="./@use='HP' ">
					<xsl:text> Home</xsl:text>
				</xsl:when>
				<xsl:when test="./@use='WP' ">
					<xsl:text> Work</xsl:text>
				</xsl:when>
				<xsl:when test="./@use='HV' ">
					<xsl:text> Vacation</xsl:text>
				</xsl:when>
				<xsl:when test="./@use='MC' ">
					<xsl:text> Mobile</xsl:text>
				</xsl:when>
			</xsl:choose>
			<xsl:text>&#13;&#10;</xsl:text>
		</xsl:if>
	</xsl:template>

	<xsl:template name="displayProblemComponentSection">
		<xsl:variable name="probC1">
			<xsl:call-template name="getCommonFormatComments"/>
		</xsl:variable>
		<xsl:if test="string-length($probC1)>1">
			<xsl:text>*Note: </xsl:text>
			<xsl:value-of select="normalize-space($probC1)"/>
			<xsl:text>&#13;&#10;&#9;</xsl:text>
		</xsl:if>
		<xsl:call-template name="problemDetails">
			<xsl:with-param select="." name="section"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayAllergyComponentSection">
		<xsl:variable name="allergyC1">
			<xsl:call-template name="getCommonFormatComments"/>
		</xsl:variable>
		<xsl:if test="string-length($allergyC1)>1">
			<xsl:text>*Note: </xsl:text>
			<xsl:value-of select="normalize-space($allergyC1)"/>
			<xsl:text>&#13;&#10;&#9;</xsl:text>
		</xsl:if>
		<xsl:call-template name="allergyDetails">
			<xsl:with-param select="." name="section"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayMedsComponentSection">
		<xsl:variable name="medC1">
			<xsl:call-template name="getCommonFormatComments"/>
		</xsl:variable>
		<xsl:if test="string-length($medC1)>1">
			<xsl:text>*Note: </xsl:text>
			<xsl:value-of select="normalize-space($medC1)"/>
			<xsl:text>&#13;&#10;&#9;</xsl:text>
		</xsl:if>
		<xsl:call-template name="medDetails">
			<xsl:with-param select="." name="section"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayEncounterComponentSection">
		<xsl:call-template name="encounterDetails">
			<xsl:with-param select="." name="section"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayResultsComponentSection">
		<xsl:variable name="resultsC1">
			<xsl:call-template name="getCommonFormatComments"/>
		</xsl:variable>
		<xsl:if test="string-length($resultsC1)>1">
			<xsl:text>*Note: </xsl:text>
			<xsl:value-of select="normalize-space($resultsC1)"/>
			<xsl:text>&#13;&#10;&#9;</xsl:text>
		</xsl:if>
		<xsl:call-template name="resultsDetails">
			<xsl:with-param select="." name="section"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayProceduresComponentSection">
		<xsl:call-template name="proceduresDetails">
			<xsl:with-param select="." name="section"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayImmunizationsComponentSection">
		<xsl:variable name="immunC1">
			<xsl:call-template name="getCommonFormatComments"/>
		</xsl:variable>
		<xsl:if test="string-length($immunC1)>1">
			<xsl:text>*Note: </xsl:text>
			<xsl:value-of select="normalize-space($immunC1)"/>
			<xsl:text>&#13;&#10;&#9;</xsl:text>
		</xsl:if>
		<xsl:call-template name="immunizationsDetails">
			<xsl:with-param select="." name="section"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayVitalsComponentSection">
		<xsl:call-template name="vitalsDetails">
			<xsl:with-param select="." name="section"/>
		</xsl:call-template>
	</xsl:template>
	
	<!-- Meds Detail Section -->
	<xsl:template name="medDetails">
		<xsl:param name="section"/>
		<xsl:choose>
			<xsl:when test="$section/n1:entry/n1:substanceAdministration/n1:effectiveTime/n1:high">
				<xsl:apply-templates select="$section/n1:entry">
					<xsl:sort select="$section/n1:entry/n1:substanceAdministration/n1:effectiveTime/n1:high/@value"/>
				</xsl:apply-templates>
			</xsl:when>
			<xsl:otherwise>
				<xsl:apply-templates select="$section/n1:entry">
					<xsl:sort select="$section/n1:entry/n1:substanceAdministration/n1:entryRelationship/n1:supply/n1:effectiveTime/@value"/>
				</xsl:apply-templates>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:if test="not(boolean(n1:entry/n1:substanceAdministration))">
			<xsl:call-template name="noData_Clipboard"/>
		</xsl:if>
	</xsl:template>

	<!-- Procedures Detail Section -->
	<xsl:template name="proceduresDetails">
		<xsl:param name="section"/>
		<xsl:apply-templates select="$section/n1:entry">
			<xsl:sort select="n1:procedure/n1:effectiveTime/n1:low/@value" order="descending"/>
		</xsl:apply-templates>
		<xsl:if test="not(boolean($section/n1:entry/n1:procedure))">
			<xsl:call-template name="noData_Clipboard"/>
		</xsl:if>
	</xsl:template>

	<!-- Encounters Detail Section -->
	<xsl:template name="encounterDetails">
		<xsl:param name="section"/>
		<xsl:apply-templates select="$section/n1:entry">
			<xsl:sort select="n1:encounter/n1:effectiveTime/n1:low/@value" order="descending"/>
		</xsl:apply-templates>
		<xsl:if test="not(boolean($section/n1:entry/n1:encounter))">
			<xsl:call-template name="noData_Clipboard"/>
		</xsl:if>
	</xsl:template>

	<!-- Problem Detail Section -->
	<xsl:template name="problemDetails">
		<xsl:param name="section"/>
		<xsl:choose>
			<xsl:when test="$section/n1:entry/n1:act/n1:entryRelationship/n1:observation/n1:effectiveTime/n1:low">
				<xsl:apply-templates select="$section/n1:entry">
					<xsl:sort select="n1:act/n1:entryRelationship/n1:observation/n1:effectiveTime/n1:low/@value" order="descending"/>
				</xsl:apply-templates>
			</xsl:when>
			<xsl:otherwise>
				<xsl:apply-templates select="$section/n1:entry">
					<xsl:sort select="n1:act/n1:effectiveTime/n1:low/@value" order="descending"/>
				</xsl:apply-templates>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:if test="not(boolean($section/n1:entry/n1:act/n1:entryRelationship[@typeCode='SUBJ']/n1:observation))">
			<xsl:call-template name="noData_Clipboard"/>
		</xsl:if>
	</xsl:template>

	<!-- Allergy Detail Section -->
	<xsl:template name="allergyDetails">
		<xsl:param name="section"/>
		<xsl:choose>
			<xsl:when test="n1:act/n1:entryRelationship/n1:observation/n1:participant/n1:participantRole/n1:playingEntity/n1:code/@displayName">
				<xsl:apply-templates select="$section/n1:entry">
					<xsl:sort select="n1:act/n1:entryRelationship/n1:observation/n1:participant/n1:participantRole/n1:playingEntity/n1:code/@displayName"/>
				</xsl:apply-templates>
			</xsl:when>
			<xsl:when test="$section/n1:entry/n1:act/n1:entryRelationship/n1:observation/n1:effectiveTime/n1:low">
				<xsl:apply-templates select="$section/n1:entry">
					<xsl:sort select="n1:act/n1:entryRelationship/n1:observation/n1:effectiveTime/n1:low/@value" order="descending"/>
				</xsl:apply-templates>
			</xsl:when>
			<xsl:otherwise>
				<xsl:apply-templates select="$section/n1:entry">
					<xsl:sort select="n1:act/n1:effectiveTime/n1:low/@value" order="descending"/>
				</xsl:apply-templates>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:if test="not(boolean(n1:entry/n1:act/n1:entryRelationship/n1:observation))">
			<xsl:call-template name="noData_Clipboard"/>
		</xsl:if>
	</xsl:template>

	<!-- Results Detail Section -->
	<xsl:template name="resultsDetails">
		<xsl:param name="section"/>
		<xsl:choose>
			<xsl:when test="$section/n1:entry/n1:organizer/n1:component/n1:observation/n1:effectiveTime/@value">
				<xsl:apply-templates select="$section/n1:entry">
					<xsl:sort select="n1:organizer/n1:component/n1:observation/n1:effectiveTime/@value" order="descending"/>
				</xsl:apply-templates>
			</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
		<xsl:if test="not(boolean(n1:entry/n1:observation)or(n1:entry/n1:organizer))">
			<xsl:call-template name="noData_Clipboard"/>
		</xsl:if>
	</xsl:template>

	<!-- Immunizations Detail Section -->
	<xsl:template name="immunizationsDetails">
		<xsl:param name="section"/>
		<xsl:apply-templates select="$section/n1:entry">
			<xsl:sort select="n1:substanceAdministration/n1:effectiveTime/@value" order="descending"/>
		</xsl:apply-templates>
		<xsl:if test="not(boolean($section/n1:entry/n1:substanceAdministration))">
			<xsl:call-template name="noData_Clipboard"/>
		</xsl:if>
	</xsl:template>

	<!-- Vitals Detail Section -->
	<xsl:template name="vitalsDetails">
		<xsl:param name="section"/>
		<xsl:apply-templates select="$section/n1:entry">
			<xsl:sort select="n1:organizer/n1:component/n1:observation/n1:effectiveTime/@value" order="descending"/>
		</xsl:apply-templates>
		<xsl:if test="not(boolean($section/n1:entry/n1:organizer/n1:component/n1:observation))">
			<xsl:call-template name="noData_Clipboard"/>
		</xsl:if>
	</xsl:template>

	<xsl:template name="medRow">
		<xsl:param name="row"/>

		<!--medication name-->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:variable name="medNameResult">
			<xsl:call-template name="getMedicationName">
				<xsl:with-param name="row" select="$row"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length($medNameResult)>1">
				<xsl:text>Medication: </xsl:text>
				<xsl:value-of select="normalize-space($medNameResult)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>

		<!-- Brand Name -->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:if test="$row/n1:substanceAdministration/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:name">
			<xsl:text>Brand Name: </xsl:text>
			<xsl:value-of select="$row/n1:substanceAdministration/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:name"/>
		</xsl:if>

		<!-- Route -->
		<xsl:if test="$row/n1:substanceAdministration/n1:routeCode/@displayName">
			<xsl:text>&#13;&#10;&#9;</xsl:text>
			<xsl:text>Route: </xsl:text>
			<xsl:value-of select="$row/n1:substanceAdministration/n1:routeCode/@displayName"/>
		</xsl:if>

		<!-- Interval -->
		<xsl:if test="$row/n1:substanceAdministration/n1:effectiveTime/n1:period/@value">
			<xsl:text>&#13;&#10;&#9;</xsl:text>
			<xsl:text>Interval: </xsl:text>
			<xsl:value-of select="$row/n1:substanceAdministration/n1:effectiveTime/n1:period/@value"/>
		</xsl:if>

		<!-- Status -->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Status: </xsl:text>
		<xsl:call-template name="medStatus">
			<xsl:with-param name="substanceAdmin" select="$row/n1:substanceAdministration"/>
		</xsl:call-template>

		<!-- Prescription ID (Nbr) -->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Prescription #: </xsl:text>
		<xsl:variable name="rxNum">
			<xsl:call-template name="getRxNumString">
				<xsl:with-param name="substanceAdmin" select="$row/n1:substanceAdministration"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length($rxNum)>1">
				<xsl:value-of select="$rxNum"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>

		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<!-- dispense time -->
		<xsl:text>Dispense Date: </xsl:text>
		<xsl:call-template name="medBegintime">
			<xsl:with-param name="row" select="$row"/>
		</xsl:call-template>

		<!-- provider -->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Provider: </xsl:text>
		<xsl:variable name="medProvider">
			<xsl:call-template name="getMedProvider">
				<xsl:with-param name="substanceAdmin" select="$row/n1:substanceAdministration"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length($medProvider)>1">
				<xsl:value-of select="$medProvider"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>- No Provider Name Found -</xsl:text>
			</xsl:otherwise>
		</xsl:choose>

		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<!-- Quantity -->
		<xsl:text>Quantity: </xsl:text>
		<xsl:call-template name="medQuantity">
			<xsl:with-param name="substanceAdmin" select="$row/n1:substanceAdministration"/>
		</xsl:call-template>

		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<!-- Order Expiration Date/Time -->
		<xsl:text>Order Expiration: </xsl:text>
		<xsl:call-template name="medExpiretime">
			<xsl:with-param name="substanceAdmin" select="$row/n1:substanceAdministration"/>
		</xsl:call-template>

		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<!-- Sig -->
		<xsl:text>Sig: </xsl:text>
		<xsl:variable name="sig">
			<xsl:call-template name="getSig">
				<xsl:with-param name="substanceAdmin" select="$row/n1:substanceAdministration"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length($sig)>1">
				<xsl:value-of select="$sig"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>


		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<!-- source -->
		<xsl:text>Source: </xsl:text>
		<xsl:variable name="medSource" select="n1:substanceAdministration/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name"/>
		<xsl:choose>
			<xsl:when test="$medSource">
				<xsl:value-of select="$medSource"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:text>&#13;&#10;</xsl:text>

	</xsl:template>

	<!-- problem entry row -->
	<xsl:template name="problemRow">
		<xsl:param name="row"/>
		<xsl:variable name="rowData" select="$row/n1:act/n1:entryRelationship/n1:observation"/>
		<!-- name -->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Problem: </xsl:text>
		<xsl:variable name="probNameResult">
			<xsl:call-template name="probName">
				<xsl:with-param name="probEntry" select="$row"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length($probNameResult)>1">
				<xsl:value-of select="normalize-space($probNameResult)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>

		<!-- problem status -->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Status: </xsl:text>
		<xsl:call-template name="probStatus">
			<xsl:with-param name="row" select="$row"/>
		</xsl:call-template>

		<!-- Problem Code -->
		<xsl:variable name="probcodenull" select="$rowData/n1:code/@nullFlavor"/>
		<xsl:variable name="probcode" select="$rowData/n1:code/@code"/>
		<xsl:choose>
			<xsl:when test="string($probcodenull)='UNK' ">
			</xsl:when>
			<xsl:when test="$probcode">
				<xsl:text>&#13;&#10;&#9;</xsl:text>
				<xsl:text>Problem Code: </xsl:text>
				<xsl:value-of select="$probcode"/>
			</xsl:when>
		</xsl:choose>

		<!-- problem effective date -->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Date: </xsl:text>
		<xsl:call-template name="probDate">
			<xsl:with-param name="row" select="$row"/>
		</xsl:call-template>

		<!-- provider -->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Provider: </xsl:text>
		<xsl:variable name="provider">
			<xsl:call-template name="getProblemProvider">
				<xsl:with-param name="act" select="$row/n1:act"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length($provider)>1">
				<xsl:value-of select="$provider"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>

		<!-- source -->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Source: </xsl:text>
		<xsl:choose>
			<xsl:when test="$row/n1:act/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name">
				<xsl:value-of select="$row/n1:act/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:text>&#13;&#10;</xsl:text>
	</xsl:template>

	<!-- allergy entry row -->
	<xsl:template name="allergyRow">
		<xsl:param name="row"/>
		<xsl:variable name="observation" select="$row/n1:act/n1:entryRelationship/n1:observation"/>

		<!-- Substance -->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Allergy: </xsl:text>
		<xsl:call-template name="getAllergen">
			<xsl:with-param name="observation" select="$observation"/>
		</xsl:call-template>

		<!-- Event Type-->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Type: </xsl:text>
		<xsl:call-template name="allergyType">
			<xsl:with-param name="observation" select="$observation"/>
		</xsl:call-template>

		<!-- Reaction -->
		<xsl:variable name="reaction">
			<xsl:call-template name="getReactionValue">
				<xsl:with-param name="entryRelationship" select="$row/n1:act/n1:entryRelationship"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:if test="string-length($reaction)>1">
			<xsl:text>&#13;&#10;&#9;</xsl:text>
			<xsl:text>Reaction: </xsl:text>
			<xsl:value-of select="normalize-space($reaction)"/>
		</xsl:if>

		<!-- Severity -->
		<xsl:variable name="severity">
			<xsl:call-template name="getSeverityText">
				<xsl:with-param name="observation" select="$observation"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:if test="string-length($severity)>1">
			<xsl:text>&#13;&#10;&#9;</xsl:text>
			<xsl:text>Severity: </xsl:text>
			<xsl:value-of select="$severity"/>
		</xsl:if>

		<!-- Verification Date-->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Date: </xsl:text>
		<xsl:call-template name="displayAllergyVerificationDate">
			<xsl:with-param name="observation" select="$observation"/>
		</xsl:call-template>

		<!-- source -->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Source: </xsl:text>
		<xsl:variable name="allergySource">
			<xsl:call-template name="getAllergySource">
				<xsl:with-param name="row" select="$row"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length($allergySource)>0">
				<xsl:value-of select="$allergySource"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:text>&#13;&#10;</xsl:text>

	</xsl:template>

	<!-- Labs entry row -->
	<xsl:template name="labsRow">
		<xsl:param name="row"/>
		<xsl:variable name="rowData" select="n1:component/n1:observation"/>
		<xsl:variable name="observation" select="$row/n1:organizer/n1:component/n1:observation"/>
		<xsl:variable name="observation1" select="$row/n1:observation"/>
		<xsl:choose>
			<xsl:when  test="string-length($row/n1:organizer)!=0">
				<!-- Panel -->
				<xsl:text>&#13;&#10;&#9;</xsl:text>
				<xsl:text>Panel: </xsl:text>
				<xsl:variable name="organizerName">
					<xsl:call-template name="getOrganizerName">
						<xsl:with-param name="row" select="$row"/>
					</xsl:call-template>
				</xsl:variable>
				<xsl:choose>
					<xsl:when test="string-length($organizerName)>0">
						<xsl:value-of select="$organizerName"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text>&#9;..Not Available..</xsl:text>
					</xsl:otherwise>
				</xsl:choose>

				<!-- Panel Date -->
				<xsl:text>&#13;&#10;&#9;</xsl:text>
				<xsl:text>Panel Date: </xsl:text>
				<xsl:call-template name="getPanelDT">
					<xsl:with-param name="organizer" select="$row/n1:organizer"/>
				</xsl:call-template>

				<!-- Source -->
				<xsl:text>&#13;&#10;&#9;</xsl:text>
				<xsl:text>Source: </xsl:text>
				<xsl:choose>
					<xsl:when test="$row/n1:organizer/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name">
						<xsl:value-of select="$row/n1:organizer/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name"/>
					</xsl:when>
					<xsl:when test="$row/n1:organizer/n1:performer/n1:assignedEntity/n1:representedOrganization/n1:name">
						<xsl:value-of select="$row/n1:organizer/n1:performer/n1:assignedEntity/n1:representedOrganization/n1:name"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text>&#9;..Not Available..</xsl:text>
					</xsl:otherwise>
				</xsl:choose>

				<!-- Status -->
				<xsl:text>&#13;&#10;&#9;</xsl:text>
				<xsl:text>Status: </xsl:text>
				<xsl:choose>
					<xsl:when test="string-length($row/n1:organizer/n1:statusCode/@code)>0">
						<xsl:call-template name="flyoverSpan">
							<xsl:with-param name="data" select="$row/n1:organizer/n1:statusCode/@code"/>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text>&#9;..Not Available..</xsl:text>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:text>&#13;&#10;&#9;</xsl:text>

				<xsl:for-each select="$row/n1:organizer/n1:component/n1:observation">

					<!-- Result Date/Time -->
					<xsl:text>&#13;&#10;&#9;</xsl:text>
					<xsl:text>&#9;Test Date:</xsl:text>
					<xsl:call-template name="getResultDT">
						<xsl:with-param name="observation" select="$row/n1:organizer/n1:component/n1:observation"/>
					</xsl:call-template>

					<!-- Result Date/Time -->
					<xsl:text>&#13;&#10;&#9;</xsl:text>
					<xsl:text>&#9;Test Name:</xsl:text>
					<xsl:variable name="typeResult2">
						<xsl:call-template name="getResultType2">
							<xsl:with-param name="observation" select="."/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($typeResult2)>0">
							<xsl:value-of select="$typeResult2"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:variable name="typeResult3">
								<xsl:call-template name="getResultType">
									<xsl:with-param name="observation" select="."/>
								</xsl:call-template>
							</xsl:variable>
							<xsl:choose>
								<xsl:when test="string-length($typeResult3)>0">
									<xsl:value-of select="$typeResult3"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:text>&#9;..Not Available..</xsl:text>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:otherwise>
					</xsl:choose>

					<!-- Result Value -->

					<xsl:text>&#13;&#10;&#9;</xsl:text>
					<xsl:text>&#9;Result: </xsl:text>
					<xsl:variable name="valueResult2">
						<xsl:call-template name="getResultValue">
							<xsl:with-param name="observation" select="."/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($valueResult2)>0">
							<xsl:value-of select="$valueResult2"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:text>&#9;..Not Available..</xsl:text>
						</xsl:otherwise>
					</xsl:choose>

					<!-- Result Units -->
					<xsl:text>&#13;&#10;&#9;</xsl:text>
					<xsl:text>&#9;Unit(s): </xsl:text>
					<xsl:variable name="units">
						<xsl:call-template name="getResultUnit">
							<xsl:with-param name="observation" select="n1:observation"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($units)>0">
							<xsl:value-of select="$units"/>
						</xsl:when>
						<xsl:when test="$isKaiser">
							<xsl:text></xsl:text>
						</xsl:when>						
						<xsl:otherwise>
							<xsl:text>&#9;..Not Available..</xsl:text>
						</xsl:otherwise>
					</xsl:choose>

					<!-- interpretation -->
					<xsl:text>&#13;&#10;&#9;</xsl:text>
					<xsl:text>&#9;Interpretation: </xsl:text>
					<xsl:variable name="interpResult1">
						<xsl:call-template name="getInterpretation2">
							<xsl:with-param name="observation" select="."/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($interpResult1)>0">
							<xsl:value-of select="$interpResult1"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:variable name="interpResult2">
								<xsl:call-template name="getInterpretation">
									<xsl:with-param name="observation" select="."/>
								</xsl:call-template>
							</xsl:variable>
							<xsl:choose>
								<xsl:when test="string-length($interpResult2)>0">
									<xsl:value-of select="$interpResult2"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:text>&#9;..Not Available..</xsl:text>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:otherwise>
					</xsl:choose>


					<!-- ref range -->
					<xsl:text>&#13;&#10;&#9;</xsl:text>
					<xsl:text>&#9;Reference Range: </xsl:text>
					<xsl:variable name="ref">
						<xsl:call-template name="getRefRange">
							<xsl:with-param name="observation" select="."/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($ref)>0">
							<xsl:value-of select="$ref"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:text>..Not Available..</xsl:text>
						</xsl:otherwise>
					</xsl:choose>
					<xsl:text>&#13;&#10;&#9;</xsl:text>
					<xsl:text>&#13;&#10;&#9;</xsl:text>
				</xsl:for-each>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

	<!-- Encounters entry row -->
	<xsl:template name="encRow">
		<xsl:param name="row"/>

		<!-- Encounter Date/Time-->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Date: </xsl:text>
		<xsl:choose>
			<xsl:when test="$row/n1:encounter/n1:effectiveTime/n1:low/@value">
				<xsl:call-template name="formatDateShort">
					<xsl:with-param name="dateString" select="$row/n1:encounter/n1:effectiveTime/n1:low/@value"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$row/n1:encounter/n1:effectiveTime/@value">
				<xsl:call-template name="formatDateShort">
					<xsl:with-param name="dateString" select="$row/n1:encounter/n1:effectiveTime/@value"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>

		<!-- Encounter Type  -->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Type: </xsl:text>
		<xsl:choose>
			<xsl:when test="$row/n1:encounter">
				<xsl:call-template name="getEncounterType">
					<xsl:with-param name="encounter" select="$row/n1:encounter"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>


		<!-- Encounter Free Text Type-->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Free Text: </xsl:text>
		<xsl:variable name="encFreeText">
			<xsl:call-template name="getEncounterFreeText">
				<xsl:with-param name="encounter" select="$row/n1:encounter"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length($encFreeText)>1">
				<xsl:call-template name="replaceSquigglesWithLinefeeds">
					<xsl:with-param name="text" select="$encFreeText"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>


		<!-- Encounter Provider-->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Provider: </xsl:text>
		<xsl:variable name="encProvider">
			<xsl:call-template name="getEncounterProvider">
				<xsl:with-param name="encounter" select="$row/n1:encounter"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length($encProvider)>1">
				<xsl:value-of select="normalize-space($encProvider)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:text>&#13;&#10;&#9;</xsl:text>
	</xsl:template>

	<!-- Procedures entry row -->
	<xsl:template name="procedureRow">
		<xsl:param name="row"/>

		<!-- Procedure Date/Time-->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Date: </xsl:text>
		<xsl:choose>
			<xsl:when test="$row/n1:procedure/n1:effectiveTime/n1:low/@value">
				<xsl:call-template name="formatDateShort">
					<xsl:with-param name="dateString" select="$row/n1:procedure/n1:effectiveTime/n1:low/@value"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:text>&#13;&#10;&#9;</xsl:text>

		<!-- Procedure Type  -->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Procedure: </xsl:text>
		<xsl:variable name="type">
			<xsl:call-template name="getProcedureType">
				<xsl:with-param name="procedure" select="$row/n1:procedure"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length($type)>1">
				<xsl:value-of select="$type" disable-output-escaping="yes"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>

		<!-- Procedure Free Text Type-->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Free Text: </xsl:text>
		<xsl:variable name="procFreeText">
			<xsl:call-template name="getProcedureFreeText">
				<xsl:with-param name="procedure" select="$row/n1:procedure"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length($procFreeText)>1">
				<xsl:call-template name="replaceSquigglesWithLinefeeds">
					<xsl:with-param name="text" select="$procFreeText"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>

		<!-- Procedure Provider-->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Provider: </xsl:text>
		<xsl:variable name="procProvider">
			<xsl:call-template name="getProcedureProvider">
				<xsl:with-param name="procedure" select="$row/n1:procedure"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length($procProvider)>1">
				<xsl:value-of select="$procProvider"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:text>&#13;&#10;&#9;</xsl:text>
	</xsl:template>

	<!-- Immunizations entry row -->
	<xsl:template name="immunizationsRow">
		<xsl:param name="row"/>
		<xsl:variable name="rowData" select="$row/n1:substanceAdministration/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial"/>
		<xsl:variable name="rowSubj" select="$row/n1:substanceAdministration/n1:entryRelationship[@typeCode='SUBJ']/n1:observation"/>
		<xsl:variable name="rowCause" select="$row/n1:substanceAdministration/n1:entryRelationship[@typeCode='CAUS']/n1:observation"/>
		<xsl:variable name="substanceAdministration" select="$row/n1:substanceAdministration"/>


		<!-- Immunization Name -->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Name: </xsl:text>
		<xsl:variable name="immunResult">
			<xsl:call-template name="getImmunization">
				<xsl:with-param name="substanceAdministration" select="$substanceAdministration"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:if test="string-length()>0">
			<xsl:value-of select="normalize-space($immunResult)"/>
		</xsl:if>

		<!-- Series -->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Series: </xsl:text>
		<xsl:value-of select="$rowSubj/n1:value"/>

		<!-- Immunization Date/Time-->
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Date: </xsl:text>
		<xsl:choose>
			<xsl:when test="string-length($row/n1:substanceAdministration/n1:effectiveTime/@value)=0">
				<xsl:text>-- Not Available --</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="formatDateShort">
					<xsl:with-param name="dateString" select="$row/n1:substanceAdministration/n1:effectiveTime/@value"/>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:text>&#13;&#10;&#9;</xsl:text>

	</xsl:template>

	<!--   Title  -->
	<xsl:template match="n1:title">
		<xsl:variable name="compFound">
			<xsl:call-template name="componentFound">
				<xsl:with-param name="compSection" select="../."/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length($compFound)>0">
				<xsl:text>&#13;&#10;</xsl:text>
				<xsl:text>&#13;&#10;</xsl:text>
				<xsl:value-of select="."/>
				<xsl:text>&#13;&#10;</xsl:text>
				<xsl:text>======================================</xsl:text>
				<xsl:text>&#13;&#10;</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

	<!--   Text   -->
	<xsl:template match="n1:text">
		<xsl:apply-templates />
	</xsl:template>

	<!--   paragraph  -->
	<xsl:template match="n1:paragraph">
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:apply-templates/>
	</xsl:template>

	<!--     Content w/ deleted text is hidden -->
	<xsl:template match="n1:content[@revised='delete']"/>

	<!--   content  -->
	<xsl:template match="n1:content">
		<xsl:apply-templates/>
	</xsl:template>


	<!--   list  -->
	<xsl:template match="n1:list">
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:if test="n1:caption">
			<xsl:text>=======================</xsl:text>
			<xsl:text>&#13;&#10;</xsl:text>
			<xsl:apply-templates select="n1:caption"/>
			<xsl:text>&#13;&#10;</xsl:text>
			<xsl:text>=======================</xsl:text>
			<xsl:text>&#13;&#10;</xsl:text>
		</xsl:if>
		<xsl:for-each select="n1:item">
			<xsl:text>--</xsl:text>
			<xsl:apply-templates />
			<xsl:text>&#13;&#10;</xsl:text>
		</xsl:for-each>
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
					<xsl:apply-templates />
				</li>
			</xsl:for-each>
		</ol>
	</xsl:template>

	<!--   caption  -->
	<xsl:template match="n1:caption">
		<xsl:apply-templates/>
		<xsl:text>: </xsl:text>
	</xsl:template>

	<!--      Tables   -->
	<xsl:template match="n1:table/@*|n1:thead/@*|n1:tfoot/@*|n1:tbody/@*|n1:colgroup/@*|n1:col/@*|n1:tr/@*|n1:th/@*|n1:td/@*">
		<xsl:copy>
			<xsl:copy-of select="@*"/>
			<xsl:apply-templates/>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="n1:table">
		<table>
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
		<tr>
			<xsl:copy-of select="@*"/>
			<xsl:apply-templates/>
		</tr>
	</xsl:template>

	<xsl:template match="n1:th">
		<th>
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

	<xsl:template match="n1:renderMultiMedia">
	</xsl:template>

	<xsl:template match="//n1:*[@styleCode]">

		<xsl:if test="@styleCode='Bold'">
			<xsl:element name='b'>
				<xsl:apply-templates/>
			</xsl:element>
		</xsl:if>

		<xsl:if test="@styleCode='Italics'">
			<xsl:element name='i'>
				<xsl:apply-templates/>
			</xsl:element>
		</xsl:if>

		<xsl:if test="@styleCode='Underline'">
			<xsl:element name='u'>
				<xsl:apply-templates/>
			</xsl:element>
		</xsl:if>

		<xsl:if test="contains(@styleCode,'Bold') and contains(@styleCode,'Italics') and not (contains(@styleCode, 'Underline'))">
			<xsl:element name='b'>
				<xsl:element name='i'>
					<xsl:apply-templates/>
				</xsl:element>
			</xsl:element>
		</xsl:if>

		<xsl:if test="contains(@styleCode,'Bold') and contains(@styleCode,'Underline') and not (contains(@styleCode, 'Italics'))">
			<xsl:element name='b'>
				<xsl:element name='u'>
					<xsl:apply-templates/>
				</xsl:element>
			</xsl:element>
		</xsl:if>

		<xsl:if test="contains(@styleCode,'Italics') and contains(@styleCode,'Underline') and not (contains(@styleCode, 'Bold'))">
			<xsl:element name='i'>
				<xsl:element name='u'>
					<xsl:apply-templates/>
				</xsl:element>
			</xsl:element>
		</xsl:if>

		<xsl:if test="contains(@styleCode,'Italics') and contains(@styleCode,'Underline') and contains(@styleCode, 'Bold')">
			<xsl:element name='b'>
				<xsl:element name='i'>
					<xsl:element name='u'>
						<xsl:apply-templates/>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>

	</xsl:template>

	<!-- 	Superscript or Subscript   -->
	<xsl:template match="n1:sup">
		<xsl:element name='sup'>
			<xsl:apply-templates/>
		</xsl:element>
	</xsl:template>
	<xsl:template match="n1:sub">
		<xsl:element name='sub'>
			<xsl:apply-templates/>
		</xsl:element>
	</xsl:template>

	<!--  Bottomline  -->

	<xsl:template name="displayBottomLine">
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>Electronically generated by: </xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:call-template name="getName">
			<xsl:with-param name="name"
            select="n1:legalAuthenticator/n1:assignedEntity/n1:representedOrganization/n1:name"/>
		</xsl:call-template>
		<xsl:text> on </xsl:text>
		<xsl:choose>
			<xsl:when test="string-length(n1:effectiveTime/@value)=0">
				<xsl:call-template name="na"/>
			</xsl:when>
			<xsl:when test="starts-with(n1:effectiveTime/@value,' ')">
				<xsl:call-template name="na"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="formatDateLong">
					<xsl:with-param name="dateString" select="n1:effectiveTime/@value"/>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:text>&#13;&#10;</xsl:text>
	</xsl:template>

	<xsl:template match="n1:component/n1:section[n1:templateId/@root='2.16.840.1.113883.10.20.1.11']/n1:text/n1:table/n1:tbody">
		<xsl:apply-templates>
			<xsl:sort select="n1:td[3]" order="descending"/>
		</xsl:apply-templates>
	</xsl:template>

	<xsl:template match="n1:component/n1:section[n1:templateId/@root='2.16.840.1.113883.10.20.1.8']/n1:text/n1:table/n1:tbody">
		<xsl:apply-templates>
			<xsl:sort select="n1:td[5]" order="descending"/>
		</xsl:apply-templates>
	</xsl:template>

	<xsl:template match="n1:component/n1:section[n1:templateId/@root='2.16.840.1.113883.10.20.1.16' or n1:templateId/@root='2.16.840.1.113883.10.20.1.14' or n1:templateId/@root='2.16.840.1.113883.10.20.1.6' or n1:templateId/@root='2.16.840.1.113883.10.20.1.3']/n1:text/n1:table/n1:tbody">
		<xsl:apply-templates>
			<xsl:sort select="n1:td[2]" order="descending"/>
		</xsl:apply-templates>
	</xsl:template>

	<xsl:template match="n1:component/n1:section[n1:templateId/@root='2.16.840.1.113883.10.20.1.11']/n1:text/n1:table/n1:tbody/n1:tr/n1:td[3]">
		<td>
			<xsl:call-template name="formatDateShort">
				<xsl:with-param name="dateString"
				 select="text()"/>
			</xsl:call-template>
		</td>
	</xsl:template>

	<xsl:template match="n1:component/n1:section[n1:templateId/@root='2.16.840.1.113883.10.20.1.8']/n1:text/n1:table/n1:tbody/n1:tr/n1:td[5]">
		<td>
			<xsl:call-template name="formatDateShort">
				<xsl:with-param name="dateString"
					 select="text()"/>
			</xsl:call-template>
		</td>
	</xsl:template>

	<xsl:template match="n1:component/n1:section[n1:templateId/@root='2.16.840.1.113883.10.20.1.16' or n1:templateId/@root='2.16.840.1.113883.10.20.1.14' or n1:templateId/@root='2.16.840.1.113883.10.20.1.6' or n1:templateId/@root='2.16.840.1.113883.10.20.1.3']/n1:text/n1:table/n1:tbody/n1:tr/n1:td[2]">
		<td>
			<xsl:call-template name="formatDateShort">
				<xsl:with-param name="dateString"
					 select="concat(substring(text(),1,4),substring(text(),6,2),substring(text(),9,2))"/>
			</xsl:call-template>
		</td>
	</xsl:template>

	<xsl:template name="noData_Clipboard">
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text> No data found for this domain! </xsl:text>
	</xsl:template>

	<xsl:template name="flyoverSpan">
		<xsl:param name="data"/>
		<xsl:value-of select="$data"/>
	</xsl:template>

	<xsl:template name="display1LineBreak">
		<xsl:text>&#13;&#10;</xsl:text>
	</xsl:template>

	<xsl:template name="displayVitalsMultiSeparator">
		<xsl:text>&#13;&#10;&#9;&#9;</xsl:text>
	</xsl:template>

	<xsl:template name="displayVitalRow">
		<xsl:param name="row"/>
		<xsl:call-template name="displayVitalItems">
			<xsl:with-param name="row" select="$row"/>
		</xsl:call-template>
		<xsl:call-template name="display1LineBreak"/>
		<xsl:call-template name="display1LineBreak"/>
	</xsl:template>

	<xsl:template name="displayVitalsDateItem">
		<xsl:param name="rowData"/>
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Date: </xsl:text>
		<xsl:call-template name="displayVitalsDate">
			<xsl:with-param name="rowData" select="$rowData"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayVitalsTempItem">
		<xsl:param name="temp"/>
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Temp: </xsl:text>
		<xsl:call-template name="displayVitalsTemp">
			<xsl:with-param name="temp" select="$temp"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayVitalsSourceItem">
		<xsl:param name="row"/>
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Source: </xsl:text>
		<xsl:call-template name="displayVitalsSource">
			<xsl:with-param name="row" select="$row"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayVitalsPoxItem">
		<xsl:param name="pox"/>
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>PoX: </xsl:text>
		<xsl:call-template name="displayVitalsPox">
			<xsl:with-param name="pox" select="$pox"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayVitalsWeightItem">
		<xsl:param name="weight"/>
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Weight: </xsl:text>
		<xsl:call-template name="displayVitalsWeight">
			<xsl:with-param name="weight" select="$weight"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayVitalsHeightItem">
		<xsl:param name="height"/>
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Height: </xsl:text>
		<xsl:call-template name="displayVitalsHeight">
			<xsl:with-param name="height" select="$height"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayVitalsBpItem">
		<xsl:param name="row"/>
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>BP: </xsl:text>
		<xsl:call-template name="displayVitalsBp">
			<xsl:with-param name="row" select="$row"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayVitalsRespItem">
		<xsl:param name="resp"/>
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Resp: </xsl:text>
		<xsl:call-template name="displayVitalsResp">
			<xsl:with-param name="resp" select="$resp"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayVitalsPulseItem">
		<xsl:param name="pulse"/>
		<xsl:text>&#13;&#10;&#9;</xsl:text>
		<xsl:text>Pulse: </xsl:text>
		<xsl:call-template name="displayVitalsPulse">
			<xsl:with-param name="pulse" select="$pulse"/>
		</xsl:call-template>
	</xsl:template>

</xsl:stylesheet>

