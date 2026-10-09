
package com.inventory.service;

import com.inventory.model.Product;
import com.inventory.model.Transaction;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final ProductRepository productRepository;

    public TransactionService(
            TransactionRepository transactionRepository,
            ProductRepository productRepository) {
        this.transactionRepository = transactionRepository;
        this.productRepository = productRepository;
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository
                .findAllByOrderByTransactionDateDesc();
    }

    public Transaction addStockTransaction(
            String productId,
            String transactionType,
            int quantity) {

        if (quantity <= 0) {
            throw new IllegalArgumentException(
                    "Quantity must be greater than zero.");
        }

        if (!"IN".equals(transactionType)
                && !"OUT".equals(transactionType)) {
            throw new IllegalArgumentException(
                    "Transaction type must be IN or OUT.");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Product not found."));

        int currentQuantity = product.getQuantity();
        int updatedQuantity;

        if ("IN".equals(transactionType)) {
            updatedQuantity = currentQuantity + quantity;
        } else {
            if (quantity > currentQuantity) {
                throw new IllegalArgumentException(
                        "Insufficient stock. Available quantity: "
                                + currentQuantity);
            }

            updatedQuantity = currentQuantity - quantity;
        }

        product.setQuantity(updatedQuantity);
        productRepository.save(product);

        Transaction transaction = new Transaction(
                product.getId(),
                product.getProductName(),
                transactionType,
                quantity,
                LocalDateTime.now()
        );

        return transactionRepository.save(transaction);
    }
}
