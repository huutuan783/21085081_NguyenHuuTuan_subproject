import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useEffect, useState } from "react";
export default function TeacherCourse({ navigation ,route}) {
  const nameAuthor = route.params.author
  const userId = route.params.userID
  const [dataCourses,setDataCourses] = useState([])
  const [loadingDataCourses,setLoadingDataCourses] = useState(true)
  const [dataUser,setDataUser] = useState({})
  const [loadingDataUser,setLoadingDataUser] = useState(true)

  const fetchDataUser = async () =>{
    try {
     const response = await fetch(`http://localhost:3000/dataUser/${userId}`)
     const json = await response.json()
     setDataUser(json)
    } catch (error) {
         console.error("Khong load duoc API")
    }
    finally{
        setLoadingDataUser(false)
    }
 }

 useEffect(()=>{
    fetchDataUser()
  
 },[])
  console.log(nameAuthor);
  

    
    const fetchDataCourses = async () =>{
        try {
         const response = await fetch(`http://localhost:3000/courses`)
         const json = await response.json() 
         setDataCourses(json)
        } catch (error) {
             console.error("Khong load duoc API")
        }
        finally{
            setLoadingDataCourses(false)
        }
     }
 
     useEffect(()=>{
        fetchDataCourses()
     },[])
 

     const handleDeleteCourse = async (courseId) => {
      try {
        const response = await fetch(`http://localhost:3000/courses/${courseId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setDataCourses((prevCourses) =>
            prevCourses.filter((course) => course._id !== courseId)
          );
          alert("Course deleted successfully!");
        } else {
          alert("Failed to delete the course.");
        }
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    };
    


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
              <Text style={styles.headerTitle}>My Courses</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("AddCourse", { author: dataUser.username })}
              >
                <Icon name="plus" size={20} color="#fff" />
              </TouchableOpacity>
         </View>

     


      {/* Course List */}
                <ScrollView style={styles.courseList}>
                  {dataCourses.map((course, index) => {
                    if (course.author === nameAuthor)
                      return (
                        <View style={styles.courseItem} key={index}>
                          <Image source={{  uri: `../assets/banner/${course.banner}`  }} style={styles.courseImage} />
                          <View style={styles.courseDetails}>
                            <Text style={styles.courseTitle}>{course.name}</Text>
                            <Text style={styles.courseTime}>${course.price}0</Text>
                            <Text style={styles.courseProgress}>{course.author}</Text>
                          </View>
                          {/* Nút Sửa */}
                          <TouchableOpacity
                            style={styles.editButton}
                            onPress={() =>
                              navigation.navigate("EditCourse", { course })
                            }
                          >
                            <Icon name="edit" size={20} color="#00bdd5" />
                          </TouchableOpacity>
                          {/* Nút Xóa */}
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={async () => handleDeleteCourse(course._id)}
                          >
                            <Icon name="trash" size={20} color="red" />
                          </TouchableOpacity>
                        </View>
                      );
                    return null;
                  })}
          </ScrollView>



        

      {/* Footer */}
     
      <View style={styles.footer}>
                    <TouchableOpacity style={styles.footerItem}>
                        <Icon name="home" size={24} color="#888"  onPress={()=>{navigation.navigate("ProfileTeacher",{userID: userId,author: dataUser.username})}}/>
                        <Text>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerItem} onPress={()=>{navigation.navigate("SearchOfTeacher",{userID: userId,author: dataUser.username})}}>
                        <Icon name="search" size={24} color="#888" />
                        <Text>Search</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerItem}>
                        <Icon name="book" size={24} color="#888"  onPress={()=>{navigation.navigate("TeacherCourse",{userID: userId,author: dataUser.username})}}/>
                        <Text>My Courses</Text>
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
    marginBottom: 20,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  courseDetails: {
    marginLeft: 15,
    width:180
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  courseTime: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
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
  editButton: {
    marginLeft: 10,
    padding: 5,
    backgroundColor: "#eaf7ff",
    borderRadius: 5,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
    backgroundColor: "#ffecec",
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#00bdd5",
    padding: 10,
    borderRadius: 100,
    position: "absolute",
    right: 20,
    top: 20,
  },
  
});
