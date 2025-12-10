document.addEventListener('DOMContentLoaded', () => {
    // Địa chỉ Backend API 
    // CHÚ Ý: Sử dụng localhost:8000 để chạy thử trên máy tính cá nhân
    const BACKEND_URL = 'http://localhost:8000/api/products'; 
    
    // Khi triển khai xong lên Render, bạn sẽ thay thế dòng trên bằng domain thực tế:
    // const BACKEND_URL = 'https://<your-render-domain-here>/api/products'; 

    const statusDiv = document.getElementById('status');
    const tableBody = document.querySelector('#product-list tbody');

    fetchProducts();

    async function fetchProducts() {
        try {
            const response = await fetch(BACKEND_URL);
            
            // Xử lý lỗi HTTP (ví dụ: 404, 500)
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP error! Status: ${response.status}. ${errorData.error || 'Server error.'}`);
            }

            const data = await response.json();
            
            statusDiv.textContent = 'Dữ liệu đã được tải thành công!';
            statusDiv.style.backgroundColor = '#E9F9E9'; // Màu xanh lá nhẹ
            renderProducts(data.products);

        } catch (error) {
            console.error('Lỗi khi fetch data:', error);
            statusDiv.innerHTML = `<span class="error">LỖI: Không thể kết nối Backend API. (${error.message})</span>`;
            tableBody.innerHTML = '<tr><td colspan="3">Vui lòng kiểm tra console và đảm bảo Backend server đã chạy.</td></tr>';
        }
    }

    function renderProducts(products) {
        tableBody.innerHTML = ''; // Xóa dữ liệu cũ
        
        if (!products || products.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3">Không tìm thấy sản phẩm nào trong database.</td></tr>';
            return;
        }

        products.forEach(product => {
            const row = tableBody.insertRow();
            
            row.insertCell().textContent = product.id;
            row.insertCell().textContent = product.name;
            // Định dạng giá tiền
            row.insertCell().textContent = `$${product.price.toFixed(2)}`;
        });
    }
});