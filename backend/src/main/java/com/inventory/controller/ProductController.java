package com.inventory.controller;

import com.inventory.model.Product;
import com.inventory.service.ProductService;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;

    public ProductController(
            ProductService productService) {

        this.productService =
                productService;
    }

    @PostMapping
    public ResponseEntity<Product> addProduct(
            @RequestBody Product product) {

        return ResponseEntity.ok(
                productService.addProduct(product)
        );
    }

    @GetMapping
    public ResponseEntity<List<Product>>
    getAllProducts() {

        return ResponseEntity.ok(
                productService.getAllProducts()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product>
    getProduct(@PathVariable String id) {

        Product product =
                productService.getProductById(id);

        if (product == null) {

            return ResponseEntity.notFound()
                    .build();
        }

        return ResponseEntity.ok(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product>
    updateProduct(
            @PathVariable String id,
            @RequestBody Product product) {

        Product updated =
                productService.updateProduct(
                        id,
                        product
                );

        if (updated == null) {

            return ResponseEntity.notFound()
                    .build();
        }

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    deleteProduct(
            @PathVariable String id) {

        boolean deleted =
                productService.deleteProduct(id);

        if (!deleted) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(
                "Product deleted successfully"
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>>
    searchProducts(
            @RequestParam String name) {

        return ResponseEntity.ok(
                productService.searchProducts(name)
        );
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>>
    getLowStockProducts() {

        return ResponseEntity.ok(
                productService.getLowStockProducts()
        );
    }
}