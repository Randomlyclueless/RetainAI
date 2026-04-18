package com.churn.backend.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.churn.backend.model.Customer;

@Service
public class PredictionService {

    public Map<String, Object> predict(Customer customer) {

        double riskScore = 0;

        if (customer.getLoginFrequency() < 3) riskScore += 0.4;
        if (customer.getDaysSinceLastLogin() > 7) riskScore += 0.3;
        if (customer.getSupportTickets() > 2) riskScore += 0.3;

        String riskLevel = (riskScore > 0.6) ? "HIGH RISK" : "LOW RISK";

        return Map.of(
            "riskScore", riskScore,
            "riskLevel", riskLevel
        );
    }
}