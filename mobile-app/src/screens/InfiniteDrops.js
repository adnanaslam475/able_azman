import React from 'react'
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import { colors } from '../common/theme';
import { styles } from './MapScreeStyle'
import { useSelector, useDispatch } from 'react-redux'
import { removedrop } from '../../../common/src/actions/tripactions';

// const { width, height } = Dimensions.get('window');

function InfiniteDrops() {
    const { infinite_drops } = useSelector(state => state.tripdata);
    const dispatch = useDispatch();
//Aslan_@g.com

    //psngr
    // jumafx2@gm
    // Mn6419646

    //admin
    // fxmysia@gmail.com
    // Mn641964612
    // Mn6419646#
    // node -v 12.21.0
    return (
        <View style={{ flex: 1 }}>
            <Text style={{
                margin: 50, left: 0,
                fontWeight: 'bold'
            }}>Selected Drops</Text>
            {infinite_drops?.length > 0 && infinite_drops?.map((v, i) => {
                return (
                    <View key={i} style={styles.in_view}>
                        <Text style={styles.txt}>{v?.add}</Text>
                        <TouchableOpacity onPress={() => dispatch(removedrop(v?.add))}
                        >
                            {i > 0 && <Icon
                                name='close'
                                color={colors.BLACK}
                                size={30}
                            />}
                        </TouchableOpacity>
                    </View>
                )
            })}
        </View>
    )
};

export default InfiniteDrops;