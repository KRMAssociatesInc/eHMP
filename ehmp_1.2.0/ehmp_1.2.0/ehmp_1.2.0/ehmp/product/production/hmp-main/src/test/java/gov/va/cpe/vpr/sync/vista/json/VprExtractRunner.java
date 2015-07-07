package gov.va.cpe.vpr.sync.vista.json;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import gov.va.hmp.vista.rpc.CredentialsProvider;
import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.RpcHostResolver;
import gov.va.hmp.vista.rpc.RpcTemplate;
import gov.va.hmp.vista.rpc.broker.conn.VistaIdNotFoundException;

import javax.swing.*;
import java.awt.*;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.ClipboardOwner;
import java.awt.datatransfer.StringSelection;
import java.awt.datatransfer.Transferable;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeSet;

public class VprExtractRunner implements ClipboardOwner {
    public static void main(String[] args) throws Exception {
        new VprExtractRunner().helloKitty();
    }

    private String[] kittens = {
            "accession",
            "allergy",
            "appointment",
            "consult",
            "clinicalProcedure",
            "cpt",
            "demographics",
            "diagnosis",
            "document",
            "education",
            "exam",
            "factor",
            "immunization",
            "image",
            "insurance",
            "lab",
            "med",
            "mh",
            "new",
            "obs",
            "order",
            "patient",
            "patientauxiliary",
            "patientcomment",
            "pharmacy",
            "poc",
            "pov",
            "problem",
            "procedure",
            "ptf",
            "image",
            "rad",
            "reaction",
            "result",
            "roadtrip",
            "skin",
            "surgery",
            "task",
            "treatment",
            "visit",
            "vital"
    };
    private JFrame frm;
    private JTextArea litterbox;
    private JComboBox kitty;
    private JTextField catFood;
    private RpcTemplate rpcTemplate;

    public VprExtractRunner() {
        rpcTemplate = new RpcTemplate();
        rpcTemplate.setCredentialsProvider(new CredentialsProvider() {
            @Override
            public String getCredentials(RpcHost host, String userInfo) {
                return "vpruser1;verifycode1&";
            }
        });
        rpcTemplate.setHostResolver(new RpcHostResolver(){
			@Override
			public RpcHost resolve(String vistaId)
					throws VistaIdNotFoundException {
				return srcMap.get(hostBox.getSelectedItem().toString());
			}});
    }
    
    HashMap<String, RpcHost> srcMap = new HashMap<String, RpcHost>();
	private JComboBox hostBox;

    private void helloKitty() {
        this.frm = new JFrame();
        GridBagLayout gb = new GridBagLayout();
        frm.setLayout(gb);
        String[] srcs = {"DEV","SQA","SNDBX"};
        srcMap.put("SQA", new RpcHost("localhost", 29063));
        srcMap.put("SNDBX", new RpcHost("localhost", 29062));
        srcMap.put("DEV", new RpcHost("localhost", 29060));
        hostBox = new JComboBox(srcs);
        
        kitty = new JComboBox(kittens);
        gb.setConstraints(kitty, new GridBagConstraints(0, 0, 1, 1, 1, 0, GridBagConstraints.WEST, GridBagConstraints.BOTH, new Insets(0, 0, 0, 0), 0, 0));
        frm.add(kitty);
        
        catFood = new JTextField("229");
        gb.setConstraints(catFood, new GridBagConstraints(1, 0, 1, 1, 1, 0, GridBagConstraints.WEST, GridBagConstraints.BOTH, new Insets(0, 0, 0, 0), 0, 0));
        frm.add(catFood);
        
        gb.setConstraints(hostBox, new GridBagConstraints(2, 0, 1, 1, 1, 0, GridBagConstraints.WEST, GridBagConstraints.BOTH, new Insets(0, 0, 0, 0), 0, 0));
        frm.add(hostBox);
        
        JButton biz = new JButton("Execute RPC");
        gb.setConstraints(biz, new GridBagConstraints(3, 0, 1, 1, 0, 0, GridBagConstraints.WEST, GridBagConstraints.NONE, new Insets(0, 0, 0, 0), 0, 0));
        frm.add(biz);
        
        litterbox = new JTextArea();
        JScrollPane pain = new JScrollPane(litterbox);
        gb.setConstraints(pain, new GridBagConstraints(0, 1, 4, 1, 1, 1, GridBagConstraints.CENTER, GridBagConstraints.BOTH, new Insets(0, 0, 0, 0), 0, 0));
        frm.add(pain);

        JButton copyToClipboard = new JButton("Copy to Clipboard");
        gb.setConstraints(copyToClipboard, new GridBagConstraints(0, 2, 4, 1, 1, 0, GridBagConstraints.CENTER, GridBagConstraints.NONE, new Insets(0, 0, 0, 0), 0, 0));
        frm.add(copyToClipboard);
        copyToClipboard.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
                clipboard.setContents(new StringSelection(litterbox.getText()), VprExtractRunner.this);
            }
        });
        frm.setSize(new Dimension(800, 800));
        frm.setLocationRelativeTo(null);
        frm.setVisible(true);
        frm.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frm.addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent e) {
                try {
                    rpcTemplate.destroy();
                } catch (Exception e1) {
                    e1.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                }
            }
        });
        
        ActionListener al = new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
                try {
                    Response rslt = doBusiness(kitty.getSelectedItem().toString());
                    if (rslt.json == null) {
                        JOptionPane.showMessageDialog(frm, "JSON couldn't be parsed: ", "No Data Nugget Found", JOptionPane.ERROR_MESSAGE);
                        litterbox.setText(rslt.raw);
                    } else {
                        ObjectMapper mappy = new ObjectMapper();
                        String trslt = mappy.writerWithDefaultPrettyPrinter().writeValueAsString(rslt.json);
                        litterbox.setText(trslt);
                    }
                } catch (Exception e1) {
                    e1.printStackTrace();
                    JOptionPane.showMessageDialog(frm, "Didn't like option: " + kitty.getSelectedItem().toString(), "No Data Nugget Found", JOptionPane.ERROR_MESSAGE);
                }
            }
        };

        biz.addActionListener(al);
        catFood.addActionListener(al);
        
        frm.setTitle("VPR Extract Runner");
    }

    private Response doBusiness(String cat) throws Exception {
        Response response = new Response();
        try {
            Map params = new HashMap();
            params.put("patientId", catFood.getText());
            params.put("domain", cat);
            response.raw = rpcTemplate.executeForString("/HMP SYNCHRONIZATION CONTEXT/HMP GET PATIENT DATA JSON", params);

            ObjectMapper jsonMapper = new ObjectMapper();
            String chkval = response.raw;
            if(response.raw.trim().equals(""))
            {
            	response.raw = "{\"No\": \"Data\"}";
            }
            System.out.println(response.raw);
            response.json = jsonMapper.readTree(response.raw);
            ArrayNode anode = (ArrayNode) response.json.get("data").get("items");
            TreeSet<String> uids = new TreeSet<>();
            for(JsonNode node: anode)   {
                String uid = node.get("uid").textValue();
                if(!uids.add(uid)) {
                    System.out.println("Dupe UID found: "+uid);
                }
            }
            jsonMapper.writerWithDefaultPrettyPrinter().writeValue(System.out, response);
        } catch (Exception e) {
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            response.raw = sw.toString();

            e.printStackTrace();
        }
        return response;
    }

    @Override
    public void lostOwnership(Clipboard clipboard, Transferable contents) {
        // TODO Auto-generated method stub
    }

    class Response {
        public String raw;
        public JsonNode json;

    }
}
