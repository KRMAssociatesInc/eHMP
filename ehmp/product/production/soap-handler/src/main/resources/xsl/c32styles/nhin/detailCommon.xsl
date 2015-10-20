<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
	xmlns:n1="urn:hl7-org:v3"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:import href="nhinCommon.xsl"/>
  <xsl:import href="../common.xsl"/>

  <xsl:variable name="snomedCode">2.16.840.1.113883.6.96</xsl:variable>
  <xsl:variable name="snomedProblemCode">55607006</xsl:variable>
  <xsl:variable name="snomedProblemCode2">404684003</xsl:variable>
  <xsl:variable name="snomedProblemCode3">418799008</xsl:variable>
  <xsl:variable name="snomedAllergyCode">416098002</xsl:variable>

  <xsl:variable name="loincCode">2.16.840.1.113883.6.1</xsl:variable>
  <xsl:variable name="loincProblemCode">11450-4</xsl:variable>
  <xsl:variable name="loincAllergyCode">48765-2</xsl:variable>
  <xsl:variable name="loincMedCode">10160-0</xsl:variable>
  <xsl:variable name="loincEncounterCode">46240-8</xsl:variable>
  <xsl:variable name="loincResultsCode">30954-2</xsl:variable>
  <xsl:variable name="loincProceduresCode">47519-4</xsl:variable>
  <xsl:variable name="loincImmunizationsCode">11369-6</xsl:variable>
  <xsl:variable name="loincVitalsCode">8716-3</xsl:variable>

  <!-- vitals -->
  <xsl:variable name="loincTemperature">8310-5</xsl:variable>
  <xsl:variable name="loincHeight">8302-2</xsl:variable>
  <xsl:variable name="loincWeight">3141-9</xsl:variable>
  <xsl:variable name="loincPulse">8867-4</xsl:variable>
  <xsl:variable name="loincRespiration">9279-1</xsl:variable>
  <xsl:variable name="loincPulseOximetry">2710-2</xsl:variable>
  <xsl:variable name="loincBloodGlucose">2339-0</xsl:variable>
  <xsl:variable name="loincBloodPressure">55284-4</xsl:variable>
  <xsl:variable name="loincBmi1">39156-5</xsl:variable>
  <xsl:variable name="loincBmi2">41909-3</xsl:variable>
  <xsl:variable name="loincCentralVenousPressure">8591-0</xsl:variable>
  <xsl:variable name="loincCircGirth">8280-0</xsl:variable>
  <xsl:variable name="loincFlowRate">3151-8</xsl:variable>
  <xsl:variable name="loincO2Concentration">3150-0</xsl:variable>
  <xsl:variable name="loincPain">32419-4</xsl:variable>
  <xsl:variable name="loincBpSystolic">8480-6</xsl:variable>
  <xsl:variable name="loincBpDiastolic">8462-4</xsl:variable>
  <xsl:variable name="loincBodyHtLying">8306-3</xsl:variable>
  <xsl:variable name="loincOCF">8287-5</xsl:variable>
  <xsl:variable name="loincWeight2">29463-7</xsl:variable>

  <xsl:variable name="vitalsTemplateCode">2.16.840.1.113883.10.20.1.32</xsl:variable>
  <xsl:variable name="labsTemplateCode">2.16.840.1.113883.10.20.1.32</xsl:variable>
  <xsl:variable name="immunizationsTemplateCode">2.16.840.1.113883.10.20.1.32</xsl:variable>
  <xsl:variable name="allergyTemplateCode">2.16.840.1.113883.10.20.1.18</xsl:variable>
  <xsl:variable name="problemTemplateCode">2.16.840.1.113883.10.20.1.28</xsl:variable>

  <xsl:variable name="row">"ClinicalDocument/"</xsl:variable>

  <xsl:variable name="title">
    <xsl:choose>
      <xsl:when test="string-length(/n1:ClinicalDocument/n1:title)=0">
        <xsl:text>Clinical Document</xsl:text>
      </xsl:when>
      <xsl:when test="/n1:ClinicalDocument/n1:title">
        <xsl:value-of select="/n1:ClinicalDocument/n1:title"/>
      </xsl:when>
    </xsl:choose>
  </xsl:variable>

  <xsl:template name="facilityName">
    <xsl:value-of select="/n1:ClinicalDocument/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name"/>
  </xsl:template>

  <xsl:template name="getLocationName">
    <xsl:param name="organizer"/>
    <xsl:choose>
      <xsl:when test="$organizer/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name">
        <xsl:value-of select="$organizer/n1:author/n1:assignedAuthor/n1:representedOrganization/n1:name"/>
      </xsl:when>
      <xsl:when test="$organizer/n1:performer/n1:assignedEntity/n1:representedOrganization/n1:name">
        <xsl:value-of select="$organizer/n1:performer/n1:assignedEntity/n1:representedOrganization/n1:name"/>
      </xsl:when>
    </xsl:choose>
  </xsl:template>

  <!-- Medications -->

  <xsl:template name="medStatus">
    <xsl:param name="substanceAdmin"/>
    <xsl:variable name="status">
      <xsl:call-template name="getMedStatusString">
        <xsl:with-param name="substanceAdmin" select="$substanceAdmin"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="string-length($status)&gt;0">
        <xsl:value-of select="$status"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="na"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="medQuantity">
    <xsl:param name="substanceAdmin"/>
    <xsl:variable name="qtyString">
      <xsl:call-template name="getMedQuantityString">
        <xsl:with-param name="substanceAdmin" select="$substanceAdmin"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="string-length($qtyString)>0">
        <xsl:value-of select="$qtyString"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="na"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="medBegintime">
    <xsl:param name="row"/>
    <xsl:variable name="medBeginString">
      <xsl:call-template name="medDateBeginString">
        <xsl:with-param name="substanceAdmin" select="$row/n1:substanceAdministration"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="string-length($medBeginString)&gt;1">
        <xsl:call-template name="formatDateShort">
          <xsl:with-param name="dateString" select="$medBeginString"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="na"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="medExpiretime">
    <xsl:param name="substanceAdmin"/>
    <xsl:variable name="medExpireString">
      <xsl:call-template name="medExpireDateString">
        <xsl:with-param name="substanceAdmin" select="$substanceAdmin"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="string-length($medExpireString)>1">
        <xsl:call-template name="formatDateShort">
          <xsl:with-param name="dateString" select="$medExpireString"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="na"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- Problems -->

	<xsl:template name="probStatus">
		<xsl:param name="row"/>
		<xsl:variable name="loincStatus">
			<xsl:call-template name="getLoincStatusCode">
				<xsl:with-param name="entry" select="$row"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length($loincStatus)>0">
				<xsl:value-of select="$loincStatus"/>
			</xsl:when>
			<xsl:when test="$row/n1:act/n1:entryRelationship [@typeCode='SUBJ']/n1:observation [@moodCode='EVN'] [@classCode='OBS']/n1:statusCode/@code">
				<xsl:value-of select="$row/n1:act/n1:entryRelationship [@typeCode='SUBJ']/n1:observation [@moodCode='EVN'] [@classCode='OBS']/n1:statusCode/@code"/>
			</xsl:when>
			<xsl:when test="$row/n1:act/n1:entryRelationship[@typeCode='SUBJ']/n1:observation/n1:entryRelationship[@typeCode='REFR']/n1:observation/n1:value/@displayName">
				<xsl:value-of select="$row/n1:act/n1:entryRelationship[@typeCode='SUBJ']/n1:observation/n1:entryRelationship[@typeCode='REFR']/n1:observation/n1:value/@displayName"/>
			</xsl:when>
			<xsl:when test="$row/n1:act/n1:entryRelationship[@typeCode='REFR']/n1:observation/n1:value/@displayName">
				<xsl:value-of select="$row/n1:act/n1:entryRelationship[@typeCode='REFR']/n1:observation/n1:value/@displayName"/>
			</xsl:when>
			<xsl:when test="$row/n1:act/n1:entryRelationship[@typeCode='SUBJ']/n1:observation/n1:value/@displayName">
				<xsl:value-of select="$row/n1:act/n1:entryRelationship[@typeCode='SUBJ']/n1:observation/n1:value/@displayName"/>
			</xsl:when>
			<xsl:when test="$row/n1:act/n1:entryRelationship[@typeCode='SUBJ']/n1:observation/n1:statusCode/@code">
				<xsl:value-of select="$row/n1:act/n1:entryRelationship[@typeCode='SUBJ']/n1:observation/n1:statusCode/@code"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

  <xsl:template name="probDate">
    <xsl:param name="row"/>
    <xsl:variable name="rawDate">
      <xsl:call-template name="getProblemOnsetDateString">
        <xsl:with-param name="act" select="$row/n1:act"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="string-length($rawDate)>1">
        <xsl:call-template name="formatDateShort">
          <xsl:with-param name="dateString" select="$rawDate"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="na"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- Allergies -->

  <xsl:template name="allergyType">
    <xsl:param name="observation"/>
    <xsl:choose>
      <xsl:when test="$observation/n1:code/@displayName and not ($isKaiser)">
        <xsl:value-of select="$observation/n1:code/@displayName"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="na"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="getReactionString">
    <xsl:param name="entry"/>
    <xsl:variable name="path" select="$entry/.."/>
    <xsl:for-each select="$entry/n1:act/n1:entryRelationship[@typeCode='MFST']">
      <xsl:variable name="reactionReference" select="n1:observation/n1:text/n1:reference/@value"/>
      <xsl:variable name="reactionValue" select="$path/n1:text//n1:content[@ID=$reactionReference]"/>
      <xsl:variable name="reactionValue2" select="$path/n1:text//n1:content[@ID=substring-after($reactionReference,'#')]"/>
      <xsl:if test="string-length($reactionValue)>1 and not($isKaiser)">
        <xsl:if test="position()>1">
          <xsl:text>, </xsl:text>
        </xsl:if>
        <xsl:value-of select="$reactionValue"/>
      </xsl:if>
      <xsl:if test="string-length($reactionValue2)>1">
        <xsl:if test="position()>1">
          <xsl:text>, </xsl:text>
        </xsl:if>
        <xsl:value-of select="$reactionValue2"/>
      </xsl:if>
    </xsl:for-each>
  </xsl:template>

  <xsl:template name="getSeverityText">
    <xsl:param name="observation"/>
    <xsl:if test="$observation">
      <xsl:variable name="sevrReference" select="substring-after($observation/n1:entryRelationship/n1:observation/n1:entryRelationship/n1:observation/n1:text/n1:reference/@value,'#')"/>
      <xsl:variable name="severity" select="$observation/../../../../n1:text//n1:content[@ID=$sevrReference]"/>
      <xsl:if test="string-length($severity)>1">
        <xsl:value-of select="$severity"/>
      </xsl:if>
    </xsl:if>
  </xsl:template>

  <xsl:template name="getCreatedOnDate">
    <xsl:choose>
      <xsl:when test="string-length(/n1:ClinicalDocument/n1:effectiveTime/@value)=0">
        <xsl:call-template name="na"/>
      </xsl:when>
      <xsl:when test="starts-with(/n1:ClinicalDocument/n1:effectiveTime/@value,' ')">
        <xsl:call-template name="na"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="formatDateLong">
          <xsl:with-param name="dateString" select="/n1:ClinicalDocument/n1:effectiveTime/@value"/>
        </xsl:call-template>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="getGenderString">
    <xsl:choose>
      <xsl:when test="/n1:ClinicalDocument/n1:recordTarget/n1:patientRole/n1:patient/n1:administrativeGenderCode/@code">
        <xsl:value-of select="/n1:ClinicalDocument/n1:recordTarget/n1:patientRole/n1:patient/n1:administrativeGenderCode/@code"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="genderString">
          <xsl:with-param name="sex" select="/n1:ClinicalDocument/n1:recordTarget/n1:patientRole/n1:patient/n1:administrativeGenderCode/n1:originalText"/>
        </xsl:call-template>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- Labs -->

  <xsl:template name="getResultValue_detail">
    <xsl:param name="observation"/>
    <xsl:if test="$observation">
      <xsl:variable name="resultValue">
        <xsl:call-template name="getResultValue">
          <xsl:with-param name="observation" select="$observation"/>
        </xsl:call-template>
      </xsl:variable>
      <xsl:choose>
        <xsl:when test="string-length(normalize-space($resultValue))>0">
          <xsl:value-of select="normalize-space($resultValue)"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:call-template name="na"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
  </xsl:template>

  <xsl:template name="getFlag">
    <xsl:param name="interpretation"/>
    <xsl:choose>
      <xsl:when test="$interpretation/@displayName">
        <xsl:value-of select="$interpretation/@displayName"/>
      </xsl:when>
      <xsl:when test="$interpretation/n1:originalText">
        <xsl:value-of select="$interpretation/n1:originalText"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="na"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="getResultUnit">
    <xsl:param name="observation"/>
    <xsl:choose>
      <xsl:when test="$observation/n1:value/@unit">
        <xsl:value-of select="$observation/n1:value/@unit"/>
      </xsl:when>
      <xsl:when test="$isKaiser">
        <xsl:text></xsl:text>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="na"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="getResultRefRange">
    <xsl:param name="observation"/>
    <xsl:choose>
      <xsl:when test="$observation/n1:referenceRange/n1:observationRange/n1:text">
        <xsl:value-of select="$observation/n1:referenceRange/n1:observationRange/n1:text"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="na"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!--Determine if supported component(s) -->
  
  <xsl:template name="componentFound">
    <xsl:param name="compSection"/>
    <xsl:choose>
      <xsl:when test="$compSection/n1:code[@code=$loincAllergyCode]">
        <xsl:value-of select="$compSection/n1:code/@code"/>
      </xsl:when>
      <xsl:when test="$compSection/n1:code[@code=$loincEncounterCode]">
        <xsl:value-of select="$compSection/n1:code/@code"/>
      </xsl:when>
      <xsl:when test="$compSection/n1:code[@code=$loincImmunizationsCode]">
        <xsl:value-of select="$compSection/n1:code/@code"/>
      </xsl:when>
      <xsl:when test="$compSection/n1:code[@code=$loincMedCode] and not($noMed)">
        <xsl:value-of select="$compSection/n1:code/@code"/>
      </xsl:when>
      <xsl:when test="$compSection/n1:code[@code=$loincProblemCode] and not($noMdoProb)">
        <xsl:value-of select="$compSection/n1:code/@code"/>
      </xsl:when>
      <xsl:when test="$compSection/n1:code[@code=$loincProceduresCode]">
        <xsl:value-of select="$compSection/n1:code/@code"/>
      </xsl:when>
      <xsl:when test="$compSection/n1:code[@code=$loincResultsCode] and not($noMdoResult)">
        <xsl:value-of select="$compSection/n1:code/@code"/>
      </xsl:when>
      <xsl:when test="$compSection/n1:code[@code=$loincVitalsCode]">
        <xsl:value-of select="$compSection/n1:code/@code"/>
      </xsl:when>
      <xsl:otherwise/>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="na">
    <xsl:text>- Not Available -</xsl:text>
  </xsl:template>

  <xsl:template name="replaceSquigglesWithLinefeeds">
    <xsl:param name="text"/>
    <xsl:if test="$text">
      <xsl:choose>
        <xsl:when test="contains($text,'~')">
          <xsl:value-of select="substring-before($text,'~')"/>
          <xsl:text>&#13;&#10;</xsl:text>
          <xsl:call-template name="replaceSquigglesWithLinefeeds">
            <xsl:with-param name="text" select="substring-after($text,'~')"/>
          </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$text"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
  </xsl:template>

  <xsl:template name="displayAllergyVerificationDate">
    <xsl:param name="observation"/>
    <xsl:variable name="allergyVerifDate">
      <xsl:call-template name="getAllergyVerificationDate">
        <xsl:with-param name="observation" select="$observation"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="string-length($allergyVerifDate)>0">
        <xsl:variable name="formattedVerifDate">
          <xsl:call-template name="formatDateShort">
            <xsl:with-param name="dateString" select="$allergyVerifDate"/>
          </xsl:call-template>
        </xsl:variable>
        <xsl:value-of select="$formattedVerifDate"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="na"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
