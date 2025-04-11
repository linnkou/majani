// auth-service.js - خدمة المصادقة المحسنة

/**
 * وظيفة لتشفير كلمة المرور (في التطبيق الحقيقي، استخدم تشفيراً أقوى على الخادم)
 * هذه محاكاة بسيطة لعملية التشفير
 */
function hashPassword(password) {
  // هذا مجرد محاكاة بسيطة للتشفير، في الإنتاج استخدم bcrypt على الخادم
  return Array.from(password)
    .map(char => char.charCodeAt(0).toString(16))
    .join('');
}

/**
 * وظيفة لإنشاء JWT مبسط
 */
function generateToken(user) {
  // حذف كلمة المرور من بيانات المستخدم
  const { password, ...userData } = user;
  
  // إنشاء رأس JWT (في الإنتاج، استخدم مكتبة JWT مناسبة)
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  
  // إضافة وقت انتهاء الصلاحية (24 ساعة)
  const payload = {
    ...userData,
    exp: new Date().getTime() + 24 * 60 * 60 * 1000
  };
  
  // تشفير الرأس والحمولة (محاكاة بسيطة)
  const base64Header = btoa(JSON.stringify(header));
  const base64Payload = btoa(JSON.stringify(payload));
  
  // في الإنتاج، يجب أن يكون هناك توقيع مشفر هنا
  const signature = btoa(
    hashPassword(base64Header + "." + base64Payload + "SECRET_KEY")
  );
  
  return `${base64Header}.${base64Payload}.${signature}`;
}

/**
 * التحقق من صحة الرمز المميز
 */
function verifyToken(token) {
  if (!token) return null;
  
  try {
    // تقسيم الرمز المميز
    const [headerBase64, payloadBase64] = token.split('.');
    
    // فك تشفير الحمولة
    const payload = JSON.parse(atob(payloadBase64));
    
    // التحقق من وقت انتهاء الصلاحية
    if (payload.exp < new Date().getTime()) {
      return null; // الرمز المميز منتهي الصلاحية
    }
    
    return payload;
  } catch (e) {
    console.error("خطأ في التحقق من الرمز المميز:", e);
    return null;
  }
}

/**
 * تسجيل الدخول مع إنشاء JWT
 */
function login(username, password) {
  // الحصول على المستخدمين من التخزين المحلي
  const users = JSON.parse(localStorage.getItem("registrations") || "[]");
  
  // البحث عن المستخدم باستخدام اسم المستخدم
  const user = users.find(u => u.username === username);
  
  // التحقق من وجود المستخدم وصحة كلمة المرور
  if (!user || user.password !== password) {
    return { success: false, message: "اسم المستخدم أو كلمة المرور غير صحيحة" };
  }
  
  // التحقق من حالة المستخدم
  if (user.status === "pending") {
    return { success: false, message: "حسابك قيد المراجعة، الرجاء الانتظار" };
  }
  
  // إنشاء رمز JWT للمستخدم
  const token = generateToken(user);
  
  // تخزين الرمز المميز في التخزين المحلي
  localStorage.setItem("auth_token", token);
  
  return {
    success: true,
    message: "تم تسجيل الدخول بنجاح",
    isAdmin: user.role === "admin"
  };
}

/**
 * تسجيل الخروج
 */
function logout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("isAdmin");
  window.location.href = "index.html";
}

/**
 * الحصول على بيانات المستخدم الحالي
 */
function getCurrentUser() {
  const token = localStorage.getItem("auth_token");
  return verifyToken(token);
}

/**
 * التحقق من صلاحيات المستخدم الحالي
 */
function checkUserPermissions() {
  const currentPage = window.location.pathname.split('/').pop();
  const publicPages = ['index.html', 'login.html', 'register.html', ''];
  
  // التحقق مما إذا كان المستخدم مسجل دخول
  const currentUser = getCurrentUser();
  const isAdmin = currentUser && currentUser.role === "admin";
  const isLoggedIn = currentUser !== null;
  
  // حفظ حالة المسؤول للاستخدام في أماكن أخرى
  if (isAdmin) {
    localStorage.setItem("isAdmin", "true");
  }
  
  // إعادة التوجيه إذا لم يكن المستخدم مسجل دخول
  if (!isLoggedIn && !publicPages.includes(currentPage)) {
    window.location.href = "login.html";
    return false;
  }
  
  // صفحات الأدمين فقط
  const adminPages = ['admin-panel.html', 'manage-folders.html'];
  
  if (adminPages.includes(currentPage) && !isAdmin) {
    alert("🚫 هذه الصفحة مخصصة للمسؤول فقط.");
    window.location.href = "browse.html";
    return false;
  }
  
  return true;
}

// التحقق عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', checkUserPermissions);