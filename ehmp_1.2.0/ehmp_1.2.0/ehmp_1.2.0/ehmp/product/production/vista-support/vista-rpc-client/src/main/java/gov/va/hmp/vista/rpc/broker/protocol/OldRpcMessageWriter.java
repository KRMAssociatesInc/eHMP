package gov.va.hmp.vista.rpc.broker.protocol;

import gov.va.hmp.vista.rpc.RpcException;
import gov.va.hmp.vista.rpc.RpcRequest;

import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;

/**
 * TODOC: Provide summary documentation of class gov.va.cpe.vista.protocol.impl.RpcRequestMarshaller
 */
public class OldRpcMessageWriter implements RpcMessageWriter {

    public static final String PREFIX = "{XWB}";

    private static final String BROKER_VERSION = "1.108";
//    private static final String EOT = "\u0004";

    private Writer writer;

    public OldRpcMessageWriter(Writer w) {
        this.writer = w;
    }

    public void writeStartConnection(String hostname, String address, int localPort) throws RpcException {
        /*
    RPCVersion := VarPack(BrokerVer);              //   eg 11-1-96
    x := string('TCPconnect^');
    x := ConCat(x, LocalName, upArrow);            //   local ip address
    t := IntToStr(LocalPort);                         // callback port
    x := ConCat(x, t, upArrow, workstation, upArrow); // workstation name
    r := length(x) + length(RPCVersion) + 5;
    t := string('00000') + IntToStr(r);               // eg 11-1-96
    y := Copy(t, length(t)-4,length(t));
    y := ConCat(y, RPCVersion, StrPack(x,5));         // rpc version
    y := Prefix + y;
         */
        /*
        {XWB}00055|.1.10800043TCPconnect^10.5.18.23^2007^solomon-7bqwg65^
         */
        StringBuilder sb = new StringBuilder(PREFIX);
        String rpcVersion = varPack(BROKER_VERSION);
        StringBuilder x = new StringBuilder("TCPconnect^");
        x.append(address);
        x.append('^');
        x.append(localPort);
        x.append('^');
        x.append(hostname);
        x.append('^');
        int r = x.length() + rpcVersion.length() + 5;
        String t = "00000" + r;
        String y = t.substring(t.length() - 5, t.length());
        sb.append(y);
        sb.append(rpcVersion);
        sb.append(strPack(x.toString(), 5));
        try {
            writer.write(sb.toString());
        } catch (IOException e) {
            throw new RpcException("unable to write start connection message", e);
        }
    }

    public void writeStopConnection() throws RpcException {
        // {XWB}0001000005#BYE#
        try {
            writer.write(PREFIX + strPack(strPack("#BYE#", 5), 5));
        } catch (IOException e) {
            throw new RpcException("unable to write stop connection message", e);
        }
    }

    public void write(RpcRequest request) throws RpcException {
        try {
            writer.write(buildPar1(request));
        } catch (IOException e) {
            throw new RpcException("unable to write request message", e);
        }
    }

    public void flush() throws RpcException {
        try {
            writer.flush();
        } catch (IOException e) {
            throw new RpcException("unable to flush message writer", e);
        }
    }

    private String buildPar1(RpcRequest request) {
        List<String> sin = new ArrayList<String>();
        String x = "";
        StringBuilder param = new StringBuilder();
        long arr = 0;
        for (RpcParam p : request.getParams()) {
            if (p.getType() == RpcParam.Type.UNDEFINED) continue;
            switch (p.getType()) {
                case LITERAL:
                    param.append(strPack("0" + p.getValue(), 3));
                    break;
                case REFERENCE:
                    param.append(strPack("1" + p.getValue(), 3));
                    break;
                case LIST:
                    p.setValue(".x");
                    param.append(strPack("2" + p.getValue(), 3));
                    String subscript = p.getMult().getFirst();
                    while (!subscript.isEmpty()) {
                        if (p.getMult().get(subscript).isEmpty())
                            p.getMult().put(subscript, "\u0001");
                        sin.add(strPack(subscript, 3) + strPack(p.getMult().get(subscript), 3));
                        subscript = p.getMult().order(subscript, 1);
                    }
                    sin.add("000");
                    arr = 1;
                    break;
            }
        }

        long tsize = 0;
        String tResult = "";
        String tout = "";

        String hdr = buildHdr("XWB", "", "", "");
        String strout = strPack(hdr + buildApi(request.getRpcName(), param.toString(), arr), 5);

        String rpcVersion = varPack(request.getRpcVersion());

        int num = sin.size() - 1;   //  JLI 040608 to correct handling of empty arrays
        if (!sin.isEmpty()) {
            x = "00000" + Integer.toString(strout.length() + rpcVersion.length());
        } else {
            for (int i = 0; i <= num; i++)
                tsize = tsize + sin.get(i).length();
            x = "00000" + Long.toString(tsize + strout.length() + rpcVersion.length());
        }

        String psize = x;
        psize = psize.substring(psize.length() - 5);
        tResult = psize;
        tResult += rpcVersion;
        tout = strout;
        tResult += tout;

        if (!sin.isEmpty()) {
            for (int i = 0; i <= num; i++) {
                tResult += sin.get(i);
            }
        }

        return PREFIX + tResult;
    }

