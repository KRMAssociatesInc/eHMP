package gov.va.hmp.ptselect;

import gov.va.hmp.vista.rpc.LineMapper;
import gov.va.hmp.vista.util.VistaStringUtils;

/**
 * {@link gov.va.hmp.vista.rpc.LineMapper} that picks out a pariticular piece of each line of a VistA RPC response.
 */
public class PieceLineMapper implements LineMapper<String> {
    private final int piece;

    public PieceLineMapper(int piece) {
        this.piece = piece;
    }

    @Override
    public String mapLine(String line, int lineNum) {
        return VistaStringUtils.piece(line, piece);
    }
}
