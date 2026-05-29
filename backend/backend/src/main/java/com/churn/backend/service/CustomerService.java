package com.churn.backend.service;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import org.springframework.web.multipart.MultipartFile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.churn.backend.model.Customer;
import com.churn.backend.repository.CustomerRepository;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repository;

    private final String AGENT_URL = "http://localhost:5000/analyze";

    // ML + Save
    public Map<String, Object> getMLPrediction(Customer customer) {

                RestTemplate restTemplate =
                        new RestTemplate();

                Map<String, Object> request =
                        Map.of(

                                "tenure",
                                customer.getTenure(),

                                "monthlyCharges",
                                customer.getMonthlyCharges(),

                                "totalCharges",
                                customer.getTotalCharges(),

                                "contract",
                                customer.getContract()

                        );

                Map<String, Object> response =
                        restTemplate.postForObject(
                                AGENT_URL,
                                request,
                                Map.class
                        );

                // Prediction
                Map<String, Object> predictionMap =
                        (Map<String, Object>)
                                response.get("prediction");

                Number pred =
                        (Number)
                                predictionMap.get("prediction");

                Number prob =
                        (Number)
                predictionMap.get("probability");

                customer.setPrediction(
                        pred.intValue()
                );

                customer.setProbability(
                        prob.doubleValue()
                );

                // Risk Level
                customer.setRiskLevel(
                        pred.intValue() == 1
                                ? "HIGH"
                                : "LOW"
                );

                // Explanation
                Map<String, Object> explanationMap =
                        (Map<String, Object>)
                                response.get("explanation");

                customer.setExplanation(
                        explanationMap
                                .get("reasons")
                                .toString());

                // Recommendation
                Map<String, Object> recommendationMap =
                        (Map<String, Object>)
                                response.get("recommendation");

                customer.setRecommendation(
                        recommendationMap
                                .get("recommendations")
                                .toString()
                );

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

        List<Customer> customers = repository.findAll();

        int totalCustomers = customers.size();

        int highRiskCustomers =
                (int) customers.stream()
                .filter(c ->
                        c.getPrediction() != null
                        && c.getPrediction() == 1)
                .count();

        int lowRiskCustomers =
                totalCustomers - highRiskCustomers;

        double retentionRate =
                totalCustomers == 0
                ? 0
                : ((double) lowRiskCustomers / totalCustomers) * 100;

        double churnRate =
                totalCustomers == 0
                ? 0
                : ((double) highRiskCustomers / totalCustomers) * 100;

        Map<String, Object> stats = Map.of(

                "totalCustomers", totalCustomers,

                "highRiskCustomers", highRiskCustomers,

                "lowRiskCustomers", lowRiskCustomers,

                "retentionRate",
                Math.round(retentionRate * 100.0) / 100.0,

                "churnRate",
                Math.round(churnRate * 100.0) / 100.0
        );

        return stats;
    }

    public void saveCSV(MultipartFile file) {

                try (

                        BufferedReader reader =
                                new BufferedReader(
                                        new InputStreamReader(
                                                file.getInputStream()
                                        )
                                );

                        CSVParser csvParser =
                                new CSVParser(
                                        reader,
                                        CSVFormat.DEFAULT
                                                .withFirstRecordAsHeader()
                                                .withIgnoreHeaderCase()
                                                .withTrim()
                                )

                ) {

                        for (CSVRecord record : csvParser) {

                        Customer customer = new Customer();

                        customer.setName(
                                record.get("name")
                        );

                        customer.setEmail(
                                record.get("email")
                        );

                        customer.setCompany(
                                record.get("company")
                        );

                        customer.setPhone(
                                record.get("phone")
                        );

                        customer.setTenure(
                                Integer.parseInt(
                                        record.get("tenure")
                                )
                        );

                        customer.setMonthlyCharges(
                                Double.parseDouble(
                                        record.get("monthlyCharges")
                                )
                        );

                        customer.setTotalCharges(
                                Double.parseDouble(
                                        record.get("totalCharges")
                                )
                        );

                        customer.setPrediction(0);

                        customer.setProbability(0.0);

                        customer.setRiskLevel("LOW");

                        repository.save(customer);

                        }

                } catch (Exception e) {

                        e.printStackTrace();

                }

        }
}

