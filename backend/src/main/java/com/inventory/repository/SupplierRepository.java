package com.inventory.repository;

import com.inventory.model.Supplier;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface SupplierRepository
        extends MongoRepository<Supplier, String> {

}