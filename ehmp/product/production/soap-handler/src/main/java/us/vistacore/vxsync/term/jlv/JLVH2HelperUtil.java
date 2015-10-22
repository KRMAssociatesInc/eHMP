package us.vistacore.vxsync.term.jlv;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;

public class JLVH2HelperUtil {

	/**
	 * This will return the value at the cell location as a string.  If it is null, then
	 * it will return null.  If it is numeric, it will be transformed into a string.
	 * 
	 * @param oRow The row containing the data.
	 * @param iCellNum The cell number of the cell containing the data.
	 * @return The value of the cell as a string.
	 */
	public static String getStringCellValue(Row oRow, int iCellNum) {
		String sValue = null;
		
		if ((oRow != null) &&
			(oRow.getCell(iCellNum) != null)) {
			Cell oCell = oRow.getCell(iCellNum);
			if (oCell.getCellType() == Cell.CELL_TYPE_STRING) {
				sValue = oCell.getStringCellValue();
				
				// The cell may have the reserved word "null" - if so then we should treat it as a real null.
				//---------------------------------------------------------------------------------------------
				if (sValue.equalsIgnoreCase("null")) {
					sValue = null;
				}
			}
			else if (oCell.getCellType() == Cell.CELL_TYPE_NUMERIC) {
				double dValue = oCell.getNumericCellValue();

				// Is it an integer value?  If it is then we want to cast it to an integer or long first or we end
				// up getting ".0" at the end of the string when we convert it and it makes it look like a decimal value
				// when in the spreadsheet it was not.
				//-------------------------------------------------------------------------------------------------------
				if ((!Double.isInfinite(dValue)) &&
					(dValue == Math.floor(dValue))) {
					sValue = ((long) dValue) + "";
				}
				else {
					sValue = oCell.getNumericCellValue() + "";
				}
			}
		}
		
		return sValue;
	}
	

}
