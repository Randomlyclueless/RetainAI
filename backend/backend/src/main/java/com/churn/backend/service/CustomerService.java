package com.churn.backend.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.churn.backend.model.Customer;
import com.churn.backend.repository.CustomerRepository;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repository;

    private final String ML_URL = "http://localhost:5000/predict";

    // ML + Save
    public Map<String, Object> getMLPrediction(Customer customer) {

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> request = Map.of(
                "tenure", customer.getTenure(),
                "MonthlyCharges", customer.getMonthlyCharges(),
                "TotalCharges", customer.getTotalCharges(),
                "Contract", customer.getContract(),
                "InternetService", customer.getInternetService(),
                "PaymentMethod", customer.getPaymentMethod()
        );

        Map<String, Object> response =
                restTemplate.postForObject(ML_URL, request, Map.class);

        Number pred = (Number) response.get("prediction");
        Number prob = (Number) response.get("probability");

        customer.setPrediction(pred.intValue());
        customer.setProbability(prob.doubleValue());

        repository.save(customer);

        return response;
    }

    public Customer saveCustomer(Customer customer) {
        return repository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    // Stats API
    public Map<String, Object> getStats() {

        long total = repository.count();
        long highRisk = repository.countByPrediction(1);
        long lowRisk = repository.countByPrediction(0);

        double churnRate = (total == 0) ? 0 : (highRisk * 100.0 / total);

        return Map.of(
                "totalCustomers", total,
                "highRisk", highRisk,
                "lowRisk", lowRisk,
                "churnRate", churnRate
        );
    }
}