package gov.va.cpe.vpr;

import java.util.List;
import java.util.Set;

public class Tagger {
	private Long id;
	private Long version;
    private String userName;
    private String url;
    private Set tags;

    
//    static hasMany = [tags:Tag]
//
//    static constraints = {
//        userName (nullable: true)
//        url (nullable: true)
//    }
//
//    static mapping = {
//        tags lazy: false
//    }
    
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


	public String getUserName() {
		return userName;
	}


	public void setUserName(String userName) {
		this.userName = userName;
	}


	public String getUrl() {
		return url;
	}


	public void setUrl(String url) {
		this.url = url;
	}


	public Set getTags() {
		return tags;
	}


	public void setTags(Set tags) {
		this.tags = tags;
	}


	public static List getDomainTags(String url) {
//        List tagger = Tagger.findAllByUrl(url).toList();
//         return tagger
    	return null;
    	//TODO - fix this		
    }
    
//    static namedQueries = {
//        forUser {String user ->
//            eq("user", user)
//        }
//
//    }
}
