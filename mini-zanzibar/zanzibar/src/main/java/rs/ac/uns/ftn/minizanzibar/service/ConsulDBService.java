package rs.ac.uns.ftn.minizanzibar.service;

import com.ecwid.consul.v1.ConsulClient;
import com.ecwid.consul.v1.kv.model.GetValue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ConsulDBService {
    private final ConsulClient client;

    public ConsulDBService(@Value("${consul.host}") String host, @Value("${consul.port}") int port) {
        this.client = new ConsulClient(host, port);
    }

    public boolean put(String key, String value) {
        return client.setKVValue(key, value).getValue();
    }

    public String get(String key) {
        GetValue value = client.getKVValue(key).getValue();
        return value != null ? value.getDecodedValue() : null;
    }
}