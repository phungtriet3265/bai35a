
const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function(event) {

    // Ngăn form tải lại trang
    event.preventDefault();

    // Lấy dữ liệu người dùng
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const agree = document.getElementById("agree").checked;

    // Kiểm tra họ tên
    if (name === "") {
        showMessage("Vui lòng nhập họ và tên!", false);
        return;
    }

    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        showMessage("Email không hợp lệ!", false);
        return;
    }

    // Kiểm tra mật khẩu
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
        showMessage(
            "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số!",
            false
        );
        return;
    }

    // Kiểm tra điều khoản
    if (!agree) {
        showMessage("Bạn phải đồng ý với điều khoản!", false);
        return;
    }

    try {
        // Tạo mã băm SHA-256 cho mật khẩu
        const data = new TextEncoder().encode(password);
        const hash = await crypto.subtle.digest("SHA-256", data);

        const passwordHash = Array.from(new Uint8Array(hash))
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");

        // Lấy danh sách đăng ký cũ
        const users = JSON.parse(
            localStorage.getItem("users") || "[]"
        );

        // Kiểm tra email đã đăng ký chưa
        if (users.some(user =>
            user.email.toLowerCase() === email.toLowerCase()
        )) {
            showMessage("Email này đã được đăng ký!", false);
            return;
        }

        // Lưu thông tin vào LocalStorage
        users.push({
            name: name,
            email: email,
            passwordHash: passwordHash
        });

        localStorage.setItem("users", JSON.stringify(users));

        showMessage("Đăng ký thành công!", true);

        // Xóa dữ liệu trên form
        form.reset();

    } catch (error) {
        showMessage("Không thể lưu dữ liệu. Vui lòng thử lại!", false);
    }
});

// Hàm hiển thị thông báo
function showMessage(text, success) {
    message.textContent = text;
    message.className = success ? "success" : "error";
}
