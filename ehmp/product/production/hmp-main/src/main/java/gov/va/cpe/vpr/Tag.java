package gov.va.cpe.vpr;

import java.util.HashSet;
import java.util.Set;

public class Tag {
	private Long id;
	private Long version;
	private String tagName;
	private Set<Tagger> taggers;

    public void addToTaggers(Tagger tagger) {
        if (taggers == null) {
        	taggers = new HashSet<Tagger>();
        }
        taggers.add(tagger);
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	public String getTagName() {
		return tagName;
	}

	public void setTagName(String tagName) {
		this.tagName = tagName;
	}

	public Set<Tagger> getTaggers() {
		return taggers;
	}

	public void setTaggers(Set<Tagger> taggers) {
		this.taggers = taggers;
	}

	// TODO - delete when checked.
	// static belongsTo = Tagger
	// static hasMany = [taggers:Tagger]
	//
	// static constraints = {
	// tagName(nullable: true)
	// }
}