    public static String buildApi(String n, String p, long f) {
        StringBuilder sb = new StringBuilder();
        sb.append(f);
        sb.append(n);
        sb.append("^");
        sb.append(strPack(p, 5));
        return strPack(sb.toString(), 5);
    }

    public static String buildHdr(String wkid, String winh, String prch, String wish) {
        StringBuilder sb = new StringBuilder(wkid);
        sb.append(";");
        sb.append(winh);
        sb.append(";");
        sb.append(prch);
        sb.append(";");
        sb.append(wish);
        sb.append(";");
        return strPack(sb.toString(), 3);
    }

    public static String strPack(String n, int p) {
        return String.format("%0" + p + "d%s", n.length(), n);
    }

    public static String varPack(String n) {
        if (n == null || n.length() == 0) n = "0";
        String result = "|" + ((char) n.length()) + n;
        return result;
    }
}

/*
function TXWBWinsock.BuildPar1(hSocket: integer; api, RPCVer: string; const
    Parameters: TParams): String;
var
  i,ParamCount: integer;
  num: integer;
  tsize: longint;
  arr: LongInt;
  param,x,hdr,strout: string;
  tout,psize,tResult,RPCVersion: string;
  sin: TStringList;
  subscript: string;
begin
  sin := TStringList.Create;
  sin.clear;
  x := '';
  param := '';
  arr := 0;
  if Parameters = nil then ParamCount := 0
  else ParamCount := Parameters.Count;
  for i := 0 to ParamCount - 1 do
    if Parameters[i].PType <> undefined then begin
      with Parameters[i] do begin

        {if PType= null then
          param:='';}

        if PType = literal then
          param := param + strpack('0' + Value,3);

        if PType = reference then
          param := param + strpack('1' + Value,3);

        if (PType = list) {or (PType = wordproc)} then begin
          Value := '.x';
          param := param + strpack('2' + Value,3);
          if Pos('.',Value) >0 then
            x := Copy(Value,2,length(Value));
            {if PType = wordproc then dec(last);}
            subscript := Mult.First;
            while subscript <> '' do begin
              if Mult[subscript] = '' then Mult[subscript] := #1;
              sin.Add(StrPack(subscript,3) + StrPack(Mult[subscript],3));
              subscript := Mult.Order(subscript,1);
            end{while};
            sin.Add('000');
            arr := 1;
        end{if};
      end{with};
    end{if};

  param := Copy(param,1,Length(param));
  tsize := 0;

  tResult := '';
  tout := '';

  hdr := BuildHdr('XWB','','','');
  strout := strpack(hdr + BuildApi(api,param,arr),5);
//  num :=0;   //  JLI 040608 to correct handling of empty arrays

  RPCVersion := '';
  RPCVersion := VarPack(RPCVer);

  {if sin.Count-1 > 0 then} num := sin.Count-1;   //  JLI 040608 to correct handling of empty arrays
//  if sin.Count-1 > 0 then num := sin.Count-1;


  if {num} sin.Count > 0 then     //  JLI 040608 to correct handling of empty arrays
//  if num > 0 then
  begin
        for i := 0 to num do
          tsize := tsize + length(sin.strings[i]);
        x := '00000' + IntToStr(tsize + length(strout)+ length(RPCVersion));
  end;
  if {num} sin.Count = 0 then   //  JLI 040608 to correct handling of empty arrays
//   if num = 0 then
   begin
        x := '00000' + IntToStr(length(strout)+ length(RPCVersion));
   end;

  psize := x;
  psize := Copy(psize,length(psize)-5,5);
  tResult := psize;
  tResult := ConCat(tResult, RPCVersion);
  tout := strout;
  tResult := ConCat(tResult, tout);

  if {num} sin.Count > 0 then   //  JLI 040608 to correct handling of empty arrays
//   if num > 0 then
   begin
        for i := 0 to num do
            tResult := ConCat(tResult, sin.strings[i]);
   end;

  sin.free;

  Result := Prefix + tResult;  {return result}

end;

 */
