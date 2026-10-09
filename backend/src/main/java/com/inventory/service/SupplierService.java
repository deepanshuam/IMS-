
package com.inventory.service;

import com.inventory.model.Supplier;
import com.inventory.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier addSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public Supplier getSupplierById(String id) {
        return supplierRepository.findById(id).orElse(null);
    }

    public Supplier updateSupplier(String id, Supplier updatedSupplier) {
        Supplier existing = getSupplierById(id);

        if (existing == null) {
            return null;
        }

        existing.setSupplierName(updatedSupplier.getSupplierName());
        existing.setPhone(updatedSupplier.getPhone());
        existing.setEmail(updatedSupplier.getEmail());
        existing.setAddress(updatedSupplier.getAddress());

        return supplierRepository.save(existing);
    }

    public boolean deleteSupplier(String id) {
        if (!supplierRepository.existsById(id)) {
            return false;
        }

        supplierRepository.deleteById(id);
        return true;
    }
}
