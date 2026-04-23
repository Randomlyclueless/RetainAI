package com.churn.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.churn.backend.model.Customer;
import com.churn.backend.service.CustomerService;

@RestController
@RequestMapping("/customers")
@CrossOrigin(origins = "http://localhost:3000") // ✅ ADD THIS
public class CustomerController {

    @Autowired
    private CustomerService service;

    // Add customer to DB
    @PostMapping
    public Customer addCustomer(@RequestBody Customer customer) {
        return service.addCustomer(customer);
    }

    // Get all customers
    @GetMapping
    public List<Customer> getCustomers() {
        return service.getAllCustomers();
    }

    // 🔥 ML Prediction endpoint
    @PostMapping("/ml-predict")
    public Map<String, Object> predictUsingML(@RequestBody Customer customer) {
        return service.getMLPrediction(customer);
    }
}