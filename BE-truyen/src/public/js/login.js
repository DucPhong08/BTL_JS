function login(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.type === 'success') {
            console.log('Token:', data.token);
            localStorage.setItem('token', data.token);
            
            // Lưu thông tin thông báo vào localStorage trước khi reload trang
            localStorage.setItem('notification', JSON.stringify({
                title: 'Thành công!',
                message: data.message,
                type: 'success',
                duration: 3000
            }));

            // Fetch chapters read for all books and store in localStorage
            fetch('/truyen/api/get-reading-progress/all', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${data.token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(abx => abx.json())
                .then(progressData => {
                    if (progressData.type === 'success') {
                        progressData.books.forEach(book => {
                            localStorage.setItem(`chaptersRead_${book.bookId}`, JSON.stringify(book.readChapters));
                            localStorage.setItem(`lastReadChapter_${book.bookId}`, JSON.stringify(book.lastReadChapterId));
                        });
                    }
                    location.reload(); // Reload the page after fetching the reading progress
                })
                .catch(error => {
                    console.error('Error fetching reading progress:', error);
                  // Reload the page even if there's an error
                });

        } else {
            showToast({
                title: 'Thất bại!',
                message: data.message,
                type: 'error',
                duration: 3000
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast({
            title: 'Lỗi',
            message: 'Đã xảy ra lỗi máy chủ',
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




function register(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    const name = document.getElementById('name').value;
    const username = document.getElementById('usernames').value;
    const password = document.getElementById('passwords').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, username, password })
    })
    .then(response => response.json())
    .then(data => {
        showToast({
            title: data.type === 'success' ? 'Thành công!' : 'Thất bại!',
            message: data.message,
            type: data.type,
            duration: 3000
        });

        // Nếu đăng ký thành công, có thể chuyển hướng hoặc thực hiện hành động khác
        if (data.type === 'success') {
            // Chuyển hướng tới trang khác nếu cần
            // window.location.href = '/login';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast({
            title: 'Lỗi',
            message: 'Đã xảy ra lỗi máy chủ',
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
function logout() {
    // Xóa token từ localStorage
    localStorage.removeItem('token');
    localStorage.clear()
    
    // Gửi yêu cầu logout đến server để xóa cookie từ server-side
    fetch('/logout', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            // Tải lại trang để cập nhật giao diện người dùng
            window.location.reload();
        })
        .catch(error => console.error('Error:', error));
}



document.addEventListener('DOMContentLoaded', (event) => {
    const notification = localStorage.getItem('notification');
    if (notification) {
        const { title, message, type, duration } = JSON.parse(notification);
        showToast({ title, message, type, duration });

        localStorage.removeItem('notification');
    }
});
