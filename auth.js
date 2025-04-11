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
  if (adminPages.includes(currentPage) {
    if (!isAdmin) {
      alert("🚫 هذه الصفحة مخصصة للمسؤول فقط.");
      window.location.href = "browse.html";
      return false;
    }
  }
  
  // التحقق مما إذا كان المستخدم العادي معتمدًا
  if (!isAdmin && loggedUser && loggedUser.status !== "approved" && !publicPages.includes(currentPage)) {
    alert("حسابك قيد المراجعة، الرجاء الانتظار حتى الموافقة عليه.");
    localStorage.removeItem("loggedUser");
    window.location.href = "login.html";
    return false;
  }
  
  return true;
}

// تنفيذ الفحص فور تحميل السكريبت
checkAuth();