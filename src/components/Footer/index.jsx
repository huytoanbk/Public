import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10 text-sm">
      <div className="max-w-6xl mx-auto px-4">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <p className="text-lg font-bold">TÌM BẤT ĐỘNG SẢN TRÊN ỨNG DỤNG MOTELJOY</p>
            <div className="flex items-center gap-4">
              <picture>
                <source
                  type="image/webp"
                  srcSet="https://static.chotot.com/storage/default/group-qr.webp"
                />
                <img
                  alt="MotelJoy"
                  src="https://static.chotot.com/storage/default/group-qr.jpeg"
                  width="87"
                  height="87"
                />
              </picture>
              <ul className="space-y-2">
                <li>
                  <a
                    href="http://localhost:3000/app-store"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    <img
                      alt="App Store"
                      src="https://static.chotot.com/storage/default/ios.svg"
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="http://localhost:3000/play-store"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    <img
                      alt="Google Play"
                      src="https://static.chotot.com/storage/default/android.svg"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-lg font-bold">VỀ MOTELJOY</p>
            <ul className="space-y-2">
              <li><a href="http://localhost:3000/ve-moteljoy" className="hover:text-teal-400">Về MotelJoy</a></li>
              <li><a href="http://localhost:3000/quy-che-hoat-dong" className="hover:text-teal-400">Quy chế hoạt động sàn</a></li>
              <li><a href="http://localhost:3000/chinh-sach-bao-mat" className="hover:text-teal-400">Chính sách bảo mật</a></li>
              <li><a href="http://localhost:3000/giai-quyet-tranh-chap" className="hover:text-teal-400">Giải quyết tranh chấp</a></li>
              <li><a href="http://localhost:3000/dieu-khoan-su-dung" className="hover:text-teal-400">Điều khoản sử dụng</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-lg font-bold">Liên kết</p>
            <ul className="flex space-x-4">
              <li>
                <a
                  href="https://www.facebook.com/moteljoy"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <img
                    alt="Facebook"
                    width="32"
                    height="32"
                    src="https://static.chotot.com/storage/default/facebook.svg"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/MotelJoy"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <img
                    alt="Youtube"
                    width="32"
                    height="32"
                    src="https://static.chotot.com/storage/default/youtube.svg"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/company/moteljoy"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <img
                    alt="LinkedIn"
                    width="32"
                    height="32"
                    src="https://static.chotot.com/storage/default/linkedin.svg"
                  />
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-lg font-bold">Chứng nhận</p>
            <ul className="space-y-2">
              <li>
                <a
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  href="http://localhost:3000/certificate"
                >
                  <picture>
                    <source
                      type="image/webp"
                      width="130"
                      height="40"
                      srcSet="https://static.chotot.com/storage/default/certificate.webp"
                    />
                    <img
                      alt="Certification"
                      width="130"
                      height="40"
                      src="https://static.chotot.com/storage/default/cerfiticate.png"
                    />
                  </picture>
                </a>
              </li>
            </ul>
          </div>
        </section>

        <hr className="my-8 border-gray-600" />

        <section className="text-xs">
          <address className="not-italic">
            CÔNG TY TNHH MOTELJOY - Người đại diện theo pháp luật: Nguyễn Trọng Tấn; GPDKKD: 0312120782
            do Sở KH & ĐT TP.HCM cấp ngày 11/01/2013;
            <br />
            GPMXH: 322/GP-BTTTT do Bộ Thông tin và Truyền thông cấp ngày 31/08/2023 - Chịu trách nhiệm nội dung: Trần Nguyễn Hoàng Uyên.
            <a href="http://localhost:3000/chinh-sach-su-dung" className="text-teal-400 hover:underline">
              Chính sách sử dụng
            </a>
            <br />
            Địa chỉ: Tầng 18, Toà nhà UOA, Số 6 đường Tân Trào, Phường Tân Phú, Quận 7, TP. HCM; Email: trogiup@moteljoy.com
            - Tổng đài CSKH: 19003003 (1.000đ/phút)
          </address>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
