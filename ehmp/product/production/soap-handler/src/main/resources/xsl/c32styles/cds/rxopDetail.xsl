<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:data="Clinicaldata">

	<xsl:import href="../common.xsl"/>
	<xsl:import href="cdsCommon.xsl"/>
	<xsl:import href="rxopCommon.xsl"/>
	<xsl:output method="text"/>
	<xsl:strip-space elements="*"/>

	<xsl:template match="/data:ClinicalData">
		<xsl:apply-templates select="patient"/>
		<xsl:apply-templates select="errorSection"/>
	</xsl:template>

	<xsl:template name="errorRecord">
		<xsl:param name="errorType"/>
		<xsl:param name="errorRecord"/>
		<xsl:text>ERROR getting detail information</xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>Error ID:</xsl:text>
		<xsl:value-of select="$errorRecord/errorId"/>
		<xsl:text>&#13;&#10;</xsl:text>

		<xsl:text>Error Type:</xsl:text>
		<xsl:value-of select="$errorType"/>
		<xsl:text>&#13;&#10;</xsl:text>

		<xsl:text>Exception:</xsl:text>
		<xsl:value-of select="$errorRecord/exception"/>
		<xsl:text>&#13;&#10;</xsl:text>

		<xsl:text>Message:</xsl:text>
		<xsl:value-of select="$errorRecord/exceptionMessage"/>
		<xsl:text>&#13;&#10;</xsl:text>

		<xsl:text>Error Code:</xsl:text>
		<xsl:value-of select="$errorRecord/errorCode"/>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>

		<xsl:value-of select="$errorRecord/displayMessage"/>
	</xsl:template>

	<xsl:template match="outpatientMedicationPromises">
		<xsl:call-template name="rxopDetail"/>
	</xsl:template>

</xsl:stylesheet>
