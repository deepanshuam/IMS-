package com.inventory.repository;

import com.inventory.model.Product;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProductRepository
        extends MongoRepository<Product, String> {

    List<Product> findByProductNameContainingIgnoreCase(
            String productName
    );

    List<Product> findByCategory(
            String category
    );

    List<Product> findByQuantityLessThanEqual(
            int quantity
    );
}