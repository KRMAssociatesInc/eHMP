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
		<rxops>
			<xsl:if test="not($noMed)">
				<xsl:apply-templates select="n1:component/n1:structuredBody/n1:component/n1:section[n1:code/@code='10160-0' and n1:code/@codeSystem='2.16.840.1.113883.6.1']/n1:entry/n1:substanceAdministration"/>
				<gov.va.med.mdo.DomainMessage>
					<Message><xsl:call-template name="comments"/></Message>
					<Facility><xsl:call-template name="facilityName"/></Facility>
					<Domain><xsl:text>Rxop</xsl:text></Domain>
				</gov.va.med.mdo.DomainMessage>
			</xsl:if>
		</rxops>
	</xsl:template>

	<xsl:template match="n1:component/n1:structuredBody/n1:component/n1:section/n1:entry/n1:substanceAdministration">
		<gov.va.med.mdo.Rxop>
			<Protocol>NHIN</Protocol>
			<Name>
				<xsl:call-template name="getMedicationName">
					<xsl:with-param name="row" select="../."/>
				</xsl:call-template>
			</Name>
			<IssueDate>
				<xsl:call-template name="medDateBeginString">
					<xsl:with-param name="substanceAdmin" select="."/>
				</xsl:call-template>
			</IssueDate>
			<ExpireOrCancelDate>
				<xsl:call-template name="medExpireDateString">
					<xsl:with-param name="substanceAdmin" select="."/>
				</xsl:call-template>
			</ExpireOrCancelDate>
			<Status>
				<xsl:call-template name="getMedStatusString">
					<xsl:with-param name="substanceAdmin" select="."/>
				</xsl:call-template>
			</Status>
			<Qty>
				<xsl:call-template name="getMedQuantityString">
					<xsl:with-param name="substanceAdmin" select="."/>
				</xsl:call-template>
			</Qty>
			<RxNum>
				<xsl:call-template name="getRxNumString">
					<xsl:with-param name="substanceAdmin" select="."/>
				</xsl:call-template>
			</RxNum>
			<Sig>
				<xsl:call-template name="getSig">
					<xsl:with-param name="substanceAdmin" select="."/>
				</xsl:call-template>
			</Sig>
			<Provider>
				<xsl:call-template name="getMedProvider">
					<xsl:with-param name="substanceAdmin" select="."/>
				</xsl:call-template>
			</Provider>
			<xsl:call-template name="facilityProperty"/>
			<Text><xsl:call-template name="detail"/></Text>
		</gov.va.med.mdo.Rxop>
	</xsl:template>

	<xsl:template name="detail">
		<xsl:text>Medication:                   </xsl:text>
		<xsl:call-template name="getMedicationName">
			<xsl:with-param name="row" select="../."/>
		</xsl:call-template>
		<xsl:text>&#13;&#10;</xsl:text>

		<xsl:text>Rx Num:                       </xsl:text>
		<xsl:call-template name="getRxNumString">
			<xsl:with-param name="substanceAdmin" select="."/>
		</xsl:call-template>
		<xsl:text>&#13;&#10;</xsl:text>

		<xsl:text>Start Date/Time:              </xsl:text>
		<xsl:call-template name="medBegintime">
			<xsl:with-param name="row" select="../."/>
		</xsl:call-template>
		<xsl:text>&#13;&#10;</xsl:text>

		<xsl:text>Stop Date/Time:               </xsl:text>
		<xsl:call-template name="medExpiretime">
			<xsl:with-param name="substanceAdmin" select="."/>
		</xsl:call-template>
		<xsl:text>&#13;&#10;</xsl:text>

		<xsl:text>Current Status:               </xsl:text>
		<xsl:call-template name="medStatus">
			<xsl:with-param name="substanceAdmin" select="."/>
		</xsl:call-template>
		<xsl:text>&#13;&#10;</xsl:text>

		<xsl:text>Order:</xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>

		<xsl:text>Instructions:                 </xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>

		<xsl:text>Sig:</xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:call-template name="getSig">
			<xsl:with-param name="substanceAdmin" select="."/>
		</xsl:call-template>
		<xsl:text>&#13;&#10;</xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>

		<xsl:text>Days Supply:                  </xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>

		<xsl:text>Quantity:                     </xsl:text>
		<xsl:call-template name="getMedQuantityString">
			<xsl:with-param name="substanceAdmin" select="."/>
		</xsl:call-template>
		<xsl:text>&#13;&#10;</xsl:text>

		<xsl:text>Refills:                      </xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>

		<xsl:text>Pick Up:                      </xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>

		<xsl:text>Comments:</xsl:text>
		<xsl:text>&#13;&#10;</xsl:text>

	</xsl:template>

	<xsl:template name="na">
		<xsl:text></xsl:text>
	</xsl:template>

	<xsl:template name="comments">
		<xsl:variable name="path" select="n1:component/n1:structuredBody/n1:component/n1:section[n1:code/@code='10160-0' and n1:code/@codeSystem='2.16.840.1.113883.6.1']"/>
		<xsl:variable name="ref1" select="$path/n1:entry/n1:act/n1:text/n1:reference/@value"/>
		<xsl:variable name="ref2" select="substring-after($ref1,'#')"/>
		<xsl:choose>
			<xsl:when test="$path/n1:text//n1:content[@ID=$ref1]">
				<xsl:value-of select="$path/n1:text//n1:content[@ID=$ref1]"/>
			</xsl:when>
			<xsl:when test="$path/n1:text//n1:content[@ID=$ref2]">
				<xsl:value-of select="$path/n1:text//n1:content[@ID=$ref2]"/>
			</xsl:when>
			<xsl:otherwise>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>
