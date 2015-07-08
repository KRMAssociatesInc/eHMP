package gov.va.hmp.web.servlet.filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Hello world!
 */
public class LocalAddrFilter implements Filter {
    /**
     * The HTTP response status code that is used when rejecting denied
     * request. It is 403 by default, but may be changed to be 404.
     */
    protected int denyStatus = HttpServletResponse.SC_FORBIDDEN;

    /**
     * Return response status code that is used to reject denied request.
     */
    public int getDenyStatus() {
        return denyStatus;
    }


    /**
     * Set response status code that is used to reject denied request.
     */
    public void setDenyStatus(int denyStatus) {
        this.denyStatus = denyStatus;
    }


    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // NOOP
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        // make sure we are dealing with HTTP
        if (req instanceof HttpServletRequest) {
            HttpServletRequest request = (HttpServletRequest) req;
            HttpServletResponse response = (HttpServletResponse) res;

            if (!isAllowed(request.getRemoteAddr())) {
                denyRequest(request, response);
                return;
            }
        }
        chain.doFilter(req, res);
    }

    @Override
    public void destroy() {
        // NOOP
    }


    protected boolean isAllowed(String remoteAddr) {
        if (remoteAddr == null || remoteAddr.length() == 0) return false;
        return remoteAddr.equals("127.0.0.1") || remoteAddr.equals(getLocalAddr());
    }

    /**
     * Reject the request that was denied by this filter.
     *
     * @param request  The servlet request to be processed
     * @param response The servlet response to be processed
     * @throws IOException      if an input/output error occurs
     * @throws ServletException if a servlet error occurs
     */
    protected void denyRequest(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {
        response.sendError(denyStatus);
    }

    /**
     * Returns the current local IP address or null in error case /
     * when no network connection is up.
     * <p/>
     * If you want just one IP, this is the right method and it tries to find
     * out the most accurate (primary) IP address. It prefers addresses that
     * have a meaningful dns name set for example.
     *
     * @return Returns the current local IP address or null in error case.
     */
    public static String getLocalAddr() {

        //// This method does not work any more - I think on Windows it worked by accident
        //try
        //{
        //    String ip = InetAddress.getLocalHost().getHostAddress();
        //    return ip;
        //}
        //catch (UnknownHostException ex)
        //{
        //    Logger.getLogger(Net.class.getName()).log(Level.WARNING, null, ex);
        //    return "";
        //}
        String ipOnly = null;
        try {
            Enumeration<NetworkInterface> nifs = NetworkInterface.getNetworkInterfaces();
            if (nifs == null) return "";
            while (nifs.hasMoreElements()) {
                NetworkInterface nif = nifs.nextElement();
                // We ignore subinterfaces - as not yet needed.

                if (!nif.isLoopback() && nif.isUp() && !nif.isVirtual()) {
                    Enumeration<InetAddress> adrs = nif.getInetAddresses();
                    while (adrs.hasMoreElements()) {
                        InetAddress adr = adrs.nextElement();
                        if (adr != null && !adr.isLoopbackAddress() && (nif.isPointToPoint() || !adr.isLinkLocalAddress())) {
                            String adrIP = adr.getHostAddress();
                            String adrName;
                            if (nif.isPointToPoint()) // Performance issues getting hostname for mobile internet sticks
                                adrName = adrIP;
                            else
                                adrName = adr.getCanonicalHostName();

                            if (!adrName.equals(adrIP))
                                return adrIP;
                            else
                                ipOnly = adrIP;
                        }
                    }
                }
            }
            if (ipOnly.length() == 0)
                Logger.getLogger(LocalAddrFilter.class.getName()).log(Level.WARNING, "No IP address available");
            return ipOnly;
        } catch (SocketException ex) {
            Logger.getLogger(LocalAddrFilter.class.getName()).log(Level.WARNING, "No IP address available", ex);
            return null;
        }
    }
}
