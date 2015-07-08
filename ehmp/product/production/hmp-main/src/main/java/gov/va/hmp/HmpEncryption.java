package gov.va.hmp;

import gov.va.hmp.hub.dao.IVistaAccountDao;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Component
public class HmpEncryption {

	private boolean cinit = false;
//	private StandardPBEStringEncryptor crypto;
    private Cipher cipher;
    private Environment environment;
    private Cipher decipher;
    private Cipher encipher;

    public String decrypt(String str) throws BadPaddingException, IllegalBlockSizeException, NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException {
        if(!cinit) {
            cinit();
        }
        byte[] encryptedBytes = Base64.decodeBase64(str);
        String decrypted = new String(decipher.doFinal(encryptedBytes));
    	return decrypted;
    }
    
    public String encrypt(String str) throws BadPaddingException, IllegalBlockSizeException, NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException {
        if(!cinit) {
            cinit();
        }
    	String encrypted = new String(Base64.encodeBase64(encipher.doFinal(str.getBytes())));
        return encrypted;
    }

    private byte[] salt;
    private SecretKeySpec dodgeball;
    private synchronized void cinit() throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException {
        if(dodgeball==null || salt==null) {
            MessageDigest digest = MessageDigest.getInstance("SHA");
            String svr = environment.getProperty(HmpProperties.SERVER_ID);
            byte[] sbites = svr.getBytes();
            digest.update(sbites);
            dodgeball = new SecretKeySpec(digest.digest(), 0, 16, "AES");
            salt = vistaAccountDao.getPrimaryVistaSystemId().getBytes();
        }
        decipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        decipher.init(Cipher.DECRYPT_MODE, dodgeball);
        encipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        encipher.init(Cipher.ENCRYPT_MODE, dodgeball);
        cinit = true;
    }

    public static HmpEncryption getInstance(String password, String salt) {
    	HmpEncryption venc = new HmpEncryption();
        MessageDigest digest = null;
        try {
            digest = MessageDigest.getInstance("SHA");
            byte[] pbites = password.getBytes();
            digest.update(pbites);
            venc.dodgeball = new SecretKeySpec(digest.digest(), 0, 16, "AES");
            venc.salt = salt.getBytes();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }

    	return venc;
    }
    
    /**
     * For quick way to create encrypted values to stick directly in Properties if needed.
     * @param args
     */
    public static void main(String[] args) {
        try {
    	if(args.length>2) {
    		System.out.println(HmpEncryption.getInstance(args[0],args[1]).encrypt(args[2]));
    	} else {

        	final JFrame frm = new JFrame();
        	frm.setLayout(new BorderLayout());
            final JLabel l1 = new JLabel("hmp.server.id");
            final JLabel l2 = new JLabel("vista system ID");
        	final JLabel l3 = new JLabel("value to be encrypted");
            final JLabel l4 = new JLabel("Result Value");
            final JTextField f1 = new JTextField();
            final JTextField f2 = new JTextField();
            final JTextField f3 = new JTextField();
            final JTextField f4 = new JTextField();
            f4.setEditable(false);

            GridBagLayout gbl = new GridBagLayout();
            frm.setLayout(gbl);
            gbl.setConstraints(l1, new GridBagConstraints(0, 0, 1, 1, 0, 0, GridBagConstraints.EAST, GridBagConstraints.NONE, new Insets(0, 0, 0, 0), 0, 0));
            gbl.setConstraints(l2, new GridBagConstraints(0, 1, 1, 1, 0, 0, GridBagConstraints.EAST, GridBagConstraints.NONE, new Insets(0, 0, 0, 0), 0, 0));
            gbl.setConstraints(l3, new GridBagConstraints(0, 2, 1, 1, 0, 0, GridBagConstraints.EAST, GridBagConstraints.NONE, new Insets(0, 0, 0, 0), 0, 0));
            gbl.setConstraints(l4, new GridBagConstraints(0,3,1,1,0,0,GridBagConstraints.EAST,GridBagConstraints.NONE,new Insets(0,0,0,0),0,0));
            gbl.setConstraints(f1, new GridBagConstraints(1,0,1,1,1,0,GridBagConstraints.EAST,GridBagConstraints.HORIZONTAL,new Insets(0,0,0,0),0,0));
            gbl.setConstraints(f2, new GridBagConstraints(1,1,1,1,1,0,GridBagConstraints.EAST,GridBagConstraints.HORIZONTAL,new Insets(0,0,0,0),0,0));
            gbl.setConstraints(f3, new GridBagConstraints(1,2,1,1,1,0,GridBagConstraints.EAST,GridBagConstraints.HORIZONTAL,new Insets(0,0,0,0),0,0));
            gbl.setConstraints(f4, new GridBagConstraints(1,3,1,1,1,0,GridBagConstraints.EAST,GridBagConstraints.HORIZONTAL,new Insets(0,0,0,0),0,0));
            frm.add(l1);
            frm.add(l2);
            frm.add(l3);
            frm.add(l4);
            frm.add(f1);
            frm.add(f2);
            frm.add(f3);
            frm.add(f4);
        	JButton go = new JButton("Encrypt");
            gbl.setConstraints(go, new GridBagConstraints(0,4,2,1,0,0,GridBagConstraints.CENTER,GridBagConstraints.NONE,new Insets(0,0,0,0),0,0));
            frm.add(go);
        	go.addActionListener(new ActionListener(){
    			@Override
    			public void actionPerformed(ActionEvent e) {
    				try {
    					f4.setText(HmpEncryption.getInstance(f1.getText(), f2.getText()).encrypt(f3.getText()));
    					JOptionPane.showMessageDialog(frm, "Decryption check: "+ HmpEncryption.getInstance(f1.getText(),f2.getText()).decrypt(f4.getText()));
    				} catch (Exception e1) {
    					e1.printStackTrace();
    					JOptionPane.showMessageDialog(frm, e1.getMessage());
    				}
    			}
        	});
        	frm.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        	frm.setSize(400,220);
        	frm.setLocationRelativeTo(null);
        	frm.setVisible(true);
    	}
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Autowired
    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    IVistaAccountDao vistaAccountDao;

    @Autowired
    public void setVistaAccountDao(IVistaAccountDao vistaAccountDao) {
        this.vistaAccountDao = vistaAccountDao;
    }
}
