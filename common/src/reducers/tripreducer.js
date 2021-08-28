import {
    UPDATE_TRIP_PICKUP,
    UPDATE_TRIP_DROP,
    UPDATE_TRIP_CAR,
    UPDATE_SELECTED_POINT_TYPE,
    CLEAR_TRIP_POINTS,
    REMOVE_TRIP_DROP,
} from "../store/types";

const INITIAL_STATE = {
    pickup: null,
    drop: null,
    carType: null,
    selected: 'pickup',
    infinite_drops: [],
}

export const tripreducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_TRIP_PICKUP:
            return {
                ...state,
                pickup: action.payload
            };
        case UPDATE_TRIP_DROP:
            // console.log('UPDATE_TRIP_DROPin reducer-==>', action.drop);
            const inc = [...state.infinite_drops, action.drop == null ? null : action.drop]
            return {
                ...state,
                drop: action.payload,
                infinite_drops: inc
            };
        case REMOVE_TRIP_DROP:
            console.log('this-->', action.payload)
            return {
                ...state,
                infinite_drops: [...state.infinite_drops.filter((v, i) => v?.add !== action.payload)],
            };
        case UPDATE_TRIP_CAR:
            return {
                ...state,
                carType: action.payload
            };
        case UPDATE_SELECTED_POINT_TYPE:
            return {
                ...state,
                selected: action.payload
            };
        case CLEAR_TRIP_POINTS:
            return INITIAL_STATE;
        default:
            return state;
    }
};