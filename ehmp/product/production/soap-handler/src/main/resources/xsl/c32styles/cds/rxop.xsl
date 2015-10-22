<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:data="Clinicaldata">

	<xsl:import href="../common.xsl"/>
	<xsl:import href="cdsCommon.xsl"/>
	<xsl:import href="rxopCommon.xsl"/>
	<xsl:strip-space elements="*"/>

	<xsl:template match="/data:ClinicalData">
		<rxop>
			<xsl:apply-templates select="patient"/>
			<xsl:apply-templates select="errorSection"/>
		</rxop>
	</xsl:template>

	<xsl:template name="errorRecord">
		<xsl:param name="errorType"/>
		<xsl:param name="errorRecord"/>
		<gov.va.med.mdo.Rxop>
			<Rem>ERROR</Rem>
			<Name>ERROR</Name>
			<Status>ERROR</Status>
			<Text>
				<xsl:call-template name="errorDetailText">
					<xsl:with-param name="errorType" select="$errorType"/>
					<xsl:with-param name="errorRecord" select="$errorRecord"/>
				</xsl:call-template>
			</Text>
			<IsErrorEntry>true</IsErrorEntry>
		</gov.va.med.mdo.Rxop>
	</xsl:template>

	<xsl:template match="outpatientMedicationPromises">
		<gov.va.med.mdo.Rxop>
			<Name><xsl:call-template name="getMedicationName"/></Name>
			<Id><xsl:call-template name="getRecordIdentifier"/></Id>
			<RxNum><xsl:value-of select="prescriptionId"/></RxNum>
			<Status><xsl:apply-templates select="pharmacyRequest/statusModifier"/></Status>
			<Qty><xsl:apply-templates select="originalDispense/quantityDispensed"/></Qty>
			<ExpireOrCancelDate>
				<xsl:call-template name="expireDate"/>
			</ExpireOrCancelDate>
			<IssueDate><xsl:apply-templates select="pharmacyRequest/orderDate"/></IssueDate>
			<LastFillDate><xsl:apply-templates select="lastDispenseDate"/></LastFillDate>
			<Provider><xsl:apply-templates select="originalDispense/currentProvider/name"/></Provider>
			<Cost><xsl:apply-templates select="costFill"/></Cost>
			<Sig><xsl:value-of select="sig"/></Sig>
			<Rem><xsl:value-of select="numberOfRefillsRemaining"/></Rem>
			<Facility><xsl:call-template name="getSiteName"/></Facility>
			<!--text><xsl:call-template name="rxopDetail"/></text-->
			<IsErrorEntry>false</IsErrorEntry>
	</gov.va.med.mdo.Rxop>
	</xsl:template>

	<xsl:template name="getRecordIdentifier">
		<xsl:text>&lt;patients&gt;&lt;resolvedIdentifiers&gt;&lt;assigningAuthority&gt;</xsl:text>
		<xsl:value-of select="patient/identifier/assigningAuthority"/>
		<xsl:text>&lt;/assigningAuthority&gt;&lt;assigningFacility&gt;</xsl:text>
		<xsl:value-of select="patient/identifier/assigningFacility"/>
		<xsl:text>&lt;/assigningFacility&gt;&lt;identity&gt;</xsl:text>
		<xsl:value-of select="patient/identifier/identity"/>
		<xsl:text>&lt;/identity&gt;&lt;/resolvedIdentifiers&gt;&lt;/patients&gt;&lt;entryPointFilter queryName="ID_1"&gt;&lt;domainEntryPoint&gt;OutpatientMedicationPromise&lt;/domainEntryPoint&gt;&lt;recordIdentifiers&gt;&lt;identity&gt;</xsl:text>
		<xsl:value-of select="recordIdentifier/identity"/>
		<xsl:text>&lt;/identity&gt;&lt;namespaceId&gt;</xsl:text>
		<xsl:value-of select="recordIdentifier/namespaceId"/>
		<xsl:text>&lt;/namespaceId&gt;&lt;/recordIdentifiers&gt;&lt;/entryPointFilter&gt;</xsl:text>
	</xsl:template>

	<xsl:template match="recordIdentifier">
		<xsl:text>&lt;identity&gt;</xsl:text>
		<xsl:value-of select="identity"/>
		<xsl:text>&lt;/identity&gt;</xsl:text>
		<xsl:text>&lt;namespaceId&gt;</xsl:text>
		<xsl:value-of select="namespaceId"/>
		<xsl:text>&lt;/namespaceId&gt;</xsl:text>
	</xsl:template>

	<xsl:template match="expirationDate">
		<xsl:call-template name="formatDateNumeric">
			<xsl:with-param name="dateString" select="literal"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="cancelDate">
		<xsl:call-template name="formatDateNumeric">
			<xsl:with-param name="dateString" select="literal"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="orderDate">
		<xsl:call-template name="formatDateNumeric">
			<xsl:with-param name="dateString" select="literal"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="lastDispenseDate">
		<xsl:call-template name="formatDateNumeric">
			<xsl:with-param name="dateString" select="literal"/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="originalDispense/dispensedDrug/drugUnitPrice">
		<xsl:value-of select="value"/>
	</xsl:template>

	<xsl:template name="getSiteName">
		<xsl:choose>
			<xsl:when test="pharmacyRequest/orderingInstitutionIdentifier/name">
				<xsl:value-of select="pharmacyRequest/orderingInstitutionIdentifier/name"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:apply-templates select="originalDispense/division/divisionId"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="originalDispense/division/divisionId">
		<xsl:value-of select="displayText"/>
	</xsl:template>

</xsl:stylesheet>
