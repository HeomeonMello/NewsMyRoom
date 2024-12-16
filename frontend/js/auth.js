// js/auth.js

document.addEventListener('DOMContentLoaded', function() {
    // 로그인 상태 체크
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    const navLoginItem = document.getElementById('nav_login_item');
    const navItems = document.getElementById('nav_items');

    if (token && userJson) {
        // 로그인 상태
        const user = JSON.parse(userJson);
        // 기존 로그인 메뉴 제거
        if (navLoginItem) {
            navLoginItem.remove();
        }

        // 사용자 정보 표시
        const userItem = document.createElement('li');
        userItem.className = 'right with-margin';
        userItem.id = 'nav_user_item';
        const userLink = document.createElement('a');
        userLink.href = '#';
        userLink.className = 'muted';
        userLink.id = 'nav_user_info';
        userLink.textContent = 'Hello, ' + user.username;
        userItem.appendChild(userLink);
        navItems.appendChild(userItem);

        // 로그아웃 항목
        const logoutItem = document.createElement('li');
        logoutItem.className = 'right with-margin';
        logoutItem.id = 'nav_logout_item';
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.className = 'muted';
        logoutLink.id = 'nav_logout';
        logoutLink.textContent = 'Log Out';
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            // 로그아웃 시 토큰과 사용자 정보 제거
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // 페이지 새로고침
            window.location.reload();
        });
        logoutItem.appendChild(logoutLink);
        navItems.appendChild(logoutItem);
    } else {
        // 비로그인 상태 -> 기본 Log In 표시 유지
    }
});
