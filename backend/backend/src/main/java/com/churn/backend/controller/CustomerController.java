package com.churn.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.churn.backend.model.Customer;
import com.churn.backend.service.CustomerService;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    @Autowired
    private CustomerService service;

    // POST → Add customer to DB
    @PostMapping
    public Customer addCustomer(@RequestBody Customer customer) {
        return service.addCustomer(customer);
    }

    // GET → Fetch all customers from DB
    @GetMapping
    public List<Customer> getCustomers() {
        return service.getAllCustomers();
    }

    // NEW → Predict churn risk
    @PostMapping("/predict")
    public Map<String, Object> predict(@RequestBody Customer customer) {
        return service.predictCustomer(customer);
    }
}