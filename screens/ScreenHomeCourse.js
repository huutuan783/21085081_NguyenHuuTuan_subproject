import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect, useState } from "react";

export default function ScreenHomeCourse({navigation,route}) {

    const  userId  = route.params.userID;
    console.log(userId);
    
    const [activeTab, setActiveTab] = useState('home');
    const [dataUser,setDataUser] = useState({})
    const [loadingDataUser,setLoadingDataUser] = useState(true)
    
    const [dataCourses,setDataCourses] = useState([])
    const [loadingDataCourses,setLoadingDataCourses] = useState(true)
    
    
    const fetchDataCourses = async () => {
        try {
          const response = await fetch("http://localhost:3000/courses");
          const json = await response.json();
          
          setDataCourses(json);
        } catch (error) {
          console.error("Lỗi khi tải danh sách khóa học:", error);
        }
      };
 
     useEffect(()=>{
        fetchDataCourses()
     },[])
 
     useEffect(() => {
        fetchDataUser();
    }, []);
    


    const fetchDataUser = async () => {
        try {
            const response = await fetch(`http://localhost:3000/myInfor?userId=${userId}`);
            if (response.ok) {
                const userData = await response.json();
                setDataUser(userData);
            } else {
                console.error("Failed to fetch user data:", response.status);
            }
        } catch (error) {
            console.error("Error while fetching user data:", error);
        }
    };
    



    const categoryImages = {
        Business: require("../assets/img/Business_categories.png"),
        Code: require("../assets/img/Code_categories.png"),
        Movie: require("../assets/img/Movie_categories.png"),
        Design: require("../assets/img/Design_categories.png"),
        Writing: require("../assets/img/Writing_categories.png"),
        Language: require("../assets/img/Language_categories.png"),
    };

    return ( 
        <ScrollView style={styles.container}>
           <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>
                      {`Hello, ${dataUser.username || "Guest"}!`}
                    </Text>

                    <Text style={styles.subtext}>What do you want to learn today?</Text>
                    <TouchableOpacity >
                        <Text style={styles.logout}>
                            Log out
                        </Text>
                    </TouchableOpacity>        
                </View>
                <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("ScreenCart", { userID: userId })}>
                    <Icon name="shopping-cart" size={24} color="#fff" style={styles.icon} />
                </TouchableOpacity>
                    <Icon name="bell" size={24} color="#fff" style={styles.icon} />
                </View>
            </View>
            



            
            <View style={styles.bannerContainer}>
                <Image source={require("../assets/banner/banner1.png")} style={styles.banner} />
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <Text style={styles.viewMore}>View more</Text>
            </View>

             <View style={styles.categoryContainer}>
                {['Business', 'Code', 'Movie', 'Design', 'Writing', 'Language'].map((category, index) => (
                    <View style={styles.categoryItem} key={index}>
                        <Image source={categoryImages[category]} style={styles.categoryIcon} />
                        <Text style={styles.categoryText}>{category}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular courses</Text>
                <Text style={styles.viewMore}>View more</Text>
            </View>

            <View style={styles.popularCoursesContainer}>
  {dataCourses.map((course, index) => (
    <TouchableOpacity
      key={index}
      style={styles.courseItem}
      onPress={() =>
        navigation.navigate("CourseDetail", { courseID: course.id, userID: userId })
      }
    >
      <Image source={{ uri: course.banner }} style={styles.courseImage} />
      <Text style={styles.courseTitle}>{course.name}</Text>
      <Text style={styles.courseAuthor}>By Author {course.author_id}</Text>
      <Text style={styles.coursePrice}>${course.price}</Text>
      <Text style={styles.courseLessons}>{course.lessons} lessons</Text>
      <Text style={styles.courseRating}>
        <Icon name="star" size={14} color="#FFD700" /> {course.rating}
      </Text>
    </TouchableOpacity>
  ))}
</View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recommended for you</Text>
                <Text style={styles.viewMore}>View more</Text>
            </View>

            <View style={styles.recommendedContainer}>
  {dataCourses.slice(2, 4).map((course, index) => (
    <TouchableOpacity
      key={index}
      style={styles.courseItem}
      onPress={() =>
        navigation.navigate("CourseDetail", { courseID: course.id, userID: userId })
      }
    >
      <Image source={{ uri: course.banner }} style={styles.courseImage} />
      <Text style={styles.courseTitle}>{course.name}</Text>
      <Text style={styles.coursePrice}>${course.price}</Text>
      <Text style={styles.courseLessons}>{course.lessons} lessons</Text>
      <Text style={styles.courseRating}>
        <Icon name="star" size={14} color="#FFD700" /> {course.rating}
      </Text>
    </TouchableOpacity>
  ))}
</View>


            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Courses that inspire</Text>
                <Text style={styles.viewMore}>View more</Text>
            </View>

            <View style={styles.inspiredContainer}>
  {dataCourses.slice(4, 6).map((course, index) => (
    <TouchableOpacity
      key={index}
      style={styles.courseItem}
      onPress={() =>
        navigation.navigate("CourseDetail", { courseID: course.id, userID: userId })
      }
    >
      <Image source={{ uri: course.banner }} style={styles.courseImage} />
      <Text style={styles.courseTitle}>{course.name}</Text>
      <Text style={styles.coursePrice}>${course.price}</Text>
      <Text style={styles.courseLessons}>{course.lessons} lessons</Text>
      <Text style={styles.courseRating}>
        <Icon name="star" size={14} color="#FFD700" /> {course.rating}
      </Text>
    </TouchableOpacity>
  ))}
</View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top teachers</Text>
                <Text style={styles.viewMore}>View more</Text>
            </View>

            <View style={styles.teachersContainer}>
  {dataCourses
    .filter((course) => course.id === 8 || course.id === 9)
    .map((course, index) => (
      <TouchableOpacity
        key={index}
        style={styles.teacherItem}
        onPress={() =>
          navigation.navigate("TeacherProfile", { teacherID: course.author_id, userID: userId })
        }
      >
        <Image source={{ uri: course.banner }} style={styles.teacherImage} />
        <Text style={styles.teacherName}>{course.name}</Text>
        <Text style={styles.teacherSchool}>University of Excellence</Text>
        <Text style={styles.teacherRating}>
          <Icon name="star" size={14} color="#FFD700" /> {course.rating} ({course.lessons} lessons)
        </Text>
      </TouchableOpacity>
    ))}
</View>


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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 100,
        width: '100%',
        backgroundColor: '#00bdd5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    greeting: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    logout:{
        color:"white",
        textDecorationLine:"underline"
    },
    subtext: {
        color: '#fff',
        fontSize: 14,
    },
    iconContainer: {
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 15,
    },
    bannerContainer: {
        alignItems: 'center',
        paddingHorizontal:10,
        marginVertical: 15,
    },
    banner: {
        width: '100%',
        height: 180,
        borderRadius:5,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    viewMore: {
        color: '#00bdd5',
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 20,
   
    },
    categoryItem: {
        alignItems: 'center',
        width: '30%',
        marginBottom: 15,
    },
    categoryIcon: {
        width: 50,
        height: 50,
        marginBottom: 5,
    },
    categoryText: {
        fontSize: 14,
    },
    popularCoursesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    recommendedContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    inspiredContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    courseItem: {
        width: '45%',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 10,
    },
    courseImage: {
        width: '100%',
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    coursePrice: {
        color: '#00bdd5',
        fontWeight: 'bold',
        marginTop: 5,
    },
    courseLessons: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,

    },
    courseRating: {
        fontSize: 12,
        color: "#888",
        marginTop: 5,
        flexDirection: "row",
        alignItems: "center",
      },
    teachersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    teacherItem: {
        width: "45%",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
      },
      teacherImage: {
        width: "100%",
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
      },
      teacherName: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
      },
      teacherSchool: {
        fontSize: 12,
        color: "#888",
        marginTop: 5,
        textAlign: "center",
      },
      teacherRating: {
        fontSize: 12,
        color: "#FFD700",
        marginTop: 5,
        flexDirection: "row",
        alignItems: "center",
      },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    footerItem: {
        alignItems: 'center',
    },
});
