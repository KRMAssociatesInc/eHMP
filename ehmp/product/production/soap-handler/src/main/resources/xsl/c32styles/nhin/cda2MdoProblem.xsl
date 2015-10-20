<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:n1="urn:hl7-org:v3">
	<xsl:import href="detailCommon.xsl"/>
	<xsl:import href="../common.xsl"/>
	<xsl:output method="xml" encoding="utf-8" indent="yes" omit-xml-declaration="yes"/>

	<xsl:template match="/">
		<xsl:apply-templates select="/n1:ClinicalDocument"/>
	</xsl:template>

	<xsl:template match="n1:ClinicalDocument">
		<problems>
			<xsl:if test="not($noMdoProb)">
				<xsl:apply-templates select="n1:component/n1:structuredBody/n1:component/n1:section[n1:code/@code='11450-4' and n1:code/@codeSystem='2.16.840.1.113883.6.1']"/>
			</xsl:if>
		</problems>
	</xsl:template>

	<xsl:template match="n1:component/n1:structuredBody/n1:component/n1:section">
		<gov.va.med.mdo.DomainMessage>
			<Message><xsl:call-template name="comments"/></Message>
			<Facility><xsl:call-template name="facilityName"/></Facility>
			<Domain><xsl:text>PatientProblems</xsl:text></Domain>
		</gov.va.med.mdo.DomainMessage>
		<xsl:apply-templates select="n1:entry[n1:act/n1:entryRelationship]"/>
	</xsl:template>

	<xsl:template match="n1:entry">
		<gov.va.med.mdo.PatientProblem>
			<xsl:call-template name="entryRow">
				<xsl:with-param select="." name="entry"/>
			</xsl:call-template>
		</gov.va.med.mdo.PatientProblem>
	</xsl:template>

	<xsl:template name="entryRow">
		<xsl:param name="entry"/>
		<Protocol>NHIN</Protocol>
		<Status>
			<xsl:call-template name="probStatus">
				<xsl:with-param name="row" select="$entry"/>
			</xsl:call-template>
		</Status>
		<OnsetDate>
			<xsl:variable name="onsetDate">
				<xsl:call-template name="getProblemOnsetDateString">
					<xsl:with-param name="act" select="$entry/n1:act"/>
				</xsl:call-template>
			</xsl:variable>
			<xsl:value-of select="$onsetDate"/>
		</OnsetDate>
		<Provider>
			<xsl:call-template name="getProblemProvider">
				<xsl:with-param name="act" select="$entry/n1:act"/>
			</xsl:call-template>
		</Provider>
		<ProviderNarrative>
			<xsl:call-template name="probName">
				<xsl:with-param name="probEntry" select="$entry"/>
			</xsl:call-template>
		</ProviderNarrative>
		<xsl:call-template name="facilityProperty"/>
	</xsl:template>

	<xsl:template name="comments">
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
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>
