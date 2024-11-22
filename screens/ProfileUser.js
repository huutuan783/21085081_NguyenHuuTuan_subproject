import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Modal, Button } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect } from "react";

export default function ProfileUser({ navigation, route }) {
    const userId = route.params.userID;

    const [dataCourses, setDataCourses] = useState([]);
    const [loadingDataCourses, setLoadingDataCourses] = useState(true);

    const [dataUser, setDataUser] = useState({});
    const [loadingDataUser, setLoadingDataUser] = useState(true);

    const [dataMyProfile, setDataMyProfile] = useState([]);
    const [loadingDataMyProfile, setLoadingDataMyProfile] = useState(true);

    const [isModalVisible, setIsModalVisible] = useState(false);  // State for modal visibility

    const fetchDataCourses = async () => {
        try {
            const response = await fetch(`http://localhost:3000/mycourse/${userId}`);
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

    const fetchDataUser = async () => {
        try {
            const response = await fetch(`http://localhost:3000/dataUser/${userId}`);
            const json = await response.json();
            setDataUser(json);
        } catch (error) {
            console.error("Khong load duoc API");
        } finally {
            setLoadingDataUser(false);
        }
    };

    useEffect(() => {
        fetchDataUser();
    }, []);

    const fetchDataMyProfile = async () => {
        try {
            const response = await fetch(`http://localhost:3000/myInfor/${userId}`);
            const json = await response.json();
            setDataMyProfile(json);
        } catch (error) {
            console.error("Không load được API");
        } finally {
            setLoadingDataMyProfile(false);
        }
    };

    useEffect(() => {
        fetchDataMyProfile();
    }, []);

    // Toggle modal visibility
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const handleEditProfile = () => {
        // Navigate to edit profile screen
        navigation.navigate("EditProfile", { userID: userId });
        toggleModal();
    };

    const handleLogout = () => {
        navigation.navigate("ScreenHome");
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* User Profile Section */}
                <View style={styles.profileContainer}>
                    {
                        dataMyProfile.map((profile) => (
                            <View style={styles.profileHeader}>
                                <Text style={styles.profileTitle}>{profile.position} profile</Text>
                                <TouchableOpacity onPress={toggleModal}>
                                    <Icon name="ellipsis-v" size={20} color="#888" style={styles.profileMoreIcon} />
                                </TouchableOpacity>
                            </View>
                        ))
                    }
                    {
                        dataMyProfile.map((profile, index) => (
                            <View style={styles.profileInfo} key={index}>
                                <Image source={require("../assets/img/bannerUser.png")} style={styles.coverImage} />
                                <Image source={{ uri: `../assets/avatar/${profile.avatar}` }} style={styles.avatar} />
                                <Text style={styles.userName}>{dataUser.username}</Text>
                                <Text style={styles.userTitle}>{profile.position}</Text>
                            </View>
                        ))
                    }
                    <View style={styles.userStats}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{dataCourses.length}</Text>
                            <Text style={styles.statLabel}>Save</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{dataCourses.length}</Text>
                            <Text style={styles.statLabel}>On Going</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>0</Text>
                            <Text style={styles.statLabel}>Completed</Text>
                        </View>
                    </View>
                </View>

                {/* Saved Courses Section */}
                <View style={styles.savedCoursesSection}>
                    <Text style={styles.sectionTitle}>All Courses</Text>
                    {loadingDataCourses ? (
                        <ActivityIndicator size="large" color="#00bdd5" />
                    ) : (
                        <ScrollView>
                            {dataCourses.slice(0, 4).map((course, index) => (
                                <View key={index} style={styles.courseItem}>
                                    <Image source={{uri: `../assets/banner/${course.banner}`}} style={styles.courseImage} />
                                    <View style={styles.courseInfo}>
                                        <Text style={styles.courseName}>{course.name}</Text>
                                        <Text style={styles.courseInstructor}>{course.author}</Text>
                                        <Text style={styles.courseLessons}>{course.lesson} lessons</Text>
                                        <Text style={styles.courseComplete}>30% Complete</Text> 
                            
                                    </View>
                                    <Icon name="bookmark" size={20} color="#00bdd5" />
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </ScrollView>

            {/* Modal for Edit Profile and Logout */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={toggleModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={handleEditProfile} style={styles.modalItem}>
                            <Text>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout} style={styles.modalItem}>
                            <Text>Logout</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleModal} style={styles.modalCloseButton}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Footer Navigation */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerItem} onPress={() => { navigation.navigate("ScreenHomeCourse", { userID: userId }) }}>
                    <Icon name="home" size={24} color="#888" />
                    <Text>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem} onPress={() => { navigation.navigate("Search", { userID: userId }) }}>
                    <Icon name="search" size={24} color="#888" />
                    <Text>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem} onPress={() => { navigation.navigate("MyCourses", { userID: userId }) }}>
                    <Icon name="book" size={24} color="#888" />
                    <Text>My Courses</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem} onPress={() => { navigation.navigate("ProfileUser", { userID: userId }) }}>
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
        backgroundColor: '#fff',
    },
    scrollContainer: {
        paddingBottom: 60, // Khoảng trống cho footer
    },
    profileContainer: {
        backgroundColor: '#f5f5f5',
        paddingBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center',
    },
    profileHeader: {
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingLeft:30

    },
    profileTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    profileMoreIcon: {
        padding: 10,
    },
    profileInfo: {
        alignItems: 'center',
        width: '100%',
    },
    coverImage: {
        width: '100%',
        height: 100,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginTop: -40,
        borderWidth: 4,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    userTitle: {
        fontSize: 14,
        color: '#888',
    },
    userStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 14,
        color: '#888',
    },
    savedCoursesSection: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    courseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    courseImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
    },
    courseInfo: {
        flex: 1,
    },
    courseName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    courseInstructor: {
        color: '#666',
        fontSize: 12,
    },
    courseLessons: {
        color: '#888',
        fontSize: 12,
    },
    courseComplete: {
        fontSize: 14,
        color: "#00bdd5",
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    },
    footerItem: {
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: 300,
    },
    modalItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    modalCloseButton: {
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
