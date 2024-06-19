package rs.ac.uns.ftn.minizanzibar.service;

import org.springframework.stereotype.Service;
import rs.ac.uns.ftn.minizanzibar.dto.AclDTO;

import java.util.logging.Logger;


@Service
public class AuthorizationService {
    private final LevelDBService levelDBService;
    private final ConsulDBService consulDBService;
    private final Logger logger = Logger.getLogger(AuthorizationService.class.getName());

    public AuthorizationService(LevelDBService levelDBService,
                                ConsulDBService consulDBService) {
        this.levelDBService = levelDBService;
        this.consulDBService = consulDBService;
    }

    public void setRelation(AclDTO aclDTO) {
//        logger.info("Setting relation for user: " + aclDTO.getUser() + ", relation: " + aclDTO.getRelation() + ", object: " + aclDTO.getObject());
        levelDBService.put(aclDTO.getLevelDBEntry(), "");
    }

    public boolean checkRelation(String user, String relation, String object) {
//        logger.info("Checking relation for user: " + user + ", relation: " + relation + ", object: " + object);
        String dbResponse = levelDBService.get(user + "-" + relation + "-" + object);
        return dbResponse != null;
    }

    public boolean saveNamespaceConfig(String namespace, String config) {
        return consulDBService.put(namespace, config);
    }

    public String getNamespaceConfig(String namespace) {
        return consulDBService.get(namespace);
    }
}
