package com.edu.webapp;

import com.edu.webapp.config.CacheLocalConfig;
import com.edu.webapp.entity.advertisement.AdvertisingPackage;
import com.edu.webapp.entity.location.District;
import com.edu.webapp.entity.location.Province;
import com.edu.webapp.entity.user.Role;
import com.edu.webapp.entity.user.User;
import com.edu.webapp.mapper.UserMapper;
import com.edu.webapp.model.enums.ActiveStatus;
import com.edu.webapp.model.request.UserCreateReq;
import com.edu.webapp.model.response.AuthRes;
import com.edu.webapp.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.Date;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@SpringBootApplication
@Slf4j
@RequiredArgsConstructor
@EnableCaching
@EnableScheduling
@EnableAsync
@EnableAspectJAutoProxy(exposeProxy = true)
public class Application implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    private final AdvertisingPackageRepository advertisingPackageRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final CacheLocalConfig cacheLocalConfig;
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        createRoles();
        createProvinces();
        createDistricts();
        createAdvertisingPackage();
        createAdmin();
    }

    private void createAdmin() {
        log.info("Create admin");
        UserCreateReq userCreateReq = new UserCreateReq();
        userCreateReq.setFullName("ADMIN");
        userCreateReq.setEmail("admin@gmail.com");
        userCreateReq.setPassword("admin123");
        if (userRepository.count() == 0) {
            User user = userMapper.userCreateReqToUser(userCreateReq);
            user.setPassword(passwordEncoder.encode(userCreateReq.getPassword()));
            user.setRoles(roleRepository.findAll());
            userRepository.save(user);
        }
    }

    private void createAdvertisingPackage() {
        log.info("Creating advertising package");
        if (advertisingPackageRepository.findAll().isEmpty()) {
            AdvertisingPackage month1 = new AdvertisingPackage();
            month1.setAdvertisingName("Gói 1 tháng");
            month1.setDes("Gói 1 tháng");
            month1.setPrice(100000.0);
            month1.setCreatedBy("SYSTEM");
            month1.setCountDate(30);
            month1.setType(0);
            advertisingPackageRepository.save(month1);
            AdvertisingPackage month6 = new AdvertisingPackage();
            month6.setAdvertisingName("Gói 6 tháng");
            month6.setDes("Gói 3 tháng");
            month6.setPrice(540000.0);
            month6.setCreatedBy("SYSTEM");
            month6.setCountDate(180);
            month6.setType(0);
            advertisingPackageRepository.save(month6);
            AdvertisingPackage month12 = new AdvertisingPackage();
            month12.setAdvertisingName("Gói 12 tháng");
            month12.setDes("Gói 12 tháng");
            month12.setPrice(1020000.0);
            month12.setCreatedBy("SYSTEM");
            month12.setCountDate(365);
            month12.setType(0);
            advertisingPackageRepository.save(month12);
            AdvertisingPackage post10 = new AdvertisingPackage();
            post10.setAdvertisingName("10 bài đăng");
            post10.setDes("10 bài đăng");
            post10.setPrice(1020000.0);
            post10.setCreatedBy("SYSTEM");
            post10.setCountDate(10);
            post10.setType(1);
            advertisingPackageRepository.save(post10);
            AdvertisingPackage post20 = new AdvertisingPackage();
            post20.setAdvertisingName("20 bài đăng");
            post20.setDes("20 bài đăng");
            post20.setPrice(1020000.0);
            post20.setCreatedBy("SYSTEM");
            post20.setCountDate(20);
            post20.setType(1);
            advertisingPackageRepository.save(post20);
            AdvertisingPackage post30 = new AdvertisingPackage();
            post30.setAdvertisingName("30 bài đăng");
            post30.setDes("30 bài đăng");
            post30.setPrice(1020000.0);
            post30.setCreatedBy("SYSTEM");
            post30.setCountDate(30);
            post30.setType(1);
            advertisingPackageRepository.save(post30);
        }
    }

    private void createRoles() {
        log.info("Creating roles");
        if (!roleRepository.existsByName("ADMIN")) {
            Role admin = new Role();
            admin.setName("ADMIN");
            roleRepository.save(admin);
            log.info("Role 'ADMIN' created");
        }
        if (!roleRepository.existsByName("USER")) {
            Role admin = new Role();
            admin.setName("USER");
            roleRepository.save(admin);
            log.info("Role 'USER' created");
        }
    }

    private void createProvinces() {
        log.info("Creating provinces");
        if (provinceRepository.findAll().isEmpty()) {
            List<Province> provinces = Arrays.asList(
                    new Province(null, "01", "Hà Nội", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "02", "Hà Giang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "03", "Hải Phòng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "04", "Lào Cai", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "05", "Điện Biên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "06", "Lai Châu", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "07", "Sơn La", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "08", "Yên Bái", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "09", "Tuyên Quang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "10", "Thái Nguyên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "11", "Lạng Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "12", "Cao Bằng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "13", "Bắc Kạn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "14", "Hải Dương", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "15", "Hưng Yên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "16", "Thái Bình", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "17", "Hà Nam", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "18", "Nam Định", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "19", "Ninh Bình", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "20", "Thanh Hóa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "21", "Nghệ An", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "22", "Hà Tĩnh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "23", "Quảng Bình", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "24", "Quảng Trị", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "25", "Thừa Thiên Huế", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "26", "Đà Nẵng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "27", "Quảng Nam", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "28", "Quảng Ngãi", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "29", "Bình Định", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "30", "Phú Yên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "31", "Khánh Hòa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "32", "Ninh Thuận", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "33", "Bình Thuận", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "34", "Kon Tum", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "35", "Gia Lai", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "36", "Đắk Lắk", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "37", "Đắk Nông", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "38", "Lâm Đồng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "39", "Hồ Chí Minh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "40", "Bà Rịa - Vũng Tàu", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "41", "Bình Dương", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "42", "Đồng Nai", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "43", "Tây Ninh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "44", "Bình Phước", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "45", "Đồng Tháp", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "46", "An Giang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "47", "Kiên Giang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "48", "Cà Mau", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "49", "Vĩnh Long", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "50", "Bạc Liêu", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "51", "Hậu Giang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "52", "Sóc Trăng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "53", "Trà Vinh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "54", "Bến Tre", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "55", "Tiền Giang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin"),
                    new Province(null, "56", "Long An", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin")
            );
            provinceRepository.saveAll(provinces);
        }
    }

    private void createDistricts() {
        log.info("Creating district");
        if (districtRepository.findAll().isEmpty()) {

            Province binhDuong = provinceRepository.findByCode("41");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Bình Dương", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhDuong),
                    new District(null, "Thành phố Thủ Dầu Một", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhDuong),
                    new District(null, "Thị xã Dĩ An", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhDuong),
                    new District(null, "Thị xã Thuận An", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhDuong),
                    new District(null, "Huyện Bến Cát", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhDuong),
                    new District(null, "Huyện Dầu Tiếng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhDuong),
                    new District(null, "Huyện Phú Giáo", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhDuong),
                    new District(null, "Huyện Tân Uyên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhDuong)
            ));

            Province tayNinh = provinceRepository.findByCode("43");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Tây Ninh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tayNinh),
                    new District(null, "Thành phố Tây Ninh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tayNinh),
                    new District(null, "Huyện Bến Cầu", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tayNinh),
                    new District(null, "Huyện Gò Dầu", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tayNinh),
                    new District(null, "Huyện Hòa Thành", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tayNinh),
                    new District(null, "Huyện Dương Minh Châu", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tayNinh),
                    new District(null, "Huyện Trảng Bàng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tayNinh)
            ));

            Province longAn = provinceRepository.findByCode("56");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Long An", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", longAn),
                    new District(null, "Thành phố Tân An", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", longAn),
                    new District(null, "Huyện Bến Lức", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", longAn),
                    new District(null, "Huyện Đức Hòa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", longAn),
                    new District(null, "Huyện Đức Huệ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", longAn),
                    new District(null, "Huyện Thạnh Hóa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", longAn),
                    new District(null, "Huyện Mộc Hóa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", longAn),
                    new District(null, "Huyện Tân Hưng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", longAn),
                    new District(null, "Huyện Vĩnh Hưng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", longAn)
            ));

            Province tienGiang = provinceRepository.findByCode("55");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Tiền Giang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tienGiang),
                    new District(null, "Thành phố Mỹ Tho", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tienGiang),
                    new District(null, "Huyện Châu Thành", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tienGiang),
                    new District(null, "Huyện Gò Công Tây", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tienGiang),
                    new District(null, "Huyện Gò Công Đông", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tienGiang),
                    new District(null, "Huyện Tân Phú Đông", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tienGiang),
                    new District(null, "Huyện Cai Lậy", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tienGiang),
                    new District(null, "Huyện Cái Bè", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tienGiang)
            ));

            Province benTre = provinceRepository.findByCode("54");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Bến Tre", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", benTre),
                    new District(null, "Thành phố Bến Tre", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", benTre),
                    new District(null, "Huyện Châu Thành", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", benTre),
                    new District(null, "Huyện Giồng Trôm", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", benTre),
                    new District(null, "Huyện Bến Tre", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", benTre),
                    new District(null, "Huyện Bình Đại", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", benTre),
                    new District(null, "Huyện Mỏ Cày Nam", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", benTre),
                    new District(null, "Huyện Mỏ Cày Bắc", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", benTre)
            ));

            Province traVinh = provinceRepository.findByCode("53");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Trà Vinh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", traVinh),
                    new District(null, "Thành phố Trà Vinh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", traVinh),
                    new District(null, "Huyện Càng Long", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", traVinh),
                    new District(null, "Huyện Cầu Kè", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", traVinh),
                    new District(null, "Huyện Châu Thành", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", traVinh),
                    new District(null, "Huyện Tiểu Cần", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", traVinh),
                    new District(null, "Huyện Duyên Hải", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", traVinh),
                    new District(null, "Huyện Trà Cú", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", traVinh),
                    new District(null, "Huyện Ba Tri", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", traVinh)
            ));

            Province dongThap = provinceRepository.findByCode("45");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Đồng Tháp", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongThap),
                    new District(null, "Thành phố Cao Lãnh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongThap),
                    new District(null, "Thành phố Sa Đéc", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongThap),
                    new District(null, "Huyện Cao Lãnh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongThap),
                    new District(null, "Huyện Châu Thành", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongThap),
                    new District(null, "Huyện Hồng Ngự", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongThap),
                    new District(null, "Huyện Tam Nông", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongThap),
                    new District(null, "Huyện Tân Hồng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongThap),
                    new District(null, "Huyện Thanh Bình", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongThap),
                    new District(null, "Huyện Lấp Vò", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongThap),
                    new District(null, "Huyện Lai Vung", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongThap),
                    new District(null, "Huyện Định Hóa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongThap)
            ));

            Province socTrang = provinceRepository.findByCode("52");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Sóc Trăng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", socTrang),
                    new District(null, "Thành phố Sóc Trăng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", socTrang),
                    new District(null, "Huyện Kế Sách", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", socTrang),
                    new District(null, "Huyện Mỹ Tú", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", socTrang),
                    new District(null, "Huyện Châu Thành", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", socTrang),
                    new District(null, "Huyện Long Phú", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", socTrang),
                    new District(null, "Huyện Thạnh Trị", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", socTrang),
                    new District(null, "Huyện Trần Đề", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", socTrang)
            ));

            Province hauGiang = provinceRepository.findByCode("51");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Hậu Giang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hauGiang),
                    new District(null, "Thành phố Vị Thanh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hauGiang),
                    new District(null, "Thị xã Ngã Bảy", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hauGiang),
                    new District(null, "Huyện Châu Thành", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hauGiang),
                    new District(null, "Huyện Long Mỹ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hauGiang),
                    new District(null, "Huyện Vị Thủy", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hauGiang),
                    new District(null, "Huyện Phụng Hiệp", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hauGiang)
            ));

            Province bacLieu = provinceRepository.findByCode("50");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Bạc Liêu", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", bacLieu),
                    new District(null, "Thành phố Bạc Liêu", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", bacLieu),
                    new District(null, "Huyện Bạc Liêu", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", bacLieu),
                    new District(null, "Huyện Vĩnh Lợi", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", bacLieu),
                    new District(null, "Huyện Hồng Dân", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", bacLieu),
                    new District(null, "Huyện Giá Rai", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", bacLieu)
            ));

            Province vinhLong = provinceRepository.findByCode("49");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Vĩnh Long", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", vinhLong),
                    new District(null, "Thành phố Vĩnh Long", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", vinhLong),
                    new District(null, "Huyện Vũng Liêm", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", vinhLong),
                    new District(null, "Huyện Tam Bình", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", vinhLong),
                    new District(null, "Huyện Long Hồ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", vinhLong),
                    new District(null, "Huyện Mang Thít", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", vinhLong),
                    new District(null, "Huyện Bình Tân", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", vinhLong)
            ));

            Province caMau = provinceRepository.findByCode("48");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Cà Mau", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", caMau),
                    new District(null, "Thành phố Cà Mau", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", caMau),
                    new District(null, "Huyện Cái Nước", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", caMau),
                    new District(null, "Huyện Đầm Dơi", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", caMau),
                    new District(null, "Huyện Thới Bình", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", caMau),
                    new District(null, "Huyện U Minh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", caMau),
                    new District(null, "Huyện Trần Văn Thời", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", caMau),
                    new District(null, "Huyện Năm Căn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", caMau),
                    new District(null, "Huyện Phú Tân", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", caMau)
            ));

            Province kienGiang = provinceRepository.findByCode("47");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Kiên Giang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", kienGiang),
                    new District(null, "Thành phố Rạch Giá", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", kienGiang),
                    new District(null, "Thị xã Hà Tiên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", kienGiang),
                    new District(null, "Huyện Kiên Hải", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", kienGiang),
                    new District(null, "Huyện Phú Quốc", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", kienGiang),
                    new District(null, "Huyện An Biên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", kienGiang),
                    new District(null, "Huyện An Minh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", kienGiang),
                    new District(null, "Huyện Vĩnh Thuận", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", kienGiang),
                    new District(null, "Huyện Tân Hiệp", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", kienGiang),
                    new District(null, "Huyện Giang Thành", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", kienGiang)
            ));

            Province anGiang = provinceRepository.findByCode("46");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "An Giang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", anGiang),
                    new District(null, "Thành phố Long Xuyên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", anGiang),
                    new District(null, "Thành phố Châu Đốc", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", anGiang),
                    new District(null, "Huyện Châu Phú", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", anGiang),
                    new District(null, "Huyện Thoại Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", anGiang),
                    new District(null, "Huyện Tịnh Biên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", anGiang),
                    new District(null, "Huyện Tri Tôn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", anGiang),
                    new District(null, "Huyện Châu Thành", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", anGiang),
                    new District(null, "Huyện Phú Tân", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", anGiang)
            ));

            Province binhPhuoc = provinceRepository.findByCode("44");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Bình Phước", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhPhuoc),
                    new District(null, "Thành phố Đồng Xoài", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhPhuoc),
                    new District(null, "Thị xã Phước Long", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhPhuoc),
                    new District(null, "Huyện Bù Đăng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhPhuoc),
                    new District(null, "Huyện Bù Gia Mập", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhPhuoc),
                    new District(null, "Huyện Chơn Thành", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhPhuoc),
                    new District(null, "Huyện Đồng Phú", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhPhuoc),
                    new District(null, "Huyện Hớn Quản", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhPhuoc),
                    new District(null, "Huyện Lộc Ninh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhPhuoc),
                    new District(null, "Huyện Phú Riềng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhPhuoc)
            ));


            Province dongNai = provinceRepository.findByCode("42");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Đồng Nai", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongNai),
                    new District(null, "Thành phố Biên Hòa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongNai),
                    new District(null, "Thành phố Long Khánh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongNai),
                    new District(null, "Huyện Nhơn Trạch", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongNai),
                    new District(null, "Huyện Vĩnh Cửu", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongNai),
                    new District(null, "Huyện Định Quán", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongNai),
                    new District(null, "Huyện Xuân Lộc", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongNai),
                    new District(null, "Huyện Tân Phú", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongNai),
                    new District(null, "Huyện Trảng Bom", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongNai),
                    new District(null, "Huyện Long Thành", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dongNai)
            ));

            Province baRiaVungTau = provinceRepository.findByCode("40");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Bà Rịa - Vũng Tàu", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", baRiaVungTau),
                    new District(null, "Thành phố Vũng Tàu", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", baRiaVungTau),
                    new District(null, "Thành phố Bà Rịa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", baRiaVungTau),
                    new District(null, "Huyện Châu Đức", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", baRiaVungTau),
                    new District(null, "Huyện Đất Đỏ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", baRiaVungTau),
                    new District(null, "Huyện Long Điền", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", baRiaVungTau),
                    new District(null, "Huyện Xuyên Mộc", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", baRiaVungTau),
                    new District(null, "Huyện Tân Thành", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", baRiaVungTau)
            ));

            Province hoChiMinh = provinceRepository.findByCode("39");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Hồ Chí Minh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Quận 1", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Quận 2", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Quận 3", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Quận 4", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Quận 5", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Quận 6", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Quận 7", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Quận 8", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Quận 9", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Quận 10", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Quận 11", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Quận 12", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Thủ Đức", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Bình Thạnh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Tân Bình", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Tân Phú", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Gò Vấp", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Phú Nhuận", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Nhà Bè", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Hóc Môn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Củ Chi", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh),
                    new District(null, "Bình Chánh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hoChiMinh)
            ));

            Province lamDong = provinceRepository.findByCode("38");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Lâm Đồng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", lamDong),
                    new District(null, "Thành phố Đà Lạt", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", lamDong),
                    new District(null, "Bảo Lộc", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", lamDong),
                    new District(null, "Đơn Dương", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", lamDong),
                    new District(null, "Lạc Dương", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", lamDong),
                    new District(null, "Lâm Hà", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", lamDong),
                    new District(null, "Đạ Huoai", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", lamDong),
                    new District(null, "Đạ Tẻh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", lamDong),
                    new District(null, "Ninh Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", lamDong),
                    new District(null, "Đức Trọng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", lamDong)
            ));

            Province dakNong = provinceRepository.findByCode("37");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Đắk Nông", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakNong),
                    new District(null, "Thành phố Gia Nghĩa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakNong),
                    new District(null, "Đắk Glong", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakNong),
                    new District(null, "Đắk Mil", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakNong),
                    new District(null, "Cư Jút", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakNong),
                    new District(null, "Krông Nô", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakNong),
                    new District(null, "Tâm Nông", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakNong),
                    new District(null, "Đắk Song", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakNong)
            ));

            Province dakLak = provinceRepository.findByCode("36");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Đắk Lắk", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakLak),
                    new District(null, "Thành phố Buôn Ma Thuột", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakLak),
                    new District(null, "Buôn Hồ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakLak),
                    new District(null, "Krông Búk", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakLak),
                    new District(null, "Ea H'leo", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakLak),
                    new District(null, "Cư M'gar", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakLak),
                    new District(null, "Krông Năng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakLak),
                    new District(null, "Ea Súp", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakLak),
                    new District(null, "M'Đrắk", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakLak),
                    new District(null, "Buôn Đôn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakLak),
                    new District(null, "Lắk", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakLak),
                    new District(null, "Đắk Mil", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakLak),
                    new District(null, "Đắk Song", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakLak),
                    new District(null, "Ea H'leo", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dakLak)
            ));

            Province giaLai = provinceRepository.findByCode("35");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Gia Lai", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", giaLai),
                    new District(null, "Thành phố Pleiku", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", giaLai),
                    new District(null, "An Khê", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", giaLai),
                    new District(null, "Chư Prông", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", giaLai),
                    new District(null, "Chư Sê", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", giaLai),
                    new District(null, "Đăk Đoa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", giaLai),
                    new District(null, "Mang Yang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", giaLai),
                    new District(null, "Kông Chro", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", giaLai),
                    new District(null, "Krông Pa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", giaLai),
                    new District(null, "Ia Grai", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", giaLai),
                    new District(null, "Ia Pa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", giaLai),
                    new District(null, "Phú Thiện", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", giaLai),
                    new District(null, "Vĩnh Thạnh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", giaLai)
            ));

            Province konTum = provinceRepository.findByCode("34");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Kon Tum", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", konTum),
                    new District(null, "Thành phố Kon Tum", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", konTum),
                    new District(null, "Đắk Glei", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", konTum),
                    new District(null, "Ngọc Hồi", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", konTum),
                    new District(null, "Đắk Tô", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", konTum),
                    new District(null, "Kon Plong", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", konTum),
                    new District(null, "Sa Thầy", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", konTum),
                    new District(null, "Tu Mơ Rông", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", konTum)
            ));

            Province quangNam = provinceRepository.findByCode("27");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Quảng Nam", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Thành phố Tam Kỳ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Thành phố Hội An", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Điện Bàn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Duy Xuyên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Hội An", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Quế Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Nam Giang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Phước Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Nông Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Tiên Phước", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Bắc Trà My", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Nam Trà My", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Hương An", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Núi Thành", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Phú Ninh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Thăng Bình", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Tam Kỳ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Trà My", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Quế Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam),
                    new District(null, "Hòa Vang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNam)
            ));

            Province binhThuan = provinceRepository.findByCode("33");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Bình Thuận", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhThuan),
                    new District(null, "Thành phố Phan Thiết", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhThuan),
                    new District(null, "La Gi", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhThuan),
                    new District(null, "Tánh Linh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhThuan),
                    new District(null, "Hàm Tân", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhThuan),
                    new District(null, "Hàm Thuận Bắc", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhThuan),
                    new District(null, "Hàm Thuận Nam", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhThuan),
                    new District(null, "Phú Quý", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhThuan)
            ));

            Province ninhThuan = provinceRepository.findByCode("32");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Ninh Thuận", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ninhThuan),
                    new District(null, "Thành phố Phan Rang-Tháp Chàm", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ninhThuan),
                    new District(null, "Ninh Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ninhThuan),
                    new District(null, "Ninh Hải", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ninhThuan),
                    new District(null, "Bác Ái", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ninhThuan),
                    new District(null, "Thuận Bắc", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ninhThuan),
                    new District(null, "Thuận Nam", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ninhThuan)
            ));

            Province khanhHoa = provinceRepository.findByCode("31");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Khánh Hòa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", khanhHoa),
                    new District(null, "Thành phố Nha Trang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", khanhHoa),
                    new District(null, "Cam Ranh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", khanhHoa),
                    new District(null, "Vạn Ninh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", khanhHoa),
                    new District(null, "Ninh Hòa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", khanhHoa),
                    new District(null, "Khánh Vĩnh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", khanhHoa),
                    new District(null, "Diên Khánh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", khanhHoa),
                    new District(null, "Trường Sa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", khanhHoa)
            ));

            Province phuYen = provinceRepository.findByCode("30");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Phú Yên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", phuYen),
                    new District(null, "Thành phố Tuy Hòa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", phuYen),
                    new District(null, "Sông Hinh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", phuYen),
                    new District(null, "Đồng Xuân", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", phuYen),
                    new District(null, "Tuy An", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", phuYen),
                    new District(null, "Phú Hòa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", phuYen),
                    new District(null, "Son Hòa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", phuYen),
                    new District(null, "Trần Đề", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", phuYen)
            ));

            Province binhDinh = provinceRepository.findByCode("29");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Bình Định", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhDinh),
                    new District(null, "Thành phố Quy Nhơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhDinh),
                    new District(null, "An Nhơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhDinh),
                    new District(null, "Tuy Phước", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhDinh),
                    new District(null, "Vĩnh Thạnh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhDinh),
                    new District(null, "Hoài Nhơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhDinh),
                    new District(null, "Phù Cát", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhDinh),
                    new District(null, "Phù Mỹ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", binhDinh)
            ));

            Province quangNgai = provinceRepository.findByCode("28");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Quảng Ngãi", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNgai),
                    new District(null, "Thành phố Quảng Ngãi", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNgai),
                    new District(null, "Bình Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNgai),
                    new District(null, "Sơn Tịnh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNgai),
                    new District(null, "Tư Nghĩa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNgai),
                    new District(null, "Mộ Đức", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNgai),
                    new District(null, "Nghĩa Hành", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNgai),
                    new District(null, "Đức Phổ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangNgai)
            ));

            Province daNang = provinceRepository.findByCode("26");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Đà Nẵng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", daNang),
                    new District(null, "Hải Châu", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", daNang),
                    new District(null, "Thanh Khê", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", daNang),
                    new District(null, "Liên Chiểu", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", daNang),
                    new District(null, "Ngũ Hành Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", daNang),
                    new District(null, "Sơn Trà", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", daNang),
                    new District(null, "Hòa Vang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", daNang),
                    new District(null, "Cẩm Lệ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", daNang)
            ));

            Province thuaThienHue = provinceRepository.findByCode("25");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Thừa Thiên Huế", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thuaThienHue),
                    new District(null, "Thành phố Huế", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thuaThienHue),
                    new District(null, "Hương Thủy", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thuaThienHue),
                    new District(null, "Hương Trà", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thuaThienHue),
                    new District(null, "Phong Điền", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thuaThienHue),
                    new District(null, "Quảng Điền", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thuaThienHue),
                    new District(null, "Phú Vang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thuaThienHue),
                    new District(null, "Nam Đông", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thuaThienHue)
            ));

            Province quangTri = provinceRepository.findByCode("24");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Quảng Trị", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangTri),
                    new District(null, "Thành phố Đông Hà", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangTri),
                    new District(null, "Gio Linh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangTri),
                    new District(null, "Vĩnh Linh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangTri),
                    new District(null, "Cam Lộ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangTri),
                    new District(null, "Hướng Hóa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangTri),
                    new District(null, "Đakrông", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangTri)
            ));

            Province quangBinh = provinceRepository.findByCode("23");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Quảng Bình", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangBinh),
                    new District(null, "Thành phố Đồng Hới", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangBinh),
                    new District(null, "Bố Trạch", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangBinh),
                    new District(null, "Quảng Trạch", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangBinh),
                    new District(null, "Lệ Thủy", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangBinh),
                    new District(null, "Tuyên Hóa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", quangBinh)
            ));

            Province haTinh = provinceRepository.findByCode("22");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Hà Tĩnh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haTinh),
                    new District(null, "Thành phố Hà Tĩnh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haTinh),
                    new District(null, "Hương Khê", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haTinh),
                    new District(null, "Nghi Xuân", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haTinh),
                    new District(null, "Can Lộc", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haTinh),
                    new District(null, "Kỳ Anh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haTinh),
                    new District(null, "Lộc Hà", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haTinh),
                    new District(null, "Thạch Hà", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haTinh)
            ));

            Province ngheAn = provinceRepository.findByCode("21");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Nghệ An", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ngheAn),
                    new District(null, "Thành phố Vinh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ngheAn),
                    new District(null, "Thị xã Cửa Lò", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ngheAn),
                    new District(null, "Đô Lương", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ngheAn),
                    new District(null, "Quỳnh Lưu", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ngheAn),
                    new District(null, "Nghi Lộc", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ngheAn),
                    new District(null, "Hưng Nguyên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ngheAn),
                    new District(null, "Yên Thành", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ngheAn),
                    new District(null, "Nam Đàn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ngheAn),
                    new District(null, "Con Cuông", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ngheAn)
            ));

            Province thanhHoa = provinceRepository.findByCode("20");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Thanh Hóa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thanhHoa),
                    new District(null, "Bỉm Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thanhHoa),
                    new District(null, "Sầm Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thanhHoa),
                    new District(null, "Thanh Trì", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thanhHoa),
                    new District(null, "Nông Cống", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thanhHoa),
                    new District(null, "Đông Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thanhHoa),
                    new District(null, "Thường Xuân", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thanhHoa),
                    new District(null, "Triệu Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thanhHoa),
                    new District(null, "Quảng Xương", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thanhHoa),
                    new District(null, "Thạch Thành", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thanhHoa),
                    new District(null, "Hậu Lộc", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thanhHoa),
                    new District(null, "Hoằng Hóa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thanhHoa),
                    new District(null, "Nga Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thanhHoa),
                    new District(null, "Tĩnh Gia", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thanhHoa),
                    new District(null, "Mường Lát", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thanhHoa),
                    new District(null, "Quan Hóa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thanhHoa),
                    new District(null, "Lang Chánh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thanhHoa),
                    new District(null, "Như Xuân", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thanhHoa),
                    new District(null, "Như Thanh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thanhHoa)
            ));

            Province ninhBinh = provinceRepository.findByCode("19");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Ninh Bình", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ninhBinh),
                    new District(null, "Tam Điệp", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ninhBinh),
                    new District(null, "Nho Quan", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ninhBinh),
                    new District(null, "Gia Viễn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ninhBinh),
                    new District(null, "Hoa Lư", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ninhBinh),
                    new District(null, "Yên Khánh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ninhBinh),
                    new District(null, "Kim Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", ninhBinh)
            ));

            Province namDinh = provinceRepository.findByCode("18");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Nam Định", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", namDinh),
                    new District(null, "Nam Trực", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", namDinh),
                    new District(null, "Nghĩa Hưng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", namDinh),
                    new District(null, "Trực Ninh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", namDinh),
                    new District(null, "Vụ Bản", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", namDinh),
                    new District(null, "Ý Yên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", namDinh),
                    new District(null, "Thành phố Nam Định", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", namDinh)
            ));

            Province haNam = provinceRepository.findByCode("17");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Hà Nam", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haNam),
                    new District(null, "Phủ Lý", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haNam),
                    new District(null, "Duy Tiên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haNam),
                    new District(null, "Kim Bảng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haNam),
                    new District(null, "Thanh Liêm", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haNam),
                    new District(null, "Lý Nhân", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haNam)
            ));

            Province thaiBinh = provinceRepository.findByCode("16");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Thái Bình", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thaiBinh),
                    new District(null, "Thành phố Thái Bình", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thaiBinh),
                    new District(null, "Quỳnh Phụ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thaiBinh),
                    new District(null, "Hưng Hà", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thaiBinh),
                    new District(null, "Đại Lộc", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thaiBinh),
                    new District(null, "Tiền Hải", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thaiBinh),
                    new District(null, "Thái Thụy", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thaiBinh),
                    new District(null, "Vũ Thư", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thaiBinh)
            ));

            Province hungYen = provinceRepository.findByCode("15");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Hưng Yên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hungYen),
                    new District(null, "Mỹ Hào", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hungYen),
                    new District(null, "Khoái Châu", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hungYen),
                    new District(null, "Ân Thi", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hungYen),
                    new District(null, "Tiên Lữ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hungYen),
                    new District(null, "Văn Lâm", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hungYen),
                    new District(null, "Văn Giang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hungYen),
                    new District(null, "Yên Mỹ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hungYen),
                    new District(null, "Huyện Kim Động", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hungYen),
                    new District(null, "Thành phố Hưng Yên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hungYen)
            ));

            Province haiDuong = provinceRepository.findByCode("14");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Hải Dương", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiDuong),
                    new District(null, "Chí Linh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiDuong),
                    new District(null, "Kim Thành", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiDuong),
                    new District(null, "Thanh Hà", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiDuong),
                    new District(null, "Tứ Kỳ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiDuong),
                    new District(null, "Cẩm Giàng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiDuong),
                    new District(null, "Nam Sách", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiDuong),
                    new District(null, "Bình Giang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiDuong),
                    new District(null, "Gia Lộc", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiDuong),
                    new District(null, "Ninh Giang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiDuong),
                    new District(null, "Tân Việt", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiDuong),
                    new District(null, "Kim Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiDuong),
                    new District(null, "Thành phố Hải Dương", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiDuong)
            ));

            Province bacKan = provinceRepository.findByCode("13");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Bắc Kạn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", bacKan),
                    new District(null, "Ba Bể", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", bacKan),
                    new District(null, "Bạch Thông", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", bacKan),
                    new District(null, "Chợ Đồn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", bacKan),
                    new District(null, "Chợ Mới", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", bacKan),
                    new District(null, "Ngân Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", bacKan),
                    new District(null, "Pác Nặm", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", bacKan),
                    new District(null, "Thạch An", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", bacKan)
            ));

            Province caoBang = provinceRepository.findByCode("12");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Cao Bằng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", caoBang),
                    new District(null, "Bảo Lạc", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", caoBang),
                    new District(null, "Bảo Lâm", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", caoBang),
                    new District(null, "Thạch An", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", caoBang),
                    new District(null, "Nguyên Bình", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", caoBang),
                    new District(null, "Hà Quảng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", caoBang),
                    new District(null, "Trà Lĩnh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", caoBang),
                    new District(null, "Trùng Khánh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", caoBang),
                    new District(null, "Phục Hòa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", caoBang),
                    new District(null, "Quảng Hòa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", caoBang)
            ));

            Province langSon = provinceRepository.findByCode("11");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Lạng Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", langSon),
                    new District(null, "Tràng Định", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", langSon),
                    new District(null, "Văn Lãng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", langSon),
                    new District(null, "Cao Lộc", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", langSon),
                    new District(null, "Đồng Đăng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", langSon),
                    new District(null, "Lộc Bình", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", langSon),
                    new District(null, "Chi Lăng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", langSon),
                    new District(null, "Hữu Lũng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", langSon),
                    new District(null, "Đình Lập", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", langSon),
                    new District(null, "Bắc Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", langSon),
                    new District(null, "Nguyên Bình", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", langSon)
            ));

            Province thaiNguyen = provinceRepository.findByCode("10");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Thái Nguyên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thaiNguyen),
                    new District(null, "Sông Công", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thaiNguyen),
                    new District(null, "Đại Từ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thaiNguyen),
                    new District(null, "Phổ Yên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thaiNguyen),
                    new District(null, "Phú Bình", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thaiNguyen),
                    new District(null, "Võ Nhai", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thaiNguyen),
                    new District(null, "Định Hóa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thaiNguyen),
                    new District(null, "TP. Thái Nguyên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", thaiNguyen)
            ));

            Province tuyenQuang = provinceRepository.findByCode("09");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Tuyên Quang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tuyenQuang),
                    new District(null, "Chiêm Hóa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tuyenQuang),
                    new District(null, "Hàm Yên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tuyenQuang),
                    new District(null, "Na Hang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tuyenQuang),
                    new District(null, "Yên Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tuyenQuang),
                    new District(null, "Sơn Dương", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", tuyenQuang)
            ));

            Province yenBai = provinceRepository.findByCode("08");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Yên Bái", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", yenBai),
                    new District(null, "Lục Yên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", yenBai),
                    new District(null, "Văn Yên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", yenBai),
                    new District(null, "Trấn Yên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", yenBai),
                    new District(null, "Mù Cang Chải", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", yenBai),
                    new District(null, "Văn Chấn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", yenBai),
                    new District(null, "Đình Lập", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", yenBai),
                    new District(null, "Yên Bình", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", yenBai)
            ));

            Province sonLa = provinceRepository.findByCode("07");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Sơn La", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", sonLa),
                    new District(null, "Sốp Cộp", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", sonLa),
                    new District(null, "Mộc Châu", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", sonLa),
                    new District(null, "Mai Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", sonLa),
                    new District(null, "Yên Châu", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", sonLa),
                    new District(null, "Vân Hồ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", sonLa),
                    new District(null, "Phù Yên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", sonLa),
                    new District(null, "Quỳnh Nhai", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", sonLa),
                    new District(null, "Thường Xuân", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", sonLa)
            ));

            Province laiChau = provinceRepository.findByCode("06");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Lai Châu", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", laiChau),
                    new District(null, "Tam Đường", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", laiChau),
                    new District(null, "Mường Tè", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", laiChau),
                    new District(null, "Sìn Hồ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", laiChau),
                    new District(null, "Nậm Nhùn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", laiChau),
                    new District(null, "Phong Thổ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", laiChau),
                    new District(null, "Tân Uyên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", laiChau)
            ));

            Province dienBien = provinceRepository.findByCode("05");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Điện Biên Phủ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dienBien),
                    new District(null, "Mường Nhé", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dienBien),
                    new District(null, "Mường Lay", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dienBien),
                    new District(null, "Điện Biên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dienBien),
                    new District(null, "Tủa Chùa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dienBien),
                    new District(null, "Nậm Pồ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dienBien),
                    new District(null, "Tuần Giáo", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", dienBien)
            ));

            Province hanoi = provinceRepository.findByCode("01");
            districtRepository.saveAll(Arrays.asList(
                    new District(null, "Ba Đình", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Hoàn Kiếm", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Đống Đa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Hai Bà Trưng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Hoàng Mai", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Thanh Xuân", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Nam Từ Liêm", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Bắc Từ Liêm", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Tây Hồ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Hà Đông", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Đông Anh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Sóc Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Mê Linh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Thanh Trì", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Chương Mỹ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Ba Vì", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Đan Phượng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Hoài Đức", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Sơn Tây", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Thanh Oai", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Thường Tín", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi),
                    new District(null, "Ứng Hòa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", hanoi)
            ));
        }
        Province haGiang = provinceRepository.findByCode("02");
        districtRepository.saveAll(Arrays.asList(
                new District(null, "Hà Giang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haGiang),
                new District(null, "Đồng Văn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haGiang),
                new District(null, "Mèo Vạc", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haGiang),
                new District(null, "Vị Xuyên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haGiang),
                new District(null, "Quang Bình", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haGiang),
                new District(null, "Tuyên Quang", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haGiang),
                new District(null, "Yên Minh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haGiang),
                new District(null, "Hoàng Su Phì", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haGiang),
                new District(null, "Xín Mần", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haGiang),
                new District(null, "Bắc Mê", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haGiang),
                new District(null, "Vi Xuyên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haGiang)
        ));
        Province haiPhong = provinceRepository.findByCode("03");
        districtRepository.saveAll(Arrays.asList(
                new District(null, "Hồng Bàng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiPhong),
                new District(null, "Ngô Quyền", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiPhong),
                new District(null, "Lê Chân", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiPhong),
                new District(null, "Hải An", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiPhong),
                new District(null, "Kiến An", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiPhong),
                new District(null, "Đồ Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiPhong),
                new District(null, "Dương Kinh", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiPhong),
                new District(null, "Thủy Nguyên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiPhong),
                new District(null, "An Dương", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiPhong),
                new District(null, "Tiên Lãng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiPhong),
                new District(null, "Vĩnh Bảo", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiPhong),
                new District(null, "An Lão", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiPhong),
                new District(null, "Bạch Long Vĩ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiPhong),
                new District(null, "Cát Hải", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiPhong),
                new District(null, "Đồ Sơn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiPhong),
                new District(null, "Thủy Nguyên", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiPhong),
                new District(null, "Tiên Lãng", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiPhong),
                new District(null, "Vĩnh Bảo", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", haiPhong)
        ));
        Province laoCai = provinceRepository.findByCode("04");
        districtRepository.saveAll(Arrays.asList(
                new District(null, "Lào Cai", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", laoCai),
                new District(null, "Sa Pa", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", laoCai),
                new District(null, "Bát Xát", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", laoCai),
                new District(null, "Mường Khương", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", laoCai),
                new District(null, "Văn Bàn", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", laoCai),
                new District(null, "Si Ma Cai", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", laoCai),
                new District(null, "Bắc Hà", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", laoCai),
                new District(null, "Điện Biên Phủ", OffsetDateTime.now(), "admin", OffsetDateTime.now(), "admin", laoCai)
        ));

    }
}
