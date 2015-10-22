<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
	xmlns:n1="urn:hl7-org:v3"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  

  <!-- Format first(given) and last (family) names-->
  <xsl:template name="formatProviderName">
    <xsl:param name="first"/>
    <xsl:param name="last"/>
    <xsl:choose>
      <xsl:when test="$first and $last">
        <xsl:value-of select="$last"/>
        <xsl:text>, </xsl:text>
        <xsl:value-of select="$first"/>
      </xsl:when>
      <xsl:otherwise/>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="formatComments">
    <xsl:param name="comments"/>
  <div>
    <table class="comments">
      <tbody>
        <tr>
          <td>
            <img src="app/applets/ccd_grid/assets/vler_resource/c32Styles/C32_notice.jpg" alt="NOTE:"/>
            <xsl:value-of select="$comments"/>
          </td>
        </tr>
      </tbody>
    </table>
    <br/>
  </div>
  </xsl:template>

</xsl:stylesheet> 

