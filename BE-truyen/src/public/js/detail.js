











document.addEventListener("DOMContentLoaded", function(){
    const reads = document.querySelectorAll('.col-md-4.mb-2 a'); 
    const blinkloadprevchap = document.querySelectorAll('#navprevtop');
    const blinkloadnextchap = document.querySelectorAll('#navnexttop');
    const localStorageKeyPrefix = 'chaptersRead_'; 
    let chapID;
    
    // Hàm để lấy danh sách các chương đã đọc từ local storage
    function getChaptersRead(bookSlug) {
        const storedData = localStorage.getItem(localStorageKeyPrefix + bookSlug);
        return storedData ? JSON.parse(storedData) : [];
    }

    function saveChaptersRead(bookSlug, chaptersRead) {
        localStorage.setItem(localStorageKeyPrefix + bookSlug, JSON.stringify(chaptersRead));
    }
    
    function updateChaptersRead(chaptersRead) {
        reads.forEach(function(chap) {
            const chapID = parseInt(chap.getAttribute('data-id'));
            if (chaptersRead.includes(chapID)) {
                chap.style.color = '#c6c6c6';
            }
        });
    }

    const bookSlug = document.getElementById('readnow').getAttribute('data-book-slug');
    const chaptersRead = getChaptersRead(bookSlug);
    updateChaptersRead(chaptersRead);

    reads.forEach(function(chap) {
        chap.addEventListener('click', function() {
            const currentChapID = parseInt(this.getAttribute('data-id'));
            chapID = currentChapID;
            localStorage.setItem('lastReadChapter_' + bookSlug, currentChapID);

            if (!chaptersRead.includes(currentChapID)) {
                chaptersRead.push(currentChapID);
            }

            updateChaptersRead(chaptersRead);
            saveChaptersRead(bookSlug, chaptersRead);
        });
    });
    document.getElementById('readnow').addEventListener('click', function(e) {
        const chapID = localStorage.getItem('lastReadChapter_' + bookSlug);
        if (chapID >= 1 ) {
            // Chuyển hướng đến chương được click cuối cùng
            this.href = '/truyen/' + bookSlug + '/chuong-' + chapID.toString();
        } else {
            console.log("Chưa có chương nào được chọn để đọc.");
        }
    });
    blinkloadprevchap.forEach(function(element) {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            var a = parseInt(this.getAttribute('data-id'));
            chapID = a - 1;
            localStorage.setItem('lastReadChapter_' + bookSlug, chapID);

            if (chapID < 1) {
                this.href = '/truyen/' + bookSlug;
            } else {
                this.href = '/truyen/' + bookSlug + '/chuong-' + chapID.toString();
            }
            window.location.href = this.href;

            // Chỉ thêm chương hiện tại vào danh sách các chương đã đọc
            if (!chaptersRead.includes(chapID)) {
                chaptersRead.push(chapID);
            }

            updateChaptersRead(chaptersRead);
            saveChaptersRead(bookSlug, chaptersRead);
        });
    });

    blinkloadnextchap.forEach(function(element) {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            var a = parseInt(this.getAttribute('data-id'));
            chapID = a + 1;
            localStorage.setItem('lastReadChapter_' + bookSlug, chapID);

            this.href = '/truyen/' + bookSlug + '/chuong-' + chapID.toString();
            window.location.href = this.href;

            // Chỉ thêm chương hiện tại vào danh sách các chương đã đọc
            if (!chaptersRead.includes(chapID)) {
                chaptersRead.push(chapID);
            }

            updateChaptersRead(chaptersRead);
            saveChaptersRead(bookSlug, chaptersRead);
        });
    });
});



var container = document.getElementById("chaptercontainer");
var originalMaxHeight = 200;
var isExpanded = false;

function toggleChapterList() {
    var clicktoexp = document.getElementById("clicktoexp");

    if (isExpanded) {
        container.style.maxHeight = originalMaxHeight + "px";
        clicktoexp.innerHTML = "Mở rộng <i class='fas fa-chevron-down'></i>";
    } else {
        originalMaxHeight = container.clientHeight;
        container.style.maxHeight = "none";
        clicktoexp.innerHTML = "Thu gọn <i class='fas fa-chevron-up'></i>";
    }

    isExpanded = !isExpanded;
}



function followStory(storyId) {
    const token = localStorage.getItem('token');
    if (!token) {
        showToast({
            title: 'Lỗi',
            message: 'Bạn cần đăng nhập để theo dõi truyện',
            type: 'error',
            duration: 3000
        });
        return;
    }

    fetch(`/follow/${storyId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        showToast({
            title: data.type === 'success' ? 'Thành công!' : 'Thất bại!',
            message: data.message,
            type: data.type,
            duration: 2000
        });
        
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

function toast({ title = "", message = "", type = "info", duration = 3000 }) {
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
  

function likeStory(storyId) {
    const token = localStorage.getItem('token');
    if (!token) {
        showToast({
            title: 'Lỗi',
            message: 'Bạn cần đăng nhập để thích truyện',
            type: 'error',
            duration: 3000
        });
        return;
    }

    fetch(`/like/${storyId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        showToast({
            title: data.type === 'success' ? 'Thành công!' : 'Thất bại!',
            message: data.message,
            type: data.type,
            duration: 2000
        });
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

