@search_suggestion @debug
Feature: F119 As a consumer of the search service, I need to see suggestions after 3 letters typed by the user (Same as HMP service)

Background:
      #Given a patient with pid "10110V004877" has been synced through the RDK API
      Given a patient with pid "10108V420871" has been synced through the RDK API
      


@F119_1_searchsuggestion @VPR 
Scenario Outline: When a user searches patient's medication by text search total number of records are returned.
#Given a patient with "this medication exists" in multiple VistAs
When the user types three letters of "<text>" for the patient "10108V420871" in VPR format
Then the corresponding total suggested items are "<total_items>"


       Examples: 
      | text                            | total_items |
      | patient movement                | 2           |
      | diagnosis                       | 2           |
      | Conditions                      | 1           |
      | Allergies                       | 1           |
      | Ad liv                          | 2           |
      | Arterial line                   | 2           |
      | Venous                          | 3           |
      | Suction                         | 2           |
      | Chest PT                        | 1           |
      | Cold packs                      | 1           |
      | Skin&wounds                     | 2           |
      | Cold packs                      | 1           |
      | Ventilator                      | 1           |
      | TPR                             | 1           |
      | TEMP                            | 2           |
      | DIETS                           | 1           |
      | Regular diets                   | 1           |
      | NPO                             | 2           |
      | AMPICILLIN INJ                  | 2           |
      | AMINO ACIDS INJ                 | 2           |
      | MAMMOGRAM BILAT                 | 2           |
      | MAMMOGRAM UNILAT                | 1           |
      | CHEST TWO VIEWS                 | 1           |
      | CHEST XRAY                      | 2           |
      | CHEM 7                          | 4           |
      | CBC                             | 22          |
      | GLUCOSE                         | 21          |
      | LABORATORY                      | 5           |
      | SUGAR                           | 3           |
      | Consult                         | 5           |
      | PULMONARY                       | 2           |
      | BONE MARROW BIOPSY AND ASPIRATE | 2           |
      | ANGIOPLASTY                     | 1           |
      | PULMONARY CONSULT               | 2           |
      | ARTERIAL LEAD                   | 2           |
      | LAPAROSCOPY                     | 1           |
      | LARYNGOSCOPY                    | 1           |
      | LAVAGE                          | 1           |
      | Problems                        | 1           |
      | Diabetes                        | 2           |
      | Heart Attach                    | 2           |
      | CONGESTIVE HEART FAILURE        | 1           |
      | HEADACHE                        | 2           |
      | Vital                           | 5           |
      | order                           | 6           |
      | Accession                       | 2           |





      



