package rs.ac.uns.ftn.minizanzibar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AclDTO {
    private String user;
    private String relation;
    private String object;

    public String getLevelDBKey() {
        return user + "-" + object;
    }
}
