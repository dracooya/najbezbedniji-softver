package rs.ac.uns.ftn.minizanzibar.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthorizationController {

    public AuthorizationController() {
        super();
    }

    @GetMapping("/yes")
    public String yes() {
        return "yes";
    }
}
