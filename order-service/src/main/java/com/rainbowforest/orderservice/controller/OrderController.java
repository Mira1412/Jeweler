package com.rainbowforest.orderservice.controller;

import com.rainbowforest.orderservice.domain.Item;
import com.rainbowforest.orderservice.domain.Order;
import com.rainbowforest.orderservice.domain.User;
import com.rainbowforest.orderservice.feignclient.UserClient;
import com.rainbowforest.orderservice.http.header.HeaderGenerator;
import com.rainbowforest.orderservice.service.CartService;
import com.rainbowforest.orderservice.service.OrderService;
import com.rainbowforest.orderservice.utilities.OrderUtilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

// Sửa javax thành jakarta
import jakarta.servlet.http.HttpServletRequest; 

@RestController
public class OrderController {

    @Autowired
    private UserClient userClient;

    @Autowired
    private OrderService orderService;

    @Autowired
    private CartService cartService;

    @Autowired
    private HeaderGenerator headerGenerator;
    
    @PostMapping(value = "/order/{userId}")
    public ResponseEntity<Order> saveOrder(
            @PathVariable("userId") Long userId,
            @RequestParam(value = "cartId") String cartId,
            HttpServletRequest request){
        
        List<Item> cart = cartService.getAllItemsFromCart(cartId);
        
        // Gọi User Service qua Feign Client
        User user = userClient.getUserById(userId);   
        
        if(cart != null && !cart.isEmpty() && user != null) {
            Order order = this.createOrder(cart, user);
            try{
                order = orderService.saveOrder(order);
                cartService.deleteCart(cartId); 
                
                return new ResponseEntity<>(
                        order, 
                        headerGenerator.getHeadersForSuccessPostMethod(request, order.getId()),
                        HttpStatus.CREATED);
            } catch (Exception ex){
                ex.printStackTrace();
                try {
                    java.io.PrintWriter pw = new java.io.PrintWriter(new java.io.FileWriter("d:/Web2-BT-Buoi4/Web2-BT-Buoi4/order-error.log", true));
                    ex.printStackTrace(pw);
                    pw.close();
                } catch (Exception e) {}
                
                org.springframework.http.HttpHeaders errorHeaders = new org.springframework.http.HttpHeaders();
                errorHeaders.add("X-Error-Message", "Look at order-error.log");
                return new ResponseEntity<>(null, errorHeaders, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
  
        return new ResponseEntity<Order>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }
    
    // Tạo object Order từ giỏ hàng và thông tin User
    private Order createOrder(List<Item> cart, User user) {
        Order order = new Order();
        order.setItems(cart);
        order.setUser(user);
        order.setTotal(OrderUtilities.countTotalPrice(cart));
        order.setOrderedDate(LocalDate.now());
        order.setStatus("PAYMENT_EXPECTED");
        return order;
 
    }

    @PostMapping(value = "/orders/test")
    public ResponseEntity<Order> testSaveOrder(@RequestBody Order order) {
        try {
            // Tự động set ngày giờ hiện tại
            order.setOrderedDate(LocalDate.now());
            
            // Lưu thẳng vào database bỏ qua bước check Giỏ hàng
            orderService.saveOrder(order);
            
            return new ResponseEntity<Order>(order, HttpStatus.CREATED);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<Order>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/order/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable("userId") Long userId) {
        List<Order> orders = orderService.getAllOrdersByUserId(userId);
        return new ResponseEntity<List<Order>>(orders, HttpStatus.OK);
    }
}