<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:import href="../common.xsl"/>
	<xsl:import href="cdsCommon.xsl"/>
	<xsl:strip-space elements="*"/>

	<xsl:template match="patient">
		<xsl:apply-templates select="outpatientMedicationPromises"/>
	</xsl:template>

	<xsl:template match="pharmacyRequest/statusModifier">
		<xsl:value-of select="displayText"/>
	</xsl:template>

	<xsl:template name="expireDate">
		<xsl:choose>
			<xsl:when test="cancel/cancelDate/literal and cancel/cancelDate[literal!='0']">
				<xsl:apply-templates select="cancel/cancelDate"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:apply-templates select="expirationDate"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="getMedicationName">
		<xsl:choose>
			<xsl:when test="pharmacyRequest/orderedMedication/medicationCode/displayText">
				<xsl:value-of select="pharmacyRequest/orderedMedication/medicationCode/displayText"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="originalDispense/dispensedDrug/ndc/displayText"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="originalDispense/quantityDispensed">
		<xsl:value-of select="value"/>
	</xsl:template>

	<xsl:template match="originalDispense/currentProvider/name">
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
	</xsl:template>

	<xsl:template match="costFill">
		<xsl:choose>
			<xsl:when test="node()='0.0'"></xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="."/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="originalDispense/currentProviderComments">
		<xsl:value-of select="."/>
		<xsl:text>&#13;&#10;</xsl:text>
	</xsl:template>

	<xsl:template match="medicationInstructions/route">
		<xsl:if test="displayText">
			<xsl:text>  </xsl:text>
			<xsl:value-of select="displayText"/>
			<xsl:text>&#13;&#10;</xsl:text>
		</xsl:if>
	</xsl:template>

	<xsl:template name="rxopDetail">
		<xsl:text>Medication:                   </xsl:text>
		<xsl:call-template name="getMedicationName"/>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>Start Date/Time:              </xsl:text>
		<xsl:call-template name="formatDateNumeric">
			<xsl:with-param name="dateString" select="pharmacyRequest/orderDate/literal"/>
		</xsl:call-template>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>Stop Date/Time:               </xsl:text>
		<xsl:call-template name="formatDateNumeric">
			<xsl:with-param name="dateString">
				<xsl:call-template name="expireDate"/>
			</xsl:with-param>
		</xsl:call-template>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>Current Status:               </xsl:text>
		<xsl:apply-templates select="pharmacyRequest/statusModifier"/>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>Order:                        </xsl:text>
		<xsl:value-of select="pharmacyRequest/genericRequestIdentifier/identity"/>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>Medication Instructions:      </xsl:text>
		<xsl:apply-templates select="medicationInstructions/route"/>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>Sig:&#13;&#10;  </xsl:text>
		<xsl:value-of select="sig"/>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>Days Supply:                  </xsl:text>
		<xsl:value-of select="originalDispense/daysSupply"/>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>Quantity:                     </xsl:text>
		<xsl:apply-templates select="originalDispense/quantityDispensed"/>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>Refills:                      </xsl:text>
		<xsl:value-of select="numberOfRefillsAuthorized"/>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>Pick Up:                      </xsl:text>
		<xsl:apply-templates select="originalDispense/mailWindow"/>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>Dispense Comments:&#13;&#10;</xsl:text>
		<xsl:apply-templates select="originalDispense/comments"/>
	</xsl:template>

</xsl:stylesheet>
