package com.inventory.service;

import com.inventory.model.Product;
import com.inventory.repository.ProductRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(
            ProductRepository productRepository) {

        this.productRepository =
                productRepository;
    }

    public Product addProduct(Product product) {

        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {

        return productRepository.findAll();
    }

    public Product getProductById(String id) {

        return productRepository
                .findById(id)
                .orElse(null);
    }

    public Product updateProduct(
            String id,
            Product updatedProduct) {

        Product existing =
                productRepository
                        .findById(id)
                        .orElse(null);

        if (existing == null) {

            return null;
        }

        existing.setProductCode(
                updatedProduct.getProductCode()
        );

        existing.setProductName(
                updatedProduct.getProductName()
        );

        existing.setCategory(
                updatedProduct.getCategory()
        );

        existing.setSupplier(
                updatedProduct.getSupplier()
        );

        existing.setQuantity(
                updatedProduct.getQuantity()
        );

        existing.setPrice(
                updatedProduct.getPrice()
        );

        existing.setMinStock(
                updatedProduct.getMinStock()
        );

        return productRepository.save(existing);
    }

    public boolean deleteProduct(String id) {

        if (!productRepository.existsById(id)) {

            return false;
        }

        productRepository.deleteById(id);

        return true;
    }

    public List<Product> searchProducts(
            String name) {

        return productRepository
                .findByProductNameContainingIgnoreCase(
                        name
                );
    }

    public List<Product> getLowStockProducts() {

        return productRepository
                .findByQuantityLessThanEqual(5);
    }
}