import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Search({ navigation,route }) {
    const userId = route.params.userID
    const idCourse = route.params.courseID
    const topics = ["NodeJS","ReactJS","HTML CSS","Responsive"];
    const categories = [
        { name: "Business", icon: "business-center" },
        { name: "Design", icon: "palette" },
        { name: "Code", icon: "code" },
        { name: "Movie", icon: "movie" },
        { name: "Language", icon: "language" }
    ];

    const [dataCourses, setDataCourses] = useState([]);
    const [loadingDataCourses, setLoadingDataCourses] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCourses, setFilteredCourses] = useState([]);

    // Hàm fetch dữ liệu từ API
    const fetchDataCourses = async () => {
        try {
            const response = await fetch('http://localhost:3000/courses');
            const json = await response.json();
            setDataCourses(json);
        } catch (error) {
            console.error("Không load được API");
        } finally {
            setLoadingDataCourses(false);
        }
    };

    useEffect(() => {
        fetchDataCourses();
    }, []);

    // Hàm xử lý tìm kiếm
    const handleSearch = (text) => {
        setSearchQuery(text);
        if (text.trim() === "") {
            setFilteredCourses([]); // Không hiển thị gì nếu không có từ khóa
        } else {
            const filtered = dataCourses.filter(course =>
                course.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredCourses(filtered);
        }
    };
    

    return (
        <ScrollView style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchBar}>
                <Icon name="search" size={20} color="#888" />
                <TextInput
                    style={[styles.searchInput, { outline: 'none' }]}
                    placeholder="Search course"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />

              
            </View>

            {loadingDataCourses ? (
                <ActivityIndicator size="large" color="#00bdd5" />
            ) : (
                <View>
                  {/* Hot Topics */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Hot Topics</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topicContainer}>
                            {topics.map((topic, index) => (
                                <TouchableOpacity 
                                    key={index} 
                                    style={styles.topicTag}
                                    onPress={() => handleSearch(topic)} // Thêm sự kiện onPress
                                >
                                    <Text style={styles.topicText}>{topic}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>


                    {/* Categories */}
                    <View style={styles.section}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.sectionTitle}>Categories</Text>
                           
                        </View>
                        <View>
                            {categories.map((category, index) => (
                                <View key={index} style={styles.categoryItem}>
                                    <MaterialIcons name={category.icon} size={24} color="#00bdd5" style={styles.categoryIcon} />
                                    <Text style={styles.categoryText}>{category.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Search Results */}
                    {searchQuery.trim() !== "" && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{filteredCourses.length} Results</Text>
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map(course => (
                                    <TouchableOpacity key={course._id} style={styles.courseItem} onPress={()=>{navigation.navigate("CourseDetail",{ courseID: idCourse, userID: userId })}}>
                                        <Image source={{ uri: course.banner }} style={styles.courseImage} />
                                        <View style={styles.courseInfo}>
                                            <Text style={styles.courseName}>{course.name}</Text>
                                            <Text style={styles.courseInstructor}>{course.author}</Text>
                                            <View style={styles.courseFooter}>
                                                <Text style={styles.coursePrice}>${course.price}</Text>
                                                <Text style={styles.courseRating}>{course.star} ★ ({course.lesson} lessons)</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={{ textAlign: 'center', marginTop: 20 }}>No courses found</Text>
                            )}
                        </View>
                    )}
                </View>

            )}


            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recommended for you</Text>
               
            </View>

            <View style={styles.recommendedContainer}>
            {
                    dataCourses.slice(2,4).map((course,index) => (
                        <TouchableOpacity style={styles.courseItem} key={index} onPress={()=>{navigation.navigate("CourseDetail",{ courseID: idCourse, userID: userId })}}>             
                           
                                <Image source={{uri:course.banner}} style={styles.courseImage} />
                                <Text style={styles.courseTitle}>{course.name}</Text>
                                <Text style={styles.coursePrice}>${course.price}</Text>
                                <Text style={styles.courseLessons}>{course.lesson} lessons</Text>
                          
                        </TouchableOpacity>
                    ))
                }
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
    container: { flex: 1, backgroundColor: '#fff' },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0',
        margin: 10,
        borderRadius: 8,
    },
    searchInput: { flex: 1, marginLeft: 8, color: '#333' },
    filterButton: { backgroundColor: '#00bdd5', padding: 5, borderRadius: 5 },
    filterText: { color: '#fff', fontWeight: 'bold' },

    section: { marginVertical: 10, paddingHorizontal: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },

    topicContainer: { flexDirection: 'row', marginBottom: 15 },
    topicTag: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    topicText: { color: '#333' },

    categoryItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
    categoryIcon: { marginRight: 10 },
    categoryText: { fontSize: 16, color: '#333' },

    courseItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    courseImage: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
    courseInfo: { flex: 1 },
    courseName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    courseInstructor: { color: '#888', marginTop: 5 },
    courseFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
    coursePrice: { color: '#00bdd5', fontWeight: 'bold' },
    courseRating: { color: '#888' },
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
    teachersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    teacherItem: {
        alignItems: 'center',
    },
    teacherImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginBottom: 5,
    },
    teacherName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    teacherSchool: {
        fontSize: 12,
        color: '#888',
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