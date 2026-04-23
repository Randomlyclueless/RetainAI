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

    // Save customer to DB
    public Customer addCustomer(Customer customer) {
        return repository.save(customer);
    }

    // Fetch all customers
    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    // 🔥 ML Prediction (calls Flask API)
    public Map<String, Object> getMLPrediction(Customer customer) {

        RestTemplate restTemplate = new RestTemplate();

        String url = "http://localhost:5000/predict";

        // Prepare request body for Flask
        Map<String, Object> request = Map.of(
                "tenure", customer.getTenure(),
                "MonthlyCharges", customer.getMonthlyCharges(),
                "TotalCharges", customer.getTotalCharges(),
                "Contract", customer.getContract(),
                "InternetService", customer.getInternetService(),
                "PaymentMethod", customer.getPaymentMethod()
        );

        // Call Flask API
        return restTemplate.postForObject(url, request, Map.class);
    }
}