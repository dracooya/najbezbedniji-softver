package rs.ac.uns.ftn.minizanzibar.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rs.ac.uns.ftn.minizanzibar.dto.AclDTO;
import rs.ac.uns.ftn.minizanzibar.dto.AuthorizedDTO;
import rs.ac.uns.ftn.minizanzibar.model.NamespaceConfig;
import rs.ac.uns.ftn.minizanzibar.service.AuthorizationService;

import java.util.logging.Logger;

@RestController
@RequestMapping("/api/auth")
public class AuthorizationController {
    private final AuthorizationService authorizationService;
    private final Logger logger = Logger.getLogger(AuthorizationController.class.getName());
    private final ObjectMapper objectMapper;

    public AuthorizationController(AuthorizationService authorizationService,
                                   ObjectMapper objectMapper) {
        this.authorizationService = authorizationService;
        this.objectMapper = objectMapper;
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<?> saveRelation(@RequestBody @Valid AclDTO aclDTO) {
        authorizationService.setRelation(aclDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{user}-{relation}-{object}")
    public ResponseEntity<AuthorizedDTO> checkRelation(
            @PathVariable String user,
            @PathVariable String relation,
            @PathVariable String object) {
        return ResponseEntity.ok(new AuthorizedDTO(
                String.valueOf(authorizationService.checkRelation(user, relation, object))));
    }


    @PostMapping(value = "/namespace/{namespace}", consumes = "application/json")
    public ResponseEntity<?> saveNamespaceConfig(@PathVariable String namespace,
                                                 @Valid @RequestBody NamespaceConfig config) throws ConstraintViolationException {
        logger.info("Namespace: " + namespace + ", config: " + config.getRelations().toString());
        try {
            if (authorizationService.   saveNamespaceConfig(namespace, objectMapper.writeValueAsString(config.getRelations()))) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // For demo purposes
    @GetMapping("/namespace/{namespace}")
    public ResponseEntity<?> getNamespaceConfig(@PathVariable String namespace) {
        if (authorizationService.getNamespaceConfig(namespace) != null) {
            return ResponseEntity.ok(authorizationService.getNamespaceConfig(namespace));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
