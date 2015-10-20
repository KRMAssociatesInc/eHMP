<?xml version="1.0"?>
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
	<xsl:output method="html" indent="yes" version="4.01" encoding="ISO-8859-1"/>

	<xsl:template name="displaySource">
		<head>
            <link href="app/applets/ccd_grid/assets/vler_resource/c32Styles/c32.css" type="text/css" rel="stylesheet" />
            <script type="text/javascript" src="app/applets/ccd_grid/assets/vler_resource/c32Styles/c32.js"></script>

			<h2 align="center">
				<xsl:call-template name="documentTitle">
					<xsl:with-param name="root" select="."/>
				</xsl:call-template>
			</h2>
		</head>
	</xsl:template>

	<xsl:template name="displayTitle">
		<div style="text-align:center;">
			<span style="font-size:larger;font-weight:bold">
				<xsl:value-of select="n1:code/@displayName"/>
			</span>
		</div>
	</xsl:template>

	<xsl:template name="displayReportDates">
		<b>
			<xsl:text>Created On: </xsl:text>
		</b>
		<xsl:call-template name="getCreatedOnDate"/>
		<xsl:if test="n1:documentationOf/n1:serviceEvent/n1:performer/n1:effectiveTime/n1:low/@value">
			<xsl:text disable-output-escaping="yes">&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;</xsl:text>
			<b>
				<xsl:text>Date Range: </xsl:text>
			</b>
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
			<b>
				<xsl:text disable-output-escaping="yes"> - </xsl:text>
			</b>
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
    <table width='100%' class="first">
      <xsl:variable name="patientRole" select="n1:recordTarget/n1:patientRole"/>
      <tr>
        <td width='15%' valign="top">
          <b>
            <xsl:text>Patient: </xsl:text>
          </b>
        </td>
        <td width='35%' valign="top">
          <xsl:for-each select="$patientRole/n1:patient/n1:name">
            <!-- The business partner (VLER Health Program) is okay with bypassing the "use" attribute at this time (build v16.1.6) -->
            <!--Patient legal name-->
            <xsl:if test ="position()=1">
              <xsl:call-template name="getName">
                <xsl:with-param name="name" select="."/>
              </xsl:call-template>
            </xsl:if>
          </xsl:for-each>
          <xsl:for-each select="$patientRole/n1:patient/n1:name">
            <!-- Alias names -->
            <xsl:if test ="position()>1 and string-length(normalize-space(current()))!=0">
              <br/>
              <xsl:text>Alias: </xsl:text>
              <xsl:call-template name="getName">
                <xsl:with-param name="name" select="."/>
              </xsl:call-template>
            </xsl:if>
          </xsl:for-each>
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
							<br/>
							<b>
								<xsl:text>tel: PATIENT PHONE MISSING</xsl:text>
							</b>
						</xsl:otherwise>
					</xsl:choose>
				</td>
				<td width='15%' align='right' valign="top">
					<b>
						<xsl:text>Patient ID: </xsl:text>
					</b>
				</td>
				<td width='35%' valign="top">
					<xsl:if test="string-length($patientRole/n1:id/@extension)>0">
						<xsl:value-of select="$patientRole/n1:id/@extension"/>
					</xsl:if>
				</td>
			</tr>
			<tr>
				<td width='15%' valign="top">
					<b>
						<xsl:text>Birthdate: </xsl:text>
					</b>
				</td>
				<td width='35%' valign="top">
					<xsl:call-template name="formatDateLong">
						<xsl:with-param name="dateString" select="$patientRole/n1:patient/n1:birthTime/@value"/>
					</xsl:call-template>
				</td>
				<td width='15%' align='right' valign="top">
					<b>
						<xsl:text>Sex: </xsl:text>
					</b>
				</td>
				<td width='35%' valign="top">
					<xsl:call-template name="getGenderString"/>
				</td>
			</tr>
			<xsl:variable name="hasLanguages">
				<xsl:call-template name="isLanguageFound">
					<xsl:with-param name="patientRole" select="$patientRole"/>
				</xsl:call-template>
			</xsl:variable>
			<xsl:if test="$hasLanguages='true'">
				<tr>
					<td width="15%" valign="top">
						<b>
							<xsl:text>Language(s):</xsl:text>
						</b>
					</td>
					<td width="35%" valign="top">
					<xsl:call-template name="displayLanguages">
						<xsl:with-param name="patientRole" select="$patientRole"/>
					</xsl:call-template>
					</td>
					<td width="15%" valign="top"></td>
					<td width="35%" valign="top"></td>
				</tr>
			</xsl:if>
		</table>
	</xsl:template>

	<xsl:template match="n1:languageCode">
		<xsl:variable name="codeString">
			<xsl:apply-templates select="." mode="data"/>
		</xsl:variable>
		<xsl:if test="string-length(normalize-space($codeString))>0">
			<li>
				<xsl:value-of select="$codeString"/>
			</li>
		</xsl:if>
	</xsl:template>
	
	<xsl:template name="displayAuthorBlock">
		<xsl:if test="n1:author">
			<table width="100%" class="second">
				<tr>
					<td width="15%">
						<b>Source:</b>
					</td>
					<td width="85%">
						<xsl:value-of select="n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name/text()"/>
					</td>
				</tr>
				<xsl:choose>
					<xsl:when test="not($isMVA)">
						<xsl:if test="string-length(normalize-space(n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name))>1">
							<tr>
							<td width="15%" valign="top"></td>
							<td width="85%" valign="top">
								Author:
								<xsl:call-template name="getPersonNameFromRoot">
									<xsl:with-param name="nameRoot" select="n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name"/>
								</xsl:call-template>
							</td>
							</tr>
						</xsl:if>
					</xsl:when>
				</xsl:choose>
			</table>
		</xsl:if>
	</xsl:template>

	<xsl:template name="displayTableOfContents">
		<div style="margin-bottom:35px">
			<h3>
				<a name="toc">Table of Contents</a>
			</h3>
			<ul>
				<xsl:for-each select="n1:component/n1:structuredBody/n1:component/n1:section/n1:title">
					<xsl:sort/>
					<xsl:variable name="compFound">
						<xsl:call-template name="componentFound">
							<xsl:with-param name="compSection" select="../."/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($compFound)>0">
							<li>
								<a style="font-family:georgia;font-size:12pt"  href="#{generate-id(.)}">
									<xsl:value-of select="."/>
								</a>
							</li>
						</xsl:when>
					</xsl:choose>
				</xsl:for-each>
			</ul>
		</div>
	</xsl:template>

	<xsl:template name="displayContents">
		<xsl:apply-templates select="n1:component/n1:structuredBody/n1:component">
			<xsl:sort select="n1:section/n1:title"/>
		</xsl:apply-templates>
		<br></br>
	</xsl:template>

  <xsl:template name="displayContactInfoBlock">
    <xsl:choose>
      <xsl:when test="string-length(n1:participant[@typeCode='IND']/n1:associatedEntity)>0">
        <table class="first">
          <tr>
            <td width="100px" valign="top" align='left'>
              <b>Contact(s): </b>
            </td>
            <td valign="top">
              <xsl:call-template name="getParticipantinfo">
                <xsl:with-param name="participant" select="n1:participant[@typeCode='IND']/n1:associatedEntity"/>
              </xsl:call-template>
            </td>
            <td width="50px"> </td>
          </tr>
        </table>
      </xsl:when>
      <xsl:otherwise>
        <xsl:text disable-output-escaping="yes">&amp;nbsp;</xsl:text>
        <span style="font-weight:bold; border:2px solid;">
          <xsl:text> EMERGENCY CONTACT INFO MISSING! </xsl:text>
        </span>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="getParticipantinfo">
    <xsl:param name="participant"/>
    <p>
      <xsl:for-each select="$participant">
        <xsl:call-template name="emerName">
          <xsl:with-param name="participant" select="."/>
        </xsl:call-template>
        <xsl:call-template name="emerAddress">
          <xsl:with-param name="participant" select="."/>
        </xsl:call-template>
        <xsl:call-template name="emerTelecom">
          <xsl:with-param name="participant" select="."/>
        </xsl:call-template>
        <xsl:call-template name="emerRelationship">
          <xsl:with-param name="participant" select="."/>
        </xsl:call-template>
        <xsl:call-template name="emerType">
          <xsl:with-param name="participant" select="."/>
        </xsl:call-template>
        <br/>
      </xsl:for-each>
    </p>
  </xsl:template>

  <xsl:template name="emerName">
    <xsl:param name="participant"/>
    <br/>
    <xsl:call-template name="getName">
      <xsl:with-param name="name" select="$participant/n1:associatedPerson/n1:name"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template name="emerAddress">
    <xsl:param name="participant"/>
    <xsl:if test="$participant/n1:addr/n1:streetAddressLine">
      <xsl:for-each select="$participant/n1:addr/n1:streetAddressLine">
        <xsl:if test="string-length(normalize-space(current()))!=0">
          <br/>
          <xsl:value-of select="."/>
        </xsl:if>
      </xsl:for-each>
    </xsl:if>
    <xsl:if test="$participant/n1:addr/n1:city">
      <br/>
      <xsl:value-of select="$participant/n1:addr/n1:city"/>
      <xsl:text>, </xsl:text>
    </xsl:if>
    <xsl:if test="$participant/n1:addr/n1:state">
      <xsl:value-of select="$participant/n1:addr/n1:state"/>
      <xsl:text> </xsl:text>
    </xsl:if>
    <xsl:if test="$participant/n1:addr/n1:postalCode">
      <xsl:value-of select="$participant/n1:addr/n1:postalCode"/>
    </xsl:if>
  </xsl:template>

  <xsl:template name="emerTelecom">
    <xsl:param name="participant"/>
    <xsl:choose>
      <xsl:when test="$participant/n1:telecom/@value">
        <xsl:for-each select="$participant/n1:telecom">
          <xsl:call-template name="getTelecom">
            <xsl:with-param name="telecom" select="."/>
          </xsl:call-template>
        </xsl:for-each>
      </xsl:when>
      <xsl:otherwise>
        <br/>
        <b>
          <xsl:text>tel: CONTACT PHONE MISSING</xsl:text>
        </b>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="emerRelationship">
    <xsl:param name="participant"/>
    <xsl:choose>
      <xsl:when test="$participant/n1:code/@displayName">
        <br/>
        <b>Relationship: </b>
        <xsl:value-of select="$participant/n1:code/@displayName"/>
      </xsl:when>
      <xsl:when test="$participant/n1:code/n1:originalText">
        <br/>
        <b>Relationship: </b>
        <xsl:value-of select="$participant/n1:code/n1:originalText"/>
      </xsl:when>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="emerType">
    <xsl:param name="participant"/>
    <xsl:if test="$participant/@classCode">
      <br/>
      <b>Contact Type: </b>
      <xsl:choose>
        <xsl:when test="$participant/@classCode='AGNT'">
          <xsl:text>Agent</xsl:text>
        </xsl:when>
        <xsl:when test="$participant/@classCode='CAREGIVER'">
          <xsl:text>Caregiver</xsl:text>
        </xsl:when>
        <xsl:when test="$participant/@classCode='ECON'">
          <xsl:text>Emergency Contact</xsl:text>
        </xsl:when>
        <xsl:when test="$participant/@classCode='GUARD'">
          <xsl:text>Guardian</xsl:text>
        </xsl:when>
        <xsl:when test="$participant/@classCode='NOK'">
          <xsl:text>Next of kin</xsl:text>
        </xsl:when>
        <xsl:when test="$participant/@classCode='PRS'">
          <xsl:text>Personal</xsl:text>
        </xsl:when>
      </xsl:choose>
    </xsl:if>
  </xsl:template>

  <xsl:template name="getParticipant">
		<xsl:param name="participant"/>
		<p>
			<xsl:call-template name="getName">
				<xsl:with-param name="name" select="$participant/n1:associatedPerson/n1:name"/>
			</xsl:call-template>
			<xsl:if test="$participant/n1:addr">
				<xsl:choose>
					<xsl:when test="$isKaiser">
						<xsl:call-template name="getSingleAddress">
							<xsl:with-param name="addr" select="$participant/n1:addr"/>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:call-template name="getAddress">
							<xsl:with-param name="addr" select="$participant/n1:addr"/>
						</xsl:call-template>
					</xsl:otherwise>
				</xsl:choose>
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
					<br/>
					<b>
						<xsl:text>tel: CONTACT PHONE MISSING</xsl:text>
					</b>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:if test="$participant/n1:code/n1:originalText">
				<br/>
				<b>Relationship: </b>
				<xsl:value-of select="$participant/n1:code/n1:originalText"/>
			</xsl:if>
		</p>
	</xsl:template>

	<xsl:template name="getSingleAddress">
		<xsl:param name="addr"/>
		<xsl:if test="$addr/n1:streetAddressLine != ' '">
			<br/>
			<xsl:if test="string-length($addr/n1:streetAddressLine)>0">
				<xsl:value-of select="$addr/n1:streetAddressLine"/>
			</xsl:if>

			<br/>
			<xsl:value-of select="$addr/n1:city"/>,
			<xsl:value-of select="$addr/n1:state"/>,
			<xsl:value-of select="$addr/n1:postalCode"/>
		</xsl:if>
	</xsl:template>

	<xsl:template name="getAddress">
		<xsl:param name="addr"/>
		<xsl:if test="$addr/n1:streetAddressLine != ' '">
			<xsl:for-each select="$addr/n1:streetAddressLine">
				<br/>
				<xsl:if test="string-length($addr/n1:streetAddressLine)>0">
					<xsl:value-of select="."/>
				</xsl:if>
			</xsl:for-each>
		</xsl:if>
		<br/>
		<xsl:value-of select="$addr/n1:city"/>,
		<xsl:value-of select="$addr/n1:state"/>,
		<xsl:value-of select="$addr/n1:postalCode"/>
	</xsl:template>

	<xsl:template name="getTelecom">
		<xsl:param name="telecom"/>
		<br/>
		<xsl:if test="string-length($telecom/@value)>0">
			<xsl:value-of select="$telecom/@value"/>
			<xsl:choose>
				<xsl:when test="./@use='HP' ">
					<b>
						<xsl:text> Home</xsl:text>
					</b>
				</xsl:when>
				<xsl:when test="./@use='WP' ">
					<b>
						<xsl:text> Work</xsl:text>
					</b>
				</xsl:when>
				<xsl:when test="./@use='HV' ">
					<b>
						<xsl:text> Vacation</xsl:text>
					</b>
				</xsl:when>
				<xsl:when test="./@use='MC' ">
					<b>
						<xsl:text> Mobile</xsl:text>
					</b>
				</xsl:when>
				<xsl:otherwise>
					<b>
						<xsl:text></xsl:text>
					</b>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

	<!-- Get Author  -->
	<xsl:template name="getAuthor">
		<xsl:variable name="author"/>
		<xsl:call-template name="getName">
			<xsl:with-param name="name" select="n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name"/>
		</xsl:call-template>
		<xsl:choose>
			<xsl:when test="$author">
				<xsl:value-of select="n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name"/>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

	<!-- StructuredBody -->

	<xsl:template name="displayProblemComponentSection">
		<xsl:call-template name="getCommonFormatComments"/>
		<xsl:call-template name="problemDetails">
			<xsl:with-param select="." name="section"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayAllergyComponentSection">
		<xsl:call-template name="getCommonFormatComments"/>
		<xsl:call-template name="allergyDetails">
			<xsl:with-param select="." name="section"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayMedsComponentSection">
		<xsl:call-template name="getCommonFormatComments"/>
		<xsl:call-template name="medDetails">
			<xsl:with-param select="." name="section"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayEncounterComponentSection">
		<xsl:call-template name="encounterNotice">
			<xsl:with-param select="." name="section"/>
		</xsl:call-template>
		<xsl:call-template name="encounterDetails">
			<xsl:with-param select="." name="section"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayResultsComponentSection">
		<xsl:call-template name="getCommonFormatComments"/>
		<xsl:call-template name="resultsDetails">
			<xsl:with-param select="." name="section"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayProceduresComponentSection">
		<xsl:call-template name="proceduresNotice">
			<xsl:with-param select="." name="section"/>
		</xsl:call-template>
		<xsl:call-template name="proceduresDetails">
			<xsl:with-param select="." name="section"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayImmunizationsComponentSection">
		<xsl:call-template name="getCommonFormatComments"/>
		<xsl:call-template name="immunizationsDetails">
			<xsl:with-param select="." name="section"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayVitalsComponentSection">
		<xsl:call-template name="getCommonFormatComments"/>
		<xsl:call-template name="vitalsDetails">
			<xsl:with-param select="." name="section"/>
		</xsl:call-template>
	</xsl:template>
	
	<!-- Encounter Detail Section-->
  <xsl:template name="encounterDetails">
    <xsl:param name="section"/>
    <xsl:if test="$section/n1:entry">
      <table border="1" style="font-size:14px;">
        <thead>
          <tr>
            <th class="first">
              <xsl:text>Date/Time</xsl:text>
              <xsl:if test="n1:entry/n1:encounter">
                <xsl:text> - Count (</xsl:text>
                <xsl:value-of select="count(n1:entry/n1:encounter)"/>
                <xsl:text>)</xsl:text>
              </xsl:if>
            </th>
            <th class="first">Encounter Type</th>
            <th class="first">Encounter Comments</th>
            <th class="first">Provider</th>
          </tr>
        </thead>
        <tbody>
          <xsl:apply-templates select="$section/n1:entry">
            <xsl:sort select="n1:encounter/n1:effectiveTime/n1:low/@value" order="descending"/>
          </xsl:apply-templates>
        </tbody>
      </table>
    </xsl:if>
    <br></br>
    <xsl:choose>
      <xsl:when test="not(boolean(n1:entry/n1:encounter))">
        <xsl:call-template name="noData"/>
      </xsl:when>
      <xsl:otherwise>
        <br></br>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- Meds Detail Section -->
  <xsl:template name="medDetails">
    <xsl:param name="section"/>
    <xsl:if test="$section/n1:entry">
      <table border="1" style="font-size:14px">
        <thead>
          <tr>
            <th class="first">
              <xsl:text>Medications</xsl:text>
              <xsl:if test="n1:entry/n1:substanceAdministration">
                <xsl:text> - Count (</xsl:text>
                <xsl:value-of select="count(n1:entry/n1:substanceAdministration)"/>
                <xsl:text>)</xsl:text>
              </xsl:if>
            </th>
            <!--<th class="first">Route</th>-->
            <!--<th class="first">Interval</th>-->
            <th class="first">Status</th>
            <th class="first">Quantity</th>
            <th class="first">Order Expiration</th>
            <th class="first">Provider</th>
            <th class="first">Prescription #</th>
            <th class="first">Dispense Date</th>
            <th class="first">Sig</th>
            <th class="first">Source</th>
          </tr>
        </thead>
        <tbody>
          <xsl:choose>
            <xsl:when test="$section/n1:entry/n1:substanceAdministration/n1:effectiveTime/n1:high">
              <xsl:apply-templates select="$section/n1:entry">
                <xsl:sort select="n1:substanceAdministration/n1:effectiveTime/n1:high/@value"/>
              </xsl:apply-templates>
            </xsl:when>
            <xsl:otherwise>
              <xsl:apply-templates select="$section/n1:entry">
                <xsl:sort select="n1:substanceAdministration/n1:entryRelationship/n1:supply/n1:effectiveTime/@value"/>
              </xsl:apply-templates>
            </xsl:otherwise>
          </xsl:choose>
        </tbody>
      </table>
    </xsl:if>
    <br></br>
    <xsl:choose>
      <xsl:when test="not(boolean(n1:entry/n1:substanceAdministration))">
        <xsl:call-template name="noData"/>
        <br></br>
      </xsl:when>
      <xsl:otherwise>
        <br></br>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- Problem Detail Section -->
  <xsl:template name="problemDetails">
    <xsl:param name="section"/>
    <xsl:if test="$section/n1:entry">
      <table border="1" style="font-size:14px">
        <thead>
          <tr>
            <th class="first">
              <xsl:text>Problems</xsl:text>
              <xsl:if test="n1:entry/n1:act/n1:entryRelationship[@typeCode='SUBJ']/n1:observation">
                <xsl:text> - Count (</xsl:text>
                <xsl:value-of select="count(n1:entry/n1:act/n1:entryRelationship[@typeCode='SUBJ']/n1:observation)"/>
                <xsl:text>)</xsl:text>
              </xsl:if>
            </th>
            <th class="first">Status</th>
            <th class="first">Problem Code</th>
            <th class="first">Date of Onset</th>
            <th class="first">Provider</th>
            <th class="first">Source</th>
          </tr>
        </thead>
        <tbody>
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
        </tbody>
      </table>
    </xsl:if>
    <br></br>
    <xsl:choose>
      <xsl:when test="not(boolean(n1:entry/n1:act/n1:entryRelationship[@typeCode='SUBJ']/n1:observation))">
        <xsl:call-template name="noData"/>
      </xsl:when>
      <xsl:otherwise>
        <br></br>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- Allergy Detail Section -->
  <xsl:template name="allergyDetails">
    <xsl:param name="section"/>
    <xsl:if test="$section/n1:entry">
      <table border="1" style="font-size:14px">
        <thead>
          <tr>
            <th class="first">
              <xsl:text>Allergens</xsl:text>
              <xsl:if test="n1:entry/n1:act/n1:entryRelationship/n1:observation">
                <xsl:text> - Count (</xsl:text>
                <xsl:value-of select="count(n1:entry/n1:act/n1:entryRelationship/n1:observation)"/>
                <xsl:text>)</xsl:text>
              </xsl:if>
            </th>
            <th class="first">Verification Date</th>
            <th class="first">Event Type</th>
            <th class="first">Reaction</th>
            <th class="first">Severity</th>
            <th class="first">Source</th>
          </tr>
        </thead>
        <tbody>
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
        </tbody>
      </table>
    </xsl:if>
    <br></br>
    <xsl:choose>
      <xsl:when test="not(boolean(n1:entry/n1:act/n1:entryRelationship/n1:observation))">
        <xsl:call-template name="noData"/>
      </xsl:when>
      <xsl:otherwise>
        <br></br>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- (Lab)Results Detail Section-->
  <xsl:template name="resultsDetails">
    <xsl:param name="section"/>
    <xsl:if test="$section/n1:entry">
      <table border="1" style="font-size:14px">
        <thead>
          <tr>
            <th class="first">
              <xsl:text>Date/Time</xsl:text>
              <xsl:choose>
                <xsl:when test="n1:entry/n1:organizer/n1:component/n1:observation and not(boolean(n1:entry/n1:observation))">
                  <xsl:text> - Count (</xsl:text>
                  <xsl:value-of select="count(n1:entry/n1:organizer/n1:component)"/>
                  <xsl:text>)</xsl:text>
                </xsl:when>
                <xsl:when test="n1:entry/n1:organizer/n1:component/n1:observation and n1:entry/n1:observation">
                  <xsl:text> - Count (</xsl:text>
                  <xsl:value-of select="count(n1:entry/n1:organizer/n1:component)+count(n1:entry/n1:observation)"/>
                  <xsl:text>)</xsl:text>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:if test="n1:entry/n1:observation">
                    <xsl:text> - Count (</xsl:text>
                    <xsl:value-of select="count(n1:entry/n1:observation)"/>
                    <xsl:text>)</xsl:text>
                  </xsl:if>
                </xsl:otherwise>
              </xsl:choose>
            </th>
            <th class="first">Result Type</th>
            <th class="first">Source</th>
            <th class="first">Result - Unit</th>
            <th class="first">Interpretation</th>
            <th class="first">Reference Range</th>
            <th class="first">Status</th>
          </tr>
        </thead>
        <tbody>
          <xsl:choose>
            <xsl:when test="n1:observation/n1:effectiveTime/@value">
              <xsl:apply-templates select="$section/n1:entry">
                <xsl:sort select="n1:observation/n1:effectiveTime/@value" order="descending"/>
              </xsl:apply-templates>
            </xsl:when>
            <xsl:otherwise>
              <xsl:apply-templates select="$section/n1:entry">
                <xsl:sort select="n1:organizer/n1:component/n1:observation/n1:effectiveTime/@value" order="descending"/>
              </xsl:apply-templates>
            </xsl:otherwise>
          </xsl:choose>
        </tbody>
      </table>
    </xsl:if>
    <br></br>
    <xsl:choose>
      <xsl:when test="not(boolean(n1:entry/n1:observation)) and not(boolean(n1:entry/n1:organizer/n1:component/n1:observation[@classCode='OBS' and @moodCode='EVN']))">
        <xsl:call-template name="noData"/>
      </xsl:when>
      <xsl:otherwise>
        <br></br>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- Procedures Detail Section-->
  <xsl:template name="proceduresDetails">
    <xsl:param name="section"/>
    <xsl:if test="$section/n1:entry">
      <table border="1" style="font-size:14px">
        <thead>
          <tr>
            <th class="first">
              <xsl:text>Date/Time</xsl:text>
              <xsl:if test="n1:entry/n1:procedure">
                <xsl:text> - Count (</xsl:text>
                <xsl:value-of select="count(n1:entry/n1:procedure)"/>
                <xsl:text>)</xsl:text>
              </xsl:if>
            </th>
            <th class="first">Procedure Type</th>
            <th class="first">Procedure Comments</th>
            <th class="first">Provider</th>
          </tr>
        </thead>
        <tbody>
          <xsl:apply-templates select="$section/n1:entry">
            <xsl:sort select="n1:procedure/n1:effectiveTime/n1:low/@value" order="descending"/>
          </xsl:apply-templates>
        </tbody>
      </table>
    </xsl:if>
    <br></br>
    <xsl:choose>
      <xsl:when test="not(boolean(n1:entry/n1:procedure))">
        <xsl:call-template name="noData"/>
      </xsl:when>
      <xsl:otherwise>
        <br></br>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- Immunizations Detail Section -->
  <xsl:template name="immunizationsDetails">
    <xsl:param name="section"/>
    <xsl:if test="$section/n1:entry">
      <table border="1" style="font-size:14px">
        <thead>
          <tr>
            <th class="first">
              <xsl:text>Immunizations</xsl:text>
              <xsl:if test="n1:entry/n1:substanceAdministration">
                <xsl:text> - Count (</xsl:text>
                <xsl:value-of select="count(n1:entry/n1:substanceAdministration)"/>
                <xsl:text>)</xsl:text>
              </xsl:if>
            </th>
            <th class="first">Series</th>
            <th class="first">Date Issued</th>
            <th class="first">Reaction</th>
            <th class="first">Comments</th>
          </tr>
        </thead>
        <tbody>
          <xsl:apply-templates select="$section/n1:entry">
            <xsl:sort select="n1:substanceAdministration/n1:effectiveTime/@value" order="descending"/>
          </xsl:apply-templates>
        </tbody>
      </table>
    </xsl:if>
    <br></br>
    <br></br>
  </xsl:template>

  <!-- Vitals Detail Section -->
  <xsl:template name="vitalsDetails">
    <xsl:param name="section"/>
    <xsl:if test="$section/n1:entry">
      <table border="1" style="font-size:14px">
        <thead>
          <tr>
            <th class="first">
              <xsl:text>Date</xsl:text>
              <xsl:if test="n1:entry/n1:organizer">
                <xsl:text> - Count (</xsl:text>
                <xsl:value-of select="count(n1:entry/n1:organizer)"/>
                <xsl:text>)</xsl:text>
              </xsl:if>
            </th>
            <th class="first">TEMP</th>
            <th class="first">PULSE</th>
            <th class="first">RESP</th>
            <th class="first">BP</th>
            <th class="first">Ht</th>
            <th class="first">HT-Lying</th>
            <th class="first">Wt</th>
            <th class="first">POx</th>
            <th class="first">OFC</th>
            <th class="first">Source</th>
          </tr>
        </thead>
        <tbody>
          <xsl:apply-templates select="$section/n1:entry">
            <xsl:sort select="n1:organizer/n1:component/n1:observation/n1:effectiveTime/@value" order="descending"/>
          </xsl:apply-templates>
          <br/>
        </tbody>
      </table>
    </xsl:if>
    <br></br>
    <br></br>
  </xsl:template>

	<!-- Encounter row entry -->
	<xsl:template name="encRow">
		<xsl:param name="row"/>
		<tr class="second">

			<!-- Encounter Date/Time-->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:auto;">
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
				</div>
			</td>

			<!-- Encounter Type  -->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:auto;">
					<xsl:variable name="typeResult">
						<xsl:call-template name="getEncounterType">
							<xsl:with-param name="encounter" select="$row/n1:encounter"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($typeResult)>0">
							<xsl:call-template name="flyoverSpan">
								<xsl:with-param name="data" select="$typeResult"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="na"/>
						</xsl:otherwise>
					</xsl:choose>

				</div>
			</td>

			<!-- Encounter Free Text -->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:360px;height:1em">
					<xsl:variable name="encFreeText">
						<xsl:call-template name="ltrim">
							<xsl:with-param name="text">
								<xsl:call-template name="getEncounterFreeText">
									<xsl:with-param name="encounter" select="$row/n1:encounter"/>
								</xsl:call-template>
							</xsl:with-param>
							<xsl:with-param name="startChar" select="'~'"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($encFreeText)>1">
							<xsl:call-template name="flyoverSpan">
								<xsl:with-param name="data" select="$encFreeText"/>
								<xsl:with-param name="freeText" select="'yes'"/>
								<xsl:with-param name="deSquigglefy" select="'yes'"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="na"/>
						</xsl:otherwise>
					</xsl:choose>
				</div>
			</td>

			<!-- Encounter Provider-->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:160px;">
					<xsl:variable name="encProvider">
						<xsl:call-template name="getEncounterProvider">
							<xsl:with-param name="encounter" select="$row/n1:encounter"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($encProvider)>1">
							<xsl:call-template name="flyoverSpan">
								<xsl:with-param name="data" select="$encProvider"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="na"/>
						</xsl:otherwise>
					</xsl:choose>
				</div>
			</td>
		</tr>
	</xsl:template>

	<xsl:template name="medRow">
		<xsl:param name="row"/>
		<tr class="second">
			<!-- Name -->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:180px;">
					<xsl:call-template name="flyoverSpan">
						<xsl:with-param name="data">
							<xsl:call-template name="getMedicationName">
								<xsl:with-param name="row" select="$row"/>
							</xsl:call-template>
						</xsl:with-param>
					</xsl:call-template>
				</div>
			</td>

			<!-- Status -->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:80px;">
					<xsl:variable name="medStat">
						<xsl:call-template name="medStatus">
							<xsl:with-param name="substanceAdmin" select="$row/n1:substanceAdministration"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($medStat)>1">
							<xsl:call-template name="flyoverSpan">
								<xsl:with-param name="data" select="$medStat"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="na"/>
						</xsl:otherwise>
					</xsl:choose>
				</div>
			</td>

			<!-- Quantity -->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:40px;">
					<xsl:call-template name="medQuantity">
						<xsl:with-param name="substanceAdmin" select="$row/n1:substanceAdministration"/>
					</xsl:call-template>
				</div>
			</td>

			<!-- Order Expiration Date/Time -->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:80px;">
					<xsl:call-template name="medExpiretime">
						<xsl:with-param name="substanceAdmin" select="$row/n1:substanceAdministration"/>
					</xsl:call-template>
				</div>
			</td>

			<!-- Provider -->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:140px;">
					<xsl:variable name="medProvider">
						<xsl:call-template name="getMedProvider">
							<xsl:with-param name="substanceAdmin" select="$row/n1:substanceAdministration"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($medProvider)>1">
							<xsl:call-template name="flyoverSpan">
								<xsl:with-param name="data" select="$medProvider"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="na"/>
						</xsl:otherwise>
					</xsl:choose>
				</div>
			</td>

			<!-- Prescription ID (Nbr) -->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:80px;">
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
				</div>
			</td>

			<!-- dispense time -->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:80px;">
					<xsl:call-template name="medBegintime">
						<xsl:with-param name="row" select="$row"/>
					</xsl:call-template>
				</div>
			</td>

			<!-- Sig -->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:160px;">
					<xsl:variable name="sig">
						<xsl:call-template name="getSig">
							<xsl:with-param name="substanceAdmin" select="$row/n1:substanceAdministration"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($sig)>1">
							<xsl:call-template name="flyoverSpan">
								<xsl:with-param name="data" select="$sig"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="na"/>
						</xsl:otherwise>
					</xsl:choose>
				</div>
			</td>

			<!-- source -->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:100px;">
					<xsl:variable name="sourceResult">
						<xsl:call-template name="getMedSource">
							<xsl:with-param name="substanceAdmin" select="$row/n1:substanceAdministration"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:if test="string-length($sourceResult)>1">
						<xsl:call-template name="flyoverSpan">
							<xsl:with-param name="data" select="$sourceResult"/>
						</xsl:call-template>
					</xsl:if>
				</div>
			</td>
		</tr>
	</xsl:template>

	<xsl:template name="problemRow">
		<xsl:param name="row"/>
		<xsl:variable name="rowData" select="$row/n1:act/n1:entryRelationship/n1:observation"/>
		<tr class="second">

			<!-- name -->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:240px;">
					<xsl:variable name="probResult">
						<xsl:call-template name="probName">
							<xsl:with-param name="probEntry" select="$row"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:if test="string-length($probResult)>1">
						<xsl:call-template name="flyoverSpan">
							<xsl:with-param name="data" select="$probResult" />
						</xsl:call-template>
					</xsl:if>
				</div>
			</td>

			<!-- status -->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:80px;">
					<xsl:call-template name="probStatus">
						<xsl:with-param name="row" select="$row"/>
					</xsl:call-template>
				</div>
			</td>

			<!-- Problem Code -->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:150px">
					<xsl:call-template name="getProblemCode">
						<xsl:with-param name="rowData" select="$rowData"/>
					</xsl:call-template>
				</div>
			</td>

			<!-- problem effective date -->
			<td>
				<div style="overflow:hidden; white-space:nowrap;">
					<xsl:call-template name="probDate">
						<xsl:with-param name="row" select="$row"/>
					</xsl:call-template>
				</div>
			</td>

			<!-- provider -->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:160px;">
					<xsl:variable name="provider"/>
					<xsl:call-template name="getProblemProvider">
						<xsl:with-param name="act" select="$row/n1:act"/>
					</xsl:call-template>
					<xsl:if test="string-length($provider)>2">
						<xsl:call-template name="flyoverSpan">
							<xsl:with-param name="data" select="$provider" />
						</xsl:call-template>
					</xsl:if>
				</div>
			</td>

			<!-- source -->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:150px;">
					<xsl:variable name="source">
						<xsl:call-template name="getProblemSource">
							<xsl:with-param name="row" select="$row"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($source)>1">
							<xsl:call-template name="flyoverSpan">
								<xsl:with-param name="data" select="$source"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="na"/>
						</xsl:otherwise>
					</xsl:choose>
				</div>
			</td>
		</tr>
	</xsl:template>

	<!-- Allergy entry row -->
	<xsl:template name="allergyRow">
		<xsl:param name="row"/>
		<xsl:variable name="observation" select="$row/n1:act/n1:entryRelationship/n1:observation"/>
		<xsl:variable name="eR" select="$row/n1:act/n1:entryRelationship"/>
		<tr class="second">

			<!--Allergens-->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:180px; padding-right:5px;">			
					<xsl:variable name="allergen">
						<xsl:call-template name="getAllergen">
							<xsl:with-param name="observation" select="$observation"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($allergen)>1">
							<xsl:call-template name="flyoverSpan">
								<xsl:with-param name="data" select="$allergen"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="na"/>
						</xsl:otherwise>
					</xsl:choose>
				</div>
			</td>

			<!--Verification Date-->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:100px;">
					<xsl:call-template name="displayAllergyVerificationDate">
						<xsl:with-param name="observation" select="$observation"/>
					</xsl:call-template>
				</div>
			</td>

			<!--Event Type-->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:180px;">
					<xsl:variable name="allergenType">
						<xsl:call-template name="getEventType">
							<xsl:with-param name="obs" select="$observation"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($allergenType)>1">
							<xsl:call-template name="flyoverSpan">
								<xsl:with-param name="data" select="$allergenType"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="na"/>
						</xsl:otherwise>
					</xsl:choose>
				</div>
			</td>

			<!--Reaction-->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:180px;">
					<!--<xsl:for-each select="$observation/n1:entryRelationship[@typeCode='MFST']">-->
					<xsl:variable name="valueResult">
						<xsl:call-template name="getReactionValue">
							<xsl:with-param name="entryRelationship" select="$row/n1:act/n1:entryRelationship"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($valueResult)>1">
							<xsl:call-template name="flyoverSpan">
								<xsl:with-param name="data" select="$valueResult"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="na"/>
						</xsl:otherwise>
					</xsl:choose>
					<!--</xsl:for-each>-->
				</div>
			</td>

			<!--Severity-->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:100px;">
					<xsl:variable name="severity">
						<xsl:call-template name="getSeverity">
							<xsl:with-param name="observation" select="$observation"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($severity)>1">
							<xsl:value-of select="$severity"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="na"/>
						</xsl:otherwise>
					</xsl:choose>
				</div>
			</td>

			<!--source-->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:150px;">
					<xsl:variable name="source">
						<xsl:call-template name="getAllergySource">
							<xsl:with-param name="row" select="$row"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($source)>0">
							<xsl:call-template name="flyoverSpan">
								<xsl:with-param name="data" select="$source"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="na"/>
						</xsl:otherwise>
					</xsl:choose>
				</div>
			</td>
		</tr>

	</xsl:template>

	<!-- Procedures row entry -->
	<xsl:template name="procedureRow">
		<xsl:param name="row"/>
		<tr class="second">
			<!-- Procedure Date/Time-->
			<td>
				<div style="overflow:hidden; white-space:nowrap;">
					<xsl:choose>
						<xsl:when test="$row/n1:procedure/n1:effectiveTime/n1:low/@value">
							<xsl:call-template name="formatDateShort">
								<xsl:with-param name="dateString" select="$row/n1:procedure/n1:effectiveTime/n1:low/@value"/>
							</xsl:call-template>
						</xsl:when>
            <xsl:when test="$row/n1:procedure/n1:effectiveTime/@value">
              <xsl:call-template name="formatDateShort">
                <xsl:with-param name="dateString" select="$row/n1:procedure/n1:effectiveTime/@value"/>
              </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
              <xsl:call-template name="na"/>
            </xsl:otherwise>
					</xsl:choose>
				</div>
			</td>
			<!-- Procedure Type  -->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:260px;">
					<xsl:variable name="type">
						<xsl:call-template name="getProcedureType">
							<xsl:with-param name="procedure" select="$row/n1:procedure"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($type)>1">
							<xsl:call-template name="flyoverSpan">
								<xsl:with-param name="data" select="$type"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="na"/>
						</xsl:otherwise>
					</xsl:choose>
				</div>
			</td>
			<!-- Procedure Free Text Type-->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:260px;height:1em">
					<xsl:variable name="procFreeText">
						<xsl:call-template name="ltrim">
							<xsl:with-param name="text">
								<xsl:call-template name="getProcedureFreeText">
									<xsl:with-param name="procedure" select="$row/n1:procedure"/>
								</xsl:call-template>
							</xsl:with-param>
							<xsl:with-param name="startChar" select="'~'"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($procFreeText)>1">
							<xsl:call-template name="flyoverSpan">
								<xsl:with-param name="data" select="$procFreeText"/>
								<xsl:with-param name="freeText" select="'yes'"/>
								<xsl:with-param name="deSquigglefy" select="'yes'"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="na"/>
						</xsl:otherwise>
					</xsl:choose>
				</div>
			</td>
			<!-- Procedure Provider-->
			<td>
				<div style="overflow:hidden; white-space:nowrap; width:180px;">
					<xsl:variable name="procProvider">
						<xsl:call-template name="getProcedureProvider">
							<xsl:with-param name="procedure" select="$row/n1:procedure"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:choose>
						<xsl:when test="string-length($procProvider)>1">
							<xsl:call-template name="flyoverSpan">
								<xsl:with-param name="data" select="$procProvider"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="na"/>
						</xsl:otherwise>
					</xsl:choose>
				</div>
			</td>
		</tr>
	</xsl:template>

	<!-- Labs entry row (organizer capable) -->
	<xsl:template name="labsRow">
		<xsl:param name="row"/>
		<xsl:variable name="observation1" select="$row/n1:component/n1:observation"/>
		<xsl:variable name="observation2" select="$row/n1:organizer/n1:component/n1:observation"/>
		<xsl:choose>
			<xsl:when  test="string-length($row/n1:organizer)!=0">
				<tr class="second">
					<!-- Result Date/Time -->
					<td>
						<div style="overflow:hidden; white-space:nowrap; width:100px; padding-right:5px;">
							<xsl:variable name="date">
								<xsl:call-template name="getPanelDT">
									<xsl:with-param name="organizer" select="$row/n1:organizer"/>
								</xsl:call-template>
							</xsl:variable>
							<xsl:choose>
								<xsl:when test="string-length($date)>0">
									<xsl:call-template name="flyoverSpan">
										<xsl:with-param name="data" select="$date"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:call-template name="na"/>
								</xsl:otherwise>
							</xsl:choose>
						</div>
					</td>
					<!-- Organizer Name -->
					<td>
						<div style="overflow:hidden; white-space:nowrap; width:auto;">
							<xsl:variable name="organizerName">
								<xsl:call-template name="getOrganizerName">
									<xsl:with-param name="row" select="$row"/>
								</xsl:call-template>
							</xsl:variable>
							<xsl:choose>
								<xsl:when test="string-length($organizerName)>0">
									<xsl:call-template name="flyoverSpan">
										<xsl:with-param name="data" select="$organizerName"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:call-template name="na"/>
								</xsl:otherwise>
							</xsl:choose>
						</div>
					</td>
					<!-- source -->
					<td>
						<div style="overflow:hidden; white-space:nowrap; width:auto;">
							<xsl:choose>
								<xsl:when test="$row/n1:organizer/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name">
									<xsl:value-of select="$row/n1:organizer/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name"/>
								</xsl:when>
								<xsl:when test="$row/n1:organizer/n1:performer/n1:assignedEntity/n1:representedOrganization/n1:name">
									<xsl:value-of select="$row/n1:organizer/n1:performer/n1:assignedEntity/n1:representedOrganization/n1:name"/>
								</xsl:when>
								<xsl:when test="$row/n1:organizer/n1:component/n1:observation/n1:participant[@typeCode='AUT']/n1:participantRole/n1:scopingEntity/n1:desc">
									<xsl:value-of select="$row/n1:organizer/n1:component/n1:observation/n1:participant[@typeCode='AUT']/n1:participantRole/n1:scopingEntity/n1:desc"/>
								</xsl:when>
                <xsl:when test="$row/n1:organizer/n1:component/n1:procedure/n1:participant[@typeCode='ORG']/n1:participantRole/n1:playingEntity/n1:name">
                  <xsl:value-of select="$row/n1:organizer/n1:component/n1:procedure/n1:participant[@typeCode='ORG']/n1:participantRole/n1:playingEntity/n1:name"/>
                </xsl:when>
								<xsl:otherwise>
									<xsl:call-template name="na"/>
								</xsl:otherwise>
							</xsl:choose>
						</div>
					</td>
					<td>
						<xsl:call-template name="na"/>
					</td>
					<td>
						<xsl:call-template name="na"/>
					</td>
					<td>
						<xsl:call-template name="na"/>
					</td>
					<!-- Result Status -->
					<td>
						<div style="overflow:hidden; white-space:nowrap; width:80px;">
							<xsl:choose>
								<xsl:when test="string-length($row/n1:organizer/n1:statusCode/@code)>0">
									<xsl:call-template name="flyoverSpan">
										<xsl:with-param name="data" select="$row/n1:organizer/n1:statusCode/@code"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:call-template name="na"/>
								</xsl:otherwise>
							</xsl:choose>
						</div>
					</td>
				</tr>
				<xsl:for-each select="$row/n1:organizer/n1:component/n1:observation">
					<tr class="third">
						<td>
              <span>
                <xsl:text disable-output-escaping="yes"> &amp;nbsp; </xsl:text>
              </span>
						</td>
						<!-- Result Type (Free-text)-->
						<td>
							<div style="overflow:hidden; white-space:nowrap; width:auto;">
								<xsl:variable name="typeResult2">
									<xsl:call-template name="getResultType2">
										<xsl:with-param name="observation" select="."/>
									</xsl:call-template>
								</xsl:variable>
								<xsl:choose>
									<xsl:when test="string-length($typeResult2)>0">
										<xsl:call-template name="flyoverSpan">
											<xsl:with-param name="data" select="$typeResult2"/>
										</xsl:call-template>
									</xsl:when>
									<xsl:otherwise>
										<xsl:variable name="typeResult3">
											<xsl:call-template name="getResultType">
												<xsl:with-param name="observation" select="."/>
											</xsl:call-template>
										</xsl:variable>
										<xsl:choose>
											<xsl:when test="string-length($typeResult3)>0">
												<xsl:call-template name="flyoverSpan">
													<xsl:with-param name="data" select="$typeResult3"/>
												</xsl:call-template>
											</xsl:when>
											<xsl:otherwise>
												<xsl:call-template name="na"/>
											</xsl:otherwise>
										</xsl:choose>
									</xsl:otherwise>
								</xsl:choose>
							</div>
						</td>
						<td>
							<xsl:call-template name="na"/>
						</td>
						<!-- Result Value -->
						<td>
							<div style="overflow:hidden; white-space:nowrap; width:110px;">
								<xsl:variable name="valueResult2">
									<xsl:call-template name="getResultValue">
										<xsl:with-param name="observation" select="."/>
									</xsl:call-template>
								</xsl:variable>
								<xsl:choose>
									<xsl:when test="string-length($valueResult2)>0">
										<xsl:call-template name="flyoverSpan">
											<xsl:with-param name="data" select="$valueResult2"/>
										</xsl:call-template>
									</xsl:when>
									<xsl:otherwise>
										<xsl:call-template name="na"/>
									</xsl:otherwise>
								</xsl:choose>
							</div>
						</td>
						<!-- interpretation -->
						<td>
							<div style="overflow:hidden; white-space:nowrap; width:auto;">
								<xsl:variable name="interpResult1">
									<xsl:call-template name="getInterpretation">
										<xsl:with-param name="observation" select="."/>
									</xsl:call-template>
								</xsl:variable>
								<xsl:choose>
									<xsl:when test="string-length($interpResult1)>0">
										<xsl:call-template name="flyoverSpan">
											<xsl:with-param name="data" select="$interpResult1"/>
										</xsl:call-template>
									</xsl:when>
									<xsl:otherwise>
										<xsl:variable name="interpResult2">
											<xsl:call-template name="getInterpretation2">
												<xsl:with-param name="observation" select="."/>
											</xsl:call-template>
										</xsl:variable>
										<xsl:choose>
											<xsl:when test="string-length($interpResult2)>0">
												<xsl:call-template name="flyoverSpan">
													<xsl:with-param name="data" select="$interpResult2"/>
												</xsl:call-template>
											</xsl:when>
											<xsl:otherwise>
												<xsl:call-template name="na"/>
											</xsl:otherwise>
										</xsl:choose>
									</xsl:otherwise>
								</xsl:choose>
							</div>
						</td>
						<!-- ref range -->
						<td>
							<div style="overflow:hidden; white-space:nowrap; width:130px;">
								<xsl:variable name="ref">
									<xsl:call-template name="getRefRange">
										<xsl:with-param name="observation" select="."/>
									</xsl:call-template>
								</xsl:variable>
								<xsl:choose>
									<xsl:when test="string-length($ref)>0">
										<xsl:call-template name="flyoverSpan">
											<xsl:with-param name="data" select="$ref"/>
										</xsl:call-template>
									</xsl:when>
									<xsl:otherwise>
										<xsl:call-template name="na"/>
									</xsl:otherwise>
								</xsl:choose>
							</div>
						</td>
						<!-- Result Status -->
						<td>
							<div style="overflow:hidden; white-space:nowrap; width:80px;">
								<xsl:choose>
									<xsl:when test="string-length(./n1:statusCode/@code)>0">
										<xsl:call-template name="flyoverSpan">
											<xsl:with-param name="data" select="./n1:statusCode/@code"/>
										</xsl:call-template>
									</xsl:when>
									<xsl:otherwise>
										<xsl:call-template name="na"/>
									</xsl:otherwise>
								</xsl:choose>
							</div>
						</td>
					</tr>
				</xsl:for-each>
			</xsl:when>
			<!-- No organizer with lab -->
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="string-length($row/n1:observation/n1:code/@displayName)!=0 or $row/n1:observation/n1:text/n1:reference/@value">
						<tr class="second">
							<!-- Result Date/Time -->
							<td>
								<div style="overflow:hidden; white-space:nowrap; width:auto; padding-right:5px;">
									<xsl:variable name="date2">
										<xsl:call-template name="getResultDT">
											<xsl:with-param name="observation" select="$row/n1:observation"/>
										</xsl:call-template>
									</xsl:variable>
									<xsl:choose>
										<xsl:when test="string-length($date2)>0">
											<xsl:call-template name="flyoverSpan">
												<xsl:with-param name="data" select="$date2"/>
											</xsl:call-template>
										</xsl:when>
										<xsl:otherwise>
											<xsl:call-template name="na"/>
										</xsl:otherwise>
									</xsl:choose>
								</div>
							</td>
							<!-- Result Type (Free-text)-->
							<td>
								<div style="overflow:hidden; white-space:nowrap; width:auto;">
									<xsl:variable name="typeResult2">
										<xsl:call-template name="getResultType2">
											<xsl:with-param name="observation" select="$row/n1:observation"/>
										</xsl:call-template>
									</xsl:variable>
									<xsl:choose>
										<xsl:when test="string-length($typeResult2)>0">
											<xsl:call-template name="flyoverSpan">
												<xsl:with-param name="data" select="$typeResult2"/>
											</xsl:call-template>
										</xsl:when>
										<xsl:otherwise>
											<xsl:variable name="typeResult3">
												<xsl:call-template name="getResultType">
													<xsl:with-param name="observation" select="$row/n1:observation"/>
												</xsl:call-template>
											</xsl:variable>
											<xsl:choose>
												<xsl:when test="string-length($typeResult3)>0">
													<xsl:call-template name="flyoverSpan">
														<xsl:with-param name="data" select="$typeResult3"/>
													</xsl:call-template>
												</xsl:when>
												<xsl:otherwise>
													<xsl:call-template name="na"/>
												</xsl:otherwise>
											</xsl:choose>
										</xsl:otherwise>
									</xsl:choose>
								</div>
							</td>
							<td>
								<xsl:call-template name="na"/>
							</td>
							<!-- Result Value -->
							<td>
								<div style="overflow:hidden; width:120px;">
									<xsl:variable name="valueResult">
										<xsl:call-template name="getResultValue">
											<xsl:with-param name="observation" select="$row/n1:observation"/>
										</xsl:call-template>
									</xsl:variable>
									<xsl:choose>
										<xsl:when test="string-length($valueResult)>0">
											<xsl:call-template name="flyoverSpan">
												<xsl:with-param name="data" select="$valueResult"/>
											</xsl:call-template>
										</xsl:when>
										<xsl:otherwise>
											<xsl:call-template name="na"/>
										</xsl:otherwise>
									</xsl:choose>
								</div>
							</td>
							<!-- interpretation -->
							<td>
								<div style="overflow:hidden; white-space:nowrap; width:120px;">
									<xsl:variable name="interpResult1">
										<xsl:call-template name="getInterpretation2">
											<xsl:with-param name="observation" select="$row/n1:observation"/>
										</xsl:call-template>
									</xsl:variable>
									<xsl:choose>
										<xsl:when test="string-length($interpResult1)>0">
											<xsl:call-template name="flyoverSpan">
												<xsl:with-param name="data" select="$interpResult1"/>
											</xsl:call-template>
										</xsl:when>
										<xsl:otherwise>
											<xsl:variable name="interpResult2">
												<xsl:call-template name="getInterpretation">
													<xsl:with-param name="observation" select="$row/n1:observation"/>
												</xsl:call-template>
											</xsl:variable>
											<xsl:choose>
												<xsl:when test="string-length($interpResult2)>0">
													<xsl:call-template name="flyoverSpan">
														<xsl:with-param name="data" select="$interpResult2"/>
													</xsl:call-template>
												</xsl:when>
												<xsl:otherwise>
													<xsl:call-template name="na"/>
												</xsl:otherwise>
											</xsl:choose>
										</xsl:otherwise>
									</xsl:choose>
								</div>
							</td>
							<!-- ref range -->
							<td>
								<div style="overflow:hidden; white-space:nowrap; width:120px;">
									<xsl:variable name="ref">
										<xsl:call-template name="getRefRange">
											<xsl:with-param name="observation" select="$row/n1:observation"/>
										</xsl:call-template>
									</xsl:variable>
									<xsl:choose>
										<xsl:when test="string-length($ref)>0">
											<xsl:call-template name="flyoverSpan">
												<xsl:with-param name="data" select="$ref"/>
											</xsl:call-template>
										</xsl:when>
										<xsl:otherwise>
											<xsl:call-template name="na"/>
										</xsl:otherwise>
									</xsl:choose>
								</div>
							</td>
							<!-- Result Status -->
							<td>
								<div style="overflow:hidden; white-space:nowrap; width:80px;">
									<xsl:choose>
										<xsl:when test="string-length($row/n1:observation/n1:statusCode/@code)>0">
											<xsl:call-template name="flyoverSpan">
												<xsl:with-param name="data" select="$row/n1:observation/n1:statusCode/@code"/>
											</xsl:call-template>
										</xsl:when>
										<xsl:otherwise>
											<xsl:call-template name="na"/>
										</xsl:otherwise>
									</xsl:choose>
								</div>
							</td>
							<td>
								<xsl:call-template name="na"/>
							</td>
						</tr>
					</xsl:when>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

  <!-- immunization entry row -->
  <xsl:template name="immunizationsRow">
    <xsl:param name="row"/>
    <xsl:variable name="rowData" select="$row/n1:substanceAdministration/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial"/>
    <xsl:variable name="rowSubj" select="$row/n1:substanceAdministration/n1:entryRelationship[@typeCode='SUBJ']/n1:observation"/>
    <xsl:variable name="rowCause" select="$row/n1:substanceAdministration[@classCode='SBADM']/n1:entryRelationship[@typeCode='CAUS' and @inversionInd='false']/n1:observation"/>
    <xsl:variable name="substanceAdministration" select="$row/n1:substanceAdministration"/>
    <tr class="second">
      <!-- name -->
      <td>
        <div style="overflow:hidden; white-space:nowrap; width:200px;">
          <xsl:variable name="immunizationResult">
            <xsl:call-template name="getImmunization">
              <xsl:with-param name="substanceAdministration" select="$substanceAdministration"/>
            </xsl:call-template>
          </xsl:variable>
          <xsl:choose>
            <xsl:when test="string-length($immunizationResult)>0">
              <xsl:call-template name="flyoverSpan">
                <xsl:with-param name="data" select="$immunizationResult"/>
              </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
              <xsl:call-template name="na"/>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </td>
      <!-- series -->
      <td>
        <div style="overflow:hidden; white-space:nowrap; width:100px;">
          <xsl:call-template name="flyoverSpan">
            <xsl:with-param name="data" select="$rowSubj/n1:value/@value"/>
          </xsl:call-template>
        </div>
      </td>
      <!--  effective date -->
      <td>
        <div style="overflow:hidden; white-space:nowrap; width:100px;">
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
        </div>
      </td>
      <!-- reaction -->
      <td>
        <div style="overflow:hidden; white-space:nowrap; width:260px;">
          <xsl:variable name="reactionReference" select="$rowCause/n1:text/n1:reference/@value"/>
          <xsl:variable name="reaction" select="../n1:text//n1:content[@ID=substring-after($reactionReference,'#')]"/>
          <xsl:call-template name="flyoverSpan">
            <xsl:with-param name="data" select="$reaction"/>
          </xsl:call-template>
        </div>
      </td>
      <!-- comments -->
      <td>
        <xsl:variable name="commentReference" select="$row/n1:substanceAdministration/n1:text/n1:reference/@value"/>
        <div style="overflow:hidden; white-space:nowrap; width:240px;">
          <xsl:call-template name="flyoverSpan">
            <xsl:with-param name="data" select="../n1:text//n1:content[@ID=substring-after($commentReference,'#')]"/>
          </xsl:call-template>
        </div>
      </td>
    </tr>
  </xsl:template>

  <!-- vitals entry row -->
  <xsl:template name="vitalsRow">
    <xsl:param name="row"/>
    <xsl:variable name="rowData" select="$row/n1:organizer/n1:component/n1:observation"/>
    <xsl:variable name="height" select="$row/n1:organizer/n1:component/n1:observation[n1:code/@code=$loincHeight]"/>
    <xsl:variable name="weight" select="$row/n1:organizer/n1:component/n1:observation[n1:code/@code=$loincWeight]"/>
    <xsl:variable name="systolic" select="$row/n1:organizer/n1:component/n1:observation[n1:code/@code=$loincBpSystolic]"/>
    <xsl:variable name="diastolic" select="$row/n1:organizer/n1:component/n1:observation[n1:code/@code=$loincBpDiastolic]"/>
    <xsl:variable name="temp" select="$row/n1:organizer/n1:component/n1:observation[n1:code/@code=$loincTemperature]"/>
    <xsl:variable name="pulse" select="$row/n1:organizer/n1:component/n1:observation[n1:code/@code=$loincPulse]"/>
    <xsl:variable name="resp" select="$row/n1:organizer/n1:component/n1:observation[n1:code/@code=$loincRespiration]"/>
    <xsl:variable name="pox" select="$row/n1:organizer/n1:component/n1:observation[n1:code/@code=$loincPulseOximetry]"/>
    <xsl:variable name="bloodPressure" select="$row/n1:organizer/n1:component/n1:observation[n1:code/@code=$loincBloodPressure]"/>
    <xsl:variable name="bodyHtLying" select="$row/n1:organizer/n1:component/n1:observation[n1:code/@code=$loincBodyHtLying]"/>
    <xsl:variable name="headCircumOCF" select="$row/n1:organizer/n1:component/n1:observation[n1:code/@code=$loincOCF]"/>
    <xsl:variable name="weight2" select="$row/n1:organizer/n1:component/n1:observation[n1:code/@code=$loincWeight2]"/>
    <tr class="second">
      <!-- Date -->
      <td>
        <div style="overflow:hidden; white-space:nowrap; width:80px;">
          <xsl:choose>
            <xsl:when test="string-length($rowData/n1:effectiveTime/@value)=0">
              <xsl:text>-- Not Available --</xsl:text>
            </xsl:when>
            <xsl:otherwise>
              <xsl:call-template name="formatDateShort">
                <xsl:with-param name="dateString" select="$rowData/n1:effectiveTime/@value"/>
              </xsl:call-template>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </td>
      <!-- temp -->
      <td>
        <div style="overflow:hidden; white-space:nowrap; width:70px;">
          <xsl:choose>
            <xsl:when test="$temp">
              <xsl:for-each select="$temp">
                <xsl:if test="position()>1">
                  <br/>
                </xsl:if>
                <xsl:choose>
                  <xsl:when test="string-length(n1:value/@value)>1">
                    <xsl:variable name="tempResult" select="n1:value/@value"/>
                    <xsl:choose>
                      <xsl:when test="n1:value/@unit">
                        <xsl:call-template name="flyoverSpan">
                          <xsl:with-param name="data" select="concat($tempResult,n1:value/@unit)"/>
                        </xsl:call-template>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:call-template name="flyoverSpan">
                          <xsl:with-param name="data" select="$tempResult"/>
                        </xsl:call-template>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:when>
                </xsl:choose>
              </xsl:for-each>
            </xsl:when>
            <xsl:otherwise>
              <xsl:call-template name="na"/>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </td>
      <!-- pulse -->
      <td>
        <div style="overflow:hidden; white-space:nowrap; width:70px;">
          <xsl:choose>
            <xsl:when test="$pulse">
              <xsl:for-each select="$pulse">
                <xsl:if test="position()>1">
                  <br/>
                </xsl:if>
                <xsl:choose>
                  <xsl:when test="string-length(n1:value/@value)>1">
                    <xsl:variable name="pulseResult" select="n1:value/@value"/>
                    <xsl:choose>
                      <xsl:when test="n1:value/@unit">
                        <xsl:call-template name="flyoverSpan">
                          <xsl:with-param name="data" select="concat($pulseResult,n1:value/@unit)"/>
                        </xsl:call-template>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:call-template name="flyoverSpan">
                          <xsl:with-param name="data" select="$pulseResult"/>
                        </xsl:call-template>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:when>
                </xsl:choose>
              </xsl:for-each>
            </xsl:when>
            <xsl:otherwise>
              <xsl:call-template name="na"/>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </td>
      <!-- resp -->
      <td>
        <div style="overflow:hidden; white-space:nowrap; width:70px;">
          <xsl:choose>
            <xsl:when test="$resp">
              <xsl:for-each select="$resp">
                <xsl:if test="position()>1">
                  <br/>
                </xsl:if>
                <xsl:choose>
                  <xsl:when test="string-length(n1:value/@value)>1">
                    <xsl:variable name="respResult" select="n1:value/@value"/>
                    <xsl:choose>
                      <xsl:when test="n1:value/@unit">
                        <xsl:call-template name="flyoverSpan">
                          <xsl:with-param name="data" select="concat($respResult,n1:value/@unit)"/>
                        </xsl:call-template>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:call-template name="flyoverSpan">
                          <xsl:with-param name="data" select="$respResult"/>
                        </xsl:call-template>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:when>
                </xsl:choose>
              </xsl:for-each>
            </xsl:when>
            <xsl:otherwise>
              <xsl:call-template name="na"/>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </td>
      <!-- BP  systolic / diastolic -->
      <td>
        <div style="overflow:hidden; white-space:nowrap; width:70px;">
          <xsl:choose>
            <xsl:when test="$systolic/n1:value/@value or $diastolic/n1:value/@value or $bloodPressure/n1:value/@value">
              <xsl:call-template name="bpDetailLister">
                <xsl:with-param name="systolics" select="$systolic"/>
                <xsl:with-param name="diastolics" select="$diastolic"/>
              </xsl:call-template>
              <xsl:if test="$systolic/n1:value/@value and $bloodPressure/n1:value/@value">
                <br/>
              </xsl:if>
              <xsl:for-each select="$bloodPressure">
                <xsl:if test="position()>1">
                  <br/>
                </xsl:if>
                <xsl:value-of select="n1:value/@value"/>
              </xsl:for-each>
            </xsl:when>
            <xsl:otherwise>
              <xsl:call-template name="na"/>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </td>
      <!-- height -->
      <td>
        <div style="overflow:hidden; white-space:nowrap; width:70px;">
          <xsl:choose>
            <xsl:when test="$height">
              <xsl:for-each select="$height">
                <xsl:if test="position()>1">
                  <br/>
                </xsl:if>
                <xsl:choose>
                  <xsl:when test="string-length(n1:value/@value)>1">
                    <xsl:variable name="heightResult" select="n1:value/@value"/>
                    <xsl:choose>
                      <xsl:when test="n1:value/@unit">
                        <xsl:call-template name="flyoverSpan">
                          <xsl:with-param name="data" select="concat($heightResult,n1:value/@unit)"/>
                        </xsl:call-template>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:call-template name="flyoverSpan">
                          <xsl:with-param name="data" select="$heightResult"/>
                        </xsl:call-template>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:when>
                </xsl:choose>
              </xsl:for-each>
            </xsl:when>
            <xsl:otherwise>
              <xsl:call-template name="na"/>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </td>
      <!-- height lying-->
      <td>
        <div style="overflow:hidden; white-space:nowrap; width:70px;">
          <xsl:choose>
            <xsl:when test="$bodyHtLying">
              <xsl:for-each select="$bodyHtLying">
                <xsl:if test="position()>1">
                  <br/>
                </xsl:if>
                <xsl:choose>
                  <xsl:when test="string-length(n1:value/@value)>1">
                    <xsl:variable name="heightLyResult" select="n1:value/@value"/>
                    <xsl:choose>
                      <xsl:when test="n1:value/@unit">
                        <xsl:call-template name="flyoverSpan">
                          <xsl:with-param name="data" select="concat($heightLyResult,n1:value/@unit)"/>
                        </xsl:call-template>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:call-template name="flyoverSpan">
                          <xsl:with-param name="data" select="$heightLyResult"/>
                        </xsl:call-template>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:when>
                </xsl:choose>
              </xsl:for-each>
            </xsl:when>
            <xsl:otherwise>
              <xsl:call-template name="na"/>
            </xsl:otherwise>
          </xsl:choose>

        </div>
      </td>
      <!-- weight -->
      <td>
        <div style="overflow:hidden; white-space:nowrap; width:70px;">
          <xsl:choose>
            <xsl:when test="string-length($weight2)>1">
              <xsl:call-template name="getWeightResult">
                <xsl:with-param name="wt" select="$weight2"/>
              </xsl:call-template>
            </xsl:when>
            <xsl:when test="$weight">
              <xsl:call-template name="getWeightResult">
                <xsl:with-param name="wt" select="$weight"/>
              </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
              <xsl:call-template name="na"/>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </td>
      <!-- pox -->
      <td>
        <div style="overflow:hidden; white-space:nowrap; width:70px;">
          <xsl:choose>
            <xsl:when test="$pox">
              <xsl:for-each select="$pox">
                <xsl:if test="position()>1">
                  <br/>
                </xsl:if>
                <xsl:choose>
                  <xsl:when test="string-length(n1:value/@value)>1">
                    <xsl:variable name="poxResult" select="n1:value/@value"/>
                    <xsl:choose>
                      <xsl:when test="n1:value/@unit">
                        <xsl:call-template name="flyoverSpan">
                          <xsl:with-param name="data" select="concat($poxResult,n1:value/@unit)"/>
                        </xsl:call-template>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:call-template name="flyoverSpan">
                          <xsl:with-param name="data" select="$poxResult"/>
                        </xsl:call-template>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:when>
                </xsl:choose>
              </xsl:for-each>
            </xsl:when>
            <xsl:otherwise>
              <xsl:call-template name="na"/>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </td>
      <!-- OCF -->
      <td>
        <div style="overflow:hidden; white-space:nowrap; width:70px;">
          <xsl:choose>
            <xsl:when test="$headCircumOCF">
              <xsl:for-each select="$headCircumOCF">
                <xsl:if test="position()>1">
                  <br/>
                </xsl:if>
                <xsl:choose>
                  <xsl:when test="string-length(n1:value/@value)>1">
                    <xsl:variable name="OCFResult" select="n1:value/@value"/>
                    <xsl:choose>
                      <xsl:when test="n1:value/@unit">
                        <xsl:call-template name="flyoverSpan">
                          <xsl:with-param name="data" select="concat($OCFResult,n1:value/@unit)"/>
                        </xsl:call-template>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:call-template name="flyoverSpan">
                          <xsl:with-param name="data" select="$OCFResult"/>
                        </xsl:call-template>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:when>
                </xsl:choose>
              </xsl:for-each>
            </xsl:when>
            <xsl:otherwise>
              <xsl:call-template name="na"/>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </td>
      <!-- source -->
      <td>
        <div style="overflow:hidden; white-space:nowrap; width:150px;">
          <xsl:choose>
            <xsl:when test="string-length($row/n1:organizer/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name)>1">
              <xsl:call-template name="flyoverSpan">
                <xsl:with-param name="data" select="$row/n1:organizer/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name"/>
              </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
              <xsl:call-template name="na"/>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </td>
    </tr>
  </xsl:template>

	<!--   flyover -->
	<xsl:template name="flyoverSpan">
		<xsl:param name="data"/>
		<xsl:param name="freeText"/>
		<xsl:param name="deSquigglefy"/>
		<xsl:element name="span">
			<xsl:attribute name="onmouseover">
				<xsl:choose>
					<xsl:when test="$freeText">
						<xsl:text>DisplayTip(this,25,-50,1)</xsl:text>
					</xsl:when>
					<xsl:otherwise>
						<xsl:text>DisplayTip(this,25,-50,0)</xsl:text>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:attribute>
			<xsl:choose>
				<xsl:when test="$data">
					<xsl:choose>
						<xsl:when test="$deSquigglefy">
							<xsl:call-template name="replaceSquigglesWithBreaks">
								<xsl:with-param name="text" select="$data"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="$data"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="na"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:element>
	</xsl:template>

	<xsl:template name="replaceSquigglesWithBreaks">
		<xsl:param name="text"/>
		<xsl:if test="$text">
			<xsl:choose>
				<xsl:when test="contains($text,'~')">
					<xsl:value-of select="substring-before($text,'~')"/>
					<br/>
					<xsl:call-template name="replaceSquigglesWithBreaks">
						<xsl:with-param name="text" select="substring-after($text,'~')"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$text"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
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
				<h3>
					<span style="font-weight:bold;line-height:40%">
						<a name="{generate-id(.)}" href="#toc">
							<xsl:value-of select="."/>
						</a>
					</span>
				</h3>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

	<!--   Text   -->
	<xsl:template match="n1:text">
		<xsl:apply-templates />
	</xsl:template>

	<!--   paragraph  -->
	<xsl:template match="n1:paragraph">
		<p>
			<xsl:apply-templates/>
		</p>
	</xsl:template>

	<!--     Content w/ deleted text is hidden -->
	<xsl:template match="n1:content[@revised='delete']"/>

	<!--   content  -->
	<xsl:template match="n1:content">
		<xsl:apply-templates/>
	</xsl:template>


	<!--   list  -->
	<xsl:template match="n1:list">
		<xsl:if test="n1:caption">
			<span style="font-weight:bold; ">
				<xsl:apply-templates select="n1:caption"/>
			</span>
		</xsl:if>
		<ul>
			<xsl:for-each select="n1:item">
				<li>
					<xsl:apply-templates />
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

	<!--   RenderMultiMedia 

         this currently only handles GIF's and JPEG's.  It could, however,
	 be extended by including other image MIME types in the predicate
	 and/or by generating <object> or <applet> tag with the correct
	 params depending on the media type  @ID  =$imageRef     referencedObject
 -->
	<xsl:template match="n1:renderMultiMedia">
		<xsl:variable name="imageRef" select="@referencedObject"/>
		<xsl:choose>
			<xsl:when test="//n1:regionOfInterest[@ID=$imageRef]">
				<!-- Here is where the Region of Interest image referencing goes -->
				<xsl:if test='//n1:regionOfInterest[@ID=$imageRef]//n1:observationMedia/n1:value[@mediaType="image/gif" or @mediaType="image/jpeg"]'>
					<br clear='all'/>
					<xsl:element name='img'>
						<xsl:attribute name='src'>
							<xsl:value-of select='//n1:regionOfInterest[@ID=$imageRef]//n1:observationMedia/n1:value/n1:reference/@value'/>
						</xsl:attribute>
					</xsl:element>
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				<!-- Here is where the direct MultiMedia image referencing goes -->
				<xsl:if test='//n1:observationMedia[@ID=$imageRef]/n1:value[@mediaType="image/gif" or @mediaType="image/jpeg"]'>
					<br clear='all'/>
					<xsl:element name='img'>
						<xsl:attribute name='src'>
							<xsl:value-of select='//n1:observationMedia[@ID=$imageRef]/n1:value/n1:reference/@value'/>
						</xsl:attribute>
					</xsl:element>
				</xsl:if>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- 	Stylecode processing   
	  Supports Bold, Underline and Italics display

