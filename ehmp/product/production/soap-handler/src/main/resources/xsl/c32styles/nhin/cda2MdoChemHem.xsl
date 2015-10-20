<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:n1="urn:hl7-org:v3">
  <xsl:import href="detailCommon.xsl"/>
  <xsl:import href="../common.xsl"/>
  <xsl:output method="xml" encoding="utf-8" indent="yes" media-type="text/xml"/>
  
  
	<xsl:template match="/">
		<xsl:apply-templates select="/n1:ClinicalDocument"/>
	</xsl:template>

	<xsl:template match="n1:ClinicalDocument">
		<labs>
			<xsl:if test="not($noMdoResult)">
				<xsl:apply-templates select="n1:component/n1:structuredBody/n1:component/n1:section[n1:code/@code='30954-2' and n1:code/@codeSystem='2.16.840.1.113883.6.1']"/>
			</xsl:if>
		</labs>
	</xsl:template>

	<xsl:template match="n1:component/n1:structuredBody/n1:component/n1:section">
		<gov.va.med.mdo.DomainMessage>
			<Message>
				<xsl:call-template name="comments"/>
			</Message>
			<Facility>
				<xsl:call-template name="facilityName"/>
			</Facility>
			<Domain>
				<xsl:text>ChemHem</xsl:text>
			</Domain>
		</gov.va.med.mdo.DomainMessage>
		<xsl:apply-templates select="n1:entry" />
	</xsl:template>

	<xsl:template match="n1:entry">
		<xsl:call-template name="labsAggregateRow">
			<xsl:with-param name="row" select="."/>
		</xsl:call-template>
	</xsl:template>

	<xsl:template name="labsAggregateRow">
		<xsl:param name="row"/>
		<xsl:variable name="observation" select="$row/n1:organizer/n1:component/n1:observation"/>
		<xsl:variable name="observation1" select="$row/n1:observation"/>
		<xsl:choose>
			<xsl:when  test="string-length($row/n1:organizer)!=0">
				<xsl:for-each select="$observation">
					<gov.va.med.mdo.ChemHem>
						<Protocol>NHIN</Protocol>
						<Panel>
							<xsl:variable name="organizerName">
								<xsl:call-template name="getOrganizerName">
									<xsl:with-param name="row" select="./../../../."/>
								</xsl:call-template>
							</xsl:variable>
							<xsl:choose>
								<xsl:when test="string-length($organizerName)>0">
									<xsl:value-of select="$organizerName"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:text>..Not Available..</xsl:text>
								</xsl:otherwise>
							</xsl:choose>
						</Panel>
						<PanelDate>
							<xsl:call-template name="getPanelDT">
								<xsl:with-param name="organizer" select="../../."/>
							</xsl:call-template>
						</PanelDate>
						<Timestamp>
							<xsl:call-template name="getResultDT">
								<xsl:with-param name="observation" select="."/>
							</xsl:call-template>
						</Timestamp>
						<Name>
							<xsl:variable name="typeResult2">
								<xsl:call-template name="getResultType2">
									<xsl:with-param name="observation" select="."/>
								</xsl:call-template>
							</xsl:variable>
							<xsl:choose>
								<xsl:when test="string-length($typeResult2)>0">
									<xsl:value-of select="$typeResult2"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:variable name="typeResult3">
										<xsl:call-template name="getResultType">
											<xsl:with-param name="observation" select="."/>
										</xsl:call-template>
									</xsl:variable>
									<xsl:choose>
										<xsl:when test="string-length($typeResult3)>0">
											<xsl:value-of select="$typeResult3"/>
										</xsl:when>
									</xsl:choose>
								</xsl:otherwise>
							</xsl:choose>
						</Name>

						<Result>
							<xsl:call-template name="getResultValue_detail">
								<xsl:with-param name="observation" select="."/>
							</xsl:call-template>
						</Result>

						<Flag>
							<xsl:variable name="interpResult1">
								<xsl:call-template name="getInterpretation2">
									<xsl:with-param name="observation" select="."/>
								</xsl:call-template>
							</xsl:variable>
							<xsl:choose>
								<xsl:when test="string-length($interpResult1)>0">
									<xsl:value-of select="$interpResult1"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:variable name="interpResult2">
										<xsl:call-template name="getInterpretation">
											<xsl:with-param name="observation" select="."/>
										</xsl:call-template>
									</xsl:variable>
									<xsl:choose>
										<xsl:when test="string-length($interpResult2)>0">
											<xsl:value-of select="$interpResult2"/>
										</xsl:when>
									</xsl:choose>
								</xsl:otherwise>
							</xsl:choose>
						</Flag>

						<Units>
							<xsl:call-template name="getResultUnit">
								<xsl:with-param name="observation" select="."/>
							</xsl:call-template>
						</Units>

						<RefRange>
							<xsl:call-template name="getResultRefRange">
								<xsl:with-param name="observation" select="."/>
							</xsl:call-template>
						</RefRange>

						<ResultId><xsl:value-of select="n1:id/@root"/></ResultId>

						<ResultStatus><xsl:value-of select="$observation/n1:statusCode/@code"/></ResultStatus>

						<Facility><xsl:call-template name="facilityName"/></Facility>

						<Location>
							<xsl:call-template name="getLocationName">
								<xsl:with-param name="organizer" select="./../../."/>
							</xsl:call-template>
						</Location>

					</gov.va.med.mdo.ChemHem>
				</xsl:for-each>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="string-length($row/n1:observation/n1:code/@displayName)!=0 or $row/n1:observation/n1:text/n1:reference/@value">
						<gov.va.med.mdo.ChemHem>
							<Protocol>NHIN</Protocol>
							<Timestamp>
								<xsl:call-template name="getResultDT">
									<xsl:with-param name="observation" select="$observation1"/>
								</xsl:call-template>
							</Timestamp>

							<Name>
								<xsl:call-template name="getResultType">
									<xsl:with-param name="observation" select="$observation1"/>
								</xsl:call-template>
							</Name>

							<Result>
								<xsl:call-template name="getResultValue_detail">
									<xsl:with-param name="observation" select="$observation1"/>
								</xsl:call-template>
							</Result>

							<Flag>
								<xsl:call-template name="getFlag">
									<xsl:with-param name="interpretation" select="./n1:interpretationCode"/>
								</xsl:call-template>
							</Flag>

							<Units>
								<xsl:call-template name="getResultUnit">
									<xsl:with-param name="observation" select="$observation1"/>
								</xsl:call-template>
							</Units>

							<RefRange>
								<xsl:call-template name="getRefRange">
									<xsl:with-param name="observation" select="$observation1"/>
								</xsl:call-template>
							</RefRange>

							<ResultId><xsl:value-of select="n1:id/@root"/></ResultId>

							<ResultStatus><xsl:value-of select="$observation/n1:statusCode/@code"/></ResultStatus>

							<Facility><xsl:call-template name="facilityName"/></Facility>

						</gov.va.med.mdo.ChemHem>
					</xsl:when>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>


	<xsl:template name="comments">
		<xsl:variable name="path" select="n1:component/n1:structuredBody/n1:component/n1:section[n1:code/@code='30954-2' and n1:code/@codeSystem='2.16.840.1.113883.6.1']"/>
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
				<xsl:call-template name="na"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>
