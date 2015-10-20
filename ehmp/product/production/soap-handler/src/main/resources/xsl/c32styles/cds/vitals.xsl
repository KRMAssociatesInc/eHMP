<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:data="Clinicaldata">

	<xsl:import href="../common.xsl"/>
	<xsl:import href="cdsCommon.xsl"/>
	<xsl:strip-space elements="*"/>
  
	<xsl:template match="/data:ClinicalData">
		<vital>
			<xsl:apply-templates select="patient/vitalSignObservationEvents"/>
			<xsl:apply-templates select="errorSection"/>
		</vital>
	</xsl:template>

	<xsl:template name="errorRecord">
		<xsl:param name="errorType"/>
		<xsl:param name="errorRecord"/>
		<gov.va.med.mdo.Observation>
			<Standardized><xsl:value-of select="$errorRecord/errorId"/></Standardized>
			<TypeTitle><xsl:text>temperature</xsl:text></TypeTitle>
			<UnitList>
				<xsl:text>&lt;list&gt;</xsl:text>
				<xsl:text>&lt;string&gt;</xsl:text>
				<xsl:call-template name="errorMessageText"/>
				<xsl:text>&lt;/string&gt;</xsl:text>
				<xsl:text>&lt;/list&gt;</xsl:text>
			</UnitList>
			<MethodList>
				<xsl:text>&lt;list&gt;</xsl:text>
				
				<xsl:text>&lt;string&gt;</xsl:text>
				<xsl:value-of select="$errorRecord/exception"/>
				<xsl:text>:</xsl:text>
				<xsl:value-of select="$errorRecord/exceptionMessage"/>
				<xsl:text>&lt;/string&gt;</xsl:text>

				<xsl:text>&lt;string&gt;</xsl:text>
				<xsl:value-of select="$errorType"/>
				<xsl:text>:</xsl:text>
				<xsl:value-of select="$errorRecord/errorCode"/>
				<xsl:text>&lt;/string&gt;</xsl:text>

				<xsl:text>&lt;string&gt;</xsl:text>
				<xsl:value-of select="$errorRecord/displayMessage"/>
				<xsl:text>&lt;/string&gt;</xsl:text>

				<xsl:text>&lt;/list&gt;</xsl:text>
			</MethodList>
			<DeviceList>
				<xsl:text>&lt;list&gt;&lt;string&gt;DATA RETRIEVAL ERROR&lt;/string&gt;&lt;/list&gt;</xsl:text>
			</DeviceList>
			<QualifierList>
				<xsl:text>&lt;list&gt;&lt;string&gt;</xsl:text>
				<xsl:value-of select="$errorRecord/displayMessage"/>
				<xsl:text>&lt;/string&gt;&lt;/list&gt;</xsl:text>
			</QualifierList>
			<ObservationValue format="doubleValue"><xsl:text>DATA RETRIEVAL ERROR</xsl:text></ObservationValue>
			<Timestamp>99999999999999-0800</Timestamp>
			<IsErrorEntry>true</IsErrorEntry>
		</gov.va.med.mdo.Observation>
	</xsl:template>

	<xsl:template match="patient/vitalSignObservationEvents">
		<gov.va.med.mdo.Observation>
			<xsl:apply-templates select="observationTime"/>
			<xsl:choose>
				<xsl:when test="string-length(observedCharacteristic/displayText)>0">
					<xsl:apply-templates select="observedCharacteristic"/>
				</xsl:when>
				<xsl:otherwise>
					<TypeTitle>UNKNOWN</TypeTitle>
				</xsl:otherwise>
			</xsl:choose>
			<Facility>
				<xsl:choose>
					<xsl:when test="homeTelehealthMonitor/* or recordSource[substring(namespaceId,1,4)='200T']">
						<xsl:text>HT</xsl:text>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="orderingFacilityIdentifier/name"/>
					</xsl:otherwise>
				</xsl:choose>
			</Facility>
			<xsl:choose>
				<xsl:when test="observedCharacteristic/displayText='BLOOD PRESSURE'">
					<xsl:apply-templates select="vitalSignObservation" mode="bp"/>
				</xsl:when>
				<xsl:when test="observedCharacteristic/displayText='CENTRAL VENOUS PRESSURE'">
					<xsl:apply-templates select="vitalSignObservation" mode="cvp"/>
				</xsl:when>
				<xsl:when test="observedCharacteristic/displayText='CIRCUMFERENCE/GIRTH'">
					<xsl:apply-templates select="vitalSignObservation" mode="cg"/>
				</xsl:when>
				<xsl:when test="observedCharacteristic/displayText='PULSE OXIMETRY'">
					<xsl:apply-templates select="vitalSignObservation" mode="po"/>
				</xsl:when>
				<xsl:when test="observedCharacteristic/displayText='BLOOD GLUCOSE'">
					<xsl:apply-templates select="vitalSignObservation" mode="bg"/>
				</xsl:when>
				<xsl:when test="observedCharacteristic/displayText='HEIGHT'">
					<xsl:apply-templates select="vitalSignObservation" mode="height"/>
				</xsl:when>
				<xsl:when test="observedCharacteristic/displayText='PAIN'">
					<xsl:apply-templates select="vitalSignObservation" mode="pain"/>
				</xsl:when>
				<xsl:when test="observedCharacteristic/displayText='PULSE'">
					<xsl:apply-templates select="vitalSignObservation" mode="pulse"/>
				</xsl:when>
				<xsl:when test="observedCharacteristic/displayText='RESPIRATION'">
					<xsl:apply-templates select="vitalSignObservation" mode="respiration"/>
				</xsl:when>
				<xsl:when test="observedCharacteristic/displayText='TEMPERATURE'">
					<xsl:apply-templates select="vitalSignObservation" mode="temperature"/>
				</xsl:when>
				<xsl:when test="observedCharacteristic/displayText='WEIGHT'">
					<xsl:apply-templates select="vitalSignObservation" mode="weight"/>
				</xsl:when>
				<xsl:when test="observedCharacteristic/displayText='BMI'">
					<xsl:apply-templates select="vitalSignObservation" mode="bmi"/>
				</xsl:when>
				<xsl:when test="observedCharacteristic/displayText='FLOW RATE'">
					<xsl:apply-templates select="vitalSignObservation" mode="flow"/>
				</xsl:when>
				<xsl:when test="observedCharacteristic/displayText='O2 CONCENTRATION'">
					<xsl:apply-templates select="vitalSignObservation" mode="o2"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:apply-templates select="vitalSignObservation"/>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:if test="vitalSignObservation/unit/displayText">
				<UnitList>
					<xsl:text>&lt;list&gt;&lt;string&gt;</xsl:text>
					<xsl:value-of select="vitalSignObservation/unit/displayText"/>
					<xsl:text>&lt;/string&gt;&lt;/list&gt;</xsl:text>
				</UnitList>
			</xsl:if>
			<xsl:if test="vitalSignObservation/qualifier">
				<QualifierList>
					<xsl:text>&lt;list&gt;</xsl:text>
					<xsl:apply-templates select="vitalSignObservation/qualifier" mode="textField"/>
					<xsl:text>&lt;/list&gt;</xsl:text>
				</QualifierList>
			</xsl:if>
			<xsl:if test="homeTelehealthMonitor/*">
				<DeviceList>
					<xsl:text>&lt;list&gt;</xsl:text>
					<xsl:apply-templates select="recordIdentifier" mode="textField"/>
					<xsl:apply-templates select="homeTelehealthMonitor" mode="textField"/>
					<xsl:text>&lt;/list&gt;</xsl:text>
				</DeviceList>
			</xsl:if>
			<xsl:if test="supplementalOxygen/* or observationMethod/displayText">
				<MethodList>
					<xsl:text>&lt;list&gt;</xsl:text>
					<xsl:if test="supplementalOxygen/*">
						<xsl:apply-templates select="supplementalOxygen"/>
					</xsl:if>
					<xsl:apply-templates select="observationMethod/displayText"/>
					<xsl:text>&lt;/list&gt;</xsl:text>
				</MethodList>
			</xsl:if>
			<xsl:choose>
				<xsl:when test="homeTelehealthMonitor/* or recordSource[namespaceId='200T4']">
				</xsl:when>
				<xsl:otherwise>
					<Standardized>
						<xsl:text>S</xsl:text>
					</Standardized>
				</xsl:otherwise>
			</xsl:choose>
			<IsErrorEntry>false</IsErrorEntry>
		</gov.va.med.mdo.Observation>
	</xsl:template>

	<xsl:template match="recordIdentifier" mode="textField">
		<xsl:text>&lt;string&gt;</xsl:text>
		<xsl:value-of select="namespaceId"/>
		<xsl:text>&lt;/string&gt;</xsl:text>
	</xsl:template>

	<xsl:template match="observationMethod/displayText">
		<xsl:text>&lt;string&gt;</xsl:text>
		<xsl:value-of select="."/>
		<xsl:text>&lt;/string&gt;</xsl:text>
	</xsl:template>

	<xsl:template match="supplementalOxygen">
		<xsl:if test="flowRateValue or concentrationValue">
			<xsl:text>&lt;string&gt;supp O2&lt;/string&gt;</xsl:text>
			<xsl:if test="flowRateValue">
				<xsl:text>&lt;string&gt;</xsl:text>
				<xsl:value-of select="flowRateValue"/>
				<xsl:text> </xsl:text>
				<xsl:value-of select="flowRateUnit/displayText"/>
				<xsl:text>&lt;/string&gt;</xsl:text>
			</xsl:if>
			<xsl:if test="concentrationValue">
				<xsl:text>&lt;string&gt;</xsl:text>
				<xsl:value-of select="concentrationValue"/>
				<xsl:text> </xsl:text>
				<xsl:value-of select="concentrationUnit/displayText"/>
				<xsl:text>&lt;/string&gt;</xsl:text>
			</xsl:if>
		</xsl:if>
	</xsl:template>

	<xsl:template match="qualifier" mode="textField">
		<xsl:text>&lt;string&gt;</xsl:text>
		<xsl:value-of select="value/displayText"/>
		<xsl:text>&lt;/string&gt;</xsl:text>
	</xsl:template>

	<xsl:template match="observationTime">
		<Timestamp>
			<xsl:call-template name="formatDateNumeric">
				<xsl:with-param name="dateString" select="literal"/>
			</xsl:call-template>
		</Timestamp>
	</xsl:template>

	<xsl:template match="observedCharacteristic">
		<TypeTitle>
			<xsl:choose>
				<xsl:when test = "displayText='BLOOD PRESSURE'">bloodPressure</xsl:when>
				<xsl:when test = "displayText='CENTRAL VENOUS PRESSURE'">centralVenousPressure</xsl:when>
				<xsl:when test = "displayText='CIRCUMFERENCE/GIRTH'">circGirth</xsl:when>
				<xsl:when test = "displayText='PULSE OXIMETRY'">pulseOximetry</xsl:when>
				<xsl:when test = "displayText='BLOOD GLUCOSE'">bloodGlucose</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="displayText"/>
				</xsl:otherwise>
			</xsl:choose>
		</TypeTitle>
	</xsl:template>

	<xsl:template match="vitalSignObservation">
		<ObservationValue><xsl:value-of select="value"/></ObservationValue>
	</xsl:template>

	<xsl:template match="vitalSignObservation" mode="bp">
		<ObservationValue format="bloodPressure"><xsl:value-of select="value"/></ObservationValue>
	</xsl:template>

	<xsl:template match="vitalSignObservation" mode="cvp">
		<ObservationValue format="doubleValue"><xsl:value-of select="value"/></ObservationValue>
	</xsl:template>

	<xsl:template match="vitalSignObservation" mode="cg">
		<ObservationValue format="doubleValue"><xsl:value-of select="value"/></ObservationValue>
	</xsl:template>

	<xsl:template match="vitalSignObservation" mode="po">
		<ObservationValue format="doubleValue"><xsl:value-of select="value"/></ObservationValue>
	</xsl:template>

	<xsl:template match="vitalSignObservation" mode="bg">
		<ObservationValue format="doubleValue"><xsl:value-of select="value"/></ObservationValue>
	</xsl:template>

	<xsl:template match="vitalSignObservation" mode="height">
		<ObservationValue format="doubleValue"><xsl:value-of select="value"/></ObservationValue>
	</xsl:template>

	<xsl:template match="vitalSignObservation" mode="pain">
		<ObservationValue format="integerValue"><xsl:value-of select="value"/></ObservationValue>
	</xsl:template>

	<xsl:template match="vitalSignObservation" mode="pulse">
		<ObservationValue format="integerValue"><xsl:value-of select="value"/></ObservationValue>
	</xsl:template>

	<xsl:template match="vitalSignObservation" mode="respiration">
		<ObservationValue format="integerValue"><xsl:value-of select="value"/></ObservationValue>
	</xsl:template>

	<xsl:template match="vitalSignObservation" mode="temperature">
		<ObservationValue format="doubleValue"><xsl:value-of select="value"/></ObservationValue>
	</xsl:template>

	<xsl:template match="vitalSignObservation" mode="weight">
		<ObservationValue format="doubleValue"><xsl:value-of select="value"/></ObservationValue>
	</xsl:template>

	<xsl:template match="vitalSignObservation" mode="bmi">
		<ObservationValue format="doubleValue"><xsl:value-of select="value"/></ObservationValue>
	</xsl:template>

	<xsl:template match="vitalSignObservation" mode="flow">
		<ObservationValue format="doubleValue"><xsl:value-of select="value"/></ObservationValue>
	</xsl:template>

	<xsl:template match="vitalSignObservation" mode="o2">
		<ObservationValue format="doubleValue"><xsl:value-of select="value"/></ObservationValue>
	</xsl:template>

	<xsl:template match="homeTelehealthMonitor" mode="textField">
		<xsl:if test="vendor">
			<xsl:text>&lt;string&gt;</xsl:text>
			<xsl:value-of select="vendor"/>
			<xsl:text>&lt;/string&gt;</xsl:text>
		</xsl:if>
		<xsl:if test="measurementDevice">
			<xsl:text>&lt;string&gt;</xsl:text>
			<xsl:value-of select="measurementDevice"/>
			<xsl:text>&lt;/string&gt;</xsl:text>
		</xsl:if>
		<xsl:if test="homeAppliance">
			<xsl:text>&lt;string&gt;</xsl:text>
			<xsl:value-of select="homeAppliance"/>
			<xsl:text>&lt;/string&gt;</xsl:text>
		</xsl:if>
	</xsl:template>

	<xsl:template match="*" mode="json">{<xsl:value-of select="local-name()"/>:<xsl:choose><xsl:when test="*"><xsl:apply-templates mode="json"/></xsl:when><xsl:otherwise>"<xsl:value-of select="."/>"</xsl:otherwise></xsl:choose>}<xsl:choose><xsl:when test="position()=last()"></xsl:when><xsl:otherwise>,</xsl:otherwise></xsl:choose></xsl:template>

</xsl:stylesheet>
