import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";

export default function ScreenCart({ navigation, route }) {
    const idUser = route.params.userID;
    const [loadingDataCourses, setLoadingDataCourses] = useState(true);
    const [dataCourses, setDataCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchDataCourses = async () => {
        try {
            const response = await fetch(`http://localhost:3000/cart/${idUser}`);
            const json = await response.json();
            console.log("Cart data from API:", json); // Debugging
            setDataCourses(json);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        } finally {
            setLoadingDataCourses(false);
        }
    };

    // const addToCourseOfUser = async (courseId) => {
    //     setLoading(true);
    //     try {
    //       const response = await fetch('http://localhost:3000/cart/add', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //           userId: idUser,
    //           courseId: courseId,
    //         }),
    //       });
      
    //       const data = await response.json();
      
    //       if (response.ok) {
    //         Alert.alert("Success", "Course added to your cart!");
    //         return true;
    //       } else if (response.status === 409) {
    //         // Handle duplicate course error
    //         Alert.alert("Duplicate Course", data.error || "This course is already in your cart.");
    //         return false;
    //       } else {
    //         Alert.alert("Error", data.error || "Something went wrong.");
    //         return false;
    //       }
    //     } catch (error) {
    //       Alert.alert("Error", "Failed to add course to your cart.");
    //       return false;
    //     } finally {
    //       setLoading(false);
    //     }
    //   };
      
    

    const deleteFromCart = async (courseId) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/cart/remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: idUser,
                    courseId: courseId,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setDataCourses(dataCourses.filter(course => course.id !== courseId));
                Alert.alert("Success", "Course removed from cart!");
            } else {
                Alert.alert("Error", result.error || "Something went wrong.");
            }
        } catch (error) {
            console.error("Error deleting course:", error);
            Alert.alert("Error", "Failed to remove course from cart.");
        } finally {
            setLoading(false);
        }
    };

    const handleBuyButton = async (course) => {
        try {
            // Kiểm tra xem khóa học đã tồn tại trong "my_courses"
            const checkResponse = await fetch(`http://localhost:3000/mycourse/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: idUser,
                    courseId: course.id,
                }),
            });
    
            const checkResult = await checkResponse.json();
    
            if (checkResponse.ok && checkResult.exists) {
                Alert.alert("Duplicate Course", "You have already purchased this course.");
                return;
            }
    
            // Thêm vào "my_courses" nếu chưa tồn tại
            const response = await fetch(`http://localhost:3000/mycourse/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: idUser,
                    courseId: course.id,
                }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                // Xóa khỏi giỏ hàng và chuyển hướng
                await deleteFromCart(course.id);
                Alert.alert("Success", "Course purchased successfully!");
                navigation.navigate("FullCourse", { courseID: course.id, userID: idUser });
            } else {
                Alert.alert("Error", result.error || "Something went wrong.");
            }
        } catch (error) {
            console.error("Error in handleBuyButton:", error);
            Alert.alert("Error", "An error occurred while purchasing the course.");
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
                    {dataCourses.length > 0 ? (
                        dataCourses.map((course, index) => (
                            <View key={index} style={styles.courseItem}>
                                <Image source={{ uri: course.banner }} style={styles.courseImage} />
                                <View style={styles.courseDetails}>
                                    <Text style={styles.courseTitle}>{course.name}</Text>
                                    <Text style={styles.coursePrice}>${course.price}</Text>
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity
                                            style={styles.buyButton}
                                            onPress={() => handleBuyButton(course)}
                                        >
                                            <Text style={styles.buyButtonText}>Buy</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => deleteFromCart(course.id)}
                                        >
                                            <Text style={styles.deleteButtonText}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noData}>Your cart is empty.</Text>
                    )}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
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
    buttonContainer: {
        flexDirection: "row",
        marginTop: 10,
    },
    buyButton: {
        backgroundColor: "#00bdd5",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginRight: 10,
    },
    buyButtonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
    deleteButton: {
        backgroundColor: "#ff4d4d",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    deleteButtonText: {
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
    noData: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 50,
        color: "#888",
    },
});
