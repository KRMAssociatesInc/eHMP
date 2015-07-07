package gov.va.cpe.team;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import gov.va.cpe.odc.Person;
import gov.va.cpe.vpr.pom.DraftablePOMObject;
import gov.va.cpe.vpr.pom.JSONViews;
import gov.va.cpe.vpr.queryeng.dynamic.ViewDefDef;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

public class Team extends DraftablePOMObject {

    public static final String TEAM_PERSONS_LINK_JDS_TEMPLATE = "rel;team-people-link";

    private String displayName;
    private String description;
    private String ownerUid;
    private String ownerName;
    private Integer rosterId;
    private List<Category> categories;
	private List<StaffAssignment> staff;
	private Map<String, Object> draft;

	public Team() {
        super(null);
    }

    public Team(Map<String, Object> vals) {
        super(vals);
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    public String getOwnerUid() {
        return ownerUid;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public List<Category> getCategories() {
		return categories;
	}
    
    public Map<String, Object> getDraft() {
		return draft;
	}

    public Integer getRosterId() {
        return rosterId;
    }

    @JsonView(JSONViews.WSView.class)
    public Integer getTotalStaff() {
       if (staff == null) return -1;
       return staff.size();
    }

    public List<StaffAssignment> getStaff() {
        return staff;
    }

    @Override
    public String getSummary() {
        return getDisplayName();
    }

    public static class StaffAssignment implements Serializable {
        private TeamPosition position = new TeamPosition();
        private Person person = new Person();
        private ViewDefDef board = new ViewDefDef();
		public StaffAssignment(TeamPosition position, Person person) {
            this.position = position;
            this.person = person;
        }

        @JsonCreator
        public StaffAssignment(Map<String, Object> vals) {
            this.position.setData("uid", vals.get("positionUid"));
            this.position.setData("name", vals.get("positionName"));

            if (vals.get("person") != null) {
                this.person.setData((Map) vals.get("person"));
            } else {
                this.person.setData("uid", vals.get("personUid"));
            }

            this.board.setData("uid", vals.get("boardUid"));
            this.board.setData("name", vals.get("boardName"));
        }

        @JsonIgnore
        public TeamPosition getPosition() {
            return position;
        }

        @JsonView(JSONViews.WSView.class)
        public Person getPerson() {
            return person;
        }

        @JsonIgnore
        public ViewDefDef getBoard() {
            return board;
        }

        public String getPositionUid() {
            return position.getUid();
        }

        public String getPositionName() {
            return position.getName();
        }

        public String getPersonUid() {
            return person.getUid();
        }

//        public String getPersonName() {
//            return person.getName();
//        }

        public String getBoardUid() {
            return board.getUid();
        }

        public String getBoardName() {
            return board.getName();
        }

        public void setBoard(ViewDefDef board) {
			this.board = board;
		}

//        @JsonView(JSONViews.WSView.class)
//        public String getPersonPhotoHref() {
//            if (!StringUtils.hasText(person.getUid())) return null;
//            return "/person/v1/" + person.getUid() + "/photo"; // TODO: use link generator or some other decorator during serialization?
//        }
    }
}
