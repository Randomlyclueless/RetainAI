package com.churn.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;

import com.churn.backend.model.Customer;
import com.churn.backend.repository.CustomerRepository;
import com.churn.backend.service.GeminiService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping
    public ResponseEntity<Map<String, String>> chat(
            @RequestBody ChatRequest request) {

        if (request == null
                || request.getMessage() == null
                || request.getMessage().isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Please enter a message."));
        }

        if (request.getMessage().length() > 2000) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Message must be 2000 characters or fewer."));
        }

        try {
            List<Customer> customers = customerRepository.findAll();

            long predictedChurn = customers.stream()
                    .filter(c -> Integer.valueOf(1).equals(c.getPrediction()))
                    .count();

            long predictedRetention = customers.stream()
                    .filter(c -> Integer.valueOf(0).equals(c.getPrediction()))
                    .count();

            String customerContext = customers.stream()
                    .limit(50)
                    .map(c -> String.format(
                            "ID: %s, Name: %s, Company: %s, Risk: %s, "
                                    + "Tenure: %d months, Monthly charges: %.2f, "
                                    + "Contract code: %d, Prediction: %s, "
                                    + "Churn probability: %s, Explanation: %s, "
                                    + "Recommendation: %s",
                            c.getId(),
                            safe(c.getName()),
                            safe(c.getCompany()),
                            safe(c.getRiskLevel()),
                            c.getTenure(),
                            c.getMonthlyCharges(),
                            c.getContract(),
                            c.getPrediction(),
                            c.getProbability(),
                            safe(c.getExplanation()),
                            safe(c.getRecommendation())))
                    .collect(Collectors.joining("\n"));

            if (customerContext.isBlank()) {
                customerContext = "No customer records are currently available.";
            }

            customerContext = "Total customers: " + customers.size()
                    + "\nPredicted churn: " + predictedChurn
                    + "\nPredicted retention: " + predictedRetention
                    + "\nCustomer records (up to 50):\n" + customerContext;

            String answer = geminiService.generateResponse(
                    request.getMessage().trim(),
                    customerContext);

            return ResponseEntity.ok(Map.of("response", answer));

        } catch (RestClientException ex) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(
                    Map.of("error",
                            "Unable to reach Gemini right now. Please try again."));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(
                    Map.of("error",
                            "The AI assistant is not configured correctly or returned no answer."));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error",
                            "Something went wrong while processing your message."));
        }
    }

    private String safe(String value) {
        return value == null ? "Not available" : value;
    }

    public static class ChatRequest {
        private String message;

        public ChatRequest() {}

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}