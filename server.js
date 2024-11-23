const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2"); // Sử dụng mysql2 để kết nối database
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Kết nối cơ sở dữ liệu MySQL
const db = mysql.createConnection({
  host: "localhost", // Thay đổi nếu cần
  user: "root", // Tên người dùng MySQL của bạn
  port: 3308,
  password: "", // Mật khẩu MySQL của bạn
  database: "elearning", // Tên cơ sở dữ liệu của bạn
});

// Kiểm tra kết nối
db.connect((err) => {
  if (err) {
    console.error("Không thể kết nối đến cơ sở dữ liệu:", err);
    process.exit(1);
  }
  console.log("Kết nối thành công đến cơ sở dữ liệu MySQL!");
});

// API endpoint: Register user
const bcrypt = require("bcrypt");

app.post("/register", async (req, res) => {
  const { username, email, password, sdt } = req.body;

  if (!username || !email || !password || !sdt) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], async (err, result) => {
    if (err) {
      console.error("Lỗi khi kiểm tra email:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.length > 0) {
      return res.status(400).json({ error: "Email is already registered!" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery =
      "INSERT INTO users (username, email, password, phone, avatar, position) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      insertUserQuery,
      [username, email, hashedPassword, sdt, "default_avatar.png", "student"],
      (err, result) => {
        if (err) {
          console.error("Lỗi khi thêm người dùng:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        return res
          .status(201)
          .json({ message: "Registration successful!", userID: result.insertId });
      }
    );
  });
});


// API endpoint: Fetch all users
app.get("/users", (req, res) => {
  const getUsersQuery = "SELECT * FROM users";
  db.query(getUsersQuery, (err, result) => {
    if (err) {
      console.error("Lỗi khi truy xuất danh sách người dùng:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    return res.status(200).json(result);
  });
});

// API endpoint: Login user
app.post("/login", (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required!" });
    }
  
    const loginQuery = "SELECT * FROM users WHERE email = ?";
    db.query(loginQuery, [email], async (err, result) => {
      if (err) {
        console.error("Lỗi khi đăng nhập:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
  
      if (result.length === 0) {
        return res.status(401).json({ error: "Invalid email or password!" });
      }
  
      const user = result[0];
  
      // Kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password!" });
      }
  
      return res.status(200).json({
        message: "Login successful!",
        userId: user.id,
        username: user.username,
        email: user.email,
        position: user.position,
      });
    });
  });
  
  
  // API endpoint: Get user profile by ID
  app.get("/myInfor", (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required!" });
    }

    const getUserQuery = "SELECT * FROM users WHERE id = ?";
    db.query(getUserQuery, [userId], (err, result) => {
        if (err) {
            console.error("Error fetching user data:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Only return necessary fields for the front-end
        const { id, username, email, position, avatar } = result[0];
        return res.status(200).json({ id, username, email, position, avatar });
    });
});

  

  app.get("/courses", (req, res) => {
    const query = "SELECT * FROM courses";
    db.query(query, (err, result) => {
      if (err) {
        console.error("Lỗi khi truy xuất khóa học:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.status(200).json(result);
    });
  });

  // API: Lấy danh sách bài học của khóa học
app.get("/lessons/:courseId", (req, res) => {
  const { courseId } = req.params;

  const query = "SELECT * FROM lessons WHERE course_id = ?";
  db.query(query, [courseId], (err, result) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách bài học:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "No lessons found for this course" });
    }

    res.status(200).json(result);
  });
});

// API: Thêm bài học mới
app.post("/lessons", (req, res) => {
  const { courseId, name, videoLink, duration } = req.body;

  if (!courseId || !name || !videoLink || !duration) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  const query = "INSERT INTO lessons (course_id, name, video_link, duration) VALUES (?, ?, ?, ?)";
  db.query(query, [courseId, name, videoLink, duration], (err, result) => {
    if (err) {
      console.error("Lỗi khi thêm bài học:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(201).json({ message: "Lesson added successfully!", lessonId: result.insertId });
  });
});

// API: Thêm khóa học vào giỏ hàng
app.post("/cart/add", (req, res) => {
  const { userId, courseId } = req.body;

  if (!userId || !courseId) {
    return res.status(400).json({ error: "User ID and Course ID are required!" });
  }

  const query = "INSERT INTO cart (user_id, course_id, created_at) VALUES (?, ?, NOW())";
  db.query(query, [userId, courseId], (err, result) => {
    if (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(201).json({ message: "Course added to cart successfully!" });
  });
});

// API: Xóa khóa học khỏi giỏ hàng
app.delete("/cart/remove", (req, res) => {
  const { userId, courseId } = req.body;

  if (!userId || !courseId) {
    return res.status(400).json({ error: "User ID and Course ID are required!" });
  }

  const query = "DELETE FROM cart WHERE user_id = ? AND course_id = ?";
  db.query(query, [userId, courseId], (err, result) => {
    if (err) {
      console.error("Lỗi khi xóa khỏi giỏ hàng:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found in cart" });
    }

    res.status(200).json({ message: "Course removed from cart successfully!" });
  });
});

// API: Lấy danh sách giỏ hàng
app.get("/cart/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT c.id as cart_id, courses.* 
    FROM cart c 
    JOIN courses ON c.course_id = courses.id 
    WHERE c.user_id = ?`;
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Lỗi khi lấy giỏ hàng:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(200).json(result);
  });
});


// API: Lấy đánh giá cho một khóa học
app.get("/reviews/:courseId", (req, res) => {
  const { courseId } = req.params;

  const query = "SELECT * FROM reviews WHERE course_id = ?";
  db.query(query, [courseId], (err, result) => {
    if (err) {
      console.error("Lỗi khi lấy đánh giá:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(200).json(result);
  });
});

// API: Thêm đánh giá mới
app.post("/reviews", (req, res) => {
  const { userId, courseId, rating, comment } = req.body;

  if (!userId || !courseId || !rating || !comment) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  const query = "INSERT INTO reviews (user_id, course_id, rating, comment) VALUES (?, ?, ?, ?)";
  db.query(query, [userId, courseId, rating, comment], (err, result) => {
    if (err) {
      console.error("Lỗi khi thêm đánh giá:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(201).json({ message: "Review added successfully!" });
  });
});

// API: Lấy chi tiết khóa học theo ID
app.get("/courses/:id", (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM courses WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Lỗi khi lấy chi tiết khóa học:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Course not found!" });
    }

    res.status(200).json(result[0]);
  });
});

// API: Lấy thông tin người dùng
app.get("/dataUser/:id", (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Lỗi khi lấy thông tin người dùng:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.status(200).json(result[0]);
  });
});
// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
