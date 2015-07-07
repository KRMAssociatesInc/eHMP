package gov.va.hmp.vista.rpc;

import org.springframework.dao.DataAccessException;

import java.util.ArrayList;
import java.util.List;

/**
 * Adapter implementation of the RpcResponseExtractor interface that delegates
 * to a LineMapper which is supposed to create an object for each line of the response.
 * Each object is added to the results List of this RpcResponseExtractor.
 * <p/>
 * <p>Useful for the case of one object per line of an RPC response.
 * The number of entries in the results list will match the number of lines.
 * <p/>
 * <p>Note that a LineMapper object is typically stateless and thus reusable;
 * just the LineMapperRpcResponseExtractor adapter is stateful.
 * <p/>
 * <p>A usage example with RpcTemplate:
 * <p/>
 * <pre class="code">RpcTemplate rpcTemplate = new RpcTemplate(connectionFactory);  // reusable object
 * LineMapper lineMapper = new UserRowMapper();  // reusable object
 * <p/>
 * List allUsers = (List) rpcTemplate.execute(lineMapper, 
 * "select * from user",
 * new RowMapperResultSetExtractor(rowMapper, 10));
 * <p/>
 * User user = (User) jdbcTemplate.queryForObject(
 * "select * from user where id=?", new Object[] {id},
 * new RowMapperResultSetExtractor(rowMapper, 1));</pre>
 *
 * @see LineMapper
 * @see RpcTemplate
 */
public class LineMapperRpcResponseExtractor<T> implements RpcResponseExtractor<List<T>> {

    private final LineMapper<T> lineMapper;
    private final int linesExpected;

    /**
     * Create a new LineMapperRpcResponseExtractor.
     *
     * @param lineMapper the LineMapper which creates an object for each line
     */
    public LineMapperRpcResponseExtractor(LineMapper<T> lineMapper) {
        this(lineMapper, 0);
    }

    /**
     * Create a new LineMapperRpcResponseExtractor.
     *
     * @param lineMapper    the LineMapper which creates an object for each line
     * @param linesExpected the number of expected lines
     *                      (just used for optimized collection handling)
     */
    public LineMapperRpcResponseExtractor(LineMapper<T> lineMapper, int linesExpected) {
        this.lineMapper = lineMapper;
        this.linesExpected = linesExpected;
    }

    @Override
    public List<T> extractData(RpcResponse response) throws DataAccessException {
        List<T> results = (this.linesExpected > 0 ? new ArrayList<T>(this.linesExpected) : new ArrayList<T>());
        if (response.length() > 0) {
            String[] lines = response.toLines();
            for (int i = 0; i < lines.length; i++) {
                results.add(lineMapper.mapLine(lines[i], i));
            }
        }
        return results;
    }
}
