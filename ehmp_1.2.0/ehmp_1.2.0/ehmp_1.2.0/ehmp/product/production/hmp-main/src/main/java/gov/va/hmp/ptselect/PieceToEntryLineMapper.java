package gov.va.hmp.ptselect;

import gov.va.hmp.vista.rpc.LineMapper;
import gov.va.hmp.vista.util.VistaStringUtils;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

import java.util.*;

/**
 * {@link gov.va.hmp.vista.rpc.LineMapper} that turns each line of a VistA RPC response into a Map instance based on the
 * supplied Map of piece numbers to key names.
 */
public class PieceToEntryLineMapper implements LineMapper<Map<String, String>> {

    public static final Map<Integer,String> NAMED_VALUE_PIECE_TO_KEY_NAMES = new HashMap<Integer,String>();
    static {
        NAMED_VALUE_PIECE_TO_KEY_NAMES.put(1, "localId");
        NAMED_VALUE_PIECE_TO_KEY_NAMES.put(2, "name");
    }

    private Map<Integer, String> pieceNumbersToKeyNames;
    private Set<Integer> piecesToNameCase;

    public PieceToEntryLineMapper() {
        this(NAMED_VALUE_PIECE_TO_KEY_NAMES, new HashSet(Arrays.asList(2)));
    }

    public PieceToEntryLineMapper(final Map<Integer, String> pieceNumbersToKeyNames) {
        this(pieceNumbersToKeyNames, Collections.<Integer>emptySet());
    }

    public PieceToEntryLineMapper(final Map<Integer, String> pieceNumbersToKeyNames, final Set<Integer> piecesToNameCase) {
        Assert.notNull(pieceNumbersToKeyNames);
        Assert.notNull(piecesToNameCase);
        this.pieceNumbersToKeyNames = pieceNumbersToKeyNames;
        this.piecesToNameCase = piecesToNameCase;
    }

    @Override
    public Map<String, String> mapLine(String line, int lineNum) {
        Map<String, String> obj = new HashMap<String, String>();
        for (Map.Entry<Integer, String> p2k : pieceNumbersToKeyNames.entrySet()) {
            Integer piece = p2k.getKey();
            String val = VistaStringUtils.piece(line, piece);
            obj.put(p2k.getValue(), val);
            if (piecesToNameCase.contains(piece)) {
                String nameCasedName = "display" + StringUtils.capitalize(p2k.getValue());
                obj.put(nameCasedName, VistaStringUtils.nameCase(val));
            }
        }
        return obj;
    }
}
