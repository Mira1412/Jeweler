package com.rainbowforest.productcatalogservice.controller;

import com.rainbowforest.productcatalogservice.entity.Product;
import com.rainbowforest.productcatalogservice.http.header.HeaderGenerator;
import com.rainbowforest.productcatalogservice.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;
    
    @Autowired
    private HeaderGenerator headerGenerator;

    @GetMapping (value = "/products")
    public ResponseEntity<List<Product>> getAllProducts(){
        List<Product> products =  productService.getAllProduct();
        if(!products.isEmpty()) {
        	return new ResponseEntity<List<Product>>(
        			products,
        			headerGenerator.getHeadersForSuccessGetMethod(),
        			HttpStatus.OK);
        }
        return new ResponseEntity<List<Product>>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.NOT_FOUND);       
    }

    @GetMapping(value = "/products", params = "category")
    public ResponseEntity<List<Product>> getAllProductByCategory(@RequestParam ("category") String category){
        List<Product> products = productService.getAllProductByCategory(category);
        if(!products.isEmpty()) {
        	return new ResponseEntity<List<Product>>(
        			products,
        			headerGenerator.getHeadersForSuccessGetMethod(),
        			HttpStatus.OK);
        }
        return new ResponseEntity<List<Product>>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.NOT_FOUND);
    }

    @GetMapping (value = "/products/{id}")
    public ResponseEntity<Product> getOneProductById(@PathVariable ("id") long id){
        Product product =  productService.getProductById(id);
        if(product != null) {
        	return new ResponseEntity<Product>(
        			product,
        			headerGenerator.getHeadersForSuccessGetMethod(),
        			HttpStatus.OK);
        }
        return new ResponseEntity<Product>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.NOT_FOUND);
    }

    @GetMapping (value = "/products", params = "name")
    public ResponseEntity<List<Product>> getAllProductsByName(@RequestParam ("name") String name){
        List<Product> products =  productService.getAllProductsByName(name);
        if(!products.isEmpty()) {
        	return new ResponseEntity<List<Product>>(
        			products,
        			headerGenerator.getHeadersForSuccessGetMethod(),
        			HttpStatus.OK);
        }
        return new ResponseEntity<List<Product>>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.NOT_FOUND);
    }
// ==========================================
    // THÊM HÀM NÀY ĐỂ XỬ LÝ THÊM MỚI (POST) DỮ LIỆU
    // ==========================================
    @PostMapping(value = "/products")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        try {
            // Gọi hàm lưu dữ liệu từ tầng Service
            // (Lưu ý: Nếu file ProductService của bạn đặt tên hàm lưu là saveProduct hoặc save, hãy đổi chữ addProduct bên dưới cho khớp nhé)
            Product savedProduct = productService.addProduct(product); 
            
            if (savedProduct != null) {
                return new ResponseEntity<Product>(
                        savedProduct,
                        HttpStatus.CREATED); // Trả về mã 201 báo hiệu tạo thành công
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping(value = "/products/{id}/category")
    public ResponseEntity<String> getCategoryByProductId(@PathVariable("id") long id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            return new ResponseEntity<>(
                    product.getCategory(), // Chỉ trả về đúng cái tên Category (String)
                    HttpStatus.OK);
        }
        return new ResponseEntity<>("Unknown", HttpStatus.NOT_FOUND);
    }

    // ==========================================
    // CẬP NHẬT SẢN PHẨM (PUT)
    // ==========================================
    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable("id") long id, @RequestBody Product product) {
        Product existingProduct = productService.getProductById(id);
        if (existingProduct == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        // Cập nhật các trường
        product.setId(id); // Đảm bảo ID được giữ nguyên
        Product updatedProduct = productService.addProduct(product); // addProduct của service thực tế là hàm save()
        
        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
    }

    // ==========================================
    // XÓA SẢN PHẨM (DELETE)
    // ==========================================
    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") long id) {
        Product existingProduct = productService.getProductById(id);
        if (existingProduct == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        productService.deleteProduct(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // ==========================================
    // THÊM HÀM UPLOAD ẢNH
    // ==========================================
    @PostMapping("/products/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return new ResponseEntity<>("File is empty", HttpStatus.BAD_REQUEST);
        }

        try {
            // Đảm bảo thư mục uploads tồn tại
            Path uploadPath = Paths.get("uploads");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Tạo tên file ngắn hơn (Dùng timestamp + tên gốc thu gọn)
            String originalFileName = file.getOriginalFilename();
            String cleanName = originalFileName.replaceAll("[^a-zA-Z0-9.]", "").toLowerCase();
            String uniqueFileName = System.currentTimeMillis() % 100000 + "_" + cleanName;

            // Lưu file
            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath);

            return new ResponseEntity<>(uniqueFileName, HttpStatus.OK);

        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to upload image", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
