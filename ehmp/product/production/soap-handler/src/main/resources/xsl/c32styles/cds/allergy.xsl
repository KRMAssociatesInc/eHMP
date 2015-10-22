<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:data="Clinicaldata" xmlns:sitesTable="http://domain.ext/vistaweb/sitesTable">

	<xsl:import href="../common.xsl"/>
	<xsl:import href="cdsCommon.xsl"/>

	<xsl:strip-space elements="*"/>

	<xsl:key name="vhaSites-lookup" match="sitesTable:VhaSite" use="@ID"/>
	<xsl:variable name="vhaSites-top" select="document('../../VhaSites.xml')/sitesTable:VhaVisnTable/sitesTable:VhaVisn"/>

	<xsl:template match="/data:ClinicalData">
		<allergies>
			<xsl:apply-templates select="patient"/>
			<xsl:apply-templates select="errorSection"/>
		</allergies>
	</xsl:template>

  <xsl:template match="patient">
    <xsl:apply-templates select="intoleranceConditions"/>
    <xsl:apply-templates select="allergyAssessments"/>
  </xsl:template>

	<xsl:template name="errorRecord">
		<xsl:param name="errorType"/>
		<xsl:param name="errorRecord"/>
		<gov.va.med.mdo.AllergyRpt>
			<ObservationType>ERROR</ObservationType>
			<Reactants>ERROR</Reactants>
			<Type>ERROR</Type>
			<Text>
				<xsl:call-template name="errorDetailText">
					<xsl:with-param name="errorType" select="$errorType"/>
					<xsl:with-param name="errorRecord" select="$errorRecord"/>
				</xsl:call-template>
			</Text>
			<IsErrorEntry>true</IsErrorEntry>
		</gov.va.med.mdo.AllergyRpt>
	</xsl:template>
  
	<xsl:template match="intoleranceConditions">
		<gov.va.med.mdo.AllergyRpt>
			<Id><xsl:apply-templates select="recordIdentifier"/></Id>
			<Reactants><xsl:apply-templates select="agent"/></Reactants>
			<Type><xsl:apply-templates select="allergyType"/></Type>
			<Timestamp><xsl:apply-templates select="verifier/time"/></Timestamp>
			<ObservationType><xsl:apply-templates select="informationSourceCategory"/></ObservationType>
			<xsl:apply-templates select="facilityIdentifier"/>
			<xsl:if test="status">
				<Status>
					<xsl:value-of select="status"/>
				</Status>
			</xsl:if>
			<Message><xsl:apply-templates select="gmrAllergyAgent"/></Message>
			<Text><xsl:call-template name="allergyDetail"/></Text>
			<IsErrorEntry>false</IsErrorEntry>
		</gov.va.med.mdo.AllergyRpt>
	</xsl:template>

	<xsl:template match="allergyAssessments">
		<gov.va.med.mdo.AllergyRpt>
			<Id><xsl:apply-templates select="recordIdentifier"/></Id>
			<Reactants>assessment</Reactants>
			<ObservationType></ObservationType>
			<Message><xsl:apply-templates select="assessmentValue"/></Message>
			<Timestamp><xsl:apply-templates select="observationTime"/></Timestamp>
			<SiteId><xsl:apply-templates select="patient/identifier/assigningFacility"/></SiteId>
			<Facility>
				<xsl:apply-templates select="$vhaSites-top">
					<xsl:with-param name="item" select="."/>
				</xsl:apply-templates>
			</Facility>
			<xsl:if test="status">
				<Status>
					<xsl:value-of select="status"/>
				</Status>
			</xsl:if>
			<Text><xsl:call-template name="assessmentDetail"/></Text>
			<IsErrorEntry>false</IsErrorEntry>
		</gov.va.med.mdo.AllergyRpt>
	</xsl:template>

  <xsl:template match="recordIdentifier">
    <xsl:value-of select="identity"/>:<xsl:value-of select="namespaceId"/>
  </xsl:template>

  <xsl:template match="agent">
    <xsl:value-of select="code"/>
  </xsl:template>

  <xsl:template match="allergyType">
    <xsl:value-of select="displayText"/>
  </xsl:template>

  <xsl:template match="verifier/time">
		<xsl:call-template name="formatDateNumeric">
			<xsl:with-param name="dateString" select="literal"/>
		</xsl:call-template>
	</xsl:template>

  <xsl:template match="informationSourceCategory">
    <xsl:value-of select="displayText"/>
  </xsl:template>

  <xsl:template match="facilityIdentifier">
    <SiteId><xsl:value-of select="identity"/></SiteId>
    <Facility><xsl:value-of select="name"/></Facility>
  </xsl:template>

  <xsl:template match="mechanism">
		<xsl:choose>
			<xsl:when test="code='4500979' or displayText='PHARMACOLOGIC'">
				<xsl:text>Adverse Reaction</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="displayText"/>
			</xsl:otherwise>
		</xsl:choose>
  </xsl:template>

  <xsl:template match="reaction/reaction">
    <xsl:value-of select="displayText"/>
  </xsl:template>

	<xsl:template match="author/practitioner/name">
		<xsl:value-of select="family"/>
		<xsl:text>, </xsl:text>
		<xsl:value-of select="given"/>
		<xsl:if test="middle">
			<xsl:text> </xsl:text>
			<xsl:value-of select="middle"/>
		</xsl:if>
		<xsl:if test="suffix">
			<xsl:text> </xsl:text>
			<xsl:value-of select="suffix"/>
		</xsl:if>
		<xsl:if test="title">
			<xsl:text> </xsl:text>
			<xsl:value-of select="title"/>
		</xsl:if>
	</xsl:template>

	<xsl:template match="author/name">
		<xsl:value-of select="family"/>
		<xsl:text>, </xsl:text>
		<xsl:value-of select="given"/>
		<xsl:if test="middle">
			<xsl:text> </xsl:text>
			<xsl:value-of select="middle"/>
		</xsl:if>
		<xsl:if test="suffix">
			<xsl:text> </xsl:text>
			<xsl:value-of select="suffix"/>
		</xsl:if>
		<xsl:if test="title">
			<xsl:text> </xsl:text>
			<xsl:value-of select="title"/>
		</xsl:if>
	</xsl:template>

	<xsl:template match="observationTime">
		<xsl:call-template name="formatDateNumeric">
			<xsl:with-param name="dateString" select="literal"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="verifier/practitioner/name">
		<xsl:if test="family">
			<xsl:value-of select="family"/>
			<xsl:text>, </xsl:text>
		</xsl:if>
		<xsl:value-of select="given"/>
		<xsl:if test="middle">
			<xsl:text> </xsl:text>
			<xsl:value-of select="middle"/>
		</xsl:if>
		<xsl:if test="suffix">
			<xsl:text> </xsl:text>
			<xsl:value-of select="suffix"/>
		</xsl:if>
		<xsl:if test="title">
			<xsl:text> </xsl:text>
			<xsl:value-of select="title"/>
		</xsl:if>
	</xsl:template>

  <xsl:template match="gmrAllergyAgent">
    <xsl:value-of select="displayText"/>
  </xsl:template>

  <xsl:template match="assessmentValue">
    <xsl:value-of select="displayText"/>
  </xsl:template>

	<xsl:template name="allergyDetail">
		<xsl:text>Causative agent:  </xsl:text><xsl:apply-templates select="agent"/>
		<xsl:text>&#13;&#10; Nature of reaction:  </xsl:text><xsl:apply-templates select="mechanism"/>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:call-template name="reactionDetail">
			<xsl:with-param name="nodes" select="reaction"/>
		</xsl:call-template>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:call-template name="drugClassDetail">
			<xsl:with-param name="nodes" select="drugClass"/>
		</xsl:call-template>
		<xsl:text>&#13;&#10;         Originator:  </xsl:text><xsl:apply-templates select="author/practitioner/name"/>
		<xsl:text>&#13;&#10;         Originated:  </xsl:text><xsl:apply-templates select="observationTime"/>
		<xsl:text>&#13;&#10;           Verified:  </xsl:text><xsl:call-template name="allergyVerified"/>
		<xsl:text>&#13;&#10;Observed/Historical:  </xsl:text><xsl:apply-templates select="informationSourceCategory"/>
		<xsl:text>&#13;&#10;&#13;&#10;Comments: &#13;&#10;</xsl:text>
		<xsl:apply-templates select="commentEvents"/>
	</xsl:template>

	<xsl:template name="allergyVerified">
		<xsl:choose>
			<xsl:when test="string-length(verified)&gt;0">
				<xsl:value-of select="verified"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:apply-templates select="verifier/practitioner/name"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="commentEvents">
		<xsl:text> </xsl:text>
		<xsl:if test="date/literal">
			<xsl:call-template name="formatDateNumeric">
				<xsl:with-param name="dateString" select="date/literal"/>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="author/name">
			<xsl:text> by </xsl:text>
			<xsl:apply-templates select="author/name"/>
		</xsl:if>
		<xsl:if test="commentType/displayText">
			<xsl:text> (</xsl:text>
			<xsl:value-of select="commentType/displayText"/>
			<xsl:text>)</xsl:text>
		</xsl:if>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:for-each select="comments">
			<xsl:value-of select="."/>
			<xsl:text>&#13;&#10;</xsl:text>
		</xsl:for-each>
		<xsl:text>&#13;&#10;</xsl:text>
	</xsl:template>
	
	<xsl:template name="reactionDetail">
		<xsl:param name="nodes"/>
		<xsl:for-each select="$nodes">
			<xsl:choose>
				<xsl:when test="position()=1">
					<xsl:text>     Signs/symptoms:  </xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:text>                      </xsl:text>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:value-of select="reaction/displayText"/>
			<xsl:text>&#13;&#10;</xsl:text>
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="drugClassDetail">
		<xsl:param name="nodes"/>
		<xsl:for-each select="$nodes">
			<xsl:choose>
				<xsl:when test="position()=1">
					<xsl:text>       Drug classes:  </xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:text>                      </xsl:text>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:value-of select="code/displayText"/>
			<xsl:text>&#13;&#10;</xsl:text>
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="reactionList">
		<xsl:param name="nodes"/>
		<xsl:for-each select="$nodes">
			<xsl:choose>
				<xsl:when test="position()=1"/>
				<xsl:otherwise>
					<xsl:text>, </xsl:text>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:value-of select="reaction/displayText"/>
		</xsl:for-each>
	</xsl:template>
	
	<xsl:template name="assessmentDetail">
		<xsl:text>&#13;&#10;    Reaction Assessment:  </xsl:text>
		<xsl:apply-templates select="assessmentValue"/>
		<xsl:text>&#13;&#10;    Assessing User:  </xsl:text>
		<xsl:apply-templates select="author/practitioner/name"/>
		<xsl:text>&#13;&#10;    Assessment Timestamp:  </xsl:text>
		<xsl:apply-templates select="observationTime"/>
		<xsl:text>&#13;&#10;    Site Id:  </xsl:text>
		<xsl:apply-templates select="patient/identifier/assigningFacility"/>
	</xsl:template>

	<xsl:template match="sitesTable:VhaVisn">
		<xsl:param name="item"/>
		<xsl:if test="sitesTable:VhaSite[@ID=$item/patient/identifier/assigningFacility]">
			<xsl:value-of select="key('vhaSites-lookup', $item/patient/identifier/assigningFacility)/@name"/>
		</xsl:if>
	</xsl:template>

</xsl:stylesheet> 
