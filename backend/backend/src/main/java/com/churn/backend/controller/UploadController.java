package com.churn.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.churn.backend.service.CustomerService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UploadController {

    @Autowired
    private CustomerService service;

    @PostMapping("/upload")
    public String uploadCSV(
            @RequestParam("file") MultipartFile file
    ) {

        service.saveCSV(file);

        return "CSV Uploaded Successfully";

    }

}