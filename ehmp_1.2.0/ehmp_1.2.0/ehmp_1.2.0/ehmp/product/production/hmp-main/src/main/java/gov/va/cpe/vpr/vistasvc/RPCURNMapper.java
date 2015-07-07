package gov.va.cpe.vpr.vistasvc;

import gov.va.hmp.vista.rpc.RpcTemplate;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

import static gov.va.cpe.vpr.UserInterfaceRpcConstants.CONTROLLER_RPC_URI;

public abstract class RPCURNMapper {
	public abstract boolean isKnown(String urn);
	
	public abstract String fetch(String urn, VistAService svc);
	
	public void store(String urn, String data, VistAService svc) {
		// Not all data sources are writable... 
		throw new UnsupportedOperationException();
	}
	
	public void delete(String urn, VistAService svc) {
		throw new UnsupportedOperationException();
	}
	
	public Object exec(String urn, Object data, VistAService svc) {
		throw new UnsupportedOperationException();
	}
	
	protected static String getURNPart(URI urn, int idx) {
		return getURNPart((urn == null) ? "" : urn.toString(), idx);
	}
	
	protected static String getURNPart(String urn, int idx) {
		String[] parts = (urn == null) ? new String[0] : urn.split(":");
		if (idx >= 0 && parts.length > idx) {
			return parts[idx];
		}
		return "";
	}
	
	// urn:va:roster:{ien}
	public static class RosterRPCMapper extends RPCURNMapper {
		@Override
		public boolean isKnown(String urn) {
			return urn.startsWith("urn:va:roster:");
		}

		@Override
		public String fetch(String urn, VistAService svc) {
			RpcTemplate tpl = svc.getRPCTemplate();
			String xml = tpl.executeForString("/${VPR_UI_CONTEXT}/VPR ROSTERS");
			
			// TODO Auto-generated method stub
			return null;
		}
		
	}
	
	public static class ParamRPCMapper extends RPCURNMapper {

		@Override
		public boolean isKnown(String urn) {
			return urn.startsWith("urn:va:param:");
		}

		@Override
		public String fetch(String urn, VistAService svc) {
			RpcTemplate tpl = svc.getRPCTemplate();
			String duz = getURNPart(urn, 4);
			String id = getURNPart(urn, 5);
			String inst = getURNPart(urn, 6);
			Map<String, String> p = new HashMap<String, String>();
			p.put("command", "getAllUserParam");
			p.put("entity", "USR");
			p.put("entityID", duz);
			// if ID + INST are available, this is a single parameter query
			if (!id.equals("") && !inst.equals("")) {
				p.put("command", "getParam");
				p.put("param", id); 
				p.put("inst", inst);
			}
			
			String ret = tpl.executeForString(CONTROLLER_RPC_URI, p);
			if (ret == null || ret.length() == 0) {
				return null;
			}
			return ret;
		}
		
		@Override
		public void store(String urn, String data, VistAService svc) {
			RpcTemplate tpl = svc.getRPCTemplate();
			Map<String, String> p = new HashMap<String, String>();
			p.put("command", "saveParam");
			p.put("value", data);
			tpl.executeForString(CONTROLLER_RPC_URI, p);
		}
		
	}
	
	public static class RPCURLMapper extends RPCURNMapper {
		
		@Override
		public boolean isKnown(String url) {
			try {
				URI uri = new URI(url);
				return uri.getScheme().equals("vrpcb");
			} catch (URISyntaxException e) {
				e.printStackTrace();
			}
			return false;
		}

		@Override
		public String fetch(String url, VistAService svc) {
			RpcTemplate tpl = svc.getRPCTemplate();
			//[vrpcb|vlink]://[{division}:][{accessCode};{verifyCode}@]{host}[:port]/[{rpcContext}]/{rpcName}
			tpl.execute(url);
			// TODO Auto-generated method stub
			return null;
		}
		
	}
}