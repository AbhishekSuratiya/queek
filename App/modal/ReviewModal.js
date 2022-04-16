import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {AirbnbRating} from "react-native-ratings";
import OrderCreateModal from "./QueekModal";

const ReviewModal = ({ onSubmit, onClose, isModalVisible })=>{
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    return(
        <OrderCreateModal visible={isModalVisible} onClose={onClose}>
            <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                <Text style={{ color: 'black', fontSize: 20 }}>Ratings</Text>
                <AirbnbRating
                    count={5}
                    defaultRating={rating}
                    size={25}
                    onFinishRating={setRating}
                />
            </View>
            <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                <Text style={{ color: 'black', fontSize: 20 }}>Comments</Text>
                <TextInput
                    multiline={true}
                    value={comment}
                    onChangeText={setComment}
                    style={styles.input}
                />
            </View>
            <TouchableOpacity onPress={onSubmit}>
                <Text style={{fontSize: 20, textAlign: 'center', color: 'black'}}>Submit</Text>
            </TouchableOpacity>
        </OrderCreateModal>
    )
}

export default ReviewModal;

const styles = StyleSheet.create({
    input: {
        height: 100,
        backgroundColor: 'lightgray',
        width: 150,
        borderRadius: 10
    },
});