package us.vistacore.asu.dao;

/**
 * Simple class that uses Jacksons Views mechanism to define categories
 * of properties that can be serialized.
 * 
 * By default all properties are serialized, if you specifiy one of these classes then
 * the field/method will only be included if the specific view was requested
 * 
 */
public class JSONViews {
	/**
	 * Marker class for fields that should be sent to Solr for indexing.
	 * 
	 * Only a small subset of fields are indexed in Solr currently
	 */
	public static class SolrView extends JSONViews {}
	
	/**
	 * Marker class for fields that should be serialized for storage
	 * 
	 * There are some interesting situations where some values (like age) might not be
	 * appropriate to store in database (long term)
	 */
	public static class JDBView extends JSONViews {}
	
	/**
	 * Marker class for fields that should only be sent for web-service requests
	 * 
	 * For web service calls, we tend to send everything (including business logic).
	 */
	public static class WSView extends JSONViews {} 
	
	/**
	 * Marker class for helping to figure out which fields might have changed.
	 * 
	 * When we generate events, we want to ignore some fields (like summary) which we know
	 * will change and aren't really what we want to include in change events
	 */
	public static class EventView extends JSONViews {}
}