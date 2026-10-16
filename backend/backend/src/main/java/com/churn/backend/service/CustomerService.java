
package com.churn.backend.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

import com.churn.backend.model.Customer;
import com.churn.backend.repository.CustomerRepository;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repository;

    @Value("${ml.service.url:http://localhost:8001/predict}")
    private String mlServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public Customer saveCustomer(Customer customer) {
        Map<String, Object> request = Map.of(
                "tenure", customer.getTenure(),
                "monthlyCharges", customer.getMonthlyCharges(),
                "totalCharges", customer.getTotalCharges(),
                "contract", customer.getContract(),
                "internetService", customer.getInternetService(),
                "paymentMethod", customer.getPaymentMethod()
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(request, headers);

        final Map<?, ?> result;

        try {
            result = restTemplate.postForObject(
                    mlServiceUrl, entity, Map.class);
        } catch (RestClientException ex) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Churn prediction service is unavailable. Customer was not saved.",
                    ex
            );
        }

        if (result == null
                || !(result.get("prediction") instanceof Number)
                || !(result.get("churn_probability") instanceof Number)
                || !(result.get("risk_level") instanceof String)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Churn prediction service returned an invalid response."
            );
        }

        int prediction =
                ((Number) result.get("prediction")).intValue();

        double probability =
                ((Number) result.get("churn_probability")).doubleValue();

        String riskLevel = (String) result.get("risk_level");

        customer.setPrediction(prediction);
        customer.setProbability(probability);
        customer.setRiskLevel(riskLevel);

        customer.setExplanation(String.format(
                Locale.ROOT,
                "The model estimated a %.2f%% probability of churn.",
                probability * 100
        ));

        customer.setRecommendation(
                prediction == 1
                        ? "Review the customer's contract, service experience, and suitable retention offers."
                        : "Continue regular customer engagement and monitor future churn risk."
        );

        return repository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    public Map<String, Object> getStats() {
        long total = repository.count();
        long highRisk = repository.countByPrediction(1);
        long lowRisk = repository.countByPrediction(0);

        double churnRate =
                total == 0 ? 0 : highRisk * 100.0 / total;

        double retentionRate =
                total == 0 ? 0 : lowRisk * 100.0 / total;

        return Map.of(
                "totalCustomers", total,
                "highRisk", highRisk,
                "lowRisk", lowRisk,
                "churnRate", Math.round(churnRate * 100.0) / 100.0,
                "retentionRate", Math.round(retentionRate * 100.0) / 100.0
        );
    }

    public void saveCSV(MultipartFile file) {
        try (
                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(file.getInputStream()));
                CSVParser csvParser = new CSVParser(
                        reader,
                        CSVFormat.DEFAULT
                                .withFirstRecordAsHeader()
                                .withIgnoreHeaderCase()
                                .withTrim())
        ) {
            for (CSVRecord record : csvParser) {
                Customer customer = new Customer();

                customer.setName(record.get("name"));
                customer.setEmail(record.get("email"));
                customer.setCompany(record.get("company"));
                customer.setPhone(record.get("phone"));

                customer.setTenure(
                        Integer.parseInt(record.get("tenure")));
                customer.setMonthlyCharges(
                        Double.parseDouble(record.get("monthlyCharges")));
                customer.setTotalCharges(
                        Double.parseDouble(record.get("totalCharges")));
                customer.setContract(
                        Integer.parseInt(record.get("contract")));
                customer.setInternetService(
                        Integer.parseInt(record.get("internetService")));
                customer.setPaymentMethod(
                        Integer.parseInt(record.get("paymentMethod")));

                // Run the real model before saving each imported customer.
                saveCustomer(customer);
            }
        } catch (Exception ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "CSV import failed: " + ex.getMessage(),
                    ex
            );
        }
    }
}