-->

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
		<p>
			<xsl:variable name="found"/>
			<xsl:call-template name="getName">
				<xsl:with-param name="name" select="n1:legalAuthenticator/n1:assignedEntity/n1:representedOrganization/n1:name"/>
			</xsl:call-template>
			<xsl:choose>
				<xsl:when test="$found">
					<b>
						<xsl:text>Electronically generated by: </xsl:text>
						<xsl:value-of select="$found"/>
					</b>
				</xsl:when>
				<xsl:otherwise>
					<b>
						<xsl:text disable-output-escaping="yes">Electronically generated on:&amp;nbsp; </xsl:text>
						<xsl:value-of select="$found"/>
					</b>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:choose>
				<xsl:when test="string-length(n1:effectiveTime/@value)=0">
					<xsl:call-template name="na"/>
				</xsl:when>
				<xsl:when test="starts-with(n1:effectiveTime/@value,' ')">
					<xsl:call-template name="na"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:variable name="dateFound"/>
					<xsl:call-template name="formatDateLong">
						<xsl:with-param name="dateString" select="n1:effectiveTime/@value"/>
					</xsl:call-template>
					<xsl:if test="($dateFound) and not ($found)">
						<xsl:text disable-output-escaping="yes">&amp;nbsp;on&amp;nbsp; </xsl:text>
						<xsl:value-of select="$dateFound"/>
					</xsl:if>
					<xsl:if test="($dateFound) and ($found)">
						<xsl:value-of select="$dateFound"/>
					</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
		</p>
		<div id="TipBox" style="display:none;position:absolute;font-size:12px;font-weight:bold;font-family:verdana;border:#72B0E6 solid 1px;padding:15px;color:black;background-color:#FFFFFF;">
			<xsl:text disable-output-escaping="yes">&amp;nbsp;</xsl:text>
		</div>
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

	<xsl:template name="na">
		<span title="Not Available">
			<xsl:text>--</xsl:text>
		</span>
	</xsl:template>

	<!-- free text processing -->

	<xsl:template name="freeText">
		<xsl:param name="text"/>

	</xsl:template>

	<xsl:template name="display1LineBreak">
		<br/>
	</xsl:template>

	<xsl:template name="displayVitalsMultiSeparator">
		<xsl:call-template name="display1LineBreak"/>
	</xsl:template>

	<xsl:template name="displayVitalRow">
		<xsl:param name="row"/>
		<tr class="second">
			<xsl:call-template name="displayVitalItems">
				<xsl:with-param name="row" select="$row"/>
			</xsl:call-template>
		</tr>
	</xsl:template>

	<xsl:template name="displayVitalsDateItem">
		<xsl:param name="rowData"/>
		<td>
			<div style="overflow:hidden; white-space:nowrap; width:80px;">
				<xsl:call-template name="displayVitalsDate">
					<xsl:with-param name="rowData" select="$rowData"/>
				</xsl:call-template>
			</div>
		</td>
	</xsl:template>

	<xsl:template name="displayVitalsTempItem">
		<xsl:param name="temp"/>
		<td>
			<div style="overflow:hidden; white-space:nowrap; width:70px;">
				<xsl:call-template name="displayVitalsTemp">
					<xsl:with-param name="temp" select="$temp"/>
				</xsl:call-template>
			</div>
		</td>
	</xsl:template>

	<xsl:template name="displayVitalsSourceItem">
		<xsl:param name="row"/>
		<td>
			<div style="overflow:hidden; white-space:nowrap; width:150px;">
				<xsl:call-template name="displayVitalsSource">
					<xsl:with-param name="row" select="$row"/>
				</xsl:call-template>
			</div>
		</td>
	</xsl:template>

	<xsl:template name="displayVitalsPoxItem">
		<xsl:param name="pox"/>
		<td>
			<div style="overflow:hidden; white-space:nowrap; width:70px;">
				<xsl:call-template name="displayVitalsPox">
					<xsl:with-param name="pox" select="$pox"/>
				</xsl:call-template>
			</div>
		</td>
	</xsl:template>

	<xsl:template name="displayVitalsWeightItem">
		<xsl:param name="weight"/>
		<td>
			<div style="overflow:hidden; white-space:nowrap; width:70px;">
				<xsl:call-template name="displayVitalsWeight">
					<xsl:with-param name="weight" select="$weight"/>
				</xsl:call-template>
			</div>
		</td>
	</xsl:template>

	<xsl:template name="displayVitalsHeightItem">
		<xsl:param name="height"/>
		<td>
			<div style="overflow:hidden; white-space:nowrap; width:70px;">
				<xsl:call-template name="displayVitalsHeight">
					<xsl:with-param name="height" select="$height"/>
				</xsl:call-template>
			</div>
		</td>
	</xsl:template>

	<xsl:template name="displayVitalsBpItem">
		<xsl:param name="row"/>
		<td>
			<div style="overflow:hidden; white-space:nowrap; width:70px;">
				<xsl:call-template name="displayVitalsBp">
					<xsl:with-param name="row" select="$row"/>
				</xsl:call-template>
			</div>
		</td>
	</xsl:template>

	<xsl:template name="displayVitalsRespItem">
		<xsl:param name="resp"/>
		<td>
			<div style="overflow:hidden; white-space:nowrap; width:70px;">
				<xsl:call-template name="displayVitalsResp">
					<xsl:with-param name="resp" select="$resp"/>
				</xsl:call-template>
			</div>
		</td>
	</xsl:template>

	<xsl:template name="displayVitalsPulseItem">
		<xsl:param name="pulse"/>
		<td>
			<div style="overflow:hidden; white-space:nowrap; width:70px;">
				<xsl:call-template name="displayVitalsPulse">
					<xsl:with-param name="pulse" select="$pulse"/>
				</xsl:call-template>
			</div>
		</td>
	</xsl:template>

	<xsl:template name="getWeightResult">
		<xsl:param name="wt" />
		<xsl:for-each select="$wt">
			<xsl:if test="position()>1">
				<br/>
			</xsl:if>
			<xsl:choose>
				<xsl:when test="string-length(n1:value/@value)>1">
					<xsl:variable name="weightResult" select="n1:value/@value"/>
					<xsl:choose>
						<xsl:when test="n1:value/@unit">
							<xsl:call-template name="flyoverSpan">
								<xsl:with-param name="data" select="concat($weightResult,n1:value/@unit)"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="flyoverSpan">
								<xsl:with-param name="data" select="$weightResult"/>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="na"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>

	</xsl:template>

</xsl:stylesheet>
