import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import styles from './Policy.module.css';
import { IoShieldCheckmarkOutline, IoArrowBackOutline, IoLockClosedOutline, IoBoatOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const Policy = () => {
  const { slug } = useParams();

  const policies = {
    'doi-tra': {
      title: 'Chính sách đổi trả',
      icon: <IoShieldCheckmarkOutline />,
      content: (
        <div className={styles.content}>
          <h3>1. Thời hạn đổi trả</h3>
          <p>ThanhStore chấp nhận đổi trả sản phẩm trong vòng <strong>7 ngày</strong> kể từ ngày quý khách nhận được hàng thành công.</p>
          
          <h3>2. Điều kiện đổi trả</h3>
          <ul>
            <li>Sách còn nguyên vẹn, không bị rách, nát, viết vẽ hoặc làm bẩn.</li>
            <li>Còn nguyên tem mác, bao bì (nếu có).</li>
            <li>Sách bị lỗi do nhà sản xuất (in sai trang, mất trang, lỗi in ấn).</li>
            <li>Sách bị hư hỏng do quá trình vận chuyển của cửa hàng.</li>
          </ul>

          <h3>3. Quy trình thực hiện</h3>
          <p>Quý khách vui lòng liên hệ hotline <strong>0123 456 789</strong> hoặc email <strong>thanhtore@gmail.com</strong> kèm theo hình ảnh/video minh chứng lỗi sản phẩm. Chúng tôi sẽ phản hồi và hướng dẫn chi tiết trong vòng 24h.</p>

          <h3>4. Chi phí vận chuyển</h3>
          <p>Nếu lỗi thuộc về ThanhStore hoặc nhà sản xuất, chúng tôi sẽ chịu 100% phí vận chuyển đổi trả. Trường hợp khách hàng đổi ý (không do lỗi sản phẩm), quý khách vui lòng thanh toán phí vận chuyển 2 chiều.</p>
        </div>
      )
    },
    'van-chuyen': {
      title: 'Chính sách vận chuyển',
      icon: <IoBoatOutline />,
      content: (
        <div className={styles.content}>
          <h3>1. Phạm vi giao hàng</h3>
          <p>ThanhStore hỗ trợ giao hàng tận nơi trên toàn quốc (63 tỉnh thành) thông qua các đối tác vận chuyển uy tín như Giao Hàng Tiết Kiệm, Viettel Post.</p>

          <h3>2. Thời gian giao hàng dự kiến</h3>
          <ul>
            <li><strong>Khu vực Hà Nội:</strong> 1 - 2 ngày làm việc.</li>
            <li><strong>Các tỉnh miền Bắc:</strong> 2 - 3 ngày làm việc.</li>
            <li><strong>Miền Trung & Miền Nam:</strong> 3 - 5 ngày làm việc.</li>
          </ul>

          <h3>3. Phí vận chuyển</h3>
          <p>Phí vận chuyển được tính dựa trên trọng lượng đơn hàng và địa chỉ nhận hàng. ThanhStore áp dụng chính sách <strong>Miễn phí vận chuyển</strong> cho đơn hàng có tổng giá trị từ <strong>300.000đ</strong> trở lên.</p>

          <h3>4. Kiểm tra hàng hóa</h3>
          <p>Quý khách được quyền kiểm tra ngoại quan gói hàng trước khi thanh toán cho nhân viên giao nhận. Vui lòng quay video lúc mở hộp để được hỗ trợ tốt nhất nếu có khiếu nại.</p>
        </div>
      )
    },
    'bao-mat': {
      title: 'Bảo mật thông tin',
      icon: <IoLockClosedOutline />,
      content: (
        <div className={styles.content}>
          <h3>1. Mục đích thu thập thông tin</h3>
          <p>Chúng tôi thu thập thông tin cá nhân (họ tên, số điện thoại, email, địa chỉ) chỉ nhằm mục đích xử lý đơn hàng, giao hàng và thông báo các ưu đãi đặc quyền cho thành viên.</p>

          <h3>2. Cam kết bảo mật</h3>
          <p>ThanhStore cam kết không chia sẻ, bán hoặc cho thuê thông tin của quý khách cho bất kỳ bên thứ ba nào khi chưa có sự đồng ý, trừ trường hợp cung cấp cho đơn vị vận chuyển để thực hiện giao hàng.</p>

          <h3>3. Quyền lợi của khách hàng</h3>
          <p>Quý khách có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa bỏ thông tin cá nhân của mình trên hệ thống bất kỳ lúc nào bằng cách đăng nhập vào tài khoản hoặc liên hệ với chúng tôi.</p>

          <h3>4. Sử dụng Cookie</h3>
          <p>Chúng tôi sử dụng cookie để ghi nhớ phiên đăng nhập và giỏ hàng của bạn, giúp trải nghiệm mua sắm diễn ra mượt mà và thuận tiện hơn.</p>
        </div>
      )
    }
  };

  const currentPolicy = policies[slug] || policies['doi-tra'];

  return (
    <div className={styles.policyPage}>
      <div className={styles.header}>
        <Container>
          <Link to="/" className={styles.backLink}><IoArrowBackOutline /> Quay lại trang chủ</Link>
          <div className={styles.titleBlock}>
            <div className={styles.icon}>{currentPolicy.icon}</div>
            <h1>{currentPolicy.title}</h1>
          </div>
        </Container>
      </div>
      <Container>
        <div className={styles.mainContent}>
          {currentPolicy.content}
          <div className={styles.footerNote}>
            <p>Mọi thắc mắc vui lòng liên hệ Hotline: <strong>0123 456 789</strong> để được giải đáp kịp thời.</p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Policy;
