import {
  FETCH_ESTIMATE,
  FETCH_ESTIMATE_SUCCESS,
  FETCH_ESTIMATE_FAILED,
  CLEAR_ESTIMATE
} from "../store/types";
import lodash from 'lodash';
import Polyline from '@mapbox/polyline';
import { FareCalculator } from '../other/FareCalculator';
import { getRouteDetails } from '../other/GoogleAPIFunctions';

export const getEstimate = (bookingData) => (dispatch) => (firebase) => {
  dispatch({
    type: FETCH_ESTIMATE,
    payload: bookingData,
  });
  const newdatafilt = bookingData.drops.filter(v => {
    if (v?.lat) {
      return { lat: v.lat, lng: v.lng, add: v.add }
    }
  })
  let arr = [];
  let startLoc;
  newdatafilt.forEach((v, i) => {

    startLoc = i == 0 ? '"' + bookingData.pickup.coords.lat + ',' + bookingData.pickup.coords.lng + '"' :
      '"' + newdatafilt[i - 1].lat + ',' + newdatafilt[i - 1].lng + '"';
    let destLoc = '"' + newdatafilt[i].lat + ',' + newdatafilt[i].lng + '"';

    getRouteDetails(bookingData.platform, startLoc, destLoc)
      .then(res => {
        if (res) {
          let points = Polyline.decode(res.polylinePoints);
          let waypoints = points.map(point => {
            return {
              latitude: point[0],
              longitude: point[1]
            }
          })
          var fareCalculation = FareCalculator(res.distance, res.duration,
            bookingData.carDetails);
            arr.push(fareCalculation.grandTotal);
            // console.log('arr-->', arr);
          if (i == newdatafilt.length - 1) {
            dispatch({
              type: FETCH_ESTIMATE_SUCCESS,
              payload: {
                pickup: bookingData.pickup,
                drop: bookingData.drop,
                bookLater: bookingData.bookLater,
                bookingDate: bookingData.bookingDate,
                carDetails: bookingData.carDetails,
                estimateDistance: res.distance,
                fareCost: fareCalculation ? parseFloat(fareCalculation.totalCost).toFixed(2) : 0,
                estimateFare: fareCalculation ? lodash.sum(arr).toFixed(2) : 0,
                estimateTime: res.duration,
                convenience_fees: fareCalculation ? parseFloat(fareCalculation.convenience_fees).toFixed(2) : 0,
                waypoints: waypoints,
                arr
              },
            })
          }
        }
        else {
          dispatch({
            type: FETCH_ESTIMATE_FAILED,
            payload: "No Route Found",
          });
        }
      })
  })
}

export const clearEstimate = () => (dispatch) => (firebase) => {
  dispatch({
    type: CLEAR_ESTIMATE,
    payload: null,
  });
}
