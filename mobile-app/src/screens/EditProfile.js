import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    StyleSheet,
    Alert,
    ToastAndroid
} from 'react-native';
import { Icon, Button, Header, Input } from 'react-native-elements'
import { colors } from '../common/theme';
import { language } from 'config';
import * as ImagePicker from 'expo-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import { FirebaseContext } from 'common/src';



export default function EditProfilePage(props) {
    const { api } = useContext(FirebaseContext);
    const [idcard_image, setidcard_image] = useState('')
    const [drivinglicense_img, setdrivinglicense_img] = useState('');
    const [passenger_id_passImg, set_passenger_id_passImg] = useState('');
    const {
        updateProfile
    } = api;
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        if (auth.info && auth.info.profile) {
            // console.log('info======>', auth.info.profile.usertype)
            //passenger, driver
            setProfileData({
                firstName: !auth.info.profile.firstName ||
                    auth.info.profile.firstName === ' ' ? '' : auth.info.profile.firstName,
                lastName: !auth.info.profile.lastName ||
                    auth.info.profile.lastName === ' ' ? '' : auth.info.profile.lastName,
                email: !auth.info.profile.email ||
                    auth.info.profile.email === ' ' ? '' : auth.info.profile.email,
                mobile: !auth.info.profile.mobile ||
                    auth.info.profile.mobile === ' ' ? '' : auth.info.profile.mobile,
                loginType: auth.info.profile.loginType ? 'social' : 'email',
                usertype: auth.info.profile.usertype,
                uid: auth.info.uid
            });
        }
    }, [auth.info, auth.email]);

    // email validation
    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const emailValid = re.test(email)
        return emailValid;
    }

    //register button click after all validation
    const saveProfile = async () => {
        if (
            profileData.firstName &&
            profileData.firstName.length > 0 &&
            profileData.firstName &&
            profileData.firstName.length > 0 &&
            profileData.mobile && profileData.mobile.length &&
            validateEmail(profileData.email)
        ) {
            let userData = {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                mobile: profileData.mobile,
                email: profileData.email,
                drivingLicenseImage: drivinglicense_img,
                IdCardImage: idcard_image,
            }
            dispatch(updateProfile(auth.info, userData));
            Alert.alert(language.alert, language.profile_updated);
            props.navigation.pop();
        }
        else {
            Alert.alert(language.alert, language.no_details_error);
        }
    }


    const imageHandler = async name => {
        // const options = {
        //     mediaType: 'image',
        //     storageOptions: {
        //         skipBackup: true,
        //         path: 'images',
        //     },
        // };
        let result = await ImagePicker.launchImageLibraryAsync({
            // mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 1.0,
        });
        if (!result.cancelled) {
            console.log('this-is-->', result.uri);
            let base64Img = `data:image/jpg;base64,${result.base64}`;



            const source = {
                uri: result.uri,
                type: result.type,
                name: Math.random().toFixed(19).split('.')[1]
            }
            const data = new FormData()
            data.append('file', source)
            data.append("upload_preset", "olxApp")
            data.append("api_key", "556571676319423");
            data.append("cloud_name", "mernapp")
            console.log(JSON.stringify(data))
            fetch('https://api.cloudinary.com/v1_1/mernapp/image/upload', {
                body: data,
                mode: 'no-cors',
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',

                }
            }).then(async function (res) {
                console.log('--->', res.json())
                await res.json();
            }).then(function (data) {
                console.log('uploaded-->', data);

                // switch (name) {
                //     case 'idcard':
                //         setidcard_image(data.url)
                //         break;
                //     case 'license':
                //         setdrivinglicense_img(data.url);
                //         break;
                //     case 'id_pass':
                //         set_passenger_id_passImg(data.url)
                //         break;
                //     default:
                //         break;
                // }
                ToastAndroid.show('uploaded successfully',
                    ToastAndroid.SHORT, ToastAndroid.CENTER)
            }).catch(err => {
                console.log('err129', err)
                Alert.alert('Error!!!', "image Cannot be uploaded", { text: "OK" })
            })
        }
    }


    // console.log('idcrd_drvr->', idcard_image, 'lices-->',
    //     drivinglicense_img, 'pasenger-->', passenger_id_passImg)
    return (
        <View style={styles.main}>
            <Header
                backgroundColor={colors.TRANSPARENT}
                leftComponent={{ icon: 'md-close', type: 'ionicon', color: colors.BLACK, size: 35, component: TouchableWithoutFeedback, onPress: () => { props.navigation.goBack() } }}
                containerStyle={styles.headerContainerStyle}
                innerContainerStyles={styles.headerInnerContainer}
            />
            <ScrollView style={styles.scrollViewStyle}>
                <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? "padding" : "padding"} style={styles.form}>
                    <View style={styles.containerStyle}>
                        <Text style={styles.headerStyle}>{language.update_profile_title}</Text>
                        <View style={styles.textInputContainerStyle}>
                            <Icon
                                name='user'
                                type='font-awesome'
                                color={colors.GREY.secondary}
                                size={30}
                                containerStyle={styles.iconContainer}
                            />
                            <Input
                                editable={true}
                                underlineColorAndroid={colors.TRANSPARENT}
                                placeholder={language.first_name_placeholder}
                                placeholderTextColor={colors.GREY.secondary}
                                value={profileData && profileData.firstName ? profileData.firstName : ''}
                                keyboardType={'email-address'}
                                inputStyle={styles.inputTextStyle}
                                onChangeText={(text) => { setProfileData({ ...profileData, firstName: text }) }}
                                secureTextEntry={false}
                                errorStyle={styles.errorMessageStyle}
                                inputContainerStyle={styles.inputContainerStyle}
                                containerStyle={styles.textInputStyle}
                            />
                        </View>

                        <View style={styles.textInputContainerStyle}>
                            <Icon
                                name='user'
                                type='font-awesome'
                                color={colors.GREY.secondary}
                                size={30}
                                containerStyle={styles.iconContainer}
                            />
                            <Input
                                editable={true}
                                underlineColorAndroid={colors.TRANSPARENT}
                                placeholder={language.last_name_placeholder}
                                placeholderTextColor={colors.GREY.secondary}
                                value={profileData && profileData.lastName ? profileData.lastName : ''}
                                keyboardType={'email-address'}
                                inputStyle={styles.inputTextStyle}
                                onChangeText={(text) => { setProfileData({ ...profileData, lastName: text }) }}
                                secureTextEntry={false}
                                errorStyle={styles.errorMessageStyle}
                                inputContainerStyle={styles.inputContainerStyle}
                                containerStyle={styles.textInputStyle}
                            />
                        </View>
                        <View style={styles.textInputContainerStyle}>
                            <Icon
                                name='envelope'
                                type='font-awesome'
                                color={colors.GREY.secondary}
                                size={25}
                                containerStyle={styles.iconContainer}
                            />
                            <Input
                                editable={profileData && profileData.loginType == 'social' ? true : false}
                                underlineColorAndroid={colors.TRANSPARENT}
                                placeholder={language.email_placeholder}
                                placeholderTextColor={colors.GREY.secondary}
                                value={profileData && profileData.email ? profileData.email : ''}
                                keyboardType={'email-address'}
                                inputStyle={styles.inputTextStyle}
                                onChangeText={(text) => { setProfileData({ ...profileData, email: text }) }}
                                secureTextEntry={false}
                                blurOnSubmit={true}
                                errorStyle={styles.errorMessageStyle}
                                inputContainerStyle={styles.inputContainerStyle}
                                containerStyle={styles.textInputStyle}
                            />
                        </View>
                        <View style={styles.textInputContainerStyle}>
                            <Icon
                                name='mobile-phone'
                                type='font-awesome'
                                color={colors.GREY.secondary}
                                size={40}
                                containerStyle={styles.iconContainer}
                            />
                            <Input
                                editable={profileData && profileData.loginType == 'social' ? true : false}
                                underlineColorAndroid={colors.TRANSPARENT}
                                placeholder={language.mobile_no_placeholder}
                                placeholderTextColor={colors.GREY.secondary}
                                value={profileData && profileData.mobile ? profileData.mobile : ''}
                                keyboardType={'number-pad'}
                                inputStyle={styles.inputTextStyle}
                                onChangeText={(text) => { setProfileData({ ...profileData, mobile: text }) }}
                                secureTextEntry={false}
                                errorStyle={styles.errorMessageStyle}
                                inputContainerStyle={styles.inputContainerStyle}
                                containerStyle={styles.textInputStyle}
                            />

                        </View>
                        {auth.info.profile.usertype == 'driver' ? <View style={{ flexDirection: 'row' }}>
                            <Button titleStyle={styles.buttonTitle}
                                onPress={() => imageHandler('idcard')}
                                title='Upload Id card'
                                buttonStyle={{ ...styles.registerButton, width: width * 0.3 }} />
                            <Button titleStyle={styles.buttonTitle}
                                onPress={() => imageHandler('license')}
                                title='Upload Driving license /psv'
                                buttonStyle={{ ...styles.registerButton, width: width * 0.3 }} /></View> :
                            <Button titleStyle={styles.buttonTitle}
                                onPress={() => imageHandler('ip_pass')}
                                title='Upload Id/Passport'
                                buttonStyle={{ ...styles.registerButton, width: width * 0.5 }} />}
                        <View style={styles.buttonContainer}>

                            <Button
                                onPress={saveProfile}
                                title={language.update_button}
                                titleStyle={styles.buttonTitle}
                                buttonStyle={styles.registerButton}
                            />
                        </View>
                        <View style={styles.gapView} />
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
}
const { width, height } = Dimensions.get('window')



