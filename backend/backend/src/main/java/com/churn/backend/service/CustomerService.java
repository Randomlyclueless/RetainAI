package com.churn.backend.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.churn.backend.model.Customer;
import com.churn.backend.repository.CustomerRepository;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repository;

    @Autowired
    private PredictionService predictionService;

    // Add customer to DB
    public Customer addCustomer(Customer customer) {
        return repository.save(customer);
    }

    // Get all customers from DB
    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    // Predict risk (delegates to PredictionService)
    public Map<String, Object> predictCustomer(Customer customer) {
        return predictionService.predict(customer);
    }
}