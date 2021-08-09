import { StyleSheet, Dimensions, Platform } from 'react-native'
import { colors } from '../common/theme';


const { width, height } = Dimensions.get('window')
export const styles = StyleSheet.create({
    in_view:{
        display: 'flex', flexDirection: 'row', 
        alignItems: 'center'
    },
    txt: {
        margin: 10,
        marginRight: 0,
        width: width * 0.8,
        color: 'black'
    },
    modal: {
        flex: 1, backgroundColor: "rgba(22,22,22,0.8)",
        justifyContent: 'center', alignItems: 'center'
    },
    modal_a: { width: '85%', backgroundColor: colors.GREY.Smoke_Grey, borderRadius: 10, flex: 1, maxHeight: 70 },
    modal_b: { alignItems: 'center', flexDirection: 'row', flex: 1, justifyContent: "center" },
    modal_d: { width: 80, height: 80, backgroundColor: colors.TRANSPARENT },
    vw: {
        flex: 1, justifyContent: 'center',
        alignItems: 'center', backgroundColor: colors.GREY.btnPrimary,
        width: width / 2, elevation: 0
    },
    va: { color: colors.WHITE, fontFamily: 'Roboto-Bold', fontSize: 18 },
    base: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
        backgroundColor: colors.GREY.secondary, width: width / 2, elevation: 0
    },
    t: {
        marginLeft: 10, width: 118, color: 'red',
        fontFamily: 'Roboto-Bold', fontSize: 14
    },
    img_vv: {
        height: Platform.OS == 'ios' ? 55 : 42,
        width: Platform.OS == 'ios' ? 55 : 42,
        alignItems: 'center',
        justifyContent: 'center',
    },
    img_2: {
        position: 'absolute',
        height: Platform.OS == 'ios' ? 55 : 42,
        width: Platform.OS == 'ios' ? 55 : 42,
        bottom: 11,
        right: 11,
        backgroundColor: '#fff',
        borderRadius: Platform.OS == 'ios' ? 30 : 3,
        elevation: 2,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowOffset: {
            height: 0,
            width: 0
        },
    },
    img_v: {
        marginBottom: 40, height: 40,
        resizeMode: "contain"
    },
    img: {
        position: 'absolute', top: 0, bottom: 0,
        left: 0, right: 0, alignItems: 'center',
        justifyContent: 'center', backgroundColor: 'transparent'
    },
    headerStyle: {
        backgroundColor: colors.GREY.default,
        borderBottomWidth: 0
    },
    headerInnerStyle: {
        marginLeft: 10,
        marginRight: 10
    },
    headerTitleStyle: {
        color: colors.WHITE,
        fontFamily: 'Roboto-Bold',
        fontSize: 18
    },
    mapcontainer: {
        flex: 6,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
    mainViewStyle: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    myViewStyle: {
        flex: 1.5,
        flexDirection: 'row',
        borderTopWidth: 0,
        alignItems: 'center',
        backgroundColor: colors.GREY.default,
        paddingEnd: 20,

        paddingBottom: 25,
    },
    coverViewStyle: {
        flex: 1.5,
        alignItems: 'center',

    },
    viewStyle1: {
        height: 12,
        width: 12,
        borderRadius: 15 / 2,
        backgroundColor: colors.YELLOW.light
    },
    viewStyle2: {
        height: height / 25,
        width: 1,
        backgroundColor: colors.YELLOW.light
    },
    viewStyle3: {
        height: 14,
        width: 14,
        backgroundColor: colors.GREY.iconPrimary
    },
    iconsViewStyle: {
        flex: 9.5,
        justifyContent: 'space-between'
    },
    contentStyle: {
        justifyContent: 'center',
        borderBottomColor: colors.WHITE,
        borderBottomWidth: 1
    },
    textIconStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    textStyle: {
        flex: 9,
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        fontWeight: '400',
        color: colors.WHITE,
        marginTop: 10,
        marginBottom: 10
    },
    searchClickStyle: {
        //flex: 1, 
        justifyContent: 'center'
    },
    compViewStyle: {
        flex: 0.5,
        backgroundColor: colors.YELLOW.secondary,
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    activeBookingItem: {
        flex: 1,
        flexGrow: 1,
        flexDirection: 'row',
        width: width,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    compViewStyle2: {
        flex: 2.8,
        alignItems: 'center'
    },
    pickCabStyle: {
        flex: 0.3,
        fontFamily: 'Roboto-Bold',
        fontSize: 15,
        fontWeight: '500',
        color: colors.BLACK
    },
    sampleTextStyle: {
        flex: 0.2,
        fontFamily: 'Roboto-Bold',
        fontSize: 13,
        fontWeight: '300',
        color: colors.GREY.secondary,
        marginTop: 5
    },
    adjustViewStyle: {
        flex: 9,
        flexDirection: 'row',
        //justifyContent: 'space-around',
        marginTop: 8
    },
    cabDivStyle: {
        flex: 1,
        width: width / 3,
        alignItems: 'center'
    },
    imageViewStyle: {
        flex: 2.7,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    imageStyle: {
        height: height / 14,
        width: height / 14,
        borderRadius: height / 14 / 2,
        borderWidth: 3,
        borderColor: colors.YELLOW.secondary,
        //backgroundColor: colors.WHITE, 
        justifyContent: 'center',
        alignItems: 'center'
    },
    textViewStyle: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    text1: {

        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        fontWeight: '900',
        color: colors.BLACK
    },
    text2: {
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        fontWeight: '900',
        color: colors.GREY.secondary
    },
    imagePosition: {
        height: height / 14,
        width: height / 14,
        borderRadius: height / 14 / 2,
        borderWidth: 3,
        borderColor: colors.YELLOW.secondary,
        //backgroundColor: colors.YELLOW.secondary, 
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageStyleView: {
        height: height / 14,
        width: height / 14,
        borderRadius: height / 14 / 2,
        borderWidth: 3,
        borderColor: colors.YELLOW.secondary,
        //backgroundColor: colors.WHITE, 
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageStyle1: {
        height: height / 20.5,
        width: height / 20.5
    },
    imageStyle2: {
        height: height / 20.5,
        width: height / 20.5
    },
    buttonContainer: {
        flex: 1
    },

    buttonTitleText: {
        color: colors.GREY.default,
        fontFamily: 'Roboto-Regular',
        fontSize: 20,
        alignSelf: 'flex-end'
    },

    cancelButtonStyle: {
        backgroundColor: colors.GREY.whiteish,
        elevation: 0,
        width: "60%",
        borderRadius: 5,
        alignSelf: "center"
    }

});