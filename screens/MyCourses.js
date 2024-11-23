import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useEffect, useState } from "react";
export default function MyCourses({ navigation ,route}) {

  const userId = route.params.userID
  const [dataCourses,setDataCourses] = useState([])
  const [loadingDataCourses,setLoadingDataCourses] = useState(true)

  console.log(userId);
  

    
  const fetchDataCourses = async () => {
    try {
      const response = await fetch(`http://localhost:3000/mycourse/${userId}`);
      const json = await response.json();
      console.log("Dữ liệu từ API:", json); // Debug dữ liệu trả về
      setDataCourses(json);
    } catch (error) {
      console.error("Không load được API", error);
    } finally {
      setLoadingDataCourses(false);
    }
  };
  
 
     useEffect(()=>{
        fetchDataCourses()
     },[])
 


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Courses</Text>
      </View>

     


      {/* Course List */}
      <ScrollView style={styles.courseList}>
  {dataCourses.length > 0 ? (
    dataCourses.map((course, index) => (
      <TouchableOpacity
        key={index}
        style={styles.courseItem}
        onPress={() =>
          navigation.navigate("FullCourse", { courseID: course.course_id, userID: userId })
        }
      >
        <Image source={{ uri: course.banner }} style={styles.courseImage} />
        <View style={styles.courseDetails}>
          <Text style={styles.courseTitle}>{course.name}</Text>
          <Text style={styles.courseTime}>{course.lessons} lessons</Text>
          <Text style={styles.courseProgress}>{course.progress}% Complete</Text>
        </View>
      </TouchableOpacity>
    ))
  ) : (
    <Text style={styles.noData}>You have no courses enrolled.</Text>
  )}
</ScrollView>




      {/* Footer */}
      <View style={styles.footer}>
                <TouchableOpacity style={styles.footerItem}>
                    <Icon name="home" size={24} color="#888"  onPress={()=>{navigation.navigate("ScreenHomeCourse",{userID: userId})}}/>
                    <Text>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem} onPress={()=>{navigation.navigate("Search",{userID: userId})}}>
                    <Icon name="search" size={24} color="#888" />
                    <Text>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem}>
                    <Icon name="book" size={24} color="#888"  onPress={()=>{navigation.navigate("MyCourses",{userID: userId})}}/>
                    <Text>My Courses</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem} onPress={()=>{navigation.navigate("ProfileUser",{userID: userId})}}>
                    <Icon name="user" size={24} color="#888" />
                    <Text>Profile</Text>
                </TouchableOpacity>
       </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bannerContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  banner: {
    width: "90%",
    height: 180,
    borderRadius: 10,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f8f8",
    paddingVertical: 10,
  },
  tab: {
    fontSize: 16,
    color: "#888",
  },
  activeTab: {
    fontWeight: "bold",
    color: "#00bdd5",
  },
  courseList: {
    paddingHorizontal: 20,
  },
  courseItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  courseDetails: {
    marginLeft: 15,
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  courseTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  courseProgress: {
    fontSize: 14,
    color: "#00bdd5",
  },
  
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  footerItem: {
    alignItems: "center",
  },
});
