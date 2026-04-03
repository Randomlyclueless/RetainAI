package com.churn.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int loginFrequency;
    private int daysSinceLastLogin;
    private int supportTickets;

    // Default constructor (VERY IMPORTANT for JPA)
    public Customer() {}

    // Parameterized constructor
    public Customer(String name, int loginFrequency, int daysSinceLastLogin, int supportTickets) {
        this.name = name;
        this.loginFrequency = loginFrequency;
        this.daysSinceLastLogin = daysSinceLastLogin;
        this.supportTickets = supportTickets;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getLoginFrequency() {
        return loginFrequency;
    }

    public int getDaysSinceLastLogin() {
        return daysSinceLastLogin;
    }

    public int getSupportTickets() {
        return supportTickets;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLoginFrequency(int loginFrequency) {
        this.loginFrequency = loginFrequency;
    }

    public void setDaysSinceLastLogin(int daysSinceLastLogin) {
        this.daysSinceLastLogin = daysSinceLastLogin;
    }

    public void setSupportTickets(int supportTickets) {
        this.supportTickets = supportTickets;
    }
}