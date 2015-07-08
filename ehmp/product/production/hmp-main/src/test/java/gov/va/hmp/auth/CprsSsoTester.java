package gov.va.hmp.auth;

import gov.va.hmp.vista.rpc.RpcHost;
import gov.va.hmp.vista.rpc.RpcResponse;
import gov.va.hmp.vista.rpc.RpcTemplate;
import gov.va.hmp.vista.rpc.conn.SystemInfo;
import org.springframework.web.util.UriComponentsBuilder;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.net.URI;
import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * Simulates CPRS SSO via Tools menu url passing.
 */
public class CprsSsoTester extends JFrame {

    private RpcTemplate rpcTemplate;
    private JTextArea welcomeText;
    private JPasswordField accessCodeField;
    private JPasswordField verifyCodeField;
    private RpcHost rpcHost = new RpcHost("localhost", 29060);
    private JButton launchButton;
    private JLabel messageLabel;

    public CprsSsoTester() {
        super("CPRS SSO Test");
        setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        setContentPane(createContent());
        getRootPane().setDefaultButton(launchButton);

        rpcTemplate = new RpcTemplate();

        this.addWindowListener(new WindowAdapter() {
            @Override
            public void windowOpened(WindowEvent e) {
                new FetchIntroMessage().execute();

                accessCodeField.requestFocus();
            }

            @Override
            public void windowClosing(WindowEvent e) {
                try {
                    rpcTemplate.destroy();
                } catch (Exception e1) {
                    e1.printStackTrace();
                }
            }
        });
    }

    private Container createContent() {
        JPanel result = new JPanel();
        result.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        // Create the layout
        GroupLayout layout = new GroupLayout(result);
        result.setLayout(layout);
        layout.setAutoCreateGaps(true);

        // Create the components we will put in the form
        welcomeText = new JTextArea("Fetching intro text from " + rpcHost.toHostString(), 24, 80);
        welcomeText.setFont(Font.decode("Monospaced"));
        welcomeText.setEditable(false);
        JScrollPane welcomeScroller = new JScrollPane(welcomeText, ScrollPaneConstants.VERTICAL_SCROLLBAR_ALWAYS, ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);

        JLabel accessCodeLabel = new JLabel("Access Code");
        accessCodeField = new JPasswordField(20);
        JLabel verifyCodeLabel = new JLabel("Verify Code");
        verifyCodeField = new JPasswordField(20);
        launchButton = new JButton("Launch HMP");
        launchButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                new LaunchHMP().execute();
            }
        });
        messageLabel = new JLabel();

        // Horizontally, we want to align the labels and the text fields
        // along the left (TRAILING) edge
        layout.setHorizontalGroup(layout.createSequentialGroup()
                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.TRAILING)
                        .addComponent(accessCodeLabel)
                        .addComponent(verifyCodeLabel)
                )
                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.LEADING)
                        .addComponent(welcomeScroller)
                        .addComponent(accessCodeField)
                        .addComponent(verifyCodeField)
                        .addGroup(layout.createSequentialGroup()
                                .addComponent(launchButton).addComponent(messageLabel))
                )
        );

        // Vertically, we want to align each label with his textfield
        // on the baseline of the components
        layout.setVerticalGroup(layout.createSequentialGroup()
                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.BASELINE)
                        .addComponent(welcomeScroller))
                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.BASELINE)
                        .addComponent(accessCodeLabel)
                        .addComponent(accessCodeField))
                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.BASELINE)
                        .addComponent(verifyCodeLabel)
                        .addComponent(verifyCodeField))
                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.BASELINE)
                        .addComponent(launchButton)
                        .addComponent(messageLabel))
        );

        layout.linkSize(SwingConstants.HORIZONTAL, accessCodeLabel, verifyCodeLabel);

        return result;
    }

    public class FetchIntroMessage extends SwingWorker<String, String> {
        @Override
        protected String doInBackground() throws Exception {
            publish("Fetching intro text from " + rpcHost.toHostString());
            SystemInfo info = rpcTemplate.fetchSystemInfo(rpcHost);
            return info.getIntroText();
        }

        @Override
        protected void process(List<String> messages) {
            for (String message : messages) {
                messageLabel.setText(message);
            }
        }

        @Override
        protected void done() {
            if (!this.isCancelled()) {
                try {
                    welcomeText.setText(this.get());
                    messageLabel.setText(null);
                } catch (InterruptedException e) {
                    messageLabel.setText(e.getMessage());
                } catch (ExecutionException e) {
                    messageLabel.setText(e.getMessage());
                }
            }
        }
    }

    public class LaunchHMP extends SwingWorker<URI, String> {
        @Override
        protected URI doInBackground() throws Exception {
            launchButton.setEnabled(false);

            publish("Fetching App Handle");
            RpcResponse response = rpcTemplate.execute(rpcHost, null, String.valueOf(accessCodeField.getPassword()), String.valueOf(verifyCodeField.getPassword()), null, "XUS GET TOKEN");
            String appHandle = response.toString();

            publish("Building SSO URI");
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString("https://localhost:8443/j_cprs_sso_spring_security_check");
            builder.queryParam("S", rpcHost.getHostname());
            builder.queryParam("P", rpcHost.getPort());
            builder.queryParam("U", response.getDUZ());
            builder.queryParam("H", appHandle);

            URI uri = builder.build().toUri();
            publish("Launching HMP");
            Desktop.getDesktop().browse(uri);
            return uri;
        }

        @Override
        protected void process(List<String> messages) {
            for (String message : messages) {
                messageLabel.setText(message);
            }
        }

        @Override
        protected void done() {
            launchButton.setEnabled(true);
            if (!this.isCancelled()) {
                messageLabel.setText("Launched HMP");
            } else {
                messageLabel.setText("Cancelled Launch");
            }
        }
    }

    public static void main(String[] args) {
        CprsSsoTester dialog = new CprsSsoTester();
        dialog.pack();
        dialog.setVisible(true);
    }
}
