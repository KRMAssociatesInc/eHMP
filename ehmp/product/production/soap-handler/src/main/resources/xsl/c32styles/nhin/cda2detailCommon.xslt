<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl"
	xmlns:n1="urn:hl7-org:v3">

	<xsl:import href="detailCommon.xsl"/>

	<xsl:template match="/">
		<xsl:apply-templates select="n1:ClinicalDocument"/>
	</xsl:template>

	<xsl:template match="n1:ClinicalDocument">
		<xsl:call-template name="displaySource"/>
		<xsl:call-template name="displayTitle"/>
		<xsl:call-template name="displayReportDates"/>
		<xsl:call-template name="displayPatientBlock"/>
		<xsl:call-template name="displayAuthorBlock"/>
		<xsl:call-template name="displayTableOfContents"/>
		<xsl:call-template name="displayContents"/>
		<xsl:call-template name="displayContactInfoBlock"/>
		<xsl:call-template name="displayBottomLine"/>
	</xsl:template>

	<!-- Templates to be overridden -->
	<!-- ======================================================================== -->
	<xsl:template name="allergyRow"/>
	<xsl:template name="display1LineBreak"/>
	<xsl:template name="displayAllergyComponentSection"/>
	<xsl:template name="displayAuthorBlock"/>
	<xsl:template name="displayBottomLine"/>
	<xsl:template name="displayContactInfoBlock"/>
	<xsl:template name="displayContents"/>
	<xsl:template name="displayEncounterComponentSection"/>
	<xsl:template name="displayImmunizationsComponentSection"/>
	<xsl:template name="displayMedsComponentSection"/>
	<xsl:template name="displayPatientBlock"/>
	<xsl:template name="displayProblemComponentSection"/>
	<xsl:template name="displayProceduresComponentSection"/>
	<xsl:template name="displayReportDates"/>
	<xsl:template name="displayResultsComponentSection"/>
	<xsl:template name="displaySource"/>
	<xsl:template name="displayTableOfContents"/>
	<xsl:template name="displayTitle"/>
	<xsl:template name="displayVitalRow"/>
	<xsl:template name="displayVitalsBpItem"/>
	<xsl:template name="displayVitalsComponentSection"/>
	<xsl:template name="displayVitalsDateItem"/>
	<xsl:template name="displayVitalsHeightItem"/>
	<xsl:template name="displayVitalsMultiSeparator"/>
	<xsl:template name="displayVitalsPoxItem"/>
	<xsl:template name="displayVitalsPulseItem"/>
	<xsl:template name="displayVitalsRespItem"/>
	<xsl:template name="displayVitalsSourceItem"/>
	<xsl:template name="displayVitalsTempItem"/>
	<xsl:template name="displayVitalsWeightItem"/>
	<xsl:template name="encRow"/>
	<xsl:template name="flyoverSpan"/>
	<xsl:template name="immunizationsRow"/>
	<xsl:template name="labsRow"/>
	<xsl:template name="medRow"/>
	<xsl:template name="problemRow"/>
	<xsl:template name="procedureRow"/>
	<!-- End-of-Templates to be overridden -->
	<!-- ======================================================================== -->

	<xsl:template name="documentTitle">
		<xsl:param name="root"/>
		<xsl:choose>
			<xsl:when test="string-length($root/n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:name)>0">
				<xsl:value-of select="$root/n1:custodian/n1:assignedCustodian/n1:representedCustodianOrganization/n1:name"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$root/n1:author[1]/n1:assignedAuthor/n1:representedOrganization/n1:name"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

  <xsl:template name="getName">
    <xsl:param name="name"/>
    <xsl:choose>
      <xsl:when test="$name/n1:family">
        <xsl:for-each select="$name/n1:given">
          <xsl:text> </xsl:text>
          <xsl:value-of select="."/>
        </xsl:for-each>
        <xsl:text> </xsl:text>
        <xsl:if test="string-length($name/n1:family)>0">
          <xsl:value-of select="$name/n1:family"/>
        </xsl:if>
        <xsl:text> </xsl:text>
        <xsl:if test="string-length($name/n1:suffix)>0">
          <xsl:if test="$name/n1:suffix != ' '">
            <xsl:text>, </xsl:text>
            <xsl:value-of select="$name/n1:suffix"/>
          </xsl:if>
        </xsl:if>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$name"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="n1:entry">
		<xsl:variable name="allergy-prob-Root" select="n1:act/n1:entryRelationship/n1:observation/n1:templateId/@root"/>
		<xsl:variable name="med-imm-Root" select="n1:substanceAdministration/n1:templateId/@root"/>
		<xsl:variable name="labs-Root" select="../n1:templateId/@root"/>
		<xsl:variable name="vitals-Root" select="n1:organizer/n1:templateId/@root"/>
		<xsl:choose>
			<xsl:when test="$allergy-prob-Root='2.16.840.1.113883.10.20.1.18'">
				<xsl:call-template name="allergyRow">
					<xsl:with-param name="row" select="."/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$allergy-prob-Root!='2.16.840.1.113883.10.20.1.18'">
				<xsl:call-template name="problemRow">
					<xsl:with-param name="row" select="."/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="n1:encounter">
				<xsl:call-template name="encRow">
					<xsl:with-param name="row" select="."/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="n1:procedure">
				<xsl:call-template name="procedureRow">
					<xsl:with-param name="row" select="."/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$med-imm-Root='2.16.840.1.113883.3.88.11.83.13'">
				<xsl:call-template name="immunizationsRow">
					<xsl:with-param name="row" select="."/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$med-imm-Root!='2.16.840.1.113883.3.88.11.83.13'">
				<xsl:call-template name="medRow">
					<xsl:with-param name="row" select="."/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$labs-Root='2.16.840.1.113883.10.20.1.14'">
				<xsl:call-template name="labsRow">
					<xsl:with-param name="row" select="."/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$vitals-Root='2.16.840.1.113883.10.20.1.32'">
				<xsl:call-template name="vitalsRow">
					<xsl:with-param name="row" select="."/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="vitalsRow">
		<xsl:param name="row"/>
		<xsl:call-template name="displayVitalRow">
			<xsl:with-param name="row" select="$row"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="displayVitalsDate">
		<xsl:param name="rowData"/>
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
	</xsl:template>

	<xsl:template name="displayVitalsTemp">
		<xsl:param name="temp"/>
		<xsl:for-each select="$temp">
			<xsl:if test="position()>1">
				<xsl:call-template name="displayVitalsMultiSeparator"/>
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
				<xsl:otherwise>
					<xsl:call-template name="na"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="displayVitalsPulse">
		<xsl:param name="pulse"/>
		<xsl:for-each select="$pulse">
			<xsl:if test="position()>1">
				<xsl:call-template name="displayVitalsMultiSeparator"/>
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
				<xsl:otherwise>
					<xsl:call-template name="na"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="displayVitalsResp">
		<xsl:param name="resp"/>
		<xsl:for-each select="$resp">
			<xsl:if test="position()>1">
				<xsl:call-template name="displayVitalsMultiSeparator"/>
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
				<xsl:otherwise>
					<xsl:call-template name="na"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="displayVitalsBp">
		<xsl:param name="row"/>
		<xsl:variable name="systolic" select="$row/n1:organizer/n1:component/n1:observation[n1:code/@code=$loincBpSystolic]"/>
		<xsl:variable name="diastolic" select="$row/n1:organizer/n1:component/n1:observation[n1:code/@code=$loincBpDiastolic]"/>
		<xsl:variable name="bloodPressure" select="$row/n1:organizer/n1:component/n1:observation[n1:code/@code=$loincBloodPressure]"/>
		<xsl:choose>
			<xsl:when test="$systolic/n1:value/@value or $diastolic/n1:value/@value or $bloodPressure/n1:value/@value">
				<xsl:call-template name="bpDetailLister">
					<xsl:with-param name="systolics" select="$systolic"/>
					<xsl:with-param name="diastolics" select="$diastolic"/>
				</xsl:call-template>
				<xsl:if test="$systolic/n1:value/@value and $bloodPressure/n1:value/@value">
					<xsl:call-template name="displayVitalsMultiSeparator"/>
				</xsl:if>
				<xsl:for-each select="$bloodPressure">
					<xsl:if test="position()>1">
						<xsl:call-template name="displayVitalsMultiSeparator"/>
					</xsl:if>
					<xsl:value-of select="n1:value/@value"/>
				</xsl:for-each>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="displayVitalsHeight">
		<xsl:param name="height"/>
		<xsl:for-each select="$height">
			<xsl:if test="position()>1">
				<xsl:call-template name="displayVitalsMultiSeparator"/>
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
				<xsl:otherwise>
					<xsl:call-template name="na"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="displayVitalsWeight">
		<xsl:param name="weight"/>
		<xsl:for-each select="$weight">
			<xsl:if test="position()>1">
				<xsl:call-template name="displayVitalsMultiSeparator"/>
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

	<xsl:template name="displayVitalsPox">
		<xsl:param name="pox"/>
		<xsl:for-each select="$pox">
			<xsl:if test="position()>1">
				<xsl:call-template name="displayVitalsMultiSeparator"/>
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
				<xsl:otherwise>
					<xsl:call-template name="na"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="displayVitalsSource">
		<xsl:param name="row"/>
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
	</xsl:template>

	<xsl:template name="displayVitalItems">
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

		<xsl:call-template name="displayVitalsDateItem">
			<xsl:with-param name="rowData" select="$rowData"/>
		</xsl:call-template>

		<xsl:call-template name="displayVitalsTempItem">
			<xsl:with-param name="temp" select="$temp"/>
		</xsl:call-template>

		<xsl:call-template name="displayVitalsPulseItem">
			<xsl:with-param name="pulse" select="$pulse"/>
		</xsl:call-template>

		<xsl:call-template name="displayVitalsRespItem">
			<xsl:with-param name="resp" select="$resp"/>
		</xsl:call-template>

		<xsl:call-template name="displayVitalsBpItem">
			<xsl:with-param name="row" select="$row"/>
		</xsl:call-template>

		<xsl:call-template name="displayVitalsHeightItem">
			<xsl:with-param name="height" select="$height"/>
		</xsl:call-template>

		<xsl:call-template name="displayVitalsWeightItem">
			<xsl:with-param name="weight" select="$weight"/>
		</xsl:call-template>

		<xsl:call-template name="displayVitalsPoxItem">
			<xsl:with-param name="pox" select="$pox"/>
		</xsl:call-template>

		<xsl:call-template name="displayVitalsSourceItem">
			<xsl:with-param name="row" select="$row"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="bpDetailLister">
		<xsl:param name="systolics"/>
		<xsl:param name="diastolics"/>
		<xsl:param name="index" select="1"/>
		<xsl:if test="(($systolics)[$index] or ($diastolics)[$index]) and $index>1">
			<xsl:call-template name="displayVitalsMultiSeparator"/>
		</xsl:if>
		<xsl:choose>
			<xsl:when test="($systolics)[$index] and ($diastolics)[$index]">
				<xsl:value-of select="($systolics)[$index]/n1:value/@value"/>/<xsl:value-of select="($diastolics)[$index]/n1:value/@value"/>
				<xsl:call-template name="bpDetailLister">
					<xsl:with-param name="systolics" select="$systolics"/>
					<xsl:with-param name="diastolics" select="$diastolics"/>
					<xsl:with-param name="index" select="$index+1"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="($systolics)[$index]">
				<xsl:value-of select="($systolics)[$index]/n1:value/@value"/>
				<xsl:call-template name="bpDetailLister">
					<xsl:with-param name="systolics" select="$systolics"/>
					<xsl:with-param name="diastolics" select="$diastolics"/>
					<xsl:with-param name="index" select="$index+1"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="($diastolics)[$index]">
				<xsl:value-of select="($diastolics)[$index]/n1:value/@value"/>
				<xsl:call-template name="bpDetailLister">
					<xsl:with-param name="systolics" select="$systolics"/>
					<xsl:with-param name="diastolics" select="$diastolics"/>
					<xsl:with-param name="index" select="$index+1"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise></xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="n1:component/n1:section">
		<xsl:apply-templates select="n1:title"/>
		<xsl:choose>
			<xsl:when test="n1:code[@code=$loincProblemCode] and not($noMdoProb)">
				<xsl:call-template name="displayProblemComponentSection"/>
			</xsl:when>
			
			<xsl:when test="n1:code[@code=$loincAllergyCode]">
				<xsl:call-template name="displayAllergyComponentSection"/>
			</xsl:when>
			
			<xsl:when test="n1:code[@code=$loincMedCode] and not($noMed)">
				<xsl:call-template name="displayMedsComponentSection"/>
			</xsl:when>
			
			<xsl:when test="n1:code[@code=$loincEncounterCode]">
				<xsl:call-template name="displayEncounterComponentSection"/>
			</xsl:when>
			
			<xsl:when test="n1:code[@code=$loincResultsCode] and not($noMdoResult)">
				<xsl:call-template name="displayResultsComponentSection"/>
			</xsl:when>
			
			<xsl:when test="n1:code[@code=$loincProceduresCode]">
				<xsl:call-template name="displayProceduresComponentSection"/>
			</xsl:when>
			
			<xsl:when test="n1:code[@code=$loincImmunizationsCode]">
				<xsl:call-template name="displayImmunizationsComponentSection"/>
			</xsl:when>
			
			<xsl:when test="n1:code[@code=$loincVitalsCode]">
				<xsl:call-template name="displayVitalsComponentSection"/>
			</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
		<xsl:apply-templates select="n1:component/n1:section"/>
	</xsl:template>

</xsl:stylesheet>
