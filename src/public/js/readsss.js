// hiển thị chỉnh sửa
document.addEventListener("DOMContentLoaded", function() {
    const btnShowConfig = document.getElementById('btnshowns');
    const modal = document.querySelector('.set-up');
    const btnClose = modal.querySelector('.close_aaa');
    const overlay = modal.querySelector('.tong_aaa');

    function showConfigBox() {
        modal.style.display = 'block';
    }

    function hideConfigBox() {
        modal.style.display = 'none';
    }

    btnShowConfig.addEventListener('click', function(e) {
        e.preventDefault();
        showConfigBox();
    });

    btnClose.addEventListener('click', function(e) {
        e.preventDefault();
        hideConfigBox();
    });
    
    overlay.addEventListener('click', function() {
            hideConfigBox();
        });
    });
    // end hiển thị chỉnh sửa
    
// set

// set fontsize
// Set fontsize
function applyFontSize() {
    var selectedFontSize = document.getElementById("font-style").value;
    var contentArea = document.querySelector('.contentbox')
    contentArea.style.fontSize = selectedFontSize;
    localStorage.setItem('fontSize', selectedFontSize);
}
document.getElementById("font-style").addEventListener("change", applyFontSize);

// Set color
function applyTextColor() {
    var selectedColor = document.getElementById("color-dark").value;
    var targetElement = document.getElementById("content-container"); 
    targetElement.style.color = selectedColor;
    localStorage.setItem('textColor', selectedColor);
}

document.getElementById("color-dark").addEventListener("input", applyTextColor);

// Set background color
function applyBackgroundColor() {
    var selectedColor = document.getElementById("background-color-dark").value;
    var targetElement = document.getElementById("content-container"); 
    targetElement.style.backgroundColor = selectedColor;
    localStorage.setItem('bgColor', selectedColor);
}

document.getElementById("background-color-dark").addEventListener("input", applyBackgroundColor);

// Set font family
function applyFontFamily() {
    var selectedFont = document.getElementById("font-family").value;
    var targetElement = document.querySelector('.contentbox'); 
    targetElement.style.fontFamily = selectedFont;
    localStorage.setItem('fontFamily', selectedFont);
}

document.getElementById("font-family").addEventListener("change", applyFontFamily);

// Reset font settings to default
function resetFontSettings() {
    var targetElement = document.getElementById("content-container"); 
    var targetElements = document.querySelector('.contentbox'); 
    targetElements.style.fontSize ="24px";
    targetElements.style.fontFamily = "Arial";
    targetElement.style.backgroundColor = "#F8FAFC";
    targetElement.style.color = "#000000";
    localStorage.removeItem('fontSize');
    localStorage.removeItem('textColor');
    localStorage.removeItem('bgColor');
    localStorage.removeItem('fontFamily');
}

document.querySelector('.theme-default-btn').addEventListener("click", resetFontSettings);

document.addEventListener("DOMContentLoaded", function() {
    var fontSize = localStorage.getItem('fontSize');
    var textColor = localStorage.getItem('textColor');
    var bgColor = localStorage.getItem('bgColor');
    var fontFamily = localStorage.getItem('fontFamily');
    
    if (fontSize) {
        var contentArea = document.querySelector('.contentbox')
        contentArea.style.fontSize = fontSize;
        document.getElementById("font-style").value = fontSize;
    }
    if (textColor) {
        var targetElement = document.getElementById("content-container"); 
        targetElement.style.color = textColor;
        document.getElementById("color-dark").value = textColor;
    }
    if (bgColor) {
        var targetElement = document.getElementById("content-container"); 
        targetElement.style.backgroundColor = bgColor;
        document.getElementById("background-color-dark").value = bgColor;
    }
    if (fontFamily) {
        var targetElement = document.querySelector('.contentbox'); 
        targetElement.style.fontFamily = fontFamily;
        document.getElementById("font-family").value = fontFamily;
    }
});



