<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:template match="errorSection">
		<xsl:apply-templates select="errors"/>
		<xsl:apply-templates select="fatalErrors"/>
		<xsl:apply-templates select="warnings"/>
	</xsl:template>

	<xsl:template match="errors">
		<xsl:choose>
			<xsl:when test="errorCode[text()='NO_PATIENT_IDS_RESOLVED']">
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="errorRecord">
					<xsl:with-param name="errorRecord" select="."/>
					<xsl:with-param name="errorType" select="'error'"/>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="fatalErrors">
		<xsl:call-template name="errorRecord">
			<xsl:with-param name="errorRecord" select="."/>
			<xsl:with-param name="errorType" select="'fatal error'"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="warnings">
		<xsl:choose>
			<xsl:when test="errorCode[text()='NO_PATIENT_IDS_RESOLVED']">
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="errorRecord">
					<xsl:with-param name="errorRecord" select="."/>
					<xsl:with-param name="errorType" select="'warning'"/>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="errorRecord"/>
	<!-- users of this common.xsl should add a template with the name "errorRecord" in order to produce
	an error record entry -->

	<xsl:template name="errorDetailText">
		<xsl:param name="errorType"/>
		<xsl:param name="errorRecord"/>

		<xsl:call-template name="errorMessageText"/>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>

		<xsl:text>Error Details</xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>==========================</xsl:text>
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

	<xsl:template name="errorMessageText">
		<xsl:text>Sorry, HDR data is temporarily unavailable.  Please try again later.</xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>If the problem persists, please contact your local IRM/Computer support staff.  Please provide the process you were performing and the date/time the error occurred.</xsl:text>
	</xsl:template>
	
</xsl:stylesheet> 

