<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:n1="urn:hl7-org:v3">

	<xsl:import href="detailCommon.xsl"/>
	<xsl:import href="../common.xsl"/>
	<xsl:output method="xml" indent="yes" media-type="text/xml" omit-xml-declaration="yes"/>

	<xsl:template match="/">
		<xsl:apply-templates select="/n1:ClinicalDocument"/>
	</xsl:template>

	<xsl:template match="n1:ClinicalDocument">
		<C62>
			<gov.va.med.mdo.C62Report>
				<xsl:call-template name="getDocClass" />
				<xsl:call-template name="getDocTimeStamp" />
				<xsl:call-template name="getAuthor" />
				<xsl:call-template name="getDocTitle" />
				<xsl:call-template name="getDateSigned" />
				<xsl:call-template name="getDateOfNote" />
				<xsl:call-template name="nonXMLBody" />
			</gov.va.med.mdo.C62Report>
		</C62>
	</xsl:template>

	<xsl:template name="getDocClass">
		<DocClass>
			<xsl:value-of select="n1:code/@displayName"/>
		</DocClass>
	</xsl:template>

	<xsl:template name="getDocTimeStamp">
		<DocTimeStamp>
			<xsl:choose>
				<xsl:when test="string-length(n1:effectiveTime/@value)>14">
					<xsl:value-of select="substring(n1:effectiveTime/@value,1,14)"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="n1:effectiveTime/@value"/>
				</xsl:otherwise>
			</xsl:choose>
		</DocTimeStamp>
	</xsl:template>

	<xsl:template name="getAuthor">
		<Author>
			<xsl:value-of select="n1:author/n1:assignedAuthor/n1:assignedPerson/n1:name"/>
		</Author>
	</xsl:template>

	<xsl:template name="getDocTitle">
		<DocTitle>
			<xsl:value-of select="n1:title"/>
		</DocTitle>
	</xsl:template>

	<xsl:template name="getDateOfNote">
		<DateOfNote>
			<xsl:choose>
				<xsl:when test="string-length(n1:documentationOf/n1:serviceEvent/n1:effectiveTime/n1:low/@value)!=0">
					<xsl:value-of select="n1:documentationOf/n1:serviceEvent/n1:effectiveTime/n1:low/@value"/>
				</xsl:when>
				<xsl:otherwise >
					<xsl:value-of select="n1:documentationOf/n1:serviceEvent/n1:time/n1:low/@value"/>
				</xsl:otherwise>
			</xsl:choose>
		</DateOfNote>
	</xsl:template>

	<xsl:template name="getDateSigned">
		<DateSigned>
			<xsl:choose>
				<xsl:when test="string-length(n1:documentationOf/n1:serviceEvent/n1:effectiveTime/n1:high/@value)!=0">
					<xsl:value-of select="n1:documentationOf/n1:serviceEvent/n1:effectiveTime/n1:high/@value"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="n1:documentationOf/n1:serviceEvent/n1:time/n1:high/@value"/>
				</xsl:otherwise>
			</xsl:choose>
		</DateSigned>
	</xsl:template>

	<xsl:template name="nonXMLBody">
		<xsl:param name="nonXMLBody" select="n1:component/n1:nonXMLBody"/>
		<MediaType>
			<xsl:value-of select="$nonXMLBody/n1:text/@mediaType"/>
		</MediaType>
		<Representation>
			<xsl:value-of select="$nonXMLBody/n1:text/@representation"/>
		</Representation>
		<Text>
			<xsl:value-of select="$nonXMLBody/n1:text"/>
		</Text>
	</xsl:template>

</xsl:stylesheet>
