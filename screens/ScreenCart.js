import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";

export default function ScreenCart({ navigation,route }) {
    const idUser = route.params.userID
    const [loadingDataCourses, setLoadingDataCourses] = useState(true);
    const [dataCourses, setDataCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchDataCourses = async () => {
        try {
            const response = await fetch(`http://localhost:3000/cart/${idUser}`);
            const json = await response.json();
            setDataCourses(json);
        } catch (error) {
            console.error("Không thể load được API");
        } finally {
            setLoadingDataCourses(false);
        }
    };

    const addToCourseOfUser = async (courseId) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/mycourse/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: idUser,  // User ID (có thể lấy từ state hoặc context nếu có)
                    courseId: courseId,  // Course ID
                }),
            });
            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Course added to my course successfully!");
                return true;
            } else {
                Alert.alert("Error", data.error || "Something went wrong.");
                return false;
            }
        } catch (error) {
            Alert.alert("Error", "Failed to add course to my course.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteFromCart = async (courseId) => {
        try {
            const response = await fetch(`http://localhost:3000/cart/remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: idUser, // ID của người dùng, có thể lấy từ context hoặc state
                    courseId: courseId, // ID của khóa học cần xóa
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Cập nhật lại dữ liệu giỏ hàng sau khi xóa khóa học
                setDataCourses(dataCourses.filter(course => course._id !== courseId));
                Alert.alert("Success", "Course removed from cart!");
            } else {
                Alert.alert("Error", result.error || "Something went wrong.");
            }
        } catch (error) {
            console.error("Error deleting course", error);
            Alert.alert("Error", "Failed to remove course from cart.");
        }
    };

    const handleBuyButton = async (course) => {
        const addedToCourse = await addToCourseOfUser(course._id);

        if (addedToCourse) {
            await deleteFromCart(course._id);  // Only delete after successfully adding to the courseOfUser
            navigation.navigate("FullCourse", { courseID: course._id , userID: idUser});
        }
    };

    useEffect(() => {
        fetchDataCourses();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { navigation.goBack(); }}>
                    <Image
                        source={require('../assets/img/return.png')}
                        style={styles.iconBack}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cart</Text>
            </View>

            {loadingDataCourses ? (
                <ActivityIndicator size="large" color="#00bdd5" style={styles.loadingIndicator} />
            ) : (
                <View style={styles.courseList}>
                    {dataCourses.map((course, index) => (
                        <View key={index} style={styles.courseItem}>
                            <Image source={{uri: `../assets/banner/${course.banner}`}} style={styles.courseImage} />
                            <View style={styles.courseDetails}>
                                <Text style={styles.courseTitle}>{course.name}</Text>
                                <Text style={styles.coursePrice}>${course.price}</Text>
                                <TouchableOpacity 
                                    style={styles.buyButton}
                                    onPress={() => handleBuyButton(course)}
                                >
                                    <Text style={styles.buyButtonText}>Buy</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingTop: 20,
    },
    loadingIndicator: {
        marginTop: 100,
    },
    courseList: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    courseItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    courseImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        resizeMode: "cover",
    },
    courseDetails: {
        marginLeft: 15,
        flex: 1,
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    coursePrice: {
        fontSize: 18,
        fontWeight: "bold",
        color: "red",
        marginBottom: 5,
    },
    buyButton: {
        marginTop: 10,
        backgroundColor: "#00bdd5",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: "flex-start",
    },
    buyButtonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    iconBack: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
