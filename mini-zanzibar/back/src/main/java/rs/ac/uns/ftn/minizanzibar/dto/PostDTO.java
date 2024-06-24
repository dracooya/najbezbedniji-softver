package rs.ac.uns.ftn.minizanzibar.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;
import rs.ac.uns.ftn.minizanzibar.model.Tag;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {

    @NotBlank(message = "{required}")
    @Length(min = 1, max = 255, message = "{minmax}")
    private String filename;
    @NotNull(message = "{missing}")
    private List<Tag> tags;
}
