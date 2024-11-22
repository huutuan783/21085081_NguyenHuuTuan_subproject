import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
// Sử dụng thư viện icon (nếu cần)
import Icon from "react-native-vector-icons/Ionicons"; // Thêm thư viện react-native-vector-icons

export default function EditCourse({ route, navigation }) {
  const { course } = route.params; // Nhận dữ liệu khóa học từ navigation
  const [name, setName] = useState(course.name);
  const [banner, setBanner] = useState(course.banner);
  const [price, setPrice] = useState(course.price);

  const handleUpdateCourse = async () => {
    try {
      const response = await fetch(`http://localhost:3000/courses/${course._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, banner, price, author: course.author }),
      });
      if (response.ok) {
        alert("Course updated successfully!");
        navigation.goBack(); // Quay lại màn hình trước đó
      } else {
        alert("Failed to update the course.");
      }
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#333" /> {/* Icon từ react-native-vector-icons */}
      </TouchableOpacity>

      {/* Form chỉnh sửa khóa học */}
      <Text style={styles.label}>Course Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Banner URL</Text>
      <TextInput style={styles.input} value={banner} onChangeText={setBanner} />
      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={price.toString()}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdateCourse}>
        <Text style={styles.buttonText}>Update Course</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  label: { fontSize: 16, marginVertical: 8 },
  input: { borderWidth: 1, padding: 10, borderRadius: 5 },
  button: { backgroundColor: "#00bdd5", padding: 15, marginTop: 20, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16 },
});
