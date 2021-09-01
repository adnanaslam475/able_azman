import {
    CONFIRM_BOOKING,
    CONFIRM_BOOKING_SUCCESS,
    CONFIRM_BOOKING_FAILED,
    CLEAR_BOOKING
} from "../store/types";

export const clearBooking = () => (dispatch) => (firebase) => {
    dispatch({
        type: CLEAR_BOOKING,
        payload: null,
    });
}

export const addBooking = (bookingData) => (dispatch) => (firebase) => {
    const {
        bookingRef
    } = firebase;

    dispatch({
        type: CONFIRM_BOOKING,
        payload: bookingData,
    });
    let pickUp = {
        lat: bookingData.pickup.coords.lat,
        lng: bookingData.pickup.coords.lng,
        add: bookingData.pickup.description
    };
    let drop = {
        lat: bookingData.drop.coords.lat, lng: bookingData.drop.coords.lng,
        add: bookingData.drop.description
    };
    var otp;
    if (bookingData.settings.otp_secure)
        otp = Math.floor(Math.random() * 90000) + 10000;
    else {
        otp = false;
    }
    let today = new Date().toString();

    const newdatafilt = bookingData.infinite_drops.filter(v => {
        if (v?.lat) {
            return { lat: v.lat, lng: v.lng, add: v.add }
        }
    })
    let str = '';
    if (newdatafilt.length > 1) {
        newdatafilt.forEach((v, i) => str += `stop ${i + 1}: ${v?.add}, `);
    }
    console.log('str--->', str);
    var data = {
        carType: bookingData.carDetails.name,
        carImage: bookingData.carDetails.image,
        customer: bookingData.userDetails.uid,
        customer_name: bookingData.userDetails.profile.firstName + ' ' + bookingData.userDetails.profile.lastName,
        customer_contact: bookingData.userDetails.profile.mobile,
        customer_token: bookingData.userDetails.profile.pushToken,
        customer_image: bookingData.userDetails.profile.profile_image ?
            bookingData.userDetails.profile.profile_image : "",
        drop: drop,
        pickup: pickUp,
        estimate: bookingData.estimate.estimateFare,
        estimateDistance: bookingData.estimate.estimateDistance,
        estimateTime: bookingData.estimate.estimateTime,
        status: "NEW",
        bookLater: bookingData.bookLater,
        tripdate: bookingData.bookLater ? bookingData.tripdate : today,
        bookingDate: today,
        otp: otp,
        booking_type_web: bookingData.booking_type_web,
        coords: bookingData.estimate.waypoints,
        infinite_drops: str,
    }

    bookingRef.push(data).then((res) => {
        var bookingKey = res.key;
        dispatch({
            type: CONFIRM_BOOKING_SUCCESS,
            payload: {
                booking_id: bookingKey,
                mainData: data,
            }
        });
    }).catch(error => {
        dispatch({
            type: CONFIRM_BOOKING_FAILED,
            payload: error.code + ": " + error.message,
        });
    });
};

