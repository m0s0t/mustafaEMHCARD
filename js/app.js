/* =========================
   إدارة التنقل (Navigation)
   ========================= */

// وظيفة الرجوع الموحدة والشاملة
function goBack() {
    closeLogin();
    closeMFA();
    
    const dashboard = document.getElementById("dashboard");
    const medicalDetails = document.getElementById("medicalDetailsPage");
    const familyPage = document.getElementById("familyPage");

    if (dashboard) dashboard.style.display = "block";
    if (medicalDetails) medicalDetails.style.display = "none";
    if (familyPage) familyPage.style.display = "none";
}

function openFamily() {
    const dashboard = document.getElementById("dashboard");
    const familyPage = document.getElementById("familyPage");
    if (familyPage) {
        dashboard.style.display = "none";
        familyPage.style.display = "block";
    }
}

function showMedicalPage() {
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("familyPage").style.display = "none";
    document.getElementById("medicalDetailsPage").style.display = "block";
}

/* =========================
   النظام الطبي والمصادقة (MFA)
   ========================= */

const authorizedMedics = [
    { user: "mustafa", pin: "123", name: "مصطفى إبراهيم", link: "https://ai.studio/apps/drive/19AaqNsJVaIhpWDhnOivbNWNEUHixR0Vu" },
    { user: "doctor1", pin: "doc@911", name: "طبيب الطوارئ", link: "https://ai.studio/apps/drive/19AaqNsJVaIhpWDhnOivbNWNEUHixR0Vu" },
    { user: "nurse1", pin: "4567", name: "ممرض الطوارئ", link: "https://ai.studio/apps/drive/19AaqNsJVaIhpWDhnOivbNWNEUHixR0Vu" },
    { user: "admin", pin: "9999", name: "مدير النظام", link: "https://ai.studio/apps/drive/19AaqNsJVaIhpWDhnOivbNWNEUHixR0Vu" }
];

let isAuthenticated = false; 

// وظيفة الزر الرئيسي: تفتح تسجيل الدخول إذا لم يتم التحقق
function openLogin() {
    if (isAuthenticated) {
        window.location.href = "https://ai.studio/apps/drive/19AaqNsJVaIhpWDhnOivbNWNEUHixR0Vu";
    } else {
        const loginModal = document.getElementById("loginModal");
        if (loginModal) loginModal.style.display = "flex";
    }
}

// معالجة تسجيل الدخول اليدوي
function login() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    const found = authorizedMedics.find(u => u.user === user && u.pin === pass);

    if (found) {
        closeLogin();
        // تحويل مباشر للسجل الطبي الكامل
        window.location.href = found.link;
    } else {
        alert("بيانات الدخول غير صحيحة");
    }
}

async function scanNFC() {

    if (!("NDEFReader" in window)) {
        alert("هذا الجهاز لا يدعم NFC.");
        return;
    }

    try {
        const ndef = new NDEFReader();
        await ndef.scan();

        ndef.onreading = (event) => {
            const decoder = new TextDecoder();

            for (const record of event.message.records) {
                if (record.recordType === "text") {
                    const textData = decoder.decode(record.data);

                    try {
                        const parsed = JSON.parse(textData);

                        const found = authorizedMedics.find(
                            u => u.user === parsed.user && u.pin === parsed.pin
                        );

                        if (found) {
                            ndef.onreading = null; // إيقاف المسح
                            closeLogin();
                            window.location.replace(found.link); // تحويل مباشر للسجل الطبي
                        } else {
                            alert("بطاقة غير مخولة.");
                        }

                    } catch (e) {
                        alert("تنسيق بيانات البطاقة غير صحيح.");
                    }
                }
            }
        };

    } catch (error) {
        alert("فشل قراءة البطاقة.");
    }
}

function closeLogin() {
    const loginModal = document.getElementById("loginModal");
    if (loginModal) loginModal.style.display = "none";
}

function closeMFA() {
    const mfaModal = document.getElementById("mfaModal");
    if (mfaModal) mfaModal.style.display = "none";
}

/* =========================
   الطوارئ والموقع التلقائي
   ========================= */

const emergencyWhatsAppNumber = "9647866305696"; 

function sendAutoLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
            const message = `🚨 *تنبيه طارئ من نظام NDMR* 🚨%0Aتم مسح بطاقة المريض: *طيبة علي دحام*%0Aالموقع الجغرافي الحالي:%0A${googleMapsLink}`;
            
            window.location.href = `https://api.whatsapp.com/send?phone=${emergencyWhatsAppNumber}&text=${message}`;
        }, function(error) {
            console.log("صلاحية الوصول للموقع مرفوضة.");
        });
    }
}

let emergencyTimer;
let timeLeft = 5;

function startEmergencySequence() {
    const timerCont = document.getElementById('timerContainer');
    if (timerCont) timerCont.style.display = 'block';
    
    emergencyTimer = setInterval(() => {
        timeLeft--;
        const display = document.getElementById('countdownDisplay');
        if (display) display.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(emergencyTimer);
            sendAutoLocation();
        }
    }, 1000);
}

function cancelEmergency() {
    clearInterval(emergencyTimer);
    const timerCont = document.getElementById('timerContainer');
    if (timerCont) timerCont.style.display = 'none';
    alert("تم إلغاء إرسال الموقع بنجاح.");
}

window.addEventListener('load', () => {
    setTimeout(startEmergencySequence, 1000); 
});

function callNumber(num) {
    if (num) {
        window.location.href = num;
    } else {
        alert("عذراً، رقم الهاتف غير متوفر.");
    }
}
