import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { launchImageLibrary } from "react-native-image-picker";
import { ScrollView } from "react-native-web";
import Toast from 'react-native-toast-message';  // Import Toast

export default function AddCourse({ route, navigation }) {
  const author = route.params.author;
  const [name, setName] = useState("");
  const [banner, setBanner] = useState("");
  const [bannerUri, setBannerUri] = useState(null);
  const [price, setPrice] = useState("");
  const [lesson, setLesson] = useState("");

  const pickBannerImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setBannerUri(URL.createObjectURL(file));
            setBanner(file.name);
        }
    };
    input.click();
  };

  const handleAddCourse = async () => {
    if (!name || !banner || !price) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          banner,
          price: parseFloat(price),
          lesson: parseInt(lesson) || 0,
          author,
        }),
      });

      if (response.ok) {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Course Added!',
          text2: 'Your course has been successfully added.',
          visibilityTime: 1000,
          autoHide: true,
        });
        navigation.goBack();
      } else {
        const error = await response.json();
        alert("Failed to add the course: " + (error.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Error connecting to the server.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.label}>Author</Text>
      <TextInput style={[styles.input, { backgroundColor: "#ddd" }]} value={author} editable={false} />
      <Text style={styles.label}>Course Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Banner</Text>

      <TouchableOpacity style={styles.avatarButton} onPress={pickBannerImage}>
        <Text style={styles.avatarButtonText}>
          {banner ? "Change Banner" : "Select Banner"}
        </Text>
      </TouchableOpacity>
      {bannerUri && <Image source={{ uri: bannerUri }} style={styles.bannerImage} />}

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Lessons</Text>
      <TextInput
        style={styles.input}
        value={lesson}
        onChangeText={setLesson}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleAddCourse}>
        <Text style={styles.buttonText}>Add Course</Text>
      </TouchableOpacity>

      <Toast ref={(ref) => Toast.setRef(ref)} />  {/* Add Toast component */}
    </ScrollView>
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
  avatarButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  avatarButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  bannerImage: {
    width: "100%",
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
  },
  button: { backgroundColor: "#00bdd5", padding: 15, marginTop: 20, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16 },
});
