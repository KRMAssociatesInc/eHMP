package com.hawaiirg.utils;

import java.util.LinkedHashMap;
import java.util.Map;

public class Cache {

    private static Map<String, Map> cache = new LinkedHashMap<>();

    public static void put(String key, Map value) {
        cache.put(key, value);
    }

    public static Map get(String key) {
        return cache.get(key);
    }

}
