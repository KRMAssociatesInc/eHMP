<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt">

	<xsl:template name="formatDateLongFromVista">
		<!-- VistA dates are in the format 3090421.123545 -->
		<xsl:param name="dateString"/>
		<xsl:variable name="month" select="substring($dateString,4,2)"/>
		<xsl:call-template name="longMonth">
			<xsl:with-param name="monthNum" select="$month"/>
		</xsl:call-template>
		<xsl:choose>
			<xsl:when test='substring($dateString, 6, 1)="0"'>
				<xsl:value-of select="substring($dateString, 7, 1)"/>
				<xsl:text>, </xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="substring($dateString, 6, 2)"/>
				<xsl:text>, </xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:value-of select="17+number(substring($dateString, 1, 1))"/><xsl:value-of select="substring($dateString, 2, 2)"/>
	</xsl:template>

	<xsl:template name="longMonth">
		<xsl:param name="monthNum"/>
		<xsl:choose>
			<xsl:when test="$monthNum='01'">
				<xsl:text>January </xsl:text>
			</xsl:when>
			<xsl:when test="$monthNum='02'">
				<xsl:text>February </xsl:text>
			</xsl:when>
			<xsl:when test="$monthNum='03'">
				<xsl:text>March </xsl:text>
			</xsl:when>
			<xsl:when test="$monthNum='04'">
				<xsl:text>April </xsl:text>
			</xsl:when>
			<xsl:when test="$monthNum='05'">
				<xsl:text>May </xsl:text>
			</xsl:when>
			<xsl:when test="$monthNum='06'">
				<xsl:text>June </xsl:text>
			</xsl:when>
			<xsl:when test="$monthNum='07'">
				<xsl:text>July </xsl:text>
			</xsl:when>
			<xsl:when test="$monthNum='08'">
				<xsl:text>August </xsl:text>
			</xsl:when>
			<xsl:when test="$monthNum='09'">
				<xsl:text>September </xsl:text>
			</xsl:when>
			<xsl:when test="$monthNum='10'">
				<xsl:text>October </xsl:text>
			</xsl:when>
			<xsl:when test="$monthNum='11'">
				<xsl:text>November </xsl:text>
			</xsl:when>
			<xsl:when test="$monthNum='12'">
				<xsl:text>December </xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>(Unknown Month:</xsl:text><xsl:value-of select="$monthNum"/><xsl:text>:) </xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="shortMonth">
		<xsl:param name="month"/>
		<xsl:choose>
			<xsl:when test="$month='01'">
				<xsl:text>Jan </xsl:text>
			</xsl:when>
			<xsl:when test="$month='02'">
				<xsl:text>Feb </xsl:text>
			</xsl:when>
			<xsl:when test="$month='03'">
				<xsl:text>Mar </xsl:text>
			</xsl:when>
			<xsl:when test="$month='04'">
				<xsl:text>Apr </xsl:text>
			</xsl:when>
			<xsl:when test="$month='05'">
				<xsl:text>May </xsl:text>
			</xsl:when>
			<xsl:when test="$month='06'">
				<xsl:text>Jun </xsl:text>
			</xsl:when>
			<xsl:when test="$month='07'">
				<xsl:text>Jul </xsl:text>
			</xsl:when>
			<xsl:when test="$month='08'">
				<xsl:text>Aug </xsl:text>
			</xsl:when>
			<xsl:when test="$month='09'">
				<xsl:text>Sep </xsl:text>
			</xsl:when>
			<xsl:when test="$month='10'">
				<xsl:text>Oct </xsl:text>
			</xsl:when>
			<xsl:when test="$month='11'">
				<xsl:text>Nov </xsl:text>
			</xsl:when>
			<xsl:when test="$month='12'">
				<xsl:text>Dec </xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="formatDateLongFromUtc">
		<xsl:param name="dateString"/>
		<xsl:variable name="month" select="substring($dateString,5,2)"/>
		<xsl:call-template name="longMonth">
			<xsl:with-param name="monthNum" select="$month"/>
		</xsl:call-template>
		<xsl:choose>
			<xsl:when test='substring($dateString, 7, 1)="0"'>
				<xsl:value-of select="substring($dateString, 8, 1)"/>
				<xsl:text>, </xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="substring($dateString, 7, 2)"/>
				<xsl:text>, </xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:value-of select="substring($dateString, 1, 4)"/>
	</xsl:template>

	<xsl:template name="formatDateLong">
		<xsl:param name="dateString"/>
		<xsl:choose>
			<xsl:when test="$dateString='0'"></xsl:when>
			<xsl:when test="string-length($dateString)=0"></xsl:when>
			<xsl:when test="substring($dateString, 8, 1)='.'">
				<xsl:call-template name="formatDateLongFromVista"><xsl:with-param name="dateString" select="$dateString"/></xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="formatDateLongFromUtc">
					<xsl:with-param name="dateString" select="$dateString"/>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="formatDateShort">
		<xsl:param name="dateString"/>
		<xsl:choose>
			<xsl:when test="$dateString='0'"></xsl:when>
			<xsl:when test="string-length($dateString)=0"></xsl:when>
			<xsl:when test="substring($dateString, 8, 1)='.'">
				<xsl:call-template name="formatDateShortFromVista">
					<xsl:with-param name="dateString" select="$dateString"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="formatDateShortFromUtc">
					<xsl:with-param name="dateString" select="$dateString"/>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="formatDateShortFromVista">
		<xsl:param name="dateString"/>
		<xsl:variable name="month" select="substring($dateString,4,2)"/>
		<xsl:call-template name="shortMonth">
			<xsl:with-param name="month" select="$month"/>
		</xsl:call-template>
		<xsl:choose>
			<xsl:when test='substring($dateString, 6, 1)="0"'>
				<xsl:value-of select="substring($dateString, 7, 1)"/>
				<xsl:text>, </xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="substring($dateString, 6, 2)"/>
				<xsl:text>, </xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:value-of select="17+number(substring($dateString, 1, 1))"/>
		<xsl:value-of select="substring($dateString, 2, 2)"/>
	</xsl:template>
	
	<xsl:template name="formatDateShortFromUtc">
		<xsl:param name="dateString"/>
		<xsl:variable name="month" select="substring($dateString,5,2)"/>
		<xsl:call-template name="shortMonth">
			<xsl:with-param name="month" select="$month"/>
		</xsl:call-template>
		<xsl:choose>
			<xsl:when test='substring($dateString, 7, 1)="0"'>
				<xsl:value-of select="substring($dateString, 8, 1)"/>
				<xsl:text>, </xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="substring($dateString, 7, 2)"/>
				<xsl:text>, </xsl:text>
			</xsl:otherwise>
		</xsl:choose>
		<xsl:value-of select="substring($dateString, 1, 4)"/>
	</xsl:template>

	<xsl:template name="formatDateNumeric">
		<xsl:param name="dateString"/>
		<xsl:choose>
			<xsl:when test="$dateString='0'"></xsl:when>
			<xsl:when test="substring($dateString, 8, 1)='.' or string-length($dateString)=7">
				<xsl:call-template name="formatDateNumericFromVista">
					<xsl:with-param name="dateString" select="$dateString"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="substring($dateString, 9, 1)='.'">
				<xsl:call-template name="formatDateNumericFromMdo">
					<xsl:with-param name="dateString" select="$dateString"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="formatDateNumericFromUtc">
					<xsl:with-param name="dateString" select="$dateString"/>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="formatDateNumericFromMdo">
		<xsl:param name="dateString"/>
		<xsl:variable name="dateValue">
			<xsl:value-of select="$dateString"/>
			<xsl:text>000000</xsl:text>
		</xsl:variable>
		<xsl:value-of select="substring($dateValue, 5, 2)"/>
		<xsl:text>/</xsl:text>
		<xsl:value-of select="substring($dateValue, 7, 2)"/>
		<xsl:text>/</xsl:text>
		<xsl:value-of select="substring($dateValue, 1, 4)"/>
		<xsl:text> </xsl:text>
		<xsl:value-of select="substring($dateValue, 10, 2)"/>
		<xsl:text>:</xsl:text>
		<xsl:value-of select="substring($dateValue, 12, 2)"/>
		<xsl:text>:</xsl:text>
		<xsl:value-of select="substring($dateValue, 14, 2)"/>
	</xsl:template>

	<xsl:template name="formatDateNumericFromVista">
		<xsl:param name="dateString"/>
		<xsl:value-of select="substring($dateString, 4, 2)"/>
		<xsl:text>/</xsl:text>
		<xsl:value-of select="substring($dateString, 6, 2)"/>
		<xsl:text>/</xsl:text>
		<xsl:value-of select="17+number(substring($dateString, 1, 1))"/>
		<xsl:value-of select="substring($dateString, 2, 2)"/>
		<xsl:if test="string-length($dateString)>7">
			<xsl:variable name="dateValue">
				<xsl:value-of select="$dateString"/>
				<xsl:text>000000</xsl:text>
			</xsl:variable>
			<xsl:text> </xsl:text>
			<xsl:value-of select="substring($dateValue, 9, 2)"/>
			<xsl:text>:</xsl:text>
			<xsl:value-of select="substring($dateValue, 11, 2)"/>
			<xsl:text>:</xsl:text>
			<xsl:value-of select="substring($dateValue, 13, 2)"/>
		</xsl:if>
	</xsl:template>

	<xsl:template name="formatDateNumericFromUtc">
		<xsl:param name="dateString"/>
		<xsl:value-of select="substring($dateString, 5, 2)"/>
		<xsl:text>/</xsl:text>
		<xsl:value-of select="substring($dateString, 7, 2)"/>
		<xsl:text>/</xsl:text>
		<xsl:value-of select="substring($dateString, 1, 4)"/>
		<xsl:if test="string-length($dateString)>8">
			<xsl:variable name="dateValue">
				<xsl:value-of select="$dateString"/>
				<xsl:text>000000</xsl:text>
			</xsl:variable>
			<xsl:text> </xsl:text>
			<xsl:value-of select="substring($dateValue, 9, 2)"/>
			<xsl:text>:</xsl:text>
			<xsl:value-of select="substring($dateValue, 11, 2)"/>
			<xsl:if test="string-length($dateValue)>14">
				<xsl:if test="substring($dateValue,15,1)='-' or substring($dateValue,15,1)='+'">
					<xsl:text>:</xsl:text>
					<xsl:value-of select="substring($dateValue, 13, 2)"/>
				</xsl:if>
			</xsl:if>
		</xsl:if>
	</xsl:template>

	<xsl:template name="ltrim">
		<xsl:param name="text"/>
		<xsl:param name="startChar" select="' '"/>
		<xsl:if test="$text">
			<xsl:choose>
				<xsl:when test="starts-with($text,$startChar)">
					<xsl:call-template name="ltrim">
						<xsl:with-param name="text" select="substring-after($text,$startChar)"/>
						<xsl:with-param name="startChar" select="$startChar"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$text"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>

</xsl:stylesheet> 
