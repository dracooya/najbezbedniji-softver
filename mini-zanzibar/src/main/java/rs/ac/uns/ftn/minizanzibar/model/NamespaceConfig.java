package rs.ac.uns.ftn.minizanzibar.model;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class NamespaceConfig {
    @NotNull(message = "{relations.notnull}")
    private Map<String, List<String>> relations;
}
