package com.churn.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.churn.backend.model.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    long countByPrediction(int prediction);

}