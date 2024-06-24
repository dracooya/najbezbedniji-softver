package rs.ac.uns.ftn.minizanzibar.model;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tag {

    @NotBlank(message = "{required}")
    @Length(min = 1, max = 100, message = "{minmax}")
    private String name;

    @NotBlank(message = "{required}")
    @Length(min = 1, max = 100, message = "{minmax}")
    private String value;
}
