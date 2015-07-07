package com.vistacowboy.jVista;

import java.util.LinkedHashMap;

/**
 * Created with IntelliJ IDEA.
 * User: Joe
 * Date: 11/27/12
 * Time: 10:08 AM
 */

public class VistaSelect
{
    private String file;
    private String iens;
    private String fields = "@";
    private String flags = "IP";
    private int number = -1;
    private String from;
    private String part;
    private String index = "#";
    private String screen;
    private String identifier;
    private String[][] records;

    public VistaSelect() { }

    public String getFile()
    {
        return file;
    }

    public void setFile(String value)
    {
        file = value;
    }

    public String getIens()
    {
        return iens;
    }

    public void setIens(String value) throws VistaException
    {
        if (!value.startsWith(","))
        {
            value = ',' + value;
        }
        if (!value.endsWith(","))
        {
            value += ',';
        }
        String[] parts = value.substring(1, value.length()-1).split(",", -1);
        for (String ien : parts)
        {
            if (!VistaUtils.isNumeric(ien))
            {
                throw new VistaException(String.format("Non-numeric IEN: %s", ien));
            }
        }
        iens = value;
    }

    public String getFields()
    {
        return fields;
    }

    public void setFields(String value)
    {
        if (!value.isEmpty())
        {
            fields = value.contains("@") ? value : fields + ';' + value;
        }
    }

    public String getFlags()
    {
        return flags;
    }

    public void setFlags(String value) throws VistaException
    {
        if (value.isEmpty())
        {
            value = "IP";
        }
        else if (!value.contains("P"))
        {
            throw new VistaException("Current version does packed queries only");
        }
        flags = value;
    }

    public String getIndex()
    {
        return index;
    }

    public void setIndex(String value)
    {
        index = value;
    }

    public int getNumber()
    {
        return number;
    }

    public void setNumber(int value)
    {
        number = value;
    }

    public String getFrom()
    {
        return from;
    }

    public void setFrom(String value)
    {
        from = value;
    }

    public String getPart()
    {
        return part;
    }

    public void setPart(String value)
    {
        part = value;
    }

    public String getScreen()
    {
        return screen;
    }

    public void setScreen(String value)
    {
        screen = value;
    }

    public String getIdentifier()
    {
        return identifier;
    }

    public void setIdentifier(String value)
    {
        identifier = value;
    }

    public String[][] getRecords()
    {
        return records;
    }

    public String[][] find(VistaConnection cxn) throws VistaException
    {
        String rpc = prepare();
        String response = cxn.exec(rpc);
        load(response);
        return records;
    }

    private String prepare() throws VistaException
    {
        LinkedHashMap<String, String> param_list = prepareParamList();
        RpcParameter param = new RpcParameter(RpcParameter.LIST, param_list);
        return VistaRpc.prepare("DDR LISTER", new RpcParameter[]{param});
    }

    private LinkedHashMap<String, String> prepareParamList() throws VistaException
    {
        if (file == null || file.isEmpty())
        {
            throw new VistaException("VistaSelect must specify a file");
        }
        LinkedHashMap<String, String> param_list = new LinkedHashMap<String, String>();
        param_list.put("\"FILE\"", file);

        if (iens != null && !iens.isEmpty())
        {
            param_list.put("\"IENS\"", iens);
        }

        param_list.put("\"FIELDS\"", fields);
        param_list.put("\"FLAGS\"", flags);

        if (number != -1)
        {
            param_list.put("\"MAX\"", String.valueOf(number));
        }

        if (from != null && !from.isEmpty())
        {
            param_list.put("\"FROM\"", VistaUtils.adjustForSearch(from));
        }

        if (part != null && !part.isEmpty())
        {
            param_list.put("\"PART\"", part);
        }

        param_list.put("\"XREF\"", index);

        if (screen != null && !screen.isEmpty())
        {
            param_list.put("\"SCREEN\"", screen);
        }

        if (identifier != null && !identifier.isEmpty())
        {
            param_list.put("\"ID\"", identifier);
        }

        return param_list;
    }

    private void load(String response) throws VistaException
    {
        String[] lines = response.split("\r\n");

        // Find the starting line...
        int linenum = 0;
        while (linenum < lines.length && !lines[linenum].equals("[BEGIN_diDATA]") && !lines[linenum].equals("[BEGIN_diERRORS]")) linenum++;
        if (linenum == lines.length)
        {
            throw new VistaException("Empty response");
        }
        linenum++;

        int nrex = lines.length - linenum - 1;
        String[] flds = lines[linenum].split("\\^");
        records = new String[nrex][flds.length];
        for (int recnum = 0; recnum < nrex; recnum++, linenum++)
        {
            records[recnum] = lines[linenum].split("\\^");
        }

        if (!lines[linenum].equals("[END_diDATA]") && !lines[linenum].equals("[END_diERRORS]"))
        {
            throw new VistaException("Response error: missing END_diDATA?");
        }

        if (lines[linenum].equals("[END_diERRORS]"))
        {
            throw new VistaException("Errors returned in response", records);
        }
    }
}
