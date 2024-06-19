package rs.ac.uns.ftn.minizanzibar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rs.ac.uns.ftn.minizanzibar.dto.AclDTO;
import rs.ac.uns.ftn.minizanzibar.dto.AuthorizedDTO;
import rs.ac.uns.ftn.minizanzibar.service.AuthorizationService;

@RestController
@RequestMapping("/api/auth")
public class AuthorizationController {
    private final AuthorizationService authorizationService;

    public AuthorizationController(AuthorizationService authorizationService) {
        this.authorizationService = authorizationService;
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<?> addRelation(@RequestBody AclDTO aclDTO) {
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
}
