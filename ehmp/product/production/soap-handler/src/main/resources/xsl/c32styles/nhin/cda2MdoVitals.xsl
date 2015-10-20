<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" 
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	xmlns:n1="urn:hl7-org:v3">
	<xsl:import href="../common.xsl"/>
	<xsl:import href="detailCommon.xsl"/>
	<xsl:output method="xml" encoding="utf-8" indent="yes" media-type="text/xml"/>

	<xsl:template match="/">
		<xsl:apply-templates select="/n1:ClinicalDocument"/>
	</xsl:template>

	<xsl:template match="n1:ClinicalDocument">
		<vitals>
			<xsl:apply-templates select="n1:component/n1:structuredBody/n1:component/n1:section[n1:code/@code=$loincVitalsCode and n1:code/@codeSystem='2.16.840.1.113883.6.1']/n1:entry/n1:organizer"/>
		</vitals>
	</xsl:template>

	<xsl:template match="n1:component/n1:structuredBody/n1:component/n1:section/n1:entry/n1:organizer">
		<xsl:apply-templates select="n1:component/n1:observation[n1:code/@code!=$loincBpSystolic and n1:code/@code!=$loincBpDiastolic]"/>
		<xsl:call-template name="processBloodPressure">
			<xsl:with-param name="inList" select="."/>
			<xsl:with-param name="index" select="1"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="processBloodPressure">
		<xsl:param name="inList"/>
		<xsl:param name="index"/>
		<xsl:variable name="sysNode" select="($inList/n1:component/n1:observation[n1:code/@code=$loincBpSystolic])[$index]"/>
		<xsl:variable name="diNode" select="($inList/n1:component/n1:observation[n1:code/@code=$loincBpDiastolic])[$index]"/>
		<xsl:choose>
			<xsl:when test="$sysNode and $diNode">
				<gov.va.med.mdo.Observation>
					<Protocol>NHIN</Protocol>
					<xsl:apply-templates select="$sysNode/n1:effectiveTime"/>
					<TypeTitle>bloodPressure</TypeTitle>
					<ObservationValue format="bloodPressure">
						<xsl:value-of select="$sysNode/n1:value/@value"/>
						<xsl:text>/</xsl:text>
						<xsl:value-of select="$diNode/n1:value/@value"/>
					</ObservationValue>
					<Standardized>S</Standardized>
					<xsl:apply-templates select="$sysNode/n1:value"/>
					<IsErrorEntry>false</IsErrorEntry>
					<xsl:if test="count($sysNode/n1:methodCode)>0 or count($diNode/n1:methodCode)>0">
						<MethodList>
							<xsl:text>&lt;list&gt;</xsl:text>
							<xsl:apply-templates select="$sysNode/n1:methodCode"/>
							<xsl:apply-templates select="$diNode/n1:methodCode"/>
							<xsl:text>&lt;/list&gt;</xsl:text>
						</MethodList>
					</xsl:if>
					<xsl:if test="count($sysNode/n1:targetSiteCode)>0 or count($diNode/n1:targetSiteCode)>0">
						<QualifierList>
							<xsl:text>&lt;list&gt;</xsl:text>
							<xsl:apply-templates select="$sysNode/n1:targetSiteCode"/>
							<xsl:apply-templates select="$diNode/n1:targetSiteCode"/>
							<xsl:text>&lt;/list&gt;</xsl:text>
						</QualifierList>
					</xsl:if>
					<Facility><xsl:call-template name="facilityName"/></Facility>
				</gov.va.med.mdo.Observation>
				<xsl:call-template name="processBloodPressure">
					<xsl:with-param name="inList" select="$inList"/>
					<xsl:with-param name="index" select="$index+1"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$sysNode">
				<xsl:apply-templates select="$sysNode"/>
				<xsl:call-template name="processBloodPressure">
					<xsl:with-param name="inList" select="$inList"/>
					<xsl:with-param name="index" select="$index+1"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$diNode">
				<xsl:apply-templates select="$diNode"/>
				<xsl:call-template name="processBloodPressure">
					<xsl:with-param name="inList" select="$inList"/>
					<xsl:with-param name="index" select="$index+1"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise></xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="n1:component/n1:structuredBody/n1:component/n1:section/n1:entry/n1:organizer/n1:component/n1:observation">
		<gov.va.med.mdo.Observation>
			<Protocol>NHIN</Protocol>
			<xsl:apply-templates select="n1:effectiveTime"/>
			<xsl:choose>
				<xsl:when test="n1:code[@codeSystem='2.16.840.1.113883.6.1']">
					<xsl:choose>
						<xsl:when test = "n1:code[@code=$loincTemperature]">
							<TypeTitle>temperature</TypeTitle>
							<ObservationValue format="doubleValue"><xsl:value-of select="n1:value/@value"/></ObservationValue>
							<Standardized>S</Standardized>
						</xsl:when>
						<xsl:when test = "n1:code[@code=$loincHeight]">
							<TypeTitle>height</TypeTitle>
							<ObservationValue format="doubleValue"><xsl:value-of select="n1:value/@value"/></ObservationValue>
							<Standardized>S</Standardized>
						</xsl:when>
						<xsl:when test = "n1:code[@code=$loincWeight]">
							<TypeTitle>weight</TypeTitle>
							<ObservationValue format="doubleValue"><xsl:value-of select="n1:value/@value"/></ObservationValue>
							<Standardized>S</Standardized>
						</xsl:when>
						<xsl:when test = "n1:code[@code=$loincWeight2]">
							<TypeTitle>weight</TypeTitle>
							<ObservationValue format="doubleValue">
								<xsl:value-of select="n1:value/@value"/>
							</ObservationValue>
							<Standardized>S</Standardized>
						</xsl:when>
						<xsl:when test = "n1:code[@code=$loincBodyHtLying]">
							<TypeTitle>bodyHtLying</TypeTitle>
							<ObservationValue format="doubleValue"><xsl:value-of select="n1:value/@value"/></ObservationValue>
							<Standardized>S</Standardized>
						</xsl:when>
						<xsl:when test = "n1:code[@code=$loincOCF]">
							<TypeTitle>OCF</TypeTitle>
							<ObservationValue format="doubleValue">
								<xsl:value-of select="n1:value/@value"/>
							</ObservationValue>
							<Standardized>S</Standardized>
						</xsl:when>
						<xsl:when test = "n1:code[@code=$loincPulse]">
							<TypeTitle>pulse</TypeTitle>
							<ObservationValue format="integerValue"><xsl:value-of select="n1:value/@value"/></ObservationValue>
							<Standardized>S</Standardized>
						</xsl:when>
						<xsl:when test = "n1:code[@code=$loincRespiration]">
							<TypeTitle>respiration</TypeTitle>
							<ObservationValue format="integerValue"><xsl:value-of select="n1:value/@value"/></ObservationValue>
							<Standardized>S</Standardized>
						</xsl:when>
						<xsl:when test = "n1:code[@code=$loincPulseOximetry]">
							<TypeTitle>pulseOximetry</TypeTitle>
							<ObservationValue format="doubleValue"><xsl:value-of select="n1:value/@value"/></ObservationValue>
							<Standardized>S</Standardized>
						</xsl:when>
						<xsl:when test = "n1:code[@code=$loincBloodGlucose]">
							<TypeTitle>bloodGlucose</TypeTitle>
							<ObservationValue format="doubleValue"><xsl:value-of select="n1:value/@value"/></ObservationValue>
							<Standardized>S</Standardized>
						</xsl:when>
						<xsl:when test = "n1:code[@code=$loincBloodPressure]">
							<TypeTitle>bloodPressure</TypeTitle>
							<ObservationValue format="bloodPressure"><xsl:value-of select="n1:value/@value"/></ObservationValue>
							<Standardized>S</Standardized>
						</xsl:when>
						<xsl:when test = "n1:code[@code=$loincBmi1 or @code=$loincBmi2]">
							<TypeTitle>bmi</TypeTitle>
							<ObservationValue format="doubleValue"><xsl:value-of select="n1:value/@value"/></ObservationValue>
							<Standardized>S</Standardized>
						</xsl:when>
						<xsl:when test = "n1:code[@code=$loincCentralVenousPressure]">
							<TypeTitle>centralVenousPressure</TypeTitle>
							<ObservationValue format="doubleValue"><xsl:value-of select="n1:value/@value"/></ObservationValue>
							<Standardized>S</Standardized>
						</xsl:when>
						<xsl:when test = "n1:code[@code=$loincCircGirth]">
							<TypeTitle>circGirth</TypeTitle>
							<ObservationValue format="doubleValue"><xsl:value-of select="n1:value/@value"/></ObservationValue>
							<Standardized>S</Standardized>
						</xsl:when>
						<xsl:when test = "n1:code[@code=$loincFlowRate]">
							<TypeTitle>flowRate</TypeTitle>
							<ObservationValue format="doubleValue"><xsl:value-of select="n1:value/@value"/></ObservationValue>
							<Standardized>S</Standardized>
						</xsl:when>
						<xsl:when test = "n1:code[@code=$loincO2Concentration]">
							<TypeTitle>o2Concentration</TypeTitle>
							<ObservationValue format="doubleValue"><xsl:value-of select="n1:value/@value"/></ObservationValue>
							<Standardized>S</Standardized>
						</xsl:when>
						<xsl:when test = "n1:code[@code=$loincPain]">
							<TypeTitle>pain</TypeTitle>
							<ObservationValue format="integerValue"><xsl:value-of select="n1:value/@value"/></ObservationValue>
							<Standardized>S</Standardized>
						</xsl:when>
						<xsl:otherwise>
							<TypeTitle>
								<xsl:value-of select="n1:code/@displayName"/>
								<xsl:text> (</xsl:text>
								<xsl:value-of select="n1:code/@code"/>
								<xsl:text>)</xsl:text>
							</TypeTitle>
							<ObservationValue><xsl:value-of select="n1:value/@value"/></ObservationValue>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
				<xsl:otherwise>
					<TypeTitle>UNKNOWN</TypeTitle>
					<ObservationValue>
						<xsl:value-of select="n1:value/@value"/>
					</ObservationValue>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:if test="count(n1:methodCode/n1:originalText)>0">
				<MethodList>
					<xsl:text>&lt;list&gt;</xsl:text>
					<xsl:apply-templates select="n1:methodCode"/>
					<xsl:text>&lt;/list&gt;</xsl:text>
				</MethodList>
			</xsl:if>
			<xsl:if test="count(n1:targetSiteCode/n1:originalText)>0">
				<QualifierList>
					<xsl:text>&lt;list&gt;</xsl:text>
					<xsl:apply-templates select="n1:targetSiteCode"/>
					<xsl:text>&lt;/list&gt;</xsl:text>
				</QualifierList>
			</xsl:if>
			<xsl:apply-templates select="n1:value"/>
			<IsErrorEntry>false</IsErrorEntry>
			<Facility>
				<xsl:call-template name="facilityName"/>
			</Facility>
		</gov.va.med.mdo.Observation>
	</xsl:template>

	<xsl:template match="n1:value">
		<xsl:if test="@unit">
		<UnitList>
			<xsl:text>&lt;list&gt;&lt;string&gt;</xsl:text>
			<xsl:value-of select="@unit"/>
			<xsl:text>&lt;/string&gt;&lt;/list&gt;</xsl:text>
		</UnitList>
		</xsl:if>
	</xsl:template>

	<xsl:template match="n1:methodCode">
		<xsl:if test="n1:originalText">
			<xsl:text>&lt;string&gt;</xsl:text>
			<xsl:value-of select="n1:originalText"/>
			<xsl:text>&lt;/string&gt;</xsl:text>
		</xsl:if>
	</xsl:template>

	<xsl:template match="n1:targetSiteCode">
		<xsl:if test="n1:originalText">
			<xsl:text>&lt;string&gt;</xsl:text>
			<xsl:value-of select="n1:originalText"/>
			<xsl:text>&lt;/string&gt;</xsl:text>
		</xsl:if>
	</xsl:template>

	<xsl:template match="n1:effectiveTime">
		<Timestamp>
			<xsl:call-template name="formatDateNumeric">
				<xsl:with-param name="dateString" select="@value"/>
			</xsl:call-template>
		</Timestamp>
	</xsl:template>

</xsl:stylesheet>
