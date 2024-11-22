import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const validateInputs = () => {
    if (!username.trim()) {
      Toast.show({ type: "error", text1: "Username is required!" });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({ type: "error", text1: "Invalid email format!" });
      return false;
    }
    if (password.length < 6) {
      Toast.show({ type: "error", text1: "Password must be at least 6 characters!" });
      return false;
    }
    const phoneRegex = /^[0-9]{10,12}$/;
    if (!phoneRegex.test(phone)) {
      Toast.show({ type: "error", text1: "Phone must be 10-12 digits!" });
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    try {
      const response = await axios.post("http://localhost:3000/register", {
        username,
        email,
        password,
        sdt: phone,
      });

      if (response.data && response.data.userID) {
        const userId = response.data.userID;
        Toast.show({ type: "success", text1: response.data.message });

        navigation.navigate("LoginScreen", { userID: userId });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Registration failed!",
        text2: error.response?.data?.error || "Something went wrong.",
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Mũi tên quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Create an Account</Text>
      <Text style={styles.subtitle}>
        Please fill in the details below to start your journey!
      </Text>

      <TextInput
        placeholder="Enter your username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.inputHint}>Your unique username.</Text>

      <TextInput
        placeholder="Enter your email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Text style={styles.inputHint}>We will not share your email.</Text>

      <TextInput
        placeholder="Enter your phone"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <Text style={styles.inputHint}>Include your country code if necessary.</Text>

      <TextInput
        placeholder="Enter your password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text style={styles.inputHint}>Password must be at least 6 characters.</Text>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Create Account</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          Log in
        </Text>
      </Text>

      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 50,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#FFF",
    marginBottom: 5,
  },
  inputHint: {
    alignSelf: "flex-start",
    fontSize: 12,
    color: "#888",
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    elevation: 3,
    marginBottom: 20,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginText: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    color: "#4CAF50",
    fontWeight: "600",
  },
});