const styles = StyleSheet.create({
    main: {
        flex: 1
    },
    headerContainerStyle: {
        backgroundColor: colors.TRANSPARENT,
        borderBottomWidth: 0
    },
    headerInnerContainer: {
        marginLeft: 10,
        marginRight: 10
    },
    inputContainerStyle: {
        borderBottomWidth: 1,
        borderBottomColor: colors.BLACK
    },
    textInputStyle: {
        marginLeft: 10,
    },
    iconContainer: {
        paddingTop: 8
    },
    gapView: {
        height: 40,
        width: '100%'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 40
    },
    registerButton: {
        backgroundColor: colors.YELLOW.primary,
        width: 180,
        height: 45,
        borderColor: colors.TRANSPARENT,
        borderWidth: 0,
        marginTop: 30,
        borderRadius: 8,
        elevation: 0
    },
    buttonTitle: {
        fontSize: 16
    },
    inputTextStyle: {
        color: colors.BLACK,
        fontSize: 13,
        marginLeft: 0,
        height: 32
    },
    errorMessageStyle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 0
    },
    containerStyle: {
        flexDirection: 'column',
        marginTop: 20
    },
    form: {
        flex: 1,
    },
    logo: {
        width: '90%',
        justifyContent: "flex-start",
        marginTop: 10,
        alignItems: 'center',
    },
    scrollViewStyle: {
        height: height
    },
    textInputContainerStyle: {
        flexDirection: 'row',
        alignItems: "center",
        marginLeft: 20,
        marginRight: 20,
        padding: 15,
    },
    headerStyle: {
        fontSize: 18,
        color: colors.BLACK,
        textAlign: 'center',
        flexDirection: 'row',
        marginTop: 0
    },
});