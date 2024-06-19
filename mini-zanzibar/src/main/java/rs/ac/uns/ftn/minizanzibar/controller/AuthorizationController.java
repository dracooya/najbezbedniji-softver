package rs.ac.uns.ftn.minizanzibar.controller;

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

    public AuthorizationController(AuthorizationService authorizationService) {
        this.authorizationService = authorizationService;
    }

    @PutMapping(consumes = "application/json")
    public ResponseEntity<?> saveRelation(@RequestBody AclDTO aclDTO) {
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


    @PutMapping(value = "/namespace/{namespace}", consumes = "application/json")
    public ResponseEntity<?> saveNamespaceConfig(@PathVariable String namespace,
                                                 @Valid @RequestBody NamespaceConfig config) throws ConstraintViolationException {
        logger.info("Namespace: " + namespace + ", config: " + config.getRelations().toString());
        if (authorizationService.saveNamespaceConfig(namespace, config.getRelations().toString())) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/namespace/{namespace}")
    public ResponseEntity<?> getNamespaceConfig(@PathVariable String namespace) {
        if (authorizationService.getNamespaceConfig(namespace) != null) {
            return ResponseEntity.ok(authorizationService.getNamespaceConfig(namespace));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
