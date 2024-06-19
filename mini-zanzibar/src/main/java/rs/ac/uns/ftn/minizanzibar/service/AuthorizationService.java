package rs.ac.uns.ftn.minizanzibar.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.util.InternalException;
import org.springframework.stereotype.Service;
import rs.ac.uns.ftn.minizanzibar.dto.AclDTO;

import java.util.List;
import java.util.Map;
import java.util.logging.Logger;


@Service
public class AuthorizationService {
    private final LevelDBService levelDBService;
    private final ConsulDBService consulDBService;
    private final Logger logger = Logger.getLogger(AuthorizationService.class.getName());
    private final ObjectMapper objectMapper;

    public AuthorizationService(LevelDBService levelDBService,
                                ConsulDBService consulDBService,
                                ObjectMapper objectMapper) {
        this.levelDBService = levelDBService;
        this.consulDBService = consulDBService;
        this.objectMapper = objectMapper;
    }

    public void setRelation(AclDTO aclDTO) {
//        logger.info("Setting relation for user: " + aclDTO.getUser() + ", relation: " + aclDTO.getRelation() + ", object: " + aclDTO.getObject());
        levelDBService.put(aclDTO.getLevelDBKey(), aclDTO.getRelation());
    }

    private boolean checkAlternateRelations(String user, String relation, String object, Map<String, List<String>> config, String actualRelation) {
        List<String> alternateRelations = config.get(relation);
        if (alternateRelations == null) {
            logger.info("No alternate relations found for relation: " + relation);
            return false;
        }

        for (String alternateRelation : alternateRelations) {
            logger.info("Checking alternate relation: " + alternateRelation);
            if (alternateRelation.equals(actualRelation)) {
                logger.info("Alternate relation found: " + alternateRelation + " for user: " + user + ", object: " + object);
                return true;
            }

            if (checkAlternateRelations(user, alternateRelation, object, config, actualRelation)) {
                return true;
            }
        }

        logger.info("No alternate relations found for user: " + user + ", object: " + object);
        return false;
    }

    public boolean checkRelation(String user, String relation, String object) {
        logger.info("Checking relation for user: " + user + ", relation: " + relation + ", object: " + object);

        String[] parts = object.split(":");
        if (parts.length != 2) {
            throw new IllegalArgumentException("Object must be in format namespace:object");
        }

        String actualRelation = levelDBService.get(user + "-" + object);
        logger.info("Actual relation: " + actualRelation);
        if (actualRelation == null) {
            return false;
        }
        if (actualRelation.equals(relation)) {
            return true;
        }

        String namespace = parts[0];

        logger.info("Checking alternate relations. Namespace: " + namespace + ", object: " + parts[1]);

        String configString = consulDBService.get(namespace);
        Map<String, List<String>> config;

        try {
            config = objectMapper.readValue(configString, new TypeReference<>() {});
        } catch (Exception e) {
            e.printStackTrace();
            throw new InternalException("Error parsing namespace config");
        }

        return checkAlternateRelations(user, relation, object, config, actualRelation);
    }

    public boolean saveNamespaceConfig(String namespace, String config) {
        return consulDBService.put(namespace, config);
    }

    public String getNamespaceConfig(String namespace) {
        return consulDBService.get(namespace);
    }
}
