
package com.inventory.repository;

import com.inventory.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TransactionRepository
        extends MongoRepository<Transaction, String> {

    List<Transaction> findByProductId(String productId);

    List<Transaction> findAllByOrderByTransactionDateDesc();
}
