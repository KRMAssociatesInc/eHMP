<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:n1="urn:hl7-org:v3"
  xmlns:ns="urn:schemas-microsoft-com:xslt">

	<xsl:import href="formatting.xsl"/>
	<xsl:import href="../common.xsl"/>

  <xsl:variable name="isIHIE" select="boolean(/n1:ClinicalDocument/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:id[@root='2.16.840.1.113883.3.1181'])"/>
  <xsl:variable name="isKaiser" select="boolean(/n1:ClinicalDocument/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:id[@root='1.3.6.1.4.1.26580'])"/>
	<xsl:variable name="isDoD" select="boolean(/n1:ClinicalDocument/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:id[@root='2.16.840.1.113883.3.42.10001.100001.12'])"/>
	<xsl:variable name="isMVA" select="boolean(/n1:ClinicalDocument/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:id[@root='2.16.840.1.113883.3.190'])"/>
	<xsl:variable name="isINHS" select="boolean(/n1:ClinicalDocument/n1:author/n1:assignedAuthor/n1:id[@root='2.16.840.1.113883.3.715'])"/>
	<xsl:variable name="isMultiCare" select="boolean((/n1:ClinicalDocument/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:id[@root='1.2.840.114350.1.13.60.2.7.2.696570']) or (/n1:ClinicalDocument/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:id[@root='1.2.840.114350.1.13.77002.1.7.2.696570']))"/>
	<xsl:variable name="noMdoProb" select="boolean(/n1:ClinicalDocument/n1:component/n1:structuredBody/n1:component/n1:section/n1:entry/n1:act/n1:entryRelationship/n1:observation/n1:value[@code='396782006'])"/>
	<xsl:variable name="noMed" select="boolean(/n1:ClinicalDocument/n1:component/n1:structuredBody/n1:component/n1:section/n1:entry/n1:substanceAdministration/n1:code[@code='182849000'])"/>
	<xsl:variable name="noMdoResult" select="boolean(/n1:ClinicalDocument/n1:component/n1:structuredBody/n1:component/n1:section/n1:entry/n1:organizer/n1:code[@code='261665006'])"/>
	<xsl:variable name="allergyNkaCode">160244002</xsl:variable>

	<xsl:template name="facilityProperty">
		<xsl:variable name="root" select="/n1:ClinicalDocument"/>
		<Facility>
			<xsl:choose>
				<xsl:when test="$root/n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:name and string-length($root/n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:name)>0">
					<xsl:value-of select="$root/n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:name"/>
				</xsl:when>

				<xsl:when test="$root/n1:documentationOf/n1:serviceEvent/n1:performer/n1:assignedEntity/n1:representedOrganization/n1:name and string-length($root/n1:documentationOf/n1:serviceEvent/n1:performer/n1:assignedEntity/n1:representedOrganization/n1:name)>0">
					<xsl:value-of select="$root/n1:documentationOf/n1:serviceEvent/n1:performer/n1:assignedEntity/n1:representedOrganization/n1:name"/>
				</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</Facility>

	</xsl:template>

	<xsl:template name="genderString">
		<xsl:param name="sex" select="'unknown'"/>
		<xsl:choose>
			<xsl:when test="$sex='M' or $sex='m' or $sex='Male' or $sex='male'">
				<xsl:text>Male</xsl:text>
			</xsl:when>
			<xsl:when test="$sex='F' or $sex='f' or $sex='Female' or $sex='female'">
				<xsl:text>Female</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

  <xsl:template name="displayLanguages">
    <xsl:param name="patientRole"/>
    <xsl:choose>
      <xsl:when test="string-length(normalize-space($patientRole/n1:patient/n1:languageCommunication/n1:languageCode/@code))>0">
        <xsl:apply-templates select="$patientRole/n1:patient/n1:languageCommunication/n1:languageCode"/>
      </xsl:when>
    </xsl:choose>
  </xsl:template>

	<xsl:template match="n1:languageCode" mode="data">
		<xsl:choose>
			<xsl:when test="string-length(@code)=0"/>
			<xsl:when test="@code='en' or @code='en-US'">
				<xsl:text>English</xsl:text>
			</xsl:when>
			<xsl:when test="@code='es' or @code='es-US'">
				<xsl:text>Spanish</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="@code"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

  <xsl:template name="isLanguageFound">
    <xsl:param name="patientRole"/>
    <xsl:variable name="langs">
      <xsl:value-of select="$patientRole/n1:patient/n1:languageCommunication/n1:languageCode/@code"/>
    </xsl:variable>
    <xsl:value-of select="string-length(normalize-space($langs))>0"/>
  </xsl:template>
	
	<!-- Allergies -->

	<xsl:template name="getAllergen">
		<xsl:param name="observation"/>
		<xsl:if test="$observation">
			<xsl:choose>
				<xsl:when test="$observation/n1:value[@code=$allergyNkaCode]">
					<xsl:text>NKA</xsl:text>
				</xsl:when>
				<xsl:when test="string-length($observation/n1:participant/n1:participantRole/n1:playingEntity/n1:name)>1">
					<xsl:value-of select="$observation/n1:participant/n1:participantRole/n1:playingEntity/n1:name"/>
				</xsl:when>
				<xsl:when test="$observation/n1:text/n1:reference/@value">
					<xsl:variable name = "reactionNameRef1" select="$observation/n1:text/n1:reference/@value"/>
					<xsl:variable name = "reactionNameRef2" select="substring($observation/n1:text/n1:reference/@value,2)"/>
					<xsl:if test="../n1:text//n1:td[@ID=$reactionNameRef1]">
						<xsl:value-of select="../n1:text//n1:td[@ID=$reactionNameRef1]"/>
					</xsl:if>
					<xsl:if test="../n1:text//n1:td[@ID=$reactionNameRef2]">
						<xsl:value-of select="../n1:text//n1:td[@ID=$reactionNameRef2]"/>
					</xsl:if>
					<xsl:if test="../n1:text//n1:content[@ID=$reactionNameRef1]">
						<xsl:value-of select="../n1:text//n1:content[@ID=$reactionNameRef1]"/>
					</xsl:if>
					<xsl:if test="../n1:text//n1:content[@ID=$reactionNameRef2]">
						<xsl:value-of select="../n1:text//n1:content[@ID=$reactionNameRef2]"/>
					</xsl:if>
				</xsl:when>
				<xsl:when test="$observation/n1:participant[@typeCode='CSM']/n1:participantRole[@classCode='MANU']/n1:playingEntity[@classCode='MMAT']/n1:code/n1:originalText/n1:reference/@value">
					<xsl:variable name = "reactionNameRef1" select="$observation/n1:participant/n1:participantRole/n1:playingEntity/n1:code/n1:originalText/n1:reference/@value"/>
					<xsl:variable name = "reactionNameRef2" select="substring-after($observation/n1:participant/n1:participantRole/n1:playingEntity/n1:code/n1:originalText/n1:reference/@value,'#')"/>
					<xsl:if test="../n1:text//n1:td[@ID=$reactionNameRef1]">
						<xsl:value-of select="../n1:text//n1:td[@ID=$reactionNameRef1]"/>
					</xsl:if>
					<xsl:if test="../n1:text//n1:td[@ID=$reactionNameRef2]">
						<xsl:value-of select="../n1:text//n1:td[@ID=$reactionNameRef2]"/>
					</xsl:if>
					<xsl:if test="../n1:text//n1:content[@ID=$reactionNameRef1]">
						<xsl:value-of select="../n1:text//n1:content[@ID=$reactionNameRef1]"/>
					</xsl:if>
					<xsl:if test="../n1:text//n1:content[@ID=$reactionNameRef2]">
						<xsl:value-of select="../n1:text//n1:content[@ID=$reactionNameRef2]"/>
					</xsl:if>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$observation/n1:participant[@typeCode='CSM']/n1:participantRole[@classCode='MANU']/n1:playingEntity[@classCode='MMAT']"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

	<xsl:template name="getAllergenText">
		<xsl:param name="observation"/>
		<xsl:if test="$observation">
			<xsl:choose>
				<xsl:when test="$observation/n1:participant/n1:participantRole/n1:playingEntity/n1:name or $observation/n1:participant[@typeCode='CSM']/n1:participantRole[@classCode='MANU']/n1:playingEntity[@classCode='MMAT']/@name">
					<xsl:value-of select="$observation/n1:participant/n1:participantRole/n1:playingEntity/n1:name"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$observation/participant[@typeCode='CSM']/n1:participantRole[@classCode='MANU']/n1:playingEntity[@classCode='MMAT']/@name"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

	<xsl:template name="getAllergyVerificationDate">
		<xsl:param name="observation"/>
		<xsl:if test="string-length($observation/n1:effectiveTime/n1:low/@value)>0">
			<xsl:value-of select="$observation/n1:effectiveTime/n1:low/@value"/>
		</xsl:if>
	</xsl:template>

	<xsl:template name="getEventType">
		<xsl:param name="obs"/>
		<xsl:choose>
			<xsl:when test="$obs/n1:code/@displayName and not($isKaiser)">
				<xsl:value-of select="$obs/n1:code/@displayName"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="getReactionValueFromReference">
		<xsl:param name="reactionReference"/>
		<xsl:param name="section"/>
		<xsl:variable name="reactionValue" select="$section//n1:content[@ID=$reactionReference]"/>
		<xsl:variable name="reactionValue2" select="$section//n1:content[@ID=substring-after($reactionReference,'#')]"/>
		<xsl:variable name="reactionValue3" select="$section//n1:td[@ID=$reactionReference]"/>
		<xsl:variable name="reactionValue4" select="$section//n1:td[@ID=substring-after($reactionReference,'#')]"/>
		<xsl:if test="string-length($reactionValue)>0">
			<xsl:if test="position()>1">
				<xsl:text>, </xsl:text>
			</xsl:if>
			<xsl:value-of select="$reactionValue"/>
		</xsl:if>
		<xsl:if test="string-length($reactionValue2)>0">
			<xsl:if test="position()>1">
				<xsl:text>, </xsl:text>
			</xsl:if>
			<xsl:value-of select="$reactionValue2"/>
		</xsl:if>
		<xsl:if test="string-length($reactionValue3)>0">
			<xsl:if test="position()>1">
				<xsl:text>, </xsl:text>
			</xsl:if>
			<xsl:value-of select="$reactionValue3"/>
		</xsl:if>
		<xsl:if test="string-length($reactionValue4)>0">
			<xsl:if test="position()>1">
				<xsl:text>, </xsl:text>
			</xsl:if>
			<xsl:value-of select="$reactionValue4"/>
		</xsl:if>
	</xsl:template>
  
  <xsl:template name="getReactionValue">
    <xsl:param name="entryRelationship"/>
    <xsl:variable name="section" select="$entryRelationship/../../../n1:text"/>
    <xsl:choose>
      <xsl:when test="$entryRelationship/n1:observation/n1:entryRelationship[@typeCode='MFST']/n1:observation/n1:text/n1:reference[@value]">
        <xsl:for-each select="$entryRelationship/n1:observation/n1:entryRelationship[@typeCode='MFST']/n1:observation/n1:text/n1:reference">
          <xsl:call-template name="getReactionValueFromReference">
            <xsl:with-param name="reactionReference" select="@value"/>
            <xsl:with-param name="section" select="$section"/>
          </xsl:call-template>
        </xsl:for-each>
      </xsl:when>      
    </xsl:choose>
  </xsl:template>  
 
	<xsl:template name="getAllergySource">
		<xsl:param name="row"/>
		<xsl:choose>
			<xsl:when test="$row/n1:act/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name">
				<xsl:value-of select="$row/n1:act/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name"/>
			</xsl:when>
			<xsl:when test="$row/n1:act/n1:performer/n1:assignedEntity/n1:representedOrganization/n1:name">
				<xsl:value-of select="$row/n1:act/n1:performer/n1:assignedEntity/n1:representedOrganization/n1:name"/>
			</xsl:when>
      <xsl:when test="$row/n1:act/n1:entryRelationship/n1:observation/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name">
        <xsl:value-of select="$row/n1:act/n1:entryRelationship/n1:observation/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name"/>
      </xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$row/n1:act/n1:entryRelationship[@typeCode='SUBJ']/n1:observation[@classCode='OBS']/n1:entryRelationship[@typeCode='REFR']/n1:observation[@classCode='OBS']/n1:informant/n1:assignedEntity/n1:representedOrganization/n1:name"/>
			</xsl:otherwise>
    </xsl:choose>
	</xsl:template>

	<xsl:template name="getSeverity">
		<xsl:param name="observation"/>
		<xsl:variable name="severityReference" select="$observation//n1:entryRelationship[@typeCode='SUBJ']/n1:observation/n1:text/n1:reference/@value"/>
		<xsl:variable name="sevData1" select="$observation/../../../../n1:text//n1:content[@ID=$severityReference]"/>
		<xsl:variable name="sevData2" select="$observation/../../../../n1:text//n1:content[@ID=substring-after($severityReference,'#')]"/>
		<xsl:variable name="sevData3" select="$observation/../../../../n1:text//n1:td[@ID=$severityReference]"/>
		<xsl:variable name="sevData4" select="$observation/../../../../n1:text//n1:td[@ID=substring-after($severityReference,'#')]"/>
		<xsl:choose>
			<xsl:when test="string-length($sevData1)>=1" >
				<xsl:value-of select="$sevData1"/>
			</xsl:when>
			<xsl:when test="string-length($sevData2)>=1" >
				<xsl:value-of select="$sevData2"/>
			</xsl:when>
			<xsl:when test="string-length($sevData3)>=1" >
				<xsl:value-of select="$sevData3"/>
			</xsl:when>
			<xsl:when test="string-length($sevData4)>=1" >
				<xsl:value-of select="$sevData4"/>
			</xsl:when>
			<xsl:otherwise >
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="getReactionCoded">
		<xsl:param name="eR"/>
		<xsl:variable name="coded" select="$eR[@inversionInd='true' and @typeCode='MFST']"/>
		<xsl:for-each select="$coded">
			<xsl:if test="n1:observation/n1:value/n1:translation/@displayName">
				<xsl:value-of select="n1:observation/n1:value/n1:translation/@displayName"/>
			</xsl:if>
		</xsl:for-each>
	</xsl:template>

	<!-- Encounters -->

	<xsl:template name="getEncounterID">
		<xsl:param name="encounter"/>
		<xsl:choose>
			<xsl:when test="$encounter/n1:id/@root">
				<xsl:value-of select="$encounter/n1:id/@root"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

  <xsl:template name="getEncounterType">
    <xsl:param name="encounter"/>
    <xsl:variable name="encounterReference" select="$encounter/n1:text/n1:reference/@value" />
    <xsl:variable name="encounterReference2" select="$encounter/n1:code/n1:originalText/n1:reference/@value" />
    <xsl:if test="$encounter">
      <xsl:choose>
        <xsl:when test="$encounter/n1:code/@displayName">
          <xsl:value-of select="$encounter/n1:code/@displayName"/>
        </xsl:when>
        <xsl:when test="$encounter/n1:text/n1:reference/@value and string-length($encounter/../../n1:text//n1:td[@ID=substring-after($encounterReference,'#')])>0">
          <xsl:value-of select="$encounter/../../n1:text//n1:td[@ID=substring-after($encounterReference,'#')]"/>
        </xsl:when>
        <xsl:when test="$encounter/n1:code/n1:originalText/n1:reference/@value">
          <xsl:value-of select="$encounter/../../n1:text//n1:td[@ID=substring-after($encounterReference2,'#')]"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:call-template name="na"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
  </xsl:template>

  <xsl:template name="getEncounterFreeText">
    <xsl:param name="encounter"/>
    <xsl:variable name="encRef1" select="$encounter/n1:text/n1:reference/@value"/>
    <xsl:variable name="encRef2" select="substring-after($encRef1,'#')"/>
    <xsl:variable name="encRef3" select="$encounter/n1:entryRelationship/n1:act/n1:text/n1:reference/@value"/>
    <xsl:variable name="encRef4" select="substring-after($encRef3,'#')"/>
    <xsl:choose>
      <xsl:when test="string-length(normalize-space($encounter/../../n1:text//n1:content[@ID=$encRef1]))>0">
        <xsl:value-of select="normalize-space($encounter/../../n1:text//n1:content[@ID=$encRef1])"/>
      </xsl:when>
      <xsl:when test="string-length(normalize-space($encounter/../../n1:text//n1:td[@ID=$encRef1]))>0">
        <xsl:value-of select="normalize-space($encounter/../../n1:text//n1:td[@ID=$encRef1])"/>
      </xsl:when>
      <xsl:when test="string-length(normalize-space($encounter/../../n1:text//n1:content[@ID=$encRef2]))>0">
        <xsl:value-of select="normalize-space($encounter/../../n1:text//n1:content[@ID=$encRef2])"/>
      </xsl:when>
      <xsl:when test="string-length(normalize-space($encounter/../../n1:text//n1:td[@ID=$encRef2]))>0">
        <xsl:value-of select="normalize-space($encounter/../../n1:text//n1:td[@ID=$encRef2])"/>
      </xsl:when>
      <xsl:when test="string-length(normalize-space($encounter/../../n1:text//n1:content[@ID=$encRef4]))>0">
        <xsl:value-of select="normalize-space($encounter/../../n1:text//n1:content[@ID=$encRef4])"/>
      </xsl:when>
      <xsl:when test="string-length(normalize-space($encounter/../../n1:text//n1:td[@ID=$encRef4]))>0">
        <xsl:value-of select="normalize-space($encounter/../../n1:text//n1:td[@ID=$encRef4])"/>
      </xsl:when>
    </xsl:choose>
  </xsl:template>

	<xsl:template name="getEncounterDateTime">
		<xsl:param name="encounter"/>
		<xsl:if test="$encounter">
			<xsl:choose>
				<xsl:when test="$encounter/n1:effectiveTime/n1:low/@value">
					<xsl:value-of select="$encounter/n1:effectiveTime/n1:low/@value"/>
				</xsl:when>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

	<xsl:template name="getEncounterProvider">
		<xsl:param name="encounter"/>
		<xsl:if test="$encounter">
			<xsl:choose>
				<xsl:when test="$encounter/n1:performer/n1:assignedEntity/n1:assignedPerson/n1:name/n1:family and $encounter/n1:performer/n1:assignedEntity/n1:assignedPerson/n1:name/n1:given">
					<xsl:variable name="first" select="$encounter/n1:performer/n1:assignedEntity/n1:assignedPerson/n1:name/n1:given"/>
					<xsl:variable name="last" select="$encounter/n1:performer/n1:assignedEntity/n1:assignedPerson/n1:name/n1:family"/>
					<xsl:call-template name="formatProviderName">
						<xsl:with-param name="first" select="$first"/>
						<xsl:with-param name="last" select="$last"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$encounter/n1:performer/n1:assignedEntity/n1:assignedPerson"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

	<!--Procedures -->

	<xsl:template name="getProcedureID">
		<xsl:param name="procedure"/>
		<xsl:if test="$procedure">
			<xsl:choose>
				<xsl:when test="$procedure/n1:id/@root">
					<xsl:value-of select="$procedure/n1:id/@root"/>
				</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

	<xsl:template name="getProcedureType">
		<xsl:param name="procedure"/>
		<xsl:variable name="displayName" select="$procedure/n1:code/@displayName"/>
		<xsl:variable name="code" select="$procedure/n1:code/@code"/>
		<xsl:choose>
			<xsl:when test="contains($displayName,$code)">
				<xsl:value-of select="substring-after($displayName,$code)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$procedure/n1:code/@displayName"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="getProcedureFreeText">
		<xsl:param name="procedure"/>
		<xsl:variable name="procRef" select="substring-after($procedure/n1:text/n1:reference/@value,'#')"/>
		<xsl:variable name="proc1" select="$procedure/../../n1:text//n1:content[@ID=$procRef]"/>
		<xsl:variable name="proc2" select="$procedure/../../n1:text//n1:tr[@ID=$procRef]"/>
		<xsl:choose>
			<xsl:when test="string-length($proc1)>1">
				<xsl:value-of select="$proc1"/>
			</xsl:when>
			<xsl:when test="string-length($proc2)>1">
				<xsl:value-of select="$proc2"/>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="getProcedureDateTime">
		<xsl:param name="procedure"/>
		<xsl:if test="$procedure">
			<xsl:choose>
				<xsl:when test="$procedure/n1:effectiveTime/n1:low/@value">
					<xsl:call-template name="formatDateShort">
						<xsl:with-param name="dateString" select="$procedure/n1:effectiveTime/n1:low/@value"/>
					</xsl:call-template>
				</xsl:when>
        <xsl:when test="$procedure/n1:effectiveTime/@value">
          <xsl:call-template name="formatDateShort">
            <xsl:with-param name="dateString" select="$procedure/n1:effectiveTime/@value"/>
          </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
          <xsl:call-template name="na"/>
        </xsl:otherwise>    
			</xsl:choose>
		</xsl:if>
	</xsl:template>

	<xsl:template name="getProcedureProvider">
		<xsl:param name="procedure"/>
		<xsl:if test="$procedure">
			<xsl:choose>
				<xsl:when test="$procedure/n1:performer/n1:assignedEntity/n1:assignedPerson/n1:name/n1:family and $procedure/n1:performer/n1:assignedEntity/n1:assignedPerson/n1:name/n1:given">
					<xsl:variable name="first" select="$procedure/n1:performer/n1:assignedEntity/n1:assignedPerson/n1:name/n1:given"/>
					<xsl:variable name="last" select="$procedure/n1:performer/n1:assignedEntity/n1:assignedPerson/n1:name/n1:family"/>
					<xsl:call-template name="formatProviderName">
						<xsl:with-param name="first" select="$first"/>
						<xsl:with-param name="last" select="$last"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$procedure/n1:performer/n1:assignedEntity/n1:assignedPerson"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

	<!--Medications -->

	<xsl:template name="medDateBeginString">
		<xsl:param name="substanceAdmin"/>
		<xsl:call-template name="shortenDate">
			<xsl:with-param name="inString">
				<xsl:choose>
					<xsl:when test="$substanceAdmin/n1:effectiveTime/n1:low/@value and not($isINHS)">
						<xsl:value-of select="$substanceAdmin/n1:effectiveTime/n1:low/@value"/>
					</xsl:when>
					<xsl:when test="$substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:supply[@classCode='SPLY' and @moodCode='EVN']/n1:effectiveTime/@value">
						<xsl:value-of select="$substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:supply[@classCode='SPLY' and @moodCode='EVN']/n1:effectiveTime/@value"/>
					</xsl:when>
					<xsl:when test="$substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:supply[@classCode='SPLY' and @moodCode='INT']/n1:effectiveTime/@value">
						<xsl:value-of select="$substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:supply[@classCode='SPLY' and @moodCode='INT']/n1:effectiveTime/@value"/>
					</xsl:when>
				</xsl:choose>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="getMedicationName">
		<xsl:param name="row"/>
		<xsl:variable name="substanceAdmin" select="$row/n1:substanceAdministration"/>
		<xsl:variable name="ref1" select="$substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:code/n1:originalText/n1:reference/@value"/>
		<xsl:variable name="refShort" select="substring-after($ref1,'#')"/>
		<xsl:if test="$substanceAdmin">
			<xsl:choose>
				<xsl:when test="string-length(normalize-space($row/../n1:text//n1:content[@ID=$refShort]))>0">
					<xsl:value-of select="normalize-space($row/../n1:text//n1:content[@ID=$refShort])"/>
				</xsl:when>

				<xsl:when test="string-length(normalize-space($substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:code/@displayName))>0">
					<xsl:value-of select="normalize-space($substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:code/@displayName)"/>
				</xsl:when>

				<xsl:when test="string-length(normalize-space($substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:name))>0">
					<xsl:value-of select="normalize-space($substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:name)"/>
				</xsl:when>

				<xsl:when test="string-length(normalize-space($substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:code/n1:translation/@displayName))>0">
					<xsl:value-of select="normalize-space($substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:code/n1:translation/@displayName)"/>
				</xsl:when>

				<xsl:when test="string-length(normalize-space($row/../n1:text//n1:td[@ID=$refShort]))>0">
					<xsl:value-of select="normalize-space($row/../n1:text//n1:td[@ID=$refShort])"/>
				</xsl:when>
				
				<xsl:otherwise>
					<xsl:value-of select="normalize-space($substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:code/n1:originalText)"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

  <xsl:template name="medExpireDateString">
    <xsl:param name="substanceAdmin"/>
    <xsl:call-template name="shortenDate">
      <xsl:with-param name="inString">
        <xsl:choose>
          <xsl:when test="string-length($substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:supply[@classCode='SPLY' and @moodCode='INT']/n1:effectiveTime/@value)>1">
            <xsl:value-of select="$substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:supply[@classCode='SPLY' and @moodCode='INT']/n1:effectiveTime/@value"/>
          </xsl:when>
          <xsl:when test="string-length($substanceAdmin/n1:effectiveTime/n1:high/@value)>1">
            <xsl:value-of select="$substanceAdmin/n1:effectiveTime/n1:high/@value"/>
          </xsl:when>
          <xsl:when test="string-length($substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:entryRelationship[@typeCode='REFR']/n1:supply[@classCode='SPLY' and @moodCode='INT']/n1:effectiveTime/n1:high/@value)>1">
            <xsl:value-of select="$substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:entryRelationship[@typeCode='REFR']/n1:supply[@classCode='SPLY' and @moodCode='INT']/n1:effectiveTime/n1:high/@value"/>
          </xsl:when>
        </xsl:choose>
      </xsl:with-param>
    </xsl:call-template>
  </xsl:template>

	<xsl:template name="getMedStatusString">
		<xsl:param name="substanceAdmin"/>
		<xsl:if test="$substanceAdmin">
			<xsl:choose>
				<xsl:when test="string-length($substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:observation[@classCode='OBS' and @moodCode='EVN' and n1:statusCode/@code='completed']/n1:value/@displayName)>1">
					<xsl:value-of select="$substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:observation[@classCode='OBS' and @moodCode='EVN' and n1:statusCode/@code='completed']/n1:value/@displayName"/>
				</xsl:when>
				<xsl:when test="string-length($substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:entryRelationship[@typeCode='REFR']/n1:observation[@classCode='OBS' and @moodCode='EVN' and n1:statusCode/@code='completed']/n1:value/@displayName)>1">
					<xsl:value-of select="$substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:entryRelationship[@typeCode='REFR']/n1:observation[@classCode='OBS' and @moodCode='EVN' and n1:statusCode/@code='completed']/n1:value/@displayName"/>
				</xsl:when>
				<xsl:when test="string-length($substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:entryRelationship[@typeCode='REFR']/n1:observation[@classCode='OBS' and @moodCode='EVN' and n1:statusCode/@code='completed']/n1:value/@displayName)>1">
					<xsl:value-of select="$substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:entryRelationship[@typeCode='REFR']/n1:observation[@classCode='OBS' and @moodCode='EVN' and n1:statusCode/@code='completed']/n1:value/@displayName"/>
				</xsl:when>
				<xsl:when test="string-length($substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:observation[@classCode='OBS' and @moodCode='EVN']/n1:value/n1:originalText)>1">
					<xsl:value-of select="$substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:observation[@classCode='OBS' and @moodCode='EVN']/n1:value/n1:originalText"/>
				</xsl:when>
				<xsl:when test="string-length($substanceAdmin/n1:entryRelationship/n1:observation/n1:value[@xsi:type='CE']/n1:originalText)>1">
					<xsl:value-of select="$substanceAdmin/n1:entryRelationship/n1:observation/n1:value[@xsi:type='CE']/n1:originalText"/>
				</xsl:when>
				<xsl:when test="string-length($substanceAdmin/n1:entryRelationship/n1:observation/n1:value[@xsi:type='CE']/@displayName)>1">
					<xsl:value-of select="$substanceAdmin/n1:entryRelationship/n1:observation/n1:value[@xsi:type='CE']/@displayName"/>
				</xsl:when>
				<xsl:when test="string-length($substanceAdmin/n1:statusCode/@code)>1">
					<xsl:value-of select="$substanceAdmin/n1:statusCode/@code"/>
				</xsl:when>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

	<xsl:template name="getRxNumString">
		<xsl:param name="substanceAdmin"/>
		<xsl:if test="$substanceAdmin">
			<xsl:choose>
				<xsl:when test="string-length($substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:supply[@classCode='SPLY' and @moodCode='EVN']/n1:id/@extension)>1">
					<xsl:value-of select="$substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:supply[@classCode='SPLY' and @moodCode='EVN']/n1:id/@extension"/>
				</xsl:when>
				<xsl:when test="string-length($substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:supply[@classCode='SPLY' and @moodCode='INT']/n1:id/@extension)>1">
					<xsl:value-of select="$substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:supply[@classCode='SPLY' and @moodCode='INT']/n1:id/@extension"/>
				</xsl:when>
				<xsl:when test="string-length($substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:entryRelationship[@typeCode='REFR']/n1:supply[@moodCode='EVN' and @classCode='SPLY']/n1:id/@extension)>1">
					<xsl:value-of select="$substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:entryRelationship[@typeCode='REFR']/n1:supply[@moodCode='EVN' and @classCode='SPLY']/n1:id/@extension"/>
				</xsl:when>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

	<xsl:template name="getMedProvider">
		<xsl:param name="substanceAdmin"/>
		<xsl:variable name="assignedPerson1" select="$substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:supply/n1:author/n1:assignedAuthor/n1:assignedPerson"/>
		<xsl:variable name="assignedPerson2" select="$substanceAdmin/n1:entryRelationship/n1:supply/n1:author/n1:assignedAuthor/n1:assignedPerson"/>
		<xsl:variable name="assignedPerson3" select="$substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:entryRelationship/n1:supply/n1:author/n1:assignedAuthor/n1:assignedPerson"/>
		<xsl:variable name="assignedPerson4" select="$substanceAdmin/n1:author/n1:assignedAuthor/n1:assignedPerson"/>
		<xsl:if test="$substanceAdmin">
			<xsl:choose>
				<xsl:when test="string-length($assignedPerson1/n1:name)>1">
					<xsl:choose>
						<xsl:when test="$assignedPerson1/n1:name/n1:given and $assignedPerson1/n1:name/n1:family">
							<xsl:call-template name="formatProviderName">
								<xsl:with-param name="first" select="$assignedPerson1/n1:name/n1:given"/>
								<xsl:with-param name="last" select="$assignedPerson1/n1:name/n1:family"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="$assignedPerson1/n1:name"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:when test="string-length($assignedPerson4/n1:name)>1">
					<xsl:choose>
						<xsl:when test="$assignedPerson4/n1:name/n1:given and $assignedPerson4/n1:name/n1:family">
							<xsl:call-template name="formatProviderName">
								<xsl:with-param name="first" select="$assignedPerson4/n1:name/n1:given"/>
								<xsl:with-param name="last" select="$assignedPerson4/n1:name/n1:family"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="$assignedPerson4/n1:name"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:when test="string-length($substanceAdmin/n1:entryRelationship/n1:supply/n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name)>1">
					<xsl:choose>
						<xsl:when test="$assignedPerson2/n1:name/n1:given and $assignedPerson2/n1:name/n1:family">
							<xsl:call-template name="formatProviderName">
								<xsl:with-param name="first" select="$substanceAdmin/n1:entryRelationship/n1:supply/n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name/n1:given"/>
								<xsl:with-param name="last" select="$substanceAdmin/n1:entryRelationship/n1:supply/n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name/n1:family"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="$substanceAdmin/n1:entryRelationship/n1:supply/n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:when test="string-length($substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:entryRelationship/n1:supply/n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name)>1">
					<xsl:choose>
						<xsl:when test="$assignedPerson3/n1:name/n1:given and $assignedPerson3/n1:name/n1:family">
							<xsl:call-template name="formatProviderName">
								<xsl:with-param name="first" select="$substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:entryRelationship/n1:supply/n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name/n1:given"/>
								<xsl:with-param name="last" select="$substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:entryRelationship/n1:supply/n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name/n1:family"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="$substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:entryRelationship/n1:supply/n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name"/>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

  <xsl:template name="getMedQuantityString">
    <xsl:param name="substanceAdmin"/>
    <xsl:if test="$substanceAdmin">
      <xsl:choose>
        <xsl:when test="string-length(normalize-space($substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:entryRelationship[@typeCode='REFR']/n1:supply[@classCode='SPLY' and @moodCode='INT']/n1:quantity/@value))>0">
          <xsl:value-of select="normalize-space($substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:entryRelationship[@typeCode='REFR']/n1:supply[@classCode='SPLY' and @moodCode='INT']/n1:quantity/@value)"/>
          <xsl:if test="string-length($substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:entryRelationship[@typeCode='REFR']/n1:supply[@classCode='SPLY' and @moodCode='INT']/n1:quantity/@unit)>0">
            <xsl:text> </xsl:text>
            <xsl:call-template name="getMedQuantityUnit">
              <xsl:with-param name="unitPath" select="$substanceAdmin/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:entryRelationship[@typeCode='REFR']/n1:supply[@classCode='SPLY' and @moodCode='INT']/n1:quantity/@unit"/>
            </xsl:call-template>
          </xsl:if>
        </xsl:when>
        <xsl:when test="string-length(normalize-space($substanceAdmin/n1:entryRelationship[@typeCode='COMP']/n1:supply[@classCode='SPLY' and @moodCode='EVN']/n1:quantity/@value))>0">
          <xsl:value-of select="normalize-space($substanceAdmin/n1:entryRelationship[@typeCode='COMP']/n1:supply[@classCode='SPLY' and @moodCode='EVN']/n1:quantity/@value)"/>
          <xsl:if test="string-length($substanceAdmin/n1:entryRelationship[@typeCode='COMP']/n1:supply[@classCode='SPLY' and @moodCode='EVN']/n1:quantity/@unit)>0">
            <xsl:text> </xsl:text>
            <xsl:call-template name="getMedQuantityUnit">
              <xsl:with-param name="unitPath" select="$substanceAdmin/n1:entryRelationship[@typeCode='COMP']/n1:supply[@classCode='SPLY' and @moodCode='EVN']/n1:quantity/@unit"/>
            </xsl:call-template>
          </xsl:if>
        </xsl:when>
        <xsl:when test="string-length(normalize-space($substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:supply/n1:quantity/@value))>0">
          <xsl:value-of select="normalize-space($substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:supply/n1:quantity/@value)"/>
          <xsl:if test="string-length($substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:supply/n1:quantity/@unit)>0">
            <xsl:text> </xsl:text>
            <xsl:call-template name="getMedQuantityUnit">
              <xsl:with-param name="unitPath" select="$substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:supply/n1:quantity/@unit"/>
            </xsl:call-template>
          </xsl:if>
        </xsl:when>
      </xsl:choose>
    </xsl:if>
  </xsl:template>

  <xsl:template name="getMedQuantityUnit">
    <xsl:param name="unitPath"/>
    <xsl:choose>
      <xsl:when test="contains($unitPath,'{')">
        <xsl:call-template name="removeBraces">
          <xsl:with-param name="bracedText" select="$unitPath"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="normalize-space($unitPath)"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template name="removeBraces">
    <xsl:param name="bracedText"/>
    <xsl:variable name="bracelessText1" select="substring-after($bracedText, '{')"/>
    <xsl:value-of select="substring-before($bracelessText1,'}')"/>
  </xsl:template>

	<xsl:template name="getSig">
		<xsl:param name="substanceAdmin"/>
		<xsl:variable name="sigId1" select="$substanceAdmin/n1:text/n1:reference/@value"/>	
		<xsl:variable name="sigId2" select="substring-after($sigId1,'#')"/>
    <xsl:variable name="sigId3">
      <xsl:if test="$substanceAdmin/n1:entryRelationship/n1:act/n1:text/n1:reference/@value and $isIHIE">
        <xsl:value-of select="$substanceAdmin/n1:entryRelationship/n1:act/n1:text/n1:reference/@value"/>
      </xsl:if>
    </xsl:variable>
    <xsl:if test="string-length($sigId3)">
      <xsl:call-template name="getSigWithKey">
        <xsl:with-param name="key" select="substring-after($sigId3,'#')"/>
        <xsl:with-param name="substanceAdmin" select="$substanceAdmin"/>
      </xsl:call-template>
    </xsl:if>
    <xsl:variable name="result1">
			<xsl:call-template name="getSigWithKey">
				<xsl:with-param name="key" select="$sigId1"/>
				<xsl:with-param name="substanceAdmin" select="$substanceAdmin"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:if test="string-length($result1)">
			<xsl:value-of select="$result1"/>
		</xsl:if>
    <xsl:call-template name="getSigWithKey">
      <xsl:with-param name="key" select="$sigId2"/>
      <xsl:with-param name="substanceAdmin" select="$substanceAdmin"/>
    </xsl:call-template>
    <xsl:if test="not($sigId1) and not($sigId2)">
        <xsl:call-template name="getSigWithNoKey">
          <xsl:with-param name="substanceAdmin" select="$substanceAdmin"/>
        </xsl:call-template>
    </xsl:if>
	</xsl:template>

	<xsl:template name="getSigWithKey">
		<xsl:param name="substanceAdmin"/>
		<xsl:param name="key"/>
		<xsl:choose>
			<xsl:when test="string-length($substanceAdmin/../../n1:text//n1:content[@ID=$key])>0">
				<xsl:value-of select="normalize-space($substanceAdmin/../../n1:text//n1:content[@ID=$key])"/>
			</xsl:when>
			<xsl:when test="string-length($substanceAdmin/../../n1:text//n1:td[@ID=$key])>0">
				<xsl:value-of select="normalize-space($substanceAdmin/../../n1:text//n1:td[@ID=$key])"/>
			</xsl:when>
    </xsl:choose>
	</xsl:template>
  
  <xsl:template name="getSigWithNoKey">
    <xsl:param name="substanceAdmin"/>
    <xsl:choose>
      <xsl:when test="$substanceAdmin/n1:text">
         <xsl:value-of select="normalize-space($substanceAdmin/n1:text)"/>
      </xsl:when>
    </xsl:choose>
  </xsl:template>

	<xsl:template name="getMedSource">
		<xsl:param name="substanceAdmin"/>
		<xsl:choose>
			<xsl:when test="$substanceAdmin/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name">
				<xsl:value-of select="$substanceAdmin/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name"/>
			</xsl:when>
			<xsl:when test="$substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:supply[@classCode='SPLY' and @moodCode='INT']/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name">
				<xsl:value-of select="$substanceAdmin/n1:entryRelationship[@typeCode='REFR']/n1:supply[@classCode='SPLY' and @moodCode='INT']/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name"/>
			</xsl:when>
			<xsl:when test="$substanceAdmin/n1:entryRelationship/n1:supply/n1:author/n1:assignedAuthor/n1:code/@displayName">
				<xsl:value-of select="$substanceAdmin/n1:entryRelationship/n1:supply/n1:author/n1:assignedAuthor/n1:code/@displayName"/>
			</xsl:when>
      <xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- Problems -->

	<xsl:template name="probName">
		<xsl:param name="probEntry"/>
		<xsl:variable name="path" select="$probEntry/.."/>
		<xsl:variable name="probReference1" select="$probEntry/n1:act/n1:entryRelationship/n1:observation/n1:text/n1:reference/@value"/>
		<xsl:variable name="probReference2" select="substring-after($probReference1,'#')"/>
		<xsl:choose>
      <xsl:when test="($probEntry/n1:act/n1:entryRelationship/n1:observation/n1:value/@displayName)">  <!--removed 'and ($isMultiCare)' code from this line via VM patch WEBV*1.0*32 (build v16.1.6)-->
        <xsl:value-of select="$probEntry/n1:act/n1:entryRelationship/n1:observation/n1:value/@displayName"/>
      </xsl:when>
			<xsl:when test="$path/n1:text//n1:content[@ID=$probReference1]">
				<xsl:value-of select="$path/n1:text//n1:content[@ID=$probReference1]"/>
			</xsl:when>
			<xsl:when test="$path/n1:text//n1:content[@ID=$probReference2]">
				<xsl:value-of select="$path/n1:text//n1:content[@ID=$probReference2]"/>
			</xsl:when>
			<xsl:when test="$path/n1:text//n1:paragraph[@ID=$probReference1]">
				<xsl:value-of select="$path/n1:text//n1:paragraph[@ID=$probReference1]"/>
			</xsl:when>
			<xsl:when test="$path/n1:text//n1:paragraph[@ID=$probReference2]">
				<xsl:value-of select="$path/n1:text//n1:paragraph[@ID=$probReference2]"/>
			</xsl:when>
			<xsl:when test="$path/n1:text//n1:td[@ID=$probReference1]">
				<xsl:value-of select="$path/n1:text//n1:td[@ID=$probReference1]"/>
			</xsl:when>
			<xsl:when test="$path/n1:text//n1:td[@ID=$probReference2]">
				<xsl:value-of select="$path/n1:text//n1:td[@ID=$probReference2]"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="getProblemOnsetDateString">
		<xsl:param name="act"/>
		<xsl:if test="$act">
			<xsl:choose>
				<xsl:when test="string-length($act/n1:entryRelationship/n1:observation/n1:effectiveTime/n1:low/@value)>1">
					<xsl:value-of select="$act/n1:entryRelationship/n1:observation/n1:effectiveTime/n1:low/@value"/>
				</xsl:when>
				<xsl:when test="string-length($act/n1:effectiveTime/n1:low/@value)>1">
					<xsl:value-of select="n1:act/n1:effectiveTime/n1:low/@value"/>
				</xsl:when>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

	<xsl:template name="getProblemCode">
		<xsl:param name="rowData"/>
		<xsl:choose>
			<xsl:when test="$rowData/n1:value/@code and not ($isDoD)">
				<xsl:value-of select="$rowData/n1:value/@code"/>
			</xsl:when>
			<xsl:when test="($rowData/n1:value/n1:translation/@code) and not($rowData/n1:value/n1:translation/@code='null')">
				<xsl:value-of select="$rowData/n1:value/n1:translation/@code"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="getProblemSource">
		<xsl:param name="row"/>
		<xsl:choose>
      <xsl:when test="$row/n1:act/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name">
				<xsl:value-of select="$row/n1:act/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name"/>
			</xsl:when>
			<xsl:when test="$row/n1:act/n1:performer/n1:assignedEntity/n1:representedOrganization/n1:name">
				<xsl:value-of select="$row/n1:act/n1:performer/n1:assignedEntity/n1:representedOrganization/n1:name"/>
			</xsl:when>
      <xsl:when test="$row/n1:act/n1:entryRelationship/n1:observation/n1:participant/n1:participantRole/n1:scopingEntity/n1:desc and $isIHIE">
        <xsl:value-of select="$row/n1:act/n1:entryRelationship/n1:observation/n1:participant/n1:participantRole/n1:scopingEntity/n1:desc"/>
      </xsl:when>
      <xsl:when test="$row/n1:act/n1:entryRelationship/n1:observation/n1:participant/@typeCode = 'AUT'">
        <xsl:value-of select="$row/n1:act/n1:entryRelationship/n1:observation/n1:participant/n1:participantRole/n1:playingEntity/n1:desc"/>
      </xsl:when>
      <xsl:when test="$row/n1:act/n1:entryRelationship/n1:observation/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name">
        <xsl:value-of select="$row/n1:act/n1:entryRelationship/n1:observation/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name"/>
      </xsl:when>
    </xsl:choose>
	</xsl:template>

	<xsl:template name="getProblemProvider">
		<xsl:param name="act"/>
    <xsl:variable name="providerNumber" select="$act/n1:performer/n1:assignedEntity/n1:id/@extension" />
		<xsl:choose>
			<xsl:when test="$act/n1:performer/n1:assignedEntity/n1:assignedPerson/n1:name">
				<xsl:variable name="name1">
					<xsl:call-template name="getPersonNameFromRoot">
						<xsl:with-param name="nameRoot" select="$act/n1:performer/n1:assignedEntity/n1:assignedPerson/n1:name"/>
					</xsl:call-template>
				</xsl:variable>
				<xsl:choose>
					<xsl:when test="string-length($name1)>0">
						<xsl:value-of select="$name1"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:variable name="name2">
							<xsl:call-template name="getPersonNameFromRoot">
								<xsl:with-param name="nameRoot" select="$act/n1:performer/n1:assignedEntity/n1:assignedPerson/n1:name/n1:performer[@typeCode='PRF']/n1:assignedEntity/n1:assignedPerson/n1:name"/>
							</xsl:call-template>
						</xsl:variable>
						<xsl:choose>
							<xsl:when test="string-length($name2)>0">
								<xsl:value-of select="$name2"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:variable name="name3">
									<xsl:call-template name="getPersonNameFromRoot">
										<xsl:with-param name="nameRoot" select="$act/n1:entryRelationship/n1:observation/n1:entryRelationship/n1:observation[@classCode='OBS' and @moodCode='EVN']/n1:performer/n1:assignedEntity/n1:assignedPerson/n1:name"/>
									</xsl:call-template>
								</xsl:variable>
								<xsl:choose>
									<xsl:when test="string-length($name3)>0">
										<xsl:value-of select="$name3"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:variable name="providerId" select="$act/n1:performer/n1:assignedEntity/n1:id/@extension"/>
										<xsl:variable name="name4">
											<xsl:call-template name="getPersonNameFromRoot">
												<xsl:with-param name="nameRoot" select="/n1:ClinicalDocument/n1:documentationOf/n1:serviceEvent/n1:performer/n1:assignedEntity/n1:id[@extension=$providerId]/../n1:assignedPerson/n1:name"/>
											</xsl:call-template>
										</xsl:variable>
										<xsl:choose>
											<xsl:when test="string-length($name4)>0">
												<xsl:value-of select="$name4"/>
											</xsl:when>
											<xsl:otherwise>
												<xsl:value-of select="/n1:ClinicalDocument/n1:documentationOf/n1:serviceEvent/n1:performer/n1:assignedEntity/n1:id[@extension=$providerId]/@assigningAuthorityName"/>
											</xsl:otherwise>
										</xsl:choose>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>

      <xsl:when test="string-length($providerNumber)>0 and
                /n1:ClinicalDocument/n1:documentationOf/n1:serviceEvent/n1:performer/n1:assignedEntity/n1:id/@extension=$providerNumber and
                string-length(/n1:ClinicalDocument/n1:documentationOf/n1:serviceEvent/n1:performer/n1:assignedEntity[n1:id/@extension=$providerNumber]/n1:assignedPerson/n1:name)>0">
          <xsl:variable name="name1a">
            <xsl:call-template name="getPersonNameFromRoot">
              <xsl:with-param name="nameRoot" select="/n1:ClinicalDocument/n1:documentationOf/n1:serviceEvent/n1:performer/n1:assignedEntity[n1:id/@extension=$providerNumber]/n1:assignedPerson/n1:name"/>
            </xsl:call-template>
          </xsl:variable>
          <xsl:if test="string-length($name1a)>0">
            <xsl:value-of select="$name1a"/>
          </xsl:if>
      </xsl:when>
      <xsl:when test="$act/n1:entryRelationship/n1:observation/n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name">
        <xsl:variable name="name1a">
          <xsl:call-template name="getPersonNameFromRoot">
            <xsl:with-param name="nameRoot" select="$act/n1:entryRelationship/n1:observation/n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name"/>
          </xsl:call-template>
        </xsl:variable>
        <xsl:if test="string-length($name1a)>0">
          <xsl:value-of select="$name1a"/>
        </xsl:if>
      </xsl:when>
      <xsl:when test="/n1:ClinicalDocument/n1:documentationOf/n1:serviceEvent/n1:performer/n1:assignedEntity/n1:assignedPerson/n1:name and ($isMultiCare)">
        <xsl:variable name="name1a">
          <xsl:call-template name="getPersonNameFromRoot">
            <xsl:with-param name="nameRoot" select="/n1:ClinicalDocument/n1:documentationOf/n1:serviceEvent/n1:performer/n1:assignedEntity/n1:assignedPerson/n1:name"/>
          </xsl:call-template>
        </xsl:variable>
        <xsl:if test="string-length($name1a)>0">
          <xsl:value-of select="$name1a"/>
        </xsl:if>
      </xsl:when>
      
      <xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>			
		</xsl:choose>
	</xsl:template>

	<xsl:template name="getPersonNameFromRoot">
		<xsl:param name="nameRoot"/>
		<xsl:choose>
			<xsl:when test="string-length(normalize-space($nameRoot/text()))>0">
				<xsl:value-of select="normalize-space($nameRoot/text())"/>
			</xsl:when>
			<xsl:when test="string-length($nameRoot/n1:family)>0 or string-length($nameRoot/n1:given)>0">
				<xsl:call-template name="getPersonName">
					<xsl:with-param name="nameRoot" select="$nameRoot"/>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="getPersonName">
		<xsl:param name="nameRoot"/>
		<xsl:value-of select="$nameRoot/n1:family"/>
		<xsl:if test="string-length($nameRoot/n1:given)>0">
			<xsl:text>,</xsl:text>
		</xsl:if>
		<xsl:for-each select="$nameRoot/n1:given">
			<xsl:text> </xsl:text>
			<xsl:value-of select="."/>
		</xsl:for-each>
	</xsl:template>
	
	<!-- Labs -->

	<xsl:template name="getPanelDT">
		<xsl:param name="organizer"/>
		<xsl:if test="$organizer">
			<xsl:choose>
				<xsl:when test="$organizer/n1:effectiveTime/@value">
					<xsl:call-template name="formatDateShort">
						<xsl:with-param name="dateString" select="$organizer/n1:effectiveTime/@value"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$organizer/n1:effectiveTime/n1:low/@value">
					<xsl:call-template name="formatDateShort">
						<xsl:with-param name="dateString" select="$organizer/n1:effectiveTime/n1:low/@value"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$organizer/n1:component/n1:procedure/n1:effectiveTime/@value">
					<xsl:call-template name="formatDateShort">
						<xsl:with-param name="dateString" select="$organizer/n1:component/n1:procedure/n1:effectiveTime/@value"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$organizer/n1:component/n1:procedure/n1:effectiveTime/n1:low/@value">
					<xsl:call-template name="formatDateShort">
						<xsl:with-param name="dateString" select="$organizer/n1:component/n1:procedure/n1:effectiveTime/n1:low/@value"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

	<xsl:template name="getResultDT">
		<xsl:param name="observation"/>
		<xsl:if test="$observation">
			<xsl:choose>
				<xsl:when test="$observation/n1:effectiveTime/@value">
					<xsl:call-template name="formatDateShort">
						<xsl:with-param name="dateString" select="$observation/n1:effectiveTime/@value"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$observation/n1:effectiveTime/n1:low/@value">
					<xsl:call-template name="formatDateShort">
						<xsl:with-param name="dateString" select="$observation/n1:effectiveTime/n1:low/@value"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

  <xsl:template name="getOrganizerName">
    <xsl:param name="row"/>
    <xsl:choose>
      <xsl:when test="string-length($row/n1:organizer/n1:code/@displayName)">
        <xsl:value-of select="$row/n1:organizer/n1:code/@displayName"/>
      </xsl:when>
      <xsl:when test="string-length($row/n1:organizer/n1:code/n1:originalText)">
        <xsl:value-of select="$row/n1:organizer/n1:code/n1:originalText"/>
      </xsl:when>
      <xsl:when test="count($row/n1:organizer/n1:component/n1:observation)=1 and $row/n1:organizer/n1:component/n1:observation/n1:code/@displayName">
        <xsl:choose>
          <xsl:when test="$row/n1:organizer/n1:component/n1:observation/n1:code/n1:translation/@displayName">
            <xsl:value-of select="$row/n1:organizer/n1:component/n1:observation/n1:code/n1:translation/@displayName"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="$row/n1:organizer/n1:component/n1:observation/n1:code/@displayName"/>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:value-of select="$row/n1:component/n1:observation"/>
      </xsl:when>
      <xsl:otherwise/>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="getResultType">
    <xsl:param name="observation"/>
    <xsl:choose>
      <xsl:when test="$observation/n1:code/n1:originalText">
        <xsl:value-of select="$observation/n1:code/n1:originalText"/>
      </xsl:when>
      <xsl:when test="$observation/n1:code/@displayName">
        <xsl:value-of select="$observation/n1:code/@displayName"/>
      </xsl:when>
      <xsl:when test="$observation/n1:code/n1:translation/@displayName">
        <xsl:value-of select="$observation/n1:code/n1:translation/@displayName"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="0"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="getResultType2">
    <xsl:param name="observation"/>
    <xsl:choose>
      <xsl:when test="$observation/n1:code/n1:originalText/n1:reference/@value">
        <xsl:call-template name="getResultTypeFromReference">
          <xsl:with-param name="resultTypeReference" select="$observation/n1:code/n1:originalText/n1:reference/@value"/>
          <xsl:with-param name="section" select="$observation/../../../../."/>
        </xsl:call-template>
      </xsl:when>
      <xsl:when test="$observation/n1:code/@displayName">
        <xsl:value-of select="$observation/n1:code/@displayName"/>
      </xsl:when>
      <xsl:when test="$observation/n1:code/n1:translation/@displayName">
        <xsl:value-of select="$observation/n1:code/n1:translation/@displayName"/>
      </xsl:when>
      <xsl:when test="$observation/n1:text/n1:reference/@value">
        <xsl:call-template name="getResultTypeFromReference">
          <xsl:with-param name="resultTypeReference" select="$observation/n1:text/n1:reference/@value"/>
          <xsl:with-param name="section" select="$observation/../../../../."/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="na"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

	<xsl:template name="getResultTypeFromReference">
		<xsl:param name="resultTypeReference"/>
		<xsl:param name="section"/>
		<xsl:variable name="resultTypeValue" select="$section//n1:content[@ID=$resultTypeReference]"/>
		<xsl:variable name="resultTypeValue2" select="$section//n1:content[@ID=substring-after($resultTypeReference,'#')]"/>
		<xsl:variable name="resultTypeValue3" select="$section/n1:text//n1:td[@ID=$resultTypeReference]"/>
		<xsl:variable name="resultTypeValue4" select="$section/n1:text//n1:td[@ID=substring-after($resultTypeReference,'#')]"/>
		<xsl:if test="string-length($resultTypeValue)>0">
			<xsl:value-of select="$resultTypeValue"/>
		</xsl:if>
		<xsl:if test="string-length($resultTypeValue2)>0">
			<xsl:value-of select="$resultTypeValue2"/>
		</xsl:if>
		<xsl:if test="string-length($resultTypeValue3)>0">
			<xsl:value-of select="$resultTypeValue3"/>
		</xsl:if>
		<xsl:if test="string-length($resultTypeValue4)>0">
			<xsl:value-of select="$resultTypeValue4"/>
		</xsl:if>
	</xsl:template>

  <xsl:template name="getResultValue">
    <xsl:param name="observation"/>
    <xsl:if test="$observation">
      <xsl:choose>
        <xsl:when test="$observation/n1:value/@value">
          <xsl:value-of select="$observation/n1:value/@value"/>
          <xsl:if test="$observation/n1:value/@unit">
            <xsl:text>&#160;&#160;&#160;&#160;</xsl:text>
            <xsl:value-of select="$observation/n1:value/@unit"/>
          </xsl:if>
        </xsl:when>
        <xsl:when test="$observation/n1:value[@xsi:type='ST']">
          <xsl:value-of select="$observation/n1:value[@xsi:type='ST']"/>
        </xsl:when>
        <xsl:when test="$observation/n1:value[@xsi:type='ED'] and not($observation/n1:value[@nullFlavor='NA'])">
          <xsl:value-of select="$observation/n1:value[@xsi:type='ED']"/>
        </xsl:when>
        <xsl:when test="$observation/n1:value[@xsi:type='CD']/@displayName">
          <xsl:value-of select="$observation/n1:value[@xsi:type='CD']/@displayName"/>
        </xsl:when>
        <xsl:when test="$observation/n1:value[@xsi:type='CD']/n1:originalText">
          <xsl:value-of select="$observation/n1:value[@xsi:type='CD']/n1:originalText"/>
        </xsl:when>
        <xsl:when test="$observation/n1:value[@xsi:type='IVL_PQ']/n1:low/@value">
          <xsl:value-of select="$observation/n1:value[@xsi:type='IVL_PQ']/n1:low/@value"/>
          <xsl:if test="$observation/n1:value[@xsi:type='IVL_PQ']/n1:low/@unit">
            <xsl:text>&#160;&#160;&#160;&#160;</xsl:text>
            <xsl:value-of select="$observation/n1:value[@xsi:type='IVL_PQ']/n1:low/@unit"/>
          </xsl:if>
        </xsl:when>
        <xsl:when test="$observation/n1:text/n1:reference/@value">
          <xsl:variable name="result" select="$observation/n1:text/n1:reference/@value"/>
          <xsl:variable name="section" select="$observation/../../../../."/>
          <xsl:value-of select="$section/n1:text//n1:item[@ID=substring-after($result,'#')]"/>
        </xsl:when>
      </xsl:choose>
    </xsl:if>
  </xsl:template>

	<xsl:template name="getInterpretation">
		<xsl:param name="observation"/>
		<xsl:choose>
			<xsl:when test="$observation/n1:interpretationCode/@displayName">
				<xsl:value-of select="$observation/n1:interpretationCode/@displayName"/>
			</xsl:when>
			<xsl:when test="$observation/n1:interpretationCode/n1:originalText">
				<xsl:value-of select="$observation/n1:interpretationCode/n1:originalText"/>
			</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="getInterpretation2">
		<xsl:param name="observation"/>
		<xsl:choose>
			<xsl:when test="$observation/n1:interpretationCode/n1:originalText/n1:reference/@value">
				<xsl:call-template name="getInterpretationFromReference">
					<xsl:with-param name="interpretationReference" select="$observation/n1:interpretationCode/n1:code/n1:originalText/n1:reference/@value"/>
					<xsl:with-param name="section" select="$observation/n1:interpretationCode/../../../../../."/>
				</xsl:call-template>
			</xsl:when>
      <xsl:when test="$observation/n1:interpretationCode/@code">
        <xsl:value-of select="$observation/n1:interpretationCode/@code"/>
      </xsl:when>
    </xsl:choose>
	</xsl:template>

	<xsl:template name="getInterpretationFromReference">
		<xsl:param name="interpretationReference"/>
		<xsl:param name="section"/>
		<xsl:variable name="interpretationValue" select="$section//n1:content[@ID=$interpretationReference]"/>
		<xsl:variable name="interpretationValue2" select="$section//n1:content[@ID=substring-after($interpretationReference,'#')]"/>
		<xsl:variable name="interpretationValue3" select="$section/n1:text//n1:td[@ID=$interpretationReference]"/>
		<xsl:variable name="interpretationValue4" select="$section/n1:text//n1:td[@ID=substring-after($interpretationReference,'#')]"/>
		<xsl:if test="string-length($interpretationValue)>0">
			<xsl:value-of select="$interpretationValue"/>
		</xsl:if>
		<xsl:if test="string-length($interpretationValue2)>0">
			<xsl:value-of select="$interpretationValue2"/>
		</xsl:if>
		<xsl:if test="string-length($interpretationValue3)>0">
			<xsl:value-of select="$interpretationValue3"/>
		</xsl:if>
		<xsl:if test="string-length($interpretationValue4)>0">
			<xsl:value-of select="$interpretationValue4"/>
		</xsl:if>
	</xsl:template>

	<xsl:template name="getRefRange">
		<xsl:param name="observation"/>
		<xsl:choose>
			<xsl:when test="$observation/n1:referenceRange/n1:observationRange/n1:text">
				<xsl:value-of select="$observation/n1:referenceRange/n1:observationRange/n1:text"/>
			</xsl:when>
			<xsl:when test="$observation/n1:referenceRange/n1:observationRange/n1:value/n1:low/@value and $observation/n1:referenceRange/n1:observationRange/n1:value/n1:high/@value">
				<xsl:value-of select="$observation/n1:referenceRange/n1:observationRange/n1:value/n1:low/@value"/>
				<xsl:text> - </xsl:text>
				<xsl:value-of select="$observation/n1:referenceRange/n1:observationRange/n1:value/n1:high/@value"/>
				<xsl:text>  </xsl:text>
				<xsl:value-of select="$observation/n1:referenceRange/n1:observationRange/n1:value/n1:high/@unit"/>
			</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:template>

	<!-- Immunizations -->

	<xsl:template name="getImmunization">
		<xsl:param name="substanceAdministration"/>
		<xsl:choose>
      <xsl:when test="$substanceAdministration/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:code/@displayName">
        <xsl:value-of select="$substanceAdministration/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:code/@displayName"/>
      </xsl:when>
      <xsl:when test="$substanceAdministration/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:code/n1:originalText/n1:reference/@value">
				<xsl:call-template name="getImmunizationFromReference">
					<xsl:with-param name="immunizationReference" select="$substanceAdministration/n1:consumable/n1:manufacturedProduct/n1:manufacturedMaterial/n1:code/n1:originalText/n1:reference/@value"/>
					<xsl:with-param name="section" select="$substanceAdministration/../../."/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="getImmunizationFromReference">
		<xsl:param name="immunizationReference"/>
		<xsl:param name="section"/>
		<xsl:variable name="immunizationValue" select="$section//n1:content[@ID=$immunizationReference]"/>
		<xsl:variable name="immunizationValue2" select="$section//n1:content[@ID=substring-after($immunizationReference,'#')]"/>
		<xsl:variable name="immunizationValue3" select="$section/n1:text//n1:td[@ID=$immunizationReference]"/>
		<xsl:variable name="immunizationValue4" select="$section/n1:text//n1:td[@ID=substring-after($immunizationReference,'#')]"/>
		<xsl:if test="string-length($immunizationValue)>0">
			<xsl:value-of select="$immunizationValue"/>
		</xsl:if>
		<xsl:if test="string-length($immunizationValue2)>0">
			<xsl:value-of select="$immunizationValue2"/>
		</xsl:if>
		<xsl:if test="string-length($immunizationValue3)>0">
			<xsl:value-of select="$immunizationValue3"/>
		</xsl:if>
		<xsl:if test="string-length($immunizationValue4)>0">
			<xsl:value-of select="$immunizationValue4"/>
		</xsl:if>
	</xsl:template>

	<!-- End domain templates -->

	<!--  Comments Section-->

	<xsl:template name="getCommonFormatComments">
		<xsl:variable name="ref1" select="n1:entry/n1:act/n1:text/n1:reference/@value"/>
		<xsl:variable name="ref2" select="substring-after($ref1,'#')"/>
    <xsl:choose>
			<xsl:when test="n1:text//n1:content[@ID=$ref1]">
				<xsl:call-template name="formatComments">
					<xsl:with-param name="comments" select="n1:text//n1:content[@ID=$ref1]"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="n1:text//n1:content[@ID=$ref2]">
				<xsl:call-template name="formatComments">
					<xsl:with-param name="comments" select="n1:text//n1:content[@ID=$ref2]"/>
				</xsl:call-template>
			</xsl:when>
      <xsl:otherwise>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- Encounters Comments-->

	<!-- Encounters Notice (Comments field)-->
	<xsl:template name="encounterNotice">
		<div>
			<table class="comments">
				<tbody>
					<tr>
						<td>
							<img src="app/applets/ccd_grid/assets/vler_resource/c32Styles/comments_notice.jpg" alt="NOTE:"/>
							<text style="line-height:10%">
								<b> NOTE: Click on the Encounter Comments field to display/hide additional data where applicable</b>
							</text>
						</td>
					</tr>
				</tbody>
			</table>
			<br/>
		</div>
	</xsl:template>

	<!-- Procedures Comments-->

	<!-- Procedures Notice (Comments field)-->
	<xsl:template name="proceduresNotice">
		<div>
			<table class="comments">
				<tbody>
					<tr>
						<td>
							<img src="app/applets/ccd_grid/assets/vler_resource/c32Styles/comments_notice.jpg" alt="NOTE:"/>
							<text>
								<b> NOTE: Click on the Procedure Comments field to display/hide additional data where applicable</b>
							</text>
						</td>
					</tr>
				</tbody>
			</table>
			<br/>
		</div>
	</xsl:template>

	<!-- Miscellaneous -->
	<xsl:template name="na">
		<span title="Not Available">
			<xsl:text>--</xsl:text>
		</span>
	</xsl:template>

  <xsl:template name="noData">
    <span style="font-weight:bold;">
      <xsl:text disable-output-escaping="yes">&amp;nbsp;&amp;nbsp;</xsl:text>
      <img src="app/applets/ccd_grid/assets/vler_resource/c32Styles/notice.jpg" alt="Notice"/>
      <xsl:text disable-output-escaping="yes">&amp;nbsp;&amp;nbsp&amp;nbsp;No Data Provided for this Section</xsl:text>
    </span>
    <br></br>
    <br></br>
  </xsl:template>

	<xsl:template name="shortenDate">
		<xsl:param name="inString"/>
		<xsl:choose>
			<xsl:when test="substring($inString,9,1)='.'">
				<xsl:value-of select="substring($inString,1,15)"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="substring($inString,1,14)"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="getLoincStatusCode">
		<xsl:param name="entry"/>
		<xsl:if test="$entry">
			<xsl:choose>
				<xsl:when test="string-length($entry//n1:entryRelationship/n1:observation[n1:code[@code='33999-4' and @codeSystem='2.16.840.1.113883.6.1']]/n1:value/n1:originalText)>0">
					<xsl:value-of select="$entry//n1:entryRelationship/n1:observation[n1:code[@code='33999-4' and @codeSystem='2.16.840.1.113883.6.1']]/n1:value/n1:originalText"/>
				</xsl:when>
				<xsl:when test="string-length($entry//n1:entryRelationship/n1:observation[n1:code[@code='33999-4' and @codeSystem='2.16.840.1.113883.6.1']]/n1:value/@displayName)">
					<xsl:value-of select="$entry//n1:entryRelationship/n1:observation[n1:code[@code='33999-4' and @codeSystem='2.16.840.1.113883.6.1']]/n1:value/@displayName"/>
				</xsl:when>
				<xsl:otherwise></xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

</xsl:stylesheet>
