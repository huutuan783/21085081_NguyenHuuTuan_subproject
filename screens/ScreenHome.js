import { StyleSheet } from "react-native";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ScreenHome({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Phần đầu giao diện */}
      <View style={styles.header}>
        <Image
          source={require("../assets/img/bannerlogin.png")}
          style={styles.illustration}
        />
        <Text style={styles.title}>Welcome to NHTLEARNING</Text>
        <Text style={styles.subtitle}>
          Your companion in creating efficient study plans.
        </Text>
      </View>

      {/* Nút chức năng */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("RegisterScreen")}
          style={styles.btnPrimary}
        >
          <Ionicons name="person-add" size={20} color="#fff" />
          <Text style={styles.btnPrimaryText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("LoginScreen")}
          style={styles.btnSecondary}
        >
          <Ionicons name="log-in" size={20} color="#4CAF50" />
          <Text style={styles.btnSecondaryText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  illustration: {
    width: 280,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginHorizontal: 10,
  },
  buttonContainer: {
    alignItems: "center",
  },
  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: 50,
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    marginTop: 20,
    paddingHorizontal: 15,
  },
  btnPrimaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  btnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: 50,
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderRadius: 25,
    marginTop: 15,
    paddingHorizontal: 15,
  },
  btnSecondaryText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});
