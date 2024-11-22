import React, { useState,useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import YoutubeIframe from 'react-native-youtube-iframe';
import Toast from "react-native-toast-message";
export default function CourseDetail({ navigation,route }) {
    const idCourse = route.params.courseID
    const idUser = route.params.userID
    // State để quản lý tab đang được chọn
    const [selectedTab, setSelectedTab] = useState('overview'); // Mặc định chọn "Lessons"
    const [dataCourses, setDataCourses] = useState({});
    const [loadingDataCourses, setLoadingDataCourses] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState('');

    const [dataLesson, setDataLesson] = useState({});
    const [loadingDataLesson, setLoadingDataLesson] = useState(true);
      
      

    const fetchDataCourses = async () => {
        try {
            const response = await fetch(`http://localhost:3000/courses/${idCourse}`);
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


    const fetchDataLesson = async () => {
        try {
            const response = await fetch(`http://localhost:3000/lessons/${idCourse}`);
            const json = await response.json();
            setDataLesson(json);
        } catch (error) {
            console.error("Không load được API");
        } finally {
            setLoadingDataLesson(false);
        }
    };

    useEffect(() => {
        fetchDataLesson();
    }, []);



    const addToCart = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: idUser,  // User ID (có thể lấy từ state hoặc context nếu có)
                    courseId: idCourse,  // Course ID
                }),
            });
            const data = await response.json();
    
            if (response.ok) {
                // Hiển thị Toast khi thành công
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Course added to cart successfully! 🎉',
                    position: 'top',
                    visibilityTime: 3000,
                });
                navigation.navigate("ScreenCart", { userID: idUser });
            } else {
                // Hiển thị Toast khi lỗi
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: data.error || 'Something went wrong.',
                    position: 'top',
                    visibilityTime: 3000,
                });
            }
        } catch (error) {
            // Hiển thị Toast khi gặp lỗi ngoại lệ
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to add course to cart.',
                position: 'top',
                visibilityTime: 3000,
            });
        } finally {
            setLoading(false);
        }
    };
    


    // Hàm để render nội dung theo tab
    const renderContent = () => {
        switch (selectedTab) {
            case 'overview':
                return (
                    <ScrollView>
                        <View style={styles.overviewContainer}>
                            
                            {/* Description */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Description</Text>
                                <Text style={styles.sectionText}>
                                    Convallis in semper laoreet nibh leo. Vivamus malesuada ipsum pulvinar non rutrum risus dui, risus.
                                    Purus massa velit iaculis tincidunt tortor, risus, scelerisque risus...
                                </Text>
                                <TouchableOpacity>
                                    <Text style={styles.seeMoreText}>See more</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Benefits */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Benefits</Text>
                                <View style={styles.benefitItem}>
                                    <Icon name="clock-o" size={16} color="#000" style={styles.benefitIcon} />
                                    <Text style={styles.benefitText}>14 hours on-demand video</Text>
                                </View>
                                <View style={styles.benefitItem}>
                                    <Icon name="globe" size={16} color="#000" style={styles.benefitIcon} />
                                    <Text style={styles.benefitText}>Native teacher</Text>
                                </View>
                                <View style={styles.benefitItem}>
                                    <Icon name="file" size={16} color="#000" style={styles.benefitIcon} />
                                    <Text style={styles.benefitText}>100% free document</Text>
                                </View>
                                <View style={styles.benefitItem}>
                                    <Icon name="certificate" size={16} color="#000" style={styles.benefitIcon} />
                                    <Text style={styles.benefitText}>Certificate of completion</Text>
                                </View>
                                <View style={styles.benefitItem}>
                                    <Icon name="support" size={16} color="#000" style={styles.benefitIcon} />
                                    <Text style={styles.benefitText}>24/7 support</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                );

          case 'lessons':
                    return (
                        <ScrollView style={styles.lessonList}>
                            {
                               dataLesson.slice(0,1).map((video,index) => (
                                    <TouchableOpacity
                                            style={styles.lessonItem}
                                            onPress={() => setSelectedVideoUrl(video.linkId)} // Chỉ cần ID video
                                        >
                                            <Text style={styles.lessonText}>Bài {index+1}. {video.namelesson}</Text>
                                            <Text style={styles.lessonTime}>{video.timelesson}</Text>
                                    </TouchableOpacity>
                                ))
                            }
                        </ScrollView>
                    );

                case 'review':
                    return (
                        <ScrollView>
                            <View style={styles.reviewHeader}>
                                <Text style={styles.rating}>⭐ 4.5/5</Text>
                                <Text style={styles.reviewCount}>(1233+ reviews)</Text>
                                <TouchableOpacity>
                                    <Text style={styles.viewAll}>View all</Text>
                                </TouchableOpacity>
                            </View>
                
                            {/* Filter by rating */}
                            <ScrollView horizontal style={styles.filterContainer}>
                                {['All', '5', '4', '3', '2', '1'].map((rating, index) => (
                                    <TouchableOpacity key={index} style={styles.filterButton}>
                                        <Text style={styles.filterText}>{rating === 'All' ? 'All' : `⭐ ${rating}`}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                
                            {/* Reviews list */}
                            <View style={styles.reviewList}>
                                {/* Review Item 1 */}
                                <View style={styles.reviewItem}>
                                    <View style={styles.reviewerInfo}>
                                        <Image
                                            source={require('../assets/img/user1.png')} // Thay bằng ảnh người dùng thật
                                            style={styles.reviewerImage}
                                        />
                                        <View>
                                            <Text style={styles.reviewerName}>Jinny Oslin</Text>
                                            <Text style={styles.reviewDate}>A day ago</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.reviewStars}>⭐⭐⭐⭐⭐</Text>
                                    <Text style={styles.reviewText}>
                                        Nostrud excepteur magna id est quis in aliqua consequat. Exercitation enim eiusmod elit sint laboris.
                                    </Text>
                                </View>
                
                                {/* Review Item 2 */}
                                <View style={styles.reviewItem}>
                                    <View style={styles.reviewerInfo}>
                                        <Image
                                            source={require('../assets/img/user2.png')} // Thay bằng ảnh người dùng thật
                                            style={styles.reviewerImage}
                                        />
                                        <View>
                                            <Text style={styles.reviewerName}>Jane Barry</Text>
                                            <Text style={styles.reviewDate}>A day ago</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.reviewStars}>⭐⭐⭐⭐</Text>
                                    <Text style={styles.reviewText}>
                                        Deserunt minim incididunt cillum nostrud do voluptate excepteur excepteur minim ex minim est.
                                    </Text>
                                </View>
                
                                {/* Review Item 3 */}
                                <View style={styles.reviewItem}>
                                    <View style={styles.reviewerInfo}>
                                        <Image
                                            source={require('../assets/img/user3.png')} // Thay bằng ảnh người dùng thật
                                            style={styles.reviewerImage}
                                        />
                                        <View>
                                            <Text style={styles.reviewerName}>Claire Mignard</Text>
                                            <Text style={styles.reviewDate}>5 days ago</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.reviewStars}>⭐⭐⭐⭐⭐</Text>
                                    <Text style={styles.reviewText}>
                                        Magna id sint irure in cillum esse nisi dolor laboris ullamco. Consectetur proident...
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>
                    );
                
            default:
                return null;
        }
    };



    
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                    <Image
                        source={require('../assets/img/return.png')}
                        style={styles.iconBack}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Course details</Text>
            </View>

            {/* Banner */}
            <View>
                    {selectedVideoUrl ? (
                        <YoutubeIframe
                            key={selectedVideoUrl}
                            height={200}
                            play={true}
                            videoId={selectedVideoUrl} // Chỉ cần ID của video
                        />
                    ) : (
                        <Image
                        source={{uri: `../assets/banner/${dataCourses.banner}`}}
                            style={{ width: '100%', height: 200 }}
                        />
                    )}
                    
             </View>


            {/* Course Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.courseTitle}>
                    {dataCourses.name}
                </Text>
                <Text style={styles.courseInfo}>
                    ⭐ {dataCourses.star} • {dataCourses.lesson} lessons
                </Text>
            </View>

            {/* Navigation Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity onPress={() => setSelectedTab('overview')}>
                    <Text
                        style={[
                            styles.tab,
                            selectedTab === 'overview' && styles.activeTab,
                        ]}
                    >
                        OVERVIEW
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedTab('lessons')}>
                    <Text
                        style={[
                            styles.tab,
                            selectedTab === 'lessons' && styles.activeTab,
                        ]}
                    >
                        LESSONS
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedTab('review')}>
                    <Text
                        style={[
                            styles.tab,
                            selectedTab === 'review' && styles.activeTab,
                        ]}
                    >
                        REVIEW
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Dynamic Content */}
            <View style={styles.content}>{renderContent()}</View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.price}>${dataCourses.price}</Text>
                <TouchableOpacity
                    style={styles.addToCart}
                    onPress={addToCart}  // Gọi hàm addToCart khi nhấn
                    disabled={loading}  // Disable nút khi đang tải
                >
                    {loading ? (
                        <Text style={styles.addToCartText}>Adding...</Text>  // Hiển thị trạng thái loading
                    ) : (
                        <>
                            <Icon name="cart-plus" size={20} color="#fff" />
                            <Text style={styles.addToCartText}>Add to cart</Text>
                        </>
                    )}
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
    banner: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    
    titleContainer: {
        padding: 16,
    },
    courseTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    courseInfo: {
        color: '#6e6e6e',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f8f8f8',
        paddingVertical: 8,
    },
    tab: {
        fontSize: 16,
        color: '#6e6e6e',
    },
    activeTab: {
        color: '#000',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        marginTop: 16,
    },
    contentContainer: {
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    contentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    contentText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#6e6e6e',
    },
    lessonList: {
        marginBottom: 16,
    },
    lessonItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        marginBottom: 8,
    },
    activeLesson: {
        backgroundColor: '#e0f7fa',
    },
    lessonText: {
        fontSize: 16,
    },
    lessonTime: {
        color: '#6e6e6e',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    addToCart: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007bff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addToCartText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 16,
    },
    overviewContainer: {
        padding: 16,
    },
    
    followButton: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        backgroundColor: '#007bff',
        borderRadius: 20,
    },
    followButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    sectionText: {
        fontSize: 14,
        color: '#6e6e6e',
        lineHeight: 20,
        marginBottom: 8,
    },
    seeMoreText: {
        color: '#007bff',
        fontSize: 14,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    benefitIcon: {
        marginRight: 8,
    },
    benefitText: {
        fontSize: 14,
        color: '#6e6e6e',
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    rating: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    reviewCount: {
        color: '#6e6e6e',
    },
    viewAll: {
        color: '#007bff',
        fontSize: 14,
    },
    filterContainer: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    filterButton: {
        marginRight: 8,
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#007bff',
    },
    filterText: {
        color: '#007bff',
        fontSize: 14,
    },
    reviewList: {
        padding: 16,
    },
    reviewItem: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    reviewerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewDate: {
        fontSize: 12,
        color: '#6e6e6e',
    },
    reviewStars: {
        fontSize: 14,
        marginBottom: 8,
    },
    reviewText: {
        fontSize: 14,
        color: '#6e6e6e',
    },
    
});
