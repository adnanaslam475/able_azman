import React, {
    useEffect, useState,
    useRef, useContext
} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    Text,
    Platform,
    Alert,
    Modal,
    ScrollView
} from 'react-native';
import { styles } from './MapScreeStyle'
import { TouchableOpacity, BaseButton, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { MapComponent } from '../components';
import { Icon, Button, Avatar, Header, Tooltip } from 'react-native-elements';
import { colors } from '../common/theme';
import * as Location from 'expo-location';
var { height, width } = Dimensions.get('window');
import { language } from 'config';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSelector, useDispatch } from 'react-redux';
import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { NavigationEvents } from 'react-navigation';
import { store, FirebaseContext } from 'common/src';

export default function MapScreen(props) {
    const { api } = useContext(FirebaseContext);
    // const fire_ref=app.database().ref('infini')

    const {
        fetchAddressfromCoords,
        fetchDrivers,
        updateTripPickup,
        updateTripDrop,
        updatSelPointType,
        getDriveTime,
        GetDistance,
        MinutesPassed,
        updateTripCar,
        getEstimate,
        clearEstimate
    } = api;
    const dispatch = useDispatch();

    const cars = useSelector(state => state.cartypes.cars);
    const tripdata = useSelector(state => state.tripdata);
    const drivers = useSelector(state => state.usersdata.users);
    const estimatedata = useSelector(state => state.estimatedata);
    const activeBookings = useSelector(state => state.bookinglistdata.active);
    const gps = useSelector(state => state.gpsdata);

    const latitudeDelta = 0.0922;
    const longitudeDelta = 0.0421;

    const [allCarTypes, setAllCarTypes] = useState([]);
    const [freeCars, setFreeCars] = useState([]);
    const [pickerConfig, setPickerConfig] = useState({
        selectedDateTime: new Date(),
        dateModalOpen: false,
        dateMode: 'date'
    });
    const [loadingModal, setLoadingModal] = useState(false);
    const [mapMoved, setMapMoved] = useState(false);
    const [region, setRegion] = useState(null);
    const [regions, setRegions] = useState([]);
    const pageActive = useRef(false);


    useEffect(() => {
        if (cars) {
            let carWiseArr = [];
            for (let i = 0; i < cars.length; i++) {
                let temp = { ...cars[i] };
                temp['minTime'] = '';
                temp['available'] = false;
                temp['active'] = false;
                carWiseArr.push(temp);
            }
            setAllCarTypes(carWiseArr);
        }
    }, [cars]);

    useEffect(() => {
        if (tripdata.pickup && drivers) {
            getDrivers();
        }
    }, [drivers, tripdata.pickup]);

    useEffect(() => {
        if (estimatedata.estimate) {
            props.navigation.navigate('FareDetails');
        }
        if (estimatedata.error && estimatedata.error.flag) {
            Alert.alert(estimatedata.error.msg);
            dispatch(clearEstimate());
        }
    }, [estimatedata.estimate, estimatedata.error, estimatedata.error.flag]);

    useEffect(() => {
        if (tripdata.selected && tripdata.selected == 'pickup' && tripdata.pickup &&
            !mapMoved && tripdata.pickup.source == 'search') {
            setRegion({
                latitude: tripdata.pickup.lat,
                longitude: tripdata.pickup.lng,
                latitudeDelta: latitudeDelta,
                longitudeDelta: longitudeDelta
            });
        }
        if (tripdata.selected && tripdata.selected == 'drop' && tripdata?.drop &&
            !mapMoved && tripdata?.drop.source == 'search') {
            setRegion({
                latitude: tripdata?.drop.lat,
                longitude: tripdata?.drop.lng,
                latitudeDelta: latitudeDelta,
                longitudeDelta: longitudeDelta
            });
        }
    }, [tripdata.selected, tripdata.pickup, tripdata?.drop]);



    useEffect(() => {
        setLoadingModal(true);
        setInterval(() => {
            if (pageActive.current) {
                dispatch(fetchDrivers());
            }
        }, 30000);
    }, [])

    useEffect(() => {
        if (gps.location) {
            setRegion({
                latitude: gps.location.lat,
                longitude: gps.location.lng,
                latitudeDelta: latitudeDelta,
                longitudeDelta: longitudeDelta
            });
            updateMap({
                latitude: gps.location.lat,
                longitude: gps.location.lng
            }, tripdata.pickup ? 'geolocation' : 'init');
        }
    }, [gps.location]);

    const locateUser = async () => {
        if (tripdata.selected == 'pickup') {
            setLoadingModal(true);
            let location = await Location.getCurrentPositionAsync({});
            if (location) {
                store.dispatch({
                    type: 'UPDATE_GPS_LOCATION',
                    payload: {
                        lat: location.coords.latitude,
                        lng: location.coords.longitude
                    }
                });
            } else {
                setLoadingModal(false);
            }
        }
    }

    const updateMap = async (pos, source) => {
        let latlng = pos.latitude + ',' + pos.longitude;
        fetchAddressfromCoords(latlng).then((res) => {
            if (res) {
                if (tripdata.selected == 'pickup') {
                    dispatch(updateTripPickup({
                        lat: pos.latitude,
                        lng: pos.longitude,
                        add: res,
                        source: source
                    }));
                    if (source == 'init') {
                        dispatch(updateTripDrop({
                            lat: pos.latitude,
                            lng: pos.longitude,
                            add: null,
                            source: source
                        }));
                    }
                } else {
                    dispatch(updateTripDrop({
                        lat: pos.latitude,
                        lng: pos.longitude,
                        add: res,
                        source: source
                    }));
                }
            }
            setLoadingModal(false);
        });
    }

    const onRegionChangeComplete = (newregion) => {
        setRegion(newregion);
        if (mapMoved) {
            setMapMoved(false);
            updateMap({
                latitude: newregion.latitude,
                longitude: newregion.longitude
            }, 'region-change');
        }
    }

    const onPanDrag = (coordinate, position) => {
        if (!mapMoved) {
            setMapMoved(true);
        }
    }

    const selectCarType = (value, key) => {
        let carTypes = allCarTypes;
        for (let i = 0; i < carTypes.length; i++) {
            carTypes[i].active = false;
            if (carTypes[i].name == value.name) {
                carTypes[i].active = true;
            } else {
                carTypes[i].active = false;
            }
        }
        setAllCarTypes(carTypes);
        dispatch(updateTripCar(value));
    }

    const getDrivers = async () => {
        if (tripdata.pickup) {
            let availableDrivers = [];
            let arr = {};
            let startLoc = '"' + tripdata.pickup.lat + ', ' + tripdata.pickup.lng + '"';
            for (let i = 0; i < drivers.length; i++) {
                let driver = { ...drivers[i] };
                if ((driver.usertype) && (driver.usertype == 'driver') && (driver.approved == true) && (driver.queue == false) && (driver.driverActiveStatus == true)) {
                    if (driver.location) {
                        let distance = GetDistance(tripdata.pickup.lat, tripdata.pickup.lng, driver.location.lat, driver.location.lng);
                        if (distance < 10) {
                            let destLoc = '"' + driver.location.lat + ', ' + driver.location.lng + '"';
                            driver.arriveDistance = distance;
                            driver.arriveTime = await getDriveTime(startLoc, destLoc);
                            let carType = driver.carType;
                            if (arr[carType] && arr[carType].drivers) {
                                arr[carType].drivers.push(driver);
                                if (arr[carType].minDistance > distance) {
                                    arr[carType].minDistance = distance;
                                    arr[carType].minTime = driver.arriveTime.timein_text;
                                }
                            } else {
                                arr[carType] = {};
                                arr[carType].drivers = [];
                                arr[carType].drivers.push(driver);
                                arr[carType].minDistance = distance;
                                arr[carType].minTime = driver.arriveTime.timein_text;
                            }
                            availableDrivers.push(driver);
                        }
                    }
                }
            }
            let carWiseArr = [];

            for (let i = 0; i < cars.length; i++) {
                let temp = { ...cars[i] };
                if (arr[cars[i].name]) {
                    temp['nearbyData'] = arr[cars[i].name].drivers;
                    temp['minTime'] = arr[cars[i].name].minTime;
                    temp['available'] = true;
                } else {
                    temp['minTime'] = '';
                    temp['available'] = false;
                }
                temp['active'] = (tripdata.carType && (tripdata.carType.name == cars[i].name)) ? true : false;
                carWiseArr.push(temp);
            }

            setFreeCars(availableDrivers);
            setAllCarTypes(carWiseArr);

            availableDrivers.length == 0 ? showNoDriverAlert() : null;
        }
    }

    const showNoDriverAlert = () => {
        if (tripdata.pickup && (tripdata.pickup.source == 'search' || tripdata.pickup.source == 'region-change') && tripdata.selected == 'pickup') {
            Alert.alert(
                language.no_driver_found_alert_title,
                language.no_driver_found_alert_messege,
                [
                    {
                        text: language.no_driver_found_alert_OK_button,
                        onPress: () => setLoadingModal(false),
                    },
                    {
                        text: language.no_driver_found_alert_TRY_AGAIN_button,
                        onPress: () => {
                            setLoadingModal(true);
                            updateMap({
                                latitude: tripdata.pickup.lat,
                                longitude: tripdata.pickup.lng
                            }, 'try-again');
                        },
                        style: 'cancel',
                    },
                ],
                { cancelable: true },
            )
        }

    }

    const tapAddress = (selection) => {
        if (selection === tripdata.selected) {
            if (selection == 'drop') {
                props.navigation.navigate('Search',
                    { locationType: "drop" });
            } else {
                props.navigation.navigate('Search',
                    { locationType: "pickup" });
            }
        } else {
            dispatch(updatSelPointType(selection));
            if (selection == 'drop') {
                const reg = {
                    latitude: tripdata?.drop.lat,
                    longitude: tripdata?.drop.lng,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta
                }
                setRegion(reg);
            } else {
                setRegion({
                    latitude: tripdata.pickup.lat,
                    longitude: tripdata.pickup.lng,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta
                });
            }
        }
    };

    //Go to confirm booking page
    const onPressBook = () => {
        if (tripdata.pickup && tripdata?.drop && tripdata?.drop.add) {
            // console.log('here in mapscreen---------->', tripdata.infinite_drops)
            if (!tripdata.carType) {
                Alert.alert(language.alert, language.car_type_blank_error)
            } else {
                let driver_available = false;
                for (let i = 0; i < allCarTypes.length; i++) {
                    let car = allCarTypes[i];
                    if (car.name == tripdata.carType.name && car.minTime) {
                        driver_available = true;
                        break;
                    }
                }
                if (driver_available) {
                    dispatch(getEstimate({
                        bookLater: false,
                        bookingDate: null,
                        platform: 'app',
                        pickup: {
                            coords: {
                                lat: tripdata.pickup.lat,
                                lng: tripdata.pickup.lng
                            }, description: tripdata.pickup.add
                        },
                        drop: {
                            coords: { lat: tripdata?.drop.lat, lng: tripdata?.drop.lng },
                            description: tripdata?.drop.add
                        },
                        carDetails: tripdata.carType,
                        drops: tripdata?.infinite_drops,
                    }));
                } else {
                    Alert.alert(language.alert, language.no_driver_found_alert_messege);
                }
            }
        } else {
            Alert.alert(language.alert, language.drop_location_blank_error);
        }
    }


    const onPressBookLater = () => {
        if (tripdata.pickup && tripdata?.drop && tripdata?.drop.add) {
            if (tripdata.carType) {
                setPickerConfig({
                    dateMode: 'date',
                    dateModalOpen: true,
                    selectedDateTime: pickerConfig.selectedDateTime
                });
            } else {
                Alert.alert(language.alert, language.car_type_blank_error)
            }
        } else {
            Alert.alert(language.alert, language.drop_location_blank_error)
        }
    }

    const hideDatePicker = () => {
        setPickerConfig({
            dateModalOpen: false,
            selectedDateTime: pickerConfig.selectedDateTime,
            dateMode: 'date'
        })
    };

    const handleDateConfirm = (date) => {
        if (pickerConfig.dateMode === 'date') {
            setPickerConfig({
                dateModalOpen: false,
                selectedDateTime: date,
                dateMode: pickerConfig.dateMode
            })
            setTimeout(() => {
                setPickerConfig({
                    dateModalOpen: true,
                    selectedDateTime: date,
                    dateMode: 'time'
                })
            }, 1000);
        } else {
            setPickerConfig({
                dateModalOpen: false,
                selectedDateTime: date,
                dateMode: 'date'
            })
            setTimeout(() => {
                const diffMins = MinutesPassed(date);
                if (diffMins < 15) {
                    Alert.alert(language.alert, language.past_booking_error,
                        [{ text: "OK", onPress: () => { } }], { cancelable: true });
                } else {
                    dispatch(getEstimate({
                        bookLater: true,
                        bookingDate: date,
                        platform: 'app',
                        pickup: {
                            coords: {
                                lat: tripdata.pickup.lat,
                                lng: tripdata.pickup.lng
                            }, description: tripdata.pickup.add
                        },
                        drop: {
                            coords: {
                                lat: tripdata?.drop.lat,
                                lng: tripdata?.drop.lng
                            }, description: tripdata?.drop.add
                        },
                        carDetails: tripdata.carType,
                        drops: tripdata?.infinite_drops,
                    }));
                }
            }, 1000);
        }
    };


    const LoadingModalBody = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={loadingModal}
                onRequestClose={() => {
                    setLoadingModal(false);
                }}>
                <View style={styles.modal}>
                    <View style={styles.modal_a}>
                        <View style={styles.modal_b}>
                            <Image
                                style={styles.modal_d}
                                source={require('../../assets/images/loader.gif')}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={{
                                    color: colors.BLACK,
                                    fontSize: 16,
                                }}>{language.driver_finding_alert}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }


    return (
        <View style={styles.mainViewStyle}>
            <NavigationEvents
                onWillFocus={payload => {
                }}
                onDidFocus={payload => {
                    pageActive.current = true;
                }}
                onWillBlur={payload => {
                    pageActive.current = false;
                }}
                onDidBlur={payload => {
                }}
            />
            <Header
                leftComponent={{
                    icon: 'md-menu', type: 'ionicon',
                    color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,
                    onPress: () => { props.navigation.toggleDrawer(); }
                }}
                centerComponent={<Text style={styles.headerTitleStyle}>
                    {language.map_screen_title}</Text>}
                containerStyle={styles.headerStyle}
                innerContainerStyles={styles.headerInnerStyle}
            />
            <View style={{
                ...styles.myViewStyle,
            }}>
                <View style={styles.coverViewStyle}>
                    <View style={styles.viewStyle1} />
                    <View style={styles.viewStyle2} />
                    <View style={styles.viewStyle3} />
                </View>
                <View style={styles.iconsViewStyle}>
                    <TouchableOpacity onPress={() => tapAddress('pickup')} style={styles.contentStyle}>
                        <View style={styles.textIconStyle}>
                            <Text numberOfLines={1} style={[styles.textStyle,
                            tripdata.selected == 'pickup' ? { fontSize: 20 } :
                                { fontSize: 14 }]}>{tripdata.pickup && tripdata.pickup.add ?
                                    tripdata.pickup.add : language.map_screen_where_input_text}</Text>
                            <Icon
                                name='gps-fixed'
                                color={colors.WHITE}
                                size={tripdata.selected == 'pickup' ? 24 : 14}
                                containerStyle={{ flex: 1 }}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => tapAddress('drop')}
                        style={{ ...styles.searchClickStyle, }}>
                        <View style={styles.textIconStyle}>
                            <Text numberOfLines={1} style={[styles.textStyle,
                            tripdata.selected == 'drop' ? { fontSize: 20 } :
                                { fontSize: 14 }]}>{tripdata?.drop &&
                                    tripdata?.drop.add ?
                                    tripdata?.infinite_drops[tripdata.infinite_drops?.length - 1]?.add :
                                    language.map_screen_drop_input_text}</Text>
                            <Icon
                                name='search'
                                type='feather'
                                color={colors.WHITE}
                                size={tripdata.selected == 'drop' ? 24 : 14}
                                containerStyle={{ flex: 1 }}
                            />
                        </View>
                    </TouchableOpacity>

                    {/* adnan adds */}
                    <View style={{
                        zIndex: 20, display: 'flex',
                        flexDirection: 'row', color: 'white'
                    }}>
                        <TouchableOpacity style={{
                        }} onPress={() => props.navigation.navigate('InfiniteDrops')} >
                            <Text style={{ color: 'white' }}> see all drops</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.mapcontainer}>
                {region && tripdata && tripdata.pickup ?
                    <MapComponent
                        markerRef={marker => { marker = marker; }}
                        mapStyle={styles.map}
                        mapRegion={region}
                        mapRegions={regions}
                        nearby={freeCars}
                        onRegionChangeComplete={onRegionChangeComplete}
                        onPanDrag={onPanDrag}
                    />
                    : null}
                {tripdata.selected == 'pickup' ?
                    <View pointerEvents="none" style={styles.img}>
                        <Image pointerEvents="none" style={styles.img_v}
                            source={require('../../assets/images/green_pin.png')} />
                    </View>
                    :
                    <View pointerEvents="none" style={styles.img}>
                        <Image pointerEvents="none" style={styles.img_v}
                            source={require('../../assets/images/rsz_2red_pin.png')} />
                    </View>}
                <View
                    style={styles.img_2}
                >
                    <TouchableOpacity onPress={locateUser}
                        style={styles.img_vv}
                    >
                        <Icon
                            name='gps-fixed'
                            color={"#666699"}
                            size={26}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {
                activeBookings && activeBookings.length >= 1 ?
                    <View style={styles.compViewStyle}>
                        <ScrollView horizontal={true} pagingEnabled={true} showsHorizontalScrollIndicator={false}>
                            {activeBookings.map((booking, key) => {
                                return (
                                    <TouchableWithoutFeedback key={key} style={styles.activeBookingItem} onPress={() => { props.navigation.navigate('BookedCab', { bookingId: booking.id }) }}>
                                        <Image style={{ marginLeft: 10, width: 22, height: 22 }} source={{ uri: booking.carImage }} resizeMode={'contain'} />
                                        <Text style={styles.t}>
                                            {language.active_booking}</Text>
                                        <Text style={{ marginLeft: 10, width: width - 180, marginRight: 10, color: colors.BLACK }} numberOfLines={1} ellipsizeMode='tail'>{booking.drop.add}</Text>
                                    </TouchableWithoutFeedback>
                                );
                            })}
                        </ScrollView>
                    </View>
                    : null
            }
            <View style={styles.compViewStyle2}>
                <Text style={styles.sampleTextStyle}>{language.cab_selection_subtitle}</Text>
                <ScrollView horizontal={true} style={styles.adjustViewStyle} showsHorizontalScrollIndicator={true}>
                    {allCarTypes.map((prop, key) => {
                        return (
                            <View key={key} style={styles.cabDivStyle} >
                                <TouchableOpacity onPress={() => { selectCarType(prop, key) }} style={[styles.imageStyle, {
                                    backgroundColor: prop.active == true ? colors.YELLOW.secondary : colors.WHITE
                                }]
                                }>
                                    <Image source={prop.image ? { uri: prop.image } : require('../../assets/images/microBlackCar.png')} style={styles.imageStyle1} />
                                </TouchableOpacity>
                                <View style={styles.textViewStyle}>
                                    <Text style={styles.text1}>{prop.name.toUpperCase()}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.text2}>{prop.minTime != '' ? prop.minTime : language.not_available}</Text>
                                        {
                                            prop.extra_info && prop.extra_info != '' ?
                                                <Tooltip style={{ marginLeft: 3, marginRight: 3 }}
                                                    backgroundColor={"#fff"}
                                                    overlayColor={'rgba(50, 50, 50, 0.70)'}
                                                    height={10 + 30 * (prop.extra_info.split(',').length)}
                                                    width={180}
                                                    popover={
                                                        <View style={{ justifyContent: 'space-around', flexDirection: 'column' }}>
                                                            {
                                                                prop.extra_info.split(',').map((ln) => <Text key={ln} style={{ margin: 5 }}>{ln}</Text>)
                                                            }
                                                        </View>
                                                    }>
                                                    <Icon
                                                        name='information-circle-outline'
                                                        type='ionicon'
                                                        color='#517fa4'
                                                        size={28}
                                                    />
                                                </Tooltip>
                                                : null}
                                    </View>

                                </View>
                            </View>

                        );
                    })}
                </ScrollView>
                <View style={{ flex: 0.5, flexDirection: 'row' }}>
                    <BaseButton
                        title={language.book_now_button}
                        loading={false}
                        onPress={onPressBookLater}
                        style={styles.base}
                    >
                        <Text style={styles.va}>{language.book_later_button}</Text>
                    </BaseButton>
                    <BaseButton
                        title={language.book_now_button}
                        loading={false}
                        onPress={onPressBook}
                        style={styles.vw}
                    >
                        <Text style={styles.va}>{language.book_now_button}</Text>
                    </BaseButton>

                </View>

            </View>
            {
                LoadingModalBody()
            }
            <DateTimePickerModal
                date={pickerConfig.selectedDateTime}
                minimumDate={new Date()}
                isVisible={pickerConfig.dateModalOpen}
                mode={pickerConfig.dateMode}
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
            />
        </View >
    );

}
