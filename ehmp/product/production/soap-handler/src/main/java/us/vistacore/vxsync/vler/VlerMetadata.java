package us.vistacore.vxsync.vler;

import java.util.ArrayList;
import java.util.List;

public class VlerMetadata {

    /**
     * home community identifier.
     */
    private String homeCommunityId;
    /**
     * repository Unique identifier.
     */
    private String repositoryUniqueId;
    /**
     * document unique identifier.
     */
    private String documentUniqueId;
    /**
     * document mime type.
     */
    private String mimeType;
    /**
     * document name
     */
    private String name;
    /**
     * document author list.
     */
    private List<Author> authorList;
    /**
     * document creation date.
     */
    private String creationTime;

    /**
     * document source Patient ID.
     */
    private String sourcePatientId;


    public VlerMetadata() {
    }

    public String getHomeCommunityId() {
        return homeCommunityId;
    }

    public void setHomeCommunityId(String homeCommunityId) {
        this.homeCommunityId = homeCommunityId;
    }

    public String getRepositoryUniqueId() {
        return repositoryUniqueId;
    }

    public void setRepositoryUniqueId(String repositoryUniqueId) {
        this.repositoryUniqueId = repositoryUniqueId;
    }

    public String getDocumentUniqueId() {
        return documentUniqueId;
    }

    public void setDocumentUniqueId(String documentUniqueId) {
        this.documentUniqueId = documentUniqueId;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Author> getAuthorList() {

        if (authorList == null) {
            authorList = new ArrayList<>();
        }

        return authorList;
    }

    public String getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(String creationTime) {
        this.creationTime = creationTime;
    }

    public String getSourcePatientId() {
        return sourcePatientId;
    }

    public void setSourcePatientId(String sourcePatientId) {
        this.sourcePatientId = sourcePatientId;
    }
}
