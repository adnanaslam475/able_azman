import React, { useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Image } from 'react-native';
import carImageIcon from '../../assets/images/available_car.png';
import { useSelector } from 'react-redux';


export default function MapComponent(props) {
    const [state, setState] = useState({
        marginBottom: 0
    })
    const infinite_drops = useSelector(s => s.tripdata.infinite_drops)
    // console.log('inmap_comp=----->', infinite_drops)
    const { mapRegion, mapRegions, mapStyle, nearby,
        onRegionChangeComplete, onPanDrag } = props;
    // nearby is nearby drivers
    const markers = [{
        title: 'hello',
        coordinates: {
            latitude: 33.148561,
            longitude: 11.652778
        },
    }, {
        title: 'adnan',
        coordinates: {
            latitude: 31.149771,
            longitude: 12.655449
        },
    }]

    return (
        <MapView
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            loadingEnabled
            showsMyLocationButton={false}
            style={[mapStyle, { marginBottom: state.marginBottom }]}
            region={mapRegion}
            onRegionChangeComplete={onRegionChangeComplete}
            onPanDrag={onPanDrag}
            onMapReady={() => setState({
                ...state,
                marginBottom: 1
            })}>
            {markers ? markers.map((item, index) => {
                return (
                    <Marker.Animated
                        coordinate={{
                            latitude: item.location ?
                                item.location.lat : 0.00, longitude: item.location
                                    ? item.location.lng : 0.00
                        }}
                        key={index}>
                        <Image
                            source={carImageIcon}
                            style={{ height: 40, width: 40 }}
                        />
                    </Marker.Animated>

                )
            })
                : null}
        </MapView>
    );
}