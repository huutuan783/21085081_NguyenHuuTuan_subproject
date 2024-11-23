import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ProfileUser({ navigation, route }) {
  const userId = route.params.userID;

  const [userData, setUserData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch(`http://localhost:3000/dataUser/${userId}`);
        const userJson = await userResponse.json();

        const coursesResponse = await fetch(`http://localhost:3000/mycourse/${userId}`);
        const coursesJson = await coursesResponse.json();

        setUserData(userJson);
        setCourses(coursesJson);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#00bdd5" />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Profile Header */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#333" style={{ alignItems: 'flex-start' }} />
        </TouchableOpacity>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: userData?.avatar} }
            style={styles.avatar}
          />
          <Text style={styles.userName}>{userData?.username}</Text>
          <Text style={styles.userPosition}>{userData?.position}</Text>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{courses.length}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{courses.length}</Text>
              <Text style={styles.statLabel}>On Going</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Saved Courses */}
        <View style={styles.savedCourses}>
          <Text style={styles.sectionTitle}>Saved Courses</Text>
          {courses.map((course, index) => (
            <TouchableOpacity
              key={index}
              style={styles.courseCard}
              onPress={() =>
                navigation.navigate("FullCourse", { courseID: course.id, userID: userId })
              }
            >
              <Image source={{ uri: course.banner }} style={styles.courseImage} />
              <View style={styles.courseDetails}>
                <Text style={styles.courseName}>{course.name}</Text>
                <Text style={styles.courseInstructor}>By: {course.author}</Text>
                <Text style={styles.courseLessons}>{course.lessons} lessons</Text>
              </View>
              <Icon name="bookmark" size={20} color="#00bdd5" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    padding: 16,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  arrowIcon: {
    marginRight: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userPosition: {
    fontSize: 16,
    color: "#555",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
  },
  savedCourses: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  courseCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
  },
  courseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  courseDetails: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  courseInstructor: {
    fontSize: 14,
    color: "#555",
  },
  courseLessons: {
    fontSize: 12,
    color: "#888",
  },
});
