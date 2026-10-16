package com.churn.backend.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeminiService {

    @Value("${GEMINI_API_KEY:}")
    private String apiKey;

    @Value("${GEMINI_MODEL:gemini-2.5-flash}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateResponse(String question, String customerContext) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "Gemini API key is not configured.");
        }

        String prompt = """
                You are RetainAI Assistant, an AI assistant for a customer
                churn prediction and retention platform.

                Answer questions clearly and professionally.
                Use the provided customer data when relevant.
                Never invent customer records, model predictions, or probabilities.
                A prediction is an estimate, not a guarantee.
                Suggest practical, ethical customer retention actions.
                If the provided data does not answer a question, say so.
                Do not reveal secrets or API keys.

                Customer data:
                %s

                User question:
                %s
                """.formatted(customerContext, question);

        String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                + model + ":generateContent";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", apiKey);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                )
        );

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(requestBody, headers);

        Map<?, ?> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                request,
                Map.class
        ).getBody();

        if (response == null) {
            throw new IllegalStateException(
                    "Gemini returned an empty response.");
        }

        Object candidatesObject = response.get("candidates");

        if (!(candidatesObject instanceof List<?> candidates)
                || candidates.isEmpty()) {
            throw new IllegalStateException(
                    "Gemini did not return a response.");
        }

        Object contentObject =
                ((Map<?, ?>) candidates.get(0)).get("content");

        if (!(contentObject instanceof Map<?, ?> content)) {
            throw new IllegalStateException(
                    "Gemini response did not contain text.");
        }

        Object partsObject = content.get("parts");

        if (!(partsObject instanceof List<?> parts)
                || parts.isEmpty()) {
            throw new IllegalStateException(
                    "Gemini response did not contain text.");
        }

        Object textObject = ((Map<?, ?>) parts.get(0)).get("text");

        if (!(textObject instanceof String answer) || answer.isBlank()) {
            throw new IllegalStateException(
                    "Gemini returned an empty answer.");
        }

        return answer;
    }
}