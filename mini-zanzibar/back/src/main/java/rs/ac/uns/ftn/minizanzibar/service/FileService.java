package rs.ac.uns.ftn.minizanzibar.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import rs.ac.uns.ftn.minizanzibar.dto.AclDTO;
import rs.ac.uns.ftn.minizanzibar.dto.AuthorizedDTO;
import rs.ac.uns.ftn.minizanzibar.dto.PostDTO;
import rs.ac.uns.ftn.minizanzibar.model.Post;

import java.util.*;

@Service
public class FileService {
    private final Map<String, List<Post>> userPosts;
    private final List<Post> allPosts;
    private final Map<String, List<Post>> sharedPostsForUser;
    private final MessageSource messageSource;
    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;


    public FileService(MessageSource messageSource, WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.messageSource = messageSource;
        this.webClientBuilder = webClientBuilder;
        this.objectMapper = objectMapper;
        this.userPosts = new HashMap<>();
        this.sharedPostsForUser = new HashMap<>();
        this.allPosts = new ArrayList<>();
    }

    public void savePost(PostDTO post, String user) {
        try{
            Post newPost = new Post((long)(this.allPosts.size() + 1), post.getFilename(), post.getTags());
            this.allPosts.add(newPost);
            AclDTO acl = new AclDTO(user,"owner","doc:" + newPost.getId());
            String jsonPayload = objectMapper.writeValueAsString(acl);
            webClientBuilder.build()
                    .post()
                    .uri("http://localhost:8081/api/auth")
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .body(Mono.just(jsonPayload), String.class)
                    .retrieve().bodyToMono(ObjectMapper.class).subscribe();
            if(this.userPosts.containsKey(user))
                this.userPosts.get(user).add(newPost);
            else this.userPosts.put(user, List.of(newPost));
        }
        catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException();
        }
    }

    public void modifyPost(PostDTO post, String user, Long id) {
        Optional<Post> toModify = this.allPosts.stream()
                .filter(obj -> obj.getId().equals(id))
                .findFirst();
        if(toModify.isPresent()) {
            AuthorizedDTO response = getShareACL(user, "editor","doc:" + id);
                if (Boolean.parseBoolean(response.getAuthorized())) {
                    Post postToModify = toModify.get();
                    postToModify.setFilename(post.getFilename());
                    postToModify.setTags(post.getTags());
                }
                else {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, messageSource.getMessage("post.insufficientRole", null, Locale.getDefault()));
                }
            }
        else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, messageSource.getMessage("post.notFound", null, Locale.getDefault()));
        }
    }

    public List<Post> getUserPosts(String user) {
        return this.userPosts.getOrDefault(user, new ArrayList<>());
    }

    public List<Post> getUserSharedPosts(String user) {
        return this.sharedPostsForUser.getOrDefault(user, new ArrayList<>());
    }


    public void shareAccess(AclDTO acl) {
        try {
            Optional<Post> post = this.allPosts.stream()
                    .filter(obj -> obj.getId().equals(Long.parseLong(acl.getObject().split(":")[1])))
                    .findFirst();

            if(post.isPresent()) {
                String jsonPayload = objectMapper.writeValueAsString(acl);
                webClientBuilder.build()
                        .post()
                        .uri("http://localhost:8081/api/auth")
                        .header(HttpHeaders.CONTENT_TYPE, "application/json")
                        .body(Mono.just(jsonPayload), String.class)
                        .retrieve().bodyToMono(ObjectMapper.class).subscribe();
                if(this.sharedPostsForUser.containsKey(acl.getUser()))
                    this.sharedPostsForUser.get(acl.getUser()).add(post.get());
                else this.sharedPostsForUser.put(acl.getUser(), List.of(post.get()));
            }
            else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, messageSource.getMessage("post.notFound", null, Locale.getDefault()));
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException();
        }
    }

    public AuthorizedDTO getShareACL(String user, String role, String object) {
        String uri = user + "-" + role + "-" + object;
        return webClientBuilder.build()
                .get()
                .uri("http://localhost:8081/api/auth/" + uri)
                .header(HttpHeaders.CONTENT_TYPE, "application/json")
                .retrieve()
                .bodyToMono(AuthorizedDTO.class).block();
    }

}
