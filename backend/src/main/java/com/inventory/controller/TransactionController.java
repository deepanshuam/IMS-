
package com.inventory.controller;

import com.inventory.model.Transaction;
import com.inventory.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(
                transactionService.getAllTransactions());
    }

    @PostMapping
    public ResponseEntity<?> addStockTransaction(
            @RequestParam String productId,
            @RequestParam String type,
            @RequestParam int quantity) {

        try {
            Transaction transaction =
                    transactionService.addStockTransaction(
                            productId, type, quantity);

            return ResponseEntity.ok(transaction);

        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest()
                    .body(exception.getMessage());
        }
    }
}
