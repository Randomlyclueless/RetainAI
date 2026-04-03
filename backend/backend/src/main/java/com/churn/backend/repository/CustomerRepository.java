package com.churn.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.churn.backend.model.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}