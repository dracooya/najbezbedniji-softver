package rs.ac.uns.ftn.minizanzibar.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import rs.ac.uns.ftn.minizanzibar.dto.NamespaceConfig;
import rs.ac.uns.ftn.minizanzibar.dto.PostDTO;
import rs.ac.uns.ftn.minizanzibar.model.Post;

import java.util.*;

@Service
public class FileService {
    private final Map<String, List<Post>> userPosts;
    private final Map<String, List<Post>> sharedPostsForUser;
    private final MessageSource messageSource;
    private final WebClient.Builder webClientBuilder;
    private ObjectMapper objectMapper;

    private void initializeNamespaceConfig() {
        NamespaceConfig config = new NamespaceConfig(new HashMap<>());
        config.getRelations().put("owner",new ArrayList<>());
        config.getRelations().put("editor", List.of("owner"));
        config.getRelations().put("viewer", List.of("editor"));
        try {
            String jsonPayload = objectMapper.writeValueAsString(config);
            webClientBuilder.build()
                    .post()
                    .uri("http://localhost:8080/api/auth/namespace/doc")
                    .body(Mono.just(jsonPayload), String.class)
                    .retrieve();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException();
        }

    }

    public FileService(MessageSource messageSource, WebClient.Builder webClientBuilder) {
        this.messageSource = messageSource;
        this.webClientBuilder = webClientBuilder;
        this.userPosts = new HashMap<>();
        this.sharedPostsForUser = new HashMap<>();
        this.initializeNamespaceConfig();
    }

    public void savePost(PostDTO post, String user) {
        if(this.userPosts.containsKey(user))
            this.userPosts.get(user).add(new Post((long)(this.userPosts.get(user).size() + 1),
                post.getFilename(),
                post.getTags()));
        else this.userPosts.put(user, List.of(new Post(1L, post.getFilename(), post.getTags())));
    }

    public void modifyPost(PostDTO post, String user, Long id) {
        List<Post> userPosts = this.userPosts.get(user);
        Optional<Post> toModify = userPosts.stream()
                .filter(obj -> obj.getId().equals(id))
                .findFirst();
        if(toModify.isPresent()) {
            Post postToModify = toModify.get();
            postToModify.setFilename(post.getFilename());
            postToModify.setTags(post.getTags());
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


    

}
