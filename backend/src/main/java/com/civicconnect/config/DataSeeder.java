package com.civicconnect.config;

import com.civicconnect.model.*;
import com.civicconnect.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(UserRepository users, ComplaintRepository complaints,
                           NoticeRepository notices, PasswordEncoder encoder) {
        return args -> {
            if (users.count() > 0) return;

            User admin = new User();
            admin.setName("Municipal Admin");
            admin.setEmail("admin@civic.local");
            admin.setPassword(encoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            users.save(admin);

            User citizen = new User();
            citizen.setName("Demo Citizen");
            citizen.setEmail("citizen@civic.local");
            citizen.setPassword(encoder.encode("citizen123"));
            citizen.setPhone("9999999999");
            users.save(citizen);

            Complaint c1 = new Complaint();
            c1.setTitle("Large pothole near the bus stand");
            c1.setDescription("A deep pothole has formed on the main road and two-wheelers are slipping.");
            c1.setCategory(Category.ROAD);
            c1.setWard("Ward 4");
            c1.setAddress("Main Road, near Bus Stand");
            c1.setUser(citizen);
            complaints.save(c1);

            Complaint c2 = new Complaint();
            c2.setTitle("Street lights not working in lane 3");
            c2.setDescription("Three consecutive street lights have been off for a week.");
            c2.setCategory(Category.STREET_LIGHT);
            c2.setWard("Ward 7");
            c2.setStatus(ComplaintStatus.IN_PROGRESS);
            c2.setAdminRemark("Electrician team assigned.");
            c2.setUser(citizen);
            complaints.save(c2);

            Notice n = new Notice();
            n.setTitle("Water supply paused on Saturday");
            n.setBody("Supply will be paused from 10 AM to 2 PM in Wards 3 to 6 for pipeline maintenance. Please store water in advance.");
            notices.save(n);
        };
    }
}
