package rs.ac.uns.ftn.minizanzibar.service;

import org.iq80.leveldb.*;
import org.springframework.stereotype.Service;

import static org.fusesource.leveldbjni.JniDBFactory.*;
import java.io.*;

@Service
public class LevelDBService {
    private final static String LEVELDB_PATH = "src/main/resources/leveldb";

    public LevelDBService() {
    }

    private DB getDefaultDB() throws IOException {
        Options options = new Options();
        options.createIfMissing(true);
        return factory.open(new File(LEVELDB_PATH), options);
    }

    public void put(String key, String value) {
        try {
            DB db = getDefaultDB();
            db.put(bytes(key), bytes(value));
            db.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public String get(String key) {
        try {
            DB db = getDefaultDB();
            String value = asString(db.get(bytes(key)));
            db.close();
            return value;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
