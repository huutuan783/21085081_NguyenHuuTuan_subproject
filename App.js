import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ScreenHome from './screens/ScreenHome';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import ScreenHomeCourse from './screens/ScreenHomeCourse';
import Search from './screens/Search';
import CourseDetail from './screens/CourseDetail';
import FullCourse from './screens/FullCourse';
import MyCourses from './screens/MyCourses';
import ProfileUser from './screens/ProfileUser';
import ProfileTeacher from './screens/ProfileTeacher';
import ScreenCart from './screens/ScreenCart';
import UserFormScreen from './screens/UserFormScreen';
import SearchOfTeacher from './screens/SearchOfTeacher';
import TeacherCourse from './screens/TeacherCourse';
import CourseDetailTeacher from './screens/CourseDetailTeacher';
import EditCourse from './screens/EditCourse';
import AddCourse from './screens/AddCourse';
const Stack = createNativeStackNavigator()
export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='ScreenHome' screenOptions={{headerShown:false}}>
        <Stack.Screen name = "ScreenHome" component={ScreenHome}/>
        <Stack.Screen name = "RegisterScreen" component={RegisterScreen}/>
        <Stack.Screen name = "LoginScreen" component={LoginScreen}/>
        <Stack.Screen name = "ScreenHomeCourse" component={ScreenHomeCourse}/>
        <Stack.Screen name = "Search" component={Search}/>
        <Stack.Screen name = "MyCourses" component={MyCourses}/> 
        <Stack.Screen name = "ProfileUser" component={ProfileUser}/> 
        <Stack.Screen name = "CourseDetail" component={CourseDetail}/> 
        <Stack.Screen name = "ScreenCart" component={ScreenCart}/> 
        <Stack.Screen name = "FullCourse" component={FullCourse}/> 
        {/* <Stack.Screen name = "UserFormScreen" component={UserFormScreen}/>  */}
        <Stack.Screen name = "ProfileTeacher" component={ProfileTeacher}/> 
        <Stack.Screen name = "SearchOfTeacher" component={SearchOfTeacher}/> 
        <Stack.Screen name = "TeacherCourse" component={TeacherCourse}/> 
        <Stack.Screen name = "CourseDetailTeacher" component={CourseDetailTeacher}/> 
        <Stack.Screen name = "EditCourse" component={EditCourse}/> 
        <Stack.Screen name = "AddCourse" component={AddCourse}/> 
        


      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});