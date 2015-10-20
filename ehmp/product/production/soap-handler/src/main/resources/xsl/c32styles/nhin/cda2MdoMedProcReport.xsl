<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:n1="urn:hl7-org:v3">
	<xsl:import href="detailCommon.xsl"/>
	<xsl:import href="../common.xsl"/>
	<xsl:output method="xml" encoding="utf-8" indent="yes" media-type="text/xml"/>


	<xsl:template match="/">
		<xsl:apply-templates select="/n1:ClinicalDocument"/>
	</xsl:template>

	<xsl:template match="n1:ClinicalDocument">
		<medProc>
			<xsl:apply-templates select="n1:component/n1:structuredBody/n1:component/n1:section[n1:code/@code='47519-4' and n1:code/@codeSystem='2.16.840.1.113883.6.1']"/>
		</medProc>
	</xsl:template>

	<xsl:template match="n1:component/n1:structuredBody/n1:component/n1:section">
		<gov.va.med.mdo.DomainMessage>
			<Message><xsl:call-template name="comments"/></Message>
			<Facility><xsl:call-template name="facilityName"/></Facility>
			<Domain><xsl:text>Procedure</xsl:text></Domain>
		</gov.va.med.mdo.DomainMessage>
		<xsl:apply-templates select="n1:entry/n1:procedure"/>
	</xsl:template>

	<xsl:template match="n1:entry/n1:procedure">
		<gov.va.med.mdo.MedProcReport>
			<Protocol>NHIN</Protocol>
			<xsl:variable name="row" select="n1:entry"/>
			<xsl:variable name="procedure" select="../n1:procedure"/>

			<Timestamp>
				<xsl:call-template name="getProcedureDateTime">
					<xsl:with-param name="procedure" select="$procedure"/>
				</xsl:call-template>
			</Timestamp>

			<Name>
				<xsl:call-template name="getProcedureType">
					<xsl:with-param name="procedure" select="$procedure"/>
				</xsl:call-template>
			</Name>

			<Summary>
				<xsl:variable name="summaryResult">
					<xsl:call-template name="getProcedureFreeText">
						<xsl:with-param name="procedure" select="$procedure"/>
					</xsl:call-template>
				</xsl:variable>
				<xsl:if test="string-length($summaryResult)>0">
					<xsl:text>See View Detail link...</xsl:text>
				</xsl:if>
			</Summary>

			<Facility>
				<xsl:call-template name="facilityName"/>
			</Facility>

			<Text>
				<xsl:call-template name="detail"/>
			</Text>
		</gov.va.med.mdo.MedProcReport>
	</xsl:template>

	<xsl:template name="detail">
		<xsl:variable name="details">
			<xsl:call-template name="getProcedureFreeText">
				<xsl:with-param name="procedure" select="../n1:procedure"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length($details)>0">
				<xsl:value-of select="$details"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>&#13;&#10;...No details available...</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>


	<xsl:template name="comments">
		<xsl:variable name="path" select="n1:component/n1:structuredBody/n1:component/n1:section[n1:code/@code='47519-4' and n1:code/@codeSystem='2.16.840.1.113883.6.1']"/>
		<xsl:variable name="ref1" select="n1:entry/n1:act/n1:text/n1:reference/@value"/>
		<xsl:variable name="ref2" select="substring-after($ref1,'#')"/>
		<xsl:choose>
			<xsl:when test="n1:text//n1:content[@ID=$ref1]">
				<xsl:value-of select="n1:text//n1:content[@ID=$ref1]"/>
			</xsl:when>
			<xsl:when test="n1:text//n1:content[@ID=$ref2]">
				<xsl:value-of select="n1:text//n1:content[@ID=$ref2]"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>
