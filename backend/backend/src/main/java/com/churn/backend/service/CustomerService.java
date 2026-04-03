package com.churn.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.churn.backend.model.Customer;
import com.churn.backend.repository.CustomerRepository;

@Service  // tells Spring this is a service class
public class CustomerService {

    @Autowired
    private CustomerRepository repository;

    // Add customer to DB
    public Customer addCustomer(Customer customer) {
        return repository.save(customer);
    }

    // Get all customers from DB
    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }
}