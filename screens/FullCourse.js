import React, { useState,useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import YoutubeIframe from 'react-native-youtube-iframe';
export default function FullCourse({ navigation,route }) {
    const idCourse = route.params.courseID

    const idUser = route.params.userID
    console.log(idUser);
    
    // State để quản lý tab đang được chọn
    const [selectedTab, setSelectedTab] = useState('lessons'); // Mặc định chọn "Lessons"
    const [comments, setComments] = useState([]); // Danh sách bình luận
    const [newComment, setNewComment] = useState(''); // Bình luận mới
    const [dataCourses, setDataCourses] = useState({});
    const [loadingDataCourses, setLoadingDataCourses] = useState(true);
    
    const [dataLesson, setDataLesson] = useState([]);
    const [loadingDataLesson, setLoadingDataLesson] = useState(true);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState('');


    const [dataUser,setDataUser] = useState({})
    const [loadingDataUser,setLoadingDataUser] = useState(true)

    const [dataMyProfile,setDataMyProfile] = useState([])
    const [loadingDataMyProfile,setLoadingDataMyProfile] = useState(true)
    const [firstLesson, setFirstLesson] = useState(null);
  

    const [rating, setRating] = useState(5); // Default rating value

    const fetchDataUser = async () =>{
        try {
         const response = await fetch(`http://localhost:3000/dataUser/${idUser}`)
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

     const fetchFirstLesson = async () => {
        try {
            const response = await fetch(`http://localhost:3000/lessons/first/${idCourse}`);
            if (!response.ok) {
                throw new Error("Failed to fetch first lesson");
            }
            const lesson = await response.json();
            setFirstLesson(lesson);
            setSelectedVideoUrl(lesson.video_url); // Gán URL video từ bài học đầu tiên
        } catch (error) {
            console.error("Error fetching first lesson:", error);
        }
    };
    
      
      useEffect(() => {
        fetchFirstLesson();
      }, []);



     const fetchDataMyProfile = async () => {
        try {
            const response = await fetch(`http://localhost:3000/myInfor/${idUser}`)
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


    
    // Fetch comments
    const fetchComments = async () => {
        try {
          const response = await fetch(`http://localhost:3000/reviews/${idCourse}`);
          const json = await response.json();
          console.log('Comments fetched:', json); // Kiểm tra dữ liệu API
          setComments(json);
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      };

  useEffect(() => {
    fetchComments();
  }, []);

  // Post new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Error', 'Please write a comment before posting.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: idUser,
          courseId: idCourse,
          rating,
          comment: newComment,
        }),
      });
  
      if (response.ok) {
        // Fetch lại toàn bộ danh sách bình luận sau khi thêm thành công
        fetchComments();
        setNewComment(''); // Clear input sau khi gửi thành công
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message || 'Failed to post comment.');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      Alert.alert('Error', 'Failed to post comment.');
    }
  };
  
    

    const fetchDataCourses = async () => {
        try {
            const response = await fetch(`http://localhost:3000/courses/${idCourse}`);
            const json = await response.json();
            setDataCourses(json);
            console.log(dataCourses);
            
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
        console.log("Dữ liệu bài học:", json); // Debug API response
        setDataLesson(Array.isArray(json) ? json : []); // Đảm bảo setDataLesson là mảng
    } catch (error) {
        console.error("Không load được API:", error);
    } finally {
        setLoadingDataLesson(false);
    }
};

    useEffect(() => {
        fetchDataLesson();
    }, []);

    console.log(dataCourses);

    // Hàm để render nội dung theo tab
    const renderContent = () => {
        switch (selectedTab) {
            case 'lessons':
                return (
                    <ScrollView style={styles.lessonList}>
                        {Array.isArray(dataLesson) && dataLesson.length > 0 ? (
    dataLesson.map((lesson, index) => (
        <TouchableOpacity
            key={index}
            style={styles.lessonItem}
            onPress={() => setSelectedVideoUrl(lesson.video_url)} // Sử dụng đúng trường `video_url`
        >
            <Text style={styles.lessonText}>
                Bài {index + 1}. {lesson.name}
            </Text>
            <Text style={styles.lessonTime}>{lesson.duration}</Text>
        </TouchableOpacity>
    ))
) : (
    <Text style={styles.noData}>No lessons available</Text>
)}

                    </ScrollView>
                );
                case 'Q&A':
                    return (
                        <ScrollView>
                            {/* Reviews list */}
                            <View style={styles.reviewList}>
  {comments.length === 0 ? (
    <Text style={styles.noComments}>No comments yet. Be the first to comment!</Text>
  ) : (
    comments.map((comment, index) => (
      <View key={index} style={styles.reviewItem}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={{ height: 40, width: 40, borderRadius: 20 }}
            source={{ uri: dataUser.avatar || 'https://default-avatar-url.com' }}
          />
          <Text style={styles.reviewerName}>{dataUser.username}</Text>
        </View>
        <Text style={styles.reviewText}>{comment.comment}</Text>
        <Text style={{ fontSize: 12, color: '#666' }}>
          {new Date(comment.created_at).toLocaleString()}
        </Text>
      </View>
    ))
  )}
</View>

                
                            {/* Comment Input */}
                            <View style={styles.commentInputContainer}>
                                <TextInput
                                    value={newComment}
                                    onChangeText={setNewComment}
                                    placeholder="Write a comment..."
                                    style={styles.commentInput}
                                />
                                <TouchableOpacity
                                    onPress={handleAddComment}
                                    style={styles.commentButton}
                                >
                                    <Text style={styles.commentButtonText}>Post</Text>
                                </TouchableOpacity>
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
                <Text style={styles.headerTitle}>{dataCourses.name}</Text>
            </View>

            {/* Banner */}
            <View>
            {selectedVideoUrl ? (
    <YoutubeIframe
        key={selectedVideoUrl}
        height={200}
        play={true}
        videoId={selectedVideoUrl} // Chỉ lấy phần video ID
    />
) : (
    <Image
        source={{ uri: `../assets/banner/${dataCourses.banner}` }}
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
        ⭐ {dataCourses.rating} ({dataCourses.lessons} lessons) {/* Thêm rating và số lượng bài học */}
    </Text>
</View>

            {/* Navigation Tabs */}
            <View style={styles.tabContainer}>
               
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
                <TouchableOpacity onPress={() => setSelectedTab('Q&A')}>
                    <Text
                        style={[
                            styles.tab,
                            selectedTab === 'Q&A' && styles.activeTab,
                        ]}
                    >
                        Q&A
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Dynamic Content */}
            <View style={styles.content}>{renderContent()}</View>

         
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
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    courseTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    courseInfo: {
        fontSize: 16,
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
        fontSize: 16,
        color: '#6e6e6e',
        fontWeight:900
    },
    
     qnaInputContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'column',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    emoji: {
        fontSize: 20,
        marginHorizontal: 6,
    },
    qnaInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    qnaTextInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight: 8,
        fontSize: 14,
    },
    qnaSubmit: {
        color: '#007bff',
        fontWeight: '600',
    },
    inputQA:{
        backgroundColor:'#ddd',
        borderRadius:6,
        width:350,
        height:30,
        display:'flex',
        justifyContent:'center',
        padding:10,
        marginTop:10
    },

    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 14,
        marginRight: 8,
    },
    commentButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    commentButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    noComments: {
        textAlign: 'center',
        color: '#6e6e6e',
        marginVertical: 16,
        fontSize: 14,
    },
    
});
