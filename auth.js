<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>Auth.js - ملف التحقق من الجلسة</title>
</head>
<body>
  <h1>هذا ملف JavaScript للتحقق من الجلسة</h1>
  
  <script>
// auth.js - ملف التحقق من الجلسة
function checkAuth() {
  // الحصول على الصفحة الحالية
  const currentPage = window.location.pathname.split('/').pop();
  
  // الصفحات التي لا تتطلب تسجيل دخول
  const publicPages = ['index.html', 'login.html', 'register.html', ''];
  
  // التحقق من تسجيل الدخول
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "null");
  const isLoggedIn = isAdmin || loggedUser !== null;
  
  // إعادة التوجيه إلى صفحة الدخول إذا لم يكن مسجل دخول ويحاول الوصول إلى صفحة محمية
  if (!isLoggedIn && !publicPages.includes(currentPage)) {
    window.location.href = "login.html";
    return false;
  }
  
  // صفحات الأدمين فقط
  const adminPages = ['admin.html', 'manage-folders.html'];
  
  // إعادة توجيه المستخدمين غير الأدمين الذين يحاولون الوصول إلى صفحات الأدمين
  if (adminPages.includes(currentPage) && !isAdmin) {
    window.location.href = "home.html";
    return false;
  }
  
  // التحقق مما إذا كان المستخدم العادي معتمدًا
  if (!isAdmin && loggedUser && loggedUser.status !== "approved" && !publicPages.includes(currentPage)) {
    window.location.href = "login.html";
    return false;
  }
  
  return true;
}

// تنفيذ الفحص فور تحميل السكريبت
checkAuth();
  </script>
</body>
</html>