function comment(abc) {
    event.preventDefault()
    const token = localStorage.getItem('token');
    if (!token) {
        showToast({
            title: 'Lỗi',
            message: 'Bạn cần đăng nhập để thêm comment',
            type: 'error',
            duration: 3000
        });
        return;
    }

    const commentContentInput = document.getElementById('cmtx'); // Lấy tham chiếu đến textarea
    const content = commentContentInput.value.trim();

    if (!content) {
        showToast({
            title: 'Lỗi',
            message: 'Vui lòng nhập nội dung bình luận.',
            type: 'error',
            duration: 3000
        });
        return;
    }

    fetch(`/comment/${abc}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content }) // Gửi nội dung của comment dưới dạng JSON
    })
    .then(response => {
        // Kiểm tra phản hồi của máy chủ
        if (!response.ok) {
            throw new Error('Đã xảy ra lỗi máy chủ');
        }
        return response.json();
    })
    .then(data => {
        showToast({
            title: data.type === 'success' ? 'Thành công!' : 'Thất bại!',
            message: data.message,
            type: data.type,
            duration: 2000
        });
        
        localStorage.setItem('notification', JSON.stringify({
            title: 'Thành công!',
            message: data.message,
            type: 'success',
            duration: 3000
        }));
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
        showToast({
            title: 'Lỗi',
            message: error.message,
            type: 'error',
            duration: 3000
        });
    });
}

function showToast({ title = "", message = "", type = "info", duration = 3000 }) {
    const main = document.getElementById("toast");
    if (main) {
        const toast = document.createElement("div");

        // Auto remove toast
        const autoRemoveId = setTimeout(function () {
            main.removeChild(toast);
        }, duration + 1000);

        // Remove toast when clicked
        toast.onclick = function (e) {
            if (e.target.closest(".toast__close")) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        };

        const icons = {
            success: "fas fa-check-circle",
            info: "fas fa-info-circle",
            warning: "fas fa-exclamation-circle",
            error: "fas fa-exclamation-circle"
        };
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);

        toast.classList.add("toast", `toast--${type}`);
        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

        toast.innerHTML = `
            <div class="toast__icon">
                <i class="${icon}"></i>
            </div>
            <div class="toast__body">
                <h3 class="toast__title">${title}</h3>
                <p class="toast__msg">${message}</p>
            </div>
            <div class="toast__close">
                <i class="fas fa-times"></i>
            </div>
        `;
        main.appendChild(toast);
    }
}
document.addEventListener('DOMContentLoaded', (event) => {
    const notification = localStorage.getItem('notification');
    if (notification) {
        const { title, message, type, duration } = JSON.parse(notification);
        showToast({ title, message, type, duration });

        localStorage.removeItem('notification');
    }
});
