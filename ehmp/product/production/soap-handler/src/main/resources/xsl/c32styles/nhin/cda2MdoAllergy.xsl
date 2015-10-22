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
		<allergies>
			<xsl:apply-templates select="n1:component/n1:structuredBody/n1:component/n1:section[n1:code/@code='48765-2' and n1:code/@codeSystem='2.16.840.1.113883.6.1']"/>
		</allergies>
	</xsl:template>

	<xsl:template match="n1:component/n1:structuredBody/n1:component/n1:section">
		<gov.va.med.mdo.DomainMessage>
			<Message><xsl:call-template name="comments"/></Message>
			<Facility><xsl:call-template name="facilityName"/></Facility>
			<Domain><xsl:text>AllergyRpts</xsl:text></Domain>
		</gov.va.med.mdo.DomainMessage>
		<xsl:apply-templates select="n1:entry[n1:act/n1:entryRelationship]"/>
	</xsl:template>

	<xsl:template match="n1:entry">
		<gov.va.med.mdo.AllergyRpt>
			<xsl:call-template name="entryRow">
				<xsl:with-param select="." name="entry"/>
			</xsl:call-template>
		</gov.va.med.mdo.AllergyRpt>
	</xsl:template>

	<xsl:template name="entryRow">
		<xsl:param name="entry"/>
		<xsl:variable name="observation" select="$entry/n1:act/n1:entryRelationship/n1:observation"/>
		<Protocol>NHIN</Protocol>
		<Type>
			<xsl:call-template name="getAllergyType">
				<xsl:with-param name="obs" select="$observation"/>
			</xsl:call-template>
		</Type>
		<Timestamp>
			<xsl:call-template name="getAllergyVerificationDate">
				<xsl:with-param name="observation" select="$observation"/>
			</xsl:call-template>
		</Timestamp>
		<xsl:variable name="allergenName">
			<xsl:call-template name="getAllergen">
				<xsl:with-param name="observation" select="$observation"/>
			</xsl:call-template>
		</xsl:variable>
		<Reactants>
			<xsl:choose>
				<xsl:when test="$allergenName='NKA'">
					<xsl:text>assessment</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$allergenName"/>
				</xsl:otherwise>
			</xsl:choose>
		</Reactants>
		<xsl:if test="$allergenName='NKA'">
			<Message>no known allergies</Message>
		</xsl:if>
		<xsl:call-template name="facilityProperty"/>
		<xsl:call-template name="detailText">
			<xsl:with-param name="obs" select="$observation"/>
			<xsl:with-param name="entry" select="$entry"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="detailText">
		<xsl:param name="obs"/>
		<xsl:param name="entry"/>
		<Text>
			<xsl:text>Causative agent:  </xsl:text>
			<xsl:value-of select="$obs/n1:participant/n1:participantRole/n1:playingEntity/n1:name"/>
			<xsl:text>&#13;&#10; Nature of reaction:  </xsl:text>

			<xsl:call-template name="getAllergyType">
				<xsl:with-param name="obs" select="$obs"/>
			</xsl:call-template>
			<xsl:text>&#13;&#10;</xsl:text>
			
			<xsl:text>&#13;&#10;</xsl:text>
			
			<xsl:text>     Signs/symptoms:  </xsl:text>
			<xsl:variable name="result">
				<xsl:call-template name="getReactionValue">
					<xsl:with-param name="entryRelationship" select="$entry/n1:act/n1:entryRelationship"/>
				</xsl:call-template>
			</xsl:variable>
			<xsl:choose>
				<xsl:when test="$result">
					<xsl:value-of select="$result"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="na"/>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:text>&#13;&#10;</xsl:text>
			
			<xsl:text>       Drug classes:  </xsl:text>
			<xsl:text>&#13;&#10;</xsl:text>
			
			<xsl:text>&#13;&#10;         Originator:  </xsl:text>
			
			<xsl:text>&#13;&#10;         Originated:  </xsl:text>
			<xsl:call-template name="displayAllergyVerificationDate">
				<xsl:with-param name="observation" select="$obs"/>
			</xsl:call-template>

			<xsl:text>&#13;&#10;           Verified:  </xsl:text>
			<xsl:call-template name="displayAllergyVerificationDate">
				<xsl:with-param name="observation" select="$obs"/>
			</xsl:call-template>

			<xsl:text>&#13;&#10;             Source:  </xsl:text>
			<xsl:call-template name="getAllergySource">
				<xsl:with-param name="row" select="$entry"/>
			</xsl:call-template>

			<xsl:text>&#13;&#10;Observed/Historical:  </xsl:text>
			
			<xsl:text>&#13;&#10;Site:  </xsl:text>
			<xsl:call-template name="facilityName"/>
			<xsl:text>&#13;&#10;&#13;&#10;Comments: &#13;&#10;</xsl:text>
		</Text>
	</xsl:template>

	<xsl:template name="getAllergyType">
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

	<!-- Allergy Comments-->
	<xsl:template name="comments">
		<xsl:variable name="ref1" select="n1:entry/n1:act/n1:text/n1:reference/@value"/>
		<xsl:variable name="ref2" select="substring-after($ref1,'#')"/>
		<xsl:choose>
			<xsl:when test="n1:entry/n1:act/n1:entryRelationship/n1:observation/n1:value[@code=$allergyNkaCode]">
				<xsl:value-of select="n1:entry/n1:act/n1:entryRelationship/n1:observation/n1:value/@displayName"/>
			</xsl:when>
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
