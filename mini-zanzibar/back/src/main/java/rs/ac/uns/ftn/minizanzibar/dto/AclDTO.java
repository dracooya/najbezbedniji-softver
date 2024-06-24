package rs.ac.uns.ftn.minizanzibar.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AclDTO {
    @NotEmpty(message = "{user.notempty}")
    private String user;
    @NotEmpty(message = "{relation.notempty}")
    private String relation;
    @NotEmpty(message = "{object.notempty}")
    private String object;

}
