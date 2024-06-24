package rs.ac.uns.ftn.minizanzibar;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import rs.ac.uns.ftn.minizanzibar.dto.NamespaceConfig;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@SpringBootApplication
public class BackApplication {
    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    public BackApplication(WebClient.Builder webClientBuilder,
                           ObjectMapper objectMapper) {
        this.webClientBuilder = webClientBuilder;
        this.objectMapper = objectMapper;
        initializeNamespaceConfig();
    }

    private void initializeNamespaceConfig() {
        NamespaceConfig config = new NamespaceConfig(new HashMap<>());
        config.getRelations().put("owner",new ArrayList<>());
        config.getRelations().put("editor", List.of("owner"));
        config.getRelations().put("viewer", List.of("editor"));
        try {
            String jsonPayload = objectMapper.writeValueAsString(config);
            webClientBuilder.build()
                    .post()
                    .uri("http://localhost:8081/api/auth/namespace/doc")
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .body(Mono.just(jsonPayload), String.class)
                    .retrieve().bodyToMono(ObjectMapper.class).subscribe();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException();
        }

    }

    public static void main(String[] args) {
        SpringApplication.run(BackApplication.class, args);
    }

}
