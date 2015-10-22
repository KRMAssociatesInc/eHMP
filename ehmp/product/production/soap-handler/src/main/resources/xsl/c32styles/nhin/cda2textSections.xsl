<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:n3="http://www.w3.org/1999/xhtml"
	xmlns:n1="urn:hl7-org:v3"
	xmlns:n2="urn:hl7-org:v3/meta/voc"
	xmlns:voc="urn:hl7-org:v3/voc"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:section="urn:gov.va.med"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt">

	<xsl:output method="html" indent="yes" version="4.01" encoding="ISO-8859-1"/>

	<xsl:template match="/">
		<html>
			<head>
			<style type="text/css">
				table {border:1px solid black;}
				table td {border:1px solid black;}
				table th {border:1px solid black;}
				table caption {background-color:gray;}
			</style>
			</head>
			<body>
			<xsl:apply-templates select="n1:ClinicalDocument//n1:section/n1:text"/>
			</body>
		</html>
	</xsl:template>

	<xsl:template match="n1:section/n1:text">
		<h1><xsl:value-of select="../n1:title"/></h1>
		<xsl:copy-of select="./*"/>
		<br/>
		<br/>
	</xsl:template>

</xsl:stylesheet>
