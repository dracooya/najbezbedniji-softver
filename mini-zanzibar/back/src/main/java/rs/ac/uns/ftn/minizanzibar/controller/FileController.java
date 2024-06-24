package rs.ac.uns.ftn.minizanzibar.controller;


import jakarta.validation.Valid;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import rs.ac.uns.ftn.minizanzibar.dto.PostDTO;
import rs.ac.uns.ftn.minizanzibar.service.FileService;

import java.util.Locale;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/post")
public class FileController {

    private final FileService fileService;
    private final MessageSource messageSource;

    public FileController(FileService fileService, MessageSource messageSource) {
        this.fileService = fileService;
        this.messageSource = messageSource;
    }

    @PostMapping(path = "/{user}", consumes = "application/json")
    public ResponseEntity<?> savePost(@PathVariable String user, @RequestBody @Valid PostDTO post) {
        fileService.savePost(post,user);
        return new ResponseEntity<>(messageSource.getMessage("post.saved", null, Locale.getDefault()), HttpStatus.OK);
    }

    @PutMapping(path = "/{user}/{id}", consumes = "application/json")
    public ResponseEntity<?> modifyPost(@PathVariable String user, @PathVariable Long id, @RequestBody @Valid PostDTO post) {
        try {
            fileService.modifyPost(post,user,id);
            return new ResponseEntity<>(messageSource.getMessage("post.edited", null, Locale.getDefault()), HttpStatus.OK);
        } catch (ResponseStatusException ex) {
            return new ResponseEntity<>(ex.getReason(), ex.getStatusCode());
        }
    }

    @GetMapping(path="/{user}")
    public ResponseEntity<?> getUserPosts(@PathVariable String user) {
        return new ResponseEntity<>(fileService.getUserPosts(user), HttpStatus.OK);
    }

    @GetMapping(path="/shared/{user}")
    public ResponseEntity<?> getUserSharedPosts(@PathVariable String user) {
        return new ResponseEntity<>(fileService.getUserSharedPosts(user), HttpStatus.OK);
    }
}
